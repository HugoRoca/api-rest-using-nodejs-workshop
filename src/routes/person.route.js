import KoaRouter from 'koa-router'
import PersonController from '../controllers/person.controller'
import personSchemas from '../schemas/person.schema'
import schemaValidator from '../utils/schema-validator'

const router = new KoaRouter({ prefix: '/person' })
const controller = new PersonController()
const byIndexValidator = schemaValidator({ params: personSchemas.byIndex })
const byQueryValidator = schemaValidator({ params: personSchemas.byQuery })
const postValidator = schemaValidator({ body: personSchemas.post })
const deleteValidator = schemaValidator({ params: personSchemas.deleteByIndex })

router.get('/person/byIndex', '/:index', byIndexValidator, controller.getByIndex)
router.get('/person/byQuery', '/:country/:gender/:rows?/:page?', byQueryValidator, controller.getByQuery)
router.post('/person/post', '/', postValidator, controller.save)
router.delete('/person/delete', '/:index', deleteValidator, controller.delete)

export default router
