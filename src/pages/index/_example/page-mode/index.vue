<template>
  <view>
    <t-button theme="primary" block @click="goToPage" variant="outline" size="large">打开页面模式</t-button>
  </view>
</template>

<script>
export default {
  methods: {
    goToPage() {
      uni.navigateTo({
        url: '/pages/tree-page/index',
      });
    },
  },
};
</script>
