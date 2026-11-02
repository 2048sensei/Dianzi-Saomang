# 电子扫盲 · 电脑基础与文件管理

面向社团新生的电脑入门课，把「能读资料、管文件、装软件、搜问题、用 AI」讲成可以跟着做的步骤。整站是纯静态页面，不依赖构建工具和外部 CSS/JS，双击就能离线看。

- 入口页面：[`index.html`](index.html)
- 社员版说明：[`使用说明.txt`](使用说明.txt)
- 许可协议：[CC BY-NC-SA 4.0](LICENSE)

## 打开方式

1. 把整个仓库（或解压后的文件夹）放到本地。
2. 双击 `index.html`，用 Edge 或 Chrome 打开。
3. 封面图和脚本都在 `assets/`、`css/`、`js/` 里，**不要只复制一个 html 文件**。

> 线上预览可直接启用 GitHub Pages，见下文。

## 目录结构

```
.
├── index.html          # 课程页面（内容 + 结构）
├── css/style.css       # 设计变量、布局、组件、响应式、打印样式
├── js/main.js          # 进度条、目录高亮、投影模式、勾选记忆、视频懒加载
├── assets/covers/      # 视频封面图
├── 使用说明.txt         # 给社员看的极简说明
├── README.md
├── LICENSE
├── .gitignore
├── .gitattributes
└── .nojekyll
```

## 页面功能

- **投影大字模式**：右上角按钮或按 `P`，字号放大，状态记在浏览器里。
- **打印 / 导出 PDF**：调用浏览器打印，自动隐藏目录和工具条。
- **清单勾选**：勾选状态下次打开仍在（存在本机 `localStorage`），可一键重置并显示进度。
- **视频懒加载**：点击封面才加载 B 站播放器，不会自动出声；断网时可用标题外链直达。
- **目录高亮 + 阅读进度条**：长页面也能知道读到哪。

## 发布到 GitHub Pages

1. 在 GitHub 新建仓库，不要勾选初始化 README（本地已有）。
2. 在本目录执行：

   ```bash
   git remote add origin https://github.com/<你的用户名>/<仓库名>.git
   git push -u origin main
   ```

3. 仓库 **Settings → Pages → Build and deployment**：
   - Source 选 `Deploy from a branch`
   - Branch 选 `main`，目录选 `/ (root)`
4. 等待一两分钟，访问 `https://<你的用户名>.github.io/<仓库名>/`。

> 仓库名建议用英文短名（例如 `digital-literacy`），避免中文和空格影响 Pages 地址。

## 内容大纲

| 部分 | 内容 |
|---|---|
| 0 | 本课目标、前置条件 |
| 1 | 电脑与系统基础：硬件、操作系统、桌面、快捷键、任务管理器、设置、电源 |
| 2 | 文件与文件夹：路径、基础操作、后缀名、压缩解压、下载管理、统一目录 |
| 3 | 浏览器与网络：搜索、读文档、判断资料、下载安全、Steam++ 与 GitHub |
| 4 | 软件安装：安装包类型、安装路径、卸载 |
| 5 | 拥抱 AI：提问模板、判断回答、命令行 AI 的边界 |
| 验收 | 8 项课后验收 + 3 个常见坑 + 延伸链接 |

## 维护提示

- **加视频**：复制一个 `.video` 块，改 `data-bvid`（B 站 BV 号）、`data-title`、`data-cover`，封面图放 `assets/covers/`。
- **加/改清单**：用 `<ul class="checklist"><li><label><input type="checkbox" class="box" /><span>…</span></label></li></ul>`，脚本会自动接管计数与记忆。
- **改样式**：只动 `css/style.css`；页面里不再写内联样式。
- **检查链接与结构**：改动后可用浏览器打开，确认目录锚点、封面路径和 8 项验收条数没变。

## 许可

除另有说明外，本仓库内容采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh) 许可：署名、非商业用途、相同方式共享。视频与封面版权归原作者，页面仅作教学引用。

## 更新日志

- **v2.0（2026-11）**：拆分 CSS/JS；修复 Part 3 章节错位；补齐目录与标题编号；验收补到 8 项；新增投影模式、打印、勾选记忆与重置；封面懒加载与可访问性优化。
- v1.0：单文件教学页。
