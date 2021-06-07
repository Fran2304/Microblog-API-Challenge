import { Router } from 'express'
import * as controller from '../controllers/post.controller'

const router = Router()

router.route('/').get(controller.getPosts)
router.route('/:id').get(controller.readPost)

export default router
