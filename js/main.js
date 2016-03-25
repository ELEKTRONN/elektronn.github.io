---
---

"use strict";

(function() {
	var	$window = document.window,
	$body = document.getElementsByTagName("body")[0]

	$body.classList.toggle('is-loading');

	window.addEventListener("load", function() {
		$body.classList.toggle("is-loading");
	});

	window.addEventListener("unload", function() {});
})();

(function() {
	// Nav.
	var	$nav = document.querySelector('.nav');
	var $navToggle = document.querySelector('a[href="#nav"]');

	$navToggle.addEventListener("click", function(event) {
		event.preventDefault();
		//event.stopPropagation();
		$nav.classList.toggle("nav--visible");
	});

	window.addEventListener("keydown", function(event) {
		if(event.keyCode == 27)
			$nav.classList.remove("nav--visible");
	});
})();

