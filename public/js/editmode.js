const newSlideBtn = document.getElementById("newSlideBtn");
const txtFiledBtn = document.getElementById("txtFiledBtn");

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
let presentation = {id: 28, name: "", date: "", theme: "", slides: [], visibility: 0};
// initialize();

// Fetches the last modified presentation from localStorage and DB
async function initialize() {
    // GET request to fetch presentation in db
    let urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('id');

    let url = `http://localhost:8080/presentations/${id}`;


    let cfg = {
        method: "GET",
        headers: {"Content-Type": "application/json"}
    };
    let dbPresentation = null;
    let localPresentation = null;

    try {
        let resp = await fetch(url, cfg);
        dbPresentation = await resp.json();
    } catch (err) {
        console.log(err);
    }

    try {
        localPresentation = JSON.parse(localStorage.getItem("presentation"));

        if (presentation.slides.length === 0) {
            presentation.slides.push(new Slide("title"));
        }
    } catch (err) {
        console.log(err)
    }

    if (dbPresentation.lastEdited <= localPresentation.lastEdited) {
        presentation = dbPresentation;
    } else {
        presentation = localPresentation;
    }
}

setup();
function setup() {
    for(let i = 0; i < 1; i++){
        let slidePreviewDiv = document.createElement("div");
        slidePreviewDiv.className = "slidePreview";
        slidePreviewCont.appendChild(slidePreviewDiv);
    }


    // ------------- Sets the height and width for the edit slide div-container ---------------

    let bodyHeight = document.body.clientHeight;

    slidePreviewCont.style.height = bodyHeight - 80 - 30; // This sets the height for the div with the slides previews. The heghit is bodyheight-toolbarheight-padding.

    let slideHeight = bodyHeight - 80 - 30;
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
    let url = "http://localhost:8080/presentations/updatePresentation";

    let updata = {
        presID: presentation.id,
        pres: presentation
    };

    let cfg = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(updata)
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
    editSlideCont.innerHTML = "";
    createTxtAndImgSlide();
    currentSlide++;
});

backBtn.addEventListener('click', evt => {
    window.location.href = "../html/overview.html";
});

listSlideBtn.addEventListener('click', evt => {
    createListSlide();
});

txtAndImageSlideBtn.addEventListener('click', evt => {
    createTxtAndImgSlide();
});

titleSlideBtn.addEventListener('click', evt => {
    createTitleSlide();
});

txtFiledBtn.addEventListener('click', evt => {
    createTextField();
});


// --- Functions ------------------------------------------------------

function makeList() {
    lastClickedElm.innerHTML = `<ul><li>Your text here ...</li></ul>`;
}

function createListSlide() {
    let slide = new Slide("list");
    slide.addBulletList();
    presentation.slides.push(slide.getSlide());

    let divs = listSlideTemplate.content.querySelectorAll("div");
    let ul = listSlideTemplate.content.querySelectorAll("li");

    divs[1].innerHTML = slide.getSlide().headline.text;
    ul[0].innerHTML = slide.getSlide().textBoxes[0].text[0];
    ul[1].innerHTML = slide.getSlide().textBoxes[1].text[0];

    let div = listSlideTemplate.content.cloneNode(true);
    for (let i = 0; i < div.firstElementChild.children.length; ++i) {
        div.firstElementChild.children[i].addEventListener('input', localSave);
    }
    editSlideCont.appendChild(div);
}

function createTxtAndImgSlide() {
    let slide = new Slide("txtAndImg");
    slide.addText();
    slide.addImg();
    presentation.slides.push(slide.getSlide());

    let divs = txtAndImgTemplate.content.querySelectorAll("div");
    let img = txtAndImgTemplate.content.querySelector("img");

    divs[1].innerHTML = slide.getSlide().headline.text;
    divs[3].innerHTML = slide.getSlide().textBoxes[0].text;
    img.src = slide.getSlide().img.src;

    let div = txtAndImgTemplate.content.cloneNode(true);
    for (let i = 0; i < div.firstElementChild.children.length; ++i) {
        div.firstElementChild.children[i].addEventListener('input', localSave);
    }
    editSlideCont.appendChild(div);
}

function createTitleSlide() {
    let slide = new Slide("title");
    presentation.slides.push(slide.getSlide());

    let divs = titleTemplate.content.querySelectorAll("div");
    divs[1].innerHTML = slide.getSlide().headline.text;
    divs[2].innerHTML = slide.getSlide().byLine.text;

    let div = titleTemplate.content.cloneNode(true);
    for (let i = 0; i < div.firstElementChild.children.length; ++i) {
        div.firstElementChild.children[i].addEventListener('input', localSave);
    }

    editSlideCont.appendChild(div);
}

function localSave(evt) {
    let currentDiv = evt.target;
    let containerDiv = currentDiv.parentNode;
    console.log(currentDiv);
    // Get the informations on the div
    // Save them in the corresponding slide in local storage

    for (let i = 0; i < containerDiv.childNodes.length; ++i) {
        let className = containerDiv.childNodes[i].className;
        if (className) {
            className = className.split(" ")[0];
        }
        console.log(className);

        switch (className) {
            case "title": {
                console.log(presentation.slides[currentSlide]);
                presentation.slides[currentSlide].headline.text = containerDiv.childNodes[i].innerHTML;
                break;
            }
            case "byFrame" : {
                presentation.slides[currentSlide].byLine.text = containerDiv.childNodes[i].innerHTML;
                break;
            }
            case "imgContainer": {
                presentation.slides[currentSlide].img.src = containerDiv.childNodes[i].childNodes[0].src;
                break;
            }
            default: {}
        }
    }

    localStorage.setItem("presentation", JSON.stringify(presentation));
}

