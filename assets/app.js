
const RES = ['入社した人','内定後に辞退した人','選考途中で辞退した人','面接で不合格だった人'];
const STEPS = ['STEP1 最初に聞く','STEP2 プロフィール','STEP3 動き出す前・探す','STEP4 応募・選考','STEP5 結果・内定・決断','STEP6 退職・入社後','STEP7 最後に'];
const STEP_TITLES = ['最初に聞くこと','プロフィール','動き出す前・探す','応募・選考','結果・内定・決断','退職・入社後','最後に'];
const ROLES = ['機械設計','電気・電子設計','制御設計','生産技術','品質保証・品質管理','製造・組立','設備保全','研究開発','技術営業','その他'];
const INDS = ['自動車部品','電気・電子部品','機械・産業機械','化学・素材','食品・日用品','医療機器','建設・設備','その他メーカー','メーカー以外'];
const OPTS = {
  '0-3':RES,'0-4':['在職中だった','離職済みだった'],
  '0-6':['1年未満','1〜3年','3〜5年','5〜10年','10年以上'],
  '0-7':['20代前半','20代後半','30代前半','30代後半','40代以上'],
  '1-6':['高卒・専門','高専','大学','大学院'],
  '1-7':['〜50人','51〜300人','301〜1,000人','1,001〜5,000人','5,001人以上'],
  '1-8':['初めて','1回','2回','3回以上'],
  '2-5':['1か月未満','1〜3か月','3〜6か月','半年以上'],
  '2-6':['なし','3か月未満','3〜6か月','半年以上'],
  '3-1':['エージェントに紹介された','求人サイトで自分で探した','スカウト・オファーが来た','企業サイトで見つけた','知人・紹介','SNS・イベント','その他・覚えていない'],
  '4-1':['エージェント経由','求人サイトから直接','企業サイトから直接','スカウト経由','紹介（リファラル）','その他'],
  '4-2':['2025年 初旬（1〜4月）','2025年 中旬（5〜8月）','2025年 下旬（9〜12月）','2026年 初旬（1〜4月）','2026年 中旬（5〜8月）','2026年 下旬（9〜12月）'],
  '4-3':['選考直後','入社前','入社〜半年','半年〜1年','1年以上'],
  '5-1-1':['面接1回','面接2回','面接3回','面接4回以上'],
  '5-1-3':['2週間未満','2〜4週間','1〜2か月','2か月以上'],
  '5-1-4':['増員・事業拡大','新規事業','欠員補充','聞いていない'],
  '5-2-1':['人事','現場担当','現場責任者','部長・役員','複数の組み合わせ'],
  '5-2-2':['30分未満','30分〜1時間','1〜2時間','2時間以上','覚えていない'],
  '6-1':['一次面接','二次面接','三次以降（最終面接を含む）'],
  '6-5':['書類通過後','一次面接の前後','二次面接の前後','最終面接の前後'],
  '7-5':['転居なし','同県内で引っ越し','他県へ転居','単身赴任'],
  '8-1':['なし','あり'],
  '9-5':['1か月未満','〜3か月','〜半年','半年以上','まだ慣れていない'],
  '10-1':['選ぶ','選ばない','分からない']
};
const MULTI = {
  '1-3':['技術士','電気主任技術者','機械設計技術者','品質管理検定（QC検定）','危険物取扱者','TOEIC 700点以上','特になし'],
  '1-4':['3D CAD','2D CAD','構造解析（CAE）','熱流体解析','PLC・シーケンス制御','Python','工程設計','QC七つ道具','図面作成・読図'],
  '1-5':['構造・機構','熱・流体','制御・電気','材料・加工','品質・信頼性','生産・工程設計','設備保全'],
  '3-2':['求人サイト','口コミサイト','エージェント','企業の採用ページ','知人・OBOG','SNS']
};
const RANK = ['年収','仕事内容','技術環境・設備','勤務地','将来性','働き方','会社の安定性'];

const $ = (s, el=document) => el.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cellOf = (it, r) => { const c = it.b[r]; return Array.isArray(c) ? {code:c[0], note:c[1]} : {code:c, note:''}; };
const visible = (it, r, emp) => { const {code, note} = cellOf(it, r); if (code === '-' || code === 'A') return false; if (note.includes('在職中だった') && !emp) return false; if (note.includes('離職済み') && emp) return false; return true; };
const clean = n => n.replace(/^【[^】]*】/, '');
const tagOf = n => { const m = n.match(/^【([^】]*)】/); return m ? m[1] : ''; };
const chapTitle = sec => sec.replace(/^▼\s*/, '').replace(/^\d+\.\s*/, '').replace(/（.*）/, '');
const chapNo = sec => { const m = sec.match(/^▼\s*(\d+)\./); return m ? m[1] : ''; };
const lockSvg = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';

const APP = document.getElementById('app'); const PAGE = APP.dataset.page; const SID = +(APP.dataset.id || 0);
const store = { get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} } };
const state = { filter: new URLSearchParams(location.search).get('r') ?? 'all', get member() { return store.get('gc_member') === '1'; }, set member(v) { store.set('gc_member', v ? '1' : '0'); } };
const form = (() => { try { const j = JSON.parse(store.get('gc_form') || 'null'); if (j) return j; } catch (e) {} return { step:0, v:{'0-2':'生産技術'}, iv:[{a:{}}], done:false }; })();
const saveForm = () => store.set('gc_form', JSON.stringify(form));

function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2200); }

/* ---------------- 一覧 ---------------- */
function renderList() {
  const counts = [0,1,2,3].map(r => STORIES.filter(s => s.result === r).length);
  const list = STORIES.filter(s => state.filter === 'all' || s.result === +state.filter);
  const chips = `<div class="filter-chips"><a class="${state.filter==='all'?'active':''}" href="index.html">すべて<em>${STORIES.length}</em></a>` +
    RES.map((n, r) => `<a class="${state.filter==String(r)?'active':''}" href="index.html?r=${r}">${n}<em>${counts[r]}</em></a>`).join('') + '</div>';
  const cards = list.map(s => {
    const first = s.a['2-1'] || s.a['5-3-1'] || '';
    return `<article class="story-card">
      <div class="story-top"><span class="res-badge res-${s.result}">${RES[s.result]}</span><small>投稿 ${esc(s.posted)}</small></div>
      <h3><a class="stretch" href="story-${s.id}.html">${esc(s.title)}</a></h3>
      <div class="chips"><span class="chip attr">転職先：${esc(s.role)}</span><span class="chip attr">前職：${esc(s.prevInd)}・${esc(s.prevRole)}</span><span class="chip attr">経験${esc(s.years)}</span><span class="chip attr">${esc(s.age)}</span></div>
      <div class="teaser"><p>${esc(first)}</p><span class="lock-tag">${lockSvg}本文は会員登録後に読めます</span></div>
      <div class="story-foot"><span>公開：見出し・属性　／　会員限定：選考〜入社のストーリー全文</span><span class="text-action">ストーリーを読む →</span></div>
    </article>`;
  }).join('');
  return `<div class="page-intro"><div><h2>株式会社椿本チエインの選考体験</h2><p class="lede">実際に転職した人の、動き出す前から入社後までのストーリー。見出しと属性は誰でも見られ、本文は会員登録後に読めます。※内容は画面シミュレーション用の仮データです。</p></div><a class="outline-btn" href="post.html">選考体験を投稿する</a></div>
    ${chips}
    <div class="story-grid" style="margin-top:12px">${cards || '<div class="empty">この条件の選考体験はまだありません。</div>'}</div>
    <div class="note-box">立場（入社した／内定後に辞退した／選考途中で辞退した／面接で不合格だった）で、載る章が変わります。「選考体験を投稿する」で、立場ごとに質問が出し分けられる様子を試せます。</div>`;
}

/* ---------------- 個別ページ ---------------- */
function qa(it, val, star) {
  if (val === undefined || val === null || val === '') return '';
  let body;
  if (Array.isArray(val)) body = `<div class="chips">${val.map(v => `<span class="chip">${esc(v)}</span>`).join('')}</div>`;
  else body = esc(val);
  return `<div class="qa${star?' star':''}"><dt>${esc(clean(it.name))}</dt><dd>${body}</dd></div>`;
}
function renderInterviews(s) {
  const r = s.result;
  const its = ITEMS.filter(i => i.no.startsWith('5-2-') && visible(i, r, s.employed));
  return (s.a['5-2'] || []).map((iv, k) => {
    const rows = its.map(i => qa(i, iv.a[i.no], i.star)).join('');
    return `<details class="iv" ${k===0?'open':''}><summary>${esc(iv.label)}${iv.flag?`<span class="flag-fail">${esc(iv.flag)}</span>`:''}<small>${esc(iv.meta||'')}</small></summary><div class="iv-body">${rows}</div></details>`;
  }).join('');
}
function renderSalary(s) {
  const pts = [['前職の年収', s.a['7-2']], ['入社時の年収', s.a['7-3']], ['現在の年収', s.a['9-11']]].filter(p => p[1] !== undefined);
  if (!pts.length) return '';
  let h = '<div class="subhead">年収の推移</div><div class="salary">';
  pts.forEach((p, i) => {
    if (i > 0) { const d = p[1] - pts[i-1][1]; const pct = Math.round(d / pts[i-1][1] * 100); h += `<div class="sal-arrow"><i>→</i>${d>=0?'+':''}${d}万円<br>（${d>=0?'+':''}${pct}%）</div>`; }
    h += `<div class="sal-point"><span>${p[0]}</span><b>${p[1]}万円</b></div>`;
  });
  if (pts.length < 3 && s.result === 0) h += '<div class="sal-arrow"><i>→</i></div><div class="sal-point dim"><span>現在の年収</span><b>―</b></div>';
  return h + '</div>';
}
function renderChapterBody(sec, s) {
  const r = s.result; let h = '', lastTag = null, did52 = false, didSal = false;
  for (const it of sec.items) {
    if (!visible(it, r, s.employed)) continue;
    const no = it.no;
    if (no.startsWith('5-2-')) { if (!did52) { did52 = true; if (lastTag !== '各面接') { h += '<div class="subhead">各面接</div>'; lastTag = '各面接'; } h += renderInterviews(s); } continue; }
    if (['7-2','7-3','7-4'].includes(no)) { if (!didSal) { didSal = true; h += renderSalary(s); } continue; }
    if (no === '9-11') continue;
    if (no === '7-8') {
      const rows = s.a['7-8'] || []; if (!rows.length) continue;
      h += `<div class="subhead">併願先</div><table class="mini"><thead><tr><th>企業</th><th>職種</th><th>結果</th></tr></thead><tbody>${rows.map(x => `<tr><td>${esc(x.co)}</td><td>${esc(x.role)}</td><td>${esc(x.res)}</td></tr>`).join('')}</tbody></table>`; continue;
    }
    const val = s.a[no]; if (val === undefined) continue;
    const tag = tagOf(it.name);
    if (tag && tag !== lastTag) { h += `<div class="subhead">${esc(tag)}</div>`; lastTag = tag; }
    h += qa(it, val, it.star);
  }
  if (sec.sec.startsWith('▼ 4.') && s.a['7-8']) h += `<div class="auto-note">並行して応募した社数：${s.a['7-8'].length}社（併願先は「内定・決断」の章に掲載）</div>`;
  return h;
}
function renderDetail() {
  const s = STORIES.find(x => x.id === SID); if (!s) return '';
  const secs = []; let cur = null;
  ITEMS.forEach(it => { if (it.sec.startsWith('▼ 0.') || it.sec.startsWith('▼ サイト側')) return; if (!cur || cur.sec !== it.sec) { cur = {sec:it.sec, items:[]}; secs.push(cur); } cur.items.push(it); });
  const chapters = secs.map(sec => ({sec, html:renderChapterBody(sec, s)})).filter(c => c.html.trim());
  const locked = state.member ? '' : 'locked';
  const nav = chapters.map(c => `<button data-act="jump" data-n="${chapNo(c.sec.sec)}">${chapNo(c.sec.sec)} ${esc(chapTitle(c.sec.sec))}</button>`).join('');
  const body = chapters.map(c => `<section class="chap" id="chap-${chapNo(c.sec.sec)}"><span class="chap-no">${chapNo(c.sec.sec)}</span><div class="chap-head"><h3>${esc(chapTitle(c.sec.sec))}</h3><span class="lock-label">${lockSvg}会員限定</span></div><div class="chap-body ${locked}"><div class="chap-inner">${c.html}</div></div></section>`).join('');
  const same = STORIES.filter(x => x.id !== s.id && x.prevInd === s.prevInd);
  const site = `<section class="chap"><span class="chap-no">+</span><div class="chap-head"><h3>担当コンサルより・この経歴で広がる道</h3><span class="lock-label">${lockSvg}会員限定</span></div><div class="chap-body ${locked}"><div class="chap-inner">
      <div class="site-box"><h4>担当コンサルの解説</h4><p>${esc(s.consultant)}</p></div>
      <div class="qa"><dt>前職の経験が活きる他の職種・会社</dt><dd><span class="chips">${s.paths.map(p => `<span class="chip attr">${esc(p)}</span>`).join('')}</span></dd></div>
      <div class="qa"><dt>同じ前職（${esc(s.prevInd)}）から転職した人の体験談</dt><dd>${same.length ? `<div class="related">${same.map(x => `<a href="story-${x.id}.html"><span class="res-badge res-${x.result}">${RES[x.result]}</span>　${esc(x.title)}</a>`).join('')}</div>` : 'まだありません'}</dd></div>
    </div></div></section>`;
  const cta = state.member ? '' : `<div class="cta-bar"><div><b>続きは無料の会員登録で読めます</b><small>選考の質問と回答、評価された経験、年収の推移など</small></div><button class="primary-btn" data-act="join">会員登録して読む（デモ）</button></div>`;
  return `<a class="back-link" href="index.html" data-back>← 選考体験の一覧へ</a>
    <div class="story-head"><div class="story-top"><span><span class="res-badge res-${s.result}">${RES[s.result]}</span><span class="public-label">見出し・属性は公開</span></span><small>投稿 ${esc(s.posted)}</small></div>
      <h2>${esc(s.title)}</h2>
      <div class="chips"><span class="chip attr">転職先：${esc(s.company)}／${esc(s.role)}</span><span class="chip attr">前職：${esc(s.prevInd)}・${esc(s.prevRole)}</span><span class="chip attr">経験${esc(s.years)}</span><span class="chip attr">${esc(s.age)}</span></div></div>
    <div class="demo-bar"><span>デモ用：${state.member?'会員として表示しています（全文が読めます）':'会員登録前の表示です（本文はぼかし）'}</span><button data-act="toggle-member">${state.member?'ぼかし表示に戻す':'会員として表示する'}</button></div>
    <div class="chap-nav">${nav}</div>
    <div class="timeline">${body}${site}</div>${cta}`;
}

/* ---------------- 投稿フォーム ---------------- */
function branch() { const r = form.v['0-3']; return r === undefined || r === '' ? null : +r; }
function emp() { return form.v['0-4'] !== '離職済みだった'; }
function stepItems(i) {
  const r = branch();
  return ITEMS.filter(it => it.inp === STEPS[i] && !it.no.startsWith('5-2-') && !['0-1','7-4','4-4'].includes(it.no) && !it.no.startsWith('S-') && (i === 0 || (r !== null && visible(it, r, emp()))));
}
function ivItems() { const r = branch(); return r === null ? [] : ITEMS.filter(it => it.no.startsWith('5-2-') && visible(it, r, emp())); }
function activeSteps() {
  const out = [0]; if (branch() === null) return out;
  for (let i = 1; i < STEPS.length; i++) if (stepItems(i).length || (i === 3 && ivItems().length)) out.push(i);
  return out;
}
function setV(no, val, iv) { if (iv !== undefined && iv !== '') form.iv[+iv].a[no] = val; else form.v[no] = val; }
function getV(no, iv) { return (iv !== undefined && iv !== null) ? (form.iv[iv].a[no] ?? '') : (form.v[no] ?? ''); }
function selectHtml(no, opts, iv, ph) {
  const val = getV(no, iv); const att = iv != null ? `data-no="${no}" data-iv="${iv}"` : `data-no="${no}"`;
  return `<select ${att}><option value="">${ph||'選んでください'}</option>${opts.map((o, k) => { const v = no === '0-3' ? String(k) : o; return `<option value="${esc(v)}" ${String(val)===String(v)?'selected':''}>${esc(o)}</option>`; }).join('')}</select>`;
}
function radioHtml(no, opts, iv) {
  const val = getV(no, iv); const att = iv != null ? `data-no="${no}" data-iv="${iv}"` : `data-no="${no}"`; const name = `${no}-${iv ?? 'x'}`;
  return `<div class="opts">${opts.map((o, k) => { const v = no === '0-3' ? String(k) : o; return `<label><input type="radio" name="${name}" value="${esc(v)}" ${att} ${String(val)===String(v)?'checked':''}>${esc(o)}</label>`; }).join('')}</div>`;
}
function fieldHtml(it, iv) {
  const r = branch(); const no = it.no; const cd = r === null ? 'M' : cellOf(it, r).code;
  const badge = (cd === 'M' ? '<span class="req">必須</span>' : '<span class="opt">任意</span>') + (it.star ? '<span class="new-badge">追加項目</span>' : '');
  const name = clean(it.name); const hint = it.desc ? `<small>${esc(it.desc)}</small>` : '';
  const att = iv != null ? `data-no="${no}" data-iv="${iv}"` : `data-no="${no}"`;
  let ctl = '';
  if (no === '0-2') ctl = `<div class="row"><input type="text" value="株式会社椿本チエイン" readonly style="flex:1 1 200px;width:auto">${selectHtml('0-2', ROLES, null, '職種')}</div>`;
  else if (no === '0-5') ctl = `<div class="row">${selectHtml('0-5a', INDS, null, '業界')}${selectHtml('0-5b', ROLES, null, '職種')}</div>`;
  else if (no === '7-8') {
    const rows = form.v['7-8'] || [{co:'',role:'',res:''}];
    ctl = `<div class="opts" style="margin-bottom:8px"><label><input type="checkbox" data-no="7-8none" ${form.v['7-8none']?'checked':''}>併願なし</label></div>` +
      (form.v['7-8none'] ? '' : rows.map((x, k) => `<div class="row" style="margin-bottom:6px"><input type="text" placeholder="企業" value="${esc(x.co)}" data-list="7-8" data-i="${k}" data-k="co" style="flex:1 1 130px;width:auto"><input type="text" placeholder="職種" value="${esc(x.role)}" data-list="7-8" data-i="${k}" data-k="role" style="flex:1 1 110px;width:auto"><select data-list="7-8" data-i="${k}" data-k="res" style="flex:1 1 130px"><option value="">結果</option>${['受かった（入社）','内定→辞退','不合格','選考中'].map(o => `<option ${x.res===o?'selected':''}>${o}</option>`).join('')}</select></div>`).join('') + `<button type="button" class="text-action" data-act="add-parallel">＋ 併願先を追加</button>`);
  }
  else if (no === '7-11') ctl = `<div class="row">${['a','b','c'].map((k, i) => selectHtml('7-11'+k, RANK, null, `第${i+1}位`)).join('')}</div>`;
  else if (MULTI[no]) { const cur = getV(no, iv) || []; ctl = `<div class="opts checks">${MULTI[no].map(o => `<label><input type="checkbox" data-multi ${att} value="${esc(o)}" ${Array.isArray(cur)&&cur.includes(o)?'checked':''}>${esc(o)}</label>`).join('')}</div>`; }
  else if (it.fmt === '数値') ctl = `<div class="row"><input type="number" ${att} value="${esc(getV(no, iv))}" placeholder="例：520" style="flex:0 1 160px;width:auto"><span>万円（概算でOK・賞与込みの額面）</span></div>`;
  else if (OPTS[no] && it.fmt.startsWith('選択')) {
    const opts = OPTS[no]; ctl = (opts.length <= 4 && !it.fmt.includes('＋') && no !== '0-3' ? radioHtml(no, opts, iv) : selectHtml(no, opts, iv));
    if (it.fmt.includes('＋')) ctl += `<textarea ${att.replace(`data-no="${no}"`, `data-no="${no}t"`)} placeholder="${no==='1-6'?'学部・学科':'くわしく（任意）'}">${esc(getV(no+'t', iv))}</textarea>`;
  }
  else if (it.fmt.startsWith('選択') && !it.fmt.includes('＋')) ctl = `<input type="text" ${att} value="${esc(getV(no, iv))}" placeholder="入力してください">`;
  else ctl = `<textarea ${att} placeholder="${esc(it.desc||'')}">${esc(getV(no, iv))}</textarea>`;
  const showHint = ctl.includes('<textarea') && !it.fmt.includes('＋') ? '' : hint;
  return `<div class="fld"><label>${esc(name)}${badge}</label>${showHint}${ctl}</div>`;
}
function ivCards() {
  const r = branch(); const its = ivItems(); if (!its.length) return '';
  const cards = form.iv.map((x, k) => {
    const last = k === form.iv.length - 1 && r === 3;
    return `<div class="iv-card"><h4><span>面接 ${k+1}${last?'（落ちた面接）':''}</span>${form.iv.length>1?`<button type="button" class="text-action" data-act="del-iv" data-i="${k}">削除</button>`:''}</h4>${its.map(i => fieldHtml(i, k)).join('')}</div>`;
  }).join('');
  return `<div class="subhead" style="margin-top:26px">各面接${r>=2?'（進んだ段階まで）':''}</div><small style="color:#7d7886;font-size:11px">面接ごとに入力します。</small>${cards}<button type="button" class="outline-btn" style="margin-top:14px" data-act="add-iv">＋ 面接を追加</button>`;
}
function countFor(r) { const its = ITEMS.filter(it => !it.no.startsWith('5-2-') && !['0-1','7-4','4-4'].includes(it.no) && !it.no.startsWith('S-') && visible(it, r, emp())); const m = its.filter(it => cellOf(it, r).code === 'M').length; return [its.length, m]; }
function autoTitle() {
  const v = form.v; const r = branch();
  const ind = v['0-5a'] || '前職'; const pr = v['0-5b'] || ''; const role = v['0-2'] || '職種';
  const tail = ['入社した選考体験','内定後に辞退した選考体験','選考途中で辞退した選考体験','面接で不合格になった選考体験'][r ?? 0];
  return `${ind}の${pr}から${role}へ。${tail}`;
}
function renderPost() {
  if (form.done) return `<a class="back-link" href="index.html">← 選考体験の一覧へ</a><div class="wiz-card done-box"><h3>投稿ありがとうございます（デモ）</h3><p class="lede">入力内容は保存されず、外部へも送信されません。</p>
    <div class="preview-title"><small style="font-weight:400;color:#777">公開される見出し（運営がAIで付ける想定。回答に書かれたことだけで作り、承認は取りません）</small><br>${esc(autoTitle())}</div>
    <p class="lede">見出しと属性（転職先、結果、前職の業界・職種、経験年数、年代）は公開、ほかの回答は会員限定で表示されます。</p>
    <button class="primary-btn" data-act="list" style="margin-top:12px">一覧に戻る</button></div>`;
  const steps = activeSteps(); const cur = Math.min(form.step, steps.length - 1); form.step = cur; const si = steps[cur];
  const r = branch();
  const pills = steps.map((s, k) => `<span class="${k===cur?'on':k<cur?'done':''}">${k+1}. ${STEP_TITLES[s]}</span>`).join('');
  let fields = stepItems(si).map(it => fieldHtml(it, null)).join('');
  if (si === 3) fields += ivCards();
  let info = '';
  if (si === 0) info = `<div class="branch-info">ここで答えた「結果」と「在職中か離職済みか」で、このあとの質問が出し分けられます。</div>`;
  else if (r !== null) { const [n, m] = countFor(r); info = `<div class="branch-info">あなたの立場：<b>${RES[r]}</b>${emp()?'（応募時は在職中）':'（応募時は離職済み）'}。この立場に出る質問は ${n} 問（必須 ${m}／任意 ${n-m}）。各面接の項目は別に数えます。</div>`; }
  const last = cur === steps.length - 1;
  return `<a class="back-link" href="index.html">← 選考体験の一覧へ</a>
    <div class="page-intro"><div><h2>選考体験を投稿する</h2><p class="lede">株式会社椿本チエインの選考について。答えられるところだけで大丈夫です。※デモのため、必須でも先へ進めます。</p></div></div>
    <div class="wiz-steps">${pills}</div><div class="wiz-bar"><i style="width:${Math.round((cur+1)/steps.length*100)}%"></i></div>
    <div class="wiz-card"><h3>${STEP_TITLES[si]}</h3>${info}${fields}
      <div class="wiz-nav"><button class="linkish" data-act="prev" ${cur===0?'style="visibility:hidden"':''}>← 戻る</button>${last?'<button class="primary-btn" data-act="submit">投稿する（デモ）</button>':'<button class="primary-btn" data-act="next">次へ</button>'}</div></div>`;
}

/* ---------------- 共通 ---------------- */
function render() {
  APP.innerHTML = PAGE === 'list' ? renderList() : PAGE === 'story' ? renderDetail() : renderPost();
}
document.addEventListener('click', e => {
  const back = e.target.closest('[data-back]');
  if (back) {
    try { if (document.referrer) { const u = new URL(document.referrer); if (u.origin === location.origin && /\/(index\.html)?$/.test(u.pathname) && history.length > 1) { e.preventDefault(); history.back(); } } } catch (err) {}
    return;
  }
  if (e.target.closest('[data-tab]')) { toast('このデモでは、選考体験のタブだけを表示しています'); return; }
  const t = e.target.closest('[data-act]'); if (!t) return; const a = t.dataset.act;
  if (a === 'list') { location.href = 'index.html'; }
  else if (a === 'toggle-member') { state.member = !state.member; render(); }
  else if (a === 'join') { state.member = true; render(); toast('会員として表示しました（デモ）'); }
  else if (a === 'jump') { const el = document.getElementById('chap-' + t.dataset.n); if (el) el.scrollIntoView({behavior:'smooth', block:'start'}); }
  else if (a === 'next') { if (form.step === 0 && branch() === null) { toast('「選考結果」を選んでください'); return; } form.step++; history.pushState({step:form.step, pushed:true}, '', '#step-' + (form.step + 1)); render(); window.scrollTo({top:0}); saveForm(); }
  else if (a === 'prev') { if (history.state && history.state.pushed) history.back(); else { form.step = Math.max(0, form.step - 1); history.replaceState({step:form.step, pushed:false}, '', '#step-' + (form.step + 1)); render(); window.scrollTo({top:0}); saveForm(); } }
  else if (a === 'submit') { form.done = true; history.pushState({step:form.step, done:true, pushed:true}, '', '#done'); render(); window.scrollTo({top:0}); saveForm(); }
  else if (a === 'add-iv') { form.iv.push({a:{}}); render(); saveForm(); }
  else if (a === 'del-iv') { form.iv.splice(+t.dataset.i, 1); render(); saveForm(); }
  else if (a === 'add-parallel') { (form.v['7-8'] = form.v['7-8'] || [{co:'',role:'',res:''}]).push({co:'',role:'',res:''}); render(); saveForm(); }
});
function onFieldInner(e) {
  const t = e.target; if (!t.dataset) return;
  if (t.dataset.list) { const arr = (form.v[t.dataset.list] = form.v[t.dataset.list] || [{co:'',role:'',res:''}]); arr[+t.dataset.i][t.dataset.k] = t.value; return; }
  const no = t.dataset.no; if (!no) return;
  if (t.type === 'checkbox' && no === '7-8none') { form.v['7-8none'] = t.checked; if (e.type === 'change') render(); return; }
  if (t.dataset.multi !== undefined) { const scope = t.closest('.fld'); const vals = [...scope.querySelectorAll('input[data-multi]:checked')].map(x => x.value); setV(no, vals, t.dataset.iv); return; }
  if (t.type === 'radio' && !t.checked) return;
  setV(no, t.value, t.dataset.iv);
  if (e.type === 'change' && (no === '0-3' || no === '0-4')) render();
}
document.addEventListener('input', e => { onFieldInner(e); saveForm(); });
document.addEventListener('change', e => { onFieldInner(e); saveForm(); });
if (PAGE === 'post') {
  const h = location.hash; const m = h.match(/^#step-(\d+)/);
  if (!(h === '#done' && form.done)) { form.done = false; form.step = m ? Math.max(0, +m[1] - 1) : 0; }
  history.replaceState({step:form.step, done:form.done, pushed:false}, '', form.done ? '#done' : '#step-' + (form.step + 1));
  window.addEventListener('popstate', e => { const s = e.state || {}; form.step = s.step || 0; form.done = !!s.done; render(); window.scrollTo({top:0}); });
}
render();
