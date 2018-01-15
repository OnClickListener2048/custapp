/**
 * Created by zhuangzihao on 2017/11/22.
 */
import React from 'react';
import {StyleSheet, View, Text, Dimensions, Button,Image,TouchableOpacity,DeviceEventEmitter,TouchableWithoutFeedback} from 'react-native';
import CommenCell from '../view/CommenCell'
import BComponent from '../base/BComponent'
import {deviceHeight,deviceWidth} from "../util/ScreenUtil";
import * as apis from '../apis';
import Toast from 'react-native-root-toast'
class Lightbox extends BComponent {

    constructor(props) {
        super(props);
        this.state = {
            dataSource:[],
            selectedCompanyId:'2'
        };

        UserInfoStore.getCompanyArr().then(
            (companyArr) => {
                if (companyArr) {

                    if (companyArr && companyArr.length > 0) {
                        let arr = JSON.parse(JSON.stringify(companyArr))
                        this.setState({dataSource: arr});
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
        if (item.id === this.state.selectedCompanyId) {
            this.props.navigator.dismissLightBox()
            // this.props.callback && this.props.callback()
            return;
        }
        apis.changeCompany(item.id).then(
            (responseData) => {

                if(responseData.code == 0){
                    //切换成功
                    this.setState({
                        selectedCompanyId:item.id
                    })

                    UserInfoStore.setCompany(item).then(
                        (user) => {
                            console.log("公司信息保存成功");
                            DeviceEventEmitter.emit('ChangeCompany');
                            this.props.navigator.dismissLightBox()
                            // this.props.callback && this.props.callback()
                        },
                        (e) => {
                            console.log("公司信息保存错误:", e);
                            this.props.navigator.dismissLightBox()
                            // this.props.callback && this.props.callback()
                        },
                    );
                }else{
                    this.props.navigator.dismissLightBox()
                    Toast.show('切换公司失败')
                }

            },
            (e) => {
                this.props.navigator.dismissLightBox()
                Toast.show('切换公司失败')

            },
        );
        //切换公司


    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={()=>this.props.navigator.dismissLightBox()}>
                <View style={{width:deviceWidth,height:deviceHeight,justifyContent:'center',alignItems:'center'}}>
                    <View style={[styles.container] }>
                        <Text onPress={()=>console.log(1)} style={{width:Dimensions.get('window').width * 0.7,textAlign:'center',fontSize:18,padding:7}}>切换公司</Text>
                        <View style={{width: Dimensions.get('window').width * 0.7}}>
                            {
                                this.state.dataSource.map((item,index)=>{
                                    return(
                                        <TouchableOpacity key={index} onPress={this._press.bind(this,item)}>
                                            <CommenCell
                                                leftTextStyle={{width: Dimensions.get('window').width * 0.7*0.7}}
                                                underLine={false}
                                                style={{width: Dimensions.get('window').width * 0.7}}
                                                leftText={item.name}
                                                isClick ={false}
                                                rightView = {item.id==this.state.selectedCompanyId?<Image source={require('../img/choose_seleted.png')}/>:<Image source={require('../img/choose_normal.png')}/>}
                                            />
                                        </TouchableOpacity>

                                    )
                                })
                            }
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width * 0.7,
        //height: Dimensions.get('window').height * 0.3,
        backgroundColor: '#ffffff',
        borderRadius: 5,
        paddingTop:10,
        paddingBottom:15
    },
});

export default Lightbox;