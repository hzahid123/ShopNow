import { M } from '@angular/cdk/keycodes';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DasboardServiceService {
  informailer = [
    {
      id: 1,
      img: 'assets/images/infomailer-dashboard/cus1.png',
      customerName: 'Demo Campaign - First',
      date: 'November 9, 2022 11:00AM',
      status: 'UNPAID',
    },
    {
      id: 1,
      img: 'assets/images/infomailer-dashboard/cus2.png',
      customerName: 'Mery Christmas & Happy New Year',
      date: 'November 9, 2022 11:00AM',
      status: 'SCHEDULED',
    },
    {
      id: 1,
      img: 'assets/images/infomailer-dashboard/cus3.png',
      customerName: 'Bank Holiday 19th September 2022',
      date: 'November 9, 2022 11:00AM',
      status: 'SCHEDULED',
    },
  ];

  fileAndSign=[
    {
      id:1,
      message: 'Message Content Here',
      company : 'Infomanagement',
      to : 'Oct 3, 2022',
      date : 'Oct 3, 2022',
      status : 'UNSOLVED'
    },
    {
      id:2,
      message: 'Message Content Here',
      company : 'Infomanagement',
      to : 'Oct 3, 2022',
      date : 'Oct 3, 2022',
      status : 'SCHEDULE'
    },
    {
      id:3,
      message: 'Message Content Here',
      company : 'Infomanagement',
      to : 'Oct 3, 2022',
      date : 'Oct 3, 2022',
      status : 'UNSOLVED'
    },
    {
      id:4,
      message: 'Message Content Here',
      company : 'Infomanagement',
      to : 'Oct 3, 2022',
      date : 'Oct 3, 2022',
      status : 'SCHEDULE'
    },
  ]

  infolearning= [ 
    {
      id:1,
      title:'Tutorial 301 - Anti Money Laundary for Tax Practitioners',
      status:'ACCOUNTIND STANDARDS'
    },
    {
      id:1,
      title:'Tutorial 300 - Data Protection Act 2018 (GDPR)',
      status:'BUSINESS'
    },
    {
      id:1,
      title:'Tutorial 802 - EU VAT e-commerce',
      status:'BUSINESS'
    },
    {
      id:1,
      title:'Tutorial 20 - Class 4 NIC',
      status:'NATIONAL INSURANCE & PENSIONS'
    },
    {
      id:1,
      title:'Tutorial 159 - Trading and property allowance',
      status:'INCOME TAX'
    },
  ]
  constructor() {}
}
