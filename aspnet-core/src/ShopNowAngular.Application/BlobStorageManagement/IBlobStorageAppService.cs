using System.IO;
using System.Threading.Tasks;

namespace ShopNowAngular.BlobStorageManagement
{
    public interface IBlobStorageAppService
    {
        Task<string> UploadImageAsync(Stream fileStream, string fileName, string contentType);    
            
    }
}
