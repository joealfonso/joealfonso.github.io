  // File#: _1_animated-headline
// Usage: codyhouse.co/license
(function() {
	var TextAnim = function(element) {
	  this.element = element;
	  this.wordsWrapper = this.element.getElementsByClassName(' js-text-anim__wrapper');
	  this.words = this.element.getElementsByClassName('js-text-anim__word');
	  this.selectedWord = 0;
	  // interval between two animations
	  this.loopInterval = parseFloat(getComputedStyle(this.element).getPropertyValue('--text-anim-pause'))*1000 || 1000;
	  // duration of single animation (e.g., time for a single word to rotate)
	  this.transitionDuration = parseFloat(getComputedStyle(this.element).getPropertyValue('--text-anim-duration'))*1000 || 1000;
	  // keep animating after first loop was completed
	  this.loop = (this.element.getAttribute('data-loop') && this.element.getAttribute('data-loop') == 'off') ? false : true;
	  this.wordInClass = 'text-anim__word--in';
	  this.wordOutClass = 'text-anim__word--out';
	  // check for specific animations
	  this.isClipAnim = this.element.classList.contains('text-anim--clip');
	  if(this.isClipAnim) {
		this.animBorderWidth = parseInt(getComputedStyle(this.element).getPropertyValue('--text-anim-border-width')) || 2;
		this.animPulseClass = 'text-anim__wrapper--pulse';
	  }
	  initTextAnim(this);
	};
  
	function initTextAnim(element) {
	  // make sure there's a word with the wordInClass
	  setSelectedWord(element);
	  // if clip animation -> add pulse class
	  if(element.isClipAnim) {
		element.wordsWrapper[0].classList.add(element.animPulseClass);
	  }
	  // init loop
	  loopWords(element);
	};
  
	function setSelectedWord(element) {
	  var selectedWord = element.element.getElementsByClassName(element.wordInClass);
	  if(selectedWord.length == 0) {
		element.words[0].classList.add(element.wordInClass);
	  } else {
		element.selectedWord = Array.prototype.indexOf.call(element.words, selectedWord[0]);
	  }
	};
  
	function loopWords(element) {
	  // stop animation after first loop was completed
	  if(!element.loop && element.selectedWord == element.words.length - 1) {
		return;
	  }
	  var newWordIndex = getNewWordIndex(element);
	  setTimeout(function() {
		if(element.isClipAnim) { // clip animation only
		  switchClipWords(element, newWordIndex);
		} else {
		  switchWords(element, newWordIndex);
		}
	  }, element.loopInterval);
	};
  
	function switchWords(element, newWordIndex) {
	  // switch words
	  element.words[element.selectedWord].classList.remove(element.wordInClass);
	  element.words[element.selectedWord].classList.add(element.wordOutClass);
	  element.words[newWordIndex].classList.add(element.wordInClass);
	  // reset loop
	  resetLoop(element, newWordIndex);
	};
  
	function resetLoop(element, newIndex) {
	  setTimeout(function() { 
		// set new selected word
		element.words[element.selectedWord].classList.remove(element.wordOutClass);
		element.selectedWord = newIndex;
		loopWords(element); // restart loop
	  }, element.transitionDuration);
	};
  
	function switchClipWords(element, newWordIndex) {
	  // clip animation only
	  var startWidth =  element.words[element.selectedWord].offsetWidth,
		endWidth = element.words[newWordIndex].offsetWidth;
	  
	  // remove pulsing animation
	  element.wordsWrapper[0].classList.remove(element.animPulseClass);
	  // close word
	  animateWidth(startWidth, element.animBorderWidth, element.wordsWrapper[0], element.transitionDuration, function() {
		// switch words
		element.words[element.selectedWord].classList.remove(element.wordInClass);
		element.words[newWordIndex].classList.add(element.wordInClass);
		element.selectedWord = newWordIndex;
  
		// open word
		animateWidth(element.animBorderWidth, endWidth, element.wordsWrapper[0], element.transitionDuration, function() {
		  // add pulsing class
		  element.wordsWrapper[0].classList.add(element.animPulseClass);
		  loopWords(element);
		});
	  });
	};
  
	function getNewWordIndex(element) {
	  // get index of new word to be shown
	  var index = element.selectedWord + 1;
	  if(index >= element.words.length) index = 0;
	  return index;
	};
  
	function animateWidth(start, to, element, duration, cb) {
	  // animate width of a word for the clip animation
	  var currentTime = null;
  
	  var animateProperty = function(timestamp){  
		if (!currentTime) currentTime = timestamp;         
		var progress = timestamp - currentTime;
		
		var val = Math.easeInOutQuart(progress, start, to - start, duration);
		element.style.width = val+"px";
		if(progress < duration) {
			window.requestAnimationFrame(animateProperty);
		} else {
		  cb();
		}
	  };
	
	  //set the width of the element before starting animation -> fix bug on Safari
	  element.style.width = start+"px";
	  window.requestAnimationFrame(animateProperty);
	};
  
	window.TextAnim = TextAnim;
  
	// init TextAnim objects
	var textAnim = document.getElementsByClassName('js-text-anim'),
	  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if( textAnim ) {
	  if(reducedMotion) return;
	  for( var i = 0; i < textAnim.length; i++) {
		(function(i){ new TextAnim(textAnim[i]);})(i);
	  }
	}
  
	// Animation curve
	Math.easeInOutQuart = function (t, b, c, d) {
	  t /= d/2;
	  if (t < 1) return c/2*t*t*t*t + b;
	  t -= 2;
	  return -c/2 * (t*t*t*t - 2) + b;
	};
  }());