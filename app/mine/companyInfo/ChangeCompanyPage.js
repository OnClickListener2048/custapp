/**
 * Created by zhuangzihao on 2017/9/19.
 */
import React, {Component} from 'react';
import {
    View,
    DeviceEventEmitter,
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
                    "type": 1,
                    "id": 40551,
                    "name": "北京红升四季鲜商贸中心",
                    "infos": [
                        {
                            "name": "企业名称",
                            "value": "北京红升四季鲜商贸中心"
                        },
                        {
                            "name": "纳税类型",
                            "value": ""
                        },
                        {
                            "name": "公司地址",
                            "value": "房山区"
                        },
                        {
                            "name": "公司电话",
                            "value": "13681551316,"
                        }
                    ],
                    "license": [
                        {
                            "name": "营业执照",
                            "img": "",
                            "valid_time": ""
                        },
                        {
                            "name": "法人身份证",
                            "img": "",
                            "valid_time": ""
                        }
                    ]
                },
                {
                    "type": 1,
                    "id": 40552,
                    "name": "黑色星期五",
                    "infos": [
                        {
                            "name": "企业名称",
                            "value": "黑色星期五"
                        },
                        {
                            "name": "纳税类型",
                            "value": ""
                        },
                        {
                            "name": "公司地址",
                            "value": "房山区"
                        },
                        {
                            "name": "公司电话",
                            "value": "13681551316,"
                        }
                    ],
                    "license": [
                        {
                            "name": "营业执照",
                            "img": "",
                            "valid_time": ""
                        },
                        {
                            "name": "法人身份证",
                            "img": "",
                            "valid_time": ""
                        }
                    ]
                },
                {
                    "type": 1,
                    "id": 40553,
                    "name": "元旦",
                    "infos": [
                        {
                            "name": "企业名称",
                            "value": "元旦"
                        },
                        {
                            "name": "纳税类型",
                            "value": ""
                        },
                        {
                            "name": "公司地址",
                            "value": "房山区"
                        },
                        {
                            "name": "公司电话",
                            "value": "13681551316,"
                        }
                    ],
                    "license": [
                        {
                            "name": "营业执照",
                            "img": "",
                            "valid_time": ""
                        },
                        {
                            "name": "法人身份证",
                            "img": "",
                            "valid_time": ""
                        }
                    ]
                },
                {
                    "type": 1,
                    "id": 40554,
                    "name": "新年放假哈哈哈",
                    "infos": [
                        {
                            "name": "企业名称",
                            "value": "新年放假哈哈哈"
                        },
                        {
                            "name": "纳税类型",
                            "value": ""
                        },
                        {
                            "name": "公司地址",
                            "value": "房山区"
                        },
                        {
                            "name": "公司电话",
                            "value": "13681551316,"
                        }
                    ],
                    "license": [
                        {
                            "name": "营业执照",
                            "img": "",
                            "valid_time": ""
                        },
                        {
                            "name": "法人身份证",
                            "img": "",
                            "valid_time": ""
                        }
                    ]
                }
            ],


            selectedCompanyId:'2'
        };

        UserInfoStore.getCompany().then(
            (company) => {
                console.log('company', company);
                if (company && company.infos && company.infos.length>0) {
                    this.setState({selectedCompanyId: company.id});
                } else {
                }
            },
            (e) => {
                console.log("读取信息错误:", e);
            },
        );
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
                                        leftText={item.name}
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

        UserInfoStore.setCompany(item).then(
            (user) => {
                console.log("公司信息保存成功");
                DeviceEventEmitter.emit('ChangeCompany');

            },
            (e) => {
                console.log("公司信息保存错误:", e);
            },
        );

        // let data = this.state.dataSource[index];
        //
        // this.setState({
        //     dataSource:data
        // })
    }


}