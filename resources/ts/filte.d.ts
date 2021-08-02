declare module '*.svg' {
    import { SVGAttributes } from 'react';
    const content: string;
    export const ReactComponent: React.ComponentType<SVGAttributes<SVGElement>>;
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
