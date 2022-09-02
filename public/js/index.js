const btns = document.getElementById("btns");
for(const c of [1,2,3,4,5,"RUN","ESC"]){
    const commandBtn = document.createElement("button");
    commandBtn.id = "commandBtn";
    commandBtn.textContent = c;
    commandBtn.type = "submit";
    commandBtn.name = "btnCommand";
    if(c == "ESC"){
        commandBtn.value = 27;    
    }else {
        commandBtn.value = c;
    }
    btns.appendChild(commandBtn);
}


const command = document.getElementById("command");
const IPaddress = document.getElementById("IPaddress");
const btn = document.getElementById("btn");

    
if(localStorage.getItem("sended_command")){
    command.innerHTML = localStorage.getItem("sended_command");
}
if(localStorage.getItem("ichigojam_IPaddress")){
    IPaddress.innerHTML = localStorage.getItem("ichigojam_IPaddress");
}

const save = () => {
    let ichigojam_IPadress = IPaddress.value;
    let sended_command = command.value;
    localStorage.setItem("ichigojam_IPaddress",ichigojam_IPadress);
    localStorage.setItem("sended_command",sended_command);
   
}

btn.onclick = () => {
    save();
    setTimeout(()=>command.value = "",2000);
}

