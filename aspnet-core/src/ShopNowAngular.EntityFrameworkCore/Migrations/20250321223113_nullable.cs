using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShopNowAngular.Migrations
{
    /// <inheritdoc />
    public partial class nullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StoreRequests_AbpUsers_StoreOwnerId",
                schema: "Store",
                table: "StoreRequests");

            migrationBuilder.AlterColumn<long>(
                name: "StoreOwnerId",
                schema: "Store",
                table: "StoreRequests",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AddForeignKey(
                name: "FK_StoreRequests_AbpUsers_StoreOwnerId",
                schema: "Store",
                table: "StoreRequests",
                column: "StoreOwnerId",
                principalTable: "AbpUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StoreRequests_AbpUsers_StoreOwnerId",
                schema: "Store",
                table: "StoreRequests");

            migrationBuilder.AlterColumn<long>(
                name: "StoreOwnerId",
                schema: "Store",
                table: "StoreRequests",
                type: "bigint",
                nullable: false,
                defaultValue: 0L,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_StoreRequests_AbpUsers_StoreOwnerId",
                schema: "Store",
                table: "StoreRequests",
                column: "StoreOwnerId",
                principalTable: "AbpUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
