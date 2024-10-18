export function formatPriceNumber(number?: number): string {
    if (number == null) return '';

    const slipt: string[] = number.toString().split('.');
    if (slipt.length < 2) {
      slipt.push('00');
    }
    if (slipt[1].length < 2) {
      slipt[1] += '0';
    }
    return slipt.join(',');
}