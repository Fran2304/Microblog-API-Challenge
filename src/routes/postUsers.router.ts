import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import {
    createPost,
    updatePost,
    deletePost,
} from '../controllers/post.controller'

const router = Router({ mergeParams: true })

router.route('/').post(asyncHandler(createPost))

router
    .route('/:postId')
    .patch(asyncHandler(updatePost))
    .delete(asyncHandler(deletePost))

export default router
