CREATE OR ALTER   PROCEDURE [dbo].[GetTotalOrderCountByStatus]
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT
            O.OrderStatus,
            COUNT(*) AS TotalOrders
        FROM [Order].[Orders] O
        WHERE O.IsDeleted = 0
        GROUP BY O.OrderStatus;
    END TRY
    BEGIN CATCH
        SELECT 
            ERROR_NUMBER() AS ErrorNumber,
            ERROR_MESSAGE() AS ErrorMessage;
    END CATCH
END
