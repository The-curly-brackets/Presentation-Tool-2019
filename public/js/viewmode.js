import {loadSlideOnTemplateAndClone} from "./slideUtil.js";

const slideFrame = document.getElementById("slideFrame");
const navBar = document.getElementById("navBar");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const backBtn = document.getElementById("backBtn");
const previousBtn = document.getElementById("previousBtn");
const nextBtn = document.getElementById("nextBtn");
const editBtn = document.getElementById("editBtn");

const titleTemplate = document.getElementById("titleSlide");
const txtAndImgTemplate = document.getElementById("txtAndImgTemplate");
const listSlideTemplate = document.getElementById("listSlideTemplate");

let fsb = false;
let tok = null;
try {
    tok = JSON.parse(sessionStorage.getItem("logindata")).token;
} catch (e) {}

let presentation;
let currentSlide = 0;

getPresentationByID().then(id => {
        console.log(presentation);
        editBtn.addEventListener("click", evt => {
            closeFullscreen();
            window.location.href = "editmode.html?id=" + id;
        });
    }
);

async function getPresentationByID() {
    let urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('id');
    let url = `http://localhost:8080/presentations/${id}`;

    let cfg = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "authorization": tok
        }
    };

    try {
        let resp = await fetch(url, cfg);
        let data = await resp.json();

        presentation = data.presentation;
        console.log(presentation);
        loadSlide(currentSlide);
        return id;
    } catch (err) {
        console.log(err);
    }
}

function allDescendantsToPreview(node, slideId) {
    for (let i = 0; i < node.childNodes.length; i++) {
        let child = node.childNodes[i];

        if (child.tagName === "DIV") {
            allDescendantsToPreview(child, slideId);
            child.classList.add("noBorder");
        }
    }
}

function loadSlide(slideNb) {
    slideFrame.innerHTML = "";
    let slide = presentation.slides[slideNb].slide;
    slideFrame.classList.add(presentation.theme);
    let div;

    if (slide.type === "title") {
        div = loadSlideOnTemplateAndClone(titleTemplate, slide);
    } else if (slide.type === "txtAndImg") {
        div = loadSlideOnTemplateAndClone(txtAndImgTemplate, slide);
    } else if (slide.type === "listSlide") {
        div = loadSlideOnTemplateAndClone(listSlideTemplate, slide);
    }
    allDescendantsToPreview(div.childNodes[1], slideNb);
    //divs.forEach(div => div.classList.add("borderless"));

    slideFrame.style.backgroundColor = slide.backgroundColor;
    slideFrame.style.backgroundImage = `url('${slide.backgroundImg}')`;
    slideFrame.style.backgroundSize = "cover";
    slideFrame.appendChild(div);
}

// Eventlistners

backBtn.addEventListener('click', evt => {
    closeFullscreen();
    window.location.href = "overview.html";
});

fullscreenBtn.addEventListener("click", evt => {
    if (!fsb) {
        openFullscreen();
        fsb = true;
        fullscreenBtn.innerHTML = "Exit fullscreen";
    } else {
        closeFullscreen();
        fsb = false;
    }
});

nextBtn.addEventListener("click", evt => {
    nextSlide();
    loadSlide(currentSlide);
});

previousBtn.addEventListener("click", evt => {
    previousSlide();
    loadSlide(currentSlide);
});

// Code for fullscreen and exit fullscreen

let elem = document.documentElement;

function openFullscreen() {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
    }
    navBar.classList.add("hiddenNavBar");
}

function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
    fullscreenBtn.innerHTML = "Fullscreen";
    navBar.classList.remove("hiddenNavBar");
}

// Capture escape fullscreen event
document.addEventListener('fullscreenchange', exitHandler);
document.addEventListener('webkitfullscreenchange', exitHandler);
document.addEventListener('mozfullscreenchange', exitHandler);
document.addEventListener('MSFullscreenChange', exitHandler);

function exitHandler() {
    if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
        closeFullscreen();
    }
}

// Arrow keys

document.onkeydown = checkKey;

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode === 37) {
        previousSlide();
    } else if (e.keyCode === 39) {
        nextSlide();
    } else if (e.keyCode === 36) {
        currentSlide = 0;
    } else if (e.keyCode === 35) {
        currentSlide = presentation.slides.length - 1;
    }

    loadSlide(currentSlide);
}

function nextSlide() {
    if (currentSlide < presentation.slides.length - 1) {
        currentSlide++;
    }
}

function previousSlide() {
    if (currentSlide > 0) {
        currentSlide--;
    }
}