/**
 * Created by liufei on 2017/9/26.
 */

import React, {Component,PropTypes} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Platform
} from 'react-native';


export default class HeaderView extends Component {

    constructor(props){
        super(props)
        this._renderTop=this._renderTop.bind(this);
    }

    static defaultProps = {
        hasTop:true,//是否有顶部的view
        topDes:'',//顶部文字描述
        topNum:'',//顶部数值
        leftDes:'',//左边文字描述
        leftNum:'',//左边数值
        rightDes:'',
        rightNum:''
    }


    render(){
        const {leftDes,leftNum,rightDes,rightNum} = this.props
        return(
            <Image style={styles.wrapper}
                   source={require('../../img/service_bg.png')}>
                {this._renderTop()}
                <View style={styles.wrapper2}>
                    <View style={styles.wrapper3}>
                        <Text style={styles.te3}>
                            {leftDes}
                        </Text>
                        <Text style={styles.te4}>
                            {leftNum}
                        </Text>
                    </View>
                    <View style={styles.wrapper3}>
                        <Text style={styles.te3}>
                            {rightDes}
                        </Text>
                        <Text style={styles.te4}>
                            {rightNum}
                        </Text>
                    </View>
                </View>


            </Image>
        )
    }

    _renderTop(){
        const {hasTop, topDes,topNum} = this.props
        if(hasTop) {
            return (
                <View style={styles.wrapper1}>
                    <Text style={styles.te1}>
                        {topDes}
                    </Text>
                    <Text style={styles.te2}>
                        {topNum}
                    </Text>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    wrapper:{
        resizeMode:'contain'
    },
    wrapper1:{
        marginTop:65,
        justifyContent:'center',
        alignItems:'center',
    },
    te1:{
        fontSize:16,
        color:'#ffffff',
        backgroundColor:'transparent'
    },
    te2:{
        fontSize:32,
        color:"#ffffff",
        backgroundColor:'transparent',
        marginTop:5
    },
    wrapper2:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginHorizontal:20
    },
    wrapper3:{
        justifyContent:'center',
        alignItems:'center',
        marginTop:Platform.OS==='ios'?30:15
    },
    te3:{
        fontSize:12,
        color:'#FFFFFF',
        backgroundColor:'transparent',
    },
    te4:{
        fontSize:18,
        color:'#ffffff',
        backgroundColor:'transparent',
        marginTop:5
    }
});