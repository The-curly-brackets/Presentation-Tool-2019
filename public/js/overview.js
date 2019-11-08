const newPresBtn = document.getElementById("newPresBtn");
const presListCont = document.getElementById("presListCont");
const signoutBtn = document.getElementById("signoutBtn");

newPresBtn.addEventListener('click', async evt => {

    let url = "http://localhost:8080/presentations/newPresentation";

    let updata =  {
        name: "",
        date: "",
        theme: "",
        slides: []
    }

    let cfg = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(updata)
    }

    try {
        let resp = await fetch(url, cfg);
        let data = await resp.json();
        
        localStorage.setItem("presentation", JSON.stringify(data));
        window.location.href = "../html/editmode.html";
    }
    catch (err) {
        console.log(err);
    }
    
    
})

signoutBtn.addEventListener('click', evt => {
    sessionStorage.clear();
    window.location.href = "../html/login.html";
})

function presListItem(preName, preDate, prePreview){
    
    let preObj = {
        name: preName,
        date: preDate,
        preview: prePreview
    }

    let presFrame = document.createElement("div");
    presFrame.className = "presFrame";

    let presPreviewFrame = document.createElement("div");
    presPreviewFrame.className = "presPreview";
    presPreviewFrame.style.backgroundColor = "white";
    presPreviewFrame.style.border = "1px solid black";
    presPreviewFrame.style.height = "80px";
    presPreviewFrame.style.width = "130px";

    let html = `
        <p id="presName" style="font-weight: bold">${preObj.name}</p>
        <p id="presDate">${preObj.date}</p>`;
    let div = document.createElement("div");
    div.className = "presInfoDiv";
    div.innerHTML = html;

    let editPresBtn = document.createElement("a");
    editPresBtn.innerText = "Edit";

    let viewPresBtn = document.createElement("a");
    viewPresBtn.innerText = "View";

    let sharePresBtn = document.createElement("a");
    sharePresBtn.innerText = "Share";

    let toolBtnDiv = document.createElement("div");
    toolBtnDiv.className = "toolBtnDiv";
    toolBtnDiv.appendChild(editPresBtn);
    toolBtnDiv.appendChild(viewPresBtn);
    toolBtnDiv.appendChild(sharePresBtn);

    presFrame.appendChild(presPreviewFrame);
    presFrame.appendChild(div);
    presFrame.appendChild(toolBtnDiv);
    
    presListCont.appendChild(presFrame);
}

for(let i = 0; i<1; i++){
    presListItem("My Presentation", "29.10.19", "");
}
