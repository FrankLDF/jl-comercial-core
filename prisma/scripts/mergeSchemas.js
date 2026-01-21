import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const prismaDir = path.join(__dirname, '..')
const modulesDir = path.join(prismaDir, 'modules')

const baseSchema = fs.readFileSync(path.join(prismaDir, 'base.prisma'), 'utf-8')

const moduleSchemas = fs
  .readdirSync(modulesDir)
  .filter((file) => file.endsWith('.prisma'))
  .map((file) => fs.readFileSync(path.join(modulesDir, file), 'utf-8'))
  .join('\n\n')

const finalSchema = `${baseSchema}\n\n${moduleSchemas}`

fs.writeFileSync(path.join(prismaDir, 'schema.prisma'), finalSchema)

console.log('✅ Prisma schema generado correctamente')
