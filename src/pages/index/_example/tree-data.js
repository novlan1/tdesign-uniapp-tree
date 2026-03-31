/** 公共树数据，供各 demo 复用 */
export const treeData = [
  {
    id: '1',
    label: '北京',
    children: [
      { id: '1-3-3-1', label: '北京区-1' },
      { id: '1-3-3-2', label: '北京区-2' },
      { id: '1-3-3-3', label: '北京区-3' },
      { id: '1-3-3-4', label: '北京区-4' },
      { id: '1-3-3-5', label: '北京区-5' },
      { id: '1-3-3-6', label: '北京区-6' },
      { id: '1-3-3-7', label: '北京区[a1]-7' },
      { id: '1-3-3-8', label: '北京区[a2]-8' },
      { id: '1-3-3-9', label: '北京区-9' },
      { id: '1-3-3-10', label: '北京区-10' },
    ],
  },
  {
    id: '2',
    label: '上海',
    children: [
      { id: '2-1', label: '上海-1' },
      { id: '2-2', label: '上海-2' },
      { id: '2-3', label: '上海-3' },
    ],
  },
  {
    id: '3',
    label: '广州',
    children: [
      {
        id: '3-1',
        label: '海珠区',
        children: [
          { id: '3-1-1', label: '海珠区-1', disabled: true },
          { id: '3-1-2', label: '海珠区-2' },
          { id: '3-1-4', label: '海珠区-3' },
          {
            id: '3-1-5',
            label: '海珠区-4',
            children: [
              { id: '3-1-5-1', label: '海珠区-4-200号' },
              {
                id: '3-1-5-2',
                label: '海珠区-4-201号',
                children: [
                  { id: '3-1-5-1-1', label: '琶洲大街新港东路-4-200号-2' },
                  { id: '3-1-5-2-1', label: '海珠区-4-201号-3' },
                ],
              },
            ],
          },
          { id: '3-1-6', label: '海珠区-5' },
          { id: '3-1-7', label: '海珠区-6' },
          { id: '3-1-8', label: '海珠区-7' },
          { id: '3-1-9', label: '海珠区-8' },
          { id: '3-1-10', label: '快乐小卖铺-9' },
          { id: '3-1-11', label: '海珠区-10' },
        ],
      },
      {
        id: '3-2',
        label: '番禺区',
        disabled: true,
        checked: true,
        children: [
          { id: '3-2-1', label: '番禺区-1' },
          { id: '3-2-2', label: '番禺区-2' },
          { id: '3-2-4', label: '番禺区-3' },
          { id: '3-2-5', label: '番禺区-4' },
          { id: '3-2-6', label: '番禺区-5' },
        ],
      },
      {
        id: '3-3',
        label: '黄埔区',
        children: [
          { id: '3-3-1', label: '黄埔区-1' },
          { id: '3-3-2', label: '黄埔区-2' },
          { id: '3-3-3', label: '黄埔区-3' },
        ],
      },
    ],
  },
];

/** 异步加载用的模拟数据 */
export const asyncLocalData = {
  a1: [
    { id: 'a1-1', label: 'a1-1' },
    { id: 'a1-2', label: 'a1-2', children: [] },
    { id: 'a1-3', label: 'a1-3' },
  ],
  b1: [
    { id: 'b1-1', label: 'b1-1', children: [] },
    { id: 'b1-2', label: 'b1-2' },
    { id: 'b1-3', label: 'b1-3' },
  ],
  c1: [
    { id: 'c1-1', label: 'c1-1' },
    { id: 'c1-2', label: 'c1-2' },
    { id: 'c1-3', label: 'c1-3', children: [] },
  ],
  'a1-2': [
    { id: 'a1-2-1', label: 'a1-2-1' },
    { id: 'a1-2-2', label: 'a1-2-2' },
  ],
  'b1-1': [
    { id: 'b1-1-1', label: 'b1-1-1' },
    { id: 'b1-1-2', label: 'b1-1-2' },
  ],
  'c1-3': [],
};

export const asyncTreeData = [
  { id: 'a1', label: 'a1', children: [] },
  { id: 'b1', label: 'b1', children: [] },
  { id: 'c1', label: 'c1', children: [] },
];

/** 深拷贝树数据，避免 demo 间互相影响 */
export function cloneTreeData(data) {
  return JSON.parse(JSON.stringify(data));
}
