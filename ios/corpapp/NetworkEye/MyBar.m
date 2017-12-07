//
//  MyBar.m
//  corpapp
//
//  Created by zhuangzihao on 2017/12/7.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "MyBar.h"

@implementation MyBar
- (void)layoutSubviews {
  [super layoutSubviews];
#if TARGET_OS_IOS
  for (UIView *aView in self.subviews) {
    if ([@[@"_UINavigationBarBackground", @"_UIBarBackground"] containsObject:NSStringFromClass([aView class])]) {
      aView.frame = CGRectMake(0, -CGRectGetMinY(self.frame), CGRectGetWidth(self.frame), CGRectGetHeight(self.frame)+CGRectGetMinY(self.frame));
    }
  }
#endif
  
}

@end
