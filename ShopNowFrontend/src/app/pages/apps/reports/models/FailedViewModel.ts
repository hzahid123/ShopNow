export interface FailedViewModel {
    id : number;
    email : string;
    message : string;
  }

  export class PagedFailedResponse {
    success: boolean = false;
    failed: FailedViewModel[] = [];
    totalRecords: number = 0;
  }