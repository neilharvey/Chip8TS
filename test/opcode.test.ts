import assert from 'assert';
import { Opcode } from '../src/opcode.js';

describe('Opcode', () => {

    describe('properties', () => {

        it('value is combined bytes', () => {

            var opcode = new Opcode(0x12, 0x34);

            assert.strictEqual(0x1234, opcode.value);
        });

        it('nnn is lowest 12 bits', () => {

            var opcode = new Opcode(0x24, 0x68);

            assert.strictEqual(0x468, opcode.nnn);
        });

        it('x is lower nibble of msb', () => {

            var opcode = new Opcode(0x31, 0x99);

            assert.strictEqual(1, opcode.x);
        });

        it('y is upper nibble of lsb', () => {

            var opcode = new Opcode(0x51, 0x20);

            assert.strictEqual(2, opcode.y);
        });

        it('n is lower nibble of lsb', () => {

            var opcode = new Opcode(0xD1, 0x24);

            assert.strictEqual(4, opcode.n);
        });

        it('kk is lsb', () => {

            var opcode = new Opcode(0x71, 0x77);

            assert.strictEqual(0x77, opcode.kk);
        });

    });

    describe('instruction', () => {

        let data = [
            ['00E0 is CLS', 0x00E0, 'CLS'],
            ['00EE is RET', 0x00EE, 'RET'],
            ['1nnn is JP nnn', 0x122A, 'JP 22a'],
            //['2nnn is CALL nnn', 0x123, 'CALL 123'],
            // ['3xkk is SE Vx, kk', 0x3123, 'SE V1 23'],
            // ['4xkk is SNE Vx, kk', 0x4123, 'SNE V1 23'],
            // ['5xy0 is SE Vx, Vy', 0x5120, 'SE V1 V2'],
            ['6xkk is LD Vx, kk', 0x600C, 'LD V0, 0c'],
            ['7xkk is ADD Vx, kk', 0x7009, 'ADD V0, 09'],
            // ['8xy0 is LD Vx, Vy', 0x8120, 'LD V1, V2'],
            // ['8xy1 is OR Vx, Vy', 0x8121, 'OR V1, V2'],
            // ['8xy2 is AND Vx, Vy', 0x8122, 'AND V1, V2'],
            // ['8xy3 is XOR Vx, Vy', 0x8123, 'XOR V1, V2'],
            // ['8xy4 is ADD Vx, Vy', 0x8124, 'ADD V1, V2'],
            // ['8xy5 is SUB Vx, Vy', 0x8125, 'SUB V1, V2'],
            // ['8xy6 is SHR Vx {, Vy}', 0x8126, 'SHR V1 {, V2}'],
            // ['8xy7 is SUBN Vx, Vy', 0x8127, 'SUBN V1, V2'],
            ['Annn is LD I, nnn', 0xA22A, 'LD I, 22a'],
            ['Dxyn is DRW Vx, Vy, n', 0xD01F, 'DRW V0, V1, f']
        ];

        data.forEach((item) => {

            let theory:string = <string>item[0];
            let value:number = <number>item[1];
            let instruction:string = <string>item[2];

            it(theory, () => {
                var msb = (value & 0xFF00) >> 8;
                var lsb = value & 0x00FF;
    
                var opcode = new Opcode(msb, lsb);
    
                assert.strictEqual(opcode.instruction(), instruction);
            });
        });
    });

});