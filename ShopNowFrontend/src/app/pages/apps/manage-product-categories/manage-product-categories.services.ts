import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import { Category, SubCategory, SubSubCategory } from 'src/app/pages/apps/manage-product-categories/manage-product-categories.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoriesService {
  private apiUrl = `${environment.commonURLs.Api}`;

  constructor(private http: HttpClient) {}

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

}