import { makeAutoObservable } from 'mobx';

class CollaborationStore {
    cursors: any[] = [];
    value: string = '';
    voiceEnabled: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    setCursors(cursors: any[]) {
        this.cursors = cursors;
    }

    setValue(value: string) {
        this.value = value;
    }

    setVoiceEnabled(enabled: boolean) {
        this.voiceEnabled = enabled;
    }
}

export const collaborationStore = new CollaborationStore();
