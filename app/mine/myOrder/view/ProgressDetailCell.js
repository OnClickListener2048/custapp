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
        state: PropTypes.string,
    };


    render(){
        const {state} = this.props
        return(
            <View style={styles.container}>
                {this._renderDiffItem(state)}
            </View>
        )
    }

    _renderDiffItem(state){

        if(state=='done'){
            return(
                <View style={[styles.wrapper_d1,{marginLeft:55}]}>
                    <View>
                        <Image
                            style={[styles.done_img,{marginLeft:6}]}
                            source={require('../../../img/done.png')}/>
                        <View style={[styles.line,{marginLeft:16}]}/>
                    </View>
                    <View style={[styles.wrapper_d3,{marginLeft:15}]}>
                        <Text style={styles.done_te}>
                            已完成
                        </Text>
                        <Text style={styles.done_time_te}>
                            2017-9-12 14:30
                        </Text>

                    </View>
                </View>

            )



        }else if(state=='green'){
            return(
            <View style={styles.wrapper_d1}>
                <View >
                    <Image
                        style={styles.done_img}
                        source={require('../../../img/green.png')}/>
                    <View style={styles.line_green}/>
                </View>
                <View style={styles.wrapper_d3}>
                    <Text style={styles.green_te}>
                        领取资料
                    </Text>
                    <Text style={styles.green_time_te}>
                        2017-9-12 14:30
                    </Text>

                </View>
            </View>
            )

        }else if(state=='gray'){
            return(
                <View style={styles.wrapper_d1}>
                    <View >
                        <Image
                            style={styles.done_img}
                            source={require('../../../img/gray.png')}/>
                        <View style={styles.line_green}/>
                    </View>
                    <View style={styles.wrapper_d3}>
                        <Text style={styles.gray_te}>
                            网上申请
                        </Text>
                        <Text style={styles.gray_time_te}>
                            2017-9-12 14:30
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
        backgroundColor:'#F9F9F9'
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
        height:45,
        width:0.5,
        borderLeftColor:'#ececec',
        borderLeftWidth:1 ,
        backgroundColor:'transparent',
        marginLeft:10
    },
    wrapper_d3:{
        marginLeft:20
    },
    done_te:{
        fontSize:16,
        color:'#E13238'
    },
    done_time_te:{
        fontSize:14,
        color:'#E13238'
    },
    green_te:{
        fontSize:16,
        color:'#333333'
    },
    green_time_te:{
        fontSize:14,
        color:'#666666'
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
        color:'#999999'
    },
    gray_time_te:{
        fontSize:14,
        color:'#999999'
    }




});

