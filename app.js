const express = require("express");
const app = express();
// const http = require("http");
// const server = http.createServer(app);
// const io = require("socket.io")(server);
const PORT = 3000;


app.use(express.static("public"));
app.use(express.urlencoded({ extended: false}));
 
//tcpServerとの接続
const relay = require("./public/js/tcpServer");
relay.relayServer(1500);
const net = require('net');
const client = new net.Socket();
const host = "192.168.3.4";
const tcpPort = "1500";

client.connect(tcpPort,host)

client.on("data" , (data) => {
    const ichigojams = JSON.parse(data);
    console.log("ichigojams",ichigojams[ichigojams.length - 1].IPADDRESS);
    app.set("authenticatedIchigoJams",ichigojams);
})

app.get("/", (req,res) => {
    res.sendFile(__dirname + "/index.html");
})

app.post("/", (req,res) => {
    let command = req.body.command;
    const btnCommand = req.body.btnCommand;
    console.log("btnCommand",btnCommand);
    if(btnCommand == "RUN"){
        command = btnCommand + "\n";
    }
    else if(btnCommand){
        command = String.fromCharCode(btnCommand);
    }
    const single = req.body.single;
    const newLine = req.body.newLine;
    if(single == "'"){
        command = "'" + command;
    }

    if(newLine == "↩︎"){
        command = command + "\n";
    }
    console.log("command",command);
    
    let IPaddress = req.body.IPaddress;

    const connectedIchigoJams = app.get("authenticatedIchigoJams");
    let auth = false;
    for(const i in connectedIchigoJams){
        if(IPaddress == connectedIchigoJams[i].IPADDRESS) {
            auth = true;
            console.log(IPaddress + ":IPアドレス認証に成功しました");
            client.write(JSON.stringify({"IPADDRESS":IPaddress,"COMMAND":command}));
            console.log("送信コマンド:" + command);
        }
    }
        
    if(!auth){
        console.log(IPaddress + "のIPアドレスと接続ができません。IchigoJamの接続を確認してください");
        res.sendFile(__dirname + "/error.html");
    }

    res.sendFile(__dirname + "/index.html");

})


app.listen(PORT,() => {
    console.log("listening on http server " + PORT);
})

