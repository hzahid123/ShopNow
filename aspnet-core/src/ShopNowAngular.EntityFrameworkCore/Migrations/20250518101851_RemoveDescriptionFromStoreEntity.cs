using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShopNowAngular.Migrations
{
    /// <inheritdoc />
    public partial class RemoveDescriptionFromStoreEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                schema: "Store",
                table: "stores");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                schema: "Store",
                table: "stores",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
