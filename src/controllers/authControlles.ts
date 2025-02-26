import express, { Express, Request, Response } from 'express'
import Redis from 'ioredis'
const redis = new Redis()
const dotenv = require('dotenv')
import jwt from 'jsonwebtoken'
dotenv.config()
import db from '../database/db'
import { log } from 'node:console'
import { randomInt, sign } from 'node:crypto'
import { RedisSearchLanguages } from 'redis'

const SECRET_KEY = process.env.SECRET_KEY || 'test'

// 1. POST: Авторизация пользователя
export const user_login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  if (email && password) {
    try {
      const user = await db.any('SELECT username FROM man.users WHERE password_hash = $1 AND email = $2', [password, email])
      if (user.length === 0) {
        res.status(403).json({ message: 'User not exist' })
        return
      }

      const token = jwt.sign({ name: email }, SECRET_KEY, { expiresIn: '5s' })
      res.status(200).json({ message: 'Логин успешный', token })
      console.log(user)
    } catch (error) {
      console.error(error)
      res.status(501).json({ error: 'Database error' })
    }
  }
}

// 2. POST: Регистрация пользователя
export const user_register = async (req: Request, res: Response) => {
  const { name, lastName, email, password } = req.body
  if (name && lastName && email && password) {
    try {
      const user = await db.any('SELECT username FROM man.users WHERE email = $1', [email])
      if (user.length > 0) {
        res.status(502).json({ message: 'User exist', user })
        console.log('Юзер существует: ', user)
        return
      } else {
        const reg_token = jwt.sign({ Email: email }, SECRET_KEY, { expiresIn: '10m' })
        const code = randomInt(100000, 999999)
        await redis.hset(`email_ver:${email}`, {
          redName: name,
          redLastName: lastName,
          redPass: password,
          redCode: code,
        })
        await redis.expire(`email_ver:${email}`, 900)

        console.log('Код для редиса:', code)
        res.status(200).json({ reg_token })
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
    res.status(200).json({ message: 'Protected data accessed!', user: decoded })
  })
}

export const email_restore = async (req: Request, res: Response) => {
  const { emailCheck } = req.body

  try {
    const user = await db.any('SELECT username FROM man.users WHERE email = $1', [emailCheck])
    if (user.length <= 0) {
      console.log('Такого пользователя нет')
      res.status(403).json({ message: 'Email not exist' })
      return
    }
    console.log(user[0].username)
    const resetCode = randomInt(100000, 999999)
    console.log(resetCode)
    await db.none('UPDATE man.users SET reset_code = $1 WHERE email = $2', [resetCode, emailCheck])
    const tokenEmail = jwt.sign({ Email: emailCheck }, SECRET_KEY, { expiresIn: '10m' })
    res.status(200).json({ message: 'Email exist', tokenEmail })
  } catch (error) {
    console.error(error)
    res.status(501).json({ error: 'Database error' })
  }
}

export const verefi_code = async (req: Request, res: Response) => {
  const { code, emailToken } = req.body
  let decodeEmail
  if (!code || !emailToken) {
    res.status(402).json({ message: 'Code or token not exits' })
    return
  }
  console.log(code, emailToken)
  jwt.verify(emailToken, SECRET_KEY, (err: any, decoded: any) => {
    if (err) {
      res.status(403).json({ message: 'Invalid token' })
      return
    }
    console.log('Email: ', decoded.Email)
    decodeEmail = decoded.Email
  })
  try {
    const result = await db.one('select count(*) <> 0 as exists from man.users where email = $1 and reset_code = $2', [decodeEmail, code])
    if (result.exists) {
      const tokenEmail = jwt.sign({ Email: decodeEmail, Code: code }, SECRET_KEY, { expiresIn: '10m' })
      res.status(200).json({ message: 'Email exist', tokenEmail })
    }
  } catch (error) {
    console.error(error)
    res.status(501).json({ error: 'Database error' })
  }
}

export const reset_password = async (req: Request, res: Response) => {
  const { newPassword, emailToken } = req.body
  let decodeEmail, decodeCode

  if (!newPassword || !emailToken) {
    res.status(402).json({ message: 'Token or pass not exist' })
  }

  jwt.verify(emailToken, SECRET_KEY, (err: any, decoded: any) => {
    if (err) {
      res.status(403).json({ message: 'Invalid token' })
      return
    }
    decodeEmail = decoded.Email
    decodeCode = decoded.Code
  })
  try {
    await db.none('UPDATE man.users SET password_hash = $1, reset_code = NULL WHERE email = $2 AND reset_code = $3', [newPassword, decodeEmail, decodeCode])
    res.status(200).json({ message: 'Got it' })
  } catch (error) {
    console.error(error)
    res.status(501).json({ error: 'Database error' })
  }
}

export const verefiEmailCode = async (req: Request, res: Response) => {
  const { reg_token, code } = req.body
  let email
  if (!reg_token || !code) {
    res.status(403).json()
    return
  }

  jwt.verify(reg_token, SECRET_KEY, (err: any, decoded: any) => {
    if (err) {
      res.status(403).json({ message: 'Invalid token' })
      return
    }
    email = decoded.Email
  })

  const user = await redis.hgetall(`email_ver:${email}`)
  if (code === user.redCode) {
    res.status(200).json({ message: 'Accept reg' })
    try {
      const fio: string = user.redName + ' ' + user.redLastName
      let result = await db.one('SELECT MAX(id) FROM man.users')
      const futureId = 'id_' + (result.max + 1)
      await db.none('INSERT INTO man.users(username, email, password_hash, fio) VALUES($1, $2, $3, $4)', [futureId, email, user.redPass, fio])
    } catch (error) {
      console.error(error)
      res.status(501).json({ error: 'Database error' })
    }
  } else {
    res.status(403).json({ message: 'Invalid code' })
    return
  }
}
