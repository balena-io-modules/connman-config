/*
 * Copyright 2016 Resin.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var _ = require('lodash');

/**
 * @summary Get section name
 * @function
 * @public
 *
 * @param {String} line - line
 * @returns {(String|Undefined)} title
 *
 * @example
 * utils.getSectionName('[work_wifi]');
 * > work_wifi
 */
exports.getSectionName = function(line) {
  return _.get(/^\[(.*)\]$/.exec(line), '1');
};

/**
 * @summary Make section title
 * @function
 * @public
 *
 * @param {String} title - title
 * @returns {String} section title
 *
 * @example
 * utils.makeSectionTitle('work_wifi');
 * > [work_wifi]
 */
exports.makeSectionTitle = function(title) {
  return '[' + title + ']';
};

/**
 * @summary Parse a configuration pair
 * @function
 * @public
 *
 * @param {String} line - line
 * @returns {Object} configuration pair
 *
 * @example
 * utils.parseConfigurationPair('Type = ethernet');
 * > {
 * >   Type: 'ethernet'
 * > }
 */
exports.parseConfigurationPair = function(line) {

  /*
   * Handle space before/after equal sign gracefully.
   * This lets us parse pairs in the following forms:
   *
   * - Key = Value
   * - Key= Value
   * - Key =Value
   * - Key=Value
   * - Key   =    Value
   *
   * Etc.
   */
  var pair = _.split(line, /\s*=\s*/);

  /**
   * Split comma-separated values automatically
   */
  var value = _.split(_.last(pair), ',');
  if (value.length === 1) {
    value = _.first(value);
  }

  /**
   * Attempt to parse pair values as Boolean, Number, etc.
   */
  try {
    value = JSON.parse(value);
  } catch (error) {}

  return _.fromPairs([ [ _.first(pair), value ] ]);
};

/**
 * @summary Stringify a configuration pair
 * @function
 * @public
 *
 * @param {String} key - key
 * @param {String} value - value
 * @returns {String} configuration pair
 *
 * @example
 * utils.stringifyConfigurationPair('Type', 'ethernet');
 * > Type = ethernet
 */
exports.stringifyConfigurationPair = function(key, value) {
  return key + ' = ' + value;
};
