export const getLocalStorageDataFistLastValue = () => {
  const stored = localStorage.getItem('eta_vue_data')
  const obj = JSON.parse(stored as string)
  const data = obj.map((item: { date: string; value: number }) => ({
    date: new Date(item.date),
    value: item.value
  }))
  const firstValue = data[0].value
  const lastValue = data[data.length - 1].value
  return { first: firstValue, last: lastValue }
}
