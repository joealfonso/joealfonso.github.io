// File#: _1_video-autoplay
// Usage: codyhouse.co/license
(function() {
  var VideoAutoplay = function(element) {
    this.element = element;
    this.intersectionObserverSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);
    initVideoAutoplay(this);
  };

  function initVideoAutoplay(video) {
    video.element.autoplay = video.intersectionObserverSupported ? false : true;
    if(!video.intersectionObserverSupported) return;
    var observer = new IntersectionObserver(videoAutoplayCallback.bind(video));
		observer.observe(video.element);
  };

  function videoAutoplayCallback(entries, observer) {
    entries[0].isIntersecting ? this.element.play() : this.element.pause();
  };

  window.VideoAutoplay = VideoAutoplay;

  // init VideoAutoplay object
  var videoAutoplay = document.getElementsByClassName('js-video-autoplay');
  if( videoAutoplay.length > 0) {
		for(var i = 0; i < videoAutoplay.length; i++) {
      new VideoAutoplay(videoAutoplay[i]);
		}
	}
}());