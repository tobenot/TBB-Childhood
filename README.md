# TBB-Childhood

## 可编辑源与生成产物

这是 Twee / SugarCube 故事工程。当前可编辑输入是 `src/` 下的 `.twee`、JavaScript 和 CSS，图片、音频及 PWA 入口在 `assets/`、`manifest.webmanifest` 和 `sw.js`。`index.html` 由 Tweego 生成，当前不在 Git 中，不应把它的缺席误报为故事源码丢失，也不要求重复保存所有历史编译 HTML。

## 工具链与本地冷启动

现有 CI 下载 **Tweego 2.1.1**，`src/index.twee` 的 StoryData 声明 **SugarCube 2.36.1**。两者是独立依赖。StoryData 的 `format-version` 不是精确版本锁，实际 `-f sugarcube-2` 按格式目录 ID 选择实现，需另核加载版本。实读官方 Tweego 2.1.1 Linux x64 包发现附带的 `storyformats/sugarcube-2/format.js` 是 **2.30.0**，不能把有 `sugarcube-2` 目录视为已匹配源码版本。

1. 从 [Tweego 官方入口](https://www.motoslave.net/tweego/) 获取适合操作系统的 2.1.1 编译器并加入当前会话 PATH。
2. 从 [SugarCube 2.36.1 官方 release](https://github.com/tmedwards/sugarcube-2/releases/tag/v2.36.1) 获取 `sugarcube-2.36.1-for-twine-2.1-local.zip`。将其中 `sugarcube-2/` 目录及其 `LICENSE` 放入独立的 storyformats 根目录，保留原文件名。它是第三方外部工具链，不要求把所有平台编译器包重复加入故事仓库。
3. 指定该根目录为 `TWEEGO_PATH`，运行 `tweego --list-formats`，确认实际选择的 `sugarcube-2` 版本为 **2.36.1**。官方格式搜索规则见 [Tweego 文档](https://www.motoslave.net/tweego/docs/#story-formats)，同 ID 多处存在时后找到的目录会覆盖前者。
4. 从仓库根目录编译：

```bash
tweego -f sugarcube-2 -o index.html ./src
```

Linux/macOS 可用 `TWEEGO_PATH="/path/to/formats" tweego --list-formats` 为单条命令设置路径。PowerShell 可用 `$env:TWEEGO_PATH = 'C:\path\to\formats'` 设置当前会话路径，不需改系统配置。

检查编译器退出码后才开始预览。现有 `compile.ps1` / `serve.ps1` 的 try/catch 没有显式检查 `$LASTEXITCODE`，脚本的成功文字不能证明原生命令退出 0。它们在本批未执行或重写。编译成功后，可用 Python 3 仅在本机服务仓库根：

```bash
python3 -m http.server 6899 --bind 127.0.0.1
```

打开 `http://127.0.0.1:6899/`，结束时 Ctrl+C。Windows 可将命令名换成现有 Python 3 的入口 `python`。本工程没有 npm 构建链，不因缺少 `package.json` 另造 Node 工程。

## 当前已知资源缺口

2026-10-11 的当前 checkout 中，源码引用但未找到以下三张第二章 CG：

- `assets/images/cg/cg_ch2_plot_01_transform.webp`
- `assets/images/cg/cg_ch2_plot_03_boss_intro.webp`
- `assets/images/cg/cg_ch2_plot_04_shield_boss.webp`

这是限定范围内的字面路径检查。它们是否尚未制作、存在别的原件位置或曾被改名，本批没有证据，不换图、不造占位文件，也不据此判定完整故事不能编译。编译器成功本来也不验证浏览器请求的全部媒体存在。

## 发布与存档边界

`.github/workflows/deploy.yml` 会在 push main 或手动触发时编译并发布 GitHub Pages，上传目标是工作目录 `.`。当前 workflow 未单独安装 2.36.1 story format。本批只补恢复说明，不修改发布流程、不 push、不触发 Actions。

游戏存档属于浏览器运行状态，不随 Git 恢复。`src/system/custom-save-load.js` 实现导出/导入入口，但本批没有在浏览器验证它的往返兼容性，不把代码存在说成迁移通过。第三方素材与工具的私有恢复和公开再分发许可分开处理。

## 验证范围

24 个 `.twee` / JS / CSS 编译输入已跟踪。官方两个 release 包只在内存中读取成员、格式版本与 CRC，保存 URL、大小、作者、许可标识和 SHA-256 到巡视证据，没有解压安装或执行第三方二进制。当前机器无 Tweego / PowerShell，本批未编译、运行 Windows 脚本、打开浏览器、验真人体验或部署。
