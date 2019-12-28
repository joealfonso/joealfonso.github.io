var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var acceptedWords = [ 'violet', 'white', 'yellow','back','forward','navigate to project Studio','navigate to project player','navigate to project home','navigate to older work','navigate to home','navigate to writing','navigate to about','navigate to Ed Tech challenges'];
var grammar = '#JSGF V1.0; grammar acceptedWords; public <words> = ' + acceptedWords.join(' | ') + ' ;'

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
//recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var diagnostic = document.querySelector('.output');
var bg = document.querySelector('html');


document.querySelector('.output').onclick = function() {
  recognition.start();
}

recognition.onresult = function(event) {
  // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
  // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
  // It has a getter so it can be accessed like an array
  // The [last] returns the SpeechRecognitionResult at the last position.
  // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
  // These also have getters so they can be accessed like arrays.
  // The [0] returns the SpeechRecognitionAlternative at position 0.
  // We then return the transcript property of the SpeechRecognitionAlternative object

  var last = event.results.length - 1;
  var command = event.results[last][0].transcript;

  diagnostic.textContent = 'Result received: "' + command + '".';
  bg.style.backgroundColor = color;
  if (color == 'back') {
    window.history.back();
  } else if (color == 'forward') {
    window.history.forward();
  } else if (color == 'navigate to home') {
    window.location.href = "https://josephalfonso.com/index.html";
  }else if (color == 'navigate to writing') {
    window.location.href = "https://josephalfonso.com/pages/writing/EdTechResearchChallenges.html";
  }else if (color == 'navigate to about') {
    window.location.href = "https://josephalfonso.com/about.html";
  }else if (color == 'navigate to project Studio') {
    window.location.href = "https://josephalfonso.com/pages/studio.html";
  }else if (color == 'navigate to project player') {
    window.location.href = "https://josephalfonso.com/pages/player.html";
  }else if (color == 'navigate to project home') {
    window.location.href = "https://josephalfonso.com/pages/home.html";
  }else if (color == 'navigate to project Studio') {
    window.location.href = "https://josephalfonso.com/OldSite/index-OldSite.html";
  }else if (color == 'navigate to Ed Tech challenges') {
    window.location.href = "https://josephalfonso.com/pages/writing/EdTechResearchChallenges.html";
  }
  console.log('Confidence: ' + event.results[0][0].confidence);
}

recognition.onspeechend = function() {
  recognition.stop();
}

recognition.onnomatch = function(event) {
  diagnostic.textContent = "I didn't recognise that color.";
}

recognition.onerror = function(event) {
  diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
}
