if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface SearchBox_Params {
    searchText?: string;
    callback?: GeneratedTypeLiteralInterface_1;
    placeholder?: string;
}
import { LAYOUT_WIDTH_OR_HEIGHT, NORMAL_FONT_SIZE, GOODS_EVALUATE_FONT_SIZE, SEARCH_HEIGHT, SEARCH_MARGIN } from "@bundle:com.example.list_harmony/entry/ets/common/CommonConstants";
/**
 * 搜索框组件
 * 支持搜索文本输入、清除、搜索等功能
 */
interface GeneratedTypeLiteralInterface_1 {
    onSearch: (keyword: string) => void;
}
export default class SearchBox extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__searchText = new ObservedPropertySimplePU('', this, "searchText");
        this.__callback = new SynchedPropertyObjectOneWayPU(params.callback, this, "callback");
        this.__placeholder = new SynchedPropertySimpleOneWayPU(params.placeholder, this, "placeholder");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: SearchBox_Params) {
        if (params.searchText !== undefined) {
            this.searchText = params.searchText;
        }
        if (params.placeholder === undefined) {
            this.__placeholder.set('请输入搜索关键词');
        }
    }
    updateStateVars(params: SearchBox_Params) {
        this.__callback.reset(params.callback);
        this.__placeholder.reset(params.placeholder);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__searchText.purgeDependencyOnElmtId(rmElmtId);
        this.__callback.purgeDependencyOnElmtId(rmElmtId);
        this.__placeholder.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__searchText.aboutToBeDeleted();
        this.__callback.aboutToBeDeleted();
        this.__placeholder.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    // 搜索文本
    private __searchText: ObservedPropertySimplePU<string>;
    get searchText() {
        return this.__searchText.get();
    }
    set searchText(newValue: string) {
        this.__searchText.set(newValue);
    }
    // 搜索回调函数
    private __callback?: SynchedPropertySimpleOneWayPU<GeneratedTypeLiteralInterface_1>;
    get callback() {
        return this.__callback.get();
    }
    set callback(newValue: GeneratedTypeLiteralInterface_1) {
        this.__callback.set(newValue);
    }
    // 占位符文本
    private __placeholder: SynchedPropertySimpleOneWayPU<string>;
    get placeholder() {
        return this.__placeholder.get();
    }
    set placeholder(newValue: string) {
        this.__placeholder.set(newValue);
    }
    /**
     * 处理搜索
     */
    private handleSearch() {
        if (this.searchText.trim() && this.callback?.onSearch) {
            this.callback.onSearch(this.searchText.trim());
        }
    }
    /**
     * 清除搜索文本
     */
    private clearSearch() {
        this.searchText = '';
        if (this.callback?.onSearch) {
            this.callback.onSearch('');
        }
    }
    /**
     * 构建清除按钮
     */
    buildClearButton(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.searchText.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/view/SearchBoxComponent.ets(67:7)", "entry");
                        Context.animation({
                            duration: 200,
                            curve: Curve.EaseOut
                        });
                        Row.width(20);
                        Row.height(20);
                        Row.justifyContent(FlexAlign.Center);
                        Row.alignItems(VerticalAlign.Center);
                        Row.backgroundColor({ "id": 16777298, "type": 10001, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
                        Row.borderRadius(10);
                        Row.onClick(() => this.clearSearch());
                        Context.animation(null);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('×');
                        Text.debugLine("entry/src/main/ets/view/SearchBoxComponent.ets(68:9)", "entry");
                        Text.fontSize(18);
                        Text.fontColor({ "id": 16777233, "type": 10001, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
                        Text.fontWeight(FontWeight.Bold);
                    }, Text);
                    Text.pop();
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 搜索框容器
            Column.create();
            Column.debugLine("entry/src/main/ets/view/SearchBoxComponent.ets(89:5)", "entry");
            // 搜索框容器
            Column.width(LAYOUT_WIDTH_OR_HEIGHT);
            // 搜索框容器
            Column.padding({ top: 12, left: 16, right: 16, bottom: 8 });
            // 搜索框容器
            Column.backgroundColor({ "id": 16777302, "type": 10001, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 搜索框顶部区域（搜索输入框和搜索按钮）
            Row.create();
            Row.debugLine("entry/src/main/ets/view/SearchBoxComponent.ets(91:7)", "entry");
            // 搜索框顶部区域（搜索输入框和搜索按钮）
            Row.width('100%');
            // 搜索框顶部区域（搜索输入框和搜索按钮）
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 搜索输入框
            Row.create();
            Row.debugLine("entry/src/main/ets/view/SearchBoxComponent.ets(93:9)", "entry");
            Context.animation({
                duration: 300,
                curve: Curve.EaseOut
            });
            // 搜索输入框
            Row.height(SEARCH_HEIGHT);
            // 搜索输入框
            Row.padding({ left: 12, right: 12 });
            // 搜索输入框
            Row.backgroundColor({ "id": 16777301, "type": 10001, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
            // 搜索输入框
            Row.borderRadius(20);
            // 搜索输入框
            Row.layoutWeight(1);
            Context.animation(null);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 搜索输入框
            TextInput.create({
                text: this.searchText,
                placeholder: this.placeholder
            });
            TextInput.debugLine("entry/src/main/ets/view/SearchBoxComponent.ets(95:11)", "entry");
            // 搜索输入框
            TextInput.fontSize(NORMAL_FONT_SIZE);
            // 搜索输入框
            TextInput.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
            // 搜索输入框
            TextInput.backgroundColor(Color.Transparent);
            // 搜索输入框
            TextInput.borderRadius(0);
            // 搜索输入框
            TextInput.layoutWeight(1);
            // 搜索输入框
            TextInput.maxLines(1);
            // 搜索输入框
            TextInput.onChange((value: string) => {
                this.searchText = value;
            });
            // 搜索输入框
            TextInput.onSubmit(() => {
                this.handleSearch();
            });
            // 搜索输入框
            TextInput.placeholderFont({ size: GOODS_EVALUATE_FONT_SIZE });
            // 搜索输入框
            TextInput.placeholderColor({ "id": 16777299, "type": 10001, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
        }, TextInput);
        // 清除按钮
        this.buildClearButton.bind(this)();
        // 搜索输入框
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 搜索按钮
            Row.create();
            Row.debugLine("entry/src/main/ets/view/SearchBoxComponent.ets(128:9)", "entry");
            Context.animation({
                duration: 200,
                curve: Curve.EaseOut
            });
            // 搜索按钮
            Row.height(SEARCH_HEIGHT);
            // 搜索按钮
            Row.padding({ left: 16, right: 16 });
            // 搜索按钮
            Row.backgroundColor({ "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
            // 搜索按钮
            Row.borderRadius(20);
            // 搜索按钮
            Row.margin({ left: SEARCH_MARGIN });
            // 搜索按钮
            Row.onClick(() => this.handleSearch());
            Context.animation(null);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('搜索');
            Text.debugLine("entry/src/main/ets/view/SearchBoxComponent.ets(129:11)", "entry");
            Text.fontSize(GOODS_EVALUATE_FONT_SIZE);
            Text.fontColor(Color.White);
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        // 搜索按钮
        Row.pop();
        // 搜索框顶部区域（搜索输入框和搜索按钮）
        Row.pop();
        // 搜索框容器
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
