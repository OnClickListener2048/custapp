/**
 * Created by liufei on 2017/8/23.
 */

import 'react-native';
import React from 'react';
import MyOutSideWorkCell from '../view/MyOutSideWorkCell'
import renderer from 'react-test-renderer';

test('快照正确渲染', () => {
    const tree = renderer.create(
        <MyOutSideWorkCell  navigator={navigator}/>
    ).toJSON();
    expect(tree).toMatchSnapshot();
    // 只能操作属性
    expect(tree).toMatchSnapshot();
});

