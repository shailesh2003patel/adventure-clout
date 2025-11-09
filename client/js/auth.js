// client/js/auth.js
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  // utility to show message in page
  function showMessage(container, text, type = 'error') {
    // create container if not exists
    let msgEl = container.querySelector('#msg');
    if (!msgEl) {
      msgEl = document.createElement('div');
      msgEl.id = 'msg';
      msgEl.style.marginTop = '12px';
      container.prepend(msgEl); // show above form (or top of container)
    }
    msgEl.innerText = text;
    msgEl.style.display = 'block';
    msgEl.style.padding = '10px';
    msgEl.style.borderRadius = '8px';
    msgEl.style.fontWeight = '600';
    if (type === 'error') {
      msgEl.style.background = '#fff1f2';
      msgEl.style.color = '#b91c1c';
      msgEl.style.border = '1px solid rgba(185,28,28,0.12)';
    } else {
      msgEl.style.background = '#ecfdf5';
      msgEl.style.color = '#065f46';
      msgEl.style.border = '1px solid rgba(6,95,70,0.12)';
    }
  }

  // helper to make API call with JSON and auth header optional
  async function apiFetch(url, opts = {}) {
    opts.headers = opts.headers || {};
    if (opts.body && typeof opts.body === 'object') {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(opts.body);
    }
    try {
      const res = await fetch(url, opts);
      const json = await res.json().catch(() => ({}));
      return { ok: res.ok, status: res.status, data: json };
    } catch (err) {
      return { ok: false, error: err };
    }
  }

  // common success animation + redirect
  function successThenRedirect(container, message = 'Success! Redirecting...', delay = 900) {
    showMessage(container, message, 'success');
    setTimeout(() => { window.location.href = '/dashboard.html'; }, delay);
  }

  // ----- LOGIN -----
  if (path.includes('index.html') || path === '/' || path.endsWith('/')) {
    const form = document.getElementById('loginForm');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const container = form;
      const email = (document.getElementById('email') || {}).value || '';
      const password = (document.getElementById('password') || {}).value || '';

      if (!email || !password) {
        showMessage(container, 'Please enter both email and password.');
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
      showMessage(container, 'Logging in...', 'success');

      const res = await apiFetch('/api/auth/login', { method: 'POST', body: { email: email.trim(), password } });

      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';

      if (!res.ok) {
        showMessage(container, res.data?.msg || 'Login failed. Check credentials or try again later.');
        return;
      }

      // success
      localStorage.setItem('token', res.data.token);
      successThenRedirect(container, 'Login successful! Redirecting...');
    });
  }

  // ----- REGISTER -----
  if (path.includes('register.html')) {
    const form = document.getElementById('registerForm');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const container = form;

      const username = (document.getElementById('username') || {}).value || '';
      const email = (document.getElementById('email') || {}).value || '';
      const password = (document.getElementById('password') || {}).value || '';

      if (!username || !email || !password) {
        showMessage(container, 'Please fill all fields.');
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
      showMessage(container, 'Creating account...', 'success');

      const res = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: { username: username.trim(), email: email.trim(), password }
      });

      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';

      if (!res.ok) {
        // show server-provided message when possible
        showMessage(container, res.data?.msg || 'Server error. Try again later.');
        return;
      }

      // success — store token and redirect
      localStorage.setItem('token', res.data.token);
      successThenRedirect(container, 'Registration successful! Redirecting...');
    });
  }

});
