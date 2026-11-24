export function formatDatePeriod(dateStr: string | null): string {
    if (!dateStr) return 'Present';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Present';
    
    // Use UTC methods to prevent local timezone shifts (e.g., UTC midnight becoming the previous evening locally)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();
    
    return `${month} ${year}`;
}

export function formatDateYearOnly(dateStr: string | null): string {
    if (!dateStr) return 'Present';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Present';
    return String(date.getUTCFullYear());
}
