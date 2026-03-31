<template>
  <view>
    <!-- <view class="theme-btns">
      <t-button size="small" style="background-color: #0052d9; color: #fff" @click="open('#0052d9')">#0052d9</t-button>
      <t-button size="small" style="background-color: #09a0f7; color: #fff" @click="open('#09a0f7')">#09a0f7</t-button>
    </view>
    <view class="theme-btns" style="margin-top: 16rpx">
      <t-button size="small" style="background-color: #22ac38; color: #fff" @click="open('#22ac38')">#22ac38</t-button>
      <t-button size="small" style="background-color: #7546c9; color: #fff" @click="open('#7546c9')">#7546c9</t-button>
    </view> -->
    <t-button theme="primary" block @click="open('#7546c9')" variant="outline" size="large">自定义样式</t-button>

    <tdesign-uniapp-tree
      ref="treeRef"
      funcMode="checkbox"
      :themeColor="themeColor"
      :ifSearch="true"
      searchModel="depHighlight"
      :showAuxiliaryLine="true"
      :treeData="localTreeData"
      @change="onChange"
    />
  </view>
</template>

<script>
import { treeData, cloneTreeData } from '../tree-data';

export default {
  data() {
    return {
      themeColor: '#0052d9',
      localTreeData: cloneTreeData(treeData),
    };
  },
  methods: {
    open(color) {
      this.themeColor = color;
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

<style lang="less">
.theme-btns {
  display: flex;
  justify-content: space-between;
  gap: 16rpx;
}
</style>
