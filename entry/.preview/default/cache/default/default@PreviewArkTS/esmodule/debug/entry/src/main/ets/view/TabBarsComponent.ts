if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface TabBar_Params {
    currentOffsetY?: number;
    timer?: number;
    tabsIndex?: number;
    refreshStatus?: boolean;
    refreshText?: Resource;
    pullDownOffset?: number;
    tabData?: Resource[];
    categoryList?: string[];
    searchKeyword?: string;
    isSearchMode?: boolean;
    searchResults?: GoodsListItemType[];
}
import { initTabBarData, CATEGORIES } from "@bundle:com.example.list_harmony/entry/ets/viewmodel/InitialData";
import type { GoodsListItemType } from "@bundle:com.example.list_harmony/entry/ets/viewmodel/InitialData";
import { searchGoodsByKeyword } from "@bundle:com.example.list_harmony/entry/ets/viewmodel/SearchUtils";
import { LAYOUT_WIDTH_OR_HEIGHT, NORMAL_FONT_SIZE, BIGGER_FONT_SIZE, MAX_OFFSET_Y, REFRESH_TIME, GOODS_EVALUATE_FONT_SIZE, MAX_LINES_TEXT } from "@bundle:com.example.list_harmony/entry/ets/common/CommonConstants";
import GoodsList from "@bundle:com.example.list_harmony/entry/ets/view/GoodsListComponent";
export default class TabBar extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.currentOffsetY = 0;
        this.timer = 0;
        this.__tabsIndex = new ObservedPropertySimplePU(0, this, "tabsIndex");
        this.__refreshStatus = new ObservedPropertySimplePU(false, this, "refreshStatus");
        this.__refreshText = new ObservedPropertyObjectPU({ "id": 16777280, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" }, this, "refreshText");
        this.__pullDownOffset = new ObservedPropertySimplePU(0, this, "pullDownOffset");
        this.__tabData = new ObservedPropertyObjectPU([], this, "tabData");
        this.categoryList = [
            CATEGORIES.SELECTED,
            CATEGORIES.MOBILE_PHONE,
            CATEGORIES.CLOTHES,
            CATEGORIES.WEAR,
            CATEGORIES.HOME_FURNISHING
        ];
        this.__searchKeyword = new ObservedPropertySimplePU('', this, "searchKeyword");
        this.__isSearchMode = new ObservedPropertySimplePU(false, this, "isSearchMode");
        this.__searchResults = new ObservedPropertyObjectPU([], this, "searchResults");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: TabBar_Params) {
        if (params.currentOffsetY !== undefined) {
            this.currentOffsetY = params.currentOffsetY;
        }
        if (params.timer !== undefined) {
            this.timer = params.timer;
        }
        if (params.tabsIndex !== undefined) {
            this.tabsIndex = params.tabsIndex;
        }
        if (params.refreshStatus !== undefined) {
            this.refreshStatus = params.refreshStatus;
        }
        if (params.refreshText !== undefined) {
            this.refreshText = params.refreshText;
        }
        if (params.pullDownOffset !== undefined) {
            this.pullDownOffset = params.pullDownOffset;
        }
        if (params.tabData !== undefined) {
            this.tabData = params.tabData;
        }
        if (params.categoryList !== undefined) {
            this.categoryList = params.categoryList;
        }
        if (params.searchKeyword !== undefined) {
            this.searchKeyword = params.searchKeyword;
        }
        if (params.isSearchMode !== undefined) {
            this.isSearchMode = params.isSearchMode;
        }
        if (params.searchResults !== undefined) {
            this.searchResults = params.searchResults;
        }
    }
    updateStateVars(params: TabBar_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__tabsIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__refreshStatus.purgeDependencyOnElmtId(rmElmtId);
        this.__refreshText.purgeDependencyOnElmtId(rmElmtId);
        this.__pullDownOffset.purgeDependencyOnElmtId(rmElmtId);
        this.__tabData.purgeDependencyOnElmtId(rmElmtId);
        this.__searchKeyword.purgeDependencyOnElmtId(rmElmtId);
        this.__isSearchMode.purgeDependencyOnElmtId(rmElmtId);
        this.__searchResults.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__tabsIndex.aboutToBeDeleted();
        this.__refreshStatus.aboutToBeDeleted();
        this.__refreshText.aboutToBeDeleted();
        this.__pullDownOffset.aboutToBeDeleted();
        this.__tabData.aboutToBeDeleted();
        this.__searchKeyword.aboutToBeDeleted();
        this.__isSearchMode.aboutToBeDeleted();
        this.__searchResults.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    // 记录当前触摸点Y坐标
    private currentOffsetY: number;
    // 刷新定时器
    private timer: number;
    // 当前标签页索引
    private __tabsIndex: ObservedPropertySimplePU<number>;
    get tabsIndex() {
        return this.__tabsIndex.get();
    }
    set tabsIndex(newValue: number) {
        this.__tabsIndex.set(newValue);
    }
    // 刷新状态标识
    private __refreshStatus: ObservedPropertySimplePU<boolean>;
    get refreshStatus() {
        return this.__refreshStatus.get();
    }
    set refreshStatus(newValue: boolean) {
        this.__refreshStatus.set(newValue);
    }
    // 刷新文本
    private __refreshText: ObservedPropertyObjectPU<Resource>;
    get refreshText() {
        return this.__refreshText.get();
    }
    set refreshText(newValue: Resource) {
        this.__refreshText.set(newValue);
    }
    // 下拉偏移量
    private __pullDownOffset: ObservedPropertySimplePU<number>;
    get pullDownOffset() {
        return this.__pullDownOffset.get();
    }
    set pullDownOffset(newValue: number) {
        this.__pullDownOffset.set(newValue);
    }
    // 标签页数据
    private __tabData: ObservedPropertyObjectPU<Resource[]>;
    get tabData() {
        return this.__tabData.get();
    }
    set tabData(newValue: Resource[]) {
        this.__tabData.set(newValue);
    }
    // 分类列表
    private categoryList: string[];
    // 搜索关键词
    private __searchKeyword: ObservedPropertySimplePU<string>;
    get searchKeyword() {
        return this.__searchKeyword.get();
    }
    set searchKeyword(newValue: string) {
        this.__searchKeyword.set(newValue);
    }
    // 是否显示搜索结果
    private __isSearchMode: ObservedPropertySimplePU<boolean>;
    get isSearchMode() {
        return this.__isSearchMode.get();
    }
    set isSearchMode(newValue: boolean) {
        this.__isSearchMode.set(newValue);
    }
    // 搜索结果商品列表
    private __searchResults: ObservedPropertyObjectPU<GoodsListItemType[]>;
    get searchResults() {
        return this.__searchResults.get();
    }
    set searchResults(newValue: GoodsListItemType[]) {
        this.__searchResults.set(newValue);
    }
    aboutToAppear() {
        // 初始化标签数据
        this.tabData = initTabBarData();
    }
    /**
     * 构建第一个标签页（默认选中标签）
     * 根据当前标签页索引调整字体大小和颜色
     */
    firstTabBar(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/view/TabBarsComponent.ets(79:5)", "entry");
            Column.width(LAYOUT_WIDTH_OR_HEIGHT);
            Column.height(LAYOUT_WIDTH_OR_HEIGHT);
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777281, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
            Text.debugLine("entry/src/main/ets/view/TabBarsComponent.ets(80:7)", "entry");
            Text.fontSize(this.tabsIndex === 0 ? BIGGER_FONT_SIZE : NORMAL_FONT_SIZE);
            Text.fontColor(this.tabsIndex === 0 ? Color.Black : { "id": 16777231, "type": 10001, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
            Text.maxLines(MAX_LINES_TEXT);
            Text.minFontSize(this.tabsIndex === 0 ? NORMAL_FONT_SIZE : GOODS_EVALUATE_FONT_SIZE);
            Text.maxFontSize(this.tabsIndex === 0 ? BIGGER_FONT_SIZE : NORMAL_FONT_SIZE);
        }, Text);
        Text.pop();
        Column.pop();
    }
    /**
     * 构建其他标签页
     * @param content 标签页内容
     * @param index 标签页索引
     */
    otherTabBar(content: Resource, index: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/view/TabBarsComponent.ets(101:5)", "entry");
            Column.width(LAYOUT_WIDTH_OR_HEIGHT);
            Column.height(LAYOUT_WIDTH_OR_HEIGHT);
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(content);
            Text.debugLine("entry/src/main/ets/view/TabBarsComponent.ets(102:7)", "entry");
            Text.fontSize(this.tabsIndex === index + 1 ? BIGGER_FONT_SIZE : NORMAL_FONT_SIZE);
            Text.fontColor(this.tabsIndex === index + 1 ? Color.Black : { "id": 16777231, "type": 10001, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
            Text.maxLines(MAX_LINES_TEXT);
            Text.minFontSize(this.tabsIndex === index + 1 ? NORMAL_FONT_SIZE : GOODS_EVALUATE_FONT_SIZE);
            Text.maxFontSize(this.tabsIndex === index + 1 ? BIGGER_FONT_SIZE : NORMAL_FONT_SIZE);
        }, Text);
        Text.pop();
        Column.pop();
    }
    /**
     * 构建下拉刷新组件
     */
    buildRefreshView(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/view/TabBarsComponent.ets(121:5)", "entry");
            Column.width('100%');
            Column.height(60);
            Column.offset({ y: this.pullDownOffset });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/view/TabBarsComponent.ets(122:7)", "entry");
            Row.justifyContent(FlexAlign.Center);
            Row.width('100%');
            Row.height(60);
            Row.backgroundColor({ "id": 16777233, "type": 10001, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777295, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/view/TabBarsComponent.ets(123:9)", "entry");
            Image.width(40);
            Image.height(40);
            Image.margin({ right: 20 });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.refreshText);
            Text.debugLine("entry/src/main/ets/view/TabBarsComponent.ets(127:9)", "entry");
            Text.fontSize(NORMAL_FONT_SIZE);
            Text.fontColor({ "id": 16777231, "type": 10001, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Row.pop();
        Column.pop();
    }
    /**
     * 处理下拉刷新逻辑
     * @param event 触摸事件
     */
    putDownRefresh(event?: TouchEvent): void {
        // 如果处于搜索模式，不处理下拉刷新
        if (this.isSearchMode) {
            return;
        }
        if (event === undefined) {
            return;
        }
        switch (event.type) {
            // 记录手指按下的y坐标
            case TouchType.Down:
                this.currentOffsetY = event.touches[0].y;
                break;
            case TouchType.Move:
                const moveY = event.touches[0].y;
                const deltaY = moveY - this.currentOffsetY;
                // 如果是向下滑动
                if (deltaY > 0) {
                    this.pullDownOffset = Math.min(deltaY, MAX_OFFSET_Y);
                    // 当下拉距离超过阈值时，显示刷新状态
                    if (deltaY > MAX_OFFSET_Y) {
                        this.refreshStatus = true;
                    }
                }
                break;
            case TouchType.Up:
                // 如果已经触发刷新状态
                if (this.refreshStatus) {
                    this.refreshText = { "id": 16777280, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
                    // 模拟刷新效果，不实际请求数据
                    this.timer = setTimeout(() => {
                        this.refreshStatus = false;
                        this.pullDownOffset = 0;
                        this.refreshText = { "id": 16777280, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" };
                    }, REFRESH_TIME);
                }
                else {
                    // 未触发刷新，回弹
                    this.pullDownOffset = 0;
                }
                break;
        }
    }
    /**
     * 处理搜索
     */
    private handleSearch(keyword: string) {
        this.searchKeyword = keyword;
        this.isSearchMode = keyword.length > 0;
        // 根据当前分类进行搜索
        const currentCategory = this.getCategoryByIndex(this.tabsIndex);
        if (this.isSearchMode) {
            // 使用搜索功能
            this.searchResults = searchGoodsByKeyword(currentCategory, keyword);
        }
        else {
            // 清空搜索结果
            this.searchResults = [];
        }
        console.log('搜索关键词:', keyword, '分类:', currentCategory, '结果数量:', this.searchResults.length);
    }
    /**
     * 根据索引获取分类
     * @param index 索引
     * @returns 分类名称
     */
    private getCategoryByIndex(index: number): string {
        if (index >= 0 && index < this.categoryList.length) {
            return this.categoryList[index];
        }
        return CATEGORIES.SELECTED;
    }
    /**
     * 组件销毁前清理工作
     * 清除刷新定时器
     */
    aboutToDisappear() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/view/TabBarsComponent.ets(234:5)", "entry");
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标签页容器
            Tabs.create();
            Tabs.debugLine("entry/src/main/ets/view/TabBarsComponent.ets(236:7)", "entry");
            // 标签页容器
            Tabs.onChange((index: number) => {
                this.tabsIndex = index;
                // 切换标签页时重置搜索状态
                this.searchKeyword = '';
                this.isSearchMode = false;
                this.searchResults = [];
                console.log('切换到标签页:', index);
            });
            // 标签页容器
            Tabs.vertical(false);
            // 标签页容器
            Tabs.barMode(BarMode.Fixed);
            // 标签页容器
            Tabs.barHeight(60);
            // 标签页容器
            Tabs.width('100%');
            // 标签页容器
            Tabs.height('100%');
        }, Tabs);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TabContent.create(() => {
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    // 使用Column包裹以便实现下拉刷新
                    Column.create();
                    Column.debugLine("entry/src/main/ets/view/TabBarsComponent.ets(240:11)", "entry");
                    // 使用Column包裹以便实现下拉刷新
                    Column.width('100%');
                    // 使用Column包裹以便实现下拉刷新
                    Column.height('100%');
                    // 使用Column包裹以便实现下拉刷新
                    Column.onTouch((event?: TouchEvent) => {
                        this.putDownRefresh(event);
                    });
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    If.create();
                    // 下拉刷新区域（仅在非搜索模式下显示）
                    if (!this.isSearchMode && (this.refreshStatus || this.pullDownOffset > 0)) {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.buildRefreshView.bind(this)();
                        });
                    }
                    // 商品列表组件（精选页）
                    else {
                        this.ifElseBranchUpdateFunction(1, () => {
                        });
                    }
                }, If);
                If.pop();
                {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        if (isInitialRender) {
                            let componentCall = new 
                            // 商品列表组件（精选页）
                            GoodsList(this, {
                                category: this.getCategoryByIndex(0)
                            }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/TabBarsComponent.ets", line: 247, col: 13 });
                            ViewPU.create(componentCall);
                            let paramsLambda = () => {
                                return {
                                    category: this.getCategoryByIndex(0)
                                };
                            };
                            componentCall.paramsGenerator_ = paramsLambda;
                        }
                        else {
                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                category: this.getCategoryByIndex(0)
                            });
                        }
                    }, { name: "GoodsList" });
                }
                // 使用Column包裹以便实现下拉刷新
                Column.pop();
            });
            TabContent.tabBar({ builder: this.firstTabBar.bind(this) });
            TabContent.debugLine("entry/src/main/ets/view/TabBarsComponent.ets(238:9)", "entry");
        }, TabContent);
        TabContent.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 循环创建其他标签页
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const item = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    TabContent.create(() => {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Column.create();
                            Column.debugLine("entry/src/main/ets/view/TabBarsComponent.ets(263:13)", "entry");
                            Column.width('100%');
                            Column.height('100%');
                        }, Column);
                        {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                if (isInitialRender) {
                                    let componentCall = new 
                                    // 商品列表组件（其他分类页）
                                    // 使用索引+1来对应分类数组中的位置
                                    GoodsList(this, {
                                        category: this.getCategoryByIndex(index + 1)
                                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/TabBarsComponent.ets", line: 266, col: 15 });
                                    ViewPU.create(componentCall);
                                    let paramsLambda = () => {
                                        return {
                                            category: this.getCategoryByIndex(index + 1)
                                        };
                                    };
                                    componentCall.paramsGenerator_ = paramsLambda;
                                }
                                else {
                                    this.updateStateVarsOfChildByElmtId(elmtId, {
                                        category: this.getCategoryByIndex(index + 1)
                                    });
                                }
                            }, { name: "GoodsList" });
                        }
                        Column.pop();
                    });
                    TabContent.tabBar({ builder: () => {
                            this.otherTabBar.call(this, item, index);
                        } });
                    TabContent.debugLine("entry/src/main/ets/view/TabBarsComponent.ets(262:11)", "entry");
                }, TabContent);
                TabContent.pop();
            };
            this.forEachUpdateFunction(elmtId, this.tabData, forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        // 循环创建其他标签页
        ForEach.pop();
        // 标签页容器
        Tabs.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
