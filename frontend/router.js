import { LoginView }  from "./views/login.js";
import { GameView }   from "./views/game.js";
import { ResultView } from "./views/result.js";

const routes = {
  "/login":  LoginView,
  "/game":   GameView,
  "/result": ResultView,
};

const root = document.getElementById("root");

/* URL を変更して描画 --------------------------------- */
export function goto(path, state = {}) {
  history.pushState(state, "", path);
  render(path, state);
}

window.onpopstate = (e) => {
  render(location.pathname, e.state || {});
};

window.onload = () => {
  render(location.pathname, history.state || {});
};

function render(path, state) {
  // 認可チェック
  if (!isLoggedIn() && path !== "/login") return goto("/login");
  if (isLoggedIn()  && path === "/login") return goto("/game");

  const View = routes[path] || LoginView;
  root.innerHTML = "";
  root.appendChild(View(state));
}

function isLoggedIn() {
  return localStorage.getItem("loggedIn") === "true";
}