const newPresBtn = document.getElementById("newPresBtn");
const presListCont = document.getElementById("presListCont");
const signoutBtn = document.getElementById("signoutBtn");
const editaccountBtn = document.getElementById("editaccountBtn");
const createPresBtn = document.getElementById("createPresBtn");

const newPresModal = document.getElementById("newPresModal");
const closeModal = document.getElementsByClassName("close")[0];
const basicTheme = document.getElementById("basicTheme").addEventListener("click", selectTheme);
const modernTheme = document.getElementById("modernTheme").addEventListener("click", selectTheme);
const traditionalTheme = document.getElementById("traditionalTheme").addEventListener("click", selectTheme);

let lastTheme = basicTheme;
let theme = "basic";

function selectTheme(evt){
    
    if(lastTheme){
        lastTheme.style.border = "1px solid black";
    }
    
    theme = evt.target.innerHTML;
    evt.target.style.border = "1px solid #2f71e3";
    lastTheme = evt.target;
}

listPresentations("My Presentation", "16.11.19", "");

let token = JSON.parse(sessionStorage.getItem("logindata")).token;

editaccountBtn.addEventListener("click", evt => window.location.href = "editaccount.html");

newPresBtn.addEventListener('click', evt => {
    newPresModal.style.display = "block";
});

closeModal.onclick = function() {
    newPresModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == newPresModal) {
        newPresModal.style.display = "none";
    }
}

createPresBtn.addEventListener('click', async evt => {

    let url = "http://localhost:8080/presentations/";

    let updata =  {
        name: "",
        date: "",
        theme: theme,
        slides: []
    }

    let cfg = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "authorization": token
        },
        body: JSON.stringify(updata)
    }

    try {
        let resp = await fetch(url, cfg);
        let data = await resp.json();
        Object.assign(updata, data);
        localStorage.setItem("presentation", JSON.stringify(updata));

        window.location.href = "editmode.html";
    }
    catch (err) {
        console.log(err);
    }
    
});

signoutBtn.addEventListener('click', evt => {
    sessionStorage.clear();
    window.location.href = "../html/login.html";
});

function listPresentations (preName, preDate, prePreview){
    let presTemplate = document.getElementById("presTemplate");
    let name = presTemplate.content.querySelectorAll("p")[0];
    let date = presTemplate.content.querySelectorAll("p")[1];

    name.innerHTML = preName;
    date.innerHTML = preDate;
    
    let editbtn = presTemplate.content.querySelectorAll("a")[0];
    let viewbtn = presTemplate.content.querySelectorAll("a")[1];
    let sharebtn = presTemplate.content.querySelectorAll("a")[2];
    
    let div = presTemplate.content.cloneNode(true);
    presListCont.appendChild(div);
}

document.body.addEventListener("click", evt => {
    if(evt.target.innerHTML == "View"){
        window.location.href = "viewmode.html"
    }
});
