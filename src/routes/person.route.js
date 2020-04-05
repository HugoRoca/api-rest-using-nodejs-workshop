const KoaRouter = require('koa-router')
const PersonController = require('../controllers/person.controller')
const router = new KoaRouter({ prefix: '/person' })
const controller = new PersonController()

router.get('/person/byIndex', '/:index', controller.getByIndex)

module.exports = router
