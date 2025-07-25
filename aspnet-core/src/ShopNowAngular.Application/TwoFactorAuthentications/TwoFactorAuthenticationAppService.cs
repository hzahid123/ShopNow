using Abp.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using ShopNowAngular.Authorization.Users;
using ShopNowAngular.Emails;
using ShopNowAngular.TwoFactorAuthentications.Dtos;
using ShopNowAngular.Users.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShopNowAngular.TwoFactorAuthentications
{
    public class TwoFactorAuthenticationAppService : ShopNowAngularAppServiceBase, ITwoFactorAuthenticationAppService
    {

        private readonly IEmailAppService _emailAppService;
        private readonly IRepository<User, long> _userRepository;

        public TwoFactorAuthenticationAppService(IEmailAppService emailAppService,
                                                IRepository<User, long> userRepository)
        {
            _emailAppService = emailAppService;
            _userRepository = userRepository;
        }



        public async Task<(bool, string)> SendEmailForLogInAuthentication(User user)
        {
            List<string> emailAddresses = [user.EmailAddress];
            string subject = "Attempt to log in your Portal";
            var otp = GenerateOtp();
            string body = _emailAppService.CreateAuthenticationEmailHtmlContent(otp);
            var mailMessage = await _emailAppService.CreateEmailContent(emailAddresses, subject, body);
            user.EmailCodeVerification = otp;
            user.EmailCodeSendingTime = DateTime.UtcNow;
            await _userRepository.UpdateAsync(user);
            return await _emailAppService.SendEmailGeneric(mailMessage);
        }
        private string GenerateOtp()
        {
            Random rand = new Random();
            return rand.Next(100000, 999999).ToString();
        }
        public async Task<GetOTPVerificationWithUserDetails> VerifyOtpForAuthentication(string OTP, string UsernameAndEmail)
        {
            var user = await _userRepository.GetAll()
                                                .Where(u => u.EmailAddress == UsernameAndEmail)
                                                .FirstOrDefaultAsync();

            return await VerifyOtpofMail(user, OTP);

        }
        public async Task<GetOTPVerificationWithUserDetails> VerifyOtpofMail(User user, string OTP)
        {
            GetOTPVerificationWithUserDetails getOTPVerificationWithUserDetails = new GetOTPVerificationWithUserDetails();
            if (user.EmailCodeSendingTime.Value.AddSeconds(70) < DateTime.UtcNow)
            {
                getOTPVerificationWithUserDetails.IsCodeVerified = false;
                getOTPVerificationWithUserDetails.ErrorMessage = "OTP Time Expired";
                getOTPVerificationWithUserDetails.UserDetails = ObjectMapper.Map<UserDto>(user);
                return getOTPVerificationWithUserDetails;
            }
            if (user.EmailCodeVerification.Equals(OTP))
            {
                getOTPVerificationWithUserDetails.IsCodeVerified = true;
                getOTPVerificationWithUserDetails.UserDetails = ObjectMapper.Map<UserDto>(user);
                return getOTPVerificationWithUserDetails;
            }
            getOTPVerificationWithUserDetails.IsCodeVerified = false;
            getOTPVerificationWithUserDetails.ErrorMessage = "Incorrect Otp";
            getOTPVerificationWithUserDetails.UserDetails = ObjectMapper.Map<UserDto>(user);
            return getOTPVerificationWithUserDetails;

        }
        public async Task<(bool, string)> SendEmailForForgetPasswordAuthentication(User user)
        {
            List<string> emailAddresses = [user.EmailAddress];
            string subject = "Password Reset Request";
            var otp = GenerateOtp();
            string body = _emailAppService.CreateAuthenticationEmailHtmlContent(otp);
            var mailMessage = await _emailAppService.CreateEmailContent(emailAddresses, subject, body);
            user.EmailCodeVerification = otp;
            user.EmailCodeSendingTime = DateTime.UtcNow;
            await _userRepository.UpdateAsync(user);
            return await _emailAppService.SendEmailGeneric(mailMessage);
        }

    }
}
