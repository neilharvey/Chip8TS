import assert from 'assert';
import '../src/hex.js';

describe('Number#toHex', () => {

    it('converts number to hex value', () => {

        assert.strictEqual(0xF.toHex(), "f");
        assert.strictEqual(0x0F.toHex(), "f");
        assert.strictEqual(0xF0.toHex(), "f0");

    });

    it('left pads with zeros', () => {

        assert.strictEqual(0xF.toHex(), "f");
        assert.strictEqual(0x0F.toHex(2), "0f");
        assert.strictEqual(0x00E0.toHex(4), "00e0");

    });

});