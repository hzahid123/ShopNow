import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeSharedModule } from 'src/app/shared/PrimeShared.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module'


@Component({
  selector: 'upload-picture',
  templateUrl: './upload-picture.component.html',
  styleUrls: ['./upload-picture.component.scss'],
  standalone: true,
  imports: [PrimeSharedModule,CommonModule, SharedModule],
})
export class UploadPictureComponent {
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(private router: Router) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  upload() {
    if (this.selectedFile) {
      // Fake upload logic
      console.log('Uploading:', this.selectedFile.name);
      alert('Uploaded successfully!'); // just for demo
      this.router.navigate(['/settings']); // go back after upload
    }
  }

  cancel() {
    this.router.navigate(['/settings']);
  }
}
