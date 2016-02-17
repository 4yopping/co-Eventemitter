'use strict'
let assert = require( 'assert' )
let CoEvent = require( '../index' )
let count = 0

describe( 'Test for Coevent', function ( ) {
  this.timeout( 10000 )
  before( function ( ) {
    this.Myemmiter = new CoEvent( )
    this.gen1 = function* ( arg, next ) {
      count++
      let res = yield Promise.resolve( 4 )
      assert.equal( res, 4 )
      yield next
      assert.equal( arg, 'hola' )
    }

    this.gen2 = function* ( arg ) {
      count++
      let res = yield Promise.resolve( '54' )
      assert.equal( res, '54' )
      assert.equal( arg, 'hola' )
    }
    this.Myemmiter.on( 'test', this.gen1, this.gen2 )
  } )
  it( 'should send a post', function ( done ) {
    this.Myemmiter.emit( 'test', 'hola' )
      .then( function ( ) {
        assert.equal( count, 2 )
        done( )
      } )
      .catch( done )
  } )
} )