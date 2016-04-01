'use strict'
let assert = require('assert')
let CoEvent = require('../index')
let count = 0,
  i = 0,
  j = 0


describe('Test for Coevent', function() {
  this.timeout(10000)
  before(function() {
    this.Myemmiter = new CoEvent()
    this.gen1 = function*(arg, next) {
      //assert(this instanceof CoEvent)
      count++
      let res = yield Promise.resolve(4)
      assert.equal(res, 4)
      yield next
      assert.equal(arg, 'hola')
    }

    this.gen2 = function*(arg) {
      count++
      let res = yield Promise.resolve('54')
      assert.equal(res, '54')
      assert.equal(arg, 'hola')
      let n = Math.random()
      if (n < 0.5) {
        throw n
      } else {
        return '_'
      }
      this.emit('test:done', '_')
    }
    this.Myemmiter.on('test', [this.gen1, this.gen2])
    this.Myemmiter.on('testWithError', function*() {
      let res = yield Promise.resolve(0)
      assert.equal(res, 0)
      throw 'hola with error'
    })
    this.Myemmiter.on('test:done', function*(_r) {
      assert(_r === '_')
      let res = yield Promise.resolve(2)
      assert.equal(res, 2)
      i++
    })
    this.Myemmiter.on('NotListener', function*(event, arg) {
      let res = yield Promise.resolve('al chingaso')
      assert.equal(res, 'al chingaso')
      assert.equal(event, 'carne asada!!!')
      throw event + 'catched'
    })
    this.Myemmiter.on('modified ctx', function*(arg) {
      let res = yield Promise.resolve('God through')
      assert.equal(res, 'God through')
      assert.equal(arg, 2)
      this.a = 2
      throw 'error on modified ctx'
    })

    this.Myemmiter.on('test.1', function*(arg) {
      let res = yield Promise.resolve('2')
      assert.equal(res, 'God through')
      assert.equal(arg, 12)
      j++
    })

    this.Myemmiter.on('test.2', function*(arg) {
      let res = yield Promise.resolve('1')
      assert.equal(res, 'God through')
      assert.equal(arg, 12)
      j++
    })

  })
  it('should count the calls to emmiter', function(done) {
    this.Myemmiter.ctx = this.Myemmiter
    this.Myemmiter.emit('test', 'hola')
      .then(function() {
        assert.equal(count, 2)
        setTimeout(function() {
          assert(i === 1 || i === 0)
          done()
        }, 100);

      })
      .catch(function(err) {
        assert(err < 0.5)
        done()
      })
  })

  it('should emit the .error event and reject the promise returned',
    function(done) {
      this.Myemmiter.emit('testWithError').catch(function(e) {
        assert.equal(e, 'hola with error')
        done()
      })

    })

  it(
    'NotListener event have to be emmited when the event does not have listener',

    function(done) {
      this.Myemmiter.emit('carne asada!!!', 'with tortillas of harina')
        .then(function() {
          done()
        })

    })

  it(
    'The wildcard is acepted',
    function(done) {
      this.Myemmiter.emit('test.*', 12)
        .then(function(r) {
          assert(j === 2)
          done()
        }).catch(function(e) {
          done()
        })

    })


  it(
    'The ctx is passed and if is modified, the modification is exposed',

    function(done) {
      let ctx = {
        a: 1
      }
      this.Myemmiter.ctx = ctx
      this.Myemmiter.emit('modified ctx', 2)
        .catch(
          function(e) {
            assert.equal(e, 'error on modified ctx')
            assert(ctx.a === 2)
            done()
          })


    })
})
