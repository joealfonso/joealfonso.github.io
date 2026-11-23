(function() {
  var wSchedule = document.getElementsByClassName('js-w-schedule');
  if(wSchedule.length < 1) return;

  // init schedule
  new WSchedule({
    element: wSchedule[0],
    searchData: function(target, cb) {
      // custom function used to retrieve the additional info about the selected event
      // target: this is the selected [aria-controls] element
      var eventInfoPath = target.getAttribute('data-w-schedule-url');
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          // the ajax call was succesfull -> call the callback function (cb) passing the response text as argument
          var data = this.responseText;
          loadImage(data, function(){
            setTimeout(function(){
              cb(data);
            }, 1000);
          });
        }
      };
      xhttp.open("GET", eventInfoPath, true);
      xhttp.send();
    }
  });

  function loadImage(data, cb) {
    var element = document.createElement('div'); 
    element.innerHTML = data; 
    var img = element.querySelector('img');
    if(!img) return cb();

    var src = img.getAttribute('src');
    var image = new Image();
    var loaded = false;
    image.onload = function () {
      if(loaded) return;
      cb();
    }
    image.src = src;
    if(image.complete) {
      loaded = true;
      cb();
    }
  };
}());