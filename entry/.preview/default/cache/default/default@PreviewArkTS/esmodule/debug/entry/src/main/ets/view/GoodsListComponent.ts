if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface GoodsList_Params {
    categoryId?: number;
    goodsListData?: ListDataSource;
    startTouchOffsetY?: number;
    endTouchOffsetY?: number;
    isLoading?: boolean;
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
        this.__categoryId = new SynchedPropertySimpleOneWayPU(params.categoryId, this, "categoryId");
        this.__goodsListData = new ObservedPropertyObjectPU(new ListDataSource(this.categoryId), this, "goodsListData");
        this.addProvidedVar("goodsListData", this.__goodsListData, false);
        this.startTouchOffsetY = 0;
        this.endTouchOffsetY = 0;
        this.isLoading = false;
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
    }
    updateStateVars(params: GoodsList_Params) {
        this.__categoryId.reset(params.categoryId);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__categoryId.purgeDependencyOnElmtId(rmElmtId);
        this.__goodsListData.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__categoryId.aboutToBeDeleted();
        this.__goodsListData.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    // 接收分类ID参数
    private __categoryId: SynchedPropertySimpleOneWayPU<number>;
    get categoryId() {
        return this.__categoryId.get();
    }
    set categoryId(newValue: number) {
        this.__categoryId.set(newValue);
    }
    // 根据分类过滤数据源
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
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(40:5)", "entry");
            Row.justifyContent(FlexAlign.Center);
            Row.width(commonConst.LAYOUT_WIDTH_OR_HEIGHT);
            Row.height('100%');
            Row.backgroundColor({ "id": 16777243, "type": 10001, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 商品列表容器
            List.create({ space: commonConst.LIST_ITEM_SPACE });
            List.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(42:7)", "entry");
            // 商品列表容器
            List.width('100%');
            // 商品列表容器
            List.height('100%');
            // 商品列表容器
            List.edgeEffect(EdgeEffect.Spring);
        }, List);
        {
            const __lazyForEachItemGenFunction = (_item, index: number) => {
                const item = _item;
                {
                    const itemCreation2 = (elmtId, isInitialRender) => {
                        ListItem.create(() => { }, false);
                        ListItem.onTouch((event?: TouchEvent) => {
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
                                    break;
                            }
                        });
                        ListItem.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(45:11)", "entry");
                    };
                    const observedDeepRender = () => {
                        this.observeComponentCreation2(itemCreation2, ListItem);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            // 单个商品项布局
                            Row.create();
                            Row.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(47:13)", "entry");
                            // 单个商品项布局
                            Row.justifyContent(FlexAlign.SpaceBetween);
                            // 单个商品项布局
                            Row.height(commonConst.GOODS_LIST_HEIGHT);
                            // 单个商品项布局
                            Row.width(commonConst.LAYOUT_WIDTH_OR_HEIGHT);
                        }, Row);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            // 商品图片区域
                            Column.create();
                            Column.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(49:15)", "entry");
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
                            Image.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(50:17)", "entry");
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
                            Column.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(63:15)", "entry");
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
                            Text.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(65:17)", "entry");
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
                            Text.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(73:17)", "entry");
                            // 广告语
                            Text.fontColor({ "id": 16777242, "type": 10001, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
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
                            Row.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(81:17)", "entry");
                            // 评价和价格信息行
                            Row.justifyContent(FlexAlign.SpaceBetween);
                            // 评价和价格信息行
                            Row.width(commonConst.GOODS_LIST_WIDTH);
                        }, Row);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            // 评价信息
                            Text.create(item?.evaluate);
                            Text.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(83:19)", "entry");
                            // 评价信息
                            Text.fontSize(commonConst.GOODS_EVALUATE_FONT_SIZE);
                            // 评价信息
                            Text.fontColor({ "id": 16777240, "type": 10001, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
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
                            Text.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(91:19)", "entry");
                            // 价格信息（红色突出显示）
                            Text.fontSize(commonConst.NORMAL_FONT_SIZE);
                            // 价格信息（红色突出显示）
                            Text.fontColor({ "id": 16777241, "type": 10001, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
                            // 价格信息（红色突出显示）
                            Text.fontWeight(FontWeight.Bold);
                        }, Text);
                        // 价格信息（红色突出显示）
                        Text.pop();
                        // 评价和价格信息行
                        Row.pop();
                        // 商品信息区域
                        Column.pop();
                        // 单个商品项布局
                        Row.pop();
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
        // 商品列表容器
        List.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 加载更多提示
            if (this.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('正在加载更多...');
                        Text.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(142:9)", "entry");
                        Text.fontSize(commonConst.NORMAL_FONT_SIZE);
                        Text.fontColor({ "id": 16777242, "type": 10001, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
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
                        Text.create({ "id": 16777236, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
                        Text.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(149:9)", "entry");
                        Text.fontSize(commonConst.NORMAL_FONT_SIZE);
                        Text.fontColor({ "id": 16777242, "type": 10001, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
                        Text.textAlign(TextAlign.Center);
                        Text.width('100%');
                        Text.margin({ top: 20, bottom: 40 });
                    }, Text);
                    Text.pop();
                });
            }
        }, If);
        If.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
