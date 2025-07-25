export interface CallBackViewModel {
    id : number;
    articleTitle : string;
    firstname : string;
    surname : string;
    email : string;
    date : string;
  }

  export class PagedCallBackResponse {
    success: boolean = false;
    callBack: CallBackViewModel[] = [];
    totalRecords: number = 0;
  }