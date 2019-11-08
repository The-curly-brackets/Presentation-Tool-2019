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

// --- Classes ---------------------------------------------------

class Slide {
    constructor(typeOfSlide) {
        this.slide = {
            type: typeOfSlide,
            textBoxes: [{text: ["Your text here ..."]}, {text:["Your text here ..."] }],
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

getSlide(){
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

let presentation = JSON.parse(localStorage.getItem("presentation"));
presentation = presentation.presentation;

if(presentation.presentation.slides.length == 0){
    presentation.presentation.slides.push(new Slide("title"));
}

// --- EventListener ---------------------------------------------------

saveBtn.addEventListener('click', async evt => {
    let url = "http://localhost:8080/presentations/updatePresentation";

    let updata =  {
        presID: presentation.id,
        pres: presentation.presentation
    }

    let cfg = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(updata)
    }

    try {
        let resp = await fetch(url, cfg);
        let data = await resp.json();
        
        console.log(data.msg);
    }
    catch (err) {
        console.log(err);
    }
    
})

newSlideBtn.addEventListener('click', evt => {
    presentation.presentation.slides.push(new Slide("txtAndImg"));
});

backBtn.addEventListener('click', evt => {
    window.location.href = "../html/overview.html";
})

listSlideBtn.addEventListener('click', evt => {
    createListSlide();
})

txtAndImageSlideBtn.addEventListener('click', evt => {
    createTxtAndImgSlide();
})

titleSlideBtn.addEventListener('click',evt =>{
    createTitleSlide();
});

txtFiledBtn.addEventListener('click', evt => {
    createTextField();
});


// --- Functions ------------------------------------------------------

function makeList(){
    lastClickedElm.innerHTML = `<ul><li>Your text here ...</li></ul>`;
}

function createListSlide() {
    let slide = new Slide("list");
    slide.addBulletList();
    presentation.presentation.slides.push(slide);

    let divs = listSlideTemplate.content.querySelectorAll("div");
    let ul = listSlideTemplate.content.querySelectorAll("li")

    divs[1].innerHTML = slide.getSlide().headline.text;
    ul[0].innerHTML = slide.getSlide().textBoxes[0].text[0];
    ul[1].innerHTML = slide.getSlide().textBoxes[1].text[0];

    let div = listSlideTemplate.content.cloneNode(true);
    div.addEventListener('change', localSave);
    editSlideCont.appendChild(div);
}

function createTxtAndImgSlide(){
    let slide = new Slide("txtAndImg");
    slide.addText();
    slide.addImg();
    presentation.presentation.slides.push(slide.getSlide());

    let divs = txtAndImgTemplate.content.querySelectorAll("div");
    let img = txtAndImgTemplate.content.querySelector("img");

    divs[1].innerHTML = slide.getSlide().headline.text;
    divs[3].innerHTML = slide.getSlide().textBoxes[0].text;
    img.src = slide.getSlide().img.src;

    let div = txtAndImgTemplate.content.cloneNode(true);
    editSlideCont.appendChild(div);
}

function createTitleSlide(){
    let slide = new Slide("title");
    presentation.presentation.slides.push(slide.getSlide());
    
    let divs = titleTemplate.content.querySelectorAll("div");
    divs[1].innerHTML = slide.getSlide().headline.text;
    divs[2].innerHTML = slide.getSlide().byLine.text;
    
    let div = titleTemplate.content.cloneNode(true);
    editSlideCont.appendChild(div);
}

function localSave(){
    presentation.presentation.slides[0].textBoxes[0].text = 

    localStorage.setItem("presentation", JSON.stringify(presentation));
}