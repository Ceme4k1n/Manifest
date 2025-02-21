document.addEventListener('DOMContentLoaded', function () {
  const token = localStorage.getItem('Token')

  if (!token) {
    console.error('Токен отсутствует. Пользователь не авторизован.')
    window.location.href = '/index.html'
    return
  }

  const userNameElement = document.getElementById('user-name')
  const userStatusElement = document.getElementById('user-status')
  if (!userNameElement || !userStatusElement) {
    console.error('Элементы для отображения данных не найдены')
    return
  }

  fetch('http://localhost:4000/api/user-profile', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Ошибка сервера: ' + res.status)
      }
      return res.json()
    })
    .then((data) => {
      if (data) {
        userNameElement.textContent = data.user[0].fio
        userStatusElement.textContent = data.user[0].bio
      }
    })
    .catch((error) => console.error('Ошибка загрузки профиля:', error))
})
