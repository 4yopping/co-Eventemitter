# co-emmitter

<a href="http://4yopping.com">
    <img src="http://4yopping.com/4yopping.png" alt="4yopping Logo"
         title="4yopping Logo" align="right" width="120px" height="125px" />
</a>


co-event for JavaScript

# Installing

```bash
$ npm install co-event
```

# Getting starter

```js

let CoEvent = require( 'co-event' )
let coEvent = new CoEvent()
```
# Usage

Create

```js
//the generator are called with a arg and next, what is the next generator
let gen1 = function* ( arg, next ) {
  count++
  // every generator is wrapper with co
  let res = yield Promise.resolve( 4 )
  assert.equal( res, 4 )
  //this statement pass the control flow to next generator in the array
  yield next
  assert.equal( arg, {a:3})
}

let gen2 = function* ( arg ) {
  count++
  let res = yield Promise.resolve( '54' )
  assert.equal( res, '54' )
  assert.equal.deep( arg, {a:3} )
}
coEvent.on( 'test', gen1, gen2 )
coEvent.emit( 'test',{a:3})
// every generator is called with arg={a:3}

assert.equal( count,2 )
// count is equal to generator number
// the emitter property is a EventEmitter instance self,
// where every method and property affect to CoEvent instance too.
// Also can use once method exposed to CoEvent to use generators wrapper
// with co.
```


# Testing

Running the tests

```bash
npm test
```


## Documentation
Run task

```bash
npm docs
```


## License
This projects and it's consequent projects, modules and connections will not be under any open source license until the 4yopping CTO communicates the contrary in a formal way.
