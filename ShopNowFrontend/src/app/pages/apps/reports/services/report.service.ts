import { Injectable } from '@angular/core';
import { commonURLs } from 'src/app/services/enum.service';
import { HttpService } from 'src/app/services/http.service';
import {
  GetArticlesReportRequest,
  PagedArticlesReportResponse,
} from '../models/ArticlesReportViewModel';
import { Observable } from 'rxjs';
import { PagedSentToResponse } from '../models/SentToViewModel';
import { PagedDeliveredResponse } from '../models/DeliveredViewModel';
import { PagedOpenedResponse } from '../models/OpenedViewModel';
import { PagedUniqueClicksResponse } from '../models/UniqueClicksViewModel';
import { PagedUniqueUserClicksResponse } from '../models/UniqueUserClicksViewModel';
import { PagedStatusBouncedResponse } from '../models/StatusBouncedViewModel';
import { PagedStatusUnOpenedResponse } from '../models/StatusUnOpenedViewModel';
import { PagedFailedResponse } from '../models/FailedViewModel';
import { PagedUnsubscribedResponse } from '../models/UnsubscribedViewModel';
import { PagedCallBackResponse } from '../models/CallBackViewModel';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private readonly baseDomain = commonURLs.Api;
  private readonly baseUrl = this.baseDomain + '/api/clients';

  ArticlesReportData = [
    {
      articleID: 1,
      articleTitle: 'title',
      description: '(dest)',
      Recieved: 1,
      openRate: 1,
      callBacks: 1,
      readMore: 1,
      interest: '0%',
    },
  ];
  SentTodata = [
    {
      id: 1,
      email: 'test@gmail.com',
    },
  ];
  Delivereddata = [
    {
      id: 1,
      email: 'test@gmail.com',
    },
  ];
  Openeddata = [
    {
      id: 1,
      email: 'test@gmail.com',
      lastOpened: '01/01/2024',
      count: 2,
    },
  ];
  UniqueClicksdata = [
    {
      id: 1,
      articleTitle: 'article',
      email: 'test@gmail.com',
      lastOpened: '01/01/2024',
      count: 2,
    },
  ];
  UniqueUserClicksdata = [
    {
      id: 1,
      email: 'test@gmail.com',
      lastOpened: '01/01/2024',
      count: 2,
    },
  ];
  StatusBounceddata = [
    {
      id: 1,
      totalBounces: 4,
      softBounces: 2,
      hardBounces: 6,
      othersBounces: 10,
      email: 'test@gmail.com',
      emailSubject: 'Subject',
      type: 'hard',
      description: 'description of email',
    },
  ];
  StatusUnOpeneddata = [
    {
      id: 1,
      email: 'test@gmail.com',
    },
  ];
  Faileddata = [
    {
      id: 1,
      email: 'test@gmail.com',
      message: 'message',
    },
  ];
  Unsubscribeddata = [
    {
      id: 1,
      email: 'test@gmail.com',
      unsubscribedDate: '01/01/2024',
    },
  ];
  CallBackdata = [
    {
      id: 1,
      articleTitle: 'title',
      firstname: 'adnan',
      surname: 'ilyas',
      email: 'test@gmail.com',
      date: '01/01/2024',
    },
  ];

  constructor(private httpService: HttpService) {}

  getArticlesReport(
    request: GetArticlesReportRequest
  ): Observable<PagedArticlesReportResponse> {
    return this.httpService.get<PagedArticlesReportResponse>(
      this.baseUrl,
      undefined,
      undefined,
      { page: request.pageNumber ?? 0, size: request.pageSize ?? 0 }
    );
  }

  getSentToReport(): Observable<PagedSentToResponse> {
    return this.httpService.get<PagedSentToResponse>(
      this.baseUrl,
      undefined,
      undefined
    );
  }

  getDeliveredReport(): Observable<PagedDeliveredResponse> {
    return this.httpService.get<PagedDeliveredResponse>(
      this.baseUrl,
      undefined,
      undefined
    );
  }

  getOpenedReport(): Observable<PagedOpenedResponse> {
    return this.httpService.get<PagedOpenedResponse>(
      this.baseUrl,
      undefined,
      undefined
    );
  }

  getUniqueClicksReport(): Observable<PagedUniqueClicksResponse> {
    return this.httpService.get<PagedUniqueClicksResponse>(
      this.baseUrl,
      undefined,
      undefined
    );
  }

  getUniqueUserClicksReport(): Observable<PagedUniqueUserClicksResponse> {
    return this.httpService.get<PagedUniqueUserClicksResponse>(
      this.baseUrl,
      undefined,
      undefined
    );
  }

  getStatusBouncedReport(): Observable<PagedStatusBouncedResponse> {
    return this.httpService.get<PagedStatusBouncedResponse>(
      this.baseUrl,
      undefined,
      undefined
    );
  }

  getStatusUnOpenedReport(): Observable<PagedStatusUnOpenedResponse> {
    return this.httpService.get<PagedStatusUnOpenedResponse>(
      this.baseUrl,
      undefined,
      undefined
    );
  }

  getFailedReport(): Observable<PagedFailedResponse> {
    return this.httpService.get<PagedFailedResponse>(
      this.baseUrl,
      undefined,
      undefined
    );
  }

  getUnsubscribedReport(): Observable<PagedUnsubscribedResponse> {
    return this.httpService.get<PagedUnsubscribedResponse>(
      this.baseUrl,
      undefined,
      undefined
    );
  }

  getCallBackReport(): Observable<PagedCallBackResponse> {
    return this.httpService.get<PagedCallBackResponse>(
      this.baseUrl,
      undefined,
      undefined
    );
  }
}
