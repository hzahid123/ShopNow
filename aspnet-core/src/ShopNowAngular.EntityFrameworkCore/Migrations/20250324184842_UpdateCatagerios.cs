using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShopNowAngular.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCatagerios : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_SubSubCategories_SubCategoryId",
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
                name: "PK_SubSubCategories",
                schema: "SubCategory",
                table: "SubSubCategories");

            migrationBuilder.DropColumn(
                name: "Description",
                schema: "Category",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "Description",
                schema: "SubSubCategory",
                table: "SubSubCategories");

            migrationBuilder.DropColumn(
                name: "Description",
                schema: "SubCategory",
                table: "SubSubCategories");

            migrationBuilder.RenameTable(
                name: "SubSubCategories",
                schema: "SubSubCategory",
                newName: "SubSubCategories",
                newSchema: "Category");

            migrationBuilder.RenameTable(
                name: "SubSubCategories",
                schema: "SubCategory",
                newName: "SubCategories",
                newSchema: "Category");

            migrationBuilder.RenameIndex(
                name: "IX_SubSubCategories_CategoryId",
                schema: "Category",
                table: "SubCategories",
                newName: "IX_SubCategories_CategoryId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SubCategories",
                schema: "Category",
                table: "SubCategories",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_SubCategories_SubCategoryId",
                schema: "product",
                table: "Products",
                column: "SubCategoryId",
                principalSchema: "Category",
                principalTable: "SubCategories",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SubCategories_Categories_CategoryId",
                schema: "Category",
                table: "SubCategories",
                column: "CategoryId",
                principalSchema: "Category",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SubSubCategories_SubCategories_SubCategoryId",
                schema: "Category",
                table: "SubSubCategories",
                column: "SubCategoryId",
                principalSchema: "Category",
                principalTable: "SubCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_SubCategories_SubCategoryId",
                schema: "product",
                table: "Products");

            migrationBuilder.DropForeignKey(
                name: "FK_SubCategories_Categories_CategoryId",
                schema: "Category",
                table: "SubCategories");

            migrationBuilder.DropForeignKey(
                name: "FK_SubSubCategories_SubCategories_SubCategoryId",
                schema: "Category",
                table: "SubSubCategories");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SubCategories",
                schema: "Category",
                table: "SubCategories");

            migrationBuilder.EnsureSchema(
                name: "SubCategory");

            migrationBuilder.EnsureSchema(
                name: "SubSubCategory");

            migrationBuilder.RenameTable(
                name: "SubSubCategories",
                schema: "Category",
                newName: "SubSubCategories",
                newSchema: "SubSubCategory");

            migrationBuilder.RenameTable(
                name: "SubCategories",
                schema: "Category",
                newName: "SubSubCategories",
                newSchema: "SubCategory");

            migrationBuilder.RenameIndex(
                name: "IX_SubCategories_CategoryId",
                schema: "SubCategory",
                table: "SubSubCategories",
                newName: "IX_SubSubCategories_CategoryId");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                schema: "Category",
                table: "Categories",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                schema: "SubSubCategory",
                table: "SubSubCategories",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                schema: "SubCategory",
                table: "SubSubCategories",
                type: "nvarchar(max)",
                nullable: true);

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
    }
}
