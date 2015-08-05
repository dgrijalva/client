//
//  KBEnvConfig.h
//  Keybase
//
//  Created by Gabriel on 5/27/15.
//  Copyright (c) 2015 Gabriel Handford. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef NS_ENUM (NSInteger, KBEnv) {
  KBEnvProd,
  KBEnvDevel,
  KBEnvBrew,
};

@interface KBEnvConfig : NSObject

@property (readonly) NSString *homeDir;
@property (readonly) NSString *host;
@property (readonly, getter=isDebugEnabled) BOOL debugEnabled;
@property (readonly) NSString *mountDir;
@property (nonatomic, readonly) NSString *sockFile;
@property (nonatomic, readonly) NSString *configFile;
@property (readonly) NSString *identifier;
@property (readonly, getter=isLaunchdEnabled) BOOL launchdEnabled;
@property (readonly) NSString *launchdLabelService;
@property (readonly) NSString *launchdLabelKBFS;
@property (readonly) NSString *title;
@property (readonly) NSString *info;
@property (readonly) NSImage *image;
@property (readonly, getter=isInstallEnabled) BOOL installEnabled; // Whether to attempt install

- (instancetype)initWithEnv:(KBEnv)env;

- (instancetype)initWithHomeDir:(NSString *)homeDir sockFile:(NSString *)sockFile mountDir:(NSString *)mountDir develMode:(BOOL)develMode;

+ (instancetype)env:(KBEnv)env;

+ (instancetype)loadFromUserDefaults:(NSUserDefaults *)userDefaults;
- (void)saveToUserDefaults:(NSUserDefaults *)userDefaults;

- (NSString *)logFile;

- (NSDictionary *)launchdPlistDictionaryForService;
- (NSDictionary *)launchdPlistDictionaryForKBFS;

- (NSArray *)programArgumentsForKeybase:(BOOL)useBundle escape:(BOOL)escape tilde:(BOOL)tilde options:(NSArray *)options;
- (NSArray *)programArgumentsForKBFS:(BOOL)useBundle escape:(BOOL)escape tilde:(BOOL)tilde options:(NSArray *)options;

- (NSString *)commandLineForService:(BOOL)useBundle escape:(BOOL)escape tilde:(BOOL)tilde options:(NSArray *)options;
- (NSString *)commandLineForKBFS:(BOOL)useBundle escape:(BOOL)escape tilde:(BOOL)tilde options:(NSArray *)options;

- (NSString *)cachePath:(NSString *)filename;

- (NSBundle *)bundle;

- (BOOL)validate:(NSError **)error;

@end

