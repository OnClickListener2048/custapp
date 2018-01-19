/**
 * Created by zhuangzihao on 2017/9/19.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image
} from 'react-native';
import CommentCell from '../../view/CommenCell'
import SectionHeader from '../../view/SectionHeader'
import BComponent from '../../base/BComponent'
import ImageLoad from "../../view/ImageLoad";

export default class LicenceInfoPage extends BComponent {

    constructor(props) {
        super(props);
        this.state = {
            imgheight:null,
        };
    }

    componentDidMount() {
        Image.getSize(this.props.licenceinfo.img, (width, height) => {
            console.log("图片高度1==="+height+"宽度="+width);
            height = (DeviceInfo.width-16) * height / width; //按照屏幕宽度进行等比缩放
            console.log("图片高度2==="+height+"宽度2="+width);
            this.setState({
                imgheight:height,
            })
        });
    }

    render(){
        return(
            <View style={{flex:1,backgroundColor:'#F1F1F1'}}>
                {this.props.licenceinfo.valid_time !== '' && this.props.licenceinfo.valid_time !== undefined
                ||this.props.licenceinfo.img !== '' &&this.props.licenceinfo.img !== undefined?
                <ScrollView>
                    {this.props.licenceinfo.img !== '' && this.props.licenceinfo.img !== undefined ?
                        <View style={{width:DeviceInfo.width,backgroundColor:'#F1F1F1',alignItems:'center',justifyContent:'center',
                        height:this.state.imgheight===0||this.state.imgheight===null?(DeviceInfo.width+16)/2:this.state.imgheight+16}}>
                            <ImageLoad
                                placeholderStyle={{width: DeviceInfo.width - 16, height: this.state.imgheight}}
                                style={{
                                    backgroundColor: '#F1F1F1', width: DeviceInfo.width - 16,
                                    height: this.state.imgheight === 0 || this.state.imgheight === null ? (DeviceInfo.width - 16) / 2 : this.state.imgheight - 4
                                }}
                                loadingStyle={{size: 'small', color: 'black'}}
                                // source={{ uri:"/FileUploads/Order/CardID/201710/XririZpzMK.png" }}
                                source={{uri: this.props.licenceinfo.img + ""}}
                            />
                    </View>:
                        <View style={{width:DeviceInfo.width,backgroundColor:'#F1F1F1',alignItems:'center',justifyContent:'center',
                            height:(DeviceInfo.width+16)/2}}>
                        <ImageLoad
                            placeholderStyle={{width: DeviceInfo.width - 16, height: this.state.imgheight}}
                            style={{
                                backgroundColor: '#F1F1F1', width: DeviceInfo.width - 16,
                                height: (DeviceInfo.width - 16) / 2
                            }}
                            loadingStyle={{size: 'small', color: 'black'}}
                            // source={{ uri:"/FileUploads/Order/CardID/201710/XririZpzMK.png" }}
                            source={require('../../img/no_message.png')}
                            resizeMode={'contain'}
                        />
                        </View>
                    }
                    {/*<Image style={{width:DeviceInfo.width}} source={require('../../img/name_bg.png')}/>*/}
                    {this.props.licenceinfo.valid_time !== '' && this.props.licenceinfo.valid_time !== undefined &&
                    <View>
                        <SectionHeader
                            title='证件照信息'
                            text={this.props.licenceinfo.name}
                        />
                        <CommentCell
                            leftText = "证照有效期止"
                            rightText = {this.props.licenceinfo.valid_time}
                            style={{marginTop:10}}
                            isClick = {false}
                            />
                    </View>
                    }
                </ScrollView>:
                    <View style={{backgroundColor:'#F1F1F1',
                        justifyContent:'center',
                        alignItems:'center',
                        flex:1,
                        width:DeviceInfo.width, height:DeviceInfo.OS==='ios'?DeviceInfo.height-44-64:DeviceInfo.height-88}}>
                        <Image source={require('../../img/no_message.png')}/>
                        <Text style={{fontSize:15,color:'#999999',marginTop:50}}>暂未上传资料</Text>
                    </View>
                }
            </View>

        )
    }



}