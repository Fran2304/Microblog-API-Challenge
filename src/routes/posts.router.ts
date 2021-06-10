import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import { getPosts, readPost } from '../controllers/post.controller'

const router = Router()

router.route('/').get(asyncHandler(getPosts))
router.route('/:id').get(asyncHandler(readPost))

export default router
