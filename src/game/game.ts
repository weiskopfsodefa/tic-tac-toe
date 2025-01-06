import type { Game, Move } from 'boardgame.io'
import { INVALID_MOVE } from 'boardgame.io/core'

export type GameState = {
  cells: (string | null)[]
  availableStones: {
    [key: string]: { 0: number; 1: number; 2: number }
  }
}

function IsVictory(cells: (string | null)[]) {
  const positions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  const isRowComplete = (row: number[]) => {
    const symbols = row.map((i) => cells[i]?.split('-')[0] ?? null)
    console.log(symbols)
    return symbols.every((i) => i !== null && i === symbols[0])
  }

  return positions.map(isRowComplete).some((i) => i === true)
}

// Return true if all `cells` are occupied.
function IsDraw(G: GameState) {
  return (
    Object.values(G.availableStones['0']).every((i) => i === 0) &&
    Object.values(G.availableStones['1']).every((i) => i === 0)
  )
}

const move: Move<GameState> = ({ G, ctx }, id, value: '0' | '1' | '2') => {
  if (G.availableStones[ctx.currentPlayer][value] === 0) {
    return INVALID_MOVE
  }
  if (G.cells[id] !== null) {
    const stoneSize = G.cells[id].split('-')[1]
    if (stoneSize === null) {
      return INVALID_MOVE
    }
    if (stoneSize >= value) {
      return INVALID_MOVE
    }
  }
  G.cells[id] = `${ctx.currentPlayer}-${value}`
  G.availableStones[ctx.currentPlayer][value] -= 1
}
export const TicTacToe: Game<GameState> = {
  setup: () => {
    return {
      cells: Array(9).fill(null),
      availableStones: {
        0: { 0: 4, 1: 3, 2: 2 },
        1: { 0: 4, 1: 3, 2: 2 },
      },
    }
  },
  turn: {
    minMoves: 1,
    maxMoves: 1,
  },
  moves: {
    clickCell: move,
  },
  endIf: ({ G, ctx }) => {
    if (IsVictory(G.cells)) {
      return { winner: ctx.currentPlayer }
    }
    if (IsDraw(G)) {
      return { draw: true }
    }
  },
  ai: {
    enumerate: (G, ctx) => {
      const allSizes = ['0', '1', '2'] as ('0' | '1' | '2')[]
      const allCells = Array(9)
        .fill(null)
        .map((_, i) => i)
      const allMoves = allSizes.flatMap((size) =>
        allCells.map((cell) => ({ size, cell }))
      )

      const validMoves = allMoves.filter((move) => {
        const value = move.size
        const id = move.cell

        if (G.availableStones[ctx.currentPlayer][value] === 0) {
          return false
        }
        if (G.cells[id] !== null) {
          const stoneSize = G.cells[id].split('-')[1]
          if (stoneSize === null) {
            return false
          }
          if (stoneSize >= value) {
            return false
          }
        }
        return true
      })

      return validMoves.map((move) => ({
        move: 'clickCell',
        args: [move.cell, move.size],
      }))
    },
  },
}
