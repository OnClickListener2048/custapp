/**
 * Created by liufei on 2017/9/19.
 */
import React, {Component} from 'react';
import OrderStateCell from './view/OrderStateCell'

export default class ProgressDetailPage extends Component {

    render(){
        return(
            <OrderStateCell
                headImg={require('../../img/head_img.png')}
                orderId={this.props.orderId}
                orderState={this.props.orderState}
                name={this.props.name}
                money="200"
            />

        );
    }
}