/**
 * Created by zhuangzihao on 2017/9/8.
 */
import React, {Component} from 'react';
import {
    View,
    Text,

} from 'react-native';

import {
    Header,
    AccountingTreatment ,
    ClearCard,
    CopyTaxes,
    PayTaxes,
    SendBill
} from './view'

export default class ServicePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            processIndx:2,
            selectIndex:2
        };
    }
    btnClick(index){
        this.setState({
            selectIndex:index
        })
    }
    render(){
        return(
            <View style={{flex:1,backgroundColor:'white'}}>
                <Header btnClick={this.btnClick.bind(this)} processIndx={this.state.processIndx} selectIndex={this.state.selectIndex} />
                {this.renderBody()}
            </View>
        )
    }
    renderBody(){
        switch (this.state.selectIndex){
            case 0:
                return <CopyTaxes />
                break
            case 1:
                return <SendBill />
                break
            case 2:
                return <AccountingTreatment />
                break
            case 3:
                return <PayTaxes />
                break
            case 4:
                return <ClearCard />
                break
        }
    }
}