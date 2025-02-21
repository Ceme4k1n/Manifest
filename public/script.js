const logUsername = document.getElementById('username')
const logPassword = document.getElementById('password')
const regPassword = document.getElementById('reg_password')
const regUsername = document.getElementById('reg_username')

document.addEventListener('DOMContentLoaded', function () {
  token = localStorage.getItem('Token')
  fetch('http://localhost:4000/auth/protect', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => console.log('Protected data:', data))
    .catch((error) => console.error('Error:', error))
})

document.getElementById('loginForm').addEventListener('submit', async function (event) {
  event.preventDefault()

  const username = logUsername.value
  const password = await hashPassword(logPassword.value)
  try {
    fetch('http://localhost:4000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          console.log(data.token)
          localStorage.setItem('Token', data.token)
          window.location.href = '/base.html'
        }
      })
  } catch (error) {
    console.log('Ошибка:', error)
  }
})

document.getElementById('regForm').addEventListener('submit', async function (event) {
  event.preventDefault()

  const username = regUsername.value
  const password = await hashPassword(regPassword.value) // Хешируем пароль
  console.log(username, password)

  try {
    fetch('http://localhost:4000/auth/reg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        console.log('Status: ', response.status)

        if (!response.ok) {
          return Promise.reject('Request failed with status ' + response.status)
        }
        return response.json()
      })
      .then((data) => {
        if (data) {
          console.log(data.token)
          localStorage.setItem('Token', data.token)
        }
      })
      .catch((error) => console.log('Error:', error))
  } catch (error) {
    console.log('Ошибка:', error)
  }
})

async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)

  const hash = await crypto.subtle.digest('SHA-256', data)

  const hashArray = Array.from(new Uint8Array(hash))
  const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('')

  return hashHex
}
