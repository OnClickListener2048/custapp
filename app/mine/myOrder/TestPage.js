/**
 * Created by liufei on 2018/1/22.
 */

import React, {Component} from 'react';

import CheckInfoItemTwo from "../../view/CheckInfoItemTwo";

export default class TestPage extends Component {


    render(){
        return(
            <CheckInfoItemTwo
                name="名称"
                value="北京科技有限公司"
                isShowLine={true}

            />
        )
    }
}



