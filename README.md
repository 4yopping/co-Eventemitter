# co-eventemitter



co-eventemitter for JavaScript

# Installing

```bash
$ npm install co-eventemitter
```

# Getting starter

```js

let CoEvent = require( 'co-eventemitter' )
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


## Contributing
In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.  For any bugs report please contact to me via e-mail: cereceres@ciencias.unam.mx.

## Licence
The MIT License (MIT)

Copyright (c) 2015 Jesús Edel Cereceres with Andrés González and Marco Godínez as collaborators, 4yopping and all the related trademarks.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

