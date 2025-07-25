CREATE OR ALTER   PROCEDURE [dbo].[GetRecentUnapprovedReviews]
    @Limit INT = 5
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT TOP (@Limit)
            U.UserName,
            P.Name AS ProductName,
            PR.Rating,
            PR.ReviewText,
            PR.CreationTime
        FROM [product].[ProductReviews] PR
        JOIN [AbpUsers] U ON U.Id = PR.CustomerId
        JOIN [product].[Products] P ON PR.ProductId = P.Id
        WHERE PR.IsApproved = 0 AND PR.IsDeleted = 0
        ORDER BY PR.CreationTime DESC;
    END TRY
    BEGIN CATCH
        SELECT 
            ERROR_NUMBER() AS ErrorNumber,
            ERROR_MESSAGE() AS ErrorMessage;
    END CATCH
END
