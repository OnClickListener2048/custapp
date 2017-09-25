/**
 * 关于我们
 * Created by jiaxueting on 2017/9/25.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput, WebView
} from 'react-native';
import BComponent from '../../base';

export default class FeedbackPage extends BComponent {
    render(){
        return(
            <WebView/>
        )
    }
}