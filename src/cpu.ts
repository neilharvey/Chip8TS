import { Opcode } from './opcode.js';
import { Audio, NullAudio } from './audio.js';
import { Display, NullDisplay } from './display.js';

export class Cpu {

    readonly display: Display;
    readonly audio: Audio;

    memory: Uint8Array = new Uint8Array(4096);
    pc: number = 0x200;
    i: number = 0;
    v: Uint8Array = new Uint8Array(8);
    sp: number = 0;
    s: Uint16Array = new Uint16Array(16);
    dt: number = 0;
    st: number = 0;
    screen: boolean[][] = [];

    constructor(display: Display = new NullDisplay(), audio: Audio = new NullAudio()) {
        this.display = display;
        this.audio = audio;
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
        this.dt = 0;
        this.st = 0;
        this.loadFontset();

        this.screen = [];

        for (let x = 0; x < 64; x++) {
            this.screen[x] = [];
            for (let y = 0; y < 32; y++) {
                this.screen[x][y] = false;
            }
        }

    }

    tick() {
        var opcode = this.fetchOpcode();
        this.executeOpcode(opcode);
        this.updateDelayTimer();
        this.updateSoundTimer();
    }

    updateDelayTimer() {
        if (this.dt > 0) {
            this.dt--;
        }
    }

    updateSoundTimer() {
        if (this.st > 0) {
            this.st--;
        }
    }

    fetchOpcode(): Opcode {

        let msb = this.memory[this.pc++];
        let lsb = this.memory[this.pc++];
        return new Opcode(msb, lsb);
    }

    executeOpcode(opcode: Opcode) {

        let mask = opcode.value & 0xF000;

        let vx = this.v[opcode.x];
        let vy = this.v[opcode.y];

        switch (mask) {
            case 0x0000:
                switch (opcode.kk) {
                    case 0xE0:
                        return this.cls();
                    case 0xEE:
                        return this.ret();
                }
                break;
            case 0x1000:
                return this.jp(opcode.nnn);
            case 0x2000:
                return this.call(opcode.nnn);
            case 0x3000:
                return this.se(vx, opcode.kk);
            case 0x4000:
                return this.sne(vx, opcode.kk);
            case 0x5000:
                return this.se(vx, vy);
            case 0x6000:
                return this.ld_v(opcode.x, opcode.kk);
            case 0x7000:
                return this.add_v(opcode.x, opcode.kk);
            case 0x8000:
                switch (opcode.n) {
                    case 0x0:
                        return this.ld_v(opcode.x, vy);
                    case 0x1:
                        return this.or(opcode.x, opcode.y);
                    case 0x2:
                        return this.and(opcode.x, opcode.y);
                    case 0x3:
                        return this.xor(opcode.x,  opcode.y);
                    case 0x4:
                        return this.add(opcode.x, opcode.y);
                    case 0x5:
                        return this.sub(opcode.x, opcode.y);
                    case 0x6:
                        return this.shr(opcode.x);
                    case 0x7:
                        return this.subn(opcode.x, opcode.y);
                    case 0xE:
                        return this.shl(opcode.x);
                }
                break;
            case 0x9000:
                return this.sne(vx, vy);
            case 0xA000:
                return this.ld_i(opcode.nnn);
            case 0xB000:
                return this.jp(this.v[0] + opcode.nnn);
            case 0xC000:
                return this.rnd(opcode.x, opcode.kk);
            case 0xD000:
                return this.drw(opcode.x, opcode.y, opcode.n);
            case 0xE000:
                switch (opcode.kk) {
                    case 0x9E:
                        return this.skp(vx);
                    case 0xA1:
                        return this.sknp(vx);
                }
                break;
            case 0xF000:
                switch (opcode.kk) {
                    case 0x07:
                        return this.ld_v(opcode.x, this.dt);
                    case 0x0A:
                        return this.ld_v_k(opcode.x);
                    case 0x15:
                        return this.ld_dt(vx);
                    case 0x18:
                        return this.ld_st(vx);
                    case 0x1E:
                        return this.add_i(vx);
                    case 0x29:
                        return this.ld_i_spr(opcode.x);
                    case 0x33:
                        return this.ld_bcd_v(opcode.x);
                    case 0x55:
                        return this.ld_i_v();
                    case 0x65:
                        return this.ld_v_i();
                }
                break;
        }

        return this.unhandled_opcode(opcode);
    }

    // display

    cls() {

        for (let x = 0; x < 64; x++) {
            for (let y = 0; y < 32; y++) {
                this.screen[x][y] = false;
            }
        }

        this.display.render(this.screen);
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
                let oldPixel = this.screen[px][py] ? 1 : 0;
                let newPixel = oldPixel ^ spritePixel;

                this.screen[px][py] = newPixel != 0;

                // When both pixels are true store the collision in V[F]
                if (oldPixel == 1 && spritePixel == 1) {
                    this.v[0xF] = 1;
                }
            }
        }

        this.display.render(this.screen);
    }

    // flow

    call(addr: number) {
        this.s[this.sp] = this.pc;
        this.sp++;
        this.pc = addr;
    }

    ret() {
        this.sp--;
        this.pc = this.s[this.sp];
    }

    jp(addr: number) {
        this.pc = addr;
    }

    // cond

    se(x: number, y: number) {
        if (x === y) {
            this.pc += 2;
        }
    }

    sne(x: number, y: number) {
        if (x !== y) {
            this.pc += 2;
        }
    }

    // math

    add_v(x: number, kk: number) {
        this.v[x] = this.v[x] + kk % 0xFF;
    }

    add(x: number, y: number) {
        let value = this.v[x] + this.v[y];
        this.v[x] = value % 0xFF;
        this.v[0xf] = value > 0xFF ? 1 : 0;
    }

    sub(x: number, y: number) {
        let value = this.v[x] - this.v[y];
        this.v[0xf] = value < 0 ? 1 : 0;
        this.v[x] = value % 0xFF;
    }

    subn(x: number, y: number) {
        let value = this.v[y] - this.v[x];
        this.v[0xf] = this.v[y] > this.v[x] ? 1 : 0;
        this.v[x] = value % 0xFF;
    }

    rnd(x: number, kk: number) {
        throw new Error('Method not implemented.');
    }

    // bitwise

    and(x: number, y: number) {
        this.v[x] = this.v[x] & this.v[y]; 
    }

    or(x: number, y: number) {
        this.v[x] = this.v[x] | this.v[y];
    }

    xor(x: number, y: number) {
        this.v[x] = this.v[x] ^ this.v[y];
    }

    shl(x: number) {
        this.v[0xf] = this.v[x] >> 7;
        this.v[x] = this.v[x] << 1;
    }

    shr(x: number) {
        this.v[0xf] = this.v[x] & 0x01;
        this.v[x] = this.v[x] >> 1;
    }

    // memory

    ld_i(nnn: number) {
        this.i = nnn;
    }

    ld_v(x: number, kk: number) {
        this.v[x] = kk;
    }

    ld_st(kk: number) {
        this.st = kk;
    }

    ld_dt(kk: number) {
        this.dt = kk;
    }

    ld_bcd_v(x: number) {
        throw new Error('Method not implemented.');
    }

    ld_i_spr(x: number) {
        throw new Error('Method not implemented.');
    }

    ld_i_addr(kk: number) {
        throw new Error('Method not implemented.');
    }

    add_i(kk: number) {
        throw new Error('Method not implemented.');
    }

    ld_v_i() {
        throw new Error('Method not implemented.');
    }

    ld_i_v() {
        throw new Error('Method not implemented.');
    }

    // keypad

    sknp(k: number) {
        throw new Error('Method not implemented.');
    }

    skp(k: number) {
        throw new Error('Method not implemented.');
    }

    ld_v_k(x: number) {
        throw new Error('Method not implemented.');
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