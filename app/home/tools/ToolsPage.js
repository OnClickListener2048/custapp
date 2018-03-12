/**
 * Created by zhuangzihao on 2018/3/12.
 */

import React from 'react';
import {
    TouchableOpacity,
    Text,
    View,
    Image,
    ScrollView,
    Dimensions
} from 'react-native';
import BComponent from '../../base'
import * as apis from '../../apis';
const deviceWidth = Dimensions.get('window').width;
import pushJump from '../../util/pushJump';

export default class ToolsPage extends BComponent {

    constructor(props) {
        super(props);
        this.state = {
            toolArr:[]
        };
    }
    static navigatorStyle = {
        navBarHidden: false, // 隐藏默认的顶部导航栏
        tabBarHidden: true, // 默认隐藏底部标签栏
    };

    componentDidMount() {
        this.loadData()
    }
    loadData(){
        apis.loadOtherTools().then(
            (responseData) => {
                if(responseData.code == 0 && responseData.list){
                    this.setState({
                        toolArr:responseData.list
                    })
                }
            },
            (e) => {

            }
        );
    }

    render(){
        let col = 4
        let itemMargin = 0
        let itemWidth = (deviceWidth - itemMargin*(col+1))/col
        return(
            <ScrollView>
                <View style={{flexDirection:'row'}}>
                    {
                        this.state.toolArr.map((item,i)=>{
                            return(
                                <TouchableOpacity key={i} onPress={this._gotoToolDetail.bind(this,item)} >
                                    <View key={i} style={[{width:itemWidth,height:itemWidth,marginLeft:itemMargin,justifyContent:'center',alignItems:'center'}]}>
                                        <Image resizeMode="contain" style={{marginTop:10, width:28,height:28}} source={{uri:item.img}}/>
                                        <Text style={{marginTop:15,marginBottom:10,fontSize:setSpText(14),color:'#666666'}}>{item.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            )

                        })
                    }
                </View>

            </ScrollView>
        )
    }
    _gotoToolDetail(item){
        if(item.url){
            pushJump(this.props.navigator, item.url,item.name,'噼里啪智能财税',item.name,'');

        }else{
            Toast.show('即将上线，敬请期待...')
        }
    }
}







