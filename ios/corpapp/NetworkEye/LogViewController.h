//
//  LogViewController.h
//  corpapp
//
//  Created by zhuangzihao on 2017/12/7.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface LogViewController : UIViewController
- (void)updateLog:(NSString *)logText;

@property (nonatomic, strong) void(^indexBlock)(NSInteger index);

@property (nonatomic, strong) void(^CleanButtonIndexBlock)(NSInteger index);
@end
