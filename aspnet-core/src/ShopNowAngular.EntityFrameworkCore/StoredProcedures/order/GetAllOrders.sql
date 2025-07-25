CREATE OR ALTER   PROCEDURE [Order].[GetAllOrders]
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT 
            O.Id AS OrderId,
            U.Name + ' ' + ISNULL(U.Surname, '') AS UserName,
            S.Name AS StoreName,
            O.TotalAmount,
            O.OrderStatus,
            O.CreationTime,
            STRING_AGG(P.Name, ', ') AS ProductNames
        FROM [Order].[Orders] O
        LEFT JOIN [dbo].[AbpUsers] U ON O.UserId = U.Id AND U.IsDeleted != 1
        LEFT JOIN [Store].[stores] S ON O.StoreId = S.Id AND S.IsDeleted != 1
        LEFT JOIN [Order].[OrderItems] OI ON O.Id = OI.OrderId AND OI.IsDeleted != 1
        LEFT JOIN [product].[Products] P ON OI.ProductId = P.Id AND P.IsDeleted != 1
        WHERE O.IsDeleted != 1
        GROUP BY 
            O.Id, U.Name, U.Surname, S.Name, O.TotalAmount, O.OrderStatus, O.CreationTime
        ORDER BY O.CreationTime DESC;
    END TRY
    BEGIN CATCH
        SELECT 
            ERROR_NUMBER() AS ErrorNumber,
            ERROR_MESSAGE() AS ErrorMessage;
    END CATCH
END
