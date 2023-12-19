export const camelToTitle = (text: string) => {
    const split = text.replace(/([A-Z])/g, ' $1');
    return split.charAt(0).toUpperCase() + split.slice(1);
};
