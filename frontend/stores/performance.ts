import { makeAutoObservable } from 'mobx';

class PerformanceStore {
    cpu: number = 0;
    memory: number = 0;
    executionTime: number = 0;

    constructor() {
        makeAutoObservable(this);
    }

    setCpu(cpu: number) {
        this.cpu = cpu;
    }

    setMemory(memory: number) {
        this.memory = memory;
    }

    setExecutionTime(time: number) {
        this.executionTime = time;
    }
}

export const performanceStore = new PerformanceStore();
