import { useEffect, useState } from "react";
import "./App.css";
import { FifteenPuzzle } from "./FifteenPuzzle";

declare global {
  interface Window {
    Telegram?: {
      WebApp: any;
    };
  }
}

function App() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    tg.ready();
    tg.expand();

    const user = tg.initDataUnsafe?.user;
    if (user) {
      setUsername(
        user.username ||
          `${user.first_name || ""} ${user.last_name || ""}`.trim()
      );
    }

    tg.setHeaderColor("secondary_bg_color");
    tg.setBackgroundColor(tg.themeParams?.bg_color || "#050509");
  }, []);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    const handleMainButtonClick = () => {
      tg.showAlert("Позже тут можно будет шэрить рекорд из пятнашек 🙂");
    };

    tg.MainButton.setText("Играть в пятнашки");
    tg.MainButton.onClick(handleMainButtonClick);
    tg.MainButton.show();

    return () => {
      tg.MainButton.hide();
      tg.MainButton.offClick(handleMainButtonClick);
    };
  }, []);

  return (
    <div className="app-root">
      <div className="app-root-inner">
        <h1>Пятнашки</h1>
        <p className="subtitle">
          {username
            ? `Привет, ${username}!`
            : "Привет! Открой меня внутри Telegram Mini App."}
        </p>

        <FifteenPuzzle />

        <p className="hint">
          Когда подключишь к боту как Mini App, внизу появится кнопка «Играть в
          пятнашки».
        </p>
      </div>
    </div>
  );
}

export default App;
