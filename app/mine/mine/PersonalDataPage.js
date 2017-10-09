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
            <ScrollView style={styles.container}>
                <View style={styles.headportrait}>
                    <Text style={styles.textstyle}>
                        头像
                    </Text>
                    <Image source={require('../../img/head_img.png')} style={styles.imageCircle}/>
                </View>
                <View style={styles.contentlist}>
                    <Text style={styles.textstyle}>
                        手机号
                    </Text>
                    <Text style={styles.textContentStyle}>
                        13333333333
                    </Text>
                </View>
                <View style={{height:0.5,backgroundColor:'#ECECEC'}}/>
                <View style={[styles.contentlist,{marginTop:0}]}>
                    <Text style={styles.textstyle}>
                        公司名称
                    </Text>
                    <Text style={styles.textContentStyle}>
                        大佳科技
                    </Text>
                </View>
                <View style={styles.contentlist}>
                    <Text style={styles.textstyle}>
                        联系人
                    </Text>
                    <Text style={styles.textContentStyle}>
                        崔先生
                    </Text>
                </View>
                <View style={{height:0.5,backgroundColor:'#ECECEC'}}/>
                <View style={[styles.contentlist,{marginTop:0}]}>
                    <Text style={styles.textstyle}>
                        微信号
                    </Text>
                    <Text style={styles.textContentStyle}>
                        yangyangyang
                    </Text>
                </View>

            </ScrollView>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
        flexDirection: 'column'
    },
    headportrait:{
        height:96,
        width:deviceWidth,
        backgroundColor:'white',
        marginTop:10,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    textstyle:{
        fontSize:16,
        color:'#333333',
        marginLeft:15,
    },
    textContentStyle:{
        fontSize:16,
        color:'#999999',
        marginRight:15,
    },
    contentlist:{
        height:50.5,
        width:deviceWidth,
        backgroundColor:'white',
        marginTop:10,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    imageCircle:{
        width:60,
        height:60,
        marginRight:15,
        borderRadius: 30,
    },
});