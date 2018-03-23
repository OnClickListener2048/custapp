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


import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });
import FormData from './__mocks__/FormData';
import {
    View,
    Text,
    ScrollView,
    SectionList,
    Dimensions,
    TouchableOpacity,
    Image,
    DeviceEventEmitter,
    StyleSheet,
    Animated,
    Platform,
    PixelRatio,
    TouchableWithoutFeedback
} from 'react-native';

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
