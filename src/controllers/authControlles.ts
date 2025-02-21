import express, { Express, Request, Response } from 'express'
const dotenv = require('dotenv')
import jwt from 'jsonwebtoken'
dotenv.config()
import db from '../database/db'

const SECRET_KEY = process.env.SECRET_KEY || 'test'

// 1. POST: Авторизация пользователя
export const user_login = async (req: Request, res: Response) => {
  const { username, password } = req.body
  if (username && password) {
    try {
      const user = await db.any('SELECT username FROM man.users WHERE password_hash = $1 AND username = $2', [password, username])
      if (!user) {
        res.status(401).json({ message: 'Invalid credentials' })
        return
      }
      if (user.length === 0) {
        res.status(403).json({ message: 'User not exist' })
        return
      }

      const token = jwt.sign({ name: username }, SECRET_KEY, { expiresIn: '1h' })

      res.json({ message: 'Логин успешный', token })
      console.log(user)
    } catch (error) {
      console.error(error)
      res.status(501).json({ error: 'Database error' })
    }
  }
}
// 2. POST: Регистрация пользователя
export const user_register = async (req: Request, res: Response) => {
  const { username, password } = req.body
  if (username && password) {
    try {
      const user = await db.any('SELECT username FROM man.users WHERE username = $1', [username])
      if (user.length > 0) {
        res.status(502).json({ message: 'User exist', user })
        console.log(user)
        return
      } else {
        await db.none('INSERT INTO man.users(username, password_hash, email) VALUES($1, $2, $3)', [username, password, username])
        const token = jwt.sign({ name: username }, SECRET_KEY, { expiresIn: '1h' })
        res.json({ message: `Рега успешная`, token })
      }
    } catch (error) {
      console.error(error)
      res.status(501).json({ error: 'Database error' })
    }
  }
}

// 3. GET: Проверка JWT Token-a
export const user_check_token = (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    res.status(403).json({ message: 'No Token' })
    return
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(403).json({ message: 'Invalid token' })
      return
    }
    res.json({ message: 'Protected data accessed!', user: decoded })
  })
}
