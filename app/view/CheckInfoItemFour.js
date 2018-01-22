/**
 * Created by liufei on 2018/1/22.
 */

import React, {Component,PropTypes} from 'react';
import {

    StyleSheet,
    Text,
    View,

} from 'react-native';
import {SCREEN_HEIGHT,SCREEN_WIDTH} from '../config';

export default class CheckInfoItemFour extends Component {
    constructor(props){
        super(props)
        this._isShowLine=this._isShowLine.bind(this)
    }

    static propTypes = {
        name1: PropTypes.string,//左边名称
        value1:PropTypes.string,//左边内容
        name2: PropTypes.string,//右边名称
        value2:PropTypes.string,//右边内容
        isShowLine:PropTypes.bool//是否显示分割线
    };

    static defaultProps = {
        name1:'',
        value1:'',
        name2:'',
        value2:'',
        isShowLine:true
    }


    _isShowLine(isShowLine){
        if(isShowLine) {
            return (
                <View style={styles.line}/>
            );
        }
    }

    render(){
        const {name1,value1,name2,value2,isShowLine} = this.props
        return(
            <View style={styles.container}>
                <View style={styles.wrap1}>
                    <View style={styles.wrap2}>
                        <Text style={styles.text1}>
                            {name1}:
                        </Text>
                        <Text style={styles.text2}>
                            {value1}
                        </Text>
                    </View>
                    <View style={styles.wrap3}>
                        <Text style={styles.text1}>
                            {name2}:
                        </Text>
                        <Text style={styles.text2}>
                            {value2}
                        </Text>
                    </View>
                </View>
                {this._isShowLine(isShowLine)}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#FFFFFF',
        marginLeft:15
    },
    wrap1:{
        width:SCREEN_WIDTH,
        flexDirection:'row',
        marginLeft:10,
        marginRight:20,
        marginTop:10,
        marginBottom:10,

    },
    wrap2:{
        width:SCREEN_WIDTH/3,
        flexDirection:'row',
        alignItems:'center'
    },
    wrap3:{
        width:2*SCREEN_WIDTH/3,
        flexDirection:'row',
        alignItems:'center',
        marginLeft:10
    },

    line:{
        height:0.25,
        width:SCREEN_WIDTH,
        borderBottomColor:'#ececec',
        borderBottomWidth:1 ,
        backgroundColor:'transparent',
    },
    text1:{
        fontSize:18,
        color:'#000000',

    },
    text2:{
        fontSize:18,
        color:'#333333',
        marginLeft:10
    }

});






