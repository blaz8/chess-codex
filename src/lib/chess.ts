import { Chess, Move, Square } from "chess.js";

export type { Color, Move, PieceSymbol, Square } from "chess.js";

export type ChessInstance = Chess;
export type BoardState = ReturnType<Chess["board"]>;

export function createGame(): Chess {
  return new Chess();
}

export function getLegalMoves(game: Chess, square: Square): Move[] {
  return game.moves({ square, verbose: true });
}

export function makeMove(game: Chess, from: Square, to: Square, promotion?: Move["promotion"]): Move | null {
  return game.move({ from, to, promotion: promotion ?? "q" }) ?? null;
}

export function undoMove(game: Chess): Move | null {
  return game.undo();
}
