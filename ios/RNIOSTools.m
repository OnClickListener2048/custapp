//
//  RNIOSTools.m
//  corpapp
//
//  Created by zhuangzihao on 2018/4/9.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "RNIOSTools.h"

@implementation RNIOSTools
RCT_EXPORT_MODULE();
RCT_EXPORT_METHOD(goQQChat:(NSString *)qq)
{
    NSString * str = [NSString stringWithFormat:@"mqq://im/chat?chat_type=wpa&uin=%@&version=1&src_type=web",qq];
  [[UIApplication sharedApplication] openURL:[NSURL URLWithString:str]];
}
@end
