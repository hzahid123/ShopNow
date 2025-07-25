CREATE OR ALTER   PROCEDURE [dbo].[GetTopFollowedStores]
    @Limit INT = 5
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT TOP (@Limit)
            S.Name AS StoreName,
            COUNT(SF.Id) AS FollowerCount
        FROM [Store].[StoreFollowers] SF
        JOIN [Store].[Stores] S ON SF.StoreId = S.Id
        WHERE SF.IsDeleted = 0
        GROUP BY S.Name
        ORDER BY FollowerCount DESC;
    END TRY
    BEGIN CATCH
        SELECT 
            ERROR_NUMBER() AS ErrorNumber,
            ERROR_MESSAGE() AS ErrorMessage;
    END CATCH
END