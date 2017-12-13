webpackJsonp(["main"],{

/***/ "../../../../../web/$$_gendir lazy recursive":
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "../../../../../web/$$_gendir lazy recursive";

/***/ }),

/***/ "../../../../../web/app/app.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "/* Main parent flex class */\r\n.flex-container {\r\n  padding: 0;\r\n  margin: 0;\r\n  list-style: none;\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex; /* or inline-flex */\r\n  -webkit-box-orient: horizontal;\r\n  -webkit-box-direction: normal;\r\n      -ms-flex-direction: row;\r\n          flex-direction: row;\r\n  -webkit-box-pack: start;\r\n      -ms-flex-pack: start;\r\n          justify-content: flex-start;\r\n}\r\n\r\n/* Flex item class */\r\n.item {\r\n  -webkit-box-flex: 1;\r\n      -ms-flex-positive: 1;\r\n          flex-grow: 1; /* default 0 */\r\n}\r\n\r\n/* Sidebar flex item */\r\n.item-sidebar {\r\n  margin-left: 5px;\r\n  max-width: 450px;\r\n  height: 100%;\r\n  -webkit-box-flex: 0.075;\r\n      -ms-flex-positive: 0.075;\r\n          flex-grow: 0.075; /* default 0 */\r\n}\r\n\r\n/* Flex the height and width of main content */\r\n.row.content-flex {\r\n   height: auto;\r\n   overflow: hidden;\r\n}\r\n\r\n/* Apply right sidebar background */\r\n.sidenav {\r\n  background-color: #f1f1f1;\r\n  height: 640px; \r\n}\r\n\r\n/* Flexbox item spacing */\r\n.item-spacing {\r\n  padding-right: 40px;\r\n}\r\n\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../web/app/app.component.html":
/***/ (function(module, exports) {

module.exports = "<app-navbar></app-navbar>\r\n\r\n<div class=\"flex-container container-fluid row content-flex\">\r\n  <div class=\"item-sidebar\" *ngIf=\"show_sidebar_left\">\r\n    <app-sidebar-left></app-sidebar-left>\r\n  </div>\r\n  <div class=\"item-spacing\" *ngIf=\"show_item_spacing\"></div>\r\n  <div class=\"item\">\r\n    <router-outlet></router-outlet>\r\n  </div>\r\n  <div class=\"item-spacing\" *ngIf=\"show_item_spacing\"></div>\r\n  <div class=\"item-sidebar sidenav\" *ngIf=\"show_sidebar_right\">\r\n    <app-sidebar-right></app-sidebar-right>\r\n  </div>\r\n</div>\r\n\r\n<app-footer></app-footer>"

/***/ }),

/***/ "../../../../../web/app/app.component.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var router_1 = __webpack_require__("../../../router/@angular/router.es5.js");
var route_helper_module_1 = __webpack_require__("../../../../../web/includes/utils/route-helper.module.ts");
var auth_service_1 = __webpack_require__("../../../../../web/app/auth/auth.service.ts");
var ng2_page_scroll_1 = __webpack_require__("../../../../ng2-page-scroll/ng2-page-scroll.js");
var AppComponent = (function () {
    function AppComponent(router, routeControl, authentication) {
        this.router = router;
        this.routeControl = routeControl;
        this.authentication = authentication;
        // Boolean variables to keep track if we are displaying certain elements
        this.show_sidebar_left = true;
        this.show_sidebar_right = true;
        this.show_item_spacing = false;
        ng2_page_scroll_1.PageScrollConfig.defaultScrollOffset = 40;
        ng2_page_scroll_1.PageScrollConfig.defaultDuration = 350; // anchor link scroll speed
    } // end appComponent constructor
    AppComponent.prototype.ngOnInit = function () {
        var self = this;
        // check if we have a new user in the url parameters
        var user = this.getHashParams();
        // TODO, this needs to be validated much better
        if (Object.keys(user).length !== 0 || user.constructor !== Object) {
            this.authentication.saveUser(user);
        } // end if we have valid hash params
        // List of URL's to determine if we are showing/hiding certain elements
        this.hiddenUrls = {
            no_item_spacing: ['/', '/login', '/register'],
            no_sidebar_right: ['/', '/login', '/register', '/dashboard'],
            no_sidebar_left: []
        };
        // Function to be called each time the route changes
        this.routeControl.onRouteChange(function () {
            // scroll to the top of the page
            window.scrollTo(0, 0);
            // grab the current URL
            var url = self.router.url;
            if (self.authentication.loggedIn()) {
                // user is logged in, determine when to show sidebars
                self.displayHandler(url, 'show_sidebar_left');
            }
            else {
                // hide the left sidebar if the user is not logged in
                self.show_sidebar_left = false;
            } // end if the user is logged in, show the sidebar
            self.displayHandler(url, 'show_item_spacing');
            self.displayHandler(url, 'show_sidebar_right');
        });
    }; // end ngOninit function
    AppComponent.prototype.displayHandler = function (url, key) {
        // handler for hiding certain components
        var hiddenUrls = this.hiddenUrls[key.replace('show', 'no')];
        if (hiddenUrls.length === 0) {
            // if we have a length of 0, we want to show this everywhere
            this[key] = true;
            return;
        } // end if hiddenUrls.length == 0
        for (var _i = 0, hiddenUrls_1 = hiddenUrls; _i < hiddenUrls_1.length; _i++) {
            var str = hiddenUrls_1[_i];
            // for loop over all routes to hide
            if (url !== '/' && str !== '/') {
                this[key] = url.indexOf(str) == -1;
                if (!this[key]) {
                    break;
                } // end if
            }
            else if (url !== '/' && str === '/' && hiddenUrls.length === 1) {
                // we have the home page in our array of length 1
                this[key] = true;
            }
            else {
                this[key] = false;
            } // end if we are not on home page
        } // end for loop over no_sidebar_right
    }; // end function displayHandler
    /**
      * Obtains parameters from the hash of the URL
      * @return Object
    */
    AppComponent.prototype.getHashParams = function () {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g, q = window.location.hash.substring(1);
        while (e = r.exec(q)) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
    }; // end function getHashParams
    return AppComponent;
}()); // end class AppComponent
AppComponent = __decorate([
    core_1.Component({
        selector: 'app-root',
        template: __webpack_require__("../../../../../web/app/app.component.html"),
        styles: [__webpack_require__("../../../../../web/app/app.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof router_1.Router !== "undefined" && router_1.Router) === "function" && _a || Object, typeof (_b = typeof route_helper_module_1.RouteHelper !== "undefined" && route_helper_module_1.RouteHelper) === "function" && _b || Object, typeof (_c = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" && _c || Object])
], AppComponent);
exports.AppComponent = AppComponent;
var _a, _b, _c;
//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ "../../../../../web/app/app.module.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Required Modules
var platform_browser_1 = __webpack_require__("../../../platform-browser/@angular/platform-browser.es5.js");
var forms_1 = __webpack_require__("../../../forms/@angular/forms.es5.js");
var http_1 = __webpack_require__("../../../http/@angular/http.es5.js");
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var router_1 = __webpack_require__("../../../router/@angular/router.es5.js");
// Custom Modules
var form_validator_module_1 = __webpack_require__("../../../../../web/includes/utils/form-validator.module.ts");
var route_helper_module_1 = __webpack_require__("../../../../../web/includes/utils/route-helper.module.ts");
// External Modules (NPM)
var ng2_page_scroll_1 = __webpack_require__("../../../../ng2-page-scroll/ng2-page-scroll.js");
// Services
var auth_service_1 = __webpack_require__("../../../../../web/app/auth/auth.service.ts");
var chat_service_1 = __webpack_require__("../../../../../web/app/common/chat/chat.service.ts");
var http_client_service_1 = __webpack_require__("../../../../../web/includes/http-client.service.ts");
var window_service_1 = __webpack_require__("../../../../../web/includes/window.service.ts");
var dashboard_service_1 = __webpack_require__("../../../../../web/app/dashboard/dashboard.service.ts");
// Main Application Components
var app_component_1 = __webpack_require__("../../../../../web/app/app.component.ts");
var navbar_component_1 = __webpack_require__("../../../../../web/app/common/navbar/navbar.component.ts");
var footer_component_1 = __webpack_require__("../../../../../web/app/common/footer/footer.component.ts");
var sidebar_left_component_1 = __webpack_require__("../../../../../web/app/common/sidebar-left/sidebar-left.component.ts");
var sidebar_right_component_1 = __webpack_require__("../../../../../web/app/common/sidebar-right/sidebar-right.component.ts");
var home_component_1 = __webpack_require__("../../../../../web/app/home/home.component.ts");
var chat_component_1 = __webpack_require__("../../../../../web/app/common/chat/chat.component.ts");
// Router Components
var dashboard_component_1 = __webpack_require__("../../../../../web/app/dashboard/dashboard.component.ts");
// Pipes
var derp_pipe_1 = __webpack_require__("../../../../../web/includes/derp.pipe.ts");
// Initalize all our routes to point to specific components
var appRoutes = [
    {
        path: '',
        component: home_component_1.HomeComponent
    },
    {
        path: 'dashboard',
        component: dashboard_component_1.DashboardComponent
    }
];
// Take invalid routes and redirect users to index
appRoutes.push({
    path: '**',
    redirectTo: '/'
});
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        declarations: [
            app_component_1.AppComponent,
            chat_component_1.ChatComponent,
            navbar_component_1.NavbarComponent,
            footer_component_1.FooterComponent,
            sidebar_left_component_1.SidebarLeftComponent,
            sidebar_right_component_1.SidebarRightComponent,
            home_component_1.HomeComponent,
            dashboard_component_1.DashboardComponent,
            derp_pipe_1.DerpPipe
        ],
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            forms_1.ReactiveFormsModule,
            http_1.HttpModule,
            router_1.RouterModule.forRoot(appRoutes
            // { enableTracing: true } // <-- debugging purposes only
            ),
            ng2_page_scroll_1.Ng2PageScrollModule.forRoot(),
            form_validator_module_1.FormValidator,
            route_helper_module_1.RouteHelper
        ],
        providers: [
            auth_service_1.AuthService,
            chat_service_1.ChatService,
            dashboard_service_1.DashboardService,
            http_client_service_1.HttpClient,
            window_service_1.WindowService
        ],
        bootstrap: [app_component_1.AppComponent],
        exports: [
            derp_pipe_1.DerpPipe
        ]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ "../../../../../web/app/auth/auth.service.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var http_1 = __webpack_require__("../../../http/@angular/http.es5.js");
var window_service_1 = __webpack_require__("../../../../../web/includes/window.service.ts");
var router_1 = __webpack_require__("../../../router/@angular/router.es5.js");
var route_helper_module_1 = __webpack_require__("../../../../../web/includes/utils/route-helper.module.ts");
var environment_1 = __webpack_require__("../../../../../web/environments/environment.ts");
__webpack_require__("../../../../rxjs/_esm5/add/operator/map.js");
var AuthService = (function () {
    function AuthService(http, winRef, router, routeControl) {
        this.http = http;
        this.winRef = winRef;
        this.router = router;
        this.routeControl = routeControl;
        this.debugLogout = false;
        this.window = winRef.nativeWindow;
    }
    AuthService.prototype.saveUser = function (user) {
        this.window.sessionStorage['user'] = JSON.stringify(user || null);
    }; // end function saveUser
    AuthService.prototype.getUser = function () {
        return JSON.parse(this.window.sessionStorage['user'] || null);
    }; // end function getUser
    AuthService.prototype.getUserID = function () {
        // returns the spotify id of the user
        var user = this.getUser();
        return user['id'] || null;
    }; // end function getUserID
    AuthService.prototype.getToken = function () {
        var user = this.getUser();
        return user['access_token'] || null;
    }; // end function getToken
    AuthService.prototype.loggedIn = function () {
        // determine if the current user is logged in
        return this.getUser() != null;
    }; // end function loggedIn
    AuthService.prototype.logout = function () {
        // log the user out by removing them from session
        if (!environment_1.environment.production) {
            this.debugLogout = true;
        } // end if we are not in production environment
        window.sessionStorage.removeItem('user');
        this.routeControl.routeChange();
        this.router.navigateByUrl('/');
    }; // end function logout
    AuthService.prototype.requireLogin = function () {
        // Include this at the top of 'ngOnInit' to require login
        if (!this.loggedIn()) {
            // user is not logged in, send them to the login page with an error
            this.storedURL = this.router.url;
            this.routeControl.routeChange();
            this.router.navigateByUrl('/');
        } // end if the user is not logged in
    }; // end function to simpfy required login logic
    AuthService.prototype.redirectIfLoggedIn = function (url) {
        // Redirect a user to 'url' if they are logged in
        if (this.loggedIn()) {
            this.router.navigateByUrl(url);
            // scroll to the top of the page
            this.window.scrollTo(0, 0);
        } // end if the user is logged in
    }; // end function to redirect the user if they are logged in
    return AuthService;
}()); // end class AuthService
AuthService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof http_1.Http !== "undefined" && http_1.Http) === "function" && _a || Object, typeof (_b = typeof window_service_1.WindowService !== "undefined" && window_service_1.WindowService) === "function" && _b || Object, typeof (_c = typeof router_1.Router !== "undefined" && router_1.Router) === "function" && _c || Object, typeof (_d = typeof route_helper_module_1.RouteHelper !== "undefined" && route_helper_module_1.RouteHelper) === "function" && _d || Object])
], AuthService);
exports.AuthService = AuthService;
var _a, _b, _c, _d;
//# sourceMappingURL=auth.service.js.map

/***/ }),

/***/ "../../../../../web/app/common/chat/chat.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".chat\r\n{\r\n    list-style: none;\r\n    margin: 0;\r\n    padding: 0;\r\n}\r\n\r\n.chat li\r\n{\r\n    margin-bottom: 10px;\r\n    padding-bottom: 5px;\r\n    border-bottom: 1px dotted #B3A9A9;\r\n}\r\n\r\n.chat li.left .chat-body\r\n{\r\n    margin-left: 60px;\r\n}\r\n\r\n.chat li.right .chat-body\r\n{\r\n    margin-right: 60px;\r\n}\r\n\r\n\r\n.chat li .chat-body p\r\n{\r\n    margin: 0;\r\n    color: #777777;\r\n}\r\n\r\n.panel .slidedown .glyphicon, .chat .glyphicon\r\n{\r\n    margin-right: 5px;\r\n}\r\n\r\n.panel-body\r\n{\r\n    overflow-y: scroll;   \r\n}\r\n\r\n.joinroom\r\n{\r\n    height: 250px;\r\n}\r\n\r\n.messageroom\r\n{\r\n    height: 400px;\r\n}\r\n\r\n::-webkit-scrollbar-track\r\n{\r\n    box-shadow: inset 0 0 6px rgba(0,0,0,0.3);\r\n    background-color: #F5F5F5;\r\n}\r\n\r\n::-webkit-scrollbar\r\n{\r\n    width: 12px;\r\n    background-color: #F5F5F5;\r\n}\r\n\r\n::-webkit-scrollbar-thumb\r\n{\r\n    box-shadow: inset 0 0 6px rgba(0,0,0,.3);\r\n    background-color: #555;\r\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../web/app/common/chat/chat.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid\">\r\n    <div class=\"row\">\r\n        <div class=\"col-md-12\">\r\n            <div class=\"panel panel-primary\" *ngIf=\"joinned; else joinroom\">\r\n                <div class=\"panel-heading\">\r\n                    <span class=\"glyphicon glyphicon-comment\"></span> {{ msgData.room }}\r\n                    <div class=\"btn-group pull-right\">\r\n                        <button type=\"button\" class=\"btn btn-default btn-xs\" (click)=\"logout()\">\r\n                            Logout\r\n                        </button>\r\n                    </div>\r\n                </div>\r\n                <div #scrollMe class=\"panel-body messageroom\">\r\n                    <ul class=\"chat\">\r\n                        <li *ngFor=\"let c of chats\">\r\n                          <div class=\"left clearfix\" *ngIf=\"c.nickname===msgData.nickname; else rightchat\">\r\n                            <span class=\"chat-img pull-left\">\r\n                              <img src=\"http://placehold.it/50/55C1E7/fff&text=ME\" alt=\"User Avatar\" class=\"img-circle\" />\r\n                            </span>\r\n                            <div class=\"chat-body clearfix\">\r\n                                <div class=\"header\">\r\n                                    <strong class=\"primary-font\">{{ c.nickname }}</strong> <small class=\"pull-right text-muted\">\r\n                                        <span class=\"glyphicon glyphicon-time\"></span>{{ c.updated_at | date: 'medium' }}</small>\r\n                                </div>\r\n                                <p>{{ c.message }}</p>\r\n                            </div>\r\n                          </div>\r\n                          <ng-template #rightchat>\r\n                            <div class=\"right clearfix\">\r\n                              <span class=\"chat-img pull-right\">\r\n                                <img src=\"http://placehold.it/50/FA6F57/fff&text=U\" alt=\"User Avatar\" class=\"img-circle\" />\r\n                              </span>\r\n                              <div class=\"chat-body clearfix\">\r\n                                  <div class=\"header\">\r\n                                      <small class=\" text-muted\"><span class=\"glyphicon glyphicon-time\"></span>{{ c.updated_at | date: 'medium' }}</small>\r\n                                      <strong class=\"pull-right primary-font\">{{ c.nickname }}</strong>\r\n                                  </div>\r\n                                  <p>{{ c.message }}</p>\r\n                              </div>\r\n                            </div>\r\n                          </ng-template>\r\n                        </li>\r\n                    </ul>\r\n                </div>\r\n                <div class=\"panel-footer\">\r\n                  <form (ngSubmit)=\"sendMessage()\" #msgForm=\"ngForm\">\r\n                    <div class=\"input-group\">\r\n                        <input type=\"hidden\" [(ngModel)]=\"msgData.room\" name=\"room\" />\r\n                        <input type=\"hidden\" [(ngModel)]=\"msgData.nickname\" name=\"nickname\" />\r\n                        <input id=\"btn-input\" type=\"text\" [(ngModel)]=\"msgData.message\" name=\"message\" class=\"form-control input-sm\" placeholder=\"Type your message here...\" required=\"\" />\r\n                        <span class=\"input-group-btn\">\r\n                            <button class=\"btn btn-warning btn-sm\" id=\"btn-chat\">\r\n                                Send</button>\r\n                        </span>\r\n                    </div>\r\n                  </form>\r\n                </div>\r\n            </div>\r\n            <ng-template #joinroom>\r\n              <div class=\"panel panel-primary\">\r\n                <div class=\"panel-body joinroom\">\r\n                  <h1>Select Chat Room</h1>\r\n                  <form (ngSubmit)=\"joinRoom()\" #joinForm=\"ngForm\">\r\n                    <div class=\"form-group\">\r\n                      <input type=\"text\" class=\"form-control\" [(ngModel)]=\"newUser.nickname\" name=\"nickname\" placeholder=\"Nickname\" required />\r\n                    </div>\r\n                    <div class=\"form-group\">\r\n                      <select class=\"form-control\" [(ngModel)]=\"newUser.room\" name=\"room\" required>\r\n                        <option value=\"\" disabled selected hidden>Choose room...</option>\r\n                        <option value=\"Gaming\">Gaming</option>\r\n                        <option value=\"Programming\">Programming</option>\r\n                        <option value=\"Ideas\">Ideas</option>\r\n                        <option value=\"Random\">Random</option>\r\n                      </select>\r\n                    </div>\r\n                    <div class=\"form-group\">\r\n                      <button type=\"submit\" class=\"btn btn-primary btn-block\">Join</button>\r\n                    </div>\r\n                  </form>\r\n                </div>\r\n              </div>\r\n            </ng-template>\r\n        </div>\r\n    </div>\r\n</div>"

/***/ }),

/***/ "../../../../../web/app/common/chat/chat.component.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var chat_service_1 = __webpack_require__("../../../../../web/app/common/chat/chat.service.ts");
var auth_service_1 = __webpack_require__("../../../../../web/app/auth/auth.service.ts");
var io = __webpack_require__("../../../../socket.io-client/lib/index.js");
var ChatComponent = (function () {
    function ChatComponent(chatService, authentication) {
        this.chatService = chatService;
        this.authentication = authentication;
        this.joinned = false;
        this.newUser = { nickname: '', room: '' };
        this.msgData = { room: '', nickname: '', message: '' };
        this.socket = io('http://localhost:4000');
    }
    ChatComponent.prototype.ngOnInit = function () {
        var user = JSON.parse(localStorage.getItem("user"));
        this.chats = [];
        if (user) {
            //this.getChatByRoom(user.room);
            this.msgData = { room: user.room, nickname: user.nickname, message: '' };
            this.joinned = true;
            this.scrollToBottom();
        } // end if a user is already signed into chat
        if (this.authentication.loggedIn()) {
            var authUser = this.authentication.getUser();
            this.newUser = { room: '', nickname: authUser.username };
        } // end if we have a valid user in local storage
        this.socket.on('new-message', function (data) {
            var user = JSON.parse(localStorage.getItem("user"));
            if (user && data.message.room === user.room) {
                this.chats.push(data.message);
                this.msgData = { room: user.room, nickname: user.nickname, message: '' };
                this.scrollToBottom();
            } // end if we have a user and the rooms match
        }.bind(this));
    }; // end function ngOnInit
    ChatComponent.prototype.ngAfterViewChecked = function () {
        this.scrollToBottom();
    }; // end function ngAfterViewChecked
    ChatComponent.prototype.scrollToBottom = function () {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        }
        catch (err) { }
    }; // end function scrollToBottom
    ChatComponent.prototype.getChatByRoom = function (room) {
        var _this = this;
        this.chatService.getChatByRoom(room).then(function (res) {
            _this.chats = res;
        }, function (err) {
            console.log(err);
        });
    }; // end function getChatByRoom
    ChatComponent.prototype.joinRoom = function () {
        var date = new Date();
        localStorage.setItem("user", JSON.stringify(this.newUser));
        //this.getChatByRoom(this.newUser.room);
        this.msgData = { room: this.newUser.room, nickname: this.newUser.nickname, message: '' };
        this.joinned = true;
        this.socket.emit('save-message', { room: this.newUser.room, nickname: this.newUser.nickname, message: 'Join this room', updated_at: date });
    }; // end function joinRoom
    ChatComponent.prototype.sendMessage = function () {
        var _this = this;
        this.chatService.saveChat(this.msgData).then(function (result) {
            _this.socket.emit('save-message', result);
        }, function (err) {
            console.log(err);
        });
    }; // end function sendMessage
    ChatComponent.prototype.logout = function () {
        var date = new Date();
        var user = JSON.parse(localStorage.getItem("user"));
        this.socket.emit('save-message', { room: user.room, nickname: user.nickname, message: 'Left this room', updated_at: date });
        localStorage.removeItem("user");
        this.joinned = false;
    }; // end function logout
    return ChatComponent;
}()); // end class ChatComponent
__decorate([
    core_1.ViewChild('scrollMe'),
    __metadata("design:type", typeof (_a = typeof core_1.ElementRef !== "undefined" && core_1.ElementRef) === "function" && _a || Object)
], ChatComponent.prototype, "myScrollContainer", void 0);
ChatComponent = __decorate([
    core_1.Component({
        selector: 'app-chat',
        template: __webpack_require__("../../../../../web/app/common/chat/chat.component.html"),
        styles: [__webpack_require__("../../../../../web/app/common/chat/chat.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof chat_service_1.ChatService !== "undefined" && chat_service_1.ChatService) === "function" && _b || Object, typeof (_c = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" && _c || Object])
], ChatComponent);
exports.ChatComponent = ChatComponent;
var _a, _b, _c;
//# sourceMappingURL=chat.component.js.map

/***/ }),

/***/ "../../../../../web/app/common/chat/chat.service.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var http_1 = __webpack_require__("../../../http/@angular/http.es5.js");
__webpack_require__("../../../../rxjs/_esm5/add/operator/map.js");
var ChatService = (function () {
    function ChatService(http) {
        this.http = http;
    }
    ChatService.prototype.getChatByRoom = function (room) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get('https://api.spotify.com/v1/me/playlists')
                .map(function (res) { return res.json(); })
                .subscribe(function (res) {
                resolve(res);
            }, function (err) {
                reject(err);
            });
        });
    }; // end function getChatByRoom
    ChatService.prototype.saveChat = function (data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.post('/api/chat', data)
                .map(function (res) { return res.json(); })
                .subscribe(function (res) {
                resolve(res);
            }, function (err) {
                reject(err);
            });
        });
    }; // end function saveChat
    return ChatService;
}()); // end class ChatService
ChatService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof http_1.Http !== "undefined" && http_1.Http) === "function" && _a || Object])
], ChatService);
exports.ChatService = ChatService;
var _a;
//# sourceMappingURL=chat.service.js.map

/***/ }),

/***/ "../../../../../web/app/common/footer/footer.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "footer {\r\n  background-color:#292c2f;\r\n  box-shadow:0 1px 1px 0 rgba(0, 0, 0, 0.12);\r\n  box-sizing:border-box;\r\n  width:100%;\r\n  text-align:left;\r\n  font:bold 16px sans-serif;\r\n  padding:55px 50px;\r\n  bottom:0;\r\n  color:#fff;\r\n}\r\n\r\n.footer-navigation h3 {\r\n  margin:0;\r\n  font:normal 36px Cookie, cursive;\r\n  margin-bottom:20px;\r\n  color:#fff;\r\n}\r\n\r\n.footer-navigation h3 a {\r\n  text-decoration:none;\r\n  color:#fff;\r\n}\r\n\r\n.footer-navigation h3 span {\r\n  color:#5383d3;\r\n}\r\n\r\n.footer-navigation p.links a {\r\n  color:#fff;\r\n  text-decoration:none;\r\n}\r\n\r\n.footer-navigation p.company-name {\r\n  color:#8f9296;\r\n  font-size:14px;\r\n  font-weight:normal;\r\n  margin-top:20px;\r\n}\r\n\r\n@media (max-width:767px) {\r\n  .footer-contacts {\r\n    margin:30px 0;\r\n  }\r\n}\r\n\r\n.footer-contacts p {\r\n  display:inline-block;\r\n  color:#ffffff;\r\n  vertical-align:middle;\r\n}\r\n\r\n.footer-contacts p a {\r\n  color:#5383d3;\r\n  text-decoration:none;\r\n}\r\n\r\n.fa.footer-contacts-icon {\r\n  background-color:#33383b;\r\n  color:#fff;\r\n  font-size:18px;\r\n  width:38px;\r\n  height:38px;\r\n  border-radius:50%;\r\n  text-align:center;\r\n  line-height:38px;\r\n  margin:10px 15px 10px 0;\r\n}\r\n\r\nspan.new-line-span {\r\n  display:block;\r\n  font-weight:normal;\r\n  display:block;\r\n  font-weight:normal;\r\n  font-size:14px;\r\n  line-height:2;\r\n}\r\n\r\n.footer-about h4 {\r\n  display:block;\r\n  color:#fff;\r\n  font-size:14px;\r\n  font-weight:bold;\r\n  margin-bottom:20px;\r\n}\r\n\r\n.footer-about p {\r\n  line-height:20px;\r\n  color:#92999f;\r\n  font-size:13px;\r\n  font-weight:normal;\r\n  margin:0;\r\n}\r\n\r\ndiv.social-links {\r\n  margin-top:20px;\r\n  color:#fff;\r\n}\r\n\r\n.social-links a {\r\n  display:inline-block;\r\n  width:35px;\r\n  height:35px;\r\n  cursor:pointer;\r\n  background-color:#33383b;\r\n  border-radius:2px;\r\n  font-size:20px;\r\n  color:#ffffff;\r\n  text-align:center;\r\n  line-height:35px;\r\n  margin-right:5px;\r\n  margin-bottom:5px;\r\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../web/app/common/footer/footer.component.html":
/***/ (function(module, exports) {

module.exports = "<footer>\r\n  <div class=\"row\">\r\n      <div class=\"col-md-4 col-sm-6 footer-navigation\">\r\n          <h3><a href=\"#\">Company<span>logo </span></a></h3>\r\n          <p class=\"links\"><a href=\"#\">Home</a><strong> · </strong><a href=\"#\">Blog</a><strong> · </strong><a href=\"#\">Pricing</a><strong> · </strong><a href=\"#\">About</a><strong> · </strong><a href=\"#\">Faq</a><strong> · </strong><a href=\"#\">Contact</a></p>\r\n          <p class=\"company-name\">Nova Consulting © 2017 </p>\r\n      </div>\r\n      <div class=\"col-md-4 col-sm-6 footer-contacts\">\r\n          <div><span class=\"fa fa-map-marker footer-contacts-icon\"> </span>\r\n              <p><span class=\"new-line-span\">21 Revolution Street</span> Paris, France</p>\r\n          </div>\r\n          <div><i class=\"fa fa-phone footer-contacts-icon\"></i>\r\n              <p class=\"footer-center-info email text-left\"> +1 555 123456</p>\r\n          </div>\r\n          <div><i class=\"fa fa-envelope footer-contacts-icon\"></i>\r\n              <p> <a href=\"#\" target=\"_blank\">support@company.com</a></p>\r\n          </div>\r\n      </div>\r\n      <div class=\"clearfix visible-sm-block\"></div>\r\n      <div class=\"col-md-4 footer-about\">\r\n          <h4>About the company</h4>\r\n          <p> Lorem ipsum dolor sit amet, consectateur adispicing elit. Fusce euismod convallis velit, eu auctor lacus vehicula sit amet.\r\n          </p>\r\n          <div class=\"social-links social-icons\"><a href=\"#\"><i class=\"fa fa-facebook\"></i></a><a href=\"#\"><i class=\"fa fa-twitter\"></i></a><a href=\"#\"><i class=\"fa fa-linkedin\"></i></a><a href=\"#\"><i class=\"fa fa-github\"></i></a></div>\r\n      </div>\r\n  </div>\r\n</footer>"

/***/ }),

/***/ "../../../../../web/app/common/footer/footer.component.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var FooterComponent = (function () {
    function FooterComponent() {
    }
    FooterComponent.prototype.ngOnInit = function () {
    };
    return FooterComponent;
}());
FooterComponent = __decorate([
    core_1.Component({
        selector: 'app-footer',
        template: __webpack_require__("../../../../../web/app/common/footer/footer.component.html"),
        styles: [__webpack_require__("../../../../../web/app/common/footer/footer.component.css")]
    }),
    __metadata("design:paramtypes", [])
], FooterComponent);
exports.FooterComponent = FooterComponent;
//# sourceMappingURL=footer.component.js.map

/***/ }),

/***/ "../../../../../web/app/common/navbar/navbar.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".nav-main-wrapper {\r\n  text-align:left;\r\n  box-shadow:none;\r\n  border:none;\r\n  border-radius:0;\r\n  margin-bottom:0;\r\n  background:#010101;\r\n}\r\n\r\n.nav-main-wrapper .navbar-brand {\r\n  color:#FFF;\r\n  box-shadow:none;\r\n  text-transform:uppercase;\r\n  font-size:16px;\r\n}\r\n\r\n.nav-main-wrapper .navbar-brand:hover {\r\n  color:#FFF;\r\n  box-shadow:none;\r\n  opacity:0.8;\r\n}\r\n\r\n.nav-main-wrapper li {\r\n  float:none;\r\n  display:inline-block;\r\n}\r\n\r\n.nav-main-wrapper .navbar-nav > li > a {\r\n  text-shadow:none;\r\n  background:none;\r\n  text-transform:uppercase;\r\n  font-size:12px;\r\n  color:#9c9c9c;\r\n}\r\n\r\n.navbar-default .navbar-nav > li > a:focus, .navbar-default .navbar-nav > li > a:hover, .nav-main-wrapper .navbar-nav > .active > a, .nav-main-wrapper .navbar-nav > .open > a, .nav-main-wrapper .navbar-nav > .open > a:hover, .nav-main-wrapper .navbar-nav > .active > a:hover {\r\n  color:#fff;\r\n  background-color:transparent;\r\n  background-image:none;\r\n  box-shadow:none;\r\n}\r\n\r\n.nav-main-wrapper .navbar-nav > .active > a:after, .nav-main-wrapper .navbar-nav > .open > a:after {\r\n  opacity:1;\r\n  bottom:10px;\r\n}\r\n\r\n.nav-main-wrapper li a:hover, .nav-main-wrapper li a:active, .nav-main-wrapper li.active, .nav-main-wrapper li a:focus {\r\n  background-color:transparent;\r\n  background-image:none;\r\n  transition:all 320ms ease;\r\n}\r\n\r\n.nav-main-wrapper li a:after {\r\n  content:'';\r\n  position:absolute;\r\n  display:block;\r\n  left:15px;\r\n  right:15px;\r\n  bottom:0px;\r\n  height:2px;\r\n  background:#FFF;\r\n  opacity:0;\r\n}\r\n\r\n.nav-main-wrapper .navbar-toggle {\r\n  border:none;\r\n  color:#FFF;\r\n}\r\n\r\n.nav-main-wrapper .navbar-toggle .icon-bar {\r\n  opacity:1;\r\n  background-color:#FFF;\r\n}\r\n\r\n.nav-main-wrapper .navbar-toggle:hover .icon-bar {\r\n  opacity:0.8;\r\n}\r\n\r\n.nav-main-wrapper .navbar-toggle:focus, .nav-main-wrapper .navbar-toggle:hover {\r\n  background-color:transparent;\r\n}\r\n\r\n@media (max-width:767px) {\r\n  .nav-main-wrapper li a:after {\r\n    opacity:0;\r\n    display:none;\r\n  }\r\n}\r\n\r\n@media (max-width:767px) {\r\n  .nav-main-wrapper li {\r\n    float:none;\r\n    display:block;\r\n    text-align:left;\r\n  }\r\n}\r\n\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../web/app/common/navbar/navbar.component.html":
/***/ (function(module, exports) {

module.exports = "<nav class=\"navbar navbar-default navbar-fixed-top nav-main-wrapper\">\r\n  <div class=\"container-fluid\">\r\n      <div class=\"navbar-header\">\r\n          <a class=\"navbar-brand navbar-link\" href=\"#\"><strong>Sparty</strong></a>\r\n          <button class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#navcol-1\">\r\n            <span class=\"sr-only\">Toggle navigation</span>\r\n            <span class=\"icon-bar\"></span>\r\n            <span class=\"icon-bar\"></span>\r\n            <span class=\"icon-bar\"></span>\r\n          </button>\r\n      </div>\r\n      <div class=\"collapse navbar-collapse\" id=\"navcol-1\">\r\n          <ul class=\"nav navbar-nav\">\r\n            <li id=\"home-link\">\r\n              <a pageScroll href=\"#header\" (pageScrollFinish)=\"postScroll('home-link', $event)\" routerLink=\"/\">Home</a>\r\n            </li>\r\n            <li id=\"about-link\">\r\n              <a pageScroll href=\"#about\" (pageScrollFinish)=\"postScroll('about-link', $event)\" routerLink=\"/\">About</a>\r\n            </li>\r\n            <li id=\"services-link\">\r\n              <a pageScroll href=\"#services\" (pageScrollFinish)=\"postScroll('services-link', $event)\" routerLink=\"/\">Services</a>\r\n            </li>\r\n          </ul>\r\n          <ul *ngIf=\"loggedIn\" class=\"nav navbar-nav\">\r\n            <li routerLinkActive=\"active\">\r\n              <a routerLink=\"/dashboard\">Dashboard</a>\r\n            </li>\r\n          </ul>\r\n          <ul *ngIf=\"!loggedIn\" class=\"nav navbar-nav navbar-right\">\r\n            <li routerLinkActive=\"active\"><a [href]=\"spotify_login_url\"><span class=\"glyphicon glyphicon-log-in\"></span> Login</a></li>\r\n          </ul>\r\n          <ul *ngIf=\"loggedIn\" class=\"nav navbar-nav navbar-right\">\r\n            <li routerLinkActive=\"active\"><a href=\"#\" (click)=\"logout($event)\"><span class=\"glyphicon glyphicon-log-out\"></span> Logout</a></li>\r\n         </ul>\r\n      </div>\r\n  </div>\r\n</nav>"

/***/ }),

/***/ "../../../../../web/app/common/navbar/navbar.component.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var auth_service_1 = __webpack_require__("../../../../../web/app/auth/auth.service.ts");
var route_helper_module_1 = __webpack_require__("../../../../../web/includes/utils/route-helper.module.ts");
var window_service_1 = __webpack_require__("../../../../../web/includes/window.service.ts");
__webpack_require__("../../../../rxjs/_esm5/add/operator/filter.js");
var querystring = __webpack_require__("../../../../querystring-es3/index.js");
// required variables for Spotify authentication
var client_id = 'b6f40e9463ba406792aa0914d5c64bcb'; // Your client id
var scope = 'user-read-private user-read-email user-library-read playlist-modify-private playlist-modify-public playlist-read-private';
var redirect_uri = 'http://127.0.0.1:10010/user'; // Your redirect uri
var NavbarComponent = (function () {
    function NavbarComponent(authentication, routeControl, window) {
        this.authentication = authentication;
        this.routeControl = routeControl;
        this.window = window;
    }
    NavbarComponent.prototype.ngOnInit = function () {
        // Initially, the active tab will be the home link
        var self = this;
        this.activeNavID = 'home-link';
        // Create the spotify authorization link
        this.spotify_login_url = 'https://accounts.spotify.com/authorize?' +
            querystring.stringify({
                response_type: 'code',
                client_id: client_id,
                scope: scope,
                redirect_uri: redirect_uri
            });
        // Function to be called each time the route changes
        this.routeControl.onRouteChange(function (data) {
            self.loggedIn = self.authentication.loggedIn();
        });
    }; // end ngOnInit function
    NavbarComponent.prototype.ngAfterViewInit = function () {
        var currentPath = this.window.nativeWindow.location.pathname;
        if (currentPath == '/') {
            // on the home page, add the active class on load
            this.addActive(this.activeNavID);
        } // end if current page is the index
    }; // end ngAfterViewInit function
    NavbarComponent.prototype.postScroll = function (id, reachedTarget) {
        // called each time user clicks link and scrolls to section
        if (reachedTarget) {
            this.removeActive(this.activeNavID);
            this.addActive(id);
        } // end if they reached the scroll position
    }; // end function postScroll
    NavbarComponent.prototype.addActive = function (id) {
        $('#' + id).addClass("active");
        this.activeNavID = id;
    }; // end function addActive
    NavbarComponent.prototype.removeActive = function (id) {
        $('#' + id).removeClass("active");
        this.activeNavID = null;
    }; // end function removeActive
    NavbarComponent.prototype.logout = function () {
        this.loggedIn = false;
        this.authentication.logout();
        return false;
    }; // end logout function
    return NavbarComponent;
}()); // end class NavBarComponent
NavbarComponent = __decorate([
    core_1.Component({
        selector: 'app-navbar',
        template: __webpack_require__("../../../../../web/app/common/navbar/navbar.component.html"),
        styles: [__webpack_require__("../../../../../web/app/common/navbar/navbar.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" && _a || Object, typeof (_b = typeof route_helper_module_1.RouteHelper !== "undefined" && route_helper_module_1.RouteHelper) === "function" && _b || Object, typeof (_c = typeof window_service_1.WindowService !== "undefined" && window_service_1.WindowService) === "function" && _c || Object])
], NavbarComponent);
exports.NavbarComponent = NavbarComponent;
var _a, _b, _c;
//# sourceMappingURL=navbar.component.js.map

/***/ }),

/***/ "../../../../../web/app/common/sidebar-left/sidebar-left.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".navbar-inverse {\r\n    background-color: #000000\r\n}\r\n\r\n@media (max-width: 768px) {\r\n  .navbar-fixed-side {\r\n    margin-left:-15px;\r\n    margin-right:-15px;\r\n  }\r\n}\r\n\r\n@media (min-width: 768px) {\r\n  .navbar-fixed-side {\r\n    position:fixed;\r\n    margin:0 -15px;\r\n    height:100vh;\r\n    width:inherit;\r\n    overflow:auto;\r\n    border-top-width:0;\r\n    border-bottom-width:0;\r\n    border-radius:0;\r\n  }\r\n}\r\n\r\n@media (min-width: 768px) {\r\n  .navbar-fixed-side .container, .navbar-fixed-side .container-fluid {\r\n    width:auto;\r\n    padding-left:0;\r\n    padding-right:0;\r\n  }\r\n}\r\n\r\n@media (min-width: 768px) {\r\n  .navbar-fixed-side .navbar-header {\r\n    float:none;\r\n  }\r\n}\r\n\r\n@media (min-width: 768px) {\r\n  .navbar-fixed-side .navbar-brand {\r\n    height:auto;\r\n  }\r\n}\r\n\r\n@media (min-width: 768px) {\r\n  .navbar-fixed-side > .container .navbar-brand, .navbar-fixed-side > .container-fluid .navbar-brand {\r\n    margin-left:0;\r\n  }\r\n}\r\n\r\n@media (min-width: 768px) {\r\n  .navbar-fixed-side .navbar-collapse {\r\n    width:100%;\r\n    border-top:1px solid #e7e7e7;\r\n  }\r\n}\r\n\r\n@media (min-width: 768px) {\r\n  .navbar-fixed-side .navbar-nav {\r\n    float:none;\r\n    margin:0 -15px;\r\n  }\r\n}\r\n\r\n@media (min-width: 768px) {\r\n  .navbar-fixed-side .navbar-nav > li {\r\n    float:none;\r\n  }\r\n}\r\n\r\n@media (min-width: 768px) {\r\n  .navbar-fixed-side .navbar-nav > li > a {\r\n    border-bottom:1px solid #e7e7e7;\r\n  }\r\n}\r\n\r\n@media (min-width: 768px) {\r\n  .navbar-fixed-side .navbar-form {\r\n    margin:0;\r\n    margin-left:-15px;\r\n    margin-right:-15px;\r\n    border-bottom:1px solid #e7e7e7;\r\n  }\r\n}\r\n\r\n@media (min-width: 768px) {\r\n  .navbar-fixed-side .navbar-text {\r\n    float:none;\r\n    margin-left:0;\r\n    margin-right:0;\r\n  }\r\n}\r\n\r\n@media (min-width: 768px) {\r\n  .navbar-fixed-side .navbar-left, .navbar-fixed-side .navbar-right {\r\n    float:none !important;\r\n  }\r\n}\r\n\r\n@media (min-width: 768px) {\r\n  .navbar-fixed-side .navbar-nav .dropdown-menu {\r\n    position:static;\r\n    float:none;\r\n    width:auto;\r\n    margin-top:0;\r\n    background-color:transparent;\r\n    border:0;\r\n    box-shadow:none;\r\n    border-bottom:1px solid #e7e7e7;\r\n  }\r\n}\r\n\r\n@media (min-width: 768px) {\r\n  .navbar-fixed-side .navbar-nav .dropdown-menu > li > a, .navbar-fixed-side .navbar-nav .dropdown-menu .dropdown-header {\r\n    padding:5px 15px 5px 25px;\r\n  }\r\n}\r\n\r\n@media (min-width: 768px) {\r\n  .navbar-fixed-side .navbar-nav .dropdown-menu > li > a {\r\n    line-height:20px;\r\n    color:#777;\r\n  }\r\n}\r\n\r\n@media (min-width: 768px) {\r\n  .navbar-fixed-side .navbar-nav .dropdown-menu > li > a:hover, .navbar-fixed-side .navbar-nav .dropdown-menu > li > a:focus {\r\n    background-image:none;\r\n  }\r\n}\r\n\r\n@media (min-width: 768px) {\r\n  .navbar-fixed-side .navbar-nav .dropdown-menu > .active > a {\r\n    background-color:#e7e7e7;\r\n    color:#555;\r\n  }\r\n}\r\n\r\n@media (min-width: 768px) {\r\n  .navbar-fixed-side .navbar-nav > li > a:hover, .navbar-fixed-side .navbar-nav > li > a:focus, .navbar-fixed-side .navbar-nav .dropdown-menu > li > a:hover, .navbar-fixed-side .navbar-nav .dropdown-menu > li > a:focus {\r\n    background-color:#f0f0f0;\r\n    color:#333;\r\n  }\r\n}\r\n\r\n@media (min-width: 768px) {\r\n  .navbar-fixed-side .dropdown > .dropdown-toggle, .navbar-fixed-side .dropdown-menu > .dropdown-header {\r\n    background-color:transparent !important;\r\n    color:#9d9d9d !important;\r\n    cursor:default;\r\n    font-size:0.8em;\r\n    text-transform:uppercase;\r\n    border-bottom:none;\r\n    padding-bottom:0;\r\n  }\r\n}\r\n\r\n@media (min-width: 768px) {\r\n  .navbar-fixed-side .dropdown-toggle .caret {\r\n    display:none;\r\n  }\r\n}\r\n\r\n@media (min-width: 768px) {\r\n  .navbar-fixed-side .dropdown-menu {\r\n    display:block;\r\n  }\r\n}\r\n\r\n@media (min-width: 768px) {\r\n  .navbar-fixed-side.navbar-inverse .navbar-collapse, .navbar-fixed-side.navbar-inverse .navbar-nav > li > a, .navbar-fixed-side.navbar-inverse .navbar-form, .navbar-fixed-side.navbar-inverse .navbar-nav .dropdown-menu {\r\n    border-color:#363636;\r\n  }\r\n}\r\n\r\n@media (min-width: 768px) {\r\n  .navbar-fixed-side.navbar-inverse .divider {\r\n    background-color:#363636;\r\n  }\r\n}\r\n\r\n@media (min-width: 768px) {\r\n  .navbar-fixed-side.navbar-inverse .navbar-nav .dropdown-menu > li > a {\r\n    color:#9d9d9d;\r\n  }\r\n}\r\n\r\n@media (min-width: 768px) {\r\n  .navbar-fixed-side.navbar-inverse .navbar-nav .dropdown-menu > .active > a {\r\n    background-color:#090909;\r\n    color:#fff;\r\n  }\r\n}\r\n\r\n@media (min-width: 768px) {\r\n  .navbar-fixed-side.navbar-inverse .navbar-nav > li:not(.active) > a:hover, .navbar-fixed-side.navbar-inverse .navbar-nav > li:not(.active) > a:focus, .navbar-fixed-side.navbar-inverse .navbar-nav .dropdown-menu > li:not(.active) > a:hover, .navbar-fixed-side.navbar-inverse .navbar-nav .dropdown-menu > li:not(.active) > a:focus {\r\n    background-color:#2f2f2f;\r\n    color:#fff;\r\n  }\r\n}\r\n\r\n@media (min-width: 768px) {\r\n  .navbar-fixed-side.navbar-inverse .dropdown > .dropdown-toggle {\r\n    color:#000000 !important;\r\n  }\r\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../web/app/common/sidebar-left/sidebar-left.component.html":
/***/ (function(module, exports) {

module.exports = "<nav class=\"navbar navbar-inverse navbar-fixed-side\">\r\n    <div class=\"container\">\r\n        <div class=\"navbar-header\">\r\n            <button class=\"navbar-toggle\" data-target=\".navbar-collapse\" data-toggle=\"collapse\">\r\n                <span class=\"sr-only\">Toggle navigation</span>\r\n                <span class=\"icon-bar\"></span>\r\n                <span class=\"icon-bar\"></span>\r\n                <span class=\"icon-bar\"></span>\r\n            </button>\r\n        </div>\r\n        <div class=\"collapse navbar-collapse\">\r\n            <ul class=\"nav navbar-nav\">\r\n                <li><a href=\"#\"><span class=\"glyphicon glyphicon-home\"></span></a></li>\r\n                <li><a href=\"#\"><span class=\"glyphicon glyphicon-envelope\"></span></a></li>\r\n                <li><a href=\"#\"><span class=\"glyphicon glyphicon-bell\"></span></a></li>\r\n                <li><a href=\"#\"><span class=\"glyphicon glyphicon-star\"></span></a></li>\r\n                <li><a href=\"#\"><span class=\"glyphicon glyphicon-envelope\"></span></a></li>\r\n                <li><a href=\"#\"><span class=\"glyphicon glyphicon-search\"></span></a></li>\r\n                <li><a href=\"#\"><span class=\"glyphicon glyphicon-user\"></span></a></li>\r\n                <li><a href=\"#\"><span class=\"glyphicon glyphicon-cog\"></span></a></li>\r\n            </ul>\r\n        </div>\r\n    </div>\r\n</nav>"

/***/ }),

/***/ "../../../../../web/app/common/sidebar-left/sidebar-left.component.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var SidebarLeftComponent = (function () {
    function SidebarLeftComponent() {
    }
    SidebarLeftComponent.prototype.ngOnInit = function () {
    };
    return SidebarLeftComponent;
}());
SidebarLeftComponent = __decorate([
    core_1.Component({
        selector: 'app-sidebar-left',
        template: __webpack_require__("../../../../../web/app/common/sidebar-left/sidebar-left.component.html"),
        styles: [__webpack_require__("../../../../../web/app/common/sidebar-left/sidebar-left.component.css")]
    }),
    __metadata("design:paramtypes", [])
], SidebarLeftComponent);
exports.SidebarLeftComponent = SidebarLeftComponent;
//# sourceMappingURL=sidebar-left.component.js.map

/***/ }),

/***/ "../../../../../web/app/common/sidebar-right/sidebar-right.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../web/app/common/sidebar-right/sidebar-right.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"well\">\r\n  <app-chat></app-chat>\r\n</div>"

/***/ }),

/***/ "../../../../../web/app/common/sidebar-right/sidebar-right.component.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var SidebarRightComponent = (function () {
    function SidebarRightComponent() {
    }
    SidebarRightComponent.prototype.ngOnInit = function () {
    };
    return SidebarRightComponent;
}());
SidebarRightComponent = __decorate([
    core_1.Component({
        selector: 'app-sidebar-right',
        template: __webpack_require__("../../../../../web/app/common/sidebar-right/sidebar-right.component.html"),
        styles: [__webpack_require__("../../../../../web/app/common/sidebar-right/sidebar-right.component.css")]
    }),
    __metadata("design:paramtypes", [])
], SidebarRightComponent);
exports.SidebarRightComponent = SidebarRightComponent;
//# sourceMappingURL=sidebar-right.component.js.map

/***/ }),

/***/ "../../../../../web/app/dashboard/dashboard.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../web/app/dashboard/dashboard.component.html":
/***/ (function(module, exports) {

module.exports = "<h1>Dashboard<span [hidden]=\"!joined\"> - {{ room.name }}</span></h1>\r\n\r\n<div class=\"row content\">\r\n    <div class=\"container-fluid\">\r\n        <div class=\"col-sm-6\" [hidden]=\"joined\">\r\n            <div class=\"panel panel-primary\">\r\n                <div class=\"panel-heading\">Sparty</div>\r\n                <div class=\"panel-body\">\r\n                    <form>\r\n                        <div [hidden]=\"!error\" class=\"alert alert-danger\">\r\n                            <strong>Error: </strong> {{ error }}\r\n                        </div>\r\n                        <div class=\"form-group row\">\r\n                            <div class=\"col-xs-6\">\r\n                                <input type=\"text\" class=\"form-control\" [(ngModel)]=\"roomName\" name=\"roomName\" placeholder=\"Room name...\" required />\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"form-group row\">\r\n                            <div class=\"col-xs-6\">\r\n                                <button type=\"submit\" class=\"btn btn-primary btn-block\" (click)=\"joinRoom()\">Join</button>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"form-group row\">\r\n                            <div class=\"col-xs-6\">\r\n                                <button type=\"submit\" class=\"btn btn-success btn-block\" (click)=\"hostRoom()\">Host</button>\r\n                            </div>\r\n                        </div>\r\n                    </form>\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n        <div [hidden]=\"!joined\">\r\n            <div class=\"row\">\r\n                <div class=\"col-sm-2\">\r\n                    <h4>Users:</h4>\r\n                    <ul>\r\n                        <li *ngFor=\"let user of room.users\"> \r\n                            {{ user.display_name }} <span *ngIf=\"user.host\"> - Host</span>\r\n                        </li>\r\n                    </ul>\r\n                </div>\r\n                <div class=\"col-sm-4\">\r\n                    <h4>Queue:</h4>\r\n                    <div class=\"pre-scrollable\" style=\"max-height: 70vh\">\r\n                        <table class=\"table\">\r\n                                <thead>\r\n                                    <tr>\r\n                                        <th scope=\"col\">#</th>\r\n                                        <th scope=\"col\">Name</th>\r\n                                        <th scope=\"col\">Artist</th>\r\n                                        <th scope=\"col\">Album</th>\r\n                                    </tr>\r\n                                </thead>\r\n                                <tbody>\r\n                                    <tr *ngFor=\"let item of room.queue.tracks.items; let i = index\">\r\n                                        <td>{{ i+1 }}</td>\r\n                                        <td>{{ item.track.name }}</td>\r\n                                        <td>{{ item.track.artists[0].name }}</td>\r\n                                        <td>{{ item.track.album.name }}</td>\r\n                                    </tr>\r\n                                </tbody>\r\n                        </table>\r\n                    </div>\r\n                    {{ room.queue }}\r\n                </div>\r\n                <div class=\"col-sm-6\">\r\n                    <h4>Your songs:</h4>\r\n                    <div class=\"pre-scrollable\" style=\"max-height: 70vh\">\r\n                        <table class=\"table\">\r\n                                <thead>\r\n                                    <tr>\r\n                                        <th scope=\"col\">#</th>\r\n                                        <th scope=\"col\">Name</th>\r\n                                        <th scope=\"col\">Artist</th>\r\n                                        <th scope=\"col\">Album</th>\r\n                                        <th scope=\"col\">Options</th>\r\n                                    </tr>\r\n                                </thead>\r\n                                <tbody>\r\n                                    <tr *ngFor=\"let item of library; let i = index\">\r\n                                        <td>{{ i+1 }}</td>\r\n                                        <td>{{ item.track.name }}</td>\r\n                                        <td>{{ item.track.artists[0].name }}</td>\r\n                                        <td>{{ item.track.album.name }}</td>\r\n                                        <td><span (click)=\"addTrack(item)\" class=\"glyphicon glyphicon-plus\"></span></td>\r\n                                    </tr>\r\n                                </tbody>\r\n                        </table>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>"

/***/ }),

/***/ "../../../../../web/app/dashboard/dashboard.component.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var auth_service_1 = __webpack_require__("../../../../../web/app/auth/auth.service.ts");
var dashboard_service_1 = __webpack_require__("../../../../../web/app/dashboard/dashboard.service.ts");
var http_client_service_1 = __webpack_require__("../../../../../web/includes/http-client.service.ts");
var route_helper_module_1 = __webpack_require__("../../../../../web/includes/utils/route-helper.module.ts");
var RoomVM = __webpack_require__("../../../../../web/includes/viewModels/Room.js");
var io = __webpack_require__("../../../../socket.io-client/lib/index.js");
var DashboardComponent = (function () {
    function DashboardComponent(authentication, dashboardService, routeControl, http) {
        this.authentication = authentication;
        this.dashboardService = dashboardService;
        this.routeControl = routeControl;
        this.http = http;
        this.socket = io('http://localhost:4000');
    }
    DashboardComponent.prototype.ngOnInit = function () {
        var self = this;
        self.room = new RoomVM.Room;
        self.library = [];
        // create a handler for error messages, updating them as the server passes them back
        // handler to be called upon return of an error message from Socket.io
        this.socket.on('error-message', function (data) {
            self.error = data;
        });
        // create a handler for when the room is updated or changed
        this.socket.on('room-update', function (data) {
            console.log("Room update:", data);
            self.room = data.room;
            self.joined = true;
            if (data.created) {
                // this room was just created, initialize the room
                // first create a playlist we will use
                self.initRoom(self.room.name);
            } // end if the room was recently created
        });
        this.getLibrary();
    }; // end ngOnInit function
    DashboardComponent.prototype.getLibrary = function () {
        var _this = this;
        var user = this.authentication.getUser();
        var self = this;
        // Grab our playlist data using the service
        this.dashboardService.getLibrary().then(function (data) {
            _this.library = data.items;
            console.log(_this.library);
        }, function (err) {
            if (err.status !== 401) {
                console.log(err);
            } // end if not unauthorized error
        });
    }; // end function getPlaylists()
    DashboardComponent.prototype.joinRoom = function () {
        this.socket.emit('join-room', { user: this.authentication.getUser(), room: this.roomName });
    }; // end function joinRoom
    DashboardComponent.prototype.hostRoom = function () {
        this.socket.emit('create-room', { user: this.authentication.getUser(), room: this.roomName });
    }; // end function hostRoom
    DashboardComponent.prototype.initRoom = function (roomName) {
        var _this = this;
        // function should be called as soon as host gets the OK to create a room
        var playlist = {
            description: "Boom room playlist",
            public: false,
            name: "Boom Room - " + roomName
        };
        this.dashboardService.createPlaylist(this.authentication.getUserID(), playlist).then(function (data) {
            // load the queue into the client side and emit a socket message telling everyone
            // that the queue has been created
            _this.queue = data;
            _this.socket.emit('create-queue', { room: _this.room.name, queue: data });
        }, function (err) {
            if (err.status !== 401) {
                console.log(err);
            } // end if not unauthorized error
        });
    }; // end function initRoom
    DashboardComponent.prototype.addTrack = function (item) {
        //console.log(item);
        var track_id = item.track.id;
        this.socket.emit('add-track', { room: this.room.name, track_id: track_id });
    }; // end function addTrack
    return DashboardComponent;
}()); // end class DashboardComponent
DashboardComponent = __decorate([
    core_1.Component({
        selector: 'app-dashboard',
        template: __webpack_require__("../../../../../web/app/dashboard/dashboard.component.html"),
        styles: [__webpack_require__("../../../../../web/app/dashboard/dashboard.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" && _a || Object, typeof (_b = typeof dashboard_service_1.DashboardService !== "undefined" && dashboard_service_1.DashboardService) === "function" && _b || Object, typeof (_c = typeof route_helper_module_1.RouteHelper !== "undefined" && route_helper_module_1.RouteHelper) === "function" && _c || Object, typeof (_d = typeof http_client_service_1.HttpClient !== "undefined" && http_client_service_1.HttpClient) === "function" && _d || Object])
], DashboardComponent);
exports.DashboardComponent = DashboardComponent;
var _a, _b, _c, _d;
//# sourceMappingURL=dashboard.component.js.map

/***/ }),

/***/ "../../../../../web/app/dashboard/dashboard.service.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var http_client_service_1 = __webpack_require__("../../../../../web/includes/http-client.service.ts");
var DashboardService = (function () {
    function DashboardService(http) {
        this.http = http;
    }
    DashboardService.prototype.getLibrary = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get('https://api.spotify.com/v1/me/tracks')
                .map(function (res) { return res.json(); })
                .subscribe(function (res) {
                resolve(res);
            }, function (err) {
                reject(err);
            });
        });
    }; // end function getChatByRoom
    DashboardService.prototype.createPlaylist = function (user_id, data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.post('https://api.spotify.com/v1/users/' + user_id + '/playlists', data)
                .map(function (res) { return res.json(); })
                .subscribe(function (res) {
                resolve(res);
            }, function (err) {
                reject(err);
            });
        });
    }; // end function createPlaylist
    return DashboardService;
}()); // end class DashboardService
DashboardService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof http_client_service_1.HttpClient !== "undefined" && http_client_service_1.HttpClient) === "function" && _a || Object])
], DashboardService);
exports.DashboardService = DashboardService;
var _a;
//# sourceMappingURL=dashboard.service.js.map

/***/ }),

/***/ "../../../../../web/app/home/home.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".headerText {\r\n  font-size: 72px;\r\n\ttext-transform: uppercase;\r\n\tposition: relative;\r\n\tmargin-bottom: 0px;\r\n\ttext-align: center;\r\n\tline-height: 0.5;\r\n\tcolor:#fff;\r\n}\r\n\r\n.btn-orange {\r\n  background-color: #F36F36;\r\n  border-color: #F36F36;\r\n}\r\n\r\n.btn-orange:hover {\r\n  background-color: #f26326;\r\n  border-color: #f26326;\r\n}\r\n\r\n.btn-orange:active {\r\n  background-color: #c1420b;\r\n  border-color: #c1420b;\r\n}\r\n\r\n/* Remove the rounded corners on all bootstrap items */\r\n.banner * {\r\n  border-radius: 0 !important;\r\n}\r\n\r\n@media (min-width:992px) {\r\n  .hero .get-it {\r\n    text-align:right;\r\n    margin-top:80px;\r\n    padding-right:30px;\r\n  }\r\n}\r\n\r\n@media (max-width:992px) {\r\n  .hero .get-it {\r\n    text-align:center;\r\n  }\r\n}\r\n\r\n@media (max-width:992px) {\r\n  .hero .phone-preview {\r\n    text-align:center;\r\n  }\r\n}\r\n\r\n.hero .get-it h1, .hero .get-it p {\r\n  color:#fff;\r\n  text-shadow:2px 2px 3px rgba(0,0,0,0.3);\r\n  margin-bottom:40px;\r\n}\r\n\r\n.hero .get-it .btn {\r\n  margin-left:10px;\r\n  margin-bottom:10px;\r\n  text-shadow:none;\r\n}\r\n\r\ndiv.iphone-mockup {\r\n  position:relative;\r\n  max-width:250px;\r\n  margin:20px;\r\n  display:inline-block;\r\n}\r\n\r\n.iphone-mockup img.device {\r\n  width:100%;\r\n  height:auto;\r\n}\r\n\r\n.iphone-mockup .screen {\r\n  position:absolute;\r\n  width:88%;\r\n  height:77%;\r\n  top:12%;\r\n  border-radius:2px;\r\n  left:6%;\r\n  border:1px solid #444;\r\n  background-color:#aaa;\r\n  overflow:hidden;\r\n  background:url(" + __webpack_require__("../../../../../web/assets/img/screen-content-iphone-6.jpg") + ");\r\n  background-size:cover;\r\n  background-position:center;\r\n}\r\n\r\n.iphone-mockup .screen:before {\r\n  content:'';\r\n  background-color:#fff;\r\n  position:absolute;\r\n  width:70%;\r\n  height:140%;\r\n  top:-12%;\r\n  right:-60%;\r\n  -webkit-transform:rotate(-19deg);\r\n          transform:rotate(-19deg);\r\n  opacity:0.2;\r\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../web/app/home/home.component.html":
/***/ (function(module, exports) {

module.exports = "<section id=\"header\">\r\n    <div id=\"header-wrapper\" class=\"header-slider\">\r\n        <header class=\"clearfix\">\r\n            <div class=\"container\">\r\n                <div class=\"row content\">\r\n                    <div class=\"col-md-12\">\r\n                        <h1><strong class=\"headerText\">Sparty</strong></h1>\r\n                        <div id=\"main-flexslider\" class=\"flexslider\">\r\n                            <ul class=\"slides\">\r\n                                <li>\r\n                                    <p class=\"home-slide-content\"><strong>Collaberate</strong> with friends</p>\r\n                                </li>\r\n                                <li>\r\n                                    <p class=\"home-slide-content\">We love <strong>Simplicity</strong></p>\r\n                                </li>\r\n                            </ul>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </header>\r\n    </div>\r\n</section>\r\n<section id=\"about\" class=\"section\">\r\n    <div class=\"container\">\r\n        <h4>Who We Are</h4>\r\n        <div class=\"row\">\r\n            <div class=\"col-xs-4\">\r\n                <div>\r\n                    <h2>We live with <strong>Creativity</strong></h2>\r\n                    <p>We are a modern company specializing in all types of Web Development services. We can build a website from the ground up, or we can dive straight into an existing application. Nova was created entirely by developers, which means our development processes are completely streamlined.\r\n                        <a routerLink=\"/register\">Create a free account</a> and start building your website today!\r\n                    </p>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-6\">\r\n                <div class=\"aligncenter\">\r\n                    <img src=\"../../assets/img/icons/creativity.png\" alt=\"\" />\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"row\">\r\n            <div class=\"col-xs-2 flyIn\">\r\n                <div class=\"people\">\r\n                    <img class=\"team-thumb img-circle\" src=\"../../assets/img/team/img-1.jpg\" alt=\"\" />\r\n                    <h3>John Smith</h3>\r\n                    <p>Founder</p>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-2 flyIn\">\r\n                <div class=\"people\">\r\n                    <img class=\"team-thumb img-circle\" src=\"../../assets/img/team/img-2.jpg\" alt=\"\" />\r\n                    <h3>Mike Doe</h3>\r\n                    <p>Web developer</p>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-2 flyIn\">\r\n                <div class=\"people\">\r\n                    <img class=\"team-thumb img-circle\" src=\"../../assets/img/team/img-3.jpg\" alt=\"\" />\r\n                    <h3>Neil Doe</h3>\r\n                    <p>Web designer</p>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-2 flyIn\">\r\n                <div class=\"people\">\r\n                    <img class=\"team-thumb img-circle\" src=\"../../assets/img/team/img-4.jpg\" alt=\"\" />\r\n                    <h3>Mark Joe</h3>\r\n                    <p>UI designer</p>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-2 flyIn\">\r\n                <div class=\"people\">\r\n                    <img class=\"team-thumb img-circle\" src=\"../../assets/img/team/img-5.jpg\" alt=\"\" />\r\n                    <h3>Stephen B</h3>\r\n                    <p>Digital imaging</p>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</section>\r\n<section id=\"services\" class=\"section orange\">\r\n    <div class=\"container\">\r\n        <h4>Services</h4>\r\n        <div class=\"row\">\r\n            <div class=\"col-xs-3\">\r\n                <div class=\"service-box\">\r\n                    <img src=\"../../assets/img/icons/laptop.png\" alt=\"\" />\r\n                    <h2>Web Design</h2>\r\n                    <p>Choose from a template or let us start from scratch. All websites are fully customizable.</p>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-3\">\r\n                <div class=\"service-box\">\r\n                    <img src=\"../../assets/img/icons/api.png\" alt=\"\" />\r\n                    <h2>API Integration</h2>\r\n                    <p>Integrate external services into your application. Ask for an API suggestion from one of our experienced developers.</p>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-3\">\r\n                <div class=\"service-box\">\r\n                    <img src=\"../../assets/img/icons/lab.png\" alt=\"\" />\r\n                    <h2>Web Development</h2>\r\n                    <p>We use the latest technologies to create responsive websites. You give us an idea and we bring your creation to life.</p>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-3\">\r\n                <div class=\"service-box\">\r\n                    <img src=\"../../assets/img/icons/custom.png\" alt=\"\" />\r\n                    <h2>Custom Services</h2>\r\n                    <p>If you have a vision, our developers can make it happen. Ask us about custom eCommerce and marketing services.</p>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</section>\r\n<a href=\"#\" class=\"scrollup\"><i class=\"icon-angle-up icon-square icon-2x\"></i></a>"

/***/ }),

/***/ "../../../../../web/app/home/home.component.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var auth_service_1 = __webpack_require__("../../../../../web/app/auth/auth.service.ts");
var HomeComponent = (function () {
    function HomeComponent(authentication) {
        this.authentication = authentication;
    }
    HomeComponent.prototype.ngOnInit = function () {
        //this.authentication.redirectIfLoggedIn('/dashboard');
    }; // end ngOninit function
    HomeComponent.prototype.ngAfterViewInit = function () {
        // DOM ready function
        function getViewportHeight() {
            var height = window.innerHeight; // Safari, Opera
            var mode = document.compatMode;
            if ((mode || !$.support.boxModel)) {
                height = (mode == 'CSS1Compat') ?
                    document.documentElement.clientHeight :
                    document.body.clientHeight; // Quirks
            } // end if mode
            return height;
        } // end function getViewPortHeight
        $(window).scroll(function () {
            var vpH = getViewportHeight(), scrolltop = (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop), elems = [];
            // naughty, but this is how it knows which elements to check for
            $.each($.cache, function () {
                if (this.events && this.events.inview) {
                    elems.push(this.handle.elem);
                } // end if event is in view
            });
            if (elems.length) {
                $(elems).each(function () {
                    var $el = $(this), top = $el.offset().top, height = $el.height(), inview = $el.data('inview') || false;
                    if (scrolltop > (top + height) || scrolltop + vpH < top) {
                        if (inview) {
                            $el.data('inview', false);
                            $el.trigger('inview', [false]);
                        } // end if inview
                    }
                    else if (scrolltop < (top + height)) {
                        if (!inview) {
                            $el.data('inview', true);
                            $el.trigger('inview', [true]);
                        } // end if not inview
                    } // end if checking if the element is in view
                });
            } // end if elems.length
        });
        // call the scroll function now
        $(window).scroll();
        $('.scrollup').click(function () {
            $("html, body").animate({ scrollTop: 0 }, 1000);
            return false;
        });
        $('.accordion').on('show', function (e) {
            $(e.target).prev('.accordion-heading').find('.accordion-toggle').addClass('active');
            $(e.target).prev('.accordion-heading').find('.accordion-toggle i').removeClass('icon-plus');
            $(e.target).prev('.accordion-heading').find('.accordion-toggle i').addClass('icon-minus');
        });
        $('.accordion').on('hide', function (e) {
            $(this).find('.accordion-toggle').not($(e.target)).removeClass('active');
            $(this).find('.accordion-toggle i').not($(e.target)).removeClass('icon-minus');
            $(this).find('.accordion-toggle i').not($(e.target)).addClass('icon-plus');
        });
        $('.navigation').onePageNav({
            begin: function () {
                console.log('start');
            },
            end: function () {
                console.log('stop');
            },
            scrollOffset: 0
        });
        // prettyPhoto
        $("a[data-pretty^='prettyPhoto']").prettyPhoto();
        // Localscrolling 
        $('#menu-main, .brand').localScroll();
        $('#menu-main li a').click(function () {
            var links = $('#menu-main li a');
            links.removeClass('selected');
            $(this).addClass('selected');
        });
        // keep track of if we are on iOS or not
        var iOS = false, p = navigator.platform;
        if (p === 'iPad' || p === 'iPhone' || p === 'iPod') {
            iOS = true;
        } // end if iPad, iPhone, or iPod	
        if (iOS === false) {
            // Not on iOS
            $('.flyIn').bind('inview', function (event, visible) {
                if (visible === true) {
                    $(this).addClass('animated fadeInUp');
                }
            });
            $('.flyLeft').bind('inview', function (event, visible) {
                if (visible === true) {
                    $(this).addClass('animated fadeInLeftBig');
                }
            });
            $('.flyRight').bind('inview', function (event, visible) {
                if (visible === true) {
                    $(this).addClass('animated fadeInRightBig');
                }
            });
        } // end if iOS === false
        // add animation on hover
        $(".service-box").hover(function () {
            $(this).find('img').addClass("animated pulse");
            $(this).find('h2').addClass("animated fadeInUp");
        }, function () {
            $(this).find('img').removeClass("animated pulse");
            $(this).find('h2').removeClass("animated fadeInUp");
        });
        // cache container
        var $container = $('#portfolio-wrap');
        $.browser.safari = ($.browser.webkit && !(/chrome/.test(navigator.userAgent.toLowerCase())));
        if ($.browser.safari) {
            // initialize isotope
            $container.isotope({
                animationEngine: 'jquery',
                animationOptions: {
                    duration: 200,
                    queue: false
                },
                layoutMode: 'fitRows'
            });
        }
        else {
            $container.isotope({
                animationEngine: 'best-available',
                animationOptions: {
                    duration: 200,
                    queue: false
                },
                layoutMode: 'fitRows'
            });
            $(window).resize(function () {
                $container.isotope('reLayout');
            });
        } // end if we are in safari browser
        // filter items when filter link is clicked
        $('#filters a').click(function () {
            $('#filters a').removeClass('active');
            $(this).addClass('active');
            var selector = $(this).attr('data-filter');
            $container.isotope({ filter: selector });
            return false;
        });
        // flexslider main
        $('#main-flexslider').flexslider({
            animation: "swing",
            direction: "vertical",
            slideshow: true,
            slideshowSpeed: 3500,
            animationDuration: 1000,
            directionNav: true,
            prevText: '<i class="icon-angle-up icon-2x"></i>',
            nextText: '<i class="icon-angle-down icon-2x active"></i>',
            controlNav: false,
            smootheHeight: true,
            useCSS: false
        });
    }; // end ngAfterViewInit function
    return HomeComponent;
}()); // end class HomeComponent
HomeComponent = __decorate([
    core_1.Component({
        selector: 'app-home',
        template: __webpack_require__("../../../../../web/app/home/home.component.html"),
        styles: [__webpack_require__("../../../../../web/app/home/home.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" && _a || Object])
], HomeComponent);
exports.HomeComponent = HomeComponent;
var _a;
//# sourceMappingURL=home.component.js.map

/***/ }),

/***/ "../../../../../web/assets/img/screen-content-iphone-6.jpg":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "screen-content-iphone-6.8c332c8fe1c168ec10fb.jpg";

/***/ }),

/***/ "../../../../../web/environments/environment.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = {
    production: false,
    user: {
        _id: "596baacbdccc0f3ae84460f7",
        email: "Test@gmail.com",
        username: "Joe",
        exp: 1501949940,
        iat: 1501345140
    }
};
//# sourceMappingURL=environment.js.map

/***/ }),

/***/ "../../../../../web/includes/derp.pipe.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
/*
  # Description:

  Repackages an array subset as a new array.

  **Reasoning:**

  Angular2's change checker freaks out when you ngFor an array that's a subset
    of a larger data structure.

  # Usage:
  ``
  <div *ng-for="#value of arrayOfObjects | derp"> </div>
  ``
*/
var DerpPipe = (function () {
    function DerpPipe() {
    }
    DerpPipe.prototype.transform = function (value, args) {
        return Array.from(value);
    };
    return DerpPipe;
}());
DerpPipe = __decorate([
    core_1.Pipe({ name: 'derp' })
], DerpPipe);
exports.DerpPipe = DerpPipe;
//# sourceMappingURL=derp.pipe.js.map

/***/ }),

/***/ "../../../../../web/includes/directives/equal-validator.directive.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var forms_1 = __webpack_require__("../../../forms/@angular/forms.es5.js");
var EqualValidator = EqualValidator_1 = (function () {
    function EqualValidator(validateEqual, reverse) {
        this.validateEqual = validateEqual;
        this.reverse = reverse;
    }
    Object.defineProperty(EqualValidator.prototype, "isReverse", {
        get: function () {
            if (!this.reverse)
                return false;
            return this.reverse === 'true' ? true : false;
        } // end function isReverse
        ,
        enumerable: true,
        configurable: true
    });
    EqualValidator.prototype.validate = function (c) {
        // self value
        var v = c.value;
        // control vlaue
        var e = c.root.get(this.validateEqual);
        // value not equal
        if (e && v !== e.value && !this.isReverse) {
            return {
                validateEqual: false
            };
        } // end if value not equal
        // value equal and reverse
        if (e && v === e.value && this.isReverse) {
            delete e.errors['validateEqual'];
            if (!Object.keys(e.errors).length)
                e.setErrors(null);
        } // end if value equal
        // value not equal and reverse
        if (e && v !== e.value && this.isReverse) {
            e.setErrors({ validateEqual: false });
        } // end if value not equal
        return null;
    }; // end function validate
    return EqualValidator;
}()); // end class EqualValidator
EqualValidator = EqualValidator_1 = __decorate([
    core_1.Directive({
        selector: '[validateEqual][formControlName],[validateEqual][formControl],[validateEqual][ngModel]',
        providers: [
            { provide: forms_1.NG_VALIDATORS, useExisting: core_1.forwardRef(function () { return EqualValidator_1; }), multi: true }
        ]
    }),
    __param(0, core_1.Attribute('validateEqual')),
    __param(1, core_1.Attribute('reverse')),
    __metadata("design:paramtypes", [String, String])
], EqualValidator);
exports.EqualValidator = EqualValidator;
var EqualValidator_1;
//# sourceMappingURL=equal-validator.directive.js.map

/***/ }),

/***/ "../../../../../web/includes/http-client.service.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var http_1 = __webpack_require__("../../../http/@angular/http.es5.js");
var auth_service_1 = __webpack_require__("../../../../../web/app/auth/auth.service.ts");
var HttpClient = (function () {
    function HttpClient(http, authentication) {
        this.http = http;
        this.authentication = authentication;
    }
    HttpClient.prototype.createAuthorizationHeader = function (headers) {
        headers.append('Authorization', 'Bearer ' + this.authentication.getToken());
    }; // end function createAuthorizationHeader
    HttpClient.prototype.createCORSHeader = function (headers) {
        headers.append('Access-Control-Allow-Origin', "*");
        headers.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    }; // end function createCORSHeader
    HttpClient.prototype.get = function (url, cors) {
        if (cors === void 0) { cors = false; }
        var headers = new http_1.Headers();
        this.createAuthorizationHeader(headers);
        if (cors) {
            this.createCORSHeader(headers);
        } // end if enabling CORS
        return this.http.get(url, {
            headers: headers
        });
    }; // end function get
    HttpClient.prototype.post = function (url, data, cors) {
        if (cors === void 0) { cors = false; }
        var headers = new http_1.Headers();
        this.createAuthorizationHeader(headers);
        if (cors) {
            this.createCORSHeader(headers);
        } // end if enabling CORS
        return this.http.post(url, data, {
            headers: headers
        });
    }; // end function post
    return HttpClient;
}()); // end class HttpClient
HttpClient = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof http_1.Http !== "undefined" && http_1.Http) === "function" && _a || Object, typeof (_b = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" && _b || Object])
], HttpClient);
exports.HttpClient = HttpClient;
var _a, _b;
//# sourceMappingURL=http-client.service.js.map

/***/ }),

/***/ "../../../../../web/includes/utils/form-validator.module.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var common_1 = __webpack_require__("../../../common/@angular/common.es5.js");
var equal_validator_directive_1 = __webpack_require__("../../../../../web/includes/directives/equal-validator.directive.ts");
var FormValidator = (function () {
    function FormValidator() {
        // Shared validation messages among forms
        this.validationMessages = {
            'username': {
                'required': 'Display name is a required field.',
                'minlength': 'Display name must be at least 4 characters.',
                'maxlength': 'Display name cannot be longer than 24 characters.',
                'pattern': 'Display name is invalid.',
            },
            'email': {
                'required': 'Email address is a required field.',
                'pattern': 'Email address is invalid.'
            },
            'password': {
                'required': 'Password is a required field.'
            },
            'confirm_password': {
                'required': 'Confirmation password is a required field.',
                'validateEqual': 'Confirmation password must match original password.'
            },
            'auth_required': 'Login is required before proceeding.'
        };
        // Shared regex patterns among forms
        this.patterns = {
            'username': '^[a-zA-Z0-9]+([-_\.][a-zA-Z0-9]+)*([a-zA-Z0-9])*$',
            'email': /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
        };
    }
    // Shared 'onValueChanged' function for executing code each time form input changes
    FormValidator.prototype.onValueChanged = function (component, formKey, top, data) {
        if (!component[formKey]) {
            return;
        }
        var form = component[formKey];
        if (top) {
            // reset the components top-level form error
            component.formErrors['top'] = '';
        } // end if we need to reset the components top form error
        for (var field in component.formErrors) {
            // Clear previous error message (if any)
            if (!top) {
                component.formErrors[field] = '';
            } // end if not displaying top errors
            // grab our form control object
            var control = form.get(field);
            if (control && control.dirty && !control.valid) {
                var messages = this.validationMessages[field];
                // check if we should display errors on top of the form
                if (top) {
                    field = 'top';
                } // end if we need to set the top-level error
                if (Object.keys(control.errors).length >= 1) {
                    // there is only one error, dont make a list, just grab the 1st key
                    component.formErrors[field] = messages[Object.keys(control.errors)[0]];
                } // end if we have at least one form error, display it
            } // end if the field has been modified and invalid
        } // end for loop over all form errors
    }; // end onValueChanged function
    return FormValidator;
}()); // end class FormValidator
FormValidator = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule],
        declarations: [equal_validator_directive_1.EqualValidator],
        exports: [equal_validator_directive_1.EqualValidator, common_1.CommonModule]
    }),
    __metadata("design:paramtypes", [])
], FormValidator);
exports.FormValidator = FormValidator;
//# sourceMappingURL=form-validator.module.js.map

/***/ }),

/***/ "../../../../../web/includes/utils/route-helper.module.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var common_1 = __webpack_require__("../../../common/@angular/common.es5.js");
var router_1 = __webpack_require__("../../../router/@angular/router.es5.js");
var RouteHelper = (function () {
    function RouteHelper(router) {
        this.router = router;
        this.changes = [];
    }
    // shared 'onRouteChange' function executing code each time route changes
    // this function will add a listener to the route change so that 'funct' is called
    // each time the route changes
    RouteHelper.prototype.onRouteChange = function (funct) {
        var params = this;
        this.changes.push({ 'funct': funct, 'params': params });
        this.router.events.filter(function (event) { return (event instanceof router_1.NavigationEnd); }).subscribe(function (routeData) {
            // Upon completition of route change, call our custom function
            funct(routeData);
        });
    }; // end shared module function for setting an 'onRouteChange' event
    RouteHelper.prototype.routeChange = function () {
        // this function helps us explictly simulate/call the route change
        // function from any one of our components
        for (var i = 0; i < this.changes.length; i++) {
            this.changes[i].funct(this.changes[i].params);
        } // end for loop over changes array
    }; // end function routeChange()
    return RouteHelper;
}()); // end class SharedModule
RouteHelper = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule],
        exports: [common_1.CommonModule]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof router_1.Router !== "undefined" && router_1.Router) === "function" && _a || Object])
], RouteHelper);
exports.RouteHelper = RouteHelper;
var _a;
//# sourceMappingURL=route-helper.module.js.map

/***/ }),

/***/ "../../../../../web/includes/viewModels/Room.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["Room"] = Room;
// Create custom view models for our different forms
function Room () {
    this.name = "";
    this.users = [];
    this.queue = { tracks: {} };
};// end interface class Register

/***/ }),

/***/ "../../../../../web/includes/window.service.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
function _window() {
    // return the native window obj
    return window;
} // end function window
var WindowService = (function () {
    function WindowService() {
    }
    Object.defineProperty(WindowService.prototype, "nativeWindow", {
        get: function () {
            return _window();
        } // end function get nativeWindow
        ,
        enumerable: true,
        configurable: true
    });
    return WindowService;
}()); // end class WindowRef
WindowService = __decorate([
    core_1.Injectable()
], WindowService);
exports.WindowService = WindowService;
//# sourceMappingURL=window.service.js.map

/***/ }),

/***/ "../../../../../web/main.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var platform_browser_dynamic_1 = __webpack_require__("../../../platform-browser-dynamic/@angular/platform-browser-dynamic.es5.js");
var app_module_1 = __webpack_require__("../../../../../web/app/app.module.ts");
var environment_1 = __webpack_require__("../../../../../web/environments/environment.ts");
if (environment_1.environment.production) {
    core_1.enableProdMode();
}
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("../../../../../web/main.ts");


/***/ }),

/***/ 1:
/***/ (function(module, exports) {

/* (ignored) */

/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map