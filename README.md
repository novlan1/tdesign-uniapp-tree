# tdesign-uniapp-tree

基于 Vue3 + uni-app 的树形选择器组件，支持多选/单选/搜索/懒加载/拖拽排序等。配合 `@tdesign/uniapp` 使用。

## 特性

- 🎯 **单选 / 多选** — 支持 radio、checkbox 两种选择模式
- 🔍 **多种搜索模式** — 普通搜索、从属高亮（depHighlight）、层级关联（hierarchy）、远程搜索（remote）
- 🌳 **父子级联** — 支持 checkStrictly 独立选择 / 强弱关联模式
- 📦 **异步加载** — 支持 loadData 异步/同步加载子节点
- 🖱 **拖拽排序** — 支持节点拖拽重新排序
- 🎨 **主题定制** — themeColor 一键切换主题颜色
- 📄 **弹窗 / 页面模式** — uiMode 支持 popup 弹窗和 page 整页两种展示
- 📐 **辅助线** — showAuxiliaryLine 开启精美辅助线
- ♻️ **大数据支持** — 子节点按需渲染 + expandedMode=singe 单链路展开

## 安装

```bash
npm install tdesign-uniapp-tree @tdesign/uniapp
```

在 `pages.json` 中配置 easycom 自动注册：

```json
{
  "easycom": {
    "autoscan": true,
    "custom": {
      "^t-(.*)": "@tdesign/uniapp/$1/$1.vue",
      "tdesign-uniapp-tree": "tdesign-uniapp-tree/tdesign-uniapp-tree/tdesign-uniapp-tree.vue"
    }
  }
}
```

## 快速上手

### 基础单选

```vue
<template>
  <tdesign-uniapp-tree
    ref="treeRef"
    funcMode="radio"
    :treeData="treeData"
    @confirm="onConfirm"
  />
</template>

<script setup>
import { ref } from 'vue';

const treeRef = ref();
const treeData = ref([
  { id: '1', label: '北京' },
  {
    id: '2', label: '上海',
    children: [
      { id: '2-1', label: '浦东新区' },
      { id: '2-2', label: '黄浦区' },
    ],
  },
  {
    id: '3', label: '广州',
    children: [
      { id: '3-1', label: '海珠区' },
      { id: '3-2', label: '番禺区' },
    ],
  },
]);

function open() {
  treeRef.value.showTree = true;
}

function onConfirm(list) {
  console.log('选中项：', list);
}
</script>
```

### 多选 + 父子级联

```vue
<tdesign-uniapp-tree
  ref="treeRef"
  funcMode="checkbox"
  :selectParent="true"
  :checkStrictly="true"
  :treeData="treeData"
  @confirm="onConfirm"
/>
```

### 搜索模式

```vue
<tdesign-uniapp-tree
  ref="treeRef"
  funcMode="radio"
  :ifSearch="true"
  searchModel="depHighlight"
  :treeData="treeData"
/>
```

### 异步加载

```vue
<tdesign-uniapp-tree
  ref="treeRef"
  funcMode="checkbox"
  :treeData="asyncTreeData"
  :loadData="loadData"
/>

<script setup>
const asyncTreeData = ref([
  { id: 'a1', label: '节点A', children: [] },
  { id: 'b1', label: '节点B', children: [] },
]);

function loadData(data) {
  const { $type: type, source } = data;
  if (type === 'nodeLoad') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: `${source.id}-1`, label: `${source.label}-子项1` },
          { id: `${source.id}-2`, label: `${source.label}-子项2` },
        ]);
      }, 1000);
    });
  }
}
</script>
```

### 默认回显

通过在 `treeData` 中设置 `checked: true` 来实现默认选中：

```js
const treeData = ref([
  { id: '1', label: '北京' },
  {
    id: '2', label: '上海',
    children: [
      { id: '2-1', label: '浦东新区', checked: true },
      { id: '2-2', label: '黄浦区' },
    ],
  },
]);
```

### 页面模式

```vue
<tdesign-uniapp-tree
  uiMode="page"
  funcMode="checkbox"
  :selectParent="true"
  :treeData="treeData"
  @confirm="onConfirm"
/>
```

## Demo 项目结构

本仓库的 `src/pages/` 即完整的示例项目，采用 `@tdesign/uniapp` 内置的 `t-demo` / `t-demo-header` 组件组织展示。

```
src/pages/
├── index/
│   ├── index.vue                      ← 主入口页（t-demo 模式）
│   └── _example/
│       ├── tree-data.js               ← 公共树数据
│       ├── base/index.vue             ← 基础用法（单选/多选）
│       ├── select-parent/index.vue    ← 父级可选配置
│       ├── echo-default/index.vue     ← 默认回显
│       ├── search-mode/index.vue      ← 搜索模式
│       ├── expanded/index.vue         ← 展开模式配置
│       ├── draggable/index.vue        ← 拖拽排序
│       ├── async-load/index.vue       ← 异步加载
│       ├── theme/index.vue            ← 主题颜色
│       └── page-mode/index.vue        ← 页面模式入口
└── tree-page/
    └── index.vue                      ← 页面模式示例
```

运行示例：

```bash
# H5
pnpm dev:h5

# 微信小程序
pnpm dev:mp-weixin

# App
pnpm dev:app
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 | 可选值 |
| --- | --- | --- | --- | --- |
| uiMode | UI 展示方式 | String | `popup` | `page` |
| funcMode | 功能模式 | String | `radio` | `checkbox` / `display` / `edit` |
| treeData | 树数据源 | Array | `[]` | - |
| valueKey | 节点唯一标识 key | String | `id` | - |
| labelKey | 显示文本 key | String | `label` | - |
| disabledKey | 禁用属性 key | String | `disabled` | - |
| childrenKey | 子节点属性 key（值为 `null` 时表示无子节点的父节点） | String | `children` | - |
| title | 弹窗标题，支持函数 `(checked) => string` | String / Function | `''` | - |
| selectParent | 是否允许选中父级节点 | Boolean | `false` | `true` |
| foldAll | 折叠时关闭所有已展开子级 | Boolean | `false` | `true` |
| themeColor | 主题颜色 | String | `#f9ae3d` | - |
| cancelColor | 取消按钮颜色 | String | `#757575` | - |
| titleColor | 标题颜色 | String | `#757575` | - |
| border | 是否显示分割线 | Boolean | `false` | `true` |
| checkStrictly | 父子节点选中状态是否关联（checkbox 模式） | Boolean | `false` | `true` |
| checkStrictlyModel | 关联模式：`weak` 弱关联（受 disabled 控制）/ `strong` 强关联 | String | `weak` | `strong` |
| showHalfCheckedTips | 是否显示半选提示（checkbox 模式） | Boolean | `false` | `true` |
| ifSearch | 是否开启搜索 | Boolean | `true` | `false` |
| searchModel | 搜索模式 | String | `common` | `depHighlight` / `hierarchy` / `remote` |
| showAuxiliaryLine | 是否显示辅助线 | Boolean | `false` | `true` |
| loadData | 异步加载函数 `(node) => Promise<childData[]>` | Function | - | - |
| height | 弹窗容器高度（仅 popup 模式） | Number | `500` | - |
| changeVerify | 选择验证函数 `(current, chooseList) => string \| void` | Function | - | - |
| expandedKeys | 默认展开的节点 key 列表 | Array | `[]` | - |
| expandedMode | 展开模式：`common` 一般 / `singe` 单链路 | String | `common` | `singe` |
| keepAlive | 是否开启缓存模式 | Boolean | `false` | `true` |
| draggable | 是否开启拖拽排序 | Boolean | `false` | `true` |
| expandIcon | 展开 icon | String | `''` | - |
| retractIcon | 收起 icon | String | `''` | - |
| lastIcon | 叶子节点 icon | String | `''` | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| confirm | 确认选择时触发 | `(list: Array)` |
| change | 选项变化时触发 | `(list: Array)` |
| cancel | 取消/关闭时触发 | `(type: 'masktap' \| 'cancel')` |
| clear | 清除选择时触发 | - |

### Slots

| 名称 | 说明 | 参数 |
| --- | --- | --- |
| label | 自定义节点内容 | `{ data }` 当前节点数据 |
| topBar | 滚动区域顶部插槽 | - |
| bottomBar | 滚动区域底部插槽 | - |
| fixedBottomBar | 固定底部插槽（fixed 定位） | - |
| empty | 数据为空时的插槽 | - |
| expandIcon | 展开 icon 插槽 | - |
| retractIcon | 收起 icon 插槽 | - |

### Methods

通过 `ref` 调用：

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| showTree | 打开/关闭树（直接赋值 `true` / `false`） | - |
| checkedFunc | 手动选中/取消节点 | `(id: string, checked?: boolean)` |

## 兼容性

- ✅ uni-app / uni-app X
- ✅ Vue 3
- ✅ H5 / 微信小程序 / App

## License

[MIT](./LICENSE)
