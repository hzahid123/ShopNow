using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Abp.Authorization;
using Abp.Authorization.Users;
using Abp.MultiTenancy;
using Abp.Runtime.Security;
using ShopNowAngular.Authentication.JwtBearer;
using ShopNowAngular.Authorization;
using ShopNowAngular.Authorization.Users;
using ShopNowAngular.Models.TokenAuth;
using ShopNowAngular.MultiTenancy;
using Abp.Web.Models;
using Microsoft.AspNetCore.Http;
using ShopNowAngular.Users;
using ShopNowAngular.TwoFactorAuthentications;
using Abp.UI;
using ShopNowAngular.TwoFactorAuthentications.Dtos;
using Microsoft.AspNetCore.Identity;
using ShopNowAngular.Identity;
using Abp.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using ShopNowAngular.Emails;
using Microsoft.CodeAnalysis.Operations;

namespace ShopNowAngular.Controllers
{
    [Route("api/[controller]/[action]")]
    public class TokenAuthController : ShopNowAngularControllerBase
    {
        private readonly LogInManager _logInManager;
        private readonly ITenantCache _tenantCache;
        private readonly AbpLoginResultTypeHelper _abpLoginResultTypeHelper;
        private readonly TokenAuthConfiguration _configuration;
        private readonly UserManager _userManager;
        private readonly IUserAppService _userAppService;
        private readonly ITwoFactorAuthenticationAppService _twoFactorAuthenticationAppService;
        private readonly SignInManager _signInManager;
        private readonly IRepository<User, long> _userRepository;
        private readonly IEmailAppService _emailAppService;
        public TokenAuthController(
            LogInManager logInManager,
            ITenantCache tenantCache,
            AbpLoginResultTypeHelper abpLoginResultTypeHelper,
            UserManager userManager,
            IUserAppService userAppService,
            SignInManager signInManager,
            IEmailAppService emailAppService,
            ITwoFactorAuthenticationAppService twoFactorAuthenticationAppService,
            IRepository<User, long> userRepository,
            TokenAuthConfiguration configuration)
        {
            _logInManager = logInManager;
            _tenantCache = tenantCache;
            _userManager = userManager;
            _abpLoginResultTypeHelper = abpLoginResultTypeHelper;
            _configuration = configuration;
            _userAppService = userAppService;
            _signInManager = signInManager;
            _userRepository = userRepository;
            _twoFactorAuthenticationAppService = twoFactorAuthenticationAppService;
            _emailAppService = emailAppService;
        }

        [HttpPost]
        public async Task<AuthenticateResultModel> Authenticate([FromBody] AuthenticateModel model)
        {
            var loginResult = await GetLoginResultAsync(
                model.UserNameOrEmailAddress,
                model.Password,
                model.tenancyName
                //GetTenancyNameOrNull()
            );

            var accessToken = CreateAccessToken(CreateJwtClaims(loginResult.Identity));

            return new AuthenticateResultModel
            {
                AccessToken = accessToken,
                EncryptedAccessToken = GetEncryptedAccessToken(accessToken),
                ExpireInSeconds = (int)_configuration.Expiration.TotalSeconds,
                UserId = loginResult.User.Id
            };
        }

        private string GetTenancyNameOrNull()
        {
            if (!AbpSession.TenantId.HasValue)
            {
                return null;
            }

            return _tenantCache.GetOrNull(AbpSession.TenantId.Value)?.TenancyName;
        }

        private async Task<AbpLoginResult<Tenant, User>> GetLoginResultAsync(string usernameOrEmailAddress, string password, string tenancyName)
        {
            var loginResult = await _logInManager.LoginAsync(usernameOrEmailAddress, password, tenancyName);

            switch (loginResult.Result)
            {
                case AbpLoginResultType.Success:
                    return loginResult;
                default:
                    throw _abpLoginResultTypeHelper.CreateExceptionForFailedLoginAttempt(loginResult.Result, usernameOrEmailAddress, tenancyName);
            }
        }

        private string CreateAccessToken(IEnumerable<Claim> claims, TimeSpan? expiration = null)
        {
            var now = DateTime.UtcNow;

            var jwtSecurityToken = new JwtSecurityToken(
                issuer: _configuration.Issuer,
                audience: _configuration.Audience,
                claims: claims,
                notBefore: now,
                expires: now.Add(expiration ?? _configuration.Expiration),
                signingCredentials: _configuration.SigningCredentials
            );

            return new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);
        }

        private static List<Claim> CreateJwtClaims(ClaimsIdentity identity)
        {
            var claims = identity.Claims.ToList();
            var nameIdClaim = claims.First(c => c.Type == ClaimTypes.NameIdentifier);

            // Specifically add the jti (random nonce), iat (issued timestamp), and sub (subject/user) claims.
            claims.AddRange(new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, nameIdClaim.Value),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.Now.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
            });

            return claims;
        }

        private string GetEncryptedAccessToken(string accessToken)
        {
            return SimpleStringCipher.Instance.Encrypt(accessToken);
        }


        #region User 2FA Authentication
        [HttpPost]
        [AbpAllowAnonymous]
        [DontWrapResult]

        public async Task<IActionResult> TwoFactorAuthentication([FromBody] AuthenticateModel model)
        {
            
            var user = await _userAppService.GetUserEntityByNameAndEmail(model.UserNameOrEmailAddress);
            
            if ((user != null) && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                var emailResponse = await _twoFactorAuthenticationAppService.SendEmailForLogInAuthentication(user);
                if (!emailResponse.Item1)
                {
                    var failedResponse = new
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = emailResponse.Item2,
                        UserId = user.Id
                    };
                    return StatusCode(StatusCodes.Status404NotFound, failedResponse);
                }

                var successResponse = new
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Authentication successful.",
                    UserId = user.Id,
                    Email = user.EmailAddress

                };
                return StatusCode(StatusCodes.Status200OK, successResponse);
            }

            else
            {
                var errorResponse = new
                {
                    StatusCode = StatusCodes.Status401Unauthorized,
                    Message = "Authentication failed. Please check your credentials."
                };

                return StatusCode(StatusCodes.Status401Unauthorized, errorResponse);
            }
        }
        [HttpPost]
        public async Task<GetOTPVerificationWithUserDetails> VerifyOtp([FromBody] VerifyOtpModel verifyOtpModel)
        {

            var response = await _twoFactorAuthenticationAppService.VerifyOtpForAuthentication(verifyOtpModel.OTP, verifyOtpModel.UsernameAndEmail);
            if (response.IsCodeVerified)
            {
                //StoreSessionData(response);

                var accessToken = CreateAccessTokenWithOtp(response.UserDetails.Name, response.UserDetails.Id, verifyOtpModel.StoreId);
                response.AccessToken = accessToken.AccessToken;
                response.EncryptedAccessToken = accessToken.EncryptedAccessToken;
                response.ExpireInSeconds = accessToken.ExpireInSeconds;

                var user = await _userManager.FindByIdAsync(response.UserDetails.Id.ToString());
                if (user != null)
                {
                    await _signInManager.SignInAsync(user, isPersistent: false);
                    await UnitOfWorkManager.Current.SaveChangesAsync();
                }
            }

            else
            {
                throw new UserFriendlyException(response.ErrorMessage);
            }
            return response;
        }
        [HttpPost]
        public AuthenticateResultModel CreateAccessTokenWithOtp(string name, long id, Guid? storeId)
        {
            var claimsIdentity = CreateJwtClaimsForOtpLogIn(name, id, storeId);
            var accessToken = CreateAccessToken(claimsIdentity);
            return new AuthenticateResultModel
            {
                AccessToken = accessToken,
                EncryptedAccessToken = GetEncryptedAccessToken(accessToken),
                ExpireInSeconds = 32400,
                UserId = id
            };
        }
        private static List<Claim> CreateJwtClaimsForOtpLogIn(string name, long Id, Guid? storeId)
        {
            List<Claim> claims = new List<Claim>();
            claims.AddRange(new[]
            {
                new Claim(JwtRegisteredClaimNames.NameId, Id.ToString()),
                new Claim(JwtRegisteredClaimNames.FamilyName, name.ToString()),
                new Claim("SecurityStamp", Guid.NewGuid().ToString()),
                new Claim("role", "admin"),
                new Claim("tenantId", "1"),
                new Claim("BusinessConfigurationId", storeId.ToString()),
                new Claim(JwtRegisteredClaimNames.Sub, Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.Now.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
            });
            return claims;
        }
        [HttpPost]
        public async Task<IActionResult> SendOtpForForgetPasswordVerification(SendOtpForForgetPasswordModel sendOtpForForgetPassword)
        {
            var user = await _userAppService.GetUserEntityByNameAndEmail(sendOtpForForgetPassword.EmailAddress);
            if (user == null)
            {
                var errorResponse = new
                {
                    StatusCode = StatusCodes.Status401Unauthorized,
                    Message = "No user found with the requested mail."
                };

                return StatusCode(StatusCodes.Status401Unauthorized, errorResponse);
            }
            var response = await _twoFactorAuthenticationAppService.SendEmailForForgetPasswordAuthentication(user);
            if (response.Item1)
            {
                var successResponse = new
                {
                    Message = "Mail Sent Successfully",
                    Email = user.EmailAddress
                };

                return StatusCode(StatusCodes.Status200OK, successResponse);
            }
            return StatusCode(StatusCodes.Status500InternalServerError, "Cannot send mail contact your admin");
        }
        [HttpPost]
        public async Task<bool> ResendOtp(ResendOtpDto resendOtpDto)
        {

            var user = await _userRepository.GetAll()
                                                    .Where(u => u.EmailAddress == resendOtpDto.EmailAddress)
                                                    .FirstOrDefaultAsync();
            string subject = "Attempt to log in your Portal";
            var otp = GeneratesOtp();
            List<string> emailAddresses = new List<string> { user.EmailAddress };
            string body = _emailAppService.CreateAuthenticationEmailHtmlContent(otp);
            var mailMessage = await _emailAppService.CreateEmailContent(emailAddresses, subject, body);
            user.EmailCodeVerification = otp;
            user.EmailCodeSendingTime = DateTime.UtcNow;
            await _userRepository.UpdateAsync(user);
            var response = await _emailAppService.SendEmailGeneric(mailMessage);
            return response.Item1;
        }

        private string GeneratesOtp()
        {
            Random rand = new Random();
            return rand.Next(100000, 999999).ToString();
        }
        #endregion
    }
}
