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
                } 

                break;
            case 0x1000:
                return `JP ${this.nnn.toHex(3)}`;
            case 0x2000:
                return `CALL ${this.nnn.toHex(3)}`;
            case 0x3000:
                return `SE V${this.x} ${this.kk.toHex(2)}`;
            case 0x4000:
                return `SNE V${this.x} ${this.kk.toHex(2)}`;
            case 0x5000:
                return `SE V${this.x} V${this.y}`;
            case 0x6000:
                return `LD V${this.x}, ${this.kk.toHex(2)}`;
            case 0x7000:
                return `ADD V${this.x}, ${this.kk.toHex(2)}`;
            case 0x8000:
                switch(this.n) {
                    case 0:
                        return `LD V${this.x}, V${this.y}`;
                    case 1:
                        return `OR V${this.x}, V${this.y}`;
                    case 2:
                        return `AND V${this.x}, V${this.y}`;
                    case 3:
                        return `XOR V${this.x}, V${this.y}`;
                    case 4:
                        return `ADD V${this.x}, V${this.y}`;                    
                    case 5:
                        return `SUB V${this.x}, V${this.y}`;
                    case 6:
                        return `SHR V${this.x}, V${this.y}`;
                    case 7:
                        return `SUBN V${this.x}, V${this.y}`;
                    case 0xE:
                        return `SHL V${this.x}, V${this.y}`;
                    }
                break;
            case 0x9000:
                return `SNE V${this.x}, V${this.y}`;
            case 0xA000:
                return `LD I, ${this.nnn.toHex(3)}`;
            case 0xB000:
                return `JP V0, ${this.nnn.toHex(3)}`;
            case 0xC000:
                return `RND V${this.x} ${this.kk.toHex(2)}`;
            case 0xD000:
                return `DRW V${this.x}, V${this.y}, ${this.n.toHex(1)}`;
        }

        return "";
    }
}