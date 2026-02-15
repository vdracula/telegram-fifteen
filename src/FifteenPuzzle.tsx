import { useEffect, useMemo, useState } from "react";

type Cell = number | null;

function makeGoal(size: number): Cell[] {
  const total = size * size;
  return Array.from({ length: total }, (_, i) =>
    i === total - 1 ? null : i + 1
  );
}

function indexToPos(index: number, size: number) {
  const row = Math.floor(index / size);
  const col = index % size;
  return { row, col };
}

function isNeighbor(i: number, j: number, size: number) {
  const a = indexToPos(i, size);
  const b = indexToPos(j, size);
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col) === 1;
}

function shuffleSafe(start: Cell[], size: number): Cell[] {
  let board = [...start];
  for (let k = 0; k < 200; k++) {
    const empty = board.indexOf(null);
    const neighbors = board
      .map((_, i) => i)
      .filter((i) => isNeighbor(i, empty, size));
    const rand = neighbors[Math.floor(Math.random() * neighbors.length)];
    [board[empty], board[rand]] = [board[rand], board[empty]];
  }
  return board;
}

export function FifteenPuzzle() {
  const [size, setSize] = useState(4);
  const goal = useMemo(() => makeGoal(size), [size]);

  const [board, setBoard] = useState<Cell[]>(() => shuffleSafe(makeGoal(4), 4));
  const [moves, setMoves] = useState(0);
  const [isSolved, setIsSolved] = useState(false);

  const [seconds, setSeconds] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(() => {
    const raw = localStorage.getItem("fifteen-best-time");
    return raw ? Number(raw) : null;
  });

  const [clickSound] = useState(
    () =>
      new Audio(
        "https://assets.mixkit.co/sfx/preview/mixkit-soft-ui-click-2587.mp3"
      )
  );

  // новая игра при смене размера
  useEffect(() => {
    setBoard(shuffleSafe(goal, size));
    setMoves(0);
    setSeconds(0);
    setIsSolved(false);
  }, [goal, size]);

  // таймер
  useEffect(() => {
    if (isSolved) return;
    const id = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [isSolved, size]);

  const handleClick = (index: number) => {
    if (isSolved) return;

    const empty = board.indexOf(null);
    if (!isNeighbor(index, empty, size)) return;

    const next = [...board];
    [next[index], next[empty]] = [next[empty], next[index]];
    setBoard(next);
    setMoves((m) => m + 1);

    // звук
    try {
      clickSound.currentTime = 0;
      void clickSound.play();
    } catch {
      // игнор
    }

    if (next.every((val, i) => val === goal[i])) {
      setIsSolved(true);

      setBestTime((prev) => {
        const current = seconds + 1;
        const nextBest = prev == null ? current : Math.min(prev, current);
        localStorage.setItem("fifteen-best-time", String(nextBest));
        return nextBest;
      });

      alert(`Собрано за ${seconds + 1} сек. и ${moves + 1} ходов!`);
    }
  };

  const handleReset = () => {
    setBoard(shuffleSafe(goal, size));
    setMoves(0);
    setSeconds(0);
    setIsSolved(false);
  };

  return (
    <div className="game-root">
      <div className="hud hud-top">
        <span>Размер:</span>
        <div className="size-switch">
          {[3, 4, 5].map((s) => (
            <button
              key={s}
              className={`size-chip ${s === size ? "active" : ""}`}
              onClick={() => setSize(s)}
            >
              {s}×{s}
            </button>
          ))}
        </div>
      </div>

      <div className={`board board-${size}`}>
        {board.map((cell, index) => {
          if (cell === null) return null;
          const { row, col } = indexToPos(index, size);
          const cellPercent = 100 / size;
          const gapPx = 2; // отступ в пикселях от края ячейки
          return (
            <button
              key={cell}
              className="tile tile-animated"
              style={{
                width: `calc(${cellPercent}% - ${gapPx * 2}px)`,
                height: `calc(${cellPercent}% - ${gapPx * 2}px)`,
                top: `calc(${row * cellPercent}% + ${gapPx}px)`,
                left: `calc(${col * cellPercent}% + ${gapPx}px)`,
              }}
              onClick={() => handleClick(index)}
            >
              {cell}
            </button>
          );
        })}
      </div>

      <div className="hud hud-bottom">
        <span>Ходы: {moves}</span>
        <span>Время: {seconds} c</span>
        {bestTime != null && <span>Лучшее: {bestTime} c</span>}
        <button className="neon-button" onClick={handleReset}>
          Сброс
        </button>
      </div>
    </div>
  );
}
