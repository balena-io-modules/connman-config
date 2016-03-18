'use strict';

var m = require('mochainon');
var connman = require('../lib/connman');

var testStringify = function(object, lines) {
  m.chai.expect(connman.stringify(object)).to.equal(lines.join('\n'));
};

var testParse = function(object, lines) {
  m.chai.expect(connman.parse(lines.join('\n'))).to.deep.equal(object);
};

var testAll = function(title, object, lines) {
  it('.stringify() ' + title, function() {
    testStringify(object, lines);
  });

  it('.parse() ' + title, function() {
    testParse(object, lines);
  });
};

describe('Connman', function() {

  testAll('should stringify a single section config', {
    service_home_ethernet: {
      Type: 'ethernet',
      Nameservers: [
        '8.8.8.8',
        '8.8.4.4'
      ]
    }
  }, [
    '[service_home_ethernet]',
    'Type = ethernet',
    'Nameservers = 8.8.8.8,8.8.4.4'
  ]);

  testAll('should stringify a two sections config', {
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
  }, [
    '[service_home_ethernet]',
    'Type = ethernet',
    'Nameservers = 8.8.8.8,8.8.4.4',
    '',
    '[service_home_wifi]',
    'Type = wifi',
    'Name = Resin'
  ]);

  testAll('should stringify a multiple sections config', {
    global: {
      OfflineMode: false
    },
    WiFi: {
      Enable: true,
      Tethering: false
    },
    Wired: {
      Enable: true,
      Tethering: false
    },
    Bluetooth: {
      Enable: true,
      Tethering: false
    }
  }, [
    '[global]',
    'OfflineMode = false',
    '',
    '[WiFi]',
    'Enable = true',
    'Tethering = false',
    '',
    '[Wired]',
    'Enable = true',
    'Tethering = false',
    '',
    '[Bluetooth]',
    'Enable = true',
    'Tethering = false'
  ]);

  describe('.stringify()', function() {

    it('should omit invalid sections', function() {
      testStringify({
        service_home_ethernet: {
          Type: 'ethernet',
          Nameservers: '8.8.8.8,8.8.4.4'
        },
        service_home_wifi: {}
      }, [
        '[service_home_ethernet]',
        'Type = ethernet',
        'Nameservers = 8.8.8.8,8.8.4.4'
      ]);
    });

    it('should omit invalid sections', function() {
      testStringify({
        service_home_ethernet: false,
        service_work_ethernet: [ 'foo', 'bar', 'baz' ],
        service_work_wifi: 12345,
        service_home_wifi: 'hello',
        service_valid: {
          Type: 'ethernet',
          Nameservers: '8.8.8.8,8.8.4.4'
        },
      }, [
        '[service_valid]',
        'Type = ethernet',
        'Nameservers = 8.8.8.8,8.8.4.4',
      ]);
    });

    it('should return an empty string if all sections are empty', function() {
      testStringify({
        service_home_ethernet: {},
        service_home_wifi: {}
      }, []);
    });

    it('should join array values with commas', function() {
      testStringify({
        service_home_ethernet: {
          Type: 'ethernet',
          Nameservers: [
            '8.8.8.8',
            '8.8.4.4'
          ]
        }
      }, [
        '[service_home_ethernet]',
        'Type = ethernet',
        'Nameservers = 8.8.8.8,8.8.4.4'
      ]);
    });

  });

  describe('.parse()', function() {

    it('should ignore spaces before/after equal signs', function() {
      testParse({
        global: {
          OfflineMode: false
        },
        WiFi: {
          Enable: true,
          Tethering: false
        },
        Wired: {
          Enable: true,
          Tethering: false
        }
      }, [
        '[global]',
        'OfflineMode= false',
        '[WiFi]',
        'Enable =true',
        'Tethering=false',
        '[Wired]',
        'Enable      =    true',
        'Tethering=     false'
      ]);

    });

    it('should omit empty sections', function() {
      testParse({
        service_home_ethernet: {
          Type: 'ethernet',
          Nameservers: [
            '8.8.8.8',
            '8.8.4.4'
          ]
        }
      }, [
        '[service_work_wifi]',
        '[service_home_wifi]',
        '[service_home_ethernet]',
        'Type = ethernet',
        'Nameservers = 8.8.8.8,8.8.4.4',
        '[service_work_ethernet]'
      ]);
    });

    it('should omit body without a section title', function() {
      testParse({}, [
        'Type = ethernet',
        'Nameservers = 8.8.8.8,8.8.4.4'
      ]);
    });

    it('should parse a section with trailing new lines', function() {
      testParse({
        service_home_ethernet: {
          Type: 'ethernet',
          Nameservers: [
            '8.8.8.8',
            '8.8.4.4'
          ]
        }
      }, [
        '',
        '',
        '',
        '[service_home_ethernet]',
        'Type = ethernet',
        'Nameservers = 8.8.8.8,8.8.4.4',
        '',
        '',
        ''
      ]);
    });

    it('should parse a section with new lines between the title and body', function() {
      testParse({
        service_home_ethernet: {
          Type: 'ethernet',
          Nameservers: [
            '8.8.8.8',
            '8.8.4.4'
          ]
        }
      }, [
        '[service_home_ethernet]',
        '',
        '',
        '',
        'Type = ethernet',
        'Nameservers = 8.8.8.8,8.8.4.4'
      ]);
    });

    it('should parse sections without a new line in between', function() {
      testParse({
        global: {
          OfflineMode: false
        },
        WiFi: {
          Enable: true,
          Tethering: false
        },
        Wired: {
          Enable: true,
          Tethering: false
        }
      }, [
        '[global]',
        'OfflineMode = false',
        '[WiFi]',
        'Enable = true',
        'Tethering = false',
        '[Wired]',
        'Enable = true',
        'Tethering = false'
      ]);
    });

    it('should parse sections with multiple new lines in between', function() {
      testParse({
        global: {
          OfflineMode: false
        },
        WiFi: {
          Enable: true,
          Tethering: false
        },
        Wired: {
          Enable: true,
          Tethering: false
        }
      }, [
        '[global]',
        'OfflineMode = false',
        '',
        '',
        '',
        '[WiFi]',
        'Enable = true',
        'Tethering = false',
        '',
        '',
        '[Wired]',
        'Enable = true',
        'Tethering = false'
      ]);
    });

  });

});
