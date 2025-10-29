import classNames from "classnames";
import type { Move, Square } from "chess.js";
import type { BoardState } from "@/lib/chess";

type ChessBoardProps = {
  board: BoardState;
  selectedSquare: Square | null;
  legalMoves: Move[];
  onSquareClick: (square: Square) => void;
};

const files = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
const ranks = [8, 7, 6, 5, 4, 3, 2, 1] as const;

const pieceGlyphs: Record<string, string> = {
  w: {
    k: "♔",
    q: "♕",
    r: "♖",
    b: "♗",
    n: "♘",
    p: "♙"
  },
  b: {
    k: "♚",
    q: "♛",
    r: "♜",
    b: "♝",
    n: "♞",
    p: "♟"
  }
} as const satisfies Record<"w" | "b", Record<string, string>>;

function indexToSquare(row: number, col: number): Square {
  const file = files[col];
  const rank = ranks[row];
  return `${file}${rank}` as Square;
}

function renderPieceGlyph(color: "w" | "b", type: string): string {
  return pieceGlyphs[color][type] ?? "";
}

export default function ChessBoard({
  board,
  selectedSquare,
  legalMoves,
  onSquareClick
}: ChessBoardProps): JSX.Element {
  const legalTargets = new Set(legalMoves.map((move) => move.to));
  const captureTargets = new Set(
    legalMoves.filter((move) => move.flags.includes("c") || move.flags.includes("e")).map((move) => move.to)
  );

  return (
    <div className="flex w-full max-w-xl flex-col items-center">
      <div className="grid aspect-square w-full grid-cols-8 overflow-hidden rounded-xl shadow-2xl shadow-slate-950">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const square = indexToSquare(rowIndex, colIndex);
            const isDarkSquare = (rowIndex + colIndex) % 2 === 1;
            const isSelected = selectedSquare === square;
            const isLegalTarget = legalTargets.has(square);
            const isCaptureTarget = captureTargets.has(square);

            return (
              <button
                key={square}
                type="button"
                onClick={() => onSquareClick(square)}
                className={classNames(
                  "relative flex aspect-square items-center justify-center text-3xl font-semibold transition-colors sm:text-4xl",
                  isDarkSquare ? "bg-slate-700 text-slate-100" : "bg-slate-200 text-slate-900",
                  isSelected && "ring-4 ring-amber-400"
                )}
                aria-label={`Square ${square}`}
              >
                {piece ? <span>{renderPieceGlyph(piece.color, piece.type)}</span> : null}
                {isLegalTarget ? (
                  <span
                    className={classNames(
                      "pointer-events-none absolute inset-2 rounded-full",
                      isCaptureTarget ? "border-4 border-amber-400" : "bg-amber-300/60"
                    )}
                  />
                ) : null}
                <span className="pointer-events-none absolute bottom-1 left-1 text-xs font-medium text-slate-500">
                  {square}
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
