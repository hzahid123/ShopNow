 CREATE OR ALTER   PROCEDURE [dbo].[GetProductsByStoreIdPagedSorted]
    @StoreId UNIQUEIDENTIFIER,
    @Keyword NVARCHAR(MAX) = NULL,
    @SortingCol NVARCHAR(MAX) = NULL,
    @SortType NVARCHAR(MAX) = NULL,
    @SkipCount INT = NULL,
    @MaxResultCount INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- Default values if NULL
        IF (@MaxResultCount IS NULL)
            SET @MaxResultCount = 10;

        IF (@SkipCount IS NULL)
            SET @SkipCount = 0;

        -- Main result set with LEFT JOIN and safe LIKE
        SELECT 
            P.Id AS ProductId,
            P.Name AS ProductName,
            P.Description,
            P.Price,
            P.StockQuantity,
            P.CategoryId,
            P.SubCategoryId,
            P.SubSubCategoryId,
            P.StoreId,
            S.Name AS StoreName,
            P.CreationTime,
            P.IsDeleted,
            P.Dimensions
        FROM [product].[Products] AS P
        LEFT JOIN [Store].[stores] AS S ON P.StoreId = S.Id
        WHERE 
            P.IsDeleted != 1
            AND P.StoreId = @StoreId
            AND (
                @Keyword IS NULL
                OR P.Name LIKE '%' + @Keyword + '%'
                OR P.Description LIKE '%' + @Keyword + '%'
            )
        ORDER BY
            CASE WHEN @SortingCol = 'productName' AND @SortType = 'asc' THEN P.Name END ASC,
            CASE WHEN @SortingCol = 'productName' AND @SortType = 'desc' THEN P.Name END DESC,
            CASE WHEN @SortingCol = 'price' AND @SortType = 'asc' THEN P.Price END ASC,
            CASE WHEN @SortingCol = 'price' AND @SortType = 'desc' THEN P.Price END DESC,
            CASE WHEN @SortingCol = 'creationTime' AND @SortType = 'asc' THEN P.CreationTime END ASC,
            CASE WHEN @SortingCol = 'creationTime' AND @SortType = 'desc' THEN P.CreationTime END DESC,
            P.Name ASC  -- default sort fallback
        OFFSET @SkipCount ROWS FETCH NEXT @MaxResultCount ROWS ONLY;

        -- Count query (for pagination)
        SELECT COUNT(P.Id) AS [Count]
        FROM [product].[Products] AS P
        LEFT JOIN [Store].[stores] AS S ON P.StoreId = S.Id
        WHERE 
            P.IsDeleted != 1
            AND P.StoreId = @StoreId
            AND (
                @Keyword IS NULL
                OR P.Name LIKE '%' + @Keyword + '%'
                OR P.Description LIKE '%' + @Keyword + '%'
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
