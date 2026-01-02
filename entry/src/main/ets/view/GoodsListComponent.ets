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
import SortDialog, { SortType } from './SortDialogComponent';
import { saveSortType, getSortType } from '../viewmodel/PreferencesUtils';
import { sortGoodsList } from '../viewmodel/SortUtils';

/**
 * 商品列表组件
 * 使用LazyForEach实现商品列表的懒加载渲染
 * 支持触底加载更多功能
 * 支持搜索结果显示
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
  @State isLoading: boolean = false;
  // 是否正在刷新
  @State isRefreshing: boolean = false;
  // 分类
  @Prop category: string = 'selected';
  // 搜索结果商品列表
  @Prop searchResults: GoodsListItemType[] = [];
  // 是否为搜索模式
  @Prop isSearchMode: boolean = false;
  // 是否显示排序弹窗
  @State showSortDialog: boolean = false;
  // 当前排序类型
  @State currentSortType: SortType = SortType.RECOMMEND;
  // 排序后的搜索结果（用于搜索模式）
  @State sortedSearchResults: GoodsListItemType[] = [];
  // 是否使用懒加载（排序时禁用）
  @State useLazyLoad: boolean = true;

  aboutToAppear() {
    // 当分类改变时，更新数据源
    this.goodsListData.setCategory(this.category);
    
    // 加载保存的排序类型
    const savedSortType = getSortType();
    this.currentSortType = savedSortType;
    this.goodsListData.setSortType(savedSortType);
    
    // 更新懒加载状态
    this.useLazyLoad = this.goodsListData.isLazyLoadMode();
  }

  /**
   * 监听搜索结果显示变化，应用排序
   */
  aboutToUpdate() {
    // 当分类改变时，更新数据源和懒加载状态
    this.goodsListData.setCategory(this.category);
    this.useLazyLoad = this.goodsListData.isLazyLoadMode();
    
    // 当搜索结果变化时，应用当前排序
    if (this.isSearchMode) {
      if (this.searchResults.length > 0) {
        this.sortedSearchResults = sortGoodsList(this.searchResults, this.currentSortType);
      } else {
        // 清空排序后的搜索结果
        this.sortedSearchResults = [];
      }
    }
  }

  // 处理下拉刷新
  private handleRefresh() {
    if (this.isRefreshing) {
      return;
    }

    this.isRefreshing = true;

    // 模拟网络延迟
    setTimeout(() => {
      this.goodsListData.refreshData();
      this.isRefreshing = false;
    }, commonConst.REFRESH_DELAY);
  }

  // 构建单个商品项
  @Builder
  buildGoodsItem(item: GoodsListItemType) {
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
  }

  /**
   * 处理排序选择
   */
  private handleSortSelect(sortType: SortType) {
    console.log('========================================');
    console.log('=== GoodsListComponent.handleSortSelect ===');
    console.log(`选择的排序类型: ${sortType}`);
    console.log(`当前排序类型: ${this.currentSortType}`);
    console.log(`是否为搜索模式: ${this.isSearchMode}`);
    console.log(`当前分类: ${this.category}`);
    
    this.currentSortType = sortType;
    
    // 保存排序类型
    saveSortType(sortType);
    console.log('排序类型已保存到本地存储');
    
    if (this.isSearchMode) {
      // 搜索模式下，对搜索结果进行排序
      console.log('搜索模式：对搜索结果进行排序');
      console.log(`搜索结果数量: ${this.searchResults.length}`);
      
      if (this.searchResults.length > 0) {
        console.log('开始排序搜索结果...');
        this.sortedSearchResults = sortGoodsList(this.searchResults, sortType);
        console.log(`排序后结果数量: ${this.sortedSearchResults.length}`);
      } else {
        console.log('搜索结果为空，无需排序');
        this.sortedSearchResults = [];
      }
    } else {
      // 正常模式下，对数据源进行排序
      console.log('正常模式：对数据源进行排序');
      const dataCount = this.goodsListData.getAllData().length;
      console.log(`数据源商品数量: ${dataCount}`);
      
      this.goodsListData.setSortType(sortType);
      
      // 更新懒加载状态
      this.useLazyLoad = this.goodsListData.isLazyLoadMode();
      console.log(`懒加载状态: ${this.useLazyLoad ? '启用' : '禁用'}`);
      
      // 验证排序后的数据
      const sortedData = this.goodsListData.getAllData();
      console.log(`排序后数据源商品数量: ${sortedData.length}`);
      
      if (dataCount !== sortedData.length) {
        console.error(`[排序错误] 数据源数量变化: ${dataCount} -> ${sortedData.length}`);
      }
    }
    
    console.log('=== handleSortSelect 完成 ===');
    console.log('========================================\n');
  }

  /**
   * 显示排序弹窗
   */
  private openSortDialog() {
    this.showSortDialog = true;
  }

  /**
   * 隐藏排序弹窗
   */
  private closeSortDialog() {
    this.showSortDialog = false;
  }

  /**
   * 获取排序按钮文本
   */
  private getSortButtonText(): string {
    switch (this.currentSortType) {
      case SortType.RECOMMEND:
        return '推荐排序';
      case SortType.PRICE_LOW_TO_HIGH:
        return '价格↑';
      case SortType.PRICE_HIGH_TO_LOW:
        return '价格↓';
      default:
        return '排序';
    }
  }

  // 处理触摸事件（仅在非搜索模式下）
  private handleTouch(event?: TouchEvent) {
    // 搜索模式下不处理触摸事件
    if (this.isSearchMode) {
      return;
    }
    
    // 排序模式下禁用懒加载，不处理触底加载更多
    if (!this.useLazyLoad) {
      return;
    }

    if (event === undefined) {
      return;
    }
    switch (event.type) {
      case TouchType.Down: // 触摸按下
        this.startTouchOffsetY = event.touches[0].y;
        break;
      case TouchType.Move: // 触摸移动
        this.endTouchOffsetY = event.touches[0].y;
        // 判断是否向上滑动且接近底部，如果是则加载更多数据（仅在懒加载模式下）
        if (this.startTouchOffsetY - this.endTouchOffsetY > 100 && !this.isLoading && this.useLazyLoad) {
          this.isLoading = true;
          this.goodsListData.pushData();
          setTimeout(() => {
            this.isLoading = false;
          }, 500);
        }
        // 判断是否下拉刷新
        if (this.endTouchOffsetY - this.startTouchOffsetY > 100 && !this.isRefreshing) {
          this.handleRefresh();
        }
        break;
    }
  }

  build() {
    Column() {
      // 排序按钮（在所有模式下都显示）
      Row() {
        Button(this.getSortButtonText())
          .type(ButtonType.Normal)
          .fontSize(commonConst.NORMAL_FONT_SIZE)
          .backgroundColor('#F5F5F5')
          .fontColor(Color.Black)
          .borderRadius(20)
          .height(36)
          .padding({ left: 16, right: 16 })
          .onClick(() => {
            this.openSortDialog();
          })
      }
      .width('100%')
      .height(50)
      .justifyContent(FlexAlign.End)
      .padding({ right: 16, top: 8, bottom: 8 })
      .transition(TransitionEffect.OPACITY.animation({ duration: 200 }))

      // 商品列表内容
      Row() {
        // 如果是搜索模式且有搜索结果
        if (this.isSearchMode && this.searchResults.length > 0) {
          // 显示搜索结果（使用排序后的结果）
          List({ space: commonConst.LIST_ITEM_SPACE }) {
            ForEach(
              this.sortedSearchResults.length > 0 ? this.sortedSearchResults : this.searchResults,
              (item: GoodsListItemType) => {
                ListItem() {
                  this.buildGoodsItem(item)
                }
              },
              (item: GoodsListItemType) => item.id.toString()
            )
          }
          .width('100%')
          .height('100%')
          .edgeEffect(EdgeEffect.Spring) // 使用弹簧效果
        } else if (this.isSearchMode && this.searchResults.length === 0) {
          // 搜索模式但没有搜索结果
          Column() {
            Text('🔍')
              .fontSize(60)
              .margin({ bottom: 20 })
            Text('没有找到相关商品')
              .fontSize(commonConst.NORMAL_FONT_SIZE)
              .fontColor($r('app.color.gray'))
              .margin({ bottom: 10 })
            Text('请尝试其他关键词')
              .fontSize(commonConst.GOODS_EVALUATE_FONT_SIZE)
              .fontColor($r('app.color.deepGray'))
          }
          .width('100%')
          .height('100%')
          .justifyContent(FlexAlign.Center)
          .alignItems(HorizontalAlign.Center)
        } else {
          // 正常商品列表模式
          List({ space: commonConst.LIST_ITEM_SPACE }) {
            // 根据是否启用懒加载选择不同的渲染方式
            if (this.useLazyLoad) {
              // 使用懒加载方式渲染列表项（推荐排序模式）
              LazyForEach(this.goodsListData, (item: GoodsListItemType) => {
                ListItem() {
                  this.buildGoodsItem(item)
                }
                // 监听触摸事件，实现触底加载更多
                .onTouch((event?: TouchEvent) => {
                  this.handleTouch(event);
                })
              }, (item: GoodsListItemType) => item.id.toString())
            } else {
              // 使用普通ForEach渲染（排序模式，已加载所有数据）
              ForEach(this.goodsListData.getAllData(), (item: GoodsListItemType) => {
                ListItem() {
                  this.buildGoodsItem(item)
                }
              }, (item: GoodsListItemType) => item.id.toString())
            }
          }
          .width('100%')
          .height('100%')
          .edgeEffect(EdgeEffect.Spring) // 使用弹簧效果
        }

        // 状态提示信息
        Column() {
          // 刷新提示
          if (this.isRefreshing) {
            Text('正在刷新...')
              .fontSize(commonConst.NORMAL_FONT_SIZE)
              .fontColor($r('app.color.deepGray'))
              .textAlign(TextAlign.Center)
              .width('100%')
              .margin({ top: 20, bottom: 20 })
          }
          // 加载更多提示（仅在非搜索模式下显示）
          else if (!this.isSearchMode) {
            if (this.isLoading) {
              Text('正在加载更多...')
                .fontSize(commonConst.NORMAL_FONT_SIZE)
                .fontColor($r('app.color.deepGray'))
                .textAlign(TextAlign.Center)
                .width('100%')
                .margin({ top: 20, bottom: 40 })
            } else {
              Text($r('app.string.to_bottom'))
                .fontSize(commonConst.NORMAL_FONT_SIZE)
                .fontColor($r('app.color.deepGray'))
                .textAlign(TextAlign.Center)
                .width('100%')
                .margin({ top: 20, bottom: 40 })
            }
          }
        }
        .justifyContent(FlexAlign.Center)
        .width(commonConst.LAYOUT_WIDTH_OR_HEIGHT)
        .height('100%')
        .backgroundColor($r('app.color.primaryBgColor'))
      }
      .justifyContent(FlexAlign.Center)
      .width(commonConst.LAYOUT_WIDTH_OR_HEIGHT)
      .height('100%')

      // 排序弹窗
      if (this.showSortDialog) {
        SortDialog({
          isVisible: this.showSortDialog,
          currentSort: this.currentSortType,
          onSortSelected: (sortType: SortType) => {
            this.handleSortSelect(sortType);
            this.closeSortDialog();
          },
          onClose: () => {
            this.closeSortDialog();
          }
        })
      }
    }
    .width(commonConst.LAYOUT_WIDTH_OR_HEIGHT)
    .height('100%')
    .backgroundColor($r('app.color.primaryBgColor'))
  }
}