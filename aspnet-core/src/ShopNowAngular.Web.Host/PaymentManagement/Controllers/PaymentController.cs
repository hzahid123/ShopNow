using Microsoft.AspNetCore.Mvc;
using ShopNowAngular.MyFatoorahPayment;
using System.Threading.Tasks;

namespace ShopNowAngular.Web.Host.PaymentManagement.Controllers
{
    [Route("api/payment")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IMyFatoorahAppService _myFatoorahService;

        public PaymentController(IMyFatoorahAppService myFatoorahService)
        {
            _myFatoorahService = myFatoorahService;
        }

        [HttpPost("pay")]
        public async Task<IActionResult> Pay([FromBody] PaymentRequest paymentRequest)
        {
            var paymentUrl = await _myFatoorahService.InitiatePayment(paymentRequest.Amount, paymentRequest.Currency, paymentRequest.Email);
            return Ok(new { PaymentUrl = paymentUrl });
        }


        [HttpGet("success")]
        public IActionResult PaymentSuccess()
        {
            return Ok("Payment successful!");
        }

        [HttpGet("failure")]
        public IActionResult PaymentFailure()
        {
            return BadRequest("Payment failed!");
        }




    }

    public class PaymentRequest
    {
        public decimal Amount { get; set; }
        public string Currency { get; set; }
        public string Email { get; set; }
    }
}
