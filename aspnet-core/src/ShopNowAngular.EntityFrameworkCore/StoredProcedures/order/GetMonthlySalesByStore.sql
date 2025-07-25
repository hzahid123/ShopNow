CREATE OR ALTER PROCEDURE [dbo].[GetMonthlySalesByStore]
    @StoreId UNIQUEIDENTIFIER,
    @Year INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT 
            MONTH(O.CreationTime) AS MonthNumber,
            DATENAME(MONTH, O.CreationTime) AS MonthName,
            SUM(OI.Quantity * OI.UnitPrice) AS TotalSales
        FROM [Order].[OrderItems] AS OI
        JOIN [Order].[Orders] AS O ON O.Id = OI.OrderId
        JOIN [product].[Products] AS P ON P.Id = OI.ProductId
        WHERE 
            P.StoreId = @StoreId 
            AND YEAR(O.CreationTime) = @Year
            AND O.IsDeleted = 0
        GROUP BY MONTH(O.CreationTime), DATENAME(MONTH, O.CreationTime)
        ORDER BY MonthNumber;
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
