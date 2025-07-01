// src/utils/sokoban.js

export const tileSize = 48

export const pixelStyle = {
  width: `${tileSize}px`,
  height: `${tileSize}px`,
  fontSize: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1.5px solid #222',
  boxSizing: 'border-box',
}

// Màn 1: Sokoban classic
export const mapData1 = [
  ['#', '#', '#', '#', '#', '#'],
  ['#', '.', '.', 'B', '.', '#'],
  ['#', '.', '#', '.', '.', '#'],
  ['#', 'P', '.', '.', 'C', '#'],
  ['#', '#', '#', '#', '#', '#'],
]

// Màn 2: Thêm monster "M"
export const mapData2 = [
  ['T', 'T', 'T', 'T', '#', '#', '#', '#', '#', '#'],
  ['#', '#', '#', '#', '#', '.', '.', '.', '.', '#'],
  ['#', '.', '.', '.', '.', '.', '#', 'B', '.', '#'],
  ['#', 'P', 'B', '.', '#', '.', '.', 'B', '.', '#'],
  ['#', '.', '.', '.', '#', '#', '#', 'B', '.', '#'],
  ['#', '#', '#', '#', '#', '#', '#', '.', '#', '#'],
  ['T', 'T', 'T', 'T', 'T', '#', '.', '.', '.', '#'],
  ['T', 'K', 'T', 'T', 'T', '#', '.', '.', '.', '#'],
  ['T', 'T', 'T', 'T', 'T', '#', 'B', '.', 'B', '#'],
  ['T', 'T', 'K', 'T', 'T', '#', '.', '.', '.', '#'],
  ['T', 'T', 'T', 'T', 'T', '#', '.', '#', '.', '#'],
  ['T', 'K', 'T', 'T', 'T', '#', 'C', '.', 'M', '#'],
  ['T', 'T', 'T', 'T', 'T', '#', '#', '#', '#', '#']
];

// Clone 2d array
export function clone2d(arr) {
  return arr.map((row) => [...row])
}

// Tìm vị trí đầu tiên của 1 ký tự
export function findPos(map, char) {
  for (let y = 0; y < map.length; y++)
    for (let x = 0; x < map[y].length; x++) if (map[y][x] === char) return { x, y }
  return null
}

// Tìm tất cả vị trí của 1 ký tự
export function findAllPos(map, char) {
  const res = []
  for (let y = 0; y < map.length; y++)
    for (let x = 0; x < map[y].length; x++) if (map[y][x] === char) res.push({ x, y })
  return res
}
