$(document).ready(function() {
$('.scroll_to').click(function(e){
    var jump = $(this).attr('href');
    console.log("hello");
	var new_position = $(jump).offset();
	$('html, body').stop().animate({ scrollTop: new_position.top }, 1000);
	e.preventDefault();
});

});