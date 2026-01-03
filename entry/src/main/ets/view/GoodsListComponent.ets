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
import SortDialog, { SortType, PriceRangeFilter } from './SortDialogComponent';
import { saveSortType, getSortType } from '../viewmodel/PreferencesUtils';
import { searchGoodsByKeyword } from '../viewmodel/SearchUtils';
import { sortGoodsList } from '../viewmodel/SortUtils';

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
  // 是否已经到达底部（没有更多数据）
  @State hasReachedBottom: boolean = false;
  // 是否正在刷新
  @State isRefreshing: boolean = false;
  // 分类
  @Prop category: string = 'selected';

  // 新增：搜索相关状态
  @State searchKeyword: string = '';
  @State isSearchMode: boolean = false;
  @State showSortDialog: boolean = false;
  @State currentSortType: SortType = SortType.RECOMMEND;
  @State currentPriceFilter: PriceRangeFilter | null = null;
  // 搜索结果相关状态
  @State searchResults: GoodsListItemType[] = [];
  @State sortedSearchResults: GoodsListItemType[] = [];
  @State useLazyLoad: boolean = true;

  aboutToAppear() {
    // 当分类改变时，更新数据源
    this.goodsListData.setCategory(this.category);

    // 初始化排序类型
    this.currentSortType = getSortType();
    this.goodsListData.setSortType(this.currentSortType);

    // 延迟初始化底部状态，确保数据源完全初始化
    setTimeout(() => {
      this.updateBottomStatus();
      console.log('组件初始化完成，是否到达底部:', this.hasReachedBottom);
    }, 100);
  }

  // 新增：统一更新底部状态的方法
  private updateBottomStatus() {
    if (this.isSearchMode) {
      // 搜索模式下，底部状态由搜索结果数量决定
      this.hasReachedBottom = this.sortedSearchResults.length > 0;
    } else {
      // 正常模式下，检查是否还有更多数据
      const canLoadMore = this.goodsListData.canLoadMore();
      this.hasReachedBottom = !canLoadMore;
      console.log(`底部状态更新: canLoadMore=${canLoadMore}, hasReachedBottom=${this.hasReachedBottom}`);
    }
  }

  // 监听数据源变化，更新底部状态
  aboutToUpdate() {
    this.updateBottomStatus();
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

  // 新增：处理搜索
  private handleSearch(keyword: string) {
    console.log('=== GoodsListComponent.handleSearch ===');
    console.log('搜索关键词:', keyword);
    console.log('当前分类:', this.category);
    
    this.searchKeyword = keyword;
    this.isSearchMode = keyword.trim().length > 0;
    
    if (this.isSearchMode) {
      // 搜索模式下，禁用懒加载
      this.useLazyLoad = false;
      
      // 执行搜索
      this.searchResults = searchGoodsByKeyword(this.category, keyword.trim());
      console.log('搜索结果数量:', this.searchResults.length);
      
      // 应用当前排序
      if (this.searchResults.length > 0) {
        this.sortedSearchResults = sortGoodsList(this.searchResults, this.currentSortType, this.currentPriceFilter || undefined);
        console.log('排序后搜索结果数量:', this.sortedSearchResults.length);
      } else {
        this.sortedSearchResults = [];
      }
    } else {
      // 非搜索模式，恢复懒加载
      this.useLazyLoad = true;
      // 清空搜索结果
      this.searchResults = [];
      this.sortedSearchResults = [];
    }
    
    // 更新底部状态
    this.updateBottomStatus();
    
    console.log('搜索模式:', this.isSearchMode);
    console.log('懒加载状态:', this.useLazyLoad);
    console.log('=== handleSearch 完成 ===\n');
  }

  /**
   * 构建单个商品项
   */
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

  // 新增：处理排序选择
  private handleSortSelect(sortType: SortType, priceFilter?: PriceRangeFilter) {
    console.log('========================================');
    console.log('=== GoodsListComponent.handleSortSelect ===');
    console.log(`选择的排序类型: ${sortType}`);
    console.log(`当前排序类型: ${this.currentSortType}`);
    console.log(`是否为搜索模式: ${this.isSearchMode}`);
    console.log(`当前分类: ${this.category}`);
    
    this.currentSortType = sortType;
    
    // 如果是价格区间筛选，保存筛选条件
    if (sortType === SortType.PRICE_RANGE && priceFilter) {
      this.currentPriceFilter = priceFilter;
      console.log(`价格区间筛选条件: ¥${priceFilter.minPrice} - ¥${priceFilter.maxPrice}`);
    } else {
      // 其他排序方式清除价格筛选条件
      this.currentPriceFilter = null;
    }
    
    // 保存排序类型
    saveSortType(sortType);
    console.log('排序类型已保存到本地存储');
    
    if (this.isSearchMode) {
      // 搜索模式下，对搜索结果进行排序
      console.log('搜索模式：对搜索结果进行排序');
      console.log(`搜索结果数量: ${this.searchResults.length}`);
      
      if (this.searchResults.length > 0) {
        console.log('开始排序搜索结果...');
        this.sortedSearchResults = sortGoodsList(this.searchResults, sortType, priceFilter);
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
      
      this.goodsListData.setSortType(sortType, priceFilter);
      
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
    
    // 更新底部状态
    this.updateBottomStatus();
    
    console.log('=== handleSortSelect 完成 ===');
    console.log('========================================\n');
  }

  // 新增：打开排序弹窗
  private openSortDialog() {
    this.showSortDialog = true;
  }

  // 新增：关闭排序弹窗
  private closeSortDialog() {
    this.showSortDialog = false;
  }

  // 新增：处理触摸事件
  private handleTouch(event?: TouchEvent) {
    // 搜索模式下或懒加载禁用时禁用触摸事件处理
    if (this.isSearchMode || !this.useLazyLoad) {
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
        // 判断是否向上滑动且接近底部，如果是则加载更多数据
        if (this.startTouchOffsetY - this.endTouchOffsetY > 100 && !this.isLoading && this.useLazyLoad) {
          // 先检查是否还有更多数据可以加载
          if (this.goodsListData.canLoadMore()) {
            console.log('可以加载更多数据，开始加载...');
            this.isLoading = true;
            this.goodsListData.pushData();
            setTimeout(() => {
              this.isLoading = false;
              // 检查加载后是否还有更多数据
              this.updateBottomStatus();
              console.log('加载完成，是否到达底部:', this.hasReachedBottom);
            }, 500);
          } else {
            console.log('没有更多数据可以加载，已到达底部');
            this.updateBottomStatus();
          }
        }
        // 判断是否下拉刷新
        if (this.endTouchOffsetY - this.startTouchOffsetY > 100 && !this.isRefreshing) {
          this.handleRefresh();
        }
        break;
    }
  }

  build() {
    // 整体容器 - 垂直布局
    Column() {
      // 搜索框和排序按钮区域
      Row() {
        // 搜索框
        TextInput({ placeholder: '搜索商品...' })
          .type(InputType.Normal)
          .width('70%')
          .height(40)
          .fontSize(14)
          .backgroundColor('#F5F5F5')
          .onChange((value: string) => {
            this.handleSearch(value);
          })
          .onSubmit(() => {
            // 回车搜索
            this.handleSearch(this.searchKeyword);
          })

        // 排序按钮
        Button('排序')
          .fontSize(14)
          .fontColor(Color.White)
          .backgroundColor('#007DFF')
          .height(40)
          .width('25%')
          .margin({ left: 10 })
          .onClick(() => {
            this.openSortDialog();
          })
      }
      .width('100%')
      .padding({ left: 16, right: 16, top: 8, bottom: 8 })
      .justifyContent(FlexAlign.SpaceBetween)

      // 商品列表容器
      List({ space: commonConst.LIST_ITEM_SPACE }) {
        // 刷新提示放在列表顶部
        if (this.isRefreshing) {
          ListItem() {
            Row() {
              // 刷新图标
              Image($r('app.media.refreshing'))
                .width(commonConst.ICON_WIDTH)
                .height(commonConst.ICON_HEIGHT)
                .alignSelf(ItemAlign.Center)
              // 刷新状态文本
              Text('正在刷新...')
                .fontSize(commonConst.NORMAL_FONT_SIZE)
                .fontColor($r('app.color.deepGray'))
                .textAlign(TextAlign.Center)
                .width('100%')
            }
            .width('100%')
            .height(60)
            .justifyContent(FlexAlign.Center)
          }
        }

        // 条件渲染：根据搜索模式显示不同的内容
        if (this.isSearchMode) {
          // 搜索模式下显示搜索结果
          if (this.sortedSearchResults.length > 0) {
            ForEach(this.sortedSearchResults, (item: GoodsListItemType) => {
              ListItem() {
                this.buildGoodsItem(item)
              }
            }, (item: GoodsListItemType) => item.id.toString())
          } else {
            // 搜索结果为空时的提示
            ListItem() {
              Column() {
                Text('没有找到相关商品')
                  .fontSize(commonConst.NORMAL_FONT_SIZE)
                  .fontColor($r('app.color.gray'))
              }
              .width('100%')
              .height(100)
              .justifyContent(FlexAlign.Center)
            }
          }
        } else {
          // 正常模式下使用懒加载方式渲染列表项
          LazyForEach(this.goodsListData, (item: GoodsListItemType, index: number) => {
            ListItem() {
              this.buildGoodsItem(item)
            }
          }, (item: GoodsListItemType) => item.id.toString())
        }

        // 加载更多提示放在列表底部
        ListItem() {
          Column() {
            if (this.isLoading) {
              Text('正在加载更多...')
                .fontSize(commonConst.NORMAL_FONT_SIZE)
                .fontColor($r('app.color.deepGray'))
                .textAlign(TextAlign.Center)
                .width('100%')
            } else if (this.hasReachedBottom) {
              Text($r('app.string.to_bottom'))
                .fontSize(commonConst.NORMAL_FONT_SIZE)
                .fontColor($r('app.color.deepGray'))
                .textAlign(TextAlign.Center)
                .width('100%')
            } else {
              Text('滑动加载更多')
                .fontSize(commonConst.NORMAL_FONT_SIZE)
                .fontColor($r('app.color.gray'))
                .textAlign(TextAlign.Center)
                .width('100%')
            }
          }
          .width('100%')
          .height(80)
          .justifyContent(FlexAlign.Center)
        }
      }
      .width('100%')
      .height('100%')
      .edgeEffect(EdgeEffect.Spring) // 使用弹簧效果
      .backgroundColor($r('app.color.primaryBgColor'))

      // 排序弹窗
      if (this.showSortDialog) {
        SortDialog({
          isVisible: this.showSortDialog,
          currentSort: this.currentSortType,
          currentPriceFilter: this.currentPriceFilter,
          onSortSelected: (sortType: SortType, priceFilter?: PriceRangeFilter) => {
            this.handleSortSelect(sortType, priceFilter);
            this.closeSortDialog();
          },
          onClose: () => {
            this.closeSortDialog();
          }
        })
      }
    }
    .width('100%')
    .height('100%')
    // 处理触摸事件（仅在非搜索模式下）
    .onTouch((event?: TouchEvent) => {
      this.handleTouch(event);
    })
  }
}