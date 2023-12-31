export const camelToTitle = (text: string) => {
    const split = text.replace(/([A-Z])/g, ' $1');
    return split.charAt(0).toUpperCase() + split.slice(1);
};

export const camelString = (str: string) => {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }
  