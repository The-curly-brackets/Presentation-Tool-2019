const slideFrame = document.getElementById("slideFrame");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const backBtn = document.getElementById("backBtn");

const titleTemplate = document.getElementById("titleSlide");
const txtAndImgTemplate = document.getElementById("txtAndImgTemplate");
const listSlideTemplate = document.getElementById("listSlideTemplate");

let width = document.body.clientWidth - 2;
let height = width * 0.5625;

slideFrame.style.width = width;
slideFrame.style.height = height;

let fsb = false;

let tok = JSON.parse(sessionStorage.getItem("logindata")).token;
let presID = 22;
let presentation;
let currentSlide = 0;

getPresentaionByID();

async function getPresentaionByID(){
    
    let url = `http://localhost:8080/presentations/${presID}`;

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
        
        presentation = data.pres.presentation;
        console.log(presentation);
        viewSlide(currentSlide);
    } catch (err) {
        console.log(err);
    }
}

function viewSlide(slideNumber){
    if(presentation.slides[slideNumber].slide.type == "title"){
        viewTitleSlide(slideNumber);
    }else if(presentation.slides[slideNumber].slide.type == "txtAndImg"){
        viewTxtAndImgSlide(slideNumber)
    }else if(presentation.slides[slideNumber].slide.type == "liSlide"){
        viewListSLide(slideNumber);
    }
    
}

function viewTitleSlide(slideNumber){
    slideFrame.innerHTML = "";
    let divs = titleTemplate.content.querySelectorAll("div");

    divs[1].innerHTML = presentation.slides[slideNumber].slide.headline.text;
    divs[2].innerHTML = presentation.slides[slideNumber].slide.byLine.text;
    
    slideFrame.style.backgroundColor = presentation.slides[slideNumber].slide.backgroundColor;
    slideFrame.style.backgroundImage = presentation.slides[slideNumber].slide.backgroundImg;

    let div = titleTemplate.content.cloneNode(true);
    slideFrame.appendChild(div);
}

function viewTxtAndImgSlide(slideNumber){
    slideFrame.innerHTML = "";
    let divs = txtAndImgTemplate.content.querySelectorAll("div");

    divs[1].innerHTML = presentation.slides[slideNumber].slide.headline.text;
    divs[2].innerHTML = presentation.slides[slideNumber].slide.byLine.text;

    let div = txtAndImgTemplate.content.cloneNode(true);
    slideFrame.appendChild(div);
}

function viewListSLide(slideNumber){
    slideFrame.innerHTML = "";
    let divs = listSlideTemplate.content.querySelectorAll("div");

    divs[1].innerHTML = presentation.slides[slideNumber].slide.headline.text;
    divs[2].innerHTML = presentation.slides[slideNumber].slide.byLine.text;

    let div = listSlideTemplate.content.cloneNode(true);
    slideFrame.appendChild(div);
}

// Eventlistners

backBtn.addEventListener('click', evt => {
    closeFullscreen();
    window.location.href = "overview.html";
})

fullscreenBtn.addEventListener("click", evt => {
    if(!fsb){
        openFullscreen();
        fsb = true;
        fullscreenBtn.innerHTML = "Exit fullscreen";
    }else{
        closeFullscreen();
        fsb = false;
        fullscreenBtn.innerHTML = "Fullscreen";
    }
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
}

// Arrow keys

document.onkeydown = checkKey;

function checkKey(e) {

    e = e || window.event;
    
    if (e.keyCode == '37') {
        if(currentSlide > 0){
            currentSlide--;
        }
    }
    else if (e.keyCode == '39') {
        if(currentSlide < presentaion.slides.length){
            currentSlide++;
        }
    }
}