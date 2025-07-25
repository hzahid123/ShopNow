using ShopNowAngular.Users.Dto;

namespace ShopNowAngular.TwoFactorAuthentications.Dtos
{
    public class GetOTPVerificationWithUserDetails
    {
        public bool IsCodeVerified { get; set; }
        public string ErrorMessage { get; set; }
        public string AccessToken { get; set; }
        public string EncryptedAccessToken { get; set; }
        public string passCode { get; set; }
        public string userEmail { get; set; }
        public int ExpireInSeconds { get; set; }
        public UserDto UserDetails { get; set; }
    }
}
