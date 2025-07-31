import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

interface DropdownOption {
  name: string;
  code: string;
}

interface ShippingAddress {
  country: string;
  contactName: string;
  mobileNumber: string;
  streetAddress: string;
  aptSuite: string;
  state: string;
  district: string;
  city: string;
  zipCode: string;
  setAsDefault: boolean;
}

@Component({
  selector: 'app-shipping-address',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    InputTextModule
  ],
  templateUrl: './shipping-address.component.html',
  styleUrls: ['./shipping-address.component.scss']
})
export class ShippingAddressComponent {

  shippingAddress: ShippingAddress = {
    country: 'PK',
    contactName: '',
    mobileNumber: '',
    streetAddress: '',
    aptSuite: '',
    state: '',
    district: '',
    city: '',
    zipCode: '',
    setAsDefault: false
  };

  selectedCountryCode: string = '+92';

  countries: DropdownOption[] = [
    { name: 'Pakistan', code: 'PK' },
    { name: 'Kuwait', code: 'KW' },
    { name: 'United States', code: 'US' },
    { name: 'United Kingdom', code: 'GB' },
    { name: 'India', code: 'IN' },
    { name: 'Canada', code: 'CA' }
  ];

  countryDialCodes: { [key: string]: string } = {
    PK: '+92',
    KW: '+965',
    US: '+1',
    GB: '+44',
    IN: '+91',
    CA: '+1'
  };

  states: DropdownOption[] = [
    { name: 'Azad Kashmir', code: 'AK' },
    { name: 'Punjab', code: 'PB' },
    { name: 'Sindh', code: 'SD' },
    { name: 'Khyber Pakhtunkhwa', code: 'KP' },
    { name: 'Balochistan', code: 'BA' },
    { name: 'Gilgit-Baltistan', code: 'GB' },
    { name: 'Al Asimah', code: 'AA' }, // Kuwait states
    { name: 'Hawalli', code: 'HW' }
  ];

  districts: DropdownOption[] = [
    { name: 'Athmuqam', code: 'ATH' },
    { name: 'Muzaffarabad', code: 'MZD' },
    { name: 'Mirpur', code: 'MIR' },
    { name: 'Kotli', code: 'KOT' },
    { name: 'Bhimber', code: 'BHI' },
    { name: 'Rawalakot', code: 'RAW' }
  ];

  cities: DropdownOption[] = [
    { name: 'Athmuqam', code: 'ATH' },
    { name: 'Sharda', code: 'SHA' },
    { name: 'Kel', code: 'KEL' },
    { name: 'Taobat', code: 'TAO' },
    { name: 'Dowarian', code: 'DOW' }
  ];

  constructor() {}

  ngOnInit(): void {
    this.selectedCountryCode = this.countryDialCodes[this.shippingAddress.country];
  }

  onCountryChange(event: any): void {
    const selectedCode = event.value;
    this.selectedCountryCode = this.countryDialCodes[selectedCode] || '';
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      console.log('Shipping Address Submitted:', this.shippingAddress);
      alert('Shipping address confirmed successfully!');
    }
  }

  onCancel(): void {
    this.resetForm();
    console.log('Form cancelled');
  }

  private isFormValid(): boolean {
    return !!(
      this.shippingAddress.country &&
      this.shippingAddress.contactName &&
      this.shippingAddress.mobileNumber &&
      this.shippingAddress.streetAddress &&
      this.shippingAddress.state &&
      this.shippingAddress.district &&
      this.shippingAddress.city &&
      this.shippingAddress.zipCode
    );
  }

  private resetForm(): void {
    this.shippingAddress = {
      country: 'PK',
      contactName: '',
      mobileNumber: '',
      streetAddress: '',
      aptSuite: '',
      state: '',
      district: '',
      city: '',
      zipCode: '',
      setAsDefault: false
    };
    this.selectedCountryCode = this.countryDialCodes['PK'];
  }
}
