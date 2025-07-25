using System.ComponentModel;

namespace ShopNowAngular.Enums
{
    public enum StoreRequestStatus
    {
        [Description("Pending")]
        Pending,
        [Description("Approved")]
        Approved,
        [Description("Rejected")]
        Rejected,
    }
}
