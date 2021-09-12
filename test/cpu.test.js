"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cpu_1 = require("../src/cpu");
test('cpu intialises fields correctly', function () {
    var cpu = new cpu_1.Cpu();
    expect(cpu.memory.length).toBe(4096);
});
