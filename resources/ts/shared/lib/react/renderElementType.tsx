import { ElementType, ReactElement } from 'react';
import { isElement, isLazy, isMemo } from 'react-is';

type ElementTypeProps<T> = T extends ElementType<infer P> ? P : never;
export function renderElementType<T extends ElementType | ReactElement>(
    Children: T,
    props?: ElementTypeProps<T>,
): ReactElement {
    if (isMemo(Children) || isLazy(Children) || !isElement(Children)) {
        const Component: ElementType = Children;
        return <Component {...(props || {})} />;
    }

    return {
        ...Children,
        props: {
            ...Children.props,
            ...(props || {}),
        },
    };
}
