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
