export const getEtaLocalStorageDataFistLastRowItems = () => {
  const stored = localStorage.getItem('eta_vue_data')
  const obj = JSON.parse(stored as string)
  const data = obj.map((row: { date: string; items: number }) => ({
    date: new Date(row.date),
    items: row.items
  }))
  const firstValue = data[0].items
  const lastValue = data[data.length - 1].items
  return { first: firstValue, last: lastValue }
}

export const getMTLocalStorageDataFistLastRowItems = () => {
  const stored = localStorage.getItem('eta_vue_multitimer')
  const obj = JSON.parse(stored as string)
  const data = obj.map((row: { name: string; dateEnd: string }) => ({
    name: row.name,
    dateEnd: new Date(row.dateEnd)
  }))
  const firstName = data[0].name
  const firstEnd = data[0].dateEnd
  const lastName = data[data.length - 1].name
  const lastEnd = data[data.length - 1].dateEnd
  return { firstName, firstEnd, lastName, lastEnd }
}
