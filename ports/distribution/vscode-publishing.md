# VS Code Marketplace：一次性 OIDC 配置

扩展身份保持 **`froQ.theme-lig`**。GitHub 每次运行只获取短期身份，不保存 Azure client secret 或 Marketplace PAT。这里使用 Microsoft Entra 应用和 GitHub Actions 的身份联合；不需要给发布身份授予 Azure 资源的 Contributor 权限。

## 1. 创建发布身份

打开 [Microsoft Entra 管理中心](https://entra.microsoft.com/)，切到你能管理应用的目录：

1. **Identity → Applications → App registrations → New registration**。
2. 名称填写 `lig-vscode-marketplace`，选择仅当前目录的账号；无需 redirect URI。
3. 创建后记下 **Application (client) ID** 和 **Directory (tenant) ID**。
4. 不创建 client secret。如果页面没有注册权限，需要目录管理员允许注册应用。

## 2. 让 Azure 信任这个 GitHub 仓库

在刚创建的应用中，进入 **Certificates & secrets → Federated credentials → Add credential**，选择 **GitHub Actions deploying Azure resources**，填写：

| 项目             | 值                                                    |
| ---------------- | ----------------------------------------------------- |
| Organization     | `0froq`                                               |
| Repository       | `vscode-theme-LiG`                                    |
| Entity type      | `Environment`                                         |
| Environment name | `marketplace`                                         |
| Credential name  | `github-lig-marketplace`                              |
| Issuer           | `https://token.actions.githubusercontent.com`         |
| Subject          | `repo:0froq/vscode-theme-LiG:environment:marketplace` |
| Audience         | `api://AzureADTokenExchange`                          |

大小写必须一致。这里选 **Environment**，不要选 Branch 或 Tag。发布 job 使用 `marketplace` environment，令牌的 subject 与它对应。

## 3. 在 GitHub 填两个 ID

打开 [仓库 Environments 设置](https://github.com/0froq/vscode-theme-LiG/settings/environments)，创建名称为 **`marketplace`** 的 environment。

在 **Environment secrets** 添加：

| Secret            | 内容                              |
| ----------------- | --------------------------------- |
| `AZURE_CLIENT_ID` | 第 1 步的 Application (client) ID |
| `AZURE_TENANT_ID` | 第 1 步的 Directory (tenant) ID   |

Environment 的 **Deployment branches and tags** 选择 Selected branches and tags，允许分支 `main` 和 tag `v*`。本流程使用 `allow-no-subscriptions: true`，无需填写 Subscription ID。不要把访问令牌或密码发到聊天里。

## 4. 查出 Marketplace 使用的身份 ID

先合并包含 hook 的 PR。然后打开 [Actions → Publish Marketplace](https://github.com/0froq/vscode-theme-LiG/actions/workflows/release.yml)，点 **Run workflow**：

- 分支：`main`
- `tag`：已有正式 Release，例如 `v0.2.0`
- `mode`：**`identify`**

它会校验 Release 的 VSIX，然后用 OIDC 登录。不会发布扩展。完成后，在运行的 **Summary** 里复制 **Marketplace member ID**。它与 Azure 的 client ID 不是同一个 ID。

## 5. 授予现有 publisher 发布权限

打开 [Visual Studio Marketplace publisher 管理页](https://marketplace.visualstudio.com/manage/publishers/)，选现有 **`froQ`** publisher，进入 **Members**，添加上一步的 Marketplace member ID，角色设为 **Contributor**。

如果页面要求以 Microsoft Entra 身份添加成员，选择该入口。不要新建 publisher，也不要改扩展名。此处的 Contributor 是 **Marketplace publisher 的角色**，不是 Azure subscription 的角色。

## 6. 验证，再发布

重新运行同一 workflow，`tag` 不变、`mode` 选 **`verify-access`**。它只检查 `froQ` 的发布权限，不会提交新版本。

成功后，运行 `mode: publish`，发布指定 GitHub Release 中已经校验的 VSIX。以后发布稳定 GitHub Release 会自动执行；draft 和 prerelease 不自动发布。版本必须与 tag 对应，例如 `package.json` 的 `0.2.1` 对应 `v0.2.1`。不要手动覆盖已经发布的 tag 或 VSIX；修复应增加版本号。

`check-package` 可在尚未配置 Azure 时运行，只校验/打包并上传 Actions artifact。`identify` 和 `verify-access` 都不上传到商店。发布成功还要以 [Marketplace 页面](https://marketplace.visualstudio.com/items?itemName=froQ.theme-lig) 的版本为准；同版本重跑会跳过已存在版本。

## 常见问题

- **AADSTS700213 / no matching federated identity**：核对 subject 的仓库大小写、environment 名称，以及 Entity type 是否是 Environment。
- **缺少 AZURE_CLIENT_ID / AZURE_TENANT_ID**：secret 要放在 `marketplace` environment；这两个字段不能互换。
- **OIDC 登录成功，但 verify-access 被拒绝**：确认 Marketplace Members 添加的是 `identify` 输出的 member ID，并授予 Contributor；等待权限生效后重试。
- **Tag/version mismatch**：指定已有的 GitHub Release tag；它必须等于包内版本前加 `v`。
- **VSIX mismatch**：不覆盖 Release 资产。先查明包内容与 tag 的区别，再以新版本修复。

## 维护

本文件、workflow 和验证脚本由 [LiG 编译器](https://github.com/0froq/lig) 生成。后续修改应在 canonical 仓库的 `ports/distribution/` 完成，再同步到本仓库，避免下次生成覆盖修复。

参考：[VS Code 自动发布](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#secure-automated-publishing-to-visual-studio-marketplace)、[Azure Login OIDC](https://learn.microsoft.com/en-us/azure/developer/github/connect-from-azure-openid-connect)、[无订阅登录](https://github.com/Azure/login#allow-no-subscriptions)。
