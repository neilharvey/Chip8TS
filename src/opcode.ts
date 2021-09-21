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

        let mask = this.value & 0xF000;

        switch (mask) {
            case 0x0000:
                switch(this.kk) {
                    case 0xE0:
                        return "CLS";
                    case 0xEE:
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
                    case 0x0:
                        return `LD V${this.x}, V${this.y}`;
                    case 0x1:
                        return `OR V${this.x}, V${this.y}`;
                    case 0x2:
                        return `AND V${this.x}, V${this.y}`;
                    case 0x3:
                        return `XOR V${this.x}, V${this.y}`;
                    case 0x4:
                        return `ADD V${this.x}, V${this.y}`;                    
                    case 0x5:
                        return `SUB V${this.x}, V${this.y}`;
                    case 0x6:
                        return `SHR V${this.x}, V${this.y}`;
                    case 0x7:
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
            case 0xE000:
                switch(this.kk) {
                    case 0x9E:
                        return `SKP V${this.x}`;
                    case 0xA1:
                        return `SKNP V${this.x}`;
                }
                break;
            case 0xF000:
                switch(this.kk) {
                    case 0x07:
                        return `LD V${this.x}, DT`;
                    case 0x0A:
                        return `LD V${this.x}, K`;
                    case 0x15:
                        return `LD DT, V${this.x}`;
                    case 0x18:
                        return `LD ST, V${this.x}`;
                    case 0x1E:
                        return `ADD I, V${this.x}`;
                    case 0x29:
                        return `LD F, V${this.x}`;
                    case 0x33:
                        return `LD B, V${this.x}`;
                    case 0x55:
                        return `LD [I], V${this.x}`;
                    case 0x65:
                        return `LD V${this.x}, [I]`;
                }
                break;
        }

        return "";
    }
}