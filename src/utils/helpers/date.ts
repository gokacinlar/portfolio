import moment from "moment";

export function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
};

export function normalizeDateToDayMonthYear(input: string) {
    if (!input) return "Please provide date";

    const format: string = "DD-MM-YYYY";
    return moment(input).format(format);
}
