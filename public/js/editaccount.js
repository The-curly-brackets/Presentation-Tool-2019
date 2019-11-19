const changeUsernameInp = document.getElementById("changeUsernameInp");
const changeEmailInp = document.getElementById("changeEmailInp");
const changePasswordInp = document.getElementById("changePasswordInp");
const confirmPasswordInp = document.getElementById("confirmPasswordInp");
const saveChangesBtn = document.getElementById("saveChangesBtn");
const deleteAccountBtn = document.getElementById("deleteAccountBtn");
const txtOut = document.getElementById("txtOut");
const overviewBtn = document.getElementById("overviewBtn");
const signoutBtn = document.getElementById("signoutBtn");

const deleteModal = document.getElementById("deleteModal");
const closeModal = document.getElementsByClassName("close")[0];
const modalPsw = document.getElementById("modalPsw");
const modalDeleteBtn = document.getElementById("modalDeleteBtn");

let token = JSON.parse(sessionStorage.getItem("logindata")).token;
let newAccountInfo = {};
getUserInfo();

changeUsernameInp.addEventListener('input', evt => {
    newAccountInfo.username = changeUsernameInp.value;
    hidetxtOut();
});

changeEmailInp.addEventListener('input', evt => {
    newAccountInfo.email = changeEmailInp.value;
    hidetxtOut();
});

changePasswordInp.addEventListener('input', hidetxtOut);
confirmPasswordInp.addEventListener('input', hidetxtOut);

function checkPasswordMath(){
    if(changePasswordInp.value === confirmPasswordInp.value){
        newAccountInfo.password = changePasswordInp.value;
        return true;
    }else{
        return false;
    }
}

function hidetxtOut(){
    txtOut.style.visibility = "hidden";
}

async function getUserInfo(){

    let url = `http://localhost:8080/users/`
    
    let cfg = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "authorization": token
        },
    }

    try {
        let resp = await fetch(url, cfg);
        let data = await resp.json();

        changeEmailInp.value = data.email;
        changeUsernameInp.value = data.username;
    }
    catch (err) {
        console.log(err);
    }
    
}

signoutBtn.addEventListener('click', evt => {
    sessionStorage.clear();
    window.location.href = "login.html";
})

overviewBtn.addEventListener("click", evt => window.location.href = "overview.html");

saveChangesBtn.addEventListener("click", async evt => {
    
    let url = `http://localhost:8080/users/`;

    if(changePasswordInp.value === confirmPasswordInp.value){
        txtOut.style.visibility = "hidden";

        if(changePasswordInp.value){
            newAccountInfo.password = changePasswordInp.value;
        }

        let cfg = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            },
            body: JSON.stringify(newAccountInfo)
        }

        try { 
            let resp = await fetch(url, cfg);
            let data = await resp.json();

            console.log(resp.status);

            if (resp.status == 200){
                txtOut.innerHTML = "Saved changes";
                txtOut.style.visibility = "visible";
                txtOut.style.color = "green";
            }else if(resp.status == 404){
                txtOut.innerHTML = data.msg;
                txtOut.style.visibility = "visible";
                txtOut.style.color = "red";
            }else if(resp.status == 500){
                txtOut.innerHTML = "Not able to save changes";
                txtOut.style.visibility = "visible";
                txtOut.style.color = "red";
            }
            
            if(resp.status > 200){
                throw(data);
            };
        }
        catch (err) {
            console.log(err);
        }

    }else{
        txtOut.style.color = "red";
        txtOut.innerHTML = "Password's does not match.";
        txtOut.style.visibility = "visible";
    }
    
});

deleteAccountBtn.addEventListener("click", evt => {
    deleteModal.style.display = "block";
});

closeModal.onclick = function() {
    deleteModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == deleteModal) {
        deleteModal.style.display = "none";
    }
}

modalDeleteBtn.addEventListener("click", async evt => {
    if(modalPsw.value){
        let url = `http://localhost:8080/users/`;

        let cfg = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            }
        }
       
        try{
            let resp = await fetch(url, cfg);
            let data = await resp.json();
            
            if(resp.status == 200){
                sessionStorage.clear()
                window.location.href = "login.html";
            }else{
                console.log(data);
            }
        }
        catch (err) {
            console.log(err);
        }
    }
});
