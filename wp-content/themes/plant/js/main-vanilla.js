// Using event delegation https://gomakethings.com/why-event-delegation-is-a-better-way-to-listen-for-events-in-vanilla-js/#web-performance
document.addEventListener(
  "click",
  function (event) {
    // Mobile Menu Toggle
    if (event.target.closest(".site-toggle")) {
      if (event.target.classList.contains("active")) {
        removeClass(".site-toggle, .site-nav-m", "active");
        removeClass("#page", "show-nav");
      } else {
        addClass(".site-toggle, .site-nav-m", "active");
        addClass("#page", "show-nav");
      }
    }
    if (
      event.target.matches("#site-nav-m .menu-item-has-children > .si-down")
    ) {
      if (event.target.parentNode.classList.contains("active")) {
        event.target.parentNode.classList.remove("active");
      } else {
        event.target.parentNode.classList.add("active");
      }
    }
    // Close menu on click (useful for One Page Website)
    if (event.target.matches("#site-nav-m a")) {
      if (event.target.getAttribute("href") == "#") {
        if (event.target.parentNode.classList.contains("active")) {
          event.target.parentNode.classList.remove("active");
        } else {
          event.target.parentNode.classList.add("active");
        }
      } else {
        removeClass(".site-toggle, .site-nav-m", "active");
      }
    }
    // Search
    if (event.target.closest(".site-search")) {
      document.getElementById("s").focus();
    }
    // Close Search Modal
    if (event.target.closest(".s-modal-close")) {
      document.getElementById("s").blur();
    }
    // Footer Widget
    if (event.target.closest(".widget-title")) {
      if (event.target.parentNode.classList.contains("active")) {
        event.target.parentNode.classList.remove("active");
      } else {
        event.target.parentNode.classList.add("active");
      }
    }
    // Chat Button
    if (event.target.matches("#s-chat")) {
      event.target.classList.remove("-desc");
      event.target.classList.add("closed");
      var s_chat_panel = document.getElementById("s-chat-panel");
      if (s_chat_panel.classList.contains("active")) {
        s_chat_panel.classList.remove("active");
        event.target.classList.remove("active");
      } else {
        s_chat_panel.classList.add("active");
        event.target.classList.add("active");
      }
    }
  },
  false
);

// Add Dropdown Toggle
document.querySelectorAll(".menu-item-has-children").forEach((e) => {
  e.insertAdjacentHTML(
    "beforeend",
    '<svg xmlns="http://www.w3.org/2000/svg" class="si-down" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>'
  );
});

// Slider
function createSlider(slider_id, view_m, view_d, center_m, center_d) {
  var slider_wrapper = document.getElementById(slider_id);
  var content = slider_wrapper.innerHTML;
  new_content = "<div class='slider-area'>" + content + "</div>";
  slider_wrapper.innerHTML = new_content;
  var slider = slider_wrapper.getElementsByClassName("slider-area")[0];
  var show = new KeenSlider(slider, {
    loop: true,
    slides: ".slider",
    slidesPerView: view_m,
    centered: center_m,
    breakpoints: {
      "(min-width: 992px)": {
        slidesPerView: view_d,
        centered: center_d,
      },
    },
    created: function (instance) {
      var nav_wrapper = document.createElement("div");
      var nav_prev = document.createElement("a");
      var nav_next = document.createElement("a");
      nav_wrapper.classList.add("nav");
      nav_prev.classList.add("prev");
      nav_next.classList.add("next");
      slider_wrapper.appendChild(nav_wrapper);
      nav_wrapper.appendChild(nav_prev);
      nav_wrapper.appendChild(nav_next);
      slider_wrapper
        .getElementsByClassName("prev")[0]
        .addEventListener("click", function () {
          instance.prev();
        });
      slider_wrapper
        .getElementsByClassName("next")[0]
        .addEventListener("click", function () {
          instance.next();
        });
      var dots_wrapper = document.createElement("div");
      dots_wrapper.classList.add("dots");
      slider_wrapper.appendChild(dots_wrapper);
      var slides = slider.querySelectorAll(".slider");
      slides.forEach(function (t, idx) {
        var dot = document.createElement("a");
        dot.classList.add("dot");
        dots_wrapper.appendChild(dot);
        dot.addEventListener("click", function (event) {
          instance.moveToSlide(idx);
        });
      });
      updateClasses(instance);
    },
    slideChanged(instance) {
      updateClasses(instance);
    },
  });
  function updateClasses(instance) {
    var slide = instance.details().relativeSlide;
    var dots = slider_wrapper.querySelectorAll(".dot");
    dots.forEach(function (dot, idx) {
      idx === slide
        ? dot.classList.add("active")
        : dot.classList.remove("active");
    });
  }
}

var sliders = document.querySelectorAll(".s-slider");
if (sliders) {
  for (var i = 0, len = sliders.length; i < len; i++) {
    var slider = sliders[i];
    var slider_id = "s-slider-" + i;
    slider.setAttribute("id", slider_id);
    var view_m = 1;
    var view_d = 0;
    var center_m = false;
    var center_d = false;
    for (var j = 0; j < slider.classList.length; j++) {
      slider_class = slider.classList.item(j);
      if (
        slider_class.substring(0, 2) === "-d" &&
        slider_class.substring(0, 4) != "-dot"
      ) {
        view_d = slider_class.substring(2);
      } else {
        if (slider_class.substring(0, 2) === "-m") {
          view_m = slider_class.substring(2);
        }
      }
      if (slider_class.substring(0, 9) === "-center-m") {
        center_m = true;
      }
      if (slider_class.substring(0, 9) === "-center-d") {
        center_d = true;
      }
    }
    if (view_d == 0) {
      view_d = view_m;
    }
    createSlider(slider_id, view_m, view_d, center_m, center_d);
  }
}

// Scroll
window.onscroll = () => {
  // Show Site Header on Home Page
  var scroll = window.pageYOffset | document.body.scrollTop;
  if (document.body.classList.contains("home")) {
    var header = document.querySelector("#masthead");
    var header_scroll = header.getAttribute("data-scroll");
    if (!header_scroll) {
      header_scroll = 300;
    }
    if (scroll > header_scroll) {
      addClass(".site-header", "-active");
      removeClass(".site-header", "-not-active");
    } else if (scroll <= 300) {
      addClass(".site-header", "-not-active");
      removeClass(".site-header", "-active");
    }
  }
  // Chat
  var s_chat = document.getElementById("s-chat");
  if (s_chat) {
    if (!s_chat.classList.contains("closed")) {
      if (scroll > 20) {
        s_chat.classList.add("-desc");
      }
    }
  }
};

// Auto Show Header on scroll - https://www.sysleaf.com/js-toggle-header-on-scroll/
var lastKnownScrollY = 0;
var currentScrollY = 0;
var ticking = false;
var idOfHeader = "masthead";
var eleHeader = null;
var height = 50;
const classes = {
  pinned: "-show",
  unpinned: "-hide",
};
function onScroll() {
  currentScrollY = window.pageYOffset;
  if (currentScrollY > height) {
    requestTick();
  }
}
function requestTick() {
  if (!ticking) {
    requestAnimationFrame(update);
  }
  ticking = true;
}
function update() {
  if (currentScrollY < lastKnownScrollY) {
    pin();
  } else if (currentScrollY > lastKnownScrollY) {
    unpin();
  }
  lastKnownScrollY = currentScrollY;
  ticking = false;
}
function pin() {
  if (eleHeader.classList.contains(classes.unpinned)) {
    eleHeader.classList.remove(classes.unpinned);
    eleHeader.classList.add(classes.pinned);
  }
}
function unpin() {
  if (
    eleHeader.classList.contains(classes.pinned) ||
    !eleHeader.classList.contains(classes.unpinned)
  ) {
    eleHeader.classList.remove(classes.pinned);
    eleHeader.classList.add(classes.unpinned);
  }
}
window.onload = function () {
  eleHeader = document.getElementById(idOfHeader);
  if (eleHeader) {
    if (eleHeader.classList.contains("-overlay")) {
      height = 0;
    } else {
      height = eleHeader.offsetHeight;
    }
    document.addEventListener("scroll", onScroll, false);
  }
};

// Auto height Footer
function footer_height() {
  var f_height = document.getElementById("colophon").offsetHeight;
  var root = document.documentElement;
  root.style.setProperty("--s-footer-height", f_height + "px");
}
domReady(function () {
  if (document.getElementById("colophon")) {
    new ResizeObserver(footer_height).observe(
      document.getElementById("colophon")
    );
  }
});
// Add has-title class to footer widget
document.querySelectorAll("#colophon .widget-title").forEach((e) => {
  e.parentNode.classList.add("has-title");
});
