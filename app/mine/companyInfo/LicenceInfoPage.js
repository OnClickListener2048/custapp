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
            <View style={{flex:1,backgroundColor:'#F9F9F9'}}>
                <ScrollView>
                    <View style={{width:DeviceInfo.width,backgroundColor:'#F9F9F9',alignItems:'center',justifyContent:'center',
                        height:this.state.imgheight===0||this.state.imgheight===null?(DeviceInfo.width+16)/2:this.state.imgheight+16}}>
                    <ImageLoad
                        placeholderStyle={{width:DeviceInfo.width-16,height:this.state.imgheight}}
                        style={{backgroundColor:'#F9F9F9',width:DeviceInfo.width-16,
                            height:this.state.imgheight===0||this.state.imgheight===null?(DeviceInfo.width-16)/2:this.state.imgheight-4}}
                        loadingStyle={{ size: 'small', color: 'black' }}
                        // source={{ uri:"/FileUploads/Order/CardID/201710/XririZpzMK.png" }}
                        source={{ uri:this.props.licenceinfo.img+"" }}
                    />
                    </View>
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
                </ScrollView>
            </View>

        )
    }



}