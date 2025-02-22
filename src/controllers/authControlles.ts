import express, { Express, Request, Response } from 'express'
import crypto from 'crypto'
import * as bip39 from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english'
const dotenv = require('dotenv')
import jwt from 'jsonwebtoken'
dotenv.config()
import db from '../database/db'
const SECRET_KEY = process.env.SECRET_KEY || 'test'
const SECRET_SALT = process.env.SECTER_SATL || 'test'

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
        const fio: string = name + ' ' + lastName
        let result = await db.one('SELECT MAX(id) FROM man.users')
        const futureId = 'id_' + (result.max + 1)
        console.log(futureId)

        const entropeBytes = crypto.randomBytes(16)
        const userHash = crypto
          .createHash('sha256')
          .update(futureId + SECRET_SALT)
          .digest()
        const entropyFinal = Buffer.from(entropeBytes.map((byte, i) => byte ^ userHash[i % userHash.length]))
        const seefFraz = bip39.entropyToMnemonic(entropyFinal, wordlist)
        console.log('Финал энтропии: ', entropyFinal)
        console.log('Финальная фраза:', seefFraz)

        decod(seefFraz)
        //await db.none('INSERT INTO man.users(username, email, password_hash, fio) VALUES($1, $2, $3, $4)', [futureId, email, password, fio])
        // const token = jwt.sign({ email: email }, SECRET_KEY, { expiresIn: '5s' })
        // res.json({ message: `Рега успешная`, token })
        // console.log('Юзер создан, с таким email: ', email)
      }
    } catch (error) {
      console.error(error)
      res.status(501).json({ error: 'Database error' })
    }
  }
}

const decod = (fraze: string) => {
  const users = ['id_72', 'id_73']
  const ent = Buffer.from(bip39.mnemonicToEntropy(fraze, wordlist))
  console.log('Фраза в цифры:', ent)
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
