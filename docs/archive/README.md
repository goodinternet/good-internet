# Archive

History, kept for reference. **Nothing here is current.** The authority is [`../SOURCE-OF-TRUTH.md`](../SOURCE-OF-TRUTH.md) (November 1, 2026). Where an archived file disagrees with it, the archived file is out of date.

Nothing was deleted; files were moved with `git mv`, so `git log --follow` still works.

| Folder | What it was | Why it's archived |
| --- | --- | --- |
| `2026-10-supabase-roadmap/` | The 72-issue backend roadmap (`GI-0` to `GI-71`) and its 10 decisions (`D-1` to `D-10`), with the tracker page and the generator that built it (`roadmap.mjs`). | Written around Supabase, which was never approved as the architecture. Replaced by the five-stage roadmap. Issue and decision IDs are kept so old references still resolve. `D-1` to `D-5` and `D-7` were never decided (including where Supabase would be provisioned). `D-6`, `D-8`, `D-9`, `D-10` record native-app stack choices (React Native, Expo, and so on), which are moot under commitment 10. |
| `ios/` | iOS product study and iOS screens. | Commitment 10: no native iOS or macOS apps are on the current roadmap. |
| `studies/` | Library study (18 MB). | Research input, not direction. |
| `audits/` | Two repo audits (`-copy` is a near-duplicate; neither is judged canonical). | Describe the repo as it was before this cleanup. |
| `status/` | "Current state" snapshot from October 2026. | Superseded by the Source of Truth and the README. |
| `kept-ui-sync/` | `sync-kept-ui.mjs`, which copied screens from the kept-ui lab into `src/good-internet/`. | Retired. Good Internet owns its implementation now (see below). |

## kept-ui

[kept-ui](https://github.com/w-ade/kept-ui) is where the Good Internet UI was first designed and prototyped. This repo started as a copy of it, kept in step by the sync script. That relationship has ended:

- The sync script is archived and no longer wired into `package.json`. Running it would overwrite files in `src/good-internet/` that have since been edited here.
- kept-ui is no longer the source of truth for how the product looks or behaves. This repo is.
- kept-ui itself is untouched and remains available as historical work.
- Code comments in `src/good-internet/` that mention kept-ui describe where a file came from. They are provenance, not instructions.

## External issues

No GitHub issues, pull requests, or branches were closed or deleted as part of archiving. `GI-n` identifiers in the archived roadmap may match issues or PRs elsewhere; those are untouched.
