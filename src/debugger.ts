import { Cpu } from "./cpu.js";

class Debugger {

    bind(cpu: Cpu) {

        this.bindRegister(cpu.pc, "pc");

        for (var i = 0; i < 8; i++) {

            var addr = (cpu.pc + (2 * i));
            var opcode = `${cpu.memory[addr]} ${cpu.memory[addr + 1]}`;
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

    private getInstruction(opcode:string):string {
        return ""
    }

}