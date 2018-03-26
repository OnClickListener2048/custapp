import {Platform} from 'react-native';

it('platform test', () => {
    expect(Platform.OS).toEqual("ios");
});
