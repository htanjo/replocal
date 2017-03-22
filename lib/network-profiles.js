/* eslint-disable quote-props */
'use strict';

module.exports = {
  'gprs': {
    rate: 50000 / 8,
    latency: 500,
    label: 'GPRS (50kb/s, 500ms RTT)'
  },
  '2g': {
    rate: 250000 / 8,
    latency: 300,
    label: '2G (250kb/s, 300ms RTT)'
  },
  '3g': {
    rate: 750000 / 8,
    latency: 100,
    label: '3G (750kb/s, 100ms RTT)'
  },
  '4g': {
    rate: 4000000 / 8,
    latency: 300,
    label: '4G (4Mb/s, 20ms RTT)'
  },
  'dsl': {
    rate: 2000000 / 8,
    latency: 5,
    label: 'DSL (2Mb/s, 5ms RTT)'
  },
  'wifi': {
    rate: 30000000 / 8,
    latency: 2,
    label: 'Wi-Fi (30Mb/s, 2ms RTT)'
  }
};
