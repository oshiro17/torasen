import { canvas, startGame, stopGame } from "../main.js";
import { goto } from "../router.js";

export function GameView() {
  // 既に DOM にあれば使い回し
  if (!canvas.isConnected) startGame();

  // ESC キーで一旦終了→結果へ
  document.onkeydown = (e) => {
    if (e.key === "Escape") {
      stopGame();
      goto("/result", { winner: "TBD" });
    }
  };
  return canvas;
}