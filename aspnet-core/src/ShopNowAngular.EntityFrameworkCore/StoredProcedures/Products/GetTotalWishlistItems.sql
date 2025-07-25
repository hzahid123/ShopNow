CREATE OR ALTER   PROCEDURE [dbo].[GetTotalWishlistItems]
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT COUNT(*) AS TotalWishlistItems
        FROM [Cart].[WishlistItems]
        WHERE IsDeleted = 0;
    END TRY
    BEGIN CATCH
        SELECT 
            ERROR_NUMBER() AS ErrorNumber,
            ERROR_MESSAGE() AS ErrorMessage;
    END CATCH
END
