import { goto } from "../router.js";

export function ResultView(state) {
  const wrap = document.createElement("div");
  wrap.innerHTML = `
    <h2>Result</h2>
    <p>Winner: ${state.winner || "?"}</p>
    <button id="replay">Replay</button>
    <button id="logout">Logout</button>
  `;
  wrap.querySelector("#replay").onclick = () => goto("/game");
  wrap.querySelector("#logout").onclick = () => {
    localStorage.removeItem("loggedIn");
    goto("/login");
  };
  return wrap;
}