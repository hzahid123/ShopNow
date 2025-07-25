CREATE OR ALTER PROCEDURE [dbo].[GetTotalSalesByStore]
    @StoreId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- ? Return only the total sales for the store
        SELECT 
            CAST(SUM(OI.Quantity * OI.UnitPrice) AS DECIMAL(18, 2)) AS TotalSales
        FROM [Order].[Orders] AS O
        JOIN [Order].[OrderItems] AS OI ON O.Id = OI.OrderId
        JOIN [product].[Products] AS P ON P.Id = OI.ProductId
        WHERE P.StoreId = @StoreId AND O.IsDeleted = 0;
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
