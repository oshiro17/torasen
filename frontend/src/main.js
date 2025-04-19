// frontend/src/main.js

import './style.css';

// ——————————
// ① 認証チェック用ヘルパー
// ——————————
async function fetchSession() {
  const res = await fetch('/api/v1/session', {
    credentials: 'include'
  });
  return res.ok
    ? await res.json()      // { logged_in: true, user: { id, username, … } }
    : { logged_in: false };
}

// ——————————
// ② ナビゲーション＋マウント先を一度だけ出力
// ——————————
document.body.innerHTML = `
  <nav>
    <a href="/"      data-link>ホーム</a>
    <a href="/login" data-link>ログイン</a>
    <a href="/signup" data-link>サインアップ</a>
    <a href="/profile" data-link>プロフィール</a>
  </nav>
  <div id="app"></div>
`;

// ——————————
// ③ 各画面描画＆ハンドラ
// ——————————
function renderHome() {
  document.querySelector('#app').innerHTML = `<h2>ようこそ！</h2>`;
}

async function handleLogin(e) {
  e.preventDefault();
  const form = e.target;
  const body = {
    username: form.username.value,
    password: form.password.value
  };
  const res = await fetch('/api/v1/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body)
  });
  if (res.ok) {
    navigate('/');
  } else {
    const data = await res.json();
    alert(data.error || 'ログインに失敗しました');
  }
}

function renderLoginForm() {
  document.querySelector('#app').innerHTML = `
    <h2>ログイン</h2>
    <form id="login-form">
      <input name="username" placeholder="ユーザー名" required /><br/>
      <input name="password" type="password" placeholder="パスワード" required /><br/>
      <button>ログイン</button>
    </form>
  `;
  document
    .getElementById('login-form')
    .addEventListener('submit', handleLogin);
}

async function handleSignup(e) {
  e.preventDefault();
  const form = e.target;
  const body = {
    username: form.username.value,
    password: form.password.value,
    password_confirmation: form.password_confirmation.value
  };
  const res = await fetch('/api/v1/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body)
  });
  if (res.ok) {
    navigate('/login');
  } else {
    const data = await res.json();
    alert((data.errors || []).join('\n') || '登録に失敗しました');
  }
}

function renderSignupForm() {
  document.querySelector('#app').innerHTML = `
    <h2>サインアップ</h2>
    <form id="signup-form">
      <input name="username" placeholder="ユーザー名" required /><br/>
      <input name="password" type="password" placeholder="パスワード" required /><br/>
      <input name="password_confirmation" type="password" placeholder="確認用パスワード" required /><br/>
      <button>登録する</button>
    </form>
  `;
  document
    .getElementById('signup-form')
    .addEventListener('submit', handleSignup);
}

async function handleProfileUpdate(e) {
  e.preventDefault();
  const session = await fetchSession();
  if (!session.logged_in) {
    return navigate('/login');
  }
  const userId = session.user.id;
  const username = e.target.username.value;
  const res = await fetch(`/api/v1/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username })
  });
  if (res.ok) {
    alert('プロフィールを更新しました');
  } else {
    const data = await res.json();
    alert((data.errors || []).join('\n') || '更新に失敗しました');
  }
}

async function renderProfileForm() {
  const session = await fetchSession();
  if (!session.logged_in) {
    return navigate('/login');
  }
  document.querySelector('#app').innerHTML = `
    <h2>プロフィール編集</h2>
    <form id="profile-form">
      <input name="username" value="${session.user.username}" required /><br/>
      <button>更新する</button>
    </form>
  `;
  document
    .getElementById('profile-form')
    .addEventListener('submit', handleProfileUpdate);
}

// ——————————
// ④ ルーター＆ナビゲーション制御
// ——————————
function router() {
  const p = window.location.pathname;
  if (p === '/login')      return renderLoginForm();
  if (p === '/signup')     return renderSignupForm();
  if (p === '/profile')    return renderProfileForm();
  renderHome();
}

function navigate(to) {
  history.pushState(null, null, to);
  router();
}

document.body.addEventListener('click', e => {
  const a = e.target.closest('a[data-link]');
  if (!a) return;
  e.preventDefault();
  navigate(a.getAttribute('href'));
});

window.addEventListener('popstate', router);
window.addEventListener('DOMContentLoaded', router);
