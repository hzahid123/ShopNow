CREATE OR ALTER   PROCEDURE [dbo].[GetTopStoresBySales]
    @Limit INT = 5
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT TOP (@Limit)
            S.Name AS StoreName,
            SUM(OI.Quantity * OI.UnitPrice) AS TotalSales
        FROM [Store].[Stores] S
        JOIN [product].[Products] P ON S.Id = P.StoreId
        JOIN [Order].[OrderItems] OI ON P.Id = OI.ProductId
        JOIN [Order].[Orders] O ON O.Id = OI.OrderId
        WHERE O.IsDeleted = 0
        GROUP BY S.Name
        ORDER BY TotalSales DESC;
    END TRY
    BEGIN CATCH
        SELECT 
            ERROR_NUMBER() AS ErrorNumber,
            ERROR_MESSAGE() AS ErrorMessage;
    END CATCH
END
