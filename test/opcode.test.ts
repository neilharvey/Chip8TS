import assert from 'assert';
import { Opcode } from '../src/opcode.js';

describe('Opcode', () => {

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