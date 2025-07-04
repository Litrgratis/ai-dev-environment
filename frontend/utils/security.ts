export function isTokenValid(token: string): boolean {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 > Date.now();
    } catch {
        return false;
    }
}

export function isMFARequired(user: any): boolean {
    return !!user?.mfaRequired && !user?.mfaVerified;
}

// Example: trigger MFA prompt
export function promptMFA(onVerify: (code: string) => void) {
    const code = window.prompt('Enter your MFA code:');
    if (code) onVerify(code);
}
