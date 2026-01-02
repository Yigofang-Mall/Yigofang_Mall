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

import {
  LAYOUT_WIDTH_OR_HEIGHT,
  NORMAL_FONT_SIZE,
  GOODS_EVALUATE_FONT_SIZE,
  SEARCH_HEIGHT,
  SEARCH_MARGIN,
  SEARCH_PADDING
} from '../common/CommonConstants';

/**
 * 搜索框组件
 * 支持搜索文本输入、清除、搜索等功能
 */
interface GeneratedTypeLiteralInterface_1 {
  onSearch: (keyword: string) => void;
}

@Component
export default struct SearchBox {
  // 搜索文本
  @State searchText: string = '';
  // 搜索回调函数
  @Prop callback?: GeneratedTypeLiteralInterface_1;
  // 占位符文本
  @Prop placeholder: string = '请输入搜索关键词';

  /**
   * 处理搜索
   */
  private handleSearch() {
    if (this.searchText.trim() && this.callback?.onSearch) {
      this.callback.onSearch(this.searchText.trim());
    }
  }

  /**
   * 清除搜索文本
   */
  private clearSearch() {
    this.searchText = '';
    if (this.callback?.onSearch) {
      this.callback.onSearch('');
    }
  }

  /**
   * 构建清除按钮
   */
  @Builder
  buildClearButton() {
    if (this.searchText.length > 0) {
      Row() {
        Text('×')
          .fontSize(18)
          .fontColor($r('app.color.white'))
          .fontWeight(FontWeight.Bold)
      }
      .width(20)
      .height(20)
      .justifyContent(FlexAlign.Center)
      .alignItems(VerticalAlign.Center)
      .backgroundColor($r('app.color.clear_button_bg'))
      .borderRadius(10)
      .onClick(() => this.clearSearch())
      .animation({
        duration: 200,
        curve: Curve.EaseOut
      })
    }
  }

  build() {
    // 搜索框容器
    Column() {
      // 搜索框顶部区域（搜索输入框和搜索按钮）
      Row() {
        // 搜索输入框
        Row() {
          // 搜索输入框
          TextInput({
            text: this.searchText,
            placeholder: this.placeholder
          })
            .fontSize(NORMAL_FONT_SIZE)
            .fontColor($r('app.color.search_text'))
            .backgroundColor(Color.Transparent)
            .borderRadius(0)
            .layoutWeight(1)
            .maxLines(1)
            .onChange((value: string) => {
              this.searchText = value;
            })
            .onSubmit(() => {
              this.handleSearch();
            })
            .placeholderFont({ size: GOODS_EVALUATE_FONT_SIZE })
            .placeholderColor($r('app.color.placeholder_text'))

          // 清除按钮
          this.buildClearButton()
        }
        .height(SEARCH_HEIGHT)
        .padding({ left: 12, right: 12 })
        .backgroundColor($r('app.color.search_bg'))
        .borderRadius(20)
        .layoutWeight(1)
        .animation({
          duration: 300,
          curve: Curve.EaseOut
        })

        // 搜索按钮
        Row() {
          Text('搜索')
            .fontSize(GOODS_EVALUATE_FONT_SIZE)
            .fontColor(Color.White)
            .fontWeight(FontWeight.Medium)
        }
        .height(SEARCH_HEIGHT)
        .padding({ left: 16, right: 16 })
        .backgroundColor($r('app.color.primary'))
        .borderRadius(20)
        .margin({ left: SEARCH_MARGIN })
        .onClick(() => this.handleSearch())
        .animation({
          duration: 200,
          curve: Curve.EaseOut
        })
      }
      .width('100%')
      .alignItems(VerticalAlign.Center)
    }
    .width(LAYOUT_WIDTH_OR_HEIGHT)
    .padding({ top: 12, left: 16, right: 16, bottom: 8 })
    .backgroundColor($r('app.color.search_container_bg'))
  }
}