CREATE OR ALTER PROCEDURE [dbo].[GetRecentOrdersByStore]
    @StoreId UNIQUEIDENTIFIER,
    @Limit INT = 5
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- ? Return only the recent orders (limit applied)
        SELECT TOP (@Limit)
            P.Name AS ProductName,
            C.Name AS Category,
            OI.UnitPrice AS Price,
            O.OrderStatus AS Status,
            O.CreationTime
        FROM [Order].[Orders] AS O
        JOIN [Order].[OrderItems] AS OI ON O.Id = OI.OrderId
        JOIN [product].[Products] AS P ON P.Id = OI.ProductId
        LEFT JOIN [Category].[Categories] AS C ON P.CategoryId = C.Id
        WHERE P.StoreId = @StoreId AND O.IsDeleted = 0
        ORDER BY O.CreationTime DESC;
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


