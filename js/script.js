$(document).ready(function() {
    var windowEl = $(window);
    var windowW = windowEl.width();
    var header = $(".header");

    windowEl.scroll(function(scrlevt) {
        scrlevt.preventDefault();
        var scroll = $(window).scrollTop();
        if (scroll > 1) {
            header.addClass("fixed");
        } else {
            header.removeClass("fixed");
        };
        return false;
    });

    function resizeSlider() {
        $('.benefits__slider').not('.slick-initialized').slick({
            speed: 500,
            infinite: true,
            slidesToShow: 1,
            dots: true,
            arrows: false,
        });
    };

    //benefits slider
    if (windowW < 991) {
        resizeSlider();
    };

    // resize slider
    var counter = 0;
    var i = 0;

    $(window).on('resize orientationchange', function(event) {
        var windowEl = $('body');
        var windowW = windowEl.width();

        if (windowW < 1191) {
            counter++
            if (counter == 1) {
                resizeSlider();
                i = 1;
                counter = 0;
            }
        } else if (windowW >= 1191 && i == 1) {
            $('.benefits-slide').removeAttr('id aria-describedby tabindex role');
            setTimeout(function() {
                $('.benefits__slider').slick('unslick');
            }, 500);
            counter = 0;
            i = 0;
        };
    });

    // reviews slider
    $(".reviews__slider").not('.slick-initialized').slick({
        speed: 500,
        infinite: true,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        dots: true,
        // fade: true,
        prevArrow: false,
        nextArrow: false,
        responsive: [{
            breakpoint: 1025,
            settings: {
                arrows: false,
                fade: false,
                slidesToShow: 1,
                slidesToScroll: 1,
                adaptiveHeight: true,
            }
        }]
    });



    var services = {
        buttons: $('.services__item-container'),
        textEl: $('.services__item-text'),
        closedClass: 'closed',
        init: function() {
            var self = this;
            self.textEl.each(function() {
                var thisEl = $(this);
                var thisH = thisEl.outerHeight();
                thisEl.parent().css('max-height', thisH + 'px');
                if ((windowW > 767) && (thisH > 112)) {
                    thisEl.parent().addClass('slide-active');
                } else if (windowW <= 767) {
                    thisEl.parent().addClass('slide-active');
                };
            });
            self.buttons.on('click', function() {
                $(this).children('.services__item-text-container').toggleClass(self.closedClass);
            });
        }
    };
    services.init();


    //smooth scroll
    $('.nav__list a, .logo-link').click(function(event) {
        var offsetTop = 0;
        if (windowW < 1025) {
            closeMenu();
            offsetTop = header.outerHeight();
        }
        $('html, body').animate({
            scrollTop: $($.attr(this, 'href')).offset().top - offsetTop
        }, 500);
        event.preventDefault();
    });

    //mobile menu
    $('#menu-btn').on('click', function() {
        $('.nav').addClass('opened');
    });
    $('#close-menu').on('click', function() {
        closeMenu();
    });

    function closeMenu() {
        $('.nav').removeClass('opened');
    };
    //close popup
    function closePopup() {
        $('.lity-close').click();
    };
    $('.close-popup').on('click', function() {
        closePopup();
    });

    $('.input-wrapper input,.input-wrapper textarea').on('blur', function() {
        var thisInp = $(this);
        if (thisInp.val() != '') {
            thisInp.addClass('not-empty');
        } else {
            thisInp.removeClass('not-empty');
        }
    });

    //short form
    $('.form-short__submit,.nav__order-btn,.main-slider__form-btn').on('click', function() {
        var thisEl = $(this);
        var formId = thisEl.attr('data-id');
        var nameInp = thisEl.siblings('.name-inp');
        var phoneInp = thisEl.siblings('.phone-inp');
        var name = nameInp.val();
        var phone = phoneInp.val();
        nameInp.val('');
        phoneInp.val('');
        $('#form-id').val(formId);
        if (name) $('#nameInp').val(name).addClass('not-empty');
        if (phone) $('#phoneInp').val(phone).addClass('not-empty');
    });
    //success
    function openSuccess() {
        $('#open-success-popup').click();
    };
    //form ajax
    $('form').submit(function(e) {
        var thisForm = $(this);
        var submitBtn = thisForm.find('input[type="submit"]');
        var data = new FormData(thisForm[0]);
        submitBtn.prop("disabled", true);
        $.ajax({
            url: '/mail.php',
            data: data,
            processData: false,
            contentType: false,
            cache: false,
            type: 'POST',
            success: function(data) {
                openSuccess();
                thisForm[0].reset();
                thisForm.find('.styled-inp').removeClass('not-empty');
                submitBtn.prop("disabled", false);
                $(dataLayer.push({ 'event': 'event_lendos' }));
            },
            error: function() {
                alert('Something went wrong!');
                submitBtn.prop("disabled", false);
            }
        });
        e.preventDefault();
    });

    //map
    initMap();

    function initMap() {

        var map = new google.maps.Map(document.getElementById('map'), {
            scrollwheel: false,
            zoom: 13,
            styles: [{
                    "featureType": "all",
                    "stylers": [{
                            "saturation": 0
                        },
                        {
                            "hue": "#e7ecf0"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "stylers": [{
                        "saturation": -70
                    }]
                },
                {
                    "featureType": "transit",
                    "stylers": [{
                        "visibility": "off"
                    }]
                },
                {
                    "featureType": "poi",
                    "stylers": [{
                        "visibility": "off"
                    }]
                },
                {
                    "featureType": "water",
                    "stylers": [{
                            "visibility": "simplified"
                        },
                        {
                            "saturation": -60
                        }
                    ]
                }
            ]
        });

        var geocoder = new google.maps.Geocoder();

        var address = $('#map-address').text();

        geocoder.geocode({ 'address': address }, function(results, status) {
            if (status == 'OK') {
                map.setCenter(results[0].geometry.location);
                var marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location,
                    title: document.title,
                    icon: '/img/map-pin.svg'
                });
            } else {
                console.log('Geocode was not successful for the following reason: ' + status);
            }
        });
    }
});