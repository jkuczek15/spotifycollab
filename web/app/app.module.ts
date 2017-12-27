// Required Modules
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Custom Modules
import { FormValidator } from '../includes/utils/form-validator.module';
import { RouteHelper } from '../includes/utils/route-helper.module';

// External Modules
import { Ng2PageScrollModule } from 'ng2-page-scroll';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ResponsiveModule, ResponsiveConfig } from 'ng2-responsive';
import { OnsenModule } from 'ngx-onsenui';

// Services
import { AuthService } from './auth/auth.service';
import { HttpClient } from '../includes/http-client.service'
import { WindowService } from '../includes/window.service'
import { DashboardService } from './dashboard/dashboard.service';
import { LibraryService } from './library/library.service';
import { SearchService } from './search/search.service';
import { QueueService } from './queue/queue.service';
import { FormService } from './form.service';

// Application Components
import { AppComponent } from './app.component';
import { NavbarComponent } from './common/navbar/navbar.component';
import { FooterComponent } from './common/footer/footer.component';
import { SidebarLeftComponent } from './common/sidebar-left/sidebar-left.component';
import { SidebarRightComponent } from './common/sidebar-right/sidebar-right.component';
import { TabbarComponent } from './tabbar/tabbar.component';

// Router Components
import { DashboardComponent } from './dashboard/dashboard.component';
import { QueueComponent } from './queue/queue.component';
import { LibraryComponent } from './library/library.component';
import { SearchComponent } from './search/search.component';

// Pipes
import { DerpPipe } from '../includes/derp.pipe';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap/typeahead/typeahead.module';

// Initalize all our routes to point to specific components
const appRoutes: Routes = [
  {
    path: '',
    component: AppComponent
  }
];

// Take invalid routes and redirect users to index
appRoutes.push({
  path: '**',
  redirectTo: '/'
});

@NgModule({
  declarations: [
    AppComponent,
    TabbarComponent,
    DashboardComponent,
    QueueComponent,
    TabbarComponent,
    SearchComponent,
    LibraryComponent,
    DerpPipe,
  ],
  imports: [
    BrowserModule,
    OnsenModule,
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
    FormService,
    HttpClient,
    LibraryService,
    SearchService,
    QueueService,
    WindowService
  ],
  bootstrap: [AppComponent],
  exports: [
    DerpPipe
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
  entryComponents: [
    DashboardComponent,
    QueueComponent,
    LibraryComponent,
    SearchComponent
  ]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule)
.catch(err => console.error(err));