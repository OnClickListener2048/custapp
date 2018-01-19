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

// Deprecated
export default class CompanyInfoPage extends BComponent {

    constructor(props) {
        super(props);
        this.state = {
            company:'',
        };
    }

    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
        console.log('CompanyInfoPage', event.id);//willAppear
        super.onNavigatorEvent(event);
        if (event.id === 'willAppear') {
            this.initPage();
        }

    }

    componentWillMount(){
        this.initPage();

    }

    initPage(){
        UserInfoStore.getCompany().then(
            (company) => {
                console.log('company', company);
                if (company && company.infos && company.infos.length>0) {
                    this.setState({company: company.infos[0].value});
                } else {
                    this.setState({company: ''});
                }
            },
            (e) => {
                console.log("读取信息错误:", e);
            },
        );

    }

    // componentDidMount(){
    //     UserInfoStore.getCompany().then(
    //         (company) => {
    //             console.log('company', company);
    //             if (company && company.infos && company.infos.length>0) {
    //                 this.setState({company: company.infos[0].value});
    //             } else {
    //                 this.setState({company: ''});
    //             }
    //         },
    //         (e) => {
    //             console.log("读取信息错误:", e);
    //         },
    //     );
    //
    // }

    render(){
        return(
            <View style={{flex:1,backgroundColor:'#F1F1F1'}}>
                <ScrollView
                    contentContainerStyle={{backgroundColor:'#F1F1F1'}}
                >
                    <CommenCell
                        leftText="企业概况"
                        rightText={this.state.company}
                        style={{marginTop:10}}
                        onPress={this._goto.bind(this,'CompanySurveyPage','企业概况')}
                    />
                    <CommenCell
                        leftText="切换公司"
                        onPress={this._goto.bind(this,'ChangeCompanyPage','切换公司')}
                    />
                </ScrollView>
            </View>

        )
    }

    _goto(screen, title){
        if(screen == '')return;

        this.push({
            screen: screen,
            title:title,
            backButtonHidden: true, // 是否隐藏返回按钮 (可选)

        });
    }

}