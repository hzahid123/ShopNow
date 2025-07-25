using System.ComponentModel.DataAnnotations;

namespace ShopNowAngular.Users.Dto
{
    public class ChangeUserLanguageDto
    {
        [Required]
        public string LanguageName { get; set; }
    }
}