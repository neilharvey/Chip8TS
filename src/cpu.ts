export class Cpu {

    memory: Uint8Array = new Uint8Array(4096);
    pc:number = 0x200;

    loadRom(rom:Uint8Array) {      
        this.reset();
        for(var i=0; i<rom.length;i++) {
            this.memory[0x200 + i] = rom[i];
        }
    }

    private reset() {
        this.memory = new Uint8Array(4096);
        this.pc = 0x200;
    }

}