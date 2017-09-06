import 'react-native';
import React from 'react';
import Index from '../app/launcher';

jest.mock('react-native-navigation');
// jest.mock('NetInfo', () => {
//     return {
//         isConnected: {
//             fetch: () => {
//                 return new Promise((accept, resolve) => {
//                     accept(true);
//                 })
//             },
//             addEventListener: jest.fn()
//         }
//     }
// });
// console.log(NetInfo);
// jest.mock('react-native-device-info');

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  // const tree = renderer.create(
  //   <Index />
  // );
});
