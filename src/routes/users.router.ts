import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import { updateUser } from '../controllers/user.controllers'
const router = Router({ mergeParams: true })

router.route('/')
router.route('/:id').patch(asyncHandler(updateUser))

export default router
