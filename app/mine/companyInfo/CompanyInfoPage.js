/**
 * Created by zhuangzihao on 2017/9/19.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView
} from 'react-native';
import CommenCell from '../../view/CommenCell'
import BComponent from '../../base/BComponent'

export default class CompanyInfoPage extends BComponent {

    render(){
        return(
            <View style={{flex:1,backgroundColor:'#F9F9F9'}}>
                <ScrollView
                    contentContainerStyle={{backgroundColor:'#F9F9F9'}}
                >
                    <CommenCell
                        leftText="企业概况"
                        rightText="大佳科技"
                        style={{marginTop:10}}
                        onPress={this._goto.bind(this,'CompanySurveyPage','企业概况')}
                    />
                    {/*<CommenCell*/}
                        {/*leftText="切换公司"*/}
                        {/*onPress={this._goto.bind(this,'ChangeCompanyPage','切换公司')}*/}
                    {/*/>*/}
                </ScrollView>
            </View>

        )
    }

    _goto(screen, title){
        if(screen == '')return;

        this.props.navigator.push({
            screen: screen,
            title:title

        });
    }

}