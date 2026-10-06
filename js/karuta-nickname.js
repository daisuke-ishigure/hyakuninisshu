/**
 * karuta-nickname.js
 * ─────────────────────────────────────────────────────────────────────────
 * ランキング用ニックネーム（Firebase モジュール版 SDK 10.7.1 用）
 *
 * Google の表示名・プロフィール写真は DB に保存しない。ランキングに出る名前は
 * 本人が付けたニックネームだけで、未設定なら「名無し」/「Anonymous」と表示する。
 *
 * - 正本: Firestore users/{uid}.nickname
 * - 変更時は Realtime DB の本人ノード（user_stats / pro_user_stats /
 *   rankings/{online,cpu}/{日付} / pro_rankings/cpu/{日付}）にも nickname を反映し、
 *   古い displayName / photoURL を消す。
 * - 同じ処理の compat 版が js/firebase-karuta.js にある。変更するときは両方直すこと。
 *
 * 使い方:
 *   import { setupNickname } from "./js/karuta-nickname.js?…";
 *   const nickname = setupNickname(app, auth, 'ja');
 *   const nick = await nickname.get();   // 保存時に使う（未設定なら null）
 *   // #user_display_name に名前を表示し、#logout_btn の前に「名前変更」ボタンを置く。
 *   // 変更後に document へ 'karuta-nickname-change' イベントを投げる。
 * ─────────────────────────────────────────────────────────────────────────
 */
import { getFirestore, doc, getDoc, setDoc, deleteField } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

export const NICKNAME_MAX = 12;

const TEXT = {
  ja: {
    defaultName: '名無し',
    unset: '名無し（ニックネーム未設定）',
    button: '名前変更',
    prompt: `ランキングに表示するニックネームを入力してください（${NICKNAME_MAX}文字まで）。\n空欄にすると「名無し」になります。\n※本名など、個人が特定できる名前は避けてください。`,
    tooLong: `ニックネームは${NICKNAME_MAX}文字までです。`,
    failed: 'ニックネームの保存に失敗しました。再度お試しください。',
  },
  en: {
    defaultName: 'Anonymous',
    unset: 'Anonymous (no nickname set)',
    button: 'Change name',
    prompt: `Enter a nickname to show on the leaderboard (up to ${NICKNAME_MAX} characters).\nLeave it blank to appear as "Anonymous".\n* Please avoid your real name or anything that identifies you.`,
    tooLong: `Nicknames can be up to ${NICKNAME_MAX} characters.`,
    failed: 'Failed to save your nickname. Please try again.',
  },
};

const RANKING_BASES = ['rankings/online', 'rankings/cpu', 'pro_rankings/cpu'];

export function cleanNickname(s) {
  return String(s || '').replace(/[\u0000-\u001f\u007f]/g, '').replace(/\s+/g, ' ').trim();
}

function recentDays(n) {
  const days = [];
  for (let i = 0; i < n; i++) {
    days.push(new Date(Date.now() + 9 * 60 * 60 * 1000 - i * 86400000).toISOString().slice(0, 10));
  }
  return days;
}

export function setupNickname(app, auth, lang = 'ja') {
  const T = TEXT[lang] || TEXT.ja;
  const fs = getFirestore(app);
  const db = getDatabase(app);

  let user = null;
  let nickname = null;
  let ready = Promise.resolve();

  onAuthStateChanged(auth, (u) => {
    user = u;
    nickname = null;
    if (!u) return;
    ready = getDoc(doc(fs, 'users', u.uid))
      .then(snap => { nickname = (snap.exists() && snap.data().nickname) || null; })
      .catch(e => console.warn('[nickname] load error:', e))
      .then(render);
  });

  function render() {
    const nameEl = document.getElementById('user_display_name');
    if (nameEl) nameEl.innerText = nickname || T.unset;

    const logoutBtn = document.getElementById('logout_btn');
    if (logoutBtn && !document.getElementById('nickname_btn')) {
      const btn = document.createElement('button');
      btn.id = 'nickname_btn';
      btn.type = 'button';
      btn.textContent = T.button;
      btn.style.cssText = 'background:none;border:1px solid #aaa;border-radius:12px;padding:2px 8px;' +
        'font-size:12px;color:#555;cursor:pointer;margin-right:4px;white-space:nowrap;';
      btn.onclick = change;
      logoutBtn.insertAdjacentElement('beforebegin', btn);
    }
  }

  async function change() {
    if (!user) return;
    const input = prompt(T.prompt, nickname || '');
    if (input === null) return;
    const nick = cleanNickname(input);
    if ([...nick].length > NICKNAME_MAX) { alert(T.tooLong); return; }
    try {
      await saveEverywhere(user.uid, nick || null);
    } catch (e) {
      console.error('[nickname] save error:', e);
      alert(T.failed);
      return;
    }
    nickname = nick || null;
    render();
    document.dispatchEvent(new CustomEvent('karuta-nickname-change', { detail: { nickname } }));
  }

  async function saveEverywhere(uid, nick) {
    // 正本（失敗したらエラーにする）
    await setDoc(doc(fs, 'users', uid), {
      nickname: nick || deleteField(),
      displayName: deleteField(),
      photoURL: deleteField(),
      lastPlayedAt: deleteField(),
    }, { merge: true });

    // Realtime DB: 本人の記録があるノードだけ書き換える（無いノードは作らない）
    const fix = { nickname: nick, displayName: null, photoURL: null };
    const paths = [`user_stats/${uid}`, `pro_user_stats/${uid}`];
    for (const base of RANKING_BASES) {
      try {
        const snap = await get(ref(db, base));
        snap.forEach(day => { if (day.child(uid).exists()) paths.push(`${base}/${day.key}/${uid}`); });
      } catch (_) {
        // 全日付を読めない場合は直近 7 日分（ランキングページの表示範囲）だけ
        recentDays(7).forEach(d => paths.push(`${base}/${d}/${uid}`));
      }
    }
    await Promise.all(paths.map(async p => {
      try {
        const snap = await get(ref(db, p));
        if (snap.exists()) await update(ref(db, p), fix);
      } catch (e) {
        console.warn('[nickname] skip', p, e);
      }
    }));
  }

  return {
    /** 保存時に使うニックネーム（未設定なら null） */
    async get() { await ready; return nickname; },
    defaultName: T.defaultName,
  };
}
