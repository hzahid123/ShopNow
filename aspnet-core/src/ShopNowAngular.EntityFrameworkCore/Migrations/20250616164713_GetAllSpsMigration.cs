using Microsoft.EntityFrameworkCore.Migrations;
using ShopNowAngular.StoredProcedures;

#nullable disable

namespace ShopNowAngular.Migrations
{
    /// <inheritdoc />
    public partial class GetAllSpsMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(StoredProcedureHelper.GetProcedureNew("StoreRequests.GetAllStoreRequest.sql"));
            migrationBuilder.Sql(StoredProcedureHelper.GetProcedureNew("Stores.GetAllStore.sql"));
            migrationBuilder.Sql(StoredProcedureHelper.GetProcedureNew("Products.GetAllProduct.sql"));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE [Store].[GetAllStoreRequests]");
            migrationBuilder.Sql("DROP PROCEDURE [Store].[GetAllStores]");
            migrationBuilder.Sql("DROP PROCEDURE [product].[GetAllProducts]");

        }
    }
}
