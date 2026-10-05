( function( $ ) {
    "use strict";

    var countDownTimers = {}, $doc = $( document ), $body = $( 'body' ), $buttonPopupBoxs = {}, $head = $( 'head' ), lang = $( 'html' ).attr( 'lang' );

    // Get the time of given date string in UTC format
    function getUTCTime( string ) {
        var date = new Date( string );
        return Date.UTC( date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds() );
    }
    function getLeftTime( now, target ) {
        if ( target - now > 0 ) {
            var totalLeft = Math.ceil( ( target - now ) / 1000 ), formatDate = [];
            [ 60, 60, 24 ].forEach( function( divisor ) {
                formatDate.unshift( Math.floor( totalLeft % divisor ) );
                totalLeft = totalLeft / divisor;
            } );
            formatDate.unshift( Math.floor( totalLeft ) );
            return formatDate;
        } else {
            return false;
        }
    }
    function renderCountDownHTML( $el, formatDate, timerID ) {
        if ( ! formatDate ) {
            clearInterval( countDownTimers[ timerID ] );
            formatDate = [ 0, 0, 0, 0 ];
        }
        $el.html( '' );
        [ 'days', 'hours', 'min', 'sec' ].forEach( function( item, index ) {
            $el.append(
                $( '<span>', { 'class': 'countdown-item ' + item } )
                    .append( $( '<span>', { 'class': 'countdown-amount', 'text': formatDate[ index ].toString().padStart( 2, '0' ) } ) )
                    .append( $( '<span>', { 'class': 'countdown-period', 'text': loftoceanElementorFront.countDown[ item ] } ) )
            );
        } );
    }
    function checkParallaxSection( wrap ) {
        if ( $( wrap ).length && $( wrap ).find( '.pt-parallax-on-scroll' ).length ) {
            $( wrap ).find( '.pt-parallax-on-scroll' ).each( function() {
                $body.trigger( 'loftoceanParallaxCheck', $( this ) );
            } );
        }
    }

    var targetLang = 'en';
    if ( lang ) {
        var langCode = lang.split( '-' )[0],
            targetLang = ( 'undefined' === typeof $.datepicker.regional[ langCode ] )
                ? ( ( 'undefined' === typeof $.datepicker.regional[ lang ] ) ? 'en' : lang )
                    : langCode;
    }
    $.datepicker.setDefaults( $.datepicker.regional[ targetLang ] );

    $( window ).on( 'elementor/frontend/init', function () {
        var $buttonPopups = $( 'body' ).find( '.elementor-widget.elementor-widget-pt_button > .elementor-widget-container > .pt-button-popup' );
        if ( $buttonPopups.length ) {
            $buttonPopups.each( function() {
                var $popup = $( this ), hash = $popup.data( 'popup-hash' );
                if ( hash && ! $buttonPopupBoxs[ hash ] ) {
                    $buttonPopupBoxs[ hash ] = $popup;
                }
            } );
        }
        $( 'body' ).on( 'click', '.elementor-widget > .elementor-widget-container .elementor-button-link.popup-box-enabled', function( e ) {
            var $button = $( this ), $widget = $button.closest( '.elementor-widget' ), $popup = false;
            if ( $widget.length && ( ! $widget.hasClass( 'elementor-element-edit-mode' ) ) && $button.data( 'popup-hash' ) ) {
                var hash = $button.data( 'popup-hash' );
                if ( $buttonPopupBoxs[ hash ] ) {
                    $popup = $buttonPopupBoxs[ hash ];
                } else {
                    $popup = $widget.find( '.pt-button-popup' );
                    $buttonPopupBoxs[ hash ] = $popup.detach();
                }
                if ( ( false !== $popup ) && $popup.length ) {
                    e.preventDefault();
                    var $activedPopups = $body.children( '.pt-button-popup.show' );
                    $doc.trigger( 'beforeopen.popupbox.loftocean', [ this ] );
                    if ( $activedPopups.length ) {
                        $activedPopups.removeClass( 'show' );
                        $activedPopups.each( function() {
                            if ( $ (this ).data( 'popup-hash' ) ) {
                                $buttonPopupBoxs[ $( this ).data( 'popup-hash' ) ] = $( this ).detach();
                            }
                        } );
                    }
                    $popup.appendTo( $body ).addClass( 'show' );
                    return false;
                }
            }
        } ).on( 'click', '.pt-popup.pt-popup-box.pt-button-popup.show .close-button', function( e ) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var $popup = $( this ).closest( '.pt-button-popup' );
            $popup.removeClass( 'show' );
            if ( $popup.data( 'popup-hash' ) ) {
                $buttonPopupBoxs[ $popup.data( 'popup-hash' ) ] = $popup.detach();
            }
            return false;
        } ).on( 'click', function( e ) {
            var $buttonPopup = $( '.pt-popup.pt-popup-box.pt-button-popup.show' );
            if ( $buttonPopup.length && ! $buttonPopup.hasClass( 'close-manually' ) ) {
                var $target = $( e.target ), targetClass = $target.attr( 'class' );
                if ( ( ! targetClass ) || ( ! /ui-/.test( targetClass ) ) ) {
                    if ( ! ( $target.parents( '.pt-button-popup' ).length || $target.hasClass( 'pt-button-popup' ) ) ) {
                        $buttonPopup.removeClass( 'show' );
                    } else {
                        $target.hasClass( 'container' ) || $target.parents( '.container' ).length ? '' : $buttonPopup.removeClass( 'show' );
                    }
                }
            }
        } );

        elementorFrontend.hooks.addAction( 'frontend/element_ready/global', function( $scope ) {
            if ( $scope.css( 'background-image' ) ) {
                if ( $scope.hasClass( 'pt-parallax-on-scroll' ) ) {
                    $( 'body' ).trigger( 'add.loftoceanParallax', $scope );
                } else {
                    $scope.css( 'background-image', '' );
                }
            }
        } );
        elementorFrontend.hooks.addAction( 'frontend/element_ready/pt_button.default', function( $scope ) {
            var $link = $scope.children( '.elementor-widget-container' ).children( 'a.elementor-button-link' ), widgetID = $scope.data( 'id' );
            if ( $link.length ) {
                if ( $scope.hasClass( 'elementor-element-edit-mode' ) && ( 'undefined' !== typeof elementor ) ) {
                    var $activedPopups = $body.children( '.pt-button-popup' );
                    if ( $activedPopups.length ) {
                        var $previewButton = elementor.panel.$el.find( '.elementor-control-popup_box_preview .elementor-control-input-wrapper button' );
                        $activedPopups.each( function() {
                            var $popup = $( this );
                            if ( $popup.data( 'popup-hash' ) ) {
                                $popup.removeClass( 'show' );
                                $buttonPopupBoxs[ $popup.data( 'popup-hash' ) ] = $popup.detach();
                            } else {
                                $( this ).hasClass( 'pt-button-popup-' + widgetID ) ? $( this ).remove() : '';
                            }
                        } );
                        $previewButton.trigger( 'click' );
                    }
                } else {
                    var $popup = $link.siblings( '.pt-button-popup' );
                    if ( $popup.length ) {
                        var $customStyle = $popup.find( 'link[type="text/css"], style' );
                        $customStyle.length ? $popup.before( $customStyle ) : '';
                        // $popup.find( '.pick-date' ).length ? $popup.addClass( 'close-manually' ) : '';
                    }
                }
            }
        } );
        elementorFrontend.hooks.addAction( 'frontend/element_ready/wp-widget-loftocean-widget_facebook.default', function( $scope ) {
            if ( $body.hasClass( 'elementor-editor-active' ) && ( typeof FB !== 'undefined' ) && $scope.find( '.loftocean-fb-page' ).length ) {
                if ( ! $scope.find( '.loftocean-fb-page' ).attr( 'fb-xfbml-state' ) ) {
                    FB.XFBML.parse();
                }
            }
        } );
        elementorFrontend.hooks.addAction( 'frontend/element_ready/wp-widget-loftocean-widget-posts.default', function( $scope ) {
            if ( $body.hasClass( 'elementor-editor-active' ) ) {
                $scope.find( '[data-show-list-number="on"]' ).length ? $scope.addClass( 'with-post-number' ) : $scope.removeClass( 'with-post-number' );
            }
        } );
        elementorFrontend.hooks.addAction( 'frontend/element_ready/wp-widget-loftocean-widget-instagram.default', function( $scope ) {
            if ( $body.hasClass( 'elementor-editor-active' ) && $scope.find( '.elementor-instagram-settings' ).length ) {
                $scope.addClass( $scope.find( '.elementor-instagram-settings' ).data( 'columns' ) );
            }
        } );
        elementorFrontend.hooks.addAction( 'frontend/element_ready/pt_rounded_image.default', function( $scope ) {
            var $gallery = $scope.find( '.pt-gallery.gallery-carousel .pt-gallery-wrap' );
            if ( $gallery.length ) {
                $gallery.slick( {
                    dots: true,
                    arrows: false,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    speed: 500,
                    autoplay: true,
                    autoplaySpeed: 4000,
                    pauseOnHover: false
                } );
            }
        } );
        elementorFrontend.hooks.addAction( 'frontend/element_ready/pt_testimonials.default', function( $scope ) {
            var $slider = $scope.find( '.testimonials-slider' );
            if ( $slider.length ) {
                var column = $slider.data( 'column' ), sliderResponsiveArgs = [ {
                    breakpoint: 1024,
                    settings: { slidesToShow: 3 }
                }, {
                    breakpoint: 768,
                    settings: { slidesToShow: 2 }
                }, {
                    breakpoint: 480,
                    settings: { slidesToShow: 1 }
                } ], sliderArgs = {
                    dots: 'on' == $slider.data( 'show-dots' ),
                    arrows: 'on' == $slider.data( 'show-arrows' ),
                    slidesToShow: column,
                    slidesToScroll: 1,
                    infinite: true,
                    speed: 500,
                    autoplay: 'on' == $slider.data( 'autoplay' ),
                    autoplaySpeed: $slider.data( 'autoplay-speed' ),
                    pauseOnHover: false,
                    responsive: column < 3 ? sliderResponsiveArgs.slice( - column ) : sliderResponsiveArgs
                };
                if ( 1 == column ) {
                    sliderArgs[ 'fade' ] = true;
                }
                $slider.find( '.pt-ts-wrap' ).slick( sliderArgs );
            }
        } );

        elementorFrontend.hooks.addAction( 'frontend/element_ready/pt_blog.default', function( $scope ) {
            if ( $body.hasClass( 'elementor-editor-active' ) ) {
                var $masonry = $scope.find( '.posts.layout-masonry' );
                if ( $masonry.length ) {
                    $doc.trigger( 'patiotime.initMasonry', $masonry );
                }
            }
        } );

        elementorFrontend.hooks.addAction( 'frontend/element_ready/pt_gallery.default', function( $scope ) {
            var $gallery = $scope.find( '.pt-gallery.gallery-carousel' );
            if ( $gallery.length ) {
                var column = $gallery.data( 'column' ), galleryResponsiveArgs = [ {
                    breakpoint: 1024,
                    settings: { slidesToShow: 3 }
                }, {
                    breakpoint: 768,
                    settings: { slidesToShow: 2 }
                }, {
                    breakpoint: 480,
                    settings: { slidesToShow: 1 }
                } ], sliderArgs = {
                	dots: 'on' == $gallery.data( 'show-dots' ),
                	arrows: 'on' == $gallery.data( 'show-arrows' ),
                	slidesToShow: column,
                	slidesToScroll: 1,
                	infinite: true,
                	speed: 500,
                	autoplay: 'on' == $gallery.data( 'autoplay' ),
                	autoplaySpeed: $gallery.data( 'autoplay-speed' ),
                    pauseOnHover: false,
                	responsive: column < 3 ? galleryResponsiveArgs.slice( - column ) : galleryResponsiveArgs
                };
                if ( 1 == column ) {
                    sliderArgs[ 'fade' ] = ( 'on' == $gallery.data( 'fade' ) );
                }

                $gallery.find( '.pt-gallery-wrap' ).slick( sliderArgs );
            }
        } );
        elementorFrontend.hooks.addAction( 'frontend/element_ready/pt_info_box.default', function( $scope ) {
            var $slider = $scope.find( '.pt-info-box.info-box-carousel' );
            if ( $slider.length ) {
                var column = $slider.data( 'column' ), sliderResponsiveArgs =
                    [ {
                        breakpoint: 1024,
                        settings: { slidesToShow: 2 }
                    }, {
                        breakpoint: 768,
                        settings: { slidesToShow: 1 }
                    } ];
                $slider.find( '.pt-info-box-wrap' ).css( 'display', 'block' ).slick( {
                    dots: 'on' == $slider.data( 'show-dots' ),
                    arrows: 'on' == $slider.data( 'show-arrows' ),
                    slidesToShow: column,
                    slidesToScroll: 1,
                    infinite: true,
                    speed: 500,
                    autoplay: 'on' == $slider.data( 'autoplay' ),
                    autoplaySpeed: 3000,
                    pauseOnHover: false,
                    responsive: column < 2 ? sliderResponsiveArgs.slice( - column ) : sliderResponsiveArgs
                } );
            }
        } );
        elementorFrontend.hooks.addAction( 'frontend/element_ready/pt_open_table.default', function( $scope ) {
            var $openTableForm = $scope.find( '.pt-open-table-wrap form' );
            if ( $openTableForm.length ) {
                var $multiRestaurants = $openTableForm.find( '.pick-restaurant' ), $rid = $openTableForm.find( '[name=rid], [name=restref]' ),
                    $datePicker = $openTableForm.find( 'input.pick-date' ), dateFormat = $openTableForm.data( 'date-format' ) ? $openTableForm.data( 'date-format' ) : 'yy-mm-dd';
                $datePicker.datepicker( { 'dateFormat': dateFormat, 'minDate': $openTableForm.data( 'book-in-advance' ) } );
                $head.find( '#loftocean-open-table-date-picker' ).length ? '' : $head.append(
                    $( '<style>', { 'type': 'text/css', 'id': 'loftocean-open-table-date-picker', 'text': '#ui-datepicker-div { z-index: 100005 !important; }' } )
                );
                $multiRestaurants.length ? $multiRestaurants.on( 'change', function() { $( this ).removeClass( 'error' ); } ) : '';
                $openTableForm.on( 'click', '.button', function( e ) {
                    e.preventDefault();
                    var dateTime = 'T' + $openTableForm.find( '.pick-time' ).val(), error = false;
                    if ( 'yy-mm-dd' == dateFormat ) {
                        dateTime = $datePicker.val() + dateTime;
                    } else {
                        $datePicker.datepicker( 'option', 'dateFormat', 'yy-mm-dd' );
                        dateTime = $datePicker.val() + dateTime;
                        $datePicker.datepicker( 'option', 'dateFormat', dateFormat );
                    }
                    $openTableForm.find( '[name=dateTime]' ).val( dateTime );
                    if ( $multiRestaurants.length ) {
                        var currentRestaurant = $multiRestaurants.val();
                        currentRestaurant ? $rid.val( currentRestaurant ) : ( error = true, $multiRestaurants.addClass( 'error' ) );
                    }
                    if ( ! error ) {
                        $openTableForm.data( 'popup-new-window' )
                            ? window.open( $openTableForm.attr( 'action' ) + '?' + $openTableForm.serialize(), $openTableForm.attr( 'title' ), 'popup' )
                                : $openTableForm.submit();
                    }
                } );
            }
        } );
        elementorFrontend.hooks.addAction( 'frontend/element_ready/pt_countdown.default', function( $scope ) {
            var $countDwon = $scope.find( '.pt-countdown-wrap' );
            if ( $countDwon.length ) {
                var targetDate = getUTCTime( $countDwon.data( 'end-date' ) ), timerID = $scope.data( 'id' );
                clearInterval( countDownTimers[ timerID ] );
                renderCountDownHTML( $countDwon, getLeftTime( new Date().getTime(), targetDate ), timerID );
                countDownTimers[ timerID ] = setInterval( function() {
                    renderCountDownHTML( $countDwon, getLeftTime( new Date().getTime(), targetDate ), timerID );
                }, 1000 );
            }
        } );
        elementorFrontend.hooks.addAction( 'frontend/element_ready/pt_tabs.default', function( $scope ) {
            var $titles = $scope.find( '.pt-tabs .tab-title-link' );
            if ( $titles.length ) {
                var $contents = $scope.find( '.elementor-tabs-content-wrapper .elementor-tab-content' );
                $titles.on( 'click', function( e ) {
                    e.preventDefault();
                    var $self = $( this ).parent();
                    if ( ! $self.hasClass( 'elementor-active' ) ) {
                        $self.addClass( 'elementor-active' ).siblings().removeClass( 'elementor-active' );
                        $contents.addClass( 'hide' ).removeClass( 'elementor-active' )
                            .filter( $( this ).attr( 'href' ) ).removeClass( 'hide' ).addClass( 'elementor-active' );
                    }
                } );
            }
        } );
        elementorFrontend.hooks.addAction( 'frontend/element_ready/pt_slider.default', function( $scope ) {
            var $slider = $scope.find( '.pt-slider' );
            if ( $slider.length ) {
                var sliderCurrentClass = 'current-item';
                $slider.find( '.pt-slider-item' ).removeClass( 'hide' );
        		$slider.find( '.pt-slider-wrap' ).on( 'init', function( e, slick ) {
                    var current = slick.slickCurrentSlide();
                    checkParallaxSection( slick.$slider );
                    $( this ).find( '.pt-slider-item' ).filter( '[data-slick-index=' + current + ']' ).addClass( sliderCurrentClass );
                } ).on( 'afterChange', function( e, slick, currentSlide ) {
                    var count = $( this ).find( '.pt-slider-item' ).length, prevSlide = ( currentSlide - 1 + count ) % count;
                    $( this ).find( '.pt-slider-item' )
                        .removeClass( sliderCurrentClass )
                        .filter( '[data-slick-index=' + currentSlide + ']' ).first().addClass( sliderCurrentClass );
                } ).slick( {
        			dots: 'on' == $slider.data( 'show-dots' ),
        			arrows: 'on' == $slider.data( 'show-arrows' ),
        			slidesToShow: 1,
        			slidesToScroll: 1,
        			infinite: true,
        			speed: 500,
        			autoplay: 'on' == $slider.data( 'autoplay' ),
        			autoplaySpeed: $slider.data( 'autoplay-speed' ) || 5000,
                    pauseOnHover: false,
                    fade: true
        		} );
            }
        } );

        if ( ! $body.hasClass( 'elementor-editor-active' ) ) {
            var currentHash = window.location.hash ? window.location.hash : false, enableAutoScroll = true,
                currentSearch = window.location.search ? new URLSearchParams( window.location.search ) : false;
            if ( currentSearch ) {
                enableAutoScroll = currentSearch.get( 'disable-auto-scroll' ) ? false : true;
            }
            currentHash = currentHash ? currentHash.substr( 1 ) : false;
            if ( enableAutoScroll && currentHash ) {
                var $tabTitle = $( '.pt-tabs .elementor-tab-title a[data-id="' + currentHash + '"]' );
                if ( $tabTitle && $tabTitle.length ) {
                    setTimeout( function() {
                        $tabTitle.trigger( 'click' );
                        if ( $tabTitle.data( 'auto-scroll' ) && ( 'on' == $tabTitle.data( 'auto-scroll' ) ) ) {
                            $( 'html, body' ).animate( { scrollTop: $tabTitle.offset().top - 50 }, 200 );
                        }
                    }, 100 );
                }
            }
        }
    } );
} ) ( jQuery );
