// Custom Behavior

/**
 * Before DOM is ready, cover screen with loader div
 */
$('#loader').show();

(function($) {
  

  /**
   * DOM is ready, remove the loader screen
   */
  $('#loader').fadeOut('slow');
  
  // Bootstrap select style. needs bootstrap-select.js
  //$('select').selectpicker();
  
  /**
   * Main menu toggling
   */
   
  /**
   * Open up menu and overlay if clicking menu icon
   */
  var $menuHideDivs = $('.menu-bar, .submenu, .overlay, .submenu-bar, .search-bar');
  var $menuShowDivs = $('.menu-bar, .overlay');
  $('.sficon-menu').click(function(){
    $('.menu-bar a, .navbar li').removeClass('active');
    $(this).parent('li').toggleClass('active');
    //$(this).parent('li').siblings().toggleClass('active');
    $menuHideDivs.hide();    
    $menuShowDivs.toggle();
    $('#bounds').addClass('relative'); //invoke relative positioning to fix overlay bug on mobile
  });
  
  /* Hide the menu if clicking away or on close button */
  $('.overlay, .menu-bar .action-close').click(function(){
    $('.menu-bar a, .navbar li').removeClass('active');
    $menuHideDivs.hide();
    $('#bounds').removeClass('relative');
  });
  
  $('.navbar.actions li .sficon-star-empty, .navbar.actions li .sficon-star').click(function(){
    $(this).toggleClass('sficon-star-empty');
    $(this).toggleClass('sficon-star');
  });
  
  /* Global Search */
  $('.menu-search').click(function(){
    if ($(this).parent('li').hasClass('active')) {
      $('.menu-bar a, .navbar li').removeClass('active');
      $menuHideDivs.hide();
      $('#bounds').removeClass('relative');
    }
    else {
      $('.menu-bar a, .navbar li').removeClass('active');
      $menuHideDivs.hide();    
      $('.overlay').toggle();
      $('.search-bar').toggle();
      $('.search-bar input').focus();
      $(this).parent('li').toggleClass('active');
      $('#bounds').addClass('relative');
    }

  });
  
  /**
   * Toggle search bar when hitting the escape key
   */
 /** $(document).keyup(function(e) {
     // hit escape key
    if (e.keyCode == 27) {
      $('.menu-search').trigger('click');
    }  
  });  
  


  /**
   * This controls submenu behavior
   */
  $('.menu-bar > .relative > ul.menu-list > li > a').click(function(e){
    if($(this).parent('li').find('.submenu')[0]) {
      // Prevent default event and show submenu
      e.preventDefault();
      // remove active classes and set this element's active class.
      $(this).parent('li').siblings().find('a').removeClass('active');
      $(this).toggleClass('active');
      // close other open menus and open this element's submenu.
      // We have to use an empty submenu-bar to correctly position submenu for
      // iPad/Android. Caused by nested absolute positioned elements in the menu.
      if ($('body.small')[0] || $('body.smallest')[0]) {
        $('.submenu-bar').hide();
        $(this).parent('li').siblings().find('.submenu').hide();
        //$(this).parent('li').find('.submenu').slideToggle();
        $(this).parent('li').find('.submenu').toggle();
      }
      else {
        $('.submenu-bar').hide();
        $(this).parent('li').siblings().find('.submenu').hide();
        var html = $(this).parent('li').find('.submenu').html();
        $('.submenu-bar').html(html).toggle();
        // Retrigger datepicker
        $('.datepicker').removeClass('hasDatepicker').removeAttr('id').datepicker();  
      }
    }  
  });
  
  // Turns on datepicker if class is on an element
  //$('.datepicker').datepicker();
  // Setting readonly = true will prevent native datepickers to fire.
  $('.datepicker').attr("readonly", "true").datepicker(); 

  
  /**
   * Waypoints scripts...too buggy.
   */
  
  /*
  $('#top-left h4').waypoint(function(direction) {
    $('#top-left h4').removeClass('sticky');
    if (direction == 'down') {
      $(this).addClass('sticky');
    }
  }, { offset: $('#top-left .spothead').height(), context: '#top-left' });
  */
  /*
  $('.search #middle-center .spothead').waypoint(function(direction){
    if (direction == 'down') {
      $(this).slideUp(500);
    }
    else if (direction == 'up') {
      $(this).slideDown(500);  
    }  
  }, {offset: 500, context: '.search #middle-center' });
  */ 
  
  /**
   * Clear search box
   */
  $('a.clear-search').click(function(){
    $('input.search-box').val('');
    $('.search-wrap').removeClass('show-result-count');
  });
  
  /**
   * Nice Scroll (http://areaaperta.com/nicescroll/)
   * Adds a touch screen like scrollbar for the desktop.
   */
  /*#top-left, #middle-center, #bottom-right, .categories, .browse*/
  var settings = {cursorcolor: "#CCD6E4", hidecursordelay: "1000", cursoropacitymax: ".9", mousescrollstep: "10", cursorwidth: "6px"};
  var $scrolldivs = $("#top-left, #middle-center, #bottom-right, .categories");
  var device = navigator.userAgent.toLowerCase();
  var mobile = device.match(/(iphone|ipod|ipad|android)/);
  if(mobile) {
     // $scrolldivs.getNiceScroll().remove();
  }
  else {
      // Only turn on scrollbars for desktop
    $scrolldivs.niceScroll(settings);
    $scrolldivs.addClass('nicescroll-enabled');
    /*$scrolldivs.scroll(function(){ $(this).getNiceScroll().resize();});*/
    $('.navbar.main-menu a').tooltip({placement : 'right'}); //seems like a safe bet to put this here...
  }
  
  /**
   * Homepage touch/click to expand highlights
   */
  
  // Toggle opening/closing highlights bar
  // openclose can be'close','open', 'toggle'
  // Default is 'toggle' if no argument sent
  function toggleHighlights(openclose) {
    
    openclose = typeof openclose !== 'undefined' ? openclose : 'toggle';
  
    var slide_width = $('.slideshow').width();
    if (openclose == 'open') {
      //force open
      $('.highlights').addClass('open').animate({
          left:40
        }, 500, function(){
          $(window).trigger('resize');
          $('.browse-top').show(); 
      });      
    }
    else if (openclose =='close') {
      // force close
      $('.highlights').removeClass('open').animate({
          left:slide_width
        }, 500, function(){
          $(window).trigger('resize');
          $('.browse-top').hide();
      });         
    }
    else {
      // toggle based on class
      if($('.highlights.open')[0]) {
        $('.highlights').removeClass('open').animate({
            left:slide_width
          }, 500, function(){
            $(window).trigger('resize');
            $('.browse-top').hide();
        });      
      }
      else {
        $('.highlights').addClass('open').animate({
            left:40
          }, 500, function(){
            $(window).trigger('resize');
            $('.browse-top').show(); 
        });
      }
    }
  }

  // Highlights Swipe Binding
  $(".home .highlights").swipe( {
    //Generic swipe handler for all directions
    swipe:function(event, direction, distance, duration, fingerCount) {
      var slide_width = $('.slideshow').width();
      if (direction == 'right') {
          toggleHighlights('close');
      }
      if (direction == 'left') {
        toggleHighlights('open'); 
      }
    },
    //Default is 75px, set to 0 for demo so any distance triggers swipe
    threshold:5
  });  

  /* Highlights Click Binding */
  $('.home .highlights .handle, .home .highlights .drawer').bind("touchstart mousedown", function(){
   toggleHighlights();
  });

  $('.home ul.cat-list li a').click(function(){
    if (!$(this).hasClass('active')) {
      toggleHighlights('open');
    }
    $('.home ul.cat-list li').find('a').removeClass('active');
    $(this).addClass('active');
  });


  /**
   * Bookmark Editing (switch mode)
   */
  $('a.action-edit').click(function(){
    $('body').toggleClass('edit-mode');    
    if ($(this).html() == 'Edit') {
      $(this).html('Done');
      $('.pods .button-wrap.action-remove').fadeIn('slow');  
    }
    else if ($(this).html() == 'Done') {
      $(this).html('Edit');
      $('.pods .button-wrap.action-remove').fadeOut();      
    }
  });

  /**
   * Bookmark editing (bookmark removal)
   */
  $('.action-remove').click(function(e){
    e.preventDefault();   
    $(this).parents('li.pod').fadeOut('slow').remove();
    var l = $('ul.pods li').length;
    if (l <= 0) {
     // No pods
     $('.bookmarks ul.pods').replaceWith('<div class="error"><h3>No Bookmarks.</h3></div>');
    }
  });

  /**
   * Left column toggle for small screens.
   */
  $('#top-left .spothead .action-toggle').click(function(){
    if ($(this).html() == 'More') {
      $(this).html('Less');
      $('#top-left .inner').show();  
    }
    else if ($(this).html() == 'Less') {
      $(this).html('More');
      $('#top-left .inner').hide(); 
    }
  });
  
  /**
   * Search filter toggle
   */
  $('.action-toggle-filter').click(function(){
    if ($(this).html() == 'Filter') {
      $(this).html('Close');
      //$('.search-filter-wrap').slideDown().
      $('.search-filter-wrap').show();
      $('body').addClass('search-filter-open');
    }
    else if ($(this).html() == 'Close') {
      $(this).html('Filter');
      //$('.search-filter-wrap').slideUp();
      $('.search-filter-wrap').hide();
      $('body').removeClass('search-filter-open');

    }
  });  
  

 /**
  * RESPONSE JS (http://responsejs.com/)
  */
 /* Adds classes dynamically based on viewport size, refreshes on resize */
 Response.action(function(){

   var w = Response.viewportW();
   var h = Response.viewportH();
   $('body').removeClass('large medium medium-small small smallest');

   if (!mobile) {
    $scrolldivs.getNiceScroll().resize();
   }
   /* Force heights for slideshow*/
   if (w > 600) {
    if (w >= 1024) {
      // set slide to full height of window
      $('.slide').height(h);
      $('.slideshow').height(h);
    }
    else {
      // set slider slightly above the fold
      $('.slide').height(h - 55);
      $('.slideshow').height(h - 55);
    }
    if ($('.pods.grid-view')[0]) {
     /* Masonry :: http://masonry.desandro.com */
     
      var $container = $('.pods.grid-view');
      // initialize
      $container.imagesLoaded(function(){
       $('.masonry-enabled').masonry('destroy').removeClass('masonry-enabled');
       $container.masonry({
         columnWidth: '.pods.grid-view .pod a.link',
         gutter: 0,
         transitionDuration: 0,
         itemSelector: '.pods.grid-view .pod a.link'
       }).addClass('masonry-enabled');
      });
    } 
   
   }
   else {
    if (w < 450) {
      $('.masonry-enabled').masonry('destroy').removeClass('masonry-enabled');  
    }
    $('.slide').height(395);
    $('.slideshow').height(395);
   }
  
   if (w >= 1024) {
     $('body').addClass('large');
   }
   else if(w >= 720 && w < 1024) {
    $('body').addClass('medium');
   }
   else if (w >= 600 && w < 720) {
    $('body').addClass('medium-small');
   }
   else if(w > 450 && w < 600) {
     $('body').addClass('small');
   }
   else if (w < 450) {
     $('body').addClass('smallest');
   }
 });
 
 if ($('.slideshow')[0]) {
    $('.slideshow').cycle({
      fx:     'scrollHorz',
      speed: 1000,
      timeout: 5000,
      slides: '.slide',
      swipe: true,
      height: '100%',
      width: '100%',
      next:   '#next', 
      prev:   '#prev'
    });
  }

  
  $(window).trigger('resize'); /* This triggers resize on page load to ensure things like masonry are catching the right dimensions*/
  
                                                      
})(jQuery);

