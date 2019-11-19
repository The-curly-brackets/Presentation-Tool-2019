const newPresBtn = document.getElementById("newPresBtn");
const presListCont = document.getElementById("presListCont");
const signoutBtn = document.getElementById("signoutBtn");
const editaccountBtn = document.getElementById("editaccountBtn");
const createPresBtn = document.getElementById("createPresBtn");
const presNameInp = document.getElementById("presNameInp");

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

let token = JSON.parse(sessionStorage.getItem("logindata")).token;

listPresentations();

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
    let name = presNameInp.value;
    let date = new Date();
    date = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();

    let updata =  {
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

async function listPresentations (preName, preDate, prePreview){
    let url = "http://localhost:8080/presentations/overview";
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

        console.log(data);

        if (!Array.isArray(data)) {
            data = [data];
        }

        const presTemplate = document.getElementById("presTemplate");
        for (let i = 0; i < data.length; ++i) {
            console.log(data[i]);
            let name = presTemplate.content.querySelectorAll("p")[0];
            let date = presTemplate.content.querySelectorAll("p")[1];

            name.innerHTML = data[i].name;
            date.innerHTML = data[i].date;

            let div = presTemplate.content.cloneNode(true);

            let editbtn = div.firstElementChild.children[2].children[0];
            editbtn.addEventListener('click', function (evt) {
                window.location.href = "editmode.html?id=" + data[i].id;
            });

            let viewbtn = div.firstElementChild.children[2].children[1];
            viewbtn.addEventListener('click', function (evt) {
                window.location.href = "viewmode.html?id=" + data[i].id;
            });

            let sharebtn = div.firstElementChild.children[2].children[2];
            sharebtn.addEventListener('click', function (evt) {
                //TODO
            });

            presListCont.appendChild(div);
        }
    }
    catch (err) {
        console.log(err);
    }


}
