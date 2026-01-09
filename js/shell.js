//FORMING THE NAVIGATION AND HERO SHELL
let data = JSON.parse(document.getElementById("data").innerText)
let content = document.getElementById("content").cloneNode(true);

document.head.innerHTML = `<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1">
<title>${data.title}</title>
<link rel="stylesheet" href="/css/main-style.css">
<link rel="shortcut icon" href="/images/favicon.svg" />
${document.head.innerHTML}`

document.body.innerHTML = `
<div class="mobile-overflow">
<header>
	<div id="hero-image" class="hero-image" style="background-image: var(--hero-gradient),url('/images/heroes/${data.hero}.jpeg');">
		<h1 id="hero-text" class="hero-text">${data.herotext}</h1>
	</div>
	<nav id="nav">
	<ul id="navbar">
		<li><a href="/"><div class="navitem">Home</div></a></li>
    <li><a href="/pages/projects.html"><div class="navitem">Projects</div></a></li>
		<li><a href="/pages/publications.html"><div class="navitem">Publications<br>and Talks</div></a></li>
		<li><a href="/pages/teaching.html"><div class="navitem">Teaching</div></a></li>
		<li><a href="/pages/service.html"><div class="navitem">Service<br>and Work</div></a></li>
		<li><a href="/pages/about-me.html"><div class="navitem">About Me</div></a></li>
	</ul>
	<div id="menubutton" class="navitem">
		<p></p>
	</div>
</nav>
</header>
<main>
<div id="profilecontainer">
	<div id="profile">
		<div class="profile-picture"></div>
		<div class="profile-name">Jack Isaac Rabinovitch</div>
		<div class="profile-desc">
				<p>Harvard Linguistics PhD Student</p>
				<p>Lab Member at <a href="https://projects.iq.harvard.edu/meaningandmodality">Meaning and Modality Lab</a>, <a href="https://sites.bu.edu/sulalab/">SULa Lab</a>, and <a href="https://fieldlinguistics.github.io/">WOLF Lab</a></p>
				<p><a href="/files/cv/Jack_Isaac_Rabinovitch_CV.pdf" download="Rabinovitch_CV.pdf">Download my CV</a></p>
				<p><a href="https://scholar.google.com/citations?user=IY8urCEAAAAJ&hl=en&oi=ao">Google Scholar</a></p>
				<p><a href="https://github.com/jackisaacrabinovitch">Github</a></p>
				<p><a href="https://twitter.com/jirabinovitch">Twitter</a></p>
				<p><a href="https://www.youtube.com/channel/UCdIw6RXcGW11joqzB4uXGXA">Youtube</a></p>
				<p id="switch-light-dark" tabindex=0 onclick="toggleDarkMode()"></p>
		</div>
	</div>
</div>
<div>
<div id="content" class="content"></div>
<div id="footer" class="content">Copyright © 2023 Jack Isaac Rabinovitch. All Rights Reserved.</div>
</div>
</main>
</div>
`

document.getElementById("content").innerHTML = content.innerHTML

// NAVIGATION
// When the event DOMContentLoaded occurs, it is safe to access the DOM
document.addEventListener('DOMContentLoaded', function() {

// When the user scrolls the page, execute opaqueNav
window.onscroll = function() {opaqueNav()};


// Add the nav-opaque class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function opaqueNav() {

var nav = document.getElementById("nav");
var profile = document.getElementById("profile");
var content = document.getElementById("content");

  if (window.pageYOffset >= 60) {
    nav.classList.add("nav-opaque")
  } else {
    nav.classList.remove("nav-opaque");
  }

   if (window.pageYOffset >= 250) {
     profile.classList.add("sticky")
     content.classList.add("sticky")
    } else {
    // profile.classList.remove("sticky");
    // content.classList.remove("sticky");
    }
}

opaqueNav()

})

//Navigation Slide for Mobile
const navSlide = () => {
  var nav = document.getElementById('nav')
  var menubutton = document.getElementById('menubutton')

  menubutton.addEventListener('click', () =>{
    nav.classList.toggle('nav-active')
  })
}

navSlide();

// DARK MODE TOGGLE
// check for saved 'darkMode' in localStorage
let darkMode = localStorage.getItem('darkMode'); 

const enableDarkMode = () => {
  // 1. Add the class to the body
  document.body.classList.add('darkmode');
  // 2. Update darkMode in localStorage
  localStorage.setItem('darkMode', 'enabled');
}

const disableDarkMode = () => {
  // 1. Remove the class from the body
  document.body.classList.remove('darkmode');
  // 2. Update darkMode in localStorage 
  localStorage.setItem('darkMode', 'disabled');
}
 
// If the user already visited and enabled darkMode
// start things off with it on
if (darkMode === 'enabled') {
  enableDarkMode();
}

const toggleDarkMode = () => {
  // get their darkMode setting
  darkMode = localStorage.getItem('darkMode'); 
  
  // if it not current enabled, enable it
  if (darkMode !== 'enabled') {
    enableDarkMode();
  // if it has been enabled, turn it off  
  } else {  
    disableDarkMode(); 
  }
}
