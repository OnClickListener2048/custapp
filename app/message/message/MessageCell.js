/**
 * Created by jinglan on 2017/12/6.
 */
import React, {PropTypes,Component} from 'react';
import {View, Text,Platform,Image,Dimensions} from 'react-native';
import styles from './MessageCellStyle'
const window = Dimensions.get('window');

export const SCREEN_WIDTH = window.width;

export default class MessageCell extends Component {

    constructor(props) {
        super(props)

    }

    static propTypes = {
        isRead: PropTypes.isRead,
        messageTitle: PropTypes.string,
        messageSubTitle: PropTypes.string,
        messageTime: PropTypes.string,
        img: PropTypes.string

    };

    render() {
        // const { style} = this.props
        const {messageTitle, messageSubTitle,messageTime,isRead,img} = this.props

        return (
            <View
                style={styles.rowStyle}>

                <View style={[styles.timeRowStyle]}>

                    <View style={{height:25,flexDirection: 'row',
                        alignItems:'center',opacity:0.5,borderRadius:3,marginTop:8,marginBottom:10,
                        justifyContent:'center',backgroundColor:'#CDCDCD'}}>

                        <Text
                            textAlign='center'
                            numberOfLines={1}
                            style={[{fontSize: 12, marginLeft :15,marginRight :15 , color : '#666666'}] }>{messageTime}</Text>
                    </View>

                </View>

                { img !== null && (img !== undefined) && (img.length>0) &&
                    <Image resizeMode="center" style={styles.imageRowStyle} source={{uri:img}}>

                    </Image>
                }


                <View
                    style={styles.topRowStyle}>
                <Text
                    textAlign='left'
                    numberOfLines={1}
                    style={[{fontSize: 17, marginLeft : 15 ,color : '#333333'}] }>{messageTitle}</Text>


                </View>

                <View
                    style={[styles.subtitleRowStyle]}>
                    <Text
                        textAlign='left'
                        numberOfLines={2}
                        style={[{fontSize: 13, marginLeft : 15 ,marginRight : 15 ,color : '#999999'}] }>{messageSubTitle}</Text>

                </View>

                <View
                    style={styles.lineStyle}>
                </View>
                <View
                    style={styles.bottomRowStyle}>
                    <Text
                        textAlign='left'
                        numberOfLines={0}

                        style={[{fontSize: 14,lineHeight: 20,flex:1,marginTop: Platform.OS==='ios'?14:12,marginBottom: Platform.OS==='ios'?14:12,
                            marginLeft : 14 ,color : '#666666'}] }>
                        查看详情
                    </Text>
                    { isRead === false && <View style={{marginRight: 8, width: 8, height: 8, backgroundColor: '#F22027', borderRadius: 4}}></View>}
                    <Image
                        source={require('../../img/left_button.png')}
                        style={[{marginRight: 10,width: 10,height:15}]}/>
                </View>


            </View>
        )
    }
}
