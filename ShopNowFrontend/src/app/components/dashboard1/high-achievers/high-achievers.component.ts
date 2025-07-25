import { Component } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-high-achievers',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './high-achievers.component.html',
  styleUrl: './high-achievers.component.scss'
})
export class HighAchieversComponent {

}
