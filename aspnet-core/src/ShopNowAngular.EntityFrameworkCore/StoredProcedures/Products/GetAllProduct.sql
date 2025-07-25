CREATE OR ALTER   PROCEDURE [product].[GetAllProducts]
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
 
        -- Main result query
        SELECT 
            P.Id,
            P.Name,
            P.Price,
            P.Description,
            P.StockQuantity,
            P.Dimensions,
            C.Name AS Category,
            SC.Name AS SubCategory,
            SSC.Name AS SubSubCategory
        FROM [product].[Products] AS P
        LEFT JOIN [Category].[Categories] AS C ON P.CategoryId = C.Id AND C.IsDeleted != 1
        LEFT JOIN [Category].[SubCategories] AS SC ON P.SubCategoryId = SC.Id AND SC.IsDeleted != 1
        LEFT JOIN [Category].[SubSubCategories] AS SSC ON P.SubSubCategoryId = SSC.Id AND SSC.IsDeleted != 1
        WHERE 
            P.IsDeleted != 1
            AND (
                @Keyword IS NULL
                OR P.Name LIKE @Keyword
                OR P.Description LIKE @Keyword
                OR P.Dimensions LIKE @Keyword
                OR C.Name LIKE @Keyword
                OR SC.Name LIKE @Keyword
                OR SSC.Name LIKE @Keyword
            )
        ORDER BY
            CASE WHEN @SortingCol = 'name' AND @SortType = 'asc' THEN P.Name END,
            CASE WHEN @SortingCol = 'name' AND @SortType = 'desc' THEN P.Name END DESC,
            CASE WHEN @SortingCol = 'price' AND @SortType = 'asc' THEN P.Price END,
            CASE WHEN @SortingCol = 'price' AND @SortType = 'desc' THEN P.Price END DESC,
            CASE WHEN @SortingCol = 'creationTime' AND @SortType = 'asc' THEN P.CreationTime END,
            CASE WHEN @SortingCol = 'creationTime' AND @SortType = 'desc' THEN P.CreationTime END DESC
 
        OFFSET @SkipCount ROWS FETCH NEXT @MaxResultCount ROWS ONLY;
 
        -- Count query
        SELECT COUNT(P.Id) AS [Count]
        FROM [product].[Products] AS P
        LEFT JOIN [Category].[Categories] AS C ON P.CategoryId = C.Id AND C.IsDeleted != 1
        LEFT JOIN [Category].[SubCategories] AS SC ON P.SubCategoryId = SC.Id AND SC.IsDeleted != 1
        LEFT JOIN [Category].[SubSubCategories] AS SSC ON P.SubSubCategoryId = SSC.Id AND SSC.IsDeleted != 1
        WHERE 
            P.IsDeleted != 1
            AND (
                @Keyword IS NULL
                OR P.Name LIKE @Keyword
                OR P.Description LIKE @Keyword
                OR P.Dimensions LIKE @Keyword
                OR C.Name LIKE @Keyword
                OR SC.Name LIKE @Keyword
                OR SSC.Name LIKE @Keyword
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