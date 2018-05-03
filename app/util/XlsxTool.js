/**
 * Created by zhuangzihao on 2018/4/28.
 */
import XLSX from 'xlsx';
import React, { Component } from 'react';
import {
    Platform
} from 'react-native';

import { writeFile, DocumentDirectoryPath ,ExternalDirectoryPath} from 'react-native-fs';
const DDP = (Platform.OS === 'ios'? DocumentDirectoryPath: ExternalDirectoryPath)+'/';
const output = str => str;
import * as WeChat from'react-native-wechat'

export  function  exportFile(data,title = "",cols,merges) {
    /* convert AOA back to worksheet */
    const ws = XLSX.utils.aoa_to_sheet(data);

    if(merges){
        ws["!merges"] = merges
    }

    if(cols){
        ws['!cols'] = cols
    }
    /* build new workbook */
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
    /* write file */
    const wbout = XLSX.write(wb, {type:'binary', bookType:"xlsx"});
    const file = DDP + "myXlsx.xlsx";
    writeFile(file, output(wbout), 'ascii').then((res) =>{
        console.log("exportFile success", "Exported to " + file)
        WeChat.shareToSession({
            type: 'file',
            title: title + '.xlsx', // WeChat app treat title as file name
            mediaTagName: 'xlsx',
            filePath:file,
            fileExtension: '.xlsx',
        });
    }).catch((err) => {
        console.log("exportFile Error", "Error " + err.message)
    });
}
