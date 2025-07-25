CREATE OR ALTER   PROCEDURE [dbo].[GetMonthlySalesAllStores]
    @Year INT 
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT
            MONTH(O.CreationTime) AS MonthNumber,
            DATENAME(MONTH, O.CreationTime) AS MonthName,
            SUM(OI.Quantity * OI.UnitPrice) AS TotalSales
        FROM [Order].[Orders] O
        JOIN [Order].[OrderItems] OI ON O.Id = OI.OrderId
        WHERE YEAR(O.CreationTime) = @Year AND O.IsDeleted = 0
        GROUP BY MONTH(O.CreationTime), DATENAME(MONTH, O.CreationTime)
        ORDER BY MonthNumber;
    END TRY
    BEGIN CATCH
        SELECT 
            ERROR_NUMBER() AS ErrorNumber,
            ERROR_MESSAGE() AS ErrorMessage;
    END CATCH
END
