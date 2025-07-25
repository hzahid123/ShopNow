using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.MyFatoorahPayment
{
    public interface IMyFatoorahAppService
    {
        Task<string> InitiatePayment(decimal amount, string currency, string customerEmail);
    }
}
