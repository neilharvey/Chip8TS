import { Cpu } from "./cpu.js";
import { Opcode } from "./opcode.js"

class Debugger {

    bind(cpu: Cpu) {

        this.bindRegister(cpu.pc, "pc");

        for (var i = 0; i < 8; i++) {

            var addr = (cpu.pc + (2 * i));
            var opcode = new Opcode(cpu.memory[addr], cpu.memory[addr + 1]);
            var instruction = this.getInstruction(opcode);
            // this.bindRegister(addr, opcode, instruction, `m${i}`)
        }

    }

    private bindRegister(value: any, id: string) {
        var element = document.getElementById(id);
        if (element != null) {
            element.innerText = value;
        }
    }

    private bindMemory(addr: number, opcode: string, instruction: string, id: string) {

    }

    private getInstruction(opcode:Opcode):string {
        switch(opcode.value & 0xF000)
        {
            default:
                return "???";
        }
    }
}