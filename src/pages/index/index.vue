<template>
  <view>
    <t-demo-header
      title="Tree 树形选择"
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
