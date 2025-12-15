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

import { GoodsListItemType, initGoodsData } from './InitialData';
import { MAX_DATA_LENGTH, MAGNIFICATION } from '../common/CommonConstants';

/**
 * List数据源类，用于LazyForEach懒加载
 */
export class ListDataSource implements IDataSource {
  private listeners: DataChangeListener[] = [];
  private dataArray: GoodsListItemType[] = [];
  private currentIndex: number = 0;

  constructor() {
    // 初始化数据
    this.dataArray = initGoodsData();
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
        const imageIndex = (id % 4);
        newData.push({
          id: id,
          goodsName: id % 2 === 0 ? $r('app.string.goodsName') : $r('app.string.another_goodsName'),
          price: getPriceByIndex(id),
          goodsImg: getImageByIndex(imageIndex),
          advertisingLanguage: $r('app.string.advertising_language'),
          evaluate: $r('app.string.evaluate')
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
      this.dataArray = initGoodsData();
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