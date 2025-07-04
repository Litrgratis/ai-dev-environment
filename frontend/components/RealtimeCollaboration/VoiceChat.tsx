import React from 'react';

type VoiceChatProps = {
    onToggle: () => void;
    enabled: boolean;
};

export const VoiceChat: React.FC<VoiceChatProps> = ({ onToggle, enabled }) => (
    <button onClick={onToggle}>
        {enabled ? 'Disable Voice Chat' : 'Enable Voice Chat'}
    </button>
);
