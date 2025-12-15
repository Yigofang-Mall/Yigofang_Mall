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

import * as commonConst from '../common/CommonConstants';
import { GoodsListItemType } from '../viewmodel/InitialData';
import { ListDataSource } from '../viewmodel/ListDataSource';

/**
 * 商品列表组件
 * 使用LazyForEach实现商品列表的懒加载渲染
 * 支持触底加载更多功能
 */
@Component
export default struct GoodsList {
  // 提供列表数据源
  @Provide goodsListData: ListDataSource = new ListDataSource();
  // 记录触摸起始点Y坐标
  private startTouchOffsetY: number = 0;
  // 记录触摸结束点Y坐标
  private endTouchOffsetY: number = 0;
  // 是否正在加载
  private isLoading: boolean = false;

  build() {
    Row() {
      // 商品列表容器
      List({ space: commonConst.LIST_ITEM_SPACE }) {
        // 使用懒加载方式渲染列表项
        LazyForEach(this.goodsListData, (item: GoodsListItemType, index: number) => {
          ListItem() {
            // 单个商品项布局
            Row() {
              // 商品图片区域
              Column() {
                Image(item?.goodsImg)
                  .width(commonConst.LAYOUT_WIDTH_OR_HEIGHT)
                  .height(commonConst.LAYOUT_WIDTH_OR_HEIGHT)
                  .objectFit(ImageFit.Contain)
                  .draggable(false) // 禁止图片拖拽
                  .borderRadius(8)
              }
              .width(commonConst.GOODS_IMAGE_WIDTH)
              .height(commonConst.LAYOUT_WIDTH_OR_HEIGHT)
              .justifyContent(FlexAlign.Center)
              .alignItems(HorizontalAlign.Center)

              // 商品信息区域
              Column() {
                // 商品名称
                Text(item?.goodsName)
                  .fontSize(commonConst.NORMAL_FONT_SIZE)
                  .fontWeight(FontWeight.Medium)
                  .maxLines(2)
                  .textOverflow({ overflow: TextOverflow.Ellipsis })
                  .margin({ bottom: 4 })

                // 广告语
                Text(item?.advertisingLanguage)
                  .fontColor($r('app.color.gray'))
                  .fontSize(commonConst.GOODS_EVALUATE_FONT_SIZE)
                  .maxLines(1)
                  .textOverflow({ overflow: TextOverflow.Ellipsis })
                  .margin({ bottom: 8, right: commonConst.MARGIN_RIGHT })

                // 评价和价格信息行
                Row() {
                  // 评价信息
                  Text(item?.evaluate)
                    .fontSize(commonConst.GOODS_EVALUATE_FONT_SIZE)
                    .fontColor($r('app.color.deepGray'))
                    .width(commonConst.EVALUATE_WIDTH)
                    .maxLines(1)
                    .textOverflow({ overflow: TextOverflow.Ellipsis })
                  
                  // 价格信息（红色突出显示）
                  Text(item?.price)
                    .fontSize(commonConst.NORMAL_FONT_SIZE)
                    .fontColor($r('app.color.freshRed'))
                    .fontWeight(FontWeight.Bold)
                }
                .justifyContent(FlexAlign.SpaceBetween)
                .width(commonConst.GOODS_LIST_WIDTH)
              }
              .padding(commonConst.GOODS_LIST_PADDING) // 设置内边距
              .width(commonConst.GOODS_FONT_WIDTH)
              .height(commonConst.LAYOUT_WIDTH_OR_HEIGHT)
              .justifyContent(FlexAlign.SpaceBetween) // 子元素两端对齐
            }
            .justifyContent(FlexAlign.SpaceBetween) // 商品图片和信息区域两端对齐
            .height(commonConst.GOODS_LIST_HEIGHT)
            .width(commonConst.LAYOUT_WIDTH_OR_HEIGHT)
            // .backgroundColor($r('app.color.white'))
            // .borderRadius(12)
            // .margin({ left: 12, right: 12 })
            // .shadow({ radius: 6, color: '#20000000', offsetX: 1, offsetY: 2 })
          }
          // 监听触摸事件，实现触底加载更多
          .onTouch((event?: TouchEvent) => {
            if (event === undefined) {
              return;
            }
            switch (event.type) {
              case TouchType.Down: // 触摸按下
                this.startTouchOffsetY = event.touches[0].y;
                break;
              case TouchType.Move: // 触摸移动
                this.endTouchOffsetY = event.touches[0].y;
                // 判断是否向上滑动且接近底部，如果是则加载更多数据
                if (this.startTouchOffsetY - this.endTouchOffsetY > 100 && !this.isLoading) {
                  this.isLoading = true;
                  this.goodsListData.pushData();
                  setTimeout(() => {
                    this.isLoading = false;
                  }, 500);
                }
                break;
            }
          })
        }, (item: GoodsListItemType) => item.id.toString())
      }
      .width('100%')
      .height('100%')
      .edgeEffect(EdgeEffect.Spring) // 使用弹簧效果
      
      // 加载更多提示
      if (this.isLoading) {
        Text('正在加载更多...')
          .fontSize(commonConst.NORMAL_FONT_SIZE)
          .fontColor($r('app.color.gray'))
          .textAlign(TextAlign.Center)
          .width('100%')
          .margin({ top: 20, bottom: 40 })
      } else {
        Text($r('app.string.to_bottom'))
          .fontSize(commonConst.NORMAL_FONT_SIZE)
          .fontColor($r('app.color.gray'))
          .textAlign(TextAlign.Center)
          .width('100%')
          .margin({ top: 20, bottom: 40 })
      }
    }
    .justifyContent(FlexAlign.Center)
    .width(commonConst.LAYOUT_WIDTH_OR_HEIGHT)
    .height('100%')
    .backgroundColor($r('app.color.primaryBgColor'))
  }
}