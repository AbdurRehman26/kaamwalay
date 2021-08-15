import { useEffect } from 'react';
import { useAuth } from '@shared/hooks/useAuth';

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.co>
 * @component: AuthenticationCheck
 * @date: 09.08.2021
 * @time: 06:35
 */
export function AuthenticationCheck() {
    const { authCheck } = useAuth();
    useEffect(
        () => {
            authCheck();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );
    return null;
}

export default AuthenticationCheck;
