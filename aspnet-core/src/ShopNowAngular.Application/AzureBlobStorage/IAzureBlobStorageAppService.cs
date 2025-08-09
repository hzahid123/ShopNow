using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.AzureBlobStorage
{
    public interface IAzureBlobStorageAppService 
    {
       Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType);
    }
}
