import { Router } from 'express'
import * as controller from '../controllers/comment.controller'

const router = Router({ mergeParams: true })

router.route('/').get(controller.getComments)
router.route('/:commentId').get(controller.readComment)

export default router
