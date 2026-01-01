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

import { initTabBarData, CATEGORIES, GoodsListItemType } from '../viewmodel/InitialData';
import { searchGoodsByKeyword } from '../viewmodel/SearchUtils';
import {
  LAYOUT_WIDTH_OR_HEIGHT,
  NORMAL_FONT_SIZE,
  BIGGER_FONT_SIZE,
  MAX_FONT_SIZE,
  MAX_OFFSET_Y,
  REFRESH_TIME,
  GOODS_EVALUATE_FONT_SIZE,
  MAX_LINES_TEXT
} from '../common/CommonConstants';
import GoodsList from './GoodsListComponent';
import SearchBox from './SearchBoxComponent';

/**
 * 标签页组件
 * 实现商品分类标签切换功能
 * 支持下拉刷新和页面切换
 */
@Component
export default struct TabBar {
  // 记录当前触摸点Y坐标
  private currentOffsetY: number = 0;
  // 刷新定时器
  private timer: number = 0;
  // 当前标签页索引
  @State tabsIndex: number = 0;
  // 刷新状态标识
  @State refreshStatus: boolean = false;
  // 刷新文本
  @State refreshText: Resource = $r('app.string.refresh_text');
  // 下拉偏移量
  @State pullDownOffset: number = 0;
  // 标签页数据
  @State tabData: Resource[] = [];

  // 分类列表
  private categoryList: string[] = [
    CATEGORIES.SELECTED,
    CATEGORIES.MOBILE_PHONE,
    CATEGORIES.CLOTHES,
    CATEGORIES.WEAR,
    CATEGORIES.HOME_FURNISHING
  ];

  // 搜索关键词
  @State searchKeyword: string = '';
  // 是否显示搜索结果
  @State isSearchMode: boolean = false;
  // 搜索结果商品列表
  @State searchResults: GoodsListItemType[] = [];

  aboutToAppear() {
    // 初始化标签数据
    this.tabData = initTabBarData();
  }

  /**
   * 构建第一个标签页（默认选中标签）
   * 根据当前标签页索引调整字体大小和颜色
   */
  @Builder
  firstTabBar() {
    Column() {
      Text($r('app.string.selected'))
      // 根据是否选中调整字体大小
        .fontSize(this.tabsIndex === 0 ? BIGGER_FONT_SIZE : NORMAL_FONT_SIZE)
        // 根据是否选中调整字体颜色
        .fontColor(this.tabsIndex === 0 ? Color.Black : $r('app.color.gray'))
        .maxLines(MAX_LINES_TEXT)
        .minFontSize(this.tabsIndex === 0 ? NORMAL_FONT_SIZE : GOODS_EVALUATE_FONT_SIZE)
        .maxFontSize(this.tabsIndex === 0 ? BIGGER_FONT_SIZE : NORMAL_FONT_SIZE)
    }
    .width(LAYOUT_WIDTH_OR_HEIGHT)
    .height(LAYOUT_WIDTH_OR_HEIGHT)
    .justifyContent(FlexAlign.Center)
  }

  /**
   * 构建其他标签页
   * @param content 标签页内容
   * @param index 标签页索引
   */
  @Builder
  otherTabBar(content: Resource, index: number) {
    Column() {
      Text(content)
      // 根据是否选中调整字体大小
        .fontSize(this.tabsIndex === index + 1 ? BIGGER_FONT_SIZE : NORMAL_FONT_SIZE)
        // 根据是否选中调整字体颜色
        .fontColor(this.tabsIndex === index + 1 ? Color.Black : $r('app.color.gray'))
        .maxLines(MAX_LINES_TEXT)
        .minFontSize(this.tabsIndex === index + 1 ? NORMAL_FONT_SIZE : GOODS_EVALUATE_FONT_SIZE)
        .maxFontSize(this.tabsIndex === index + 1 ? BIGGER_FONT_SIZE : NORMAL_FONT_SIZE)
    }
    .width(LAYOUT_WIDTH_OR_HEIGHT)
    .height(LAYOUT_WIDTH_OR_HEIGHT)
    .justifyContent(FlexAlign.Center)
  }

  /**
   * 构建下拉刷新组件
   */
  @Builder
  buildRefreshView() {
    Column() {
      Row() {
        Image($r('app.media.refreshing'))
          .width(40)
          .height(40)
          .margin({ right: 20 })
        Text(this.refreshText)
          .fontSize(NORMAL_FONT_SIZE)
          .fontColor($r('app.color.gray'))
      }
      .justifyContent(FlexAlign.Center)
      .width('100%')
      .height(60)
      .backgroundColor($r('app.color.white'))
    }
    .width('100%')
    .height(60)
    .offset({ y: this.pullDownOffset })
  }

  /**
   * 处理下拉刷新逻辑
   * @param event 触摸事件
   */
  putDownRefresh(event?: TouchEvent): void {
    // 如果处于搜索模式，不处理下拉刷新
    if (this.isSearchMode) {
      return;
    }

    if (event === undefined) {
      return;
    }
    switch (event.type) {
      // 记录手指按下的y坐标
      case TouchType.Down:
        this.currentOffsetY = event.touches[0].y;
        break;
      case TouchType.Move:
        const moveY = event.touches[0].y;
        const deltaY = moveY - this.currentOffsetY;

        // 如果是向下滑动
        if (deltaY > 0) {
          this.pullDownOffset = Math.min(deltaY, MAX_OFFSET_Y);
          // 当下拉距离超过阈值时，显示刷新状态
          if (deltaY > MAX_OFFSET_Y) {
            this.refreshStatus = true;
          }
        }
        break;
      case TouchType.Up:
        // 如果已经触发刷新状态
        if (this.refreshStatus) {
          this.refreshText = $r('app.string.refresh_text');
          // 模拟刷新效果，不实际请求数据
          this.timer = setTimeout(() => {
            this.refreshStatus = false;
            this.pullDownOffset = 0;
            this.refreshText = $r('app.string.refresh_text');
          }, REFRESH_TIME);
        } else {
          // 未触发刷新，回弹
          this.pullDownOffset = 0;
        }
        break;
    }
  }

  /**
   * 处理搜索
   */
  private handleSearch(keyword: string) {
    this.searchKeyword = keyword;
    this.isSearchMode = keyword.length > 0;
    
    // 根据当前分类进行搜索
    const currentCategory = this.getCategoryByIndex(this.tabsIndex);
    
    if (this.isSearchMode) {
      // 使用搜索功能
      this.searchResults = searchGoodsByKeyword(currentCategory, keyword);
    } else {
      // 清空搜索结果
      this.searchResults = [];
    }
    
    console.log('搜索关键词:', keyword, '分类:', currentCategory, '结果数量:', this.searchResults.length);
  }

  /**
   * 根据索引获取分类
   * @param index 索引
   * @returns 分类名称
   */
  private getCategoryByIndex(index: number): string {
    if (index >= 0 && index < this.categoryList.length) {
      return this.categoryList[index];
    }
    return CATEGORIES.SELECTED;
  }

  /**
   * 组件销毁前清理工作
   * 清除刷新定时器
   */
  aboutToDisappear() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  build() {
    Column() {
      // 搜索框
      SearchBox({
        callback: {
          onSearch: (keyword: string): void => this.handleSearch(keyword)
        },
        placeholder: '搜索商品...'
      })

      // 标签页容器
      Tabs() {
        // 第一个标签内容（商品列表页）
        TabContent() {
          // 使用Column包裹以便实现下拉刷新
          Column() {
            // 下拉刷新区域（仅在非搜索模式下显示）
            if (!this.isSearchMode && (this.refreshStatus || this.pullDownOffset > 0)) {
              this.buildRefreshView()
            }

            // 商品列表组件（精选页）
            GoodsList({ 
              category: this.getCategoryByIndex(0),
              searchResults: this.searchResults,
              isSearchMode: this.isSearchMode
            })
          }
          .width('100%')
          .height('100%')
          // 监听触摸事件处理下拉刷新
          .onTouch((event?: TouchEvent) => {
            this.putDownRefresh(event);
          })
        }
        .tabBar(this.firstTabBar) // 设置标签栏

        // 循环创建其他标签页
        ForEach(this.tabData, (item: Resource, index: number) => {
          TabContent() {
            Column() {
              // 商品列表组件（其他分类页）
              // 使用索引+1来对应分类数组中的位置
              GoodsList({ 
                category: this.getCategoryByIndex(index + 1),
                searchResults: this.searchResults,
                isSearchMode: this.isSearchMode
              })
            }
            .width('100%')
            .height('100%')
          }
          .tabBar(this.otherTabBar(item, index))
        })
      }
      // 标签页切换回调
      .onChange((index: number) => {
        this.tabsIndex = index;
        
        // 切换标签页时重置搜索状态
        this.searchKeyword = '';
        this.isSearchMode = false;
        this.searchResults = [];
        
        console.log('切换到标签页:', index);
      })
      .vertical(false) // 水平排列标签页
      .barMode(BarMode.Fixed) // 固定标签栏
      .barHeight(60) // 标签栏高度
      .width('100%')
      .height('100%')
    }
  }
}