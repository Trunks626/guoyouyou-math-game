# 数学小天才 - 20以内加减法学习游戏

## 📱 应用介绍

这是一个专为 4-8 岁小朋友设计的数学学习游戏，帮助孩子快乐学习 20 以内加减法！

### ✨ 功能特色

- **📚 学习模式**：用可爱的动画物体（🍎⭐🎈🐻等）演示加减法原理，分步骤教学
- **🎮 练习模式**：三个难度等级（入门/进阶/挑战），互动答题即时反馈
- **🏆 成就系统**：累计星星、正确率统计、连续答对奖励、6个成就徽章
- **🎨 精美设计**：卡通风格界面，动画效果丰富，专为儿童优化

### 🎯 难度分级

| 等级 | 范围 | 说明 |
|------|------|------|
| 🌱 入门 | 10以内 | 适合刚开始学习的小朋友 |
| 🔥 进阶 | 15以内 | 巩固基础后的提升 |
| 👑 挑战 | 20以内 | 全面掌握加减法 |

---

## 🔨 打包 APK 指南

### 前提条件

需要安装以下软件：

1. **Node.js 20+**（已安装）
2. **Java JDK 17+**（[下载地址](https://adoptium.net/)）
3. **Android Studio**（[下载地址](https://developer.android.com/studio)）

### 步骤

#### 1. 配置环境变量

安装完 Android Studio 后，配置以下环境变量：

```bash
# Windows (PowerShell)
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\platform-tools"
```

#### 2. 打开 Android 项目

在 Android Studio 中打开 `math-kids-game/android` 文件夹。

首次打开时，Android Studio 会自动下载所需的 Gradle 和 SDK 组件。

#### 3. 构建 APK

**方式一：使用 Android Studio（推荐）**

1. 点击菜单栏 **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. 构建完成后，右下角会提示 APK 位置
3. APK 路径：`android/app/build/outputs/apk/debug/app-debug.apk`

**方式二：使用命令行**

```bash
cd math-kids-game/android
.\gradlew assembleDebug
```

构建完成后，APK 文件位于：
```
android/app/build/outputs/apk/debug/app-debug.apk
```

#### 4. 安装到手机

```bash
# 连接手机并启用 USB 调试后
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

或者直接将 APK 文件发送到手机安装。

---

## 🛠️ 项目结构

```
math-kids-game/
├── src/
│   ├── components/
│   │   ├── HomePage.tsx      # 首页
│   │   ├── TeachMode.tsx     # 学习模式
│   │   ├── PracticeMode.tsx  # 练习模式
│   │   └── ProgressPage.tsx  # 成就页面
│   ├── App.tsx               # 主应用
│   ├── main.tsx              # 入口
│   └── index.css             # 样式
├── android/                  # Capacitor Android 项目
├── dist/                     # 构建输出
├── capacitor.config.ts       # Capacitor 配置
├── index.html
├── package.json
└── vite.config.ts
```

---

## 📝 开发命令

```bash
# 安装依赖
npm install

# 开发预览
npm run dev

# 构建
npm run build

# 同步到 Android
npx cap sync android

# 打开 Android Studio
npx cap open android
```

---

## 📄 技术栈

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- Framer Motion（动画）
- Lucide React（图标）
- Capacitor（移动端封装）

---

祝小朋友学习愉快！🎉
