CREATE OR ALTER PROCEDURE [dbo].[GetTopProductsByStore]
    @StoreId UNIQUEIDENTIFIER,
    @Limit INT = 5
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT TOP (@Limit)
            P.Name,
            P.Price,
            C.Name AS Category,
            SUM(OI.Quantity) AS TotalSold
        FROM [product].[Products] AS P
        JOIN [Order].[OrderItems] AS OI ON OI.ProductId = P.Id
        JOIN [Order].[Orders] AS O ON O.Id = OI.OrderId
        LEFT JOIN [Category].[Categories] AS C ON P.CategoryId = C.Id
        WHERE P.StoreId = @StoreId AND O.IsDeleted = 0
        GROUP BY P.Name, P.Price, C.Name
        ORDER BY TotalSold DESC;
    END TRY
    BEGIN CATCH
        SELECT 
            ERROR_MESSAGE() AS ErrorMessage;
    END CATCH
END