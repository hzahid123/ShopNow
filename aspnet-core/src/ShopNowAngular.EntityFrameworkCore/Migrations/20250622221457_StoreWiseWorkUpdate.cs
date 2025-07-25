using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShopNowAngular.Migrations
{
    /// <inheritdoc />
    public partial class StoreWiseWorkUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_stores_OwnerId",
                schema: "Store",
                table: "stores",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_OrderId",
                schema: "Payment",
                table: "Payments",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_ProductId",
                schema: "Order",
                table: "OrderItems",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_CartItems_ProductId",
                schema: "Cart",
                table: "CartItems",
                column: "ProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_CartItems_Products_ProductId",
                schema: "Cart",
                table: "CartItems",
                column: "ProductId",
                principalSchema: "product",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_Products_ProductId",
                schema: "Order",
                table: "OrderItems",
                column: "ProductId",
                principalSchema: "product",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_Orders_OrderId",
                schema: "Payment",
                table: "Payments",
                column: "OrderId",
                principalSchema: "Order",
                principalTable: "Orders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_stores_AbpUsers_OwnerId",
                schema: "Store",
                table: "stores",
                column: "OwnerId",
                principalTable: "AbpUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CartItems_Products_ProductId",
                schema: "Cart",
                table: "CartItems");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_Products_ProductId",
                schema: "Order",
                table: "OrderItems");

            migrationBuilder.DropForeignKey(
                name: "FK_Payments_Orders_OrderId",
                schema: "Payment",
                table: "Payments");

            migrationBuilder.DropForeignKey(
                name: "FK_stores_AbpUsers_OwnerId",
                schema: "Store",
                table: "stores");

            migrationBuilder.DropIndex(
                name: "IX_stores_OwnerId",
                schema: "Store",
                table: "stores");

            migrationBuilder.DropIndex(
                name: "IX_Payments_OrderId",
                schema: "Payment",
                table: "Payments");

            migrationBuilder.DropIndex(
                name: "IX_OrderItems_ProductId",
                schema: "Order",
                table: "OrderItems");

            migrationBuilder.DropIndex(
                name: "IX_CartItems_ProductId",
                schema: "Cart",
                table: "CartItems");
        }
    }
}
