/*
 * jQuery Plugin Screend v. 0.0.1 alpha
 * 
 * @file				base.css
 * @author			Michael Schulze <info@michael66.de>
 * @version			0.0.1
 * @license			Creative Commons Attribution 3.0 <http://creativecommons.org/licenses/by/3.0/>
 * 
 * Copyright (c) 2010 Michael Schulze <http://www.elsigno.de>
 * 
 * https://github.com/michsch/Screend
 * 
 */
(function($){
	$.fn.screendesign = function(o){
		var defaults = {
			slide:							'article',
			slideId:						'A_',
			visibleClass:				'visible',
			cycling:						1,
			imageFolder:				'p',
			imageFile:					'screen_',
			fade:								'smooth',
			fadeTime:						500,
			helpFile:						'../help.html',
			fixedInfo:					'0',
			textScreen:					'Screendesign',
			textFrom:						'von',
			textNext:						'weiter >>',
			textPrev:						'<< zurück',
			textCopyright:			'Screend by Michael Schulze'
		};
		var o = $.extend(defaults, o || {});
		
		var screens = new Array();
		$(o.slide).each(function(index){
			var e = $(this);
			e.wrapInner('<div class="wrap" />').children('div').wrapInner('<div class="info" />').children();
			var screenImg = o.imageFolder+'/'+o.imageFile+((index-1)+1)+'.jpg';
			
			if (o.fixedInfo == 1 && (e.find('div.wrap').height()+30 < $(window).height())) {
				e.find('div.wrap').addClass('fixed')
			}
			e.find('div.info').hide();
			
			setTimeout(function(){
				var img = document.createElement('img');
				img.src = screenImg;
				$(e).prepend(img).children('img').addClass('bg');
			}, (index) * 300);
			e.attr({
				id: o.slideId + ((index-1)+1)
			}).css('background-image', 'url(' + screenImg + ')');
		});
		
		$(o.slide + ':not(:first)').hide();
		$(o.slide + ':first').addClass('visible');

		createOverlay();
		setLinks();
		help();
		showHash();
		
		$(document).keydown(function(event) {
			if (event.keyCode == '39') { //rechts = weiter
				nextScreen()
			}
			if (event.keyCode == '37') { //links = zurueck
				prevScreen();
			}
			/*
			if (event.keyCode == '32') { // Space
				$('div#inhaltsangabe').toggle('fast');
				hilfeVerbergen();
				return false;
			}*/
			
			if (event.keyCode == '48' && findActiveScreen() > 0 ) { // Null
				changeScreen('#'+o.slideId+findActiveScreen(), '#'+o.slideId+'0');
			}

			// Aufruf der Seite mit den Tastatur-Angaben
			// bei Safari = 189, bei Firefox 0
			if (event.keyCode == '189' || event.keyCode == '0') { // Fragezeichen
				help();
			}
			
		});

		/**
		 * Create the overlay on top
		 */
		function createOverlay(){
			var topOverlay = '<section id="screendesign-overlay">';
			topOverlay += '<span id="screendesign-overlay-number"></span>';
			topOverlay += '<div id="screendesign-overlay-center">';
			topOverlay += '<span id="screendesign-overlay-prev"><a class="screendesign-prev" href="#">'+o.textPrev+'</a></span>';
			topOverlay += '<h1 id="screendesign-overlay-title"><a href="#"></a></h1>';
			topOverlay += '<span id="screendesign-overlay-next"><a class="screendesign-next" href="#">'+o.textNext+'</a></span>';
			topOverlay += '</div>';
			topOverlay += '<span id="screendesign-overlay-copyright">'+o.textCopyright+'</span>';
			topOverlay += '</section>';
			
			$('body').prepend(topOverlay);

			fillOverlay();
		}
		
		function fillOverlay(){	
			$('#screendesign-overlay').children('#screendesign-overlay-number').html(o.textScreen+' '+(findActiveScreen()+1)+' '+o.textFrom+' '+$('body > '+o.slide).length)
				.siblings('#screendesign-overlay-center')
				.find('#screendesign-overlay-title a').html($('#'+o.slideId+findActiveScreen()+' h1').html())
		}
		
		function setLinks(){
			$('a.screendesign-next').click(function(){
				nextScreen();
				return false;
			});
			$('a.screendesign-prev').click(function(){
				prevScreen();
				return false;
			});

			$('#screendesign-overlay-number, #screendesign-overlay-copyright').click(function(){
				help();
				return false;
			});

			$('#screendesign-overlay-title a').click(function(){
				var activeScreenNum = findActiveScreen();
				$('#'+o.slideId+activeScreenNum+' div.info').slideToggle('fast');
				$('#help').fadeOut('fast');
				return false;
			});
		}

		/**
		 * Find the active screen
		 * 
		 * @return {Int} slide number
		 */
		function findActiveScreen(){
			var activeScreen = $(o.slide+'.visible').attr('id');
		 	// gibt eine echte Zahl zurueck!
		 	return parseInt(activeScreen.slice(2));
		}
		
		/**
		 * Change the screen
		 * 
		 * @param {Int} activeScreen
		 * @param {Int} nextScreen
		 */
		function changeScreen(activeScreen, nextScreen){
			if (o.fade == 'hard') {
				$(activeScreen).hide().removeClass('visible');
			} else if (o.fade == 'soft') {
				$(activeScreen).fadeOut(o.fadeTime).removeClass('visible');
			} else if (o.fade == 'smooth') {
				$(activeScreen).css('z-index',5).removeClass('visible');
				$(nextScreen).css('z-index',10);
			}
			
			$(nextScreen).fadeIn(o.fadeTime, function(){
				$(activeScreen).hide();
				$(this).css('z-index','auto');
			}).addClass('visible');
			fillOverlay();
			$('#help').fadeOut('fast');
			$('div.info').fadeOut('fast');
		}
		
		function nextScreen(){
			var activeScreenNum = findActiveScreen();
			var screenCount = $('body > '+o.slide).length;
			var activeScreen = o.slide + '#' + o.slideId + activeScreenNum;

			if (activeScreenNum < (screenCount - 1)){
				var nextScreen = o.slide + '#' + o.slideId + (activeScreenNum +1);
				changeScreen(activeScreen, nextScreen)
			} else if (o.cycling == 1) {
				changeScreen(activeScreen, o.slide + '#' + o.slideId + '0');
			}
		}
		
		function prevScreen(){
			var activeScreenNum = findActiveScreen();
			var screenCount = $('body > '+o.slide).length;
			var activeScreen = o.slide + '#' + o.slideId + activeScreenNum;

			if (activeScreenNum > 0){
				var prevScreen = o.slide + '#' + o.slideId + (activeScreenNum -1);
				changeScreen(activeScreen, prevScreen)
			} else if (o.cycling == 1) {
				var lastScreen = o.slide + '#' + o.slideId + (screenCount - 1);
				changeScreen(activeScreen, lastScreen);
			}
		}
		
		function showHash(){
			// z.b #A_0
			var ha = window.location.hash;
			// nur falls hash vorhanden ist
			if (ha.length > 0) {
				// dieser soll dann unsichtbar geschaltet werden
				var activeScreen = $(o.slide + ':first');
				// der zu zeigende artikel
				var hashScreen = o.slide + ha;
				
				// nur wenn hashnummer innerhalb der anzahl der artikel ist
				// springt die pres dort sind, sonst auf artikel 0
				var shortHash = ha.slice(3);
				var hashNumber = parseInt(shortHash);
				var screenCount = $(o.slide).length;
				
				if (hashNumber < screenCount){
					changeScreen(activeScreen, hashScreen);
					help();
				}
			}
		}

		function help(){
			if ($('div#help').length == 0) { // existiert also noch nicht
				$('body').append('<div id="help"></div>');
				$('div#help').hide().load(o.helpFile + '?' + 1 * new Date() + ' article.help', function(){
					if (($('div#help').height() + 60) < $(window).height()) {
						$('div#help').addClass('fixed');
					}
				}).click(function(){
					help()
				}).show();
			}
			else {
				// hilfe sichtbar/unsichtbar
				$('div#help').toggle('fast');
			}
		}
	}
})(jQuery);