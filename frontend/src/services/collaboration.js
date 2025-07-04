import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';

export class CollaborationService {
    constructor() {
        this.websocket = new WebSocket('ws://localhost:8000/ws');
        this.yjs = new Y.Doc();
        this.provider = new WebsocketProvider('ws://localhost:8000', 'room', this.yjs);
    }

    setupRealtimeEditing(editor) {
        const yText = this.yjs.getText('monaco');
        const binding = new MonacoBinding(yText, editor.getModel(), new Set([editor]));
        return binding;
    }
}
