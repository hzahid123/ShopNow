export interface DeliveredViewModel {
    id : number;
    email : string;
  }

  export class PagedDeliveredResponse {
    success: boolean = false;
    delivered: DeliveredViewModel[] = [];
    totalRecords: number = 0;
  }