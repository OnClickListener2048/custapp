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
            height = 204 * height / width; //按照屏幕宽度进行等比缩放
            this.setState({
                imgheight:height,
            })
        });
    }

    render(){
        return(
            <View style={{flex:1,backgroundColor:'#F9F9F9'}}>
                <ScrollView>
                    <View style={{width:DeviceInfo.width,alignItems:'center',justifyContent:'center',height:(DeviceInfo.width)/2}}>
                    <ImageLoad
                        style={{width:204,height:this.state.imgheight}}
                        loadingStyle={{ size: 'small', color: 'black' }}
                        source={{ uri:this.props.licenceinfo.img+"" }}
                        placeholderSource={require('../../img/name_bg.png')}/>
                    </View>
                    {/*<Image style={{width:DeviceInfo.width}} source={require('../../img/name_bg.png')}/>*/}
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
                    {/*<CommentCell*/}
                        {/*leftText = "年审时间"*/}
                        {/*rightText = "2017-8-12"*/}
                        {/*isClick = {false}*/}

                    {/*/>*/}
                </ScrollView>
            </View>

        )
    }



}