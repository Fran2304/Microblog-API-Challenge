import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import { getComments, readComment } from '../controllers/comment.controller'

const router = Router({ mergeParams: true })

router.route('/').get(asyncHandler(getComments))
router.route('/:commentId').get(asyncHandler(readComment))

export default router
