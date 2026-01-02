if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface GoodsList_Params {
    goodsListData?: ListDataSource;
    startTouchOffsetY?: number;
    endTouchOffsetY?: number;
    isLoading?: boolean;
    isRefreshing?: boolean;
    category?: string;
    searchResults?: GoodsListItemType[];
    isSearchMode?: boolean;
}
import * as commonConst from "@bundle:com.example.list_harmony/entry/ets/common/CommonConstants";
import type { GoodsListItemType } from '../viewmodel/InitialData';
import { ListDataSource } from "@bundle:com.example.list_harmony/entry/ets/viewmodel/ListDataSource";
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
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.__isRefreshing = new ObservedPropertySimplePU(false, this, "isRefreshing");
        this.__category = new SynchedPropertySimpleOneWayPU(params.category, this, "category");
        this.__searchResults = new SynchedPropertyObjectOneWayPU(params.searchResults, this, "searchResults");
        this.__isSearchMode = new SynchedPropertySimpleOneWayPU(params.isSearchMode, this, "isSearchMode");
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
        if (params.isRefreshing !== undefined) {
            this.isRefreshing = params.isRefreshing;
        }
        if (params.category === undefined) {
            this.__category.set('selected');
        }
        if (params.searchResults === undefined) {
            this.__searchResults.set([]);
        }
        if (params.isSearchMode === undefined) {
            this.__isSearchMode.set(false);
        }
    }
    updateStateVars(params: GoodsList_Params) {
        this.__category.reset(params.category);
        this.__searchResults.reset(params.searchResults);
        this.__isSearchMode.reset(params.isSearchMode);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__goodsListData.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__isRefreshing.purgeDependencyOnElmtId(rmElmtId);
        this.__category.purgeDependencyOnElmtId(rmElmtId);
        this.__searchResults.purgeDependencyOnElmtId(rmElmtId);
        this.__isSearchMode.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__goodsListData.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__isRefreshing.aboutToBeDeleted();
        this.__category.aboutToBeDeleted();
        this.__searchResults.aboutToBeDeleted();
        this.__isSearchMode.aboutToBeDeleted();
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
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
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
    // 搜索结果商品列表
    private __searchResults: SynchedPropertySimpleOneWayPU<GoodsListItemType[]>;
    get searchResults() {
        return this.__searchResults.get();
    }
    set searchResults(newValue: GoodsListItemType[]) {
        this.__searchResults.set(newValue);
    }
    // 是否为搜索模式
    private __isSearchMode: SynchedPropertySimpleOneWayPU<boolean>;
    get isSearchMode() {
        return this.__isSearchMode.get();
    }
    set isSearchMode(newValue: boolean) {
        this.__isSearchMode.set(newValue);
    }
    aboutToAppear() {
        // 当分类改变时，更新数据源
        this.goodsListData.setCategory(this.category);
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
    // 构建单个商品项
    buildGoodsItem(item: GoodsListItemType, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(68:5)", "entry");
            Row.justifyContent(FlexAlign.SpaceBetween);
            Row.height(commonConst.GOODS_LIST_HEIGHT);
            Row.width(commonConst.LAYOUT_WIDTH_OR_HEIGHT);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 商品图片区域
            Column.create();
            Column.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(70:7)", "entry");
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
            Image.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(71:9)", "entry");
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
            Column.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(84:7)", "entry");
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
            Text.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(86:9)", "entry");
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
            Text.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(94:9)", "entry");
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
            Row.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(102:9)", "entry");
            // 评价和价格信息行
            Row.justifyContent(FlexAlign.SpaceBetween);
            // 评价和价格信息行
            Row.width(commonConst.GOODS_LIST_WIDTH);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 评价信息
            Text.create(item?.evaluate);
            Text.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(104:11)", "entry");
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
            Text.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(112:11)", "entry");
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
    // 处理触摸事件（仅在非搜索模式下）
    private handleTouch(event?: TouchEvent) {
        // 搜索模式下不处理触摸事件
        if (this.isSearchMode) {
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
                if (this.startTouchOffsetY - this.endTouchOffsetY > 100 && !this.isLoading) {
                    this.isLoading = true;
                    this.goodsListData.pushData();
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 500);
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
            Row.create();
            Row.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(163:5)", "entry");
            Row.justifyContent(FlexAlign.Center);
            Row.width(commonConst.LAYOUT_WIDTH_OR_HEIGHT);
            Row.height('100%');
            Row.backgroundColor({ "id": 16777232, "type": 10001, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 如果是搜索模式且有搜索结果
            if (this.isSearchMode && this.searchResults.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 显示搜索结果
                        List.create({ space: commonConst.LIST_ITEM_SPACE });
                        List.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(167:9)", "entry");
                        // 显示搜索结果
                        List.width('100%');
                        // 显示搜索结果
                        List.height('100%');
                        // 显示搜索结果
                        List.edgeEffect(EdgeEffect.Spring);
                    }, List);
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
                                    ListItem.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(169:13)", "entry");
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
                        this.forEachUpdateFunction(elmtId, this.searchResults, forEachItemGenFunction, (item: GoodsListItemType) => item.id.toString(), false, false);
                    }, ForEach);
                    ForEach.pop();
                    // 显示搜索结果
                    List.pop();
                });
            }
            else if (this.isSearchMode && this.searchResults.length === 0) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 搜索模式但没有搜索结果
                        Column.create();
                        Column.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(179:9)", "entry");
                        // 搜索模式但没有搜索结果
                        Column.width('100%');
                        // 搜索模式但没有搜索结果
                        Column.height('100%');
                        // 搜索模式但没有搜索结果
                        Column.justifyContent(FlexAlign.Center);
                        // 搜索模式但没有搜索结果
                        Column.alignItems(HorizontalAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('🔍');
                        Text.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(180:11)", "entry");
                        Text.fontSize(60);
                        Text.margin({ bottom: 20 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('没有找到相关商品');
                        Text.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(183:11)", "entry");
                        Text.fontSize(commonConst.NORMAL_FONT_SIZE);
                        Text.fontColor({ "id": 16777231, "type": 10001, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
                        Text.margin({ bottom: 10 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('请尝试其他关键词');
                        Text.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(187:11)", "entry");
                        Text.fontSize(commonConst.GOODS_EVALUATE_FONT_SIZE);
                        Text.fontColor({ "id": 16777228, "type": 10001, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
                    }, Text);
                    Text.pop();
                    // 搜索模式但没有搜索结果
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 正常商品列表模式
                        List.create({ space: commonConst.LIST_ITEM_SPACE });
                        List.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(197:9)", "entry");
                        // 正常商品列表模式
                        List.width('100%');
                        // 正常商品列表模式
                        List.height('100%');
                        // 正常商品列表模式
                        List.edgeEffect(EdgeEffect.Spring);
                    }, List);
                    {
                        const __lazyForEachItemGenFunction = _item => {
                            const item = _item;
                            {
                                const itemCreation2 = (elmtId, isInitialRender) => {
                                    ListItem.create(() => { }, false);
                                    ListItem.onTouch((event?: TouchEvent) => {
                                        this.handleTouch(event);
                                    });
                                    ListItem.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(200:13)", "entry");
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
                        // 使用懒加载方式渲染列表项
                        LazyForEach.pop();
                    }
                    // 正常商品列表模式
                    List.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 状态提示信息
            Column.create();
            Column.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(215:7)", "entry");
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 刷新提示
            if (this.isRefreshing) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('正在刷新...');
                        Text.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(218:11)", "entry");
                        Text.fontSize(commonConst.NORMAL_FONT_SIZE);
                        Text.fontColor({ "id": 16777228, "type": 10001, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
                        Text.textAlign(TextAlign.Center);
                        Text.width('100%');
                        Text.margin({ top: 20, bottom: 20 });
                    }, Text);
                    Text.pop();
                });
            }
            // 加载更多提示（仅在非搜索模式下显示）
            else if (!this.isSearchMode) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.isLoading) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('正在加载更多...');
                                    Text.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(228:13)", "entry");
                                    Text.fontSize(commonConst.NORMAL_FONT_SIZE);
                                    Text.fontColor({ "id": 16777228, "type": 10001, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
                                    Text.textAlign(TextAlign.Center);
                                    Text.width('100%');
                                    Text.margin({ top: 20, bottom: 40 });
                                }, Text);
                                Text.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create({ "id": 16777283, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
                                    Text.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(235:13)", "entry");
                                    Text.fontSize(commonConst.NORMAL_FONT_SIZE);
                                    Text.fontColor({ "id": 16777228, "type": 10001, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
                                    Text.textAlign(TextAlign.Center);
                                    Text.width('100%');
                                    Text.margin({ top: 20, bottom: 40 });
                                }, Text);
                                Text.pop();
                            });
                        }
                    }, If);
                    If.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                });
            }
        }, If);
        If.pop();
        // 状态提示信息
        Column.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
