import { makeAutoObservable } from 'mobx';

class AIContextStore {
    context = '';
    model = 'gpt-4';

    constructor() {
        makeAutoObservable(this);
    }

    setContext(context: string) {
        this.context = context;
    }

    setModel(model: string) {
        this.model = model;
    }
}

export const aiContextStore = new AIContextStore();
