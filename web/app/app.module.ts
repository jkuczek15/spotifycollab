// Required Modules
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ResponsiveModule, ResponsiveConfig } from 'ng2-responsive';

// Custom Modules
import { FormValidator } from '../includes/utils/form-validator.module';
import { RouteHelper } from '../includes/utils/route-helper.module';

// External Modules (NPM)
import { Ng2PageScrollModule } from 'ng2-page-scroll';

// Services
import { AuthService } from './auth/auth.service';
import { HttpClient } from '../includes/http-client.service'
import { WindowService } from '../includes/window.service'
import { DashboardService } from './dashboard/dashboard.service';

// Main Application Components
import { AppComponent } from './app.component';
import { NavbarComponent } from './common/navbar/navbar.component';
import { FooterComponent } from './common/footer/footer.component';
import { SidebarLeftComponent } from './common/sidebar-left/sidebar-left.component';
import { SidebarRightComponent } from './common/sidebar-right/sidebar-right.component';
import { HomeComponent } from './home/home.component';

// Router Components
import { DashboardComponent } from './dashboard/dashboard.component';

// Pipes
import { DerpPipe } from '../includes/derp.pipe';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap/typeahead/typeahead.module';

// Initalize all our routes to point to specific components
const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
     path: 'dashboard',
     component: DashboardComponent
  }
];

// Take invalid routes and redirect users to index
appRoutes.push({
  path: '**',
  redirectTo: '/'
});

// Mobile responsive breakpoint configuration
let config = {
  breakPoints: {
      xs: {max: 600},
      sm: {min: 601, max: 959},
      md: {min: 960, max: 1279},
      lg: {min: 1280, max: 1919},
      xl: {min: 1920}
  },
  debounceTime: 100 // allow to debounce checking timer
};

export function ResponsiveDefinition(){ 
  return new ResponsiveConfig(config);
};

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    SidebarLeftComponent,
    SidebarRightComponent,
    HomeComponent,
    DashboardComponent,
    DerpPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(
      appRoutes
      // { enableTracing: true } // <-- debugging purposes only
    ),
    Ng2PageScrollModule.forRoot(),
    FormValidator,
    RouteHelper,
    NgbModule.forRoot(),
    ResponsiveModule
  ],
  providers: [
    AuthService,
    DashboardService,
    HttpClient,
    WindowService,
    {
      provide: ResponsiveConfig, 
      useFactory: ResponsiveDefinition 
    }
  ],
  bootstrap: [AppComponent],
  exports: [
    DerpPipe
  ]
})
export class AppModule { }