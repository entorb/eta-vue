import type { DataRowRedType, StatsDataType } from './types'

export const helperDateToString = (datetime: Date, showDays = false): string => {
  const options: Intl.DateTimeFormatOptions = {
    hour12: undefined,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }
  if (showDays) {
    options.second = undefined
    options.day = '2-digit'
    options.month = '2-digit'
  }
  return datetime.toLocaleString('de-DE', options)
}

export const helperDateToIsoString = (date: Date): string => {
  const pad = (n: number) => n.toString().padStart(2, '0')
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  const seconds = pad(date.getSeconds())
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
}

export const helperSecondsToString = (totalSeconds: number): string => {
  const rounded = Math.round(totalSeconds)
  const days = Math.floor(rounded / 86_400)
  const hours = Math.floor((rounded % 86_400) / 3600)
  const minutes = Math.floor((rounded % 3600) / 60)
  const seconds = rounded % 60

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  if (minutes >= 15) {
    return `${minutes}m`
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  }
  return `${seconds}s`
}

// validate input of items
export const helperValidateItemsInput = (inputStr: string): boolean => {
  const items = Number.parseFloat(inputStr.replace(',', '.'))
  return !Number.isNaN(items)
}

// used at StatsTable and TooltipSpeed
export const helperValueToString = (value: number): string => {
  if (value < 100) {
    return value.toPrecision(3)
  }
  return value.toFixed(0)
}

export const helperCalcSpeedFromPreviousRow = (
  row: DataRowRedType,
  prevRow: DataRowRedType
): number => {
  const deltaT = (row.date.getTime() - prevRow.date.getTime()) / 1000
  const deltaItems = row.items - prevRow.items
  return deltaItems / deltaT
}

/* c8 ignore next 6 */
export const helperPlaySoundTimerDone = () => {
  // playSound(notificationSound)
  // hardcoded to file in public dir instead of assets, since the latter results in hashed filenames (bad for caching upon app update)
  playSound('audio/481151__matrixxx__cow-bells-01.mp3')
}

/* c8 ignore next 4 */
function playSound(url: string) {
  const audio = new Audio(url)
  audio.play()
}

// for multi-timer recent timers
export const helperClearName = (name: string): string => {
  return name.replace(/[/|\\:"'{}[\]()]+/g, '').trim()
}

export const helperStatsDataRead = async (origin: string): Promise<StatsDataType | undefined> => {
  try {
    const url = `https://entorb.net/web-stats-json.php?origin=${origin}&action=read`
    const response = await fetch(url)
    if (response.ok) {
      return await response.json()
    }
    return undefined
  } catch {
    return undefined
  }
}

export const helperStatsDataWrite = async (origin: string) => {
  try {
    const url = `https://entorb.net/web-stats-json.php?origin=${origin}&action=write`
    await fetch(url)
  } catch {
    // Silently fail - stats are not critical
  }
}

export const helperRunningOnProd = () => {
  const currentURL = globalThis.location.href
  return currentURL.startsWith('https://entorb.net/')
}

export const helperRunningOnMobile = () => {
  if (typeof globalThis === 'undefined' || typeof globalThis.matchMedia !== 'function') {
    return false
  }
  const mobileMediaQuery = globalThis.matchMedia('(max-width: 768px)')
  return mobileMediaQuery.matches
}
