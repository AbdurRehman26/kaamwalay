export function googleTagManager(event: any) {
    // @ts-ignore
    if (window.dataLayer) {
        // @ts-ignore
        window.dataLayer.push(event);
    }
}
