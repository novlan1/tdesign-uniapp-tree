<template>
  <view>
    <t-button theme="primary" block @click="openTree" variant="outline" size="large">打开异步加载树</t-button>

    <tdesign-uniapp-tree
      ref="treeRef"
      :ifSearch="true"
      search-model="remote"
      funcMode="radio"
      :expandedKeys="[]"
      :keep-alive="true"
      :selectParent="false"
      :checkStrictly="true"
      :treeData="localAsyncTreeData"
      :loadData="loadData"
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
    loadData(data) {
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
      } else if (type === 'remoteSearch') {
        // remote search implementation
      }
    },
    onChange(checked) {
      console.log('change:', checked);
    },
  },
};
</script>
