using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ShopNowAngular.MyFatoorahPayment;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.MyFatoorahPayment
{
    public class MyFatoorahAppService : IMyFatoorahAppService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiUrl;
        private readonly string _apiKey;

        public MyFatoorahAppService(IConfiguration configuration)
        {
            _httpClient = new HttpClient();
            _apiUrl = configuration["MyFatoorah:APIUrl"];
            _apiKey = configuration["MyFatoorah:APIKey"];
        }

        public async Task<string> InitiatePayment(decimal amount, string currency, string customerEmail)
        {
            var requestData = new
            {
                InvoiceAmount = amount,
                Currency = currency,
                CustomerEmail = customerEmail,
                CallBackUrl = "https://yourwebsite.com/payment-success",
                ErrorUrl = "https://yourwebsite.com/payment-failure",
                Language = "en"
            };

            var requestJson = JsonConvert.SerializeObject(requestData);
            var requestContent = new StringContent(requestJson, Encoding.UTF8, "application/json");

            _httpClient.DefaultRequestHeaders.Add("Authorization", "Bearer " + _apiKey);

            var response = await _httpClient.PostAsync($"{_apiUrl}/v2/ExecutePayment", requestContent);
            var responseContent = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception("Payment initiation failed: " + responseContent);
            }

            dynamic responseData = JsonConvert.DeserializeObject(responseContent);
            return responseData.Data.PaymentURL;
        }
    }


}

