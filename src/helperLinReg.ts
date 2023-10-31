// LinReg on time series data
export const helperLinReg = (
  data: Array<{ date: Date; items: number }>,
  weighted: boolean = false
): { slope: number; intercept: number } => {
  // handling of bad data -> return slope = 0
  const n = data.length
  if (n <= 1) {
    return { slope: 0, intercept: 0 }
  }
  const { seconds: X, items: Y } = calculateXAndY(data)
  if (n == 2) {
    const dX = X[1] - X[0]
    const dY = Y[1] - Y[0]
    if (dX == 0) {
      return { slope: 0, intercept: 0 }
    }
    return { slope: dY / dX, intercept: Y[0] - (dY / dX) * X[0] }
  }
  if (weighted == false) {
    return calculateLinearRegression(X, Y)
  } else {
    return calculateWeightedLinearRegression(X, Y)
  }
}

// this converts Date to Timestamp in sec and subtracts the first timestamp from all others
export const calculateXAndY = (
  data: Array<{ date: Date; items: number }>
): { seconds: number[]; items: number[] } => {
  const Y = data.map(point => point.items)
  const Xms = data.map(point => point.date.getTime()) // timestamp in ms
  const firstTimestamp = Xms[0]
  const X = Xms.map(timestamp => (timestamp - firstTimestamp) / 1000)
  return { seconds: X, items: Y }
}

export const calculateLinearRegression = (
  X: number[],
  Y: number[]
): { slope: number; intercept: number } => {
  const n = X.length

  let sumX = 0
  let sumY = 0
  for (let i = 0; i < n; i++) {
    sumX += X[i]
    sumY += Y[i]
  }
  const avgX = sumX / n
  const avgY = sumY / n

  const xDifferencesToAverage = X.map(value => avgX - value)
  const yDifferencesToAverage = Y.map(value => avgY - value)
  const xDifferencesToAverageSquared = xDifferencesToAverage.map(value => value ** 2)
  const xAndYDifferencesMultiplied = xDifferencesToAverage.map(
    (curr, index) => curr * yDifferencesToAverage[index]
  )
  const denominator = xDifferencesToAverageSquared.reduce((prev, curr) => prev + curr, 0)
  const numerator = xAndYDifferencesMultiplied.reduce((prev, curr) => prev + curr, 0)

  const slope = numerator / denominator
  const intercept = avgY - slope * avgX
  return { slope, intercept }
}

export const calculateWeightedLinearRegression = (
  X: number[],
  Y: number[]
): { slope: number; intercept: number } => {
  const n = X.length

  let sumXw = 0
  let sumYw = 0
  let sumWeight = 0
  for (let i = 0; i < n; i++) {
    const weight = i + 1
    sumWeight += weight
    sumXw += X[i] * weight
    sumYw += Y[i] * weight
  }

  const avgXw = sumXw / sumWeight
  const avgYw = sumYw / sumWeight

  let numerator = 0
  let denominator = 0
  for (let i = 0; i < n; i++) {
    const weight = i + 1
    numerator += weight * (X[i] - avgXw) * (Y[i] - avgYw)
    denominator += weight * (X[i] - avgXw) ** 2
  }

  const slope = numerator / denominator
  const intercept = avgYw - slope * avgXw
  return { slope, intercept }
}
