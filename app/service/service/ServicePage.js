/**
 * Created by liufei on 2017/9/25.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView

} from 'react-native';

import {
    Header,
    AccountingTreatment ,
    ClearCard,
    CopyTaxes,
    PayTaxes,
    SendBill
} from './view'
import BComponent from '../../base';
import {SCREEN_HEIGHT,SCREEN_WIDTH} from '../../config';

export default class ServicePage extends BComponent {
    constructor(props) {
        super(props);
        this.state = {
            isChoose1:true,
            isChoose2:false,
            isChoose3:false,
            isChoose4:false,
            isChoose5:false,
            num:1

        };
        this._renderBody=this._renderBody.bind(this);
        this.setChoose=this.setChoose.bind(this);
    }
    static navigatorStyle = {
        navBarHidden: false, // 隐藏默认的顶部导航栏
        tabBarHidden: false, // 默认隐藏底部标签栏
    };

    render(){
        return(
            <ScrollView style={{flex:1,backgroundColor:'white'}}>
                <Image style={{resizeMode : "contain"}} source={require('../../img/service_demo_bg.png')}/>
                <View style={styles.wrapper1}>
                    <View style={[styles.line,{width:30}]}/>
                    <Text style={{fontSize:24,color:'#e13238',marginHorizontal:10}}>
                        本月进度
                    </Text>
                    <View style={[styles.line,{width:30}]}/>
                </View>

                <View style={styles.wrapper2}>
                    <TouchableOpacity onPress={()=>{this.setChoose(1)}} >
                    <Image style={styles.service_gray_bg} source={this.state.isChoose1 ?require('../../img/service_red_bg.png') : require('../../img/service_gray_bg.png')}>
                        <Text style={this.state.isChoose1 ?styles.te_white : styles.te_black}>
                            01
                        </Text>
                    </Image>
                    </TouchableOpacity>
                    <View style={[styles.line,{width:54,borderBottomColor:this.state.isChoose1?'#e13238':'#f0f0f0'}]}/>
                    <TouchableOpacity onPress={()=>{this.setChoose(2)}} >
                        <Image style={styles.service_gray_bg} source={this.state.isChoose2 ?require('../../img/service_red_bg.png') : require('../../img/service_gray_bg.png')}>
                            <Text style={this.state.isChoose2 ?styles.te_white : styles.te_black}>
                                02
                            </Text>
                        </Image>
                    </TouchableOpacity>
                    <View style={[styles.line,{width:54,borderBottomColor:this.state.isChoose2?'#e13238':'#f0f0f0'}]}/>
                    <TouchableOpacity onPress={()=>{this.setChoose(3)}} >
                        <Image style={styles.service_gray_bg} source={this.state.isChoose3 ?require('../../img/service_red_bg.png') : require('../../img/service_gray_bg.png')}>
                            <Text style={this.state.isChoose3 ?styles.te_white : styles.te_black}>
                                03
                            </Text>
                        </Image>
                    </TouchableOpacity>
                    <View style={[styles.line,{width:54,borderBottomColor:this.state.isChoose3?'#e13238':'#f0f0f0'}]}/>
                    <TouchableOpacity onPress={()=>{this.setChoose(4)}} >
                        <Image style={styles.service_gray_bg} source={this.state.isChoose4 ?require('../../img/service_red_bg.png') : require('../../img/service_gray_bg.png')}>
                            <Text style={this.state.isChoose4 ?styles.te_white : styles.te_black}>
                                04
                            </Text>
                        </Image>
                    </TouchableOpacity>
                    <View style={[styles.line,{width:54,borderBottomColor:this.state.isChoose4?'#e13238':'#f0f0f0'}]}/>
                    <TouchableOpacity onPress={()=>{this.setChoose(5)}} >
                        <Image style={styles.service_gray_bg} source={this.state.isChoose5 ?require('../../img/service_red_bg.png') : require('../../img/service_gray_bg.png')}>
                            <Text style={this.state.isChoose5 ?styles.te_white : styles.te_black}>
                                05
                            </Text>
                        </Image>
                    </TouchableOpacity>
                </View>
                {this._renderBody(this.state.num)}
            </ScrollView>
        )
    }

    setChoose(index){
        switch (index){
            case 1:
                this.setState({isChoose1:true,num:1,isChoose2:false,isChoose3:false,isChoose4:false,isChoose5:false});
                break;
            case 2:
                this.setState({isChoose1:false,num:2,isChoose2:true,isChoose3:false,isChoose4:false,isChoose5:false});
                break;
            case 3:
                this.setState({isChoose1:false,num:3,isChoose2:false,isChoose3:true,isChoose4:false,isChoose5:false});
                break;
            case 4:
                this.setState({isChoose1:false,num:4,isChoose2:false,isChoose3:false,isChoose4:true,isChoose5:false});
                break;
            case 5:
                this.setState({isChoose1:false,num:5,isChoose2:false,isChoose3:false,isChoose4:false,isChoose5:true});
                break;
        }
    }


    _renderBody(index){
        switch (index){
            case 1:
                return <CopyTaxes {...this.props}/>
                break;
            case 2:
                return <SendBill {...this.props} />
                break;
            case 3:
                return <AccountingTreatment {...this.props} />
                break;
            case 4:
                return <PayTaxes {...this.props} />
                break;
            case 5:
                return <ClearCard {...this.props} />
                break;
        }
    }
}

const styles = StyleSheet.create({
    wrapper1:{
        width:SCREEN_WIDTH,
        flexDirection:'row',
        marginTop:30,
        alignItems:'center',
        justifyContent:'center'

    },
    wrapper2:{
        flexDirection:'row',
        width:SCREEN_WIDTH,
        justifyContent:'center',
        marginTop:30,
        alignItems:'center'

    },
    line:{
        height:1,
        width:SCREEN_WIDTH,
        borderBottomColor:'#e13238',
        borderBottomWidth:1 ,
        backgroundColor:'transparent'
    },
    service_gray_bg:{
        resizeMode : "contain",
        alignItems:'center',
        justifyContent:'center'
    },
    te_black:{
        fontSize:12,
        color:'#666666',
        alignItems:'center',
        backgroundColor:'transparent'
    },
    te_white:{
        fontSize:12,
        color:'#FFFFFF',
        alignItems:'center',
        backgroundColor:'transparent'

    }


});