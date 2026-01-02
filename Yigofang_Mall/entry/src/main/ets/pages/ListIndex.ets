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

/**
 * 应用主页面
 * 包含导航栏和标签页组件
 */
@Entry
@Component
struct ListIndex {
  build() {
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
    .backgroundColor($r('app.color.primaryBgColor')) // 设置背景色
    // 设置顶部内边距，避免与状态栏重叠
    .padding({
      top: AppStorage.get<number>('statusBarHeight')
    })
  }
}