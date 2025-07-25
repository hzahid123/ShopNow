CREATE OR ALTER   PROCEDURE [dbo].[GetTopSellingProducts]
    @Limit INT = 5
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT TOP (@Limit)
            P.Name,
            SUM(OI.Quantity) AS TotalSold
        FROM [product].[Products] P
        JOIN [Order].[OrderItems] OI ON P.Id = OI.ProductId
        JOIN [Order].[Orders] O ON O.Id = OI.OrderId
        WHERE O.IsDeleted = 0
        GROUP BY P.Name
        ORDER BY TotalSold DESC;
    END TRY
    BEGIN CATCH
        SELECT 
            ERROR_NUMBER() AS ErrorNumber,
            ERROR_MESSAGE() AS ErrorMessage;
    END CATCH
END
