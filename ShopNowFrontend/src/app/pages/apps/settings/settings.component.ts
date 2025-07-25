// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { SharedModule } from 'src/app/shared/shared.module';
// import { PrimeSharedModule } from 'src/app/shared/PrimeShared.module';


// @Component({
//   selector: 'settings',
//   standalone: true,
//   imports: [SharedModule, CommonModule, PrimeSharedModule],
//   templateUrl: './settings.component.html',
//   styleUrl: './settings.component.scss'
// })
// export class SettingsComponent {

//   editProfile() {
//     console.log("Edit profile clicked");
//   }

//   // deleteAccount() {
//   //   console.log('Delete account clicked');
//   // }

//   // changeEmail() {
//   //   console.log('Change email clicked');
//   // }

//   // changePassword() {
//   //   console.log('Change password clicked');
//   // }

//   // activateNotifications() {
//   //   console.log('Activate notifications clicked');
//   // }

//   // linkMessenger() {
//   //   console.log('Link Messenger clicked');
//   // }

// deleteAccount() {
//   console.log("Deleting account from UploadPictureComponent");
// }

// changeEmail() {
//   console.log("Changing email from UploadPictureComponent");
// }

// changePassword() {
//   console.log("Changing password from UploadPictureComponent");
// }

// activateNotifications() {
//   console.log("Activating notifications from UploadPictureComponent");
// }

// linkMessenger() {
//   console.log("Linking Messenger from UploadPictureComponent");
// }


// }

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { PrimeSharedModule } from 'src/app/shared/PrimeShared.module';
import { Router } from '@angular/router';



@Component({
  selector: 'settings',
  standalone: true,
  imports: [SharedModule, CommonModule, PrimeSharedModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

  constructor( private router: Router) {}
  uploadPicture() {
    console.log('Upload picture clicked');
  }


  editProfile() {
    console.log("Edit profile clicked");
  }

  // deleteAccount() {
  //   this.snackBar.open('Your account is deleted', 'Close', {
  //     duration: 3000,
  //     panelClass: ['snackbar-delete']
  //   });
  // }
deleteAccount() {
  // Remove the token/session
  sessionStorage.removeItem('accessToken');

  // Optional: remove user data
  localStorage.removeItem('user');

  // Show deleted msg
  // this.snackBar.open('Your account is deleted', 'Close', {
  //   duration: 3000,
  //   panelClass: ['snackbar-delete']
  // });

  // Redirect to signup page after snackbar
  setTimeout(() => {
    this.router.navigate(['authentication/authentication/login']);
  }, 3000);
}

  changeEmail() {
    this.router.navigate(['/authentication/authentication/update-email']);
  }

 changePassword() {
  this.router.navigate(['/authentication/authentication/reset-password']);
}

  activateNotifications() {
   this.router.navigate(['/apps/activate-email']);

  }

  linkMessenger() {
    console.log("Linking Messenger from SettingsComponent");
  }

}

