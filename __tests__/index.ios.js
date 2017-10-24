import 'react-native';
import React from 'react';
// import Index from '../launcher';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import random from "../app/util/random";

jest.mock('NetInfo', () => {
    return {
        isConnected: {
            fetch: () => {
                return new Promise((accept, resolve) => {
                    accept(true);
                })
            },
            addEventListener:jest.fn()
        }
    }
});

it('renders correctly', () => {
  // const tree = renderer.create(
  //   <Index />
  // );
  // console.log(tree);


    console.log(random(11));
});
