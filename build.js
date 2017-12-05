import gzipSize from 'gzip-size'
import { readFileSync } from 'fs'
import prettyBytes from 'pretty-bytes'
import { execSync } from 'child_process'

const exec = (cmd, env) =>
  execSync(cmd, {
    stdio: 'inherit',
    env: { ...process.env, ...env }
  })

console.log('Building ES modules...')

exec('babel src/ -d es/', {
  BABEL_ENV: 'es'
})

console.log('\nBuilding CommonJS modules...')

exec('babel src/ -d cjs/', {
  BABEL_ENV: 'cjs'
})

console.log('\nBuilding UMD super-controls.js...')

exec('rollup -c -f umd -o umd/super-controls.js', {
  BABEL_ENV: 'umd',
  NODE_ENV: 'development'
})

console.log('\nBuilding UMD super-controls.min.js...')

exec('rollup -c -f umd -o umd/super-controls.min.js', {
  BABEL_ENV: 'umd',
  NODE_ENV: 'production'
})

const min = readFileSync('umd/super-controls.min.js', 'utf8')
const size = gzipSize.sync(min)
const bytes = prettyBytes(size)

console.log('\nThe gzipped UMD bundle size is %s.', bytes)
