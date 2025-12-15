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

// 商品列表项类型
export interface GoodsListItemType {
  id: number;
  goodsName: ResourceStr;
  price: ResourceStr;
  goodsImg: Resource;
  advertisingLanguage: ResourceStr;
  evaluate: ResourceStr;
}

// 初始化标签栏数据
export function initTabBarData(): Resource[] {
  return [
    $r('app.string.mobile_phone'),
    $r('app.string.clothes'),
    $r('app.string.wear'),
    $r('app.string.home_furnishing')
  ];
}

// 初始化商品数据
export function initGoodsData(): GoodsListItemType[] {
  const goodsList: GoodsListItemType[] = [];
  
  // 生成20个初始商品
  for (let i = 1; i <= 20; i++) {
    const imageIndex = (i % 4) + 1;
    goodsList.push({
      id: i,
      goodsName: i % 2 === 0 ? $r('app.string.goodsName') : $r('app.string.another_goodsName'),
      price: getPriceByIndex(i),
      goodsImg: getImageByIndex(imageIndex),
      advertisingLanguage: $r('app.string.advertising_language'),
      evaluate: $r('app.string.evaluate')
    });
  }
  
  return goodsList;
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