/*
 * Copyright (c) 2023 Huawei Device Co., Ltd.
 * Licensed under the Apache License,Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import TabBar from '../view/TabBarsComponent';
import { LAYOUT_WIDTH_OR_HEIGHT, STORE } from '../common/CommonConstants';
import hidebug from '@ohos.hidebug';
import displaySync from '@ohos.graphics.displaySync';

/**
 * 应用主页面
 * 包含导航栏和标签页组件
 */
@Entry
@Component
struct ListIndex {
  @State memoryUsage: string = '0 MB';
  @State startupTime: string = '';
  @State fps: number = 0;
  private intervalId: number = -1;
  private displaySync: displaySync.DisplaySync | undefined = undefined;
  private lastTime: number = 0;
  private frameCount: number = 0;

  aboutToAppear() {
    let startTime = AppStorage.get<number>('appStartTime');
    if (startTime) {
      let duration = new Date().getTime() - startTime;
      this.startupTime = duration + 'ms';
    }

    this.intervalId = setInterval(() => {
      let pss = hidebug.getPss();
      this.memoryUsage = Number(pss / BigInt(1024)).toFixed(2) + ' MB';
    }, 1000);

    this.displaySync = displaySync.create();
    this.displaySync.setExpectedFrameRateRange({
      expected: 60,
      min: 0,
      max: 120
    });
    this.displaySync.on("frame", (frameInfo) => {
      this.frameCount++;
      let currentTime = frameInfo.timestamp;
      if (this.lastTime === 0) {
        this.lastTime = currentTime;
        return;
      }
      if (currentTime - this.lastTime >= 1000000000) {
        this.fps = this.frameCount;
        this.frameCount = 0;
        this.lastTime = currentTime;
      }
    });
    this.displaySync.start();
  }

  aboutToDisappear() {
    clearInterval(this.intervalId);
    if (this.displaySync) {
      this.displaySync.stop();
    }
  }

  build() {
    Stack({ alignContent: Alignment.Top }) {
      // 主布局行
      Row() {
        // 导航容器
        Navigation() {
          // 内容列布局
          Column() {
            // 标签页组件
            TabBar()
          }
          .width(LAYOUT_WIDTH_OR_HEIGHT)
          .justifyContent(FlexAlign.Center)
        }
        .size({ width: LAYOUT_WIDTH_OR_HEIGHT, height: LAYOUT_WIDTH_OR_HEIGHT })
        .title(STORE) // 设置导航标题
        .titleMode(NavigationTitleMode.Mini) // 设置标题模式为Mini
      }
      .height(LAYOUT_WIDTH_OR_HEIGHT)

      Text(`Memory: ${this.memoryUsage} | Cold Start: ${this.startupTime} | FPS: ${this.fps}`)
        .fontColor(Color.Red)
        .fontSize(14)
        .fontWeight(FontWeight.Bold)
        .margin({ top: 10 })
        .zIndex(999)
    }
    .height(LAYOUT_WIDTH_OR_HEIGHT)
    .backgroundColor($r('app.color.primaryBgColor')) // 设置背景色
    // 设置顶部内边距，避免与状态栏重叠
    .padding({
      top: AppStorage.get<number>('statusBarHeight')
    })
  }
}