CREATE OR ALTER PROCEDURE [Store].[GetAllStoreRequests]
    @Keyword NVARCHAR(MAX) = NULL,
    @SortingCol NVARCHAR(MAX) = NULL,
    @SortType NVARCHAR(MAX) = NULL,
    @SkipCount INT = NULL,
    @MaxResultCount INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
 
    BEGIN TRY
        IF (@MaxResultCount IS NULL)
            SET @MaxResultCount = 10;
 
        IF (@SkipCount IS NULL)
            SET @SkipCount = 0;
 
        -- Main result set
        SELECT 
            SR.StoreName,
            SR.OwnerName,
            SR.OwnerSurname,
            SR.OwnerEmail,
            SR.StorerequestStatus
        FROM [Store].[StoreRequests] AS SR
        WHERE 
            SR.IsDeleted != 1
            AND (
                @Keyword IS NULL
                OR SR.StoreName LIKE @Keyword
                OR SR.OwnerName LIKE @Keyword
                OR SR.OwnerSurname LIKE @Keyword
                OR SR.OwnerEmail LIKE @Keyword
                OR SR.StorerequestStatus LIKE @Keyword
            )
        ORDER BY
            CASE WHEN @SortingCol = 'storeName' AND @SortType = 'asc' THEN SR.StoreName END,
            CASE WHEN @SortingCol = 'storeName' AND @SortType = 'desc' THEN SR.StoreName END DESC,
            CASE WHEN @SortingCol = 'ownerName' AND @SortType = 'asc' THEN SR.OwnerName END,
            CASE WHEN @SortingCol = 'ownerName' AND @SortType = 'desc' THEN SR.OwnerName END DESC,
            CASE WHEN @SortingCol = 'creationTime' AND @SortType = 'asc' THEN SR.CreationTime END,
            CASE WHEN @SortingCol = 'creationTime' AND @SortType = 'desc' THEN SR.CreationTime END DESC
 
        OFFSET @SkipCount ROWS FETCH NEXT @MaxResultCount ROWS ONLY;
 
        -- Count query
        SELECT COUNT(SR.Id) AS [Count]
        FROM [Store].[StoreRequests] AS SR
        WHERE 
            SR.IsDeleted != 1
            AND (
                @Keyword IS NULL
                OR SR.StoreName LIKE @Keyword
                OR SR.OwnerName LIKE @Keyword
                OR SR.OwnerSurname LIKE @Keyword
                OR SR.OwnerEmail LIKE @Keyword
                OR SR.StorerequestStatus LIKE @Keyword
            );
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