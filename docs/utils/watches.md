[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / utils/watches

# utils/watches

## Classes

### AwaitNot

Manages an asynchronous watch on a property, waiting for it to toggle between true and false states.
This class uses immediate watchers to react to changes and supports a timeout to limit waiting duration.

#### Constructors

##### new AwaitNot()

> **new AwaitNot**(`options`): [`AwaitNot`](watches.md#awaitnot)

Initializes the AwaitNot with specified options for reactive property watching and timeout settings.

###### Parameters

###### options

Configuration options for AwaitNot.

###### options.couldAlreadyBeFalse

`boolean` = `false`

Indicates if the property could already be in the false state at initialization.

###### options.obj

`any`

The object containing the property to watch.

###### options.prop

`string`

The property name to watch within the object.

###### options.ref

`Ref`\<`any`, `any`\>

A Vue ref to directly watch if provided.

###### options.timeout

`number` = `1000`

The timeout in milliseconds before the promise is rejected.

###### Returns

[`AwaitNot`](watches.md#awaitnot)

#### Properties

##### couldAlreadyBeFalse

> **couldAlreadyBeFalse**: `boolean`

##### falseISW

> **falseISW**: [`ImmediateStopWatch`](watches.md#immediatestopwatch)

##### promise

> **promise**: `Promise`\<`any`\>

##### ref

> **ref**: `Readonly`\<`Ref`\<`any`, `any`\>\>

##### reject()

> **reject**: (`reason`?) => `void`

###### Parameters

###### reason?

`any`

###### Returns

`void`

##### resolve()

> **resolve**: (`value`) => `void`

###### Parameters

###### value

`any`

###### Returns

`void`

##### timeout

> **timeout**: [`AwaitTimeout`](watches.md#awaittimeout)

##### timeoutError

> **timeoutError**: [`AwaitNotError`](watches.md#awaitnoterror)

##### trueISW

> **trueISW**: [`ImmediateStopWatch`](watches.md#immediatestopwatch)

#### Methods

##### start()

> **start**(): `void`

Starts the process of watching the property for changes between true and false.
It sets up the necessary watchers and a timeout if specified.

###### Returns

`void`

##### stop()

> **stop**(): `void`

Stops all watchers and the timeout, cleaning up resources.

###### Returns

`void`

***

### AwaitNotError

The error thrown when an AwaitNot operation times out.

#### Extends

- `Error`

#### Constructors

##### new AwaitNotError()

> **new AwaitNotError**(`message`, `code`): [`AwaitNotError`](watches.md#awaitnoterror)

###### Parameters

###### message

`any`

###### code

`any`

###### Returns

[`AwaitNotError`](watches.md#awaitnoterror)

###### Overrides

`Error.constructor`

#### Properties

##### code

> **code**: `any`

The error code.

##### name

> **name**: `string`

The error name.

###### Inherited from

`Error.name`

***

### AwaitTimeout

A utility class for managing a promise that resolves or rejects based on a set timeout or an explicit stop action.
This class is useful for implementing timeouts in asynchronous operations, where you might need to reject a promise
if an operation takes too long or cancel the timeout based on certain conditions.

#### Constructors

##### new AwaitTimeout()

> **new AwaitTimeout**(`options`): [`AwaitTimeout`](watches.md#awaittimeout)

Creates an instance of AwaitTimeout with a specified timeout duration.

###### Parameters

###### options

The options for the AwaitTimeout.

###### options.timeout

`number` = `1000`

The timeout in milliseconds.

###### Returns

[`AwaitTimeout`](watches.md#awaittimeout)

#### Properties

##### cancelledError

> **cancelledError**: [`AwaitTimeoutError`](watches.md#awaittimeouterror)

##### promise

> **promise**: `Promise`\<`any`\>

##### reject()

> **reject**: (`reason`?) => `void`

###### Parameters

###### reason?

`any`

###### Returns

`void`

##### resolve()

> **resolve**: (`value`) => `void`

###### Parameters

###### value

`any`

###### Returns

`void`

##### timeout

> **timeout**: `number`

##### timeoutId

> **timeoutId**: `Timeout`

#### Methods

##### start()

> **start**(): `void`

Starts the timeout process. If the timeout duration is reached without being stopped, the promise resolves.

###### Returns

`void`

##### stop()

> **stop**(): `void`

Stops the timeout if it is active, rejecting the promise with a "Cancelled" error. Clears all pending actions.

###### Returns

`void`

***

### AwaitTimeoutError

The error thrown when an AwaitTimeout operation times out.

#### Extends

- `Error`

#### Constructors

##### new AwaitTimeoutError()

> **new AwaitTimeoutError**(`message`, `code`): [`AwaitTimeoutError`](watches.md#awaittimeouterror)

###### Parameters

###### message

`any`

###### code

`any`

###### Returns

[`AwaitTimeoutError`](watches.md#awaittimeouterror)

###### Overrides

`Error.constructor`

#### Properties

##### code

> **code**: `any`

The error code.

##### name

> **name**: `string`

###### Inherited from

`Error.name`

***

### ImmediateStopWatch

Provides a mechanism for immediately starting and potentially stopping a Vue.js watcher
during its first invocation. This is useful when the need arises to terminate the watch
based on conditions encountered during the initial execution of the watch function.

#### Constructors

##### new ImmediateStopWatch()

> **new ImmediateStopWatch**(): [`ImmediateStopWatch`](watches.md#immediatestopwatch)

###### Returns

[`ImmediateStopWatch`](watches.md#immediatestopwatch)

#### Properties

##### stopWatch

> **stopWatch**: `WatchHandle`

#### Methods

##### start()

> **start**(`watchSources`, `watchFunc`, `watchFuncArgs`?, `watchOptions`?): `void`

Starts the watch.

###### Parameters

###### watchSources

`WatchSource`\<`any`\> | `WatchSource`\<`any`\>[]

###### watchFunc

`WatchCallback`\<`any`, `any`\>

The callback to execute when the source changes.

###### watchFuncArgs?

`any`[] = `[]`

Optional arguments to pass to the watch function.

###### watchOptions?

`WatchOptions`\<`boolean`\> = `{}`

Optional watch options.

###### Returns

`void`

##### stop()

> **stop**(): `void`

Stops the watch.

###### Returns

`void`

## Functions

### doAwaitNot()

> **doAwaitNot**(`options`): `Promise`\<`any`\>

Helper function to get the resulting promise from an AwaitNot instance.

#### Parameters

##### options

Configuration options for AwaitNot.

###### options.couldAlreadyBeFalse

`boolean` = `true`

Indicates if the property could already be in the false state at initialization.

###### options.obj

`any`

The object containing the property to watch.

###### options.prop

`string`

The property name to watch within the object.

###### options.ref

`Ref`\<`any`, `any`\>

A Vue ref to directly watch if provided.

###### options.timeout

`number` = `1000`

The timeout in milliseconds before the promise is rejected.

#### Returns

`Promise`\<`any`\>

A promise that resolves when the property toggles from true to false.

***

### doAwaitTimeout()

> **doAwaitTimeout**(`timeout`): `Promise`\<`any`\>

Helper function to get the resulting promise from an AwaitTimeout instance.

#### Parameters

##### timeout

`number`

The timeout in milliseconds.

#### Returns

`Promise`\<`any`\>

A promise that resolves after the specified timeout.
