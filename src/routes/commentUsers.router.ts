import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import {
    createComment,
    updateComment,
    deleteComment,
} from '../controllers/comment.controller'

const router = Router({ mergeParams: true })

router.route('/').post(asyncHandler(createComment))

router
    .route('/:commentId')
    .patch(asyncHandler(updateComment))
    .delete(asyncHandler(deleteComment))

export default router
