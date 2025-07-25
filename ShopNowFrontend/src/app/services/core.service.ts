import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppSettings, defaults, legaldefaults } from '../config';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  // get notify(): Observable<Record<string, any>> {
  //   return this.notify$.asObservable();
  // }
  
  // private options = defaults;

  // get options() {
  //   const clientType = localStorage.getItem('clientType')
  //   if(clientType == '1'){
  //     return defaults;
  //   } else if(clientType == '1'){
  //     return legaldefaults;
  //   }
  // }

  // private notify$ = new BehaviorSubject<Record<string, any>>({});

  // getOptions() {
  //   const clientType = localStorage.getItem('clientType')
  //   if(clientType == '1'){
  //     this.options = defaults;
  //   } else if(clientType == '1'){
  //     this.options = legaldefaults;
  //   }
  //   return this.options;
  // }

  // setOptions(options: AppSettings) {
  //   this.options = Object.assign(defaults, options);
  //   this.notify$.next(this.options);
  // }


  // getLanguage() {
  //   return this.options.language;
  // }

  // setLanguage(lang: string) {
  //   this.options.language = lang;
  //   this.notify$.next({ lang });
  // }

  private currentOptions = defaults;  // renamed to avoid conflict with getter

  private notify$ = new BehaviorSubject<Record<string, any>>({});

  get notify(): Observable<Record<string, any>> {
    return this.notify$.asObservable();
  }

  // Fixed getter with correct conditions
  get options() {
    const clientType = localStorage.getItem('clientType');
    if (clientType == '1') {
      return defaults;
    } else if (clientType == '2') {  // Assuming clientType '2' uses legaldefaults
      return legaldefaults;
    } else {
      return this.currentOptions;  // Default fallback
    }
  }

  getOptions() {
    return this.options;  // Leverage the getter for correct logic
  }

  setOptions(options: AppSettings) {
    this.currentOptions = Object.assign({}, defaults, options);  // Merge defaults with provided options
    this.notify$.next(this.currentOptions);
  }

  getLanguage() {
    return this.currentOptions.language;
  }

  setLanguage(lang: string) {
    this.currentOptions.language = lang;
    this.notify$.next({ lang });
  }
}
