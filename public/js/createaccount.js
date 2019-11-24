const userNameInp = document.getElementById("createUsernameInp");
const emailInp = document.getElementById("emailInp");
const passwordInp = document.getElementById("createPasswordInp");
const confirmPasswordInp = document.getElementById("confirmPasswordInp");
const createAccountBtn = document.getElementById("createAccountBtn");
const txtOut = document.getElementById("txtOut");

txtOut.style.color = "red";

emailInp.addEventListener("input", evt => txtOut.innerHTML = "");
userNameInp.addEventListener("input", evt => txtOut.innerHTML = "");


createAccountBtn.addEventListener("click", evt => {
    let regx = /^[^\s]+@[^\s]+\.[A-Za-z]{2,5}$/;
    let match = regx.test(emailInp.value);
    
    if(!emailInp.value || !userNameInp.value || !passwordInp.value || !confirmPasswordInp.value){
        txtOut.innerHTML = "All the fields need to be filled out";
        txtOut.style.visibility = "visible";
        return;
    }
    
    if(!match){
        txtOut.innerHTML = "Not a valid email";
        txtOut.style.visibility = "visible";
        return;
    }

    if(userNameInp.value.length < 4){
        txtOut.innerHTML = "The username must be four characters or more";
        txtOut.style.visibility = "visible";
        return;
    }

    if(passwordInp.value.length < 4){
        txtOut.innerHTML = "The password must be four characters or more";
        txtOut.style.visibility = "visible";
        return;
    }
    
    if(passwordInp.value !== confirmPasswordInp.value) {
        txtOut.innerHTML = "The passwords does not match";
        txtOut.style.visibility = "visible";
        return;
    }
    
    createAccount();
});

async function createAccount (){
    let url = "http://localhost:8080/users/";

    let updata =  {
        username: userNameInp.value,
        email: emailInp.value,
        password: passwordInp.value
    };

    let cfg = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(updata)
    };

    try {
        let resp = await fetch(url, cfg);
        let data = await resp.json();

        if (resp.status > 200) {
            throw(data);
        }

        sessionStorage.setItem("logindata", JSON.stringify(data));
        window.location.href = "../html/overview.html";
    } catch (err) {
        console.log(err);
    }
}
