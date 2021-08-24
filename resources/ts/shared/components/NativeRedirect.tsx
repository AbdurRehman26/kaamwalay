import { useEffect } from 'react';

interface NativeRedirectProps {
    to: string;
}

export function NativeRedirect({ to }: NativeRedirectProps) {
    useEffect(() => {
        window.location.replace(to);
    }, [to]);
    return null;
}
