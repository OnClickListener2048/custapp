/**
 * Created by zhuangzihao on 2017/11/22.
 */
import React from 'react';
import {StyleSheet, View, Text, Dimensions, Button,Image,TouchableOpacity,DeviceEventEmitter} from 'react-native';
import CommenCell from '../view/CommenCell'

class Lightbox extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource:[],


            selectedCompanyId:'2'
        };

        UserInfoStore.getCompanyArr().then(
            (companyArr) => {
                if (companyArr) {
                    console.log('走你companyArr', companyArr);
                    console.log('走你companyArrLength', companyArr.length);

                    if (companyArr && companyArr.length > 0) {
                        console.log('走你dataSource', this.state.dataSource);
                        let arr = JSON.parse(JSON.stringify(companyArr))
                        console.log('走你arr', arr);

                        this.setState({dataSource: arr});


                        console.log('走你arr', arr);

                        console.log('走你dataSource', this.state.dataSource);

                    }
                }else {
                    console.log("读取数组为空");


                }
            },
            (e) => {
                console.log("读取信息错误:", e);
            },
        );

        UserInfoStore.getCompany().then(
            (company) => {
                console.log('走你company', company);
                if (company && company.infos && company.infos.length>0) {
                    this.setState({selectedCompanyId: company.id});
                }
            },
            (e) => {
                console.log("读取信息错误:", e);
            },
        );
    }

    _press(item){
        if (item.id === this.state.selectedCompanyId) return;

        this.setState({
            selectedCompanyId:item.id
        })

        UserInfoStore.setCompany(item).then(
            (user) => {
                console.log("公司信息保存成功");
                DeviceEventEmitter.emit('refreshService');

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

    render() {
        return (
            <View style={[styles.container,{height:this.state.dataSource.length * 40 + 40 + 20}] }>
                <View style={{marginTop:10 , width: Dimensions.get('window').width * 0.7, height:this.state.dataSource.length * 40}}>
                    {
                        this.state.dataSource.map((item,index)=>{
                            return(
                                <TouchableOpacity key={index} onPress={this._press.bind(this,item)}>
                                    <CommenCell
                                        style={{width: Dimensions.get('window').width * 0.7, height:40}}
                                        leftText={item.name}
                                        isClick ={false}
                                        rightView = {item.id==this.state.selectedCompanyId?<Image source={require('../img/choose_seleted.png')}/>:<Image source={require('../img/choose_normal.png')}/>}
                                    />
                                </TouchableOpacity>

                            )
                        })
                    }
                </View>
                <View style={{width: Dimensions.get('window').width * 0.7, height:40}}>
                    <Button
                        title={'Close'}
                        onPress={() => this.props.onClose()}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width * 0.7,
        //height: Dimensions.get('window').height * 0.3,
        backgroundColor: '#ffffff',
        borderRadius: 5,
        padding: 0,
    },
    title: {
        fontSize: 17,
        fontWeight: '700',
    },
    content: {
        marginTop: 8,
    },
});

export default Lightbox;