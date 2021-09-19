import { Cpu } from "./cpu.js";
import { Opcode } from "./opcode.js"

export abstract class Debugger {

    static bind(cpu: Cpu) {

        this.bindRegister(cpu.pc, "pc");

        for (var i = 0; i < 8; i++) {
            var addr = (cpu.pc + (2 * i));
            var opcode = new Opcode(cpu.memory[addr], cpu.memory[addr + 1]);
            this.bindMemory(addr, opcode, `m${i}`);
        }

    }

    private static bindRegister(value: number, id: string) {
        var element = document.getElementById(id);
        if (element != null) {
            element.innerText = `0x${value.toString(16)}`;
        }
    }

    private static bindMemory(addr: number, opcode: Opcode, id: string) {

        var row = <HTMLTableRowElement>document.getElementById(id);
        row.cells[0].innerText = `0x${addr.toString(16)}`;
        row.cells[1].innerText = opcode.value.toString(16);
        row.cells[2].innerText = opcode.instruction();

    }
}