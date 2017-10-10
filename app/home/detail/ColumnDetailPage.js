/**
 * Created by zhuangzihao on 2017/9/11.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image
} from 'react-native';
import WebTab from './WebVIew'
import BComponent from '../../base';
import * as apis from '../../apis';

export default class ColumnDetailPage extends BComponent {
    constructor(props) {
        super(props);
        this.state = {
            dataArr:[],
            itemSelected:{}
        };
    }
    static defaultProps = {
        type:'1', //1注册公司 2记账报税 3企业变更
    };

    componentDidMount() {
        this.loadData(this.props.type)
    }
    loadData(type = '0'){
        apis.loadHomeData(type).then(
            (responseData) => {

                if(responseData.code == 0 && responseData.list.length>0){
                    console.log('responseData',responseData)
                    this.setState({
                        dataArr:responseData.list[0].products,
                        itemSelected:responseData.list[0].products[0]
                    })

                }
            },
            (e) => {

            },
        );

    }
    render(){
        return(
            <View style={{flex:1,backgroundColor:'#f9f9f9'}}>
                <Image style={{width:DeviceInfo.width,height:DeviceInfo.width*0.4,marginTop:10}} source={{uri:this.state.itemSelected.img}}/>
            </View>
        )
    }
}