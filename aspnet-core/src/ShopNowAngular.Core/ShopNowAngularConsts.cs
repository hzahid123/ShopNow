using ShopNowAngular.Debugging;

namespace ShopNowAngular
{
    public class ShopNowAngularConsts
    {
        public const string LocalizationSourceName = "ShopNowAngular";

        public const string ConnectionStringName = "Default";

        public const bool MultiTenancyEnabled = false;


        /// <summary>
        /// Default pass phrase for SimpleStringCipher decrypt/encrypt operations
        /// </summary>
        public static readonly string DefaultPassPhrase =
            DebugHelper.IsDebug ? "gsKxGZ012HLL3MI5" : "91132f350ffa49569e8691803df7f1f1";
    }
}
