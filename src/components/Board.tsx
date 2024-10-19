interface BoardProps {
  board: number[][];
  currentPlayer: number;
  timer: number;
  onPlaceChip: (colIndex: number) => void;
  onMouseOver: (colIndex: number) => void;
  gameWon: boolean;
}

const Board: React.FC<BoardProps> = ({
  board,
  currentPlayer,
  timer,
  onPlaceChip,
  onMouseOver,
  gameWon,
}) => {
  return (
    <div className="board">
      <h2>Current Player</h2>
      <h2>Time: {timer}s</h2>
      {gameWon && <h2>Game Over! Player {currentPlayer} wins!</h2>}
      <div className="board-grid">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`cell ${cell === 1 ? "player1" : cell === 2 ? "player2" : ""}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
