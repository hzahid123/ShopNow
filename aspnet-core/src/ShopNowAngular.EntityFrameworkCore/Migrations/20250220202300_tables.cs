using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShopNowAngular.Migrations
{
    /// <inheritdoc />
    public partial class tables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop the existing OwnerId column
            migrationBuilder.DropColumn(
                name: "OwnerId",
                schema: "Store",
                table: "stores");

            // Add the new OwnerId column with the correct type
            migrationBuilder.AddColumn<long>(
                name: "OwnerId",
                schema: "Store",
                table: "stores",
                type: "bigint",
                nullable: false,
                defaultValue: 0); // Adjust the default value if necessary

            // Add new columns to AbpUsers table
            migrationBuilder.AddColumn<DateTime>(
                name: "EmailCodeSendingTime",
                table: "AbpUsers",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EmailCodeVerification",
                table: "AbpUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UserType",
                table: "AbpUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Remove new columns from AbpUsers table
            migrationBuilder.DropColumn(
                name: "EmailCodeSendingTime",
                table: "AbpUsers");

            migrationBuilder.DropColumn(
                name: "EmailCodeVerification",
                table: "AbpUsers");

            migrationBuilder.DropColumn(
                name: "UserType",
                table: "AbpUsers");

            // Drop the new OwnerId column
            migrationBuilder.DropColumn(
                name: "OwnerId",
                schema: "Store",
                table: "stores");

            // Recreate the old OwnerId column with the original type
            migrationBuilder.AddColumn<Guid>(
                name: "OwnerId",
                schema: "Store",
                table: "stores",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: Guid.NewGuid()); // Adjust the default value if necessary
        }
    }
}

