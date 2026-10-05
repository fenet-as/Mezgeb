import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import husky from 'husky'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
process.chdir(repositoryRoot)

const result = husky()

if (result) {
  console.error(result)
  process.exitCode = 1
}
