/**
 * Created by jiaxueting on 2018/3/26.
 */

import React from 'react';
import 'isomorphic-fetch';// 第三方fetch的真实联网实现, 解决 Failed: fetch is not a function
import fetchMock from 'fetch-mock';
test('service api', async () => {
    fetchMock.get('*', JSON.parse('{"success":true,"code":0,"msg":null,"data":null, "jest": true}'));
});