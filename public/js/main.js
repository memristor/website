function checkVisible(id, threshold, mode) {
    threshold = threshold || 0;
    mode = mode || 'visible';
    var elm = document.getElementById(id);
    var rect = elm.getBoundingClientRect();
    var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    var above = rect.bottom - threshold < 0;
    var below = rect.top - viewHeight + threshold >= 0;
    return mode === 'above' ? above : (mode === 'below' ? below : !above && !below);
}

function setVideoState(element, state) {
    var iframe = document.getElementById(element).contentWindow;
    iframe.postMessage('{"event":"command","func":"' + state + '","args":""}', '*');
}

(function($) {
	///////////////////////////
	// Scrollspy
	$('body').scrollspy({
		target: '#nav',
		offset: $(window).height() / 2
	});

	///////////////////////////
	// Smooth scroll
	$("#nav .main-nav a[href^='#']").on('click', function(e) {
		e.preventDefault();
		var hash = this.hash;
		$('html, body').animate({
			scrollTop: $(this.hash).offset().top
		}, 600);
	});

	$('#back-to-top').on('click', function(){
		$('body,html').animate({
			scrollTop: 0
		}, 600);
	});

	///////////////////////////
	// Btn nav collapse
	$('#nav .nav-collapse').on('click', function() {
		$('#nav').toggleClass('open');
	});

	///////////////////////////
	// Mobile dropdown
	$('.has-dropdown a').on('click', function() {
		$(this).parent().toggleClass('open-drop');
	});

	///////////////////////////
	// On Scroll
	$(window).on('scroll', function() {
		var wScroll = $(this).scrollTop();

		// Fixed nav
		wScroll > 1 ? $('#nav').addClass('fixed-nav') : $('#nav').removeClass('fixed-nav');

		// Back To Top Appear
		wScroll > 700 ? $('#back-to-top').fadeIn() : $('#back-to-top').fadeOut();

		// Video play
        for (var id of ['video-intro', 'video-join']) {
            setVideoState(id, checkVisible(id) ? 'playVideo' : 'pauseVideo');
        }
	});

	///////////////////////////
	// magnificPopup
	$('.work').magnificPopup({
		delegate: '.lightbox',
		type: 'image'
	});

	///////////////////////////

	$('#sponsors-slider').owlCarousel({
        center: true,
		loop: true,
		dots: true,
		nav: true,
		autoplay: true,
        autoplayTimeout: 1500,
        items: 3,
        responsive:{
            0:{
                items:1,
            },
            600:{
                items:3,
            },
            1000:{
                items:5,
            }
        }
	});

    $('#team-holder').owlCarousel({
        center: true,
        loop: true,
        dots: true,
        nav: true,
        autoplay: true,
        autoplayTimeout: 1500,
        autoplayHoverPause: true,
        responsive:{
            0:{
                items: 1,
            },
            600:{
                items: 2,
            },
            1000:{
                items: 4,
            }
        }
    });

	// Gallery
    var feed = new Instafeed({
        get: 'user',
        userId: '5404790759',
        clientId: 'adfb62fbac2a4860a154322e0f89269e',
        accessToken: '5404790759.1677ed0.68c78e97d8ab47d7bd70565554235ad2',
        resolution: 'low_resolution',
        template: '<div class="col-md-3 col-xs-6 work">\n' +
        '<img class="img-responsive" src="{{image}}" style="width: 100%; height: 220px; object-fit: cover;" alt="">\n' +
        '<div class="overlay"></div>\n' +
        '<div class="work-content">\n' +
        '<span>{{location}}</span>\n' +
        '<h3>{{caption}}</h3>\n' +
        '<div class="work-link">\n' +
        '<a target="_blank" href="{{link}}"><i class="fa fa-external-link"></i></a>\n' +
        '</div>\n' +
        '</div>\n' +
        '</div>'
    });
    feed.run();
})(jQuery);
