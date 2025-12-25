# Copilot / AI Agent 指南

下面是帮助 AI 编码代理（例如 Copilot/agents）在本仓库中快速上手并产出高质量改动的简明指引（简短、可操作，大约 20–40 行）。

## 项目一眼概览 🔧
- 本项目是一个 HarmonyOS（OpenHarmony）小程序示例：在 `entry/` 模块内实现了一个商品列表商城应用。
- 关键目录：
  - `entry/src/main/ets/` — 业务代码（`pages/`, `view/`, `viewmodel/`, `common/`, `entryability/`）
  - `entry/src/main/resources/` — 资源与本地化（`base/`, `en_US/`, `zh_CN/`）
  - `build/`、`entry/.preview/` — 构建与预览产物（**不要提交/修改这些生成文件**）

## 构建 / 运行 / 预览 🛠️
- 推荐使用 DevEco Studio 的 Preview 功能进行快速调试（项目使用 HarmonyOS 工具链）。
- 构建产物（.hap）位于：`build/outputs/default/entry-default-unsigned.hap`；预览缓存位于：`entry/.preview/`。
- hvigor 构建任务通过仓库根目录和 `entry/` 下的 `hvigorfile.ts`（分别导出 `appTasks` / `hapTasks`）定义；**不要修改这些导出行**（注释表明它们由插件提供）。

## 代码风格与约定 ✅
- UI 使用 ETS：组件通常以 `@Component` 和 `struct` 定义（参见 `ListIndex.ets`, `GoodsListComponent.ets`）。
- 全局常量和尺寸：见 `entry/src/main/ets/common/CommonConstants.ets`（例如 `GOODS_LIST_HEIGHT`, `STORE`）。
- 数据与懒加载：使用 `ListDataSource`（实现 `IDataSource`）配合 `LazyForEach` 懒加载（参见 `ListDataSource.ets`）。
- 资源读取：统一使用 `$r('app.string.xxx')` / `$r('app.media.xxx')` / `$r('app.color.xxx')`。
  - 新增资源必须同时维护 `zh_CN` 和 `en_US`（位于 `entry/src/main/resources/` 下）。
- 本仓库没有自动化测试（目前未见 `test` 目录或测试框架）；如果添加测试，说明运行方式并保持独立于生成产物。

## 常见变更示例（可直接作为提示） 💡
- 新标签页：修改 `InitialData.initTabBarData()`（`entry/src/main/ets/viewmodel/InitialData.ets`）并在 `TabBarsComponent.ets` 处理新分类 id。
- 添加商品图片/字符串：放入 `entry/src/main/resources/base/media` 或 `.../element/string.json`，并在两种语言的 `en_US` / `zh_CN` 中添加对应条目。
- 修改懒加载逻辑：优先修改 `ListDataSource.pushData()` 与 `getData()`，注意 `MAX_DATA_LENGTH` 和 `MAGNIFICATION` 的含义（见 `CommonConstants.ets`）。

## 调试与日志 🔍
- 日志使用 `hilog`（示例见 `EntryAbility.ets`，tag 为 `testTag`）；要定位运行时日志，可通过 `hilog` 过滤该 tag。
- UI 问题优先在 DevEco Studio Preview 验证，再在设备/模拟器上测试

## 安全与生成文件 ⚠️
- 不要手动修改 `build/`、`.preview/` 下的文件（它们是构建/预览产物）。
- `hvigorfile.ts` 中的 `export` 行来源于插件，避免修改导致构建异常。

## PR 指南给 AI 代理 🧭
- 在变更前运行一次本地构建/预览，验证视觉与关键路径（列表加载、下拉刷新、触底加载）。
- 修改资源时同时更新所有语言文件并确保 `$r('...')` key 无拼写错误。
- 小改动提交单个 PR，包含变更描述、复现步骤和预期结果截图（若涉及 UI）。

---
如果你希望我把某一节扩展为更详细的检查清单或补上缺失的运行命令示例（例如具体的 hvigor CLI 用法），告诉我你想要的深度，我可以把文件更新为更详尽的版本。✅
