/**
 * copy-to-starter 脚本
 *
 * 将 tdesign-uniapp-tree 的组件和示例复制到 tdesign-uniapp-starter-vue3-hx 项目中，
 * 以便在 HBuilderX 中上传插件、查看示例等。
 *
 * 参考 tdesign-miniprogram 的 publish-tdesign-uniapp 脚本实现。
 *
 * 用法：node scripts/copy-to-starter.js
 */
const fs = require('fs');
const path = require('path');

// ============ 路径配置 ============
const PROJECT_ROOT = path.resolve(__dirname, '..');
const STARTER_ROOT = path.resolve(PROJECT_ROOT, '../tdesign-uniapp-starter-vue3-hx');

// 源路径
const COMPONENT_SOURCE = path.resolve(PROJECT_ROOT, 'src/components/tdesign-uniapp-tree');
const EXAMPLE_SOURCE = path.resolve(PROJECT_ROOT, 'src/pages/index');
const TREE_PAGE_SOURCE = path.resolve(PROJECT_ROOT, 'src/pages/tree-page');
const STYLE_SOURCE = path.resolve(PROJECT_ROOT, 'src/style');

// 目标路径
const UNI_MODULES_DIR = path.resolve(STARTER_ROOT, 'uni_modules/tdesign-uniapp-tree');
const COMPONENT_TARGET = path.resolve(UNI_MODULES_DIR, 'components/tdesign-uniapp-tree');
const EXAMPLE_TARGET = path.resolve(STARTER_ROOT, 'pages-more/tdesign-uniapp-tree');
const TREE_PAGE_TARGET = path.resolve(STARTER_ROOT, 'pages-more/tdesign-uniapp-tree-page');

// 需要排除的文件/目录
const EXCLUDE_LIST = ['node_modules', '.DS_Store'];

// ============ 工具函数 ============

/**
 * 递归删除目录
 */
function deleteFolder(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  fs.rmSync(dirPath, { recursive: true, force: true });
  console.log(`  [Clean] 已删除: ${dirPath}`);
}

/**
 * 递归复制目录
 */
function copyDir(src, dest) {
  let count = 0;
  if (!fs.existsSync(src)) {
    console.warn(`  [Warn] 源目录不存在: ${src}`);
    return count;
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  fs.mkdirSync(dest, { recursive: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (EXCLUDE_LIST.some((ex) => entry.name === ex)) {
      continue;
    }

    if (entry.isDirectory()) {
      count += copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      count++;
    }
  }

  return count;
}

/**
 * 复制单个文件
 */
function copyFile(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`  [Warn] 源文件不存在: ${src}`);
    return false;
  }
  const destDir = path.dirname(dest);
  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(src, dest);
  return true;
}

/**
 * 递归替换文件内容中的路径引用
 */
function replaceInFiles(dir, replacements) {
  if (!fs.existsSync(dir)) return;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      replaceInFiles(fullPath, replacements);
    } else if (/\.(vue|js|ts|less|css|scss)$/.test(entry.name)) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let changed = false;

      for (const [search, replace] of replacements) {
        if (content.includes(search)) {
          content = content.split(search).join(replace);
          changed = true;
        }
      }

      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log(`  [Replace] ${path.relative(STARTER_ROOT, fullPath)}`);
      }
    }
  }
}

// ============ 生成 uni_modules package.json ============

function createUniModulesPackageJson() {
  const srcPkg = JSON.parse(fs.readFileSync(path.resolve(PROJECT_ROOT, 'package.json'), 'utf-8'));

  const pkg = {
    name: 'tdesign-uniapp-tree',
    id: 'tdesign-uniapp-tree',
    displayName: 'TDesign UniApp Tree 树形选择器',
    version: srcPkg.version,
    author: srcPkg.author || '',
    title: 'tdesign-uniapp-tree',
    description: srcPkg.description,
    keywords: srcPkg.keywords || [],
    homepage: 'https://github.com/nicepkg/tdesign-uniapp-tree',
    license: 'MIT',
    engines: {
      node: '>=14',
      'uni-app': '^3.6.17',
    },
    dcloudext: {
      type: 'component-vue',
      sale: {
        regular: { price: '0.00' },
        sourcecode: { price: '0.00' },
      },
      contact: {
        qq: '',
      },
      declaration: {
        ads: '无',
        data: '插件不采集任何数据',
        permissions: '无',
      },
      npmurl: 'https://www.npmjs.com/package/tdesign-uniapp-tree',
    },
    uni_modules: {
      dependencies: ['tdesign-uniapp'],
      encrypt: [],
      platforms: {
        cloud: {
          tcb: '√',
          aliyun: '√',
          alipay: '√',
        },
        client: {
          'uni-app': {
            vue: {
              vue2: '-',
              vue3: '√',
            },
            web: {
              safari: '√',
              chrome: '√',
            },
            app: {
              vue: '√',
              nvue: '-',
              android: '√',
              ios: '√',
              harmony: '-',
            },
            mp: {
              weixin: '√',
              alipay: '√',
              toutiao: '√',
              baidu: '√',
              kuaishou: '-',
              jd: '-',
              harmony: '-',
              qq: '√',
              lark: '-',
            },
            quickapp: {
              huawei: '-',
              union: '-',
            },
          },
        },
      },
    },
  };

  const targetPath = path.resolve(UNI_MODULES_DIR, 'package.json');
  fs.mkdirSync(UNI_MODULES_DIR, { recursive: true });
  fs.writeFileSync(targetPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log(`  [Create] ${path.relative(STARTER_ROOT, targetPath)}`);
}

// ============ 生成 readme.md ============

function createReadme() {
  const readmeSrc = path.resolve(PROJECT_ROOT, 'README.md');
  const readmeDest = path.resolve(UNI_MODULES_DIR, 'readme.md');

  if (fs.existsSync(readmeSrc)) {
    fs.copyFileSync(readmeSrc, readmeDest);
    console.log(`  [Copy] ${path.relative(STARTER_ROOT, readmeDest)}`);
  }
}

// ============ 创建示例页面入口 ============

function createExampleEntryPage() {
  // 创建 pages-more/tdesign-uniapp-tree/tdesign-uniapp-tree.vue
  // 这是一个入口页面，引用各个子示例
  const entryPageContent = `<template>
  <view>
    <t-demo-header
      title="Tree 树形选择器"
      desc="适用于多层级数据的树形选择场景，支持单选、多选、搜索、拖拽排序、异步加载等功能。"
    />

    <t-demo title="01 组件类型" desc="基础用法" padding>
      <base-demo />
    </t-demo>

    <t-demo desc="父级可选配置" padding>
      <select-parent-demo />
    </t-demo>

    <t-demo desc="默认回显" padding>
      <echo-default-demo />
    </t-demo>

    <t-demo title="02 组件功能" desc="搜索模式" padding>
      <search-mode-demo />
    </t-demo>

    <t-demo desc="展开模式" padding>
      <expanded-demo />
    </t-demo>

    <t-demo desc="拖拽排序" padding>
      <draggable-demo />
    </t-demo>

    <t-demo desc="异步加载" padding>
      <async-load-demo />
    </t-demo>

    <t-demo title="03 组件样式" desc="主题颜色" padding>
      <theme-demo />
    </t-demo>

    <t-demo title="04 其他" desc="页面模式" padding>
      <page-mode-demo />
    </t-demo>
  </view>
</template>

<script>
import BaseDemo from './_example/base/index.vue';
import SelectParentDemo from './_example/select-parent/index.vue';
import EchoDefaultDemo from './_example/echo-default/index.vue';
import SearchModeDemo from './_example/search-mode/index.vue';
import ExpandedDemo from './_example/expanded/index.vue';
import DraggableDemo from './_example/draggable/index.vue';
import AsyncLoadDemo from './_example/async-load/index.vue';
import ThemeDemo from './_example/theme/index.vue';
import PageModeDemo from './_example/page-mode/index.vue';

export default {
  components: {
    BaseDemo,
    SelectParentDemo,
    EchoDefaultDemo,
    SearchModeDemo,
    ExpandedDemo,
    DraggableDemo,
    AsyncLoadDemo,
    ThemeDemo,
    PageModeDemo,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="less">
page {
  padding-bottom: 56rpx;
}
</style>
`;

  const targetDir = EXAMPLE_TARGET;
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.resolve(targetDir, 'tdesign-uniapp-tree.vue'), entryPageContent);
  console.log(`  [Create] ${path.relative(STARTER_ROOT, path.resolve(targetDir, 'tdesign-uniapp-tree.vue'))}`);
}

// ============ 创建页面模式示例页面 ============

function createTreePageExample() {
  const targetDir = TREE_PAGE_TARGET;
  fs.mkdirSync(targetDir, { recursive: true });

  // 复制 tree-page 示例
  const count = copyDir(TREE_PAGE_SOURCE, targetDir);
  console.log(`  [Copy] 页面模式示例 ${count} 个文件`);

  // 重命名 index.vue -> tdesign-uniapp-tree-page.vue（符合 starter 的命名规范）
  const srcFile = path.resolve(targetDir, 'index.vue');
  const destFile = path.resolve(targetDir, 'tdesign-uniapp-tree-page.vue');
  if (fs.existsSync(srcFile)) {
    fs.renameSync(srcFile, destFile);
  }
}

// ============ 更新 pages.json ============

function updatePagesJson() {
  const pagesJsonPath = path.resolve(STARTER_ROOT, 'pages.json');
  if (!fs.existsSync(pagesJsonPath)) {
    console.warn('  [Warn] pages.json 不存在，跳过更新');
    return;
  }

  let content = fs.readFileSync(pagesJsonPath, 'utf-8');
  // 去除可能的 BOM
  content = content.replace(/^\uFEFF/, '');

  // 使用简单的 JSON 解析（pages.json 可能包含注释，但 starter 项目中通常没有）
  let pagesJson;
  try {
    pagesJson = JSON.parse(content);
  } catch (e) {
    console.error('  [Error] 解析 pages.json 失败:', e.message);
    return;
  }

  // 1. 添加页面到 pages 数组（如果不存在）
  const treePage = { path: 'pages-more/tdesign-uniapp-tree/tdesign-uniapp-tree' };
  const treePageModePage = { path: 'pages-more/tdesign-uniapp-tree-page/tdesign-uniapp-tree-page' };

  if (!pagesJson.pages) {
    pagesJson.pages = [];
  }

  const existingPaths = pagesJson.pages.map((p) => p.path);
  if (!existingPaths.includes(treePage.path)) {
    pagesJson.pages.push(treePage);
    console.log(`  [Update] pages.json: 添加页面 ${treePage.path}`);
  }
  if (!existingPaths.includes(treePageModePage.path)) {
    pagesJson.pages.push(treePageModePage);
    console.log(`  [Update] pages.json: 添加页面 ${treePageModePage.path}`);
  }

  // 2. 添加 condition 条目（如果不存在）
  if (!pagesJson.condition) {
    pagesJson.condition = { current: 0, list: [] };
  }
  if (!pagesJson.condition.list) {
    pagesJson.condition.list = [];
  }

  const conditionNames = pagesJson.condition.list.map((c) => c.name);
  if (!conditionNames.includes('tdesign-uniapp-tree')) {
    pagesJson.condition.list.push({
      name: 'tdesign-uniapp-tree',
      pathName: 'pages-more/tdesign-uniapp-tree/tdesign-uniapp-tree',
    });
    console.log('  [Update] pages.json: 添加 condition tdesign-uniapp-tree');
  }
  if (!conditionNames.includes('tdesign-uniapp-tree-page')) {
    pagesJson.condition.list.push({
      name: 'tdesign-uniapp-tree-page',
      pathName: 'pages-more/tdesign-uniapp-tree-page/tdesign-uniapp-tree-page',
    });
    console.log('  [Update] pages.json: 添加 condition tdesign-uniapp-tree-page');
  }

  // 3. 更新 easycom 配置
  if (!pagesJson.easycom) {
    pagesJson.easycom = { custom: {} };
  }
  if (!pagesJson.easycom.custom) {
    pagesJson.easycom.custom = {};
  }

  const easycomKey = '^tdesign-uniapp-tree$';
  const easycomValue = '@/uni_modules/tdesign-uniapp-tree/components/tdesign-uniapp-tree/tdesign-uniapp-tree.vue';
  if (pagesJson.easycom.custom[easycomKey] !== easycomValue) {
    pagesJson.easycom.custom[easycomKey] = easycomValue;
    console.log('  [Update] pages.json: 添加 easycom 配置');
  }

  fs.writeFileSync(pagesJsonPath, JSON.stringify(pagesJson, null, '\t') + '\n');
  console.log('  [Save] pages.json');
}

// ============ 复制示例子组件 ============

function copyExamples() {
  const exampleSource = path.resolve(EXAMPLE_SOURCE, '_example');
  const exampleTarget = path.resolve(EXAMPLE_TARGET, '_example');

  if (!fs.existsSync(exampleSource)) {
    console.warn('  [Warn] 示例目录不存在:', exampleSource);
    return 0;
  }

  return copyDir(exampleSource, exampleTarget);
}

// ============ 处理示例中的路径引用 ============

function fixExamplePaths() {
  // 在示例文件中，需要修复以下路径引用：
  // 1. 组件引用路径（如果有 @/components/ 的引用）
  // 2. 页面跳转路径
  const replacements = [
    // 页面模式中跳转到 tree-page 的路径
    ['/pages/tree-page/index', '/pages-more/tdesign-uniapp-tree-page/tdesign-uniapp-tree-page'],
    // 示例中引用 tree-data 的相对路径（页面模式示例中）
    ["from '../index/_example/tree-data'", "from '../tdesign-uniapp-tree/_example/tree-data'"],
  ];

  replaceInFiles(EXAMPLE_TARGET, replacements);
  replaceInFiles(TREE_PAGE_TARGET, replacements);
}

// ============ 复制样式文件 ============

function copyStyles() {
  const styleTarget = path.resolve(STARTER_ROOT, 'style');

  // 检查目标 style 目录是否已存在 index.less
  const targetStyleFile = path.resolve(styleTarget, 'tdesign-uniapp-tree.less');
  const sourceStyleFile = path.resolve(STYLE_SOURCE, 'index.less');

  if (fs.existsSync(sourceStyleFile)) {
    fs.mkdirSync(styleTarget, { recursive: true });
    fs.copyFileSync(sourceStyleFile, targetStyleFile);
    console.log(`  [Copy] ${path.relative(STARTER_ROOT, targetStyleFile)}`);
  }
}

// ============ 主流程 ============

async function main() {
  console.log('🚀 copy-to-starter: 将 tdesign-uniapp-tree 复制到 tdesign-uniapp-starter-vue3-hx\n');

  // 检查目标项目是否存在
  if (!fs.existsSync(STARTER_ROOT)) {
    console.error(`❌ 目标项目不存在: ${STARTER_ROOT}`);
    console.error('请确保 tdesign-uniapp-starter-vue3-hx 项目与本项目在同一目录下。');
    process.exit(1);
  }

  // 1. 清理旧文件
  console.log('📦 Step 1: 清理旧文件...');
  deleteFolder(path.resolve(UNI_MODULES_DIR));
  deleteFolder(EXAMPLE_TARGET);
  deleteFolder(TREE_PAGE_TARGET);
  console.log('');

  // 2. 复制组件到 uni_modules
  console.log('📦 Step 2: 复制组件到 uni_modules/tdesign-uniapp-tree/...');
  const componentCount = copyDir(COMPONENT_SOURCE, COMPONENT_TARGET);
  console.log(`  ✅ 已复制 ${componentCount} 个组件文件\n`);

  // 3. 生成 uni_modules package.json
  console.log('📦 Step 3: 生成 uni_modules 配置文件...');
  createUniModulesPackageJson();
  createReadme();
  console.log('');

  // 4. 复制示例页面
  console.log('📦 Step 4: 复制示例页面...');
  createExampleEntryPage();
  const exampleCount = copyExamples();
  console.log(`  ✅ 已复制 ${exampleCount} 个示例文件`);
  createTreePageExample();
  console.log('');

  // 5. 复制样式文件
  console.log('📦 Step 5: 复制样式文件...');
  copyStyles();
  console.log('');

  // 6. 修复路径引用
  console.log('📦 Step 6: 修复路径引用...');
  fixExamplePaths();
  console.log('');

  // 7. 更新 pages.json
  console.log('📦 Step 7: 更新 pages.json...');
  updatePagesJson();
  console.log('');

  // 完成
  console.log('🎉 复制完成!\n');
  console.log('📁 产物结构:');
  console.log('   tdesign-uniapp-starter-vue3-hx/');
  console.log('   ├── uni_modules/');
  console.log('   │   └── tdesign-uniapp-tree/');
  console.log('   │       ├── package.json');
  console.log('   │       ├── readme.md');
  console.log('   │       └── components/');
  console.log('   │           └── tdesign-uniapp-tree/');
  console.log('   │               ├── tdesign-uniapp-tree.vue');
  console.log('   │               ├── style.css');
  console.log('   │               └── libs/');
  console.log('   ├── pages-more/');
  console.log('   │   ├── tdesign-uniapp-tree/');
  console.log('   │   │   ├── tdesign-uniapp-tree.vue');
  console.log('   │   │   └── _example/');
  console.log('   │   └── tdesign-uniapp-tree-page/');
  console.log('   │       └── tdesign-uniapp-tree-page.vue');
  console.log('   └── style/');
  console.log('       └── tdesign-uniapp-tree.less');
  console.log('');
  console.log('💡 提示:');
  console.log('   1. 在 HBuilderX 中打开 tdesign-uniapp-starter-vue3-hx 项目');
  console.log('   2. 可以在 uni_modules 中管理 tdesign-uniapp-tree 插件');
  console.log('   3. 示例页面已添加到 pages.json，可直接预览');
}

main();
