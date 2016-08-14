// define the position global value
var Yposition = 0;

var toggleB = false;


// pageSrollToTop
function pageSroll() {
	var t;
	window.scrollBy(0,-50);
	t = setTimeout("pageSroll()", 10);
	if (window.pageYOffset <= 0) {
		clearTimeout(t);
	}
}


// define the button display function
function TopBShow() {
	var img = document.getElementById("scroll-to-top-img");
	var TopB = document.getElementById("scroll-to-top");
	TopB.className = "";
	img.className = "scroll-img-gradual-come";
}

// define the button hide function
function TopBHide() {
	var img = document.getElementById("scroll-to-top-img");
	var TopB = document.getElementById("scroll-to-top");
	TopB.className = "hide-scroll-button";
	img.className = "scroll-img-gradual-go";
}


// nav toggle for small size screen
function adjust() {
	var button = document.getElementById("toggle-button");
	var h = document.getElementById("header-nav");
	if (window.innerWidth < 800) {
		button.className = "toggle-button-container-little";
		h.className = "header-nav-container-little";
		h.style.display = "none";
		toggleB = false;
	} else {
		button.className = "toggle-button-container";
		h.className = "header-nav-container";
		h.style.display = "block";
		toggleB = true;
	}
}


function toggle() {
	var h = document.getElementById("header-nav");
	if (!toggleB) {
		h.style.display = "block";
		toggleB = true;
	} else {
		h.style.display = "none";
		toggleB = false;
	}
}


window.onload = function() {
	adjust();
	// add window scroll listener
	window.onscroll = function() {
		var now = window.pageYOffset;
		if (now < Yposition && now > 10) {
			TopBShow();
		} else {
			TopBHide();
		}
		Yposition = now;
	}
	window.onresize = adjust;

	document.getElementById("toggle-button").addEventListener("click", toggle, false);
}








