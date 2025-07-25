namespace ShopNowAngular.Emails.Dtos
{
    public class CreateEmailDto
    {
        public string UserName { get; set; }
        public string EmailAddress { get; set; }
        public string Password { get; set; }
        public string MailStatusMessage { get; set; }
    }
}
