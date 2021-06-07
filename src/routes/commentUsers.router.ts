import { Router } from 'express'
import * as controller from '../controllers/comment.controller'

const router = Router({ mergeParams: true })

router.route('/').post(controller.createComment)

router
    .route('/:commentId')
    .patch(controller.updateComment)
    .delete(controller.deleteComment)

export default router
