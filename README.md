connman-config
==============

> Parse and stringify Connman configuration files

[![npm version](https://badge.fury.io/js/connman-config.svg)](http://badge.fury.io/js/connman-config)
[![dependencies](https://david-dm.org/resin-io-modules/connman-config.svg)](https://david-dm.org/resin-io-modules/connman-config.svg)
[![Build Status](https://travis-ci.org/resin-io-modules/connman-config.svg?branch=master)](https://travis-ci.org/resin-io-modules/connman-config)
[![Build status](https://ci.appveyor.com/api/projects/status/yoqidafd33br7q3n/branch/master?svg=true)](https://ci.appveyor.com/project/resin-io/connman-config/branch/master)

Installation
------------

Install `connman-config` by running:

```sh
$ npm install --save connman-config
```

Documentation
-------------


* [connman](#module_connman)
    * [.stringify(object)](#module_connman.stringify) ⇒ <code>String</code>
    * [.parse(string)](#module_connman.parse) ⇒ <code>Object</code>

<a name="module_connman.stringify"></a>

### connman.stringify(object) ⇒ <code>String</code>
**Kind**: static method of <code>[connman](#module_connman)</code>  
**Summary**: Stringify a Comman configuration object  
**Returns**: <code>String</code> - connman configuration string  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | configuration object |

**Example**  
```js
var connman = require('connman-config');

connman.stringify({
  service_home_ethernet: {
    Type: 'ethernet',
    Nameservers: [
      '8.8.8.8',
      '8.8.4.4'
    ]
  },
  service_home_wifi: {
    Type: 'wifi',
    Name: 'Resin'
  }
});

[service_home_ethernet]
Type = ethernet
Nameservers = 8.8.8.8,8.8.4.4
```
<a name="module_connman.parse"></a>

### connman.parse(string) ⇒ <code>Object</code>
**Kind**: static method of <code>[connman](#module_connman)</code>  
**Summary**: Parse a Connman configuration string  
**Returns**: <code>Object</code> - connman configuration object  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| string | <code>String</code> | configuration string |

**Example**  
```js
var connman = require('connman-config');

connman.parse([
  '[service_home_ethernet]',
  'Type = ethernet',
  'Nameservers = 8.8.8.8,8.8.4.4'
].join('\n'));

{
  service_home_ethernet: {
    Type: 'ethernet',
    Nameservers: [
      '8.8.8.8',
      '8.8.4.4'
    ]
  },
  service_home_wifi: {
    Type: 'wifi',
    Name: 'Resin'
  }
}
```

Support
-------

If you're having any problem, please [raise an issue](https://github.com/resin-io-modules/connman-config/issues/new) on GitHub and the Resin.io team will be happy to help.

Tests
-----

Run the test suite by doing:

```sh
$ npm test
```

Contribute
----------

- Issue Tracker: [github.com/resin-io-modules/connman-config/issues](https://github.com/resin-io-modules/connman-config/issues)
- Source Code: [github.com/resin-io-modules/connman-config](https://github.com/resin-io-modules/connman-config)

Before submitting a PR, please make sure that you include tests, and that [jshint](http://jshint.com) runs without any warning:

```sh
$ npm run-script lint
```

License
-------

The project is licensed under the MIT license.
