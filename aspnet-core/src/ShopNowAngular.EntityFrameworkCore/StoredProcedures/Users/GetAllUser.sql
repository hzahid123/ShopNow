CREATE OR ALTER     PROCEDURE [dbo].[GetAllUsers]
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
            U.Id,
            U.Name,
            U.Surname,
            U.UserName,
            U.EmailAddress,
            U.IsActive,
            U.UserType
        FROM [dbo].[AbpUsers] AS U
        WHERE 
            U.IsDeleted != 1
            AND (
                @Keyword IS NULL
                OR U.Name LIKE @Keyword
                OR U.Surname LIKE @Keyword
                OR U.UserName LIKE @Keyword
                OR U.EmailAddress LIKE @Keyword
            )
        ORDER BY
            CASE WHEN @SortingCol = 'name' AND @SortType = 'asc' THEN U.Name END,
            CASE WHEN @SortingCol = 'name' AND @SortType = 'desc' THEN U.Name END DESC,
            CASE WHEN @SortingCol = 'username' AND @SortType = 'asc' THEN U.UserName END,
            CASE WHEN @SortingCol = 'username' AND @SortType = 'desc' THEN U.UserName END DESC,
            CASE WHEN @SortingCol = 'creationTime' AND @SortType = 'asc' THEN U.CreationTime END,
            CASE WHEN @SortingCol = 'creationTime' AND @SortType = 'desc' THEN U.CreationTime END DESC

        OFFSET @SkipCount ROWS FETCH NEXT @MaxResultCount ROWS ONLY;

        -- Count query
        SELECT COUNT(U.Id) AS [Count]
        FROM [dbo].[AbpUsers] AS U
        WHERE 
            U.IsDeleted != 1
            AND (
                @Keyword IS NULL
                OR U.Name LIKE @Keyword
                OR U.Surname LIKE @Keyword
                OR U.UserName LIKE @Keyword
                OR U.EmailAddress LIKE @Keyword
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