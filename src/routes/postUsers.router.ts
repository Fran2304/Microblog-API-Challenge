import { Router } from 'express'
import * as controller from '../controllers/post.controller'

const router = Router({ mergeParams: true })

router.route('/').post(controller.createPost)

router
    .route('/:postId')
    .patch(controller.updatePost)
    .delete(controller.deletePost)

export default router
