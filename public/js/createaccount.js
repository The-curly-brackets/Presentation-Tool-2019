const userNameInp = document.getElementById("createUsernameInp");
const emailInp = document.getElementById("emailInp");
const passwordInp = document.getElementById("createPasswordInp");
const confirmPasswordInp = document.getElementById("confirmPasswordInp");
const createAccountBtn = document.getElementById("createAccountBtn");
const txtOut = document.getElementById("txtOut");

createAccountBtn.addEventListener("click", evt => {
    if(passwordInp.value !== confirmPasswordInp.value) {
        txtOut.innerHTML = "The passwords does not match";
        txtOut.style.color = "red";
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
