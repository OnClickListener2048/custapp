//setupJest.js
// 修正 Invariant Violation: Native module cannot be null.
import {Dimensions} from 'react-native';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import FormData from './__mocks__/FormData';

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

jest.mock('Platform', () => {
    return {
        OS: 'ios'
    }
});

jest.mock('react-native-device-info');
jest.mock('react-native-alert');
// 微信功能mock
jest.mock('react-native-wechat', () => {
    return {
        registerApp: jest.fn(),
        isWXAppInstalled: () => {
            return new Promise((accept, resolve) => {
                accept(true);
            })
        }
    }
});

jest.mock('react-native-navigation');
jest.mock('react-native-camera');
jest.mock('react-native-code-push', () => {
    return {
        sync: jest.fn()
    }
});


Enzyme.configure({ adapter: new Adapter() });


let _DeviceInfo =  {
    Dimensions: {
        window: {
            fontScale: 2,
            height: 1334,
            scale: 2,
            width: 750,
        },
    },
};

Dimensions.set(_DeviceInfo.Dimensions);
// 修复 FormData 找不到的问题 ReferenceError: FormData is not defined
global.FormData = FormData;
global._JEST = true;// 是否在执行JEST场景
jest.setTimeout(20000);