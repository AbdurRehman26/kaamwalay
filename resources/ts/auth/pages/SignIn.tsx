import React, { useCallback, useState } from 'react';

import { useAuth } from '@shared/hooks/useAuth';

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.comm>
 * @component: SignIn
 * @date: 09.08.2021
 * @time: 05:52
 */
export function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { login } = useAuth();

    const handleEmail = useCallback((e) => setEmail(e.target.value), [setEmail]);
    const handlePassword = useCallback((e) => setPassword(e.target.value), [setPassword]);
    const handleSubmit = useCallback(() => {
        login(email, password);
    }, [login, email, password]);

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder={'Email'} value={email} onChange={handleEmail} />
            <input type="password" placeholder={'Password'} value={password} onChange={handlePassword} />
            <button type={'submit'}>Login</button>
        </form>
    );
}

export default SignIn;
