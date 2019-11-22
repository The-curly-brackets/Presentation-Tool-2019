const newSlideBtn = document.getElementById("newSlideBtn");
const numberListBtn = document.getElementById("numberListBtn");
const bulletListBtn = document.getElementById("bulletListBtn");

const imgFileInp = document.getElementById('imgFileInp');
const imgUpInp = document.getElementById("imgUpInp").addEventListener("click", evt => imgFileInp.click());

const backgroundColorInp = document.getElementById("backgroundColorInp");
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
            presentation.slides.push(new Slide("title"));   
        }
        console.log(presentation.slides[0].slide.headline);
        
        slidePreviews();
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

    currentSlide = 0;
    loadSlide();
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

//setup();

function setup() {

    // ------------- Sets the height and width for the edit slide div-container ---------------

    let bodyHeight = document.body.clientHeight;

    slidePreviewCont.style.height = bodyHeight - 80 - 30; // This sets the height for the div with the slides previews. The heghit is bodyheight-toolbarheight-padding.
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
    currentSlide--;
    loadSlide();
    slidePreviews()
    slidePreviewCont.childNodes[currentSlide].click();
});

imgFileInp.onchange = function(evt) {
    let theFile = imgFileInp.files[0];
    //console.log(theFile)

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
    }

    reader.readAsDataURL(theFile);
}

// --- Functions ------------------------------------------------------

function loadSlide() {
    editSlideCont.innerHTML = "";
    let slide = presentation.slides[currentSlide].slide;
    editSlideCont.classList.add(presentation.theme);
    console.log(presentation);
    let divs;
    let div;

    if (slide.type === "title"){
        divs = titleTemplate.content.querySelectorAll("div");
        divs[1].innerHTML = slide.headline.text;
        divs[2].innerHTML = slide.byLine.text;

        divs[1].style.fontFamily = slide.headline.fontType;
        divs[1].style.fontSize = slide.headline.fontSize;
        divs[1].style.fontWeight = slide.headline.bold;
        divs[1].style.fontStyle = slide.headline.italic;
        divs[1].style.textDecoration = slide.headline.underline;
        divs[1].style.color = slide.headline.fontColor;
        divs[1].style.textAlign = slide.headline.align;

        divs[2].style.fontFamily = slide.byLine.fontType;
        divs[2].style.fontSize = slide.byLine.fontSize;
        divs[2].style.fontWeight = slide.byLine.bold;
        divs[2].style.fontStyle = slide.byLine.italic;
        divs[2].style.textDecoration = slide.byLine.underline;
        divs[2].style.color = slide.byLine.fontColor;
        divs[2].style.textAlign = slide.byLine.align;

        div = titleTemplate.content.cloneNode(true);

    } else if (slide.type === "txtAndImg") {

        divs = txtAndImgTemplate.content.querySelectorAll("div");
        divs[1].innerHTML = slide.headline.text;
        divs[2].innerHTML = `<img src="${slide.img.src}">`;
        divs[3].innerHTML = slide.textBoxes[0].text;

        divs[1].style.fontFamily = slide.headline.fontType;
        divs[1].style.fontSize = slide.headline.fontSize;
        divs[1].style.fontWeight = slide.headline.bold;
        divs[1].style.fontStyle = slide.headline.italic;
        divs[1].style.textDecoration = slide.headline.underline;
        divs[1].style.color = slide.headline.fontColor;
        divs[1].style.textAlign = slide.headline.align;

        divs[3].style.fontFamily = slide.textBoxes[0].fontType;
        divs[3].style.fontSize = slide.textBoxes[0].fontSize;
        divs[3].style.fontWeight = slide.textBoxes[0].bold;
        divs[3].style.fontStyle = slide.textBoxes[0].italic;
        divs[3].style.textDecoration = slide.textBoxes[0].underline;
        divs[3].style.color = slide.textBoxes[0].fontColor;
        divs[3].style.textAlign = slide.textBoxes[0].align;

        div = txtAndImgTemplate.content.cloneNode(true);

    } else if (slide.type == "listSlide") {

        divs = listSlideTemplate.content.querySelectorAll("div");
        divs[1].innerHTML = slide.headline.text;
        divs[2].innerHTML = slide.textBoxes[0].text;
        divs[3].innerHTML = slide.textBoxes[1].text;

        divs[1].style.fontFamily = slide.headline.fontType;
        divs[1].style.fontSize = slide.headline.fontSize;
        divs[1].style.fontWeight = slide.headline.bold;
        divs[1].style.fontStyle = slide.headline.italic;
        divs[1].style.textDecoration = slide.headline.underline;
        divs[1].style.color = slide.headline.fontColor;
        divs[1].style.textAlign = slide.headline.align;

        divs[2].style.fontFamily = slide.textBoxes[0].fontType;
        divs[2].style.fontSize = slide.textBoxes[0].fontSize;
        divs[2].style.fontWeight = slide.textBoxes[0].bold;
        divs[2].style.fontStyle = slide.textBoxes[0].italic;
        divs[2].style.textDecoration = slide.textBoxes[0].underline;
        divs[2].style.color = slide.textBoxes[0].fontColor;
        divs[2].style.textAlign = slide.textBoxes[0].align;

        divs[3].style.fontFamily = slide.textBoxes[1].fontType;
        divs[3].style.fontSize = slide.textBoxes[1].fontSize;
        divs[3].style.fontWeight = slide.textBoxes[1].bold;
        divs[3].style.fontStyle = slide.textBoxes[1].italic;
        divs[3].style.textDecoration = slide.textBoxes[1].underline;
        divs[3].style.color = slide.textBoxes[1].fontColor;
        divs[3].style.textAlign = slide.textBoxes[1].align;

        div = listSlideTemplate.content.cloneNode(true);
    }

    for (let i = 0; i < div.firstElementChild.children.length; ++i) {
        div.firstElementChild.children[i].addEventListener('click', evt => {
            lastClickedElm = evt.target;
            selectValues()
        });
        div.firstElementChild.children[i].addEventListener('input', localSave);
    }
    editSlideCont.style.backgroundColor = slide.backgroundColor;
    editSlideCont.appendChild(div);
}



function selectValues (){
    // This select the option in fontSizeSelcet that has the same value as the element that was selectet 
    
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

