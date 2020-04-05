import KoaRouter from 'koa-router'
import PersonController from '../controllers/person.controller'
const router = new KoaRouter({ prefix: '/person' })
const controller = new PersonController()

router.get('/person/byIndex', '/:index', controller.getByIndex)

export default router
