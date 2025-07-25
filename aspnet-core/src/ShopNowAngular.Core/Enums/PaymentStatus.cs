using System.ComponentModel;

namespace ShopNowAngular.Enums
{
    public enum PaymentStatus
    {
        [Description("Pending")]
        Pending,
        [Description("Completed")]
        Completed,
        [Description("Failed")]
        Failed,


    }
}
