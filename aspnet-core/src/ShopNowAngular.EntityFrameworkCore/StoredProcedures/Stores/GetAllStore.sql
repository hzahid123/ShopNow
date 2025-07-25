 CREATE OR ALTER   PROCEDURE [Store].[GetAllStores]
    @Keyword NVARCHAR(MAX) = NULL,
    @SortingCol NVARCHAR(MAX) = NULL,
    @SortType NVARCHAR(MAX) = NULL,
    @SkipCount INT = NULL,
    @MaxResultCount INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
 
    BEGIN TRY
        -- Set default pagination values if parameters are null
        IF (@MaxResultCount IS NULL)
            SET @MaxResultCount = 10;
 
        IF (@SkipCount IS NULL)
            SET @SkipCount = 0;
 
        -- Main result set: Store details with owner information
        SELECT 
            S.Id,
            S.Name AS StoreName,
            U.Name AS OwnerFirstName,
            U.Surname AS OwnerSurname,
			U.EmailAddress
        FROM [Store].[stores] AS S
        LEFT JOIN [dbo].[AbpUsers] AS U ON S.OwnerId = U.Id
        WHERE 
            S.IsDeleted != 1
            AND (
                @Keyword IS NULL
                OR S.Name LIKE @Keyword
                OR U.Name LIKE @Keyword
                OR U.Surname LIKE @Keyword
            )
        ORDER BY
            CASE WHEN @SortingCol = 'storeName' AND @SortType = 'asc' THEN S.Name END,
            CASE WHEN @SortingCol = 'storeName' AND @SortType = 'desc' THEN S.Name END DESC,
            CASE WHEN @SortingCol = 'creationTime' AND @SortType = 'asc' THEN S.CreationTime END,
            CASE WHEN @SortingCol = 'creationTime' AND @SortType = 'desc' THEN S.CreationTime END DESC,
            CASE WHEN @SortingCol = 'ownerName' AND @SortType = 'asc' THEN U.Name END,
            CASE WHEN @SortingCol = 'ownerName' AND @SortType = 'desc' THEN U.Name END DESC
 
        OFFSET @SkipCount ROWS FETCH NEXT @MaxResultCount ROWS ONLY;
 
        -- Count query: Provides the total record count for pagination
        SELECT COUNT(S.Id) AS [Count]
        FROM [Store].[stores] AS S
        LEFT JOIN [dbo].[AbpUsers] AS U ON S.OwnerId = U.Id
        WHERE 
            S.IsDeleted != 1
            AND (
                @Keyword IS NULL
                OR S.Name LIKE @Keyword
                OR U.Name LIKE @Keyword
                OR U.Surname LIKE @Keyword
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