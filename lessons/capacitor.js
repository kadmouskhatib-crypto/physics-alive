/* Lesson: Parallel-plate capacitor (Physics 12, Chapter 11, capacitor sections). Same schema as the other lessons.
   Ideal parallel-plate model (fringing neglected). A dielectric slab of full thickness slides in a fraction f of the plate:
   the two parts are in parallel → C = ε0 A/d · [ (1−f) + εr f ].
   Battery connected  → V fixed,  Q = CV.
   Battery disconnected → Q fixed (value at the moment of disconnection), V = Q/C.
   E = V/d in both parts, U = ½CV². */
(function(){
const {$,$$}=PA;const t=k=>PA.t(k);

/* ================= PHYSICS ENGINE (SI) ================= */
const EPS0=8.854e-12;
const MEDIA=[{k:'air',er:1},{k:'paper',er:3.5},{k:'glass',er:5},{k:'mica',er:6},{k:'ceramic',er:10}];
function solve(s){ // s: {Acm2, dmm, er, f, connected, V0, Qfix}
 const A=s.Acm2*1e-4,d=s.dmm*1e-3,erEff=(1-s.f)+s.er*s.f,C=EPS0*erEff*A/d;
 const V=s.connected?s.V0:s.Qfix/C,Q=C*V,E=V/d,U=.5*C*V*V,sigVac=EPS0*E,sigDiel=EPS0*s.er*E;
 return{A,d,erEff,C,V,Q,E,U,sigVac,sigDiel}}

/* ================= TEXT ================= */
const i18n={
en:{k0:'Chapter 11 · Electrostatics · Lesson 4',h0:'Storing charge <em>between two plates</em>',
 p0:'Connect two metal plates to a battery. Charge flows until the plates are full. Now <b>drag the top plate</b> closer or farther. Watch how many charges the plates can hold.',
 hint0:'👆 Drag the top plate up and down. The battery voltage stays the same.',stored:'charges stored',gapL:'gap',
 kA:'A · Experience',kB:'B · Predict',kC:'C · Experiment',kD:'D · Measure',kE:'E · Discover',kF:'F · Understand',kG:'G · Apply',kH:'H · Remember',
 hB:'Guess before you squeeze',pB:'A capacitor stays <b>connected</b> to a 12 V battery. You make the gap <b>half as wide</b>. The charge Q on the plates becomes:',
 ch:['½ Q','Q (same)','2 Q','4 Q'],fb0:'Pick one. Then test it.',fbR:'🎯 Sharp: <b>2 Q</b>. Prove it!',fbO:g=>`Your prediction: <b>${g}</b>. Let the plates decide.`,testBtn:'🧪 Test my prediction in the 3D lab',
 testGuide:'<b>Your experiment:</b> ① 📌 Record ② tap <b>d ÷ 2</b> ③ 📌 Record again.',g1:'👍 Saved. Now tap <b>d ÷ 2</b>, then 📌 Record.',g2:'🎉 Both saved! <button class="link" data-go="sE">See what you discovered →</button>',
 predR:'✅ Your prediction <b>2 Q</b> was right!',predW:g=>`You predicted <b>${g}</b>. The measurement says <b>2 Q</b>: closer plates hold more charge at the same voltage.`,
 hC:'The capacitor 3D lab',pC:'Drag to <b>orbit</b>, pinch or scroll to <b>zoom</b>. Change the plates, slide in a dielectric, and <b>disconnect the battery</b> to see what changes.',
 Aw:'Plate area A',dw:'Gap d',Vw:'Battery voltage V₀',mat:'Dielectric',f:'Dielectric inserted',bat:'Battery',on:'🔌 Connected · V constant',off:'⛔ Disconnected · Q constant',
 media:{air:'None (air)',paper:'Paper εᵣ 3.5',glass:'Glass εᵣ 5',mica:'Mica εᵣ 6',ceramic:'Ceramic εᵣ 10'},half:'d ÷ 2',dblA:'A × 2',tLines:'Field lines',tCharges:'Charges',view:'⟲ View',record:'📌 Record',
 roC:'C',roV:'V',roQ:'Q',roE:'E',roU:'U',vsLast:'vs last record',gapNote:'Gap drawn larger than real so you can see inside.',webgl:'3D is not available on this device, showing a 2D side view.',
 eNote:'E is the same in the air part and in the dielectric part (same V, same d). The dielectric part simply holds <b>more charge</b> on the plates.',
 hD:'Your measurements',pD:'Change one thing at a time: d, A, the dielectric, or the battery. Record each time.',th2:['#','🔌','A (cm²)','d (mm)','εᵣ eff','C (pF)','V (V)','Q (nC)','U (nJ)'],noRec:'No records yet. Tap 📌 Record in the lab.',clear:'Clear',back:'↑ Back to lab',
 hE:'Find the pattern',pE:'Compare two records where only d changed.',eWait:'Record, then halve <b>d</b> (nothing else) and record again.',
 eAsk1:'From your table: when d was halved, C was multiplied by…',eBad:'Divide the two C values from your table.',
 eAsk2:'So capacitance is proportional to…',fn:['d','1 / d','d²','A × d'],fnBad:'Smaller gap gave bigger C. Which choice does that?',
 eGood:'🤯 <b>Yes!</b> C ∝ 1/d. Your missions will show C ∝ A and C ∝ εᵣ too. Together: <b>C = ε₀ εᵣ A / d</b>.',
 hF:'Now you\'ve earned the formulas',pF:'Tap each part of the capacitance formula.',lockF:'🔒 Discover the pattern in step E first, or',skip:'skip and show me the law',tap:'👆 Tap a part.',glow:'✨ see it in the lab',
 pieces:{C:'<b>Capacitance</b> in farads (F): charge stored per volt, C = Q/V. Real capacitors: pF to mF.',e0:'<b>ε₀</b> = 8.85×10⁻¹² F/m, permittivity of free space.',er:'<b>εᵣ</b>: the dielectric multiplies C. Its molecules polarise and cancel part of the field, so more charge fits at the same V.',A:'<b>Plate area</b> (m²). More area = more room for charge.',d:'<b>Gap</b> (m). Closer plates attract their charges more strongly, so more charge fits.'},
 tableT:'Connected or disconnected?',tbl:['','🔌 Battery connected','⛔ Battery disconnected','Fixed','V','Q','When C increases','Q increases, V same','V decreases, Q same','Energy U','U = ½CV² increases','U = Q²/2C decreases'],
 ideal:'<b>Ideal model.</b> We assume the field is uniform and stops at the plate edges (no fringing). This is accurate when d is much smaller than the plate size.',
 hG:'Prove it with measurements',pG:'Missions only complete from your recorded data.',
 missions:[['Prove C ∝ A: same d and dielectric, double the area.','Record, tap A × 2, record.'],['Prove C ∝ εᵣ: same plates, fully insert a dielectric.','Record with air, slide the dielectric fully in, record.'],['Disconnect the battery, then change d: show that Q stays the same and V changes.','Disconnect, record, change d, record.'],['Discover C ∝ 1/d (step E).','Answer both questions in step E.'],['Predict, then verify.','Solve the question below.']],
 mDone:n=>`✅ Mission ${n} complete!`,score:(n,tt)=>`${n} / ${tt} missions complete`,all:'🏆 <b>All missions done. You own capacitors.</b>',
 apQ:'A = 200 cm², d = 2 mm, air, V = 10 V. Find Q in nC.',apOk:'✅ Correct! Set those values in the lab and check.',apNo:'Not yet. C = ε₀A/d, then Q = CV. Units: m² and m.',
 hH:'Summary card',five:'In 5 sentences',realT:'Where you meet it',
 real:[['📸 Camera flash','A capacitor stores charge slowly, then dumps it in a flash in milliseconds.'],['📱 Touchscreens','Your finger changes the capacitance of tiny electrodes; the phone measures it.'],['⌨️ Keyboards','Pressing a key changes a gap d, so the capacitance changes.'],['❤️ Defibrillators','A large capacitor stores energy U = ½CV² to restart a heart.']],
 pdf2:'📄 Export my booklet (PDF)',toNb:'📓 Open my notebook',toTb:'📖 Full lesson (Textbook)',rec:(n,c)=>`📌 #${n}: C = ${c} pF`,
 pLead:'Questions with progressive hints and full solutions. Missed questions go to your notebook.',extraQ:'Physics Alive question',progL:['Learning path','Lab missions','Practice'],workedQ:'Example: A = 100 cm², d = 1 mm, air, V = 12 V.'},
fr:{k0:'Chapitre 11 · Électrostatique · Leçon 4',h0:'Stocker des charges <em>entre deux plaques</em>',
 p0:'Relie deux plaques métalliques à une pile. Les charges circulent jusqu’à ce que les plaques soient pleines. <b>Fais glisser la plaque du haut</b> plus près ou plus loin. Observe combien de charges elles retiennent.',
 hint0:'👆 Fais glisser la plaque du haut. La tension de la pile reste la même.',stored:'charges stockées',gapL:'écart',
 kA:'A · Vivre',kB:'B · Prédire',kC:'C · Expérimenter',kD:'D · Mesurer',kE:'E · Découvrir',kF:'F · Comprendre',kG:'G · Appliquer',kH:'H · Retenir',
 hB:'Devine avant de rapprocher',pB:'Un condensateur reste <b>branché</b> à une pile de 12 V. Tu rends l’écart <b>deux fois plus petit</b>. La charge Q devient :',
 ch:['½ Q','Q (identique)','2 Q','4 Q'],fb0:'Choisis, puis teste.',fbR:'🎯 Bien vu : <b>2 Q</b>. Prouve-le !',fbO:g=>`Ta prédiction : <b>${g}</b>. Laissons les plaques décider.`,testBtn:'🧪 Tester ma prédiction au labo 3D',
 testGuide:'<b>Ton expérience :</b> ① 📌 Mesurer ② touche <b>d ÷ 2</b> ③ 📌 Mesurer encore.',g1:'👍 Enregistré. Touche <b>d ÷ 2</b>, puis 📌 Mesurer.',g2:'🎉 Les deux sont enregistrées ! <button class="link" data-go="sE">Vois ce que tu as découvert →</button>',
 predR:'✅ Ta prédiction <b>2 Q</b> était juste !',predW:g=>`Tu avais prédit <b>${g}</b>. La mesure dit <b>2 Q</b> : des plaques plus proches retiennent plus de charge à tension égale.`,
 hC:'Le labo 3D du condensateur',pC:'Fais glisser pour <b>tourner</b>, pince ou molette pour <b>zoomer</b>. Change les plaques, glisse un diélectrique et <b>débranche la pile</b> pour voir ce qui change.',
 Aw:'Aire des plaques A',dw:'Écart d',Vw:'Tension de la pile V₀',mat:'Diélectrique',f:'Diélectrique inséré',bat:'Pile',on:'🔌 Branchée · V constante',off:'⛔ Débranchée · Q constante',
 media:{air:'Aucun (air)',paper:'Papier εᵣ 3,5',glass:'Verre εᵣ 5',mica:'Mica εᵣ 6',ceramic:'Céramique εᵣ 10'},half:'d ÷ 2',dblA:'A × 2',tLines:'Lignes de champ',tCharges:'Charges',view:'⟲ Vue',record:'📌 Mesurer',
 roC:'C',roV:'V',roQ:'Q',roE:'E',roU:'U',vsLast:'par rapport à la dernière mesure',gapNote:'Écart dessiné plus grand que la réalité pour voir à l’intérieur.',webgl:'La 3D n’est pas disponible : vue de côté 2D.',
 eNote:'E est le même dans la partie air et dans la partie diélectrique (même V, même d). La partie diélectrique retient simplement <b>plus de charge</b> sur les plaques.',
 hD:'Tes mesures',pD:'Change une seule chose à la fois : d, A, le diélectrique ou la pile. Mesure à chaque fois.',th2:['n°','🔌','A (cm²)','d (mm)','εᵣ eff','C (pF)','V (V)','Q (nC)','U (nJ)'],noRec:'Aucune mesure. Touche 📌 Mesurer au labo.',clear:'Effacer',back:'↑ Retour au labo',
 hE:'Trouve la règle',pE:'Compare deux mesures où seul d a changé.',eWait:'Mesure, puis divise <b>d</b> par deux (rien d’autre) et mesure encore.',
 eAsk1:'D’après ton tableau : quand d a été divisé par deux, C a été multiplié par…',eBad:'Divise les deux valeurs de C de ton tableau.',
 eAsk2:'La capacité est donc proportionnelle à…',fn:['d','1 / d','d²','A × d'],fnBad:'Un écart plus petit donne un C plus grand. Quel choix fait cela ?',
 eGood:'🤯 <b>Oui !</b> C ∝ 1/d. Tes missions montreront aussi C ∝ A et C ∝ εᵣ. Ensemble : <b>C = ε₀ εᵣ A / d</b>.',
 hF:'Tu as mérité les formules',pF:'Touche chaque partie de la formule de la capacité.',lockF:'🔒 Découvre d’abord la règle à l’étape E, ou',skip:'passer et voir la loi',tap:'👆 Touche une partie.',glow:'✨ le voir au labo',
 pieces:{C:'<b>Capacité</b> en farads (F) : charge stockée par volt, C = Q/V. Condensateurs réels : du pF au mF.',e0:'<b>ε₀</b> = 8,85×10⁻¹² F/m, permittivité du vide.',er:'<b>εᵣ</b> : le diélectrique multiplie C. Ses molécules se polarisent et annulent une partie du champ : plus de charge à V égal.',A:'<b>Aire des plaques</b> (m²). Plus d’aire = plus de place pour la charge.',d:'<b>Écart</b> (m). Des plaques plus proches attirent plus fort leurs charges : plus de charge.'},
 tableT:'Branchée ou débranchée ?',tbl:['','🔌 Pile branchée','⛔ Pile débranchée','Fixe','V','Q','Quand C augmente','Q augmente, V identique','V diminue, Q identique','Énergie U','U = ½CV² augmente','U = Q²/2C diminue'],
 ideal:'<b>Modèle idéal.</b> On suppose le champ uniforme et nul hors des plaques (pas d’effet de bord). C’est précis quand d est bien plus petit que la taille des plaques.',
 hG:'Prouve-le par la mesure',pG:'Les missions se valident uniquement avec tes mesures.',
 missions:[['Prouve C ∝ A : même d et même diélectrique, double l’aire.','Mesure, touche A × 2, mesure.'],['Prouve C ∝ εᵣ : mêmes plaques, insère complètement un diélectrique.','Mesure dans l’air, insère complètement, mesure.'],['Débranche la pile puis change d : montre que Q reste identique et que V change.','Débranche, mesure, change d, mesure.'],['Découvre C ∝ 1/d (étape E).','Réponds aux deux questions de l’étape E.'],['Prédire, puis vérifier.','Résous la question ci-dessous.']],
 mDone:n=>`✅ Mission ${n} réussie !`,score:(n,tt)=>`${n} / ${tt} missions réussies`,all:'🏆 <b>Toutes les missions sont réussies. Tu maîtrises les condensateurs.</b>',
 apQ:'A = 200 cm², d = 2 mm, air, V = 10 V. Calcule Q en nC.',apOk:'✅ Exact ! Règle ces valeurs au labo pour vérifier.',apNo:'Pas encore. C = ε₀A/d, puis Q = CV. Unités : m² et m.',
 hH:'Fiche résumé',five:'En 5 phrases',realT:'Où le rencontres-tu ?',
 real:[['📸 Flash d’appareil photo','Un condensateur se charge lentement, puis se vide en un éclair en quelques millisecondes.'],['📱 Écrans tactiles','Ton doigt modifie la capacité de minuscules électrodes ; le téléphone la mesure.'],['⌨️ Claviers','Appuyer sur une touche change un écart d, donc la capacité.'],['❤️ Défibrillateurs','Un gros condensateur stocke l’énergie U = ½CV² pour relancer un cœur.']],
 pdf2:'📄 Exporter mon livret (PDF)',toNb:'📓 Ouvrir mon carnet',toTb:'📖 Leçon complète (Cours)',rec:(n,c)=>`📌 n°${n} : C = ${c} pF`,
 pLead:'Questions avec indices progressifs et solutions complètes. Les questions ratées vont dans ton carnet.',extraQ:'Question Physics Alive',progL:['Parcours','Missions du labo','Exercices'],workedQ:'Exemple : A = 100 cm², d = 1 mm, air, V = 12 V.'},
ar:{k0:'الفصل 11 · الكهرباء الساكنة · الدرس 4',h0:'تخزين الشحنة <em>بين لوحين</em>',
 p0:'صِل لوحين معدنيين ببطارية. تتدفق الشحنة حتى يمتلئ اللوحان. <b>اسحب اللوح العلوي</b> للأقرب أو للأبعد، وراقب كم شحنة يستطيعان حملها.',
 hint0:'👆 اسحب اللوح العلوي صعوداً ونزولاً. جهد البطارية يبقى نفسه.',stored:'شحنات مخزّنة',gapL:'المسافة',
 kA:'أ · جرّب',kB:'ب · توقّع',kC:'ج · اختبر',kD:'د · قِس',kE:'هـ · اكتشف',kF:'و · افهم',kG:'ز · طبّق',kH:'ح · تذكّر',
 hB:'خمّن قبل التقريب',pB:'مكثف يبقى <b>موصولاً</b> ببطارية 12 V. تجعل المسافة بين اللوحين <b>نصف ما كانت</b>. تصبح الشحنة Q:',
 ch:['½ Q','Q (نفسها)','2 Q','4 Q'],fb0:'اختر ثم اختبر.',fbR:'🎯 دقيق: <b>2 Q</b>. أثبته!',fbO:g=>`توقّعك: <b>${g}</b>. لندع اللوحين يقرّران.`,testBtn:'🧪 اختبر توقّعي في المختبر ثلاثي الأبعاد',
 testGuide:'<b>تجربتك:</b> ① 📌 سجّل ② اضغط <b>d ÷ 2</b> ③ 📌 سجّل مجدداً.',g1:'👍 حُفظ. اضغط الآن <b>d ÷ 2</b> ثم 📌 سجّل.',g2:'🎉 حُفظ القياسان! <button class="link" data-go="sE">شاهد ما اكتشفته ←</button>',
 predR:'✅ كان توقّعك <b>2 Q</b> صحيحاً!',predW:g=>`توقّعت <b>${g}</b>. القياس يقول <b>2 Q</b>: اللوحان الأقرب يحملان شحنة أكبر عند الجهد نفسه.`,
 hC:'مختبر المكثف ثلاثي الأبعاد',pC:'اسحب لـ<b>التدوير</b>، وباعد الإصبعين لـ<b>التكبير</b>. غيّر اللوحين، وأدخل عازلاً، و<b>افصل البطارية</b> لترى ما يتغيّر.',
 Aw:'مساحة اللوح A',dw:'المسافة d',Vw:'جهد البطارية V₀',mat:'العازل',f:'نسبة إدخال العازل',bat:'البطارية',on:'🔌 موصولة · V ثابت',off:'⛔ مفصولة · Q ثابتة',
 media:{air:'لا شيء (هواء)',paper:'ورق εᵣ 3.5',glass:'زجاج εᵣ 5',mica:'ميكا εᵣ 6',ceramic:'سيراميك εᵣ 10'},half:'d ÷ 2',dblA:'A × 2',tLines:'خطوط المجال',tCharges:'الشحنات',view:'⟲ المشهد',record:'📌 سجّل',
 roC:'C',roV:'V',roQ:'Q',roE:'E',roU:'U',vsLast:'مقارنة بآخر قياس',gapNote:'المسافة مرسومة أكبر من الواقع لتتمكن من رؤية الداخل.',webgl:'العرض ثلاثي الأبعاد غير متاح، يُعرض منظر جانبي.',
 eNote:'E نفسه في جزء الهواء وجزء العازل (V نفسه وd نفسها). جزء العازل يحمل ببساطة <b>شحنة أكبر</b> على اللوحين.',
 hD:'قياساتك',pD:'غيّر شيئاً واحداً في كل مرة: d أو A أو العازل أو البطارية. سجّل في كل مرة.',th2:['#','🔌','A (cm²)','d (mm)','εᵣ eff','C (pF)','V (V)','Q (nC)','U (nJ)'],noRec:'لا توجد قياسات. اضغط 📌 سجّل في المختبر.',clear:'مسح',back:'↑ العودة إلى المختبر',
 hE:'اكتشف القاعدة',pE:'قارن قياسين تغيّرت فيهما d فقط.',eWait:'سجّل، ثم اقسم <b>d</b> على 2 (ولا شيء غيرها) وسجّل مجدداً.',
 eAsk1:'من جدولك: عندما نُصّفت d، ضُربت C في…',eBad:'اقسم قيمتي C من جدولك.',
 eAsk2:'إذن تتناسب السعة مع…',fn:['d','1 / d','d²','A × d'],fnBad:'المسافة الأصغر أعطت C أكبر. أي خيار يفعل ذلك؟',
 eGood:'🤯 <b>نعم!</b> C ∝ 1/d. وستُظهر مهامك أن C ∝ A وC ∝ εᵣ أيضاً. معاً: <b>C = ε₀ εᵣ A / d</b>.',
 hF:'لقد استحققت القوانين',pF:'اضغط على كل جزء من قانون السعة.',lockF:'🔒 اكتشف القاعدة أولاً في الخطوة هـ، أو',skip:'تخطَّ وأرني القانون',tap:'👆 اضغط على جزء.',glow:'✨ شاهده في المختبر',
 pieces:{C:'<b>السعة</b> بالفاراد (F): الشحنة المخزّنة لكل فولت، C = Q/V. المكثفات الحقيقية: من pF إلى mF.',e0:'<b>ε₀</b> = 8.85×10⁻¹² F/m، سماحية الفراغ.',er:'<b>εᵣ</b>: العازل يضاعف C. تستقطب جزيئاته وتلغي جزءاً من المجال، فتتسع شحنة أكبر عند V نفسه.',A:'<b>مساحة اللوح</b> (m²). مساحة أكبر = مكان أكبر للشحنة.',d:'<b>المسافة</b> (m). اللوحان الأقرب يجذبان شحنتيهما بقوة أكبر فتتسع شحنة أكبر.'},
 tableT:'موصولة أم مفصولة؟',tbl:['','🔌 البطارية موصولة','⛔ البطارية مفصولة','الثابت','V','Q','عندما تزداد C','Q تزداد وV نفسه','V يتناقص وQ نفسها','الطاقة U','U = ½CV² تزداد','U = Q²/2C تتناقص'],
 ideal:'<b>النموذج المثالي.</b> نفترض أن المجال منتظم وينعدم خارج اللوحين (دون تأثير الحواف). يكون دقيقاً عندما تكون d أصغر بكثير من حجم اللوح.',
 hG:'أثبت ذلك بالقياس',pG:'لا تكتمل المهام إلا من بياناتك المسجّلة.',
 missions:[['أثبت أن C ∝ A: d والعازل نفسهما، ضاعف المساحة.','سجّل، اضغط A × 2، سجّل.'],['أثبت أن C ∝ εᵣ: اللوحان نفسهما، أدخل عازلاً بالكامل.','سجّل بالهواء، أدخل العازل كاملاً، سجّل.'],['افصل البطارية ثم غيّر d: أظهر أن Q تبقى نفسها وV يتغيّر.','افصل، سجّل، غيّر d، سجّل.'],['اكتشف أن C ∝ 1/d (الخطوة هـ).','أجب عن سؤالي الخطوة هـ.'],['توقّع ثم تحقّق.','حلّ السؤال أدناه.']],
 mDone:n=>`✅ اكتملت المهمة ${n}!`,score:(n,tt)=>`${n} / ${tt} مهام مكتملة`,all:'🏆 <b>أنجزت كل المهام. أنت تتقن المكثفات.</b>',
 apQ:'A = 200 cm² وd = 2 mm وهواء وV = 10 V. أوجد Q بالنانوكولوم.',apOk:'✅ صحيح! اضبط هذه القيم في المختبر وتحقّق.',apNo:'ليس بعد. C = ε₀A/d ثم Q = CV. الوحدات: m² وm.',
 hH:'بطاقة الملخّص',five:'في 5 جمل',realT:'أين تقابله؟',
 real:[['📸 فلاش الكاميرا','يُشحن المكثف ببطء ثم يفرغ شحنته في ومضة خلال ميلي ثوانٍ.'],['📱 الشاشات اللمسية','إصبعك يغيّر سعة أقطاب صغيرة جداً، والهاتف يقيسها.'],['⌨️ لوحات المفاتيح','الضغط على مفتاح يغيّر مسافة d فتتغيّر السعة.'],['❤️ أجهزة إنعاش القلب','مكثف كبير يخزّن طاقة U = ½CV² لإعادة تشغيل القلب.']],
 pdf2:'📄 تصدير كتيّبي (PDF)',toNb:'📓 افتح دفتري',toTb:'📖 الدرس الكامل',rec:(n,c)=>`📌 #${n}: C = ${c} pF`,
 pLead:'أسئلة مع تلميحات متدرّجة وحلول كاملة. الأسئلة التي تخطئ فيها تذهب إلى دفترك.',extraQ:'سؤال من Physics Alive',progL:['مسار التعلّم','مهام المختبر','التمارين'],workedQ:'مثال: A = 100 cm² وd = 1 mm وهواء وV = 12 V.'}
};

const formulas=[
 {id:'cap',n:{en:'Parallel-plate capacitance',fr:'Capacité d’un condensateur plan',ar:'سعة المكثف ذي اللوحين المتوازيين'},t:"C=\\dfrac{\\varepsilon_0\\varepsilon_rA}{d}",d:{en:'Ideal model (no fringing). Unit: farad (F).',fr:'Modèle idéal (sans effet de bord). Unité : farad (F).',ar:'نموذج مثالي (دون تأثير الحواف). الوحدة: فاراد (F).'}},
 {id:'qcv',n:{en:'Definition of capacitance',fr:'Définition de la capacité',ar:'تعريف السعة'},t:"Q=CV",d:{en:'1 F = 1 C/V.',fr:'1 F = 1 C/V.',ar:'1 F = 1 C/V.'}},
 {id:'en',n:{en:'Stored energy',fr:'Énergie stockée',ar:'الطاقة المخزّنة'},t:"U=\\tfrac12CV^2=\\tfrac12QV=\\dfrac{Q^2}{2C}",d:{en:'',fr:'',ar:''}},
 {id:'ef',n:{en:'Field between the plates',fr:'Champ entre les plaques',ar:'المجال بين اللوحين'},t:"E=\\dfrac{V}{d}=\\dfrac{\\sigma}{\\varepsilon_0\\varepsilon_r}",d:{en:'σ = Q/A, surface charge density.',fr:'σ = Q/A, densité surfacique de charge.',ar:'σ = Q/A، الكثافة السطحية للشحنة.'}},
 {id:'ud',n:{en:'Energy density',fr:'Densité d’énergie',ar:'كثافة الطاقة'},t:"u=\\tfrac12\\varepsilon_0\\varepsilon_rE^2",d:{en:'Energy per m³ stored in the field.',fr:'Énergie par m³ stockée dans le champ.',ar:'الطاقة لكل m³ مخزّنة في المجال.'}}];
const summary={en:['A capacitor stores charge on two conductors: C = Q/V.','For parallel plates, C = ε₀εᵣA/d: bigger A, smaller d, or a dielectric all increase C.','Battery connected: V stays fixed, so Q changes with C.','Battery disconnected: Q stays fixed, so V changes with C.','Energy U = ½CV² is stored in the electric field between the plates.'],
 fr:['Un condensateur stocke de la charge sur deux conducteurs : C = Q/V.','Pour des plaques parallèles, C = ε₀εᵣA/d : A plus grand, d plus petit ou un diélectrique augmentent C.','Pile branchée : V reste fixe, donc Q change avec C.','Pile débranchée : Q reste fixe, donc V change avec C.','L’énergie U = ½CV² est stockée dans le champ entre les plaques.'],
 ar:['يخزّن المكثف الشحنة على موصلين: C = Q/V.','للوحين متوازيين C = ε₀εᵣA/d: زيادة A أو إنقاص d أو إدخال عازل يزيد C.','البطارية موصولة: V ثابت، فتتغيّر Q مع C.','البطارية مفصولة: Q ثابتة، فيتغيّر V مع C.','الطاقة U = ½CV² مخزّنة في المجال بين اللوحين.']};

const textbook={
en:`<div class="kicker">Chapter 11 · Capacitors · Physics 12</div><h1>The Parallel-Plate Capacitor</h1><p class="muted small">Explanation written for Physics Alive from the physics of the capacitor sections of Chapter 11. Section and page numbers to be checked against the textbook.</p>
<h2>1. What is a capacitor?</h2><p class="hl" id="t1">A <b>capacitor</b> is two conductors separated by an insulator. Connected to a battery, one conductor gains charge +Q and the other −Q. The charge is proportional to the potential difference V:</p>$$Q=CV$$
<div class="def"><b>Definition.</b> The <b>capacitance</b> C is the charge stored per volt: C = Q/V. Its unit is the <b>farad</b>: 1 F = 1 C V⁻¹. Practical values are µF, nF and pF.</div>
<h2>2. Capacitance of parallel plates</h2><p class="hl" id="t2">Two plates of area A, a distance d apart, carry charge density σ = Q/A. By Gauss's law, the field between them is uniform:</p>$$E=\\frac{\\sigma}{\\varepsilon_0}=\\frac{Q}{\\varepsilon_0A}$$
<p class="hl" id="t3">The potential difference is V = Ed = Qd/(ε₀A). Dividing:</p>$$C=\\frac{Q}{V}=\\frac{\\varepsilon_0A}{d}$$
<div class="note">This assumes the field is uniform and zero outside the plates (no "fringing" at the edges). It is accurate when d is much smaller than the plate size.</div>
<h2>3. Dielectrics</h2><p class="hl" id="t4">Filling the gap with an insulator (a <b>dielectric</b>) multiplies the capacitance by its relative permittivity εᵣ. The molecules <b>polarise</b>: their charges shift slightly, producing a field opposite to the plates' field. The net field is smaller for the same charge, so more charge fits at the same V.</p>$$C=\\frac{\\varepsilon_0\\varepsilon_rA}{d}$$
<h2>4. Battery connected or disconnected?</h2><p class="hl" id="t5">If the battery stays <b>connected</b>, V is fixed by the battery: changing C changes Q. If the capacitor is charged then <b>disconnected</b>, Q has nowhere to go and stays fixed: changing C changes V = Q/C. Mixing up these two cases is the most common mistake.</p>
<h2>5. Energy stored</h2><p class="hl" id="t6">Charging needs work, because each new charge is pushed against the charges already there. The average voltage during charging is V/2, so</p>$$U=\\tfrac12QV=\\tfrac12CV^2=\\frac{Q^2}{2C}$$
<p class="hl" id="t7">The energy is stored in the electric field. Per unit volume:</p>$$u=\\tfrac12\\varepsilon_0\\varepsilon_rE^2$$
<h2>6. Worked examples</h2><p><b>Example 1.</b> A = 100 cm², d = 1 mm, air, V = 12 V.</p>$$C=\\frac{8.85\\times10^{-12}\\times0.01}{0.001}=88.5\\ \\mathrm{pF},\\quad Q=CV=1.06\\ \\mathrm{nC},\\quad U=\\tfrac12CV^2=6.4\\ \\mathrm{nJ}$$
<p><b>Example 2.</b> The same capacitor is disconnected, then the gap is doubled. Q stays 1.06 nC, C halves to 44.3 pF, so V doubles to 24 V and U doubles to 12.7 nJ (the extra energy comes from the work you do pulling the plates apart).</p>
<h2>7. Key formulas</h2>`,
fr:`<div class="kicker">Chapitre 11 · Condensateurs · Physique 12</div><h1>Le condensateur plan</h1><p class="muted small">Explication rédigée pour Physics Alive à partir de la physique des sections sur les condensateurs du chapitre 11. Numéros de section et de page à vérifier dans le manuel.</p>
<h2>1. Qu’est-ce qu’un condensateur ?</h2><p class="hl" id="t1">Un <b>condensateur</b> est formé de deux conducteurs séparés par un isolant. Relié à une pile, l’un prend la charge +Q, l’autre −Q. La charge est proportionnelle à la tension V :</p>$$Q=CV$$
<div class="def"><b>Définition.</b> La <b>capacité</b> C est la charge stockée par volt : C = Q/V. Son unité est le <b>farad</b> : 1 F = 1 C V⁻¹. En pratique : µF, nF, pF.</div>
<h2>2. Capacité de plaques parallèles</h2><p class="hl" id="t2">Deux plaques d’aire A, distantes de d, portent la densité σ = Q/A. D’après le théorème de Gauss, le champ entre elles est uniforme :</p>$$E=\\frac{\\sigma}{\\varepsilon_0}=\\frac{Q}{\\varepsilon_0A}$$
<p class="hl" id="t3">La tension est V = Ed = Qd/(ε₀A). En divisant :</p>$$C=\\frac{Q}{V}=\\frac{\\varepsilon_0A}{d}$$
<div class="note">On suppose le champ uniforme et nul hors des plaques (pas d’effet de bord). C’est précis quand d est bien plus petit que la taille des plaques.</div>
<h2>3. Diélectriques</h2><p class="hl" id="t4">Remplir l’espace d’un isolant (<b>diélectrique</b>) multiplie la capacité par sa permittivité relative εᵣ. Les molécules se <b>polarisent</b> : leurs charges se décalent légèrement et créent un champ opposé. Le champ net est plus faible pour la même charge : plus de charge à V égal.</p>$$C=\\frac{\\varepsilon_0\\varepsilon_rA}{d}$$
<h2>4. Pile branchée ou débranchée ?</h2><p class="hl" id="t5">Si la pile reste <b>branchée</b>, V est imposée : changer C change Q. Si le condensateur est chargé puis <b>débranché</b>, Q ne peut pas s’échapper et reste fixe : changer C change V = Q/C. Confondre ces deux cas est l’erreur la plus fréquente.</p>
<h2>5. Énergie stockée</h2><p class="hl" id="t6">Charger demande un travail, car chaque nouvelle charge est poussée contre celles déjà présentes. La tension moyenne pendant la charge vaut V/2, donc</p>$$U=\\tfrac12QV=\\tfrac12CV^2=\\frac{Q^2}{2C}$$
<p class="hl" id="t7">L’énergie est stockée dans le champ électrique. Par unité de volume :</p>$$u=\\tfrac12\\varepsilon_0\\varepsilon_rE^2$$
<h2>6. Exemples résolus</h2><p><b>Exemple 1.</b> A = 100 cm², d = 1 mm, air, V = 12 V.</p>$$C=\\frac{8{,}85\\times10^{-12}\\times0{,}01}{0{,}001}=88{,}5\\ \\mathrm{pF},\\quad Q=1{,}06\\ \\mathrm{nC},\\quad U=6{,}4\\ \\mathrm{nJ}$$
<p><b>Exemple 2.</b> Le même condensateur est débranché, puis l’écart est doublé. Q reste 1,06 nC, C est divisé par deux (44,3 pF), donc V double (24 V) et U double (12,7 nJ) : l’énergie en plus vient du travail fourni pour écarter les plaques.</p>
<h2>7. Formules clés</h2>`,
ar:`<div class="kicker">الفصل 11 · المكثفات · فيزياء 12</div><h1>المكثف ذو اللوحين المتوازيين</h1><p class="muted small">شرح مكتوب لـ Physics Alive اعتماداً على فيزياء أقسام المكثفات في الفصل 11. أرقام الأقسام والصفحات تحتاج إلى مراجعة في الكتاب.</p>
<h2>1. ما المكثف؟</h2><p class="hl" id="t1"><b>المكثف</b> موصلان يفصل بينهما عازل. عند وصله ببطارية يكتسب أحد الموصلين شحنة +Q والآخر −Q، وتتناسب الشحنة مع فرق الجهد V:</p>$$Q=CV$$
<div class="def"><b>تعريف.</b> <b>السعة</b> C هي الشحنة المخزّنة لكل فولت: C = Q/V، ووحدتها <b>الفاراد</b>: 1 F = 1 C V⁻¹. القيم العملية: µF وnF وpF.</div>
<h2>2. سعة اللوحين المتوازيين</h2><p class="hl" id="t2">لوحان مساحة كل منهما A والمسافة بينهما d يحملان كثافة σ = Q/A. وفق قانون غاوس يكون المجال بينهما منتظماً:</p>$$E=\\frac{\\sigma}{\\varepsilon_0}=\\frac{Q}{\\varepsilon_0A}$$
<p class="hl" id="t3">فرق الجهد V = Ed = Qd/(ε₀A). وبالقسمة:</p>$$C=\\frac{Q}{V}=\\frac{\\varepsilon_0A}{d}$$
<div class="note">نفترض أن المجال منتظم وينعدم خارج اللوحين (دون تأثير الحواف). يكون ذلك دقيقاً عندما تكون d أصغر بكثير من حجم اللوح.</div>
<h2>3. العوازل</h2><p class="hl" id="t4">ملء الفراغ بمادة عازلة (<b>عازل كهربائي</b>) يضاعف السعة بمقدار السماحية النسبية εᵣ. <b>تستقطب</b> الجزيئات: تنزاح شحناتها قليلاً فتُنتج مجالاً معاكساً لمجال اللوحين، فيقل المجال الصافي للشحنة نفسها وتتسع شحنة أكبر عند V نفسه.</p>$$C=\\frac{\\varepsilon_0\\varepsilon_rA}{d}$$
<h2>4. البطارية موصولة أم مفصولة؟</h2><p class="hl" id="t5">إذا بقيت البطارية <b>موصولة</b> فإن V تفرضه البطارية، وتغيير C يغيّر Q. وإذا شُحن المكثف ثم <b>فُصل</b> فلا مخرج لـ Q فتبقى ثابتة، وتغيير C يغيّر V = Q/C. الخلط بين الحالتين أكثر الأخطاء شيوعاً.</p>
<h2>5. الطاقة المخزّنة</h2><p class="hl" id="t6">يحتاج الشحن إلى شغل، لأن كل شحنة جديدة تُدفع ضد الشحنات الموجودة. متوسط الجهد أثناء الشحن V/2، إذن</p>$$U=\\tfrac12QV=\\tfrac12CV^2=\\frac{Q^2}{2C}$$
<p class="hl" id="t7">تُخزّن الطاقة في المجال الكهربائي، ولكل وحدة حجم:</p>$$u=\\tfrac12\\varepsilon_0\\varepsilon_rE^2$$
<h2>6. أمثلة محلولة</h2><p><b>مثال 1.</b> A = 100 cm² وd = 1 mm وهواء وV = 12 V.</p>$$C=\\frac{8.85\\times10^{-12}\\times0.01}{0.001}=88.5\\ \\mathrm{pF},\\quad Q=1.06\\ \\mathrm{nC},\\quad U=6.4\\ \\mathrm{nJ}$$
<p><b>مثال 2.</b> فُصل المكثف نفسه ثم ضوعفت المسافة. تبقى Q = 1.06 nC، وتنتصف C إلى 44.3 pF، فيتضاعف V إلى 24 V وتتضاعف U إلى 12.7 nJ (الطاقة الإضافية من الشغل الذي تبذله لإبعاد اللوحين).</p>
<h2>7. القوانين الأساسية</h2>`};

const P=(en,fr,ar)=>({en,fr,ar}),same=a=>({en:a,fr:a,ar:a});
const base={Acm2:100,dmm:1,er:1,f:0,connected:true,V0:12,Qfix:0};
const practice=[
 {id:'c1',type:'num',extra:1,unit:'pF',target:solve(base).C*1e12,tol:.02,lab:{Acm2:100,dmm:1,mat:'air',f:0,connected:true,V0:12},
  q:P('A = 100 cm², d = 1 mm, air. Find C in pF.','A = 100 cm², d = 1 mm, air. Calcule C en pF.','A = 100 cm² وd = 1 mm وهواء. احسب C بالبيكوفاراد.'),
  hints:P(['Convert: 100 cm² = 0.01 m², 1 mm = 0.001 m.','C = ε₀A/d'],['Convertis : 100 cm² = 0,01 m², 1 mm = 0,001 m.','C = ε₀A/d'],['حوّل: 100 cm² = 0.01 m² و1 mm = 0.001 m.','C = ε₀A/d']),
  steps:same(['\\(C=\\dfrac{8.85\\times10^{-12}\\times0.01}{0.001}=8.85\\times10^{-11}\\ \\mathrm{F}=88.5\\ \\mathrm{pF}\\)']),mistake:P('Using A in cm² gives 10 000× too much.','Garder A en cm² donne 10 000 fois trop.','إبقاء A بوحدة cm² يعطي قيمة أكبر بـ 10000 مرة.')},
 {id:'c2',type:'mcq',extra:1,q:P('Battery <b>connected</b>. A dielectric with εᵣ = 4 fills the gap. The charge Q:','Pile <b>branchée</b>. Un diélectrique εᵣ = 4 remplit l’écart. La charge Q :','البطارية <b>موصولة</b>. عازل εᵣ = 4 يملأ الفراغ. الشحنة Q:'),
  opts:P(['stays the same','becomes Q/4','becomes 4Q','becomes 2Q'],['reste identique','devient Q/4','devient 4Q','devient 2Q'],['تبقى نفسها','تصبح Q/4','تصبح 4Q','تصبح 2Q']),ans:2,
  hints:P(['Connected → V fixed.','C becomes 4C, and Q = CV.'],['Branchée → V fixe.','C devient 4C, et Q = CV.'],['موصولة ← V ثابت.','C تصبح 4C وQ = CV.']),steps:same(['\\(Q\'=(4C)V=4Q\\)'])},
 {id:'c3',type:'mcq',extra:1,q:P('Charged, then <b>disconnected</b>. The gap d is doubled. Which is true?','Chargé puis <b>débranché</b>. L’écart d est doublé. Que se passe-t-il ?','شُحن ثم <b>فُصل</b>. ضوعفت المسافة d. ما الصحيح؟'),
  opts:P(['V doubles, E stays the same','V stays, E halves','Q halves','V halves'],['V double, E reste identique','V reste, E est divisé par deux','Q est divisée par deux','V est divisée par deux'],['V يتضاعف وE يبقى نفسه','V يبقى وE ينتصف','Q تنتصف','V ينتصف']),ans:0,
  hints:P(['Disconnected → Q fixed.','C halves, so V = Q/C doubles. E = V/d?'],['Débranché → Q fixe.','C est divisé par deux, donc V = Q/C double. E = V/d ?'],['مفصولة ← Q ثابتة.','C تنتصف فيتضاعف V = Q/C. وE = V/d؟']),
  steps:same(['\\(C\'=C/2,\\ V\'=Q/C\'=2V\\)','\\(E\'=V\'/(2d)=V/d=E\\)  (E = σ/ε₀ depends only on Q/A)']),mistake:P('Thinking V stays fixed: that is only true with the battery connected.','Croire que V reste fixe : ce n’est vrai que pile branchée.','الظن بأن V يبقى ثابتاً: هذا صحيح فقط والبطارية موصولة.')},
 {id:'c4',type:'num',extra:1,unit:'mJ',target:.5*10e-6*144*1e3,tol:.02,
  q:P('C = 10 µF charged to 12 V. Find the stored energy in mJ.','C = 10 µF chargé sous 12 V. Calcule l’énergie stockée en mJ.','C = 10 µF مشحون إلى 12 V. احسب الطاقة المخزّنة بالميلي جول.'),
  hints:P(['U = ½CV²'],['U = ½CV²'],['U = ½CV²']),steps:same(['\\(U=\\tfrac12(10\\times10^{-6})(12)^2=7.2\\times10^{-4}\\ \\mathrm{J}=0.72\\ \\mathrm{mJ}\\)'])},
 {id:'c5',type:'mcq',extra:1,q:P('Charged and <b>disconnected</b>. A dielectric εᵣ is inserted. The energy U:','Chargé et <b>débranché</b>. On insère un diélectrique εᵣ. L’énergie U :','مشحون و<b>مفصول</b>. أُدخل عازل εᵣ. الطاقة U:'),
  opts:P(['becomes εᵣU','stays U','becomes U/εᵣ','becomes 0'],['devient εᵣU','reste U','devient U/εᵣ','devient 0'],['تصبح εᵣU','تبقى U','تصبح U/εᵣ','تصبح 0']),ans:2,
  hints:P(['Q fixed: use U = Q²/2C.'],['Q fixe : utilise U = Q²/2C.'],['Q ثابتة: استخدم U = Q²/2C.']),steps:same(['\\(U\'=\\dfrac{Q^2}{2\\varepsilon_rC}=\\dfrac{U}{\\varepsilon_r}\\)'])},
 {id:'c6',type:'num',extra:1,unit:'nC',target:solve({Acm2:50,dmm:.5,er:6,f:1,connected:true,V0:9,Qfix:0}).Q*1e9,tol:.02,lab:{Acm2:50,dmm:.5,mat:'mica',f:1,connected:true,V0:9},
  q:P('A = 50 cm², d = 0.5 mm, mica (εᵣ = 6) fills the gap, V = 9 V. Find Q in nC.','A = 50 cm², d = 0,5 mm, mica (εᵣ = 6) remplit l’écart, V = 9 V. Calcule Q en nC.','A = 50 cm² وd = 0.5 mm، ميكا (εᵣ = 6) تملأ الفراغ، V = 9 V. احسب Q بالنانوكولوم.'),
  hints:P(['C = ε₀εᵣA/d with A = 0.005 m², d = 0.0005 m.','Then Q = CV.'],['C = ε₀εᵣA/d avec A = 0,005 m², d = 0,0005 m.','Puis Q = CV.'],['C = ε₀εᵣA/d حيث A = 0.005 m² وd = 0.0005 m.','ثم Q = CV.']),
  steps:same(['\\(C=\\dfrac{8.85\\times10^{-12}\\times6\\times0.005}{0.0005}=531\\ \\mathrm{pF}\\)','\\(Q=531\\times10^{-12}\\times9\\approx4.78\\ \\mathrm{nC}\\)'])}];

/* ================= MARKUP ================= */
const STEPS=['sA','sB','sC','sD','sE','sF','sG','sH'];
const html=`<div class="wrap"><nav class="path" id="path"></nav></div>
<section class="step hero" id="sA"><div class="wrap"><div class="kicker" data-t="k0"></div><h1 data-t="h0"></h1><div class="ethos" id="ethos"></div>
 <p class="lead hl" id="lA" data-t="p0"></p><canvas id="plates2d" style="height:320px;background:linear-gradient(180deg,#0c1433,#0a1028)"></canvas><p class="hint" data-t="hint0"></p></div></section>
<section class="step" id="sB"><div class="wrap"><div class="kicker" data-t="kB"></div><h2 data-t="hB"></h2><div class="card"><p class="hl" id="lB" data-t="pB"></p><div class="choices" id="choices"></div><div class="feedback" id="predictFb"></div></div></div></section>
<section class="step" id="sC"><div class="wrap"><div class="kicker" data-t="kC"></div><h2 data-t="hC"></h2><p class="lead hl" id="lC" data-t="pC"></p>
 <div class="guide" id="labGuide" style="display:none;margin-bottom:12px"></div>
 <div class="labwrap" id="labwrap"><div class="stage" style="position:relative">
   <div id="v3" style="height:460px;border-radius:16px;overflow:hidden;border:1px solid #22305c;background:radial-gradient(ellipse at 50% 40%,#131c48,#05081a);touch-action:none;position:relative;display:grid;place-items:center;color:#9aa6d4"><span id="ld3">◌ 3D…</span></div>
   <div id="lbls" style="position:absolute;inset:0;pointer-events:none;overflow:hidden;border-radius:16px"></div>
   <button class="ib fsbtn" id="fsBtn" aria-label="Full screen"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/></svg></button>
   <div class="toggles"><button class="btn sm" id="batBtn"></button><button class="ib" id="half" data-t="half"></button><button class="ib" id="dblA" data-t="dblA"></button><button class="ib on" id="tLines" data-t="tLines"></button><button class="ib on" id="tCharges" data-t="tCharges"></button><button class="ib" id="tView" data-t="view"></button><button class="btn" id="recordBtn" style="margin-inline-start:auto" data-t="record"></button></div>
   <div class="small muted" style="margin-top:6px" data-t="gapNote"></div><div class="note small" data-t="eNote"></div></div>
  <div class="card"><div class="readout" id="meters"></div><div class="small muted" data-t="vsLast" id="vsl"></div>
   <div class="ctrl"><label><span data-t="Aw"></span> <b id="Av"></b></label><input type="range" id="A" min="50" max="400" step="10" value="100"></div>
   <div class="ctrl"><label><span data-t="dw"></span> <b id="dv"></b></label><input type="range" id="d" min="0.5" max="10" step="0.1" value="4"></div>
   <div class="ctrl"><label><span data-t="Vw"></span> <b id="Vv"></b></label><input type="range" id="V0" min="1" max="24" step="1" value="12"></div>
   <div class="ctrl"><label data-t="mat"></label><select class="f" id="mat"></select></div>
   <div class="ctrl"><label><span data-t="f"></span> <b id="fv"></b></label><input type="range" id="f" min="0" max="1" step="0.05" value="0"></div>
   <div class="live" id="live"></div><div class="small muted" id="fallbackMsg" style="display:none;margin-top:8px"></div></div></div></div></section>
<section class="step" id="sD"><div class="wrap"><div class="kicker" data-t="kD"></div><h2 data-t="hD"></h2><p class="lead hl" id="lD" data-t="pD"></p>
 <div class="card"><div class="tscroll" id="recTable"></div><div class="row"><button class="btn ghost sm" id="clearRec" data-t="clear"></button><button class="btn ghost sm" data-go="sC" data-t="back"></button></div></div></div></section>
<section class="step" id="sE"><div class="wrap"><div class="kicker" data-t="kE"></div><h2 data-t="hE"></h2><p class="lead" data-t="pE"></p><div class="card" id="discover"></div></div></section>
<section class="step" id="sF"><div class="wrap"><div class="kicker" data-t="kF"></div><h2 data-t="hF"></h2>
 <div class="card locked" id="fcard"><div class="lockmsg"><span data-t="lockF"></span> <button class="link" id="skipF" data-t="skip"></button></div>
  <div class="unlockable"><p class="hl" id="lF" data-t="pF"></p><div id="bigFormula"></div><div class="soft" id="pieceInfo"></div>
   <h3 style="margin-top:18px" data-t="tableT"></h3><div class="tscroll" id="cdTable"></div><div class="note hl" id="lF2" data-t="ideal"></div></div></div></div></section>
<section class="step" id="sG"><div class="wrap"><div class="kicker" data-t="kG"></div><h2 data-t="hG"></h2><p class="lead" data-t="pG"></p><div id="chals"></div><div class="feedback" id="chalScore"></div>
 <div class="card" style="margin-top:12px"><p class="hl" id="lG" data-t="apQ"></p><div class="ans"><input class="f" id="apIn" inputmode="decimal" placeholder="nC"><button class="btn sm" id="apBtn"></button></div><div class="res" id="apRes"></div></div></div></section>
<section class="step" id="sH"><div class="wrap"><div class="kicker" data-t="kH"></div><h2 data-t="hH"></h2><div class="fgrid" id="sumF"></div>
 <div class="card" style="margin-top:14px"><h3 data-t="five"></h3><ul id="sumList"></ul><p class="hl" id="lH" data-t="workedQ"></p><div class="live" id="worked"></div></div>
 <h3 style="margin-top:22px" data-t="realT"></h3><div class="real" id="real"></div>
 <div class="row"><button class="btn" id="pdfB" data-t="pdf2"></button><button class="btn ghost" data-mode="notebook" data-t="toNb"></button><button class="btn ghost" data-mode="textbook" data-t="toTb"></button></div></div></section>`;

/* ================= STATE ================= */
const S={Acm2:100,dmm:4,mat:'air',f:0,connected:true,V0:12,Qfix:0,lines:true,charges:true,on:true,guideStart:null,flash:null,flashT:0,flowT:0,flowDir:1,lastQ:null};
const er=()=>MEDIA.find(m=>m.k===S.mat).er;
const R=()=>solve({...S,er:er()});
const st=()=>PA.store;

/* ================= A: 2D PLATES (battery connected) ================= */
function plates2d(){const c=$('#plates2d');let W,H,ctx,gap=.5,drag=false,vis=true;
 function init(){const f=PA.fit(c);W=f.w;H=f.h;ctx=f.x}
 const yTop=()=>H*.5-gap*H*.35;c.addEventListener('pointerdown',e=>{const r=c.getBoundingClientRect();if(Math.abs(e.clientY-r.top-yTop())<30){drag=true;c.setPointerCapture(e.pointerId)}});
 c.addEventListener('pointermove',e=>{if(!drag)return;const r=c.getBoundingClientRect();gap=Math.max(.08,Math.min(1,(H*.5-(e.clientY-r.top))/(H*.35)))});c.addEventListener('pointerup',()=>drag=false);PA.visible(c,v=>vis=v);
 function step(tm){requestAnimationFrame(step);if(!W||!vis||PA.mode!=='learn')return;ctx.clearRect(0,0,W,H);ctx.direction='ltr';
  const x0=W*.25,x1=W*.75,yb=H*.5+12,yt=yTop(),n=Math.round(Math.min(60,4/gap));
  ctx.fillStyle='#8a0f2a';ctx.fillRect(x0,yt-8,x1-x0,8);ctx.fillStyle='#0b3d78';ctx.fillRect(x0,yb,x1-x0,8);
  for(let i=0;i<n;i++){const x=x0+(i+.5)*(x1-x0)/n;ctx.fillStyle='#ff5470';ctx.fillText('+',x-3,yt-12);ctx.fillStyle='#3fa9ff';ctx.fillText('−',x-3,yb+22);
   ctx.strokeStyle='rgba(255,209,102,.35)';ctx.beginPath();ctx.moveTo(x,yt);ctx.lineTo(x,yb);ctx.stroke()}
  ctx.strokeStyle='#cfd6ff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0,yt-4);ctx.lineTo(W*.12,yt-4);ctx.lineTo(W*.12,H*.42);ctx.moveTo(W*.12,H*.58);ctx.lineTo(W*.12,yb+4);ctx.lineTo(x0,yb+4);ctx.stroke();ctx.lineWidth=1;
  ctx.fillStyle='#ffd166';ctx.fillRect(W*.12-14,H*.42,28,6);ctx.fillRect(W*.12-8,H*.52,16,6);ctx.font='12px sans-serif';ctx.fillText('12 V',W*.12+18,H*.5);
  ctx.fillStyle='#e8ecff';ctx.font='600 15px sans-serif';ctx.textAlign='left';ctx.fillText(`${n} ${t('stored')}`,14,24);ctx.fillStyle='#9aa6d4';ctx.font='13px sans-serif';ctx.fillText(`${t('gapL')}: ${Math.round(gap*100)}%`,14,44)}
 new ResizeObserver(init).observe(c);requestAnimationFrame(step)}

/* ================= C: 3D LAB ================= */
let G=null;
const geom=()=>({s:Math.sqrt(S.Acm2)/10,g:.12+S.dmm*.09});
async function init3D(){const host=$('#v3');let THREE;
 try{const tc=document.createElement('canvas');if(!(tc.getContext('webgl2')||tc.getContext('webgl')))throw 0;THREE=await import(new URL('vendor/three.module.min.js',document.baseURI).href)}catch(e){return fallback2D()}
 const renderer=new THREE.WebGLRenderer({antialias:!PA.lowEnd,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,PA.lowEnd?1.25:2));
 const ld=$('#ld3');if(ld)ld.remove();host.style.display='block';host.appendChild(renderer.domElement);renderer.domElement.style.cssText='width:100%;height:100%;display:block';
 const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(42,1,.1,100);scene.add(new THREE.AmbientLight(0xffffff,.6));const dl=new THREE.DirectionalLight(0xffffff,1);dl.position.set(3,6,4);scene.add(dl);
 const metal=c=>new THREE.MeshPhongMaterial({color:c,shininess:80,specular:0x666666});
 const top=new THREE.Mesh(new THREE.BoxGeometry(1,.04,1),metal(0xb84a5c)),bot=new THREE.Mesh(new THREE.BoxGeometry(1,.04,1),metal(0x3d6fa8));scene.add(top,bot);
 const diel=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshPhongMaterial({color:0xffb347,transparent:true,opacity:.42,depthWrite:false}));scene.add(diel);
 const lineMat=new THREE.LineBasicMaterial({color:0xffd166,transparent:true,opacity:.75});const lines=new THREE.LineSegments(new THREE.BufferGeometry(),lineMat);scene.add(lines);
 const dotGeo=new THREE.SphereGeometry(.018,6,4);const MAXD=PA.lowEnd?240:420;
 const plus=new THREE.InstancedMesh(dotGeo,new THREE.MeshBasicMaterial({color:0xff5470}),MAXD),minus=new THREE.InstancedMesh(dotGeo,new THREE.MeshBasicMaterial({color:0x3fa9ff}),MAXD);scene.add(plus,minus);
 // battery + wires + switch
 const bat=new THREE.Group();scene.add(bat);const cyl=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,.55,24),metal(0x2a2f44));bat.add(cyl);
 const cap=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,.06,16),metal(0xffd166));cap.position.y=.3;bat.add(cap);const band=new THREE.Mesh(new THREE.CylinderGeometry(.132,.132,.12,24),new THREE.MeshPhongMaterial({color:0xffd166}));band.position.y=.18;bat.add(band);
 const wireMat=new THREE.LineBasicMaterial({color:0xcfd6ff});const wires=new THREE.LineSegments(new THREE.BufferGeometry(),wireMat);scene.add(wires);
 const sw=new THREE.Mesh(new THREE.BoxGeometry(.32,.025,.025),new THREE.MeshPhongMaterial({color:0xffd166}));scene.add(sw);
 const flow=new THREE.InstancedMesh(new THREE.SphereGeometry(.025,8,6),new THREE.MeshBasicMaterial({color:0xfff1b8}),24);scene.add(flow);
 const O={az:-.55,el:.38,dist:5.2},DEFV={...O};const placeCam=()=>{cam.position.set(O.dist*Math.cos(O.el)*Math.sin(O.az),O.dist*Math.sin(O.el),O.dist*Math.cos(O.el)*Math.cos(O.az));cam.lookAt(-.3,0,0)};
 const pts=new Map();let start=null,pinch0=0;const el=renderer.domElement;
 el.addEventListener('pointerdown',e=>{el.setPointerCapture(e.pointerId);pts.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pts.size===2){const[a,b]=[...pts.values()];pinch0=Math.hypot(a.x-b.x,a.y-b.y);start=null;return}start={x:e.clientX,y:e.clientY,az:O.az,el:O.el}});
 el.addEventListener('pointermove',e=>{if(!pts.has(e.pointerId))return;pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pts.size===2){const[a,b]=[...pts.values()];const d=Math.hypot(a.x-b.x,a.y-b.y);O.dist=Math.max(2.5,Math.min(11,O.dist*pinch0/d));pinch0=d;G.dirty=true;return}
  if(!start)return;O.az=start.az-(e.clientX-start.x)*.008;O.el=Math.max(-1.1,Math.min(1.4,start.el+(e.clientY-start.y)*.006));G.dirty=true});
 const up=e=>{pts.delete(e.pointerId);if(!pts.size)start=null};el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);
 el.addEventListener('wheel',e=>{e.preventDefault();O.dist=Math.max(2.5,Math.min(11,O.dist*(1+Math.sign(e.deltaY)*.08)));G.dirty=true},{passive:false});
 const lab={};['Q','V','d'].forEach(k=>{const d=document.createElement('div');d.style.cssText='position:absolute;font:700 12px sans-serif;padding:1px 6px;border-radius:6px;background:#070b1acc;color:#e8ecff;transform:translate(-50%,-50%);white-space:nowrap;direction:ltr';$('#lbls').appendChild(d);lab[k]=d});
 G={THREE,renderer,scene,cam,top,bot,diel,lines,plus,minus,bat,wires,sw,flow,O,DEFV,placeCam,host,lab,dirty:true};
 new ResizeObserver(()=>{const r=host.getBoundingClientRect();if(r.width<10)return;renderer.setSize(r.width,r.height,false);cam.aspect=r.width/r.height;cam.updateProjectionMatrix();G.dirty=true}).observe(host);
 rebuild();loop3D()}
let seed=1;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
function rebuild(){readouts();if(G&&G.fallback){paint2D();return}if(!G||!G.THREE)return;const{THREE}=G;const{s,g}=geom(),r=R();
 G.top.scale.set(s,1,s);G.top.position.y=g/2+.02;G.bot.scale.set(s,1,s);G.bot.position.y=-g/2-.02;
 const fw=s*S.f;G.diel.visible=S.f>0&&S.mat!=='air';G.diel.scale.set(Math.max(fw,.001),g*.96,s*1.001);G.diel.position.set(s/2-fw/2,0,0);G.diel.material.color.set(['#ffb347','#e8d9b0','#9fd3ff','#d8c6ff','#ffd0a0'][MEDIA.findIndex(m=>m.k===S.mat)]);
 // field lines: density ∝ E (sqrt scale for visibility), uniform in both parts
 const n=Math.max(1,Math.min(10,Math.round(Math.sqrt(r.E)/12))),pos=[];if(S.lines){for(let i=0;i<n;i++)for(let k=0;k<n;k++){const x=-s/2+(i+.5)*s/n,z=-s/2+(k+.5)*s/n;pos.push(x,g/2,z,x,-g/2,z)}}
 G.lines.geometry.dispose();G.lines.geometry=new THREE.BufferGeometry();G.lines.geometry.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
 // charges: count ∝ sqrt(Q), split between air part and dielectric part by σ ratio (σ ∝ εr in the dielectric part)
 const Nt=Math.min(G.plus.instanceMatrix.count,Math.round(36*Math.sqrt(r.Q*1e9)));const wDiel=S.mat==='air'?0:S.f*er(),wAir=1-S.f+(S.mat==='air'?S.f:0),nD=Math.round(Nt*wDiel/(wDiel+wAir||1));
 const m=new THREE.Matrix4();seed=7;const place=(mesh,y)=>{let c=0;for(let i=0;i<Nt;i++){const inD=i<nD;const x=inD?s/2-rnd()*fw:-s/2+rnd()*(s-(S.mat==='air'?0:fw));const z=-s/2+rnd()*s;m.makeTranslation(x,y,z);mesh.setMatrixAt(c++,m)}mesh.count=S.charges?c:0;mesh.instanceMatrix.needsUpdate=true};
 place(G.plus,g/2+.06);place(G.minus,-g/2-.06);
 // battery at the left; wires to plates; switch on the top wire
 const bx=-s/2-.85;G.bat.position.set(bx,0,0);const wp=[bx,.33,0,bx,g/2+.35,0, bx,g/2+.35,0,bx+.25,g/2+.35,0, bx+.57,g/2+.35,0,-s/2-.02,g/2+.35,0, -s/2-.02,g/2+.35,0,-s/2-.02,g/2+.04,0, bx,-.28,0,bx,-g/2-.35,0, bx,-g/2-.35,0,-s/2-.02,-g/2-.35,0, -s/2-.02,-g/2-.35,0,-s/2-.02,-g/2-.04,0];
 G.wires.geometry.dispose();G.wires.geometry=new THREE.BufferGeometry();G.wires.geometry.setAttribute('position',new THREE.Float32BufferAttribute(wp,3));
 G.sw.position.set(bx+.25+.16*Math.cos(S.connected?0:.6),g/2+.35+.16*Math.sin(S.connected?0:.6),0);G.sw.rotation.z=S.connected?0:.6;G.sw.material.color.set(S.connected?0xffd166:0xff5470);
 G.wirePath=[[bx,.33],[bx,g/2+.35],[-s/2-.02,g/2+.35],[-s/2-.02,g/2+.04]];G.dirty=true}
function loop3D(){requestAnimationFrame(loop3D);if(!G||!G.THREE||!S.on||PA.mode!=='learn')return;const tm=performance.now();const flowing=tm-S.flowT<1400&&S.connected,fl=S.flash&&tm-S.flashT<1800;if(!G.dirty&&!flowing&&!fl)return;
 const{THREE}=G;const m=new THREE.Matrix4();let c=0;if(flowing&&!PA.reduced){const P=G.wirePath;const segs=[];let L=0;for(let i=1;i<P.length;i++){const l=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);segs.push(l);L+=l}
  for(let k=0;k<12;k++){let u=((k/12)+(tm/900)*S.flowDir)%1;if(u<0)u+=1;let dd=u*L,i=0;while(i<segs.length-1&&dd>segs[i]){dd-=segs[i];i++}const a=P[i],b=P[i+1],q=dd/segs[i];m.makeTranslation(a[0]+(b[0]-a[0])*q,a[1]+(b[1]-a[1])*q,0);G.flow.setMatrixAt(c++,m)}}
 G.flow.count=c;G.flow.instanceMatrix.needsUpdate=true;
 const f=k=>S.flash===k&&fl?(.5+.5*Math.sin((tm-S.flashT)/90)):0;G.top.material.emissive.setRGB(f('A')*.5,f('A')*.3,0);G.diel.material.opacity=.42+f('er')*.4;G.lines.material.opacity=.75;
 G.top.position.y=geom().g/2+.02+f('d')*.06;
 G.placeCam();G.renderer.render(G.scene,G.cam);G.dirty=false;
 const{s,g}=geom(),r=R(),rect=G.host.getBoundingClientRect(),pr=(v,d,txt)=>{const p=new THREE.Vector3(...v).project(G.cam);d.style.left=(p.x+1)/2*rect.width+'px';d.style.top=(1-p.y)/2*rect.height+'px';d.textContent=txt};
 pr([0,g/2+.28,-s/2],G.lab.Q,'+Q = '+PA.num((r.Q*1e9).toPrecision(3))+' nC');pr([-s/2-.85,-.5,0],G.lab.V,'V = '+PA.num(r.V.toPrecision(3))+' V');pr([s/2+.25,0,s/2],G.lab.d,'d = '+PA.num(S.dmm)+' mm')}
function fallback2D(){G={fallback:true};const host=$('#v3');host.innerHTML='<canvas id="fb2d" style="width:100%;height:100%;border:0"></canvas>';host.style.display='block';$('#fallbackMsg').style.display='block';$('#fallbackMsg').textContent=t('webgl');new ResizeObserver(paint2D).observe(host);paint2D()}
function paint2D(){const c=$('#fb2d');if(!c)return;const{w,h,x:ctx}=PA.fit(c);ctx.clearRect(0,0,w,h);const{s,g}=geom(),u=Math.min(w/3.2,h/2.6),cx=w*.55,cy=h/2,r=R();
 ctx.fillStyle='#b84a5c';ctx.fillRect(cx-s/2*u,cy-g/2*u-6,s*u,6);ctx.fillStyle='#3d6fa8';ctx.fillRect(cx-s/2*u,cy+g/2*u,s*u,6);
 if(S.f>0&&S.mat!=='air'){ctx.fillStyle='rgba(255,179,71,.4)';ctx.fillRect(cx+s/2*u-S.f*s*u,cy-g/2*u,S.f*s*u,g*u)}
 ctx.fillStyle='#e8ecff';ctx.font='13px sans-serif';ctx.fillText('Q = '+PA.num((r.Q*1e9).toPrecision(3))+' nC',10,20)}

/* ================= READOUTS & METERS ================= */
const fmt=(v,u)=>{const units={F:[[1e-6,'µF'],[1e-9,'nF'],[1e-12,'pF']],C:[[1e-6,'µC'],[1e-9,'nC'],[1e-12,'pC']],J:[[1e-3,'mJ'],[1e-6,'µJ'],[1e-9,'nJ'],[1e-12,'pJ']]}[u];
 if(!units)return PA.num(+v.toPrecision(3))+' '+u;for(const[k,n]of units)if(Math.abs(v)>=k)return PA.num(+(v/k).toPrecision(3))+' '+n;const[k,n]=units[units.length-1];return PA.num(+(v/k).toPrecision(3))+' '+n};
function readouts(){const r=R(),last=st().get('recs',[]).slice(-1)[0];
 const row=(k,v,u,lv)=>{let ratio='';if(lv){const q=v/lv;if(isFinite(q)&&Math.abs(q-1)>.005)ratio=`<span style="color:${q>1?'var(--good)':'var(--bad)'}">${q>1?'▲':'▼'} ×${PA.num(q.toFixed(2))}</span>`;else ratio='<span class="muted">=</span>'}
  return`<div class="ro"><small>${k}</small><b>${fmt(v,u)}</b><small>${ratio}</small></div>`};
 $('#meters').innerHTML=row('C',r.C,'F',last&&last.C*1e-12)+row('V',r.V,'V',last&&last.V)+row('Q',r.Q,'C',last&&last.Q*1e-9)+row('E',r.E,'V/m',last&&last.E)+row('U',r.U,'J',last&&last.U*1e-9)+`<div class="ro"><small>εᵣ eff</small><b>${PA.num(r.erEff.toFixed(2))}</b></div>`;
 $('#vsl').style.display=last?'block':'none';
 $('#Av').textContent=S.Acm2+' cm²';$('#dv').textContent=PA.num(S.dmm)+' mm';$('#Vv').textContent=S.connected?S.V0+' V':'—';$('#fv').textContent=Math.round(S.f*100)+'%';
 $('#V0').disabled=!S.connected;$('#f').disabled=S.mat==='air';const b=$('#batBtn');b.textContent=S.connected?t('on'):t('off');b.style.background=S.connected?'var(--good)':'var(--bad)';
 PA.tex($('#live'),`C=\\frac{\\varepsilon_0\\,(${PA.num(r.erEff.toFixed(2))})\\,(${PA.sciTex(r.A)})}{${PA.sciTex(r.d)}}=\\mathbf{${PA.sciTex(r.C)}\\ F}`)}
function changed(){const r=R();if(S.lastQ!=null&&Math.abs(r.Q-S.lastQ)>S.lastQ*1e-3&&S.connected){S.flowT=performance.now();S.flowDir=r.Q>S.lastQ?1:-1}S.lastQ=r.Q;rebuild()}
function bindLab(){$('#mat').onchange=e=>{S.mat=e.target.value;if(S.mat!=='air'&&S.f===0){S.f=1;$('#f').value=1}changed()};
 [['A','Acm2'],['d','dmm'],['V0','V0'],['f','f']].forEach(([id,k])=>$('#'+id).oninput=e=>{S[k]=+e.target.value;changed()});
 $('#batBtn').onclick=()=>{if(S.connected){S.Qfix=R().Q;S.connected=false}else{S.connected=true}changed()};
 $('#half').onclick=()=>{S.dmm=Math.max(.5,+(S.dmm/2).toFixed(2));$('#d').value=S.dmm;changed()};
 $('#dblA').onclick=()=>{S.Acm2=Math.min(400,S.Acm2*2);$('#A').value=S.Acm2;changed()};
 const tg=(id,k)=>$(id).onclick=e=>{S[k]=!S[k];e.currentTarget.classList.toggle('on',S[k]);rebuild()};tg('#tLines','lines');tg('#tCharges','charges');
 $('#tView').onclick=()=>{if(G&&G.O){Object.assign(G.O,G.DEFV);G.dirty=true}};
 $('#recordBtn').onclick=record;$('#clearRec').onclick=()=>{['recs','d1','disc'].forEach(k=>st().set(k,k==='recs'?[]:null));paintRecords()};
 $('#fsBtn').onclick=()=>{const w=$('#labwrap');const f=!w.classList.contains('full');w.classList.toggle('full',f);document.body.style.overflow=f?'hidden':'';$('#v3').style.height=f?'min(70vh,640px)':(matchMedia('(max-width:640px)').matches?'360px':'460px');try{f&&w.requestFullscreen?w.requestFullscreen().catch(()=>{}):document.fullscreenElement&&document.exitFullscreen()}catch(e){}};
 if(matchMedia('(max-width:640px)').matches)$('#v3').style.height='360px';
 PA.visible($('#v3'),v=>{S.on=v;if(v&&G)G.dirty=true});
 const io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){io.disconnect();init3D()}},{rootMargin:'800px'});io.observe($('#v3'))}

/* ================= MEASURE / DISCOVER / MISSIONS ================= */
function record(){const recs=st().get('recs',[]),r=R();recs.push({con:S.connected,A:S.Acm2,d:S.dmm,er:+r.erEff.toFixed(3),mat:S.mat,f:S.f,C:r.C*1e12,V:r.V,Q:r.Q*1e9,E:r.E,U:r.U*1e9});st().set('recs',recs);PA.toast(t('rec')(recs.length,PA.num(+(r.C*1e12).toPrecision(3))));paintRecords();paintGuide();readouts()}
function recordsTable(){const recs=st().get('recs',[]);if(!recs.length)return'';const th=t('th2'),p=v=>PA.num(+v.toPrecision(3));
 return`<table><thead><tr>${th.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${recs.map((r,i)=>`<tr><td>${i+1}</td><td>${r.con?'🔌':'⛔'}</td><td>${r.A}</td><td>${PA.num(r.d)}</td><td>${PA.num(r.er)}</td><td>${p(r.C)}</td><td>${p(r.V)}</td><td>${p(r.Q)}</td><td>${p(r.U)}</td></tr>`).join('')}</tbody></table>`}
function paintRecords(){$('#recTable').innerHTML=recordsTable()||`<p class="empty">${t('noRec')}</p>`;paintDiscover();checkMissions()}
const pairHalf=r=>{for(const a of r)for(const b of r)if(a!==b&&a.A===b.A&&a.er===b.er&&Math.abs(a.d/b.d-2)<.02)return[a,b];return null};
function paintDiscover(){const box=$('#discover'),pv=st().get('predict',null);
 if(st().get('disc',null)){box.innerHTML=(pv!=null?`<div class="guide">${pv===2?t('predR'):t('predW')(t('ch')[pv])}</div>`:'')+`<div class="discovery" style="display:block">${t('eGood')}</div><div class="row"><button class="btn sm" data-go="sF">→ ${t('kF')}</button></div>`;return}
 const pr=pairHalf(st().get('recs',[]));if(!pr){box.innerHTML=`<div class="guide">${t('eWait')}</div>`;return}
 if(!st().get('d1',null)){box.innerHTML=`<p>${t('eAsk1')}</p><div class="ans"><input class="f" id="eIn" inputmode="decimal" placeholder="×"><button class="btn sm" id="eBtn">${PA.t('check')}</button></div><div class="res" id="eRes"></div>`;
  $('#eBtn').onclick=()=>{const v=PA.parseNum($('#eIn').value);if(Math.abs(v-pr[1].C/pr[0].C)<.05){st().set('d1',true);paintDiscover()}else{$('#eRes').className='res no';$('#eRes').textContent=t('eBad')}};return}
 box.innerHTML=`<p>${t('eAsk2')}</p><div class="opts">${t('fn').map((f,i)=>`<button data-fn="${i}">${f}</button>`).join('')}</div><div class="res" id="eRes"></div>`;
 $$('[data-fn]',box).forEach(b=>b.onclick=()=>{if(+b.dataset.fn===1){st().set('disc',true);paintDiscover();unlockF();checkMissions()}else{b.classList.add('wrong');$('#eRes').className='res no';$('#eRes').textContent=t('fnBad')}})}
function unlockF(){$('#fcard').classList.toggle('locked',!st().get('disc',null)&&!st().get('skipF',false))}
const near=(a,b,tol=.02)=>Math.abs(a/b-1)<tol;
const MIS=[r=>r.some(a=>r.some(b=>a.d===b.d&&a.er===b.er&&near(b.A/a.A,2)&&near(b.C/a.C,2))),
 r=>r.some(a=>a.er===1&&r.some(b=>b.A===a.A&&b.d===a.d&&b.f===1&&b.er>1&&near(b.C/a.C,b.er))),
 r=>r.some(a=>!a.con&&r.some(b=>!b.con&&b!==a&&b.d!==a.d&&near(b.Q,a.Q,.005)&&near(b.V/a.V,b.d/a.d,.02))),
 ()=>!!st().get('disc',null),()=>!!st().get('apply',false)];
function checkMissions(silent){const recs=st().get('recs',[]);const done=new Set(st().get('chal2',[]));MIS.forEach((ok,i)=>{if(!done.has(i)&&ok(recs)){done.add(i);if(!silent)PA.toast(t('mDone')(i+1))}});st().set('chal2',[...done]);
 $('#chals').innerHTML=t('missions').map((m,i)=>`<div class="chal ${done.has(i)?'ok':''}"><div class="tick">${done.has(i)?'✓':i+1}</div><div><b>${m[0]}</b><br><small>${PA.t('hint')}: ${m[1]}</small></div></div>`).join('');
 $('#chalScore').innerHTML=done.size===MIS.length?t('all'):t('score')(done.size,MIS.length)}

/* ================= PREDICT / FORMULA / SUMMARY ================= */
function paintPredict(){const v=st().get('predict',null);$('#choices').innerHTML=t('ch').map((c,i)=>`<button class="choice ${v===i?'picked':''}" data-c="${i}">${c}</button>`).join('');
 $$('#choices .choice').forEach(b=>b.onclick=()=>{st().set('predict',+b.dataset.c);paintPredict()});
 $('#predictFb').innerHTML=v!=null?`<p>${v===2?t('fbR'):t('fbO')(t('ch')[v])}</p><button class="btn" id="testBtn">${t('testBtn')}</button>`:t('fb0');const tb=$('#testBtn');if(tb)tb.onclick=startTest}
function startTest(){S.guideStart=st().get('recs',[]).length;L.loadLab({Acm2:100,dmm:4,mat:'air',f:0,connected:true,V0:12});paintGuide()}
function paintGuide(){const g=$('#labGuide');if(S.guideStart==null){g.style.display='none';return}const n=st().get('recs',[]).length-S.guideStart;g.style.display='block';g.innerHTML=n<=0?t('testGuide'):n===1?t('g1'):t('g2');$('#recordBtn').style.boxShadow=n<2?'0 0 0 4px rgba(255,209,102,.35)':'';$('#half').classList.toggle('on',n===1)}
const LINK={C:null,e0:null,er:'er',A:'A',d:'d'};
function paintFormula(){PA.tex($('#bigFormula'),`\\htmlClass{piece p-C}{C}=\\dfrac{\\htmlClass{piece p-e0}{\\varepsilon_0}\\,\\htmlClass{piece p-er}{\\varepsilon_r}\\,\\htmlClass{piece p-A}{A}}{\\htmlClass{piece p-d}{d}}`);$('#pieceInfo').innerHTML=t('tap');
 Object.keys(LINK).forEach(k=>{const el=$('#bigFormula .p-'+k);if(el)el.addEventListener('click',()=>{$$('#bigFormula .piece').forEach(p=>p.classList.remove('active'));el.classList.add('active');$('#pieceInfo').innerHTML=t('pieces')[k]+(LINK[k]?` <button class="link" data-go="sC">${t('glow')}</button>`:'');if(LINK[k]){S.flash=LINK[k];S.flashT=performance.now()+300;if(G)G.dirty=true}})});
 const T=t('tbl');$('#cdTable').innerHTML=`<table><thead><tr><th>${T[0]}</th><th>${T[1]}</th><th>${T[2]}</th></tr></thead><tbody><tr><td>${T[3]}</td><td>${T[4]}</td><td>${T[5]}</td></tr><tr><td>${T[6]}</td><td>${T[7]}</td><td>${T[8]}</td></tr><tr><td>${T[9]}</td><td>${T[10]}</td><td>${T[11]}</td></tr></tbody></table>`}
function paintSummary(){$('#sumF').innerHTML=PA.formulaCards();PA.paintFormulaMath($('#sumF'));$('#sumList').innerHTML=PA.L(summary).map((s,i)=>`<li class="hl" id="sl${i}">${s}</li>`).join('');
 const r=solve(base);PA.tex($('#worked'),`C=${PA.num((r.C*1e12).toFixed(1))}\\ \\mathrm{pF},\\quad Q=${PA.num((r.Q*1e9).toFixed(2))}\\ \\mathrm{nC},\\quad U=${PA.num((r.U*1e9).toFixed(1))}\\ \\mathrm{nJ}`);$('#real').innerHTML=t('real').map((x,i)=>`<div><b>${x[0]}</b><span class="hl" id="rl${i}">${x[1]}</span></div>`).join('')}
function paintPath(cur){const v=new Set(st().get('visited',[]));$('#path').innerHTML=STEPS.map((s,i)=>`<button data-go="${s}" class="${v.has(i)?'done':''} ${i===cur?'now':''}"><b>${v.has(i)?'✓':String.fromCharCode(65+i)}</b>${UI[PA.lang].ethos[i]}</button>`).join('')}

const L={id:'capacitor',ref:'Ch. 11',title:{en:'Parallel-Plate Capacitor',fr:'Condensateur plan',ar:'المكثف ذو اللوحين'},i18n,formulas,summary,textbook,practice,vault:null,
 mount(root){root.innerHTML=html;plates2d();bindLab();$('#skipF').onclick=()=>{st().set('skipF',true);unlockF()};
  $('#apBtn').onclick=()=>{const v=PA.parseNum($('#apIn').value),target=solve({Acm2:200,dmm:2,er:1,f:0,connected:true,V0:10,Qfix:0}).Q*1e9;const ok=Math.abs(v-target)/target<.02;$('#apRes').className='res '+(ok?'ok':'no');$('#apRes').textContent=ok?t('apOk'):t('apNo');if(ok){st().set('apply',true);checkMissions()}};
  $('#pdfB').onclick=PA.openExp;S.lastQ=R().Q;
  const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const i=STEPS.indexOf(e.target.id);const v=new Set(st().get('visited',[]));v.add(i);st().set('visited',[...v]);paintPath(i)}}),{threshold:.3});STEPS.forEach(s=>so.observe($('#'+s)))},
 onLang(){$('#ethos').innerHTML=UI[PA.lang].ethos.map(x=>`<span>${x}</span>`).join('');$('#apBtn').textContent=PA.t('check');
  $('#mat').innerHTML=MEDIA.map(m=>`<option value="${m.k}">${t('media')[m.k]}</option>`).join('');$('#mat').value=S.mat;
  paintPath(-1);paintPredict();paintFormula();paintSummary();paintRecords();unlockF();checkMissions(true);rebuild()},
 onMode(m){if(m==='learn'&&G)G.dirty=true},onTheme(){},
 progress(){return[[t('progL')[0],st().get('visited',[]).length,8],[t('progL')[1],st().get('chal2',[]).length,MIS.length],[t('progL')[2],st().get('pdone',[]).length,practice.length]]},
 recordsTable,
 loadLab(cfg){PA.setMode('learn');Object.assign(S,cfg);$('#A').value=S.Acm2;$('#d').value=S.dmm;$('#V0').value=S.V0;$('#mat').value=S.mat;$('#f').value=S.f;S.lastQ=R().Q;rebuild();setTimeout(()=>PA.go('sC'),60)}};
PA.register(L);
window.CAP_ENGINE={EPS0,solve,MEDIA};
})();
