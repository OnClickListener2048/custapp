//
//  DCLog.m
//  DCLogViewDemo
//
//  Created by DarielChen https://github.com/DarielChen/DCLog
//  Copyright © 2016年 DarielChen. All rights reserved.
//

#import "DCLog.h"


#define LogFileName @"DCLogInfo.log"

#define DCWeakSelf __weak typeof(self) weakSelf = self;

@interface DCLog()

@property (nonatomic, copy) NSString *crashInfoString;


@property (nonatomic, strong) NSTimer *time;


@property(nonatomic, assign) BOOL logViewEnabled;


@end

@implementation DCLog

+ (void)setLogViewEnabled:(BOOL)logViewEnabled {

    [DCLog shareLog].logViewEnabled = logViewEnabled;
    
    [DCLog startRecord];
}

+ (void)startRecord {
    if ([DCLog shareLog].logViewEnabled == YES) {

        [[DCLog shareLog] saveLogInfo];

    }
}




+ (instancetype)shareLog {
    static DCLog *log = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        log = [[DCLog alloc] init];
    });
    return log;
}


- (void)saveLogInfo {
    
    NSString *logPath = [self loadPathWithName:LogFileName];
    [[NSFileManager defaultManager]removeItemAtPath:logPath error:nil];
    
#if TARGET_IPHONE_SIMULATOR
    NSLog(@"SIMULATOR DEVICE");
#else
    freopen([logPath cStringUsingEncoding:NSASCIIStringEncoding], "a+", stdout); //c printf
    freopen([logPath cStringUsingEncoding:NSASCIIStringEncoding], "a+", stderr); //oc  NSLog
#endif
    
}

- (NSString *)loadPathWithName:(NSString *)fileName {
    
    NSString *documentDirPath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0];
    NSString *path = [documentDirPath stringByAppendingPathComponent:fileName];
    return path;
}

- (NSDate *)getCurrentDate {

    NSDate *now = [NSDate date];
    NSTimeZone *zone = [NSTimeZone systemTimeZone];
    NSInteger seconds = [zone secondsFromGMTForDate:now];
    NSDate *newDate = [now dateByAddingTimeInterval:seconds];
    return newDate;
}


@end
