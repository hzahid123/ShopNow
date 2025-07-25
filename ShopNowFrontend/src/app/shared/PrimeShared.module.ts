import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { SplitButtonModule } from 'primeng/splitbutton';
import { DialogModule } from 'primeng/dialog';
import { FieldsetModule } from 'primeng/fieldset';
import { CarouselModule } from 'primeng/carousel';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogService } from 'src/app/services/confirm-dialog.service';
import { CalendarModule } from 'primeng/calendar';
import { ProgressBar } from 'primeng/progressbar';
import { ChipModule } from 'primeng/chip';
import { RatingModule } from 'primeng/rating';
import { GalleriaModule } from 'primeng/galleria';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FileUploadModule } from 'primeng/fileupload';
import { BadgeModule } from 'primeng/badge';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService } from 'primeng/api';
import { TreeModule } from 'primeng/tree';
import { EditorModule } from 'primeng/editor';





@NgModule({
  declarations: [],
  imports: [
    
    FieldsetModule,
    ToastModule,
    DialogModule,
    PaginatorModule,
    TableModule,
    MenuModule,
    ButtonModule,
    CheckboxModule,
    SplitButtonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule,
    DatePipe,
    RouterModule,
    CalendarModule,
    ProgressBarModule,
    FileUploadModule,
    BadgeModule,
    InputNumberModule,
    TreeModule,
    EditorModule,
  
  ],
  providers: [MessageService, ConfirmDialogService, ConfirmationService],
  exports: [
    CarouselModule,
    FieldsetModule,
    ToastModule,
    DialogModule,
    PaginatorModule,
    TableModule,
    MenuModule,
    ButtonModule,
    CheckboxModule,
    SplitButtonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule,
    DatePipe,
    RouterModule,
    ConfirmDialogModule,
    ChipModule,
    RatingModule, 
    GalleriaModule,
    InputNumberModule,
    DividerModule,
    CardModule,
    AvatarModule,
    BadgeModule,
    ProgressSpinnerModule,
    ProgressBar,
    CalendarModule,
    ProgressBarModule,
    FileUploadModule,
    BadgeModule,
    InputNumberModule,
    TreeModule,
    EditorModule,

  ],
})
export class PrimeSharedModule {}
