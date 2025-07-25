export interface Category {
    id: string; // UUID hai, number nahi
    name: string;
  }
  
  export interface SubCategory {
    id: string;
    name: string;
    categoryId: string;
  }
  
  export interface SubSubCategory {
    id: string;
    name: string;
    subCategoryId: string;
  }