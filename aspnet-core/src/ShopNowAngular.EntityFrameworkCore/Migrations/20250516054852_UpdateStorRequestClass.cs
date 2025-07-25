using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShopNowAngular.Migrations
{
    /// <inheritdoc />
    public partial class UpdateStorRequestClass : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OwnerEmail",
                schema: "Store",
                table: "StoreRequests",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OwnerName",
                schema: "Store",
                table: "StoreRequests",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OwnerSurname",
                schema: "Store",
                table: "StoreRequests",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OwnerEmail",
                schema: "Store",
                table: "StoreRequests");

            migrationBuilder.DropColumn(
                name: "OwnerName",
                schema: "Store",
                table: "StoreRequests");

            migrationBuilder.DropColumn(
                name: "OwnerSurname",
                schema: "Store",
                table: "StoreRequests");
        }
    }
}
