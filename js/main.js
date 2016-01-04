---
---

"use strict";


(function() {
	// Nav.
	var	$nav = document.querySelector('nav');
	var $navToggle = document.querySelector('a[href="#nav"]');

	$navToggle.addEventListener("click", function(event) {
		event.preventDefault();
		//event.stopPropagation();
		$nav.classList.toggle("visible");
	});

	window.addEventListener("keydown", function(event) {
		if(event.keyCode == 27)
			$nav.classList.remove("visible");
	});
})();
