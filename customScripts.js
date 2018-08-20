$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip(); 
     $('[data-toggle="tooltip"]').hover(function (){
     	$(this).next().addClass("animated jello");               
    });
});

/*This is for that full screen navigation screen*/
		/* Open when someone clicks on the span element */
		function openNav() { 
		    document.getElementById("myNav").style.width = "100%";
		    $(".overlay-content a").css("color","white");
		}

		/* Close when someone clicks on the "x" symbol inside the overlay */
		function closeNav() {
			$(".overlay-content a").css("color","rgba(0,0,0,0)");
		    document.getElementById("myNav").style.width = "0%";
		    var $root = $('html, body');
		    /* //it is buggy
			$('a').click(function() {
			    var href = $.attr(this, 'href');
			    $root.animate({
			        scrollTop: $(href).offset().top
			    }, 1500, function () {
			        window.location.hash = href;
			    });
			    return false;
			});*/
		}