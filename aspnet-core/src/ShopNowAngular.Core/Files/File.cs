using Abp.Domain.Entities.Auditing;
using ShopNowAngular.Enums;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopNowAngular.Files
{
    [Table("Files", Schema = "File")]
    public class File : FullAuditedEntity<Guid>
    {
        public string ContentType { get; set; }
        public long Length { get; set; }
        public string Name { get; set; }
        public string FileName { get; set; }
        public string FileKey { get; set; }
        public string Url { get; set; }
        public FileCategory Category { get; set; }

        public Guid? ProductId { get; set; }
    }
}

