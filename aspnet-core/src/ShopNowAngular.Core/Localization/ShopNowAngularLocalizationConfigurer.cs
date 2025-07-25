using Abp.Configuration.Startup;
using Abp.Localization.Dictionaries;
using Abp.Localization.Dictionaries.Xml;
using Abp.Reflection.Extensions;

namespace ShopNowAngular.Localization
{
    public static class ShopNowAngularLocalizationConfigurer
    {
        public static void Configure(ILocalizationConfiguration localizationConfiguration)
        {
            localizationConfiguration.Sources.Add(
                new DictionaryBasedLocalizationSource(ShopNowAngularConsts.LocalizationSourceName,
                    new XmlEmbeddedFileLocalizationDictionaryProvider(
                        typeof(ShopNowAngularLocalizationConfigurer).GetAssembly(),
                        "ShopNowAngular.Localization.SourceFiles"
                    )
                )
            );
        }
    }
}
