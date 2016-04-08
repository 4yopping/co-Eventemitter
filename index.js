'use strict'
const EventEmitter = require('events');
const co = require('co')
let wildcard = require('wildcard');
let chaining, toGenerator
let handlerPromiseGen, l
  /**
   * slice() reference.
   */
let slice = Array.prototype.slice;
/**
 * @param {Object} to be use as thisArg in every generator
 * @return {Object} instance of coEvent
 * @api public
 */
let CoEvent = function(ctx, separator) {
  /**
   * if is not called with new, a instance of coEvent is returned
   */
  this.separator = '.'
  separator && (this.separator = separator)
  if (!(this instanceof CoEvent)) {
    return new CoEvent()
  }
  /**
   *  EventEmitter is instanced and added to object
   */
  this.emitter = new EventEmitter()
  this.events = {}
    /**
     *  ctx to be used in every generator
     */
  this.ctx = ctx || {}
  var _this = this
    /**
     * @param {String} event {Array} _eventHandler of generator to be used, can be too onle one generator
     * @return {Object} it self
     * @api public
     */
  this.on = function(event, _eventHandler) {
    _eventHandler = arguments.length > 2 ? slice.call(arguments, 1) :
      Array.isArray(_eventHandler) ? _eventHandler : [
        _eventHandler
      ]
    let eventHandler = toGenerator(_eventHandler)
    this.events[event] = this.events[event] || {}
    this.events[event].eventHandlerGen = this.events[event].eventHandlerGen !==
      undefined ? this.events[event].eventHandlerGen : []
      /**The news generator are added*/
    this.events[event].eventHandlerGen = this.events[event].eventHandlerGen
      .concat(eventHandler)
      /**The old generators are removed*/
    this.emitter.removeAllListeners(event)
    let arrayOfeventHandlerGen = this.events[event].eventHandlerGen
    this.emitter.on(event, function(arg, res, rej) {
      _this.ctx.event = event
      co.apply(_this.ctx, [chaining(arg, arrayOfeventHandlerGen, 0)])
        .then(res)
        .catch(rej)
    })
    return this
  }

  /**
   * @param {String} event {Array} _eventHandler of generator to be used, can be too onle one generator
   * @return {Object} it self
   * @api public
   */
  this.once = function(event, _eventHandler) {
      _eventHandler = arguments.length > 2 ? slice.call(arguments, 1) :
        Array.isArray(_eventHandler) ? _eventHandler : [
          _eventHandler
        ]
      let eventHandler = toGenerator(_eventHandler)
      this.events[event] = this.events[event] || {}
      this.events[event].eventHandlerGen = this.events[event].eventHandlerGen || []
      l = this.events[event].eventHandlerGen.length
      this.indexes = this.indexes || []
      for (var i = 0; i < _eventHandler.length; i++) {
        this.indexes.push(l + i)
      }

      /**The news generator are added*/
      this.events[event].eventHandlerGen = this.events[event].eventHandlerGen
        .concat(eventHandler)
        /**The old generators are removed*/
      this.emitter.removeAllListeners(event)
      this.emitter.once(event, function(arg, res, rej) {
        co.call(_this.ctx, chaining(arg, this.events[event].eventHandlerGen,
            0))
          .then(function(r) {
            for (var i = 0; i < _this.indexes.length; i++) {
              _this.events[event].eventHandlerGen.splice(_this.indexes[
                i], 0)
            }
            _this.indexes = []
            if (!_this.events[event].eventHandlerGen.length) {
              delete _this.events[event]
            }
            res(r)
          })
          .catch(rej)
      })
      return this
    }
    /**
     * @param {String} _event to be emitted {Array} arg to be send the listener
     * @return {Promise} to be resolved when every iterator finish or rejected
     * if a error is catched
     * @api public
     */
  this.emit = function(_event, arg) {
      arg = arguments.length > 2 ?
        slice.call(arguments, 1) : [typeof arg === 'undefined' ? {} :
          typeof arg === 'object' ? arg : new Object(arg)
        ];
      let its = _event.indexOf('*')
      if (its >= 0) {
        let promises = []
        for (var prop in this.events) {
          wildcard(_event, prop, this.separator) &&
            (promises.push(new Promise(handlerPromiseGen(prop, arg))))
        }
        return !promises.length ? Promise.all(promises) : Promise.resolve()
      } else {
        return new Promise(handlerPromiseGen(_event, arg))
      }

    }
    /**
     * @param {Object}arg {Array} generators {Number} index of array of generators
     * @return {function} chained
     * @api private
     */
  chaining = function(arg, array, index) {
      if (array.length === 1) {
        return array[0].apply(_this.ctx, arg)
      } else if (array.length === 2) {
        return array[0].apply(_this.ctx, arg.concat(array[1].apply(
          _this.ctx,
          arg)))
      } else if (index < (array.length - 2)) {
        return array[index].apply(_this.ctx, arg.concat(chaining(arg,
          array,
          index +
          1)))
      } else {
        return array[index].apply(_this.ctx, arg.concat(array[
            (index + 1) % array.length]
          .apply(
            _this.ctx,
            arg)))
      }

    }
    /**
     * @param {Array} map the arg to be a generators
     * @api private
     */
  toGenerator = function(fns) {
    fns = Array.isArray(fns) ? fns : [fns]
    return fns.map(function(fn) {
      if (fn.constructor.name === 'GeneratorFunction') {
        return fn
      } else if (typeof fn === 'function') {
        return function*() {
          let arg = slice.call(arguments, 0)
          yield toGenerator(fn.apply(_this.ctx, arg))
        }
      }
      return fn
    })
  }

  handlerPromiseGen = function(_event, arg) {
    return function(resolve, reject) {
      (!_this.emitter.emit(_event, arg, resolve, reject)) &&
      resolve('NotListener')
    }
  }
}

/**
 * Expose `coEvent`.
 */
module.exports = CoEvent
