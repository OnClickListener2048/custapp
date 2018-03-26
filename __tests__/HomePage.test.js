import 'react-native';
import React from 'react';

import 'isomorphic-fetch';
console.log('global.fetch', global.fetch);

jest.autoMockOn();

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
// import Index from '../app/home/home/HomePage.js';
import Index from '../app/home/home/HomePage.js';
it('renders correctly', () => {
  const tree = renderer.create(
    <Index />
  );
});
