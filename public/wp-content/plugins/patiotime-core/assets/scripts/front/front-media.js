( function( $ ) {
	"use strict";
	var is_retina = ( 'devicePixelRatio' in window ) && ( parseInt( window.devicePixelRatio, 10 ) >= 2 ),
		imageDataName = is_retina ? 'data-loftocean-retina-image' : 'data-loftocean-normal-image', isRTL = $( 'body' ).hasClass( 'rtl' ),
		$backgroundImages = false, $responsiveImgs = false, $head = $( 'head' ), previousTop = 0, lazyLoadDelta = 100;

	// Replace images if needed
	$.fn.loftoceanImageLoading = function() {
		var $bgImages = $( this ).add( $( this ).find( '[data-loftocean-image=1]' ) ).filter( '[data-loftocean-image=1]' ),
			$imgs = $( this ).add( $( this ).find( 'img[data-loftocean-loading-image="on"]' ) ).filter( 'img[data-loftocean-loading-image="on"]' );
		if ( loftoceanImageLoad.lazyLoadEnabled ) {
			if ( $bgImages.length ) {
				$backgroundImages = $backgroundImages && $backgroundImages.length ? $backgroundImages.add( $bgImages ) : $bgImages;
			}
			if ( $imgs.length ) {
				$responsiveImgs = $responsiveImgs && $responsiveImgs.length ? $responsiveImgs.add( $imgs ) : $imgs;
			}
			$( window ).trigger( 'startLazyLoad.loftocean' );
		} else {
			if ( $bgImages.length ) {
				$bgImages.each( function() {
					var self = $( this );
					if ( self.attr( 'data-loftocean-image' ) ) {
						var name = self.prop( 'tagName' ), image = self.attr( imageDataName );
						$( new Image() ).on( 'load', function() {
							self.css( 'transition', 'none' );
							( 'IMG' == name ) ? self.attr( 'src', image ).removeAttr( 'style' ) : self.css( { 'background-image': 'url(' + image + ')', 'filter': '' } );
							self.css( 'transition', '' );
							self.removeAttr( 'data-loftocean-retina-image' ).removeAttr( 'data-loftocean-normal-image' ).removeAttr( 'data-loftocean-image' );
						} ).attr( 'src', image );
					}
				} );
			}

			if ( $imgs.length ) {
				$imgs.each( function() {
					if ( $( this ).attr( 'data-loftocean-loading-image' ) ) {
					   $( this ).data( 'srcset' ) ? $( this ).attr( 'srcset', $( this ).data( 'srcset' ) ).removeAttr( 'data-srcset' ) : '';
					   $( this ).data( 'loftocean-lazy-load-sizes' ) ? $( this ).attr( 'sizes', $( this ).data( 'loftocean-lazy-load-sizes' ) ).removeAttr( 'data-loftocean-lazy-load-sizes' ) : '';
   					   $( this ).data( 'src' ) ? $( this ).attr( 'src', $( this ).data( 'src' ) ).removeAttr( 'data-src' ) : '';
					   $( this ).removeAttr( 'data-loftocean-loading-image' ).css( { 'filter': '', 'opacity': '' } );
				   }
				} );
			}
		}
		return this;
	};

	if ( loftoceanImageLoad.lazyLoadEnabled ) {
		$( window ).on( 'startLazyLoad.loftocean', function( e) {
			var scrollBottom = $( window ).scrollTop() + $( window ).height(), $done = $();
			if ( $backgroundImages && $backgroundImages.length ) {
				$backgroundImages.each( function() {
					var self = $( this ), image = self.attr( imageDataName );
					if ( image && ( parseInt( self.offset().top - scrollBottom, 10 ) < lazyLoadDelta ) ) {
						$( new Image() ).on( 'load', function() {
							self.css( 'transition', 'none' );
							self.css( { 'background-image': 'url(' + image + ')', 'filter': '' } );
							self.css( 'transition', '' );
							self.removeAttr( 'data-loftocean-retina-image' ).removeAttr( 'data-loftocean-normal-image' ).removeAttr( 'data-loftocean-image' );
						} ).attr( 'src', image );
						$done = $done.add( self );
					}
				} );
				if ( $done.length ) {
					$backgroundImages = $backgroundImages.not( $done );
				}
			}
			if ( $responsiveImgs && $responsiveImgs.length ) {
				$done = $();
				$responsiveImgs.each( function() {
					if ( $( this ).attr( 'data-loftocean-loading-image' ) && ( parseInt( $( this ).offset().top - scrollBottom, 10 ) < lazyLoadDelta ) ) {
						$( this ).data( 'srcset' ) ? $( this ).attr( 'srcset', $( this ).data( 'srcset' ) ).removeAttr( 'data-srcset' ) : '';
						$( this ).data( 'loftocean-lazy-load-sizes' ) ? $( this ).attr( 'sizes', $( this ).data( 'loftocean-lazy-load-sizes' ) ).removeAttr( 'data-loftocean-lazy-load-sizes' ) : '';
						$( this ).data( 'src' ) ? $( this ).attr( 'src', $( this ).data( 'src' ) ).removeAttr( 'data-src' ) : '';
						$( this ).removeAttr( 'data-loftocean-loading-image' ).css( { 'filter': '', 'opacity': '' } );
						$done = $done.add( $( this ) );
					}
				} );
				if ( $done.length ) {
					$responsiveImgs = $responsiveImgs.not( $done );
				}
			}
		} )
		.on( 'scroll', function( e ) {
			var scrollTop = $( this ).scrollTop();
			previousTop < scrollTop ? $( this ).trigger( 'startLazyLoad.loftocean' ) : '';
			previousTop = scrollTop;
		} ).on( 'load', function( e ) {
			$( this ).trigger( 'startLazyLoad.loftocean' );
		} );
		$( 'body *' ).on( 'scroll', function() {
			$( window ).trigger( 'startLazyLoad.loftocean' );
		} );
	}

	document.addEventListener( 'DOMContentLoaded', function() {
		$( 'body' ).loftoceanImageLoading();
		$( 'body' ).on( 'click', '#page .loftocean-gallery-zoom', function( e ) {
			e.preventDefault();
			var $body 	= $( 'body' ),
				$wrap 	= $( this ).parent(),
				$slick 	= $wrap.children( '.image-gallery' ).first();
			if ( $body.hasClass( 'gallery-zoom' ) ) {
				$body.removeClass( 'gallery-zoom' );
				$wrap.removeClass( 'fullscreen' );
			} else {
				$body.addClass( 'gallery-zoom' );
				$wrap.addClass( 'fullscreen' );
			}
			$slick.slick( 'slickSetOption', 'speed', 500, true );
		} )
		.on( 'click', '.post-content-gallery.justified-gallery-initialized .gallery-item, .portfolio-gallery.gallery-justified .gallery-item', function( e ) {
			e.preventDefault();
			var gallery_id = $( this ).closest( '.justified-gallery-initialized' ).data( 'gallery-id' );
			if ( gallery_id && $( '.loftocean-popup-sliders .' + gallery_id ).length ) {
				var $body = $( 'body' ), index = $( this ).index(),
					$wrap = $( '.loftocean-popup-sliders .' + gallery_id ),
					$slick = $wrap.children( '.image-gallery' ).first();
				if ( ! $body.hasClass( 'gallery-zoom' ) ) {
					$body.addClass( 'gallery-zoom' );
					$wrap.addClass( 'fullscreen' ).removeClass( 'hide' );
					$slick.slick( 'slickGoTo', index ).slick( 'slickSetOption', 'speed', 500, true );
				}
			}
		} )
		.on( 'click', '.loftocean-popup-sliders .loftocean-popup-gallery-close', function( e ) {
			e.preventDefault();
			var $body = $( 'body' ), $wrap = $( this ).parent();
			if ( $body.hasClass( 'gallery-zoom' ) ) {
				$body.removeClass( 'gallery-zoom' );
				$wrap.removeClass( 'fullscreen' ).addClass( 'hide' );
			}
		} );

		var $carousels = $( '.posts.layout-carousel .posts-wrapper' );
		if ( $carousels.length ) {
			var responsiveSettings = [
				{
					'breakpoint': 1200,
					'settings': {
						'slidesToShow': 3
					}
				},
				{
					'breakpoint': 800,
					'settings': {
						'slidesToShow': 2
					}
				},
				{
					'breakpoint': 480,
					'settings': {
						'slidesToShow': 1
					}
				}
			];
			$carousels.each( function() {
				var $wrap = $( this ).parent(), cols = $wrap.find( '.post' ).length;
				cols = Math.min( Math.max( parseInt( cols, 10 ), 1 ), 4 ); 
				$( this ).on( 'init', function( e ) {
					$.fn.loftoceanImageLoading ? $( this ).loftoceanImageLoading() : '';
				} ).slick( {
					'dots': false,
					'arrows': true,
					'infinite': true,
					'fade': false,
					'speed': 700,
					'autoplay': true,
					'autoplaySpeed': 5000,
					'pauseOnHover': true,
					'rtl': isRTL,
					'slidesToShow': cols,
					'slidesToScroll': 1,
					'swipeToSlide': true,
					'responsive': responsiveSettings.slice( -cols )
				} );
			} );
		}
	} );
} ) ( jQuery );
