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

import { GoodsListItemType, getRefreshedGoodsByCategory, CATEGORIES } from './InitialData';
import { searchGoodsByKeyword } from './SearchUtils';
import { MAX_DATA_LENGTH, MAGNIFICATION } from '../common/CommonConstants';

/**
 * List数据源类，用于LazyForEach懒加载
 */
export class ListDataSource implements IDataSource {
  private listeners: DataChangeListener[] = [];
  private dataArray: GoodsListItemType[] = [];
  private currentIndex: number = 0;
  private category: string = CATEGORIES.SELECTED;

  constructor(category: string = CATEGORIES.SELECTED) {
    this.category = category;
    // 初始化数据
    this.dataArray = getRefreshedGoodsByCategory(category);
    this.currentIndex = this.dataArray.length;
  }

  totalCount(): number {
    return MAX_DATA_LENGTH;
  }

  getData(index: number): GoodsListItemType {
    // 如果索引超出当前数据范围，预加载更多数据
    if (index >= this.dataArray.length - 6 && this.dataArray.length < MAX_DATA_LENGTH) {
      this.pushData();
    }

    // 如果索引有效，返回数据，否则返回最后一个数据
    return index < this.dataArray.length ? this.dataArray[index] : this.dataArray[this.dataArray.length - 1];
  }

  registerDataChangeListener(listener: DataChangeListener): void {
    this.listeners.push(listener);
  }

  unregisterDataChangeListener(listener: DataChangeListener): void {
    const index = this.listeners.indexOf(listener);
    if (index >= 0) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * 推送更多数据（加载更多）
   */
  pushData(): void {
    // 模拟网络延迟
    setTimeout(() => {
      const newData: GoodsListItemType[] = [];
      const startId = this.currentIndex + 1;

      // 每次加载10个新商品
      for (let i = 0; i < 10 && this.dataArray.length < MAX_DATA_LENGTH; i++) {
        const id = startId + i;
        const imageIndex = id % 4; // 0-3，刚好匹配每个分类的4张图片
        let goodsName: string = $r('app.string.goodsName').toString();
        let price: ResourceStr = getPriceByIndex(id);

        // 根据当前分类，匹配对应分类的【专属商品名称+专属价格】
        switch (this.category) {
          case CATEGORIES.MOBILE_PHONE:
            goodsName = $r(`app.string.goods_name_phone_${imageIndex + 1}`).toString();
            price = $r(`app.string.goods_price_phone_${imageIndex + 1}`);
            break;
          case CATEGORIES.CLOTHES:
            goodsName = $r(`app.string.goods_name_clothes_${imageIndex + 1}`).toString();
            price = $r(`app.string.goods_price_clothes_${imageIndex + 1}`);
            break;
          case CATEGORIES.WEAR:
            goodsName = $r(`app.string.goods_name_wear_${imageIndex + 1}`).toString();
            price = $r(`app.string.goods_price_wear_${imageIndex + 1}`);
            break;
          case CATEGORIES.HOME_FURNISHING:
            goodsName = $r(`app.string.goods_name_home_${imageIndex + 1}`).toString();
            price = $r(`app.string.goods_price_home_${imageIndex + 1}`);
            break;
          default:
          // 默认分类用原来的通用名称
            goodsName = (id % 2 === 0 ? $r('app.string.goodsName') : $r('app.string.another_goodsName')).toString();
            break;
        }



        newData.push({
          id: id,
          goodsName: goodsName,
          price: price,
          goodsImg: getImageByCategoryAndIndex(this.category, imageIndex), // 用分类专属图片
          advertisingLanguage: $r('app.string.advertising_language'),
          evaluate: $r('app.string.evaluate'),
          category: this.category
        });
      }

      if (newData.length > 0) {
        const startIndex = this.dataArray.length;
        this.dataArray.push(...newData);
        this.currentIndex += newData.length;

        // 通知数据变化
        this.listeners.forEach(listener => {
          listener.onDataAdd?.(startIndex);
          listener.onDataReloaded?.();
        });
      }
    }, 500);
  }

  /**
   * 刷新数据
   */
  refreshData(): void {
    // 模拟网络延迟
    setTimeout(() => {
      this.dataArray = getRefreshedGoodsByCategory(this.category);
      this.currentIndex = this.dataArray.length;

      // 通知数据刷新
      this.listeners.forEach(listener => {
        listener.onDataReloaded?.();
      });
    }, 1000);
  }

  /**
   * 设置分类
   */
  setCategory(category: string): void {
    if (this.category !== category) {
      this.category = category;
      this.dataArray = getRefreshedGoodsByCategory(category);
      this.currentIndex = this.dataArray.length;

      // 通知数据刷新
      this.listeners.forEach(listener => {
        listener.onDataReloaded?.();
      });
    }
  }

  /**
   * 搜索商品
   */
  searchGoods(keyword: string): void {
    if (keyword.trim() === '') {
      // 如果搜索关键词为空，显示当前分类的所有商品
      this.dataArray = getRefreshedGoodsByCategory(this.category);
    } else {
      // 根据关键词搜索商品
      this.dataArray = searchGoodsByKeyword(this.category, keyword.trim());
    }
    this.currentIndex = this.dataArray.length;

    // 通知数据刷新
    this.listeners.forEach(listener => {
      listener.onDataReloaded?.();
    });
  }
}

// 根据索引获取价格
function getPriceByIndex(index: number): ResourceStr {
  const prices = [
    $r('app.string.price_199'),
    $r('app.string.price_265'),
    $r('app.string.price_810'),
    $r('app.string.price_999')
  ];
  return prices[index % 4];
}

// 根据获取图片
function getImageByCategoryAndIndex(category: string, index: number): Resource {
  const imageIndex = (index % 4) + 1;

  switch (category) {
    case CATEGORIES.SELECTED:
      return getSelectedImage(imageIndex);
    case CATEGORIES.MOBILE_PHONE:
      return getPhoneImage(imageIndex);
    case CATEGORIES.CLOTHES:
      return getClothesImage(imageIndex);
    case CATEGORIES.WEAR:
      return getWearImage(imageIndex);
    case CATEGORIES.HOME_FURNISHING:
      return getHomeImage(imageIndex);
    default:
      return $r('app.media.goodsImg');
  }
}

// 定义每个分类的图片获取函数
function getSelectedImage(index: number): Resource {
  switch (index) {
    case 1: return $r('app.media.goodsImg');
    case 2: return $r('app.media.goodsImg_2');
    case 3: return $r('app.media.goodsImg_3');
    case 4: return $r('app.media.goodsImg_4');
    default: return $r('app.media.goodsImg');
  }
}

function getPhoneImage(index: number): Resource {
  switch (index) {
    case 1: return $r('app.media.phone1');
    case 2: return $r('app.media.phone2');
    case 3: return $r('app.media.phone3');
    case 4: return $r('app.media.phone4');
    default: return $r('app.media.phone1');
  }
}
function getClothesImage(index: number): Resource {
  switch (index) {
    case 1: return $r('app.media.clothes1');
    case 2: return $r('app.media.clothes2');
    case 3: return $r('app.media.clothes3');
    case 4: return $r('app.media.clothes4');
    default: return $r('app.media.clothes1');
  }
}
function getWearImage(index: number): Resource {
  switch (index) {
    case 1: return $r('app.media.wear1');
    case 2: return $r('app.media.wear2');
    case 3: return $r('app.media.wear3');
    case 4: return $r('app.media.wear4');
    default: return $r('app.media.wear1');
  }
}
function getHomeImage(index: number): Resource {
  switch (index) {
    case 1: return $r('app.media.home1');
    case 2: return $r('app.media.home2');
    case 3: return $r('app.media.home3');
    case 4: return $r('app.media.home4');
    default: return $r('app.media.home1');
  }
}

