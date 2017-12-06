## Installation

### npm

```
npm install --save super-controls
```

`super-controls` ships with both ES modules and CommonJS modules. Bundlers like [Rollup](https://rollupjs.org/) and [Webpack 2+](https://webpack.js.org/) will `import` the ES modules by default. Tools like [Browserify](http://browserify.org/) will find the CommonJS modules with `require`.

##### ES2015 `import` Syntax

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { Form, Field } from 'super-controls'
```

##### CommonJS `require` Syntax

```js
const React = require('react')
const ReactDOM = require('react-dom')
const { Form, Field } = require('super-controls')
```

### unpkg

Development and production builds of `super-controls` are made available as a UMD bundle through [unpkg](https://unpkg.com/#/). Set the `src` attribute of your `script` tag to load the desired package. `super-controls` has a couple of dependencies that need to be loaded first.

```html
<!DOCTYPE html>
<html>
<body>
  <script src="https://unpkg.com/prop-types@^15/prop-types.min.js"></script>
  <script src="https://unpkg.com/react@^16/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@^16/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/super-controls/umd/super-controls.min.js"></script>
  <script>
    const { Form, Field } = SuperControls
  </script>
</body>
</html>
```
