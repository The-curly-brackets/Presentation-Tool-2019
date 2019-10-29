const userNameInp = document.getElementById("userNameInp");
const passwordInp = document.getElementById("passwordInp");
const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", async evt => {
            
    let url = "http://localhost:8080/users";
    let token = logindata.token;

    let updata =  {
        username: userNameInp.value,
        password: passwordInp.value
    }

    let cfg = {
        method: "POST",
        headers: {"authorization": token},
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