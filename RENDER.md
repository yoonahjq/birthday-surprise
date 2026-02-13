# 在 Render 上部署「生日惊喜页」— 具体操作步骤

按下面顺序做，大约 10 分钟就能在 Render 上跑起来，并得到一个公网可访问的链接。

---

## 一、把代码放到 GitHub

Render 需要从 GitHub 拉代码，所以先要有一个仓库。

### 1. 在 GitHub 上新建仓库

1. 打开 [github.com](https://github.com) 并登录。
2. 右上角 **“+”** → **“New repository”**。
3. 填写：
   - **Repository name**：例如 `birthday-surprise`。
   - **Public**，**不要**勾选 “Add a README”（避免和本地冲突）。
4. 点 **“Create repository”**。

### 2. 在本地把项目推上去

在电脑上打开终端（PowerShell 或 CMD），进入项目目录，执行（把 `你的用户名` 换成你的 GitHub 用户名）：

```bash
cd "e:\Cursor Projects\birthday-surprise"

git init
git add .
git commit -m "Initial: 生日惊喜页"
git branch -M main
git remote add origin https://github.com/你的用户名/birthday-surprise.git
git push -u origin main
```

如果提示要登录 GitHub，按提示用浏览器或 Personal Access Token 完成认证。

---

## 二、在 Render 创建 Web Service

### 1. 注册 / 登录 Render

1. 打开 [https://render.com](https://render.com)。
2. 点 **“Get Started for Free”**。
3. 选 **“Sign in with GitHub”**，授权 Render 访问你的 GitHub。

### 2. 新建一个 Web Service

1. 登录后进入 **Dashboard**（控制台）。
2. 点右上角 **“New +”**。
3. 选 **“Web Service”**（网页服务）。

### 3. 连接 GitHub 仓库

1. 在 **“Connect a repository”** 里，如果列表里没有你的仓库：
   - 点 **“Configure account”** 或 **“Connect account”**，勾选要用的 GitHub 账号。
   - 在 **“Repository access”** 里选 **“All repositories”** 或只选 `birthday-surprise`。
2. 在仓库列表里找到 **birthday-surprise**（或你起的名字），点右边的 **“Connect”**。

### 4. 填写部署配置

按下面逐项检查、填写：

| 配置项 | 填什么 | 说明 |
|--------|--------|------|
| **Name** | `birthday-surprise`（或任意英文名） | 会出现在 Render 后台，也会影响默认域名 |
| **Region** | 选离你/用户近的（如 Singapore） | 影响访问速度 |
| **Branch** | `main` | 和你 GitHub 上的主分支一致 |
| **Root Directory** | **留空** | 代码在仓库根目录就留空；若项目在子目录如 `birthday-surprise`，就填 `birthday-surprise` |
| **Runtime** | **Node** | 选 Node |
| **Build Command** | `npm install` | 只安装依赖即可，没有单独 build 步骤就填这个 |
| **Start Command** | `npm start` | 会执行 `node server.js` |

**重要：**  
- 若你的仓库根目录就是「生日惊喜」项目（只有 `server.js`、`package.json`、`public` 等在这一层），**Root Directory 留空**。  
- 若整个项目在仓库的 `birthday-surprise` 子文件夹里，**Root Directory 填**：`birthday-surprise`。

### 5. 选择方案（免费 / 付费）

- **Free**：免费，够用；实例大约 15 分钟无访问会休眠，下次有人访问时会自动唤醒（可能要等几十秒）。
- 选好后点 **“Create Web Service”**。

### 6. 等待首次部署

1. Render 会自动开始 **Build**（执行 `npm install`）再 **Deploy**（执行 `npm start`）。
2. 日志里出现类似 **“Your service is live at https://xxx.onrender.com”** 就表示成功。
3. 记下这个地址，例如：`https://birthday-surprise-xxxx.onrender.com`，这就是你的**网站首页**。

---

## 三、设置 BASE_URL（推荐）

这样生成的「生日惊喜页」链接才会是完整的 `https://你的域名/b/xxx`，而不是 localhost。

1. 在 Render 里打开你这个 **Web Service** 的页面。
2. 左侧点 **“Environment”**（环境变量）。
3. 点 **“Add Environment Variable”**：
   - **Key**：`BASE_URL`
   - **Value**：把你上一步记下的地址完整填进去，例如：  
     `https://birthday-surprise-xxxx.onrender.com`  
     （不要末尾斜杠，不要带 `/b/xxx`）
4. 点 **“Save Changes”**。  
   Render 会**自动重新部署**一次，等部署完成即可。

---

## 四、验证是否成功

1. **首页**：在浏览器打开 `https://你的xxx.onrender.com`  
   - 应该能看到「制作生日惊喜页」的表单（上传页）。
2. **生成页面**：  
   - 填接收方昵称，上传 3 张图片，点「生成生日惊喜页」。  
   - 复制生成的链接，在新标签页打开，应能看到生日惊喜页和飘心效果。

若以上都正常，说明 Render 上已经部署成功，并且**已经发布在互联网上**，把首页链接或生成后的链接发给别人即可使用。

---

## 五、之后更新代码怎么操作

1. 在本地改好代码后，在项目目录执行：
   ```bash
   git add .
   git commit -m "更新说明"
   git push
   ```
2. 到 Render 的该 Web Service 页面，会看到自动触发了一次 **Deploy**，等状态变绿即可。
3. 无需重新创建服务，也不用再填一遍上面的配置。

---

## 六、常见问题

**Q：第一次打开链接要等很久？**  
免费实例休眠后，第一次请求会先“唤醒”实例，可能要 30 秒～1 分钟，之后就正常了。

**Q：上传图片后刷新就没了？**  
免费实例的磁盘在重启/重新部署后可能会清空，这是 Render 免费方案的限制。若需要长期保存，以后可以接云存储（如 S3）。

**Q：想用自己的域名？**  
在 Render 该 Web Service 里点 **“Settings”** → **“Custom Domains”**，按提示添加域名并在域名服务商处添加 CNAME 解析即可。

**Q：Build 失败？**  
看 **“Logs”** 里报错。常见原因：Root Directory 填错、分支名不是 `main`、或 `package.json` / `npm install` 有问题，按报错改即可。

---

按上述步骤做完，你就已经在 Render 上把「指定网站上传照片 + 接收方昵称 → 自动得到可分享网页」这一套跑通了，并且是发布在互联网上的。
