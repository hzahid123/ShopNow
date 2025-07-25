CREATE OR ALTER PROCEDURE [product].[GetProductsByCategory]
    @CategoryId      UNIQUEIDENTIFIER ,
    @Keyword         NVARCHAR(MAX)  = NULL,
    @SortingCol      NVARCHAR(MAX)  = NULL,
    @SortType        NVARCHAR(MAX)  = NULL,
    @SkipCount       INT            = 0,
    @MaxResultCount  INT            = 10
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- Set defaults if NULL
        IF (@MaxResultCount IS NULL)
            SET @MaxResultCount = 10;

        IF (@SkipCount IS NULL)
            SET @SkipCount = 0;

        -- Main SELECT query
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
        FROM [product].[Products]        P
        LEFT JOIN [Category].[Categories]       C   ON P.CategoryId       = C.Id    AND C.IsDeleted = 0
        LEFT JOIN [Category].[SubCategories]    SC  ON P.SubCategoryId    = SC.Id   AND SC.IsDeleted = 0
        LEFT JOIN [Category].[SubSubCategories] SSC ON P.SubSubCategoryId = SSC.Id  AND SSC.IsDeleted= 0
        WHERE
            P.IsDeleted = 0
            AND P.CategoryId = @CategoryId
            AND (
                @Keyword IS NULL
                OR P.Name        LIKE @Keyword
                OR P.Description LIKE @Keyword
                OR P.Dimensions  LIKE @Keyword
                OR C.Name        LIKE @Keyword
                OR SC.Name       LIKE @Keyword
                OR SSC.Name      LIKE @Keyword
            )
        ORDER BY
            CASE WHEN @SortingCol = 'name'         AND @SortType = 'asc'  THEN P.Name         END,
            CASE WHEN @SortingCol = 'name'         AND @SortType = 'desc' THEN P.Name         END DESC,
            CASE WHEN @SortingCol = 'price'        AND @SortType = 'asc'  THEN P.Price        END,
            CASE WHEN @SortingCol = 'price'        AND @SortType = 'desc' THEN P.Price        END DESC,
            CASE WHEN @SortingCol = 'creationTime' AND @SortType = 'asc'  THEN P.CreationTime END,
            CASE WHEN @SortingCol = 'creationTime' AND @SortType = 'desc' THEN P.CreationTime END DESC
        OFFSET @SkipCount      ROWS
        FETCH NEXT @MaxResultCount ROWS ONLY;

        -- Count query
        SELECT COUNT(*) AS [Count]
        FROM [product].[Products] P
        WHERE
            P.IsDeleted    = 0
            AND P.CategoryId = @CategoryId
            AND (
                @Keyword IS NULL
                OR P.Name        LIKE @Keyword
                OR P.Description LIKE @Keyword
                OR P.Dimensions  LIKE @Keyword
            );
    END TRY

    BEGIN CATCH
        -- Error handling block
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        DECLARE @ErrorLine INT = ERROR_LINE();
        DECLARE @ErrorProcedure NVARCHAR(128) = ERROR_PROCEDURE();

        RAISERROR(
            'Error in procedure [product].[GetProductsByCategory]: %s (Procedure: %s, Line: %d)',
            @ErrorSeverity,
            @ErrorState,
            @ErrorMessage,
            @ErrorProcedure,
            @ErrorLine
        );
    END CATCH
END