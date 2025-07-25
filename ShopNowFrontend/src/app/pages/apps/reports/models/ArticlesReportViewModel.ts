export class PagedRequest {
    pageNumber: number = 1;
    pageSize: number = 10;
    searchQuery?: string = '';
  }

export interface ArticlesReportViewModel {
    articleID : number;
    articleTitle : string;
    description : string;
    Recieved: number;
    openRate: number;
    callBacks: number;
    readMore: number;
    interest: string;
  }

  export class GetArticlesReportRequest extends PagedRequest {
    // Additional filters for clients if needed
  }
  
  export class PagedArticlesReportResponse {
    success: boolean = false;
    articlesReport: ArticlesReportViewModel[] = [];
    totalRecords: number = 0;
  }