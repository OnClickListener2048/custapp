/**
 * Created by zhuangzihao on 2017/9/8.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    ScrollView
} from 'react-native';
import { Pie ,StockLine} from 'react-native-pathjs-charts'

export default class ServicePage extends Component {
    constructor(props) {
        super(props);
        this.state={
            dataPie : [{
                "name": "增值税",
                "population": 8000.00
            }, {
                "name": "城市建设税",
                "population": 2000.00
            }, {
                "name": "教育费附加",
                "population": 1100.00
            }, {
                "name": "印花税",
                "population": 900.00
            }],
            optionsPie:{
                margin: {
                    top: 20,
                    left: 20,
                    right: 20,
                    bottom: 20
                },
                width: 350,
                height: 350,
                color: '#2980B9',
                r: 50,
                R: 150,
                legendPosition: 'topLeft',
                animate: {
                    type: 'oneByOne',
                    duration: 200,
                    fillTransition: 3
                },
                label: {
                    fontFamily: 'Arial',
                    fontSize: 10,
                    fontWeight: true,
                    color: '#ECF0F1'
                }
            },
            dataStockLine: [
                [{
                    "x": 0,
                    "y": 47782
                }, {
                    "x": 1,
                    "y": 48497
                }, {
                    "x": 2,
                    "y": 77128
                }, {
                    "x": 3,
                    "y": 73413
                }, {
                    "x": 4,
                    "y": 58257
                }, {
                    "x": 5,
                    "y": 40579
                }, {
                    "x": 6,
                    "y": 72893
                }, {
                    "x": 7,
                    "y": 58257
                }, {
                    "x": 8,
                    "y": 72893
                }, {
                    "x": 9,
                    "y": 72893
                }, {
                    "x": 10,
                    "y": 58257
                }, {
                    "x": 11,
                    "y": 72893
                }]
            ],
            optionsStockLine:{
                width: 300,
                height: 250,
                color: '#777777',
                margin: {
                    top: 10,
                    left: 35,
                    bottom: 30,
                    right: 10
                },
                animate: {
                    type: 'delayed',
                    duration: 200
                },
                axisX: {
                    showAxis: true,
                    showLines: true,
                    showLabels: true,
                    showTicks: true,
                    zeroAxis: false,
                    color:'#111111',
                    orient: 'bottom',
                    tickValues: [
                        {value:'1月'},
                        {value:'2月'},
                        {value:'3月'},
                        {value:'4月'},
                        {value:'5月'},
                        {value:'6月'},
                        {value:'7月'},
                        {value:'8月'},
                        {value:'9月'},
                        {value:'10月'},
                        {value:'11月'},
                        {value:'12月'}
                    ],
                    label: {
                        fontFamily: 'Arial',
                        fontSize: 8,
                        fontWeight: true,
                        fill: '#34495E',
                    }
                },
                axisY: {
                    showAxis: true,
                    showLines: true,
                    showLabels: true,
                    showTicks: true,
                    zeroAxis: false,
                    orient: 'left',
                    color:'#111111',
                    tickValues: [],
                    label: {
                        fontFamily: 'Arial',
                        fontSize: 8,
                        fontWeight: true,
                        fill: '#34495E',
                    }
                }
            }
        }
    }

    render(){
        return(
            <ScrollView>
                <Pie data={this.state.dataPie}
                     options={this.state.optionsPie}
                     accessorKey="population"
                     margin={{top: 20, left: 20, right: 20, bottom: 20}}
                     color="#2980B9"
                     pallete={
                         [
                             {'r':25,'g':99,'b':201},
                             {'r':24,'g':175,'b':35},
                             {'r':190,'g':31,'b':69},
                             {'r':100,'g':36,'b':199}
                         ]
                     }
                     r={50}
                     R={150}
                     legendPosition="topLeft"
                     label={{
                         fontFamily: 'Arial',
                         fontSize: 8,
                         fontWeight: true,
                         color: '#ECF0F1'
                     }}
                />
                <StockLine data={this.state.dataStockLine} options={this.state.optionsStockLine} xKey='x' yKey='y' />
            </ScrollView>
        )
    }
}