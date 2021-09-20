import { Opcode } from './opcode.js';

export class Cpu {

    memory: Uint8Array = new Uint8Array(4096);
    pc: number = 0x200;
    i: number = 0;
    v: Uint8Array = new Uint8Array(8);
    sp: number = 0;
    s: Uint16Array = new Uint16Array(16);
    delay: number = 0;
    sound: number = 0;
    display: boolean[][] = [];

    constructor() {
        this.reset();
    }


    loadRom(rom: Uint8Array) {
        this.reset();
        for (var i = 0; i < rom.length; i++) {
            this.memory[0x200 + i] = rom[i];
        }
    }

    reset() {
        this.memory = new Uint8Array(4096);
        this.pc = 0x200;
        this.i = 0;
        this.v = new Uint8Array(16);
        this.sp = 0;
        this.s = new Uint16Array(16);
        this.delay = 0;
        this.sound = 0;
        this.loadFontset();

        this.display = [];

        for (let x = 0; x < 64; x++) {
            this.display[x] = [];
            for (let y = 0; y < 32; y++) {
                this.display[x][y] = false;
            }
        }

    }

    tick() {
        var opcode = this.fetchOpcode();
        this.executeOpcode(opcode);
        this.updateDelayTimer();
        this.updateSoundTimer();
    }

    fetchOpcode(): Opcode {

        let msb = this.memory[this.pc++];
        let lsb = this.memory[this.pc++];
        return new Opcode(msb, lsb);
    }

    executeOpcode(opcode: Opcode) {

        var mask = opcode.value & 0xF000;

        switch (mask) {
            case 0x0000:
                if (opcode.value == 0x00E0) {
                    return this.cls();
                } else if (opcode.value == 0x00EE) {
                    return this.ret();
                } else {
                    return;
                }
            case 0x1000:
                return this.jp(opcode.nnn);
            case 0x6000:
                return this.ld_v(opcode.x, opcode.kk);
            case 0x7000:
                return this.add_v(opcode.x, opcode.kk);
            case 0xA000:
                return this.ld_i(opcode.nnn);
            case 0xD000:
                return this.drw(opcode.x, opcode.y, opcode.n);
            default:
                return this.unhandled_opcode(opcode);
        }

    }

    cls() {

        for (let x = 0; x < 64; x++) {
            for (let y = 0; y < 32; y++) {
                this.display[x][y] = false;
            }
        }

        // redraw
    }

    ret() {

        this.sp--;
        this.pc = this.s[this.sp];

    }

    jp(nnn: number) {
        this.pc = nnn;
    }

    add_v(x: number, kk: number) {
        this.v[x] += kk;
    }

    drw(x: number, y: number, n: number) {

        let vx = this.v[x];
        let vy = this.v[y];
        this.v[0xF] = 0;

        for (var row = 0; row < n; row++) {

            var sprite = this.memory[this.i + row];

            for (var col = 0; col < 8; col++) {

                let px = (vx + col) % 64;
                let py = (vy + row) % 32;

                // Each bit in the sprite byte represents a pixel we want to render. 
                // We need to XOR the sprite pixel with the display pixel to 
                // determine the final value.
                let spritePixel = (sprite >> (7 - col)) & 1;
                let oldPixel = this.display[px][py] ? 1 : 0;
                let newPixel = oldPixel ^ spritePixel;

                this.display[px][py] = newPixel != 0;

                // When both pixels are true store the collision in V[F]
                if (oldPixel == 1 && spritePixel == 1) {
                    this.v[0xF] = 1;
                }
            }
        }
    }

    ld_i(nnn: number) {
        this.i = nnn;
    }

    ld_v(x: number, kk: number) {
        this.v[x] = kk;
    }

    updateDelayTimer() {
        this.delay--;
    }

    updateSoundTimer() {
        this.sound--;
    }

    loadFontset() {

        var fontset = new Uint8Array([
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

    unhandled_opcode(opcode: Opcode) {
        throw new Error(`Opcode ${opcode.value.toHex(4)} not implemented.`);
    }

}