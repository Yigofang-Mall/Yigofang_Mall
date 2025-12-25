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

import { GoodsListItemType, initGoodsData, initMobilePhoneGoodsData, initClothesGoodsData, initWearGoodsData, initHomeFurnishingGoodsData, shuffleArray } from './InitialData';
import { MAX_DATA_LENGTH, MAGNIFICATION } from '../common/CommonConstants';

/**
 * List数据源类，用于LazyForEach懒加载
 */
export class ListDataSource implements IDataSource {
  private listeners: DataChangeListener[] = [];
  private dataArray: GoodsListItemType[] = [];
  private categoryId: number;
  private currentIndex: number;

  constructor(categoryId: number) {
    this.categoryId = categoryId;
    // 根据分类ID选择对应的初始化函数
    let initData: GoodsListItemType[] = [];
    switch (this.categoryId) {
      case 1:
        initData = initMobilePhoneGoodsData();
        break;
      case 2:
        initData = initClothesGoodsData();
        break;
      case 3:
        initData = initWearGoodsData();
        break;
      case 4:
        initData = initHomeFurnishingGoodsData();
        break;
      default:
        initData = initGoodsData();
    }
    
    // initData已经通过getNextGoodsId()设置了全局唯一ID，这里不需要再修改
    this.dataArray = shuffleArray(initData); // 随机打乱初始数据顺序
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
      
      // 根据分类ID调用对应的初始化函数获取新数据
      let moreData: GoodsListItemType[] = [];
      switch (this.categoryId) {
        case 1:
          moreData = initMobilePhoneGoodsData();
          break;
        case 2:
          moreData = initClothesGoodsData();
          break;
        case 3:
          moreData = initWearGoodsData();
          break;
        case 4:
          moreData = initHomeFurnishingGoodsData();
          break;
        default:
          moreData = initGoodsData();
      }

      
      // 限制每次加载的数量
      const limitedData = moreData.slice(0, 5);
      // 随机打乱加载更多的数据顺序
      const shuffledData = shuffleArray(limitedData);
      
      if (shuffledData.length > 0) {
        const startIndex = this.dataArray.length;
        this.dataArray.push(...shuffledData);
        this.currentIndex += shuffledData.length;
        
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
  refreshData(newData: GoodsListItemType[]): void {
    this.dataArray = newData;
    // 模拟网络延迟
    setTimeout(() => {
      // 根据分类ID选择对应的初始化函数进行刷新
      switch (this.categoryId) {
        case 0:
          this.dataArray = shuffleArray(initGoodsData());
          break;
        case 1:
          this.dataArray = shuffleArray(initMobilePhoneGoodsData());
          break;
        case 2:
          this.dataArray = shuffleArray(initClothesGoodsData());
          break;
        case 3:
          this.dataArray = shuffleArray(initWearGoodsData());
          break;
        case 4:
          this.dataArray = shuffleArray(initHomeFurnishingGoodsData());
          break;
        default:
          this.dataArray = shuffleArray(initGoodsData());
      }
      
      // 刷新后的数据已经通过init*GoodsData()函数设置了全局唯一ID，这里不需要再修改
      this.currentIndex = this.dataArray.length;
      
      // 通知数据刷新
      this.listeners.forEach(listener => {
        listener.onDataReloaded?.();
      });
    }, 1000);
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

// 根据索引获取图片
function getImageByIndex(index: number): Resource {
  const images = [
    $r('app.media.goodsImg'),
    $r('app.media.goodsImg_2'),
    $r('app.media.goodsImg_3'),
    $r('app.media.goodsImg_4')
  ];
  return images[index % 4];
}