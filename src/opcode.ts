import './hex.js';

export class Opcode {

    value: number;
    x: number;
    y: number;
    kk: number;
    n: number;
    nnn: number;

    constructor(msb: number, lsb: number) {
        this.value = msb << 8 | lsb;
        this.nnn = this.value & 0x0FFF;
        this.x = msb & 0x0F;
        this.y = (lsb & 0xF0) >> 4;
        this.kk = lsb;
        this.n = lsb & 0x0F;
    }

    instruction(): string {

        var mask = this.value & 0xF000;

        switch (mask) {
            case 0x0000:
                if (this.value == 0x00E0) {
                    return "CLS";
                } else if (this.value == 0x00EE) {
                    return "RET";
                } else {
                    return "";
                }
            case 0x1000:
                return `JP ${this.nnn.toHex(3)}`;
            case 0x6000:
                return `LD V${this.x}, ${this.kk.toHex(2)}`;
            case 0x7000:
                return `ADD V${this.x}, ${this.kk.toHex(2)}`;
            case 0xA000:
                return `LD I, ${this.nnn.toHex(3)}`;
            case 0xD000:
                return `DRW V${this.x}, V${this.y}, ${this.n.toHex(1)}`;
        }

        return "Unknown";
    }
}