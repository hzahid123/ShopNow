using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using System;
using System.IO;
using System.Threading.Tasks;
using IConfiguration = Microsoft.Extensions.Configuration.IConfiguration; // ✅ Use this

namespace ShopNowAngular.BlobStorageManagement
{
    public class BlobStorageAppService : IBlobStorageAppService
    {
        private readonly BlobServiceClient _blobServiceClient;
        private readonly string _containerName;

        public BlobStorageAppService(IConfiguration configuration)
        {
            _blobServiceClient = new BlobServiceClient(configuration["AzureBlobStorage:ConnectionString"]);
            _containerName = configuration["AzureBlobStorage:ContainerName"];
        }

        public async Task<string> UploadImageAsync(Stream fileStream, string fileName, string contentType)
        {
            try
            {
                var blobContainer = _blobServiceClient.GetBlobContainerClient(_containerName);
                await blobContainer.CreateIfNotExistsAsync(PublicAccessType.Blob);

                var blobClient = blobContainer.GetBlobClient(fileName);

                var blobHttpHeaders = new BlobHttpHeaders { ContentType = contentType };
                await blobClient.UploadAsync(fileStream, blobHttpHeaders);

                return blobClient.Uri.ToString(); // Return URL of the uploaded image
            }
            catch (Exception ex)
            {
                throw new Exception("Error uploading image to Azure Blob Storage", ex);
            }
        }
    }
}



