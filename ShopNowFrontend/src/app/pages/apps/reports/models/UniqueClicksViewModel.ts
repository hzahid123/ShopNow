export interface UniqueClicksViewModel {
    id : number;
    articleTitle :string;
    email : string;
    lastOpened : string;
    count : number;
  }

  export class PagedUniqueClicksResponse {
    success: boolean = false;
    uniqueClicks: UniqueClicksViewModel[] = [];
    totalRecords: number = 0;
  }