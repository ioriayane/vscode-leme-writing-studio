export function getNonce(): string {
    return (
        new Date().getTime().toString(16) + '-'
        + Math.floor(10000 * Math.random()).toString(16)
    );
}