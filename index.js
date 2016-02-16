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
    this.emit = function ( _event, arg ) {
      arg = arguments.length > 1 ?
        Array.prototype.slice.call( arguments, 1 ) : [ arg ];
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
console.log( 'emitter=', emitter.emmitter );
emitter.on( 'hola', function* ( next, a ) {
  console.log( 'recibi 1', a );
  let res = yield Promise.resolve( 'en la primesa 1' )
  console.log( 'res==', res );
  yield next
  console.log( 'regreso promesa 1 ', res );
  yield Promise.resolve( 4 )
} )
emitter.on( 'hola', function* ( next, a ) {
  console.log( 'recibi 2', a );
  let res = yield Promise.resolve( 'en la primesa 2' )
  console.log( 'res==', res );
  yield next
  console.log( 'regreso promesa 2 ', res );
  yield Promise.resolve( 4 )
} )
emitter.on( 'hola', function* ( a ) {
  console.log( 'recibi3', a );
  let res = yield Promise.resolve( 'en la primesa 3' )
  console.log( 'res==', res );
  res = yield Promise.resolve( 4 )
  console.log( 'regreso promesa 3', res );
} )
console.log( 'numero', emitter.emmitter.listenerCount( 'hola' ) );
emitter.emit( 'hola', 'uno', 'dos' )
module.exports = MyEmitter