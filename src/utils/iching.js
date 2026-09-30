const TRIGRAM_NAMES = ['坤', '艮', '坎', '巽', '震', '离', '兑', '乾']
const LINE_NAMES = ['老阴', '少阳', '少阴', '老阳']

const KING_WEN_ORDER = {
  '7-7': 1,
  '0-0': 2,
  '2-4': 3,
  '1-2': 4,
  '2-7': 5,
  '7-2': 6,
  '0-2': 7,
  '2-0': 8,
  '3-7': 9,
  '7-6': 10,
  '0-7': 11,
  '7-0': 12,
  '7-5': 13,
  '5-7': 14,
  '0-1': 15,
  '4-0': 16,
  '6-4': 17,
  '1-3': 18,
  '0-6': 19,
  '3-0': 20,
  '5-4': 21,
  '1-5': 22,
  '1-0': 23,
  '0-4': 24,
  '7-4': 25,
  '1-7': 26,
  '1-4': 27,
  '6-3': 28,
  '2-2': 29,
  '5-5': 30,
  '6-1': 31,
  '4-3': 32,
  '7-1': 33,
  '4-7': 34,
  '5-0': 35,
  '0-5': 36,
  '3-5': 37,
  '5-6': 38,
  '2-1': 39,
  '4-2': 40,
  '1-6': 41,
  '3-4': 42,
  '6-7': 43,
  '7-3': 44,
  '6-0': 45,
  '0-3': 46,
  '6-2': 47,
  '2-3': 48,
  '6-5': 49,
  '5-3': 50,
  '4-4': 51,
  '1-1': 52,
  '3-1': 53,
  '4-6': 54,
  '4-5': 55,
  '5-1': 56,
  '3-3': 57,
  '6-6': 58,
  '3-2': 59,
  '2-6': 60,
  '3-6': 61,
  '4-1': 62,
  '2-5': 63,
  '5-2': 64,
}

function cryptoRandom() {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const arr = new Uint32Array(1)
    crypto.getRandomValues(arr)
    return arr[0] / 0x100000000
  }
  return Math.random()
}

export function tossCoins() {
  const coins = [cryptoRandom() < 0.5 ? 0 : 1, cryptoRandom() < 0.5 ? 0 : 1, cryptoRandom() < 0.5 ? 0 : 1]
  const sum = coins[0] + coins[1] + coins[2]
  return {
    coins,
    sum,
    name: LINE_NAMES[sum],
    changing: sum === 0 || sum === 3,
    value: sum === 0 || sum === 2 ? 0 : 1,
  }
}

export function getTrigramName(value) {
  return TRIGRAM_NAMES[value] || '未知'
}

export function getTrigramKey(lines) {
  const lowerTrigram = (lines[0].value << 0) | (lines[1].value << 1) | (lines[2].value << 2)
  const upperTrigram = (lines[3].value << 0) | (lines[4].value << 1) | (lines[5].value << 2)
  return `${upperTrigram}-${lowerTrigram}`
}

export function getHexagramKey(lines) {
  const trigramKey = getTrigramKey(lines)
  return String(KING_WEN_ORDER[trigramKey] ?? '')
}

export function lineValuesToHexagramKey(lineValues) {
  const lowerTrigram = (lineValues[0] << 0) | (lineValues[1] << 1) | (lineValues[2] << 2)
  const upperTrigram = (lineValues[3] << 0) | (lineValues[4] << 1) | (lineValues[5] << 2)
  const trigramKey = `${upperTrigram}-${lowerTrigram}`
  return String(KING_WEN_ORDER[trigramKey] ?? '')
}

const KING_WEN_REVERSE = Object.fromEntries(
  Object.entries(KING_WEN_ORDER).map(([k, v]) => [String(v), k])
)

export function hexagramKeyToLineValues(key) {
  const trigramKey = KING_WEN_REVERSE[String(key)]
  if (!trigramKey) return [0, 0, 0, 0, 0, 0]
  const [upperStr, lowerStr] = trigramKey.split('-')
  const upper = parseInt(upperStr, 10)
  const lower = parseInt(lowerStr, 10)
  return [
    (lower >> 0) & 1,
    (lower >> 1) & 1,
    (lower >> 2) & 1,
    (upper >> 0) & 1,
    (upper >> 1) & 1,
    (upper >> 2) & 1,
  ]
}

export function getChangingLines(lines) {
  const original = lines.map((l) => l.value)
  const changed = lines.map((l) => (l.changing ? (l.value === 0 ? 1 : 0) : l.value))
  return { original, changed }
}