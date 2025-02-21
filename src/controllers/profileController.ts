import express, { Express, Request, Response } from 'express'
const dotenv = require('dotenv')
import jwt from 'jsonwebtoken'
dotenv.config()
import db from '../database/db'
const SECRET_KEY = process.env.SECRET_KEY || 'test'

// 1. GET: Получение данных о юзере из бд
export const user_profile_data = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    res.status(403).json({ message: 'No Token' })
    return
  }

  jwt.verify(token, SECRET_KEY, async (err, decoded) => {
    if (err) {
      res.status(403).json({ message: 'Invalid token' })
      return
    }
    const userData = decoded as { name?: string }
    try {
      const user = await db.any('SELECT fio, bio FROM man.users WHERE username = $1', [userData.name])
      res.json({ message: 'Protected data accessed!', user })
    } catch (error) {
      console.error(error)
      res.status(501).json({ error: 'Database error' })
    }
  })
}
