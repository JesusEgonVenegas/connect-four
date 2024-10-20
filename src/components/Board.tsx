import boardBL from "@assets/images/board-layer-black-large.svg";
import boardWL from "@assets/images/board-layer-white-large.svg";
import boardBS from "@assets/images/board-layer-black-small.svg";
import boardWS from "@assets/images/board-layer-white-small.svg";
interface BoardProps {
  board: number[][];
  handleClick: (spaceIndex: number) => void;
  handleMouseOut: () => void;
  handleMouseOver: (spaceIndex: number) => void;
  windowWidth: number;
}

const Board: React.FC<BoardProps> = ({
  board,
  handleClick,
  handleMouseOut,
  handleMouseOver,
  windowWidth,
}) => {
  return (
    <div className="board">
      <div
        className="boardBlack"
        style={{
          content: `url(${windowWidth > 501 ? boardBL : boardBS})`,
        }}
      ></div>
      <div
        className="boardWhite"
        style={{
          content: `url(${windowWidth > 501 ? boardWL : boardWS})`,
        }}
      ></div>
      <div className="gameBoard">
        {board.map((row, colIndex) => (
          <div className={`column ${colIndex}`} key={colIndex}>
            {row.map((space, spaceIndex) => (
              <div
                key={spaceIndex}
                className={`space ${spaceIndex}`}
                onClick={() => handleClick(spaceIndex)}
                onMouseLeave={() => handleMouseOut()}
                onMouseOver={() => handleMouseOver(spaceIndex)}
              >
                {space > 0 && <div className={`player${space}`}></div>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
