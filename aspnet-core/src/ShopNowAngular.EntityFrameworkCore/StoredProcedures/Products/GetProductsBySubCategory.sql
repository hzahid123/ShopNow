CREATE OR ALTER   PROCEDURE [product].[GetProductsBySubCategory] 
    @SubCategoryId   UNIQUEIDENTIFIER,
    @Keyword         NVARCHAR(MAX) = NULL,
    @SortingCol      NVARCHAR(MAX) = NULL,
    @SortType        NVARCHAR(MAX) = NULL,
    @SkipCount       INT = 0,
    @MaxResultCount  INT = 10
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
	    IF (@MaxResultCount IS NULL)
            SET @MaxResultCount = 10;

        IF (@SkipCount IS NULL)
            SET @SkipCount = 0;
        -- Main SELECT
        SELECT
            P.Id,
            P.Name,
            P.Price,
            P.Description,
            P.StockQuantity,
            P.Dimensions,
            C.Name  AS Category,
            SC.Name AS SubCategory,
            SSC.Name AS SubSubCategory
        FROM [product].[Products] P
        LEFT JOIN [Category].[Categories]       C   ON P.CategoryId       = C.Id
        LEFT JOIN [Category].[SubCategories]    SC  ON P.SubCategoryId    = SC.Id
        LEFT JOIN [Category].[SubSubCategories] SSC ON P.SubSubCategoryId = SSC.Id
        WHERE
            P.IsDeleted = 0
            AND P.SubCategoryId = @SubCategoryId
            AND (
                @Keyword IS NULL
                OR P.Name        LIKE @Keyword
                OR P.Description LIKE @Keyword
                OR P.Dimensions  LIKE @Keyword
            )
        ORDER BY
            CASE WHEN @SortingCol = 'name'         AND @SortType = 'asc'  THEN P.Name         END,
            CASE WHEN @SortingCol = 'name'         AND @SortType = 'desc' THEN P.Name         END DESC,
            CASE WHEN @SortingCol = 'price'        AND @SortType = 'asc'  THEN P.Price        END,
            CASE WHEN @SortingCol = 'price'        AND @SortType = 'desc' THEN P.Price        END DESC,
            CASE WHEN @SortingCol = 'creationTime' AND @SortType = 'asc'  THEN P.CreationTime END,
            CASE WHEN @SortingCol = 'creationTime' AND @SortType = 'desc' THEN P.CreationTime END DESC
        OFFSET @SkipCount ROWS
        FETCH NEXT @MaxResultCount ROWS ONLY;

        -- Count
        SELECT COUNT(*) AS [Count]
        FROM [product].[Products] P
        WHERE
            P.IsDeleted = 0
            AND P.SubCategoryId = @SubCategoryId
            AND (
                @Keyword IS NULL
                OR P.Name        LIKE @Keyword
                OR P.Description LIKE @Keyword
                OR P.Dimensions  LIKE @Keyword
            );
    END TRY
    BEGIN CATCH
        SELECT ERROR_MESSAGE() AS ErrorMessage;
    END CATCH
END

