import React, { useEffect } from 'react';

import { useInjectable } from '../hooks/useInjectable';
import { ConfigurationService } from '../services/ConfigurationService';

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.co>
 * @component: ConfigurationLoad
 * @date: 14.08.2021
 * @time: 02:36
 */
export function ConfigurationLoad() {
    const configurationService = useInjectable(ConfigurationService);
    useEffect(() => {
        // noinspection JSIgnoredPromiseFromCall
        configurationService.load();
    }, []);
    return null;
}

export default ConfigurationLoad;
