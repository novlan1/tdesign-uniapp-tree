<template>
  <view>
    <t-button theme="primary" block @click="openTree" variant="outline" size="large">打开异步加载树</t-button>

    <tdesign-uniapp-tree
      ref="treeRef"
      :expanded="[]"
      :keep-alive="true"
      value-mode="onlyLeaf"
      :check-strictly="true"
      :lazy="true"
      :data="localAsyncTreeData"
      :load="loadFunc"
      @change="onChange"
    />
  </view>
</template>

<script>
import { asyncTreeData, asyncLocalData, cloneTreeData } from '../tree-data';

export default {
  data() {
    return {
      localAsyncTreeData: cloneTreeData(asyncTreeData),
      localData: asyncLocalData,
    };
  },
  methods: {
    openTree() {
      this.$refs.treeRef.showTree = true;
    },
    loadFunc(data) {
      var self = this;
      var type = data.$type;
      var source = data.source;

      if (type === 'nodeLoad') {
        var nodeItem = source;
        return new Promise(function (resolve) {
          setTimeout(function () {
            if (nodeItem && self.localData[nodeItem.id]) {
              return resolve(self.localData[nodeItem.id]);
            } else {
              return resolve([]);
            }
          }, 1000);
        });
      }
    },
    onChange(checked) {
      console.log('change:', checked);
    },
  },
};
</script>
