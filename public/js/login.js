const userNameInp = document.getElementById("userNameInp");
const passwordInp = document.getElementById("passwordInp");
const loginBtn = document.getElementById("loginBtn");
const txtPswOut = document.getElementById("txtPswOut");

loginBtn.addEventListener("click", async evt => {

            
    let url = "http://localhost:8080/users/login";

    let updata =  {
        username: userNameInp.value,
        password: passwordInp.value
    };

    let cfg = {
        method: "POST",
        headers: {"Content-Type": "application/json",
        "Authorization": "Basic " + window.btoa(userNameInp.value + ":" + passwordInp.value)},
    };

    try {
        let resp = await fetch(url, cfg);
        let data = await resp.json();
        
        if(resp.status > 200){
            throw(data);
        }
      
        txtPswOut.innerHTML = "";
        sessionStorage.setItem("logindata", JSON.stringify(data));
        window.location.href = "../html/overview.html";
    }
    catch (err) {
        txtPswOut.innerHTML = err.msg;
        console.log(err);
    }

});