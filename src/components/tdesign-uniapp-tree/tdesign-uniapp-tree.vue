<template>
  <view class="tdesign-uniapp-tree">
    <!-- ===== popup 模式：使用 t-popup ===== -->
    <t-popup
      v-if="isPopupMode"
      :visible="showTree"
      placement="bottom"
      v-bind="mergedPopupProps"
      @visible-change="onPopupVisibleChange"
    >
      <view
        class="tdesign-uniapp-tree-cnt tdesign-uniapp-tree-cnt-popup"
        :style="{ height: height + 'px' }"
        @touchmove.stop.prevent="onTouchMove"
        @touchend="onTouchEnd"
      >
        <!-- 顶部工具栏 -->
        <view class="tdesign-uniapp-tree-bar">
          <view class="tdesign-uniapp-tree-bar-cancel" :style="{ color: cancelColor }" hover-class="hover-c" @tap="handleCancel('cancel')">
            取消
          </view>
          <view class="tdesign-uniapp-tree-bar-title" :style="{ color: titleColor }">{{ computedTitle }}</view>
          <view class="tdesign-uniapp-tree-bar-btns">
            <view
              v-if="isSelectMode"
              class="tdesign-uniapp-tree-bar-cancel"
              :style="{ color: cancelColor }"
              hover-class="hover-c"
              @tap="handleClear"
            >
              清空
            </view>
            <view
              v-else-if="funcMode === 'edit'"
              class="tdesign-uniapp-tree-bar-cancel"
              :style="{ color: cancelColor }"
              hover-class="hover-c"
              @tap="handleRevert"
            >
              还原
            </view>
            <view class="btn-divid" />
            <view class="tdesign-uniapp-tree-bar-confirm" :style="{ color: computedThemeColor }" hover-class="hover-c" @tap="handleConfirm">
              确定
            </view>
          </view>
        </view>

        <!-- 树视图区域 -->
        <view class="tdesign-uniapp-tree-view" style="top: 72rpx">
        <!-- 搜索栏 (使用 TDesign Search) -->
        <t-search
          v-if="ifSearch"
          v-model="keywords"
          placeholder="请输入关键字"
          shape="round"
          @change="onSearchChange"
          @clear="onSearchClear"
        />

        <!-- 顶部插槽 -->
        <view id="topBarContainer">
          <slot name="topBar" />
        </view>

        <!-- 滚动列表 -->
        <scroll-view class="tdesign-uniapp-tree-view-sc" :scroll-y="true" :scroll-top="scrollTop" @scroll="scrollCallback">
          <view v-if="computedTreeList.length">
            <block v-for="(item, index) in computedTreeList" :key="index">
              <view v-if="item.show" class="tdesign-uniapp-tree-item-block">
                <view
                  class="tdesign-uniapp-tree-item"
                  :style="[{ paddingLeft: item.rank * 15 + 'px', zIndex: item.rank * -1 + 50 }]"
                  :class="{
                    border: border === true,
                    show: item.show,
                    last: item.lastRank,
                    showchild: item.showChild,
                    open: item.open,
                    disabled: item.disabled === true,
                    focus: getShowFocusItemLine(item),
                  }"
                  @touchmove="treeItemfocus"
                >
                  <!-- 辅助线 -->
                  <block v-if="showAuxiliaryLine">
                    <template v-if="item.rank > 1">
                      <view
                        v-for="i in item.rank - 1"
                        :key="i"
                        :style="{ left: 6 * (2 * i - 1) + 3 * (i - 1) + 'px' }"
                        class="parent-horizontal-line"
                      />
                    </template>
                    <view class="left-line">
                      <view v-if="item.lastRank && item.rank" class="horizontal-line" />
                    </view>
                  </block>

                  <!-- 节点标签区域 -->
                  <view class="tdesign-uniapp-tree-label" @tap.stop.prevent="handleTreeItemTap(item, index)">
                    <view v-if="showAuxiliaryLine && item.lastRank && item.rank" class="horizontal-line-box" />

                    <!-- 图标: 插槽或默认 -->
                    <template v-if="$slots.lastIcon && item.lastRank">
                      <slot name="lastIcon" />
                    </template>
                    <template v-else-if="$slots.expandIcon && !item.lastRank && item.showChild">
                      <slot name="expandIcon" />
                    </template>
                    <template v-else-if="$slots.retractIcon && !item.lastRank && !item.showChild">
                      <slot name="retractIcon" />
                    </template>
                    <t-icon
                      v-else-if="item.lastRank"
                      name="file"
                      size="32rpx"
                      color="#999"
                      style="margin-right: 8rpx"
                    />
                    <t-icon
                      v-else-if="item.showChild"
                      name="caret-down-small"
                      size="32rpx"
                      color="#999"
                      style="margin-right: 8rpx"
                    />
                    <t-icon
                      v-else
                      name="caret-right-small"
                      size="32rpx"
                      color="#999"
                      style="margin-right: 8rpx"
                    />

                    <!-- 拖拽手柄 -->
                    <view v-if="draggable" class="drag-box" @touchstart.stop.prevent="onTouchStartItem($event, item)">
                      <t-icon name="move" size="40rpx" />
                    </view>

                    <!-- 编辑模式输入框 -->
                    <input
                      v-if="funcMode === 'edit' && item.status === 'edit'"
                      v-model="item.name"
                      class="label-input"
                      placeholder="请输入"
                      @tap.stop
                    />
                    <!-- 搜索高亮 -->
                    <rich-text
                      v-else-if="ifSearch && ['hierarchy', 'depHighlight'].includes(searchModel) && keywords"
                      :nodes="getNodes(item.ouputText)"
                      :selectable="false"
                    />
                    <!-- 自定义标签插槽 -->
                    <slot v-else-if="$slots.label" name="label" :data="getLabelSlotData(item)" />
                    <!-- 选中态高亮 -->
                    <rich-text v-else-if="item.checked && !item.disabled" :nodes="getThemeNodes(item.name)" />
                    <!-- 默认文本 -->
                    <text v-else>{{ item.name }}</text>
                  </view>

                  <!-- 选择区域：checkbox / radio -->
                  <template v-if="isSelectMode">
                    <view
                      v-if="selectParent ? true : item.lastRank"
                      class="tdesign-uniapp-tree-check"
                      @tap.stop="handleTreeItemSelect(item, index)"
                    >
                      <view
                        v-if="item.checked"
                        class="tdesign-uniapp-tree-check-yes"
                        :class="{ radio: !isMultiple }"
                        :style="{
                          'border-color': item.disabled ? '#ccc' : computedThemeColor,
                          'background-color': item.disabled ? '#ccc' : computedThemeColor,
                        }"
                      >
                        <view class="tdesign-uniapp-tree-check-yes-b" :style="{ 'background-color': item.disabled ? '#ccc' : computedThemeColor }">
                          <t-icon v-if="item.checked" name="check" size="28rpx" color="#fff" />
                        </view>
                      </view>
                      <view
                        v-else
                        class="tdesign-uniapp-tree-check-no"
                        :class="{ radio: !isMultiple }"
                        :style="{ 'border-color': item.disabled ? '#ccc' : computedThemeColor }"
                      >
                        <text
                          v-if="showHalfCheckedTips && showHalfChecked(item)"
                          :style="{ color: item.disabled ? '#ccc' : computedThemeColor, 'font-weight': 'bold', 'font-size': '10px' }"
                          class="icon-text"
                        >
                          一
                        </text>
                      </view>
                    </view>
                  </template>

                  <!-- 编辑模式操作 -->
                  <template v-else-if="funcMode === 'edit'">
                    <t-loading v-if="item.status === 'loading'" size="32rpx" />
                    <view v-else class="edit-actions">
                      <t-icon
                        v-if="item.status === 'edit'"
                        name="check"
                        size="36rpx"
                        :color="item.disabled ? '#ccc' : computedThemeColor"
                        @click="handleComplete(item)"
                      />
                      <template v-else>
                        <t-icon
                          name="edit"
                          size="36rpx"
                          :color="item.disabled ? '#ccc' : computedThemeColor"
                          @click="handleEditItem(item)"
                        />
                        <t-icon
                          name="add-rectangle"
                          size="36rpx"
                          :color="item.disabled ? '#ccc' : '#333'"
                          style="margin-left: 16rpx"
                          @click="handleAddSubItem(item)"
                        />
                        <t-icon
                          name="add"
                          size="36rpx"
                          :color="item.disabled ? '#ccc' : '#333'"
                          style="margin-left: 16rpx"
                          @click="handleAddSameItem(item)"
                        />
                      </template>
                      <t-icon
                        name="delete"
                        size="36rpx"
                        :color="item.disabled ? '#ccc' : '#ff4d4f'"
                        style="margin-left: 16rpx"
                        @click="handleDelItem(item)"
                      />
                    </view>
                  </template>

                  <!-- 拖拽焦点线 -->
                  <view
                    v-if="getShowFocusItemLine(item)"
                    :style="{
                      'background-color': computedThemeColor,
                      width: 'calc(100% - ' + (6 * (2 * item.rank - 1) + 3 * (item.rank - 1) - 1) + 'px)',
                    }"
                    class="focus-item-line"
                  />
                </view>
              </view>
            </block>
          </view>
          <view v-else>
            <slot v-if="$slots.empty" name="empty" />
            <view v-else class="empty"><text>暂无数据</text></view>
          </view>
          <view v-if="ifSearch" style="height: 80rpx" />
          <slot name="bottomBar" />
        </scroll-view>
      </view>

      <!-- 底部固定栏 (popup 内) -->
      <view id="fixedBottomBarContainer" class="fixed-bottom-bar-popup">
        <slot name="fixedBottomBar" />
      </view>
      </view>
    </t-popup>

    <!-- ===== page 模式：直接渲染 ===== -->
    <view
      v-else
      class="tdesign-uniapp-tree-cnt tdesign-uniapp-tree-cnt-page"
      @touchmove.stop.prevent="onTouchMove"
      @touchend="onTouchEnd"
    >
      <!-- 树视图区域 -->
      <view class="tdesign-uniapp-tree-view" style="top: 0rpx">
        <!-- 搜索栏 -->
        <t-search
          v-if="ifSearch"
          v-model="keywords"
          placeholder="请输入关键字"
          shape="round"
          @change="onSearchChange"
          @clear="onSearchClear"
        />

        <!-- 顶部插槽 -->
        <view id="topBarContainer">
          <slot name="topBar" />
        </view>

        <!-- 滚动列表 -->
        <scroll-view class="tdesign-uniapp-tree-view-sc" :scroll-y="true" :scroll-top="scrollTop" @scroll="scrollCallback">
          <view v-if="computedTreeList.length">
            <block v-for="(item, index) in computedTreeList" :key="index">
              <view v-if="item.show" class="tdesign-uniapp-tree-item-block">
                <view
                  class="tdesign-uniapp-tree-item"
                  :style="[{ paddingLeft: item.rank * 15 + 'px', zIndex: item.rank * -1 + 50 }]"
                  :class="{
                    border: border === true,
                    show: item.show,
                    last: item.lastRank,
                    showchild: item.showChild,
                    open: item.open,
                    disabled: item.disabled === true,
                    focus: getShowFocusItemLine(item),
                  }"
                  @touchmove="treeItemfocus"
                >
                  <!-- 辅助线 -->
                  <block v-if="showAuxiliaryLine">
                    <template v-if="item.rank > 1">
                      <view
                        v-for="i in item.rank - 1"
                        :key="i"
                        :style="{ left: 6 * (2 * i - 1) + 3 * (i - 1) + 'px' }"
                        class="parent-horizontal-line"
                      />
                    </template>
                    <view class="left-line">
                      <view v-if="item.lastRank && item.rank" class="horizontal-line" />
                    </view>
                  </block>

                  <!-- 节点标签区域 -->
                  <view class="tdesign-uniapp-tree-label" @tap.stop.prevent="handleTreeItemTap(item, index)">
                    <view v-if="showAuxiliaryLine && item.lastRank && item.rank" class="horizontal-line-box" />

                    <!-- 图标 -->
                    <template v-if="$slots.lastIcon && item.lastRank">
                      <slot name="lastIcon" />
                    </template>
                    <template v-else-if="$slots.expandIcon && !item.lastRank && item.showChild">
                      <slot name="expandIcon" />
                    </template>
                    <template v-else-if="$slots.retractIcon && !item.lastRank && !item.showChild">
                      <slot name="retractIcon" />
                    </template>
                    <t-icon v-else-if="item.lastRank" name="file" size="32rpx" color="#999" style="margin-right: 8rpx" />
                    <t-icon v-else-if="item.showChild" name="caret-down-small" size="32rpx" color="#999" style="margin-right: 8rpx" />
                    <t-icon v-else name="caret-right-small" size="32rpx" color="#999" style="margin-right: 8rpx" />

                    <!-- 拖拽手柄 -->
                    <view v-if="draggable" class="drag-box" @touchstart.stop.prevent="onTouchStartItem($event, item)">
                      <t-icon name="move" size="40rpx" />
                    </view>

                    <!-- 编辑模式输入框 -->
                    <input v-if="funcMode === 'edit' && item.status === 'edit'" v-model="item.name" class="label-input" placeholder="请输入" @tap.stop />
                    <!-- 搜索高亮 -->
                    <rich-text v-else-if="ifSearch && ['hierarchy', 'depHighlight'].includes(searchModel) && keywords" :nodes="getNodes(item.ouputText)" :selectable="false" />
                    <!-- 自定义标签插槽 -->
                    <slot v-else-if="$slots.label" name="label" :data="getLabelSlotData(item)" />
                    <!-- 选中态高亮 -->
                    <rich-text v-else-if="item.checked && !item.disabled" :nodes="getThemeNodes(item.name)" />
                    <!-- 默认文本 -->
                    <text v-else>{{ item.name }}</text>
                  </view>

                  <!-- 选择区域 -->
                  <template v-if="isSelectMode">
                    <view v-if="selectParent ? true : item.lastRank" class="tdesign-uniapp-tree-check" @tap.stop="handleTreeItemSelect(item, index)">
                      <view
                        v-if="item.checked"
                        class="tdesign-uniapp-tree-check-yes"
                        :class="{ radio: !isMultiple }"
                        :style="{ 'border-color': item.disabled ? '#ccc' : computedThemeColor, 'background-color': item.disabled ? '#ccc' : computedThemeColor }"
                      >
                        <view class="tdesign-uniapp-tree-check-yes-b" :style="{ 'background-color': item.disabled ? '#ccc' : computedThemeColor }">
                          <t-icon v-if="item.checked" name="check" size="28rpx" color="#fff" />
                        </view>
                      </view>
                      <view
                        v-else
                        class="tdesign-uniapp-tree-check-no"
                        :class="{ radio: !isMultiple }"
                        :style="{ 'border-color': item.disabled ? '#ccc' : computedThemeColor }"
                      >
                        <text
                          v-if="showHalfCheckedTips && showHalfChecked(item)"
                          :style="{ color: item.disabled ? '#ccc' : computedThemeColor, 'font-weight': 'bold', 'font-size': '10px' }"
                          class="icon-text"
                        >
                          一
                        </text>
                      </view>
                    </view>
                  </template>

                  <!-- 编辑模式操作 -->
                  <template v-else-if="funcMode === 'edit'">
                    <t-loading v-if="item.status === 'loading'" size="32rpx" />
                    <view v-else class="edit-actions">
                      <t-icon v-if="item.status === 'edit'" name="check" size="36rpx" :color="item.disabled ? '#ccc' : computedThemeColor" @click="handleComplete(item)" />
                      <template v-else>
                        <t-icon name="edit" size="36rpx" :color="item.disabled ? '#ccc' : computedThemeColor" @click="handleEditItem(item)" />
                        <t-icon name="add-rectangle" size="36rpx" :color="item.disabled ? '#ccc' : '#333'" style="margin-left: 16rpx" @click="handleAddSubItem(item)" />
                        <t-icon name="add" size="36rpx" :color="item.disabled ? '#ccc' : '#333'" style="margin-left: 16rpx" @click="handleAddSameItem(item)" />
                      </template>
                      <t-icon name="delete" size="36rpx" :color="item.disabled ? '#ccc' : '#ff4d4f'" style="margin-left: 16rpx" @click="handleDelItem(item)" />
                    </view>
                  </template>

                  <!-- 拖拽焦点线 -->
                  <view
                    v-if="getShowFocusItemLine(item)"
                    :style="{ 'background-color': computedThemeColor, width: 'calc(100% - ' + (6 * (2 * item.rank - 1) + 3 * (item.rank - 1) - 1) + 'px)' }"
                    class="focus-item-line"
                  />
                </view>
              </view>
            </block>
          </view>
          <view v-else>
            <slot v-if="$slots.empty" name="empty" />
            <view v-else class="empty"><text>暂无数据</text></view>
          </view>
          <view v-if="ifSearch" style="height: 80rpx" />
          <slot name="bottomBar" />
        </scroll-view>
      </view>
    </view>

    <!-- 底部固定栏 (page 模式) -->
    <view v-if="!isPopupMode" id="fixedBottomBarContainer" class="fixed-bottom-bar">
      <slot name="fixedBottomBar" />
    </view>

    <!-- 拖拽浮层 -->
    <view v-if="dragItem.isDragging" :style="draggingStyle" class="drag-container-view">
      <template v-if="$slots.lastIcon && dragItem.data.lastRank">
        <slot name="lastIcon" />
      </template>
      <template v-else-if="$slots.expandIcon && !dragItem.data.lastRank && dragItem.data.showChild">
        <slot name="expandIcon" />
      </template>
      <template v-else-if="$slots.retractIcon && !dragItem.data.lastRank && !dragItem.data.showChild">
        <slot name="retractIcon" />
      </template>
      <t-icon
        v-else-if="dragItem.data.lastRank"
        name="file"
        size="32rpx"
        color="#999"
        style="margin-right: 8rpx"
      />
      <t-icon
        v-else-if="dragItem.data.showChild"
        name="caret-down-small"
        size="32rpx"
        color="#999"
        style="margin-right: 8rpx"
      />
      <t-icon
        v-else
        name="caret-right-small"
        size="32rpx"
        color="#999"
        style="margin-right: 8rpx"
      />
      <slot v-if="$slots.label" name="label" :data="getLabelSlotData(dragItem.data)" />
      <rich-text v-else-if="dragItem.data.checked && !dragItem.data.disabled" :nodes="getThemeNodes(dragItem.data.name)" />
      <text v-else>{{ dragItem.data.name }}</text>
    </view>
  </view>
</template>

<script>
import { throttle, compareJsonArrays } from "./libs/util";

export default {
  name: "TdesignUniappTree",
  emits: ["cancel", "confirm", "change", "clear"],
  props: {
    uiMode: { type: String, default: "popup" },
    funcMode: { type: String, default: "radio" },
    treeData: { type: Array, default: function () { return []; } },
    valueKey: { type: String, default: "id" },
    labelKey: { type: String, default: "label" },
    disabledKey: { type: String, default: "disabled" },
    childrenKey: { type: String, default: "children" },
    title: { type: [String, Function], default: "" },
    selectParent: { type: Boolean, default: false },
    foldAll: { type: Boolean, default: false },
    themeColor: { type: String, default: "#0052d9" },
    cancelColor: { type: String, default: "" },
    titleColor: { type: String, default: "" },
    border: { type: Boolean, default: false },
    checkStrictly: { type: Boolean, default: false },
    checkStrictlyModel: { type: String, default: "weak" },
    showHalfCheckedTips: { type: Boolean, default: true },
    ifSearch: { type: Boolean, default: true },
    searchModel: { type: String, default: "common" },
    showAuxiliaryLine: { type: Boolean, default: false },
    loadData: { type: Function, default: null },
    height: { type: Number, default: 500 },
    changeVerify: { type: Function, default: null },
    expandedKeys: { type: Array, default: function () { return []; } },
    expandedMode: { type: String, default: "common" },
    keepAlive: { type: Boolean, default: false },
    draggable: { type: Boolean, default: false },
    popupProps: { type: Object, default: function () { return {}; } },
  },
  data: function () {
    return {
      showTree: false,
      treeList: [],
      currentTreeData: [],
      keywords: "",
      nodeInitContrl: {},
      top: "",
      scrollTop: 0,
      initNum: 1,
      windowHeight: 0,
      timer: 0,
      throttleFunc: null,
      dragItem: {
        isDragging: false,
        currentY: 0,
        data: {},
        focusTreeItemId: "",
      },
    };
  },
  computed: {
    isPopupMode: function () {
      return this.uiMode === "popup";
    },
    isSelectMode: function () {
      return ["checkbox", "radio"].includes(this.funcMode);
    },
    isMultiple: function () {
      return this.funcMode === "checkbox";
    },
    computedThemeColor: function () {
      return this.themeColor || "#0052d9";
    },
    mergedPopupProps: function () {
      return Object.assign({}, this.popupProps);
    },
    computedTitle: function () {
      if (typeof this.title === "function") {
        return this.title(this.getCheckedParams());
      }
      return this.title;
    },
    draggingStyle: function () {
      return {
        position: "fixed",
        zIndex: 999,
        left: 0,
        top: this.dragItem.currentY + 20 + "px",
      };
    },
    computedTreeList: function () {
      var self = this;
      if (self.ifSearch && self.keywords) {
        return self.treeList
          .filter(function (item) {
            if (self.searchModel === "hierarchy") {
              return item.hierarchyText && item.hierarchyText.indexOf(self.keywords) !== -1;
            } else {
              return item.name && item.name.indexOf(self.keywords) !== -1;
            }
          })
          .map(function (item) {
            var o = JSON.parse(JSON.stringify(item));
            if (!o.showChild) o.showChild = true;
            if (!o.show) o.show = true;
            return o;
          });
      }
      return self.treeList;
    },
  },
  watch: {
    showTree: function (bool) {
      if (this.uiMode === "popup") {
        this._watchShowTreePopup(bool);
      }
    },
    treeData: {
      handler: function () {
        if (this.uiMode === "page") {
          var self = this;
          self.treeList.length = 0;
          self.nodeInitContrl = {};
          self.$nextTick(function () {
            self.cInitTree();
          });
        }
      },
      deep: true,
    },
  },
  mounted: function () {
    console.log("----------tdesign-uniapp-tree组件完成挂载------------");
    this.uiModeInit(this.keepAlive);

    var self = this;
    var bottomBarSlotH = 0;
    var topBarSlotH = 0;

    self.$nextTick(function () {
      var query = uni.createSelectorQuery().in(self);
      query
        .select("#fixedBottomBarContainer")
        .boundingClientRect(function (rect) {
          bottomBarSlotH = rect ? rect.height || 0 : 0;
        })
        .exec();
      query
        .select("#topBarContainer")
        .boundingClientRect(function (rect) {
          topBarSlotH = rect ? rect.height || 0 : 0;
        })
        .exec();
    });

    self.throttleFunc = throttle(function (e) {
      var inputSearchH = 48;
      var topBarH = 36;
      var step = 30;
      var touch = e.touches[0];
      var facusH = 60;
      if (!touch) return;
      if (self.uiMode === "popup") {
        if (self.windowHeight - touch.clientY < facusH + bottomBarSlotH) {
          self.scrollTop = self.scrollTop + step;
        } else if (self.scrollTop > 0) {
          var threshold = self.ifSearch
            ? self.windowHeight - self.height + inputSearchH + topBarH + topBarSlotH
            : self.windowHeight - self.height + topBarH + topBarSlotH;
          if (touch.clientY < threshold) {
            self.scrollTop = Math.max(0, self.scrollTop - step);
          }
        }
      } else if (self.uiMode === "page") {
        if (self.windowHeight - touch.clientY < facusH + bottomBarSlotH) {
          self.scrollTop = self.scrollTop + step;
        } else if (self.scrollTop > 0) {
          var threshold2 = self.ifSearch ? inputSearchH + topBarSlotH : topBarSlotH;
          if (touch.clientY < threshold2) {
            self.scrollTop = Math.max(0, self.scrollTop - step);
          }
        }
      }
    }, 10);
  },
  methods: {
    // ==================== Public API ====================
    cShow: function () {
      this.showTree = true;
    },
    cHide: function () {
      this.showTree = false;
    },
    cInitTree: function () {
      this.treeList.length = 0;
      if (this.loadData) {
        this.currentTreeData = JSON.parse(JSON.stringify(this.treeData));
      } else {
        this.currentTreeData = this.treeData;
      }
      this.cRenderTreeList(this.currentTreeData);
      var self = this;
      self.$nextTick(function () {
        self.cDefaultSelect();
      });
    },
    checkedFunc: function (values, state) {
      if (state === undefined) state = true;
      var self = this;
      if (Array.isArray(values)) {
        values.forEach(function (id) {
          var item = self.treeList.find(function (it) { return it.id === id; });
          if (item) item.checked = !!state;
        });
      } else {
        var _item = self.treeList.find(function (it) { return it.id === values; });
        if (_item) _item.checked = !!state;
      }
    },
    getCheckedParams: function () {
      var self = this;
      var rt = [];
      self.treeList.forEach(function (v) {
        if (v.checked) {
          var obj = {};
          obj.parents = v.parents;
          obj = Object.assign(obj, v.source);
          delete obj.children;
          rt.push(obj);
        }
      });
      return rt;
    },

    // ==================== Internal ====================
    _watchShowTreePopup: function (bool) {
      var self = this;
      var keepAlive = self.keepAlive;
      if (bool) {
        if (keepAlive) {
          if (self.loadData && self.searchModel === "remote") {
            self.keywords = "";
            self.nodeInitContrl = {};
            self.cInitTree();
          } else if (self.loadData && Object.keys(self.nodeInitContrl || {}).length !== 0) {
            // do nothing
          } else {
            var params = compareJsonArrays(self.currentTreeData, self.treeData);
            if (!params.areEqual) {
              self.keywords = "";
              self.nodeInitContrl = {};
              self.cInitTree();
            }
          }
        } else {
          self.cInitTree();
        }
      } else {
        if (!keepAlive) {
          self.keywords = "";
          self.$nextTick(function () {
            setTimeout(function () {
              self.treeList.length = 0;
              self.nodeInitContrl = {};
            });
          });
        }
      }
    },

    onPopupVisibleChange: function (visible) {
      if (!visible) {
        this.handleCancel("masktap");
      }
    },
    handleCancel: function (type) {
      this.cHide();
      this.$emit("cancel", type);
    },
    handleConfirm: function () {
      var rt = this.getCheckedParams();
      this.cHide();
      this.$emit("confirm", rt);
    },
    getLabelSlotData: function (item) {
      var _it = this.getItemFromTreeData(this.currentTreeData, item.id);
      var it = Object.assign({}, _it);
      if (it) delete it[this.childrenKey];
      return it;
    },

    handleAddSubItem: function (item) {
      if (item.disabled) return;
      var it = Object.assign({}, item);
      if (item.lastRank) {
        item.lastRank = false;
        item.showChild = true;
      }
      var self = this;
      self.$nextTick(function () {
        self.initNum++;
        var parentId = item.parentId.concat([]);
        var parents = item.parents.concat([]);
        parentId.push(item.id);
        parents.push(item);
        it.disabled = false;
        it.rank = it.rank + 1;
        it.id = "tdesign-uniapp-tree-" + self.initNum;
        it.parentId = parentId.slice();
        it.parents = parents.slice();
        it.show = true;
        it.showChild = false;
        it.open = false;
        it.name = "";
        it.status = "edit";
        it.source = {};
        it.hideArr = [];
        it.lastRank = true;
        var index = -1;
        for (var i = self.treeList.length - 1; i >= 0; i--) {
          if (self.treeList[i].id === item.id) {
            index = i;
            break;
          }
        }
        if (index !== -1) {
          self.treeList.splice(index + 1, 0, it);
        }
      });
    },

    handleAddSameItem: function (item) {
      if (item.disabled) return;
      var it = Object.assign({}, item);
      var index = -1;
      for (var i = this.treeList.length - 1; i >= 0; i--) {
        if (this.treeList[i].id === item.id || this.treeList[i].parentId.indexOf(item.id) !== -1) {
          index = i;
          break;
        }
      }
      this.initNum++;
      it.id = "tdesign-uniapp-tree-" + this.initNum;
      it.source = {};
      it.hideArr = [];
      it.name = "";
      it.status = "edit";
      if (index !== -1) {
        this.treeList.splice(index + 1, 0, it);
      }
    },

    handleComplete: function (item) {
      var self = this;
      if (item.name) {
        item.status = "loading";
        if (item.operateCallback) {
          item.operateCallback("complete", item).then(function () {
            return self.$nextTick();
          }).then(function () {
            item.status = "";
          });
        } else {
          item.status = "";
        }
      } else {
        uni.showToast({ title: "请先完善内容", icon: "none" });
      }
    },

    handleEditItem: function (item) {
      if (item.disabled) return;
      item.status = "edit";
    },

    handleRevert: function () {
      this.uiModeInit(false);
    },

    handleDelItem: function (item) {
      if (item.disabled) return;
      var self = this;
      item.status = "loading";
      if (item.operateCallback) {
        item.operateCallback("delete", item).then(function () {
          return self.$nextTick();
        }).then(function () {
          self.delItemFunc(item);
        });
      } else {
        self.delItemFunc(item);
      }
    },

    getShowFocusItemLine: function (item) {
      return this.draggable && this.dragItem.isDragging && item.id === this.dragItem.focusTreeItemId && !item.showChild;
    },

    delItemFunc: function (item) {
      var id = (item && item.id) || "";
      var ids = [];
      this.treeList.forEach(function (it, index) {
        if (it.id === id || it.parentId.indexOf(id) !== -1) {
          ids.push(index);
        }
      });
      ids.sort(function (a, b) { return b - a; });
      var self = this;
      ids.forEach(function (index) {
        self.treeList.splice(index, 1);
      });
    },

    getRenderTreeList: function (list, rank, parentId, parents) {
      if (!list) list = [];
      if (!rank) rank = 0;
      if (!parentId) parentId = [];
      if (!parents) parents = [];
      var self = this;
      var result = [];
      list.forEach(function (item) {
        var halfChecked = self.getHalfCheckedFormTreeData(item);
        var ouputText = "";
        var hierarchyText = "";

        if (self.searchModel === "depHighlight") {
          if (parents && parents.length) {
            ouputText = parents.map(function (p) { return p[self.labelKey]; }).join(" &gt; ");
            ouputText = ouputText + " &gt; " + item[self.labelKey];
          } else {
            ouputText = item[self.labelKey];
          }
        } else if (self.searchModel === "hierarchy") {
          if (parents && parents.length) {
            hierarchyText = parents.map(function (p) { return p[self.labelKey]; }).join("");
            hierarchyText = hierarchyText + item[self.labelKey];
          } else {
            hierarchyText = item[self.labelKey];
          }
          ouputText = item[self.labelKey];
        }

        var bool1 = self.expandedKeys.indexOf(item[self.valueKey]) !== -1;
        var len = parentId.length;
        var bool2 = len > 0 ? self.expandedKeys.indexOf(parentId[len - 1]) !== -1 : bool1;

        result.push({
          id: item[self.valueKey],
          name: item[self.labelKey],
          source: item,
          parentId: parentId,
          parents: parents,
          rank: rank,
          showChild: bool1,
          open: bool1,
          show: bool1 || bool2 || rank === 0,
          hideArr: [],
          ouputText: ouputText,
          hierarchyText: hierarchyText,
          orChecked: item.checked || false,
          checked: item.checked || false,
          halfChecked: halfChecked,
          disabled: !!(self.disabledKey && item[self.disabledKey]),
          status: "",
          operateCallback: typeof item.operateCallback === "function" ? item.operateCallback : undefined,
        });

        if (bool1) {
          self.$set ? self.$set(self.nodeInitContrl, item[self.valueKey], true) : (self.nodeInitContrl[item[self.valueKey]] = true);
        } else {
          self.$set ? self.$set(self.nodeInitContrl, item[self.valueKey], undefined) : (self.nodeInitContrl[item[self.valueKey]] = undefined);
        }

        var children = item[self.childrenKey];
        if ((Array.isArray(children) && children.length > 0) || (self.loadData && Array.isArray(children) && children.length === 0)) {
          // has children placeholder
        } else {
          result[result.length - 1].lastRank = true;
        }
      });
      return result;
    },

    cRenderTreeList: function (list, rank, parentId, parents) {
      if (!list) list = [];
      if (!rank) rank = 0;
      if (!parentId) parentId = [];
      if (!parents) parents = [];
      var self = this;
      list.forEach(function (item) {
        var halfChecked = self.getHalfCheckedFormTreeData(item);
        var ouputText = "";
        var hierarchyText = "";

        if (self.searchModel === "depHighlight") {
          if (parents && parents.length) {
            ouputText = parents.map(function (p) { return p[self.labelKey]; }).join(" &gt; ");
            ouputText = ouputText + " &gt; " + item[self.labelKey];
          } else {
            ouputText = item[self.labelKey];
          }
        } else if (self.searchModel === "hierarchy") {
          if (parents && parents.length) {
            hierarchyText = parents.map(function (p) { return p[self.labelKey]; }).join("");
            hierarchyText = hierarchyText + item[self.labelKey];
            parents.forEach(function (parentItem) {
              var o = self.treeList.find(function (it) { return it.id === parentItem[self.valueKey]; });
              if (o) {
                if (o.hierarchyText && o.hierarchyText.indexOf(item[self.labelKey]) === -1) {
                  o.hierarchyText = o.hierarchyText + item[self.labelKey];
                }
              }
            });
          } else {
            hierarchyText = item[self.labelKey];
          }
          ouputText = item[self.labelKey];
        }

        var bool1 = self.expandedKeys.indexOf(item[self.valueKey]) !== -1;
        var len = parentId.length;
        var bool2 = len > 0 ? self.expandedKeys.indexOf(parentId[len - 1]) !== -1 : bool1;

        self.treeList.push({
          id: item[self.valueKey],
          name: item[self.labelKey],
          source: item,
          parentId: parentId,
          parents: parents,
          rank: rank,
          showChild: bool1,
          open: bool1,
          show: bool1 || bool2 || rank === 0,
          hideArr: [],
          ouputText: ouputText,
          hierarchyText: hierarchyText,
          orChecked: item.checked || false,
          checked: item.checked || false,
          halfChecked: halfChecked,
          disabled: !!(self.disabledKey && item[self.disabledKey]),
          status: "",
          operateCallback: typeof item.operateCallback === "function" ? item.operateCallback : undefined,
        });

        if (bool1) {
          self.$set ? self.$set(self.nodeInitContrl, item[self.valueKey], true) : (self.nodeInitContrl[item[self.valueKey]] = true);
        } else {
          self.$set ? self.$set(self.nodeInitContrl, item[self.valueKey], undefined) : (self.nodeInitContrl[item[self.valueKey]] = undefined);
        }

        var children = item[self.childrenKey];
        if ((Array.isArray(children) && children.length > 0) || (self.loadData && Array.isArray(children) && children.length === 0)) {
          var pid = parentId.slice();
          var parr = parents.slice();
          pid.push(item[self.valueKey]);
          var parentObj = {};
          parentObj[self.valueKey] = item[self.valueKey];
          parentObj[self.labelKey] = item[self.labelKey];
          parr.push(parentObj);
          self.cRenderTreeList(children, rank + 1, pid, parr);
        } else if (children === null) {
          self.treeList[self.treeList.length - 1].lastRank = true;
        } else {
          self.treeList[self.treeList.length - 1].lastRank = true;
        }
      });
    },

    cDefaultSelect: function () {
      var self = this;
      self.treeList.forEach(function (v) {
        if (v.checked) {
          self.treeList.forEach(function (v2) {
            if (v.parentId.toString().indexOf(v2.parentId.toString()) >= 0) {
              v2.show = true;
              if (v.parentId.includes(v2.id)) {
                v2.showChild = true;
                v2.open = true;
              }
            }
          });
        }
      });
    },

    handleTreeItemTap: function (item, _index) {
      var self = this;
      var index = self.treeList.findIndex(function (it) { return it.id === item.id; });
      if (item.lastRank === true) {
        if (item.disabled) return;
        if (!self.isSelectMode) return;
        self.treeList[index].checked = !self.treeList[index].checked;

        if (self.changeVerify) {
          var current = Object.assign({}, item.source);
          current.checked = item.checked;
          var tip = self.changeVerify(current, self.isMultiple ? self.getCheckedParams() : [current]);
          if (tip) {
            self.treeList[index].checked = !self.treeList[index].checked;
            uni.showToast({ title: tip, icon: "none" });
            return;
          }
        }
        self.treeList[index].halfChecked = false;
        if (self.isMultiple && !self.checkStrictly && self.showHalfCheckedTips) {
          self.updateHalfChecked(index);
        } else if (self.isMultiple && self.checkStrictly) {
          self.updateParentChecked(index);
        }
        self.fixMultiple(index);
        self.$emit("change", self.getCheckedParams());
        return;
      } else if (self.ifSearch && self.keywords) {
        return;
      }

      // loadData 实现
      var isLoadDataNeeded = self.loadData && !self.nodeInitContrl[item.id];

      function afterLoad() {
        var childLen = self.treeList.filter(function (it) { return it.parentId.includes(item.id); }).length;
        if (!isLoadDataNeeded && childLen > 50) {
          uni.showLoading({ title: "请稍后..." });
        }

        var id = item.id;
        item.showChild = !item.showChild;
        item.open = item.showChild ? true : !item.open;

        self.treeList.forEach(function (childItem) {
          if (!item.showChild) {
            if (!childItem.parentId.includes(id)) return;
            if (!self.foldAll) {
              if (childItem.lastRank !== true && !childItem.open) {
                childItem.showChild = false;
              }
              if (childItem.show) {
                childItem.hideArr[item.rank] = id;
              }
            } else {
              if (childItem.lastRank !== true) {
                childItem.showChild = false;
              }
            }
            childItem.show = false;
          } else {
            if (childItem.parentId[childItem.parentId.length - 1] === id) {
              childItem.show = true;
            }
            if (childItem.parentId.includes(id) && !self.foldAll) {
              if (childItem.hideArr[item.rank] === id) {
                childItem.show = true;
                if (childItem.open && childItem.showChild) {
                  childItem.showChild = true;
                } else {
                  childItem.showChild = false;
                }
                childItem.hideArr[item.rank] = null;
              }
            } else if (self.expandedMode === "singe" && !childItem.parentId.includes(id)) {
              if (childItem.id !== id) {
                var bool1 = item.parentId.some(function (pid) {
                  return (childItem.parentId && childItem.parentId.indexOf(pid) !== -1) || childItem.rank === 0;
                });
                var childItemParentId = childItem.parentId.slice();
                var _id = childItemParentId.length ? childItemParentId.pop() : "";
                var nodeList = [item, { parentId: childItemParentId.length ? childItemParentId : [] }];

                if (!childItem.lastRank) {
                  if (item.parentId.indexOf(childItem.id) === -1) {
                    childItem.showChild = false;
                  }
                  if (!bool1 && !self.isSiblingNode([item, childItem])) {
                    childItem.show = false;
                  } else if (childItem.rank !== 0 && _id !== id && self.isSiblingNode(nodeList)) {
                    childItem.show = false;
                  } else if (childItem.rank !== 0 && _id !== id && !self.isSiblingNode(nodeList) && self.isParentSiblingNode(nodeList)) {
                    childItem.show = false;
                  }
                } else {
                  if (!self.isSiblingNode([item, childItem]) && !bool1) {
                    childItem.show = false;
                  } else if (_id !== id && self.isSiblingNode(nodeList)) {
                    childItem.show = false;
                  } else if (_id !== id && !self.isSiblingNode(nodeList) && self.isParentSiblingNode(nodeList)) {
                    childItem.show = false;
                  }
                }
              }
            }
          }
        });

        setTimeout(function () {
          uni.hideLoading();
        });
      }

      if (isLoadDataNeeded) {
        uni.showLoading({ title: "请稍后..." });
        self.loadData({
          $type: "nodeLoad",
          source: self.treeList[index].source,
        }).then(function (newChild) {
          var treeItem = self.getItemFromTreeData(self.currentTreeData, item.id);
          if (treeItem) {
            treeItem[self.childrenKey] = newChild && newChild.length ? newChild : undefined;
          }
          var parentId = item.parentId || [];
          var parentObj = {};
          parentObj[self.valueKey] = item.id;
          parentObj[self.labelKey] = item.name;
          var lists = self.getRenderTreeList(newChild || [], item.rank + 1, parentId.concat([item.id]), [parentObj]);
          self.nodeInitContrl[item.id] = true;
          self.treeList.splice(index + 1, 0, ...lists);
          afterLoad();
        });
      } else {
        afterLoad();
      }
    },

    isSiblingNode: function (targetArr) {
      if (!targetArr) targetArr = [];
      var target1 = targetArr[0] || {};
      var target1Id = "";
      if (target1.parentId && target1.parentId.length) {
        target1Id = target1.parentId[target1.parentId.length - 1];
      }
      return targetArr.every(function (item) {
        if (item && item.parentId && item.parentId.length) {
          return target1Id === item.parentId[item.parentId.length - 1];
        }
        return target1Id === "";
      });
    },

    isParentSiblingNode: function (targetArr) {
      if (!targetArr) targetArr = [];
      var target1 = targetArr[0] || {};
      var target1Id = "";
      if (target1.parentId && target1.parentId.length) {
        target1Id = target1.parentId[target1.parentId.length - 1];
      }
      return targetArr.every(function (item) {
        if (item && item.parentId && item.parentId.length) {
          return item.parentId.some(function (pid) { return pid === target1Id; }) && target1Id !== "";
        }
        return target1Id === "";
      });
    },

    getThemeNodes: function (text) {
      var _text = (text || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      var regex = new RegExp("(" + _text + ")", "gi");
      return text ? text.replace(regex, '<span style="color: ' + this.computedThemeColor + '">$1</span>') : "";
    },

    getNodes: function (ouputText) {
      if (this.keywords && ouputText) {
        var key = (this.keywords || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        var regex = new RegExp("(" + key + ")", "gi");
        return ouputText.replace(regex, '<span style="color: ' + this.computedThemeColor + '">$1</span>');
      }
      return ouputText;
    },

    getHalfCheckedFormTreeData: function (item) {
      var self = this;
      if (self.checkStrictly || !self.showHalfCheckedTips) return false;
      var children = item[self.childrenKey];
      if (children && children.length) {
        return children.some(function (it) {
          if (it.checked) return true;
          if (it[self.childrenKey] && it[self.childrenKey].length) return self.getHalfCheckedFormTreeData(it);
          return false;
        });
      }
      return false;
    },

    getItemFromTreeData: function (treeData, id) {
      if (!id) return null;
      var self = this;
      var item = null;
      (treeData || []).some(function (it) {
        if (it[self.valueKey] === id) {
          item = it;
          return true;
        } else if (it[self.childrenKey] && it[self.childrenKey].length) {
          item = self.getItemFromTreeData(it[self.childrenKey], id);
          return !!item;
        }
        return false;
      });
      return item;
    },

    handleTreeItemSelect: function (item, _index) {
      var self = this;
      self.dragItem.isDragging = false;
      var index = self.treeList.findIndex(function (it) { return it.id === item.id; });
      if (item.disabled) return;
      self.treeList[index].checked = !self.treeList[index].checked;

      if (self.changeVerify) {
        var current = Object.assign({}, item.source);
        current.checked = item.checked;
        var tip = self.changeVerify(current, self.isMultiple ? self.getCheckedParams() : [current]);
        if (tip) {
          self.treeList[index].checked = !self.treeList[index].checked;
          uni.showToast({ title: tip, icon: "none" });
          return;
        }
      }

      self.treeList[index].halfChecked = false;
      if (self.isMultiple && self.checkStrictly) {
        if (!item.lastRank) {
          var source = item.source || {};
          var children = source[self.childrenKey] || [];
          var checkedKeyList = self.getChildrenKeys(children);
          self.treeList.forEach(function (v, i) {
            if (checkedKeyList.indexOf(v.id) !== -1) {
              if (self.checkStrictlyModel === "weak") {
                if (!self.treeList[i].disabled) {
                  self.treeList[i].checked = self.treeList[index].checked;
                }
              } else if (self.checkStrictlyModel === "strong") {
                self.treeList[i].checked = self.treeList[index].checked;
              }
            }
          });
        }
        self.updateParentChecked(index);
      } else if (self.isMultiple && !self.checkStrictly && self.showHalfCheckedTips) {
        self.updateHalfChecked(index);
      } else {
        self.fixMultiple(index);
      }
      self.$emit("change", self.getCheckedParams());
    },

    getItemFortreeListChildLen: function (id) {
      var l = 0;
      this.treeList.forEach(function (item) {
        if (item.parentId.indexOf(id) !== -1) l++;
      });
      return l;
    },

    scrollCallback: function (e) {
      if (this.draggable) {
        var self = this;
        clearTimeout(self.timer);
        self.timer = setTimeout(function () {
          var detail = e.detail;
          self.scrollTop = detail.scrollTop;
        }, 100);
      }
    },

    updateParentChecked: function (index) {
      var self = this;
      var parentId = (self.treeList[index].parentId || []).concat([]).reverse();
      if (parentId && parentId.length) {
        parentId.forEach(function (id) {
          var parentTreeDataItem = self.getItemFromTreeData(self.currentTreeData, id);
          if (!parentTreeDataItem) return;
          var childrenIds = (parentTreeDataItem[self.childrenKey] || []).map(function (i) { return i[self.valueKey]; });

          var allChecked = self.treeList.filter(function (it) { return childrenIds.indexOf(it.id) !== -1; }).every(function (it) { return it.checked; });
          var allUnchecked = self.treeList.filter(function (it) { return childrenIds.indexOf(it.id) !== -1; }).every(function (it) { return !it.checked; });

          var parentItem = self.treeList.find(function (it) { return it.id === id; });
          if (parentItem) {
            if (self.checkStrictlyModel === "weak") {
              if (allChecked && !parentItem.disabled) parentItem.checked = true;
              else if (allUnchecked && !parentItem.disabled) parentItem.checked = false;
            } else if (self.checkStrictlyModel === "strong") {
              parentItem.checked = allChecked;
            }

            if (self.showHalfCheckedTips && !parentItem.checked) {
              parentItem.halfChecked = self.treeList.filter(function (it) { return childrenIds.indexOf(it.id) !== -1; }).some(function (it) { return it.checked; });
            }
          }
        });
      }
    },

    updateHalfChecked: function (index) {
      var self = this;
      var parentId = (self.treeList[index].parentId || []).concat([]).reverse();
      if (parentId && parentId.length) {
        parentId.forEach(function (id) {
          var parentTreeDataItem = self.getItemFromTreeData(self.currentTreeData, id);
          if (!parentTreeDataItem) return;
          var childrenIds = (parentTreeDataItem[self.childrenKey] || []).map(function (i) { return i[self.valueKey]; });
          var allUnchecked = self.treeList
            .filter(function (it) { return childrenIds.indexOf(it.id) !== -1; })
            .every(function (it) { return !it.checked && !it.halfChecked; });
          var someChecked = self.treeList
            .filter(function (it) { return childrenIds.indexOf(it.id) !== -1; })
            .some(function (it) { return it.checked || it.halfChecked; });

          var parentItem = self.treeList.find(function (it) { return it.id === id; });
          if (parentItem && !parentItem.checked) {
            parentItem.halfChecked = !allUnchecked && someChecked;
          }
        });
      }
      if (!self.treeList[index].checked) {
        var source = self.treeList[index].source || {};
        var children = source[self.childrenKey] || [];
        var checkedKeyList = self.getChildrenKeys(children);
        var someChecked = self.treeList.filter(function (it) { return checkedKeyList.indexOf(it.id) !== -1; }).some(function (it) { return it.checked; });
        if (someChecked) {
          self.treeList[index].halfChecked = true;
        }
      }
    },

    showHalfChecked: function (item) {
      return this.isMultiple && item.halfChecked === true;
    },

    getChildrenKeys: function (children) {
      var self = this;
      var keys = [];
      (children || []).forEach(function (item) {
        keys.push(item[self.valueKey]);
        if (item[self.childrenKey] && item[self.childrenKey].length) {
          keys = keys.concat(self.getChildrenKeys(item[self.childrenKey]));
        }
      });
      return keys;
    },

    fixMultiple: function (index) {
      var self = this;
      if (!self.isMultiple) {
        self.treeList.forEach(function (v, i) {
          self.treeList[i].checked = i === index;
        });
      }
    },

    handleClear: function () {
      var self = this;
      self.treeList.forEach(function (item) {
        if (self.isMultiple && self.checkStrictly) {
          if (self.checkStrictlyModel === "strong") {
            item.checked = false;
          } else if (self.checkStrictlyModel === "weak") {
            if (!item.disabled) item.checked = false;
          } else {
            item.checked = false;
          }
        } else {
          if (!item.disabled) item.checked = false;
        }
        item.halfChecked = false;
      });
      self.$emit("change", self.getCheckedParams());
      self.$emit("clear");
    },

    onSearchChange: function (val) {
      var self = this;
      if (self.searchModel === "remote") {
        if (self.loadData) {
          if (val) {
            self.loadData({ $type: "remoteSearch", source: val }).then(function (newChild) {
              var lists = self.getRenderTreeList(newChild);
              self.treeList = lists.slice();
            });
          } else {
            self.cInitTree();
          }
        } else {
          uni.showToast({ title: "使用远程搜索模式，需要配置loadData函数；", icon: "none" });
        }
      } else {
        self.keywords = val;
      }
    },

    onSearchClear: function () {
      this.keywords = "";
      if (this.searchModel === "remote") {
        this.cInitTree();
      }
    },

    treeItemfocus: function (e) {
      if (this.draggable && this.dragItem.isDragging) {
        var self = this;
        var touches = e.touches[0];
        if (!touches) return;
        var query = uni.createSelectorQuery().in(self);
        query
          .selectAll(".tdesign-uniapp-tree-item-block")
          .boundingClientRect(function (rects) {
            (rects || []).forEach(function (rect, index) {
              if (touches.clientX >= rect.left && touches.clientX <= rect.right && touches.clientY >= rect.top && touches.clientY <= rect.bottom) {
                var showTreeList = self.computedTreeList.filter(function (it) { return it.show; });
                if (showTreeList && showTreeList.length) {
                  var data = showTreeList[index] || null;
                  if (data) {
                    var bool = data.parentId.some(function (parentid) { return parentid === self.dragItem.data.id; });
                    if (self.draggable && !bool && !data.showChild) {
                      self.dragItem.focusTreeItemId = data.id;
                    } else {
                      self.dragItem.focusTreeItemId = "";
                    }
                  } else {
                    self.dragItem.focusTreeItemId = "";
                  }
                } else {
                  self.dragItem.focusTreeItemId = "";
                }
              }
            });
          })
          .exec();
      }
    },

    onTouchStartItem: function (event, item) {
      if (item && item.disabled) return;
      var touch = event.touches[0];
      this.dragItem.data = item;
      this.dragItem.currentY = touch.clientY;
      this.dragItem.isDragging = true;
    },

    onTouchMove: function (event) {
      var touch = event.touches[0];
      this.dragItem.currentY = touch.clientY;
      if (this.draggable && this.dragItem.isDragging && this.throttleFunc) {
        this.throttleFunc(event);
      }
    },

    onTouchEnd: function () {
      if (this.dragItem.isDragging) {
        this.dragItem.isDragging = false;
        this.handleDrag();
      }
    },

    swapSegmentWithElement: function (arr, startIndex, length, endIndex, realyNextItem) {
      if (length === 0) {
        var startItem = JSON.parse(JSON.stringify(arr[startIndex]));
        startItem.parents = realyNextItem.parents;
        startItem.parentId = realyNextItem.parentId;
        startItem.rank = realyNextItem.rank;
        arr.splice(startIndex, 1);
        if (startIndex >= endIndex) {
          arr.splice(endIndex + 1, 0, startItem);
        } else {
          arr.splice(endIndex, 0, startItem);
        }
      } else {
        var _endIndex = endIndex + 1;
        var endItemParents = realyNextItem.parents || [];
        var firstItem = null;
        var segment = arr.slice(startIndex, startIndex + length).map(function (item, index) {
          if (endItemParents.length) {
            if (index === 0) {
              item.parents = realyNextItem.parents;
              item.parentId = realyNextItem.parentId;
              item.rank = realyNextItem.rank;
              firstItem = JSON.parse(JSON.stringify(item));
            } else {
              var firstParentIdx = item.parentId.findIndex(function (pid) { return firstItem.id === pid; });
              if (firstParentIdx !== -1) {
                var newParents = item.parents.slice(firstParentIdx + 1);
                var newParentId = item.parentId.slice(firstParentIdx + 1);
                newParents.unshift.apply(newParents, [].concat(realyNextItem.parents, [firstItem]));
                newParentId.unshift.apply(newParentId, [].concat(realyNextItem.parentId, [firstItem.id]));
                item.parents = newParents;
                item.parentId = newParentId;
                item.rank = item.parentId.length;
              }
            }
          } else {
            if (index === 0) {
              item.parents = [];
              item.parentId = [];
              item.rank = 0;
              firstItem = JSON.parse(JSON.stringify(item));
            } else {
              var cutIndex = item.parentId.findIndex(function (pid) { return firstItem.id === pid; });
              if (cutIndex !== -1) {
                item.parents = item.parents.slice(cutIndex);
                item.parentId = item.parentId.slice(cutIndex);
                item.rank = item.parentId.length;
              }
            }
          }
          return item;
        });
        arr.splice(startIndex, length);
        if (startIndex >= _endIndex) {
          arr.splice(_endIndex, 0, ...segment);
        } else {
          arr.splice(_endIndex - length, 0, ...segment);
        }
      }
      return arr;
    },

    handleDrag: function () {
      var self = this;
      var prvItem = self.dragItem.data;
      var prvChildLen = 0;
      var prvIndex = -1;
      var nextIndex = -1;
      var realyNextItem = null;

      self.treeList.forEach(function (item, index) {
        if (item.id === prvItem.id) prvIndex = index;
        if (item.id === self.dragItem.focusTreeItemId) {
          realyNextItem = item;
          nextIndex = item.showChild ? index : index + self.getItemFortreeListChildLen(item.id);
        }
        if (item.parentId.some(function (pid) { return pid === prvItem.id; })) {
          prvChildLen++;
        }
      });

      if (prvIndex !== -1 && nextIndex !== -1 && realyNextItem) {
        var treelist = JSON.parse(JSON.stringify(self.treeList));
        if (prvChildLen !== 0) prvChildLen++;
        self.treeList = self.swapSegmentWithElement(treelist, prvIndex, prvChildLen, nextIndex, realyNextItem);
      }
    },

    uiModeInit: function (keepAlive) {
      var self = this;
      uni.getSystemInfo({
        success: function (res) {
          self.windowHeight = res.windowHeight;
        },
      });

      if (self.uiMode === "popup") {
        // popup mode: watch is handled in the watch option
      } else if (self.uiMode === "page") {
        self.top = "0px";
        // page mode: watch is handled in the watch option
        self.$nextTick(function () {
          self.showTree = true;
        });
      } else {
        // default to popup
      }
    },
  },
};
</script>

<style scoped>
@import "./style.css";
</style>
