export interface StatusBouncedViewModel {
    id : number;
    totalBounces: number;
    softBounces: number;
    hardBounces: number;
    othersBounces: number;
    email : string;
    emailSubject : string;
    type : string;
    description : string;
  }

  export class PagedStatusBouncedResponse {
    success: boolean = false;
    statusBounced: StatusBouncedViewModel[] = [];
    totalRecords: number = 0;
  }