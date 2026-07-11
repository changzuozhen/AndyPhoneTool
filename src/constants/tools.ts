export type ToolDefinition = {
  id: string;
  title: string;
  description: string;
  icon: 'flashlight' | 'hardware-chip' | 'speedometer' | 'construct';
  route: '/tools/camera-flash' | '/tools/device-info' | '/tools/net-speed';
  available: boolean;
};

export const TOOLS: ToolDefinition[] = [
  {
    id: 'camera-flash',
    title: '手电筒相机',
    description: '进入即开闪光灯，支持亮度调节、自动对焦与双指缩放',
    icon: 'flashlight',
    route: '/tools/camera-flash',
    available: true,
  },
  {
    id: 'device-info',
    title: '设备信息中心',
    description: '查看设备参数、电量、网络与实时传感器数据',
    icon: 'hardware-chip',
    route: '/tools/device-info',
    available: true,
  },
  {
    id: 'net-speed',
    title: '网速悬浮窗',
    description: '在其他 App 上方显示实时上/下行网速（Android 悬浮窗 / iOS 画中画）',
    icon: 'speedometer',
    route: '/tools/net-speed',
    available: true,
  },
  {
    id: 'coming-soon',
    title: '更多工具',
    description: '后续功能将在此陆续上线',
    icon: 'construct',
    route: '/tools/camera-flash',
    available: false,
  },
];
