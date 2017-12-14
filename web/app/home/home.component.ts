import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import * as environment from '../../../environments/environment';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor(private authentication: AuthService) { }

  ngOnInit() {
    console.log(environment);
    //this.authentication.redirectIfLoggedIn('/dashboard');
  }// end ngOninit function

  ngAfterViewInit() {
    // DOM ready function
    function getViewportHeight() {
        var height = window.innerHeight; // Safari, Opera
        var mode = document.compatMode;

        if ( (mode || !$.support.boxModel) ) { // IE, Gecko
            height = (mode == 'CSS1Compat') ?
            document.documentElement.clientHeight : // Standards
            document.body.clientHeight; // Quirks
        }// end if mode

        return height;
    }// end function getViewPortHeight

    $(window).scroll(function () {
        var vpH = getViewportHeight(),
        scrolltop = (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop),
        elems = [];
        
        // naughty, but this is how it knows which elements to check for
        $.each($.cache, function () {
            if (this.events && this.events.inview) {
                elems.push(this.handle.elem);
            }// end if event is in view
        });

        if (elems.length) {
            $(elems).each(function () {
                var $el = $(this),
                    top = $el.offset().top,
                    height = $el.height(),
                    inview = $el.data('inview') || false;

                if (scrolltop > (top + height) || scrolltop + vpH < top) {
                    if (inview) {
                        $el.data('inview', false);
                        $el.trigger('inview', [ false ]);                        
                    }// end if inview
                } else if (scrolltop < (top + height)) {
                    if (!inview) {
                        $el.data('inview', true);
                        $el.trigger('inview', [ true ]);
                    }// end if not inview
                }// end if checking if the element is in view
            });
        }// end if elems.length
    });
    // call the scroll function now
    $(window).scroll();

    $('.scrollup').click(function(){
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
		begin: function() {
			console.log('start');
		},
		end: function() {
			console.log('stop');
		},
        scrollOffset: 0		
	});
	
	// prettyPhoto
	$("a[data-pretty^='prettyPhoto']").prettyPhoto();		

    // Localscrolling 
	$('#menu-main, .brand').localScroll();
	
	$('#menu-main li a').click(function() {
		var links = $('#menu-main li a');
		links.removeClass('selected');
		$(this).addClass('selected');
	});

    // keep track of if we are on iOS or not
    var iOS = false,
    p = navigator.platform;

    if (p === 'iPad' || p === 'iPhone' || p === 'iPod') {
        iOS = true;
    }// end if iPad, iPhone, or iPod	
	
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
    }// end if iOS === false
	
    // add animation on hover
    $(".service-box").hover(
        function () {
            $(this).find('img').addClass("animated pulse");
            $(this).find('h2').addClass("animated fadeInUp");
        },
        function () {
            $(this).find('img').removeClass("animated pulse");
            $(this).find('h2').removeClass("animated fadeInUp");
        }
    );
	
    // cache container
    var $container = $('#portfolio-wrap');
    $.browser.safari = ($.browser.webkit && !(/chrome/.test(navigator.userAgent.toLowerCase())));	
    
    if($.browser.safari) { 	
         // initialize isotope
        $container.isotope({
        animationEngine : 'jquery',
        animationOptions: {
            duration: 200,
            queue: false
        },
        layoutMode: 'fitRows'
        });
    } else {	
        $container.isotope({
            animationEngine : 'best-available',
            animationOptions: {
                duration: 200,
                queue: false
            },
            layoutMode: 'fitRows'
        });	
        
        $(window).resize(function() {
            $container.isotope('reLayout');
        });
    }// end if we are in safari browser

    // filter items when filter link is clicked
    $('#filters a').click(function(){
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
      smootheHeight:true,						
      useCSS: false
    });
  }// end ngAfterViewInit function

}// end class HomeComponent