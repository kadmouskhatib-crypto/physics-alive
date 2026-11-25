/* Lesson: Gauss's Law (Physics 12, §11.5). Same schema as coulomb.js / flux.js.
   Net flux is computed NUMERICALLY by summing the signed solid angle of every triangle of the closed surface
   (exact for flat faces), and compared with the analytic Q_enc/ε0. Charges are never allowed ON the surface. */
(function(){
const {$,$$}=PA;const t=k=>PA.t(k);

/* ================= PHYSICS ENGINE (SI) ================= */
const EPS0=8.854e-12,K=1/(4*Math.PI*EPS0),nC=1e-9,MARGIN=0.06,BOUND=1.9;
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],len=a=>Math.hypot(a[0],a[1],a[2]),
 cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
// signed solid angle of triangle abc seen from p (Van Oosterom & Strackee)
function solidAngle(p,a,b,c){const r1=sub(a,p),r2=sub(b,p),r3=sub(c,p),l1=len(r1),l2=len(r2),l3=len(r3);
 const num=dot(r1,cross(r2,r3)),den=l1*l2*l3+dot(r1,r2)*l3+dot(r1,r3)*l2+dot(r2,r3)*l1;return 2*Math.atan2(num,den)}
// closed surface as outward-oriented triangles
function surfaceTris(shape,R){const T=[];const add=(a,b,c)=>{const n=cross(sub(b,a),sub(c,a)),m=[(a[0]+b[0]+c[0])/3,(a[1]+b[1]+c[1])/3,(a[2]+b[2]+c[2])/3];dot(n,m)<0?T.push([a,c,b]):T.push([a,b,c])};
 if(shape==='cube'){const v=(x,y,z)=>[x*R,y*R,z*R];[[0,1,2],[1,2,0],[2,0,1]].forEach(([i,j,k])=>[-1,1].forEach(s=>{const q=(u,w)=>{const p=[0,0,0];p[i]=s;p[j]=u;p[k]=w;return v(...p)};add(q(-1,-1),q(1,-1),q(1,1));add(q(-1,-1),q(1,1),q(-1,1))}))}
 else{const NU=32,NV=20;const P=(i,j)=>{const th=Math.PI*j/NV,ph=2*Math.PI*i/NU;return[R*Math.sin(th)*Math.cos(ph),R*Math.cos(th),R*Math.sin(th)*Math.sin(ph)]};
  for(let j=0;j<NV;j++)for(let i=0;i<NU;i++){const a=P(i,j),b=P(i+1,j),c=P(i+1,j+1),d=P(i,j+1);if(j>0)add(a,b,c);if(j<NV-1)add(a,c,d)}}
 return T}
const signedDist=(shape,R,p)=>shape==='cube'?Math.max(Math.abs(p[0]),Math.abs(p[1]),Math.abs(p[2]))-R:len(p)-R;
const inside=(shape,R,p)=>signedDist(shape,R,p)<0;
// numerical net flux: Σ_i q_i Ω_i /(4π ε0)
function fluxNumeric(shape,R,charges,tris=surfaceTris(shape,R)){let phi=0;charges.forEach(c=>{let om=0;tris.forEach(([a,b,d])=>om+=solidAngle(c.p,a,b,d));phi+=c.q*nC*om/(4*Math.PI*EPS0)});return phi}
const fluxAnalytic=(shape,R,charges)=>charges.filter(c=>inside(shape,R,c.p)).reduce((s,c)=>s+c.q*nC,0)/EPS0;
function Efield(p,charges){let e=[0,0,0];charges.forEach(c=>{const r=sub(p,c.p),d=len(r);if(d<1e-6)return;const k=K*c.q*nC/(d*d*d);e=[e[0]+k*r[0],e[1]+k*r[1],e[2]+k*r[2]]});return e}
// keep a charge out of the surface band (no charge exactly on the surface: the field would be singular there)
function keepOff(shape,R,p){p=[Math.max(-BOUND,Math.min(BOUND,p[0])),0,Math.max(-BOUND,Math.min(BOUND,p[2]))];const d=signedDist(shape,R,p);if(Math.abs(d)>=MARGIN)return p;
 const target=d<0?R-MARGIN:R+MARGIN;if(shape==='cube'){const i=Math.abs(p[0])>=Math.abs(p[2])?0:2;p[i]=Math.sign(p[i]||1)*target;return p}
 const l=len(p)||1e-6;return p.map(x=>x*target/l)}

/* ================= TEXT ================= */
const i18n={
en:{k0:'Chapter 11 · Electrostatics · Lesson 3',h0:'Count what is <em>inside</em>, from the outside',
 p0:'A lamp sends light in every direction. Put a bubble of any size around it: every ray crosses it once. Move the lamp outside: each ray that enters also leaves. <b>Try it:</b> drag the lamp and the edge of the bubble.',
 hint0:'👆 Drag the lamp, or drag the bubble\'s edge to resize. Watch the net count.',out:'out',inn:'in',net:'net',
 kA:'A · Experience',kB:'B · Predict',kC:'C · Experiment',kD:'D · Measure',kE:'E · Discover',kF:'F · Understand',kG:'G · Apply',kH:'H · Remember',
 hB:'Guess before you resize',pB:'A charge of +2 nC sits inside a closed sphere. You <b>double the radius</b> of the sphere. The net flux through it becomes:',
 ch:['4 × larger','2 × larger','the same','¼ as large'],fb0:'Pick one. Then test it.',fbR:'🎯 Bold: <b>the same</b>. Prove it!',fbO:g=>`Your prediction: <b>${g}</b>. Let the surface decide.`,testBtn:'🧪 Test my prediction in the 3D lab',
 testGuide:'<b>Your experiment:</b> ① 📌 Record ② tap <b>R × 2</b> ③ 📌 Record again.',g1:'👍 Saved. Now tap <b>R × 2</b>, then 📌 Record.',g2:'🎉 Both saved! <button class="link" data-go="sE">See what you discovered →</button>',
 predR:'✅ Your prediction <b>the same</b> was right!',predW:g=>`You predicted <b>${g}</b>. The measurement says <b>the same</b>. The field is weaker on a bigger sphere, but the area is larger by exactly the same factor.`,
 hC:'The Gauss 3D lab',pC:'Drag a <b>charge</b> to move it, drag empty space to <b>orbit</b>, pinch or scroll to <b>zoom</b>. Tap the surface to <b>probe</b> the local field there.',
 addP:'＋ charge',addN:'− charge',del:'🗑 Remove',shape:'Surface',sphere:'Sphere',cube:'Cube',size:'Size R',dbl:'R × 2',q:'Selected charge',tArrows:'Field on surface',view:'⟲ View',record:'📌 Record',
 roIn:'Q inside',roOut:'Q outside',roNum:'Φ (numerical sum)',roAna:'Q_enc / ε₀',probe:'👆 Tap the surface to probe the local field.',
 probeTxt:(e,en)=>`At that point: |E| = ${e} N/C, E·n̂ = ${en} N/C. The local field changes from point to point, but the <b>net</b> flux does not.`,
 tris:n=>`Numerical integration over ${n} surface triangles`,noCharge:'Add a charge to start.',webgl:'3D is not available on this device, showing the 2D top view.',
 hD:'Your measurements',pD:'Change the size, the shape and the charges outside. Record each time.',th2:['#','Surface','R (m)','Q in (nC)','Q out (nC)','Φ (N m²/C)'],noRec:'No records yet. Tap 📌 Record in the lab.',clear:'Clear',back:'↑ Back to lab',
 hE:'Find the pattern',pE:'Look for records with the same charge inside.',eWait1:'Record the same charge inside a surface of <b>two different sizes</b> (or shapes).',
 eAsk1:'Same charge inside, different size or shape. The net flux…',o1:['changed a lot','changed a little','did not change'],
 eWait2:'Now add a charge <b>outside</b> the surface and record again.',eAsk2:'You added a charge <b>outside</b>. The net flux…',o2:['increased','decreased','did not change'],bad:'Look at the Φ column again.',
 eGood:'🤯 <b>You discovered Gauss\'s law!</b> The net flux depends <b>only on the charge enclosed</b>: not on the size, not on the shape, not on charges outside. Φ ÷ Q_enc is always the same number: 1/ε₀ ≈ 1.13×10¹¹ N m² C⁻².',
 hF:'Now you\'ve earned the law',pF:'Total flux out of any closed surface = enclosed charge ÷ ε₀. Tap each part.',lockF:'🔒 Discover the pattern in step E first, or',skip:'skip and show me the law',tap:'👆 Tap a part of the law.',glow:'✨ see it in the lab',
 pieces:{Phi:'<b>Net flux</b> through the whole closed surface, outward positive. Unit N m² C⁻¹.',oint:'<b>∮</b> means: add E·dA over <b>every</b> piece of the closed surface.',Q:'<b>Q enclosed</b>: the algebraic sum of charges inside. +3 nC and −3 nC inside give zero.',eps:'<b>ε₀</b> = 8.85×10⁻¹² C² N⁻¹ m⁻², the permittivity of free space.'},
 localNote:'<b>Local field ≠ net flux.</b> With a charge outside, the field on the surface changes everywhere. Field lines enter on one side and leave on the other, so the net flux stays zero.',
 hG:'Prove it with measurements',pG:'Missions only complete from your recorded data.',
 missions:[['Record zero net flux with charges inside.','Put equal + and − charges inside.'],['Record a charge outside giving zero net flux.','Only an outside charge, nothing inside.'],['Prove shape does not matter: same charge inside a sphere <b>and</b> a cube.','Record with each shape.'],['Discover Gauss\'s law (step E).','Answer both questions in step E.'],['Predict, then verify.','Solve the question below.']],
 mDone:n=>`✅ Mission ${n} complete!`,score:(n,tt)=>`${n} / ${tt} missions complete`,all:'🏆 <b>All missions done. You own Gauss\'s law.</b>',
 apQ:'A closed surface contains +3 nC and −1 nC. A +5 nC charge sits outside. Find the net flux (N m²/C).',apOk:'✅ Correct! Build it in the lab and check.',apNo:'Not yet. Only the charges inside count: Φ = Q_enc / ε₀.',
 hH:'Summary card',five:'In 5 sentences',realT:'Where you meet it',
 real:[['⚡ Inside a conductor','Gauss\'s law shows that excess charge on a conductor sits on its surface.'],['🚗 Car in a storm','A metal car shields you: the field inside a closed conductor is zero.'],['🌍 Sphere = point','Outside a uniformly charged sphere, the field is as if all the charge were at the centre.'],['🔬 Particle detectors','Measuring flux around a region tells physicists the charge inside.']],
 pdf2:'📄 Export my booklet (PDF)',toNb:'📓 Open my notebook',toTb:'📖 Full lesson (Textbook)',rec:(n,p)=>`📌 #${n}: Φ = ${p} N m²/C`,
 pLead:'Questions with progressive hints and full solutions. Missed questions go to your notebook.',extraQ:'Physics Alive question',progL:['Learning path','Lab missions','Practice'],workedQ:'Example: +4 nC and −1 nC inside, +2 nC outside.'},
fr:{k0:'Chapitre 11 · Électrostatique · Leçon 3',h0:'Compter ce qui est <em>dedans</em>, depuis dehors',
 p0:'Une lampe envoie de la lumière dans toutes les directions. Entoure-la d’une bulle de n’importe quelle taille : chaque rayon la traverse une fois. Place la lampe dehors : chaque rayon qui entre ressort. <b>Essaie :</b> déplace la lampe et le bord de la bulle.',
 hint0:'👆 Déplace la lampe, ou le bord de la bulle pour la redimensionner. Observe le bilan.',out:'sortants',inn:'entrants',net:'bilan',
 kA:'A · Vivre',kB:'B · Prédire',kC:'C · Expérimenter',kD:'D · Mesurer',kE:'E · Découvrir',kF:'F · Comprendre',kG:'G · Appliquer',kH:'H · Retenir',
 hB:'Devine avant de redimensionner',pB:'Une charge de +2 nC est à l’intérieur d’une sphère fermée. Tu <b>doubles le rayon</b>. Le flux total devient :',
 ch:['4 fois plus grand','2 fois plus grand','identique','4 fois plus petit'],fb0:'Choisis, puis teste.',fbR:'🎯 Audacieux : <b>identique</b>. Prouve-le !',fbO:g=>`Ta prédiction : <b>${g}</b>. Laissons la surface décider.`,testBtn:'🧪 Tester ma prédiction au labo 3D',
 testGuide:'<b>Ton expérience :</b> ① 📌 Mesurer ② touche <b>R × 2</b> ③ 📌 Mesurer encore.',g1:'👍 Enregistré. Touche <b>R × 2</b>, puis 📌 Mesurer.',g2:'🎉 Les deux sont enregistrées ! <button class="link" data-go="sE">Vois ce que tu as découvert →</button>',
 predR:'✅ Ta prédiction <b>identique</b> était juste !',predW:g=>`Tu avais prédit <b>${g}</b>. La mesure dit <b>identique</b>. Le champ est plus faible sur une sphère plus grande, mais l’aire augmente exactement du même facteur.`,
 hC:'Le labo 3D de Gauss',pC:'Fais glisser une <b>charge</b> pour la déplacer, le vide pour <b>tourner</b>, pince ou molette pour <b>zoomer</b>. Touche la surface pour <b>sonder</b> le champ local.',
 addP:'＋ charge',addN:'− charge',del:'🗑 Supprimer',shape:'Surface',sphere:'Sphère',cube:'Cube',size:'Taille R',dbl:'R × 2',q:'Charge choisie',tArrows:'Champ sur la surface',view:'⟲ Vue',record:'📌 Mesurer',
 roIn:'Q intérieure',roOut:'Q extérieure',roNum:'Φ (somme numérique)',roAna:'Q_int / ε₀',probe:'👆 Touche la surface pour sonder le champ local.',
 probeTxt:(e,en)=>`En ce point : |E| = ${e} N/C, E·n̂ = ${en} N/C. Le champ local change d’un point à l’autre, mais pas le flux <b>total</b>.`,
 tris:n=>`Intégration numérique sur ${n} triangles de surface`,noCharge:'Ajoute une charge pour commencer.',webgl:'La 3D n’est pas disponible : vue de dessus 2D.',
 hD:'Tes mesures',pD:'Change la taille, la forme et les charges extérieures. Mesure à chaque fois.',th2:['n°','Surface','R (m)','Q int (nC)','Q ext (nC)','Φ (N m²/C)'],noRec:'Aucune mesure. Touche 📌 Mesurer au labo.',clear:'Effacer',back:'↑ Retour au labo',
 hE:'Trouve la règle',pE:'Cherche des mesures avec la même charge intérieure.',eWait1:'Mesure la même charge intérieure avec une surface de <b>deux tailles</b> (ou formes) différentes.',
 eAsk1:'Même charge à l’intérieur, taille ou forme différente. Le flux total…',o1:['a beaucoup changé','a un peu changé','n’a pas changé'],
 eWait2:'Ajoute maintenant une charge <b>à l’extérieur</b> et mesure encore.',eAsk2:'Tu as ajouté une charge <b>extérieure</b>. Le flux total…',o2:['a augmenté','a diminué','n’a pas changé'],bad:'Regarde encore la colonne Φ.',
 eGood:'🤯 <b>Tu as découvert le théorème de Gauss !</b> Le flux total dépend <b>uniquement de la charge intérieure</b> : ni de la taille, ni de la forme, ni des charges extérieures. Φ ÷ Q_int vaut toujours 1/ε₀ ≈ 1,13×10¹¹ N m² C⁻².',
 hF:'Tu as mérité la loi',pF:'Flux sortant de toute surface fermée = charge intérieure ÷ ε₀. Touche chaque partie.',lockF:'🔒 Découvre d’abord la règle à l’étape E, ou',skip:'passer et voir la loi',tap:'👆 Touche une partie de la loi.',glow:'✨ le voir au labo',
 pieces:{Phi:'<b>Flux total</b> à travers toute la surface fermée, compté positif vers l’extérieur. Unité N m² C⁻¹.',oint:'<b>∮</b> signifie : additionner E·dA sur <b>chaque</b> élément de la surface fermée.',Q:'<b>Charge intérieure</b> : somme algébrique des charges dedans. +3 nC et −3 nC donnent zéro.',eps:'<b>ε₀</b> = 8,85×10⁻¹² C² N⁻¹ m⁻², permittivité du vide.'},
 localNote:'<b>Champ local ≠ flux total.</b> Avec une charge extérieure, le champ sur la surface change partout. Les lignes entrent d’un côté et sortent de l’autre : le flux total reste nul.',
 hG:'Prouve-le par la mesure',pG:'Les missions se valident uniquement avec tes mesures.',
 missions:[['Enregistre un flux total nul avec des charges à l’intérieur.','Mets des charges + et − égales dedans.'],['Enregistre une charge extérieure donnant un flux nul.','Seulement une charge dehors, rien dedans.'],['Prouve que la forme ne compte pas : même charge dans une sphère <b>et</b> un cube.','Mesure avec chaque forme.'],['Découvre le théorème de Gauss (étape E).','Réponds aux deux questions de l’étape E.'],['Prédire, puis vérifier.','Résous la question ci-dessous.']],
 mDone:n=>`✅ Mission ${n} réussie !`,score:(n,tt)=>`${n} / ${tt} missions réussies`,all:'🏆 <b>Toutes les missions sont réussies. Tu maîtrises le théorème de Gauss.</b>',
 apQ:'Une surface fermée contient +3 nC et −1 nC. Une charge de +5 nC est à l’extérieur. Calcule le flux total (N m²/C).',apOk:'✅ Exact ! Construis-le au labo pour vérifier.',apNo:'Pas encore. Seules les charges intérieures comptent : Φ = Q_int / ε₀.',
 hH:'Fiche résumé',five:'En 5 phrases',realT:'Où le rencontres-tu ?',
 real:[['⚡ Dans un conducteur','Le théorème de Gauss montre que la charge excédentaire d’un conducteur se place à sa surface.'],['🚗 Voiture sous l’orage','Une voiture métallique te protège : le champ est nul dans un conducteur fermé.'],['🌍 Sphère = point','À l’extérieur d’une sphère uniformément chargée, le champ est celui d’une charge au centre.'],['🔬 Détecteurs','Mesurer le flux autour d’une région révèle la charge qu’elle contient.']],
 pdf2:'📄 Exporter mon livret (PDF)',toNb:'📓 Ouvrir mon carnet',toTb:'📖 Leçon complète (Cours)',rec:(n,p)=>`📌 n°${n} : Φ = ${p} N m²/C`,
 pLead:'Questions avec indices progressifs et solutions complètes. Les questions ratées vont dans ton carnet.',extraQ:'Question Physics Alive',progL:['Parcours','Missions du labo','Exercices'],workedQ:'Exemple : +4 nC et −1 nC dedans, +2 nC dehors.'},
ar:{k0:'الفصل 11 · الكهرباء الساكنة · الدرس 3',h0:'عُدّ ما في <em>الداخل</em> من الخارج',
 p0:'يرسل المصباح الضوء في كل الاتجاهات. ضع حوله فقاعة بأي حجم: كل شعاع يعبرها مرة واحدة. أخرِج المصباح: كل شعاع يدخل يخرج أيضاً. <b>جرّب:</b> اسحب المصباح وحافة الفقاعة.',
 hint0:'👆 اسحب المصباح، أو حافة الفقاعة لتغيير حجمها. راقب المحصّلة.',out:'خارج',inn:'داخل',net:'المحصّلة',
 kA:'أ · جرّب',kB:'ب · توقّع',kC:'ج · اختبر',kD:'د · قِس',kE:'هـ · اكتشف',kF:'و · افهم',kG:'ز · طبّق',kH:'ح · تذكّر',
 hB:'خمّن قبل تغيير الحجم',pB:'شحنة +2 nC داخل كرة مغلقة. <b>تضاعف نصف قطر</b> الكرة. يصبح التدفق الكلي:',
 ch:['أكبر 4 مرات','أكبر مرتين','نفسه','ربع ما كان'],fb0:'اختر ثم اختبر.',fbR:'🎯 جريء: <b>نفسه</b>. أثبته!',fbO:g=>`توقّعك: <b>${g}</b>. لندع السطح يقرّر.`,testBtn:'🧪 اختبر توقّعي في المختبر ثلاثي الأبعاد',
 testGuide:'<b>تجربتك:</b> ① 📌 سجّل ② اضغط <b>R × 2</b> ③ 📌 سجّل مجدداً.',g1:'👍 حُفظ. اضغط الآن <b>R × 2</b> ثم 📌 سجّل.',g2:'🎉 حُفظ القياسان! <button class="link" data-go="sE">شاهد ما اكتشفته ←</button>',
 predR:'✅ كان توقّعك <b>نفسه</b> صحيحاً!',predW:g=>`توقّعت <b>${g}</b>. القياس يقول <b>نفسه</b>. المجال أضعف على كرة أكبر، لكن المساحة تكبر بالمعامل نفسه تماماً.`,
 hC:'مختبر غاوس ثلاثي الأبعاد',pC:'اسحب <b>شحنة</b> لتحريكها، واسحب الفراغ لـ<b>التدوير</b>، وباعد الإصبعين لـ<b>التكبير</b>. اضغط على السطح لـ<b>قياس</b> المجال المحلي.',
 addP:'＋ شحنة',addN:'− شحنة',del:'🗑 حذف',shape:'السطح',sphere:'كرة',cube:'مكعب',size:'الحجم R',dbl:'R × 2',q:'الشحنة المختارة',tArrows:'المجال على السطح',view:'⟲ المشهد',record:'📌 سجّل',
 roIn:'Q في الداخل',roOut:'Q في الخارج',roNum:'Φ (مجموع عددي)',roAna:'Q_enc / ε₀',probe:'👆 اضغط على السطح لقياس المجال المحلي.',
 probeTxt:(e,en)=>`عند تلك النقطة: |E| = ${e} N/C، E·n̂ = ${en} N/C. المجال المحلي يتغيّر من نقطة لأخرى، لكن التدفق <b>الكلي</b> لا يتغيّر.`,
 tris:n=>`تكامل عددي على ${n} مثلثاً من السطح`,noCharge:'أضف شحنة للبدء.',webgl:'العرض ثلاثي الأبعاد غير متاح، يُعرض منظر علوي.',
 hD:'قياساتك',pD:'غيّر الحجم والشكل والشحنات الخارجية. سجّل في كل مرة.',th2:['#','السطح','R (m)','Q داخل (nC)','Q خارج (nC)','Φ (N m²/C)'],noRec:'لا توجد قياسات. اضغط 📌 سجّل في المختبر.',clear:'مسح',back:'↑ العودة إلى المختبر',
 hE:'اكتشف القاعدة',pE:'ابحث عن قياسات بالشحنة الداخلية نفسها.',eWait1:'سجّل الشحنة الداخلية نفسها مع سطح <b>بحجمين</b> (أو شكلين) مختلفين.',
 eAsk1:'الشحنة الداخلية نفسها، والحجم أو الشكل مختلف. التدفق الكلي…',o1:['تغيّر كثيراً','تغيّر قليلاً','لم يتغيّر'],
 eWait2:'أضف الآن شحنة <b>خارج</b> السطح وسجّل مجدداً.',eAsk2:'أضفت شحنة <b>خارجية</b>. التدفق الكلي…',o2:['ازداد','نقص','لم يتغيّر'],bad:'انظر مجدداً إلى عمود Φ.',
 eGood:'🤯 <b>لقد اكتشفت قانون غاوس!</b> يعتمد التدفق الكلي <b>على الشحنة المحصورة فقط</b>: لا على الحجم ولا على الشكل ولا على الشحنات الخارجية. وΦ ÷ Q_enc يساوي دائماً 1/ε₀ ≈ 1.13×10¹¹ N m² C⁻².',
 hF:'لقد استحققت القانون',pF:'التدفق الخارج من أي سطح مغلق = الشحنة المحصورة ÷ ε₀. اضغط على كل جزء.',lockF:'🔒 اكتشف القاعدة أولاً في الخطوة هـ، أو',skip:'تخطَّ وأرني القانون',tap:'👆 اضغط على جزء من القانون.',glow:'✨ شاهده في المختبر',
 pieces:{Phi:'<b>التدفق الكلي</b> عبر السطح المغلق كله، موجب نحو الخارج. الوحدة N m² C⁻¹.',oint:'<b>∮</b> تعني: اجمع E·dA على <b>كل</b> جزء من السطح المغلق.',Q:'<b>الشحنة المحصورة</b>: المجموع الجبري للشحنات في الداخل. +3 nC و−3 nC تعطيان صفراً.',eps:'<b>ε₀</b> = 8.85×10⁻¹² C² N⁻¹ m⁻²، سماحية الفراغ.'},
 localNote:'<b>المجال المحلي ≠ التدفق الكلي.</b> مع شحنة خارجية يتغيّر المجال على السطح في كل مكان، فالخطوط تدخل من جهة وتخرج من الأخرى، ويبقى التدفق الكلي صفراً.',
 hG:'أثبت ذلك بالقياس',pG:'لا تكتمل المهام إلا من بياناتك المسجّلة.',
 missions:[['سجّل تدفقاً كلياً صفرياً مع وجود شحنات في الداخل.','ضع شحنتين + و− متساويتين في الداخل.'],['سجّل شحنة خارجية تعطي تدفقاً صفرياً.','شحنة في الخارج فقط ولا شيء في الداخل.'],['أثبت أن الشكل لا يهم: الشحنة نفسها داخل كرة <b>و</b>مكعب.','سجّل مع كل شكل.'],['اكتشف قانون غاوس (الخطوة هـ).','أجب عن سؤالي الخطوة هـ.'],['توقّع ثم تحقّق.','حلّ السؤال أدناه.']],
 mDone:n=>`✅ اكتملت المهمة ${n}!`,score:(n,tt)=>`${n} / ${tt} مهام مكتملة`,all:'🏆 <b>أنجزت كل المهام. أنت تتقن قانون غاوس.</b>',
 apQ:'سطح مغلق يحوي +3 nC و−1 nC، وشحنة +5 nC في الخارج. احسب التدفق الكلي (N m²/C).',apOk:'✅ صحيح! ابنِ ذلك في المختبر وتحقّق.',apNo:'ليس بعد. الشحنات الداخلية فقط تُحسب: Φ = Q_enc / ε₀.',
 hH:'بطاقة الملخّص',five:'في 5 جمل',realT:'أين تقابله؟',
 real:[['⚡ داخل الموصل','يبيّن قانون غاوس أن الشحنة الزائدة على الموصل تستقر على سطحه.'],['🚗 سيارة في عاصفة','السيارة المعدنية تحميك: المجال داخل موصل مغلق صفر.'],['🌍 الكرة = نقطة','خارج كرة مشحونة بانتظام يكون المجال كأن الشحنة كلها في المركز.'],['🔬 كواشف الجسيمات','قياس التدفق حول منطقة يكشف الشحنة داخلها.']],
 pdf2:'📄 تصدير كتيّبي (PDF)',toNb:'📓 افتح دفتري',toTb:'📖 الدرس الكامل',rec:(n,p)=>`📌 #${n}: Φ = ${p} N m²/C`,
 pLead:'أسئلة مع تلميحات متدرّجة وحلول كاملة. الأسئلة التي تخطئ فيها تذهب إلى دفترك.',extraQ:'سؤال من Physics Alive',progL:['مسار التعلّم','مهام المختبر','التمارين'],workedQ:'مثال: +4 nC و−1 nC في الداخل، و+2 nC في الخارج.'}
};

const formulas=[
 {id:'gl',n:{en:"Gauss's law",fr:'Théorème de Gauss',ar:'قانون غاوس'},t:"\\Phi_e=\\oint\\vec E\\cdot d\\vec A=\\dfrac{Q_{enc}}{\\varepsilon_0}",d:{en:'Any closed surface; outward normal; Q_enc = algebraic sum inside.',fr:'Toute surface fermée ; normale sortante ; Q_int = somme algébrique intérieure.',ar:'أي سطح مغلق؛ العمودي نحو الخارج؛ Q_enc المجموع الجبري في الداخل.'}},
 {id:'e0',n:{en:'Permittivity of free space',fr:'Permittivité du vide',ar:'سماحية الفراغ'},t:"\\varepsilon_0=8.85\\times10^{-12}\\ \\mathrm{C^2N^{-1}m^{-2}},\\ \\ \\dfrac{1}{\\varepsilon_0}=1.13\\times10^{11}",d:{en:'',fr:'',ar:''}},
 {id:'pt',n:{en:'Field of a point charge (from Gauss)',fr:'Champ d’une charge ponctuelle (par Gauss)',ar:'مجال شحنة نقطية (من غاوس)'},t:"E\\,(4\\pi r^2)=\\dfrac{q}{\\varepsilon_0}\\Rightarrow E=\\dfrac{1}{4\\pi\\varepsilon_0}\\dfrac{q}{r^2}",d:{en:'Gauss\'s law gives back Coulomb\'s law.',fr:'Le théorème de Gauss redonne la loi de Coulomb.',ar:'قانون غاوس يعيدنا إلى قانون كولوم.'}},
 {id:'ext',n:{en:'Charge outside',fr:'Charge extérieure',ar:'شحنة خارجية'},t:"Q_{enc}=0\\Rightarrow\\oint\\vec E\\cdot d\\vec A=0",d:{en:'Lines in = lines out (E itself is not zero!).',fr:'Lignes entrantes = lignes sortantes (E n’est pas nul !).',ar:'الخطوط الداخلة = الخارجة (وE نفسه ليس صفراً!).'}}];
const summary={en:['The net flux through any closed surface equals Q_enc / ε₀.','It does not depend on the size or shape of the surface.','Charges outside give zero net flux: their lines enter and leave.','Equal + and − charges inside give zero net flux.','Zero net flux does not mean zero field on the surface.'],
 fr:['Le flux total à travers toute surface fermée vaut Q_int / ε₀.','Il ne dépend ni de la taille ni de la forme de la surface.','Les charges extérieures donnent un flux total nul : leurs lignes entrent et ressortent.','Des charges + et − égales à l’intérieur donnent un flux nul.','Un flux total nul ne signifie pas un champ nul sur la surface.'],
 ar:['التدفق الكلي عبر أي سطح مغلق يساوي Q_enc / ε₀.','لا يعتمد على حجم السطح ولا على شكله.','الشحنات الخارجية تعطي تدفقاً كلياً صفرياً: خطوطها تدخل وتخرج.','شحنتان + و− متساويتان في الداخل تعطيان تدفقاً صفرياً.','التدفق الكلي الصفري لا يعني أن المجال على السطح صفر.']};

const textbook={
en:`<div class="kicker">§11.5 · Physics 12</div><h1>Gauss's Law</h1><p class="muted small">Explanation written for Physics Alive from the physics of §11.5.</p>
<h2>1. Flux through a closed surface</h2><p class="hl" id="t1">A <b>closed surface</b> (a Gaussian surface) divides space into an inside and an outside, like a balloon or a box. Its normal is taken to point <b>outward</b>, so field lines leaving count as positive flux and lines entering count as negative.</p>
<h2>2. A point charge at the centre of a sphere</h2><p class="hl" id="t2">Put a charge q at the centre of a sphere of radius r. On the sphere, E has the same size everywhere and points straight out, so θ = 0 and</p>$$\\Phi_e=E\\,(4\\pi r^2)=\\frac{1}{4\\pi\\varepsilon_0}\\frac{q}{r^2}\\,(4\\pi r^2)=\\frac{q}{\\varepsilon_0}$$
<p class="hl" id="t3">The radius cancels: a bigger sphere has a weaker field (∝ 1/r²) but a larger area (∝ r²). The flux is the same for every sphere.</p>
<h2>3. Any shape, any position</h2><p class="hl" id="t4">Every field line that starts on the charge must cross any closed surface around it. Deforming the surface or moving the charge inside does not change the number of lines that get out. So the result holds for <b>any</b> closed surface.</p>
<div class="def"><b>Gauss's law.</b> The total electric flux through any closed surface equals the net charge enclosed divided by ε₀:</div>$$\\Phi_e=\\oint \\vec E\\cdot d\\vec A=\\frac{Q_{enc}}{\\varepsilon_0}$$
<h2>4. Charges outside</h2><p class="hl" id="t5">A charge outside the surface sends lines that enter on one side and leave on the other. Each line contributes −1 then +1, so the net flux is zero. The field on the surface is <b>not</b> zero, only the total.</p>
<div class="note">Net flux zero does not mean field zero. Gauss's law gives the total, not the local value.</div>
<h2>5. Using Gauss's law</h2><p class="hl" id="t6">When the charge has symmetry (sphere, long line, flat sheet), choose a Gaussian surface on which E is constant and perpendicular. Then \\(\\oint\\vec E\\cdot d\\vec A=EA\\), and E follows at once. For a point charge this gives back Coulomb's law.</p>
<h2>6. Worked examples</h2><p><b>Example 1.</b> +4 nC and −1 nC are inside a closed surface, +2 nC outside.</p>$$\\Phi=\\frac{(4-1)\\times10^{-9}}{8.85\\times10^{-12}}\\approx 339\\ \\mathrm{N\\,m^2C^{-1}}$$
<p><b>Example 2.</b> A cube of side 10 cm has a +5 nC charge at its centre. Flux through <b>one</b> face?</p>$$\\Phi_{face}=\\frac{1}{6}\\frac{5\\times10^{-9}}{8.85\\times10^{-12}}\\approx 94\\ \\mathrm{N\\,m^2C^{-1}}$$
<h2>7. Key formulas</h2>`,
fr:`<div class="kicker">§11.5 · Physique 12</div><h1>Théorème de Gauss</h1><p class="muted small">Explication rédigée pour Physics Alive à partir de la physique du §11.5.</p>
<h2>1. Flux à travers une surface fermée</h2><p class="hl" id="t1">Une <b>surface fermée</b> (surface de Gauss) sépare l’espace en un intérieur et un extérieur, comme un ballon ou une boîte. Sa normale est orientée <b>vers l’extérieur</b> : les lignes sortantes comptent positivement, les lignes entrantes négativement.</p>
<h2>2. Une charge au centre d’une sphère</h2><p class="hl" id="t2">Place une charge q au centre d’une sphère de rayon r. Sur la sphère, E a partout la même intensité et pointe vers l’extérieur, donc θ = 0 et</p>$$\\Phi_e=E\\,(4\\pi r^2)=\\frac{1}{4\\pi\\varepsilon_0}\\frac{q}{r^2}\\,(4\\pi r^2)=\\frac{q}{\\varepsilon_0}$$
<p class="hl" id="t3">Le rayon disparaît : une sphère plus grande a un champ plus faible (∝ 1/r²) mais une aire plus grande (∝ r²). Le flux est le même pour toutes les sphères.</p>
<h2>3. Toute forme, toute position</h2><p class="hl" id="t4">Chaque ligne de champ issue de la charge doit traverser toute surface fermée qui l’entoure. Déformer la surface ou déplacer la charge à l’intérieur ne change pas le nombre de lignes qui sortent. Le résultat vaut donc pour <b>toute</b> surface fermée.</p>
<div class="def"><b>Théorème de Gauss.</b> Le flux électrique total à travers toute surface fermée est égal à la charge intérieure nette divisée par ε₀ :</div>$$\\Phi_e=\\oint \\vec E\\cdot d\\vec A=\\frac{Q_{int}}{\\varepsilon_0}$$
<h2>4. Charges extérieures</h2><p class="hl" id="t5">Une charge extérieure envoie des lignes qui entrent d’un côté et sortent de l’autre : chaque ligne compte −1 puis +1, le flux total est nul. Le champ sur la surface n’est <b>pas</b> nul, seul le total l’est.</p>
<div class="note">Flux total nul ne veut pas dire champ nul. Le théorème de Gauss donne le total, pas la valeur locale.</div>
<h2>5. Utiliser le théorème de Gauss</h2><p class="hl" id="t6">Quand la répartition de charge est symétrique (sphère, fil long, plan), on choisit une surface de Gauss sur laquelle E est constant et perpendiculaire. Alors \\(\\oint\\vec E\\cdot d\\vec A=EA\\) et E s’en déduit. Pour une charge ponctuelle, on retrouve la loi de Coulomb.</p>
<h2>6. Exemples résolus</h2><p><b>Exemple 1.</b> +4 nC et −1 nC à l’intérieur, +2 nC à l’extérieur.</p>$$\\Phi=\\frac{(4-1)\\times10^{-9}}{8{,}85\\times10^{-12}}\\approx 339\\ \\mathrm{N\\,m^2C^{-1}}$$
<p><b>Exemple 2.</b> Un cube de 10 cm de côté a une charge de +5 nC en son centre. Flux à travers <b>une</b> face ?</p>$$\\Phi_{face}=\\frac{1}{6}\\frac{5\\times10^{-9}}{8{,}85\\times10^{-12}}\\approx 94\\ \\mathrm{N\\,m^2C^{-1}}$$
<h2>7. Formules clés</h2>`,
ar:`<div class="kicker">§11.5 · فيزياء 12</div><h1>قانون غاوس</h1><p class="muted small">شرح مكتوب لـ Physics Alive اعتماداً على فيزياء البند 11.5.</p>
<h2>1. التدفق عبر سطح مغلق</h2><p class="hl" id="t1"><b>السطح المغلق</b> (سطح غاوس) يقسم الفضاء إلى داخل وخارج، مثل بالون أو صندوق. يؤخذ عموديّه <b>نحو الخارج</b>، فتُحسب الخطوط الخارجة تدفقاً موجباً والداخلة سالباً.</p>
<h2>2. شحنة نقطية في مركز كرة</h2><p class="hl" id="t2">ضع شحنة q في مركز كرة نصف قطرها r. على الكرة يكون مقدار E ثابتاً ويتجه نحو الخارج مباشرة، أي θ = 0، فيكون</p>$$\\Phi_e=E\\,(4\\pi r^2)=\\frac{1}{4\\pi\\varepsilon_0}\\frac{q}{r^2}\\,(4\\pi r^2)=\\frac{q}{\\varepsilon_0}$$
<p class="hl" id="t3">يُختصر نصف القطر: الكرة الأكبر مجالها أضعف (∝ 1/r²) لكن مساحتها أكبر (∝ r²)، فالتدفق نفسه لكل الكرات.</p>
<h2>3. أي شكل وأي موضع</h2><p class="hl" id="t4">كل خط مجال يبدأ من الشحنة لا بد أن يعبر أي سطح مغلق يحيط بها. تشويه السطح أو تحريك الشحنة في الداخل لا يغيّر عدد الخطوط الخارجة، لذا تصح النتيجة لـ<b>أي</b> سطح مغلق.</p>
<div class="def"><b>قانون غاوس.</b> التدفق الكهربائي الكلي عبر أي سطح مغلق يساوي صافي الشحنة المحصورة مقسوماً على ε₀:</div>$$\\Phi_e=\\oint \\vec E\\cdot d\\vec A=\\frac{Q_{enc}}{\\varepsilon_0}$$
<h2>4. الشحنات الخارجية</h2><p class="hl" id="t5">الشحنة الخارجية ترسل خطوطاً تدخل من جهة وتخرج من الأخرى، فيُسهم كل خط بـ −1 ثم +1، ويكون التدفق الكلي صفراً. المجال على السطح <b>ليس</b> صفراً، بل المجموع فقط.</p>
<div class="note">التدفق الكلي الصفري لا يعني مجالاً صفرياً. قانون غاوس يعطي المجموع لا القيمة المحلية.</div>
<h2>5. استخدام قانون غاوس</h2><p class="hl" id="t6">عندما يكون توزيع الشحنة متماثلاً (كرة، خط طويل، صفيحة) نختار سطح غاوس يكون عليه E ثابتاً وعمودياً، فيصبح \\(\\oint\\vec E\\cdot d\\vec A=EA\\) ونحصل على E مباشرة. وللشحنة النقطية نعود إلى قانون كولوم.</p>
<h2>6. أمثلة محلولة</h2><p><b>مثال 1.</b> +4 nC و−1 nC في الداخل، و+2 nC في الخارج.</p>$$\\Phi=\\frac{(4-1)\\times10^{-9}}{8.85\\times10^{-12}}\\approx 339\\ \\mathrm{N\\,m^2C^{-1}}$$
<p><b>مثال 2.</b> مكعب طول ضلعه 10 cm في مركزه شحنة +5 nC. ما التدفق عبر <b>وجه واحد</b>؟</p>$$\\Phi_{face}=\\frac{1}{6}\\frac{5\\times10^{-9}}{8.85\\times10^{-12}}\\approx 94\\ \\mathrm{N\\,m^2C^{-1}}$$
<h2>7. القوانين الأساسية</h2>`};

const P=(en,fr,ar)=>({en,fr,ar}),same=a=>({en:a,fr:a,ar:a});
const practice=[
 {id:'g1',type:'num',extra:1,unit:'N m²/C',target:(3-1)*nC/EPS0,tol:.02,lab:{shape:'sphere',R:.7,charges:[{q:3,p:[-.2,0,0]},{q:-1,p:[.25,0,.1]},{q:5,p:[1.3,0,0]}]},
  q:P('+3 nC and −1 nC are inside a closed surface; +5 nC is outside. Find the net flux.','+3 nC et −1 nC sont à l’intérieur d’une surface fermée ; +5 nC à l’extérieur. Calcule le flux total.','+3 nC و−1 nC داخل سطح مغلق، و+5 nC خارجه. احسب التدفق الكلي.'),
  hints:P(['Only charges inside count.','Q_enc = +2 nC'],['Seules les charges intérieures comptent.','Q_int = +2 nC'],['الشحنات الداخلية فقط تُحسب.','Q_enc = +2 nC']),steps:same(['\\(\\Phi=\\dfrac{2\\times10^{-9}}{8.85\\times10^{-12}}\\approx226\\ \\mathrm{N\\,m^2C^{-1}}\\)']),
  mistake:P('Adding the outside charge too.','Ajouter aussi la charge extérieure.','إضافة الشحنة الخارجية أيضاً.')},
 {id:'g2',type:'mcq',extra:1,q:P('The radius of a sphere around a charge is tripled. The net flux:','Le rayon d’une sphère autour d’une charge est triplé. Le flux total :','ضوعف نصف قطر كرة حول شحنة 3 مرات. التدفق الكلي:'),
  opts:P(['is 9× smaller','is 3× smaller','is unchanged','is 9× larger'],['est 9 fois plus petit','est 3 fois plus petit','ne change pas','est 9 fois plus grand'],['أصغر 9 مرات','أصغر 3 مرات','لا يتغيّر','أكبر 9 مرات']),ans:2,
  hints:P(['E falls as 1/r², area grows as r².'],['E diminue en 1/r², l’aire augmente en r².'],['E يتناقص بـ 1/r² والمساحة تزداد بـ r².']),steps:same(['\\(\\Phi=q/\\varepsilon_0\\) (no r)'])},
 {id:'g3',type:'mcq',extra:1,q:P('Net flux through a closed surface is zero. Then:','Le flux total à travers une surface fermée est nul. Alors :','التدفق الكلي عبر سطح مغلق صفر. إذن:'),
  opts:P(['E = 0 everywhere on the surface','There is no charge anywhere','The net enclosed charge is zero','The surface must be a sphere'],['E = 0 partout sur la surface','Il n’y a aucune charge nulle part','La charge intérieure nette est nulle','La surface doit être une sphère'],['E = 0 في كل نقطة من السطح','لا توجد أي شحنة في أي مكان','صافي الشحنة المحصورة صفر','يجب أن يكون السطح كرة']),ans:2,
  hints:P(['Gauss\'s law speaks about Q_enc only.'],['Le théorème de Gauss ne parle que de Q_int.'],['قانون غاوس يتحدث عن Q_enc فقط.']),steps:P(['\\(\\Phi=Q_{enc}/\\varepsilon_0=0\\Rightarrow Q_{enc}=0\\). E can still be non-zero (charges outside).'],['\\(Q_{int}=0\\). E peut être non nul (charges extérieures).'],['\\(Q_{enc}=0\\). وقد لا يكون E صفراً (شحنات خارجية).']),
  mistake:P('Thinking zero flux means zero field.','Croire que flux nul signifie champ nul.','الظن بأن التدفق الصفري يعني مجالاً صفرياً.')},
 {id:'g4',type:'num',extra:1,unit:'N m²/C',target:5*nC/EPS0/6,tol:.02,
  q:P('A +5 nC charge is at the centre of a cube. Find the flux through <b>one</b> face.','Une charge de +5 nC est au centre d’un cube. Calcule le flux à travers <b>une</b> face.','شحنة +5 nC في مركز مكعب. احسب التدفق عبر <b>وجه واحد</b>.'),
  hints:P(['Total flux = q/ε₀.','By symmetry the 6 faces share it equally.'],['Flux total = q/ε₀.','Par symétrie, les 6 faces se le partagent.'],['التدفق الكلي = q/ε₀.','بالتماثل تتقاسمه الأوجه الستة بالتساوي.']),steps:same(['\\(\\Phi_{face}=\\dfrac{1}{6}\\cdot\\dfrac{5\\times10^{-9}}{8.85\\times10^{-12}}\\approx94\\ \\mathrm{N\\,m^2C^{-1}}\\)'])},
 {id:'g5',type:'num',extra:1,unit:'nC',target:-500*EPS0/nC,tol:.02,
  q:P('The net flux out of a box is −500 N m²/C. Find the enclosed charge in nC.','Le flux total sortant d’une boîte vaut −500 N m²/C. Trouve la charge intérieure en nC.','التدفق الكلي الخارج من صندوق −500 N m²/C. أوجد الشحنة المحصورة بالنانوكولوم.'),
  hints:P(['Q_enc = ε₀ Φ'],['Q_int = ε₀ Φ'],['Q_enc = ε₀ Φ']),steps:same(['\\(Q=8.85\\times10^{-12}\\times(-500)=-4.43\\times10^{-9}\\ \\mathrm{C}\\approx-4.4\\ \\mathrm{nC}\\)'])},
 {id:'g6',type:'num',extra:1,unit:'N/C',target:K*2*nC/0.3**2,tol:.02,
  q:P('Use Gauss\'s law with a sphere of radius 0.3 m around +2 nC to find E on the sphere.','Utilise le théorème de Gauss avec une sphère de rayon 0,3 m autour de +2 nC pour trouver E sur la sphère.','استخدم قانون غاوس مع كرة نصف قطرها 0.3 m حول +2 nC لإيجاد E على الكرة.'),
  hints:P(['E(4πr²) = q/ε₀'],['E(4πr²) = q/ε₀'],['E(4πr²) = q/ε₀']),steps:same(['\\(E=\\dfrac{q}{4\\pi\\varepsilon_0 r^2}=\\dfrac{8.99\\times10^9\\times2\\times10^{-9}}{0.09}\\approx200\\ \\mathrm{N/C}\\)'])}];

/* ================= MARKUP ================= */
const STEPS=['sA','sB','sC','sD','sE','sF','sG','sH'];
const html=`<div class="wrap"><nav class="path" id="path"></nav></div>
<section class="step hero" id="sA"><div class="wrap"><div class="kicker" data-t="k0"></div><h1 data-t="h0"></h1><div class="ethos" id="ethos"></div>
 <p class="lead hl" id="lA" data-t="p0"></p><canvas id="lamp" style="height:320px;background:radial-gradient(ellipse at 50% 50%,#121a40,#070b1a)"></canvas><p class="hint" data-t="hint0"></p></div></section>
<section class="step" id="sB"><div class="wrap"><div class="kicker" data-t="kB"></div><h2 data-t="hB"></h2><div class="card"><p class="hl" id="lB" data-t="pB"></p><div class="choices" id="choices"></div><div class="feedback" id="predictFb"></div></div></div></section>
<section class="step" id="sC"><div class="wrap"><div class="kicker" data-t="kC"></div><h2 data-t="hC"></h2><p class="lead hl" id="lC" data-t="pC"></p>
 <div class="guide" id="labGuide" style="display:none;margin-bottom:12px"></div>
 <div class="labwrap" id="labwrap"><div class="stage" style="position:relative">
   <div id="v3" style="height:460px;border-radius:16px;overflow:hidden;border:1px solid #22305c;background:radial-gradient(ellipse at 50% 40%,#131c48,#05081a);touch-action:none;position:relative;display:grid;place-items:center;color:#9aa6d4"><span id="ld3">◌ 3D…</span></div>
   <div id="lbls" style="position:absolute;inset:0;pointer-events:none;overflow:hidden;border-radius:16px"></div>
   <button class="ib fsbtn" id="fsBtn" aria-label="Full screen"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/></svg></button>
   <div class="toggles"><button class="ib" id="addP" data-t="addP" style="color:#ff5470"></button><button class="ib" id="addN" data-t="addN" style="color:#3fa9ff"></button><button class="ib" id="delQ" data-t="del"></button><button class="ib on" id="tArrows" data-t="tArrows"></button><button class="ib" id="tView" data-t="view"></button><button class="btn" id="recordBtn" style="margin-inline-start:auto" data-t="record"></button></div>
   <div class="soft small" id="probe" style="margin-top:10px"></div></div>
  <div class="card"><div class="readout"><div class="ro"><small data-t="roIn"></small><b id="roIn">–</b></div><div class="ro"><small data-t="roOut"></small><b id="roOut">–</b></div><div class="ro"><small data-t="roNum"></small><b id="roNum">–</b></div><div class="ro"><small data-t="roAna"></small><b id="roAna">–</b></div></div>
   <div class="small muted" id="trisNote"></div>
   <div class="ctrl"><label data-t="shape"></label><div class="seg" id="shapeSeg"><button data-s="sphere" data-t="sphere"></button><button data-s="cube" data-t="cube"></button></div></div>
   <div class="ctrl"><label><span data-t="size"></span> <b id="Rv"></b></label><input type="range" id="R" min="0.3" max="1.2" step="0.05" value="0.6"><button class="ib" id="dbl" data-t="dbl" style="margin-top:6px"></button></div>
   <div class="ctrl"><label><span data-t="q"></span> <b id="qv"></b></label><input type="range" id="qs" min="-5" max="5" step="0.5" value="2"></div>
   <div class="live" id="live"></div><div class="small muted" id="fallbackMsg" style="display:none;margin-top:8px"></div></div></div></div></section>
<section class="step" id="sD"><div class="wrap"><div class="kicker" data-t="kD"></div><h2 data-t="hD"></h2><p class="lead hl" id="lD" data-t="pD"></p>
 <div class="card"><div class="tscroll" id="recTable"></div><div class="row"><button class="btn ghost sm" id="clearRec" data-t="clear"></button><button class="btn ghost sm" data-go="sC" data-t="back"></button></div></div></div></section>
<section class="step" id="sE"><div class="wrap"><div class="kicker" data-t="kE"></div><h2 data-t="hE"></h2><p class="lead" data-t="pE"></p><div class="card" id="discover"></div></div></section>
<section class="step" id="sF"><div class="wrap"><div class="kicker" data-t="kF"></div><h2 data-t="hF"></h2>
 <div class="card locked" id="fcard"><div class="lockmsg"><span data-t="lockF"></span> <button class="link" id="skipF" data-t="skip"></button></div>
  <div class="unlockable"><p class="hl" id="lF" data-t="pF"></p><div id="bigFormula"></div><div class="soft" id="pieceInfo"></div><div class="note hl" id="lF2" data-t="localNote"></div></div></div></div></section>
<section class="step" id="sG"><div class="wrap"><div class="kicker" data-t="kG"></div><h2 data-t="hG"></h2><p class="lead" data-t="pG"></p><div id="chals"></div><div class="feedback" id="chalScore"></div>
 <div class="card" style="margin-top:12px"><p class="hl" id="lG" data-t="apQ"></p><div class="ans"><input class="f" id="apIn" inputmode="decimal" placeholder="Φ"><button class="btn sm" id="apBtn"></button></div><div class="res" id="apRes"></div></div></div></section>
<section class="step" id="sH"><div class="wrap"><div class="kicker" data-t="kH"></div><h2 data-t="hH"></h2><div class="fgrid" id="sumF"></div>
 <div class="card" style="margin-top:14px"><h3 data-t="five"></h3><ul id="sumList"></ul><p class="hl" id="lH" data-t="workedQ"></p><div class="live" id="worked"></div></div>
 <h3 style="margin-top:22px" data-t="realT"></h3><div class="real" id="real"></div>
 <div class="row"><button class="btn" id="pdfB" data-t="pdf2"></button><button class="btn ghost" data-mode="notebook" data-t="toNb"></button><button class="btn ghost" data-mode="textbook" data-t="toTb"></button></div></div></section>`;

/* ================= STATE ================= */
const DEF=()=>({shape:'sphere',R:.6,charges:[{q:2,p:[0,0,0]}],sel:0});
const S={...DEF(),arrows:true,on:true,guideStart:null,flash:null,flashT:0};
const st=()=>PA.store;
let TRIS=surfaceTris(S.shape,S.R);
const qIn=()=>S.charges.filter(c=>inside(S.shape,S.R,c.p)).reduce((s,c)=>s+c.q,0);
const qOut=()=>S.charges.filter(c=>!inside(S.shape,S.R,c.p)).reduce((s,c)=>s+c.q,0);
const phiNum=()=>fluxNumeric(S.shape,S.R,S.charges,TRIS);
const r1=x=>Math.round(x*10)/10;

/* ================= A: LAMP & BUBBLE ================= */
function lamp(){const c=$('#lamp');let W,H,ctx,L={x:0,y:0},Rb=90,drag=null,vis=true;const N=36;
 function init(){const f=PA.fit(c);W=f.w;H=f.h;ctx=f.x;if(!L.x){L={x:W/2,y:H/2}}}
 const pos=e=>{const r=c.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}};
 c.addEventListener('pointerdown',e=>{const p=pos(e);const dl=Math.hypot(p.x-L.x,p.y-L.y),de=Math.abs(Math.hypot(p.x-W/2,p.y-H/2)-Rb);drag=dl<30?'lamp':de<24?'edge':null;if(drag)c.setPointerCapture(e.pointerId)});
 c.addEventListener('pointermove',e=>{if(!drag)return;const p=pos(e);if(drag==='lamp'){L.x=Math.max(10,Math.min(W-10,p.x));L.y=Math.max(10,Math.min(H-10,p.y))}else Rb=Math.max(30,Math.min(Math.min(W,H)/2-8,Math.hypot(p.x-W/2,p.y-H/2)))});
 c.addEventListener('pointerup',()=>drag=null);PA.visible(c,v=>vis=v);
 function step(tm){requestAnimationFrame(step);if(!W||!vis||PA.mode!=='learn')return;ctx.clearRect(0,0,W,H);ctx.direction='ltr';const cx=W/2,cy=H/2;let out=0,inn=0;
  for(let i=0;i<N;i++){const a=i/N*2*Math.PI+.05,dx=Math.cos(a),dy=Math.sin(a);
   // ray-circle intersections: |L + s d - C| = Rb
   const ox=L.x-cx,oy=L.y-cy,b=ox*dx+oy*dy,cc=ox*ox+oy*oy-Rb*Rb,disc=b*b-cc;const hits=[];if(disc>0){const s1=-b-Math.sqrt(disc),s2=-b+Math.sqrt(disc);if(s1>0)hits.push([s1,-1]);if(s2>0)hits.push([s2,+1])}
   hits.forEach(h=>h[1]>0?out++:inn++);
   const far=Math.max(W,H)*1.5,ph=(tm/18)%40;ctx.strokeStyle='rgba(255,209,102,.35)';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(L.x,L.y);ctx.lineTo(L.x+dx*far,L.y+dy*far);ctx.stroke();
   hits.forEach(([s,sg])=>{ctx.fillStyle=sg>0?'#3ddc97':'#ff5470';ctx.beginPath();ctx.arc(L.x+dx*s,L.y+dy*s,4,0,7);ctx.fill()});
   if(!PA.reduced)for(let s=ph;s<far;s+=40){ctx.fillStyle='rgba(255,230,160,.9)';ctx.beginPath();ctx.arc(L.x+dx*s,L.y+dy*s,1.6,0,7);ctx.fill()}}
  ctx.strokeStyle='#a78bfa';ctx.lineWidth=3;ctx.setLineDash([8,6]);ctx.beginPath();ctx.arc(cx,cy,Rb,0,7);ctx.stroke();ctx.setLineDash([]);
  const g=ctx.createRadialGradient(L.x,L.y,2,L.x,L.y,26);g.addColorStop(0,'#fff6d0');g.addColorStop(.4,'#ffd166');g.addColorStop(1,'rgba(255,209,102,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(L.x,L.y,26,0,7);ctx.fill();
  ctx.font='600 14px sans-serif';ctx.textAlign='left';ctx.fillStyle='#3ddc97';ctx.fillText(`${t('out')}: ${out}`,12,22);ctx.fillStyle='#ff5470';ctx.fillText(`${t('inn')}: ${inn}`,12,42);ctx.fillStyle='#e8ecff';ctx.fillText(`${t('net')}: ${out-inn}`,12,62)}
 new ResizeObserver(init).observe(c);requestAnimationFrame(step)}

/* ================= C: 3D LAB ================= */
let G=null;
async function init3D(){const host=$('#v3');let THREE;
 try{const tc=document.createElement('canvas');if(!(tc.getContext('webgl2')||tc.getContext('webgl')))throw 0;THREE=await import(new URL('vendor/three.module.min.js',document.baseURI).href)}catch(e){return fallback2D()}
 const renderer=new THREE.WebGLRenderer({antialias:!PA.lowEnd,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,PA.lowEnd?1.25:2));
 const ld=$('#ld3');if(ld)ld.remove();host.style.display='block';host.appendChild(renderer.domElement);renderer.domElement.style.cssText='width:100%;height:100%;display:block';
 const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(45,1,.1,100);scene.add(new THREE.AmbientLight(0xffffff,.65));const dl=new THREE.DirectionalLight(0xffffff,.9);dl.position.set(3,5,4);scene.add(dl);
 const floor=new THREE.GridHelper(4,16,0x2a3566,0x1a2350);floor.position.y=-1.3;scene.add(floor);
 const surf=new THREE.Group();scene.add(surf);
 const matS=new THREE.MeshPhongMaterial({color:0xa78bfa,emissive:0x2a1a5a,transparent:true,opacity:.18,side:THREE.DoubleSide,depthWrite:false});
 const matW=new THREE.LineBasicMaterial({color:0xc4b5fd,transparent:true,opacity:.45});
 const chargeG=new THREE.Group();scene.add(chargeG);const arrowG=new THREE.Group();scene.add(arrowG);
 const probeDot=new THREE.Mesh(new THREE.SphereGeometry(.03,12,8),new THREE.MeshBasicMaterial({color:0xffffff}));probeDot.visible=false;scene.add(probeDot);
 const O={az:-.6,el:.45,dist:4},DEFV={...O};
 const placeCam=()=>{cam.position.set(O.dist*Math.cos(O.el)*Math.sin(O.az),O.dist*Math.sin(O.el),O.dist*Math.cos(O.el)*Math.cos(O.az));cam.lookAt(0,0,0)};
 const ray=new THREE.Raycaster(),ptr=new THREE.Vector2(),ground=new THREE.Plane(new THREE.Vector3(0,1,0),0),hit=new THREE.Vector3();const pts=new Map();let mode=null,start=null,pinch0=0;const el=renderer.domElement;
 const ndc=e=>{const r=el.getBoundingClientRect();ptr.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(ptr,cam)};
 el.addEventListener('pointerdown',e=>{el.setPointerCapture(e.pointerId);pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pts.size===2){mode='pinch';const[a,b]=[...pts.values()];pinch0=Math.hypot(a.x-b.x,a.y-b.y);return}
  ndc(e);const hc=ray.intersectObjects(chargeG.children.filter(m=>m.userData.i!=null));start={x:e.clientX,y:e.clientY,az:O.az,el:O.el,moved:false};
  if(hc.length){mode='charge';S.sel=hc[0].object.userData.i;paintSel()}else mode='orbit';G.dirty=true});
 el.addEventListener('pointermove',e=>{if(!pts.has(e.pointerId))return;pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(mode==='pinch'&&pts.size===2){const[a,b]=[...pts.values()];const d=Math.hypot(a.x-b.x,a.y-b.y);O.dist=Math.max(2.5,Math.min(11,O.dist*pinch0/d));pinch0=d;G.dirty=true;return}
  if(!start)return;if(Math.hypot(e.clientX-start.x,e.clientY-start.y)>4)start.moved=true;if(!start.moved)return;
  if(mode==='charge'){ndc(e);if(ray.ray.intersectPlane(ground,hit)){S.charges[S.sel].p=keepOff(S.shape,S.R,[hit.x,0,hit.z]);changed()}}
  else if(mode==='orbit'){O.az=start.az-(e.clientX-start.x)*.008;O.el=Math.max(-1.1,Math.min(1.4,start.el+(e.clientY-start.y)*.006));G.dirty=true}});
 const up=e=>{const was=start&&!start.moved&&mode==='orbit';pts.delete(e.pointerId);if(was){ndc(e);const hs=ray.intersectObject(G.mesh);if(hs.length)probeAt(hs[0].point)}if(pts.size<2&&mode==='pinch')mode=null;if(!pts.size){mode=null;start=null}};
 el.addEventListener('pointerup',up);el.addEventListener('pointercancel',e=>{pts.delete(e.pointerId);mode=null;start=null});
 el.addEventListener('wheel',e=>{e.preventDefault();O.dist=Math.max(2.5,Math.min(11,O.dist*(1+Math.sign(e.deltaY)*.08)));G.dirty=true},{passive:false});
 G={THREE,renderer,scene,cam,surf,matS,matW,chargeG,arrowG,probeDot,O,DEFV,placeCam,host,dirty:true,mesh:null,labels:[]};
 new ResizeObserver(()=>{const r=host.getBoundingClientRect();if(r.width<10)return;renderer.setSize(r.width,r.height,false);cam.aspect=r.width/r.height;cam.updateProjectionMatrix();G.dirty=true}).observe(host);
 buildSurface();buildCharges();loop3D()}
function buildSurface(){if(!G||!G.THREE)return;const{THREE}=G;G.surf.clear();const geo=S.shape==='cube'?new THREE.BoxGeometry(2*S.R,2*S.R,2*S.R):new THREE.SphereGeometry(S.R,40,26);
 G.mesh=new THREE.Mesh(geo,G.matS);G.surf.add(G.mesh);G.surf.add(new THREE.LineSegments(S.shape==='cube'?new THREE.EdgesGeometry(geo):new THREE.WireframeGeometry(new THREE.SphereGeometry(S.R,16,10)),G.matW));
 // sample points with outward normals for local-field arrows
 const sp=[];if(S.shape==='cube'){const g=[-.6,0,.6];[[0,1,2],[1,2,0],[2,0,1]].forEach(([i,j,k])=>[-1,1].forEach(s=>g.forEach(u=>g.forEach(w=>{const p=[0,0,0],n=[0,0,0];p[i]=s*S.R;p[j]=u*S.R;p[k]=w*S.R;n[i]=s;sp.push([p,n])}))))}
 else{const M=PA.lowEnd?42:72;for(let i=0;i<M;i++){const y=1-2*(i+.5)/M,r=Math.sqrt(1-y*y),a=i*2.399963;const n=[r*Math.cos(a),y,r*Math.sin(a)];sp.push([n.map(x=>x*S.R),n])}}
 G.samples=sp;G.arrowG.clear();G.arrows=sp.map(()=>{const a=new THREE.ArrowHelper(new THREE.Vector3(1,0,0),new THREE.Vector3(),.1,0xffd166,.05,.035);G.arrowG.add(a);return a});G.dirty=true}
function buildCharges(){if(!G||!G.THREE)return;const{THREE}=G;G.chargeG.clear();G.labels.forEach(l=>l.remove());G.labels=[];
 S.charges.forEach((c,i)=>{const col=c.q>0?0xff5470:c.q<0?0x3fa9ff:0x888888;const r=.07+Math.min(Math.abs(c.q),5)*.012;
  const m=new THREE.Mesh(new THREE.SphereGeometry(r,20,14),new THREE.MeshPhongMaterial({color:col,emissive:col,emissiveIntensity:.55}));m.position.set(...c.p);m.userData.i=i;G.chargeG.add(m);
  const halo=new THREE.Mesh(new THREE.SphereGeometry(r*2.3,16,10),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:i===S.sel?.32:.14,depthWrite:false}));halo.position.copy(m.position);G.chargeG.add(halo);
  const d=document.createElement('div');d.style.cssText=`position:absolute;font:700 12px sans-serif;padding:1px 6px;border-radius:6px;background:#070b1acc;color:${c.q>0?'#ff8fa3':'#8fd0ff'};transform:translate(-50%,-160%);white-space:nowrap;direction:ltr;${i===S.sel?'outline:1px solid #ffd166':''}`;d.textContent=(c.q>0?'+':'')+PA.num(c.q)+' nC';$('#lbls').appendChild(d);G.labels.push(d)});
 updArrows();G.dirty=true}
function updArrows(){if(!G||!G.arrows)return;const{THREE}=G;const v=new THREE.Vector3();
 G.samples.forEach(([p,n],i)=>{const a=G.arrows[i];const E=Efield(p,S.charges),m=len(E);a.visible=S.arrows&&m>0;if(!m)return;const en=dot(E,n);
  const L=Math.min(.32,.05+.09*Math.log10(1+m/3));a.position.set(...p);a.setDirection(v.set(E[0]/m,E[1]/m,E[2]/m));a.setLength(L,Math.min(.07,L*.4),.035);a.setColor(en>=0?0xffd166:0x3fa9ff)})}
function loop3D(){requestAnimationFrame(loop3D);if(!G||!G.THREE||!S.on||PA.mode!=='learn')return;const tm=performance.now();const fl=S.flash&&tm-S.flashT<1800;if(!G.dirty&&!fl)return;
 const f=k=>S.flash===k&&fl?(.5+.5*Math.sin((tm-S.flashT)/90)):0;G.matS.opacity=.18+f('oint')*.35+f('Phi')*.25;G.chargeG.children.forEach(m=>{if(m.userData.i!=null)m.scale.setScalar(1+f('Q')*.6)});
 G.placeCam();G.renderer.render(G.scene,G.cam);G.dirty=!!fl;
 const r=G.host.getBoundingClientRect();S.charges.forEach((c,i)=>{const d=G.labels[i];if(!d)return;const p=new G.THREE.Vector3(...c.p).project(G.cam);d.style.left=(p.x+1)/2*r.width+'px';d.style.top=(1-p.y)/2*r.height+'px'})}
function probeAt(pt){const p=[pt.x,pt.y,pt.z];let n;if(S.shape==='cube'){const a=p.map(Math.abs),i=a.indexOf(Math.max(...a));n=[0,0,0];n[i]=Math.sign(p[i])}else n=p.map(x=>x/S.R);
 const E=Efield(p,S.charges);G.probeDot.position.set(...p);G.probeDot.visible=true;G.dirty=true;$('#probe').innerHTML=t('probeTxt')(PA.num(len(E).toFixed(1)),PA.num(dot(E,n).toFixed(1)))}
/* 2D top-view fallback (x right, z down) */
function fallback2D(){G={fallback:true};const host=$('#v3');host.innerHTML='<canvas id="fb2d" style="width:100%;height:100%;border:0"></canvas>';host.style.display='block';$('#fallbackMsg').style.display='block';$('#fallbackMsg').textContent=t('webgl');
 const c=$('#fb2d');let drag=-1;const U=()=>Math.min(c.clientWidth,c.clientHeight)/4.2;const toW=e=>{const r=c.getBoundingClientRect();return[(e.clientX-r.left-r.width/2)/U(),0,(e.clientY-r.top-r.height/2)/U()]};
 c.addEventListener('pointerdown',e=>{const w=toW(e);S.charges.forEach((q,i)=>{if(Math.hypot(q.p[0]-w[0],q.p[2]-w[2])<.15)drag=i});if(drag>=0){S.sel=drag;c.setPointerCapture(e.pointerId);paintSel()}});
 c.addEventListener('pointermove',e=>{if(drag<0)return;S.charges[drag].p=keepOff(S.shape,S.R,toW(e));changed()});c.addEventListener('pointerup',()=>drag=-1);new ResizeObserver(paint2D).observe(host);paint2D()}
function paint2D(){const c=$('#fb2d');if(!c)return;const{w,h,x:ctx}=PA.fit(c);ctx.clearRect(0,0,w,h);const u=Math.min(w,h)/4.2,cx=w/2,cy=h/2;ctx.strokeStyle='#a78bfa';ctx.lineWidth=2;
 if(S.shape==='cube')ctx.strokeRect(cx-S.R*u,cy-S.R*u,2*S.R*u,2*S.R*u);else{ctx.beginPath();ctx.arc(cx,cy,S.R*u,0,7);ctx.stroke()}
 S.charges.forEach((q,i)=>{ctx.fillStyle=q.q>0?'#ff5470':'#3fa9ff';ctx.beginPath();ctx.arc(cx+q.p[0]*u,cy+q.p[2]*u,i===S.sel?11:8,0,7);ctx.fill()})}

/* ================= UPDATE ================= */
function changed(rebuildSurface){if(rebuildSurface){TRIS=surfaceTris(S.shape,S.R);S.charges.forEach(c=>c.p=keepOff(S.shape,S.R,c.p));buildSurface()}
 if(G&&G.THREE){if(rebuildSurface||G.chargeG.children.length!==S.charges.length*2)buildCharges();else{let k=0;G.chargeG.children.forEach(m=>{const c=S.charges[Math.floor(k++/2)];if(c)m.position.set(...c.p)});updArrows()}G.probeDot.visible=false;G.dirty=true}
 if(G&&G.fallback)paint2D();readouts()}
function paintSel(){const c=S.charges[S.sel];if(c){$('#qs').value=c.q;$('#qv').textContent=(c.q>0?'+':'')+PA.num(c.q)+' nC'}else $('#qv').textContent='–';if(G&&G.THREE)buildCharges()}
function readouts(){const qi=qIn(),qo=qOut(),pn=phiNum(),pa=qi*nC/EPS0;
 $('#roIn').textContent=(qi>0?'+':'')+PA.num(r1(qi))+' nC';$('#roOut').textContent=(qo>0?'+':'')+PA.num(r1(qo))+' nC';$('#roNum').textContent=PA.num(pn.toFixed(1));$('#roAna').textContent=PA.num(pa.toFixed(1));
 $('#roNum').style.color=Math.abs(pn-pa)<Math.max(.5,Math.abs(pa)*.005)?'var(--good)':'var(--bad)';
 $('#Rv').textContent=PA.num(S.R.toFixed(2))+' m';$('#trisNote').textContent=S.charges.length?t('tris')(TRIS.length):t('noCharge');
 $$('#shapeSeg button').forEach(b=>b.classList.toggle('on',b.dataset.s===S.shape));
 PA.tex($('#live'),`\\oint\\vec E\\cdot d\\vec A=\\frac{${PA.sciTex(qi*nC)}}{8.85\\times10^{-12}}=\\mathbf{${PA.num(pa.toFixed(1))}}\\ \\mathrm{N\\,m^2C^{-1}}`);if(!$('#probe').innerHTML)$('#probe').innerHTML=t('probe')}
function bindLab(){
 $('#addP').onclick=()=>addCharge(2);$('#addN').onclick=()=>addCharge(-2);
 $('#delQ').onclick=()=>{if(!S.charges.length)return;S.charges.splice(S.sel,1);S.sel=Math.max(0,S.sel-1);changed(true);paintSel()};
 $$('#shapeSeg button').forEach(b=>b.onclick=()=>{S.shape=b.dataset.s;changed(true)});
 $('#R').oninput=e=>{S.R=+e.target.value;changed(true)};$('#dbl').onclick=()=>{const r=Math.min(1.2,S.R*2);S.R=r;$('#R').value=r;changed(true)};
 $('#qs').oninput=e=>{const c=S.charges[S.sel];if(!c)return;c.q=+e.target.value;paintSel();changed()};
 $('#tArrows').onclick=e=>{S.arrows=!S.arrows;e.currentTarget.classList.toggle('on',S.arrows);updArrows();if(G)G.dirty=true};
 $('#tView').onclick=()=>{if(G&&G.O){Object.assign(G.O,G.DEFV);G.dirty=true}};
 $('#recordBtn').onclick=record;$('#clearRec').onclick=()=>{['recs','d1','d2','disc'].forEach(k=>st().set(k,k==='recs'?[]:null));paintRecords()};
 $('#fsBtn').onclick=()=>{const w=$('#labwrap');const f=!w.classList.contains('full');w.classList.toggle('full',f);document.body.style.overflow=f?'hidden':'';$('#v3').style.height=f?'min(70vh,640px)':(matchMedia('(max-width:640px)').matches?'380px':'460px');try{f&&w.requestFullscreen?w.requestFullscreen().catch(()=>{}):document.fullscreenElement&&document.exitFullscreen()}catch(e){}};
 if(matchMedia('(max-width:640px)').matches)$('#v3').style.height='380px';
 PA.visible($('#v3'),v=>{S.on=v;if(v&&G)G.dirty=true});
 const io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){io.disconnect();init3D()}},{rootMargin:'800px'});io.observe($('#v3'))}
function addCharge(q){if(S.charges.length>=6)return;const k=S.charges.length;const ang=k*1.3;S.charges.push({q,p:keepOff(S.shape,S.R,[Math.cos(ang)*S.R*.5,0,Math.sin(ang)*S.R*.5])});S.sel=S.charges.length-1;changed();paintSel()}

/* ================= MEASURE / DISCOVER / MISSIONS ================= */
function record(){const recs=st().get('recs',[]);const qi=r1(qIn()),qo=r1(qOut()),p=phiNum(),nin=S.charges.filter(c=>inside(S.shape,S.R,c.p)).length;
 recs.push({shape:S.shape,R:S.R,qin:qi,qout:qo,phi:p,nin,nout:S.charges.length-nin});st().set('recs',recs);PA.toast(t('rec')(recs.length,PA.num(p.toFixed(1))));paintRecords();paintGuide()}
function recordsTable(){const recs=st().get('recs',[]);if(!recs.length)return'';const th=t('th2');
 return`<table><thead><tr>${th.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${recs.map((r,i)=>`<tr><td>${i+1}</td><td>${t(r.shape)}</td><td>${PA.num(r.R.toFixed(2))}</td><td>${PA.num(r.qin)}</td><td>${PA.num(r.qout)}</td><td>${PA.num(r.phi.toFixed(1))}</td></tr>`).join('')}</tbody></table>`}
function paintRecords(){$('#recTable').innerHTML=recordsTable()||`<p class="empty">${t('noRec')}</p>`;paintDiscover();checkMissions()}
const pairSize=r=>r.some(a=>a.qin!==0&&r.some(b=>b!==a&&b.qin===a.qin&&b.qout===a.qout&&(b.R!==a.R||b.shape!==a.shape)));
const pairOut=r=>r.some(a=>r.some(b=>b!==a&&b.qin===a.qin&&b.shape===a.shape&&b.R===a.R&&b.qout!==a.qout));
function paintDiscover(){const box=$('#discover'),recs=st().get('recs',[]),pv=st().get('predict',null);
 if(st().get('disc',null)){box.innerHTML=(pv!=null?`<div class="guide">${pv===2?t('predR'):t('predW')(t('ch')[pv])}</div>`:'')+`<div class="discovery" style="display:block">${t('eGood')}</div><div class="row"><button class="btn sm" data-go="sF">→ ${t('kF')}</button></div>`;return}
 const q=(k,ask,opts,next)=>{box.innerHTML=`<p>${ask}</p><div class="opts">${opts.map((o,i)=>`<button data-o2="${i}">${o}</button>`).join('')}</div><div class="res" id="eRes"></div>`;
  $$('[data-o2]',box).forEach(b=>b.onclick=()=>{if(+b.dataset.o2===2){st().set(k,true);next()}else{b.classList.add('wrong');$('#eRes').className='res no';$('#eRes').textContent=t('bad')}})};
 if(!st().get('d1',null)){if(!pairSize(recs)){box.innerHTML=`<div class="guide">${t('eWait1')}</div>`;return}return q('d1',t('eAsk1'),t('o1'),paintDiscover)}
 if(!pairOut(recs)){box.innerHTML=`<div class="guide">✅ 1/2 · ${t('eWait2')}</div>`;return}
 q('d2',t('eAsk2'),t('o2'),()=>{st().set('disc',true);paintDiscover();unlockF();checkMissions()})}
function unlockF(){$('#fcard').classList.toggle('locked',!st().get('disc',null)&&!st().get('skipF',false))}
const z=v=>Math.abs(v)<.5;
const MIS=[r=>r.some(x=>x.nin>=2&&x.qin===0&&z(x.phi)),r=>r.some(x=>x.nin===0&&x.nout>=1&&x.qout!==0&&z(x.phi)),r=>r.some(a=>a.qin!==0&&r.some(b=>b.qin===a.qin&&b.shape!==a.shape)),()=>!!st().get('disc',null),()=>!!st().get('apply',false)];
function checkMissions(silent){const recs=st().get('recs',[]);const done=new Set(st().get('chal2',[]));MIS.forEach((ok,i)=>{if(!done.has(i)&&ok(recs)){done.add(i);if(!silent)PA.toast(t('mDone')(i+1))}});st().set('chal2',[...done]);
 $('#chals').innerHTML=t('missions').map((m,i)=>`<div class="chal ${done.has(i)?'ok':''}"><div class="tick">${done.has(i)?'✓':i+1}</div><div><b>${m[0]}</b><br><small>${PA.t('hint')}: ${m[1]}</small></div></div>`).join('');
 $('#chalScore').innerHTML=done.size===MIS.length?t('all'):t('score')(done.size,MIS.length)}

/* ================= PREDICT / FORMULA / SUMMARY ================= */
function paintPredict(){const v=st().get('predict',null);$('#choices').innerHTML=t('ch').map((c,i)=>`<button class="choice ${v===i?'picked':''}" data-c="${i}">${c}</button>`).join('');
 $$('#choices .choice').forEach(b=>b.onclick=()=>{st().set('predict',+b.dataset.c);paintPredict()});
 $('#predictFb').innerHTML=v!=null?`<p>${v===2?t('fbR'):t('fbO')(t('ch')[v])}</p><button class="btn" id="testBtn">${t('testBtn')}</button>`:t('fb0');const tb=$('#testBtn');if(tb)tb.onclick=startTest}
function startTest(){S.guideStart=st().get('recs',[]).length;L.loadLab({shape:'sphere',R:.5,charges:[{q:2,p:[0,0,0]}]});paintGuide()}
function paintGuide(){const g=$('#labGuide');if(S.guideStart==null){g.style.display='none';return}const n=st().get('recs',[]).length-S.guideStart;g.style.display='block';g.innerHTML=n<=0?t('testGuide'):n===1?t('g1'):t('g2');$('#recordBtn').style.boxShadow=n<2?'0 0 0 4px rgba(255,209,102,.35)':'';$('#dbl').classList.toggle('on',n===1)}
const LINK={Phi:'Phi',oint:'oint',Q:'Q',eps:null};
function paintFormula(){PA.tex($('#bigFormula'),`\\htmlClass{piece p-Phi}{\\Phi}=\\htmlClass{piece p-oint}{\\oint\\vec E\\cdot d\\vec A}=\\dfrac{\\htmlClass{piece p-Q}{Q_{enc}}}{\\htmlClass{piece p-eps}{\\varepsilon_0}}`);$('#pieceInfo').innerHTML=t('tap');
 Object.keys(LINK).forEach(k=>{const el=$('#bigFormula .p-'+k);if(el)el.addEventListener('click',()=>{$$('#bigFormula .piece').forEach(p=>p.classList.remove('active'));el.classList.add('active');$('#pieceInfo').innerHTML=t('pieces')[k]+(LINK[k]?` <button class="link" data-go="sC">${t('glow')}</button>`:'');if(LINK[k]){S.flash=LINK[k];S.flashT=performance.now()+300;if(G)G.dirty=true}})})}
function paintSummary(){$('#sumF').innerHTML=PA.formulaCards();PA.paintFormulaMath($('#sumF'));$('#sumList').innerHTML=PA.L(summary).map((s,i)=>`<li class="hl" id="sl${i}">${s}</li>`).join('');
 PA.tex($('#worked'),`\\Phi=\\frac{(4-1)\\times10^{-9}}{8.85\\times10^{-12}}\\approx\\mathbf{${PA.num((3*nC/EPS0).toFixed(0))}}\\ \\mathrm{N\\,m^2C^{-1}}`);$('#real').innerHTML=t('real').map((r,i)=>`<div><b>${r[0]}</b><span class="hl" id="rl${i}">${r[1]}</span></div>`).join('')}
function paintPath(cur){const v=new Set(st().get('visited',[]));$('#path').innerHTML=STEPS.map((s,i)=>`<button data-go="${s}" class="${v.has(i)?'done':''} ${i===cur?'now':''}"><b>${v.has(i)?'✓':String.fromCharCode(65+i)}</b>${UI[PA.lang].ethos[i]}</button>`).join('')}

const L={id:'gauss',ref:'§11.5',title:{en:"Gauss's Law",fr:'Théorème de Gauss',ar:'قانون غاوس'},i18n,formulas,summary,textbook,practice,vault:null,
 mount(root){root.innerHTML=html;lamp();bindLab();$('#skipF').onclick=()=>{st().set('skipF',true);unlockF()};
  $('#apBtn').onclick=()=>{const v=PA.parseNum($('#apIn').value),target=2*nC/EPS0;const ok=Math.abs(v-target)/target<.02;$('#apRes').className='res '+(ok?'ok':'no');$('#apRes').textContent=ok?t('apOk'):t('apNo');if(ok){st().set('apply',true);checkMissions()}};
  $('#pdfB').onclick=PA.openExp;
  const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const i=STEPS.indexOf(e.target.id);const v=new Set(st().get('visited',[]));v.add(i);st().set('visited',[...v]);paintPath(i)}}),{threshold:.3});STEPS.forEach(s=>so.observe($('#'+s)))},
 onLang(){$('#ethos').innerHTML=UI[PA.lang].ethos.map(x=>`<span>${x}</span>`).join('');$('#apBtn').textContent=PA.t('check');paintPath(-1);paintPredict();paintFormula();paintSummary();paintRecords();unlockF();checkMissions(true);paintSel();$('#probe').innerHTML='';readouts();if(G&&G.THREE)buildCharges()},
 onMode(m){if(m==='learn'&&G)G.dirty=true},onTheme(){},
 progress(){return[[t('progL')[0],st().get('visited',[]).length,8],[t('progL')[1],st().get('chal2',[]).length,MIS.length],[t('progL')[2],st().get('pdone',[]).length,practice.length]]},
 recordsTable,
 loadLab(cfg){PA.setMode('learn');S.shape=cfg.shape;S.R=cfg.R;S.charges=cfg.charges.map(c=>({q:c.q,p:[...c.p]}));S.sel=0;$('#R').value=cfg.R;changed(true);paintSel();setTimeout(()=>PA.go('sC'),60)}};
PA.register(L);
window.GAUSS_ENGINE={EPS0,solidAngle,surfaceTris,fluxNumeric,fluxAnalytic,keepOff,inside,Efield};
})();
