export class Opcode {

    value:number;
    x:number;
    y:number;
    kk:number;
    n:number;
    nnn:number;

    constructor(msb:number, lsb:number) {
        this.value = msb << 8 | lsb;
        this.nnn = this.value & 0x0FFF;
        this.x = msb & 0x0F;
        this.y = (lsb & 0xF0) >> 4;
        this.kk = lsb;
        this.n = lsb & 0x0F;
    }
}