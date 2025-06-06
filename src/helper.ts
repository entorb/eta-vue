import type { DataRowRedType, StatsDataType } from './types'

export const helperDateToString = (datetime: Date, showDays: boolean = false): string => {
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

// validate input of items
export const helperValidateItemsInput = (inputStr: string): boolean => {
  const items = parseFloat(inputStr.replace(',', '.'))
  return !isNaN(items)
}

// used at StatsTable and TooltipSpeed
export const helperValueToString = (value: number): string => {
  if (value < 100) {
    return value.toPrecision(3)
  } else {
    return value.toFixed(0)
  }
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
    const url = 'https://entorb.net/web-stats-json.php?origin=' + origin + '&action=read'
    const response = await fetch(url)
    if (response.ok) {
      const respData = await response.json()
      return respData
    } else {
      console.error('Failed to fetch stats data')
      return
    }
  } catch (error) {
    console.error('Error:', error)
    return
  }
}

export const helperStatsDataWrite = async (origin: string) => {
  try {
    const url = 'https://entorb.net/web-stats-json.php?origin=' + origin + '&action=write'
    const response = await fetch(url)
    if (!response.ok) {
      console.error('Failed to update stats data')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

export const helperRunningOnProd = () => {
  const currentURL = window.location.href
  if (currentURL.startsWith('https://entorb.net/')) {
    return true
  } else {
    return false
  }
}

export const helperRunningOnMobile = () => {
  const mobileMediaQuery = window.matchMedia('(max-width: 768px)')
  return mobileMediaQuery.matches
}
