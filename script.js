'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const section1 = document.querySelector('#section--1');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => {
  btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// -------------------------------------------------------------------------------------------- //

// Button Scrolling
btnScrollTo.addEventListener('click', function () {
  section1.scrollIntoView({
    behavior: 'smooth',
  });
});

// -------------------------------------------------------------------------------------------- //

// Event Delegation on Nav
// Steps of using Event Delegation Properly:
// (i) Adding eventListener to common parent Element
document.querySelector('.nav__links').addEventListener('click', function (e) {
  // (ii) Determine which element of the parent's child elements originated the event (e.target)
  e.preventDefault();
  //(iii) Matching strategy to get the child Element
  if (e.target.classList.contains('nav__link')) {
    // This is a child
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// -------------------------------------------------------------------------------------------- //

// Building the Tabbed Component for the Operations Section
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  // const clickedBtn = e.target; // you SHOULD NOT use this to get the button because the button has a span tag and if you clicked on it, it will break the logic of not retrieving the button element.
  const clickedBtn = e.target.closest('.operations__tab');

  if (!clickedBtn) return; // To avoid any clicks outside of the buttons, like in the container itself. Called Guard Clause

  // Setting only the clicked button to raise up and lower the rest
  tabs.forEach((tab, i) => {
    tab.classList.remove('operations__tab--active');
  });
  clickedBtn.classList.add('operations__tab--active');

  // Activate the Content Area
  tabsContent.forEach(tc => {
    tc.classList.remove('operations__content--active');
  });
  document
    .querySelector(`.operations__content--${clickedBtn.dataset.tab}`)
    .classList.add('operations__content--active');
});

// -------------------------------------------------------------------------------------------- //

// Passing Agruments to Event Handlers (Menu fade animation), we will use the parent of the menu (nav) to apply some animations to its childs
const nav = document.querySelector('.nav');
// NOTE: mouseenter is pretty similar to mouseover, but mouseenter doesn't BUBBLE Events while mouseover do.

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    console.log('e.target = ', e.target);
    console.log('e.current = ', e.currentTarget);
    const clickedLink = e.target;
    // Selecting the sibling elements/Logo
    const siblings = clickedLink.closest('.nav').querySelectorAll('.nav__link');
    const logo = clickedLink.closest('.nav').querySelector('img');

    // Changing the opacity of the selected siblings/logo
    siblings.forEach(el => {
      if (el !== clickedLink) {
        el.style.opacity = this;
      }
      logo.style.opacity = this;
    });
  }
};

// How to pass arguments to the callback function of the Event handler ???, call the function inside the callback function, OR, we can use fn.bind(this), because the this keyword can be anything and we always have the access to the 'e' variable inside our function

// So here we are going to set the 'this' keyword to a value to be set in the callback function as a parameter
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

// -------------------------------------------------------------------------------------------- //

// Implementing a Sticky Nav bar (Once achieving a certain top --> the nav bar becomes sticky)
// (i) NOTE: This is a bad approach, because this will be super bad on mobiles and on performance in general
// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);
// window.addEventListener('scroll', function (e) {
//   console.log(window.scrollY);
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// (ii) We can use the "Intersection Observer API" for the sticky nav functionality. This helps our code to observe changes to a target element intersecting the viewport/another element
// const obsCallback = function (entries, observer) {
//   // This callback function will be called each time our target element (section1) is intersecting the root element (nav) at a certain threshold. The root property in the obsOptions is the intersecting element
//   // In the IntersectionObserver API, the entries argument in the callback is an array of IntersectionObserverEntry objects representing observed elements intersecting the viewport or root. Each entry provides properties like target (the observed element), isIntersecting (whether it’s in view), and intersectionRatio (percentage visible) (threshold). This helps in detecting visibility changes of multiple elements simultaneously, allowing efficient viewport-based triggers.
//   entries.forEach(entry => console.log(entry));
// };
// const obsOptions = {
//   root: null, // If set to null it will intersect the viewport
//   threshold: [0, 0.2], // This is also the intersectionRatio found in the entries, 0 --> Triggers each time we are completely out of the target view/ and as soon as it enters the view,
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height; // Used to calculate the rootMargin dynamically
const stickyNav = function (entries) {
  const [entry] = entries; // entries[0] is the header section, so we want when the header part is totally out of view --> makes the nav bar sticky
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null, // because we are interested in the viewport
  threshold: 0, // Means the whole observed is off the viewport
  rootMargin: `-${navHeight}px`, // A box of specified number of pixels that will be applied outside of our target element before reaching the threshold.
});
headerObserver.observe(header);

// -------------------------------------------------------------------------------------------- //

// Revealing Elements as we get close to scrolling to them (Revealing them on scroll) by isng the IntersectionObserver()
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  console.log(entries);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target); // To toggle off the observer for better performance
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// -------------------------------------------------------------------------------------------- //

// Images have by far the most impact on any webPage performance, that's why Lazy Loading Images is super important, we can do this by first setting the paht src of the image in the HTML by a low resolution image (200x120px), and setting its data-src path to the real High resoltution image path and Applying one more time IntesrectionObserver(). At reaching the low-pixelated image, we will change it to the High-resolution image. We should also add --> filter: blur(20px); to the low resolution image in CSS

const imgTargets = document.querySelectorAll('img[data-src]');
// console.log(imgTargets); // NodeList(3)

const loadImg = function (entries, observer) {
  console.log('entries length: ', entries.length); // entries length:  1
  const [entry] = entries; // NOTE!!!!!: Since we have only one threshold, so we have only one entry
  // console.log(entry);
  if (!entry.isIntersecting) return; //Guard callback

  // Now we want to replace src with data-src
  entry.target.setAttribute('src', `./${entry.target.dataset.src}`);
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  }); // EventHandler that do something once the image loads
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px', // The Observer will observe 200px before reaching the target, if -200px, it will observe after reaching the target by 200px
});

imgTargets.forEach(img => imgObserver.observe(img));

// -------------------------------------------------------------------------------------------- //

// Building the Slider Component, The main thing to do in this part is using the transform: translateX(%), where our clicked image is translateX(0%) and the rest are translateX(100%) and translateX(200%). Also the parent element has overflow: hidden, to hide any out translated elements
const slider = function () {
  // 1. Setting the transform: translateX() property for all of the slides (slide slide--n)
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${(i - slide) * 100}%)`)
    );
  };

  // 2. Use a counter variable to keep track of the current slide
  let currentSlide = 0;
  const maxSlide = slides.length;

  // 3. Increment or decrement the currentSlide variable based on the click action. btnRight -> increment, btnLeft -> decrement
  // Next Slide
  const nextSlide = function () {
    currentSlide === slides.length - 1 ? (currentSlide = 0) : currentSlide++;
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };
  btnRight.addEventListener('click', nextSlide);

  // Previous Slide
  const prevSlide = function () {
    currentSlide === 0 ? (currentSlide = maxSlide - 1) : currentSlide--;
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };
  btnLeft.addEventListener('click', prevSlide);

  // 4. Adding Keyboard support to the left and right arrows of the keyboard
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    else if (e.key === 'ArrowRight') nextSlide();
  });

  // 5. Adding the dots feature under the slider
  const dotContainer = document.querySelector('.dots');
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };
  const activateDot = function (slide) {
    // First deactivate the background color
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    // Next add the active Class to the current slide
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });

  // 6. Init function to take all of the inital function calls into a single function
  const init = () => {
    goToSlide(0); // Sets the default translateX() of the slieds
    createDots();
    activateDot(0);
  };
  init();
};

slider(); // We have grouped all of the functions and variables related to the slider functionality in a single function called slider(), this is to avoid poluting the global namespace

// -------------------------------------------------------------------------------------------- //

// Lifecycle DOM Events
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML Parsed and DOM tree built!', e);
}); // An event that gets triggered when Both HTML and JS is being loaded to the DOM, so the code inside the callback fn will be exectuted after the DOM is available. This event is not needed if you put the script tag at the end of the body tag in the HTML.
// Network --> DOMContentLoaded: 119 ms

window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
}); // An event that gets triggered when all of the page resources(images, text, etc) are fully loaded.
// Network --> Load: 304 ms

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// }); // This event will be triggered immediately before the user is about to leave the page, Like after clicking the close button in the browser tab. This is not a great listener to use because it's frustrating to the users.

// -------------------------------------------------------------------------------------------- //

// Efficient Script Loading (defer and async) for you JS file

// 1. <script src="script.js">
// (i) At the HTML head tag
// The browser loads and executes the script as soon as it encounters the <script> tag in the <head>.
// This can block the rest of the HTML from rendering until the script is fully loaded and executed.
// Consequence: Slower perceived load times for the page since content rendering is delayed until the script finishes. This is ideal if the script needs to run immediately before any elements is loaded.

// (ii) At the end of the HTML body tag
// The browser loads the HTML content first, then loads and executes the script at the end.
// By placing the <script> tag just before the closing </body> tag, the page content can render before the JavaScript is loaded.
// Consequence: Faster initial page load and improved perceived performance, as the script does not block HTML rendering. This is a common approach when the script does not need to be executed until the page content is fully loaded.

// +++++++++++++++++++++++++++++++++++++++++++++++++++++ //

// 2. <script async src="script.js">
// (i) At the HTML head tag
// The script loads asynchronously while the browser continues parsing the HTML.
// As soon as the script is downloaded, it executes immediately, potentially before HTML parsing completes.
// Consequence: Fast script loading and execution, but it may not be in sync with the HTML content, which can lead to timing issues. Best for scripts that don’t depend on the HTML structure or other scripts.

// (ii) async and defer doesn't make any sense to be used in the body

// +++++++++++++++++++++++++++++++++++++++++++++++++++++ //

// 3. <script defer src="script.js">
// (i) At the HTML head tag
// The script loads in the background while the browser parses the HTML.
// It defers execution until the HTML is fully parsed.
// Consequence: Ensures the script runs only after the HTML content is loaded, without blocking the rendering process. Ideal for scripts that require access to the fully loaded DOM, as it ensures execution after the HTML is parsed but before the DOMContentLoaded event.

// +++++++++++++++++++++++++++++++++++++++++++++++++++++ //

// 4. End of body (script) VS Async in Head VS Defer in Head

// (i) For End of body --> scripts are fetched and executed after the HTML is completely parse

// (ii) Async in Head --> Scripts are fetched asynchronously and executed immediately. Usually the DOMContentLoaded event waits for all scripts to execute, excpet for async scripts. So, DOMContentLoaded does not wait for an async script. And Scripts are not guaranteed to execute in order, Use for 3rd-party scripts when order doesn't matter (like Google analytics)

// (iii) Defer in Head --> Scripts are fetched asynchronously and executed after the HTML is completely parsed. Important thing that Scripts are executed in order. This is overall the best solution!!! Use for your own scripts and when order matters (like using third-parties libraries/scripts)
// NOTE: only modern browsers are the ones that supports async/defer, so if you are using an old browser, you must put the script tag at the end of the body tag

// -------------------------------------------------------------------------------------------- //
// -------------------------------------------------------------------------------------------- //
// -------------------------------------------------------------------------------------------- //

// Summarizing this Project

// 1. Button Scrolling
// Smooth scrolling with scrollIntoView() to navigate smoothly to a section on the page.

// +++++++++++++++++++++++++++++++++++++++++++++++++++++ //

// 2. Event Delegation on Navigation
// Event Delegation: Attaching an event listener to a common parent element and detecting which child element triggered the event.
// Use e.target to identify the event source and e.preventDefault() to prevent default link behavior.
// Matching strategy: Target children with specific classes (e.g., .nav__link).

// +++++++++++++++++++++++++++++++++++++++++++++++++++++ //

// 3. Tabbed Component
// Guard Clause: Prevents code from running on clicks outside the target (like container).
// Managing Active State: Use classes like .operations__tab--active to highlight active tabs.
// Activate content area based on button selection by toggling classes.

// 4. Passing Arguments to Event Handlers
// Using .bind() to pass parameters to event handlers, allowing manipulation of this in the event handler function.

// +++++++++++++++++++++++++++++++++++++++++++++++++++++ //

// 5. Sticky Navbar
// Intersection Observer API: Used for efficient sticky navbar creation without scroll events.
// Observer callback function is triggered when the target (e.g., header) intersects the viewport based on a set threshold.
// rootMargin offsets the trigger area by pixels, making the navbar sticky right as the header goes out of view.

// +++++++++++++++++++++++++++++++++++++++++++++++++++++ //

// 6. Revealing Elements on Scroll
// Use IntersectionObserver to reveal elements as they come into view.
// Observer’s callback function removes a hidden class to show elements on scroll.
// Disable observation after the element has been revealed for better performance.

// +++++++++++++++++++++++++++++++++++++++++++++++++++++ //

// 7. Lazy Loading Images
// Load high-resolution images only when they come into view by using IntersectionObserver.
// Initially, low-resolution images are loaded, and the data-src attribute is set to the high-resolution source.
// Replace src with data-src upon intersection, then remove the lazy-img class for clear resolution.

// +++++++++++++++++++++++++++++++++++++++++++++++++++++ //

// 8. Image Slider Component
// Transform Property: Use translateX() to move slides horizontally.
// Use a currentSlide counter to track slides and increment/decrement it to navigate through the slides.
// Implement keyboard navigation and add clickable dots to indicate actiEmphasizeve slides.
// Modularize all slider functionality within a single function for better namespace management.

// +++++++++++++++++++++++++++++++++++++++++++++++++++++ //

// 9. Lifecycle DOM Events
// DOMContentLoaded: Triggered when HTML and JS are fully loaded but before images and styles.
// load: Fires after all resources, including images, are fully loaded.
// beforeunload: Executes when the user is about to leave the page; often used to prompt the user before closing.

// +++++++++++++++++++++++++++++++++++++++++++++++++++++ //

// 10. Efficient Script Loading (defer and async)
// <script src="script.js"> at the end of the body: Ensures all HTML is parsed before JS is loaded, ideal for scripts that don’t need immediate execution.

// async attribute: Downloads the script asynchronously and executes it immediately after download. Best for third-party scripts that don’t rely on the HTML structure.

// defer attribute: Loads script asynchronously and defers execution until the HTML is fully parsed, ensuring it runs after the content loads. Preferred for own scripts, especially when order matters.
