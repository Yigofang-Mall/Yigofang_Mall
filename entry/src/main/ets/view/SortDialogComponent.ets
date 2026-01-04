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
  PRICE_HIGH_TO_LOW = 'price_desc', // 价格从高到低
  PRICE_RANGE = 'price_range'   // 价格区间筛选
}

/**
 * 价格区间筛选条件
 */
export interface PriceRangeFilter {
  minPrice: number;  // 最低价格
  maxPrice: number;  // 最高价格
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
  // 当前价格筛选条件
  @Prop currentPriceFilter: PriceRangeFilter | null = null;
  // 排序选择回调
  onSortSelected?: (sortType: SortType, priceFilter?: PriceRangeFilter) => void;
  // 关闭弹窗回调
  onClose?: () => void;

  // 价格区间筛选状态
  @State minPrice: string = '';
  @State maxPrice: string = '';
  // 是否在编辑价格区间
  @State isEditingPriceRange: boolean = false;

  aboutToAppear() {
    // 当当前排序是价格区间筛选时，初始化编辑状态
    this.isEditingPriceRange = this.currentSort === SortType.PRICE_RANGE;
    
    // 如果有现有的价格筛选条件，填充输入框
    if (this.currentPriceFilter) {
      this.minPrice = this.currentPriceFilter.minPrice.toString();
      this.maxPrice = this.currentPriceFilter.maxPrice.toString();
    }
  }

  /**
   * 处理排序选择
   */
  private handleSortSelect(sortType: SortType) {
    if (sortType === SortType.PRICE_RANGE) {
      // 价格区间筛选需要输入价格范围
      if (this.currentSort !== SortType.PRICE_RANGE) {
        // 首次点击价格区间筛选，展开编辑界面
        this.isEditingPriceRange = true;
        console.log('展开价格区间筛选编辑界面');
      } else {
        // 如果已经在编辑价格区间，则切换编辑状态
        this.isEditingPriceRange = !this.isEditingPriceRange;
        console.log('切换价格区间筛选编辑状态:', this.isEditingPriceRange);
      }
      return;
    }

    // 其他排序方式，重置价格区间编辑状态
    this.resetEditingState();

    if (this.onSortSelected) {
      this.onSortSelected(sortType);
    }
  }

  /**
   * 处理价格区间筛选确认
   */
  private handlePriceRangeConfirm() {
    const minPrice = parseFloat(this.minPrice);
    const maxPrice = parseFloat(this.maxPrice);

    // 验证输入
    if (isNaN(minPrice) || isNaN(maxPrice)) {
      console.error('价格输入无效');
      return;
    }

    if (minPrice < 0 || maxPrice < 0) {
      console.error('价格不能为负数');
      return;
    }

    if (minPrice > maxPrice) {
      console.error('最低价格不能大于最高价格');
      return;
    }

    const priceFilter: PriceRangeFilter = {
      minPrice: minPrice,
      maxPrice: maxPrice
    };

    if (this.onSortSelected) {
      this.onSortSelected(SortType.PRICE_RANGE, priceFilter);
    }
  }

  /**
   * 重置价格区间输入
   */
  private handlePriceRangeReset() {
    this.minPrice = '';
    this.maxPrice = '';
    this.isEditingPriceRange = false;
  }

  /**
   * 重置编辑状态
   */
  private resetEditingState() {
    this.isEditingPriceRange = false;
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

  /**
   * 构建价格区间筛选项
   */
  @Builder
  buildPriceRangeItem() {
    Column({ space: 16 }) {
      // 价格区间标题
      Row() {
        Text('价格区间筛选')
          .fontSize(NORMAL_FONT_SIZE)
          .fontColor(this.currentSort === SortType.PRICE_RANGE || this.isEditingPriceRange ? Color.Blue : Color.Black)
          .fontWeight(this.currentSort === SortType.PRICE_RANGE || this.isEditingPriceRange ? FontWeight.Medium : FontWeight.Normal)
        
        if (this.currentSort === SortType.PRICE_RANGE || this.isEditingPriceRange) {
          Text('✓')
            .fontSize(NORMAL_FONT_SIZE)
            .fontColor(Color.Blue)
            .margin({ left: 8 })
        }
      }
      .width('100%')
      .justifyContent(FlexAlign.SpaceBetween)
      .alignItems(VerticalAlign.Center)

      // 价格输入区域
      Row({ space: 12 }) {
        // 最低价输入
        Column() {
          Text('最低价')
            .fontSize(12)
            .fontColor('#666666')
            .margin({ bottom: 4 })
          
          TextInput({ placeholder: '输入最低价', text: this.minPrice })
            .type(InputType.Number)
            .fontSize(14)
            .backgroundColor('#F5F5F5')
            .height(36)
            .onChange((value: string) => {
              this.minPrice = value;
            })
        }
        .layoutWeight(1)

        Text('—')
          .fontSize(14)
          .fontColor('#666666')
          .alignSelf(ItemAlign.Center)

        // 最高价输入
        Column() {
          Text('最高价')
            .fontSize(12)
            .fontColor('#666666')
            .margin({ bottom: 4 })
          
          TextInput({ placeholder: '输入最高价', text: this.maxPrice })
            .type(InputType.Number)
            .fontSize(14)
            .backgroundColor('#F5F5F5')
            .height(36)
            .onChange((value: string) => {
              this.maxPrice = value;
            })
        }
        .layoutWeight(1)
      }
      .width('100%')

      // 确认和重置按钮
      Row({ space: 12 }) {
        Button('重置')
          .fontSize(12)
          .fontColor('#007DFF')
          .backgroundColor('#E6F4FF')
          .height(32)
          .layoutWeight(1)
          .onClick(() => {
            this.handlePriceRangeReset();
          })

        Button('确认筛选')
          .fontSize(12)
          .fontColor(Color.White)
          .backgroundColor('#007DFF')
          .height(32)
          .layoutWeight(1)
          .onClick(() => {
            this.handlePriceRangeConfirm();
          })
      }
      .width('100%')

      // 显示当前筛选条件
      if (this.currentPriceFilter && this.currentSort === SortType.PRICE_RANGE) {
        Text(`当前筛选: ¥${this.currentPriceFilter.minPrice} - ¥${this.currentPriceFilter.maxPrice}`)
          .fontSize(12)
          .fontColor('#007DFF')
          .backgroundColor('#F0F8FF')
          .padding({ top: 8, bottom: 8, left: 12, right: 12 })
          .borderRadius(4)
      }
    }
    .width('100%')
    .padding({ left: 20, right: 20, top: 16, bottom: 16 })
    .backgroundColor(this.currentSort === SortType.PRICE_RANGE || this.isEditingPriceRange ? '#F0F8FF' : Color.White)
    .borderRadius(8)
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
            Divider()
              .color('#F5F5F5')
              .strokeWidth(1)
              .margin({ left: 20, right: 20 })

            // 价格区间筛选项
            this.buildPriceRangeItem()
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

