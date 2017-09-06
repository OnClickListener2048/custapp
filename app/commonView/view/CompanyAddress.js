/**
 * 公司地址
 * Created by jiaxueting on 2017/6/16.
 */

import React, {PropTypes} from 'react';
import {View, Text,Image,Dimensions} from 'react-native';

const window = Dimensions.get('window');

export const SCREEN_HEIGHT = window.height;
export const SCREEN_WIDTH = window.width;

export default class CompanyInfoView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            companyAddress: this.props.companyAddress,
        }
    }

    static propTypes = {
        //style: PropTypes.object,
        companyAddress: PropTypes.string,
    };


    render() {
        // const { style} = this.props
        const {companyAddress} = this.state
        return (
            <View
                style={{height:50,backgroundColor:'white',width:SCREEN_WIDTH}}>

                    <View
                        style={{width: SCREEN_WIDTH-85,
                            height: 50,
                            marginLeft : 15,
                            marginRight : 15,
                            flexDirection: 'row',backgroundColor:'white',}}>

                        <Text
                            style={[{fontSize: 15,color:'#323232',marginTop:2}] }>{'公司地址: '}</Text>
                        <Text
                            style={[{fontSize: 15, marginLeft : 0,color:'#323232',lineHeight:23}] }>{companyAddress}</Text>
                    </View>

            </View>
        )
    }
}

//textStyle, {color: textStyle.color}]