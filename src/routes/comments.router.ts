import { Router } from 'express'
import * as controller from '../controllers/comment.controller'

const router = Router({ mergeParams: true })

router.route('/').get(controller.getComments).post(controller.postComment)

router
    .route('/:id')
    .get(controller.getComment)
    .patch(controller.updateComment)
    .delete(controller.deleteComment)

export default router
