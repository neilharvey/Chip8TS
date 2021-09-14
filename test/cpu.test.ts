import assert from 'assert';
import {Cpu} from '../src/cpu.js'

describe('CPU', () => {

    it('should initialise registers', () => {
        let cpu = new Cpu();
    
        assert.strictEqual(0x200, cpu.pc);
        assert.strictEqual(4096, cpu.memory.length);
    });
    
});