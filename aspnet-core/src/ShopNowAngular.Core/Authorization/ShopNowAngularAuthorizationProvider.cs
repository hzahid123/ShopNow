using Abp.Authorization;
using Abp.Localization;
using Abp.MultiTenancy;

namespace ShopNowAngular.Authorization
{
    public class ShopNowAngularAuthorizationProvider : AuthorizationProvider
    {
        public override void SetPermissions(IPermissionDefinitionContext context)
        {
            //..............................................USERS..........................................................................

            var usersPermission = context.CreatePermission(PermissionNames.Pages_Users, L("Users"));
            usersPermission.CreateChildPermission(PermissionNames.Permissions_Users_View, L("ViewUsers"));
            usersPermission.CreateChildPermission(PermissionNames.Permissions_Users_Create, L("CreateUsers"));
            usersPermission.CreateChildPermission(PermissionNames.Permissions_Users_Update, L("UpdateUsers"));
            usersPermission.CreateChildPermission(PermissionNames.Permissions_Users_Delete, L("DeleteUsers"));
            usersPermission.CreateChildPermission(PermissionNames.Permission_Users_Reset, L("ResetUsers"));

            //..............................................ROLES..........................................................................

            var rolesPermission = context.CreatePermission(PermissionNames.Pages_Roles, L("Roles"));
            rolesPermission.CreateChildPermission(PermissionNames.Permission_Roles_View, L("ViewRoles"));
            rolesPermission.CreateChildPermission(PermissionNames.Permission_Roles_Create, L("CreateRoles"));
            rolesPermission.CreateChildPermission(PermissionNames.Permission_Roles_Update, L("UpdateRoles"));
            rolesPermission.CreateChildPermission(PermissionNames.Permission_Roles_Delete, L("DeleteRoles"));

            //..............................................PRODUCTS..........................................................................

            var productsPermission = context.CreatePermission(PermissionNames.Pages_Products, L("Products"));
            productsPermission.CreateChildPermission(PermissionNames.Permissions_Products_View, L("ViewProducts"));
            productsPermission.CreateChildPermission(PermissionNames.Permissions_Products_Create, L("CreateProducts"));
            productsPermission.CreateChildPermission(PermissionNames.Permissions_Products_Update, L("UpdateProducts"));
            productsPermission.CreateChildPermission(PermissionNames.Permissions_Products_Delete, L("DeleteProducts"));

            // ..............................................CART..........................................................................

            var cartPermission = context.CreatePermission(PermissionNames.Pages_Cart, L("Cart"));
            cartPermission.CreateChildPermission(PermissionNames.Permissions_Cart_View, L("ViewCart"));
            cartPermission.CreateChildPermission(PermissionNames.Permissions_Cart_Create, L("CreateCart"));
            cartPermission.CreateChildPermission(PermissionNames.Permissions_Cart_Update, L("UpdateCart"));
            cartPermission.CreateChildPermission(PermissionNames.Permissions_Cart_Delete, L("DeleteCart"));

            // ..............................................CART ITEMS....................................................................

            var cartItemsPermission = context.CreatePermission(PermissionNames.Pages_CartItems, L("CartItems"));
            cartItemsPermission.CreateChildPermission(PermissionNames.Permissions_CartItems_View, L("ViewCartItems"));
            cartItemsPermission.CreateChildPermission(PermissionNames.Permissions_CartItems_Create, L("CreateCartItem"));
            cartItemsPermission.CreateChildPermission(PermissionNames.Permissions_CartItems_Update, L("UpdateCartItem"));
            cartItemsPermission.CreateChildPermission(PermissionNames.Permissions_CartItems_Delete, L("DeleteCartItem"));

            // ..............................................CATEGORY......................................................................

            var categoryPermission = context.CreatePermission(PermissionNames.Pages_Categories, L("Categories"));
            categoryPermission.CreateChildPermission(PermissionNames.Permissions_Categories_View, L("ViewCategories"));
            categoryPermission.CreateChildPermission(PermissionNames.Permissions_Categories_Create, L("CreateCategory"));
            categoryPermission.CreateChildPermission(PermissionNames.Permissions_Categories_Update, L("UpdateCategory"));
            categoryPermission.CreateChildPermission(PermissionNames.Permissions_Categories_Delete, L("DeleteCategory"));

            // ..............................................ORDERS........................................................................

            var orderPermission = context.CreatePermission(PermissionNames.Pages_Orders, L("Orders"));
            orderPermission.CreateChildPermission(PermissionNames.Permissions_Orders_View, L("ViewOrders"));
            orderPermission.CreateChildPermission(PermissionNames.Permissions_Orders_Create, L("CreateOrder"));
            orderPermission.CreateChildPermission(PermissionNames.Permissions_Orders_Update, L("UpdateOrder"));
            orderPermission.CreateChildPermission(PermissionNames.Permissions_Orders_Delete, L("DeleteOrder"));

            // ..............................................ORDER ITEMS...................................................................

            var orderItemsPermission = context.CreatePermission(PermissionNames.Pages_OrderItems, L("OrderItems"));
            orderItemsPermission.CreateChildPermission(PermissionNames.Permissions_OrderItems_View, L("ViewOrderItems"));
            orderItemsPermission.CreateChildPermission(PermissionNames.Permissions_OrderItems_Add, L("AddOrderItem"));
            orderItemsPermission.CreateChildPermission(PermissionNames.Permissions_OrderItems_Remove, L("RemoveOrderItem"));
            orderItemsPermission.CreateChildPermission(PermissionNames.Permissions_OrderItems_Update, L("UpdateOrderItem"));

            // ..............................................PAYMENTS......................................................................

            var paymentPermission = context.CreatePermission(PermissionNames.Pages_Payments, L("Payments"));
            paymentPermission.CreateChildPermission(PermissionNames.Permissions_Payments_View, L("ViewPayments"));
            paymentPermission.CreateChildPermission(PermissionNames.Permissions_Payments_Create, L("CreatePayment"));
            paymentPermission.CreateChildPermission(PermissionNames.Permissions_Payments_Update, L("UpdatePayment"));
            paymentPermission.CreateChildPermission(PermissionNames.Permissions_Payments_Delete, L("DeletePayment"));

            // ..............................................STORES........................................................................

            var storePermission = context.CreatePermission(PermissionNames.Pages_Stores, L("Stores"));
            storePermission.CreateChildPermission(PermissionNames.Permissions_Stores_View, L("ViewStores"));
            storePermission.CreateChildPermission(PermissionNames.Permissions_Stores_Create, L("CreateStore"));
            storePermission.CreateChildPermission(PermissionNames.Permissions_Stores_Update, L("UpdateStore"));
            storePermission.CreateChildPermission(PermissionNames.Permissions_Stores_Delete, L("DeleteStore"));

            // ..............................................STORE REQUESTS...................................................................

            var storeRequestPermission = context.CreatePermission(PermissionNames.Pages_StoreRequests, L("StoreRequests"));
            storeRequestPermission.CreateChildPermission(PermissionNames.Permissions_StoreRequests_View, L("ViewStoreRequests"));
            storeRequestPermission.CreateChildPermission(PermissionNames.Permissions_StoreRequests_Create, L("CreateStoreRequest"));
            storeRequestPermission.CreateChildPermission(PermissionNames.Permissions_StoreRequests_Update, L("UpdateStoreRequest"));
            storeRequestPermission.CreateChildPermission(PermissionNames.Permissions_StoreRequests_Delete, L("DeleteStoreRequest"));
            storeRequestPermission.CreateChildPermission(PermissionNames.Permissions_StoreRequests_Approve, L("ApproveStoreRequest"));
            storeRequestPermission.CreateChildPermission(PermissionNames.Permissions_StoreRequests_Reject, L("RejectStoreRequest"));

            // ..............................................SUB CATEGORY...................................................................

            var subCategoryPermission = context.CreatePermission(PermissionNames.Pages_SubCategories, L("SubCategories"));
            subCategoryPermission.CreateChildPermission(PermissionNames.Permissions_SubCategories_View, L("ViewSubCategories"));
            subCategoryPermission.CreateChildPermission(PermissionNames.Permissions_SubCategories_Create, L("CreateSubCategory"));
            subCategoryPermission.CreateChildPermission(PermissionNames.Permissions_SubCategories_Update, L("UpdateSubCategory"));
            subCategoryPermission.CreateChildPermission(PermissionNames.Permissions_SubCategories_Delete, L("DeleteSubCategory"));

            // ..............................................SUB SUB CATEGORY................................................................

            var subSubCategoryPermission = context.CreatePermission(PermissionNames.Pages_SubSubCategories, L("SubSubCategories"));
            subSubCategoryPermission.CreateChildPermission(PermissionNames.Permissions_SubSubCategories_View, L("ViewSubSubCategories"));
            subSubCategoryPermission.CreateChildPermission(PermissionNames.Permissions_SubSubCategories_Create, L("CreateSubSubCategory"));
            subSubCategoryPermission.CreateChildPermission(PermissionNames.Permissions_SubSubCategories_Update, L("UpdateSubSubCategory"));
            subSubCategoryPermission.CreateChildPermission(PermissionNames.Permissions_SubSubCategories_Delete, L("DeleteSubSubCategory"));


            // ..............................................STORE FOLLOWER................................................................
            var storeFollowerPermission = context.CreatePermission(PermissionNames.Pages_StoreFollowers, L("StoreFollowers"));
            storeFollowerPermission.CreateChildPermission(PermissionNames.Permissions_StoreFollowers_View, L("ViewStoreFollowers"));
            storeFollowerPermission.CreateChildPermission(PermissionNames.Permissions_StoreFollowers_Create, L("CreateStoreFollower"));
            storeFollowerPermission.CreateChildPermission(PermissionNames.Permissions_StoreFollowers_Update, L("UpdateStoreFollower"));
            storeFollowerPermission.CreateChildPermission(PermissionNames.Permissions_StoreFollowers_Delete, L("DeleteStoreFollower"));


            // ..............................................WISHLIST ITEM................................................................
            var wishlistItemPermission = context.CreatePermission(PermissionNames.Pages_WishlistItems, L("WishlistItems"));
            wishlistItemPermission.CreateChildPermission(PermissionNames.Permissions_WishlistItems_View, L("ViewWishlistItems"));
            wishlistItemPermission.CreateChildPermission(PermissionNames.Permissions_WishlistItems_Create, L("CreateWishlistItem"));
            wishlistItemPermission.CreateChildPermission(PermissionNames.Permissions_WishlistItems_Update, L("UpdateWishlistItem"));
            wishlistItemPermission.CreateChildPermission(PermissionNames.Permissions_WishlistItems_Delete, L("DeleteWishlistItem"));

            // ..............................................PRODUCT REVIEW................................................................
            var productReviewPermission = context.CreatePermission(PermissionNames.Pages_ProductReviews, L("ProductReviews"));
            productReviewPermission.CreateChildPermission(PermissionNames.Permissions_ProductReviews_View, L("ViewProductReviews"));
            productReviewPermission.CreateChildPermission(PermissionNames.Permissions_ProductReviews_Create, L("CreateProductReview"));
            productReviewPermission.CreateChildPermission(PermissionNames.Permissions_ProductReviews_Update, L("UpdateProductReview"));
            productReviewPermission.CreateChildPermission(PermissionNames.Permissions_ProductReviews_Delete, L("DeleteProductReview"));


            context.CreatePermission(PermissionNames.Pages_Users_Activation, L("UsersActivation"));
            context.CreatePermission(PermissionNames.Pages_Tenants, L("Tenants"), multiTenancySides: MultiTenancySides.Host);
        }

        private static ILocalizableString L(string name)
        {
            return new LocalizableString(name, ShopNowAngularConsts.LocalizationSourceName);
        }
    }
}
