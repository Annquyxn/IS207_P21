export async function apiLogin(data) {
  const response = await fetch('http://localhost:8000/login.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data), // { username, password }
  });

  if (!response.ok) {
    throw new Error('Đăng nhập thất bại');
  }

  return response.json();
}
