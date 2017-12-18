# `<Field/>`

[View source on GitHub](https://github.com/thebearingedge/super-controls/blob/master/src/field.js)

### Fundamentals

The `Field` component is a wrapper used to connect a control it to its parent [`Form`](). Basic usage of `Field` is as follows.

1. Pass it a **required** [`name`](#name-stringnumber-required) prop to link it to a value in your form values. `name` can be a `String` that corresponds to an `Object` property in your form values, or a `Number` that corresponds to an `Array` index within your form values.
2. Pass it a **required** [`component`](#component-componentfunctionstring-required) prop to define its rendered control. `component` can be a `String` (_e.g._ `input`, `textarea`) or a [Functional/Class Component](https://reactjs.org/docs/components-and-props.html#functional-and-class-components).
3. Pass it an **optional** [`init`](#init-any-optional) prop to initialize the form with a default value for the control.
4. Other props are forwarded to the aforementioned `component` prop.

### Importing

`Field` is a top-level export of Super Controls and can be accessed via the package's root.

```js
// ES Module syntax
import { Field } from 'super-controls'

// CommonJS Module syntax
const { Field } = require('super-controls')
```

To be more explicit about the code you are importing from Super Controls, reference the build directory in your `import/require` statement. In most cases this is not necessary, but it may help reduce the size of your build.

```js
// ES Module syntax
import { Field } from 'super-controls/es/field'

// CommonJS Module syntax
const { Field } = require('super-controls/cjs/field')
```

`Field` is also a top-level property of the UMD builds.

```html
<script src="https://unpkg.com/super-controls/umd/super-controls.js"></script>
<script>
  const { Field } = SuperControls
</script>
```

### `<Field/>` props

The following props can be passed to the `Field` component.

#### `name: (String|Number)` required

The `name` prop passed to `Field` is used to link a control to a value in the form values. `name` is **_not_** written in any special syntax, it is simply a key corresponding to an `Object` property (`String`) or `Array` index (`Number`). The position of a `Field`'s value in the form values is determined by its position in the Super Control component tree. For nested and namespaced form values, reference the documentation for the [`FieldSet`]() and [`FieldArray`]() components.

#### `component: (Component|Function|String)` required

The `component` prop determines the control to be rendered by the `Field`. This can be a stateless Functional Component, a stateful Class Component or an element `tagName`.

#### `init: Any` optional

The initial value of the `Field`'s control. If the parent `Form` component has already been initialized with a value for the `Field`, this prop is ignored.

#### `id: (String|Boolean)` optional

The `id` attribute used for the `Field`'s control element. If `id` is a `String`, it will be forwarded as-is to the `Field`'s [control model](#control-object). However, if `id` is `true`, the control model will be given an `id` property equal to the `Field`'s [`name`](name-stringnumber-required) prop. This can help cut down on repetitive markup used to link `label` elements to form controls.

#### `type: String` optional

Used to determine whether a control is "checkable". This prop is forwarded to the `Field`'s [control model](#control-object).

#### `validate: (value, allValues) -> error` optional

A synchronous validation function. `validate` is passed the value of the `Field` and all  values in the form. `validate` should return a [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) result if the `Field`'s value is invalid. A simple pattern is to return a non-empty `String` error message, but the result's type is arbitrary so long as it is truthy.

#### `notify: (value, allValues) -> notice` optional

A synchronous notification function. `notify` is passed the value of the `Field` and all values in the form. `notify` should return a [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) result if the `Field`'s value is note-worthy. A simple pattern is to return a non-empty `String` "warning" or "success" message, but the result's type is arbitrary so long as it is truthy.

### `<Field component/>` props

The following props are passed to the [`component`](#component-componentfunctionstring-required) specified in a `Field`'s props. These props fall into three categories:
1. The [`control` model](#control-object).
2. The [`field` model](#field-object).
3. [Own props](#rest-object).

#### `control: Object`

A form control model including element attributes and event listeners. Can be spread into a form control element's props.

##### `control.name: (String|Number)`

The [`name` prop](#name-stringnumber-required) passed to the `Field`.

##### `control.value: Any`

The current value of the `Field` in the form. If the parent `Form` component was not initialized with a value for the `Field`, then `control.value` will start as the `Field`'s [`init` prop](#init-any-optional). If the parent `Form` component was not initialized with a value for the `Field` _and_ no `init` prop was passed to the `Field`, then `control.value` will start as an empty `String` or a `Boolean` depending whether the `Field` is of [type](#type-string-optional) `"checkbox"`.

##### `control.onChange: event -> undefined`

A callback `Function` that handles `change` events to update the `Field`'s [value](#fieldvalue-any) in the form. Triggers the `Field`'s [`validate`](#validate-value-allvalues---error-optional) and [`notify`](#notify-value-allvalues---notice-optional) functions.

##### `control.onFocus: event -> undefined`

A callback `Function` that handles `focus` events to set the currently focused field in the form and record that the `Field` has been [visited](#fieldisvisited-boolean).

##### `control.onBlur: event -> undefined`

A callback `Function` that handles `blur` events to record whether the `Field` has been [touched](#fieldistouched-boolean) and unset the currently focused field in the form. Triggers the `Field`'s [`validate`](#validate-value-allvalues---error-optional) and [`notify`](#notify-value-allvalues---notice-optional) functions.

##### `control.type: String` optional

The [`type` prop](#type-string) passed to `Field`.

##### `control.checked: Boolean` optional

Present if the `Field` is of [type](#type-string-optional) `"checkbox"` or `"radio"`.

#### `field: Object`

A field model containing the current state of the `Field` in the parent `Form` component.

##### `field.name: (String|Number)`

The [`name` prop](#name-stringnumber-required) passed to the `Field`.

##### `field.init: Any`

The [`init` prop](#init-any-optional) passed to the `Field` or the overriding initial value in its parent `Form` component.

##### `field.value: Any`

The current value of the `Field` in the form.

##### `field.error: Any`

The truthy value returned from the `Field`'s [`validate` prop](#validate-value-allvalues---error-optional) the last time it was triggered. Otherwise `null`.

##### `field.notice: Any`

The truthy value returned from the `Field`'s [`notify` prop](#notify-value-allvalues---notice-optional) the last time it was triggered. Otherwise `null`.

##### `field.isFocused: Boolean`

`true` if the `Field` currently has focus.

##### `field.isVisited: Boolean`

`true` if the `Field` has _ever_ had focus.

##### `field.isTouched: Boolean`

`true` if the `Field`'s control has ever fired a `blur` event.

##### `field.isDirty: Boolean`

`true` if the `Field`'s current value does not deeply equal its initial value.

##### `field.isPristine: Boolean`

The opposite of `isDirty`

##### `field.isValid: Boolean`

`true` if the `Field`'s current value passes validation.

##### `field.isInvalid: Boolean`

The opposite of `isValid`

#### `...ownProps: Object`

The "own props" passed to the `Field`, forwarded to your `component`. These props are merged at the same level as the `control` and `field` models.


### Usage

The `Field` component is a wrapper used to connect a control it to its parent [`Form`](). A `Field` _must_ be rendered within a `Form`'s component tree.

#### Rendering an Element by Type

##### JSX

```jsx
<Form name='login'>
  <Field name='username' component='input' type='text'/>
  <Field name='password' component='input' type='password'/>
</Form>
```

##### DOM

```html
<form name="login">
  <input type="text" name="username" value=""/>
  <input type="password" name="password" value=""/>
</form>
```

#### Rendering a Component

##### JSX

```jsx
function CustomInput({ field, control, label, ...props }) {
  return (
    <div className='form-group'>
      <label htmlFor={control.id}>{ label }</label>
      <input {...control} {...props} className='form-control'/>
    </div>
  )
}

<Form name='signup'>
  <Field
    id
    name='email'
    type='email'
    component={CustomInput}
    label='Enter your email'
    placeholder='email@example.org'/>
</Form>
```

##### DOM

```html
<form name="signup">
  <div class="form-group">
    <label for="email">Enter your email</label>
    <input
      value=""
      id="email"
      name="email"
      type="email"
      class="form-control"
      placeholder="email@example.org"/>
  </div>
</form>
```
