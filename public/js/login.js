const userNameInp = document.getElementById("userNameInp");
const passwordInp = document.getElementById("passwordInp");
const loginBtn = document.getElementById("loginBtn");
const txtPswOut = document.getElementById("txtPswOut");

loginBtn.addEventListener("click", async evt => {
    if(!userNameInp.value || !passwordInp.value){
        txtPswOut.innerHTML = "Fill in username and password";
        return;
    }

    let url = "http://localhost:8080/users/login";

    let cfg = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic " + window.btoa(userNameInp.value + ":" + passwordInp.value)
        }
    };

    try {
        let resp = await fetch(url, cfg);
        let data = await resp.json();
        
        if(resp.status > 200){
            throw(data);
        };
        
        sessionStorage.setItem("logindata", JSON.stringify(data));
        window.location.href = "../html/overview.html";
    }
    catch (err) {
        txtPswOut.innerHTML = "Username or password is wrong";
        console.log(err);
    }

});

userNameInp.addEventListener('input', evt => txtPswOut.innerHTML = "");
passwordInp.addEventListener('input', evt => txtPswOut.innerHTML = "");