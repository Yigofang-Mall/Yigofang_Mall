if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ListIndex_Params {
}
import TabBar from "@bundle:com.example.list_harmony/entry/ets/view/TabBarsComponent";
import { LAYOUT_WIDTH_OR_HEIGHT, STORE } from "@bundle:com.example.list_harmony/entry/ets/common/CommonConstants";
class ListIndex extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ListIndex_Params) {
    }
    updateStateVars(params: ListIndex_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 主布局行
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/ListIndex.ets(28:5)", "entry");
            // 主布局行
            Row.height(LAYOUT_WIDTH_OR_HEIGHT);
            // 主布局行
            Row.backgroundColor({ "id": 16777243, "type": 10001, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
            // 主布局行
            Row.padding({
                top: AppStorage.get<number>('statusBarHeight')
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 导航容器
            Navigation.create(new NavPathStack(), { moduleName: "entry", pagePath: "entry/src/main/ets/pages/ListIndex", isUserCreateStack: false });
            Navigation.debugLine("entry/src/main/ets/pages/ListIndex.ets(30:7)", "entry");
            // 导航容器
            Navigation.size({ width: LAYOUT_WIDTH_OR_HEIGHT, height: LAYOUT_WIDTH_OR_HEIGHT });
            // 导航容器
            Navigation.title(STORE);
            // 导航容器
            Navigation.titleMode(NavigationTitleMode.Mini);
        }, Navigation);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 内容列布局
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/ListIndex.ets(32:9)", "entry");
            // 内容列布局
            Column.width(LAYOUT_WIDTH_OR_HEIGHT);
            // 内容列布局
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // 标签页组件
                    TabBar(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/ListIndex.ets", line: 34, col: 11 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {};
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {});
                }
            }, { name: "TabBar" });
        }
        // 内容列布局
        Column.pop();
        // 导航容器
        Navigation.pop();
        // 主布局行
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "ListIndex";
    }
}
registerNamedRoute(() => new ListIndex(undefined, {}), "", { bundleName: "com.example.list_harmony", moduleName: "entry", pagePath: "pages/ListIndex", pageFullPath: "entry/src/main/ets/pages/ListIndex", integratedHsp: "false", moduleType: "followWithHap" });
