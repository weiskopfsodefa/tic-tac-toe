import {BoardProps} from 'boardgame.io/dist/types/packages/react'
import {CSSProperties, useState} from 'react'
import {GameState} from './game'

const cellStyle: CSSProperties = {
  width: '50px',
  height: '50px',
  lineHeight: '50px',
  textAlign: 'center',
  border: '1px solid #ccc',
}

export function TicTacToeBoard({ctx, G, moves}: BoardProps<GameState>) {
  const [activeStone, setActiveStone] = useState({
    '0': '0',
    '1': '0',
  })
  const onClick = (id: number) =>
    moves.clickCell(id, activeStone[ctx.currentPlayer as '0' | '1'])

  let winner = <div className=''></div>
  if (ctx.gameover) {
    winner =
      ctx.gameover.winner !== undefined ? (
        <div id='winner'>Winner: {ctx.gameover.winner === '0' ? 'X' : 'O'}</div>
      ) : (
        <div id='winner'>Draw!</div>
      )
  }

  const stones = (player: '0' | '1') => {
    const availableStones = G.availableStones[player]
    const currentActiveStoneForPlayer = activeStone[player]
    const isActive = ctx.currentPlayer === player
    return (
      <div>
        <div
          onClick={() => setActiveStone((prev) => ({...prev, [player]: '0'}))}
          style={{
            cursor: 'pointer',
            backgroundColor:
              currentActiveStoneForPlayer === '0' && isActive ? 'red' : 'white',
          }}
        >
          Small: {availableStones['0']}
        </div>
        <div
          onClick={() => setActiveStone((prev) => ({...prev, [player]: '1'}))}
          style={{
            cursor: 'pointer',
            backgroundColor:
              currentActiveStoneForPlayer === '1' && isActive ? 'red' : 'white',
          }}
        >
          Medium: {availableStones['1']}
        </div>
        <div
          onClick={() => setActiveStone((prev) => ({...prev, [player]: '2'}))}
          style={{
            cursor: 'pointer',
            backgroundColor:
              currentActiveStoneForPlayer === '2' && isActive ? 'red' : 'white',
          }}
        >
          Large: {availableStones['2']}
        </div>
      </div>
    )
  }

  const textForPlayerCell = (id: number) => {
    const cell = G.cells[id]
    if (cell === null)
      return <div style={{...cellStyle}} onClick={() => onClick(id)}></div>
    const [player, stone] = cell.split('-')
    const styleForStone = stone === '0' ? 15 : stone === '1' ? 30 : 40
    const playerName = player === '0' ? 'X' : 'O'
    return (
      <div
        style={{...cellStyle, fontSize: styleForStone}}
        onClick={() => onClick(id)}
      >
        {playerName}
      </div>
    )
  }

  const tbody = []
  for (let i = 0; i < 3; i++) {
    const cells = []
    for (let j = 0; j < 3; j++) {
      const id = 3 * i + j
      cells.push(<td key={id}>{textForPlayerCell(id)}</td>)
    }
    tbody.push(<tr key={i}>{cells}</tr>)
  }

  return (
    <div style={{margin: '10px'}}>
      <table id='board' style={{marginBottom: '10px'}}>
        <tbody>{tbody}</tbody>
      </table>
      <div style={{display: 'flex', flexDirection: 'row', gap: '10px'}}>
        <div>
          <h3>X</h3>
          {stones('0')}
        </div>
        <div>
          <h3>O</h3>
          {stones('1')}
        </div>
      </div>
      {winner}
    </div>
  )
}
