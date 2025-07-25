export interface UniqueUserClicksViewModel {
    id : number;
    email : string;
    lastOpened : string;
    count : number;
  }

  export class PagedUniqueUserClicksResponse {
    success: boolean = false;
    iniqueUserClicks: UniqueUserClicksViewModel[] = [];
    totalRecords: number = 0;
  }