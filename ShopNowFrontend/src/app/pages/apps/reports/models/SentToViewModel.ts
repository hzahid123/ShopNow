export interface SentToViewModel {
    id : number;
    email : string;
  }

  export class PagedSentToResponse {
    success: boolean = false;
    sentTo: SentToViewModel[] = [];
    totalRecords: number = 0;
  }