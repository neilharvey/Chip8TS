import { Cpu } from "./cpu.js";

let cpu = new Cpu();

function loadRom(name:string) {

    let url = `roms/${name}.ch8`;

    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
    
    request.onload = function () {
      var arrayBuffer = request.response; 
      if (arrayBuffer) {
        var byteArray = new Uint8Array(arrayBuffer);
        cpu.loadRom(byteArray);
      }
    };
    
    request.send(null);

}

loadRom("IBM Logo");