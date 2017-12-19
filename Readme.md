Introduction
============
JavaScript implementation of the Maybe type, inspired by java.lang.Optional.

Installation
============
The library supports both Node.js and browser environments.

 * Node:
   ```shell
   npm install optional2 --save
   ```
 * Browser:
   ```html
   <script src="https://raw.githubusercontent.com/rideg/Optional/v1.0.2/optional.min.js" 
           type="text/javascript">
   </script>
   ```

Usage
======
When using with Node.js you need to import the library first:

```javascript
const Optional = require('optional2');
```
In the browser, the initialization script creates the global Optional object which can be used later on.


Instantiation
-------------
There are two states of the Optional type: present and absent. In the following example, you can see how to
create them:

```javascript
const present = Optional.of('value');

const absent = Optional.absent();

// If the given value is null or undefined then 
// the returned Optional will be absent.
const absent2 = Optional.of(null);
const absent3 = Optional.of(undefined);
```

The resulting objects will be immutable, moreover the absent will always be the same instance.

State check
-----------
There are two methods to check the state of the Optional (isPresent() and isAbsent()), both returns a boolean:

```javascript
const present = Optional.of('value');

present.isPresent(); // => true
present.isAbsent();  // => false

const basent = Optional.absent();

absent.isPresent(); // => false
absent.isAbsent();  // => true
```

ifPresent()
-----------
If a function is required to be executed conditionally the ifPresent(callback) function can be used.
If the value is present then the callback will be called with the value, otherwise, the callback will
be ignored.

```javascript
const present = Optional.of('value');

present.ifPresent((value) => console.log(value)); // => "value" will be printed.

const absent = Optional.absent();

absent.ifPresent((value) => doSomeCrazyThing(value)); // => nothing crazy will happend.
```

Getting the value
-----------------
The contained value can be retrieved if it is present, otherwise, an error will be thrown.

```javascript
Optional.of('value').get(); // => "value"
Optional.absent().get();    // => Error('Value is absent') will be thrown.
```

Default values
--------------
If the value is absent, there are multiple ways to supply defaults. 

```javascript
Optional.absent().orElse('value'); // => "value"

Optional.absent().orElseGet(() => 'value') // => "value"
```

Mapping
-------
The optional value can be mapped to something else if is present. If it is absent, the result will be absent as well.
```javascript
Optional.of('value').map((value) => value.toUpperCase()).get(); // => "VALUE"

Optional.absent().map((value) => transform(value)).isPresent(); // => false
```

Filtering
---------
The filter() method returns the instance itself if the value is present and the given predicate succeeds.
```javascript
Optional.of(10).filter((value) => value > 5); // => "Optional['10']"
Optional.of(5).filter((value) => value > 5);  // => "Optional[absent]"
Optional.absent().filter(() => true);         // => "Optional[absent]"
``` 

Promise
-------
If the global Promise object is available the Optional will have the promise() method which returns a promise of the value. The promise will be resolved immediately if the value is present,
or will be rejected otherwise. 

```javascript
Optional.of('value').promise().then((value) => console.log('value')); // => "value" will be printed.

Optional.absent().promis()
        .then((value) => console.log('got it'), 
              () => console.log('rejected')); // => "rejected" will be printed.
```

toString()
----------
It also has the toString() method:

```javascript
Optional.of('value').toString(); // => "Optional['value']"

Optional.absent().toString();     // => "Optional[absent]"
```

Licence
=======

[MIT](https://opensource.org/licenses/MIT)

