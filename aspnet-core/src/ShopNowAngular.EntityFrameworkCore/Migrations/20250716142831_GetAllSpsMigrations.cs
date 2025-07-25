using Microsoft.EntityFrameworkCore.Migrations;
using ShopNowAngular.StoredProcedures;

#nullable disable

namespace ShopNowAngular.Migrations
{
    /// <inheritdoc />
    public partial class GetAllSpsMigrations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)

        {
            migrationBuilder.Sql(StoredProcedureHelper.GetProcedureNew("order.GetAllOrders.sql"));
            migrationBuilder.Sql(StoredProcedureHelper.GetProcedureNew("order.GetMonthlySalesAllStores.sql"));
            migrationBuilder.Sql(StoredProcedureHelper.GetProcedureNew("order.GetMonthlySalesByStore.sql"));
            migrationBuilder.Sql(StoredProcedureHelper.GetProcedureNew("order.GetOrderCountByStatus.sql"));
            migrationBuilder.Sql(StoredProcedureHelper.GetProcedureNew("order.GetRecentOrdersByStore.sql"));
            migrationBuilder.Sql(StoredProcedureHelper.GetProcedureNew("order.GetTopSellingProducts.sql"));
            migrationBuilder.Sql(StoredProcedureHelper.GetProcedureNew("order.GetTotalCustomersByStore.sql"));
            migrationBuilder.Sql(StoredProcedureHelper.GetProcedureNew("order.GetTotalOrderCountByStatus.sql"));
            migrationBuilder.Sql(StoredProcedureHelper.GetProcedureNew("order.GetTotalOrders.sql"));
            migrationBuilder.Sql(StoredProcedureHelper.GetProcedureNew("order.GetTotalOrdersByStore.sql"));
            migrationBuilder.Sql(StoredProcedureHelper.GetProcedureNew("order.GetTotalSales.sql"));
            migrationBuilder.Sql(StoredProcedureHelper.GetProcedureNew("order.GetTotalSalesByStore.sql"));
            migrationBuilder.Sql(StoredProcedureHelper.GetProcedureNew("Products.GetProductsByCategory.sql"));
            migrationBuilder.Sql(StoredProcedureHelper.GetProcedureNew("Products.GetProductsByStoreIdPagedSorted.sql"));
            migrationBuilder.Sql(StoredProcedureHelper.GetProcedureNew("Products.GetProductsBySubCategory.sql"));
            migrationBuilder.Sql(StoredProcedureHelper.GetProcedureNew("Products.GetProductsBySubSubCategory.sql"));
            migrationBuilder.Sql(StoredProcedureHelper.GetProcedureNew("Products.GetRecentUnapprovedReviews.sql"));
            migrationBuilder.Sql(StoredProcedureHelper.GetProcedureNew("Products.GetTopProductsByStore.sql"));
            migrationBuilder.Sql(StoredProcedureHelper.GetProcedureNew("Products.GetTopWishlistedProducts.sql"));
            migrationBuilder.Sql(StoredProcedureHelper.GetProcedureNew("Products.GetTotalWishlistItems.sql"));
            migrationBuilder.Sql(StoredProcedureHelper.GetProcedureNew("StoreRequests.GetPendingStoreRequests.sql"));
            migrationBuilder.Sql(StoredProcedureHelper.GetProcedureNew("Users.GetTotalUsers.sql"));
            migrationBuilder.Sql(StoredProcedureHelper.GetProcedureNew("Stores.GetRecentStores.sql"));
            migrationBuilder.Sql(StoredProcedureHelper.GetProcedureNew("Stores.GetTopFollowedStores.sql"));
            migrationBuilder.Sql(StoredProcedureHelper.GetProcedureNew("Stores.GetTopStoresBySales.sql"));
            migrationBuilder.Sql(StoredProcedureHelper.GetProcedureNew("Stores.GetTotalStoreFollowers.sql"));
            migrationBuilder.Sql(StoredProcedureHelper.GetProcedureNew("Stores.GetTotalStores.sql"));


        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE [Order].[GetAllOrders]");
            migrationBuilder.Sql("DROP PROCEDURE [dbo].[GetMonthlySalesAllStores]");
            migrationBuilder.Sql("DROP PROCEDURE [dbo].[GetMonthlySalesByStore]");
            migrationBuilder.Sql("DROP PROCEDURE [dbo].[GetOrderCountByStatus]");
            migrationBuilder.Sql("DROP PROCEDURE [dbo].[GetRecentOrdersByStore]");
            migrationBuilder.Sql("DROP PROCEDURE [dbo].[GetTopSellingProducts]");
            migrationBuilder.Sql("DROP PROCEDURE [dbo].[GetTotalCustomersByStore]");
            migrationBuilder.Sql("DROP PROCEDURE [dbo].[GetTotalOrderCountByStatus]");
            migrationBuilder.Sql("DROP PROCEDURE [dbo].[GetTotalOrders]");
            migrationBuilder.Sql("DROP PROCEDURE [dbo].[GetTotalOrdersByStore]");
            migrationBuilder.Sql("DROP PROCEDURE [dbo].[GetTotalSales]");
            migrationBuilder.Sql("DROP PROCEDURE [dbo].[GetTotalSalesByStore]");
            migrationBuilder.Sql("DROP PROCEDURE [product].[GetProductsByCategory]");
            migrationBuilder.Sql("DROP PROCEDURE [dbo].[GetProductsByStoreIdPagedSorted]");
            migrationBuilder.Sql("DROP PROCEDURE [product].[GetProductsBySubCategory]");
            migrationBuilder.Sql("DROP PROCEDURE [product].[GetProductsBySubSubCategory]");
            migrationBuilder.Sql("DROP PROCEDURE [dbo].[GetRecentUnapprovedReviews]");
            migrationBuilder.Sql("DROP PROCEDURE [dbo].[GetTopProductsByStore]");
            migrationBuilder.Sql("DROP PROCEDURE [dbo].[GetTopWishlistedProducts]");
            migrationBuilder.Sql("DROP PROCEDURE [dbo].[GetTotalWishlistItems]");
            migrationBuilder.Sql("DROP PROCEDURE [dbo].[GetPendingStoreRequests]");
            migrationBuilder.Sql("DROP PROCEDURE [dbo].[GetTotalUsers]");
            migrationBuilder.Sql("DROP PROCEDURE [dbo].[GetRecentStores]");
            migrationBuilder.Sql("DROP PROCEDURE [dbo].[GetTopFollowedStores]");
            migrationBuilder.Sql("DROP PROCEDURE [dbo].[GetTopStoresBySales]");
            migrationBuilder.Sql("DROP PROCEDURE [dbo].[GetTotalStoreFollowers]");
            migrationBuilder.Sql("DROP PROCEDURE [dbo].[GetTotalStores]");




        }
    }
}
