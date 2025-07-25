import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeSharedModule } from 'src/app/shared/PrimeShared.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module'

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [PrimeSharedModule,CommonModule, SharedModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent {
  isEditing = false;

  profile = {
    nickname: 'ae378333 user',
    gender: '',
    birthday: '',
    email: 'nabihasaqib1@gmail.com',
    emailConfirmed: false,
    memberId: 'pk1395812105bidae',
    address: 'Pakistan',
    zip: '',
    tel: '92',
    fax: '92',
  };

  fields = [
    { key: 'nickname', label: 'Nickname', inputType: 'text' },
    { key: 'gender', label: 'Gender', inputType: 'text' },
    { key: 'birthday', label: 'Birthday', inputType: 'date' },
    { key: 'email', label: 'Email Address', inputType: 'email' },
    { key: 'memberId', label: 'Member ID', inputType: 'text', type: 'readonly' },
    { key: 'address', label: 'Contact Address', inputType: 'text' },
    { key: 'zip', label: 'Zip/Postal Code', inputType: 'text' },
    { key: 'tel', label: 'Tel', inputType: 'text' },
    { key: 'fax', label: 'Fax', inputType: 'text' },
  ];

  toggleEdit() {
    this.isEditing = true;
  }

  saveProfile() {
    console.log('Profile saved:', this.profile);
    this.isEditing = false;
  }

  deleteAccount() {
  console.log('Delete selected clicked!');
  // Add logic if needed later
}
}
