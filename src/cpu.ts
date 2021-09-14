export class Cpu {

    memory: Uint8Array;
    pc:number;

    constructor() {
        this.memory = new Uint8Array(4096);
        this.pc = 0x200;
    }

    loadRom(rom:Uint8Array) {
        console.log(rom.length);
    }

}