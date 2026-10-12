# Zed 商店同步

Zed 官方接收 theme extension。它通过 [zed-industries/extensions](https://github.com/zed-industries/extensions) 的索引和 Git submodule 发布，审核合并后才进入商店；没有与 VS Code Marketplace 等价的 OIDC 上传入口。

本包首次上架使用 **`lig-theme`** ID，主题显示名仍是 LiG Light / Dark / Light Paper / Dark Paper。旧仓库版本 `id = "lig"` 不能直接作为首次商店提交；本地 JSON 主题的安装方法不变。

## 首次上架：由维护者完成

1. 合并本仓库的 release hook，创建一个稳定 GitHub Release。tag 必须匹配 `extension.toml` 版本。已发布旧版本不要覆盖。
2. Actions 的 **Sync Zed registry** 会生成 `lig-zed-registration` artifact，其中 `release.json` 给出准确 tag、commit、version，`registry-entry.toml` 给出索引条目。尚未注册时，真实同步会明确失败，避免把“生成了文件”当成“已经上架”。也可用 `dry_run: true` 手动准备这些材料。
3. **由你本人在 Zed 中安装这个准确 commit 的 dev extension，检查四个主题。** 静态检查不能替代官方要求的手动测试。
4. Fork 官方 extensions 仓库至 `0froq/extensions`，在 fork 中以 HTTPS 添加 submodule，路径 `extensions/lig-theme`，固定到 artifact 里的 commit；将条目加入 `extensions.toml`，运行官方仓库的 `pnpm sort-extensions`。
5. 由你本人向官方仓库提交 PR，使用自己的话说明主题和测试。只提交一个扩展，遵守官方的 open PR 数量限制。等待审核合并；hook 不会自动发起首次上架 PR。

官方 [AI policy](https://github.com/zed-industries/extensions/blob/main/AI_POLICY.md) 要求贡献者本人理解、测试变更，并自行撰写与维护者沟通的内容。Agent 可以准备代码和材料，不能替你声称已经手动验收。

## 注册后：每次 Release 自动提出版本更新

在本仓库创建 **`zed-registry`** GitHub environment，配置：

- Secret `ZED_REGISTRY_TOKEN`：能够写入你自己的 extensions fork 并向官方 public 仓库提出 PR 的 GitHub 凭据。它不是 Azure OIDC 凭据；普通 `GITHUB_TOKEN` 只限当前仓库，不能替代跨仓库授权。个人 classic PAT 的 `public_repo` 范围可用于这些 public 仓库操作，按自己的凭据管理政策设置期限。
- 可选 environment variable `ZED_REGISTRY_FORK`：默认 `0froq/extensions`。该 fork 必须已经存在。

稳定 Release 会检查官方注册状态：同版本同 commit 跳过；更旧版本才提出升级 PR；同版本不同 commit 或版本倒退会失败。若已有标题包含 `lig-theme` 的 open PR，先处理它，再手动重跑未同步的 Release。

更新使用官方文档链接的 community action，固定到已审查的 v2.0.0 commit。它将 submodule 固定到 Release tag 对应的 commit，并更新索引版本。仍需你按官方规则完成实际测试并关注 PR 审核结果；Actions 成功不等于 Zed 已上架。

手动运行：Actions → **Sync Zed registry** → Run workflow，填写已有 Release tag。先 `dry_run: true` 检查，准备就绪后使用 `false`。`v0.1.1` 等旧 `lig` 身份版本会被拒绝。

本文件和 hook 由 [LiG 编译器](https://github.com/0froq/lig) 的 `ports/distribution/` 生成，修复请从事实源同步。

参考：[主题扩展](https://zed.dev/docs/extensions/themes)、[发布前提](https://zed.dev/docs/extensions/publishing/prerequisites)、[首次发布](https://zed.dev/docs/extensions/publishing/publishing-guide)、[版本更新](https://zed.dev/docs/extensions/publishing/updating-and-maintenance)。
