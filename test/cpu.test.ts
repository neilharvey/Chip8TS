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

            for (var i = 0; i < rom.length; i++) {
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

    describe('#tick()', () => {
        it("fetches and executes next opcode", () => {

            let cpu = new Cpu();

            // CLS
            cpu.memory[0x200] = 0x00;
            cpu.memory[0x201] = 0xE0;
            cpu.screen[0][0] = true;

            cpu.tick();

            assert.strictEqual(0x202, cpu.pc);
            assert.strictEqual(false, cpu.screen[0][0]);
        });

        it("decrements delay timer", () => {

            let cpu = new Cpu();
            cpu.delay = 10;
            cpu.memory[0x200] = 0x00;
            cpu.memory[0x201] = 0xE0;

            cpu.tick();

            assert.strictEqual(9, cpu.delay);
        });

        it("decrements sound timer", () => {

            let cpu = new Cpu();
            cpu.sound = 5;
            cpu.memory[0x200] = 0x00;
            cpu.memory[0x201] = 0xE0;

            cpu.tick();

            assert.strictEqual(4, cpu.sound);
        });
    });

    describe('#reset()', () => {
        it("clears all registers and memory", () => {

            let cpu = new Cpu();
            cpu.pc = 0x300;
            cpu.v[0] = 1;
            cpu.memory[0x0]
            cpu.screen[0][0] = true;

            cpu.reset();

            assert.strictEqual(0x200, cpu.pc);
            assert.strictEqual(0, cpu.v[0]);
            assert.strictEqual(false, cpu.screen[0][0]);
        });
    });

    describe("#cls()", () => {
        it("clears the display", () => {

            let cpu = new Cpu();

            cpu.screen[0][0] = true;
            cpu.screen[63][31] = true;

            cpu.cls();

            assert.strictEqual(cpu.screen[0][0], false);
            assert.strictEqual(cpu.screen[63][31], false);
        })
    });

    describe("#jp(nnn)", () => {
        it("sets pc to nnn", () => {

            let cpu = new Cpu();

            cpu.jp(0x400);

            assert.strictEqual(cpu.pc, 0x400);
        });
    });

    describe("#ret()", () => {
        it("pops stack and sets to pc", () => {

            let cpu = new Cpu();

            // CALL 0x400
            cpu.s[0] = 0x200;
            cpu.sp = 1;
            cpu.pc = 0x400;

            cpu.ret();

            assert.strictEqual(cpu.pc, 0x200);
            assert.strictEqual(cpu.sp, 0);
        });
    });

    describe("#ld_v(x,kk)", () => {
        it("sets v[x] to kk", () => {

            let cpu = new Cpu();

            cpu.ld_v(8, 0x99);

            assert.strictEqual(cpu.v[8], 0x99);
        });
    });

    describe("#ld_i(nnn)", () => {
        it("sets i to nnn", () => {

            let cpu = new Cpu();

            cpu.ld_i(0x456);

            assert.strictEqual(cpu.i, 0x456);
        })
    });

    describe("#ld_st(kk)", () => {
        it("sets st to kk", () => {
            let cpu = new Cpu();

            cpu.ld_st(0xF);

            assert.strictEqual(cpu.sound, 0xF);
        })
    });

    describe("#se(x,y)", () => {
        it("skips next instruction if x=y", () => {
            let cpu = new Cpu();
            let pc = cpu.pc;

            cpu.se(0x12, 0x12);

            assert.strictEqual(cpu.pc, pc + 2);
        });
    });

    describe("#sne(x,y)", () => {
        it("skips next instruction if x!=y", () => {
            let cpu = new Cpu();
            let pc = cpu.pc;

            cpu.sne(0x12, 0x34);

            assert.strictEqual(cpu.pc, pc + 2);
        })
    });

    describe("#add(x,kk)", () => {

        it("adds kk to v[x]", () => {

            let cpu = new Cpu();
            cpu.v[0] = 0x01;

            cpu.add(0, 0x01);

            assert.strictEqual(cpu.v[0], 0x02);
        });

        it("does not set v[f] when sum > 0xFF", () => {

            let cpu = new Cpu();
            cpu.v[0] = 0xCC;

            cpu.add(0, 0xCC);

            assert.strictEqual(cpu.v[0], 0x98);
            assert.strictEqual(cpu.v[0xF], 0);
        });

    });

    describe("#add_v(x,kk)", () => {

        it("adds kk to v[x]", () => {

            let cpu = new Cpu();
            cpu.v[0] = 0x01;

            cpu.add(0, 0x01);

            assert.strictEqual(cpu.v[0], 0x02);
            assert.strictEqual(cpu.v[0xF], 0);
        });

        it("sets v[f] to carry", () => {

            let cpu = new Cpu();
            cpu.v[0] = 0xCC;

            cpu.add_v(0, 0xCC);

            assert.strictEqual(cpu.v[0], 0x99);
            assert.strictEqual(cpu.v[0xF], 1);
        });

    });

});