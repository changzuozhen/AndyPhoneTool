export type ToolDefinition = {
  id: string;
  title: string;
  description: string;
  icon: 'flashlight' | 'construct';
  route: '/tools/camera-flash';
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
    id: 'coming-soon',
    title: '更多工具',
    description: '后续功能将在此陆续上线',
    icon: 'construct',
    route: '/tools/camera-flash',
    available: false,
  },
];
