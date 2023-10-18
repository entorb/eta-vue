export const helperDateToString = (datetime: Date, showDays: boolean = false): string => {
  const options: Intl.DateTimeFormatOptions = {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }
  if (showDays) {
    options.day = '2-digit'
    options.month = '2-digit'
    // options.year = "2-digit"; // year not needed
  }
  return datetime.toLocaleString('de-DE', options)
}
