/**
 * Validates and sanitizes HTTP/HTTPS URLs to prevent javascript:, data:, or malformed URI injection.
 */
export function sanitizeHttpUrl(urlStr: string | null | undefined): string | null {
    if (!urlStr || typeof urlStr !== 'string') return null;
    const trimmed = urlStr.trim();
    try {
        const withProtocol = trimmed.startsWith('http://') || trimmed.startsWith('https://')
            ? trimmed
            : `https://${trimmed}`;
        const parsed = new URL(withProtocol);
        if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
            return parsed.toString();
        }
    } catch {
        return null;
    }
    return null;
}
