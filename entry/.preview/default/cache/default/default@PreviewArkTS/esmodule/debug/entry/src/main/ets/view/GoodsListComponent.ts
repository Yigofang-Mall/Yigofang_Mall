if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface GoodsList_Params {
    goodsListData?: ListDataSource;
    startTouchOffsetY?: number;
    endTouchOffsetY?: number;
    isLoading?: boolean;
    hasReachedBottom?: boolean;
    isRefreshing?: boolean;
    category?: string;
    searchKeyword?: string;
    isSearchMode?: boolean;
    showSortDialog?: boolean;
    currentSortType?: SortType;
    currentPriceFilter?: PriceRangeFilter | null;
    searchResults?: GoodsListItemType[];
    sortedSearchResults?: GoodsListItemType[];
    useLazyLoad?: boolean;
}
import * as commonConst from "@bundle:com.example.list_harmony/entry/ets/common/CommonConstants";
import type { GoodsListItemType } from '../viewmodel/InitialData';
import { ListDataSource } from "@bundle:com.example.list_harmony/entry/ets/viewmodel/ListDataSource";
import SortDialog, { SortType } from "@bundle:com.example.list_harmony/entry/ets/view/SortDialogComponent";
import type { PriceRangeFilter } from "@bundle:com.example.list_harmony/entry/ets/view/SortDialogComponent";
import { saveSortType, getSortType } from "@bundle:com.example.list_harmony/entry/ets/viewmodel/PreferencesUtils";
import { searchGoodsByKeyword } from "@bundle:com.example.list_harmony/entry/ets/viewmodel/SearchUtils";
import { sortGoodsList } from "@bundle:com.example.list_harmony/entry/ets/viewmodel/SortUtils";
export default class GoodsList extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__goodsListData = new ObservedPropertyObjectPU(new ListDataSource(), this, "goodsListData");
        this.addProvidedVar("goodsListData", this.__goodsListData, false);
        this.startTouchOffsetY = 0;
        this.endTouchOffsetY = 0;
        this.isLoading = false;
        this.__hasReachedBottom = new ObservedPropertySimplePU(false, this, "hasReachedBottom");
        this.__isRefreshing = new ObservedPropertySimplePU(false, this, "isRefreshing");
        this.__category = new SynchedPropertySimpleOneWayPU(params.category, this, "category");
        this.__searchKeyword = new ObservedPropertySimplePU('', this, "searchKeyword");
        this.__isSearchMode = new ObservedPropertySimplePU(false, this, "isSearchMode");
        this.__showSortDialog = new ObservedPropertySimplePU(false, this, "showSortDialog");
        this.__currentSortType = new ObservedPropertySimplePU(SortType.RECOMMEND, this, "currentSortType");
        this.__currentPriceFilter = new ObservedPropertyObjectPU(null, this, "currentPriceFilter");
        this.__searchResults = new ObservedPropertyObjectPU([], this, "searchResults");
        this.__sortedSearchResults = new ObservedPropertyObjectPU([], this, "sortedSearchResults");
        this.__useLazyLoad = new ObservedPropertySimplePU(true, this, "useLazyLoad");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: GoodsList_Params) {
        if (params.goodsListData !== undefined) {
            this.goodsListData = params.goodsListData;
        }
        if (params.startTouchOffsetY !== undefined) {
            this.startTouchOffsetY = params.startTouchOffsetY;
        }
        if (params.endTouchOffsetY !== undefined) {
            this.endTouchOffsetY = params.endTouchOffsetY;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.hasReachedBottom !== undefined) {
            this.hasReachedBottom = params.hasReachedBottom;
        }
        if (params.isRefreshing !== undefined) {
            this.isRefreshing = params.isRefreshing;
        }
        if (params.category === undefined) {
            this.__category.set('selected');
        }
        if (params.searchKeyword !== undefined) {
            this.searchKeyword = params.searchKeyword;
        }
        if (params.isSearchMode !== undefined) {
            this.isSearchMode = params.isSearchMode;
        }
        if (params.showSortDialog !== undefined) {
            this.showSortDialog = params.showSortDialog;
        }
        if (params.currentSortType !== undefined) {
            this.currentSortType = params.currentSortType;
        }
        if (params.currentPriceFilter !== undefined) {
            this.currentPriceFilter = params.currentPriceFilter;
        }
        if (params.searchResults !== undefined) {
            this.searchResults = params.searchResults;
        }
        if (params.sortedSearchResults !== undefined) {
            this.sortedSearchResults = params.sortedSearchResults;
        }
        if (params.useLazyLoad !== undefined) {
            this.useLazyLoad = params.useLazyLoad;
        }
    }
    updateStateVars(params: GoodsList_Params) {
        this.__category.reset(params.category);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__goodsListData.purgeDependencyOnElmtId(rmElmtId);
        this.__hasReachedBottom.purgeDependencyOnElmtId(rmElmtId);
        this.__isRefreshing.purgeDependencyOnElmtId(rmElmtId);
        this.__category.purgeDependencyOnElmtId(rmElmtId);
        this.__searchKeyword.purgeDependencyOnElmtId(rmElmtId);
        this.__isSearchMode.purgeDependencyOnElmtId(rmElmtId);
        this.__showSortDialog.purgeDependencyOnElmtId(rmElmtId);
        this.__currentSortType.purgeDependencyOnElmtId(rmElmtId);
        this.__currentPriceFilter.purgeDependencyOnElmtId(rmElmtId);
        this.__searchResults.purgeDependencyOnElmtId(rmElmtId);
        this.__sortedSearchResults.purgeDependencyOnElmtId(rmElmtId);
        this.__useLazyLoad.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__goodsListData.aboutToBeDeleted();
        this.__hasReachedBottom.aboutToBeDeleted();
        this.__isRefreshing.aboutToBeDeleted();
        this.__category.aboutToBeDeleted();
        this.__searchKeyword.aboutToBeDeleted();
        this.__isSearchMode.aboutToBeDeleted();
        this.__showSortDialog.aboutToBeDeleted();
        this.__currentSortType.aboutToBeDeleted();
        this.__currentPriceFilter.aboutToBeDeleted();
        this.__searchResults.aboutToBeDeleted();
        this.__sortedSearchResults.aboutToBeDeleted();
        this.__useLazyLoad.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    // 提供列表数据源
    private __goodsListData: ObservedPropertyObjectPU<ListDataSource>;
    get goodsListData() {
        return this.__goodsListData.get();
    }
    set goodsListData(newValue: ListDataSource) {
        this.__goodsListData.set(newValue);
    }
    // 记录触摸起始点Y坐标
    private startTouchOffsetY: number;
    // 记录触摸结束点Y坐标
    private endTouchOffsetY: number;
    // 是否正在加载
    private isLoading: boolean;
    // 是否已经到达底部（没有更多数据）
    private __hasReachedBottom: ObservedPropertySimplePU<boolean>;
    get hasReachedBottom() {
        return this.__hasReachedBottom.get();
    }
    set hasReachedBottom(newValue: boolean) {
        this.__hasReachedBottom.set(newValue);
    }
    // 是否正在刷新
    private __isRefreshing: ObservedPropertySimplePU<boolean>;
    get isRefreshing() {
        return this.__isRefreshing.get();
    }
    set isRefreshing(newValue: boolean) {
        this.__isRefreshing.set(newValue);
    }
    // 分类
    private __category: SynchedPropertySimpleOneWayPU<string>;
    get category() {
        return this.__category.get();
    }
    set category(newValue: string) {
        this.__category.set(newValue);
    }
    // 新增：搜索相关状态
    private __searchKeyword: ObservedPropertySimplePU<string>;
    get searchKeyword() {
        return this.__searchKeyword.get();
    }
    set searchKeyword(newValue: string) {
        this.__searchKeyword.set(newValue);
    }
    private __isSearchMode: ObservedPropertySimplePU<boolean>;
    get isSearchMode() {
        return this.__isSearchMode.get();
    }
    set isSearchMode(newValue: boolean) {
        this.__isSearchMode.set(newValue);
    }
    private __showSortDialog: ObservedPropertySimplePU<boolean>;
    get showSortDialog() {
        return this.__showSortDialog.get();
    }
    set showSortDialog(newValue: boolean) {
        this.__showSortDialog.set(newValue);
    }
    private __currentSortType: ObservedPropertySimplePU<SortType>;
    get currentSortType() {
        return this.__currentSortType.get();
    }
    set currentSortType(newValue: SortType) {
        this.__currentSortType.set(newValue);
    }
    private __currentPriceFilter: ObservedPropertyObjectPU<PriceRangeFilter | null>;
    get currentPriceFilter() {
        return this.__currentPriceFilter.get();
    }
    set currentPriceFilter(newValue: PriceRangeFilter | null) {
        this.__currentPriceFilter.set(newValue);
    }
    // 搜索结果相关状态
    private __searchResults: ObservedPropertyObjectPU<GoodsListItemType[]>;
    get searchResults() {
        return this.__searchResults.get();
    }
    set searchResults(newValue: GoodsListItemType[]) {
        this.__searchResults.set(newValue);
    }
    private __sortedSearchResults: ObservedPropertyObjectPU<GoodsListItemType[]>;
    get sortedSearchResults() {
        return this.__sortedSearchResults.get();
    }
    set sortedSearchResults(newValue: GoodsListItemType[]) {
        this.__sortedSearchResults.set(newValue);
    }
    private __useLazyLoad: ObservedPropertySimplePU<boolean>;
    get useLazyLoad() {
        return this.__useLazyLoad.get();
    }
    set useLazyLoad(newValue: boolean) {
        this.__useLazyLoad.set(newValue);
    }
    aboutToAppear() {
        // 当分类改变时，更新数据源
        this.goodsListData.setCategory(this.category);
        // 初始化排序类型
        this.currentSortType = getSortType();
        this.goodsListData.setSortType(this.currentSortType);
        // 延迟初始化底部状态，确保数据源完全初始化
        setTimeout(() => {
            this.updateBottomStatus();
            console.log('组件初始化完成，是否到达底部:', this.hasReachedBottom);
        }, 100);
    }
    // 新增：统一更新底部状态的方法
    private updateBottomStatus() {
        if (this.isSearchMode) {
            // 搜索模式下，底部状态由搜索结果数量决定
            this.hasReachedBottom = this.sortedSearchResults.length > 0;
        }
        else {
            // 正常模式下，检查是否还有更多数据
            const canLoadMore = this.goodsListData.canLoadMore();
            this.hasReachedBottom = !canLoadMore;
            console.log(`底部状态更新: canLoadMore=${canLoadMore}, hasReachedBottom=${this.hasReachedBottom}`);
        }
    }
    // 监听数据源变化，更新底部状态
    aboutToUpdate() {
        this.updateBottomStatus();
    }
    // 处理下拉刷新
    private handleRefresh() {
        if (this.isRefreshing) {
            return;
        }
        this.isRefreshing = true;
        // 模拟网络延迟
        setTimeout(() => {
            this.goodsListData.refreshData();
            this.isRefreshing = false;
        }, commonConst.REFRESH_DELAY);
    }
    // 新增：处理搜索
    private handleSearch(keyword: string) {
        console.log('=== GoodsListComponent.handleSearch ===');
        console.log('搜索关键词:', keyword);
        console.log('当前分类:', this.category);
        this.searchKeyword = keyword;
        this.isSearchMode = keyword.trim().length > 0;
        if (this.isSearchMode) {
            // 搜索模式下，禁用懒加载
            this.useLazyLoad = false;
            // 执行搜索
            this.searchResults = searchGoodsByKeyword(this.category, keyword.trim());
            console.log('搜索结果数量:', this.searchResults.length);
            // 应用当前排序
            if (this.searchResults.length > 0) {
                this.sortedSearchResults = sortGoodsList(this.searchResults, this.currentSortType, this.currentPriceFilter || undefined);
                console.log('排序后搜索结果数量:', this.sortedSearchResults.length);
            }
            else {
                this.sortedSearchResults = [];
            }
        }
        else {
            // 非搜索模式，恢复懒加载
            this.useLazyLoad = true;
            // 清空搜索结果
            this.searchResults = [];
            this.sortedSearchResults = [];
        }
        // 更新底部状态
        this.updateBottomStatus();
        console.log('搜索模式:', this.isSearchMode);
        console.log('懒加载状态:', this.useLazyLoad);
        console.log('=== handleSearch 完成 ===\n');
    }
    /**
     * 构建单个商品项
     */
    buildGoodsItem(item: GoodsListItemType, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(150:5)", "entry");
            Row.justifyContent(FlexAlign.SpaceBetween);
            Row.height(commonConst.GOODS_LIST_HEIGHT);
            Row.width(commonConst.LAYOUT_WIDTH_OR_HEIGHT);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 商品图片区域
            Column.create();
            Column.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(152:7)", "entry");
            // 商品图片区域
            Column.width(commonConst.GOODS_IMAGE_WIDTH);
            // 商品图片区域
            Column.height(commonConst.LAYOUT_WIDTH_OR_HEIGHT);
            // 商品图片区域
            Column.justifyContent(FlexAlign.Center);
            // 商品图片区域
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(item?.goodsImg);
            Image.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(153:9)", "entry");
            Image.width(commonConst.LAYOUT_WIDTH_OR_HEIGHT);
            Image.height(commonConst.LAYOUT_WIDTH_OR_HEIGHT);
            Image.objectFit(ImageFit.Contain);
            Image.draggable(false);
            Image.borderRadius(8);
        }, Image);
        // 商品图片区域
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 商品信息区域
            Column.create();
            Column.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(166:7)", "entry");
            // 商品信息区域
            Column.padding(commonConst.GOODS_LIST_PADDING);
            // 商品信息区域
            Column.width(commonConst.GOODS_FONT_WIDTH);
            // 商品信息区域
            Column.height(commonConst.LAYOUT_WIDTH_OR_HEIGHT);
            // 商品信息区域
            Column.justifyContent(FlexAlign.SpaceBetween);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 商品名称
            Text.create(item?.goodsName);
            Text.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(168:9)", "entry");
            // 商品名称
            Text.fontSize(commonConst.NORMAL_FONT_SIZE);
            // 商品名称
            Text.fontWeight(FontWeight.Medium);
            // 商品名称
            Text.maxLines(2);
            // 商品名称
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            // 商品名称
            Text.margin({ bottom: 4 });
        }, Text);
        // 商品名称
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 广告语
            Text.create(item?.advertisingLanguage);
            Text.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(176:9)", "entry");
            // 广告语
            Text.fontColor({ "id": 16777231, "type": 10001, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
            // 广告语
            Text.fontSize(commonConst.GOODS_EVALUATE_FONT_SIZE);
            // 广告语
            Text.maxLines(1);
            // 广告语
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            // 广告语
            Text.margin({ bottom: 8, right: commonConst.MARGIN_RIGHT });
        }, Text);
        // 广告语
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 评价和价格信息行
            Row.create();
            Row.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(184:9)", "entry");
            // 评价和价格信息行
            Row.justifyContent(FlexAlign.SpaceBetween);
            // 评价和价格信息行
            Row.width(commonConst.GOODS_LIST_WIDTH);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 评价信息
            Text.create(item?.evaluate);
            Text.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(186:11)", "entry");
            // 评价信息
            Text.fontSize(commonConst.GOODS_EVALUATE_FONT_SIZE);
            // 评价信息
            Text.fontColor({ "id": 16777228, "type": 10001, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
            // 评价信息
            Text.width(commonConst.EVALUATE_WIDTH);
            // 评价信息
            Text.maxLines(1);
            // 评价信息
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
        }, Text);
        // 评价信息
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 价格信息（红色突出显示）
            Text.create(item?.price);
            Text.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(194:11)", "entry");
            // 价格信息（红色突出显示）
            Text.fontSize(commonConst.NORMAL_FONT_SIZE);
            // 价格信息（红色突出显示）
            Text.fontColor({ "id": 16777230, "type": 10001, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
            // 价格信息（红色突出显示）
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        // 价格信息（红色突出显示）
        Text.pop();
        // 评价和价格信息行
        Row.pop();
        // 商品信息区域
        Column.pop();
        Row.pop();
    }
    // 新增：处理排序选择
    private handleSortSelect(sortType: SortType, priceFilter?: PriceRangeFilter) {
        console.log('========================================');
        console.log('=== GoodsListComponent.handleSortSelect ===');
        console.log(`选择的排序类型: ${sortType}`);
        console.log(`当前排序类型: ${this.currentSortType}`);
        console.log(`是否为搜索模式: ${this.isSearchMode}`);
        console.log(`当前分类: ${this.category}`);
        this.currentSortType = sortType;
        // 如果是价格区间筛选，保存筛选条件
        if (sortType === SortType.PRICE_RANGE && priceFilter) {
            this.currentPriceFilter = priceFilter;
            console.log(`价格区间筛选条件: ¥${priceFilter.minPrice} - ¥${priceFilter.maxPrice}`);
        }
        else {
            // 其他排序方式清除价格筛选条件
            this.currentPriceFilter = null;
        }
        // 保存排序类型
        saveSortType(sortType);
        console.log('排序类型已保存到本地存储');
        if (this.isSearchMode) {
            // 搜索模式下，对搜索结果进行排序
            console.log('搜索模式：对搜索结果进行排序');
            console.log(`搜索结果数量: ${this.searchResults.length}`);
            if (this.searchResults.length > 0) {
                console.log('开始排序搜索结果...');
                this.sortedSearchResults = sortGoodsList(this.searchResults, sortType, priceFilter);
                console.log(`排序后结果数量: ${this.sortedSearchResults.length}`);
            }
            else {
                console.log('搜索结果为空，无需排序');
                this.sortedSearchResults = [];
            }
        }
        else {
            // 正常模式下，对数据源进行排序
            console.log('正常模式：对数据源进行排序');
            const dataCount = this.goodsListData.getAllData().length;
            console.log(`数据源商品数量: ${dataCount}`);
            this.goodsListData.setSortType(sortType, priceFilter);
            // 更新懒加载状态
            this.useLazyLoad = this.goodsListData.isLazyLoadMode();
            console.log(`懒加载状态: ${this.useLazyLoad ? '启用' : '禁用'}`);
            // 验证排序后的数据
            const sortedData = this.goodsListData.getAllData();
            console.log(`排序后数据源商品数量: ${sortedData.length}`);
            if (dataCount !== sortedData.length) {
                console.error(`[排序错误] 数据源数量变化: ${dataCount} -> ${sortedData.length}`);
            }
        }
        // 更新底部状态
        this.updateBottomStatus();
        console.log('=== handleSortSelect 完成 ===');
        console.log('========================================\n');
    }
    // 新增：打开排序弹窗
    private openSortDialog() {
        this.showSortDialog = true;
    }
    // 新增：关闭排序弹窗
    private closeSortDialog() {
        this.showSortDialog = false;
    }
    // 新增：处理触摸事件
    private handleTouch(event?: TouchEvent) {
        // 搜索模式下或懒加载禁用时禁用触摸事件处理
        if (this.isSearchMode || !this.useLazyLoad) {
            return;
        }
        if (event === undefined) {
            return;
        }
        switch (event.type) {
            case TouchType.Down: // 触摸按下
                this.startTouchOffsetY = event.touches[0].y;
                break;
            case TouchType.Move: // 触摸移动
                this.endTouchOffsetY = event.touches[0].y;
                // 判断是否向上滑动且接近底部，如果是则加载更多数据
                if (this.startTouchOffsetY - this.endTouchOffsetY > 100 && !this.isLoading && this.useLazyLoad) {
                    // 先检查是否还有更多数据可以加载
                    if (this.goodsListData.canLoadMore()) {
                        console.log('可以加载更多数据，开始加载...');
                        this.isLoading = true;
                        this.goodsListData.pushData();
                        setTimeout(() => {
                            this.isLoading = false;
                            // 检查加载后是否还有更多数据
                            this.updateBottomStatus();
                            console.log('加载完成，是否到达底部:', this.hasReachedBottom);
                        }, 500);
                    }
                    else {
                        console.log('没有更多数据可以加载，已到达底部');
                        this.updateBottomStatus();
                    }
                }
                // 判断是否下拉刷新
                if (this.endTouchOffsetY - this.startTouchOffsetY > 100 && !this.isRefreshing) {
                    this.handleRefresh();
                }
                break;
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 整体容器 - 垂直布局
            Column.create();
            Column.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(331:5)", "entry");
            // 整体容器 - 垂直布局
            Column.width('100%');
            // 整体容器 - 垂直布局
            Column.height('100%');
            // 整体容器 - 垂直布局
            Column.onTouch((event?: TouchEvent) => {
                this.handleTouch(event);
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 搜索框和排序按钮区域
            Row.create();
            Row.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(333:7)", "entry");
            // 搜索框和排序按钮区域
            Row.width('100%');
            // 搜索框和排序按钮区域
            Row.padding({ left: 16, right: 16, top: 8, bottom: 8 });
            // 搜索框和排序按钮区域
            Row.justifyContent(FlexAlign.SpaceBetween);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 搜索框
            TextInput.create({ placeholder: '搜索商品...' });
            TextInput.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(335:9)", "entry");
            // 搜索框
            TextInput.type(InputType.Normal);
            // 搜索框
            TextInput.width('70%');
            // 搜索框
            TextInput.height(40);
            // 搜索框
            TextInput.fontSize(14);
            // 搜索框
            TextInput.backgroundColor('#F5F5F5');
            // 搜索框
            TextInput.onChange((value: string) => {
                this.handleSearch(value);
            });
            // 搜索框
            TextInput.onSubmit(() => {
                // 回车搜索
                this.handleSearch(this.searchKeyword);
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 排序按钮
            Button.createWithLabel('排序');
            Button.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(350:9)", "entry");
            // 排序按钮
            Button.fontSize(14);
            // 排序按钮
            Button.fontColor(Color.White);
            // 排序按钮
            Button.backgroundColor('#007DFF');
            // 排序按钮
            Button.height(40);
            // 排序按钮
            Button.width('25%');
            // 排序按钮
            Button.margin({ left: 10 });
            // 排序按钮
            Button.onClick(() => {
                this.openSortDialog();
            });
        }, Button);
        // 排序按钮
        Button.pop();
        // 搜索框和排序按钮区域
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 商品列表容器
            List.create({ space: commonConst.LIST_ITEM_SPACE });
            List.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(366:7)", "entry");
            // 商品列表容器
            List.width('100%');
            // 商品列表容器
            List.height('100%');
            // 商品列表容器
            List.edgeEffect(EdgeEffect.Spring);
            // 商品列表容器
            List.backgroundColor({ "id": 16777232, "type": 10001, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
        }, List);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 刷新提示放在列表顶部
            if (this.isRefreshing) {
                this.ifElseBranchUpdateFunction(0, () => {
                    {
                        const itemCreation = (elmtId, isInitialRender) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                            ListItem.create(deepRenderFunction, true);
                            if (!isInitialRender) {
                                ListItem.pop();
                            }
                            ViewStackProcessor.StopGetAccessRecording();
                        };
                        const itemCreation2 = (elmtId, isInitialRender) => {
                            ListItem.create(deepRenderFunction, true);
                            ListItem.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(369:11)", "entry");
                        };
                        const deepRenderFunction = (elmtId, isInitialRender) => {
                            itemCreation(elmtId, isInitialRender);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create();
                                Row.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(370:13)", "entry");
                                Row.width('100%');
                                Row.height(60);
                                Row.justifyContent(FlexAlign.Center);
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                // 刷新图标
                                Image.create({ "id": 16777295, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
                                Image.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(372:15)", "entry");
                                // 刷新图标
                                Image.width(commonConst.ICON_WIDTH);
                                // 刷新图标
                                Image.height(commonConst.ICON_HEIGHT);
                                // 刷新图标
                                Image.alignSelf(ItemAlign.Center);
                            }, Image);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                // 刷新状态文本
                                Text.create('正在刷新...');
                                Text.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(377:15)", "entry");
                                // 刷新状态文本
                                Text.fontSize(commonConst.NORMAL_FONT_SIZE);
                                // 刷新状态文本
                                Text.fontColor({ "id": 16777228, "type": 10001, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
                                // 刷新状态文本
                                Text.textAlign(TextAlign.Center);
                                // 刷新状态文本
                                Text.width('100%');
                            }, Text);
                            // 刷新状态文本
                            Text.pop();
                            Row.pop();
                            ListItem.pop();
                        };
                        this.observeComponentCreation2(itemCreation2, ListItem);
                        ListItem.pop();
                    }
                });
            }
            // 条件渲染：根据搜索模式显示不同的内容
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 条件渲染：根据搜索模式显示不同的内容
            if (this.isSearchMode) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        // 搜索模式下显示搜索结果
                        if (this.sortedSearchResults.length > 0) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    ForEach.create();
                                    const forEachItemGenFunction = _item => {
                                        const item = _item;
                                        {
                                            const itemCreation = (elmtId, isInitialRender) => {
                                                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                                ListItem.create(deepRenderFunction, true);
                                                if (!isInitialRender) {
                                                    ListItem.pop();
                                                }
                                                ViewStackProcessor.StopGetAccessRecording();
                                            };
                                            const itemCreation2 = (elmtId, isInitialRender) => {
                                                ListItem.create(deepRenderFunction, true);
                                                ListItem.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(394:15)", "entry");
                                            };
                                            const deepRenderFunction = (elmtId, isInitialRender) => {
                                                itemCreation(elmtId, isInitialRender);
                                                this.buildGoodsItem.bind(this)(item);
                                                ListItem.pop();
                                            };
                                            this.observeComponentCreation2(itemCreation2, ListItem);
                                            ListItem.pop();
                                        }
                                    };
                                    this.forEachUpdateFunction(elmtId, this.sortedSearchResults, forEachItemGenFunction, (item: GoodsListItemType) => item.id.toString(), false, false);
                                }, ForEach);
                                ForEach.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                {
                                    const itemCreation = (elmtId, isInitialRender) => {
                                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                        ListItem.create(deepRenderFunction, true);
                                        if (!isInitialRender) {
                                            // 搜索结果为空时的提示
                                            ListItem.pop();
                                        }
                                        ViewStackProcessor.StopGetAccessRecording();
                                    };
                                    const itemCreation2 = (elmtId, isInitialRender) => {
                                        ListItem.create(deepRenderFunction, true);
                                        ListItem.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(400:13)", "entry");
                                    };
                                    const deepRenderFunction = (elmtId, isInitialRender) => {
                                        itemCreation(elmtId, isInitialRender);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Column.create();
                                            Column.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(401:15)", "entry");
                                            Column.width('100%');
                                            Column.height('100%');
                                            Column.justifyContent(FlexAlign.Center);
                                            Column.alignItems(HorizontalAlign.Center);
                                        }, Column);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create('🔍');
                                            Text.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(402:17)", "entry");
                                            Text.fontSize(60);
                                            Text.margin({ bottom: 20 });
                                        }, Text);
                                        Text.pop();
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create('没有找到相关商品');
                                            Text.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(405:17)", "entry");
                                            Text.fontSize(commonConst.NORMAL_FONT_SIZE);
                                            Text.fontColor({ "id": 16777231, "type": 10001, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
                                            Text.margin({ bottom: 10 });
                                        }, Text);
                                        Text.pop();
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create('请尝试其他关键词');
                                            Text.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(409:17)", "entry");
                                            Text.fontSize(commonConst.GOODS_EVALUATE_FONT_SIZE);
                                            Text.fontColor({ "id": 16777228, "type": 10001, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
                                        }, Text);
                                        Text.pop();
                                        Column.pop();
                                        // 搜索结果为空时的提示
                                        ListItem.pop();
                                    };
                                    this.observeComponentCreation2(itemCreation2, ListItem);
                                    // 搜索结果为空时的提示
                                    ListItem.pop();
                                }
                            });
                        }
                    }, If);
                    If.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    {
                        const __lazyForEachItemGenFunction = (_item, index: number) => {
                            const item = _item;
                            {
                                const itemCreation2 = (elmtId, isInitialRender) => {
                                    ListItem.create(() => { }, false);
                                    ListItem.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(422:13)", "entry");
                                };
                                const observedDeepRender = () => {
                                    this.observeComponentCreation2(itemCreation2, ListItem);
                                    this.buildGoodsItem.bind(this)(item);
                                    ListItem.pop();
                                };
                                observedDeepRender();
                            }
                        };
                        const __lazyForEachItemIdFunc = (item: GoodsListItemType) => item.id.toString();
                        LazyForEach.create("1", this, this.goodsListData, __lazyForEachItemGenFunction, __lazyForEachItemIdFunc);
                        // 正常模式下使用懒加载方式渲染列表项
                        LazyForEach.pop();
                    }
                });
            }
        }, If);
        If.pop();
        {
            const itemCreation = (elmtId, isInitialRender) => {
                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                ListItem.create(deepRenderFunction, true);
                if (!isInitialRender) {
                    // 加载更多提示放在列表底部
                    ListItem.pop();
                }
                ViewStackProcessor.StopGetAccessRecording();
            };
            const itemCreation2 = (elmtId, isInitialRender) => {
                ListItem.create(deepRenderFunction, true);
                ListItem.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(429:9)", "entry");
            };
            const deepRenderFunction = (elmtId, isInitialRender) => {
                itemCreation(elmtId, isInitialRender);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(430:11)", "entry");
                    Column.width('100%');
                    Column.height(80);
                    Column.justifyContent(FlexAlign.Center);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    If.create();
                    if (this.isLoading) {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create('正在加载更多...');
                                Text.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(432:15)", "entry");
                                Text.fontSize(commonConst.NORMAL_FONT_SIZE);
                                Text.fontColor({ "id": 16777228, "type": 10001, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
                                Text.textAlign(TextAlign.Center);
                                Text.width('100%');
                            }, Text);
                            Text.pop();
                        });
                    }
                    else if (this.hasReachedBottom || this.sortedSearchResults.length <= 0) {
                        this.ifElseBranchUpdateFunction(1, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create({ "id": 16777283, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
                                Text.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(438:15)", "entry");
                                Text.fontSize(commonConst.NORMAL_FONT_SIZE);
                                Text.fontColor({ "id": 16777228, "type": 10001, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
                                Text.textAlign(TextAlign.Center);
                                Text.width('100%');
                            }, Text);
                            Text.pop();
                        });
                    }
                    else {
                        this.ifElseBranchUpdateFunction(2, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create('滑动加载更多');
                                Text.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(444:15)", "entry");
                                Text.fontSize(commonConst.NORMAL_FONT_SIZE);
                                Text.fontColor({ "id": 16777231, "type": 10001, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
                                Text.textAlign(TextAlign.Center);
                                Text.width('100%');
                            }, Text);
                            Text.pop();
                        });
                    }
                }, If);
                If.pop();
                Column.pop();
                // 加载更多提示放在列表底部
                ListItem.pop();
            };
            this.observeComponentCreation2(itemCreation2, ListItem);
            // 加载更多提示放在列表底部
            ListItem.pop();
        }
        // 商品列表容器
        List.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 排序弹窗
            if (this.showSortDialog) {
                this.ifElseBranchUpdateFunction(0, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new SortDialog(this, {
                                    isVisible: this.showSortDialog,
                                    currentSort: this.currentSortType,
                                    currentPriceFilter: this.currentPriceFilter,
                                    onSortSelected: (sortType: SortType, priceFilter?: PriceRangeFilter) => {
                                        this.handleSortSelect(sortType, priceFilter);
                                        this.closeSortDialog();
                                    },
                                    onClose: () => {
                                        this.closeSortDialog();
                                    }
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/GoodsListComponent.ets", line: 463, col: 9 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        isVisible: this.showSortDialog,
                                        currentSort: this.currentSortType,
                                        currentPriceFilter: this.currentPriceFilter,
                                        onSortSelected: (sortType: SortType, priceFilter?: PriceRangeFilter) => {
                                            this.handleSortSelect(sortType, priceFilter);
                                            this.closeSortDialog();
                                        },
                                        onClose: () => {
                                            this.closeSortDialog();
                                        }
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    isVisible: this.showSortDialog,
                                    currentSort: this.currentSortType,
                                    currentPriceFilter: this.currentPriceFilter
                                });
                            }
                        }, { name: "SortDialog" });
                    }
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        // 整体容器 - 垂直布局
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
