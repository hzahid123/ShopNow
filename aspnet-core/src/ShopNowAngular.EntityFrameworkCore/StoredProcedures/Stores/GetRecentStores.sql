CREATE OR ALTER   PROCEDURE [dbo].[GetRecentStores]
    @Limit INT = 5
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT TOP (@Limit)
            S.Name,
            S.OwnerId,
            S.CreationTime
        FROM [Store].[stores] S
        WHERE S.IsDeleted = 0
        ORDER BY S.CreationTime DESC;
    END TRY
    BEGIN CATCH
        SELECT 
            ERROR_NUMBER() AS ErrorNumber,
            ERROR_MESSAGE() AS ErrorMessage;
    END CATCH
END

