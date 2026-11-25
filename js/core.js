/* Physics Alive V2 core: shared by every lesson (any subject). No framework. */
(function(){
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const PA=window.PA={$,$$,lessons:{},lesson:null};

/* ---------- storage (V1 keys migrated) ---------- */
const raw={get(k,d){try{const v=localStorage.getItem('pa_'+k);return v===null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem('pa_'+k,JSON.stringify(v))}catch(e){}},del(k){try{localStorage.removeItem('pa_'+k)}catch(e){}}};
PA.raw=raw;
PA.store={get:(k,d)=>raw.get(PA.lesson.id+'_'+k,d),set:(k,v)=>raw.set(PA.lesson.id+'_'+k,v)};
function migrateV1(){if(raw.get('v2migrated',false))return;['recs','chal','predict','visited'].forEach(k=>{const v=raw.get(k,null);if(v!==null&&raw.get('coulomb_'+k,null)===null)raw.set('coulomb_'+k,v)});raw.set('v2migrated',true)}

/* ---------- language ---------- */
PA.lang=raw.get('lang','en');if(!UI[PA.lang])PA.lang='en';
PA.t=k=>{const L=PA.lesson&&PA.lesson.i18n;const v=(L&&L[PA.lang]&&L[PA.lang][k])??UI[PA.lang][k]??(L&&L.en[k])??UI.en[k];return v};
PA.L=o=>o==null?'':typeof o==='object'&&!Array.isArray(o)?(o[PA.lang]??o.en):o;
PA.num=s=>PA.lang==='en'?String(s):String(s).replace('.',',');
PA.sciTex=(x,d=3)=>{if(x===0)return'0';const a=Math.abs(x);if(a>=0.01&&a<1000)return PA.num(+x.toPrecision(d));const e=Math.floor(Math.log10(a));return PA.num((x/10**e).toFixed(d-1))+'\\times10^{'+e+'}'};
PA.sciTxt=(x,d=3)=>{if(x===0)return'0';const a=Math.abs(x);if(a>=0.01&&a<1000)return PA.num(+x.toPrecision(d));const e=Math.floor(Math.log10(a));const sup={'-':'⁻',0:'⁰',1:'¹',2:'²',3:'³',4:'⁴',5:'⁵',6:'⁶',7:'⁷',8:'⁸',9:'⁹'};return PA.num((x/10**e).toFixed(d-1))+'×10'+String(e).split('').map(c=>sup[c]).join('')};
PA.parseNum=s=>{s=String(s).trim().replace(/\s/g,'').replace(/,/g,'.').replace(/[×x*]10\^?\(?([−-]?\d+)\)?/i,(m,e)=>'e'+e.replace('−','-')).replace('−','-');const v=Number(s);return isFinite(v)?v:NaN};

/* ---------- maths ---------- */
PA.tex=(el,t,disp=true)=>{if(!el)return;if(window.katex){try{katex.render(t,el,{displayMode:disp,throwOnError:false,trust:true,strict:false});return}catch(e){}}el.textContent=t};
PA.mathHTML=h=>h.replace(/\$\$([\s\S]+?)\$\$/g,(m,t)=>'<div class="eq">'+(window.katex?katex.renderToString(t,{displayMode:true,throwOnError:false}):t)+'</div>').replace(/\\\(([\s\S]+?)\\\)/g,(m,t)=>window.katex?katex.renderToString(t,{throwOnError:false}):t);

/* ---------- ui helpers ---------- */
PA.toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('show'),2300)};
PA.fit=c=>{const r=c.getBoundingClientRect(),d=Math.min(window.devicePixelRatio||1,PA.lowEnd?1.5:3);c.width=Math.max(1,r.width*d);c.height=Math.max(1,r.height*d);const x=c.getContext('2d');x.setTransform(d,0,0,d,0,0);return{w:r.width,h:r.height,x}};
PA.lowEnd=(navigator.hardwareConcurrency||4)<=4&&(navigator.deviceMemory||4)<=3;
PA.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
PA.go=id=>{const el=document.getElementById(id);if(!el)return;if(!el.closest('.mode.active'))PA.setMode(el.closest('.mode').id.slice(2));setTimeout(()=>scrollTo({top:el.getBoundingClientRect().top+scrollY-64,behavior:PA.reduced?'auto':'smooth'}),30)};
PA.visible=(el,cb)=>{const o=new IntersectionObserver(es=>es.forEach(e=>cb(e.isIntersecting)),{threshold:0});o.observe(el)};
document.addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g){e.preventDefault();PA.go(g.dataset.go)}
 const c=e.target.closest('[data-close]');if(c)$('#'+c.dataset.close).classList.remove('open');
 if(e.target.classList.contains('backdrop'))e.target.classList.remove('open');
 const s=e.target.closest('.star');if(s){const f=PA.store.get('starred',[]);const id=s.dataset.f;const i=f.indexOf(id);i<0?f.push(id):f.splice(i,1);PA.store.set('starred',f);s.classList.toggle('on',i<0);s.textContent=i<0?'★':'☆';PA.toast(PA.t('saved'))}});

/* ---------- modes ---------- */
const MODES=[['learn','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>'],
 ['textbook','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2zM22 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z"/></svg>'],
 ['practice','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>'],
 ['notebook','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5z"/><path d="M8 7h8M8 11h6"/></svg>']];
PA.mode=raw.get('mode','learn');
function paintModes(){['#modesTop','#modesBottom'].forEach(s=>$(s).innerHTML=MODES.map(([m,ic])=>`<button role="tab" data-mode="${m}" aria-selected="${PA.mode===m}">${ic}<span>${PA.t('modes')[m]}</span></button>`).join(''))}
PA.setMode=m=>{PA.mode=m;raw.set('mode',m);$$('.mode').forEach(x=>x.classList.toggle('active',x.id==='m-'+m));paintModes();if(m==='notebook')renderNotebook();if(m==='textbook')restoreHL();scrollTo(0,0);PA.lesson.onMode&&PA.lesson.onMode(m)};
document.addEventListener('click',e=>{const b=e.target.closest('[data-mode]');if(b)PA.setMode(b.dataset.mode)});

/* ---------- highlights ---------- */
let hlColor='y';
const HLkey=el=>PA.lang+':'+el.id;
function restoreHL(){const H=PA.store.get('hl',{});$$('.hl[id]').forEach(el=>{const v=H[HLkey(el)];if(v)el.innerHTML=v})}
PA.restoreHL=restoreHL;
function saveHL(host){const H=PA.store.get('hl',{});H[HLkey(host)]=host.innerHTML;PA.store.set('hl',H)}
function setHL(on){document.body.classList.toggle('hlmode',on);$('#hlBtn').classList.toggle('on',on);if(on)PA.toast(PA.t('hlOn'))}
function applySel(){if(!document.body.classList.contains('hlmode'))return;const sel=getSelection();if(!sel.rangeCount||sel.isCollapsed)return;const rg=sel.getRangeAt(0);
 const anc=rg.commonAncestorContainer.nodeType===1?rg.commonAncestorContainer:rg.commonAncestorContainer.parentElement;const host=anc.closest('.hl[id]');if(!host)return;
 const w=document.createTreeWalker(host,NodeFilter.SHOW_TEXT);const nodes=[];while(w.nextNode()){const n=w.currentNode;if(rg.intersectsNode(n)&&n.textContent.trim()&&!n.parentElement.closest('.katex'))nodes.push(n)}
 nodes.forEach(n=>{let s=0,e=n.length;if(n===rg.startContainer)s=rg.startOffset;if(n===rg.endContainer)e=rg.endOffset;if(s>=e)return;const mid=n.splitText(s);mid.splitText(e-s);const m=document.createElement('mark');m.className=hlColor;mid.parentNode.insertBefore(m,mid);m.appendChild(mid)});
 sel.removeAllRanges();saveHL(host);PA.toast(PA.t('hlOk'))}

/* ---------- textbook mode (own text + encrypted original) ---------- */
function renderTextbook(){const L=PA.lesson,root=$('#m-textbook');const html=PA.L(L.textbook)||'';
 root.innerHTML=`<div class="wrap"><article class="tb">${PA.mathHTML(html)}
  <div class="fgrid" style="margin-top:18px">${formulaCards()}</div>
  <div class="vault" id="vault"><h3>${PA.t('vaultT')}</h3><p class="muted small">${PA.t('vaultLead')}</p>
   <div class="ans"><input class="f" type="password" id="vpass" placeholder="${PA.t('pass')}" autocomplete="off"><button class="btn sm" id="vgo">${PA.t('unlock')}</button></div><div id="vbody"></div></div>
 </article></div>`;paintFormulaMath(root);
 $('#vgo').onclick=unlock;$('#vpass').onkeydown=e=>{if(e.key==='Enter')unlock()};if(PA._vault)showVault()}
const b64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
async function unlock(){const p=$('#vpass').value;if(!p)return;try{const j=await (await fetch(PA.lesson.vault)).json();
  const km=await crypto.subtle.importKey('raw',new TextEncoder().encode(p),'PBKDF2',false,['deriveKey']);
  const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:b64(j.salt),iterations:j.iter,hash:'SHA-256'},km,{name:'AES-GCM',length:256},false,['decrypt']);
  const pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:b64(j.iv)},key,b64(j.data));PA._vault=JSON.parse(new TextDecoder().decode(pt));showVault()}
 catch(e){PA.toast(PA.t('badPass'))}}
function showVault(){const v=PA._vault[PA.lang]||PA._vault.en;$('#vbody').innerHTML=`<div class="pill">${PA.t('src')}: ${v.reference}</div>`+v.paragraphs.map((p,i)=>`<p class="bookp hl" id="vb${i}">${p}</p>`).join('')+`<button class="btn ghost sm" id="vlock">${PA.t('lockAgain')}</button>`;
 $('#vlock').onclick=()=>{PA._vault=null;renderTextbook()};restoreHL()}

/* ---------- formula cards (shared by Learn summary, Textbook, Notebook) ---------- */
function formulaCards(filter){const st=PA.store.get('starred',[]);return PA.lesson.formulas.filter(f=>!filter||filter.includes(f.id)).map(f=>`<div class="fcard"><button class="star ${st.includes(f.id)?'on':''}" data-f="${f.id}" aria-label="save">${st.includes(f.id)?'★':'☆'}</button><b>${PA.L(f.n)}</b><div class="m" data-tex="${f.id}"></div><small class="muted">${PA.L(f.d)}</small></div>`).join('')}
function paintFormulaMath(root){$$('[data-tex]',root).forEach(el=>{const f=PA.lesson.formulas.find(x=>x.id===el.dataset.tex);PA.tex(el,f.t)})}
PA.formulaCards=formulaCards;PA.paintFormulaMath=paintFormulaMath;

/* ---------- practice engine ---------- */
function renderPractice(){const L=PA.lesson,root=$('#m-practice');const done=PA.store.get('pdone',[]);
 root.innerHTML=`<div class="wrap" style="padding:28px 16px 40px"><div class="kicker">${PA.L(L.title)}</div><h2>${PA.t('modes').practice}</h2><p class="lead">${PA.t('pLead')}</p>`+
 L.practice.map((q,i)=>`<div class="card q" id="q-${q.id}"><div class="qn"><span>${i+1}</span><div class="hl" id="qt-${q.id}">${PA.mathHTML(PA.L(q.q))}${q.extra?'<span class="badge-add">'+PA.t('extraQ')+'</span>':''}</div></div>
  ${q.type==='mcq'?`<div class="opts">${PA.L(q.opts).map((o,j)=>`<button data-q="${q.id}" data-o="${j}">${PA.mathHTML(o)}</button>`).join('')}</div>`:
   `<div class="ans"><input class="f" inputmode="decimal" id="in-${q.id}" placeholder="${PA.t('yourAns')}"><span class="pill" style="align-self:center">${q.unit}</span><button class="btn sm" data-chk="${q.id}">${PA.t('check')}</button></div>`}
  <div class="res" id="res-${q.id}">${done.includes(q.id)?PA.t('correct'):''}</div>
  <div class="row"><button class="btn ghost sm" data-hint="${q.id}">💡 ${PA.t('hint')}</button><button class="btn ghost sm" data-sol="${q.id}">${PA.t('showSol')}</button>${q.lab?`<button class="btn ghost sm" data-lab="${q.id}">${PA.t('loadLab')}</button>`:''}</div>
  <div class="hints" id="hints-${q.id}"></div>
  <div class="steps-sol" id="sol-${q.id}"><ol>${PA.L(q.steps).map(s=>'<li>'+PA.mathHTML(s)+'</li>').join('')}</ol>${q.mistake?`<div class="mistake">⚠️ <b>${PA.t('mistake')}:</b> ${PA.mathHTML(PA.L(q.mistake))}</div>`:''}</div></div>`).join('')+'</div>';
 restoreHL()}
function grade(q,ok){const done=new Set(PA.store.get('pdone',[])),wrong=new Set(PA.store.get('wrong',[]));
 if(ok){done.add(q.id);wrong.delete(q.id)}else wrong.add(q.id);PA.store.set('pdone',[...done]);PA.store.set('wrong',[...wrong]);
 const r=$('#res-'+q.id);r.className='res '+(ok?'ok':'no');r.textContent=ok?PA.t('correct'):PA.t('wrong')}
document.addEventListener('click',e=>{const L=PA.lesson;if(!L)return;const find=id=>L.practice.find(q=>q.id===id);
 const o=e.target.closest('[data-o]');if(o){const q=find(o.dataset.q);const ok=+o.dataset.o===q.ans;$$(`[data-q="${q.id}"]`).forEach(b=>b.classList.remove('right','wrong'));o.classList.add(ok?'right':'wrong');grade(q,ok)}
 const c=e.target.closest('[data-chk]');if(c){const q=find(c.dataset.chk);const v=PA.parseNum($('#in-'+q.id).value);const ok=isFinite(v)&&(q.target===0?v===0:Math.abs(v-q.target)/Math.abs(q.target)<=(q.tol||.02));grade(q,ok)}
 const h=e.target.closest('[data-hint]');if(h){const q=find(h.dataset.hint);const box=$('#hints-'+q.id);const n=box.children.length;const hs=PA.L(q.hints);if(n<hs.length){box.insertAdjacentHTML('beforeend',`<div class="guide">💡 ${PA.mathHTML(hs[n])}</div>`);h.innerHTML='💡 '+(n+1<hs.length?PA.t('nextHint'):PA.t('hint'))}}
 const s=e.target.closest('[data-sol]');if(s){const box=$('#sol-'+s.dataset.sol);box.classList.toggle('show');s.textContent=box.classList.contains('show')?PA.t('hideSol'):PA.t('showSol')}
 const lb=e.target.closest('[data-lab]');if(lb){L.loadLab(find(lb.dataset.lab).lab)}});
PA.renderPractice=renderPractice;

/* ---------- notebook ---------- */
function renderNotebook(){const L=PA.lesson,st=PA.store;const H=st.get('hl',{});const tmp=document.createElement('div');tmp.innerHTML=Object.entries(H).filter(([k])=>k.startsWith(PA.lang+':')).map(([,v])=>v).join(' ');
 const marks=[...tmp.querySelectorAll('mark')].map(m=>m.textContent);const starred=st.get('starred',[]);const wrong=st.get('wrong',[]);const p=L.progress();
 $('#m-notebook').innerHTML=`<div class="wrap" style="padding:28px 16px 40px"><div class="kicker">${PA.L(L.title)}</div><h2>${PA.t('nbT')}</h2><p class="lead">${PA.t('nbLead')}</p>
 <div class="nbgrid">
  <div class="card"><h3>${PA.t('prog')}</h3>${p.map(([lab,v,t])=>`<div class="small" style="margin-top:8px">${lab} <b style="float:inline-end">${v}/${t}</b></div><div class="prog"><i style="width:${t?v/t*100:0}%"></i></div>`).join('')}</div>
  <div class="card"><h3>${PA.t('notes')}</h3><textarea class="f" id="notes" rows="7" placeholder="${PA.t('notesPh')}">${st.get('notes','').replace(/</g,'&lt;')}</textarea></div>
 </div>
 <h3>${PA.t('savedF')}</h3>${starred.length?`<div class="fgrid">${formulaCards(starred)}</div>`:`<p class="empty">${PA.t('noSaved')}</p>`}
 <h3 style="margin-top:22px">${PA.t('myhl')}</h3>${marks.length?marks.map(m=>`<div class="ph">${m}</div>`).join(''):`<p class="empty">${PA.t('noHL')}</p>`}
 <h3 style="margin-top:22px">${PA.t('records')}</h3><div class="card tscroll">${L.recordsTable()||`<p class="empty">${PA.t('noRec')}</p>`}</div>
 <h3 style="margin-top:22px">${PA.t('review')}</h3>${wrong.length?wrong.map(id=>{const q=L.practice.find(x=>x.id===id);return q?`<div class="soft" style="margin:6px 0">${PA.mathHTML(PA.L(q.q))} <button class="link" data-goq="${id}">→</button></div>`:''}).join(''):`<p class="empty">${PA.t('noWrong')}</p>`}
 <div class="row" style="margin-top:24px"><button class="btn" id="nbPdf">${PA.t('pdfBtn')}</button><button class="btn ghost" id="expP">${PA.t('exportP')}</button><label class="btn ghost" style="display:inline-flex;align-items:center">${PA.t('importP')}<input type="file" id="impP" accept=".json,application/json" hidden></label><button class="btn ghost" id="resetL">${PA.t('reset')}</button></div>
 <p class="small muted" style="margin-top:14px"><span class="offline-dot" id="offDot"></span> <span id="offTxt"></span></p></div>`;
 paintFormulaMath($('#m-notebook'));
 $('#notes').oninput=e=>{clearTimeout(PA._nt);PA._nt=setTimeout(()=>st.set('notes',e.target.value),400)};
 $('#nbPdf').onclick=openExp;$('#expP').onclick=exportProgress;$('#impP').onchange=importProgress;
 $('#resetL').onclick=()=>{if(!confirm(PA.t('resetQ')))return;Object.keys(localStorage).filter(k=>k.startsWith('pa_'+L.id+'_')).forEach(k=>localStorage.removeItem(k));location.reload()};
 paintOffline()}
document.addEventListener('click',e=>{const g=e.target.closest('[data-goq]');if(g){PA.setMode('practice');setTimeout(()=>PA.go('q-'+g.dataset.goq),50)}});
PA.renderNotebook=renderNotebook;

function exportProgress(){const o={app:'physics-alive',v:2,date:new Date().toISOString(),data:{}};Object.keys(localStorage).filter(k=>k.startsWith('pa_')).forEach(k=>o.data[k]=localStorage.getItem(k));
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(o)],{type:'application/json'}));a.download='physics-alive-progress.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000)}
function importProgress(e){const f=e.target.files[0];if(!f)return;f.text().then(t=>{const o=JSON.parse(t);if(o.app!=='physics-alive')throw 0;Object.entries(o.data).forEach(([k,v])=>{if(k.startsWith('pa_'))localStorage.setItem(k,v)});PA.toast(PA.t('imported'));setTimeout(()=>location.reload(),800)}).catch(()=>PA.toast(PA.t('badFile')))}

/* ---------- PDF booklet ---------- */
let size='phone';
function openExp(){$('#expLessons').innerHTML=Object.values(PA.allFormulaLessons()).map(l=>`<label class="opt"><input type="checkbox" value="${l.id}" checked> ${PA.L(l.title)} <span class="pill">${l.ref}</span></label>`).join('');$('#exp').classList.add('open')}
PA.openExp=openExp;
PA.allFormulaLessons=()=>{const o={};Object.values(PA.lessons).forEach(l=>Object.assign(o,l.related||{}));Object.assign(o,PA.lessons);return o};
function buildPdf(){const ids=$$('#expLessons input:checked').map(i=>i.value);if(!ids.length){PA.toast(PA.t('pick'));return}
 const P=$('#print'),all=PA.allFormulaLessons();P.dir=UI[PA.lang].dir;P.innerHTML=`<h1>${PA.t('booklet')}</h1><div class="meta">Physics Alive · ${new Date().toLocaleDateString(PA.lang)}</div>`;
 ids.forEach(id=>{const l=all[id];const sec=document.createElement('div');sec.innerHTML=`<h2>${PA.L(l.title)} <span class="meta">${l.ref}</span></h2>`;
  if($('#incF').checked)l.formulas.forEach(f=>{const d=document.createElement('div');d.className='pf';d.innerHTML=`<div class="n">${PA.L(f.n)}</div><div class="m"></div><div class="d">${PA.L(f.d)}</div>`;PA.tex(d.querySelector('.m'),f.t);sec.appendChild(d)});
  if($('#incS').checked)sec.insertAdjacentHTML('beforeend',`<b>${PA.t('summary')}</b><ul>`+PA.L(l.summary).map(s=>`<li>${s}</li>`).join('')+'</ul>');
  if(id===PA.lesson.id){const st=PA.store;
   if($('#incR').checked){const t=l.recordsTable();if(t)sec.insertAdjacentHTML('beforeend',`<b>${PA.t('records')}</b>`+t)}
   if($('#incH').checked){const tmp=document.createElement('div');tmp.innerHTML=Object.entries(st.get('hl',{})).filter(([k])=>k.startsWith(PA.lang+':')).map(([,v])=>v).join(' ');const ms=[...tmp.querySelectorAll('mark')];if(ms.length)sec.insertAdjacentHTML('beforeend',`<b>${PA.t('myhl')}</b>`+ms.map(m=>`<div class="ph">${m.textContent}</div>`).join(''))}
   if($('#incN').checked&&st.get('notes',''))sec.insertAdjacentHTML('beforeend',`<b>${PA.t('notes')}</b><p style="white-space:pre-wrap">${st.get('notes','').replace(/</g,'&lt;')}</p>`);
   if($('#incW').checked){const w=st.get('wrong',[]);if(w.length)sec.insertAdjacentHTML('beforeend',`<b>${PA.t('review')}</b><ul>`+w.map(id=>{const q=l.practice.find(x=>x.id===id);return q?'<li>'+PA.mathHTML(PA.L(q.q))+'</li>':''}).join('')+'</ul>')}}
  P.appendChild(sec)});
 $('#pageSize').textContent=size==='phone'?'@page{size:75mm 140mm;margin:5mm}@media print{#print{font-size:9.5pt}}':'@page{size:A4;margin:16mm}@media print{#print{font-size:11pt}}';
 $('#exp').classList.remove('open');setTimeout(()=>print(),200)}

/* ---------- offline indicator ---------- */
async function paintOffline(){const d=$('#offDot'),t=$('#offTxt');if(!d)return;let ok=false;try{ok=!!(navigator.serviceWorker&&navigator.serviceWorker.controller)&&(await caches.keys()).length>0}catch(e){}d.classList.toggle('ok',ok);t.textContent=ok?PA.t('offline'):PA.t('online')}

/* ---------- boot ---------- */
PA.register=L=>{PA.lessons[L.id]=L};
PA.pickLesson=()=>{const h=location.hash.slice(1);if(PA.lessons[h])return h;const l=raw.get('lesson','coulomb');return PA.lessons[l]?l:'coulomb'};
PA.start=id=>{migrateV1();PA.lesson=PA.lessons[id];const L=PA.lesson;raw.set('lesson',id);if(location.hash.slice(1)!==id)history.replaceState(null,'','#'+id);
 const ls=$('#lessonSel');ls.onchange=()=>{raw.set('lesson',ls.value);location.hash=ls.value;location.reload()};
 window.addEventListener('hashchange',()=>{const h=location.hash.slice(1);if(PA.lessons[h]&&h!==PA.lesson.id){raw.set('lesson',h);location.reload()}});
 const ps=document.createElement('style');ps.id='pageSize';document.head.appendChild(ps);
 $('#hlBtn').onclick=()=>setHL(!document.body.classList.contains('hlmode'));$('#hlDone').onclick=()=>setHL(false);
 $$('.sw').forEach(s=>s.onclick=()=>{hlColor=s.dataset.c;$$('.sw').forEach(x=>x.classList.toggle('sel',x===s));applySel()});
 document.addEventListener('mouseup',()=>setTimeout(applySel,10));
 document.addEventListener('selectionchange',()=>{clearTimeout(PA._sc);PA._sc=setTimeout(()=>{if(matchMedia('(pointer:coarse)').matches)applySel()},1000)});
 document.addEventListener('click',e=>{const m=e.target.closest('mark');if(m&&document.body.classList.contains('hlmode')){const host=m.closest('.hl');m.replaceWith(...m.childNodes);host.normalize();saveHL(host)}});
 $$('#sizeSeg button').forEach(b=>b.onclick=()=>{size=b.dataset.s;$$('#sizeSeg button').forEach(x=>x.classList.toggle('on',x===b))});$('#doPdf').onclick=buildPdf;
 $('#themeBtn').onclick=()=>{const n=document.documentElement.dataset.theme==='light'?'dark':'light';document.documentElement.dataset.theme=n;raw.set('theme',n);$('meta[name=theme-color]').content=n==='light'?'#f5f7fc':'#070b1a';L.onTheme&&L.onTheme()};
 const sel=$('#langSel');sel.value=PA.lang;sel.onchange=()=>{PA.lang=sel.value;raw.set('lang',PA.lang);applyLang(true)};
 L.mount($('#m-learn'));applyLang(false);PA.setMode(PA.mode);
 if('serviceWorker'in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))navigator.serviceWorker.register('sw.js').catch(()=>{})};
function applyLang(keepScroll){const y=scrollY;document.documentElement.lang=PA.lang;document.documentElement.dir=UI[PA.lang].dir;
 $('#lessonSel').innerHTML=Object.values(PA.lessons).map(l=>`<option value="${l.id}" ${l.id===PA.lesson.id?'selected':''}>${l.ref} · ${PA.L(l.title)}</option>`).join('');document.title='Physics Alive · '+PA.L(PA.lesson.title);
 $$('[data-t]').forEach(el=>{const v=PA.t(el.dataset.t);if(typeof v==='string')el.innerHTML=v});
 paintModes();PA.lesson.onLang();renderTextbook();renderPractice();if(PA.mode==='notebook')renderNotebook();restoreHL();if(keepScroll)scrollTo(0,y)}
})();
