using System.ComponentModel;

namespace ShopNowAngular.Enums
{
    public enum OrderStatus
    {
        [Description("Pending")]
        Pending,
        [Description("Processing")]
        Processing,
        [Description("Shipped")]
        Shipped,
        [Description("Delivered")]
        Delivered,


    }
}
