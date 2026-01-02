import { PAGE_SIZE, FEATURED_SIZE } from "@bundle:com.example.list_harmony/entry/ets/common/CommonConstants";
// 商品列表项类型
export interface GoodsListItemType {
    id: number;
    goodsName: string; // 直接使用字符串而不是ResourceStr
    price: ResourceStr;
    goodsImg: Resource;
    advertisingLanguage: ResourceStr;
    evaluate: ResourceStr;
    category: string; // 商品分类
}
// 分类常量
interface GeneratedObjectLiteralInterface_1 {
    SELECTED: string;
    MOBILE_PHONE: string;
    CLOTHES: string;
    WEAR: string;
    HOME_FURNISHING: string;
}
export const CATEGORIES: GeneratedObjectLiteralInterface_1 = {
    SELECTED: 'selected',
    MOBILE_PHONE: 'mobile_phone',
    CLOTHES: 'clothes',
    WEAR: 'wear',
    HOME_FURNISHING: 'home_furnishing'
};
// 初始化标签栏数据
export function initTabBarData(): Resource[] {
    return [
        { "id": 16777275, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
        { "id": 16777238, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
        { "id": 16777284, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
        { "id": 16777274, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" }
    ];
}
// 获取所有分类的商品数据
interface GeneratedTypeLiteralInterface_phone {
    name: string;
    price: ResourceStr;
}
interface GeneratedTypeLiteralInterface_clothes {
    name: string;
    price: ResourceStr;
}
interface GeneratedTypeLiteralInterface_wear {
    name: string;
    price: ResourceStr;
}
interface GeneratedTypeLiteralInterface_home {
    name: string;
    price: ResourceStr;
}
export function getAllGoods(): GoodsListItemType[] {
    const goodsList: GoodsListItemType[] = [];
    let id = 1;
    // 手机分类商品
    const mobilePhones: Array<GeneratedTypeLiteralInterface_phone> = [
        { name: 'vivo X300 Pro新品蔡司2亿APO超级长焦天玑9500拍照手机官方旗舰店官网正品', price: { "id": 16777266, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" } },
        { name: 'HUAWEI Mate 80 麒麟9020芯片 第二代红枫影像 鸿蒙AI 华为直屏鸿蒙智能手机华为官方旗舰店', price: { "id": 16777267, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" } },
        { name: 'Apple/苹果 iPhone 17 Pro Max 手机 A19 Pro芯片 2025新款 全新未拆封，官方正品', price: { "id": 16777268, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" } },
        { name: '小米17 Pro手机新品上市小米徕卡联合研发小米官方旗舰店官网小米澎湃OS小米17pro', price: { "id": 16777269, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" } },
    ];
    // 服装分类商品
    const clothes: Array<GeneratedTypeLiteralInterface_clothes> = [
        { name: '花纱羊毛混纺半高领毛衣开衫老钱棕色灰色百搭cleanfit', price: { "id": 16777258, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" } },
        { name: 'OUR LEGACY Evening男士黑色Polo衫休闲宽松复古针织开衫外套', price: { "id": 16777259, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" } },
        { name: 'No day off「烧边牛角扣」羊毛混纺针织亨利领毛衣纯色基础长袖男', price: { "id": 16777260, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" } },
        { name: '高知感舒芙蕾休闲复古慵懒羊毛混纺毛织开衫外套', price: { "id": 16777261, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" } },
    ];
    // 穿戴分类商品
    const wears: Array<GeneratedTypeLiteralInterface_wear> = [
        { name: 'Apple Watch Series 11 GPS + 蜂窝款 44mm 钛金属表壳 海洋表带 智能手表', price: { "id": 16777270, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" } },
        { name: '【新品上市】Huawei/华为 WATCH GT 6智能手表21天超长续航华为手机专卖店智能穿戴设备健康全新骑行体验', price: { "id": 16777271, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" } },
        { name: '小米手环10智能手环运动健康防水睡眠心率全面屏长续航小米手环9升级款', price: { "id": 16777272, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" } },
        { name: '三星/Samsung Galaxy Watch8 智能手表 运动AI心率监测睡眠监测血氧血压心率适配三星三折叠', price: { "id": 16777273, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" } },
    ];
    // 家居分类商品
    const homeFurnishings: Array<GeneratedTypeLiteralInterface_home> = [
        { name: '草地浮游水气缸桌面灯摆件氛围小夜灯鱼缸', price: { "id": 16777262, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" } },
        { name: '物有引力 财火灯 复古氛围灯卧室床头小夜灯充电民宿装饰圣诞创意', price: { "id": 16777263, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" } },
        { name: '现代轻奢椭圆形装饰托盘样板房创意家居餐桌茶几水果盘收纳盘摆件', price: { "id": 16777264, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" } },
        { name: '原木奶油风客厅装饰画趣味猫咪沙发背景墙挂画立体砂岩高级感壁画', price: { "id": 16777265, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" } },
    ];
    // 生成手机商品
    mobilePhones.forEach((item, index) => {
        goodsList.push({
            id: id++,
            goodsName: item.name,
            price: item.price,
            goodsImg: getPhoneImage(index % 4 + 1),
            advertisingLanguage: { "id": 16777236, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
            evaluate: { "id": 16777240, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
            category: CATEGORIES.MOBILE_PHONE
        });
    });
    // 生成服装商品
    clothes.forEach((item, index) => {
        goodsList.push({
            id: id++,
            goodsName: item.name,
            price: item.price,
            goodsImg: getClothesImage(index % 4 + 1),
            advertisingLanguage: { "id": 16777236, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
            evaluate: { "id": 16777240, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
            category: CATEGORIES.CLOTHES
        });
    });
    // 生成穿戴商品
    wears.forEach((item, index) => {
        goodsList.push({
            id: id++,
            goodsName: item.name,
            price: item.price,
            goodsImg: getWearImage(index % 4 + 1),
            advertisingLanguage: { "id": 16777236, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
            evaluate: { "id": 16777240, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
            category: CATEGORIES.WEAR
        });
    });
    // 生成家居商品
    homeFurnishings.forEach((item, index) => {
        goodsList.push({
            id: id++,
            goodsName: item.name,
            price: item.price,
            goodsImg: getHomeImage(index % 4 + 1),
            advertisingLanguage: { "id": 16777236, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
            evaluate: { "id": 16777240, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
            category: CATEGORIES.HOME_FURNISHING
        });
    });
    return goodsList;
}
// 获取指定分类的商品数据
function getGoodsByCategory(category: string): GoodsListItemType[] {
    const allGoods = getAllGoods();
    if (category === CATEGORIES.SELECTED) {
        // 精选页：从所有商品中随机挑选
        return shuffleArray(allGoods).slice(0, FEATURED_SIZE);
    }
    else {
        // 其他分类：筛选对应分类的商品
        const filtered = allGoods.filter(item => item.category === category);
        // 如果数量不够，循环展示
        if (filtered.length < PAGE_SIZE) {
            return fillArrayWithLoop(filtered, PAGE_SIZE);
        }
        return filtered.slice(0, PAGE_SIZE);
    }
}
// 随机打乱数组
function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = newArray[i];
        newArray[i] = newArray[j];
        newArray[j] = temp;
    }
    return newArray;
}
// 循环填充数组，直到达到指定长度
function fillArrayWithLoop<T>(array: T[], length: number): T[] {
    if (array.length === 0) {
        return array;
    }
    const result: T[] = [];
    while (result.length < length) {
        for (let i = 0; i < array.length && result.length < length; i++) {
            result.push(array[i]);
        }
    }
    return result;
}
// 获取刷新后的商品数据（随机排序）
export function getRefreshedGoodsByCategory(category: string): GoodsListItemType[] {
    let goods = getGoodsByCategory(category);
    // 随机打乱
    goods = shuffleArray(goods);
    // 如果数量不够，则循环填充
    if (goods.length < PAGE_SIZE) {
        goods = fillArrayWithLoop(goods, PAGE_SIZE);
    }
    // 控制台日志：展示新建商品的数据
    console.log('=== 商品刷新日志 ===');
    console.log('分类:', category);
    console.log('刷新后商品数量:', goods.length);
    console.log('新建商品数据:');
    goods.forEach((item, index) => {
        console.log(`  商品 ${index + 1}:`);
        console.log(`    ID: ${item.id}`);
        console.log(`    名称: ${item.goodsName}`);
        console.log(`    分类: ${item.category}`);
        console.log(`    广告语: ${item.advertisingLanguage}`);
        console.log(`    评价: ${item.evaluate}`);
        console.log(`    ---`);
    });
    console.log('=== 刷新完成 ===');
    return goods.slice(0, PAGE_SIZE);
}
// 定义每个分类的图片获取函数
function getPhoneImage(index: number): Resource {
    switch (index) {
        case 1: return { "id": 16777227, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
        case 2: return { "id": 16777220, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
        case 3: return { "id": 16777286, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
        case 4: return { "id": 16777296, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
        default: return { "id": 16777227, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
    }
}
function getClothesImage(index: number): Resource {
    switch (index) {
        case 1: return { "id": 16777225, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
        case 2: return { "id": 16777287, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
        case 3: return { "id": 16777288, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
        case 4: return { "id": 16777221, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
        default: return { "id": 16777225, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
    }
}
function getWearImage(index: number): Resource {
    switch (index) {
        case 1: return { "id": 16777223, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
        case 2: return { "id": 16777293, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
        case 3: return { "id": 16777222, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
        case 4: return { "id": 16777294, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
        default: return { "id": 16777223, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
    }
}
function getHomeImage(index: number): Resource {
    switch (index) {
        case 1: return { "id": 16777289, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
        case 2: return { "id": 16777224, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
        case 3: return { "id": 16777218, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
        case 4: return { "id": 16777290, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
        default: return { "id": 16777289, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
    }
}
// 初始化商品数据
export function initGoodsData(): GoodsListItemType[] {
    return getGoodsByCategory(CATEGORIES.SELECTED);
}
