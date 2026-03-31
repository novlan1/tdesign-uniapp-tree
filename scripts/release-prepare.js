/**
 * release:prepare 脚本
 * 将 src/components/tdesign-uniapp-tree 下的组件文件复制到 dist/ 目录
 * 参考 @tdesign/uniapp 的 release:prepare 实现
 */
const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const SOURCE_DIR = path.resolve(PROJECT_ROOT, 'src/components/tdesign-uniapp-tree');
const DIST_DIR = path.resolve(PROJECT_ROOT, 'dist');

// 需要排除的文件/目录
const EXCLUDE_LIST = [
  'node_modules',
  '.DS_Store',
];

/**
 * 递归删除目录
 */
function deleteFolder(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  fs.rmSync(dirPath, { recursive: true, force: true });
  console.log(`[Clean] 已删除: ${path.relative(PROJECT_ROOT, dirPath)}`);
}

/**
 * 递归复制目录
 */
function copyDir(src, dest) {
  let count = 0;
  const entries = fs.readdirSync(src, { withFileTypes: true });

  fs.mkdirSync(dest, { recursive: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (EXCLUDE_LIST.some(ex => entry.name === ex)) {
      continue;
    }

    if (entry.isDirectory()) {
      count += copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      count++;
      console.log(`[Copy] ${path.relative(PROJECT_ROOT, srcPath)} → ${path.relative(PROJECT_ROOT, destPath)}`);
    }
  }

  return count;
}

/**
 * 创建 dist/index.js 入口文件
 */
function createEntryFile() {
  const indexJs = `// This file is intentionally empty.
// It serves as the runtime entry point for module resolvers.
// All meaningful exports from this package are type-only.
// Use: import TdesignUniappTree from 'tdesign-uniapp-tree/tdesign-uniapp-tree/tdesign-uniapp-tree.vue'
`;
  fs.writeFileSync(path.resolve(DIST_DIR, 'index.js'), indexJs);
  console.log('[Create] dist/index.js');
}

/**
 * 生成类型声明文件
 */
function createTypeDeclarations() {
  const typesDir = path.resolve(DIST_DIR, 'types');
  fs.mkdirSync(typesDir, { recursive: true });

  // dist/types/tdesign-uniapp-tree.d.ts
  const tdesignUniappTreeDts = `import type { DefineComponent } from 'vue';

export interface TdesignUniappTreeNode {
  [key: string]: any;
  children?: TdesignUniappTreeNode[];
}

export interface TdesignUniappTreeProps {
  /** 树形数据 */
  treeData: TdesignUniappTreeNode[];
  /** 显示/隐藏树 */
  showTree: boolean;
  /** 标题 */
  title?: string;
  /** 是否多选 */
  multiple?: boolean;
  /** 节点唯一标识字段名 */
  nodeKey?: string;
  /** 节点标签字段名 */
  labelKey?: string;
  /** 子节点字段名 */
  childrenKey?: string;
  /** 禁用节点字段名 */
  disabledKey?: string;
  /** 已选中的节点 */
  selectedData?: TdesignUniappTreeNode[];
  /** 是否折叠 */
  foldAll?: boolean;
  /** 搜索功能 */
  search?: boolean;
  /** 是否显示全选 */
  selectAll?: boolean;
  /** 单选模式 */
  single?: boolean;
  /** 数据模式: normal | ztree | simpleData */
  dataMode?: string;
  /** UI 模式: popup | page */
  uiMode?: string;
  /** 确认时是否只返回叶子节点 */
  confirmLeafOnly?: boolean;
  /** 加载模式 */
  lazyLoadChildren?: boolean;
}

export interface TdesignUniappTreeEmits {
  (e: 'confirm', data: TdesignUniappTreeNode[]): void;
  (e: 'cancel', type: string): void;
  (e: 'change', data: TdesignUniappTreeNode[]): void;
  (e: 'update:showTree', value: boolean): void;
  (e: 'load-children', node: TdesignUniappTreeNode): void;
}

declare const TdesignUniappTree: DefineComponent<TdesignUniappTreeProps>;
export default TdesignUniappTree;
`;

  fs.writeFileSync(path.resolve(typesDir, 'tdesign-uniapp-tree.d.ts'), tdesignUniappTreeDts);
  console.log('[Create] dist/types/tdesign-uniapp-tree.d.ts');

  // dist/types/index.d.ts
  const indexDts = `export * from './tdesign-uniapp-tree';
export { default as TdesignUniappTree } from './tdesign-uniapp-tree';
`;
  fs.writeFileSync(path.resolve(typesDir, 'index.d.ts'), indexDts);
  console.log('[Create] dist/types/index.d.ts');
}

async function main() {
  console.log('🚀 tdesign-uniapp-tree release:prepare\n');

  // 1. 清理 dist
  deleteFolder(DIST_DIR);

  // 2. 复制组件到 dist/tdesign-uniapp-tree/
  const componentDist = path.resolve(DIST_DIR, 'tdesign-uniapp-tree');
  console.log(`\n📦 复制组件文件...\n`);
  const count = copyDir(SOURCE_DIR, componentDist);
  console.log(`\n✅ 已复制 ${count} 个文件到 dist/tdesign-uniapp-tree/\n`);

  // 3. 创建入口文件
  createEntryFile();

  // 4. 生成类型声明
  createTypeDeclarations();

  console.log('\n🎉 release:prepare 完成!');
  console.log(`\n📁 dist/ 产物结构:`);
  console.log(`   dist/`);
  console.log(`   ├── index.js`);
  console.log(`   ├── tdesign-uniapp-tree/`);
  console.log(`   │   ├── tdesign-uniapp-tree.vue`);
  console.log(`   │   ├── style.css`);
  console.log(`   │   └── libs/`);
  console.log(`   │       └── util.ts`);
  console.log(`   └── types/`);
  console.log(`       ├── index.d.ts`);
  console.log(`       └── tdesign-uniapp-tree.d.ts`);
}

main();
