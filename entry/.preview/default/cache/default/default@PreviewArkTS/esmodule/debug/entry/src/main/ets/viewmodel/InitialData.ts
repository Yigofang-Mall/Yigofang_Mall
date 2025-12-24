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
// 全局商品ID计数器
let globalGoodsIdCounter: number = 1;
// 获取唯一商品ID的辅助函数
export function getNextGoodsId(): number {
    return globalGoodsIdCounter++;
}
// 重置全局ID计数器（用于测试或特殊情况）
export function resetGoodsIdCounter(): void {
    globalGoodsIdCounter = 1;
}
// 随机打乱数组顺序的函数
export function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        let GeneratedDestructArray_1 = [newArray[j], newArray[i]];
        newArray[i] = GeneratedDestructArray_1[0];
        newArray[j] = GeneratedDestructArray_1[1];
    }
    return newArray;
}
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
// 初始化商品数据（通用）
export function initGoodsData(): GoodsListItemType[] {
    const goodsList: GoodsListItemType[] = [];
    // 生成5个初始商品
    for (let i = 1; i <= 5; i++) {
        const imageIndex = (i - 1 % 4) + 1;
        goodsList.push({
            id: getNextGoodsId(),
            category: 0,
            goodsName: i % 2 === 0 ? { "id": 16777226, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" } : { "id": 16777222, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
            price: getPriceByIndex(i),
            goodsImg: getImageByIndex(imageIndex),
            advertisingLanguage: { "id": 16777221, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
            evaluate: { "id": 16777225, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" }
        });
    }
    return goodsList;
}
// 初始化手机分类商品数据
export function initMobilePhoneGoodsData(): GoodsListItemType[] {
    const goodsList: GoodsListItemType[] = [];
    // 生成5个手机分类初始商品
    for (let i = 0; i < 4; i++) {
        const phoneId = getNextGoodsId();
        goodsList.push({
            id: phoneId,
            category: 1,
            goodsName: namePhone[phoneId % 4],
            price: pricePhone[phoneId % 4],
            goodsImg: getImageByIndexPhone(phoneId % 4),
            advertisingLanguage: { "id": 16777221, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
            evaluate: { "id": 16777225, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" }
        });
    }
    return goodsList;
}
const namePhone: ResourceStr[] = [
    "【新品上市 24期免息】vivo X300 Pro新品蔡司2亿APO超级长焦天玑9500拍照手机官方旗舰店官网正品",
    "【新品】HUAWEI Mate 80 麒麟9020芯片 第二代红枫影像 鸿蒙AI 华为直屏鸿蒙智能手机华为官方旗舰店",
    "【以旧换新至高补贴800】Apple/苹果 iPhone 17 Pro Max 手机 A19 Pro 芯片 2025 新款 全新未拆封 官方正品",
    "【至高24期分期免息】小米17 Pro手机新品上市小米徕卡联合研发小米官方旗舰店官网小米澎湃OS小米17pro",
];
const pricePhone: ResourceStr[] = ['4799', '5199', '9999', '4499'];
function getImageByIndexPhone(index: number): Resource {
    const images = [
        { "id": 16777267, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
        { "id": 16777264, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
        { "id": 16777265, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
        { "id": 16777266, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
    ];
    return images[index % 4];
}
// 初始化服装分类商品数据
export function initClothesGoodsData(): GoodsListItemType[] {
    const goodsList: GoodsListItemType[] = [];
    // 生成5个服装分类初始商品
    for (let i = 0; i < 4; i++) {
        const clothesId = getNextGoodsId();
        goodsList.push({
            id: clothesId,
            category: 2,
            goodsName: nameClothes[clothesId % 4],
            price: priceClothes[clothesId % 4],
            goodsImg: getImageByIndexClothes(clothesId % 4),
            advertisingLanguage: { "id": 16777221, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
            evaluate: { "id": 16777225, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" }
        });
    }
    return goodsList;
}
const nameClothes: ResourceStr[] = [
    "花纱羊毛混纺半高领毛衣开衫老钱棕色灰色百搭cleanfit",
    "OUR LEGACY Evening男士黑色Polo衫休闲宽松复古针织开衫外套",
    "No day off「烧边牛角扣」羊毛混纺针织亨利领毛衣纯色基础长袖男",
    "高知感舒芙蕾休闲复古慵懒羊毛混纺毛织开衫外套",
];
const priceClothes: ResourceStr[] = ['236', '3300', '149', '403'];
function getImageByIndexClothes(index: number): Resource {
    const images = [
        { "id": 16777253, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
        { "id": 16777256, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
        { "id": 16777254, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
        { "id": 16777258, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
    ];
    return images[index % 4];
}
// 初始化穿戴分类商品数据
export function initWearGoodsData(): GoodsListItemType[] {
    const goodsList: GoodsListItemType[] = [];
    // 生成4个穿戴分类初始商品
    for (let i = 0; i < 4; i++) {
        const wearId = getNextGoodsId();
        goodsList.push({
            id: wearId,
            category: 3,
            goodsName: nameWear[wearId % 4],
            price: priceWear[wearId % 4],
            goodsImg: getImageByIndexWear(wearId % 4),
            advertisingLanguage: { "id": 16777221, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
            evaluate: { "id": 16777225, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" }
        });
    }
    return goodsList;
}
const nameWear: ResourceStr[] = [
    "Apple Watch Series 11 GPS + 蜂窝款 44mm 钛金属表壳 海洋表带 智能手表",
    "【新品上市】Huawei/华为 WATCH GT 6智能手表21天超长续航华为手机专卖店智能穿戴设备健康全新骑行体验",
    "小米手环10智能手环运动健康防水睡眠心率全面屏长续航小米手环9升级款",
    "三星/Samsung Galaxy Watch8 智能手表 运动AI心率监测睡眠监测血氧血压心率适配三星三折叠",
];
const priceWear: ResourceStr[] = ['5799', '1388', '269', '1824'];
function getImageByIndexWear(index: number): Resource {
    const images = [
        { "id": 16777249, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
        { "id": 16777252, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
        { "id": 16777251, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
        { "id": 16777250, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
    ];
    return images[index % 4];
}
// 初始化家居分类商品数据
export function initHomeFurnishingGoodsData(): GoodsListItemType[] {
    const goodsList: GoodsListItemType[] = [];
    // 生成4个家居分类初始商品
    for (let i = 0; i < 4; i++) {
        const homeId = getNextGoodsId();
        goodsList.push({
            id: homeId,
            category: 4,
            goodsName: nameHomeFurnishing[homeId % 4],
            price: priceHomeFurnishing[homeId % 4],
            goodsImg: getImageByIndexHomeFurnishing(homeId % 4),
            advertisingLanguage: { "id": 16777221, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
            evaluate: { "id": 16777225, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" }
        });
    }
    return goodsList;
}
const nameHomeFurnishing: ResourceStr[] = [
    "草地浮游水气缸桌面灯摆件氛围小夜灯鱼缸",
    "物有引力 财火灯 复古氛围灯卧室床头小夜灯充电民宿装饰圣诞创意",
    "现代轻奢椭圆形装饰托盘样板房创意家居餐桌茶几水果盘收纳盘摆件",
    "原木奶油风客厅装饰画趣味猫咪沙发背景墙挂画立体砂岩高级感壁画",
];
const priceHomeFurnishing: ResourceStr[] = ['333', '38', '127', '345'];
function getImageByIndexHomeFurnishing(index: number): Resource {
    const images = [
        { "id": 16777255, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
        { "id": 16777257, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
        { "id": 16777260, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
        { "id": 16777259, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
    ];
    return images[index % 4];
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
        { "id": 16777246, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
    ];
    return images[index % 4];
}
