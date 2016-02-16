'use strict'
const EventEmitter = require( 'events' );
const co = require( 'co' )
let funBuilder, chaining

let MyEmitter = function ( ) {
  this.emmitter = new EventEmitter( )
  this.events = {}
  this.on = function ( event, eventHandler ) {
      this.events[ event ] = this.events[ event ] || {}
      this.events[ event ].eventHandlerGen = this.events[ event ].eventHandlerGen || [ ]
      this.events[ event ].eventHandlerGen.push( eventHandler )
      this.events[ event ].eventHandlerFun = funBuilder( this.events[ event ]
        .eventHandlerGen )
      this.emmitter.removeAllListeners( event )
      this.emmitter.addListener( event, this.events[ event ].eventHandlerFun )
    },
    this.once = function ( event, eventHandler ) {
      this.events[ event ] = this.events[ event ] || {}
      this.events[ event ].eventHandlerGen = this.events[ event ].eventHandlerGen || [ ]
      this.events[ event ].eventHandlerGen.push( eventHandler )
      this.events[ event ].eventHandlerFun = funBuilder( this.events[ event ]
        .eventHandlerGen )
      this.emmitter.removeAllListeners( event )
      this.emmitter.once( event, this.events[ event ].eventHandlerFun )
    },
    this.emit = function ( _event, arg ) {
      arg = arguments.length > 1 ?
        Array.prototype.slice.call( arguments, 1 ) : arg;
      return this.emmitter.emit( _event, arg )
    }
  let ctx = this
  funBuilder = function ( arrayOfeventHandlerGen ) {
    return function ( ) {
      let arg = Array.prototype.slice.call( arguments, 0 );
      co( chaining( arg, arrayOfeventHandlerGen, 0 ) )
    }
  }
  chaining = function ( arg, array, index ) {
    if ( index < ( array.length - 2 ) ) {
      return array[ index ].apply( ctx, [ chaining( arg, array, index + 1 ) ]
        .concat(
          arg ) )
    } else {
      return array[ index ].apply( ctx, [ array[ index + 1 ].apply( arg ) ]
        .concat(
          arg ) )
    }

  }
}

let emitter = new MyEmitter( )
module.exports = MyEmitter