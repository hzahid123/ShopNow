using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShopNowAngular.Migrations
{
    /// <inheritdoc />
    public partial class ChangeEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "Cart");

            migrationBuilder.RenameTable(
                name: "Carts",
                newName: "Carts",
                newSchema: "Cart");

            migrationBuilder.RenameTable(
                name: "CartItems",
                newName: "CartItems",
                newSchema: "Cart");

            migrationBuilder.AlterColumn<long>(
                name: "UserId",
                schema: "Payment",
                table: "Payments",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AddColumn<long>(
                name: "CustomerId",
                schema: "Payment",
                table: "Payments",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AlterColumn<long>(
                name: "UserId",
                schema: "Order",
                table: "Orders",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AddColumn<long>(
                name: "CustomerId",
                schema: "Order",
                table: "Orders",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AlterColumn<long>(
                name: "UserId",
                schema: "Cart",
                table: "Carts",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AddColumn<long>(
                name: "CustomerId",
                schema: "Cart",
                table: "Carts",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateIndex(
                name: "IX_Payments_UserId",
                schema: "Payment",
                table: "Payments",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_UserId",
                schema: "Order",
                table: "Orders",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Carts_UserId",
                schema: "Cart",
                table: "Carts",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Carts_AbpUsers_UserId",
                schema: "Cart",
                table: "Carts",
                column: "UserId",
                principalTable: "AbpUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_AbpUsers_UserId",
                schema: "Order",
                table: "Orders",
                column: "UserId",
                principalTable: "AbpUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_AbpUsers_UserId",
                schema: "Payment",
                table: "Payments",
                column: "UserId",
                principalTable: "AbpUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Carts_AbpUsers_UserId",
                schema: "Cart",
                table: "Carts");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_AbpUsers_UserId",
                schema: "Order",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Payments_AbpUsers_UserId",
                schema: "Payment",
                table: "Payments");

            migrationBuilder.DropIndex(
                name: "IX_Payments_UserId",
                schema: "Payment",
                table: "Payments");

            migrationBuilder.DropIndex(
                name: "IX_Orders_UserId",
                schema: "Order",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Carts_UserId",
                schema: "Cart",
                table: "Carts");

            migrationBuilder.DropColumn(
                name: "CustomerId",
                schema: "Payment",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "CustomerId",
                schema: "Order",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "CustomerId",
                schema: "Cart",
                table: "Carts");

            migrationBuilder.RenameTable(
                name: "Carts",
                schema: "Cart",
                newName: "Carts");

            migrationBuilder.RenameTable(
                name: "CartItems",
                schema: "Cart",
                newName: "CartItems");

            migrationBuilder.AlterColumn<long>(
                name: "UserId",
                schema: "Payment",
                table: "Payments",
                type: "bigint",
                nullable: false,
                defaultValue: 0L,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);

            migrationBuilder.AlterColumn<long>(
                name: "UserId",
                schema: "Order",
                table: "Orders",
                type: "bigint",
                nullable: false,
                defaultValue: 0L,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);

            migrationBuilder.AlterColumn<long>(
                name: "UserId",
                table: "Carts",
                type: "bigint",
                nullable: false,
                defaultValue: 0L,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);
        }
    }
}
