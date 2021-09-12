import { Cpu } from "../src/cpu";

test('cpu intialises fields correctly', () => {

    let cpu = new Cpu();

    expect(cpu.memory.length).toBe(4096);

});