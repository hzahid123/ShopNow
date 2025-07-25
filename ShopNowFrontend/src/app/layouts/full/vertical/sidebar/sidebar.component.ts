import {   
  Component,   
  EventEmitter,   
  Input,   
  OnInit,   
  Output,   
  ViewChild, 
} from '@angular/core'; 
import { BrandingComponent } from './branding.component'; 
import { TablerIconsModule } from 'angular-tabler-icons'; 
import { MaterialModule } from 'src/app/material.module'; 
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({   
  selector: 'app-sidebar',   
  standalone: true,   
  imports: [BrandingComponent, TablerIconsModule, MaterialModule],   
  templateUrl: './sidebar.component.html', 
}) 
export class SidebarComponent implements OnInit {   
  constructor(private router: Router) { }   
  
  @Input() showToggle = true;   
  @Output() toggleMobileNav = new EventEmitter<void>();   
  @Output() toggleCollapsed = new EventEmitter<void>();
  
  showSidebar = true;
  
  ngOnInit(): void {     
    this.checkRoute();
    
    // Subscribe to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkRoute();
    });
  }
  
  private checkRoute(): void {
    this.showSidebar = this.router.url !== '/home';
  }
}