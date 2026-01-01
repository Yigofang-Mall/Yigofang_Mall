import { getRefreshedGoodsByCategory, CATEGORIES } from "@bundle:com.example.list_harmony/entry/ets/viewmodel/InitialData";
import type { GoodsListItemType } from "@bundle:com.example.list_harmony/entry/ets/viewmodel/InitialData";
import { searchGoodsByKeyword } from "@bundle:com.example.list_harmony/entry/ets/viewmodel/SearchUtils";
import { MAX_DATA_LENGTH } from "@bundle:com.example.list_harmony/entry/ets/common/CommonConstants";
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
                let goodsName: string = { "id": 16777241, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" }.toString();
                let price: ResourceStr = getPriceByIndex(id);
                // 根据当前分类，匹配对应分类的【专属商品名称+专属价格】
                switch (this.category) {
                    case CATEGORIES.MOBILE_PHONE:
                        goodsName = { "id": -1, "type": -1, params: [`app.string.goods_name_phone_${imageIndex + 1}`], "bundleName": "com.example.list_harmony", "moduleName": "entry" }.toString();
                        price = { "id": -1, "type": -1, params: [`app.string.goods_price_phone_${imageIndex + 1}`], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
                        break;
                    case CATEGORIES.CLOTHES:
                        goodsName = { "id": -1, "type": -1, params: [`app.string.goods_name_clothes_${imageIndex + 1}`], "bundleName": "com.example.list_harmony", "moduleName": "entry" }.toString();
                        price = { "id": -1, "type": -1, params: [`app.string.goods_price_clothes_${imageIndex + 1}`], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
                        break;
                    case CATEGORIES.WEAR:
                        goodsName = { "id": -1, "type": -1, params: [`app.string.goods_name_wear_${imageIndex + 1}`], "bundleName": "com.example.list_harmony", "moduleName": "entry" }.toString();
                        price = { "id": -1, "type": -1, params: [`app.string.goods_price_wear_${imageIndex + 1}`], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
                        break;
                    case CATEGORIES.HOME_FURNISHING:
                        goodsName = { "id": -1, "type": -1, params: [`app.string.goods_name_home_${imageIndex + 1}`], "bundleName": "com.example.list_harmony", "moduleName": "entry" }.toString();
                        price = { "id": -1, "type": -1, params: [`app.string.goods_price_home_${imageIndex + 1}`], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
                        break;
                    default:
                        // 默认分类用原来的通用名称
                        goodsName = (id % 2 === 0 ? { "id": 16777241, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" } : { "id": 16777237, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" }).toString();
                        break;
                }
                newData.push({
                    id: id,
                    goodsName: goodsName,
                    price: price,
                    goodsImg: getImageByCategoryAndIndex(this.category, imageIndex),
                    advertisingLanguage: { "id": 16777236, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
                    evaluate: { "id": 16777240, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
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
        }
        else {
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
        { "id": 16777276, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
        { "id": 16777277, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
        { "id": 16777278, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
        { "id": 16777279, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" }
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
            return { "id": 16777219, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
    }
}
// 定义每个分类的图片获取函数
function getSelectedImage(index: number): Resource {
    switch (index) {
        case 1: return { "id": 16777219, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
        case 2: return { "id": 16777292, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
        case 3: return { "id": 16777291, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
        case 4: return { "id": 16777226, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
        default: return { "id": 16777219, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
    }
}
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
