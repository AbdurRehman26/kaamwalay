declare module '*.svg' {
    import { ComponentType, SVGAttributes } from 'react';
    const content: string;
    export const ReactComponent: ComponentType<SVGAttributes<SVGElement>>;
    export default content;
}

declare module '*.scss' {
    const content: Record<string, string>;
    export default content;
}

declare module '*.png' {
    const url: string;
    export default url;
}

declare module '*.jpg' {
    const url: string;
    export default url;
}
