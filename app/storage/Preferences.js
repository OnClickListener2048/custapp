/**
 * App 的一些简单的状态存储, 不要存数大数据.
 * https://facebook.github.io/react-native/docs/asyncstorage.html
 * Created by beansoft on 2017/6/9.
 */
import {
    AsyncStorage,
} from 'react-native';
var Preferences = {

    get: async function (key) {
        try {
            let value = await AsyncStorage.getItem(key);
            return value;
        } catch (error) {
            return null;
        }
    },

    set: async function (key: string,
                         value: string) {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            // Error saving data
        }
    },

    remove: async function(
        key: string,
        callback?: ?(error: ?Error) => void
    ) {
        return AsyncStorage.removeItem(key);
    },

    clear: async function (callback?: ?(error: ?Error) => void) {
        return AsyncStorage.clear(callback);
    }
};
global.Preferences = Preferences;// 全局可用