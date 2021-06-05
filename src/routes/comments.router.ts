import { Router } from 'express'
import * as controller from '../controllers/comment.controller'

const router = Router({ mergeParams: true })

router.route('/').get(controller.getComments).post(controller.createComment)

router
    .route('/:id')
    .get(controller.readComment)
    .patch(controller.updateComment)
    .delete(controller.deleteComment)

export default router
