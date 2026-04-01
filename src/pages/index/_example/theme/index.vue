<template>
  <view>
    <t-button theme="primary" block @click="open('default')" variant="outline" size="large">默认样式</t-button>
    <view style="height: 16rpx" />
    <t-button theme="primary" block @click="open('purple')" variant="outline" size="large">紫色主题</t-button>
    <view style="height: 16rpx" />
    <t-button theme="primary" block @click="open('green')" variant="outline" size="large">绿色主题</t-button>

    <view :class="['tree-theme-wrapper', themeClass]">
      <tdesign-uniapp-tree
        ref="treeRef"
        checkable
        :line="true"
        :data="localTreeData"
        @change="onChange"
      />
    </view>
  </view>
</template>

<script>
import { treeData, cloneTreeData } from '../tree-data';

export default {
  data() {
    return {
      themeClass: '',
      localTreeData: cloneTreeData(treeData),
    };
  },
  methods: {
    open(theme) {
      this.themeClass = theme === 'default' ? '' : 'theme-' + theme;
      this.$nextTick(() => {
        this.$refs.treeRef.showTree = true;
      });
    },
    onChange(checked) {
      console.log('change:', checked);
    },
  },
};
</script>

<style>
/* 通过覆盖 CSS Token 实现自定义主题 */
.theme-purple {
  --td-tree-brand-color: #7546c9;
  --td-tree-active-color: #7546c9;
}
.theme-green {
  --td-tree-brand-color: #22ac38;
  --td-tree-active-color: #22ac38;
}
</style>
