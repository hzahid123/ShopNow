export interface UnsubscribedViewModel {
    id : number;
    email : string;
    unsubscribedDate : string;
  }

  export class PagedUnsubscribedResponse {
    success: boolean = false;
    unsubscribed: UnsubscribedViewModel[] = [];
    totalRecords: number = 0;
  }