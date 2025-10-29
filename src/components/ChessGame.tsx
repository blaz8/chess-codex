"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { Color, Move, Square } from "chess.js";
import ChessBoard from "@/components/ChessBoard";
import {
  BoardState,
  createGame,
  getLegalMoves,
  makeMove,
  undoMove
} from "@/lib/chess";

function colorName(color: Color): string {
  return color === "w" ? "White" : "Black";
}

function oppositeColor(color: Color): Color {
  return color === "w" ? "b" : "w";
}

function getStatus(game: { turn(): Color; isCheckmate(): boolean; isStalemate(): boolean; isDraw(): boolean; inCheck(): boolean; }): string {
  if (game.isCheckmate()) {
    return `${colorName(oppositeColor(game.turn()))} wins by checkmate`;
  }

  if (game.isStalemate()) {
    return "Stalemate";
  }

  if (game.isDraw()) {
    return "Draw";
  }

  const turn = game.turn();
  const checkSuffix = game.inCheck() ? " (in check)" : "";
  return `${colorName(turn)} to move${checkSuffix}`;
}

export default function ChessGame(): JSX.Element {
  const gameRef = useRef(createGame());
  const [board, setBoard] = useState<BoardState>(gameRef.current.board());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Move[]>([]);
  const [status, setStatus] = useState<string>(getStatus(gameRef.current));

  const refresh = useCallback(() => {
    setBoard(gameRef.current.board());
    setStatus(getStatus(gameRef.current));
  }, []);

  const handleSelectSquare = useCallback(
    (square: Square) => {
      const game = gameRef.current;

      if (selectedSquare) {
        if (selectedSquare === square) {
          setSelectedSquare(null);
          setLegalMoves([]);
          return;
        }

        const targetMove = legalMoves.find((move) => move.to === square);
        if (targetMove) {
          const moveResult = makeMove(game, selectedSquare, square, targetMove.promotion);
          if (moveResult) {
            setSelectedSquare(null);
            setLegalMoves([]);
            refresh();
            return;
          }
        }
      }

      const piece = game.get(square);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        setLegalMoves(getLegalMoves(game, square));
      } else {
        setSelectedSquare(null);
        setLegalMoves([]);
      }
    },
    [legalMoves, refresh, selectedSquare]
  );

  const handleNewGame = useCallback(() => {
    gameRef.current = createGame();
    setSelectedSquare(null);
    setLegalMoves([]);
    refresh();
  }, [refresh]);

  const handleUndo = useCallback(() => {
    undoMove(gameRef.current);
    setSelectedSquare(null);
    setLegalMoves([]);
    refresh();
  }, [refresh]);

  const canUndo = useMemo(() => gameRef.current.history().length > 0, [board]);

  return (
    <section className="flex w-full flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-slate-200">
        <span className="rounded-full bg-slate-800 px-4 py-1 font-medium shadow">{status}</span>
        <button
          type="button"
          onClick={handleNewGame}
          className="rounded-md bg-amber-500 px-4 py-1 text-sm font-semibold text-slate-900 shadow transition hover:bg-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          New game
        </button>
        <button
          type="button"
          onClick={handleUndo}
          disabled={!canUndo}
          className="rounded-md bg-slate-700 px-4 py-1 text-sm font-semibold text-slate-100 shadow transition hover:bg-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-400"
        >
          Undo
        </button>
      </div>
      <ChessBoard
        board={board}
        selectedSquare={selectedSquare}
        legalMoves={legalMoves}
        onSquareClick={handleSelectSquare}
      />
    </section>
  );
}
