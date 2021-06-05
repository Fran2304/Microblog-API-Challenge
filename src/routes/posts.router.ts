import { Router } from 'express'
import * as controller from '../controllers/post.controller'

const router = Router({ mergeParams: true })

router.route('/').get(controller.getPosts).post(controller.createPost)

router
    .route('/:id')
    .get(controller.readPost)
    .patch(controller.updatePost)
    .delete(controller.deletePost)

export default router
