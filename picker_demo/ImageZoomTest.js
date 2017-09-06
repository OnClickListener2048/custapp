import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Modal,
    Dimensions,
    Image
} from 'react-native';

import ImageZoom from 'react-native-image-pan-zoom';

export default class ImageZoomTest extends React.Component {
    render() {
        return (

                <Image style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height - 100, resizeMode: 'contain', alignSelf:'center' }}
                       source={{uri:'http://v1.qzone.cc/avatar/201407/07/00/24/53b9782c444ca987.jpg!400x400.jpg'}} />
        )
    }
}