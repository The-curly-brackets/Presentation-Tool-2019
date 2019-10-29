const nameInp = document.getElementById("nameInp");
const emailInp = document.getElementById("emailInp");
const userNameInp = document.getElementById("createUsernameInp");
const passwordInp = document.getElementById("createPasswordInp");
const createAccountBtn = document.getElementById("createAccountBtn");

createAccountBtn.addEventListener("click", async function (evt){
    
    let url = "http://localhost:8080/users/auth";

    let updata =  {
        name: nameInp.value,
        email: emailInp.value,
        username: userNameInp.value,
        password: passwordInp.value
    }

    let cfg = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(updata)
    }

    try {
        let resp = await fetch(url, cfg);
        let data = await resp.json();
        
        if(resp.status >= 200){
            throw(data);
        };
        sessionStorage.setItem("logindata", JSON.stringify(data));
    }
    catch (err) {
        console.log(err);
    }
});
