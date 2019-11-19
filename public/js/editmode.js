const newSlideBtn = document.getElementById("newSlideBtn");
const numberListBtn = document.getElementById("numberListBtn");
const bulletListBtn = document.getElementById("bulletListBtn");

const imgFileInp = document.getElementById('imgFileInp')
const imgUpInp = document.getElementById("imgUpInp").addEventListener("click", evt => imgFileInp.click());

const backgroundImgInp = document.getElementById('backgroundImgInp')
const backgroundImgBtn = document.getElementById("backgroundImgBtn").addEventListener("click", evt => backgroundImgInp.click());

const titleSlideBtn = document.getElementById("titleSlideBtn");
const txtAndImageSlideBtn = document.getElementById("txtAndImageSlideBtn");
const listSlideBtn = document.getElementById("listSlideBtn");

const backBtn = document.getElementById("backBtn");
const saveBtn = document.getElementById("saveBtn");

const titleTemplate = document.getElementById("titleSlide");
const txtAndImgTemplate = document.getElementById("txtAndImgTemplate");
const listSlideTemplate = document.getElementById("listSlideTemplate");

const slidePreviewCont = document.getElementById("allSlidesPreviewCont");
const editSlideCont = document.getElementById("editSlideCont");

let token = JSON.parse(sessionStorage.getItem("logindata")).token;

// --- Classes ---------------------------------------------------

class Slide {
    constructor(typeOfSlide) {
        this.slide = {
            type: typeOfSlide,
            textBoxes: [{text: ["Your text here ..."]}, {text: ["Your text here ..."]}],
            img: {
                src: ""
            },
            headline: {
                fontSize: "",
                fontColor: "",
                fontType: "",
                text: "Your title here ...",
                align: "",
                bold: false,
                italic: false,
                underline: false
            },
            byLine: {
                fontSize: "",
                fontColor: "",
                fontType: "",
                text: "By: Your Name",
                align: "",
                bold: false,
                italic: false,
                underline: false
            },
            backgroundColor: "",
            backgroundImg: "",
            theme: ""
        }
    }

    getSlide() {
        return this.slide;
    }

    addBulletList() {
        this.slide.textBoxes.push({
            type: "ul",
            fontSize: "",
            fontColor: "",
            fontType: "",
            text: "",
            align: "",
            bold: false,
            italic: false,
            underline: false
        });
    }

    addText() {
        this.slide.textBoxes.push({
            type: "text",
            fontSize: "",
            fontColor: "",
            fontType: "",
            text: "",
            align: "",
            bold: false,
            italic: false,
            underline: false
        });
    }

    addNumberList() {
        this.slide.textBoxes.push({
            type: "numbList",
            fontSize: "",
            fontColor: "",
            fontType: "",
            text: "",
            align: "",
            bold: false,
            italic: false,
            underline: false
        });
    }

    addImg(imgSrc) {
        this.slide.imgField = imgSrc;
    }
}

// ---------------------------------------------------------------------

let lastClickedElm;
let currentSlide = 0;
let lastClickedSlide; 
let presentation;

//startup();

function startup (){
    presentation = JSON.parse(localStorage.getItem("presentation"));
    if (presentation.slides.length === 0) {
        presentation.slides.push(new Slide("title"));
    }
    slidePreviews();
    slidePreviewCont.childNodes[0].click();
}

initialize();

// Fetches the last modified presentation from localStorage and DB

async function initialize() {
    // GET request to fetch presentation in db
    let urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('id');

    let url = `http://localhost:8080/presentations/${id}`;

    let cfg = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "authorization": token
        }
    };

    try {
        let resp = await fetch(url, cfg);
        let data = await resp.json();
        presentation = data.presentation;
    } catch (err) {
        console.log(err);
    }
    if (presentation.slides.length > 0) {
        slidePreviews();
    }
}

function slidePreviews () {
    slidePreviewCont.innerHTML = "";
    for(let i = 1; i <= presentation.slides.length; i++){ 
        let slidePreviewDiv = document.createElement("div");
        slidePreviewDiv.className = "slidePreview";
        slidePreviewDiv.innerHTML = i;
        slidePreviewDiv.addEventListener("click", navigateSlide)
        slidePreviewCont.appendChild(slidePreviewDiv);
        lastClickedSlide = slidePreviewDiv;
    }
    lastClickedSlide.style.border = "1px solid #2f71e3";
    loadSlide();
}

function navigateSlide(evt){
    if(lastClickedSlide){
        lastClickedSlide.style.border = "1px solid black";
    }
    currentSlide = evt.target.innerHTML - 1;
    evt.target.style.border = "1px solid #2f71e3";
    lastClickedSlide = evt.target;
    loadSlide();
}

setup();

function setup() {

    // ------------- Sets the height and width for the edit slide div-container ---------------

    let bodyHeight = document.body.clientHeight;

    slidePreviewCont.style.height = bodyHeight - 80 - 30; // This sets the height for the div with the slides previews. The heghit is bodyheight-toolbarheight-padding.

    let slideHeight = bodyHeight - 150 - 30;
    let slideWidth = (slideHeight/9) * 16;

    let slideMaxWidth = document.body.clientWidth - 200;

    if(slideWidth > slideMaxWidth){
        slideWidth = slideMaxWidth;
    }

    slideHeight = (slideWidth/16)*9;

    editSlideCont.style.height = slideHeight;
    editSlideCont.style.width = slideWidth;
}

// --- EventListener ---------------------------------------------------

saveBtn.addEventListener('click', async evt => {
    // TODO: Factorize it with other queries and add an independent function
    let urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('id');
    let url = "http://localhost:8080/presentations/" + id;

    let cfg = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "authorization": token
        },
        body: JSON.stringify(presentation)
    };

    try {
        let resp = await fetch(url, cfg);
        let data = await resp.json();

        console.log(data.msg);
    } catch (err) {
        console.log(err);
    }
});

newSlideBtn.addEventListener('click', evt => {
    presentation.slides.push(new Slide("txtAndImg"));
    currentSlide = presentation.slides.length - 1;
    loadSlide();
    slidePreviews();
});

backBtn.addEventListener('click', evt => {
    window.location.href = "../html/overview.html";
});

listSlideBtn.addEventListener('click', evt => {
    presentation.slides[currentSlide].slide.type = "listSlide";
    loadSlide();
});

txtAndImageSlideBtn.addEventListener('click', evt => {
    presentation.slides[currentSlide].slide.type = "txtAndImg";
    loadSlide();
});

titleSlideBtn.addEventListener('click', evt => {
    presentation.slides[currentSlide].slide.type = "title";
    loadSlide();
});

numberListBtn.addEventListener('click', evt => {
    if(lastClickedElm){
        lastClickedElm.innerHTML = lastClickedElm.innerHTML + "<ol><li>list</li></ol>";
    }   
});

bulletListBtn.addEventListener('click', evt => {
    if(lastClickedElm){
        lastClickedElm.innerHTML = lastClickedElm.innerHTML + "<ul><li>list</li></ul>";
    }  
});


// --- Functions ------------------------------------------------------

function loadSlide(){
    editSlideCont.innerHTML = "";
    let slide = presentation.slides[currentSlide].slide;
    let divs;
    let div;
    
    if (slide.type == "title"){
        
        divs = titleTemplate.content.querySelectorAll("div");
        divs[1].innerHTML = slide.headline.text;
        divs[2].innerHTML = slide.byLine.text;
        div = titleTemplate.content.cloneNode(true);

    } else if (slide.type == "txtAndImg") {

        divs = txtAndImgTemplate.content.querySelectorAll("div");
        divs[1].innerHTML = slide.headline.text;
        divs[2].innerHTML = `<img src="${slide.img.src}">`;
        divs[3].innerHTML = slide.textBoxes[0].text;
        div = txtAndImgTemplate.content.cloneNode(true);

    } else if (slide.type == "listSlide") {

        divs = listSlideTemplate.content.querySelectorAll("div");
        divs[1].innerHTML = slide.headline.text;
        divs[2].innerHTML = slide.textBoxes[0].text;
        divs[3].innerHTML = slide.textBoxes[1].text;
        div = listSlideTemplate.content.cloneNode(true);

    }
    
    for (let i = 0; i < div.firstElementChild.children.length; ++i) {
        div.firstElementChild.children[i].addEventListener('click', evt => lastClickedElm = evt.target);
        div.firstElementChild.children[i].addEventListener('input', localSave);
    }

    editSlideCont.appendChild(div);
}


function localSave(evt) {
    let currentDiv = evt.target;
    let containerDiv = currentDiv.parentNode;
    // Get the informations on the div
    // Save them in the corresponding slide in local storage

    for (let i = 0; i < containerDiv.childNodes.length; ++i) {
        let className = containerDiv.childNodes[i].className;
        if (className) {
            className = className.split(" ")[0];
        }

        switch (className) {
            case "title": {
                presentation.slides[currentSlide].slide.headline.text = containerDiv.childNodes[i].innerHTML;
                break;
            }
            case "byFrame" : {
                presentation.slides[currentSlide].slide.byLine.text = containerDiv.childNodes[i].innerHTML;
                break;
            }
            case "imgContainer": {
                //presentation.slides[currentSlide].slide.img.src = containerDiv.childNodes[i].childNodes[i].src;
                break;
            }
            case "txtboxOne": {
                presentation.slides[currentSlide].slide.textBoxes[0].text = containerDiv.childNodes[i].innerHTML;
                break;
            }
            case "txtboxTwo": {
                presentation.slides[currentSlide].slide.textBoxes[1].text = containerDiv.childNodes[i].innerHTML;
                break;
            }
            default: {}
        }
    }

    localStorage.setItem("presentation", JSON.stringify(presentation));
}

