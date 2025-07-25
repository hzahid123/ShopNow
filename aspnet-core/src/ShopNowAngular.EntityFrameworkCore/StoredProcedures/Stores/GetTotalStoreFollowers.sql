CREATE OR ALTER   PROCEDURE [dbo].[GetTotalStoreFollowers]
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT COUNT(*) AS TotalStoreFollowed
        FROM [Store].[StoreFollowers]
        WHERE IsDeleted = 0;
    END TRY
    BEGIN CATCH
        SELECT 
            ERROR_NUMBER() AS ErrorNumber,
            ERROR_MESSAGE() AS ErrorMessage;
    END CATCH
END