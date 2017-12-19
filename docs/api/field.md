# `<Field/>`

[View source on GitHub](https://github.com/thebearingedge/super-controls/blob/master/src/field.js)

### Fundamentals

The `Field` component is a wrapper used to connect a form control it to its parent [`Form`]() component. Basics of `Field` are as follows:

1. Pass it a **required** [`name`](#name-stringnumber-required) prop to link it to a value in your form values. `name` can be a `String` that corresponds to an `Object` property in your form values, or a `Number` that corresponds to an `Array` index within your form values.
2. Pass it a **required** [`component`](#component-componentfunctionstring-required) prop to define its rendered output. `component` may the `tagName` of a form control element (_e.g._ `"input"`, `"textarea"`) or a [Functional or Class Component](https://reactjs.org/docs/components-and-props.html#functional-and-class-components).
3. Pass it an **optional** [`init`](#init-any-optional) prop to give it a default initial value in the form.

### Importing

`Field` is a top-level export of `super-controls`.

```js
// ES Module syntax
import { Field } from 'super-controls'

// CommonJS Module syntax
const { Field } = require('super-controls')
```

```html
<!-- UMD property -->
<script src="https://unpkg.com/super-controls/umd/super-controls.js"></script>
<script>
  const { Field } = SuperControls
</script>
```

### `<Field/>` props

The following props can be passed to the `Field` component.

#### `name: (String|Number)` required

The `name` prop passed to `Field` is used to determine the position of its value in the form state. `name` is **not** written in any special syntax, it is simply a key corresponding to an `Object` property (`String`) or `Array` index (`Number`). The nesting of a `Field`'s value in the form state is determined by its nesting in the component tree. For nested `Field` values, reference the documentation for the [`FieldSet`]() and [`FieldArray`]() components.

#### `component: (Component|Function|String)` required

The `component` prop defines the control to be rendered by the `Field`. This can be an element `tagName` (_e.g._ `"input"`, `"textarea"`), a stateless Functional Component, or a stateful Class Component.

#### `init: Any` optional

The initial value of the `Field`'s control. If the parent `Form` component has already been initialized with a value for the `Field`, this prop is ignored.

#### `id: (String|Boolean)` optional

The `id` attribute used for the `Field`'s control element. If `id` is a `String`, it will be merged as-is into the `Field`'s [control model](#control-object). However, if `id` is `true`, the control model will be given an `id` property equal to the `Field`'s [`name`](name-stringnumber-required) prop. This helps cut down on repetitive markup used to link `label` elements to form controls in otherwise concise `Field` elements.

#### `type: String` optional

Primarily used to determine whether a control is ["checkable"](#controlchecked-boolean-optional). This prop is merged into the `Field`'s [control model](#control-object).

#### `validate: (value, allValues) -> error` optional

A **synchronous** validation `Function`. `validate` is passed the value of the `Field` and all  values in the form. `validate` should return a [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) result if the `Field`'s value is invalid. A simple pattern is to return a non-empty `String` error message, but the result's type is arbitrary and the `Field` will be treated as invalid so long as the result is truthy.

#### `notify: (value, allValues) -> notice` optional

A **synchronous** notification `Function`. `notify` is passed the value of the `Field` and all values in the form. `notify` should return a [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) result if the `Field`'s value is note-worthy. A simple pattern is to return a non-empty `String` "warning" or "success" message, but the result's type is arbitrary.

#### `format: value -> formatted` optional

A `Function` that formats the value from the form state before it is rendered by the `Field`. Typically used to compute a `String` representation of the value (_e.g._ `Date` or `Number`) before it is rendered into a control. If omitted, the value is passed along unmodified.

#### `parse: formatted -> parsed` optional

A `Function` that parses the new, [**formatted**](#format-value---formatted-optional) value of the `Field`'s control before it is sent to the form state. Typically used to preserve the data type (_e.g._ `Date` or `Number`) of the value in the form state when it was rendered into a control as a `String`. If omitted, the value is passed along unmodified.

#### `override: (parsed, allValues) -> overridden` optional

A `Function` that overrides the new, [**parsed**](#parse-formatted---parsed-optional) value of the `Field` before it is sent to the form state. Typically used to enforce constraints on the value such as range or referential integrity checks. If omitted, the value is passed along unmodified.

### `<Field component/>` props

The following props are passed to a `Field`'s [`component` prop](#component-componentfunctionstring-required).

#### `control: Object`

A form control model including element attributes and event listeners. Can be conveniently spread into a form control element's props.

##### `control.name: (String|Number)`

The [`name` prop](#name-stringnumber-required) passed to the `Field`.

##### `control.value: Any` optional

The [formatted](#format-value---formatted-optional) value of the `Field` in the form. If the parent `Form` component was not initialized with a value for the `Field`, then `control.value` will start as the `Field`'s [`init` prop](#init-any-optional). If the parent `Form` component was not initialized with a value for the `Field` _and_ no `init` prop was passed to the `Field`, then `control.value` will start as an empty `String`. This property is omitted if the `Field` has a [type prop](#type-string-optional) of `"checkbox"`.

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

The [`name` prop](#name-stringnumber-required) that was passed to the `Field`.

##### `field.init: Any`

The [`init` prop](#init-any-optional) passed to the `Field` or the superseding initial value in its parent `Form` component.

##### `field.value: Any`

The current value of the `Field` in the form.

##### `field.error: Any`

The truthy value returned from the `Field`'s [`validate` prop](#validate-value-allvalues---error-optional) the last time it was called. Otherwise `null`.

##### `field.notice: Any`

The truthy value returned from the `Field`'s [`notify` prop](#notify-value-allvalues---notice-optional) the last time it was called. Otherwise `null`.

##### `field.isFocused: Boolean`

`true` if the `Field` currently has focus.

##### `field.isVisited: Boolean`

`true` if the `Field` has _ever_ had focus.

##### `field.isTouched: Boolean`

`true` if the `Field`'s control has ever fired a `blur` event.

##### `field.isDirty: Boolean`

`true` if the `Field`'s current value does not deeply equal its initial value.

##### `field.isPristine: Boolean`

The opposite of `isDirty`.

##### `field.isValid: Boolean`

`true` if `field.error` is truthy.

##### `field.isInvalid: Boolean`

The opposite of `isValid`.

#### `...ownProps`

The props passed to the `Field` not specified in [`<Field/>` props](#field-props) are forwarded to your `component` at the same level as the [`control` model](#control-object) and [`field` model](#field-object) props.


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
