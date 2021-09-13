export class Cpu {

    memory: Uint8Array;

    constructor() {
        this.memory = new Uint8Array(4096);
    }

    loadRom(rom:Uint8Array) {
        console.log(rom.length);
    }

}