import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'Clientfront';

  ngOnInit(){
    localStorage.setItem('clientType' , '1')
  }

  changeColors() {
    this.setThemeColors('#cc0000', '#000000');  // Example of changing the colors
  }
  // $primary: #cc0000;
  setThemeColors(primaryColor: string, secondaryColor: string) {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', primaryColor);
    root.style.setProperty('--secondary-color', secondaryColor);
  }
}
