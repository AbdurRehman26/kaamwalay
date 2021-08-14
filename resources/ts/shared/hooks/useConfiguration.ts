import { plainToClass } from 'class-transformer';
import { useMemo } from 'react';

import { ConfigurationEntity } from '../entities/ConfigurationEntity';
import { useSharedSelector } from './useSharedDispatch';

export function useConfiguration() {
    const config = useSharedSelector((state) => state.configuration.data);
    return useMemo(() => plainToClass(ConfigurationEntity, config), [config]);
}
