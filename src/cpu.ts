import {Opcode} from './opcode.js';

export class Cpu {

    memory: Uint8Array = new Uint8Array(4096);
    pc: number = 0x200;

    constructor() {
        this.loadFontset();
    }

    loadRom(rom: Uint8Array) {
        this.reset();
        for (var i = 0; i < rom.length; i++) {
            this.memory[0x200 + i] = rom[i];
        }
    }

    tick() {

        // var opcode = FetchOpcode();
        // ExecuteInstruction(opcode);
        // UpdateDelayTimer();
        // UpdateSoundTimer();

    }

    private fetchOpcode():Opcode {
        return new Opcode(0,0);
    }

    private executeOpcode(opcode:Opcode) {

    }

    private updateDelayTimer() {

    }

    private updateSoundTimer() {

    }

    private reset() {
        this.memory = new Uint8Array(4096);
        this.pc = 0x200;
    }

    private loadFontset() {

        var fontset = new Uint8Array(
            [
                0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
                0x20, 0x60, 0x20, 0x20, 0x70, // 1
                0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
                0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
                0x90, 0x90, 0xF0, 0x10, 0x10, // 4
                0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
                0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
                0xF0, 0x10, 0x20, 0x40, 0x40, // 7
                0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
                0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
                0xF0, 0x90, 0xF0, 0x90, 0x90, // A
                0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
                0xF0, 0x80, 0x80, 0x80, 0xF0, // C
                0xE0, 0x90, 0x90, 0x90, 0xE0, // D
                0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
                0xF0, 0x80, 0xF0, 0x80, 0x80  // F
            ]);

        for (var i = 0; i < fontset.length; i++) {
            this.memory[i] = fontset[i];
        }

    }

}