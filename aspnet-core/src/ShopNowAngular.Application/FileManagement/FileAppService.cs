using Abp.Domain.Repositories;
using Abp.UI;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ShopNowAngular.BlobStorageManagement;
using ShopNowAngular.Enums;
using ShopNowAngular.FileManagement.Dtos;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using File = ShopNowAngular.Files.File;

namespace ShopNowAngular.FileManagement
{
    public class FileAppService : ShopNowAngularAppServiceBase, IFileAppService
    {
        private readonly IRepository<File, Guid> _fileRepository;
        private readonly IWebHostEnvironment _hostingEnv;
        private readonly IBlobStorageAppService _blobStorageAppService;

        public FileAppService(IRepository<File, Guid> fileRepository, IWebHostEnvironment webHostEnvironment, IBlobStorageAppService blobStorageAppService)
        {
            _fileRepository = fileRepository;
            _hostingEnv = webHostEnvironment;
            _blobStorageAppService = blobStorageAppService;
        }

        public async Task<List<GetFileDto>> UploadFile([FromForm] UploadFileDto input)
        {
            if (input.Files == null || input.Files.Count == 0)
            {
                throw new UserFriendlyException("File is empty.");
            }

            try
            {
                var uploadedFiles = new List<GetFileDto>();

                foreach (var file in input.Files)
                {
                    var uploadedFile = await HandleFileUpload(file, input.FileCategory, input.ProductId);
                    uploadedFiles.Add(uploadedFile);
                }

                return uploadedFiles;
            }
            catch (Exception ex)
            {
                Logger.Error("Error occurred during file upload", ex);
                throw new UserFriendlyException("Error occurred during file upload.", ex);
            }
        }

        private async Task<GetFileDto> HandleFileUpload(IFormFile file, FileCategory fileCategory, Guid? ProductId)
        {
            try
            {
                if (ProductId == null)
                {
                    throw new UserFriendlyException("ProductId must be provided for product files.");
                }

                // Upload to Azure Blob Storage
                using (var stream = file.OpenReadStream())
                {
                    string blobUrl = await _blobStorageAppService.UploadImageAsync(stream, file.FileName, file.ContentType);
                    var fileDto = CreateFileDto(file, blobUrl, file.FileName, fileCategory, ProductId);
                    var fileEntity = new File();
                    ObjectMapper.Map(fileDto, fileEntity);
                    await _fileRepository.InsertAsync(fileEntity);
                    return ObjectMapper.Map<GetFileDto>(fileEntity);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Error occurred while uploading the file.", ex);
                throw new UserFriendlyException("Error occurred while uploading the file.", ex);
            }
        }

        private CreateFileDto CreateFileDto(IFormFile file, string fileUrl, string fileName, FileCategory category, Guid? ProductId)
        {
            return new CreateFileDto
            {
                Url = fileUrl,
                Name = fileName,
                FileName = fileName,
                ContentType = file.ContentType,
                Length = file.Length,
                FileKey = $"{Guid.NewGuid()}-{fileName}",
                ProductId = ProductId,
                Category = category,
            };
        }
    }
}
