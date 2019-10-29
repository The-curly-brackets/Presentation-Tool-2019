const presListCont = document.getElementById("presListCont");

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

for(let i = 0; i<10; i++){
    presListItem("My Presentation", "29.10.19", "");
}
