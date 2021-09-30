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
            cpu.dt = 10;
            cpu.memory[0x200] = 0x00;
            cpu.memory[0x201] = 0xE0;

            cpu.tick();

            assert.strictEqual(9, cpu.dt);
        });

        it("decrements sound timer", () => {

            let cpu = new Cpu();
            cpu.st = 5;
            cpu.memory[0x200] = 0x00;
            cpu.memory[0x201] = 0xE0;

            cpu.tick();

            assert.strictEqual(4, cpu.st);
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


    describe("#call(addr)", () => {
        it("pushes pc to stack then sets pc to addr", () => {

            let cpu = new Cpu();

            cpu.call(0x234);

            assert.strictEqual(cpu.sp, 1);
            assert.strictEqual(cpu.s[0], 0x200);
            assert.strictEqual(cpu.pc, 0x234);
        });
    })

    describe("#jp(addr)", () => {
        it("sets pc to addr", () => {

            let cpu = new Cpu();

            cpu.jp(0x400);

            assert.strictEqual(cpu.pc, 0x400);
        });
    });

    describe("#ret()", () => {
        it("pops stack and sets to pc", () => {

            let cpu = new Cpu();

            cpu.call(0x400);
            cpu.ret();

            assert.strictEqual(cpu.pc, 0x200);
            assert.strictEqual(cpu.sp, 0);
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

            assert.strictEqual(cpu.st, 0xF);
        })
    });

    describe("#ld_dt(kk)", () => {
        it("sets dt to kk", () => {
            let cpu = new Cpu();

            cpu.ld_dt(0x8);

            assert.strictEqual(cpu.dt, 0x8);
        });
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

    describe("#add_v(x, kk)", () => {

        it("adds kk to v[x]", () => {

            let cpu = new Cpu();
            cpu.v[0] = 0x01;

            cpu.add_v(0, 0x01);

            assert.strictEqual(cpu.v[0], 0x02);
            assert.strictEqual(cpu.v[0xF], 0);
        });

        it("sets v[f] to 1 when result is greater than 0xFF", () => {

            let cpu = new Cpu();
            cpu.v[0] = 0xCC;

            cpu.add_v(0, 0xCC);
            assert.strictEqual(cpu.v[0], 0x99);
            assert.strictEqual(cpu.v[0xF], 1);
        });

    });

    describe("#sub_v(x, y)", () => {

        it("subtracts v[y] from v[x]", () => {
            let cpu = new Cpu();
            cpu.v[8] = 0x08;
            cpu.v[9] = 0x05;

            cpu.sub_v(8, 9);

            assert.strictEqual(cpu.v[8], 0x03);
            assert.strictEqual(cpu.v[0xf], 0);
        });

        it("sets v[f] to 1 when result is negative", () => {
            let cpu = new Cpu();
            cpu.v[8] = 0x08;
            cpu.v[9] = 0x09;

            cpu.sub_v(8, 9);

            assert.strictEqual(cpu.v[8], 0xFF);
            assert.strictEqual(cpu.v[0xf], 1);
        });

    });

    describe("#subn_v(x, y)", () => {

        it("substracts v[x] from v[y] and v[f] to 1 when no carry", () => {
            let cpu = new Cpu();
            cpu.v[0] = 0xFE;
            cpu.v[1] = 0xFF;

            cpu.subn_v(0, 1);

            assert.strictEqual(cpu.v[0], 0x01);
            assert.strictEqual(cpu.v[0xF], 1);
        });

        it("sets v[f] to 0 when carry", () => {
            let cpu = new Cpu();
            cpu.v[0] = 0xFF;
            cpu.v[1] = 0xFE

            cpu.subn_v(0, 1);

            assert.strictEqual(cpu.v[0], 0xFF);
            assert.strictEqual(cpu.v[0xF], 0);
        });

    });

    describe("#and_v(x, y)", () => {

        it("sets v[x] to bitwise AND of v[x] and v[y]", () => {

            let cpu = new Cpu();
            cpu.v[0] = 0b1111_0000;
            cpu.v[1] = 0b0011_0011;
            let expt = 0b0011_0000;

            cpu.and_v(0, 1);
            
            assert.strictEqual(cpu.v[0].toString(2), expt.toString(2));

        });

    });

});