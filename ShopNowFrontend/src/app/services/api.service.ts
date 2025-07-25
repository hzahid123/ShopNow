import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable, firstValueFrom } from 'rxjs';
import { Category, SubCategory, SubSubCategory } from 'src/app/pages/apps/manage-product-categories/manage-product-categories.model'
import { environment } from "src/environments/environment";

export interface AddToCartRequest {
  customerId: number;
  productId: string;  
  quantity: number;
}

export interface RecentStore {
  name: string;
  ownerId: string;
  creationTime: string;
}
export interface UpdateCartItemQuantityRequest {
  cartItemId: string;
  newQuantity: number;
}

export interface CartSummary {
  customerId: number;
  totalItems: number;
  totalAmount: number;
  cartItems: CartItem[];
  // Add other properties based on your API response
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  totalPrice: number;

}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = `${environment.commonURLs.Api}`;
  private authUrl = `${environment.commonURLs.Auth}`;

  constructor(private http: HttpClient) { }


  approveStoreRequest(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/User/ApproveStoreRequest?storeRequestId=${id}`, {});
  }
  // manage permissions apis
  getUsersPermissions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Role/GetAllPermissions`);
  }
  // manage roles apis
  getUsersRoles(keyword?: string): Observable<any> {
    if (keyword) {
      const params = { Keyword: keyword };
      return this.http.get(`${this.apiUrl}/Role/GetAll`, { params });
    } else {
      return this.http.get(`${this.apiUrl}/Role/GetAll`);
    }
  }

  // In your ApiService

  createRole(roleData: any) {
    return this.http.post(`${this.apiUrl}/Role/Create`, roleData);
  }

  updateRole(roleData: any) {
    return this.http.put(`${this.apiUrl}/Role/Update`, roleData);
  }

  deleteRole(id: number) {
    return this.http.delete(`${this.apiUrl}/Role/Delete?id=${id}`);
  }
  // manage users apis
  getUsers(keyword?: string): Observable<any> {
    // Check if keyword is empty, null, undefined, or just whitespace
    if (keyword && keyword.trim()) {
      const params = { Keyword: keyword.trim() };
      return this.http.get(`${this.apiUrl}/User/GetAllUsers`, { params });
    } else {
      // Return all users when keyword is empty or not provided
      return this.http.get(`${this.apiUrl}/User/GetAllUsers`);
    }
  }
  deleteUsers(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/User/Delete?id=${id}`);
  }

  editUser(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/User/Update`, data);
  }

  createUser(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/User/Create`, data);
  }

  // manage stores apis

  createShop(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Store/Create`, data);
  }

  getShops(keyword: string = ''): Observable<any> {
    if (keyword) {
      const params = { Keyword: keyword };
      return this.http.get(`${this.apiUrl}/Store/GetAllStores`, { params });
    } else {
      return this.http.get(`${this.apiUrl}/Store/GetAllStores`);
    }
  }


  deleteShop(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Store/Delete?id=${id}`);
  }

  updateShop(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/Store/Update`, data);
  }

  // manage product catgeories apis
  getCategoriesWithSubCategories(keyword?: string): Observable<Category[]> {
    console.log('API Service - Search keyword:', keyword);

    // Always fetch all data since backend filtering isn't working
    const categories$ = this.http.get<any>(`${this.apiUrl}/Category/GetAll`);
    const subCategories$ = this.http.get<any>(`${this.apiUrl}/SubCategory/GetAll`);
    const subSubCategories$ = this.http.get<any>(`${this.apiUrl}/SubSubCategory/GetAll`);

    return forkJoin([categories$, subCategories$, subSubCategories$]).pipe(
      map(([categoriesRes, subCategoriesRes, subSubCategoriesRes]) => {
        const allCategories = categoriesRes?.result?.items || categoriesRes?.items || categoriesRes || [];
        const allSubCategories = subCategoriesRes?.result?.items || subCategoriesRes?.items || subCategoriesRes || [];
        const allSubSubCategories = subSubCategoriesRes?.result?.items || subSubCategoriesRes?.items || subSubCategoriesRes || [];

        // Build hierarchical structure first
        allCategories.forEach((category: any) => {
          category.subCategories = allSubCategories.filter((subCat: any) => subCat.categoryId === category.id);
          category.subCategories.forEach((subCat: any) => {
            subCat.subSubCategories = allSubSubCategories.filter(
              (subSubCat: any) => subSubCat.subCategoryId === subCat.id
            );
          });
        });

        // Apply client-side filtering if keyword exists
        if (keyword && keyword.trim()) {
          const searchTerm = keyword.trim().toLowerCase();

          const filteredCategories = allCategories.filter((category: any) => {
            // Check if category name matches
            const categoryMatches = category.name.toLowerCase().includes(searchTerm);

            // Check if any subcategory matches
            const subCategoryMatches = category.subCategories.some((subCat: any) =>
              subCat.name.toLowerCase().includes(searchTerm)
            );

            // Check if any sub-subcategory matches
            const subSubCategoryMatches = category.subCategories.some((subCat: any) =>
              subCat.subSubCategories.some((subSubCat: any) =>
                subSubCat.name.toLowerCase().includes(searchTerm)
              )
            );

            return categoryMatches || subCategoryMatches || subSubCategoryMatches;
          });

          // For matching categories, also filter their subcategories and sub-subcategories
          filteredCategories.forEach((category: any) => {
            // Filter subcategories
            category.subCategories = category.subCategories.filter((subCat: any) => {
              const subCatMatches = subCat.name.toLowerCase().includes(searchTerm);
              const subSubCatMatches = subCat.subSubCategories.some((subSubCat: any) =>
                subSubCat.name.toLowerCase().includes(searchTerm)
              );

              // If subcategory matches or has matching sub-subcategories, keep it
              if (subCatMatches || subSubCatMatches) {
                // Filter sub-subcategories within this subcategory
                if (!subCatMatches) {
                  // If subcategory doesn't match but sub-subcategories do, filter them
                  subCat.subSubCategories = subCat.subSubCategories.filter((subSubCat: any) =>
                    subSubCat.name.toLowerCase().includes(searchTerm)
                  );
                }
                return true;
              }
              return false;
            });
          });


          return filteredCategories;
        }


        return allCategories;
      })
    );
  }

  createCategory(category: Category) { return this.http.post(`${this.apiUrl}/Category/Create`, category); }
  updateCategory(category: Category) { return this.http.put(`${this.apiUrl}/Category/Update`, category); }
  deleteCategory(id: string): Observable<any> { return this.http.delete(`${this.apiUrl}/Category/Delete?Id=${id}`); }

  createSubCategory(subCategory: SubCategory) { return this.http.post(`${this.apiUrl}/SubCategory/Create`, subCategory); }
  updateSubCategory(subCategory: SubCategory) { return this.http.put(`${this.apiUrl}/SubCategory/Update`, subCategory); }
  deleteSubCategory(id: string) { return this.http.delete(`${this.apiUrl}/SubCategory/Delete?Id=${id}`); }

  createSubSubCategory(subSubCategory: SubSubCategory) { return this.http.post(`${this.apiUrl}/SubSubCategory/Create`, subSubCategory); }
  updateSubSubCategory(subSubCategory: SubSubCategory) { return this.http.put(`${this.apiUrl}/SubSubCategory/Update`, subSubCategory); }
  deleteSubSubCategory(id: string) { return this.http.delete(`${this.apiUrl}/SubSubCategory/Delete?Id=${id}`); }

  // manage store request 

  getStoreRequests(): Observable<any> {
    return this.http.get(`${this.apiUrl}/StoreRequest/GetAll`);
  }

  createStoreRequest(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/StoreRequest/Create`, data);
  }


  getUserEntityByNameAndEmail(usernameAndEmail: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/User/GetUserEntityByNameAndEmail?usernameAndEmail=${usernameAndEmail}`);
  }

  getAuthCheck(userId: number): Observable<{ result: boolean; success: boolean }> {
    return this.http.get<{ result: boolean; success: boolean }>(
      `${this.apiUrl}/User/GetTwoFactorAuthCheck?userId=${userId}`
    );
  }

  authenticate(credentials: any, isTfa: boolean): Observable<any> {
    const url = isTfa ? `${this.authUrl}/TokenAuth/TwoFactorAuthentication` : `${this.authUrl}/TokenAuth/Authenticate`;
    return this.http.post(url, credentials);
  }


  addItemToCart(data: AddToCartRequest): Observable<any> {
    const url = `${this.apiUrl}/Cart/AddItemToCart`;
    return this.http.post(url, data);
  }

  // Clear entire cart
  clearCart(cartId: string): Observable<any> {
    const url = `${this.apiUrl}/Cart/ClearCart?cartId=${cartId}`;
    return this.http.post(url, { cartId });
  }

  // Remove specific item from cart
  removeItemFromCart(cartItemId: string): Observable<any> {
    const url = `${this.apiUrl}/Cart/RemoveItemFromCart?cartItemId=${cartItemId}`;
    return this.http.delete(url);
  }

  // Get cart summary
  getCartSummary(customerId: number): Observable<any> {
    const url = `${this.apiUrl}/Cart/GetCartSummary?customerId=${customerId}`;
    return this.http.get(url);
  }

  // Update cart item quantity
  updateCartItemQuantity(data: UpdateCartItemQuantityRequest): Observable<any> {
    const url = `${this.apiUrl}/Cart/UpdateCartItemQuantity`;
    return this.http.put(url, data);
  }

  addToWishlist(customerId: number, productId: string): Observable<any> {
    const url = `${this.apiUrl}/WishlistItem/AddToWishlist`;
    const requestBody = { customerId, productId };
    return this.http.post(url, requestBody);
  }

  removeFromWishlist(customerId: number, productId: string): Observable<any> {
    const url = `${this.apiUrl}/WishlistItem/RemoveFromWishlist`;
    const requestBody = { customerId, productId };
    return this.http.delete(url, { body: requestBody });
  }

  getWishlist(customerId: number): Observable<any> {
    const url = `${this.apiUrl}/WishlistItem/GetAll?customerId=${customerId}`;
    return this.http.get(url);
  }

  clearWishlist(customerId: number): Observable<any> {
    const url = `${this.apiUrl}/WishlistItem/ClearWishlist?customerId=${customerId}`;
    return this.http.post(url, { customerId });
  }
  getTotalSalesByStore(storeId: string): Observable<any> {
    const url = `${this.apiUrl}/Order/GetTotalSalesByStore?storeId=${storeId}`;
    return this.http.get(url);
  }
    getTotalWishlistItems(): Observable<number> {
  const url = `${this.apiUrl}/Product/GetTotalWishlistItems`;
  return this.http.get<any>(url).pipe(
    map(response => Number(response?.result?.[0]?.totalWishlistItems) || 0)
  );
}

getTotalPendingStoreRequests(): Observable<number> {
  const url = `${this.apiUrl}/StoreRequest/GetPendingStoreRequests`;
  return this.http.get<any>(url).pipe(
    map(response => Number(response?.result?.[0]?.pendingRequests) || 0)
  );
}
getTotalStoreFollowers(): Observable<number> {
  const url = `${this.apiUrl}/Store/GetTotalStoreFollowers`;
  return this.http.get<any>(url).pipe(
    map(response => Number(response?.result?.[0]?.totalStoreFollowed) || 0)
  );
}
getMonthlySalesAllStores(year: number): Observable<any> {
  const url = `${this.apiUrl}/Order/GetMonthlySalesAllStores?year=${year}`;
  return this.http.get(url);
}

getTopFollowedStores(limit?: number): Observable<any> {
  const url = limit 
    ? `${this.apiUrl}/Store/GetTopFollowedStores?limit=${limit}`
    : `${this.apiUrl}/Store/GetTopFollowedStores`;
  return this.http.get(url);
}
getTopSellingProducts(limit?: number): Observable<any> {
  const url = limit 
    ? `${this.apiUrl}/Order/GetTopSellingProducts?limit=${limit}`
    : `${this.apiUrl}/Order/GetTopSellingProducts`;
  return this.http.get(url);
}

  getTotalOrdersByStore(storeId: string): Observable<any> {
    const url = `${this.apiUrl}/Order/GetTotalOrdersByStore?storeId=${storeId}`;
    return this.http.get(url);
  }
  getTotalCustomersByStore(storeId: string): Observable<any> {
    const url = `${this.apiUrl}/Order/GetTotalCustomersByStore?storeId=${storeId}`;
    return this.http.get(url);
  }
  getRecentOrdersByStore(storeId: string, limit: number): Observable<any[]> {
    const url = `${this.apiUrl}/Order/GetRecentOrdersByStore?storeId=${storeId}&limit=${limit}`;
    return this.http.get<any[]>(url);
  }
  getTopProductsByStore(storeId: string, limit: number): Observable<any[]> {
    const url = `${this.apiUrl}/Product/GetTopProductsByStore?storeId=${storeId}&limit=${limit}`;
    return this.http.get<any[]>(url);
  }
  getMonthlySalesByStore(storeId: string, year: number): Observable<any> {
    const url = `${this.apiUrl}/Order/GetMonthlySalesByStore?storeId=${storeId}&year=${year}`;
    return this.http.get(url);
  }
  getOrderCountByStatus(storeId: string): Observable<any> {
    const url = `${this.apiUrl}/Order/GetOrderCountByStatus?storeId=${storeId}`;
    return this.http.get(url);
  }
  getTotalStores(): Observable<number> {
    const url = `${this.apiUrl}/Store/GetTotalStores`;
    return this.http.get<any>(url).pipe(
      map(response => Number(response?.result?.[0]?.totalStores) || 0)
    );
  }
  getTotalUsers(): Observable<number> {
    const url = `${this.apiUrl}/User/GetTotalUsers`;
    return this.http.get<any>(url).pipe(
      map(response => Number(response?.result?.[0]?.totalUsers) || 0)
    );
  }
  getTotalSales(): Observable<number> {
    const url = `${this.apiUrl}/order/GetTotalSales`;
    return this.http.get<any>(url).pipe(
      map(response => Number(response?.result?.[0]?.totalSales) || 0)
    );
  }
  getTotalOrders(): Observable<number> {
    const url = `${this.apiUrl}/order/GetTotalOrders`;
    return this.http.get<any>(url).pipe(
      map(response => Number(response?.result?.[0]?.totalOrders) || 0)
    );
  }

  createOrder(data: any): Observable<any> {
    const url = `${this.apiUrl}/Order/CreateOrder`;
    return this.http.post(url, data);
  }

  getproductbycategory(categoryId: string): Observable<any> {
    const url = `${this.apiUrl}/Product/GetProductsByCategory?categoryId=${categoryId}`;
    return this.http.get(url);
  }


getRecentStores(limit?: number): Observable<any> {
  const url = limit 
    ? `${this.apiUrl}/Store/GetRecentStores?Limit=${limit}`
    : `${this.apiUrl}/Store/GetRecentStores`;
    
  return this.http.get(url);
}
getRecentUnapprovedReviews(limit?: number): Observable<any> {
  const url = limit 
    ? `${this.apiUrl}/Product/GetRecentUnapprovedReviews?Limit=${limit}`
    : `${this.apiUrl}/Product/GetRecentUnapprovedReviews`;
  
  return this.http.get(url);
}
getTotalOrderCountByStatus(): Observable<any> {
  const url = `${this.apiUrl}/Order/GetTotalOrderCountByStatus`;
  return this.http.get(url);
}
getTopStoresBySales(limit?: number): Observable<any> {
  const url = limit 
    ? `${this.apiUrl}/Store/GetTopStoresBySales?Limit=${limit}`
    : `${this.apiUrl}/Store/GetTopStoresBySales`;
    
  return this.http.get(url);
}

getTopWishlistedProducts(limit?: number): Observable<any> {
  const url = limit 
    ? `${this.apiUrl}/Product/GetTopWishlistedProducts?Limit=${limit}`
    : `${this.apiUrl}/Product/GetTopWishlistedProducts`;
    
  return this.http.get(url);
}
submitProductReview(review: {storeId: string; customerId: number;productId: string;rating: number;reviewText: string;isApproved: boolean;}): Observable<any> {
  return this.http.post(
    `${this.apiUrl}/ProductReview/Create`,review
  );
}
getAllProductReviews(productId: string, isApproved: boolean = true) {
  return this.http.get<{ result: { items: any[] } }>(
    `${this.apiUrl}/ProductReview/GetAll`, {
      params: { ProductId: productId, IsApproved: isApproved }
    }
  );
}
getStoreById(storeId: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/Store/Get`, {
    params: { Id: storeId }
  });
}
getCustomerById(customerId: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/User/Get`, {
    params: { Id: customerId.toString() }
  });
}

}