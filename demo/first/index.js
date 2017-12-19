(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _reactDom = (typeof window !== "undefined" ? window['ReactDOM'] : typeof global !== "undefined" ? global['ReactDOM'] : null);

var _form = require('../../src/form');

var _field = require('../../src/field');

var _fieldSet = require('../../src/field-set');

var _fieldArray = require('../../src/field-array');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } /* eslint-disable react/prop-types */


const handleSubmit = values => console.log(JSON.stringify(values, null, 2));

const validateUsername = (value = '') => value.trim().length < 3 && 'Username must be at least 3 characters long';

const notifyUsername = value => value.length > 5 && 'That is a great username!';

const Username = (_ref) => {
  let { field, control } = _ref,
      props = _objectWithoutProperties(_ref, ['field', 'control']);

  return _react2.default.createElement(
    _react.Fragment,
    null,
    _react2.default.createElement(
      'div',
      { className: 'form-group' },
      _react2.default.createElement(
        'label',
        { htmlFor: control.id },
        'Username'
      ),
      _react2.default.createElement('input', _extends({ type: 'text', className: 'form-control' }, control))
    ),
    field.isInvalid && (field.isTouched || field.form.submitFailed) && _react2.default.createElement(
      'div',
      { className: 'alert alert-danger' },
      field.error
    ),
    field.isValid && field.notice && _react2.default.createElement(
      'div',
      { className: 'alert alert-success' },
      field.notice
    )
  );
};

(0, _reactDom.render)(_react2.default.createElement(
  _form.Form,
  {
    name: 'signUp',
    onSubmit: handleSubmit,
    className: 'container' },
  _react2.default.createElement(
    'legend',
    null,
    'Join Up!'
  ),
  _react2.default.createElement(_field.Field, {
    id: true,
    name: 'username',
    component: Username,
    notify: notifyUsername,
    validate: validateUsername }),
  _react2.default.createElement(
    _fieldSet.FieldSet,
    { name: 'contactInfo', className: 'form-group' },
    _react2.default.createElement(
      'legend',
      null,
      _react2.default.createElement(
        'small',
        null,
        'Contact Info'
      )
    ),
    _react2.default.createElement(
      'label',
      { htmlFor: 'email' },
      'Email'
    ),
    _react2.default.createElement(_field.Field, {
      id: true,
      name: 'email',
      component: 'input',
      className: 'form-control' })
  ),
  _react2.default.createElement(
    _fieldArray.FieldArray,
    { name: 'friends' },
    ({ fields }) => _react2.default.createElement(
      'div',
      { className: 'form-group' },
      _react2.default.createElement(
        'legend',
        null,
        _react2.default.createElement(
          'small',
          null,
          'Friends (',
          fields.length,
          ')'
        )
      ),
      fields.map((friend, index) => _react2.default.createElement(
        _fieldSet.FieldSet,
        { name: index, key: index },
        _react2.default.createElement(
          'div',
          { className: 'input-group form-group' },
          _react2.default.createElement(_field.Field, {
            type: 'text',
            name: 'name',
            component: 'input',
            placeholder: 'Name',
            className: 'form-control' }),
          _react2.default.createElement(
            'span',
            { className: 'input-group-btn' },
            _react2.default.createElement(
              'button',
              {
                type: 'button',
                onClick: _ => fields.remove(index),
                className: 'btn btn-secondary' },
              _react2.default.createElement('i', { className: 'oi oi-x' })
            )
          )
        )
      )),
      _react2.default.createElement(
        'button',
        {
          type: 'button',
          onClick: _ => fields.push({ name: '' }),
          className: 'btn btn-outline-success' },
        _react2.default.createElement('i', { className: 'oi oi-plus' })
      )
    )
  ),
  _react2.default.createElement(
    'button',
    { type: 'reset', className: 'btn btn-outline-secondary' },
    'Reset'
  ),
  ' ',
  _react2.default.createElement(
    'button',
    { type: 'submit', className: 'btn btn-primary' },
    'Sign Up'
  )
), document.querySelector('#app'));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../src/field":4,"../../src/field-array":2,"../../src/field-set":3,"../../src/form":5}],2:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.modelFieldArray = exports.FieldArray = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _propTypes = (typeof window !== "undefined" ? window['PropTypes'] : typeof global !== "undefined" ? global['PropTypes'] : null);

var _fieldSet = require('./field-set');

var _util = require('./util');

var _ = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

class FieldArray extends _fieldSet.FieldSet {
  modelField(...args) {
    return modelFieldArray(...args);
  }
  render() {
    const _props = this.props,
          { component, children } = _props,
          props = _objectWithoutProperties(_props, ['component', 'children']);
    return (0, _react.createElement)(component || children, _extends({}, props, {
      fields: this.model.toProp()
    }));
  }
  static get propTypes() {
    return _extends({}, super.propTypes, {
      init: _propTypes.array,
      children: _propTypes.func,
      component: _propTypes.func
    });
  }
  static get defaultProps() {
    return {
      init: [],
      children: _ => null
    };
  }
}

exports.FieldArray = FieldArray;
class FieldArrayModel extends _fieldSet.FieldSetModel {
  constructor(...args) {
    super(...args);
    this.fields = [];
    this.insert = this.insert.bind(this);
    this.remove = this.remove.bind(this);
    this.push = this.push.bind(this);
    this.pop = this.pop.bind(this);
    this.unshift = this.unshift.bind(this);
    this.shift = this.shift.bind(this);
    this.map = this.map.bind(this);
  }
  get visited() {
    return this.form.getVisited(this.path, []);
  }
  get touched() {
    return this.form.getTouched(this.path, []);
  }
  get length() {
    return this.value.length;
  }
  toProp() {
    return _.assign(super.toProp(), _.pick(this, ['insert', 'remove', 'push', 'pop', 'unshift', 'shift', 'map', 'length']));
  }
  insert(index, newValue) {
    const { form, path, init, value, touched } = this;
    form.update(path, {
      init: _.sliceIn(init, index, newValue),
      value: _.sliceIn(value, index, newValue),
      isTouched: _.set(touched, [index], void 0)
    });
  }
  remove(index) {
    const { form, path, init, value, touched } = this;
    form.update(path, {
      init: _.sliceOut(init, index),
      value: _.sliceOut(value, index),
      isTouched: _.sliceOut(touched, index)
    });
  }
  push(newValue) {
    this.insert(this.length, newValue);
  }
  pop() {
    this.remove(this.length - 1);
  }
  unshift(newValue) {
    this.insert(0, newValue);
  }
  shift() {
    this.remove(0);
  }
  map(transform) {
    return this.value.map((value, index) => transform(value, index, this));
  }
}

const modelFieldArray = exports.modelFieldArray = (...args) => new FieldArrayModel(...args);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./field-set":3,"./util":7}],3:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.modelFieldSet = exports.FieldSetModel = exports.FieldSet = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _propTypes = (typeof window !== "undefined" ? window['PropTypes'] : typeof global !== "undefined" ? global['PropTypes'] : null);

var _util = require('./util');

var _ = _interopRequireWildcard(_util);

var _superControl = require('./super-control');

var SuperControl = _interopRequireWildcard(_superControl);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

class FieldSet extends SuperControl.View {
  constructor(...args) {
    super(...args);
    this.ownProps = _.omit(this.props, ['init', 'notify', 'validate', 'component']);
  }
  getInit() {
    return this.props.init;
  }
  modelField(...args) {
    return modelFieldSet(...args);
  }
  render() {
    const { props: { name, component }, ownProps: props } = this;
    if (_.isString(component)) {
      return (0, _react.createElement)(component, _extends({}, props, { name }));
    }
    return (0, _react.createElement)(component, _extends({}, props, {
      name,
      fields: this.model.toProp()
    }));
  }
  static get propTypes() {
    return _extends({}, super.propTypes, {
      init: _propTypes.object,
      component: (0, _propTypes.oneOfType)([_propTypes.string, _propTypes.func]).isRequired
    });
  }
  static get defaultProps() {
    return _extends({}, super.defaultProps, {
      init: {},
      component: 'fieldset'
    });
  }
}

exports.FieldSet = FieldSet;
class FieldSetModel extends SuperControl.Model {
  constructor(...args) {
    super(...args);
    this.fields = {};
    this.checkAll = this.checkAll.bind(this);
  }
  get visited() {
    return this.form.getVisited(this.path, {});
  }
  get touched() {
    return this.form.getTouched(this.path, {});
  }
  get isTouched() {
    return _.someValues(this.touched, _.id);
  }
  toState() {
    return _.pick(this, ['init', 'value', 'touched', 'error', 'notice', 'visited']);
  }
  toProp() {
    const name = this.path.pop();
    const state = this.toState();
    const { form, isTouched } = this;
    const isValid = !state.error;
    const isInvalid = !isValid;
    const isDirty = !_.deepEqual(state.init, state.value);
    const isPristine = !isDirty;
    return _.assign(state, {
      form, name, isValid, isInvalid, isDirty, isPristine, isTouched
    });
  }
  register(field, [key, ...path]) {
    this.fields = path.length ? _.set(this.fields, [key], this.fields[key].register(field, path)) : _.set(this.fields, [key], field);
    return this;
  }
  check(value, values, method, [key, ...path]) {
    return _.assign(super.check(_.set(this.value, [key, ...path], value), values, method), this.fields[key].check(value, values, method, path));
  }
  checkAll(value, values, method) {
    return _.keys(this.fields).reduce((checked, key) => {
      const { check, checkAll } = this.fields[key];
      return _.assign(checked, (checkAll || check)(values[key], values, method));
    }, { [this.id]: this[`_${method}`](value, values) || null });
  }
}

exports.FieldSetModel = FieldSetModel;
const modelFieldSet = exports.modelFieldSet = (...args) => new FieldSetModel(...args);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./super-control":6,"./util":7}],4:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.modelField = exports.FieldModel = exports.Field = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _propTypes = (typeof window !== "undefined" ? window['PropTypes'] : typeof global !== "undefined" ? global['PropTypes'] : null);

var _util = require('./util');

var _ = _interopRequireWildcard(_util);

var _superControl = require('./super-control');

var SuperControl = _interopRequireWildcard(_superControl);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

class Field extends SuperControl.View {
  constructor(...args) {
    super(...args);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onChange = this.onChange.bind(this);
    this.ownProps = _.omit(this.props, ['id', 'name', 'init', 'type', 'value', 'parse', 'format', 'override', 'notify', 'validate', 'component']);
  }
  onChange(event) {
    const {
      getValue,
      props: { parse, override },
      model: { form: { values }, update }
    } = this;
    const value = override(parse(getValue(event)), values);
    update({ value });
  }
  onBlur(event) {
    const {
      getValue,
      props: { parse },
      model: { update }
    } = this;
    const value = parse(getValue(event));
    update({ value, isTouched: true, isFocused: null });
  }
  onFocus() {
    this.model.update({ isFocused: this.model });
  }
  getValue({ target: { type, value, checked } }) {
    return type === 'checkbox' ? !!checked : value;
  }
  getInit() {
    const { init, type, parse } = this.props;
    if (_.isBoolean(init)) return init;
    if (type === 'checkbox') return !!init;
    return init || parse(init);
  }
  modelField(...args) {
    return modelField(...args);
  }
  modelControl({ value: fieldValue }) {
    const { id, type, name, format, value: propsValue } = this.props;
    const { onBlur, onFocus, onChange } = this;
    const control = { type, name, onBlur, onFocus, onChange };
    if (id) control.id = id === true ? name : id;
    if (type === 'checkbox') {
      return _.assign(control, { checked: !!fieldValue });
    }
    if (type === 'radio') {
      return _.assign(control, {
        value: propsValue,
        checked: propsValue === fieldValue
      });
    }
    return _.assign(control, { value: format(fieldValue) });
  }
  render() {
    const { props: { component }, model: { value }, ownProps: props } = this;
    const control = this.modelControl({ value });
    if (_.isString(component)) {
      return (0, _react.createElement)(component, _extends({}, control, props));
    }
    const field = this.model.toProp();
    return (0, _react.createElement)(component, _extends({ field, control }, props));
  }
  static get propTypes() {
    return _extends({}, super.propTypes, {
      init: _propTypes.any,
      value: _propTypes.any,
      type: _propTypes.string,
      parse: _propTypes.func,
      format: _propTypes.func,
      override: _propTypes.func,
      component: (0, _propTypes.oneOfType)([_propTypes.string, _propTypes.func]),
      id: (0, _propTypes.oneOfType)([_propTypes.number, _propTypes.string, _propTypes.bool])
    });
  }
  static get defaultProps() {
    return _extends({}, super.defaultProps, {
      init: '',
      parse: _.id,
      format: _.id,
      override: _.id
    });
  }
}

exports.Field = Field;
class FieldModel extends SuperControl.Model {
  constructor(...args) {
    super(...args);
    this.update = this.update.bind(this);
  }
  get isFocused() {
    return this.form.getFocused() === this;
  }
  get isVisited() {
    return this.form.getVisited(this.path, false);
  }
  get isTouched() {
    return this.form.getTouched(this.path, false);
  }
  update(state, { notify = true, validate = true } = {}) {
    this.form.update(this.path, state, { notify, validate });
  }
  toState() {
    return _.pick(this, ['init', 'value', 'error', 'notice', 'isFocused', 'isVisited', 'isTouched']);
  }
  toProp() {
    const name = this.path.pop();
    const state = this.toState();
    const { form, update } = this;
    const isValid = !state.error;
    const isInvalid = !isValid;
    const isPristine = _.deepEqual(state.init, state.value);
    const isDirty = !isPristine;
    return _.assign(state, {
      form, name, update, isValid, isInvalid, isDirty, isPristine
    });
  }
}

exports.FieldModel = FieldModel;
const modelField = exports.modelField = (...args) => new FieldModel(...args);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./super-control":6,"./util":7}],5:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Fields = exports.Form = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _propTypes = (typeof window !== "undefined" ? window['PropTypes'] : typeof global !== "undefined" ? global['PropTypes'] : null);

var _util = require('./util');

var _ = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

class Form extends _react.Component {
  constructor(...args) {
    super(...args);
    this.fieldId = 0;
    this.root = new Fields(this.fieldId, {
      validate: this.props.validate
    });
    this.state = this.getInitialState();
    this.onReset = this.onReset.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.register = this.register.bind(this);
  }
  getInitialState() {
    return {
      errors: {},
      notices: {},
      touched: {},
      visited: {},
      focused: null,
      submitFailed: false,
      init: this.props.init,
      values: this.props.init
    };
  }
  getChildContext() {
    return { '@@super-controls': { register: this.register } };
  }
  onReset(event) {
    event.preventDefault();
    this.setState(this.getInitialState());
  }
  onSubmit(event) {
    event.preventDefault();
    const { values } = this.state;
    const errors = this.root.checkAll(values, values, 'validate');
    const hasErrors = _.keys(errors).some(key => errors[key]);
    if (hasErrors) return this.setState({ errors, submitFailed: true });
    this.props.onSubmit(_.clone(values));
  }
  get fields() {
    return this.root.fields;
  }
  get values() {
    return this.state.values;
  }
  get submitFailed() {
    return this.state.submitFailed;
  }
  update(path, state, options = {}) {
    const { check } = this.root;
    this.setState(({
      init, values, focused, visited, errors, notices, touched
    }) => {
      const nextState = {
        init, values, focused, visited, errors, notices, touched
      };
      if ('init' in state) {
        nextState.init = _.set(init, path, state.init);
      }
      if ('value' in state) {
        nextState.values = _.set(values, path, state.value);
        if (options.validate) {
          nextState.errors = _.assign(errors, check(state.value, values, 'validate', path));
        }
        if (options.notify) {
          nextState.notices = _.assign(notices, check(state.value, values, 'notify', path));
        }
      }
      if ('isTouched' in state) {
        nextState.touched = _.set(touched, path, state.isTouched);
      }
      if ('isFocused' in state) {
        nextState.focused = state.isFocused;
        nextState.visited = _.set(visited, path, true);
      }
      if ('unregistered' in state) {
        nextState.touched = _.unset(touched, path);
        nextState.values = _.unset(values, path);
        nextState.init = _.unset(init, path);
      }
      return nextState;
    });
  }
  getInit(path, fallback) {
    return _.get(this.state.init, path, fallback);
  }
  getValue(path, fallback) {
    return _.get(this.state.values, path, fallback);
  }
  getTouched(path, fallback) {
    return _.get(this.state.touched, path, fallback);
  }
  getFocused() {
    return this.state.focused;
  }
  getVisited(path, fallback) {
    return _.get(this.state.visited, path, fallback);
  }
  getError(fieldId) {
    return this.state.errors[fieldId] || null;
  }
  getNotice(fieldId) {
    return this.state.notices[fieldId] || null;
  }
  register({ init, model, paths }) {
    const path = paths.map(_.invoke);
    const value = this.getInit(path);
    if (_.isUndefined(value)) {
      const field = model(++this.fieldId, this, init, paths);
      this.root.register(field, path);
      this.update(path, { init, value: init });
      return field;
    }
    const field = model(++this.fieldId, this, value, paths);
    return this.root.register(field, path);
  }
  unregister({ path }) {
    if (_.isUndefined(this.getValue(path)) && _.isUndefined(this.getInit(path)) && _.isUndefined(this.getTouched(path))) {
      return;
    }
    this.update(path, { unregistered: true });
  }
  render() {
    return (0, _react.createElement)('form', _extends({}, _.omit(this.props, ['init', 'notify', 'validate']), {
      onReset: this.onReset,
      onSubmit: this.onSubmit
    }));
  }
  static get propTypes() {
    return {
      name: _propTypes.string,
      notify: _propTypes.func,
      validate: _propTypes.func,
      init: _propTypes.object,
      onSubmit: _propTypes.func
    };
  }
  static get defaultProps() {
    return {
      init: {},
      notify: _.noop,
      validate: _.noop,
      onSubmit: _.noop
    };
  }
  static get childContextTypes() {
    return {
      '@@super-controls': (0, _propTypes.shape)({
        register: _propTypes.func
      })
    };
  }
}

exports.Form = Form;
class Fields {
  constructor(id, { validate }) {
    this.id = id;
    this.fields = {};
    this._validate = validate;
    this.check = this.check.bind(this);
  }
  register(field, [key, ...path]) {
    const { fields } = this;
    this.fields = path.length ? _.assign(fields, { [key]: fields[key].register(field, path) }) : _.assign(fields, { [key]: field });
    return field;
  }
  check(value, values, method, [key, ...path] = []) {
    if (_.isUndefined(key)) {
      return { [this.id]: this[`_${method}`](value) || null };
    }
    return this.fields[key].check(value, values, method, path);
  }
  checkAll(value, values, method) {
    return _.keys(this.fields).reduce((checked, key) => {
      const { check, checkAll } = this.fields[key];
      return _.assign(checked, (checkAll || check)(values[key], values, method));
    }, this.check(value, values, method));
  }
}
exports.Fields = Fields;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./util":7}],6:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Model = exports.View = undefined;

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _propTypes = (typeof window !== "undefined" ? window['PropTypes'] : typeof global !== "undefined" ? global['PropTypes'] : null);

var _util = require('./util');

var _ = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

class View extends _react.Component {
  constructor(...args) {
    super(...args);
    this.register = this.register.bind(this);
  }
  componentWillMount() {
    this.model = this.context['@@super-controls'].register({
      init: this.getInit(),
      paths: [_ => this.props.name],
      model: (...args) => this.modelField(...args, {
        notify: this.props.notify,
        validate: this.props.validate
      })
    });
    this.setState(this.model.toState());
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !_.equalProps(this.props, nextProps) || !_.deepEqual(this.model.toState(), nextState);
  }
  componentDidUpdate() {
    this.setState(this.model.toState());
  }
  componentWillUnmount() {
    this.model.unregister();
  }
  register({ init, model, paths }) {
    return this.context['@@super-controls'].register({
      init,
      model,
      paths: [_ => this.props.name, ...paths]
    });
  }
  getChildContext() {
    return { '@@super-controls': { register: this.register } };
  }
  static get propTypes() {
    return {
      notify: _propTypes.func,
      validate: _propTypes.func,
      name: (0, _propTypes.oneOfType)([_propTypes.string, _propTypes.number]).isRequired
    };
  }
  static get defaultProps() {
    return {
      notify: _.noop,
      validate: _.noop,
      component: _ => null
    };
  }
  static get contextTypes() {
    return {
      '@@super-controls': (0, _propTypes.shape)({
        register: _propTypes.func.isRequired
      })
    };
  }
  static get childContextTypes() {
    return this.contextTypes;
  }
}

exports.View = View;
class Model {
  constructor(id, form, init, paths, { notify, validate, override } = {}) {
    this.id = id;
    this.form = form;
    this._init = init;
    this._path = paths;
    this._notify = notify || _.noop;
    this._validate = validate || _.noop;
    this._override = override || _.id;
    this.check = this.check.bind(this);
  }
  get path() {
    return this._path.map(_.invoke);
  }
  get init() {
    return this.form.getInit(this.path, this._init);
  }
  get value() {
    return this.form.getValue(this.path, this.init);
  }
  get error() {
    return this.form.getError(this.id);
  }
  get notice() {
    return this.form.getNotice(this.id);
  }
  check(value, values, method) {
    return { [this.id]: this[`_${method}`](value, values) || null };
  }
  unregister() {
    this.form.unregister(this);
  }
}
exports.Model = Model;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./util":7}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const id = exports.id = x => x;

const noop = exports.noop = () => {};

const invoke = exports.invoke = (fn, ...args) => fn(...args);

const isArray = exports.isArray = val => Array.isArray(val);

const isObject = exports.isObject = val => ({}).toString.call(val) === '[object Object]';

const isString = exports.isString = val => typeof val === 'string';

const isBoolean = exports.isBoolean = val => typeof val === 'boolean';

const isUndefined = exports.isUndefined = val => val === void 0;

const isIndex = exports.isIndex = val => Number.isInteger(val);

const keys = exports.keys = obj => Object.keys(obj);

const omit = exports.omit = (source, props) => keys(source).reduce((omitted, key) => props.includes(key) ? omitted : assign(omitted, { [key]: source[key] }), {});

const pick = exports.pick = (source, props) => props.reduce((picked, prop) => assign(picked, { [prop]: source[prop] }), {});

const assign = exports.assign = (...args) => Object.assign({}, ...args);

const sliceIn = exports.sliceIn = (array, index, value) => [...array.slice(0, index), value, ...array.slice(index)];

const sliceOut = exports.sliceOut = (array, index) => [...array.slice(0, index), ...array.slice(index + 1)];

const sliceOver = exports.sliceOver = ([...sliced], index, val) => {
  sliced[index] = val;
  return sliced;
};

const exists = exports.exists = (target, key) => isArray(target) ? !isUndefined(target[key]) : target.hasOwnProperty(key);

const replace = exports.replace = (target, key, val) => isArray(target) ? sliceOver(target, key, val) : assign(target, { [key]: val });

const remove = exports.remove = (target, key) => isArray(target) ? sliceOut(target, key) : omit(target, [key]);

const get = exports.get = (source, [key, ...path], fallback) => {
  if (isUndefined(source) || !exists(source, key)) return fallback;
  if (!path.length) return source[key];
  return get(source[key], path, fallback);
};

const set = exports.set = (target, [key, index, ...path], val) => {
  if (isUndefined(index)) return replace(target, key, val);
  const nested = target[key] || (isIndex(index) ? [] : {});
  return replace(target, key, set(nested, [index, ...path], val));
};

const unset = exports.unset = (target, [key, ...path], val) => {
  if (!exists(target, key)) return target;
  if (!path.length) return remove(target, key);
  return replace(target, key, unset(target[key], path, val));
};

const clone = exports.clone = source => {
  if (isArray(source)) return source.map(clone);
  if (isObject(source)) {
    return keys(source).reduce((cloned, key) => assign(cloned, { [key]: clone(source[key]) }), {});
  }
  return source;
};

const someValues = exports.someValues = (target, predicate) => {
  if (isArray(target)) {
    return !!target.find(child => someValues(child, predicate));
  }
  if (isObject(target)) {
    return !!keys(target).find(key => someValues(target[key], predicate));
  }
  return !!predicate(target);
};

const equalExcept = exports.equalExcept = (...ignore) => (a, b) => {
  if (a === b) return true;
  const aKeys = keys(a);
  const bKeys = keys(b);
  return aKeys.length === bKeys.length && aKeys.every(key => ignore.includes(key) || a[key] === b[key]);
};

const equalProps = exports.equalProps = equalExcept('name', 'children');

const shallowEqual = exports.shallowEqual = equalExcept();

const deepEqual = exports.deepEqual = (a, b) => {
  if (a === b) return true;
  if (isArray(a) && isArray(b)) {
    return a.length === b.length && a.every((_, index) => deepEqual(a[index], b[index]));
  }
  if (isObject(a) && isObject(b)) {
    const aKeys = keys(a);
    const bKeys = keys(b);
    return aKeys.length === bKeys.length && aKeys.every(key => deepEqual(a[key], b[key]));
  }
  return false;
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaW5kZXguanMiLCIvZmllbGQtYXJyYXkuanMiLCIvZmllbGQtc2V0LmpzIiwiL2ZpZWxkLmpzIiwiL2Zvcm0uanMiLCIvc3VwZXItY29udHJvbC5qcyIsIi91dGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUNDQTs7OztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7OzZOQU5BOzs7QUFRQSxNQUFNLGVBQWUsVUFDbkIsUUFBUSxHQUFSLENBQVksS0FBSyxTQUFMLENBQWUsTUFBZixFQUF1QixJQUF2QixFQUE2QixDQUE3QixDQUFaLENBREY7O0FBR0EsTUFBTSxtQkFBbUIsQ0FBQyxRQUFRLEVBQVQsS0FDdkIsTUFBTSxJQUFOLEdBQWEsTUFBYixHQUFzQixDQUF0QixJQUNBLDZDQUZGOztBQUlBLE1BQU0saUJBQWlCLFNBQ3JCLE1BQU0sTUFBTixHQUFlLENBQWYsSUFDQSwyQkFGRjs7QUFJQSxNQUFNLFdBQVc7QUFBQSxNQUFDLEVBQUUsS0FBRixFQUFTLE9BQVQsRUFBRDtBQUFBLE1BQXNCLEtBQXRCOztBQUFBLFNBQ2Y7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBLFFBQUssV0FBVSxZQUFmO0FBQ0U7QUFBQTtBQUFBLFVBQU8sU0FBUyxRQUFRLEVBQXhCO0FBQUE7QUFBQSxPQURGO0FBRUUsd0RBQU8sTUFBSyxNQUFaLEVBQW1CLFdBQVUsY0FBN0IsSUFBZ0QsT0FBaEQ7QUFGRixLQURGO0FBS0ksVUFBTSxTQUFOLEtBQ0MsTUFBTSxTQUFOLElBQW1CLE1BQU0sSUFBTixDQUFXLFlBRC9CLEtBRUE7QUFBQTtBQUFBLFFBQUssV0FBVSxvQkFBZjtBQUFzQyxZQUFNO0FBQTVDLEtBUEo7QUFTSSxVQUFNLE9BQU4sSUFDQSxNQUFNLE1BRE4sSUFFQTtBQUFBO0FBQUEsUUFBSyxXQUFVLHFCQUFmO0FBQXVDLFlBQU07QUFBN0M7QUFYSixHQURl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QUQsRUFBSSxDQUFKLEtBQVU7QUFDakMsTUFBSSxNQUFNLENBQVYsRUFBYSxPQUFPLElBQVA7QUFDYixNQUFJLFFBQVEsQ0FBUixLQUFjLFFBQVEsQ0FBUixDQUFsQixFQUE4QjtBQUM1QixXQUFPLEVBQUUsTUFBRixLQUFhLEVBQUUsTUFBZixJQUNBLEVBQUUsS0FBRixDQUFRLENBQUMsQ0FBRCxFQUFJLEtBQUosS0FBYyxVQUFVLEVBQUUsS0FBRixDQUFWLEVBQW9CLEVBQUUsS0FBRixDQUFwQixDQUF0QixDQURQO0FBRUQ7QUFDRCxNQUFJLFNBQVMsQ0FBVCxLQUFlLFNBQVMsQ0FBVCxDQUFuQixFQUFnQztBQUM5QixVQUFNLFFBQVEsS0FBSyxDQUFMLENBQWQ7QUFDQSxVQUFNLFFBQVEsS0FBSyxDQUFMLENBQWQ7QUFDQSxXQUFPLE1BQU0sTUFBTixLQUFpQixNQUFNLE1BQXZCLElBQ0EsTUFBTSxLQUFOLENBQVksT0FBTyxVQUFVLEVBQUUsR0FBRixDQUFWLEVBQWtCLEVBQUUsR0FBRixDQUFsQixDQUFuQixDQURQO0FBRUQ7QUFDRCxTQUFPLEtBQVA7QUFDRCxDQWJNIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGVzbGludC1kaXNhYmxlIHJlYWN0L3Byb3AtdHlwZXMgKi9cbmltcG9ydCBSZWFjdCwgeyBGcmFnbWVudCB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgcmVuZGVyIH0gZnJvbSAncmVhY3QtZG9tJ1xuaW1wb3J0IHsgRm9ybSB9IGZyb20gJ34vc3JjL2Zvcm0nXG5pbXBvcnQgeyBGaWVsZCB9IGZyb20gJ34vc3JjL2ZpZWxkJ1xuaW1wb3J0IHsgRmllbGRTZXQgfSBmcm9tICd+L3NyYy9maWVsZC1zZXQnXG5pbXBvcnQgeyBGaWVsZEFycmF5IH0gZnJvbSAnfi9zcmMvZmllbGQtYXJyYXknXG5cbmNvbnN0IGhhbmRsZVN1Ym1pdCA9IHZhbHVlcyA9PlxuICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeSh2YWx1ZXMsIG51bGwsIDIpKVxuXG5jb25zdCB2YWxpZGF0ZVVzZXJuYW1lID0gKHZhbHVlID0gJycpID0+XG4gIHZhbHVlLnRyaW0oKS5sZW5ndGggPCAzICYmXG4gICdVc2VybmFtZSBtdXN0IGJlIGF0IGxlYXN0IDMgY2hhcmFjdGVycyBsb25nJ1xuXG5jb25zdCBub3RpZnlVc2VybmFtZSA9IHZhbHVlID0+XG4gIHZhbHVlLmxlbmd0aCA+IDUgJiZcbiAgJ1RoYXQgaXMgYSBncmVhdCB1c2VybmFtZSEnXG5cbmNvbnN0IFVzZXJuYW1lID0gKHsgZmllbGQsIGNvbnRyb2wsIC4uLnByb3BzIH0pID0+XG4gIDxGcmFnbWVudD5cbiAgICA8ZGl2IGNsYXNzTmFtZT0nZm9ybS1ncm91cCc+XG4gICAgICA8bGFiZWwgaHRtbEZvcj17Y29udHJvbC5pZH0+VXNlcm5hbWU8L2xhYmVsPlxuICAgICAgPGlucHV0IHR5cGU9J3RleHQnIGNsYXNzTmFtZT0nZm9ybS1jb250cm9sJyB7Li4uY29udHJvbH0vPlxuICAgIDwvZGl2PlxuICAgIHsgZmllbGQuaXNJbnZhbGlkICYmXG4gICAgICAoZmllbGQuaXNUb3VjaGVkIHx8IGZpZWxkLmZvcm0uc3VibWl0RmFpbGVkKSAmJlxuICAgICAgPGRpdiBjbGFzc05hbWU9J2FsZXJ0IGFsZXJ0LWRhbmdlcic+eyBmaWVsZC5lcnJvciB9PC9kaXY+XG4gICAgfVxuICAgIHsgZmllbGQuaXNWYWxpZCAmJlxuICAgICAgZmllbGQubm90aWNlICYmXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nYWxlcnQgYWxlcnQtc3VjY2Vzcyc+eyBmaWVsZC5ub3RpY2UgfTwvZGl2PlxuICAgIH1cbiAgPC9GcmFnbWVudD5cblxucmVuZGVyKFxuICA8Rm9ybVxuICAgIG5hbWU9J3NpZ25VcCdcbiAgICBvblN1Ym1pdD17aGFuZGxlU3VibWl0fVxuICAgIGNsYXNzTmFtZT0nY29udGFpbmVyJz5cbiAgICA8bGVnZW5kPkpvaW4gVXAhPC9sZWdlbmQ+XG4gICAgPEZpZWxkXG4gICAgICBpZFxuICAgICAgbmFtZT0ndXNlcm5hbWUnXG4gICAgICBjb21wb25lbnQ9e1VzZXJuYW1lfVxuICAgICAgbm90aWZ5PXtub3RpZnlVc2VybmFtZX1cbiAgICAgIHZhbGlkYXRlPXt2YWxpZGF0ZVVzZXJuYW1lfS8+XG4gICAgPEZpZWxkU2V0IG5hbWU9J2NvbnRhY3RJbmZvJyBjbGFzc05hbWU9J2Zvcm0tZ3JvdXAnPlxuICAgICAgPGxlZ2VuZD48c21hbGw+Q29udGFjdCBJbmZvPC9zbWFsbD48L2xlZ2VuZD5cbiAgICAgIDxsYWJlbCBodG1sRm9yPSdlbWFpbCc+RW1haWw8L2xhYmVsPlxuICAgICAgPEZpZWxkXG4gICAgICAgIGlkXG4gICAgICAgIG5hbWU9J2VtYWlsJ1xuICAgICAgICBjb21wb25lbnQ9J2lucHV0J1xuICAgICAgICBjbGFzc05hbWU9J2Zvcm0tY29udHJvbCcvPlxuICAgIDwvRmllbGRTZXQ+XG4gICAgPEZpZWxkQXJyYXkgbmFtZT0nZnJpZW5kcyc+XG4gICAgICB7ICh7IGZpZWxkcyB9KSA9PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZm9ybS1ncm91cCc+XG4gICAgICAgICAgPGxlZ2VuZD48c21hbGw+RnJpZW5kcyAoeyBmaWVsZHMubGVuZ3RoIH0pPC9zbWFsbD48L2xlZ2VuZD5cbiAgICAgICAgICB7IGZpZWxkcy5tYXAoKGZyaWVuZCwgaW5kZXgpID0+XG4gICAgICAgICAgICA8RmllbGRTZXQgbmFtZT17aW5kZXh9IGtleT17aW5kZXh9PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0naW5wdXQtZ3JvdXAgZm9ybS1ncm91cCc+XG4gICAgICAgICAgICAgICAgPEZpZWxkXG4gICAgICAgICAgICAgICAgICB0eXBlPSd0ZXh0J1xuICAgICAgICAgICAgICAgICAgbmFtZT0nbmFtZSdcbiAgICAgICAgICAgICAgICAgIGNvbXBvbmVudD0naW5wdXQnXG4gICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj0nTmFtZSdcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT0nZm9ybS1jb250cm9sJy8+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdpbnB1dC1ncm91cC1idG4nPlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICB0eXBlPSdidXR0b24nXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e18gPT4gZmllbGRzLnJlbW92ZShpbmRleCl9XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT0nYnRuIGJ0bi1zZWNvbmRhcnknPlxuICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9J29pIG9pLXgnLz5cbiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L0ZpZWxkU2V0PlxuICAgICAgICAgICl9XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgdHlwZT0nYnV0dG9uJ1xuICAgICAgICAgICAgb25DbGljaz17XyA9PiBmaWVsZHMucHVzaCh7IG5hbWU6ICcnIH0pfVxuICAgICAgICAgICAgY2xhc3NOYW1lPSdidG4gYnRuLW91dGxpbmUtc3VjY2Vzcyc+XG4gICAgICAgICAgICA8aSBjbGFzc05hbWU9J29pIG9pLXBsdXMnLz5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICB9XG4gICAgPC9GaWVsZEFycmF5PlxuICAgIDxidXR0b24gdHlwZT0ncmVzZXQnIGNsYXNzTmFtZT0nYnRuIGJ0bi1vdXRsaW5lLXNlY29uZGFyeSc+XG4gICAgICBSZXNldFxuICAgIDwvYnV0dG9uPlxuICAgIHsgJyAnIH1cbiAgICA8YnV0dG9uIHR5cGU9J3N1Ym1pdCcgY2xhc3NOYW1lPSdidG4gYnRuLXByaW1hcnknPlxuICAgICAgU2lnbiBVcFxuICAgIDwvYnV0dG9uPlxuICA8L0Zvcm0+LFxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYXBwJylcbilcbiIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IGZ1bmMsIGFycmF5IH0gZnJvbSAncHJvcC10eXBlcydcbmltcG9ydCB7IEZpZWxkU2V0LCBGaWVsZFNldE1vZGVsIH0gZnJvbSAnLi9maWVsZC1zZXQnXG5pbXBvcnQgKiBhcyBfIGZyb20gJy4vdXRpbCdcblxuZXhwb3J0IGNsYXNzIEZpZWxkQXJyYXkgZXh0ZW5kcyBGaWVsZFNldCB7XG4gIG1vZGVsRmllbGQoLi4uYXJncykge1xuICAgIHJldHVybiBtb2RlbEZpZWxkQXJyYXkoLi4uYXJncylcbiAgfVxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBjb21wb25lbnQsIGNoaWxkcmVuLCAuLi5wcm9wcyB9ID0gdGhpcy5wcm9wc1xuICAgIHJldHVybiBjcmVhdGVFbGVtZW50KGNvbXBvbmVudCB8fCBjaGlsZHJlbiwge1xuICAgICAgLi4ucHJvcHMsXG4gICAgICBmaWVsZHM6IHRoaXMubW9kZWwudG9Qcm9wKClcbiAgICB9KVxuICB9XG4gIHN0YXRpYyBnZXQgcHJvcFR5cGVzKCkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdXBlci5wcm9wVHlwZXMsXG4gICAgICBpbml0OiBhcnJheSxcbiAgICAgIGNoaWxkcmVuOiBmdW5jLFxuICAgICAgY29tcG9uZW50OiBmdW5jXG4gICAgfVxuICB9XG4gIHN0YXRpYyBnZXQgZGVmYXVsdFByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBpbml0OiBbXSxcbiAgICAgIGNoaWxkcmVuOiBfID0+IG51bGxcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgRmllbGRBcnJheU1vZGVsIGV4dGVuZHMgRmllbGRTZXRNb2RlbCB7XG4gIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICBzdXBlciguLi5hcmdzKVxuICAgIHRoaXMuZmllbGRzID0gW11cbiAgICB0aGlzLmluc2VydCA9IHRoaXMuaW5zZXJ0LmJpbmQodGhpcylcbiAgICB0aGlzLnJlbW92ZSA9IHRoaXMucmVtb3ZlLmJpbmQodGhpcylcbiAgICB0aGlzLnB1c2ggPSB0aGlzLnB1c2guYmluZCh0aGlzKVxuICAgIHRoaXMucG9wID0gdGhpcy5wb3AuYmluZCh0aGlzKVxuICAgIHRoaXMudW5zaGlmdCA9IHRoaXMudW5zaGlmdC5iaW5kKHRoaXMpXG4gICAgdGhpcy5zaGlmdCA9IHRoaXMuc2hpZnQuYmluZCh0aGlzKVxuICAgIHRoaXMubWFwID0gdGhpcy5tYXAuYmluZCh0aGlzKVxuICB9XG4gIGdldCB2aXNpdGVkKCkge1xuICAgIHJldHVybiB0aGlzLmZvcm0uZ2V0VmlzaXRlZCh0aGlzLnBhdGgsIFtdKVxuICB9XG4gIGdldCB0b3VjaGVkKCkge1xuICAgIHJldHVybiB0aGlzLmZvcm0uZ2V0VG91Y2hlZCh0aGlzLnBhdGgsIFtdKVxuICB9XG4gIGdldCBsZW5ndGgoKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWUubGVuZ3RoXG4gIH1cbiAgdG9Qcm9wKCkge1xuICAgIHJldHVybiBfLmFzc2lnbihzdXBlci50b1Byb3AoKSwgXy5waWNrKHRoaXMsIFtcbiAgICAgICdpbnNlcnQnLCAncmVtb3ZlJywgJ3B1c2gnLCAncG9wJyxcbiAgICAgICd1bnNoaWZ0JywgJ3NoaWZ0JywgJ21hcCcsICdsZW5ndGgnXG4gICAgXSkpXG4gIH1cbiAgaW5zZXJ0KGluZGV4LCBuZXdWYWx1ZSkge1xuICAgIGNvbnN0IHsgZm9ybSwgcGF0aCwgaW5pdCwgdmFsdWUsIHRvdWNoZWQgfSA9IHRoaXNcbiAgICBmb3JtLnVwZGF0ZShwYXRoLCB7XG4gICAgICBpbml0OiBfLnNsaWNlSW4oaW5pdCwgaW5kZXgsIG5ld1ZhbHVlKSxcbiAgICAgIHZhbHVlOiBfLnNsaWNlSW4odmFsdWUsIGluZGV4LCBuZXdWYWx1ZSksXG4gICAgICBpc1RvdWNoZWQ6IF8uc2V0KHRvdWNoZWQsIFtpbmRleF0sIHZvaWQgMClcbiAgICB9KVxuICB9XG4gIHJlbW92ZShpbmRleCkge1xuICAgIGNvbnN0IHsgZm9ybSwgcGF0aCwgaW5pdCwgdmFsdWUsIHRvdWNoZWQgfSA9IHRoaXNcbiAgICBmb3JtLnVwZGF0ZShwYXRoLCB7XG4gICAgICBpbml0OiBfLnNsaWNlT3V0KGluaXQsIGluZGV4KSxcbiAgICAgIHZhbHVlOiBfLnNsaWNlT3V0KHZhbHVlLCBpbmRleCksXG4gICAgICBpc1RvdWNoZWQ6IF8uc2xpY2VPdXQodG91Y2hlZCwgaW5kZXgpXG4gICAgfSlcbiAgfVxuICBwdXNoKG5ld1ZhbHVlKSB7XG4gICAgdGhpcy5pbnNlcnQodGhpcy5sZW5ndGgsIG5ld1ZhbHVlKVxuICB9XG4gIHBvcCgpIHtcbiAgICB0aGlzLnJlbW92ZSh0aGlzLmxlbmd0aCAtIDEpXG4gIH1cbiAgdW5zaGlmdChuZXdWYWx1ZSkge1xuICAgIHRoaXMuaW5zZXJ0KDAsIG5ld1ZhbHVlKVxuICB9XG4gIHNoaWZ0KCkge1xuICAgIHRoaXMucmVtb3ZlKDApXG4gIH1cbiAgbWFwKHRyYW5zZm9ybSkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlLm1hcCgodmFsdWUsIGluZGV4KSA9PlxuICAgICAgdHJhbnNmb3JtKHZhbHVlLCBpbmRleCwgdGhpcylcbiAgICApXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IG1vZGVsRmllbGRBcnJheSA9ICguLi5hcmdzKSA9PiBuZXcgRmllbGRBcnJheU1vZGVsKC4uLmFyZ3MpXG4iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBvbmVPZlR5cGUsIGZ1bmMsIG9iamVjdCwgc3RyaW5nIH0gZnJvbSAncHJvcC10eXBlcydcbmltcG9ydCAqIGFzIF8gZnJvbSAnLi91dGlsJ1xuaW1wb3J0ICogYXMgU3VwZXJDb250cm9sIGZyb20gJy4vc3VwZXItY29udHJvbCdcblxuZXhwb3J0IGNsYXNzIEZpZWxkU2V0IGV4dGVuZHMgU3VwZXJDb250cm9sLlZpZXcge1xuICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgc3VwZXIoLi4uYXJncylcbiAgICB0aGlzLm93blByb3BzID0gXy5vbWl0KHRoaXMucHJvcHMsIFtcbiAgICAgICdpbml0JywgJ25vdGlmeScsICd2YWxpZGF0ZScsICdjb21wb25lbnQnXG4gICAgXSlcbiAgfVxuICBnZXRJbml0KCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLmluaXRcbiAgfVxuICBtb2RlbEZpZWxkKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gbW9kZWxGaWVsZFNldCguLi5hcmdzKVxuICB9XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IHByb3BzOiB7IG5hbWUsIGNvbXBvbmVudCB9LCBvd25Qcm9wczogcHJvcHMgfSA9IHRoaXNcbiAgICBpZiAoXy5pc1N0cmluZyhjb21wb25lbnQpKSB7XG4gICAgICByZXR1cm4gY3JlYXRlRWxlbWVudChjb21wb25lbnQsIHsgLi4ucHJvcHMsIG5hbWUgfSlcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUVsZW1lbnQoY29tcG9uZW50LCB7XG4gICAgICAuLi5wcm9wcyxcbiAgICAgIG5hbWUsXG4gICAgICBmaWVsZHM6IHRoaXMubW9kZWwudG9Qcm9wKClcbiAgICB9KVxuICB9XG4gIHN0YXRpYyBnZXQgcHJvcFR5cGVzKCkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdXBlci5wcm9wVHlwZXMsXG4gICAgICBpbml0OiBvYmplY3QsXG4gICAgICBjb21wb25lbnQ6IG9uZU9mVHlwZShbc3RyaW5nLCBmdW5jXSkuaXNSZXF1aXJlZFxuICAgIH1cbiAgfVxuICBzdGF0aWMgZ2V0IGRlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3VwZXIuZGVmYXVsdFByb3BzLFxuICAgICAgaW5pdDoge30sXG4gICAgICBjb21wb25lbnQ6ICdmaWVsZHNldCdcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEZpZWxkU2V0TW9kZWwgZXh0ZW5kcyBTdXBlckNvbnRyb2wuTW9kZWwge1xuICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgc3VwZXIoLi4uYXJncylcbiAgICB0aGlzLmZpZWxkcyA9IHt9XG4gICAgdGhpcy5jaGVja0FsbCA9IHRoaXMuY2hlY2tBbGwuYmluZCh0aGlzKVxuICB9XG4gIGdldCB2aXNpdGVkKCkge1xuICAgIHJldHVybiB0aGlzLmZvcm0uZ2V0VmlzaXRlZCh0aGlzLnBhdGgsIHt9KVxuICB9XG4gIGdldCB0b3VjaGVkKCkge1xuICAgIHJldHVybiB0aGlzLmZvcm0uZ2V0VG91Y2hlZCh0aGlzLnBhdGgsIHt9KVxuICB9XG4gIGdldCBpc1RvdWNoZWQoKSB7XG4gICAgcmV0dXJuIF8uc29tZVZhbHVlcyh0aGlzLnRvdWNoZWQsIF8uaWQpXG4gIH1cbiAgdG9TdGF0ZSgpIHtcbiAgICByZXR1cm4gXy5waWNrKHRoaXMsIFtcbiAgICAgICdpbml0JywgJ3ZhbHVlJywgJ3RvdWNoZWQnLCAnZXJyb3InLCAnbm90aWNlJywgJ3Zpc2l0ZWQnXG4gICAgXSlcbiAgfVxuICB0b1Byb3AoKSB7XG4gICAgY29uc3QgbmFtZSA9IHRoaXMucGF0aC5wb3AoKVxuICAgIGNvbnN0IHN0YXRlID0gdGhpcy50b1N0YXRlKClcbiAgICBjb25zdCB7IGZvcm0sIGlzVG91Y2hlZCB9ID0gdGhpc1xuICAgIGNvbnN0IGlzVmFsaWQgPSAhc3RhdGUuZXJyb3JcbiAgICBjb25zdCBpc0ludmFsaWQgPSAhaXNWYWxpZFxuICAgIGNvbnN0IGlzRGlydHkgPSAhXy5kZWVwRXF1YWwoc3RhdGUuaW5pdCwgc3RhdGUudmFsdWUpXG4gICAgY29uc3QgaXNQcmlzdGluZSA9ICFpc0RpcnR5XG4gICAgcmV0dXJuIF8uYXNzaWduKHN0YXRlLCB7XG4gICAgICBmb3JtLCBuYW1lLCBpc1ZhbGlkLCBpc0ludmFsaWQsIGlzRGlydHksIGlzUHJpc3RpbmUsIGlzVG91Y2hlZFxuICAgIH0pXG4gIH1cbiAgcmVnaXN0ZXIoZmllbGQsIFsga2V5LCAuLi5wYXRoIF0pIHtcbiAgICB0aGlzLmZpZWxkcyA9IHBhdGgubGVuZ3RoXG4gICAgICA/IF8uc2V0KHRoaXMuZmllbGRzLCBba2V5XSwgdGhpcy5maWVsZHNba2V5XS5yZWdpc3RlcihmaWVsZCwgcGF0aCkpXG4gICAgICA6IF8uc2V0KHRoaXMuZmllbGRzLCBba2V5XSwgZmllbGQpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBjaGVjayh2YWx1ZSwgdmFsdWVzLCBtZXRob2QsIFsga2V5LCAuLi5wYXRoIF0pIHtcbiAgICByZXR1cm4gXy5hc3NpZ24oXG4gICAgICBzdXBlci5jaGVjayhfLnNldCh0aGlzLnZhbHVlLCBba2V5LCAuLi5wYXRoXSwgdmFsdWUpLCB2YWx1ZXMsIG1ldGhvZCksXG4gICAgICB0aGlzLmZpZWxkc1trZXldLmNoZWNrKHZhbHVlLCB2YWx1ZXMsIG1ldGhvZCwgcGF0aClcbiAgICApXG4gIH1cbiAgY2hlY2tBbGwodmFsdWUsIHZhbHVlcywgbWV0aG9kKSB7XG4gICAgcmV0dXJuIF8ua2V5cyh0aGlzLmZpZWxkcylcbiAgICAgIC5yZWR1Y2UoKGNoZWNrZWQsIGtleSkgPT4ge1xuICAgICAgICBjb25zdCB7IGNoZWNrLCBjaGVja0FsbCB9ID0gdGhpcy5maWVsZHNba2V5XVxuICAgICAgICByZXR1cm4gXy5hc3NpZ24oXG4gICAgICAgICAgY2hlY2tlZCxcbiAgICAgICAgICAoY2hlY2tBbGwgfHwgY2hlY2spKHZhbHVlc1trZXldLCB2YWx1ZXMsIG1ldGhvZClcbiAgICAgICAgKVxuICAgICAgfSwgeyBbdGhpcy5pZF06IHRoaXNbYF8ke21ldGhvZH1gXSh2YWx1ZSwgdmFsdWVzKSB8fCBudWxsIH0pXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IG1vZGVsRmllbGRTZXQgPSAoLi4uYXJncykgPT4gbmV3IEZpZWxkU2V0TW9kZWwoLi4uYXJncylcbiIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IG9uZU9mVHlwZSwgYW55LCBib29sLCBmdW5jLCBzdHJpbmcsIG51bWJlciB9IGZyb20gJ3Byb3AtdHlwZXMnXG5pbXBvcnQgKiBhcyBfIGZyb20gJy4vdXRpbCdcbmltcG9ydCAqIGFzIFN1cGVyQ29udHJvbCBmcm9tICcuL3N1cGVyLWNvbnRyb2wnXG5cbmV4cG9ydCBjbGFzcyBGaWVsZCBleHRlbmRzIFN1cGVyQ29udHJvbC5WaWV3IHtcbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgIHN1cGVyKC4uLmFyZ3MpXG4gICAgdGhpcy5vbkJsdXIgPSB0aGlzLm9uQmx1ci5iaW5kKHRoaXMpXG4gICAgdGhpcy5vbkZvY3VzID0gdGhpcy5vbkZvY3VzLmJpbmQodGhpcylcbiAgICB0aGlzLm9uQ2hhbmdlID0gdGhpcy5vbkNoYW5nZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5vd25Qcm9wcyA9IF8ub21pdCh0aGlzLnByb3BzLCBbXG4gICAgICAnaWQnLCAnbmFtZScsICdpbml0JywgJ3R5cGUnLCAndmFsdWUnLCAncGFyc2UnLFxuICAgICAgJ2Zvcm1hdCcsICdvdmVycmlkZScsICdub3RpZnknLCAndmFsaWRhdGUnLCAnY29tcG9uZW50J1xuICAgIF0pXG4gIH1cbiAgb25DaGFuZ2UoZXZlbnQpIHtcbiAgICBjb25zdCB7XG4gICAgICBnZXRWYWx1ZSxcbiAgICAgIHByb3BzOiB7IHBhcnNlLCBvdmVycmlkZSB9LFxuICAgICAgbW9kZWw6IHsgZm9ybTogeyB2YWx1ZXMgfSwgdXBkYXRlIH1cbiAgICB9ID0gdGhpc1xuICAgIGNvbnN0IHZhbHVlID0gb3ZlcnJpZGUocGFyc2UoZ2V0VmFsdWUoZXZlbnQpKSwgdmFsdWVzKVxuICAgIHVwZGF0ZSh7IHZhbHVlIH0pXG4gIH1cbiAgb25CbHVyKGV2ZW50KSB7XG4gICAgY29uc3Qge1xuICAgICAgZ2V0VmFsdWUsXG4gICAgICBwcm9wczogeyBwYXJzZSB9LFxuICAgICAgbW9kZWw6IHsgdXBkYXRlIH1cbiAgICB9ID0gdGhpc1xuICAgIGNvbnN0IHZhbHVlID0gcGFyc2UoZ2V0VmFsdWUoZXZlbnQpKVxuICAgIHVwZGF0ZSh7IHZhbHVlLCBpc1RvdWNoZWQ6IHRydWUsIGlzRm9jdXNlZDogbnVsbCB9KVxuICB9XG4gIG9uRm9jdXMoKSB7XG4gICAgdGhpcy5tb2RlbC51cGRhdGUoeyBpc0ZvY3VzZWQ6IHRoaXMubW9kZWwgfSlcbiAgfVxuICBnZXRWYWx1ZSh7IHRhcmdldDogeyB0eXBlLCB2YWx1ZSwgY2hlY2tlZCB9IH0pIHtcbiAgICByZXR1cm4gdHlwZSA9PT0gJ2NoZWNrYm94JyA/ICEhY2hlY2tlZCA6IHZhbHVlXG4gIH1cbiAgZ2V0SW5pdCgpIHtcbiAgICBjb25zdCB7IGluaXQsIHR5cGUsIHBhcnNlIH0gPSB0aGlzLnByb3BzXG4gICAgaWYgKF8uaXNCb29sZWFuKGluaXQpKSByZXR1cm4gaW5pdFxuICAgIGlmICh0eXBlID09PSAnY2hlY2tib3gnKSByZXR1cm4gISFpbml0XG4gICAgcmV0dXJuIGluaXQgfHwgcGFyc2UoaW5pdClcbiAgfVxuICBtb2RlbEZpZWxkKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gbW9kZWxGaWVsZCguLi5hcmdzKVxuICB9XG4gIG1vZGVsQ29udHJvbCh7IHZhbHVlOiBmaWVsZFZhbHVlIH0pIHtcbiAgICBjb25zdCB7IGlkLCB0eXBlLCBuYW1lLCBmb3JtYXQsIHZhbHVlOiBwcm9wc1ZhbHVlIH0gPSB0aGlzLnByb3BzXG4gICAgY29uc3QgeyBvbkJsdXIsIG9uRm9jdXMsIG9uQ2hhbmdlIH0gPSB0aGlzXG4gICAgY29uc3QgY29udHJvbCA9IHsgdHlwZSwgbmFtZSwgb25CbHVyLCBvbkZvY3VzLCBvbkNoYW5nZSB9XG4gICAgaWYgKGlkKSBjb250cm9sLmlkID0gaWQgPT09IHRydWUgPyBuYW1lIDogaWRcbiAgICBpZiAodHlwZSA9PT0gJ2NoZWNrYm94Jykge1xuICAgICAgcmV0dXJuIF8uYXNzaWduKGNvbnRyb2wsIHsgY2hlY2tlZDogISFmaWVsZFZhbHVlIH0pXG4gICAgfVxuICAgIGlmICh0eXBlID09PSAncmFkaW8nKSB7XG4gICAgICByZXR1cm4gXy5hc3NpZ24oY29udHJvbCwge1xuICAgICAgICB2YWx1ZTogcHJvcHNWYWx1ZSxcbiAgICAgICAgY2hlY2tlZDogcHJvcHNWYWx1ZSA9PT0gZmllbGRWYWx1ZVxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIF8uYXNzaWduKGNvbnRyb2wsIHsgdmFsdWU6IGZvcm1hdChmaWVsZFZhbHVlKSB9KVxuICB9XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IHByb3BzOiB7IGNvbXBvbmVudCB9LCBtb2RlbDogeyB2YWx1ZSB9LCBvd25Qcm9wczogcHJvcHMgfSA9IHRoaXNcbiAgICBjb25zdCBjb250cm9sID0gdGhpcy5tb2RlbENvbnRyb2woeyB2YWx1ZSB9KVxuICAgIGlmIChfLmlzU3RyaW5nKGNvbXBvbmVudCkpIHtcbiAgICAgIHJldHVybiBjcmVhdGVFbGVtZW50KGNvbXBvbmVudCwgeyAuLi5jb250cm9sLCAuLi5wcm9wcyB9KVxuICAgIH1cbiAgICBjb25zdCBmaWVsZCA9IHRoaXMubW9kZWwudG9Qcm9wKClcbiAgICByZXR1cm4gY3JlYXRlRWxlbWVudChjb21wb25lbnQsIHsgZmllbGQsIGNvbnRyb2wsIC4uLnByb3BzIH0pXG4gIH1cbiAgc3RhdGljIGdldCBwcm9wVHlwZXMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN1cGVyLnByb3BUeXBlcyxcbiAgICAgIGluaXQ6IGFueSxcbiAgICAgIHZhbHVlOiBhbnksXG4gICAgICB0eXBlOiBzdHJpbmcsXG4gICAgICBwYXJzZTogZnVuYyxcbiAgICAgIGZvcm1hdDogZnVuYyxcbiAgICAgIG92ZXJyaWRlOiBmdW5jLFxuICAgICAgY29tcG9uZW50OiBvbmVPZlR5cGUoW3N0cmluZywgZnVuY10pLFxuICAgICAgaWQ6IG9uZU9mVHlwZShbbnVtYmVyLCBzdHJpbmcsIGJvb2xdKVxuICAgIH1cbiAgfVxuICBzdGF0aWMgZ2V0IGRlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3VwZXIuZGVmYXVsdFByb3BzLFxuICAgICAgaW5pdDogJycsXG4gICAgICBwYXJzZTogXy5pZCxcbiAgICAgIGZvcm1hdDogXy5pZCxcbiAgICAgIG92ZXJyaWRlOiBfLmlkXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBGaWVsZE1vZGVsIGV4dGVuZHMgU3VwZXJDb250cm9sLk1vZGVsIHtcbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgIHN1cGVyKC4uLmFyZ3MpXG4gICAgdGhpcy51cGRhdGUgPSB0aGlzLnVwZGF0ZS5iaW5kKHRoaXMpXG4gIH1cbiAgZ2V0IGlzRm9jdXNlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5mb3JtLmdldEZvY3VzZWQoKSA9PT0gdGhpc1xuICB9XG4gIGdldCBpc1Zpc2l0ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZm9ybS5nZXRWaXNpdGVkKHRoaXMucGF0aCwgZmFsc2UpXG4gIH1cbiAgZ2V0IGlzVG91Y2hlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5mb3JtLmdldFRvdWNoZWQodGhpcy5wYXRoLCBmYWxzZSlcbiAgfVxuICB1cGRhdGUoc3RhdGUsIHsgbm90aWZ5ID0gdHJ1ZSwgdmFsaWRhdGUgPSB0cnVlIH0gPSB7fSkge1xuICAgIHRoaXMuZm9ybS51cGRhdGUodGhpcy5wYXRoLCBzdGF0ZSwgeyBub3RpZnksIHZhbGlkYXRlIH0pXG4gIH1cbiAgdG9TdGF0ZSgpIHtcbiAgICByZXR1cm4gXy5waWNrKHRoaXMsIFtcbiAgICAgICdpbml0JywgJ3ZhbHVlJywgJ2Vycm9yJywgJ25vdGljZScsXG4gICAgICAnaXNGb2N1c2VkJywgJ2lzVmlzaXRlZCcsICdpc1RvdWNoZWQnXG4gICAgXSlcbiAgfVxuICB0b1Byb3AoKSB7XG4gICAgY29uc3QgbmFtZSA9IHRoaXMucGF0aC5wb3AoKVxuICAgIGNvbnN0IHN0YXRlID0gdGhpcy50b1N0YXRlKClcbiAgICBjb25zdCB7IGZvcm0sIHVwZGF0ZSB9ID0gdGhpc1xuICAgIGNvbnN0IGlzVmFsaWQgPSAhc3RhdGUuZXJyb3JcbiAgICBjb25zdCBpc0ludmFsaWQgPSAhaXNWYWxpZFxuICAgIGNvbnN0IGlzUHJpc3RpbmUgPSBfLmRlZXBFcXVhbChzdGF0ZS5pbml0LCBzdGF0ZS52YWx1ZSlcbiAgICBjb25zdCBpc0RpcnR5ID0gIWlzUHJpc3RpbmVcbiAgICByZXR1cm4gXy5hc3NpZ24oc3RhdGUsIHtcbiAgICAgIGZvcm0sIG5hbWUsIHVwZGF0ZSwgaXNWYWxpZCwgaXNJbnZhbGlkLCBpc0RpcnR5LCBpc1ByaXN0aW5lXG4gICAgfSlcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgbW9kZWxGaWVsZCA9ICguLi5hcmdzKSA9PiBuZXcgRmllbGRNb2RlbCguLi5hcmdzKVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBjcmVhdGVFbGVtZW50IH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBmdW5jLCBvYmplY3QsIHN0cmluZywgc2hhcGUgfSBmcm9tICdwcm9wLXR5cGVzJ1xuaW1wb3J0ICogYXMgXyBmcm9tICcuL3V0aWwnXG5cbmV4cG9ydCBjbGFzcyBGb3JtIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgIHN1cGVyKC4uLmFyZ3MpXG4gICAgdGhpcy5maWVsZElkID0gMFxuICAgIHRoaXMucm9vdCA9IG5ldyBGaWVsZHModGhpcy5maWVsZElkLCB7XG4gICAgICB2YWxpZGF0ZTogdGhpcy5wcm9wcy52YWxpZGF0ZVxuICAgIH0pXG4gICAgdGhpcy5zdGF0ZSA9IHRoaXMuZ2V0SW5pdGlhbFN0YXRlKClcbiAgICB0aGlzLm9uUmVzZXQgPSB0aGlzLm9uUmVzZXQuYmluZCh0aGlzKVxuICAgIHRoaXMub25TdWJtaXQgPSB0aGlzLm9uU3VibWl0LmJpbmQodGhpcylcbiAgICB0aGlzLnJlZ2lzdGVyID0gdGhpcy5yZWdpc3Rlci5iaW5kKHRoaXMpXG4gIH1cbiAgZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICBlcnJvcnM6IHt9LFxuICAgICAgbm90aWNlczoge30sXG4gICAgICB0b3VjaGVkOiB7fSxcbiAgICAgIHZpc2l0ZWQ6IHt9LFxuICAgICAgZm9jdXNlZDogbnVsbCxcbiAgICAgIHN1Ym1pdEZhaWxlZDogZmFsc2UsXG4gICAgICBpbml0OiB0aGlzLnByb3BzLmluaXQsXG4gICAgICB2YWx1ZXM6IHRoaXMucHJvcHMuaW5pdFxuICAgIH1cbiAgfVxuICBnZXRDaGlsZENvbnRleHQoKSB7XG4gICAgcmV0dXJuIHsgJ0BAc3VwZXItY29udHJvbHMnOiB7IHJlZ2lzdGVyOiB0aGlzLnJlZ2lzdGVyIH0gfVxuICB9XG4gIG9uUmVzZXQoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLmdldEluaXRpYWxTdGF0ZSgpKVxuICB9XG4gIG9uU3VibWl0KGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIGNvbnN0IHsgdmFsdWVzIH0gPSB0aGlzLnN0YXRlXG4gICAgY29uc3QgZXJyb3JzID0gdGhpcy5yb290LmNoZWNrQWxsKHZhbHVlcywgdmFsdWVzLCAndmFsaWRhdGUnKVxuICAgIGNvbnN0IGhhc0Vycm9ycyA9IF8ua2V5cyhlcnJvcnMpLnNvbWUoa2V5ID0+IGVycm9yc1trZXldKVxuICAgIGlmIChoYXNFcnJvcnMpIHJldHVybiB0aGlzLnNldFN0YXRlKHsgZXJyb3JzLCBzdWJtaXRGYWlsZWQ6IHRydWUgfSlcbiAgICB0aGlzLnByb3BzLm9uU3VibWl0KF8uY2xvbmUodmFsdWVzKSlcbiAgfVxuICBnZXQgZmllbGRzKCkge1xuICAgIHJldHVybiB0aGlzLnJvb3QuZmllbGRzXG4gIH1cbiAgZ2V0IHZhbHVlcygpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS52YWx1ZXNcbiAgfVxuICBnZXQgc3VibWl0RmFpbGVkKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXRlLnN1Ym1pdEZhaWxlZFxuICB9XG4gIHVwZGF0ZShwYXRoLCBzdGF0ZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgeyBjaGVjayB9ID0gdGhpcy5yb290XG4gICAgdGhpcy5zZXRTdGF0ZSgoe1xuICAgICAgaW5pdCwgdmFsdWVzLCBmb2N1c2VkLCB2aXNpdGVkLCBlcnJvcnMsIG5vdGljZXMsIHRvdWNoZWRcbiAgICB9KSA9PiB7XG4gICAgICBjb25zdCBuZXh0U3RhdGUgPSB7XG4gICAgICAgIGluaXQsIHZhbHVlcywgZm9jdXNlZCwgdmlzaXRlZCwgZXJyb3JzLCBub3RpY2VzLCB0b3VjaGVkXG4gICAgICB9XG4gICAgICBpZiAoJ2luaXQnIGluIHN0YXRlKSB7XG4gICAgICAgIG5leHRTdGF0ZS5pbml0ID0gXy5zZXQoaW5pdCwgcGF0aCwgc3RhdGUuaW5pdClcbiAgICAgIH1cbiAgICAgIGlmICgndmFsdWUnIGluIHN0YXRlKSB7XG4gICAgICAgIG5leHRTdGF0ZS52YWx1ZXMgPSBfLnNldCh2YWx1ZXMsIHBhdGgsIHN0YXRlLnZhbHVlKVxuICAgICAgICBpZiAob3B0aW9ucy52YWxpZGF0ZSkge1xuICAgICAgICAgIG5leHRTdGF0ZS5lcnJvcnMgPSBfLmFzc2lnbihcbiAgICAgICAgICAgIGVycm9ycyxcbiAgICAgICAgICAgIGNoZWNrKHN0YXRlLnZhbHVlLCB2YWx1ZXMsICd2YWxpZGF0ZScsIHBhdGgpXG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLm5vdGlmeSkge1xuICAgICAgICAgIG5leHRTdGF0ZS5ub3RpY2VzID0gXy5hc3NpZ24oXG4gICAgICAgICAgICBub3RpY2VzLFxuICAgICAgICAgICAgY2hlY2soc3RhdGUudmFsdWUsIHZhbHVlcywgJ25vdGlmeScsIHBhdGgpXG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoJ2lzVG91Y2hlZCcgaW4gc3RhdGUpIHtcbiAgICAgICAgbmV4dFN0YXRlLnRvdWNoZWQgPSBfLnNldCh0b3VjaGVkLCBwYXRoLCBzdGF0ZS5pc1RvdWNoZWQpXG4gICAgICB9XG4gICAgICBpZiAoJ2lzRm9jdXNlZCcgaW4gc3RhdGUpIHtcbiAgICAgICAgbmV4dFN0YXRlLmZvY3VzZWQgPSBzdGF0ZS5pc0ZvY3VzZWRcbiAgICAgICAgbmV4dFN0YXRlLnZpc2l0ZWQgPSBfLnNldCh2aXNpdGVkLCBwYXRoLCB0cnVlKVxuICAgICAgfVxuICAgICAgaWYgKCd1bnJlZ2lzdGVyZWQnIGluIHN0YXRlKSB7XG4gICAgICAgIG5leHRTdGF0ZS50b3VjaGVkID0gXy51bnNldCh0b3VjaGVkLCBwYXRoKVxuICAgICAgICBuZXh0U3RhdGUudmFsdWVzID0gXy51bnNldCh2YWx1ZXMsIHBhdGgpXG4gICAgICAgIG5leHRTdGF0ZS5pbml0ID0gXy51bnNldChpbml0LCBwYXRoKVxuICAgICAgfVxuICAgICAgcmV0dXJuIG5leHRTdGF0ZVxuICAgIH0pXG4gIH1cbiAgZ2V0SW5pdChwYXRoLCBmYWxsYmFjaykge1xuICAgIHJldHVybiBfLmdldCh0aGlzLnN0YXRlLmluaXQsIHBhdGgsIGZhbGxiYWNrKVxuICB9XG4gIGdldFZhbHVlKHBhdGgsIGZhbGxiYWNrKSB7XG4gICAgcmV0dXJuIF8uZ2V0KHRoaXMuc3RhdGUudmFsdWVzLCBwYXRoLCBmYWxsYmFjaylcbiAgfVxuICBnZXRUb3VjaGVkKHBhdGgsIGZhbGxiYWNrKSB7XG4gICAgcmV0dXJuIF8uZ2V0KHRoaXMuc3RhdGUudG91Y2hlZCwgcGF0aCwgZmFsbGJhY2spXG4gIH1cbiAgZ2V0Rm9jdXNlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5mb2N1c2VkXG4gIH1cbiAgZ2V0VmlzaXRlZChwYXRoLCBmYWxsYmFjaykge1xuICAgIHJldHVybiBfLmdldCh0aGlzLnN0YXRlLnZpc2l0ZWQsIHBhdGgsIGZhbGxiYWNrKVxuICB9XG4gIGdldEVycm9yKGZpZWxkSWQpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5lcnJvcnNbZmllbGRJZF0gfHwgbnVsbFxuICB9XG4gIGdldE5vdGljZShmaWVsZElkKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUubm90aWNlc1tmaWVsZElkXSB8fCBudWxsXG4gIH1cbiAgcmVnaXN0ZXIoeyBpbml0LCBtb2RlbCwgcGF0aHMgfSkge1xuICAgIGNvbnN0IHBhdGggPSBwYXRocy5tYXAoXy5pbnZva2UpXG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmdldEluaXQocGF0aClcbiAgICBpZiAoXy5pc1VuZGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgIGNvbnN0IGZpZWxkID0gbW9kZWwoKyt0aGlzLmZpZWxkSWQsIHRoaXMsIGluaXQsIHBhdGhzKVxuICAgICAgdGhpcy5yb290LnJlZ2lzdGVyKGZpZWxkLCBwYXRoKVxuICAgICAgdGhpcy51cGRhdGUocGF0aCwgeyBpbml0LCB2YWx1ZTogaW5pdCB9KVxuICAgICAgcmV0dXJuIGZpZWxkXG4gICAgfVxuICAgIGNvbnN0IGZpZWxkID0gbW9kZWwoKyt0aGlzLmZpZWxkSWQsIHRoaXMsIHZhbHVlLCBwYXRocylcbiAgICByZXR1cm4gdGhpcy5yb290LnJlZ2lzdGVyKGZpZWxkLCBwYXRoKVxuICB9XG4gIHVucmVnaXN0ZXIoeyBwYXRoIH0pIHtcbiAgICBpZiAoXy5pc1VuZGVmaW5lZCh0aGlzLmdldFZhbHVlKHBhdGgpKSAmJlxuICAgICAgICBfLmlzVW5kZWZpbmVkKHRoaXMuZ2V0SW5pdChwYXRoKSkgJiZcbiAgICAgICAgXy5pc1VuZGVmaW5lZCh0aGlzLmdldFRvdWNoZWQocGF0aCkpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdGhpcy51cGRhdGUocGF0aCwgeyB1bnJlZ2lzdGVyZWQ6IHRydWUgfSlcbiAgfVxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUVsZW1lbnQoJ2Zvcm0nLCB7XG4gICAgICAuLi5fLm9taXQodGhpcy5wcm9wcywgWydpbml0JywgJ25vdGlmeScsICd2YWxpZGF0ZSddKSxcbiAgICAgIG9uUmVzZXQ6IHRoaXMub25SZXNldCxcbiAgICAgIG9uU3VibWl0OiB0aGlzLm9uU3VibWl0XG4gICAgfSlcbiAgfVxuICBzdGF0aWMgZ2V0IHByb3BUeXBlcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogc3RyaW5nLFxuICAgICAgbm90aWZ5OiBmdW5jLFxuICAgICAgdmFsaWRhdGU6IGZ1bmMsXG4gICAgICBpbml0OiBvYmplY3QsXG4gICAgICBvblN1Ym1pdDogZnVuY1xuICAgIH1cbiAgfVxuICBzdGF0aWMgZ2V0IGRlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaW5pdDoge30sXG4gICAgICBub3RpZnk6IF8ubm9vcCxcbiAgICAgIHZhbGlkYXRlOiBfLm5vb3AsXG4gICAgICBvblN1Ym1pdDogXy5ub29wXG4gICAgfVxuICB9XG4gIHN0YXRpYyBnZXQgY2hpbGRDb250ZXh0VHlwZXMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdAQHN1cGVyLWNvbnRyb2xzJzogc2hhcGUoe1xuICAgICAgICByZWdpc3RlcjogZnVuY1xuICAgICAgfSlcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEZpZWxkcyB7XG4gIGNvbnN0cnVjdG9yKGlkLCB7IHZhbGlkYXRlIH0pIHtcbiAgICB0aGlzLmlkID0gaWRcbiAgICB0aGlzLmZpZWxkcyA9IHt9XG4gICAgdGhpcy5fdmFsaWRhdGUgPSB2YWxpZGF0ZVxuICAgIHRoaXMuY2hlY2sgPSB0aGlzLmNoZWNrLmJpbmQodGhpcylcbiAgfVxuICByZWdpc3RlcihmaWVsZCwgWyBrZXksIC4uLnBhdGggXSkge1xuICAgIGNvbnN0IHsgZmllbGRzIH0gPSB0aGlzXG4gICAgdGhpcy5maWVsZHMgPSBwYXRoLmxlbmd0aFxuICAgICAgPyBfLmFzc2lnbihmaWVsZHMsIHsgW2tleV06IGZpZWxkc1trZXldLnJlZ2lzdGVyKGZpZWxkLCBwYXRoKSB9KVxuICAgICAgOiBfLmFzc2lnbihmaWVsZHMsIHsgW2tleV06IGZpZWxkIH0pXG4gICAgcmV0dXJuIGZpZWxkXG4gIH1cbiAgY2hlY2sodmFsdWUsIHZhbHVlcywgbWV0aG9kLCBbIGtleSwgLi4ucGF0aCBdID0gW10pIHtcbiAgICBpZiAoXy5pc1VuZGVmaW5lZChrZXkpKSB7XG4gICAgICByZXR1cm4geyBbdGhpcy5pZF06IHRoaXNbYF8ke21ldGhvZH1gXSh2YWx1ZSkgfHwgbnVsbCB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmZpZWxkc1trZXldLmNoZWNrKHZhbHVlLCB2YWx1ZXMsIG1ldGhvZCwgcGF0aClcbiAgfVxuICBjaGVja0FsbCh2YWx1ZSwgdmFsdWVzLCBtZXRob2QpIHtcbiAgICByZXR1cm4gXy5rZXlzKHRoaXMuZmllbGRzKVxuICAgICAgLnJlZHVjZSgoY2hlY2tlZCwga2V5KSA9PiB7XG4gICAgICAgIGNvbnN0IHsgY2hlY2ssIGNoZWNrQWxsIH0gPSB0aGlzLmZpZWxkc1trZXldXG4gICAgICAgIHJldHVybiBfLmFzc2lnbihcbiAgICAgICAgICBjaGVja2VkLFxuICAgICAgICAgIChjaGVja0FsbCB8fCBjaGVjaykodmFsdWVzW2tleV0sIHZhbHVlcywgbWV0aG9kKVxuICAgICAgICApXG4gICAgICB9LCB0aGlzLmNoZWNrKHZhbHVlLCB2YWx1ZXMsIG1ldGhvZCkpXG4gIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgc3RyaW5nLCBzaGFwZSwgZnVuYywgbnVtYmVyLCBvbmVPZlR5cGUgfSBmcm9tICdwcm9wLXR5cGVzJ1xuaW1wb3J0ICogYXMgXyBmcm9tICcuL3V0aWwnXG5cbmV4cG9ydCBjbGFzcyBWaWV3IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgIHN1cGVyKC4uLmFyZ3MpXG4gICAgdGhpcy5yZWdpc3RlciA9IHRoaXMucmVnaXN0ZXIuYmluZCh0aGlzKVxuICB9XG4gIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICB0aGlzLm1vZGVsID0gdGhpcy5jb250ZXh0WydAQHN1cGVyLWNvbnRyb2xzJ10ucmVnaXN0ZXIoe1xuICAgICAgaW5pdDogdGhpcy5nZXRJbml0KCksXG4gICAgICBwYXRoczogW18gPT4gdGhpcy5wcm9wcy5uYW1lXSxcbiAgICAgIG1vZGVsOiAoLi4uYXJncykgPT4gdGhpcy5tb2RlbEZpZWxkKC4uLmFyZ3MsIHtcbiAgICAgICAgbm90aWZ5OiB0aGlzLnByb3BzLm5vdGlmeSxcbiAgICAgICAgdmFsaWRhdGU6IHRoaXMucHJvcHMudmFsaWRhdGVcbiAgICAgIH0pXG4gICAgfSlcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMubW9kZWwudG9TdGF0ZSgpKVxuICB9XG4gIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMsIG5leHRTdGF0ZSkge1xuICAgIHJldHVybiAhXy5lcXVhbFByb3BzKHRoaXMucHJvcHMsIG5leHRQcm9wcykgfHxcbiAgICAgICAgICAgIV8uZGVlcEVxdWFsKHRoaXMubW9kZWwudG9TdGF0ZSgpLCBuZXh0U3RhdGUpXG4gIH1cbiAgY29tcG9uZW50RGlkVXBkYXRlKCkge1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5tb2RlbC50b1N0YXRlKCkpXG4gIH1cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5tb2RlbC51bnJlZ2lzdGVyKClcbiAgfVxuICByZWdpc3Rlcih7IGluaXQsIG1vZGVsLCBwYXRocyB9KSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dFsnQEBzdXBlci1jb250cm9scyddLnJlZ2lzdGVyKHtcbiAgICAgIGluaXQsXG4gICAgICBtb2RlbCxcbiAgICAgIHBhdGhzOiBbXyA9PiB0aGlzLnByb3BzLm5hbWUsIC4uLnBhdGhzXVxuICAgIH0pXG4gIH1cbiAgZ2V0Q2hpbGRDb250ZXh0KCkge1xuICAgIHJldHVybiB7ICdAQHN1cGVyLWNvbnRyb2xzJzogeyByZWdpc3RlcjogdGhpcy5yZWdpc3RlciB9IH1cbiAgfVxuICBzdGF0aWMgZ2V0IHByb3BUeXBlcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbm90aWZ5OiBmdW5jLFxuICAgICAgdmFsaWRhdGU6IGZ1bmMsXG4gICAgICBuYW1lOiBvbmVPZlR5cGUoW3N0cmluZywgbnVtYmVyXSkuaXNSZXF1aXJlZFxuICAgIH1cbiAgfVxuICBzdGF0aWMgZ2V0IGRlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbm90aWZ5OiBfLm5vb3AsXG4gICAgICB2YWxpZGF0ZTogXy5ub29wLFxuICAgICAgY29tcG9uZW50OiBfID0+IG51bGxcbiAgICB9XG4gIH1cbiAgc3RhdGljIGdldCBjb250ZXh0VHlwZXMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdAQHN1cGVyLWNvbnRyb2xzJzogc2hhcGUoe1xuICAgICAgICByZWdpc3RlcjogZnVuYy5pc1JlcXVpcmVkXG4gICAgICB9KVxuICAgIH1cbiAgfVxuICBzdGF0aWMgZ2V0IGNoaWxkQ29udGV4dFR5cGVzKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHRUeXBlc1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBNb2RlbCB7XG4gIGNvbnN0cnVjdG9yKGlkLCBmb3JtLCBpbml0LCBwYXRocywgeyBub3RpZnksIHZhbGlkYXRlLCBvdmVycmlkZSB9ID0ge30pIHtcbiAgICB0aGlzLmlkID0gaWRcbiAgICB0aGlzLmZvcm0gPSBmb3JtXG4gICAgdGhpcy5faW5pdCA9IGluaXRcbiAgICB0aGlzLl9wYXRoID0gcGF0aHNcbiAgICB0aGlzLl9ub3RpZnkgPSBub3RpZnkgfHwgXy5ub29wXG4gICAgdGhpcy5fdmFsaWRhdGUgPSB2YWxpZGF0ZSB8fCBfLm5vb3BcbiAgICB0aGlzLl9vdmVycmlkZSA9IG92ZXJyaWRlIHx8IF8uaWRcbiAgICB0aGlzLmNoZWNrID0gdGhpcy5jaGVjay5iaW5kKHRoaXMpXG4gIH1cbiAgZ2V0IHBhdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BhdGgubWFwKF8uaW52b2tlKVxuICB9XG4gIGdldCBpbml0KCkge1xuICAgIHJldHVybiB0aGlzLmZvcm0uZ2V0SW5pdCh0aGlzLnBhdGgsIHRoaXMuX2luaXQpXG4gIH1cbiAgZ2V0IHZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLmZvcm0uZ2V0VmFsdWUodGhpcy5wYXRoLCB0aGlzLmluaXQpXG4gIH1cbiAgZ2V0IGVycm9yKCkge1xuICAgIHJldHVybiB0aGlzLmZvcm0uZ2V0RXJyb3IodGhpcy5pZClcbiAgfVxuICBnZXQgbm90aWNlKCkge1xuICAgIHJldHVybiB0aGlzLmZvcm0uZ2V0Tm90aWNlKHRoaXMuaWQpXG4gIH1cbiAgY2hlY2sodmFsdWUsIHZhbHVlcywgbWV0aG9kKSB7XG4gICAgcmV0dXJuIHsgW3RoaXMuaWRdOiB0aGlzW2BfJHttZXRob2R9YF0odmFsdWUsIHZhbHVlcykgfHwgbnVsbCB9XG4gIH1cbiAgdW5yZWdpc3RlcigpIHtcbiAgICB0aGlzLmZvcm0udW5yZWdpc3Rlcih0aGlzKVxuICB9XG59XG4iLCJleHBvcnQgY29uc3QgaWQgPSB4ID0+IHhcblxuZXhwb3J0IGNvbnN0IG5vb3AgPSAoKSA9PiB7fVxuXG5leHBvcnQgY29uc3QgaW52b2tlID0gKGZuLCAuLi5hcmdzKSA9PiBmbiguLi5hcmdzKVxuXG5leHBvcnQgY29uc3QgaXNBcnJheSA9IHZhbCA9PiBBcnJheS5pc0FycmF5KHZhbClcblxuZXhwb3J0IGNvbnN0IGlzT2JqZWN0ID0gdmFsID0+ICh7fSkudG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBPYmplY3RdJ1xuXG5leHBvcnQgY29uc3QgaXNTdHJpbmcgPSB2YWwgPT4gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZydcblxuZXhwb3J0IGNvbnN0IGlzQm9vbGVhbiA9IHZhbCA9PiB0eXBlb2YgdmFsID09PSAnYm9vbGVhbidcblxuZXhwb3J0IGNvbnN0IGlzVW5kZWZpbmVkID0gdmFsID0+IHZhbCA9PT0gdm9pZCAwXG5cbmV4cG9ydCBjb25zdCBpc0luZGV4ID0gdmFsID0+IE51bWJlci5pc0ludGVnZXIodmFsKVxuXG5leHBvcnQgY29uc3Qga2V5cyA9IG9iaiA9PiBPYmplY3Qua2V5cyhvYmopXG5cbmV4cG9ydCBjb25zdCBvbWl0ID0gKHNvdXJjZSwgcHJvcHMpID0+IGtleXMoc291cmNlKVxuICAucmVkdWNlKChvbWl0dGVkLCBrZXkpID0+XG4gICAgcHJvcHMuaW5jbHVkZXMoa2V5KVxuICAgICAgPyBvbWl0dGVkXG4gICAgICA6IGFzc2lnbihvbWl0dGVkLCB7IFtrZXldOiBzb3VyY2Vba2V5XSB9KVxuICAgICwge30pXG5cbmV4cG9ydCBjb25zdCBwaWNrID0gKHNvdXJjZSwgcHJvcHMpID0+XG4gIHByb3BzLnJlZHVjZSgocGlja2VkLCBwcm9wKSA9PiBhc3NpZ24oXG4gICAgcGlja2VkLFxuICAgIHsgW3Byb3BdOiBzb3VyY2VbcHJvcF0gfVxuICApLCB7fSlcblxuZXhwb3J0IGNvbnN0IGFzc2lnbiA9ICguLi5hcmdzKSA9PiBPYmplY3QuYXNzaWduKHt9LCAuLi5hcmdzKVxuXG5leHBvcnQgY29uc3Qgc2xpY2VJbiA9IChhcnJheSwgaW5kZXgsIHZhbHVlKSA9PiBbXG4gIC4uLmFycmF5LnNsaWNlKDAsIGluZGV4KSxcbiAgdmFsdWUsXG4gIC4uLmFycmF5LnNsaWNlKGluZGV4KVxuXVxuXG5leHBvcnQgY29uc3Qgc2xpY2VPdXQgPSAoYXJyYXksIGluZGV4KSA9PiBbXG4gIC4uLmFycmF5LnNsaWNlKDAsIGluZGV4KSxcbiAgLi4uYXJyYXkuc2xpY2UoaW5kZXggKyAxKVxuXVxuXG5leHBvcnQgY29uc3Qgc2xpY2VPdmVyID0gKFsgLi4uc2xpY2VkIF0sIGluZGV4LCB2YWwpID0+IHtcbiAgc2xpY2VkW2luZGV4XSA9IHZhbFxuICByZXR1cm4gc2xpY2VkXG59XG5cbmV4cG9ydCBjb25zdCBleGlzdHMgPSAodGFyZ2V0LCBrZXkpID0+XG4gIGlzQXJyYXkodGFyZ2V0KVxuICAgID8gIWlzVW5kZWZpbmVkKHRhcmdldFtrZXldKVxuICAgIDogdGFyZ2V0Lmhhc093blByb3BlcnR5KGtleSlcblxuZXhwb3J0IGNvbnN0IHJlcGxhY2UgPSAodGFyZ2V0LCBrZXksIHZhbCkgPT5cbiAgaXNBcnJheSh0YXJnZXQpXG4gICAgPyBzbGljZU92ZXIodGFyZ2V0LCBrZXksIHZhbClcbiAgICA6IGFzc2lnbih0YXJnZXQsIHsgW2tleV06IHZhbCB9KVxuXG5leHBvcnQgY29uc3QgcmVtb3ZlID0gKHRhcmdldCwga2V5KSA9PlxuICBpc0FycmF5KHRhcmdldClcbiAgICA/IHNsaWNlT3V0KHRhcmdldCwga2V5KVxuICAgIDogb21pdCh0YXJnZXQsIFtrZXldKVxuXG5leHBvcnQgY29uc3QgZ2V0ID0gKHNvdXJjZSwgW2tleSwgLi4ucGF0aF0sIGZhbGxiYWNrKSA9PiB7XG4gIGlmIChpc1VuZGVmaW5lZChzb3VyY2UpIHx8ICFleGlzdHMoc291cmNlLCBrZXkpKSByZXR1cm4gZmFsbGJhY2tcbiAgaWYgKCFwYXRoLmxlbmd0aCkgcmV0dXJuIHNvdXJjZVtrZXldXG4gIHJldHVybiBnZXQoc291cmNlW2tleV0sIHBhdGgsIGZhbGxiYWNrKVxufVxuXG5leHBvcnQgY29uc3Qgc2V0ID0gKHRhcmdldCwgW2tleSwgaW5kZXgsIC4uLnBhdGhdLCB2YWwpID0+IHtcbiAgaWYgKGlzVW5kZWZpbmVkKGluZGV4KSkgcmV0dXJuIHJlcGxhY2UodGFyZ2V0LCBrZXksIHZhbClcbiAgY29uc3QgbmVzdGVkID0gdGFyZ2V0W2tleV0gfHwgKGlzSW5kZXgoaW5kZXgpID8gW10gOiB7fSlcbiAgcmV0dXJuIHJlcGxhY2UodGFyZ2V0LCBrZXksIHNldChuZXN0ZWQsIFtpbmRleCwgLi4ucGF0aF0sIHZhbCkpXG59XG5cbmV4cG9ydCBjb25zdCB1bnNldCA9ICh0YXJnZXQsIFtrZXksIC4uLnBhdGhdLCB2YWwpID0+IHtcbiAgaWYgKCFleGlzdHModGFyZ2V0LCBrZXkpKSByZXR1cm4gdGFyZ2V0XG4gIGlmICghcGF0aC5sZW5ndGgpIHJldHVybiByZW1vdmUodGFyZ2V0LCBrZXkpXG4gIHJldHVybiByZXBsYWNlKHRhcmdldCwga2V5LCB1bnNldCh0YXJnZXRba2V5XSwgcGF0aCwgdmFsKSlcbn1cblxuZXhwb3J0IGNvbnN0IGNsb25lID0gc291cmNlID0+IHtcbiAgaWYgKGlzQXJyYXkoc291cmNlKSkgcmV0dXJuIHNvdXJjZS5tYXAoY2xvbmUpXG4gIGlmIChpc09iamVjdChzb3VyY2UpKSB7XG4gICAgcmV0dXJuIGtleXMoc291cmNlKVxuICAgICAgLnJlZHVjZSgoY2xvbmVkLCBrZXkpID0+IGFzc2lnbihcbiAgICAgICAgY2xvbmVkLFxuICAgICAgICB7IFtrZXldOiBjbG9uZShzb3VyY2Vba2V5XSkgfVxuICAgICAgKSwge30pXG4gIH1cbiAgcmV0dXJuIHNvdXJjZVxufVxuXG5leHBvcnQgY29uc3Qgc29tZVZhbHVlcyA9ICh0YXJnZXQsIHByZWRpY2F0ZSkgPT4ge1xuICBpZiAoaXNBcnJheSh0YXJnZXQpKSB7XG4gICAgcmV0dXJuICEhdGFyZ2V0LmZpbmQoY2hpbGQgPT4gc29tZVZhbHVlcyhjaGlsZCwgcHJlZGljYXRlKSlcbiAgfVxuICBpZiAoaXNPYmplY3QodGFyZ2V0KSkge1xuICAgIHJldHVybiAhIWtleXModGFyZ2V0KS5maW5kKGtleSA9PiBzb21lVmFsdWVzKHRhcmdldFtrZXldLCBwcmVkaWNhdGUpKVxuICB9XG4gIHJldHVybiAhIXByZWRpY2F0ZSh0YXJnZXQpXG59XG5cbmV4cG9ydCBjb25zdCBlcXVhbEV4Y2VwdCA9ICguLi5pZ25vcmUpID0+IChhLCBiKSA9PiB7XG4gIGlmIChhID09PSBiKSByZXR1cm4gdHJ1ZVxuICBjb25zdCBhS2V5cyA9IGtleXMoYSlcbiAgY29uc3QgYktleXMgPSBrZXlzKGIpXG4gIHJldHVybiBhS2V5cy5sZW5ndGggPT09IGJLZXlzLmxlbmd0aCAmJlxuICAgICAgICAgYUtleXMuZXZlcnkoa2V5ID0+IGlnbm9yZS5pbmNsdWRlcyhrZXkpIHx8IGFba2V5XSA9PT0gYltrZXldKVxufVxuXG5leHBvcnQgY29uc3QgZXF1YWxQcm9wcyA9IGVxdWFsRXhjZXB0KCduYW1lJywgJ2NoaWxkcmVuJylcblxuZXhwb3J0IGNvbnN0IHNoYWxsb3dFcXVhbCA9IGVxdWFsRXhjZXB0KClcblxuZXhwb3J0IGNvbnN0IGRlZXBFcXVhbCA9IChhLCBiKSA9PiB7XG4gIGlmIChhID09PSBiKSByZXR1cm4gdHJ1ZVxuICBpZiAoaXNBcnJheShhKSAmJiBpc0FycmF5KGIpKSB7XG4gICAgcmV0dXJuIGEubGVuZ3RoID09PSBiLmxlbmd0aCAmJlxuICAgICAgICAgICBhLmV2ZXJ5KChfLCBpbmRleCkgPT4gZGVlcEVxdWFsKGFbaW5kZXhdLCBiW2luZGV4XSkpXG4gIH1cbiAgaWYgKGlzT2JqZWN0KGEpICYmIGlzT2JqZWN0KGIpKSB7XG4gICAgY29uc3QgYUtleXMgPSBrZXlzKGEpXG4gICAgY29uc3QgYktleXMgPSBrZXlzKGIpXG4gICAgcmV0dXJuIGFLZXlzLmxlbmd0aCA9PT0gYktleXMubGVuZ3RoICYmXG4gICAgICAgICAgIGFLZXlzLmV2ZXJ5KGtleSA9PiBkZWVwRXF1YWwoYVtrZXldLCBiW2tleV0pKVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuIl19
