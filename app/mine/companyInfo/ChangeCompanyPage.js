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
                },
                {
                    company:'大佳科技',
                    id:'2',
                },
                {
                    company:'大佳科技',
                    id:'3',
                },
                {
                    company:'大佳科技',
                    id:'4',
                }
            ],
            selectedCompanyId:'2'
        };
    }

    render(){
        return(
            <View style={{flex:1,backgroundColor:'#F9F9F9'}}>
                <ScrollView>
                    {
                        this.state.dataSource.map((item,index)=>{
                            return(
                                <TouchableOpacity key={index} onPress={this._press.bind(this,item)}>
                                    <CommenCell
                                        leftText={item.company}
                                        isClick ={false}
                                        rightView = {item.id==this.state.selectedCompanyId?<Image source={require('../../img/choose_seleted.png')}/>:<Image source={require('../../img/choose_normal.png')}/>}
                                    />
                                </TouchableOpacity>

                            )
                        })
                    }
                </ScrollView>
            </View>

        )
    }
    _press(item){
        if (item.id === this.state.selectedCompanyId) return;

        this.setState({
            selectedCompanyId:item.id
        })
        // let data = this.state.dataSource[index];
        //
        // this.setState({
        //     dataSource:data
        // })
    }


}