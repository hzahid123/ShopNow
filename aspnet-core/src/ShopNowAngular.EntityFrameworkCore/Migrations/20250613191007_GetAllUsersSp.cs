using Microsoft.EntityFrameworkCore.Migrations;
using ShopNowAngular.StoredProcedures;

#nullable disable

namespace ShopNowAngular.Migrations
{
    /// <inheritdoc />
    public partial class GetAllUsersSp : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(StoredProcedureHelper.GetProcedureNew("Users.GetAllUser.sql"));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE [dbo].[GetAllUsers]");
        }
    }
}
