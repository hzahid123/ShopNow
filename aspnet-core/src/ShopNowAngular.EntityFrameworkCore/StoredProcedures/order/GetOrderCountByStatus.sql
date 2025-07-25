CREATE OR ALTER   PROCEDURE [dbo].[GetOrderCountByStatus]
    @StoreId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT 
            O.OrderStatus,
            COUNT(*) AS TotalOrders
        FROM [Order].[Orders] AS O
        WHERE O.StoreId = @StoreId AND O.IsDeleted = 0
        GROUP BY O.OrderStatus;
    END TRY
    BEGIN CATCH
        SELECT 
            ERROR_NUMBER() AS ErrorNumber,
            ERROR_STATE() AS ErrorState,
            ERROR_SEVERITY() AS ErrorSeverity,
            ERROR_PROCEDURE() AS ErrorProcedure,
            ERROR_LINE() AS ErrorLine,
            ERROR_MESSAGE() AS ErrorMessage;
    END CATCH
END
