// src/app/main-layout/main-layout.component.ts
import { Component, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core'; // Add AfterViewInit and ChangeDetectorRef
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/header/header.component';
import { EditoriaComponent } from "../shared/editoria/editoria.component";
import { FooterComponent } from "../shared/footer/footer.component";

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    HeaderComponent,
    MatSidenavModule,
    MatListModule,
    CommonModule,
    EditoriaComponent,
    FooterComponent
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements AfterViewInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  @ViewChild('headerRef') headerRef!: HeaderComponent;

  // New local properties to hold the state from HeaderComponent
  isLoggedIn: boolean = false;
  canAccessPainelDeControle: boolean = false;
  idUsuario: string | undefined;

  constructor(private cdr: ChangeDetectorRef) {} // Inject ChangeDetectorRef

  ngAfterViewInit() {
    // This hook runs after the component's view and its child views (like headerRef)
    // have been initialized. Now, headerRef is guaranteed to be available.
    this.updateHeaderProperties();

    // Forces Angular to run another change detection cycle after we've updated
    // the properties. This prevents the "ExpressionChangedAfterItHasBeenCheckedError".
    this.cdr.detectChanges();
  }

  // Helper method to update the local properties from headerRef
  private updateHeaderProperties() {
    if (this.headerRef) {
      this.isLoggedIn = this.headerRef.isLoggedIn;
      // Ensure acessarPainelDeControle() is a pure function or property in HeaderComponent
      this.canAccessPainelDeControle = this.headerRef.isLoggedIn && this.headerRef.acessarPainelDeControle();
      this.idUsuario = this.headerRef.idUsuario != null ? String(this.headerRef.idUsuario) : undefined;
    }
  }
}