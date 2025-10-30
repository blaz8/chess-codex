import ChessGame from "@/components/ChessGame";

export default function HomePage(): JSX.Element {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="flex w-full max-w-4xl flex-col items-center gap-6">
        <header className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Chess App</h1>
          <p className="mt-2 text-sm text-slate-300">
            Play a quick game against a friend with simple click-to-move controls.
          </p>
        </header>
        <ChessGame />
      </div>
    </main>
  );
}
