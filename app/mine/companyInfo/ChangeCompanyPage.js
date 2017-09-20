/**
 * Created by zhuangzihao on 2017/9/19.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity
} from 'react-native';
import CommenCell from '../../view/CommenCell'
import BComponent from '../../base/BComponent'
export default class ChangeCompanyPage extends BComponent {


    constructor(props) {
        super(props);
        this.state = {
            dataSource:[
                {
                    company:'大宇科技',
                    id:'1',
                    isSelcted:false
                },
                {
                    company:'大佳科技',
                    id:'2',
                    isSelcted:true
                },
                {
                    company:'大佳科技',
                    id:'3',
                    isSelcted:false
                },
                {
                    company:'大佳科技',
                    id:'4',
                    isSelcted:false
                }
            ]
        };
    }

    render(){
        return(
            <View style={{flex:1,backgroundColor:'#F9F9F9'}}>
                <ScrollView>
                    {
                        this.state.dataSource.map((item,index)=>{
                            return(
                                <TouchableOpacity key={index} onPress={this._press.bind(this,index)}>
                                    <CommenCell
                                        leftText={item.company}
                                        isClick ={false}
                                        rightView = {item.isSelcted?<Image source={require('../../img/choose_seleted.png')}/>:<Image source={require('../../img/choose_normal.png')}/>}
                                    />
                                </TouchableOpacity>

                            )
                        })
                    }
                </ScrollView>
            </View>

        )
    }
    _press(index){
        let data = this.state.dataSource;
        for(let i = 0;i<data.length;i++){
            let dic = data[i];
            dic.isSelcted = false
        }
        data[index].isSelcted = true
        this.setState({
            dataSource:data
        })
    }


}