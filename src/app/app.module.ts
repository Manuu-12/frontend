import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { NonAuthenticatedGuard } from './guards/non-authenticated.guard';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MachineApiTrackerInterceptor } from './interceptors/machinery-api-tracker.interceptor';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
    ComponentsModule,
    
    
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    { // <--- THIS IS THE MISSING PART! ADD THIS BLOCK!
      provide: HTTP_INTERCEPTORS,
      useClass: MachineApiTrackerInterceptor,
      multi: true // Essential for having more than one interceptor
    },
    AuthenticatedGuard,
    NonAuthenticatedGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }