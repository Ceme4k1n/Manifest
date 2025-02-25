const logEmail = document.getElementById('log_email')
const logPassword = document.getElementById('log_password')
const regName = document.getElementById('reg_name')
const regLastName = document.getElementById('reg_lastname')
const regEmail = document.getElementById('reg_email')
const regPassword = document.getElementById('reg_password')

function showLogin() {
  hideAll()
  document.getElementById('loginContainer').style.display = 'block'
}

function showReg() {
  hideAll()
  document.getElementById('regContainer').style.display = 'block'
}

function showForgotEmail() {
  hideAll()
  document.getElementById('forgotEmailContainer').style.display = 'block'
}

function showForgotCode() {
  hideAll()
  document.getElementById('forgotCodeContainer').style.display = 'block'
}

function showForgotPassword() {
  hideAll()
  document.getElementById('forgotPasswordContainer').style.display = 'block'
}

// Функция скрывает все контейнеры перед показом нужного
function hideAll() {
  document.querySelectorAll('.container').forEach((container) => {
    container.style.display = 'none'
  })
}
document.addEventListener('DOMContentLoaded', function () {
  const token = localStorage.getItem('Token')

  if (!token) {
    return
  }
  fetch('http://localhost:4000/auth/protect', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.token) {
        console.log(data.user)

        window.location.href = '/profile.html'
      }
    })
    .catch((error) => console.error('Error:', error))
})

document.getElementById('loginForm').addEventListener('submit', async function (event) {
  event.preventDefault()

  const email = logEmail.value
  const password = await hashPassword(logPassword.value)
  try {
    fetch('http://localhost:4000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          console.log('Токен: ', data.token)
          localStorage.setItem('Token', data.token)
          window.location.href = '/profile.html'
        }
      })
  } catch (error) {
    console.log('Ошибка:', error)
  }
})

document.getElementById('regForm').addEventListener('submit', async function (event) {
  event.preventDefault()

  const name = regName.value
  const lastName = regLastName.value
  const email = regEmail.value
  const password = await hashPassword(regPassword.value) // Хешируем пароль
  console.log(name, password)

  try {
    fetch('http://localhost:4000/auth/reg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, lastName, email, password }),
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
          window.location.href = '/profile.html'
        }
      })
      .catch((error) => console.log('Error:', error))
  } catch (error) {
    console.log('Ошибка:', error)
  }
})

async function sendEmail() {
  let emailCheck = document.getElementById('forgot_email').value
  console.log(emailCheck)

  try {
    fetch('http://localhost:4000/auth/forgot_pass', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emailCheck }),
    })
      .then((response) => {
        if (!response.ok) {
          return Promise.reject('Request failed with status ' + response.status)
        }
        console.log('Status: ', response.status)
        if (response.status === 200) {
          showForgotCode()
        }
        return response.json()
      })
      .then((data) => {
        console.log(data.tokenEmail)
        localStorage.setItem('Email_token', data.tokenEmail)
      })
      .catch((error) => console.error('Ошибка:', error))
  } catch (error) {}
}

async function verifyCode() {
  let code = document.getElementById('forgot_code').value
  const emailToken = localStorage.getItem('Email_token')

  try {
    fetch('http://localhost:4000/auth/verefi_code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, emailToken }),
    })
      .then((response) => {
        if (!response.ok) {
          return Promise.reject('Request failed with status ' + response.status)
        }
        console.log('Status: ', response.status)
        if (response.status === 200) {
          showForgotPassword()
        }
        return response.json()
      })
      .then((data) => {
        console.log(data.tokenEmail)
        localStorage.setItem('Email_token', data.tokenEmail)
      })
      .catch((error) => console.error('Ошибка:', error))
  } catch (error) {}
}

async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)

  const hash = await crypto.subtle.digest('SHA-256', data)

  const hashArray = Array.from(new Uint8Array(hash))
  const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('')

  return hashHex
}
