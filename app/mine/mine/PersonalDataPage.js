/**
 *
 * 个人资料
 * Created by jiaxueting on 2017/9/27.
 */

import React, {Component} from 'react';
import {
    View,
    Text,
    ScrollView,
    SectionList,
    Dimensions,
    TouchableOpacity,
    Image,
    StyleSheet
} from 'react-native';
import BComponent from '../../base';

const deviceWidth = Dimensions.get('window').width;
export default class HomePage extends BComponent {
    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    }

    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
        super.onNavigatorEvent(event);
    }

    render(){
        return(
            <View>
                
            </View>
        )
    }

}