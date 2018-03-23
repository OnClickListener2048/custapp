//setupJest.js
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
jest.mock('react-native-alert');
// 微信功能mock
jest.mock('react-native-wechat', () => {
    return {
        registerApp: jest.fn()
    }
});

jest.mock('react-native-navigation');
jest.mock('react-native-camera');

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });
import FormData from './__mocks__/FormData';

// 修复 FormData 找不到的问题 ReferenceError: FormData is not defined
global.FormData = FormData;