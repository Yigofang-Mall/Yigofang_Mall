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

import { NORMAL_FONT_SIZE } from '../common/CommonConstants';

/**
 * 排序类型枚举
 */
export enum SortType {
  RECOMMEND = 'recommend',      // 推荐排序
  PRICE_LOW_TO_HIGH = 'price_asc',  // 价格从低到高
  PRICE_HIGH_TO_LOW = 'price_desc'  // 价格从高到低
}

/**
 * 排序选项弹窗组件
 * 提供三种排序选项：推荐排序、价格从低到高、价格从高到低
 */
@Component
export default struct SortDialog {
  // 是否显示弹窗
  @Prop isVisible: boolean = false;
  // 当前选中的排序类型
  @Prop currentSort: SortType = SortType.RECOMMEND;
  // 排序选择回调
  onSortSelected?: (sortType: SortType) => void;
  // 关闭弹窗回调
  onClose?: () => void;

  /**
   * 处理排序选择
   */
  private handleSortSelect(sortType: SortType) {
    if (this.onSortSelected) {
      this.onSortSelected(sortType);
    }
  }

  /**
   * 处理关闭弹窗
   */
  private handleClose() {
    if (this.onClose) {
      this.onClose();
    }
  }

  /**
   * 构建排序选项项
   */
  @Builder
  buildSortItem(label: string, sortType: SortType) {
    Row() {
      Text(label)
        .fontSize(NORMAL_FONT_SIZE)
        .fontColor(this.currentSort === sortType ? Color.Blue : Color.Black)
        .fontWeight(this.currentSort === sortType ? FontWeight.Medium : FontWeight.Normal)
      
      if (this.currentSort === sortType) {
        Text('✓')
          .fontSize(NORMAL_FONT_SIZE)
          .fontColor(Color.Blue)
          .margin({ left: 8 })
      }
    }
    .width('100%')
    .height(56)
    .padding({ left: 20, right: 20 })
    .justifyContent(FlexAlign.SpaceBetween)
    .alignItems(VerticalAlign.Center)
    .backgroundColor(this.currentSort === sortType ? '#F0F8FF' : Color.Transparent)
    .onClick(() => {
      this.handleSortSelect(sortType);
    })
  }

  build() {
    if (this.isVisible) {
      // 遮罩层
      Stack() {
        // 背景遮罩
        Column()
          .width('100%')
          .height('100%')
          .backgroundColor('#80000000')
          .onClick(() => {
            // 点击遮罩层时关闭弹窗
            this.handleClose();
          })
          .transition(TransitionEffect.OPACITY.animation({ duration: 200, curve: Curve.EaseInOut }))

        // 弹窗内容
        Column() {
          // 标题
          Row() {
            Text('排序方式')
              .fontSize(18)
              .fontWeight(FontWeight.Medium)
              .fontColor(Color.Black)
          }
          .width('100%')
          .height(56)
          .padding({ left: 20, right: 20 })
          .justifyContent(FlexAlign.Center)
          .borderRadius({ topLeft: 12, topRight: 12 })
          .backgroundColor(Color.White)

          // 分割线
          Divider()
            .color('#E5E5E5')
            .strokeWidth(1)

          // 排序选项列表
          Column() {
            this.buildSortItem('推荐排序', SortType.RECOMMEND)
            Divider()
              .color('#F5F5F5')
              .strokeWidth(1)
              .margin({ left: 20, right: 20 })
            this.buildSortItem('价格从低到高', SortType.PRICE_LOW_TO_HIGH)
            Divider()
              .color('#F5F5F5')
              .strokeWidth(1)
              .margin({ left: 20, right: 20 })
            this.buildSortItem('价格从高到低', SortType.PRICE_HIGH_TO_LOW)
          }
          .width('100%')
          .backgroundColor(Color.White)
          .borderRadius({ bottomLeft: 12, bottomRight: 12 })
        }
        .width('80%')
        .borderRadius(12)
        .backgroundColor(Color.White)
        .shadow({
          radius: 20,
          color: '#40000000',
          offsetX: 0,
          offsetY: 4
        })
        .transition(TransitionEffect.translate({ y: 50 }).animation({ duration: 250, curve: Curve.EaseOut }))
        .transition(TransitionEffect.OPACITY.animation({ duration: 250, curve: Curve.EaseOut }))
      }
      .width('100%')
      .height('100%')
      .position({ x: 0, y: 0 })
    }
  }
}

