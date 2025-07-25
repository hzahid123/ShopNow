CREATE OR ALTER   PROCEDURE [dbo].[GetTotalSales]
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT 
            CAST(SUM(OI.Quantity * OI.UnitPrice) AS DECIMAL(18,2)) AS TotalSales
        FROM [Order].[Orders] O
        JOIN [Order].[OrderItems] OI ON O.Id = OI.OrderId
        WHERE O.IsDeleted = 0;
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