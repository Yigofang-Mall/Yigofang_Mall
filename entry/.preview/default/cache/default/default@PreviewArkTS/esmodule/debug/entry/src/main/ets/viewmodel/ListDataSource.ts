import { getRefreshedGoodsByCategory, CATEGORIES } from "@bundle:com.example.list_harmony/entry/ets/viewmodel/InitialData";
import type { GoodsListItemType } from "@bundle:com.example.list_harmony/entry/ets/viewmodel/InitialData";
import { searchGoodsByKeyword } from "@bundle:com.example.list_harmony/entry/ets/viewmodel/SearchUtils";
import { MAX_DATA_LENGTH } from "@bundle:com.example.list_harmony/entry/ets/common/CommonConstants";
import { SortType } from "@bundle:com.example.list_harmony/entry/ets/view/SortDialogComponent";
import type { PriceRangeFilter } from "@bundle:com.example.list_harmony/entry/ets/view/SortDialogComponent";
import { sortGoodsList } from "@bundle:com.example.list_harmony/entry/ets/viewmodel/SortUtils";
/**
 * List数据源类，用于LazyForEach懒加载
 */
export class ListDataSource implements IDataSource {
    private listeners: DataChangeListener[] = [];
    private dataArray: GoodsListItemType[] = [];
    private currentIndex: number = 0;
    private category: string = CATEGORIES.SELECTED;
    private maxLoadedIndex: number = 0; // 记录已加载的最大索引
    private currentSortType: SortType = SortType.RECOMMEND; // 当前排序类型
    private currentPriceFilter: PriceRangeFilter | null = null; // 当前价格筛选条件
    private isLazyLoadEnabled: boolean = true; // 是否启用懒加载
    constructor(category: string = CATEGORIES.SELECTED) {
        this.category = category;
        // 初始化数据
        this.dataArray = getRefreshedGoodsByCategory(category);
        this.currentIndex = this.dataArray.length;
        this.maxLoadedIndex = this.dataArray.length;
    }
    totalCount(): number {
        // 价格筛选模式下，返回实际数据长度，避免重复显示
        if (this.currentPriceFilter) {
            const filteredData = sortGoodsList(this.dataArray, this.currentSortType, this.currentPriceFilter);
            return filteredData.length;
        }
        return MAX_DATA_LENGTH;
    }
    /**
     * 检查是否还能加载更多数据
     * @returns true表示还能加载，false表示已达上限
     */
    canLoadMore(): boolean {
        // 价格筛选模式下，不允许加载更多数据
        if (this.currentPriceFilter) {
            return false;
        }
        return this.dataArray.length < MAX_DATA_LENGTH;
    }
    getData(index: number): GoodsListItemType | undefined {
        // 如果启用懒加载且索引超出当前数据范围，预加载更多数据
        if (this.isLazyLoadEnabled && index >= this.dataArray.length - 6 && this.dataArray.length < MAX_DATA_LENGTH) {
            this.pushData();
        }
        // 如果索引有效，返回数据，否则返回最后一个数据
        if (index < this.dataArray.length) {
            // 如果启用了价格筛选，需要在返回数据前应用筛选
            if (this.currentPriceFilter) {
                const filteredData = sortGoodsList(this.dataArray, this.currentSortType, this.currentPriceFilter);
                if (index < filteredData.length) {
                    return filteredData[index];
                }
                // 如果索引超出筛选后的数据范围，返回undefined
                return undefined;
            }
            else {
                return this.dataArray[index];
            }
        }
        // 如果索引超出范围，根据模式返回相应结果
        if (this.currentPriceFilter) {
            // 价格筛选模式下，超出范围返回undefined
            return undefined;
        }
        // 普通模式下，返回最后一个数据
        return this.dataArray[this.dataArray.length - 1];
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
        console.log('=== 懒加载调试日志 ===');
        console.log('当前数据长度:', this.dataArray.length);
        console.log('当前最大索引:', this.maxLoadedIndex);
        console.log('分类:', this.category);
        // 模拟网络延迟
        setTimeout(() => {
            const newData: GoodsListItemType[] = [];
            const startIndex = this.dataArray.length;
            console.log('开始懒加载，从索引:', startIndex);
            console.log('开始ID:', this.maxLoadedIndex + 1);
            // 每次加载8个新商品（减少数量以避免问题）
            for (let i = 0; i < 8 && this.dataArray.length < MAX_DATA_LENGTH; i++) {
                const id = this.maxLoadedIndex + i + 1;
                const imageIndex = id % 4; // 0-3，刚好匹配每个分类的4张图片
                let goodsName: string = getGoodsNameByCategoryAndIndex(this.category, imageIndex);
                let price: ResourceStr = getPriceByIndex(this.category, imageIndex);
                console.log(`创建商品 ${i + 1}: ID=${id}, 名称: ${goodsName}, 分类: ${this.category}`);
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
                console.log('成功创建', newData.length, '个新商品');
                this.dataArray.push(...newData);
                this.maxLoadedIndex += newData.length;
                this.currentIndex = this.dataArray.length;
                // 应用当前排序（确保新加载的数据也按排序规则排列）
                this.applySort();
                // 通知数据变化
                this.listeners.forEach(listener => {
                    listener.onDataAdd?.(startIndex);
                    listener.onDataReloaded?.();
                });
                console.log('懒加载完成，当前总数据长度:', this.dataArray.length);
            }
            else {
                console.log('没有更多数据可以加载');
            }
            console.log('=== 懒加载调试日志结束 ===');
        }, 500);
    }
    /**
     * 刷新数据
     */
    refreshData(): void {
        console.log('=== 刷新数据调试日志 ===');
        console.log('刷新分类:', this.category);
        console.log('刷新前数据长度:', this.dataArray.length);
        console.log('当前价格筛选:', this.currentPriceFilter ? `¥${this.currentPriceFilter.minPrice} - ¥${this.currentPriceFilter.maxPrice}` : '无');
        // 模拟网络延迟
        setTimeout(() => {
            this.dataArray = getRefreshedGoodsByCategory(this.category);
            this.currentIndex = this.dataArray.length;
            this.maxLoadedIndex = this.dataArray.length; // 重置最大索引
            // 如果当前是排序模式（非推荐排序）或启用了价格筛选，加载所有数据
            if (this.currentSortType !== SortType.RECOMMEND || this.currentPriceFilter) {
                console.log('刷新数据：价格排序/筛选模式，禁用懒加载，加载所有数据');
                this.isLazyLoadEnabled = false;
                this.loadAllData();
            }
            else {
                this.isLazyLoadEnabled = true;
            }
            // 应用当前排序
            this.applySort();
            console.log('刷新后数据长度:', this.dataArray.length);
            console.log('重置最大索引为:', this.maxLoadedIndex);
            // 通知数据刷新
            this.listeners.forEach(listener => {
                listener.onDataReloaded?.();
            });
            console.log('=== 刷新数据完成 ===');
        }, 1000);
    }
    /**
     * 设置分类
     */
    setCategory(category: string): void {
        if (this.category !== category) {
            console.log('=== 切换分类调试日志 ===');
            console.log('从分类切换到:', category);
            console.log('切换前数据长度:', this.dataArray.length);
            console.log('当前价格筛选:', this.currentPriceFilter ? `¥${this.currentPriceFilter.minPrice} - ¥${this.currentPriceFilter.maxPrice}` : '无');
            this.category = category;
            this.dataArray = getRefreshedGoodsByCategory(category);
            this.currentIndex = this.dataArray.length;
            this.maxLoadedIndex = this.dataArray.length; // 重置最大索引
            // 如果当前是排序模式（非推荐排序）或启用了价格筛选，加载所有数据
            if (this.currentSortType !== SortType.RECOMMEND || this.currentPriceFilter) {
                console.log('切换分类：价格排序/筛选模式，禁用懒加载，加载所有数据');
                this.isLazyLoadEnabled = false;
                this.loadAllData();
            }
            else {
                this.isLazyLoadEnabled = true;
            }
            // 应用当前排序
            this.applySort();
            console.log('切换后数据长度:', this.dataArray.length);
            console.log('重置最大索引为:', this.maxLoadedIndex);
            // 通知数据刷新
            this.listeners.forEach(listener => {
                listener.onDataReloaded?.();
            });
            console.log('=== 切换分类完成 ===');
        }
    }
    /**
     * 搜索商品
     */
    searchGoods(keyword: string): void {
        console.log('=== 搜索商品调试日志 ===');
        console.log('搜索关键词:', keyword);
        console.log('搜索分类:', this.category);
        if (keyword.trim() === '') {
            // 如果搜索关键词为空，显示当前分类的所有商品
            this.dataArray = getRefreshedGoodsByCategory(this.category);
        }
        else {
            // 根据关键词搜索商品
            this.dataArray = searchGoodsByKeyword(this.category, keyword.trim());
        }
        this.currentIndex = this.dataArray.length;
        this.maxLoadedIndex = this.dataArray.length; // 重置最大索引
        // 应用当前排序
        this.applySort();
        console.log('搜索结果数量:', this.dataArray.length);
        console.log('重置最大索引为:', this.maxLoadedIndex);
        // 通知数据刷新
        this.listeners.forEach(listener => {
            listener.onDataReloaded?.();
        });
        console.log('=== 搜索完成 ===');
    }
    /**
     * 设置排序类型
     */
    setSortType(sortType: SortType, priceFilter?: PriceRangeFilter): void {
        const sortTypeChanged = this.currentSortType !== sortType;
        const priceFilterChanged = JSON.stringify(this.currentPriceFilter) !== JSON.stringify(priceFilter);
        if (sortTypeChanged || priceFilterChanged) {
            console.log('========================================');
            console.log('=== ListDataSource.setSortType ===');
            console.log(`从排序类型: ${this.currentSortType} 切换到: ${sortType}`);
            console.log(`价格筛选变化: ${priceFilterChanged}`);
            console.log(`当前分类: ${this.category}`);
            console.log(`排序前数据数量: ${this.dataArray.length}`);
            console.log(`排序前最大索引: ${this.maxLoadedIndex}`);
            if (priceFilter) {
                console.log(`价格区间筛选: ¥${priceFilter.minPrice} - ¥${priceFilter.maxPrice}`);
            }
            this.currentSortType = sortType;
            this.currentPriceFilter = priceFilter || null;
            // 如果排序类型不是推荐排序或启用了价格筛选，禁用懒加载并加载所有数据
            if (sortType !== SortType.RECOMMEND || priceFilter) {
                console.log('价格排序/筛选模式：禁用懒加载，加载所有数据');
                this.isLazyLoadEnabled = false;
                this.loadAllData();
                console.log(`加载所有数据后，数据数量: ${this.dataArray.length}`);
            }
            else {
                // 推荐排序时启用懒加载
                console.log('推荐排序模式：启用懒加载');
                this.isLazyLoadEnabled = true;
            }
            // 应用排序
            console.log('开始应用排序...');
            this.applySort();
            // 通知数据刷新
            this.listeners.forEach(listener => {
                listener.onDataReloaded?.();
            });
            console.log(`排序后数据数量: ${this.dataArray.length}`);
            console.log(`懒加载状态: ${this.isLazyLoadEnabled ? '启用' : '禁用'}`);
            console.log('=== setSortType 完成 ===');
            console.log('========================================\n');
        }
        else {
            console.log(`[排序] 排序类型和价格筛选条件未变化，跳过`);
        }
    }
    /**
     * 获取当前排序类型
     */
    getSortType(): SortType {
        return this.currentSortType;
    }
    /**
     * 获取当前价格筛选条件
     */
    getPriceFilter(): PriceRangeFilter | null {
        return this.currentPriceFilter;
    }
    /**
     * 加载所有数据（禁用懒加载时使用）
     */
    private loadAllData(): void {
        console.log('=== 加载所有数据（禁用懒加载） ===');
        console.log('当前数据长度:', this.dataArray.length);
        console.log('目标数据长度:', MAX_DATA_LENGTH);
        console.log('当前价格筛选:', this.currentPriceFilter ? `¥${this.currentPriceFilter.minPrice} - ¥${this.currentPriceFilter.maxPrice}` : '无');
        // 如果启用了价格筛选，加载数据时需要先加载所有原始数据，然后应用筛选
        if (this.currentPriceFilter) {
            console.log('价格筛选模式：加载所有原始数据，然后应用筛选');
            this.loadAllDataForPriceFilter();
        }
        else {
            // 普通排序模式，加载所有数据
            this.loadAllDataForNormalSort();
        }
        console.log('=== 加载所有数据完成 ===');
    }
    /**
     * 正常排序模式下加载所有数据
     */
    private loadAllDataForNormalSort(): void {
        // 如果数据已经全部加载，直接返回
        if (this.dataArray.length >= MAX_DATA_LENGTH) {
            console.log('数据已全部加载');
            return;
        }
        // 一次性加载所有剩余数据
        const newData: GoodsListItemType[] = [];
        const startIndex = this.dataArray.length;
        for (let i = 0; i < MAX_DATA_LENGTH - this.dataArray.length; i++) {
            const id = this.maxLoadedIndex + i + 1;
            const imageIndex = id % 4; // 0-3，刚好匹配每个分类的4张图片
            let goodsName: string = getGoodsNameByCategoryAndIndex(this.category, imageIndex);
            let price: ResourceStr = getPriceByIndex(this.category, imageIndex);
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
            console.log('成功加载', newData.length, '个商品');
            this.dataArray.push(...newData);
            this.maxLoadedIndex += newData.length;
            this.currentIndex = this.dataArray.length;
            console.log('加载完成，当前总数据长度:', this.dataArray.length);
        }
    }
    /**
     * 价格筛选模式下加载所有数据
     */
    private loadAllDataForPriceFilter(): void {
        // 在价格筛选模式下，我们需要加载足够的数据来确保筛选结果
        // 由于不知道确切的筛选结果，我们加载比平时更多的数据
        const targetLoadCount = Math.min(MAX_DATA_LENGTH, 200); // 加载最多200个商品进行筛选
        // 如果数据已经足够加载，直接返回
        if (this.dataArray.length >= targetLoadCount) {
            console.log('数据已足够加载用于价格筛选');
            return;
        }
        // 加载更多数据用于价格筛选
        const newData: GoodsListItemType[] = [];
        const remainingCount = targetLoadCount - this.dataArray.length;
        for (let i = 0; i < remainingCount; i++) {
            const id = this.maxLoadedIndex + i + 1;
            const imageIndex = id % 4; // 0-3，刚好匹配每个分类的4张图片
            let goodsName: string = getGoodsNameByCategoryAndIndex(this.category, imageIndex);
            let price: ResourceStr = getPriceByIndex(this.category, imageIndex);
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
            console.log('价格筛选模式：成功加载', newData.length, '个商品');
            this.dataArray.push(...newData);
            this.maxLoadedIndex += newData.length;
            this.currentIndex = this.dataArray.length;
            console.log('价格筛选模式：当前总数据长度:', this.dataArray.length);
        }
    }
    /**
     * 应用排序
     */
    private applySort(): void {
        console.log('=== ListDataSource.applySort ===');
        console.log(`当前排序类型: ${this.currentSortType}`);
        console.log(`数据数组长度: ${this.dataArray.length}`);
        console.log(`分类: ${this.category}`);
        console.log(`当前价格筛选: ${this.currentPriceFilter ? `¥${this.currentPriceFilter.minPrice} - ¥${this.currentPriceFilter.maxPrice}` : '无'}`);
        if (this.currentSortType !== SortType.RECOMMEND || this.currentPriceFilter) {
            console.log('应用价格排序/筛选...');
            const beforeSort = [...this.dataArray];
            this.dataArray = sortGoodsList(this.dataArray, this.currentSortType, this.currentPriceFilter || undefined);
            // 验证数据完整性
            if (beforeSort.length !== this.dataArray.length) {
                console.error(`[排序错误] 排序前后数据长度不一致: ${beforeSort.length} -> ${this.dataArray.length}`);
            }
            // 检查是否有数据丢失
            const beforeIds = beforeSort.map(item => item.id).sort();
            const afterIds = this.dataArray.map(item => item.id).sort();
            const lostIds = beforeIds.filter(id => !afterIds.includes(id));
            if (lostIds.length > 0) {
                console.error(`[排序错误] 排序后丢失的商品ID: ${lostIds.join(', ')}`);
            }
        }
        else {
            console.log('推荐排序，不进行排序操作');
        }
        console.log('=== applySort 完成 ===\n');
    }
    /**
     * 获取所有数据（用于非懒加载模式）
     */
    getAllData(): GoodsListItemType[] {
        // 如果启用了价格筛选，返回筛选后的数据
        if (this.currentPriceFilter) {
            console.log(`getAllData: 价格筛选模式，返回筛选后数据`);
            return sortGoodsList(this.dataArray, this.currentSortType, this.currentPriceFilter);
        }
        else {
            return this.dataArray;
        }
    }
    /**
     * 是否启用懒加载
     */
    isLazyLoadMode(): boolean {
        return this.isLazyLoadEnabled;
    }
}
// 根据分类和索引获取价格
function getPriceByIndex(category: string, imageIndex: number): ResourceStr {
    const index = (imageIndex % 4) + 1; // 转换为1-4的范围
    switch (category) {
        case CATEGORIES.MOBILE_PHONE:
            switch (index) {
                case 1: return { "id": 16777266, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
                case 2: return { "id": 16777267, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
                case 3: return { "id": 16777268, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
                case 4: return { "id": 16777269, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
                default: return { "id": 16777266, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
            }
        case CATEGORIES.CLOTHES:
            switch (index) {
                case 1: return { "id": 16777258, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
                case 2: return { "id": 16777259, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
                case 3: return { "id": 16777260, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
                case 4: return { "id": 16777261, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
                default: return { "id": 16777258, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
            }
        case CATEGORIES.WEAR:
            switch (index) {
                case 1: return { "id": 16777270, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
                case 2: return { "id": 16777271, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
                case 3: return { "id": 16777272, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
                case 4: return { "id": 16777273, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
                default: return { "id": 16777270, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
            }
        case CATEGORIES.HOME_FURNISHING:
            switch (index) {
                case 1: return { "id": 16777262, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
                case 2: return { "id": 16777263, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
                case 3: return { "id": 16777264, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
                case 4: return { "id": 16777265, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
                default: return { "id": 16777262, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
            }
        default:
            // 默认价格
            switch (index) {
                case 1: return { "id": 16777276, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
                case 2: return { "id": 16777277, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
                case 3: return { "id": 16777278, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
                case 4: return { "id": 16777279, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
                default: return { "id": 16777276, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
            }
    }
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
            return getSelectedImage(imageIndex);
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
// 获取商品名称（返回字符串类型）
function getGoodsNameByCategoryAndIndex(category: string, index: number): string {
    const imageIndex = (index % 4) + 1; // 转换为1-4的范围
    switch (category) {
        case CATEGORIES.MOBILE_PHONE:
            switch (imageIndex) {
                case 1: return 'vivo X300 Pro新品蔡司2亿APO超级长焦天玑9500拍照手机官方旗舰店官网正品';
                case 2: return 'HUAWEI Mate 80 麒麟9020芯片 第二代红枫影像 鸿蒙AI 华为直屏鸿蒙智能手机华为官方旗舰店';
                case 3: return 'Apple/苹果 iPhone 17 Pro Max 手机 A19 Pro芯片 2025新款 全新未拆封，官方正品';
                case 4: return '小米17 Pro手机新品上市小米徕卡联合研发小米官方旗舰店官网小米澎湃OS小米17pro';
                default: return 'vivo X300 Pro新品蔡司2亿APO超级长焦天玑9500拍照手机官方旗舰店官网正品';
            }
        case CATEGORIES.CLOTHES:
            switch (imageIndex) {
                case 1: return '花纱羊毛混纺半高领毛衣开衫老钱棕色灰色百搭cleanfit';
                case 2: return 'OUR LEGACY Evening男士黑色Polo衫休闲宽松复古针织开衫外套';
                case 3: return 'No day off「烧边牛角扣」羊毛混纺针织亨利领毛衣纯色基础长袖男';
                case 4: return '高知感舒芙蕾休闲复古慵懒羊毛混纺毛织开衫外套';
                default: return '花纱羊毛混纺半高领毛衣开衫老钱棕色灰色百搭cleanfit';
            }
        case CATEGORIES.WEAR:
            switch (imageIndex) {
                case 1: return 'Apple Watch Series 11 GPS + 蜂窝款 44mm 钛金属表壳 海洋表带 智能手表';
                case 2: return '【新品上市】Huawei/华为 WATCH GT 6智能手表21天超长续航华为手机专卖店智能穿戴设备健康全新骑行体验';
                case 3: return '小米手环10智能手环运动健康防水睡眠心率全面屏长续航小米手环9升级款';
                case 4: return '三星/Samsung Galaxy Watch8 智能手表 运动AI心率监测睡眠监测血氧血压心率适配三星三折叠';
                default: return 'Apple Watch Series 11 GPS + 蜂窝款 44mm 钛金属表壳 海洋表带 智能手表';
            }
        case CATEGORIES.HOME_FURNISHING:
            switch (imageIndex) {
                case 1: return '草地浮游水气缸桌面灯摆件氛围小夜灯鱼缸';
                case 2: return '物有引力 财火灯 复古氛围灯卧室床头小夜灯充电民宿装饰圣诞创意';
                case 3: return '现代轻奢椭圆形装饰托盘样板房创意家居餐桌茶几水果盘收纳盘摆件';
                case 4: return '原木奶油风客厅装饰画趣味猫咪沙发背景墙挂画立体砂岩高级感壁画';
                default: return '草地浮游水气缸桌面灯摆件氛围小夜灯鱼缸';
            }
        default:
            // 默认分类
            return imageIndex % 2 === 0 ? '【新品上市】畅乐冰晶绿低脂新品' : '【新品上市】奶茶自然清新亲近自然';
    }
}
