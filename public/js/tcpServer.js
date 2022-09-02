const express = require("express");
const app = express();
const net = require("net");
const serverPort = 1500; 

// const host = "118.27.103.220";
const host = "192.168.3.4"

let ichigojams = [];
// [{IPaddress:***,socket:***}]
let appjs = "";

let isIPaddress = false;

exports.relayServer = (serverPort) => {

    const tcpServer = net.createServer((socket) => {
        
        let IPaddress = socket.remoteAddress.split(":")[3];
        // for(let i in ichigojams){
        //     if(IPaddress == ichigojams[i].IPADDRESS){
        //         isIPaddress = true;
        //     }
        // }

        if(IPaddress == host) {
            cliantType = "ブラウザ";
            appjs = socket;
            console.log(cliantType + " / " + IPaddress + ": 接続しました\n");
        }else{
            cliantType = "IchigoJam";
            let idx = ichigojams.length;
            ichigojams.push({"IPADDRESS":IPaddress,"SOCKET":socket});
            appjs.write(JSON.stringify(ichigojams));
                console.log("- " + cliantType + "[" + idx + "]" + " / " + ichigojams[idx].IPADDRESS + ": 接続しました\n");
        }
        //else{
        //     cliantType = "IchigoJam";
        //     let idx = ichigojams.length - 1;
        //     appjs.write(JSON.stringify(ichigojams));
        //         console.log("- " + cliantType + "[" + idx + "]" + " / " + ichigojams[idx].IPADDRESS + ": 再接続しました\n");
        // }

        socket.on("data" , (data) => {
            const DATA = data.toString();
            
            if(socket == appjs) {
                clientType = "ブラウザ";
            }else {
                cliantType = "IchigoJam";
                return true;
            }
            
            const IPaddress = JSON.parse(data).IPADDRESS.toString();
            const command = JSON.parse(data).COMMAND.toString();

            for(let i in ichigojams){
                if(ichigojams[i].IPADDRESS == IPaddress){
                    ichigojams[i].SOCKET.write(command);
                    console.log(cliantType + " => IchigoJam[" + [i] + "]/" + ichigojams[i].IPADDRESS + " > " + command + "\n");
                }
            }

        })
        
        //接続切断時
        socket.on("close" , () => {
            for(let i in ichigojams){
                if(socket == ichigojams[i].SOCKET){
                    console.log(cliantType + "[" + i + "]" + " / " + ichigojams[i].IPADDRESS + ": 切断しました");
                    ichigojams.splice(i,1);
                }
            }
        })

        //接続エラー時
        socket.on("error", function(err) {
            console.log("Error occured from connection: " + socket.remoteAddress + ":" + socket.remoteserverPort);
            console.log("Error: %s", err);
        });

    }).listen(serverPort,()=>console.log("listening on tcp server " + serverPort));

    return tcpServer;
}


// process.stdin.resume();

        // process.stdin.on('data', (data) => {
        // ichigojam[0].write(data);
        // });
