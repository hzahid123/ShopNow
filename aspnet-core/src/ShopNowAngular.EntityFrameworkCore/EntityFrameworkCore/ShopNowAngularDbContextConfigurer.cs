using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace ShopNowAngular.EntityFrameworkCore
{
    public static class ShopNowAngularDbContextConfigurer
    {
        public static void Configure(DbContextOptionsBuilder<ShopNowAngularDbContext> builder, string connectionString)
        {
            builder.UseSqlServer(connectionString);
        }

        public static void Configure(DbContextOptionsBuilder<ShopNowAngularDbContext> builder, DbConnection connection)
        {
            builder.UseSqlServer(connection);
        }
    }
}
