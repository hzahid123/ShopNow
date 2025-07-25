CREATE OR ALTER PROCEDURE [dbo].[GetTotalCustomersByStore]
    @StoreId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- ? Single result: total distinct customers for this store
        SELECT COUNT(DISTINCT CustomerId) AS TotalCustomers
        FROM [Order].[Orders]
        WHERE StoreId = @StoreId AND IsDeleted = 0;
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
