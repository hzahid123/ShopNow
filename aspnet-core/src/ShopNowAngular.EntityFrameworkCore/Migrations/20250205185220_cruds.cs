using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShopNowAngular.Migrations
{
    /// <inheritdoc />
    public partial class cruds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_Stores_StoreId",
                table: "Products");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_SubCategories_SubCategoryId",
                table: "Products");

            migrationBuilder.DropForeignKey(
                name: "FK_SubCategories_Categories_CategoryId",
                table: "SubCategories");

            migrationBuilder.DropForeignKey(
                name: "FK_SubSubCategories_SubCategories_SubCategoryId",
                table: "SubSubCategories");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Stores",
                table: "Stores");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SubCategories",
                table: "SubCategories");

            migrationBuilder.EnsureSchema(
                name: "Category");

            migrationBuilder.EnsureSchema(
                name: "product");

            migrationBuilder.EnsureSchema(
                name: "Store");

            migrationBuilder.EnsureSchema(
                name: "SubCategory");

            migrationBuilder.EnsureSchema(
                name: "SubSubCategory");

            migrationBuilder.RenameTable(
                name: "SubSubCategories",
                newName: "SubSubCategories",
                newSchema: "SubSubCategory");

            migrationBuilder.RenameTable(
                name: "Stores",
                newName: "stores",
                newSchema: "Store");

            migrationBuilder.RenameTable(
                name: "Products",
                newName: "Products",
                newSchema: "product");

            migrationBuilder.RenameTable(
                name: "Categories",
                newName: "Categories",
                newSchema: "Category");

            migrationBuilder.RenameTable(
                name: "SubCategories",
                newName: "SubSubCategories",
                newSchema: "SubCategory");

            migrationBuilder.RenameIndex(
                name: "IX_SubCategories_CategoryId",
                schema: "SubCategory",
                table: "SubSubCategories",
                newName: "IX_SubSubCategories_CategoryId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_stores",
                schema: "Store",
                table: "stores",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SubSubCategories",
                schema: "SubCategory",
                table: "SubSubCategories",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_SubSubCategories_SubCategoryId",
                schema: "product",
                table: "Products",
                column: "SubCategoryId",
                principalSchema: "SubCategory",
                principalTable: "SubSubCategories",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_stores_StoreId",
                schema: "product",
                table: "Products",
                column: "StoreId",
                principalSchema: "Store",
                principalTable: "stores",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SubSubCategories_Categories_CategoryId",
                schema: "SubCategory",
                table: "SubSubCategories",
                column: "CategoryId",
                principalSchema: "Category",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SubSubCategories_SubSubCategories_SubCategoryId",
                schema: "SubSubCategory",
                table: "SubSubCategories",
                column: "SubCategoryId",
                principalSchema: "SubCategory",
                principalTable: "SubSubCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_SubSubCategories_SubCategoryId",
                schema: "product",
                table: "Products");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_stores_StoreId",
                schema: "product",
                table: "Products");

            migrationBuilder.DropForeignKey(
                name: "FK_SubSubCategories_Categories_CategoryId",
                schema: "SubCategory",
                table: "SubSubCategories");

            migrationBuilder.DropForeignKey(
                name: "FK_SubSubCategories_SubSubCategories_SubCategoryId",
                schema: "SubSubCategory",
                table: "SubSubCategories");

            migrationBuilder.DropPrimaryKey(
                name: "PK_stores",
                schema: "Store",
                table: "stores");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SubSubCategories",
                schema: "SubCategory",
                table: "SubSubCategories");

            migrationBuilder.RenameTable(
                name: "SubSubCategories",
                schema: "SubSubCategory",
                newName: "SubSubCategories");

            migrationBuilder.RenameTable(
                name: "stores",
                schema: "Store",
                newName: "Stores");

            migrationBuilder.RenameTable(
                name: "Products",
                schema: "product",
                newName: "Products");

            migrationBuilder.RenameTable(
                name: "Categories",
                schema: "Category",
                newName: "Categories");

            migrationBuilder.RenameTable(
                name: "SubSubCategories",
                schema: "SubCategory",
                newName: "SubCategories");

            migrationBuilder.RenameIndex(
                name: "IX_SubSubCategories_CategoryId",
                table: "SubCategories",
                newName: "IX_SubCategories_CategoryId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Stores",
                table: "Stores",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SubCategories",
                table: "SubCategories",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Stores_StoreId",
                table: "Products",
                column: "StoreId",
                principalTable: "Stores",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Products_SubCategories_SubCategoryId",
                table: "Products",
                column: "SubCategoryId",
                principalTable: "SubCategories",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SubCategories_Categories_CategoryId",
                table: "SubCategories",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SubSubCategories_SubCategories_SubCategoryId",
                table: "SubSubCategories",
                column: "SubCategoryId",
                principalTable: "SubCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
