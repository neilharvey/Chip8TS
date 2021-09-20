import { NullAudio } from "./audio.js";
import { Cpu } from "./cpu.js";
import { Debugger } from "./debugger.js";
import { CanvasDisplay } from "./display.js";

let display = new CanvasDisplay("display");
let audio = new NullAudio();
let cpu = new Cpu(display, audio);

function run() {

  setInterval(() => {
    cpu.tick();
    Debugger.bind(cpu);
  }, 10);

}

function loadRom(name: string) {

  let url = `roms/${name}.ch8`;

  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  request.onload = function () {
    var arrayBuffer = request.response;
    if (arrayBuffer) {
      var byteArray = new Uint8Array(arrayBuffer);
      cpu.loadRom(byteArray);
      run();
    }
  };

  request.send(null);
}

let stepButton = document.getElementById("btn-step");
stepButton?.addEventListener("click", () => {
  cpu.tick();
  Debugger.bind(cpu);
});

loadRom("IBM Logo");