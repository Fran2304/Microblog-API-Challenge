import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import { updateUser, readUser } from '../controllers/user.controllers'
const router = Router()

router.route('/').get(asyncHandler(readUser)).patch(asyncHandler(updateUser))

export default router
