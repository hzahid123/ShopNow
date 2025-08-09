using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using System;
using System.IO;
using System.Threading.Tasks;
using IConfiguration = Microsoft.Extensions.Configuration.IConfiguration;

namespace ShopNowAngular.AzureBlobStorage
{
    public class AzureBlobStorageAppService : IAzureBlobStorageAppService
    {
        private readonly BlobServiceClient _blobServiceClient;
        private readonly string _containerName;
        public AzureBlobStorageAppService(IConfiguration configuration)
        {
            _blobServiceClient = new BlobServiceClient(configuration["AzureBlobStorage:ConnectionString"]);
            _containerName = configuration["AzureBlobStorage:ContainerName"];
        }

        public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType)
        {
            try
            {
                var blobContainer = _blobServiceClient.GetBlobContainerClient(_containerName);
                await blobContainer.CreateIfNotExistsAsync();

                var blobClient = blobContainer.GetBlobClient(fileName);

                // Set content type based on file extension
                var extension = Path.GetExtension(fileName).ToLowerInvariant();
                contentType = extension switch
                {
                    ".jpg" or ".jpeg" => "image/jpeg",
                    ".png" => "image/png",
                    ".gif" => "image/gif",
                    ".bmp" => "image/bmp",
                    ".webp" => "image/webp",
                    ".svg" => "image/svg+xml",
                    ".pdf" => "application/pdf",
                    _ => "application/octet-stream"
                };

                var blobHttpHeaders = new BlobHttpHeaders { ContentType = contentType };
                await blobClient.UploadAsync(fileStream, new BlobUploadOptions { HttpHeaders = blobHttpHeaders });

                return blobClient.Uri.ToString();
            }
            catch (Exception ex)
            {
                throw new Exception("Error uploading file to Azure Blob Storage", ex);
            }
        }


    }
}
