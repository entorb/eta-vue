export const getLocalStorageDataFistLastRowItems = () => {
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
