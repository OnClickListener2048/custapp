/**
 * Created by zhuangzihao on 2018/1/15.
 */
import React, { PureComponent } from 'react';
import {
    View,
    Dimensions,
} from 'react-native';

export default class ViewPagerWrapper extends PureComponent {

    constructor(props) {
        super(props);
        this.props.navigator &&
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) {
        switch (event.id) {
            case 'willAppear':
                this._reattach();
                break;
        }
    }

    state = {
        width: Dimensions.get('window').width,
    }

    render() {
        return (
            <View style={[this.props.style, {flex: 1}]}>
                <View style={{width: this.state.width, flex: 1}}>
                    {this.props.children}
                </View>
            </View>
        )
    }

    _x = 0.5

    _reattach = () => {
        this.setState({
            width: this.state.width - this._x,
        }, () => {
            this._x *= -1;
        });
    }
}