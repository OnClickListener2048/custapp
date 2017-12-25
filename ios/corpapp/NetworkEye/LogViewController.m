//
//  LogViewController.m
//  corpapp
//
//  Created by zhuangzihao on 2017/12/7.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "LogViewController.h"
#import "MyBar.h"
#import "DCLog.h"
#define LogFileName @"DCLogInfo.log"

@interface LogViewController ()
@property (nonatomic, strong) UITextView *logTextView;
@property (nonatomic, strong) NSTimer *time;

@end

@implementation LogViewController

- (void)viewDidLoad {
    [super viewDidLoad];
  if ([[[UIDevice currentDevice]systemVersion] floatValue] >= 7.0) {
    self.edgesForExtendedLayout = UIRectEdgeBottom | UIRectEdgeLeft | UIRectEdgeRight;
    
  }
  self.automaticallyAdjustsScrollViewInsets=NO;
  self.view.backgroundColor=[UIColor whiteColor];
  
  MyBar *bar=[[MyBar alloc] initWithFrame:CGRectMake(0, 0, [[UIScreen mainScreen] bounds].size.width, 64)];
  [self.view addSubview:bar];
  bar.barTintColor=[UIColor colorWithRed:0.24f green:0.51f blue:0.78f alpha:1.00f];
  
  UIButton *backBt=[UIButton buttonWithType:UIButtonTypeCustom];
  backBt.frame=CGRectMake(10, 27, 40, 30);
  [backBt setTitle:@"back" forState:UIControlStateNormal];
  backBt.titleLabel.font=[UIFont systemFontOfSize:15];
  [backBt setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
  [backBt addTarget:self action:@selector(backBtAction) forControlEvents:UIControlEventTouchUpInside];
  [bar addSubview:backBt];
  
  UIButton *cleanBt=[UIButton buttonWithType:UIButtonTypeCustom];
  cleanBt.frame=CGRectMake([[UIScreen mainScreen] bounds].size.width-60, 27, 50, 30);
  [cleanBt setTitle:@"clear" forState:UIControlStateNormal];
  cleanBt.titleLabel.font=[UIFont systemFontOfSize:13];
  [cleanBt setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
  [cleanBt addTarget:self action:@selector(rightAction) forControlEvents:UIControlEventTouchUpInside];
  [bar addSubview:cleanBt];
  
  UILabel *titleText = [[UILabel alloc] initWithFrame: CGRectMake(([[UIScreen mainScreen] bounds].size.width-230)/2, 20, 230, 44)];
  titleText.backgroundColor = [UIColor clearColor];
  titleText.textColor=[UIColor whiteColor];
  [titleText setFont:[UIFont systemFontOfSize:15.0]];
  titleText.textAlignment=NSTextAlignmentCenter;
  [bar addSubview:titleText];
  titleText.text=@"Log";
  
  [self.view addSubview:self.logTextView];
  
  self.time = [NSTimer scheduledTimerWithTimeInterval:0.35 target:self selector:@selector(refreshLogText) userInfo:nil repeats:YES];
  [[NSRunLoop mainRunLoop] addTimer:self.time forMode:NSRunLoopCommonModes];
  
}
- (void)refreshLogText {
  [self updateLog:[self readLogInfo]];

}
- (NSString *)readLogInfo {
  
  NSData *logData = [NSData dataWithContentsOfFile:[self loadPathWithName:LogFileName]];
  NSString *logText = [[NSString alloc]initWithData:logData encoding:NSUTF8StringEncoding];
  
  return logText;
}
- (NSString *)loadPathWithName:(NSString *)fileName {
  
  NSString *documentDirPath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0];
  NSString *path = [documentDirPath stringByAppendingPathComponent:fileName];
  return path;
}
- (UITextView *)logTextView{
  
  if (!_logTextView) {
    _logTextView = [[UITextView alloc] init];
    _logTextView.frame = CGRectMake(0, 64.0, self.view.bounds.size.width, self.view.bounds.size.height-64.0);
    _logTextView.backgroundColor = [UIColor colorWithRed:39/255.0 green:40/255.0 blue:34/255.0 alpha:1.0];
    _logTextView.textColor = [UIColor whiteColor];
    _logTextView.font = [UIFont systemFontOfSize:14.0];
    _logTextView.editable = NO;
    _logTextView.layoutManager.allowsNonContiguousLayout = NO;
  }
  return _logTextView;
  
}
- (void)updateLog:(NSString *)logText {
  if (self.logTextView.contentSize.height <= (self.logTextView.contentOffset.y + CGRectGetHeight(self.view.bounds))) {
    self.logTextView.text = logText;
    [self.logTextView scrollRangeToVisible:NSMakeRange(self.logTextView.text.length, 1)];
  }else {
    self.logTextView.text = logText;
  }
}
- (void)backBtAction {
  [self.time invalidate];
  self.time = nil;
  [self dismissViewControllerAnimated:YES completion:nil];
  
}
- (void)rightAction{
  [[NSFileManager defaultManager]removeItemAtPath:[self loadPathWithName:LogFileName] error:nil];
  [[DCLog shareLog] saveLogInfo];
}
- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
