/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "RCTHTTPRequestHandler.h"
#include<netdb.h>

#import <mutex>

#import "RCTNetworking.h"
#import <AlicloudHttpDNS/AlicloudHttpDNS.h>
@interface RCTHTTPRequestHandler () <NSURLSessionDataDelegate,NSURLSessionTaskDelegate>
@property (nonatomic, strong) NSMutableURLRequest *request;

@end

@implementation RCTHTTPRequestHandler
{
    NSMapTable *_delegates;
    NSURLSession *_session;
    std::mutex _mutex;
}

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE()

- (void)invalidate
{
    [_session invalidateAndCancel];
    _session = nil;
}

- (BOOL)isValid
{
    // if session == nil and delegates != nil, we've been invalidated
    return _session || !_delegates;
}

#pragma mark - NSURLRequestHandler

- (BOOL)canHandleRequest:(NSURLRequest *)request
{
    static NSSet<NSString *> *schemes = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        // technically, RCTHTTPRequestHandler can handle file:// as well,
        // but it's less efficient than using RCTFileRequestHandler
        schemes = [[NSSet alloc] initWithObjects:@"http", @"https", nil];
    });
    return [schemes containsObject:request.URL.scheme.lowercaseString];
}


- (BOOL)isIpv6WithHostName:(const NSString *)hostName
{
    struct addrinfo * result;
    struct addrinfo * res;
    char ipv4[128];
    char ipv6[128];
    int error;
    BOOL IS_IPV6 = FALSE;
    bzero(&ipv4, sizeof(ipv4));
    bzero(&ipv4, sizeof(ipv6));
    
    error = getaddrinfo([hostName UTF8String], NULL, NULL, &result);
    if(error != 0) {
        NSLog(@"error in getaddrinfo:%d", error);
        return YES;
    }
    for(res = result; res!=NULL; res = res->ai_next) {
        char hostname[1025] = "";
        error = getnameinfo(res->ai_addr, res->ai_addrlen, hostname, 1025, NULL, 0, 0);
        if(error != 0) {
            continue;
        }
        else {
            switch (res->ai_addr->sa_family) {
                case AF_INET:
                    memcpy(ipv4, hostname, 128);
                    break;
                case AF_INET6:
                    memcpy(ipv6, hostname, 128);
                    IS_IPV6 = TRUE;
                default:
                    break;
            }
        }
    }
    freeaddrinfo(result);
    if(IS_IPV6 == TRUE)
    { return YES;}else{
        return NO;
    }
}



- (NSURLSessionDataTask *)sendRequest:(NSURLRequest *)request
                         withDelegate:(id<RCTURLRequestDelegate>)delegate
{
    HttpDnsService *httpdns = [HttpDnsService sharedInstance];
    NSString *originalUrl = [request.URL absoluteString];
    NSURL *url = [NSURL URLWithString:originalUrl];
    self.request = [request mutableCopy];
    NSString *ip = [httpdns getIpByHostAsync:url.host];
    if (ip) {
        // 通过HTTPDNS获取IP成功，进行URL替换和HOST头设置
        NSLog(@"Get IP(%@) for host(%@) from HTTPDNS Successfully!", ip, url.host);
        NSRange hostFirstRange = [originalUrl rangeOfString:url.host];
        if (NSNotFound != hostFirstRange.location) {
            NSString *newUrl = [originalUrl stringByReplacingCharactersInRange:hostFirstRange withString:ip];
            NSLog(@"New URL: %@", newUrl);
            
            
            if ([self isIpv6WithHostName:url.host]) {
                self.request.URL = [NSURL URLWithString:originalUrl];
            }else{
                self.request.URL = [NSURL URLWithString:newUrl];
            }
            
            
            
            [self.request setValue:url.host forHTTPHeaderField:@"host"];
        }
    }
    // Lazy setup
    if (!_session && [self isValid]) {
        NSOperationQueue *callbackQueue = [NSOperationQueue new];
        callbackQueue.maxConcurrentOperationCount = 1;
        callbackQueue.underlyingQueue = [[_bridge networking] methodQueue];
        NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
        _session = [NSURLSession sessionWithConfiguration:configuration
                                                 delegate:self
                                            delegateQueue:callbackQueue];
        
        std::lock_guard<std::mutex> lock(_mutex);
        _delegates = [[NSMapTable alloc] initWithKeyOptions:NSPointerFunctionsStrongMemory
                                               valueOptions:NSPointerFunctionsStrongMemory
                                                   capacity:0];
    }
    
    NSURLSessionDataTask *task = [_session dataTaskWithRequest:self.request];
    {
        std::lock_guard<std::mutex> lock(_mutex);
        [_delegates setObject:delegate forKey:task];
    }
    [task resume];
    return task;
}

- (void)cancelRequest:(NSURLSessionDataTask *)task
{
    {
        std::lock_guard<std::mutex> lock(_mutex);
        [_delegates removeObjectForKey:task];
    }
    [task cancel];
}

#pragma mark - NSURLSession delegate

- (void)URLSession:(NSURLSession *)session
              task:(NSURLSessionTask *)task
   didSendBodyData:(int64_t)bytesSent
    totalBytesSent:(int64_t)totalBytesSent
totalBytesExpectedToSend:(int64_t)totalBytesExpectedToSend
{
    id<RCTURLRequestDelegate> delegate;
    {
        std::lock_guard<std::mutex> lock(_mutex);
        delegate = [_delegates objectForKey:task];
    }
    [delegate URLRequest:task didSendDataWithProgress:totalBytesSent];
}

- (void)URLSession:(NSURLSession *)session
          dataTask:(NSURLSessionDataTask *)task
didReceiveResponse:(NSURLResponse *)response
 completionHandler:(void (^)(NSURLSessionResponseDisposition))completionHandler
{
    id<RCTURLRequestDelegate> delegate;
    {
        std::lock_guard<std::mutex> lock(_mutex);
        delegate = [_delegates objectForKey:task];
    }
    [delegate URLRequest:task didReceiveResponse:response];
    completionHandler(NSURLSessionResponseAllow);
}

- (void)URLSession:(NSURLSession *)session
          dataTask:(NSURLSessionDataTask *)task
    didReceiveData:(NSData *)data
{
    id<RCTURLRequestDelegate> delegate;
    {
        std::lock_guard<std::mutex> lock(_mutex);
        delegate = [_delegates objectForKey:task];
    }
    [delegate URLRequest:task didReceiveData:data];
}

- (void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task didCompleteWithError:(NSError *)error
{
    id<RCTURLRequestDelegate> delegate;
    {
        std::lock_guard<std::mutex> lock(_mutex);
        delegate = [_delegates objectForKey:task];
        [_delegates removeObjectForKey:task];
    }
    [delegate URLRequest:task didCompleteWithError:error];
}
#pragma mark - NSURLSessionTaskDelegate
- (void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task didReceiveChallenge:(NSURLAuthenticationChallenge *)challenge completionHandler:(void (^)(NSURLSessionAuthChallengeDisposition, NSURLCredential *_Nullable))completionHandler {
    if (!challenge) {
        return;
    }
    NSURLSessionAuthChallengeDisposition disposition = NSURLSessionAuthChallengePerformDefaultHandling;
    NSURLCredential *credential = nil;
    /*
     * 获取原始域名信息。
     */
    NSString *host = [[self.request allHTTPHeaderFields] objectForKey:@"host"];
    if (!host) {
        host = self.request.URL.host;
    }
    if ([challenge.protectionSpace.authenticationMethod isEqualToString:NSURLAuthenticationMethodServerTrust]) {
        if ([self evaluateServerTrust:challenge.protectionSpace.serverTrust forDomain:host]) {
            disposition = NSURLSessionAuthChallengeUseCredential;
            credential = [NSURLCredential credentialForTrust:challenge.protectionSpace.serverTrust];
        } else {
            disposition = NSURLSessionAuthChallengePerformDefaultHandling;
        }
    } else {
        disposition = NSURLSessionAuthChallengePerformDefaultHandling;
    }
    // 对于其他的challenges直接使用默认的验证方案
    completionHandler(disposition, credential);
}
- (BOOL)evaluateServerTrust:(SecTrustRef)serverTrust
                  forDomain:(NSString *)domain {
    /*
     * 创建证书校验策略
     */
    NSMutableArray *policies = [NSMutableArray array];
    if (domain) {
        [policies addObject:(__bridge_transfer id) SecPolicyCreateSSL(true, (__bridge CFStringRef) domain)];
    } else {
        [policies addObject:(__bridge_transfer id) SecPolicyCreateBasicX509()];
    }
    /*
     * 绑定校验策略到服务端的证书上
     */
    SecTrustSetPolicies(serverTrust, (__bridge CFArrayRef) policies);
    /*
     * 评估当前serverTrust是否可信任，
     * 官方建议在result = kSecTrustResultUnspecified 或 kSecTrustResultProceed
     * 的情况下serverTrust可以被验证通过，https://developer.apple.com/library/ios/technotes/tn2232/_index.html
     * 关于SecTrustResultType的详细信息请参考SecTrust.h
     */
    SecTrustResultType result;
    SecTrustEvaluate(serverTrust, &result);
    return (result == kSecTrustResultUnspecified || result == kSecTrustResultProceed);
}

@end
