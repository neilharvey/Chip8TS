import assert from 'assert';
import { Cpu } from '../src/cpu.js'

describe('CPU', () => {

    describe("constructor", () => {
        it('initialises registers', () => {
            let cpu = new Cpu();

            assert.strictEqual(0x200, cpu.pc);
            assert.strictEqual(4096, cpu.memory.length);
        });
    })

    describe("#loadRom()", () => {
        it("copies rom into program space", () => {

            let cpu = new Cpu();
            let rom = new Uint8Array([
                0x00, 0xE0, 0xA2, 0x2A
            ]);

            cpu.loadRom(rom);

            for(var i=0; i<rom.length; i++) {
                assert.strictEqual(rom[i], cpu.memory[0x200 + i]);
            }

        });

        it("resets registers", () => {

            let cpu = new Cpu();
            let rom = new Uint8Array([]);
            cpu.pc = 0x300;

            cpu.loadRom(rom);

            assert.strictEqual(0x200, cpu.pc);

        });
    })

});