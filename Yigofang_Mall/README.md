# Yigofang_Mall

移动互联网编程实践 大作业-常规选题-商城

## 项目结构概述

```
Yigofang_Mall/
├── AppScope/                 # 全局资源目录
│   └── resources/            # 全局资源配置
├── entry/                    # 主模块目录
│   ├── src/main/             # 主代码目录
│   │   ├── ets/              # ets代码目录
│   │   │   ├── common/       # 公共常量定义
│   │   │   ├── entryability/ # 应用入口组件
│   │   │   ├── pages/        # 页面组件
│   │   │   ├── view/         # 视图组件
│   │   │   └── viewmodel/    # 数据模型
│   │   └── resources/        # 资源目录
│   └── hvigorfile.ts         # 构建脚本
├── README.md                 # 项目说明文档
└── hvigorfile.ts             # 根目录构建脚本
```

### 主要功能模块：

1. 商品列表展示：通过LazyForEach实现商品列表的懒加载渲染
2. 下拉刷新：在列表顶部下拉一定距离触发刷新效果
3. 触底加载：滚动到底部时自动加载更多商品数据
4. 分类标签页：使用Tabs组件实现不同商品分类的切换

### 核心组件：

- `ListIndex.ets`: 应用主页面，包含导航栏和标签页
- `TabBarsComponent.ets`: 标签页组件，实现分类切换功能
- `GoodsListComponent.ets`: 商品列表组件，展示商品信息
- `PutDownRefreshLayout.ets`: 下拉刷新组件
- `InitialData.ets`: 初始化数据和数据模型定义
- `ListDataSource.ets`: 列表数据源管理，支持懒加载和动态添加数据
- `CommonConstants.ets`: 全局常量定义

