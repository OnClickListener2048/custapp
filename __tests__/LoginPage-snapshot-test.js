import 'react-native';
import React from 'react';

import LoginPage from '../app/user/LoginPage';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

// 修正 Invariant Violation: Native module cannot be null.
jest.mock('NetInfo', () => {
    return {
        isConnected: {
            fetch: () => {
                return new Promise((accept, resolve) => {
                    accept(true);
                })
            },
            addEventListener: jest.fn()
        }
    }
});

jest.mock('react-native-device-info');

// 处理navigator的报错
// TypeError: Cannot read property 'setOnNavigatorEvent' of undefined
const navigator = new Object(null);

navigator.setOnNavigatorEvent = () => {

};

// jest --updateSnapshot 更新快照
it('快照正确渲染', () => {
      const tree = renderer.create(
          <LoginPage  navigator={navigator}/>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    // 只能操作属性
    tree.props.mobile = '12345678000';
    expect(tree).toMatchSnapshot();
});