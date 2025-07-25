export interface StatusUnOpenedViewModel {
    id : number;
    email : string;
  }

  export class PagedStatusUnOpenedResponse {
    success: boolean = false;
    statusUnOpened: StatusUnOpenedViewModel[] = [];
    totalRecords: number = 0;
  }