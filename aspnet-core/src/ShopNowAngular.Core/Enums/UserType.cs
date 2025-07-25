using System.ComponentModel;

namespace ShopNowAngular.Enums
{
    public enum UserType
    {

        [Description("Admin")]
        Admin,
        [Description("SuperAdmin")]
        SuperAdmin,

        [Description("StoreOwner")]
        StoreOwner,

        [Description("Customer")]
        Customer
    }
}
