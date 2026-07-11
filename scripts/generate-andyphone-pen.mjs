#!/usr/bin/env node
/**
 * Generate design/AndyPhoneTool.pen (Pencil v2.14) for AndyPhoneTool UI screens.
 * @see design/REQUIREMENTS.md
 */
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = resolve(__dirname, '../design/AndyPhoneTool.pen');

const VARIABLES = {
  "surface": {
    "type": "color",
    "value": "#1A1D26"
  },
  "border": {
    "type": "color",
    "value": "#2E3340"
  },
  "accent": {
    "type": "color",
    "value": "#4DA3FF"
  },
  "background": {
    "type": "color",
    "value": "#0F1117"
  },
  "surfaceElevated": {
    "type": "color",
    "value": "#242833"
  },
  "textPrimary": {
    "type": "color",
    "value": "#F5F5F7"
  },
  "textSecondary": {
    "type": "color",
    "value": "#9CA3AF"
  },
  "accentWarm": {
    "type": "color",
    "value": "#FFB347"
  },
  "danger": {
    "type": "color",
    "value": "#8B3A3A"
  },
  "success": {
    "type": "color",
    "value": "#4ADE80"
  }
};

function buildChildren() {
  return [
  {
    "type": "frame",
    "id": "PVo0u",
    "x": 0,
    "y": 0,
    "name": "StatusBar",
    "reusable": true,
    "width": 390,
    "height": 62,
    "padding": [
      0,
      24
    ],
    "justifyContent": "space_between",
    "alignItems": "center",
    "children": [
      {
        "type": "text",
        "id": "Yzi7H",
        "name": "Time",
        "fill": "$textPrimary",
        "content": "9:41",
        "fontFamily": "Inter",
        "fontSize": 15,
        "fontWeight": "600"
      },
      {
        "type": "frame",
        "id": "C06JYf",
        "name": "Icons",
        "gap": 6,
        "alignItems": "center",
        "children": [
          {
            "type": "text",
            "id": "Tu5ph",
            "name": "Signal",
            "fill": "$textPrimary",
            "content": "▮▮▮",
            "fontFamily": "Inter",
            "fontSize": 12,
            "fontWeight": "normal"
          },
          {
            "type": "text",
            "id": "i6jji",
            "name": "Wifi",
            "fill": "$textPrimary",
            "content": "WiFi",
            "fontFamily": "Inter",
            "fontSize": 12,
            "fontWeight": "normal"
          },
          {
            "type": "text",
            "id": "X7OmGB",
            "name": "Battery",
            "fill": "$textPrimary",
            "content": "100%",
            "fontFamily": "Inter",
            "fontSize": 12,
            "fontWeight": "normal"
          }
        ]
      }
    ]
  },
  {
    "type": "frame",
    "id": "XfZBv",
    "x": 0,
    "y": 102,
    "name": "ScreenHeader",
    "reusable": true,
    "width": 390,
    "height": 48,
    "justifyContent": "space_between",
    "alignItems": "center",
    "children": [
      {
        "type": "frame",
        "id": "w94Flz",
        "name": "BackButton",
        "width": 40,
        "height": 40,
        "fill": "$surface",
        "cornerRadius": 20,
        "justifyContent": "center",
        "alignItems": "center",
        "children": [
          {
            "type": "text",
            "id": "zBloZ",
            "name": "BackIcon",
            "fill": "$textPrimary",
            "content": "‹",
            "fontFamily": "Inter",
            "fontSize": 18,
            "fontWeight": "normal"
          }
        ]
      },
      {
        "type": "text",
        "id": "TBDsO",
        "name": "Title",
        "fill": "$textPrimary",
        "content": "页面标题",
        "fontFamily": "Inter",
        "fontSize": 17,
        "fontWeight": "700"
      },
      {
        "type": "frame",
        "id": "Wm2ZI",
        "name": "Spacer",
        "width": 40,
        "height": 40
      }
    ]
  },
  {
    "type": "frame",
    "id": "O1yiQ",
    "x": 0,
    "y": 190,
    "name": "ToolCard",
    "reusable": true,
    "width": 350,
    "height": 88,
    "fill": "$surface",
    "cornerRadius": 16,
    "stroke": "$border",
    "strokeWidth": 1,
    "gap": 16,
    "padding": 18,
    "alignItems": "center",
    "children": [
      {
        "type": "frame",
        "id": "nHyMY",
        "name": "IconWrap",
        "width": 52,
        "height": 52,
        "fill": "$surfaceElevated",
        "cornerRadius": 14,
        "justifyContent": "center",
        "alignItems": "center",
        "children": [
          {
            "type": "text",
            "id": "s684mJ",
            "name": "Icon",
            "fill": "$accentWarm",
            "content": "⚡",
            "fontFamily": "Inter",
            "fontSize": 22,
            "fontWeight": "normal"
          }
        ]
      },
      {
        "type": "frame",
        "id": "wiGXk",
        "name": "Content",
        "width": "fill_container",
        "layout": "vertical",
        "gap": 4,
        "children": [
          {
            "type": "text",
            "id": "XWUWI",
            "name": "Title",
            "fill": "$textPrimary",
            "content": "工具名称",
            "fontFamily": "Inter",
            "fontSize": 17,
            "fontWeight": "600"
          },
          {
            "type": "text",
            "id": "ixyMo",
            "name": "Description",
            "fill": "$textSecondary",
            "textGrowth": "fixed-width",
            "width": "fill_container",
            "content": "工具描述文案",
            "lineHeight": 1.3,
            "fontFamily": "Inter",
            "fontSize": 13,
            "fontWeight": "normal"
          }
        ]
      },
      {
        "type": "text",
        "id": "eXh07",
        "name": "Chevron",
        "fill": "$textSecondary",
        "content": "›",
        "fontFamily": "Inter",
        "fontSize": 18,
        "fontWeight": "normal"
      }
    ]
  },
  {
    "type": "frame",
    "id": "V9P9Dl",
    "x": 0,
    "y": 318,
    "name": "StatusRow",
    "reusable": true,
    "width": 320,
    "height": 24,
    "gap": 8,
    "alignItems": "center",
    "children": [
      {
        "type": "ellipse",
        "id": "nnbkJ",
        "name": "Dot",
        "fill": "$textSecondary",
        "width": 8,
        "height": 8
      },
      {
        "type": "text",
        "id": "M8qsty",
        "name": "Label",
        "fill": "$textSecondary",
        "content": "状态项",
        "fontFamily": "Inter",
        "fontSize": 13,
        "fontWeight": "normal"
      },
      {
        "type": "text",
        "id": "MPq16",
        "name": "Value",
        "fill": "$textPrimary",
        "content": "值",
        "textAlign": "right",
        "fontFamily": "Inter",
        "fontSize": 13,
        "fontWeight": "600"
      }
    ]
  },
  {
    "type": "frame",
    "id": "t5fP6",
    "x": 0,
    "y": 382,
    "name": "PrimaryButton",
    "reusable": true,
    "width": 350,
    "height": 48,
    "fill": "$accent",
    "cornerRadius": 12,
    "justifyContent": "center",
    "alignItems": "center",
    "children": [
      {
        "type": "text",
        "id": "l11Yg3",
        "name": "Label",
        "fill": "#FFFFFF",
        "content": "按钮文案",
        "fontFamily": "Inter",
        "fontSize": 15,
        "fontWeight": "700"
      }
    ]
  },
  {
    "type": "frame",
    "id": "dVAYS",
    "x": 0,
    "y": -760,
    "name": "00 设计概览",
    "clip": true,
    "width": 1280,
    "height": 720,
    "fill": "$background",
    "layout": "vertical",
    "gap": 20,
    "padding": 24,
    "children": [
      {
        "type": "text",
        "id": "mlsrP",
        "name": "Title",
        "fill": "$accent",
        "content": "AndyPhoneTool 设计稿",
        "fontFamily": "Inter",
        "fontSize": 24,
        "fontWeight": "700"
      },
      {
        "type": "text",
        "id": "ivEHN",
        "name": "Meta",
        "fill": "$textSecondary",
        "content": "Expo 跨端手机工具箱 · 画布 390×844 · 深色主题",
        "fontFamily": "Inter",
        "fontSize": 13,
        "fontWeight": "normal"
      },
      {
        "type": "frame",
        "id": "TUsRD",
        "name": "Screens",
        "width": "fill_container",
        "gap": 16,
        "children": [
          {
            "type": "frame",
            "id": "G8TWJl",
            "name": "01 首页导航",
            "width": 220,
            "fill": "$surface",
            "cornerRadius": 12,
            "stroke": "$border",
            "strokeWidth": 1,
            "layout": "vertical",
            "gap": 8,
            "padding": 16,
            "children": [
              {
                "type": "text",
                "id": "iuHoT",
                "name": "Name",
                "fill": "$textPrimary",
                "content": "01 首页导航",
                "fontFamily": "Inter",
                "fontSize": 14,
                "fontWeight": "600"
              },
              {
                "type": "text",
                "id": "ytd44",
                "name": "Desc",
                "fill": "$textSecondary",
                "textGrowth": "fixed-width",
                "width": "fill_container",
                "content": "工具卡片列表",
                "lineHeight": 1.4,
                "fontFamily": "Inter",
                "fontSize": 12,
                "fontWeight": "normal"
              }
            ]
          },
          {
            "type": "frame",
            "id": "WjKcT",
            "name": "02 手电筒相机",
            "width": 220,
            "fill": "$surface",
            "cornerRadius": 12,
            "stroke": "$border",
            "strokeWidth": 1,
            "layout": "vertical",
            "gap": 8,
            "padding": 16,
            "children": [
              {
                "type": "text",
                "id": "fZca3",
                "name": "Name",
                "fill": "$textPrimary",
                "content": "02 手电筒相机",
                "fontFamily": "Inter",
                "fontSize": 14,
                "fontWeight": "600"
              },
              {
                "type": "text",
                "id": "TMXGY",
                "name": "Desc",
                "fill": "$textSecondary",
                "textGrowth": "fixed-width",
                "width": "fill_container",
                "content": "全屏相机 + 亮度滑杆",
                "lineHeight": 1.4,
                "fontFamily": "Inter",
                "fontSize": 12,
                "fontWeight": "normal"
              }
            ]
          },
          {
            "type": "frame",
            "id": "QiR0a",
            "name": "03 设备信息中心",
            "width": 220,
            "fill": "$surface",
            "cornerRadius": 12,
            "stroke": "$border",
            "strokeWidth": 1,
            "layout": "vertical",
            "gap": 8,
            "padding": 16,
            "children": [
              {
                "type": "text",
                "id": "IBJwk",
                "name": "Name",
                "fill": "$textPrimary",
                "content": "03 设备信息中心",
                "fontFamily": "Inter",
                "fontSize": 14,
                "fontWeight": "600"
              },
              {
                "type": "text",
                "id": "GXnZH",
                "name": "Desc",
                "fill": "$textSecondary",
                "textGrowth": "fixed-width",
                "width": "fill_container",
                "content": "分组信息卡片",
                "lineHeight": 1.4,
                "fontFamily": "Inter",
                "fontSize": 12,
                "fontWeight": "normal"
              }
            ]
          },
          {
            "type": "frame",
            "id": "m2StgO",
            "name": "04 网速悬浮窗",
            "width": 220,
            "fill": "$surface",
            "cornerRadius": 12,
            "stroke": "$border",
            "strokeWidth": 1,
            "layout": "vertical",
            "gap": 8,
            "padding": 16,
            "children": [
              {
                "type": "text",
                "id": "u99JQ",
                "name": "Name",
                "fill": "$textPrimary",
                "content": "04 网速悬浮窗",
                "fontFamily": "Inter",
                "fontSize": 14,
                "fontWeight": "600"
              },
              {
                "type": "text",
                "id": "p82pzg",
                "name": "Desc",
                "fill": "$textSecondary",
                "textGrowth": "fixed-width",
                "width": "fill_container",
                "content": "授权 + 开关",
                "lineHeight": 1.4,
                "fontFamily": "Inter",
                "fontSize": 12,
                "fontWeight": "normal"
              }
            ]
          },
          {
            "type": "frame",
            "id": "qOOkn",
            "name": "05 悬浮网速条",
            "width": 220,
            "fill": "$surface",
            "cornerRadius": 12,
            "stroke": "$border",
            "strokeWidth": 1,
            "layout": "vertical",
            "gap": 8,
            "padding": 16,
            "children": [
              {
                "type": "text",
                "id": "s2JQc8",
                "name": "Name",
                "fill": "$textPrimary",
                "content": "05 悬浮网速条",
                "fontFamily": "Inter",
                "fontSize": 14,
                "fontWeight": "600"
              },
              {
                "type": "text",
                "id": "YQKNA",
                "name": "Desc",
                "fill": "$textSecondary",
                "textGrowth": "fixed-width",
                "width": "fill_container",
                "content": "Android overlay 示意",
                "lineHeight": 1.4,
                "fontFamily": "Inter",
                "fontSize": 12,
                "fontWeight": "normal"
              }
            ]
          }
        ]
      },
      {
        "type": "frame",
        "id": "o143jx",
        "name": "Tokens",
        "width": "fill_container",
        "gap": 12,
        "children": [
          {
            "type": "frame",
            "id": "xcI7w",
            "name": "background",
            "layout": "vertical",
            "gap": 6,
            "alignItems": "center",
            "children": [
              {
                "type": "rectangle",
                "cornerRadius": 8,
                "id": "m3PxjY",
                "name": "Swatch",
                "fill": "$background",
                "width": 40,
                "height": 40
              },
              {
                "type": "text",
                "id": "ZNjTk",
                "name": "Label",
                "fill": "$textSecondary",
                "content": "background",
                "fontFamily": "Inter",
                "fontSize": 10,
                "fontWeight": "normal"
              }
            ]
          },
          {
            "type": "frame",
            "id": "eQxL4",
            "name": "surface",
            "layout": "vertical",
            "gap": 6,
            "alignItems": "center",
            "children": [
              {
                "type": "rectangle",
                "cornerRadius": 8,
                "id": "gVhCI",
                "name": "Swatch",
                "fill": "$surface",
                "width": 40,
                "height": 40
              },
              {
                "type": "text",
                "id": "L1CG2W",
                "name": "Label",
                "fill": "$textSecondary",
                "content": "surface",
                "fontFamily": "Inter",
                "fontSize": 10,
                "fontWeight": "normal"
              }
            ]
          },
          {
            "type": "frame",
            "id": "r2thxy",
            "name": "accent",
            "layout": "vertical",
            "gap": 6,
            "alignItems": "center",
            "children": [
              {
                "type": "rectangle",
                "cornerRadius": 8,
                "id": "TL9Zr",
                "name": "Swatch",
                "fill": "$accent",
                "width": 40,
                "height": 40
              },
              {
                "type": "text",
                "id": "FV73u",
                "name": "Label",
                "fill": "$textSecondary",
                "content": "accent",
                "fontFamily": "Inter",
                "fontSize": 10,
                "fontWeight": "normal"
              }
            ]
          },
          {
            "type": "frame",
            "id": "nbItC",
            "name": "accentWarm",
            "layout": "vertical",
            "gap": 6,
            "alignItems": "center",
            "children": [
              {
                "type": "rectangle",
                "cornerRadius": 8,
                "id": "N6DRX",
                "name": "Swatch",
                "fill": "$accentWarm",
                "width": 40,
                "height": 40
              },
              {
                "type": "text",
                "id": "Fw1SH",
                "name": "Label",
                "fill": "$textSecondary",
                "content": "accentWarm",
                "fontFamily": "Inter",
                "fontSize": 10,
                "fontWeight": "normal"
              }
            ]
          },
          {
            "type": "frame",
            "id": "AaHJu",
            "name": "textPrimary",
            "layout": "vertical",
            "gap": 6,
            "alignItems": "center",
            "children": [
              {
                "type": "rectangle",
                "cornerRadius": 8,
                "id": "NqaF5",
                "name": "Swatch",
                "fill": "$textPrimary",
                "width": 40,
                "height": 40
              },
              {
                "type": "text",
                "id": "w9a1D",
                "name": "Label",
                "fill": "$textSecondary",
                "content": "textPrimary",
                "fontFamily": "Inter",
                "fontSize": 10,
                "fontWeight": "normal"
              }
            ]
          },
          {
            "type": "frame",
            "id": "WxeK1",
            "name": "textSecondary",
            "layout": "vertical",
            "gap": 6,
            "alignItems": "center",
            "children": [
              {
                "type": "rectangle",
                "cornerRadius": 8,
                "id": "QbsYW",
                "name": "Swatch",
                "fill": "$textSecondary",
                "width": 40,
                "height": 40
              },
              {
                "type": "text",
                "id": "A2OEn",
                "name": "Label",
                "fill": "$textSecondary",
                "content": "textSecondary",
                "fontFamily": "Inter",
                "fontSize": 10,
                "fontWeight": "normal"
              }
            ]
          }
        ]
      },
      {
        "type": "frame",
        "id": "WwSz0",
        "name": "Components",
        "width": "fill_container",
        "gap": 12,
        "alignItems": "center",
        "children": [
          {
            "type": "text",
            "id": "iNyrr",
            "name": "Label",
            "fill": "$textSecondary",
            "content": "可复用组件：",
            "fontFamily": "Inter",
            "fontSize": 12,
            "fontWeight": "600"
          },
          {
            "id": "yk1rv",
            "type": "ref",
            "ref": "O1yiQ",
            "name": "ToolCard Demo",
            "descendants": {
              "s684mJ": {
                "content": "⚡"
              },
              "XWUWI": {
                "content": "ToolCard"
              },
              "ixyMo": {
                "content": "工具入口卡片"
              }
            }
          },
          {
            "id": "d65PJT",
            "type": "ref",
            "ref": "V9P9Dl",
            "name": "StatusRow Demo",
            "descendants": {
              "nnbkJ": {
                "fill": "$accentWarm"
              },
              "M8qsty": {
                "content": "状态"
              },
              "MPq16": {
                "content": "正常"
              }
            }
          },
          {
            "id": "kwfef",
            "type": "ref",
            "ref": "t5fP6",
            "name": "Button Demo",
            "descendants": {
              "l11Yg3": {
                "content": "PrimaryButton"
              }
            }
          }
        ]
      }
    ]
  },
  {
    "type": "frame",
    "id": "BXsgB",
    "x": 470,
    "y": 0,
    "name": "01 首页导航",
    "clip": true,
    "width": 390,
    "height": 844,
    "fill": "$background",
    "layout": "vertical",
    "children": [
      {
        "id": "t4d5u",
        "type": "ref",
        "ref": "PVo0u",
        "name": "StatusBar"
      },
      {
        "type": "frame",
        "id": "I8ejd3",
        "name": "Content",
        "width": "fill_container",
        "height": "fill_container",
        "layout": "vertical",
        "gap": 28,
        "padding": [
          16,
          20,
          24,
          20
        ],
        "children": [
          {
            "type": "frame",
            "id": "IQtb8",
            "name": "Header",
            "width": "fill_container",
            "layout": "vertical",
            "gap": 6,
            "children": [
              {
                "type": "text",
                "id": "GvXpS",
                "name": "AppName",
                "fill": "$textPrimary",
                "content": "AndyPhoneTool",
                "fontFamily": "Inter",
                "fontSize": 28,
                "fontWeight": "800"
              },
              {
                "type": "text",
                "id": "AlI73",
                "name": "Subtitle",
                "fill": "$textSecondary",
                "content": "手机快捷工具箱 · 一触即达",
                "fontFamily": "Inter",
                "fontSize": 14,
                "fontWeight": "normal"
              }
            ]
          },
          {
            "type": "frame",
            "id": "S7RBeL",
            "name": "ToolsSection",
            "width": "fill_container",
            "layout": "vertical",
            "gap": 14,
            "children": [
              {
                "type": "text",
                "id": "T9SQI1",
                "name": "SectionTitle",
                "fill": "$textSecondary",
                "content": "工具",
                "fontFamily": "Inter",
                "fontSize": 12,
                "fontWeight": "700",
                "letterSpacing": 1
              },
              {
                "type": "frame",
                "id": "vwig6",
                "name": "ToolList",
                "width": "fill_container",
                "layout": "vertical",
                "gap": 12,
                "children": [
                  {
                    "id": "IxCml",
                    "type": "ref",
                    "ref": "O1yiQ",
                    "name": "手电筒相机",
                    "width": "fill_container",
                    "descendants": {
                      "s684mJ": {
                        "content": "⚡"
                      },
                      "XWUWI": {
                        "content": "手电筒相机"
                      },
                      "ixyMo": {
                        "content": "进入即开闪光灯，支持亮度调节、自动对焦与双指缩放"
                      }
                    }
                  },
                  {
                    "id": "G7pJ3",
                    "type": "ref",
                    "ref": "O1yiQ",
                    "name": "设备信息中心",
                    "width": "fill_container",
                    "descendants": {
                      "s684mJ": {
                        "content": "◆"
                      },
                      "XWUWI": {
                        "content": "设备信息中心"
                      },
                      "ixyMo": {
                        "content": "查看设备参数、电量、网络与实时传感器数据"
                      }
                    }
                  },
                  {
                    "id": "C1oD6",
                    "type": "ref",
                    "ref": "O1yiQ",
                    "name": "网速悬浮窗",
                    "width": "fill_container",
                    "descendants": {
                      "s684mJ": {
                        "content": "◎"
                      },
                      "XWUWI": {
                        "content": "网速悬浮窗"
                      },
                      "ixyMo": {
                        "content": "在其他 App 上方显示实时上/下行网速"
                      }
                    }
                  },
                  {
                    "type": "frame",
                    "id": "pXmv2",
                    "name": "ComingSoon",
                    "opacity": 0.55,
                    "width": "fill_container",
                    "fill": "$surface",
                    "cornerRadius": 16,
                    "stroke": "$border",
                    "strokeWidth": 1,
                    "gap": 16,
                    "padding": 18,
                    "alignItems": "center",
                    "children": [
                      {
                        "type": "frame",
                        "id": "i8IKmo",
                        "name": "IconWrap",
                        "width": 52,
                        "height": 52,
                        "fill": "$surface",
                        "cornerRadius": 14,
                        "justifyContent": "center",
                        "alignItems": "center",
                        "children": [
                          {
                            "type": "text",
                            "id": "lTE0V",
                            "name": "Icon",
                            "fill": "$textSecondary",
                            "content": "🔧",
                            "fontFamily": "Inter",
                            "fontSize": 22,
                            "fontWeight": "normal"
                          }
                        ]
                      },
                      {
                        "type": "frame",
                        "id": "taI4k",
                        "name": "Content",
                        "width": "fill_container",
                        "layout": "vertical",
                        "gap": 4,
                        "children": [
                          {
                            "type": "text",
                            "id": "vRfZI",
                            "name": "Title",
                            "fill": "$textSecondary",
                            "content": "更多工具",
                            "fontFamily": "Inter",
                            "fontSize": 17,
                            "fontWeight": "600"
                          },
                          {
                            "type": "text",
                            "id": "kc7ga",
                            "name": "Description",
                            "fill": "$textSecondary",
                            "textGrowth": "fixed-width",
                            "width": "fill_container",
                            "content": "后续功能将在此陆续上线",
                            "lineHeight": 1.3,
                            "fontFamily": "Inter",
                            "fontSize": 13,
                            "fontWeight": "normal"
                          },
                          {
                            "type": "text",
                            "id": "O6V9fP",
                            "name": "Badge",
                            "fill": "$textSecondary",
                            "content": "即将推出",
                            "fontFamily": "Inter",
                            "fontSize": 11,
                            "fontWeight": "600",
                            "letterSpacing": 0.6
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "type": "frame",
    "id": "xLX6v",
    "x": 940,
    "y": 0,
    "name": "02 手电筒相机",
    "clip": true,
    "width": 390,
    "height": 844,
    "fill": "#000000",
    "layout": "none",
    "children": [
      {
        "type": "rectangle",
        "id": "J7JWMV",
        "x": 0,
        "y": 0,
        "name": "CameraPreview",
        "fill": {
          "type": "gradient",
          "gradientType": "linear",
          "enabled": true,
          "rotation": 180,
          "size": {
            "height": 1
          },
          "colors": [
            {
              "color": "#2A3040",
              "position": 0
            },
            {
              "color": "#0A0C10",
              "position": 1
            }
          ]
        },
        "width": 390,
        "height": 844
      },
      {
        "type": "frame",
        "id": "P8Etj",
        "x": 159,
        "y": 320,
        "name": "FocusRing",
        "width": 72,
        "height": 72,
        "cornerRadius": 4,
        "stroke": "#ffffff59",
        "strokeWidth": 1,
        "layout": "none",
        "children": [
          {
            "type": "frame",
            "id": "LnbY1",
            "x": -1,
            "y": -1,
            "name": "TL",
            "width": 18,
            "height": 18,
            "stroke": "$accentWarm",
            "strokeWidth": 2,
            "layout": "none"
          },
          {
            "type": "frame",
            "id": "p4kPVz",
            "x": 69,
            "y": -1,
            "name": "TR",
            "width": 18,
            "height": 18,
            "stroke": "$accentWarm",
            "strokeWidth": 2,
            "layout": "none"
          },
          {
            "type": "frame",
            "id": "nmWcR",
            "x": -1,
            "y": 69,
            "name": "BL",
            "width": 18,
            "height": 18,
            "stroke": "$accentWarm",
            "strokeWidth": 2,
            "layout": "none"
          },
          {
            "type": "frame",
            "id": "O1DRg",
            "x": 69,
            "y": 69,
            "name": "BR",
            "width": 18,
            "height": 18,
            "stroke": "$accentWarm",
            "strokeWidth": 2,
            "layout": "none"
          }
        ]
      },
      {
        "type": "frame",
        "id": "fAOc9",
        "x": 0,
        "y": 54,
        "name": "TopBar",
        "width": 390,
        "height": 48,
        "gap": 8,
        "padding": [
          0,
          12
        ],
        "alignItems": "center",
        "children": [
          {
            "type": "frame",
            "id": "KdXjS",
            "name": "BackButton",
            "width": 40,
            "height": 40,
            "fill": "#00000073",
            "cornerRadius": 20,
            "justifyContent": "center",
            "alignItems": "center",
            "children": [
              {
                "type": "text",
                "id": "l5XGua",
                "name": "BackIcon",
                "fill": "#FFFFFF",
                "content": "‹",
                "fontFamily": "Inter",
                "fontSize": 18,
                "fontWeight": "normal"
              }
            ]
          },
          {
            "type": "text",
            "id": "gQUhs",
            "name": "Title",
            "fill": "#FFFFFF",
            "content": "手电筒相机",
            "fontFamily": "Inter",
            "fontSize": 17,
            "fontWeight": "600"
          },
          {
            "type": "frame",
            "id": "h6y1J",
            "name": "ZoomBadge",
            "fill": "#00000073",
            "cornerRadius": 12,
            "padding": [
              10,
              6
            ],
            "justifyContent": "center",
            "alignItems": "center",
            "children": [
              {
                "type": "text",
                "id": "IC0Bc",
                "name": "ZoomText",
                "fill": "#FFFFFF",
                "content": "0%",
                "fontFamily": "Inter",
                "fontSize": 12,
                "fontWeight": "600"
              }
            ]
          }
        ]
      },
      {
        "type": "frame",
        "id": "x8QBuH",
        "x": 0,
        "y": 660,
        "name": "BottomPanel",
        "width": 390,
        "height": 184,
        "fill": "#0F1117E0",
        "cornerRadius": [
          20,
          20,
          0,
          0
        ],
        "layout": "vertical",
        "gap": 12,
        "padding": [
          16,
          20,
          32,
          20
        ],
        "children": [
          {
            "type": "frame",
            "id": "H0pTU",
            "name": "StatusRow",
            "width": "fill_container",
            "gap": 8,
            "alignItems": "center",
            "children": [
              {
                "type": "ellipse",
                "id": "HXLEi",
                "name": "Dot",
                "fill": "$accentWarm",
                "width": 8,
                "height": 8
              },
              {
                "type": "text",
                "id": "aNAYc",
                "name": "StatusText",
                "fill": "$textPrimary",
                "content": "闪光灯已开启",
                "fontFamily": "Inter",
                "fontSize": 13,
                "fontWeight": "600"
              },
              {
                "type": "text",
                "id": "moFqA",
                "name": "Hint",
                "fill": "$textSecondary",
                "content": "双指捏合缩放 · 系统自动对焦",
                "fontFamily": "Inter",
                "fontSize": 12,
                "fontWeight": "normal"
              }
            ]
          },
          {
            "type": "frame",
            "id": "FyS4U",
            "name": "BrightnessSlider",
            "width": "fill_container",
            "layout": "vertical",
            "gap": 8,
            "children": [
              {
                "type": "frame",
                "id": "RcB12",
                "name": "Track",
                "width": "fill_container",
                "height": 6,
                "fill": "$border",
                "cornerRadius": 3,
                "layout": "none",
                "children": [
                  {
                    "type": "rectangle",
                    "cornerRadius": 3,
                    "id": "l8zy5K",
                    "x": 0,
                    "y": 0,
                    "name": "Fill",
                    "fill": "$accentWarm",
                    "width": 262,
                    "height": 6
                  }
                ]
              },
              {
                "type": "text",
                "id": "iLQ0a",
                "name": "Value",
                "fill": "$textSecondary",
                "content": "亮度 75%",
                "fontFamily": "Inter",
                "fontSize": 12,
                "fontWeight": "normal"
              }
            ]
          },
          {
            "type": "text",
            "id": "duPqm",
            "name": "Note",
            "fill": "$textSecondary",
            "textGrowth": "fixed-width",
            "width": "fill_container",
            "content": "亮度通过原生 torch 级别调节；低于 5% 关闭闪光灯。",
            "lineHeight": 1.4,
            "fontFamily": "Inter",
            "fontSize": 11,
            "fontWeight": "normal"
          }
        ]
      }
    ]
  },
  {
    "type": "frame",
    "id": "nD81U",
    "x": 1410,
    "y": 0,
    "name": "03 设备信息中心",
    "clip": true,
    "width": 390,
    "height": 844,
    "fill": "$background",
    "layout": "vertical",
    "children": [
      {
        "id": "GRDgd",
        "type": "ref",
        "ref": "PVo0u",
        "name": "StatusBar"
      },
      {
        "id": "iBg2o",
        "type": "ref",
        "ref": "XfZBv",
        "name": "Header",
        "descendants": {
          "TBDsO": {
            "content": "设备信息中心"
          }
        }
      },
      {
        "type": "frame",
        "id": "Qcw0X",
        "name": "ScrollContent",
        "width": "fill_container",
        "height": "fill_container",
        "layout": "vertical",
        "gap": 24,
        "padding": [
          8,
          20,
          32,
          20
        ],
        "children": [
          {
            "type": "frame",
            "id": "i11Cw0",
            "name": "设备参数",
            "width": "fill_container",
            "layout": "vertical",
            "gap": 10,
            "children": [
              {
                "type": "frame",
                "id": "i2tdjf",
                "name": "SectionHeader",
                "gap": 8,
                "alignItems": "center",
                "children": [
                  {
                    "type": "rectangle",
                    "cornerRadius": 2,
                    "id": "l74Sx",
                    "name": "Bar",
                    "fill": "$accent",
                    "width": 3,
                    "height": 14
                  },
                  {
                    "type": "text",
                    "id": "jImwN",
                    "name": "Title",
                    "fill": "$textSecondary",
                    "content": "设备参数",
                    "fontFamily": "Inter",
                    "fontSize": 13,
                    "fontWeight": "700",
                    "letterSpacing": 0.8
                  }
                ]
              },
              {
                "type": "frame",
                "id": "E9kpoH",
                "name": "Card",
                "width": "fill_container",
                "fill": "$surface",
                "cornerRadius": 14,
                "stroke": "$border",
                "strokeWidth": 1,
                "layout": "vertical",
                "children": [
                  {
                    "type": "frame",
                    "id": "PvBfD",
                    "name": "品牌",
                    "width": "fill_container",
                    "layout": "vertical",
                    "children": [
                      {
                        "type": "frame",
                        "id": "Zgmq8",
                        "name": "Row",
                        "width": "fill_container",
                        "padding": [
                          14,
                          16
                        ],
                        "justifyContent": "space_between",
                        "alignItems": "center",
                        "children": [
                          {
                            "type": "text",
                            "id": "mJ3ZR",
                            "name": "Label",
                            "fill": "$textSecondary",
                            "content": "品牌",
                            "fontFamily": "Inter",
                            "fontSize": 14,
                            "fontWeight": "normal"
                          },
                          {
                            "type": "text",
                            "id": "f716m",
                            "name": "Value",
                            "fill": "$textPrimary",
                            "content": "Apple",
                            "fontFamily": "Inter",
                            "fontSize": 14,
                            "fontWeight": "600"
                          }
                        ]
                      },
                      {
                        "type": "rectangle",
                        "id": "ICx64",
                        "name": "Divider",
                        "fill": "$border",
                        "width": "fill_container",
                        "height": 1
                      }
                    ]
                  },
                  {
                    "type": "frame",
                    "id": "TTqsE",
                    "name": "型号",
                    "width": "fill_container",
                    "layout": "vertical",
                    "children": [
                      {
                        "type": "frame",
                        "id": "Jtjvn",
                        "name": "Row",
                        "width": "fill_container",
                        "padding": [
                          14,
                          16
                        ],
                        "justifyContent": "space_between",
                        "alignItems": "center",
                        "children": [
                          {
                            "type": "text",
                            "id": "nivvQ",
                            "name": "Label",
                            "fill": "$textSecondary",
                            "content": "型号",
                            "fontFamily": "Inter",
                            "fontSize": 14,
                            "fontWeight": "normal"
                          },
                          {
                            "type": "text",
                            "id": "Gv9Uv",
                            "name": "Value",
                            "fill": "$textPrimary",
                            "content": "iPhone 15 Pro",
                            "fontFamily": "Inter",
                            "fontSize": 14,
                            "fontWeight": "600"
                          }
                        ]
                      },
                      {
                        "type": "rectangle",
                        "id": "sFlL6",
                        "name": "Divider",
                        "fill": "$border",
                        "width": "fill_container",
                        "height": 1
                      }
                    ]
                  },
                  {
                    "type": "frame",
                    "id": "l9YGH",
                    "name": "系统",
                    "width": "fill_container",
                    "layout": "vertical",
                    "children": [
                      {
                        "type": "frame",
                        "id": "gxrJE",
                        "name": "Row",
                        "width": "fill_container",
                        "padding": [
                          14,
                          16
                        ],
                        "justifyContent": "space_between",
                        "alignItems": "center",
                        "children": [
                          {
                            "type": "text",
                            "id": "Y1YVF",
                            "name": "Label",
                            "fill": "$textSecondary",
                            "content": "系统",
                            "fontFamily": "Inter",
                            "fontSize": 14,
                            "fontWeight": "normal"
                          },
                          {
                            "type": "text",
                            "id": "fHU6r",
                            "name": "Value",
                            "fill": "$textPrimary",
                            "content": "iOS 18.0",
                            "fontFamily": "Inter",
                            "fontSize": 14,
                            "fontWeight": "600"
                          }
                        ]
                      },
                      {
                        "type": "rectangle",
                        "id": "zhoey",
                        "name": "Divider",
                        "fill": "$border",
                        "width": "fill_container",
                        "height": 1
                      }
                    ]
                  },
                  {
                    "type": "frame",
                    "id": "U0coc",
                    "name": "CPU 架构",
                    "width": "fill_container",
                    "layout": "vertical",
                    "children": [
                      {
                        "type": "frame",
                        "id": "c7YgVu",
                        "name": "Row",
                        "width": "fill_container",
                        "padding": [
                          14,
                          16
                        ],
                        "justifyContent": "space_between",
                        "alignItems": "center",
                        "children": [
                          {
                            "type": "text",
                            "id": "fmd5n",
                            "name": "Label",
                            "fill": "$textSecondary",
                            "content": "CPU 架构",
                            "fontFamily": "Inter",
                            "fontSize": 14,
                            "fontWeight": "normal"
                          },
                          {
                            "type": "text",
                            "id": "pMgqe",
                            "name": "Value",
                            "fill": "$textPrimary",
                            "content": "arm64",
                            "fontFamily": "Inter",
                            "fontSize": 14,
                            "fontWeight": "600"
                          }
                        ]
                      },
                      {
                        "type": "rectangle",
                        "id": "eTxkS",
                        "name": "Divider",
                        "fill": "$border",
                        "width": "fill_container",
                        "height": 1
                      }
                    ]
                  },
                  {
                    "type": "frame",
                    "id": "w3ak1B",
                    "name": "运行内存",
                    "width": "fill_container",
                    "layout": "vertical",
                    "children": [
                      {
                        "type": "frame",
                        "id": "FcCPX",
                        "name": "Row",
                        "width": "fill_container",
                        "padding": [
                          14,
                          16
                        ],
                        "justifyContent": "space_between",
                        "alignItems": "center",
                        "children": [
                          {
                            "type": "text",
                            "id": "UJxtJ",
                            "name": "Label",
                            "fill": "$textSecondary",
                            "content": "运行内存",
                            "fontFamily": "Inter",
                            "fontSize": 14,
                            "fontWeight": "normal"
                          },
                          {
                            "type": "text",
                            "id": "rBJHp",
                            "name": "Value",
                            "fill": "$textPrimary",
                            "content": "8.0 GB",
                            "fontFamily": "Inter",
                            "fontSize": 14,
                            "fontWeight": "600"
                          }
                        ]
                      },
                      {
                        "type": "rectangle",
                        "id": "PH1rU",
                        "name": "Divider",
                        "fill": "$border",
                        "width": "fill_container",
                        "height": 1
                      }
                    ]
                  },
                  {
                    "type": "frame",
                    "id": "rzKtc",
                    "name": "开机时长",
                    "width": "fill_container",
                    "layout": "vertical",
                    "children": [
                      {
                        "type": "frame",
                        "id": "w9M3ew",
                        "name": "Row",
                        "width": "fill_container",
                        "padding": [
                          14,
                          16
                        ],
                        "justifyContent": "space_between",
                        "alignItems": "center",
                        "children": [
                          {
                            "type": "text",
                            "id": "d3cJ9",
                            "name": "Label",
                            "fill": "$textSecondary",
                            "content": "开机时长",
                            "fontFamily": "Inter",
                            "fontSize": 14,
                            "fontWeight": "normal"
                          },
                          {
                            "type": "text",
                            "id": "X7hujJ",
                            "name": "Value",
                            "fill": "$textPrimary",
                            "content": "02:14",
                            "fontFamily": "Inter",
                            "fontSize": 14,
                            "fontWeight": "600"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "type": "frame",
            "id": "OFXeW",
            "name": "电量",
            "width": "fill_container",
            "layout": "vertical",
            "gap": 10,
            "children": [
              {
                "type": "frame",
                "id": "Era1v",
                "name": "SectionHeader",
                "gap": 8,
                "alignItems": "center",
                "children": [
                  {
                    "type": "rectangle",
                    "cornerRadius": 2,
                    "id": "w3sdNV",
                    "name": "Bar",
                    "fill": "$accent",
                    "width": 3,
                    "height": 14
                  },
                  {
                    "type": "text",
                    "id": "cHL7G",
                    "name": "Title",
                    "fill": "$textSecondary",
                    "content": "电量",
                    "fontFamily": "Inter",
                    "fontSize": 13,
                    "fontWeight": "700",
                    "letterSpacing": 0.8
                  }
                ]
              },
              {
                "type": "frame",
                "id": "t0Fabt",
                "name": "Card",
                "width": "fill_container",
                "fill": "$surface",
                "cornerRadius": 14,
                "stroke": "$border",
                "strokeWidth": 1,
                "layout": "vertical",
                "children": [
                  {
                    "type": "frame",
                    "id": "cRubh",
                    "name": "电量",
                    "width": "fill_container",
                    "layout": "vertical",
                    "children": [
                      {
                        "type": "frame",
                        "id": "NgTo0",
                        "name": "Row",
                        "width": "fill_container",
                        "padding": [
                          14,
                          16
                        ],
                        "justifyContent": "space_between",
                        "alignItems": "center",
                        "children": [
                          {
                            "type": "text",
                            "id": "DaW56",
                            "name": "Label",
                            "fill": "$textSecondary",
                            "content": "电量",
                            "fontFamily": "Inter",
                            "fontSize": 14,
                            "fontWeight": "normal"
                          },
                          {
                            "type": "text",
                            "id": "SxDmt",
                            "name": "Value",
                            "fill": "$textPrimary",
                            "content": "78%",
                            "fontFamily": "Inter",
                            "fontSize": 14,
                            "fontWeight": "600"
                          }
                        ]
                      },
                      {
                        "type": "rectangle",
                        "id": "kyq7w",
                        "name": "Divider",
                        "fill": "$border",
                        "width": "fill_container",
                        "height": 1
                      }
                    ]
                  },
                  {
                    "type": "frame",
                    "id": "E69BD",
                    "name": "状态",
                    "width": "fill_container",
                    "layout": "vertical",
                    "children": [
                      {
                        "type": "frame",
                        "id": "vHqY1",
                        "name": "Row",
                        "width": "fill_container",
                        "padding": [
                          14,
                          16
                        ],
                        "justifyContent": "space_between",
                        "alignItems": "center",
                        "children": [
                          {
                            "type": "text",
                            "id": "YhQlx",
                            "name": "Label",
                            "fill": "$textSecondary",
                            "content": "状态",
                            "fontFamily": "Inter",
                            "fontSize": 14,
                            "fontWeight": "normal"
                          },
                          {
                            "type": "text",
                            "id": "IddUy",
                            "name": "Value",
                            "fill": "$textPrimary",
                            "content": "充电中",
                            "fontFamily": "Inter",
                            "fontSize": 14,
                            "fontWeight": "600"
                          }
                        ]
                      },
                      {
                        "type": "rectangle",
                        "id": "MQcML",
                        "name": "Divider",
                        "fill": "$border",
                        "width": "fill_container",
                        "height": 1
                      }
                    ]
                  },
                  {
                    "type": "frame",
                    "id": "kYs9e",
                    "name": "低电量模式",
                    "width": "fill_container",
                    "layout": "vertical",
                    "children": [
                      {
                        "type": "frame",
                        "id": "K0ordA",
                        "name": "Row",
                        "width": "fill_container",
                        "padding": [
                          14,
                          16
                        ],
                        "justifyContent": "space_between",
                        "alignItems": "center",
                        "children": [
                          {
                            "type": "text",
                            "id": "v2EamN",
                            "name": "Label",
                            "fill": "$textSecondary",
                            "content": "低电量模式",
                            "fontFamily": "Inter",
                            "fontSize": 14,
                            "fontWeight": "normal"
                          },
                          {
                            "type": "text",
                            "id": "YRp6A",
                            "name": "Value",
                            "fill": "$textPrimary",
                            "content": "关闭",
                            "fontFamily": "Inter",
                            "fontSize": 14,
                            "fontWeight": "600"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "type": "frame",
            "id": "lm9CL",
            "name": "网络",
            "width": "fill_container",
            "layout": "vertical",
            "gap": 10,
            "children": [
              {
                "type": "frame",
                "id": "dneib",
                "name": "SectionHeader",
                "gap": 8,
                "alignItems": "center",
                "children": [
                  {
                    "type": "rectangle",
                    "cornerRadius": 2,
                    "id": "r1Uqb",
                    "name": "Bar",
                    "fill": "$accent",
                    "width": 3,
                    "height": 14
                  },
                  {
                    "type": "text",
                    "id": "Arg9s",
                    "name": "Title",
                    "fill": "$textSecondary",
                    "content": "网络",
                    "fontFamily": "Inter",
                    "fontSize": 13,
                    "fontWeight": "700",
                    "letterSpacing": 0.8
                  }
                ]
              },
              {
                "type": "frame",
                "id": "Isev4",
                "name": "Card",
                "width": "fill_container",
                "fill": "$surface",
                "cornerRadius": 14,
                "stroke": "$border",
                "strokeWidth": 1,
                "layout": "vertical",
                "children": [
                  {
                    "type": "frame",
                    "id": "XTJ1X",
                    "name": "类型",
                    "width": "fill_container",
                    "layout": "vertical",
                    "children": [
                      {
                        "type": "frame",
                        "id": "cxyxl",
                        "name": "Row",
                        "width": "fill_container",
                        "padding": [
                          14,
                          16
                        ],
                        "justifyContent": "space_between",
                        "alignItems": "center",
                        "children": [
                          {
                            "type": "text",
                            "id": "vuHjq",
                            "name": "Label",
                            "fill": "$textSecondary",
                            "content": "类型",
                            "fontFamily": "Inter",
                            "fontSize": 14,
                            "fontWeight": "normal"
                          },
                          {
                            "type": "text",
                            "id": "DjT4X",
                            "name": "Value",
                            "fill": "$textPrimary",
                            "content": "wifi",
                            "fontFamily": "Inter",
                            "fontSize": 14,
                            "fontWeight": "600"
                          }
                        ]
                      },
                      {
                        "type": "rectangle",
                        "id": "J7tfD",
                        "name": "Divider",
                        "fill": "$border",
                        "width": "fill_container",
                        "height": 1
                      }
                    ]
                  },
                  {
                    "type": "frame",
                    "id": "jN3oU",
                    "name": "已连接",
                    "width": "fill_container",
                    "layout": "vertical",
                    "children": [
                      {
                        "type": "frame",
                        "id": "QLdbw",
                        "name": "Row",
                        "width": "fill_container",
                        "padding": [
                          14,
                          16
                        ],
                        "justifyContent": "space_between",
                        "alignItems": "center",
                        "children": [
                          {
                            "type": "text",
                            "id": "mHtTg",
                            "name": "Label",
                            "fill": "$textSecondary",
                            "content": "已连接",
                            "fontFamily": "Inter",
                            "fontSize": 14,
                            "fontWeight": "normal"
                          },
                          {
                            "type": "text",
                            "id": "tVR8K",
                            "name": "Value",
                            "fill": "$textPrimary",
                            "content": "是",
                            "fontFamily": "Inter",
                            "fontSize": 14,
                            "fontWeight": "600"
                          }
                        ]
                      },
                      {
                        "type": "rectangle",
                        "id": "wou6E",
                        "name": "Divider",
                        "fill": "$border",
                        "width": "fill_container",
                        "height": 1
                      }
                    ]
                  },
                  {
                    "type": "frame",
                    "id": "SdPSY",
                    "name": "互联网可达",
                    "width": "fill_container",
                    "layout": "vertical",
                    "children": [
                      {
                        "type": "frame",
                        "id": "ZoidG",
                        "name": "Row",
                        "width": "fill_container",
                        "padding": [
                          14,
                          16
                        ],
                        "justifyContent": "space_between",
                        "alignItems": "center",
                        "children": [
                          {
                            "type": "text",
                            "id": "o5CCc2",
                            "name": "Label",
                            "fill": "$textSecondary",
                            "content": "互联网可达",
                            "fontFamily": "Inter",
                            "fontSize": 14,
                            "fontWeight": "normal"
                          },
                          {
                            "type": "text",
                            "id": "Dq0FQ",
                            "name": "Value",
                            "fill": "$textPrimary",
                            "content": "是",
                            "fontFamily": "Inter",
                            "fontSize": 14,
                            "fontWeight": "600"
                          }
                        ]
                      },
                      {
                        "type": "rectangle",
                        "id": "b13QQJ",
                        "name": "Divider",
                        "fill": "$border",
                        "width": "fill_container",
                        "height": 1
                      }
                    ]
                  },
                  {
                    "type": "frame",
                    "id": "sXnva",
                    "name": "IP 地址",
                    "width": "fill_container",
                    "layout": "vertical",
                    "children": [
                      {
                        "type": "frame",
                        "id": "aCnYM",
                        "name": "Row",
                        "width": "fill_container",
                        "padding": [
                          14,
                          16
                        ],
                        "justifyContent": "space_between",
                        "alignItems": "center",
                        "children": [
                          {
                            "type": "text",
                            "id": "NjSOY",
                            "name": "Label",
                            "fill": "$textSecondary",
                            "content": "IP 地址",
                            "fontFamily": "Inter",
                            "fontSize": 14,
                            "fontWeight": "normal"
                          },
                          {
                            "type": "text",
                            "id": "WlUBD",
                            "name": "Value",
                            "fill": "$textPrimary",
                            "content": "192.168.1.42",
                            "fontFamily": "Inter",
                            "fontSize": 14,
                            "fontWeight": "600"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "type": "frame",
            "id": "aSfrf",
            "name": "传感器",
            "width": "fill_container",
            "layout": "vertical",
            "gap": 10,
            "children": [
              {
                "type": "frame",
                "id": "QCtPN",
                "name": "SectionHeader",
                "gap": 8,
                "alignItems": "center",
                "children": [
                  {
                    "type": "rectangle",
                    "cornerRadius": 2,
                    "id": "n5vEgM",
                    "name": "Bar",
                    "fill": "$accent",
                    "width": 3,
                    "height": 14
                  },
                  {
                    "type": "text",
                    "id": "J3fIX",
                    "name": "Title",
                    "fill": "$textSecondary",
                    "content": "传感器 · 实时",
                    "fontFamily": "Inter",
                    "fontSize": 13,
                    "fontWeight": "700",
                    "letterSpacing": 0.8
                  }
                ]
              },
              {
                "type": "frame",
                "id": "aObRg",
                "name": "SensorRow",
                "width": "fill_container",
                "gap": 10,
                "children": [
                  {
                    "type": "frame",
                    "id": "WiBP0",
                    "name": "加速度计",
                    "width": "fill_container",
                    "fill": "$surface",
                    "cornerRadius": 14,
                    "stroke": "$border",
                    "strokeWidth": 1,
                    "layout": "vertical",
                    "gap": 8,
                    "padding": 14,
                    "children": [
                      {
                        "type": "text",
                        "id": "AZ3UT",
                        "name": "Title",
                        "fill": "$textPrimary",
                        "content": "加速度计",
                        "fontFamily": "Inter",
                        "fontSize": 12,
                        "fontWeight": "600"
                      },
                      {
                        "type": "text",
                        "id": "m2o1Ja",
                        "name": "Data",
                        "fill": "$textSecondary",
                        "content": "x:0.01",
                        "fontFamily": "Inter",
                        "fontSize": 11,
                        "fontWeight": "normal"
                      }
                    ]
                  },
                  {
                    "type": "frame",
                    "id": "eeMkB",
                    "name": "陀螺仪",
                    "width": "fill_container",
                    "fill": "$surface",
                    "cornerRadius": 14,
                    "stroke": "$border",
                    "strokeWidth": 1,
                    "layout": "vertical",
                    "gap": 8,
                    "padding": 14,
                    "children": [
                      {
                        "type": "text",
                        "id": "xkHQr",
                        "name": "Title",
                        "fill": "$textPrimary",
                        "content": "陀螺仪",
                        "fontFamily": "Inter",
                        "fontSize": 12,
                        "fontWeight": "600"
                      },
                      {
                        "type": "text",
                        "id": "ozMaO",
                        "name": "Data",
                        "fill": "$textSecondary",
                        "content": "y:-0.02",
                        "fontFamily": "Inter",
                        "fontSize": 11,
                        "fontWeight": "normal"
                      }
                    ]
                  },
                  {
                    "type": "frame",
                    "id": "B949oh",
                    "name": "磁力计",
                    "width": "fill_container",
                    "fill": "$surface",
                    "cornerRadius": 14,
                    "stroke": "$border",
                    "strokeWidth": 1,
                    "layout": "vertical",
                    "gap": 8,
                    "padding": 14,
                    "children": [
                      {
                        "type": "text",
                        "id": "WVvnL",
                        "name": "Title",
                        "fill": "$textPrimary",
                        "content": "磁力计",
                        "fontFamily": "Inter",
                        "fontSize": 12,
                        "fontWeight": "600"
                      },
                      {
                        "type": "text",
                        "id": "RZO1D",
                        "name": "Data",
                        "fill": "$textSecondary",
                        "content": "z:42.5",
                        "fontFamily": "Inter",
                        "fontSize": 11,
                        "fontWeight": "normal"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "type": "frame",
    "id": "T40In",
    "x": 1880,
    "y": 0,
    "name": "04 网速悬浮窗",
    "clip": true,
    "width": 390,
    "height": 844,
    "fill": "$background",
    "layout": "vertical",
    "children": [
      {
        "id": "F9DJb",
        "type": "ref",
        "ref": "PVo0u",
        "name": "StatusBar"
      },
      {
        "id": "mFACI",
        "type": "ref",
        "ref": "XfZBv",
        "name": "Header",
        "descendants": {
          "TBDsO": {
            "content": "网速悬浮窗"
          }
        }
      },
      {
        "type": "frame",
        "id": "bWurQ",
        "name": "Body",
        "width": "fill_container",
        "height": "fill_container",
        "layout": "vertical",
        "gap": 16,
        "padding": [
          8,
          20,
          24,
          20
        ],
        "children": [
          {
            "type": "frame",
            "id": "Mop7W",
            "name": "Hero",
            "width": "fill_container",
            "layout": "vertical",
            "gap": 10,
            "children": [
              {
                "type": "frame",
                "id": "r8Jjf",
                "name": "HeroIcon",
                "width": 64,
                "height": 64,
                "fill": "$surface",
                "cornerRadius": 18,
                "stroke": "$border",
                "strokeWidth": 1,
                "justifyContent": "center",
                "alignItems": "center",
                "children": [
                  {
                    "type": "text",
                    "id": "egszj",
                    "name": "Icon",
                    "fill": "$accentWarm",
                    "content": "◎",
                    "fontFamily": "Inter",
                    "fontSize": 28,
                    "fontWeight": "normal"
                  }
                ]
              },
              {
                "type": "text",
                "id": "MooiN",
                "name": "HeroTitle",
                "fill": "$textPrimary",
                "content": "实时网速 · 盖在其他 App 上",
                "fontFamily": "Inter",
                "fontSize": 22,
                "fontWeight": "800"
              },
              {
                "type": "text",
                "id": "xbGDB",
                "name": "HeroText",
                "fill": "$textSecondary",
                "textGrowth": "fixed-width",
                "width": "fill_container",
                "content": "开启后可在任意 App 上方看到悬浮网速条，按住可拖动位置。",
                "lineHeight": 1.4,
                "fontFamily": "Inter",
                "fontSize": 14,
                "fontWeight": "normal"
              }
            ]
          },
          {
            "type": "frame",
            "id": "SJqcG",
            "name": "StatusCard",
            "width": "fill_container",
            "fill": "$surface",
            "cornerRadius": 16,
            "stroke": "$border",
            "strokeWidth": 1,
            "layout": "vertical",
            "gap": 12,
            "padding": 16,
            "children": [
              {
                "id": "Awwlr",
                "type": "ref",
                "ref": "V9P9Dl",
                "name": "原生模块",
                "width": "fill_container",
                "descendants": {
                  "nnbkJ": {
                    "fill": "$accentWarm"
                  },
                  "M8qsty": {
                    "content": "原生模块"
                  },
                  "MPq16": {
                    "content": "已就绪"
                  }
                }
              },
              {
                "id": "o8Omsl",
                "type": "ref",
                "ref": "V9P9Dl",
                "name": "权限状态",
                "width": "fill_container",
                "descendants": {
                  "nnbkJ": {
                    "fill": "$accentWarm"
                  },
                  "M8qsty": {
                    "content": "权限状态"
                  },
                  "MPq16": {
                    "content": "已授权"
                  }
                }
              },
              {
                "id": "Szp7j",
                "type": "ref",
                "ref": "V9P9Dl",
                "name": "运行状态",
                "width": "fill_container",
                "descendants": {
                  "nnbkJ": {
                    "fill": "$accentWarm"
                  },
                  "M8qsty": {
                    "content": "运行状态"
                  },
                  "MPq16": {
                    "content": "运行中"
                  }
                }
              }
            ]
          },
          {
            "id": "cVXJW",
            "type": "ref",
            "ref": "t5fP6",
            "name": "StartButton",
            "width": "fill_container",
            "fill": "$danger",
            "descendants": {
              "l11Yg3": {
                "content": "停止悬浮窗"
              }
            }
          },
          {
            "type": "text",
            "id": "T0db4C",
            "name": "Note",
            "fill": "$textSecondary",
            "textGrowth": "fixed-width",
            "width": "fill_container",
            "content": "Android 已支持系统悬浮窗与 TrafficStats 实时网速。iOS 画中画将在后续阶段实现。",
            "lineHeight": 1.5,
            "fontFamily": "Inter",
            "fontSize": 12,
            "fontWeight": "normal"
          }
        ]
      }
    ]
  },
  {
    "type": "frame",
    "id": "Ab1Cf",
    "x": 2350,
    "y": 0,
    "name": "04b 网速悬浮窗·未授权",
    "clip": true,
    "width": 390,
    "height": 844,
    "fill": "$background",
    "layout": "vertical",
    "children": [
      {
        "id": "hzYrW",
        "type": "ref",
        "ref": "PVo0u",
        "name": "StatusBar"
      },
      {
        "id": "K2CHcL",
        "type": "ref",
        "ref": "XfZBv",
        "name": "Header",
        "descendants": {
          "TBDsO": {
            "content": "网速悬浮窗"
          }
        }
      },
      {
        "type": "frame",
        "id": "u7pUUc",
        "name": "Body",
        "width": "fill_container",
        "height": "fill_container",
        "layout": "vertical",
        "gap": 16,
        "padding": [
          8,
          20,
          24,
          20
        ],
        "children": [
          {
            "type": "frame",
            "id": "VwHpW",
            "name": "Hero",
            "width": "fill_container",
            "layout": "vertical",
            "gap": 10,
            "children": [
              {
                "type": "frame",
                "id": "pzSYU",
                "name": "HeroIcon",
                "width": 64,
                "height": 64,
                "fill": "$surface",
                "cornerRadius": 18,
                "stroke": "$border",
                "strokeWidth": 1,
                "justifyContent": "center",
                "alignItems": "center",
                "children": [
                  {
                    "type": "text",
                    "id": "aFs7d",
                    "name": "Icon",
                    "fill": "$accentWarm",
                    "content": "◎",
                    "fontFamily": "Inter",
                    "fontSize": 28,
                    "fontWeight": "normal"
                  }
                ]
              },
              {
                "type": "text",
                "id": "IGNHo",
                "name": "HeroTitle",
                "fill": "$textPrimary",
                "content": "实时网速 · 盖在其他 App 上",
                "fontFamily": "Inter",
                "fontSize": 22,
                "fontWeight": "800"
              },
              {
                "type": "text",
                "id": "kPwtw",
                "name": "HeroText",
                "fill": "$textSecondary",
                "textGrowth": "fixed-width",
                "width": "fill_container",
                "content": "开启后可在任意 App 上方看到悬浮网速条，按住可拖动位置。",
                "lineHeight": 1.4,
                "fontFamily": "Inter",
                "fontSize": 14,
                "fontWeight": "normal"
              }
            ]
          },
          {
            "type": "frame",
            "id": "yVBCr",
            "name": "StatusCard",
            "width": "fill_container",
            "fill": "$surface",
            "cornerRadius": 16,
            "stroke": "$border",
            "strokeWidth": 1,
            "layout": "vertical",
            "gap": 12,
            "padding": 16,
            "children": [
              {
                "id": "uJx0O",
                "type": "ref",
                "ref": "V9P9Dl",
                "name": "原生模块",
                "width": "fill_container",
                "descendants": {
                  "nnbkJ": {
                    "fill": "$accentWarm"
                  },
                  "M8qsty": {
                    "content": "原生模块"
                  },
                  "MPq16": {
                    "content": "已就绪"
                  }
                }
              },
              {
                "id": "OhuF9",
                "type": "ref",
                "ref": "V9P9Dl",
                "name": "权限状态",
                "width": "fill_container",
                "descendants": {
                  "nnbkJ": {
                    "fill": "$textSecondary"
                  },
                  "M8qsty": {
                    "content": "权限状态"
                  },
                  "MPq16": {
                    "content": "未授权"
                  }
                }
              },
              {
                "id": "c5jBx",
                "type": "ref",
                "ref": "V9P9Dl",
                "name": "运行状态",
                "width": "fill_container",
                "descendants": {
                  "nnbkJ": {
                    "fill": "$textSecondary"
                  },
                  "M8qsty": {
                    "content": "运行状态"
                  },
                  "MPq16": {
                    "content": "已停止"
                  }
                }
              }
            ]
          },
          {
            "id": "O7be3",
            "type": "ref",
            "ref": "t5fP6",
            "name": "PermissionButton",
            "width": "fill_container",
            "descendants": {
              "l11Yg3": {
                "content": "前往授权「显示在其他应用上层」"
              }
            }
          },
          {
            "id": "WgvgY",
            "type": "ref",
            "ref": "t5fP6",
            "name": "StartButton",
            "width": "fill_container",
            "opacity": 0.45,
            "descendants": {
              "l11Yg3": {
                "content": "开启悬浮窗"
              }
            }
          },
          {
            "type": "text",
            "id": "h0qDQ",
            "name": "Note",
            "fill": "$textSecondary",
            "textGrowth": "fixed-width",
            "width": "fill_container",
            "content": "Android 已支持系统悬浮窗与 TrafficStats 实时网速。iOS 画中画将在后续阶段实现。",
            "lineHeight": 1.5,
            "fontFamily": "Inter",
            "fontSize": 12,
            "fontWeight": "normal"
          }
        ]
      }
    ]
  },
  {
    "type": "frame",
    "id": "Xnxj9",
    "x": 2820,
    "y": 0,
    "name": "05 Android 悬浮网速条",
    "clip": true,
    "width": 390,
    "height": 844,
    "fill": {
      "type": "gradient",
      "gradientType": "linear",
      "enabled": true,
      "rotation": 180,
      "size": {
        "height": 1
      },
      "colors": [
        {
          "color": "#1B2230",
          "position": 0
        },
        {
          "color": "#0F1117",
          "position": 1
        }
      ]
    },
    "layout": "none",
    "children": [
      {
        "type": "text",
        "id": "hPCzD",
        "x": 20,
        "y": 80,
        "name": "AppLabel",
        "fill": "$textSecondary",
        "content": "其他 App 界面（示意）",
        "fontFamily": "Inter",
        "fontSize": 13,
        "fontWeight": "normal"
      },
      {
        "type": "frame",
        "id": "Rtnz4",
        "x": 200,
        "y": 120,
        "name": "NetSpeedWidget",
        "width": 168,
        "height": 36,
        "fill": "#1A1D26E6",
        "cornerRadius": 10,
        "stroke": "$border",
        "strokeWidth": 1,
        "effect": {
          "type": "shadow",
          "shadowType": "outer",
          "color": "#00000066",
          "offset": {
            "x": 0,
            "y": 4
          },
          "blur": 12
        },
        "gap": 8,
        "padding": [
          8,
          12
        ],
        "justifyContent": "center",
        "alignItems": "center",
        "children": [
          {
            "type": "text",
            "id": "SNH0m",
            "name": "Down",
            "fill": "$success",
            "content": "↓ 1.2 MB/s",
            "fontFamily": "Inter",
            "fontSize": 12,
            "fontWeight": "600"
          },
          {
            "type": "text",
            "id": "XKOLe",
            "name": "Up",
            "fill": "$accent",
            "content": "↑ 0.3 MB/s",
            "fontFamily": "Inter",
            "fontSize": 12,
            "fontWeight": "600"
          }
        ]
      },
      {
        "type": "text",
        "id": "EM5TA",
        "x": 20,
        "y": 780,
        "name": "Hint",
        "fill": "$textSecondary",
        "textGrowth": "fixed-width",
        "width": 350,
        "content": "系统级悬浮窗，每秒刷新 TrafficStats 差值。用户可按住拖动到任意位置。",
        "lineHeight": 1.4,
        "fontFamily": "Inter",
        "fontSize": 12,
        "fontWeight": "normal"
      }
    ]
  }
];
}

function buildDocument() {
  return {
    version: '2.14',
    variables: VARIABLES,
    children: buildChildren(),
  };
}

const doc = buildDocument();
writeFileSync(OUT_PATH, `${JSON.stringify(doc, null, 2)}\n`);
console.log(`Wrote ${OUT_PATH} (${JSON.stringify(doc).length} bytes JSON)`);
