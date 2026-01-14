fetch('/api/usuarios')
  .then(res => res.json())
  .then(users => {
    const body = document.getElementById('usersBody');
    body.innerHTML = '';

    users.forEach(user => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>${user.id}</td>
        <td>${user.email}</td>
        <td class="${user.rol === 'admin' ? 'role-admin' : 'role-user'}">
          ${user.rol}
        </td>
        <td>
          <button class="btn-reset" onclick="resetPassword(${user.id})">
            Resetear
          </button>
        </td>
      `;

      body.appendChild(tr);
    });
  });

function resetPassword(id) {
  if (!confirm('¿Resetear contraseña del usuario ooo?')) return;

  fetch(`/api/reset-password/${id}`, { method: 'POST' })
    .then(res => res.json())
    .then(data => alert(data.message));
}
