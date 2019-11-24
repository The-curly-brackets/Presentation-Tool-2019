import {loadSlideOnTemplateAndClone} from "./slideUtil.js";

const newSlideBtn = document.getElementById("newSlideBtn");
const numberListBtn = document.getElementById("numberListBtn");
const bulletListBtn = document.getElementById("bulletListBtn");

const imgFileInp = document.getElementById('imgFileInp');
const imgUpInp = document.getElementById("imgUpInp").addEventListener("click", evt => imgFileInp.click());

const backgroundColorInp = document.getElementById("backgroundColorInp");
const backgroundImgInp = document.getElementById('backgroundImgInp');
const backgroundImgBtn = document.getElementById("backgroundImgBtn").addEventListener("click", evt => backgroundImgInp.click());
const removeBackgroundImg = document.getElementById("removeBackgroundImg");

const titleSlideBtn = document.getElementById("titleSlideBtn");
const txtAndImageSlideBtn = document.getElementById("txtAndImageSlideBtn");
const listSlideBtn = document.getElementById("listSlideBtn");

const backBtn = document.getElementById("backBtn");
const saveBtn = document.getElementById("saveBtn");

const titleTemplate = document.getElementById("titleSlide");
const txtAndImgTemplate = document.getElementById("txtAndImgTemplate");
const listSlideTemplate = document.getElementById("listSlideTemplate");

const slidePreviewCont = document.getElementById("allSlidesPreviewCont");
let editSlideCont = document.getElementById("editSlideCont");

const fontFamSelect = document.getElementById("fontFamSelect");
const fontSizeSelect = document.getElementById("fontSizeSelect");

const underlineBtn = document.getElementById("underlineBtn").addEventListener('click', styleSlideSave);
const boldBtn = document.getElementById("boldBtn").addEventListener('click', styleSlideSave);
const italicBtn = document.getElementById("italicBtn").addEventListener('click', styleSlideSave);

const textColorInp = document.getElementById("textColorInp");

textColorInp.addEventListener('input', styleSlideSave);

const alBtn = document.getElementById("alBtn").addEventListener('click', styleSlideSave);
const acBtn = document.getElementById("acBtn").addEventListener('click', styleSlideSave);
const arBtn = document.getElementById("arBtn").addEventListener('click', styleSlideSave);

const deleteSlideBtn = document.getElementById("deleteSlideBtn");

let token = JSON.parse(sessionStorage.getItem("logindata")).token;


// --- Classes ---------------------------------------------------

class Slide {
    constructor(typeOfSlide, presentationTheme) {
        this.fontFam = "helvetica";
        this.fontcolor = "#000000";
        
        if(presentationTheme == "classicTheme"){
            this.fontFam = "Fondamento";
            this.bColor = "#832724";
            this.fontcolor = "#ffffff";
        }else if(presentationTheme == "darkTheme"){
            this.fontcolor = "#ffffff";
            this.bColor = "#000000";
        }

        this.slide = {
            type: typeOfSlide,
            img: {
                src: ""
            },
            headline: {
                fontSize: "48pt",
                fontColor: this.fontcolor,
                fontType: this.fontFam,
                text: "Your title here ...",
                align: "center",
                bold: false,
                italic: false,
                underline: false
            },
            byLine: {
                fontSize: "18pt",
                fontColor: this.fontcolor,
                fontType: this.fontFam,
                text: "By: Your Name",
                align: "center",
                bold: false,
                italic: false,
                underline: false
            },
            backgroundColor: this.bColor,
            backgroundImg: "",
            theme: "",
            textBoxes: [{
                fontSize: "18pt",
                fontColor: this.fontcolor,
                fontType: this.fontFam,
                text: "Your text here ...",
                align: "left",
                bold: false,
                italic: false,
                underline: false
            }, {
                fontSize: "18pt",
                fontColor: this.fontcolor,
                fontType: this.fontFam,
                text: "Your text here ...",
                align: "left",
                bold: false,
                italic: false,
                underline: false
            }]
        }
    }
}

// ---------------------------------------------------------------------

let lastClickedElm;
let currentSlide = 0;
let lastClickedSlide;
let presentation;
let imgInBase64;

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
       
        if (presentation.slides.length === 0) {
            presentation.slides.push(new Slide("title", presentation.theme));   
        }
        console.log(presentation);
        slidePreviews();
        currentSlide = 0;
        loadSlide();
        slidePreviewCont.childNodes[0].click();
    } catch (err) {
        console.log(err);
    }
}

function allDescendantsToPreview(node, slideId) {
    for (let i = 0; i < node.childNodes.length; i++) {
        let child = node.childNodes[i];
        allDescendantsToPreview(child, slideId);
        if (child.isContentEditable) {
            child.setAttribute('contenteditable', "false");
        }
        child.slideId = slideId;
    }
}

function slidePreviews() {
    slidePreviewCont.innerHTML = "";
    let bckCurrentSlide = currentSlide;

    for (let i = 0; i < presentation.slides.length; i++) {
        currentSlide = i;
        loadSlide();

        let clone = editSlideCont.cloneNode(true);
        let slidePreviewDiv = document.createElement("div");

        clone.innerHTML = editSlideCont.innerHTML;
        slidePreviewDiv.classList.add("editSlidePreviewCont");
        clone.classList.add("slidePreview");

        clone.childNodes[1].classList.add("slidePreviewContent");
        clone.childNodes[1].classList.remove("allTypeContainer");
        clone.style.border = "1px solid black";
        allDescendantsToPreview(clone, i);
        clone.addEventListener("click", navigateSlide);
        clone.slideId = i;

        slidePreviewDiv.appendChild(clone);
        slidePreviewCont.appendChild(slidePreviewDiv);
    }
    currentSlide = bckCurrentSlide;
}

function navigateSlide(evt) {
    if(lastClickedSlide){
        lastClickedSlide.style.border = "1px solid black";
    }
    currentSlide = evt.currentTarget.slideId;
    evt.currentTarget.style.border = "1px solid #2f71e3";
    lastClickedSlide = evt.currentTarget;
    loadSlide();
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
        
        console.log(data);
    } catch (err) {
        console.log(err);
    }
});

newSlideBtn.addEventListener('click', evt => {
    presentation.slides.push(new Slide("txtAndImg", presentation.theme));

    slidePreviews();
    currentSlide = presentation.slides.length - 1;
    loadSlide();
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
    if (lastClickedElm) {
        lastClickedElm.innerHTML = lastClickedElm.innerHTML + "<ol><li>list</li></ol>";
    }
});

bulletListBtn.addEventListener('click', evt => {
    if (lastClickedElm) {
        lastClickedElm.innerHTML = lastClickedElm.innerHTML + "<ul><li>list</li></ul>";
    }
});

fontFamSelect.addEventListener('change', styleSlideSave);
fontSizeSelect.addEventListener('change', styleSlideSave);

backgroundColorInp.addEventListener('input', styleSlideSave);

deleteSlideBtn.addEventListener('click', evt => {
       presentation.slides.splice(currentSlide, 1);
    slidePreviews();
    if(currentSlide > 0) {
        currentSlide--;
    }

    loadSlide();
    slidePreviewCont.childNodes[currentSlide].click();
});

imgFileInp.onchange = function(evt) {
    let theFile = imgFileInp.files[0];

    //check type
    if (theFile.type != "image/png" && theFile.type != "image/jpeg") {
        console.log("error: wrong filetype");
        return;
    }
    
    //check size
    if (theFile.size > 200000) {
        console.log("error: file too large");
        return;
    }

    let reader = new FileReader();
    reader.onloadend = function() {
        imgInBase64 = reader.result;
        presentation.slides[currentSlide].slide.img.src = imgInBase64;
        loadSlide();
    };

    reader.readAsDataURL(theFile);
};

backgroundImgInp.onchange = function(evt) {
    let theFile = backgroundImgInp.files[0];

    //check type
    if (theFile.type != "image/png" && theFile.type != "image/jpeg") {
        console.log("error: wrong filetype");
        return;
    }
    
    //check size
    if (theFile.size > 200000) {
        console.log("error: file too large");
        return;
    }

    let reader = new FileReader();
    reader.onloadend = function() {
        imgInBase64 = reader.result;
        presentation.slides[currentSlide].slide.backgroundImg = imgInBase64;
        loadSlide();
    }

    reader.readAsDataURL(theFile);
}

removeBackgroundImg.addEventListener("click", evt => {
    presentation.slides[currentSlide].slide.backgroundImg = "";
    loadSlide();
})

// --- Functions ------------------------------------------------------

function loadSlide() {
    editSlideCont.innerHTML = "";
    let slide = presentation.slides[currentSlide].slide;
    editSlideCont.classList.add(presentation.theme);
    let div;

    if (slide.type === "title"){
        div = loadSlideOnTemplateAndClone(titleTemplate, slide);
    } else if (slide.type === "txtAndImg") {
        div = loadSlideOnTemplateAndClone(txtAndImgTemplate, slide);
    } else if (slide.type === "listSlide") {
        div = loadSlideOnTemplateAndClone(listSlideTemplate, slide);
    }

    for (let i = 0; i < div.firstElementChild.children.length; ++i) {
        div.firstElementChild.children[i].addEventListener('click', evt => {
            lastClickedElm = evt.target;
            selectValues()
        });
        div.firstElementChild.children[i].addEventListener('input', localSave);
    }
    editSlideCont.style.backgroundColor = slide.backgroundColor;
    
    editSlideCont.style.backgroundImage = `url('${slide.backgroundImg}')`;
    editSlideCont.style.backgroundSize = "cover";
    editSlideCont.appendChild(div);
}



function selectValues (){
    // This select the option in fontSizeSelcet that has the same value as the element that was selectet
    
    console.log(lastClickedElm);
    
    let options = fontSizeSelect.options;
    let i = 0;

    for (let option of options) {
        if(option.value + "pt" == lastClickedElm.style.fontSize){
            fontSizeSelect.selectedIndex = i;
        }else {
            i++;
        }
    }

    options = fontFamSelect.options;
    i = 0;

    for (let option of options) {
        if (lastClickedElm.style.fontFamily == "helvetica" && option.value == 0){
            fontFamSelect.selectedIndex = i;
        } else if (lastClickedElm.style.fontFamily == "calibri" && option.value == 1){
            fontFamSelect.selectedIndex = i;
        } else if(lastClickedElm.style.fontFamily == "courier" && option.value == 2){
            fontFamSelect.selectedIndex = i;
        }else if(lastClickedElm.style.fontFamily == "Fondamento" && option.value == 3){
            fontFamSelect.selectedIndex = i;
        }else {
            i++;
        }
    }

    // Henta fra nettet https://css-tricks.com/converting-color-spaces-in-javascript/
    
    function RGBToHex(rgb) {
        // Choose correct separator
        let sep = rgb.indexOf(",") > -1 ? "," : " ";
        // Turn "rgb(r,g,b)" into [r,g,b]
        rgb = rgb.substr(4).split(")")[0].split(sep);
      
        let r = (+rgb[0]).toString(16),
            g = (+rgb[1]).toString(16),
            b = (+rgb[2]).toString(16);
      
        if (r.length == 1)
          r = "0" + r;
        if (g.length == 1)
          g = "0" + g;
        if (b.length == 1)
          b = "0" + b;
      
        return "#" + r + g + b;
    }

    textColorInp.value = RGBToHex(lastClickedElm.style.color);

    if(!editSlideCont.style.backgroundColor){
        editSlideCont.style.backgroundColor = "#ffffff";
    }
    backgroundColorInp.value = RGBToHex(editSlideCont.style.backgroundColor);
}


function styleSlideSave (evt){
    editSlideCont.style.backgroundColor = backgroundColorInp.value;
    presentation.slides[currentSlide].slide.backgroundColor = backgroundColorInp.value;
    
    if(lastClickedElm){
        let currentDiv = lastClickedElm;
        let containerDiv = currentDiv.parentNode;
        
        lastClickedElm.style.fontSize = fontSizeSelect.value + "pt";
        lastClickedElm.style.color = textColorInp.value;
        
        if(evt.target.id == "boldBtn"){
            if(lastClickedElm.style.fontWeight == "bold"){
                lastClickedElm.style.fontWeight = "normal";
            }else{
                lastClickedElm.style.fontWeight = "bold";
            } 
        }else if(evt.target.id == "underlineBtn"){
            if(lastClickedElm.style.textDecoration == "underline"){
                lastClickedElm.style.textDecoration = "none";
            }else{
                lastClickedElm.style.textDecoration = "underline";
            }
        }else if(evt.target.id == "italicBtn"){
            if(lastClickedElm.style.fontStyle == "italic"){
                lastClickedElm.style.fontStyle = "normal";
            }else {
                lastClickedElm.style.fontStyle = "italic";
            }
        }

        if(evt.target.id == "alBtn"){
            lastClickedElm.style.textAlign = "left";
        }else if (evt.target.id == "acBtn"){
            lastClickedElm.style.textAlign = "center";
        }else if(evt.target.id == "arBtn"){
            lastClickedElm.style.textAlign = "right";
        }
        
        switch(fontFamSelect.value) {
                case "0": {
                    lastClickedElm.style.fontFamily = "helvetica";
                    break;
                }
                case "1": {
                    lastClickedElm.style.fontFamily = "calibri";
                    break;
                }
                case "2": {
                    lastClickedElm.style.fontFamily = "courier";
                    break;
                }
                case "3": {
                    lastClickedElm.style.fontFamily = "Fondamento";
                    break;
                }
                default: {}
            }

        for (let i = 0; i < containerDiv.childNodes.length; ++i) {
            let className = containerDiv.childNodes[i].className;
            if (className) {
                className = className.split(" ")[0];
            }

            switch (className) {
                case "title": {
                    presentation.slides[currentSlide].slide.headline.fontType = containerDiv.childNodes[i].style.fontFamily;
                    presentation.slides[currentSlide].slide.headline.fontSize = containerDiv.childNodes[i].style.fontSize;
                    presentation.slides[currentSlide].slide.headline.bold =  containerDiv.childNodes[i].style.fontWeight;
                    presentation.slides[currentSlide].slide.headline.italic =  containerDiv.childNodes[i].style.fontStyle;
                    presentation.slides[currentSlide].slide.headline.underline =  containerDiv.childNodes[i].style.textDecoration;
                    presentation.slides[currentSlide].slide.headline.fontColor =  containerDiv.childNodes[i].style.color;
                    presentation.slides[currentSlide].slide.headline.align =  containerDiv.childNodes[i].style.textAlign;
                    break;
                }
                case "byFrame" : {
                    presentation.slides[currentSlide].slide.byLine.fontType = containerDiv.childNodes[i].style.fontFamily;
                    presentation.slides[currentSlide].slide.byLine.fontSize = containerDiv.childNodes[i].style.fontSize;
                    presentation.slides[currentSlide].slide.byLine.bold =  containerDiv.childNodes[i].style.fontWeight;
                    presentation.slides[currentSlide].slide.byLine.italic =  containerDiv.childNodes[i].style.fontStyle;
                    presentation.slides[currentSlide].slide.byLine.underline =  containerDiv.childNodes[i].style.textDecoration;
                    presentation.slides[currentSlide].slide.byLine.fontColor =  containerDiv.childNodes[i].style.color;
                    presentation.slides[currentSlide].slide.byLine.align =  containerDiv.childNodes[i].style.textAlign;
                    break;
                }
                case "imgContainer": {
                    //presentation.slides[currentSlide].slide.img.src = containerDiv.childNodes[i].childNodes[i].src;
                    break;
                }
                case "txtboxOne": {
                    presentation.slides[currentSlide].slide.textBoxes[0].fontType = containerDiv.childNodes[i].style.fontFamily;
                    presentation.slides[currentSlide].slide.textBoxes[0].fontSize = containerDiv.childNodes[i].style.fontSize;
                    presentation.slides[currentSlide].slide.textBoxes[0].bold =  containerDiv.childNodes[i].style.fontWeight;
                    presentation.slides[currentSlide].slide.textBoxes[0].italic =  containerDiv.childNodes[i].style.fontStyle;
                    presentation.slides[currentSlide].slide.textBoxes[0].underline =  containerDiv.childNodes[i].style.textDecoration;
                    presentation.slides[currentSlide].slide.textBoxes[0].fontColor =  containerDiv.childNodes[i].style.color;
                    presentation.slides[currentSlide].slide.textBoxes[0].align =  containerDiv.childNodes[i].style.textAlign;
                    break;
                }
                case "txtboxTwo": {
                    presentation.slides[currentSlide].slide.textBoxes[1].fontType = containerDiv.childNodes[i].style.fontFamily;
                    presentation.slides[currentSlide].slide.textBoxes[1].fontSize = containerDiv.childNodes[i].style.fontSize;
                    presentation.slides[currentSlide].slide.textBoxes[1].bold =  containerDiv.childNodes[i].style.fontWeight;
                    presentation.slides[currentSlide].slide.textBoxes[1].italic =  containerDiv.childNodes[i].style.fontStyle;
                    presentation.slides[currentSlide].slide.textBoxes[1].underline =  containerDiv.childNodes[i].style.textDecoration;
                    presentation.slides[currentSlide].slide.textBoxes[1].fontColor =  containerDiv.childNodes[i].style.color;
                    presentation.slides[currentSlide].slide.textBoxes[1].align =  containerDiv.childNodes[i].style.textAlign;
                    break;
                }
                default: {}
            }

        }
        
    }
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
            default: {
            }
        }
    }

    localStorage.setItem("presentation", JSON.stringify(presentation));
}

