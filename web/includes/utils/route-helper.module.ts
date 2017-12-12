import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';

@NgModule({
  imports:      [ CommonModule ],
  exports:      [ CommonModule ]
})
export class RouteHelper {

    constructor(private router: Router) { }

    private changes: any = [];

    // shared 'onRouteChange' function executing code each time route changes
    // this function will add a listener to the route change so that 'funct' is called
    // each time the route changes
    public onRouteChange(funct) {
      var params = this;
      this.changes.push({'funct' : funct, 'params' : params});
      this.router.events.filter(event => (event instanceof NavigationEnd)).subscribe((routeData: any) => {
        // Upon completition of route change, call our custom function
        funct(routeData);
      });
    }// end shared module function for setting an 'onRouteChange' event

    public routeChange(){
      // this function helps us explictly simulate/call the route change
      // function from any one of our components
      for(let i = 0; i < this.changes.length; i++){
        this.changes[i].funct(this.changes[i].params);
      }// end for loop over changes array
    }// end function routeChange()

 }// end class SharedModule