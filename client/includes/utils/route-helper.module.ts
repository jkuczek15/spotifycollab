import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';

@NgModule({
  imports:      [ CommonModule ],
  exports:      [ CommonModule ]
})
export class RouteHelper {

    constructor(private router: Router) { }

    // Shared 'onRouteChange' function executing code each time route changes
    public onRouteChange(funct) {
      this.router.events.filter(event => (event instanceof NavigationEnd)).subscribe((routeData: any) => {
        // Upon completition of route change, call our custom function
        funct(routeData);
      });
    }// end shared module function for setting an 'onRouteChange' event

 }// end class SharedModule