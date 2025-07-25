CREATE OR ALTER   PROCEDURE [dbo].[GetTopWishlistedProducts]
    @Limit INT = 5
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT TOP (@Limit)
            P.Name AS ProductName,
            COUNT(W.Id) AS WishlistCount
        FROM [Cart].[WishlistItems] W
        JOIN [product].[Products] P ON W.ProductId = P.Id
        WHERE W.IsDeleted = 0
        GROUP BY P.Name
        ORDER BY WishlistCount DESC;
    END TRY
    BEGIN CATCH
        SELECT 
            ERROR_NUMBER() AS ErrorNumber,
            ERROR_MESSAGE() AS ErrorMessage;
    END CATCH
END