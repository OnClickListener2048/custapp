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
        messageTime: PropTypes.string
    };

    render() {
        // const { style} = this.props
        const {messageTitle, messageSubTitle,messageTime,isRead} = this.props
        return (
            <View
                style={styles.rowStyle}>
                <View
                    style={styles.topRowStyle}>
                <Text
                    textAlign='left'
                    numberOfLines={1}
                    style={[{fontSize: 16, marginLeft : 15 ,color : isRead === false ? '#333333' : '#999999'}] }>{messageTitle}</Text>

                <Text
                    textAlign='left'
                    numberOfLines={1}
                    style={[{fontSize: 14, marginRight :15 , color : isRead === false ? '#333333' : '#999999'}] }>{messageTime}</Text>
                </View>
                <View
                    style={styles.lineStyle}>
                </View>
                <View
                    style={styles.bottomRowStyle}>
                    <Text
                        textAlign='left'
                        numberOfLines={0}

                        style={[{fontSize: 14,lineHeight: 20,marginTop: Platform.OS==='ios'?14:12,marginBottom: Platform.OS==='ios'?14:12,
                            marginLeft : 14 ,width :SCREEN_WIDTH - 43 - 14,color : isRead === false ? '#333333' : '#999999'}] }>
                        {messageSubTitle}
                    </Text>
                    <Image
                        source={require('../../img/left_button.png')}
                        style={[{marginRight: 15,width: 10,height:15}]}/>
                </View>


            </View>
        )
    }
}
