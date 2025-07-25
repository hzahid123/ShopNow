using Microsoft.AspNetCore.Http;
using ShopNowAngular.Enums;
using System;
using System.Collections.Generic;

namespace ShopNowAngular.FileManagement.Dtos
{

    public class UploadFileDto
    {
        public List<IFormFile> Files { get; set; } 
        public FileCategory FileCategory { get; set; }
        public Guid? ProductId { get; set; } 
    }

}
