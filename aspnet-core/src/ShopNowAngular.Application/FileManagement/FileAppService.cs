using Abp.Domain.Repositories;
using Abp.UI;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ShopNowAngular.AzureBlobStorage;
using ShopNowAngular.Enums;
using ShopNowAngular.FileManagement.Dtos;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using File = ShopNowAngular.Files.File;

namespace ShopNowAngular.FileManagement
{
    public class FileAppService : ShopNowAngularAppServiceBase, IFileAppService
    {
        private readonly IRepository<File, Guid> _fileRepository;
        private readonly IWebHostEnvironment _hostingEnv;
        private readonly IAzureBlobStorageAppService _azureBlobStorageAppService;

        public FileAppService(IRepository<File, Guid> fileRepository, IWebHostEnvironment webHostEnvironment, IAzureBlobStorageAppService azureBlobStorageAppService)
        {
            _fileRepository = fileRepository;
            _hostingEnv = webHostEnvironment;
            _azureBlobStorageAppService = azureBlobStorageAppService;
        }

        public async Task<List<object>> UploadFiles([FromForm] UploadFileDto input)
        {
            var uploadedFiles = new List<object>();

            foreach (var file in input.Files)
            {
                if (file == null || file.Length == 0)
                {
                    continue;
                }

                var fileGuid = Guid.NewGuid();
                var extension = Path.GetExtension(file.FileName);
                var originalFileName = Path.GetFileNameWithoutExtension(file.FileName);
                var uniqueFileName = $"{originalFileName}_{fileGuid}{extension}";
                var contentType = file.ContentType;

                var fileUrl = await _azureBlobStorageAppService.UploadFileAsync(
                    file.OpenReadStream(),
                    uniqueFileName,
                    contentType
                );

                var fileEntity = new File
                {
                    Id = fileGuid,
                    Name = originalFileName,
                    FileName = uniqueFileName,
                    FileKey = uniqueFileName,
                    Url = fileUrl,
                    Category = input.FileCategory,
                    ProductId = input.ProductId,
                    ContentType = contentType,
                    Length = file.Length,
                };

                await _fileRepository.InsertAsync(fileEntity);

                // ✅ Return only selected fields
                uploadedFiles.Add(new
                {
                    FileCategory = input.FileCategory,
                    ProductId = input.ProductId,
                    FileUrl = fileUrl,
                    FileGuid = fileGuid
                });
            }

            return uploadedFiles;
        }


    }
}
