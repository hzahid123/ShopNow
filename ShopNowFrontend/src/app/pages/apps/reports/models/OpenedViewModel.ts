export interface OpenedViewModel {
    id : number;
    email : string;
    lastOpened : string;
    count : number;
  }

  export class PagedOpenedResponse {
    success: boolean = false;
    opened: OpenedViewModel[] = [];
    totalRecords: number = 0;
  }