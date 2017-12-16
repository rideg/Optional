/* Copyright (c) 2017 Sandor Rideg

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

;(function() {
  'use strict';
  /**
   * @param {?T|undefined} value
   * @template T
   * @constructor
   * @return {!Optional<T>}
   */
  function Optional(value) {
    /** @private @const {!T} */
    this.value_;
    if(value != null) {
      this.value_ = value;
    }
  };

  Optional.prototype = Object.create(null);

  /** @return {boolean} */
  Optional.prototype.isPresent = function() {
    return this.value_ != null;
  };

  /** @return {boolean} */
  Optional.prototype.isAbsent = function() {
    return this.value_ == null;
  };

  /** 
   * @template T
   * @method
   * @return {!T} 
   */
  Optional.prototype.get = function() {
    if(this.isPresent()) {
      return this.value_;
    }
    throw new Error('Value is absent');
  };

  /** 
   * @template T
   * @param {!T} defaultValue
   * @return {!T}
   */
  Optional.prototype.orElse = function(defaultValue) {
    return this.value_ == null ? defaultValue : this.value_;
  };

  /**
   * @template T
   * @param {function(!T):void} callback
   */
  Optional.prototype.ifPresent = function(callback) {
    if(this.value_ != null) {
      callback(this.value_);
    }
  };

  /** 
   * @template T, V
   * @param {function(!T): V} mapper
   */
  Optional.prototype.map = function(mapper) {
    if(this.value_ == null) {
      return ABSENT;
    }
    return OptionalHolder.of(mapper(this.value_));
  };

  // Optional promise interface
  if(Promise) {
    /** 
     * @template T
     * @return Promise<T>
     */
    Optional.prototype.promise = function() {
      return new Promise(function(resolve, reject) {
       if(this.value_ == null) {
         reject();
       } else {
         resolve(this.get());
       }
      }.bind(this));
    };
  }

  /** @return {string} */
  Optional.prototype.toString = function() {
    if(this.value_ == null) {
      return 'Optional[absent]';
    }
    return 'Optional[\''+this.value_+'\']';
  };

  var ABSENT = Object.seal(new Optional(null));

  var OptionalHolder = Object.create(null);
  
  /**
   * @template T
   * @param {?T|undefined} value
   * @return !Optional<T>
   */
  OptionalHolder.of = function(value) {
    return Object.seal(new Optional(value));
  };

  /** 
   * @template T
   * @return !Optional<T> 
   */
  OptionalHolder.absent = function() {
    return ABSENT;
  };
  
  Object.seal(OptionalHolder);

  if(typeof exports !== 'undefined') {
    if(typeof module !== 'undefined' && module.exports) {
      exports = module.exports = OptionalHolder;
    } else {
     exports = OptionalHolder;
   }
  } else {
    this['Optional'] = OptionalHolder;
  }
}).call(this);

