/**
 * Created by liuchangjiong on 2017/12/13.
 */
import React, {Component} from 'react';

import BComponent from '../../base';
import  {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    AsyncStorage
} from 'react-native';

//The device-log contains the public api that you will use in your app.
//The LogView is the GUI/Log-list that you can render at desired location //in your app:

import deviceLog, {LogView} from 'react-native-device-log';

// 应用内调试日志查看页
export default class LogViewer extends BComponent {

    componentDidMount() {
        //Available log messages:
        // deviceLog.log("Hello", "world!");
        // deviceLog.info("A info message");
        deviceLog.debug("A debug message", {test: "test"});
        // deviceLog.success("A success message");
    }

    render() {
        /*
        inverted: will write the log inverted.
        multiExpanded: means that multiple logmessages
        that are longer then one row can be expanded simultaneously
        timeStampFormat: moment format for timeStamp
        */
        return (
            <LogView inverted={false} multiExpanded={true} timeStampFormat='HH:mm:ss'></LogView>
        );
    }
}