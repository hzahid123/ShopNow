using ShopNowAngular.Enums;
using System;

namespace ShopNowAngular.FileManagement.Dtos
{
    public class CreateFileDto
    {
        
            public string Url { get; set; } 
            public string Name { get; set; } 
            public string FileName { get; set; } 
            public string ContentType { get; set; } 
            public long Length { get; set; }
            public string FileKey { get; set; } 
            public FileCategory Category { get; set; } 
            public Guid? ProductId { get; set; } 
        

    }
}
