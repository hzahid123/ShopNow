using ShopNowAngular.Authorization.Users;
using ShopNowAngular.TwoFactorAuthentications.Dtos;
using System.Threading.Tasks;

namespace ShopNowAngular.TwoFactorAuthentications
{
    public interface ITwoFactorAuthenticationAppService
    {
        Task<(bool, string)> SendEmailForLogInAuthentication(User user);
        Task<GetOTPVerificationWithUserDetails> VerifyOtpForAuthentication(string OTP, string UsernameAndEmail);
        Task<(bool, string)> SendEmailForForgetPasswordAuthentication(User user);
    }
}
