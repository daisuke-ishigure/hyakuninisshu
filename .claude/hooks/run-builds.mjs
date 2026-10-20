// Claude Code の Stop フック（.claude/settings.json）から、Claude の応答が終わるたびに呼ばれる。
// _tools/build-*.mjs（HTML への直書き）の入力ファイルが前回の実行後に変更されていたら、そのビルドだけを自動で実行する。
// 判定はファイルの更新時刻（mtime）なので、Claude の編集（Edit/Write/Bash のどれでも）も、
// 利用者がエディタで直接直した変更も、次の応答の終わりに拾われる。
//
// 最後に成功した時刻は .claude/build-stamps.json に記録する（.gitignore 済み）。
// 新しいビルドスクリプトや入力ファイルを足したら、下の BUILDS を更新すること（CLAUDE.md にも記載）。
// 手で実行する場合: node .claude/hooks/run-builds.mjs   （--all を付けると全ビルドを強制実行）

import { readFileSync, writeFileSync, statSync, readdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const STAMPS = join(root, ".claude", "build-stamps.json");

// script: _tools/ のビルドスクリプト（スクリプト自体の変更も入力として扱う）
// inputs: 変更されたら再実行が必要なファイル
// htmlWith: ルートの .html のうち、この文字列を含むものも入力に含める（相関図のデータが各ページに書かれているため）
const BUILDS = [
  {
    script: "build-index-poem-table.mjs", // list.html・list_en.html の100首の表、index.html・index_en.html の5首の表
    inputs: ["js/hyakunin.json", "js/list-rows.js", "js/list-rows_en.js"],
  },
  {
    script: "build-zukan-cards.mjs", // kajin-zukan.html・kajin-zukan_en.html の歌人カード
    inputs: ["js/zukan.js", "js/zukan_en.js", "js/poems.js", "js/poet-names-en.js"],
  },
  {
    script: "build-keizu.mjs", // 歌ページ（N.html・N_en.html）の相関図と、天皇・藤原氏の略系図の「全体」
    inputs: [
      "js/keizu-diagram.js",
      "js/keizu-tips.js",
      "js/keizu-tips_en.js",
      "js/tenno-keizu-tooltips.js",
      "js/fujiwara-keizu-tooltips.js",
      "js/tenno-keizu.js",
      "js/tenno-keizu_en.js",
      "js/fujiwara-keizu.js",
      "js/fujiwara-keizu_en.js",
    ],
    htmlWith: 'class="kd-chart"',
  },
  {
    script: "build-redirects.mjs", // 旧URLの転送用ページ（転送の一覧はスクリプト内の REDIRECTS）
    inputs: [],
  },
];

const mtime = (p) => {
  try {
    return statSync(join(root, p)).mtimeMs;
  } catch {
    return 0; // 存在しない入力は無視
  }
};

function changedSince(build, since) {
  const files = [`_tools/${build.script}`, ...build.inputs];
  const hit = files.find((f) => mtime(f) > since);
  if (hit) return hit;
  if (build.htmlWith) {
    // 更新時刻が新しい .html だけ中身を確かめる（全ページを毎回読まない）
    for (const name of readdirSync(root)) {
      if (!name.endsWith(".html") || mtime(name) <= since) continue;
      if (readFileSync(join(root, name), "utf8").includes(build.htmlWith)) return name;
    }
  }
  return null;
}

// フックの入力（stdin の JSON）。stop_hook_active は「このフックが止めたことで Claude が続行中」の印
let hookInput = {};
try {
  hookInput = JSON.parse(readFileSync(0, "utf8") || "{}");
} catch {}
const forceAll = process.argv.includes("--all");

const stamps = existsSync(STAMPS) ? JSON.parse(readFileSync(STAMPS, "utf8")) : {};
const ran = [];
const failed = [];

for (const build of BUILDS) {
  const since = forceAll ? -1 : stamps[build.script] || 0;
  const reason = changedSince(build, since);
  if (!reason) continue;
  try {
    execFileSync(process.execPath, [join("_tools", build.script)], { cwd: root, stdio: "pipe" });
    // 終了時刻を記録する（ビルドは内容が同じでも出力ファイルを書き直すので、開始時刻だと毎回「変更あり」になる）
    stamps[build.script] = Date.now();
    ran.push(`${build.script}（${reason} の変更）`);
  } catch (e) {
    failed.push(`${build.script}（${reason} の変更）: ${String(e.stderr || e.message).trim().split("\n").slice(0, 8).join("\n")}`);
  }
}

writeFileSync(STAMPS, JSON.stringify(stamps, null, 2) + "\n");

if (failed.length) {
  const msg = `自動ビルドが失敗しました:\n${failed.join("\n")}`;
  if (!hookInput.stop_hook_active) {
    // 終了コード 2：Claude にエラーを伝えて直させる（直した後の応答の終わりにもう一度実行される）
    process.stderr.write(msg + "\n");
    process.exit(2);
  }
  // すでに一度止めて続行中なら、無限に止め続けないよう利用者への表示だけにする
  console.log(JSON.stringify({ systemMessage: msg }));
} else if (ran.length) {
  console.log(JSON.stringify({ systemMessage: `自動ビルドを実行しました: ${ran.join("、")}` }));
}
