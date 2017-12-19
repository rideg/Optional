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

(function () {
    'use strict';
    /**
     * @param {?T|undefined} value
     * @template T
     * @constructor
     * @return {!Optional<T>}
     * @final
     */
    function Optional(value) {
        if (value !== null && value !== undefined) {
            /** @private @const {!T} */
            this.value = value;
        }
    }

    Optional.prototype = Object.create(null);

    /** @return {boolean} */
    Optional.prototype.isPresent = function () {
        return this.value !== undefined;
    };

    /** @return {boolean} */
    Optional.prototype.isAbsent = function () {
        return !this.isPresent();
    };

    /** 
     * @template T
     * @method
     * @return {!T} 
     */
    Optional.prototype.get = function () {
        if (this.isPresent()) {
            return this.value;
        }
        throw new Error('Value is absent');
    };

    /** 
     * @template T
     * @param {!T} defaultValue
     * @return {!T}
     */
    Optional.prototype.orElse = function (defaultValue) {
        return this.isAbsent() ? defaultValue : this.value;
    };

    /**
     * @template T
     * @param {function():!T}
     * @return {!T}
     */
    Optional.prototype.orElseGet = function (supplier) {
        return this.isPresent() ? this.value : supplier();
    };

    /** 
     * @template T
     * @param {!Error}
     * @return {!T}
     */
     Optional.prototype.orElseThrow = function (error) {
         if (this.isAbsent()) {
             throw error; 
         }
         return this.value;
     };

    /**
     * @template T
     * @param {function(!T):void} callback
     */
    Optional.prototype.ifPresent = function (callback) {
        if (this.isPresent()) {
            callback(this.value);
        }
    };

    var ABSENT = Object.seal(new Optional(null));

    /** 
     * @template T, V
     * @param {function(!T): V} mapper
     */
    Optional.prototype.map = function (mapper) {
        if (this.isAbsent()) {
            return ABSENT;
        }
        return Object.seal(new Optional(mapper(this.value)));
    };

    /** 
     * @template T
     * @param {function(T):boolean}
     * @return Optional<T>
     */
    Optional.prototype.filter = function (predicate) {
        if (this.isPresent() && predicate(this.value)) {
            return this;
        }
        return ABSENT;
    };

    // Optional promise interface
    if (Promise) {
        /** 
         * @template T
         * @return Promise<T>
         */
        Optional.prototype.promise = function () {
            return new Promise(function (resolve, reject) {
                if (this.isAbsent()) {
                    reject();
                } else {
                    resolve(this.value);
                }
            }.bind(this));
        };
    }

    /** @return {string} */
    Optional.prototype.toString = function () {
        if (this.isAbsent()) {
            return 'Optional[absent]';
        }
        return 'Optional[\'' + this.value + '\']';
    };

    var OptionalHolder = Object.create(null);

    /**
     * @template T
     * @param {?T|undefined} value
     * @return !Optional<T>
     */
    OptionalHolder.of = function (value) {
        if (value === null || value === undefined) {
            return ABSENT;
        }
        return Object.seal(new Optional(value));
    };

    /** 
     * @template T
     * @return !Optional<T> 
     */
    OptionalHolder.absent = function () {
        return ABSENT;
    };

    Object.seal(OptionalHolder);

    if (exports === undefined) {
        this.Optional = OptionalHolder;
    } else {
        if (module === undefined) {
            exports = OptionalHolder;
        } else if (module.exports) {
            exports = module.exports = OptionalHolder;
        }
    }
}(this));

