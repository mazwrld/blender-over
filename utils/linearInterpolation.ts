export function linearInterpolation(
  initialValue: number,
  target: number,
  amount: number
) {
  return initialValue * (1 - amount) + target * amount
}
