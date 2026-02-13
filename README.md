# 生日惊喜页 - 制作与发布

用户访问网站 → 填写接收方昵称、天数、年龄、落款，上传 3 张照片 → 自动生成专属生日惊喜页，获得可分享的互联网链接。

## 本地运行

```bash
cd birthday-surprise
npm install
npm start
```

浏览器打开：http://localhost:3000

## 发布到互联网

需要一台**有公网 IP 的服务器**或使用**云平台**部署 Node 应用。

### 方式一：云平台部署（推荐）

1. **Render / Railway / Fly.io 等**
   - 将本项目推送到 GitHub。
   - 在平台新建 Web 服务，连接该仓库。
   - 构建命令：`npm install`
   - 启动命令：`npm start`
   - 平台会分配域名，如：`https://birthday-surprise-xxx.onrender.com`
   - 若平台支持，在环境变量中设置 `BASE_URL=https://你的域名`，生成的链接就会带正确域名。

2. **Vercel**
   - 需改为 Serverless：把上传与生成逻辑放到 API Route，并配合对象存储（如 Vercel Blob 或 S3）存图片，或使用「单页 + base64 图片」方案只生成一个 HTML 不存文件。当前项目为传统 Node 服务器，更适合 Render/Railway 等。

### 方式二：自己的服务器（VPS）

1. 安装 Node.js（建议 18+）。
2. 上传代码到服务器，在项目目录执行：
   ```bash
   npm install
   npm start
   ```
3. 用 **PM2** 保持进程运行：
   ```bash
   npm install -g pm2
   pm2 start server.js --name birthday
   pm2 save && pm2 startup
   ```
4. 用 **Nginx** 做反向代理并配置 HTTPS（Let's Encrypt）：
   - 将域名指向服务器 IP。
   - Nginx 代理 `https://你的域名` → `http://localhost:3000`。
5. 在服务器上设置环境变量（可选）：
   ```bash
   export BASE_URL=https://你的域名
   export PORT=3000
   ```

### 环境变量说明

| 变量 | 说明 |
|------|------|
| `PORT` | 服务端口，默认 3000 |
| `BASE_URL` | 网站完整地址（如 `https://birthday.example.com`），用于生成页面链接 |

## 使用流程

1. 打开网站首页（上传页）。
2. 填写：接收方昵称（必填）、一起走过的天数、TA 的年龄、落款。
3. 上传 3 张回忆照片（必填）。
4. 点击「生成生日惊喜页」。
5. 复制生成的链接，发给对方；对方打开即可看到生日惊喜页。

生成的页面链接格式：`https://你的域名/b/唯一ID`，仅持有链接的人可访问。
