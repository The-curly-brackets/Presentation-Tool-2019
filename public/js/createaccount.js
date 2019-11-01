const userNameInp = document.getElementById("createUsernameInp");
const emailInp = document.getElementById("emailInp");
const passwordInp = document.getElementById("createPasswordInp");
const createAccountBtn = document.getElementById("createAccountBtn");

createAccountBtn.addEventListener("click", async function (evt){
    
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
        
        if(resp.status > 200){
            throw(data);
        }
      
        sessionStorage.setItem("logindata", JSON.stringify(data));
        window.location.href = "../html/overview.html";
    }
    catch (err) {
        console.log(err);
    }
});
