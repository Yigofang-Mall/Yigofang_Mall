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
    category: number;
}
// 初始化标签栏数据
export function initTabBarData(): Resource[] {
    return [
        { "id": 16777228, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
        { "id": 16777223, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
        { "id": 16777237, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
        { "id": 16777227, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" }
    ];
}
// 初始化商品数据
export function initGoodsData(): GoodsListItemType[] {
    const goodsList: GoodsListItemType[] = [];
    // 生成5个初始商品
    const categories = 4; // 总分类数
    for (let i = 1; i <= 5; i++) {
        const imageIndex = (i % 4) + 1;
        const categoryId = (i % categories) + 1; // 分配商品到不同分类
        goodsList.push({
            id: i,
            category: categoryId,
            goodsName: i % 2 === 0 ? { "id": 16777226, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" } : { "id": 16777222, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
            price: getPriceByIndex(i),
            goodsImg: getImageByIndex(imageIndex),
            advertisingLanguage: { "id": 16777221, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
            evaluate: { "id": 16777225, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" }
        });
    }
    return goodsList;
}
// 根据索引获取价格
function getPriceByIndex(index: number): ResourceStr {
    const prices = [
        { "id": 16777229, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
        { "id": 16777230, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
        { "id": 16777231, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
        { "id": 16777232, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" }
    ];
    return prices[index % 4];
}
// 根据索引获取图片
function getImageByIndex(index: number): Resource {
    const images = [
        { "id": 16777238, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
        { "id": 16777245, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
        { "id": 16777248, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
        { "id": 16777246, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" }
    ];
    return images[index % 4];
}
