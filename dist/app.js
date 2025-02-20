"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv = require('dotenv');
dotenv.config();
const auth_1 = __importDefault(require("./routes/auth"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
const SECRET_KEY = process.env.SECRET_KEY || 'test';
const path = require('path');
app.use(express_1.default.static(path.join(__dirname, '../public')));
app.use(express_1.default.json());
app.use('/auth', auth_1.default);
// app.post('/login', async (req: Request, res: Response) => {
//   const { username, password } = req.body
//   if (username && password) {
//     const user = await db.any('SELECT username FROM man.users WHERE password_hash = $1', [password])
//     console.log(user)
//     const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '5s' })
//     res.json({ message: 'Login successful', token })
//   } else {
//     res.status(401).json({ message: 'Invalid credentials' })
//   }
// })
// app.post('/base', (req: Request, res: Response) => {
//   const { token } = req.body
//   console.log(token)
//   if (!token) {
//     res.status(401).json({ message: 'Invalid credentials' })
//   }
//   jwt.verify(token, SECRET_KEY, (err: any, decode: any) => {
//     if (err) {
//       res.status(403).json({ message: 'Invalid token' })
//     }
//     res.status(201).json({ message: 'Suck', user: decode })
//   })
// })
// app.post('/register', async (req: Request, res: Response) => {
//   const { username, password } = req.body
//   if (username && password) {
//     try {
//       const newUser = await db.none('INSERT INTO man.users(username, password_hash, email) VALUES($1, $2, $3)', [username, password, username])
//       const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '5s' })
//       console.log(`ТОКЕННН`, token)
//       res.json({ message: 'Reg successful', token })
//     } catch (error) {
//       console.error(error)
//       res.status(500).json({ error: 'Database error' })
//     }
//   } else {
//     res.status(401).json({ message: 'Invalid credentials' })
//   }
// })
app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
