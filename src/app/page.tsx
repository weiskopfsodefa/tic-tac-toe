'use client'

import {Client} from 'boardgame.io/react'
import {TicTacToeBoard} from '../game/board'
import {TicTacToe} from '../game/game'

const App = Client({game: TicTacToe, board: TicTacToeBoard})

export default App
