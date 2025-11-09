// client/js/dashboard.js
const apiBase = '/api';

async function apiFetch(url, opts = {}) {
  const token = localStorage.getItem('token');
  opts.headers = opts.headers || {};
  if (token) opts.headers.Authorization = 'Bearer ' + token;
  if (opts.body && typeof opts.body === 'object') {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(opts.body);
  }
  const res = await fetch(url, opts);
  const data = await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, data };
}

function createTaskCard(task, completed = false) {
  const wrap = document.createElement('div');
  wrap.className = 'task';
  wrap.innerHTML = `
    <div class="left">
      <div class="dot"></div>
      <div>
        <div class="title">${task.title}</div>
        <div class="meta">${task.desc || ''} • ${task.points} pts</div>
      </div>
    </div>
    <div class="actions">
      <button class="small-btn" data-id="${task._id}" ${completed ? 'disabled' : ''}>${completed ? 'Done' : 'Complete'}</button>
    </div>
  `;

  const btn = wrap.querySelector('button');
  btn.addEventListener('click', () => completeTask(task._id, btn));
  return wrap;
}

async function completeTask(taskId, btn) {
  btn.disabled = true;
  btn.innerText = 'Working...';
  const res = await apiFetch(`${apiBase}/tasks/${taskId}/complete`, { method: 'POST' });
  if (!res.ok) {
    btn.disabled = false;
    btn.innerText = 'Complete';
    alert(res.data?.msg || 'Could not complete task');
    return;
  }
  // update points & UI
  document.getElementById('points').innerText = res.data.points;
  document.getElementById('rankLabel').innerText = res.data.rank;
  updateProgressUI(res.data.points);
  btn.innerText = 'Done';
  btn.disabled = true;
}

function updateProgressUI(points) {
  const pct = Math.min(100, Math.round((points / 100) * 100));
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('levelPct').innerText = pct + '%';
}

document.addEventListener('DOMContentLoaded', async () => {
  const logoutBtn = document.getElementById('logout');
  if (logoutBtn) logoutBtn.onclick = () => { localStorage.removeItem('token'); window.location = '/'; };

  // fetch user
  const userRes = await apiFetch(apiBase + '/auth/me');
  if (!userRes.ok) { window.location = '/'; return; }
  const user = userRes.data;

  document.getElementById('username').innerText = user.username || user.email;
  document.getElementById('userSmall').innerText = user.username || user.email;
  document.getElementById('displayName').innerText = user.username || user.email;
  document.getElementById('emailDisplay').innerText = user.email;
  document.getElementById('points').innerText = user.points || 0;
  document.getElementById('rank').innerText = user.rank || 'Novice';
  document.getElementById('avatar').innerText = (user.username||'U').charAt(0).toUpperCase();
  document.getElementById('avatarLarge').innerText = (user.username||'U').charAt(0).toUpperCase();
  updateProgressUI(user.points || 0);

  // fetch real tasks
  const tasksRes = await apiFetch(apiBase + '/tasks');
  const tasks = tasksRes.ok ? tasksRes.data : [];
  const list = document.getElementById('taskList');

  // mark which tasks user already completed
  const completedIds = (user.completedTasks || []).map(String);

  tasks.forEach(t => {
    const done = completedIds.includes(String(t._id));
    list.appendChild(createTaskCard(t, done));
  });
});
