using Abp.Reflection.Extensions;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.StoredProcedures
{
    public static class StoredProcedureHelper
    {
        public static string GetProcedureNew(string filePath)
        {
            using (var stream = typeof(StoredProcedureHelper).GetAssembly().GetManifestResourceStream("ShopNowAngular.StoredProcedures." + filePath))
            {
                using (var sr = new StreamReader(stream))
                {
                    var procedure = sr.ReadToEnd();
                    return procedure;
                }
                ;
            }
        }
    }
}
