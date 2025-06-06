import { goto } from "../router.js";

export function LoginView() {
  const wrap = document.createElement("div");
  wrap.innerHTML = `
    <h2>Register</h2>
    <input id="reg-username" placeholder="Username">
    <input id="reg-password" type="password" placeholder="Password">
    <button id="reg-btn">Register</button>

    <h2>Login</h2>
    <input id="login-username" placeholder="Username">
    <input id="login-password" type="password" placeholder="Password">
    <button id="login-btn">Login</button>

    <p id="msg"></p>
  `;

  wrap.querySelector("#reg-btn").onclick = () => auth("register");
  wrap.querySelector("#login-btn").onclick = () => auth("login");

  async function auth(type) {
    // ★ ここを追加
    const prefix = type === "register" ? "reg" : "login";
  
    const u = wrap.querySelector(`#${prefix}-username`).value;
    const p = wrap.querySelector(`#${prefix}-password`).value;
    try {
      const res = await fetch(`https://localhost:3000/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u, password: p }),
        credentials: "include",
      });
      const text = await res.text();
      wrap.querySelector("#msg").textContent = text;
      if (res.ok && type === "login") {
        localStorage.setItem("loggedIn", "true");
        goto("/game");
      }
    } catch (e) {
      wrap.querySelector("#msg").textContent = "Network error";
    }
  }
  return wrap;
}