declare module 'react-awesome-lightbox' {
    import { ComponentType } from 'react';
    type Image = string | { url: string; title: string };
    export interface LightboxProps {
        // URL to the image to show while in single image mode
        image?: string;
        // Title to show with the single image
        title?: string;
        // Takes an array of image and starts the lightbox in multi image mode. *If you supply both image and images prop, image is ignored. supported formats : ["url1","url2"...] or [{url"url",title:"title"}...]
        images?: Image[];
        // If the lightbox is in multiple image mode, the starting image index
        startIndex?: number;
        // Step for zoom in or zoom out,1 means 100% so, default 0.3 means 30%
        zoomStep?: number;
        // This function determines how to react when the close button is pressed
        onClose?: any;
        // Determines if image zoom controls should be shown
        allowZoom?: boolean;
        // Determine if image rotate controls should be shown
        allowRotate?: boolean;
        // Determine if reset buttons should be shown
        allowReset?: boolean;
        // Determine how to align the toolbar buttons options are: flex-end, flex-start, center
        buttonAlign?: 'flex-end' | 'flex-start' | 'center';
        // Determines if title should be shown if available keyboardInteraction true Determine if keyboard shortcuts will be allowed See below section for available Shortcuts
        showTitle?: boolean;
        // Determine how much to zoom in if double clicked. default 4 means close to 400%. Setting it to 0 will disable double click double tap zoom
        doubleClickZoom?: number;
    }

    const Lightbox: ComponentType<LightboxProps>;

    export default Lightbox;
}
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


declare module '*.css' {
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
