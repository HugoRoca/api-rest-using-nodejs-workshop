import path from 'path'
import * as swagger from 'swagger2'
import { ui } from 'swagger2-koa'

const docFile = path.join(__dirname, 'docs.yaml')

const document = swagger.loadDocumentSync(docFile)

export default ui(document, '/docs')
