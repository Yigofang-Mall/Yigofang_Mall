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

// 导入公共常量
import * as commonConst from '../common/CommonConstants';

/**
 * 下拉刷新组件
 * 展示下拉刷新时的加载状态
 */
@Component
export default struct PutDownRefresh {
  // 链接父组件传递的刷新文本
  @Link refreshText: Resource;

  build() {
    // 刷新指示器布局行
    // Row() {
    //   // 刷新图标
    //   Image($r('app.media.refreshing'))
    //     .width(commonConst.ICON_WIDTH)
    //     .height(commonConst.ICON_HEIGHT)
    //   // 刷新状态文本
    //   Text(this.refreshText).fontSize(commonConst.NORMAL_FONT_SIZE)
    // }
    // .justifyContent(FlexAlign.Center) // 居中对齐
    // .width(commonConst.GOODS_LIST_WIDTH)
    // .height(commonConst.GOODS_LIST_HEIGHT)
  }
}