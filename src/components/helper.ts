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

export const helperSecondsToString = (totalSeconds: number): string => {
  totalSeconds = Math.round(totalSeconds)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else if (minutes >= 15) {
    return `${minutes}m`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  } else {
    return `${seconds}s`
  }
}