// for calculator on /reight-rate-calculator/
// -----------------
function calculateVolume() {
    var quantity = document.getElementById("quantity").value;
    var length = document.getElementById("length").value;
    var width = document.getElementById("width").value;
    var height = document.getElementById("height").value;
    document.getElementById("total-volume").value = ((quantity * length * width * height) / 1000000).toFixed(2);
}


(function($) {

	// check if we need a transparant or a white header based on scoll position
	// -----------------

	var lastScrollTop = 0;

	function check_header_state() {
	  var scrolldistance = $(document).scrollTop();

	  // not at the top of the page
	  if (scrolldistance > 50) {

		if (scrolldistance > 150) {
			$('.header').addClass('header--small');
		}
		else{
			$('.header').removeClass('header--small');
		}

	  	// scrolling down
	  	if (scrolldistance > lastScrollTop){
	  		var busy = true;
	  		$('.header').addClass('header--hidden');
	  		$('.header').filter(':not(:animated)').animate({opacity: 0}, 200);
		}

		// scrolling up
		else{
			$('.header').filter(':not(:animated)').animate({opacity: 1}, 200);
			$('.header').removeClass('header--hidden');
		}

	  }

	  // at the top of the page
	  else
	  {
	  	$('.header').filter(':not(:animated)').animate({opacity: 1}, 200);
		$('.header').removeClass('header--hidden');
	    $('.header').removeClass('header--small');
	  }

	  lastScrollTop = scrolldistance;
	}


    // on scroll,  check header state
    // -----------------
    $(document).scroll(function() {
      check_header_state();
    });

	// ON DOCUMENT READY
	$(document).ready(function() {
		// check the header state on page load
		check_header_state();

		// on click hamburger, open the menu
		// -----------------
		$('.header').on('click', 'div[data-action=js-open-menu]', function() {
		  $(this).attr('data-action', 'js-close-menu');
		  $('.navigation').slideDown(400);
		  $('.header').addClass('header--open');
		  $('.header__hamburger').addClass('header__hamburger--close');
		  const targetElement = document.querySelector('.header');
		  //bodyScrollLock.disableBodyScroll(targetElement);
		});

		$('.header').on('click', 'div[data-action=js-close-menu]', function() {
			$('.navigation').slideUp(200, function() {
		  	$('.header').addClass('header--open');
				$('.header').removeClass('header--open');
		  	});
			$(this).attr('data-action', 'js-open-menu');
			$('.header__hamburger').removeClass('header__hamburger--close');
			const targetElement = document.querySelector('.header');
			//bodyScrollLock.enableBodyScroll(targetElement);
		});

		// flex slider
		var owl_slider = $('.js-slider');
		owl_slider.owlCarousel({
			items: 3,
			loop: true,
			responsiveClass:true,
			    responsive:{
			        0:{
			            items:1
			        },
			        768:{
			            items:2
			        },
			        960:{
			            items:3
			        }
			    }
		});

		// fixed carousel
		var owl = $('.js-carousel');
		owl.owlCarousel({
			items: 1,
			loop: true,
			nav: true,
			navText: ''
		});

		// Listen to owl events:
		owl.on('changed.owl.carousel', function(event) {
			parent = $(event.target).closest('.demo');
			slide = event.page.index + 1;
			$(".demo__image", parent).fadeOut();
			$(".demo__image:nth-child("+slide+")", parent).fadeIn();
		})

		$('.networkmap').on('click', '[data-action=js-toggle-map]', function() {
			$(".networkmap__radio").toggleClass("networkmap__radio--active");
			$("[data-target=js-mapoverlay]").fadeToggle();
		});

		$('.maplist').on('click', '[data-action=js-togglemaplist]', function() {
			$("[data-target=js-maplist]").animate({
			  height: "toggle",
			  opacity: "toggle"
			}, 400);
			$('span', this).toggle();
		});


		$('.blog').on('click', 'span', function() {
			var filter_cat = $(this).attr('data-filter');
			$('.is-active').removeClass('is-active');
			$(this).addClass('is-active');
			if(filter_cat=="all"){
				$('.js-blog-post').show();
			}else{
				$('.js-blog-post').hide();
			}
			var filter_data_attr = "[data-categories*="+filter_cat+"]";
			$(filter_data_attr).show();
		});


		$(document).on('submit','form[data-action=js-subscribe]',function()
		{
			input = $('input', this).val();
			var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
			if (!testEmail.test(input)){
			    event.preventDefault();
			    $(this).addClass('has-error');
			}
		});

		$(document).on('gform_confirmation_loaded', function(event, formId){
			if($( document ).width() < 992){
				var quoteurl =  window.location.href.replace(/\/+$/, "").replace("#getaquote", "") + "#getaquote";
			}else{
				var quoteurl =  window.location.href.replace(/\/+$/, "").replace("#getaquote", "");
			}
			$('a.anotherquote', '.gform_confirmation_message_2').attr("href", quoteurl);
		});

		$('#gform_6 input[type=submit]').click(function (event) {
			event.preventDefault();
			$('.signup__error-message').remove();

			const baseUrl = window.location.hostname === 'www.twill.net' ? 'https://api.twill.net' :'https://tmms-primary-dev-api.np.twill.net';
			const signupUrl = 'auth/api/users/signup.html';
			const requestUrl = baseUrl + signupUrl;

			const inputs = $('#gform_6 .gfield:not(.gform_hidden) input');
			const requestBody = {
				firstName: $(inputs[0]).val(),
				lastName: $(inputs[1]).val(),
				email: $(inputs[2]).val(),
				password: $(inputs[3]).val(),
				marketingAllowed: $(inputs[5]).is(":checked"),
				agreedWithTermsAndConditions: $(inputs[4]).is(":checked"),
				defaultLanguage: "en",
			};

			const listItems = $('#gform_6 .gfield:not(.gform_hidden)');
			listItems.removeClass('signup__field--has-error');

			$.ajax({
				type: 'POST',
				url: requestUrl,
				data: JSON.stringify(requestBody),
				contentType: 'application/vnd.signup.v1+json',
			}).fail(function (data) {
				const fieldsMapping = {
					firstName: $(listItems[0]),
					lastName: $(listItems[1]),
					email: $(listItems[2]),
					password: $(listItems[3]),
					agreedWithTermsAndConditions: $(listItems[4]),
					marketingAllowed: $(listItems[5])
				};

				data.responseJSON.messages.forEach(element => {
					const [type, message] = element.split(',');
					if (type && message) {
						fieldsMapping[type].append('<div class="signup__error-message">' + message.trim() + '</div>');
						fieldsMapping[type].addClass('signup__field--has-error');
					} else {
						$('#gform_6 .gform_body').append('<div class="signup__error-message">' + element.trim() + '</div>');
					}
				});

			}).done(function () {
				ga('send', 'event', 'sign up form', 'submit button', window.location.href);

				$('#gform_6').submit();
			});
		});


	}); // end on document ready

})(jQuery);

(function() {
    window.lvca_fs = {
        can_use_premium_code: false
    };
})();

(function(w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
    });
    var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l != 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.src = '../www.googletagmanager.com/gtm5445.html?id=' + i + dl;
    f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', 'GTM-PZMQ3W3');
