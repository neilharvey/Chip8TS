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

        function assertOpcodeInstruction(value:number, instruction:string) {

            var msb = (value & 0xFF00) >> 8;
            var lsb = value & 0x00FF;

            var opcode = new Opcode(msb, lsb);

            assert.strictEqual(opcode.instruction(),instruction);
            
        }

        // Opcodes
        it('0x00E0 is CLS', () => assertOpcodeInstruction(0x00E0, 'CLS'));
        it('0x00EE is RET', () => assertOpcodeInstruction(0x00EE, 'RET'));
        it('0x1nnn is JP nnn', () => assertOpcodeInstruction(0x122A, 'JP 22a'));
        it('0x6xkk is LD Vx, kk', () => assertOpcodeInstruction(0x600C, 'LD V0, 0c'));
        it('0x7xkk is ADD Vx, kk', () => assertOpcodeInstruction(0x7009, 'ADD V0, 09'));
        it('0xAnnn is LD I, nnn', () => assertOpcodeInstruction(0xA22A, 'LD I, 22a'));
        it('0xDxyn is DRW Vx, Vy, n', () => assertOpcodeInstruction(0xD01F, 'DRW V0, V1, f'));

    });

});