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

document.getElementById('loginForm').addEventListener('submit', function (event) {
  event.preventDefault()

  const username = logUsername.value
  const password = logPassword.value
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
        if (data) {
          console.log(data.token)
          localStorage.setItem('Token', data.token)
        }
      })
  } catch (error) {
    console.log('Ошибка:', error)
  }
})

document.getElementById('regForm').addEventListener('submit', function (event) {
  event.preventDefault()

  const username = regUsername.value
  const password = regPassword.value
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
