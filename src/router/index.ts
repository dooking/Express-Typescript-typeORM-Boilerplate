import { Router } from 'express'
import { User } from '../entity/user'
const router = Router()

router.get('/', async (req, res, next) => {
  const users = await User.find({ nickName: 'java' })
  console.log('users : ', users)
  res.send('world')
})

export default router
