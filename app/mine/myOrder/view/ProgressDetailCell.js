/**
 * Created by liufei on 2017/9/21.
 */

import React, {Component,PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
    Platform,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import {SCREEN_HEIGHT,SCREEN_WIDTH} from '../../../config';

export default class ProgressDetailCell extends Component {

    constructor(props){
        super(props)
        this._renderDiffItem=this._renderDiffItem.bind(this);
    }

    static propTypes = {
        state: PropTypes.string,//显示状态
        name:PropTypes.string,//子任务名称
        start:PropTypes.string,//开始时间
        end:PropTypes.string,//结束时间
        operator:PropTypes.string,//操作员
        status:PropTypes.string//状态
    };


    render(){
        const {state,name,start,end,operator,status,contract_time,contract_md_time} = this.props
        return(
            <View style={styles.container}>
                {this._renderDiffItem(state,name,start,end,operator,status,contract_md_time,contract_time)}
            </View>
        )
    }

    _renderDiffItem(state,name,start,end,operator,status,contract_time,contract_md_time){
        operator=operator==''?'进行中':operator
        start=start==''?'':'起'+start
        end=end==''?'':'止'+end
        status=status==''?'':'状态：'+status

        if(state=='done'){
            return(
                <View style={[styles.wrapper_d1,{marginLeft:20}]}>
                    <View>
                        <Image
                            style={[styles.done_img,{marginLeft:9}]}
                            source={require('../../../img/done.png')}/>
                        <View style={[styles.line,{marginLeft:16}]}/>
                    </View>
                    <View style={[styles.wrapper_d3,{marginLeft:15}]}>
                        <Text style={styles.done_te}>
                            {name}
                        </Text>
                        <Text style={styles.done_time_te}>
                            处理人：{operator}  状态：已完成
                        </Text>
                        <Text style={[styles.time,{marginTop:10}]}>
                            {contract_md_time}
                        </Text>

                    </View>
                </View>

            )



        }else if(state=='green'){

            return(
                <View style={[styles.wrapper_d1,{marginLeft:20}]}>
                    <View>
                        <Image
                            style={[styles.done_img,{marginLeft:9}]}
                            source={require('../../../img/green.png')}/>
                        <View style={[styles.line,{marginLeft:16}]}/>
                    </View>
                    <View style={[styles.wrapper_d3,{marginLeft:15}]}>
                        <Text style={styles.done_te}>
                            {name}
                        </Text>
                        <Text style={styles.done_time_te}>
                            处理人：{operator}  {status}
                        </Text>
                        <Text style={[styles.time,{marginTop:10}]}>
                            {start}
                        </Text>

                    </View>
                </View>
            )

        }else if(state=='gray'){
            return(
                <View style={[styles.wrapper_d1,{marginLeft:20}]}>
                    <View>
                        <Image
                            style={[styles.done_img,{marginLeft:9}]}
                            source={require('../../../img/gray.png')}/>
                        <View style={[styles.line,{marginLeft:16}]}/>
                    </View>
                    <View style={[styles.wrapper_d3,{marginLeft:15}]}>
                        <Text style={styles.gray_te}>
                            {name}
                        </Text>
                        <Text style={styles.gray_te}>
                            处理人：{operator}  {status}
                        </Text>
                        <Text style={[styles.time,{marginTop:10}]}>
                            {start}   {end}
                        </Text>

                    </View>
                </View>
            )

        }


    }


}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#FFFFFF'
    },
    wrapper_d1:{
        width:SCREEN_WIDTH,
        flexDirection:'row',
        marginLeft:68
    },

    done_img:{
        resizeMode : "contain",
    },
    line:{
        height:80,
        width:0.5,
        borderLeftColor:'#ececec',
        borderLeftWidth:1 ,
        backgroundColor:'transparent',
        marginLeft:10
    },
    wrapper_d3:{
        marginLeft:20,
    },
    done_te:{
        fontSize:16,
        color:'#333333',
        marginBottom:5
    },
    done_time_te:{
        fontSize:16,
        color:'#333333',
    },
    green_te:{
        fontSize:16,
        color:'#333333',
        marginBottom:5,
        lineHeight:17
    },
    green_time_te:{
        fontSize:14,
        color:'#666666',
    },
    line_green:{
        height:50,
        width:0.5,
        borderLeftColor:'#ececec',
        borderLeftWidth:1 ,
        backgroundColor:'transparent',
        marginLeft:3
    },
    gray_te:{
        fontSize:16,
        color:'#999999',
        marginBottom:5,
        lineHeight:17
    },
    gray_time_te:{
        fontSize:14,
        color:'#999999',
    },
    time:{
        fontSize:12,
        color:'#999999'
    }





});

