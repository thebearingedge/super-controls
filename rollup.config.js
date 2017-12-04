import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import commonjs from 'rollup-plugin-commonjs'

const config = {
  input: 'src/index.js',
  name: 'Controlled',
  sourcemap: true,
  globals: {
    'react': 'React',
    'prop-types': 'PropTypes'
  },
  external: ['react', 'prop-types'],
  plugins: [
    babel({
      exclude: '/node_modules/**'
    }),
    commonjs({
      include: /node_modules/
    })
  ]
}

process.env.NODE_ENV === 'production' && config.plugins.push(uglify())

export default config
