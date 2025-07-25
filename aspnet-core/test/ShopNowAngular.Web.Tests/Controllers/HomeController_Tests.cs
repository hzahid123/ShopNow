using System.Threading.Tasks;
using ShopNowAngular.Models.TokenAuth;
using ShopNowAngular.Web.Controllers;
using Shouldly;
using Xunit;

namespace ShopNowAngular.Web.Tests.Controllers
{
    public class HomeController_Tests: ShopNowAngularWebTestBase
    {
        [Fact]
        public async Task Index_Test()
        {
            await AuthenticateAsync(null, new AuthenticateModel
            {
                UserNameOrEmailAddress = "admin",
                Password = "123qwe"
            });

            //Act
            var response = await GetResponseAsStringAsync(
                GetUrl<HomeController>(nameof(HomeController.Index))
            );

            //Assert
            response.ShouldNotBeNullOrEmpty();
        }
    }
}