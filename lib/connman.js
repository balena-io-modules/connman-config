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

/**
 * @module connman
 */

var _ = require('lodash');
var utils = require('./utils');

/**
 * @summary Stringify a Comman configuration object
 * @function
 * @public
 *
 * @param {Object} object - configuration object
 * @returns {String} connman configuration string
 *
 * @example
 * var connman = require('connman-config');
 *
 * connman.stringify({
 *   service_home_ethernet: {
 *     Type: 'ethernet',
 *     Nameservers: [
 *       '8.8.8.8',
 *       '8.8.4.4'
 *     ]
 *   },
 *   service_home_wifi: {
 *     Type: 'wifi',
 *     Name: 'Resin'
 *   }
 * });
 *
 * [service_home_ethernet]
 * Type = ethernet
 * Nameservers = 8.8.8.8,8.8.4.4
 */
exports.stringify = function(object) {
  return _.chain(object)
    .omitBy(function(value) {
      return !_.isPlainObject(value) || _.isEmpty(value);
    })
    .map(function(config, title) {
      return _.join(_.union([
        utils.makeSectionTitle(title)
      ], _.map(config, function(value, key) {
        return utils.stringifyConfigurationPair(key, value);
      })), '\n');
    })
    .join('\n\n')
    .value();
};

/**
 * @summary Parse a Connman configuration string
 * @function
 * @public
 *
 * @param {String} string - configuration string
 * @returns {Object} connman configuration object
 *
 * @example
 * var connman = require('connman-config');
 *
 * connman.parse([
 *   '[service_home_ethernet]',
 *   'Type = ethernet',
 *   'Nameservers = 8.8.8.8,8.8.4.4'
 * ].join('\n'));
 *
 * {
 *   service_home_ethernet: {
 *     Type: 'ethernet',
 *     Nameservers: [
 *       '8.8.8.8',
 *       '8.8.4.4'
 *     ]
 *   },
 *   service_home_wifi: {
 *     Type: 'wifi',
 *     Name: 'Resin'
 *   }
 * }
 */
exports.parse = function(string) {
  return _.chain(string)
    .split('\n')
    .reject(_.isEmpty)
    .reduce(function(accumulator, line) {
      var sectionName = utils.getSectionName(line);

      if (sectionName) {
        accumulator.currentSection = sectionName;
        accumulator.result[accumulator.currentSection] = {};
      } else if (accumulator.currentSection) {
        var pair = utils.parseConfigurationPair(line);
        _.assign(accumulator.result[accumulator.currentSection], pair);
      }

      return accumulator;
    }, {
      currentSection: null,
      result: {}
    })
    .get('result')
    .omitBy(_.isEmpty)
    .value();
};
