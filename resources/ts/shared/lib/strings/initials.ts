export function nameInitials(name: string): string {
    let words = name.split(' ');
    if (words.length > 1) {
        words = words.map((word) => word.charAt(0));
    }

    return words.join('').slice(0, 2);
}
