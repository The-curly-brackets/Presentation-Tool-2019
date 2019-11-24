import {loadSlideOnTemplateAndClone} from "./slideUtil.js";

const newPresBtn = document.getElementById("newPresBtn");
const presListCont = document.getElementById("presListCont");
const signoutBtn = document.getElementById("signoutBtn");
const editaccountBtn = document.getElementById("editaccountBtn");
const createPresBtn = document.getElementById("createPresBtn");
const presNameInp = document.getElementById("presNameInp");
const delPresModal = document.getElementById("delPresModal");
const deletePresBtn = document.getElementById("deletePresBtn");
const shareModal =document.getElementById("shareModal");

const newPresModal = document.getElementById("newPresModal");
const closeModal = document.getElementsByClassName("close")[0];
const basicTheme = document.getElementById("basicTheme").addEventListener("click", selectTheme);
const classicTheme = document.getElementById("classicTheme").addEventListener("click", selectTheme);
const darkTheme = document.getElementById("darkTheme").addEventListener("click", selectTheme);


let lastTheme = basicTheme;
let theme = "basic";
let presID;

function selectTheme(evt) {
    theme = (this.id);
    document.getElementById(theme).setAttribute("class", "themeChoosen");
}

let token = JSON.parse(sessionStorage.getItem("logindata")).token;

listPresentations();

editaccountBtn.addEventListener("click", evt => window.location.href = "editaccount.html");

newPresBtn.addEventListener('click', evt => {
    newPresModal.style.display = "block";
});

closeModal.onclick = function () {
    newPresModal.style.display = "none";
};

window.onclick = function (event) {
    if (event.target == newPresModal || event.target == delPresModal || event.target == shareModal) {
        newPresModal.style.display = "none";
        delPresModal.style.display = "none";
        shareModal.style.display = "none";
    }
};

createPresBtn.addEventListener('click', async evt => {

    let url = "https://presentation-tool-2019.herokuapp.com/presentations/";
    let name = presNameInp.value;
    let date = new Date();
    date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

    let updata = {
        name: name,
        date: date,
        theme: theme,
        slides: []
    };

    let cfg = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "authorization": token
        },
        body: JSON.stringify(updata)
    };

    try {
        let resp = await fetch(url, cfg);
        let data = await resp.json();

        Object.assign(updata, data);
        localStorage.setItem("presentation", JSON.stringify(updata));
        window.location.href = "editmode.html?id=" + data.presentationId;
    } catch (err) {
        console.log(err);
    }

});

signoutBtn.addEventListener('click', evt => {
    sessionStorage.clear();
    window.location.href = "../html/login.html";
});


async function listPresentations() {
    presListCont.innerHTML = "";
    let url = "https://presentation-tool-2019.herokuapp.com/presentations/overview";
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

        if (!Array.isArray(data)) {
            data = [data];
        }

        const presTemplate = document.getElementById("presTemplate");
        for (let i = 0; i < data.length; ++i) {
            let name = presTemplate.content.querySelectorAll("p")[0];
            let date = presTemplate.content.querySelectorAll("p")[1];

            name.innerHTML = data[i].name;
            date.innerHTML = data[i].date;
            let div = presTemplate.content.cloneNode(true);

            if (data[i].presentation.slides.length > 0) {
                let slide = data[i].presentation.slides[0].slide;


                //preview
                const presPreview = div.firstElementChild.children[0];
                presPreview.classList.add(data[i].presentation.theme);
                const titleTemplate = document.getElementById("titleSlide");
                const txtAndImgTemplate = document.getElementById("txtAndImgTemplate");
                const listSlideTemplate = document.getElementById("listSlideTemplate");

                let previewDiv;
                if (slide.type === "title") {
                    previewDiv = loadSlideOnTemplateAndClone(titleTemplate, slide);
                } else if (slide.type === "txtAndImg") {
                    previewDiv = loadSlideOnTemplateAndClone(txtAndImgTemplate, slide);
                } else if (slide.type === "listSlide") {
                    previewDiv = loadSlideOnTemplateAndClone(listSlideTemplate, slide);
                }
                presPreview.appendChild(previewDiv);
            }
            let deleteBtn = div.firstElementChild.children[2].children[0];


            deleteBtn.addEventListener("click", evt => {
                presID = data[i].id;
                delPresModal.style.display = "block";
            });

            let cancelPresBtn = document.getElementById("cancelPresBtn");
            cancelPresBtn.addEventListener("click", evt => {
                delPresModal.style.display = "none";
            });
            let closeDelModal = delPresModal.querySelector("span");
            closeDelModal.onclick = function () {
                delPresModal.style.display = "none";
            };
            let closeShareModal = shareModal.querySelector('span');
            closeShareModal.onclick = function () {
                shareModal.style.display = "none";
            };

            let editbtn = div.firstElementChild.children[2].children[1];
            editbtn.addEventListener('click', function (evt) {
                window.location.href = "editmode.html?id=" + data[i].id;
            });

            let viewbtn = div.firstElementChild.children[2].children[2];
            viewbtn.addEventListener('click', function (evt) {
                window.location.href = "viewmode.html?id=" + data[i].id;
            });

            let sharebtn = div.firstElementChild.children[2].children[3];
            if(data[i].visibility === 1){
                sharebtn.innerHTML = "Share";
            }else if(data[i].visibility === 2){
                sharebtn.innerHTML = "Unshare";
            }
            let urlout = document.getElementById("urlout");
            console.log(data[i].visibility);
            urlout.href = "https://presentation-tool-2019.herokuapp.com/viewmode.html?id=" + data[i].id;
            urlout.innerHTML = "https://presentation-tool-2019.herokuapp.com/viewmode.html?id=" + data[i].id;
            sharebtn.addEventListener("click", async evt => {
                presID = data[i].id;
                let id = presID;
                let url = "https://presentation-tool-2019.herokuapp.com/presentations/visibility/" + id;
                let newVisibility = data[i].visibility === 1 ? {visibility: 2} : {visibility: 1};
                console.log(data[i].visibility);
                let cfg = {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": token
                    },
                    body:JSON.stringify(newVisibility)
                };
                try {
                    let resp = await fetch(url, cfg);
                    let payload = await resp.json();
                    console.log(payload.msg);
                    data[i].visibility = newVisibility.visibility;

                    if(data[i].visibility === 1){
                        sharebtn.innerHTML = "Share";
                        shareModal.style.display = "none";
                    }else if(data[i].visibility === 2){
                        sharebtn.innerHTML = "Unshare";
                        shareModal.style.display = "block";
                    }
                } catch (err) {
                    console.log(err);
                }
            });
            presListCont.appendChild(div);
            }
        }catch (err){
            console.log(err);
        }
}

deletePresBtn.addEventListener('click', async evt => {
    let url = "https://presentation-tool-2019.herokuapp.com/presentations/" + presID;

    let cfg = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "authorization": token
        }
    };

    try {
        let resp = await fetch(url, cfg);
        let data = await resp.json();
        delPresModal.style.display ="none";
        await listPresentations();
    } catch (err) {
        console.log(err);
    }
});


