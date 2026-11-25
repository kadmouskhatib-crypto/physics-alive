/* Lesson: Electric Flux (Physics 12, §11.4). Same schema as coulomb.js. 3D lab uses Three.js, loaded only here. */
(function(){
const {$,$$}=PA;const t=k=>PA.t(k);

/* ================= PHYSICS ENGINE ================= */
const rad=d=>d*Math.PI/180;
const cosd=d=>{const c=Math.cos(rad(d));return Math.abs(c)<1e-12?0:c};
const flux=(E,A,th)=>E*A*cosd(th);          // N m² C⁻¹ (signed)
const PER_LINE=50;                           // one drawn field line per 50 N m²/C → lines/m² = E/50

/* ================= TEXT ================= */
const i18n={
en:{k0:'Chapter 11 · Electrostatics · Lesson 2',h0:'How much field <em>passes through</em>?',
 p0:'Hold a hoop in the rain. Face it to the sky and many drops fall through. Tilt it and fewer get in. Turn it edge-on and almost none pass. <b>Drag across the scene</b> to tilt the hoop.',
 hint0:'👆 Drag left/right to tilt the hoop. Watch the drops-per-second counter.',dps:'drops / s',tilt:'tilt',
 kA:'A · Experience',kB:'B · Predict',kC:'C · Experiment',kD:'D · Measure',kE:'E · Discover',kF:'F · Understand',kG:'G · Apply',kH:'H · Remember',
 hB:'Guess before you turn',pB:'A flat surface faces a uniform electric field head-on (θ = 0°), so the flux is Φ. You turn it to <b>θ = 60°</b>. The flux becomes:',
 ch:['Φ (same)','¾ Φ','½ Φ','0'],fb0:'Pick one. Then test it.',fbR:'🎯 Sharp prediction: <b>½ Φ</b>. Prove it!',fbO:g=>`Your prediction: <b>${g}</b>. Now let the field decide.`,testBtn:'🧪 Test my prediction in the 3D lab',
 testGuide:'<b>Your experiment:</b> ① tap <b>0°</b> and 📌 Record ② tap <b>60°</b> ③ 📌 Record again.',g1:'👍 Saved at 0°. Now tap <b>60°</b>, then 📌 Record.',g2:'🎉 Both saved! <button class="link" data-go="sE">See what you discovered →</button>',
 predR:'✅ Your prediction <b>½ Φ</b> was right!',predW:g=>`You predicted <b>${g}</b>. The measurement says <b>½ Φ</b>.`,
 hC:'The 3D flux lab',pC:'Drag empty space to <b>orbit</b>, pinch or scroll to <b>zoom</b>. Drag the <b>surface itself</b> to tilt it. Golden lines are the ones crossing the surface.',
 E:'Field E',A:'Area A',th:'Angle θ (normal ↔ E)',flip:'⇄ Flip normal',view:'⟲ View',tLines:'Field lines',tShadow:'Shadow A⊥',tLabels:'Labels',record:'📌 Record',
 roPhi:'Flux Φ',roCos:'cos θ',roAp:'A⊥ = A cos θ',roN:'Lines crossing',
 graphHint:'Φ against θ for your E and A. The dot is you; green dots are your records.',webgl:'3D is not available on this device, showing the 2D top view.',
 hD:'Your measurements',pD:'Keep E and A fixed. Record at <b>0°, 30°, 60°, 90°</b> and <b>180°</b>.',th2:['#','E (N/C)','A (m²)','θ','Φ (N m²/C)','Φ / Φ(0°)'],noRec:'No records yet. Tap 📌 Record in the lab.',clear:'Clear',back:'↑ Back to lab',
 hE:'Find the pattern',pE:'Compare each record with the one at 0°.',eWait:'Record at <b>0°</b> and at <b>60°</b> with the same E and A.',
 eAsk1:'From your table: Φ(60°) ÷ Φ(0°) = ?',eBad:'Divide the two flux values from your table.',
 eAsk2:'Which function gives <b>1</b> at 0°, <b>0.87</b> at 30°, <b>0.5</b> at 60° and <b>0</b> at 90°?',fn:['sin θ','cos θ','θ / 90°','tan θ'],fnBad:'Check it: what is that function at 0°?',
 eGood:'🤯 <b>Exactly!</b> The flux follows <b>cos θ</b>. Only the part of the area that <i>faces</i> the field counts: A⊥ = A cos θ. Look at the golden shadow in the lab.',
 hF:'Now you\'ve earned the formula',pF:'Flux = field × the area that faces it. Tap each part.',lockF:'🔒 Discover the pattern in step E first, or',skip:'skip and show me the law',tap:'👆 Tap a part of the formula.',glow:'✨ see it glow in the lab',
 pieces:{Phi:'<b>Electric flux</b>: how much field passes through the surface. Unit N m² C⁻¹. It is a <b>scalar</b> and can be negative.',
  E:'<b>Field strength</b> in N C⁻¹. A stronger field = denser lines = more flux.',A:'<b>Area</b> of the surface in m². The vector area points along the normal n̂.',
  cos:'<b>cos θ</b>, θ = angle between the <b>normal</b> and E (not the surface itself!). 0° → 1, 90° → 0, 180° → −1.'},
 normalWhy:'<b>Why the normal?</b> A surface has two sides. The normal n̂ says which side is "out". Flip it and the same lines now enter from the back: the flux changes sign.',
 hG:'Prove it with measurements',pG:'Missions only complete from your recorded data.',
 missions:[['Record zero flux.','Turn the surface edge-on to the field.'],['Record a negative flux.','Go past 90°, or flip the normal.'],['Prove Φ ∝ A: two records with the same E and θ, one with twice the area. Φ must double.','Record, double A, record again.'],['Discover the cos θ law (step E).','Answer both questions in step E.'],['Predict, then verify.','Solve the question below.']],
 mDone:n=>`✅ Mission ${n} complete!`,score:(n,tt)=>`${n} / ${tt} missions complete`,all:'🏆 <b>All missions done. You own electric flux.</b>',
 apQ:'E = 200 N/C, A = 0.5 m², θ = 60°. Find Φ in N m²/C.',apOk:'✅ Correct! Set those values in the lab and check.',apNo:'Not yet. Φ = E × A × cos 60°.',
 hH:'Summary card',five:'In 5 sentences',realT:'Where you meet it',
 real:[['☀️ Solar panels','A panel facing the sun catches the most light "flux". Tilted, it collects A cos θ worth.'],['🌧️ Rain & windows','Rain through a window depends on how the window faces the rain: the same cos θ idea.'],['📡 Antennas','A loop antenna picks up the most signal when its normal lines up with the field.'],['🔮 Gauss\'s law','Next lesson: the total flux out of a closed surface reveals the charge inside.']],
 pdf2:'📄 Export my booklet (PDF)',toNb:'📓 Open my notebook',toTb:'📖 Full lesson (Textbook)',resetT:'Lab reset',rec:(n,th,p)=>`📌 #${n}: θ = ${th}°, Φ = ${p}`,
 pLead:'Questions with progressive hints and full solutions. Missed questions go to your notebook.',extraQ:'Physics Alive question',progL:['Learning path','Lab missions','Practice'],workedQ:'Example: E = 300 N/C, A = 0.2 m², θ = 30°.'},
fr:{k0:'Chapitre 11 · Électrostatique · Leçon 2',h0:'Combien de champ <em>traverse</em> ?',
 p0:'Tiens un cerceau sous la pluie. Face au ciel, beaucoup de gouttes le traversent. Incliné, moins. De profil, presque aucune. <b>Fais glisser sur la scène</b> pour incliner le cerceau.',
 hint0:'👆 Fais glisser à gauche/droite pour incliner. Observe le compteur de gouttes.',dps:'gouttes / s',tilt:'inclinaison',
 kA:'A · Vivre',kB:'B · Prédire',kC:'C · Expérimenter',kD:'D · Mesurer',kE:'E · Découvrir',kF:'F · Comprendre',kG:'G · Appliquer',kH:'H · Retenir',
 hB:'Devine avant de tourner',pB:'Une surface plane fait face à un champ uniforme (θ = 0°) : le flux vaut Φ. Tu la tournes à <b>θ = 60°</b>. Le flux devient :',
 ch:['Φ (identique)','¾ Φ','½ Φ','0'],fb0:'Choisis, puis teste.',fbR:'🎯 Belle prédiction : <b>½ Φ</b>. Prouve-la !',fbO:g=>`Ta prédiction : <b>${g}</b>. Laissons le champ décider.`,testBtn:'🧪 Tester ma prédiction au labo 3D',
 testGuide:'<b>Ton expérience :</b> ① touche <b>0°</b> et 📌 Mesurer ② touche <b>60°</b> ③ 📌 Mesurer encore.',g1:'👍 Enregistré à 0°. Touche <b>60°</b>, puis 📌 Mesurer.',g2:'🎉 Les deux sont enregistrées ! <button class="link" data-go="sE">Vois ce que tu as découvert →</button>',
 predR:'✅ Ta prédiction <b>½ Φ</b> était juste !',predW:g=>`Tu avais prédit <b>${g}</b>. La mesure dit <b>½ Φ</b>.`,
 hC:'Le labo 3D du flux',pC:'Fais glisser le vide pour <b>tourner la vue</b>, pince ou molette pour <b>zoomer</b>. Fais glisser <b>la surface</b> pour l’incliner. Les lignes dorées traversent la surface.',
 E:'Champ E',A:'Aire A',th:'Angle θ (normale ↔ E)',flip:'⇄ Inverser la normale',view:'⟲ Vue',tLines:'Lignes de champ',tShadow:'Ombre A⊥',tLabels:'Étiquettes',record:'📌 Mesurer',
 roPhi:'Flux Φ',roCos:'cos θ',roAp:'A⊥ = A cos θ',roN:'Lignes traversantes',
 graphHint:'Φ en fonction de θ pour tes E et A. Le point, c’est toi ; les points verts sont tes mesures.',webgl:'La 3D n’est pas disponible sur cet appareil : vue de dessus 2D.',
 hD:'Tes mesures',pD:'Garde E et A fixes. Mesure à <b>0°, 30°, 60°, 90°</b> et <b>180°</b>.',th2:['n°','E (N/C)','A (m²)','θ','Φ (N m²/C)','Φ / Φ(0°)'],noRec:'Aucune mesure. Touche 📌 Mesurer au labo.',clear:'Effacer',back:'↑ Retour au labo',
 hE:'Trouve la règle',pE:'Compare chaque mesure à celle de 0°.',eWait:'Mesure à <b>0°</b> et à <b>60°</b> avec les mêmes E et A.',
 eAsk1:'D’après ton tableau : Φ(60°) ÷ Φ(0°) = ?',eBad:'Divise les deux valeurs de flux de ton tableau.',
 eAsk2:'Quelle fonction vaut <b>1</b> à 0°, <b>0,87</b> à 30°, <b>0,5</b> à 60° et <b>0</b> à 90° ?',fn:['sin θ','cos θ','θ / 90°','tan θ'],fnBad:'Vérifie : que vaut cette fonction à 0° ?',
 eGood:'🤯 <b>Exactement !</b> Le flux suit <b>cos θ</b>. Seule la partie de l’aire <i>face</i> au champ compte : A⊥ = A cos θ. Regarde l’ombre dorée au labo.',
 hF:'Tu as mérité la formule',pF:'Flux = champ × aire qui lui fait face. Touche chaque partie.',lockF:'🔒 Découvre d’abord la règle à l’étape E, ou',skip:'passer et voir la loi',tap:'👆 Touche une partie de la formule.',glow:'✨ la voir briller au labo',
 pieces:{Phi:'<b>Flux électrique</b> : quantité de champ qui traverse la surface. Unité N m² C⁻¹. C’est un <b>scalaire</b>, il peut être négatif.',
  E:'<b>Intensité du champ</b> en N C⁻¹. Champ plus fort = lignes plus serrées = plus de flux.',A:'<b>Aire</b> de la surface en m². Le vecteur surface est porté par la normale n̂.',
  cos:'<b>cos θ</b>, θ = angle entre la <b>normale</b> et E (pas la surface !). 0° → 1, 90° → 0, 180° → −1.'},
 normalWhy:'<b>Pourquoi la normale ?</b> Une surface a deux faces. La normale n̂ indique la face « sortante ». Inverse-la : les mêmes lignes entrent par l’arrière, le flux change de signe.',
 hG:'Prouve-le par la mesure',pG:'Les missions se valident uniquement avec tes mesures.',
 missions:[['Enregistre un flux nul.','Mets la surface de profil par rapport au champ.'],['Enregistre un flux négatif.','Dépasse 90°, ou inverse la normale.'],['Prouve Φ ∝ A : deux mesures avec mêmes E et θ, l’une avec une aire double. Φ doit doubler.','Mesure, double A, mesure encore.'],['Découvre la loi en cos θ (étape E).','Réponds aux deux questions de l’étape E.'],['Prédire, puis vérifier.','Résous la question ci-dessous.']],
 mDone:n=>`✅ Mission ${n} réussie !`,score:(n,tt)=>`${n} / ${tt} missions réussies`,all:'🏆 <b>Toutes les missions sont réussies. Tu maîtrises le flux électrique.</b>',
 apQ:'E = 200 N/C, A = 0,5 m², θ = 60°. Calcule Φ en N m²/C.',apOk:'✅ Exact ! Règle ces valeurs au labo pour vérifier.',apNo:'Pas encore. Φ = E × A × cos 60°.',
 hH:'Fiche résumé',five:'En 5 phrases',realT:'Où le rencontres-tu ?',
 real:[['☀️ Panneaux solaires','Face au soleil, un panneau reçoit le maximum de « flux » lumineux. Incliné, il reçoit A cos θ.'],['🌧️ Pluie et fenêtres','La pluie qui entre par une fenêtre dépend de son orientation : même idée de cos θ.'],['📡 Antennes','Une antenne boucle capte le mieux quand sa normale s’aligne sur le champ.'],['🔮 Théorème de Gauss','Prochaine leçon : le flux total sortant d’une surface fermée révèle la charge intérieure.']],
 pdf2:'📄 Exporter mon livret (PDF)',toNb:'📓 Ouvrir mon carnet',toTb:'📖 Leçon complète (Cours)',resetT:'Labo réinitialisé',rec:(n,th,p)=>`📌 n°${n} : θ = ${th}°, Φ = ${p}`,
 pLead:'Questions avec indices progressifs et solutions complètes. Les questions ratées vont dans ton carnet.',extraQ:'Question Physics Alive',progL:['Parcours','Missions du labo','Exercices'],workedQ:'Exemple : E = 300 N/C, A = 0,2 m², θ = 30°.'},
ar:{k0:'الفصل 11 · الكهرباء الساكنة · الدرس 2',h0:'كم من المجال <em>يعبر</em>؟',
 p0:'أمسك طوقاً تحت المطر. عندما يواجه السماء تمرّ قطرات كثيرة، وعندما تُميله يمرّ أقل، وعندما يصبح جانبياً لا يكاد يمرّ شيء. <b>اسحب على المشهد</b> لإمالة الطوق.',
 hint0:'👆 اسحب يميناً ويساراً لإمالة الطوق. راقب عدّاد القطرات.',dps:'قطرة / ث',tilt:'الميل',
 kA:'أ · جرّب',kB:'ب · توقّع',kC:'ج · اختبر',kD:'د · قِس',kE:'هـ · اكتشف',kF:'و · افهم',kG:'ز · طبّق',kH:'ح · تذكّر',
 hB:'خمّن قبل أن تُدير',pB:'سطح مستوٍ يواجه مجالاً منتظماً مباشرة (θ = 0°) فيكون التدفق Φ. تُديره إلى <b>θ = 60°</b>. يصبح التدفق:',
 ch:['Φ (نفسه)','¾ Φ','½ Φ','0'],fb0:'اختر ثم اختبر.',fbR:'🎯 توقّع دقيق: <b>½ Φ</b>. أثبته!',fbO:g=>`توقّعك: <b>${g}</b>. لندع المجال يقرّر.`,testBtn:'🧪 اختبر توقّعي في المختبر ثلاثي الأبعاد',
 testGuide:'<b>تجربتك:</b> ① اضغط <b>0°</b> ثم 📌 سجّل ② اضغط <b>60°</b> ③ 📌 سجّل مجدداً.',g1:'👍 حُفظ عند 0°. اضغط الآن <b>60°</b> ثم 📌 سجّل.',g2:'🎉 حُفظ القياسان! <button class="link" data-go="sE">شاهد ما اكتشفته ←</button>',
 predR:'✅ كان توقّعك <b>½ Φ</b> صحيحاً!',predW:g=>`توقّعت <b>${g}</b>. القياس يقول <b>½ Φ</b>.`,
 hC:'مختبر التدفق ثلاثي الأبعاد',pC:'اسحب الفراغ لـ<b>تدوير المشهد</b>، وباعد الإصبعين أو استخدم العجلة لـ<b>التكبير</b>. اسحب <b>السطح نفسه</b> لإمالته. الخطوط الذهبية هي التي تعبر السطح.',
 E:'المجال E',A:'المساحة A',th:'الزاوية θ (العمودي ↔ E)',flip:'⇄ اعكس العمودي',view:'⟲ المشهد',tLines:'خطوط المجال',tShadow:'الظل A⊥',tLabels:'التسميات',record:'📌 سجّل',
 roPhi:'التدفق Φ',roCos:'cos θ',roAp:'A⊥ = A cos θ',roN:'خطوط عابرة',
 graphHint:'Φ بدلالة θ لقيم E وA لديك. النقطة هي أنت، والنقاط الخضراء قياساتك.',webgl:'العرض ثلاثي الأبعاد غير متاح على هذا الجهاز، يُعرض منظر علوي ثنائي الأبعاد.',
 hD:'قياساتك',pD:'أبقِ E وA ثابتين. سجّل عند <b>0° و30° و60° و90°</b> و<b>180°</b>.',th2:['#','E (N/C)','A (m²)','θ','Φ (N m²/C)','Φ / Φ(0°)'],noRec:'لا توجد قياسات. اضغط 📌 سجّل في المختبر.',clear:'مسح',back:'↑ العودة إلى المختبر',
 hE:'اكتشف القاعدة',pE:'قارن كل قياس بالقياس عند 0°.',eWait:'سجّل عند <b>0°</b> وعند <b>60°</b> بقيم E وA نفسها.',
 eAsk1:'من جدولك: Φ(60°) ÷ Φ(0°) = ؟',eBad:'اقسم قيمتي التدفق من جدولك.',
 eAsk2:'أي دالة تعطي <b>1</b> عند 0° و<b>0.87</b> عند 30° و<b>0.5</b> عند 60° و<b>0</b> عند 90°؟',fn:['sin θ','cos θ','θ / 90°','tan θ'],fnBad:'تحقّق: كم قيمة هذه الدالة عند 0°؟',
 eGood:'🤯 <b>تماماً!</b> يتبع التدفق <b>cos θ</b>. لا يُحسب إلا جزء المساحة الذي <i>يواجه</i> المجال: A⊥ = A cos θ. انظر إلى الظل الذهبي في المختبر.',
 hF:'لقد استحققت القانون',pF:'التدفق = المجال × المساحة التي تواجهه. اضغط على كل جزء.',lockF:'🔒 اكتشف القاعدة أولاً في الخطوة هـ، أو',skip:'تخطَّ وأرني القانون',tap:'👆 اضغط على جزء من القانون.',glow:'✨ شاهده يضيء في المختبر',
 pieces:{Phi:'<b>التدفق الكهربائي</b>: مقدار المجال الذي يعبر السطح. وحدته N m² C⁻¹. وهو <b>كمية قياسية</b> قد تكون سالبة.',
  E:'<b>شدة المجال</b> بوحدة N C⁻¹. مجال أقوى = خطوط أكثف = تدفق أكبر.',A:'<b>مساحة</b> السطح بالمتر المربع. متجه المساحة على امتداد العمودي n̂.',
  cos:'<b>cos θ</b>، حيث θ الزاوية بين <b>العمودي</b> وE (لا السطح نفسه!). 0° ← 1، 90° ← 0، 180° ← −1.'},
 normalWhy:'<b>لماذا العمودي؟</b> للسطح وجهان، والعمودي n̂ يحدد الوجه «الخارجي». اعكسه فتدخل الخطوط نفسها من الخلف ويتغيّر إشارة التدفق.',
 hG:'أثبت ذلك بالقياس',pG:'لا تكتمل المهام إلا من بياناتك المسجّلة.',
 missions:[['سجّل تدفقاً صفرياً.','اجعل السطح جانبياً بالنسبة إلى المجال.'],['سجّل تدفقاً سالباً.','تجاوز 90° أو اعكس العمودي.'],['أثبت أن Φ ∝ A: قياسان بقيمتي E وθ نفسيهما، أحدهما بضعف المساحة. يجب أن يتضاعف Φ.','سجّل، ضاعف A، ثم سجّل مجدداً.'],['اكتشف قانون cos θ (الخطوة هـ).','أجب عن سؤالي الخطوة هـ.'],['توقّع ثم تحقّق.','حلّ السؤال أدناه.']],
 mDone:n=>`✅ اكتملت المهمة ${n}!`,score:(n,tt)=>`${n} / ${tt} مهام مكتملة`,all:'🏆 <b>أنجزت كل المهام. أنت تتقن التدفق الكهربائي.</b>',
 apQ:'E = 200 N/C وA = 0.5 m² وθ = 60°. أوجد Φ بوحدة N m²/C.',apOk:'✅ صحيح! اضبط هذه القيم في المختبر وتحقّق.',apNo:'ليس بعد. Φ = E × A × cos 60°.',
 hH:'بطاقة الملخّص',five:'في 5 جمل',realT:'أين تقابله؟',
 real:[['☀️ الألواح الشمسية','اللوح المواجه للشمس يلتقط أكبر «تدفق» ضوئي، وعند إمالته يلتقط A cos θ.'],['🌧️ المطر والنوافذ','كمية المطر الداخلة من نافذة تعتمد على اتجاهها: فكرة cos θ نفسها.'],['📡 الهوائيات','يلتقط الهوائي الحلقي أقوى إشارة عندما يتطابق عموديّه مع المجال.'],['🔮 قانون غاوس','الدرس التالي: التدفق الكلي الخارج من سطح مغلق يكشف الشحنة داخله.']],
 pdf2:'📄 تصدير كتيّبي (PDF)',toNb:'📓 افتح دفتري',toTb:'📖 الدرس الكامل',resetT:'أُعيد ضبط المختبر',rec:(n,th,p)=>`📌 #${n}: θ = ${th}°، Φ = ${p}`,
 pLead:'أسئلة مع تلميحات متدرّجة وحلول كاملة. الأسئلة التي تخطئ فيها تذهب إلى دفترك.',extraQ:'سؤال من Physics Alive',progL:['مسار التعلّم','مهام المختبر','التمارين'],workedQ:'مثال: E = 300 N/C وA = 0.2 m² وθ = 30°.'}
};

const formulas=[
 {id:'fx',n:{en:'Electric flux',fr:'Flux électrique',ar:'التدفق الكهربائي'},t:"\\Phi_e=\\vec E\\cdot\\vec A=EA\\cos\\theta",d:{en:'θ: angle between E and the surface normal n̂. Unit: N m² C⁻¹.',fr:'θ : angle entre E et la normale n̂. Unité : N m² C⁻¹.',ar:'θ: الزاوية بين E والعمودي n̂. الوحدة: N m² C⁻¹.'}},
 {id:'va',n:{en:'Vector area',fr:'Vecteur surface',ar:'متجه المساحة'},t:"\\vec A=A\\,\\hat n",d:{en:'Size = area, direction = outward normal.',fr:'Norme = aire, direction = normale sortante.',ar:'المقدار = المساحة، والاتجاه = العمودي الخارجي.'}},
 {id:'cases',n:{en:'Special cases',fr:'Cas particuliers',ar:'حالات خاصة'},t:"\\theta=0^\\circ\\!:\\ \\Phi=EA\\quad \\theta=90^\\circ\\!:\\ \\Phi=0\\quad \\theta=180^\\circ\\!:\\ \\Phi=-EA",d:{en:'',fr:'',ar:''}},
 {id:'sum',n:{en:'Non-uniform field',fr:'Champ non uniforme',ar:'مجال غير منتظم'},t:"\\Phi_e=\\sum \\vec E_i\\cdot\\Delta\\vec A_i",d:{en:'Split the surface into small patches and add.',fr:'Découper la surface en petits éléments et additionner.',ar:'قسّم السطح إلى أجزاء صغيرة واجمع.'}}];
const summary={en:['Flux measures how much electric field passes through a surface.','Φ = EA cos θ, with θ measured from the normal, not from the surface.','Maximum at 0°, zero at 90°, negative (−EA) at 180°.','Doubling E or A doubles the flux.','Flux is a scalar; its sign depends on which way the normal points.'],
 fr:['Le flux mesure la quantité de champ qui traverse une surface.','Φ = EA cos θ, θ mesuré depuis la normale, pas depuis la surface.','Maximal à 0°, nul à 90°, négatif (−EA) à 180°.','Doubler E ou A double le flux.','Le flux est un scalaire ; son signe dépend du sens de la normale.'],
 ar:['يقيس التدفق مقدار المجال الكهربائي الذي يعبر سطحاً.','Φ = EA cos θ، وتُقاس θ من العمودي لا من السطح.','أقصى قيمة عند 0°، وصفر عند 90°، وسالب (−EA) عند 180°.','مضاعفة E أو A تضاعف التدفق.','التدفق كمية قياسية تعتمد إشارتها على اتجاه العمودي.']};

const textbook={
en:`<div class="kicker">§11.4 · Physics 12</div><h1>Electric Flux</h1><p class="muted small">Explanation written for Physics Alive from the physics of §11.4. Textbook pages: 17–20.</p>
<h2>1. The idea</h2><p class="hl" id="t1">Field lines show an electric field: where lines are closer, the field is stronger. The number of lines per unit area, taken perpendicular to the lines, is proportional to E. <b>Electric flux</b> counts how many lines pass through a given surface.</p>
<div class="def"><b>Definition.</b> The electric flux Φₑ through a flat surface in a uniform field is the scalar product of the field and the vector area: \\(\\Phi_e=\\vec E\\cdot\\vec A\\).</div>
<h2>2. Vector area</h2><p class="hl" id="t2">A surface is given a direction: its <b>vector area</b> \\(\\vec A = A\\hat n\\) has magnitude equal to the area and points along the normal \\(\\hat n\\), perpendicular to the surface. For a closed surface the normal always points <b>outward</b>.</p>
<h2>3. The formula</h2>$$\\Phi_e = EA\\cos\\theta$$<p class="hl" id="t3">Here θ is the angle between \\(\\vec E\\) and the normal \\(\\hat n\\). The product \\(A\\cos\\theta\\) is the projected area \\(A_\\perp\\): the "shadow" of the surface on a plane perpendicular to the field. Only that part is crossed by field lines.</p>
<p>The unit of flux is <b>N m² C⁻¹</b>.</p>
<h2>4. Three special cases</h2><ul><li class="hl" id="t4"><b>θ = 0°</b>: the surface faces the field, \\(\\Phi=EA\\) (maximum).</li><li class="hl" id="t5"><b>θ = 90°</b>: the field skims along the surface, \\(\\Phi=0\\).</li><li class="hl" id="t6"><b>θ = 180°</b>: the field enters from the "back", \\(\\Phi=-EA\\).</li></ul>
<div class="note">A common mistake is to measure θ from the surface instead of from the normal. That swaps cos for sin.</div>
<h2>5. Non-uniform fields and curved surfaces</h2><p class="hl" id="t7">If E changes from place to place or the surface is curved, divide the surface into small patches \\(\\Delta\\vec A_i\\), each nearly flat in a nearly uniform field, and add the contributions:</p>$$\\Phi_e=\\sum_i \\vec E_i\\cdot\\Delta\\vec A_i$$
<p class="hl" id="t8">For a closed surface, lines leaving count positive and lines entering count negative. This idea leads directly to <b>Gauss's law</b> (§11.5).</p>
<h2>6. Worked examples</h2><p><b>Example 1.</b> E = 300 N C⁻¹, A = 0.2 m², θ = 30°.</p>$$\\Phi=(300)(0.2)\\cos30^\\circ\\approx 52\\ \\mathrm{N\\,m^2\\,C^{-1}}$$
<p><b>Example 2.</b> A 10 cm × 10 cm card lies flat on a table in a vertical field of 2000 N C⁻¹ pointing up. The card's normal points up.</p>$$\\Phi=(2000)(0.01)\\cos0^\\circ=20\\ \\mathrm{N\\,m^2\\,C^{-1}}$$
<h2>7. Key formulas</h2>`,
fr:`<div class="kicker">§11.4 · Physique 12</div><h1>Flux électrique</h1><p class="muted small">Explication rédigée pour Physics Alive à partir de la physique du §11.4. Pages du manuel : 17–20.</p>
<h2>1. L’idée</h2><p class="hl" id="t1">Les lignes de champ représentent un champ électrique : plus elles sont serrées, plus le champ est intense. Le nombre de lignes par unité d’aire perpendiculaire est proportionnel à E. Le <b>flux électrique</b> compte les lignes qui traversent une surface.</p>
<div class="def"><b>Définition.</b> Le flux Φₑ à travers une surface plane dans un champ uniforme est le produit scalaire du champ et du vecteur surface : \\(\\Phi_e=\\vec E\\cdot\\vec A\\).</div>
<h2>2. Vecteur surface</h2><p class="hl" id="t2">On oriente la surface : son <b>vecteur surface</b> \\(\\vec A = A\\hat n\\) a pour norme l’aire et pour direction la normale \\(\\hat n\\). Pour une surface fermée, la normale pointe toujours <b>vers l’extérieur</b>.</p>
<h2>3. La formule</h2>$$\\Phi_e = EA\\cos\\theta$$<p class="hl" id="t3">θ est l’angle entre \\(\\vec E\\) et la normale \\(\\hat n\\). Le produit \\(A\\cos\\theta\\) est l’aire projetée \\(A_\\perp\\) : « l’ombre » de la surface sur un plan perpendiculaire au champ. Seule cette partie est traversée par les lignes.</p>
<p>L’unité du flux est le <b>N m² C⁻¹</b>.</p>
<h2>4. Trois cas particuliers</h2><ul><li class="hl" id="t4"><b>θ = 0°</b> : surface face au champ, \\(\\Phi=EA\\) (maximum).</li><li class="hl" id="t5"><b>θ = 90°</b> : le champ rase la surface, \\(\\Phi=0\\).</li><li class="hl" id="t6"><b>θ = 180°</b> : le champ entre par « l’arrière », \\(\\Phi=-EA\\).</li></ul>
<div class="note">Erreur fréquente : mesurer θ depuis la surface au lieu de la normale. Cela échange cos et sin.</div>
<h2>5. Champ non uniforme et surfaces courbes</h2><p class="hl" id="t7">Si E varie ou si la surface est courbe, on la découpe en petits éléments \\(\\Delta\\vec A_i\\) presque plans, dans un champ presque uniforme, et on additionne :</p>$$\\Phi_e=\\sum_i \\vec E_i\\cdot\\Delta\\vec A_i$$
<p class="hl" id="t8">Pour une surface fermée, les lignes sortantes comptent positivement et les lignes entrantes négativement. Cette idée mène directement au <b>théorème de Gauss</b> (§11.5).</p>
<h2>6. Exemples résolus</h2><p><b>Exemple 1.</b> E = 300 N C⁻¹, A = 0,2 m², θ = 30°.</p>$$\\Phi=(300)(0{,}2)\\cos30^\\circ\\approx 52\\ \\mathrm{N\\,m^2\\,C^{-1}}$$
<p><b>Exemple 2.</b> Une carte de 10 cm × 10 cm posée à plat dans un champ vertical de 2000 N C⁻¹ dirigé vers le haut ; sa normale pointe vers le haut.</p>$$\\Phi=(2000)(0{,}01)\\cos0^\\circ=20\\ \\mathrm{N\\,m^2\\,C^{-1}}$$
<h2>7. Formules clés</h2>`,
ar:`<div class="kicker">§11.4 · فيزياء 12</div><h1>التدفق الكهربائي</h1><p class="muted small">شرح مكتوب لـ Physics Alive اعتماداً على فيزياء البند 11.4. صفحات الكتاب: 17–20.</p>
<h2>1. الفكرة</h2><p class="hl" id="t1">تمثّل خطوط المجال المجالَ الكهربائي: كلما تقاربت الخطوط كان المجال أقوى. عدد الخطوط لكل وحدة مساحة عمودية عليها يتناسب مع E. و<b>التدفق الكهربائي</b> يعدّ الخطوط التي تعبر سطحاً ما.</p>
<div class="def"><b>تعريف.</b> التدفق Φₑ عبر سطح مستوٍ في مجال منتظم هو الضرب القياسي للمجال في متجه المساحة: \\(\\Phi_e=\\vec E\\cdot\\vec A\\).</div>
<h2>2. متجه المساحة</h2><p class="hl" id="t2">نعطي السطح اتجاهاً: <b>متجه المساحة</b> \\(\\vec A = A\\hat n\\) مقداره المساحة واتجاهه العمودي \\(\\hat n\\) على السطح. وفي السطح المغلق يشير العمودي دائماً <b>إلى الخارج</b>.</p>
<h2>3. القانون</h2>$$\\Phi_e = EA\\cos\\theta$$<p class="hl" id="t3">حيث θ الزاوية بين \\(\\vec E\\) والعمودي \\(\\hat n\\). والمقدار \\(A\\cos\\theta\\) هو المساحة المسقطة \\(A_\\perp\\): «ظل» السطح على مستوٍ عمودي على المجال، وهو الجزء الوحيد الذي تعبره الخطوط.</p>
<p>وحدة التدفق هي <b>N m² C⁻¹</b>.</p>
<h2>4. ثلاث حالات خاصة</h2><ul><li class="hl" id="t4"><b>θ = 0°</b>: السطح يواجه المجال، \\(\\Phi=EA\\) (أقصى قيمة).</li><li class="hl" id="t5"><b>θ = 90°</b>: المجال يمسّ السطح، \\(\\Phi=0\\).</li><li class="hl" id="t6"><b>θ = 180°</b>: يدخل المجال من «الخلف»، \\(\\Phi=-EA\\).</li></ul>
<div class="note">خطأ شائع: قياس θ من السطح بدل العمودي، فيتبادل cos وsin.</div>
<h2>5. المجال غير المنتظم والأسطح المنحنية</h2><p class="hl" id="t7">إذا تغيّر E أو كان السطح منحنياً، نقسّمه إلى أجزاء صغيرة \\(\\Delta\\vec A_i\\) شبه مستوية في مجال شبه منتظم ونجمع:</p>$$\\Phi_e=\\sum_i \\vec E_i\\cdot\\Delta\\vec A_i$$
<p class="hl" id="t8">في السطح المغلق تُحسب الخطوط الخارجة موجبة والداخلة سالبة، وهذه الفكرة تقود مباشرة إلى <b>قانون غاوس</b> (§11.5).</p>
<h2>6. أمثلة محلولة</h2><p><b>مثال 1.</b> E = 300 N C⁻¹ وA = 0.2 m² وθ = 30°.</p>$$\\Phi=(300)(0.2)\\cos30^\\circ\\approx 52\\ \\mathrm{N\\,m^2\\,C^{-1}}$$
<p><b>مثال 2.</b> بطاقة 10 cm × 10 cm موضوعة أفقياً في مجال رأسي شدته 2000 N C⁻¹ نحو الأعلى، وعموديّها نحو الأعلى.</p>$$\\Phi=(2000)(0.01)\\cos0^\\circ=20\\ \\mathrm{N\\,m^2\\,C^{-1}}$$
<h2>7. القوانين الأساسية</h2>`};

const P=(en,fr,ar)=>({en,fr,ar});const same=a=>({en:a,fr:a,ar:a});
const practice=[
 {id:'f1',type:'num',extra:1,unit:'N m²/C',target:flux(200,0.5,60),lab:{E:200,A:0.5,th:60},
  q:P('E = 200 N/C, A = 0.5 m², θ = 60°. Find the flux.','E = 200 N/C, A = 0,5 m², θ = 60°. Calcule le flux.','E = 200 N/C وA = 0.5 m² وθ = 60°. احسب التدفق.'),
  hints:P(['cos 60° = 0.5'],['cos 60° = 0,5'],['cos 60° = 0.5']),steps:same(['\\(\\Phi=EA\\cos\\theta=200\\times0.5\\times0.5=50\\ \\mathrm{N\\,m^2C^{-1}}\\)'])},
 {id:'f2',type:'mcq',extra:1,q:P('A surface is parallel to the field lines (the lines skim along it). The flux is:','Une surface est parallèle aux lignes de champ. Le flux est :','سطح موازٍ لخطوط المجال (تمسّه الخطوط). يكون التدفق:'),
  opts:P(['Maximum','Zero','Negative','EA/2'],['Maximal','Nul','Négatif','EA/2'],['أقصى','صفر','سالب','EA/2']),ans:1,
  hints:P(['Where does the normal point in that case?','The normal is perpendicular to E: θ = 90°.'],['Où pointe la normale dans ce cas ?','La normale est perpendiculaire à E : θ = 90°.'],['إلى أين يشير العمودي في هذه الحالة؟','العمودي متعامد مع E: θ = 90°.']),
  steps:same(['\\(\\theta=90^\\circ\\Rightarrow\\cos\\theta=0\\Rightarrow\\Phi=0\\)']),mistake:P('Taking θ = 0° because the surface "is along" the field.','Prendre θ = 0° parce que la surface « suit » le champ.','أخذ θ = 0° لأن السطح «على امتداد» المجال.')},
 {id:'f3',type:'num',extra:1,unit:'N m²/C',target:flux(400,0.3,180),lab:{E:400,A:0.3,th:180},
  q:P('E = 400 N/C, A = 0.3 m². The normal points exactly opposite to E. Find Φ (with its sign).','E = 400 N/C, A = 0,3 m². La normale est exactement opposée à E. Calcule Φ (avec son signe).','E = 400 N/C وA = 0.3 m². العمودي معاكس تماماً لـ E. احسب Φ (مع إشارته).'),
  hints:P(['Opposite means θ = 180°.','cos 180° = −1'],['Opposée signifie θ = 180°.','cos 180° = −1'],['المعاكس يعني θ = 180°.','cos 180° = −1']),steps:same(['\\(\\Phi=400\\times0.3\\times(-1)=-120\\ \\mathrm{N\\,m^2C^{-1}}\\)'])},
 {id:'f4',type:'mcq',extra:1,q:P('E is doubled and A is halved. The flux:','E est doublé et A est divisée par deux. Le flux :','ضوعف E ونُصّفت A. التدفق:'),
  opts:P(['doubles','halves','stays the same','becomes 4×'],['double','est divisé par deux','reste identique','est multiplié par 4'],['يتضاعف','ينتصف','يبقى نفسه','يصبح 4 أضعاف']),ans:2,
  hints:P(['Φ is proportional to the product E × A.'],['Φ est proportionnel au produit E × A.'],['Φ يتناسب مع حاصل الضرب E × A.']),steps:same(['\\(\\Phi\'=(2E)(A/2)\\cos\\theta=\\Phi\\)'])},
 {id:'f5',type:'num',extra:1,unit:'°',target:60,tol:.01,
  q:P('E = 500 N/C, A = 0.4 m², Φ = 100 N m²/C. Find θ in degrees (0–90°).','E = 500 N/C, A = 0,4 m², Φ = 100 N m²/C. Trouve θ en degrés (0–90°).','E = 500 N/C وA = 0.4 m² وΦ = 100 N m²/C. أوجد θ بالدرجات (0–90°).'),
  hints:P(['cos θ = Φ / (EA)','cos θ = 100 / 200'],['cos θ = Φ / (EA)','cos θ = 100 / 200'],['cos θ = Φ / (EA)','cos θ = 100 / 200']),steps:same(['\\(\\cos\\theta=\\dfrac{100}{500\\times0.4}=0.5\\Rightarrow\\theta=60^\\circ\\)'])},
 {id:'f6',type:'mcq',extra:1,q:P('A student measures θ = 30° between E and the <b>surface</b> (not the normal). The flux is:','Un élève mesure θ = 30° entre E et la <b>surface</b> (pas la normale). Le flux vaut :','قاس طالب θ = 30° بين E و<b>السطح</b> (لا العمودي). التدفق يساوي:'),
  opts:same(['EA cos 30°','EA sin 30° = EA/2','EA','0']),ans:1,
  hints:P(['The normal is 90° from the surface.','So the angle with the normal is 60°.'],['La normale fait 90° avec la surface.','L’angle avec la normale est donc 60°.'],['العمودي يصنع 90° مع السطح.','إذن الزاوية مع العمودي 60°.']),
  steps:same(['\\(\\theta_n=90^\\circ-30^\\circ=60^\\circ\\)','\\(\\Phi=EA\\cos60^\\circ=EA\\sin30^\\circ=EA/2\\)']),mistake:P('Using the angle with the surface directly in cos.','Utiliser directement l’angle avec la surface dans le cos.','استخدام الزاوية مع السطح مباشرة في cos.')}];

/* ================= MARKUP ================= */
const STEPS=['sA','sB','sC','sD','sE','sF','sG','sH'];
const html=`<div class="wrap"><nav class="path" id="path"></nav></div>
<section class="step hero" id="sA"><div class="wrap"><div class="kicker" data-t="k0"></div><h1 data-t="h0"></h1><div class="ethos" id="ethos"></div>
 <p class="lead hl" id="lA" data-t="p0"></p><canvas id="rain" style="height:300px;background:linear-gradient(180deg,#0b1433,#101a3d)"></canvas><p class="hint" data-t="hint0"></p></div></section>
<section class="step" id="sB"><div class="wrap"><div class="kicker" data-t="kB"></div><h2 data-t="hB"></h2><div class="card"><p class="hl" id="lB" data-t="pB"></p>
 <div class="choices" id="choices"></div><div class="feedback" id="predictFb"></div></div></div></section>
<section class="step" id="sC"><div class="wrap"><div class="kicker" data-t="kC"></div><h2 data-t="hC"></h2><p class="lead hl" id="lC" data-t="pC"></p>
 <div class="guide" id="labGuide" style="display:none;margin-bottom:12px"></div>
 <div class="labwrap" id="labwrap"><div class="stage" id="stage" style="position:relative">
   <div id="v3" style="height:440px;border-radius:16px;overflow:hidden;border:1px solid #22305c;background:radial-gradient(ellipse at 50% 40%,#111b44,#05081a);touch-action:none;position:relative;display:grid;place-items:center;color:#9aa6d4"><span id="ld3">◌ 3D…</span></div>
   <div id="lbls" style="position:absolute;inset:0;pointer-events:none;overflow:hidden;border-radius:16px"></div>
   <button class="ib fsbtn" id="fsBtn" aria-label="Full screen"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/></svg></button>
   <div class="toggles"><button class="ib on" id="tLines" data-t="tLines"></button><button class="ib on" id="tShadow" data-t="tShadow"></button><button class="ib on" id="tLabels" data-t="tLabels"></button><button class="ib" id="tView" data-t="view"></button><button class="btn" id="recordBtn" style="margin-inline-start:auto" data-t="record"></button></div>
   <canvas id="graph"></canvas><div class="hint" data-t="graphHint"></div></div>
  <div class="card"><div class="readout"><div class="ro"><small data-t="roPhi"></small><b id="roPhi">–</b></div><div class="ro"><small data-t="roCos"></small><b id="roCos">–</b></div><div class="ro"><small data-t="roAp"></small><b id="roAp">–</b></div><div class="ro"><small data-t="roN"></small><b id="roN">–</b></div></div>
   <div class="ctrl"><label><span data-t="E"></span> <b id="Ev"></b></label><input type="range" id="E" min="50" max="1000" step="10" value="400"></div>
   <div class="ctrl"><label><span data-t="A"></span> <b id="Av"></b></label><input type="range" id="A" min="0.1" max="2" step="0.05" value="1"></div>
   <div class="ctrl"><label><span data-t="th"></span> <b id="thv"></b></label><input type="range" id="th" min="0" max="180" step="1" value="0">
    <div class="row" style="margin-top:6px;gap:6px">${[0,30,60,90,180].map(a=>`<button class="ib" data-ang="${a}">${a}°</button>`).join('')}<button class="ib" id="flip" data-t="flip"></button></div></div>
   <div class="live" id="live"></div><div class="small muted" id="fallbackMsg" style="display:none;margin-top:8px"></div></div></div></div></section>
<section class="step" id="sD"><div class="wrap"><div class="kicker" data-t="kD"></div><h2 data-t="hD"></h2><p class="lead hl" id="lD" data-t="pD"></p>
 <div class="card"><div class="tscroll" id="recTable"></div><div class="row"><button class="btn ghost sm" id="clearRec" data-t="clear"></button><button class="btn ghost sm" data-go="sC" data-t="back"></button></div></div></div></section>
<section class="step" id="sE"><div class="wrap"><div class="kicker" data-t="kE"></div><h2 data-t="hE"></h2><p class="lead" data-t="pE"></p><div class="card" id="discover"></div></div></section>
<section class="step" id="sF"><div class="wrap"><div class="kicker" data-t="kF"></div><h2 data-t="hF"></h2>
 <div class="card locked" id="fcard"><div class="lockmsg"><span data-t="lockF"></span> <button class="link" id="skipF" data-t="skip"></button></div>
  <div class="unlockable"><p class="hl" id="lF" data-t="pF"></p><div id="bigFormula"></div><div class="soft" id="pieceInfo"></div><div class="note hl" id="lF2" data-t="normalWhy"></div></div></div></div></section>
<section class="step" id="sG"><div class="wrap"><div class="kicker" data-t="kG"></div><h2 data-t="hG"></h2><p class="lead" data-t="pG"></p><div id="chals"></div><div class="feedback" id="chalScore"></div>
 <div class="card" style="margin-top:12px"><p class="hl" id="lG" data-t="apQ"></p><div class="ans"><input class="f" id="apIn" inputmode="decimal" placeholder="Φ"><button class="btn sm" id="apBtn"></button></div><div class="res" id="apRes"></div></div></div></section>
<section class="step" id="sH"><div class="wrap"><div class="kicker" data-t="kH"></div><h2 data-t="hH"></h2><div class="fgrid" id="sumF"></div>
 <div class="card" style="margin-top:14px"><h3 data-t="five"></h3><ul id="sumList"></ul><p class="hl" id="lH" data-t="workedQ"></p><div class="live" id="worked"></div></div>
 <h3 style="margin-top:22px" data-t="realT"></h3><div class="real" id="real"></div>
 <div class="row"><button class="btn" id="pdfB" data-t="pdf2"></button><button class="btn ghost" data-mode="notebook" data-t="toNb"></button><button class="btn ghost" data-mode="textbook" data-t="toTb"></button></div></div></section>`;

/* ================= STATE ================= */
const DEF={E:400,A:1,th:0};
const S={...DEF,lines:true,shadow:true,labels:true,flash:null,flashT:0,on:true,guideStart:null};
const st=()=>PA.store;const phi=()=>flux(S.E,S.A,S.th);

/* ================= A: RAIN THROUGH A HOOP ================= */
function rain(){const c=$('#rain');let W,H,ctx,drops=[],tilt=0,count=0,rate=0,lastT=0,vis=true,drag=null;
 function init(){const f=PA.fit(c);W=f.w;H=f.h;ctx=f.x;drops=Array.from({length:PA.lowEnd?70:140},()=>({x:Math.random()*W,y:Math.random()*H,v:3+Math.random()*2,hit:0}))}
 c.addEventListener('pointerdown',e=>{drag=e.clientX;c.setPointerCapture(e.pointerId)});c.addEventListener('pointermove',e=>{if(drag==null)return;tilt=Math.max(0,Math.min(90,tilt+(e.clientX-drag)*.5));drag=e.clientX});c.addEventListener('pointerup',()=>drag=null);
 PA.visible(c,v=>vis=v);
 function step(tm){requestAnimationFrame(step);if(!W||!vis||PA.mode!=='learn')return;ctx.clearRect(0,0,W,H);ctx.direction='ltr';
  const cx=W/2,cy=H*.58,R=Math.min(W*.32,130),half=R*Math.cos(rad(tilt));   // projected half-width seen by vertical rain
  drops.forEach(d=>{const py=d.y;d.y+=d.v*(PA.reduced?.5:1);if(py<cy&&d.y>=cy&&Math.abs(d.x-cx)<half){count++;d.hit=10}
   if(d.y>H){d.y=-10;d.x=Math.random()*W}ctx.strokeStyle=d.hit>0?'#ffd166':'rgba(140,180,255,.55)';ctx.lineWidth=d.hit>0?2:1.2;ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(d.x,d.y-9);ctx.stroke();if(d.hit>0)d.hit--});
  // hoop as ellipse (vertical radius = R cos tilt), seen slightly from the front
  ctx.strokeStyle='#ff5470';ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(cx,cy,R,Math.max(2,R*.35*Math.cos(rad(tilt))+R*.0),0,0,7);ctx.stroke();
  ctx.save();ctx.translate(cx,cy);ctx.scale(1,1);ctx.restore();
  ctx.fillStyle='rgba(255,209,102,.12)';ctx.fillRect(cx-half,cy-4,half*2,8);
  if(tm-lastT>1000){rate=count;count=0;lastT=tm}
  ctx.fillStyle='#e8ecff';ctx.font='600 15px sans-serif';ctx.textAlign='left';ctx.fillText(`${rate} ${t('dps')}`,14,24);ctx.fillStyle='#9aa6d4';ctx.font='13px sans-serif';ctx.fillText(`${t('tilt')}: ${Math.round(tilt)}°   cos = ${PA.num(cosd(tilt).toFixed(2))}`,14,44)}
 new ResizeObserver(init).observe(c);requestAnimationFrame(step)}

/* ================= C: 3D LAB ================= */
let G=null; // three.js world
async function init3D(){const host=$('#v3');let THREE;
 try{const tc=document.createElement('canvas');if(!(tc.getContext('webgl2')||tc.getContext('webgl')))throw 0;THREE=await import(new URL('vendor/three.module.min.js',document.baseURI).href)}catch(e){return fallback2D()}
 const renderer=new THREE.WebGLRenderer({antialias:!PA.lowEnd,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,PA.lowEnd?1.25:2));const ld=$('#ld3');if(ld)ld.remove();host.style.display='block';host.appendChild(renderer.domElement);renderer.domElement.style.cssText='width:100%;height:100%;display:block;border:0;border-radius:0';
 const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(45,1,.1,100);
 scene.add(new THREE.AmbientLight(0xffffff,.7));const dl=new THREE.DirectionalLight(0xffffff,.9);dl.position.set(3,5,4);scene.add(dl);
 const world=new THREE.Group();scene.add(world);
 // field lines (LineSegments, rebuilt when E or plane changes)
 const lineMat=new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:.9});let lineObj=null;
 // flowing arrowheads (instanced cones)
 const coneGeo=new THREE.ConeGeometry(.035,.12,8);coneGeo.rotateZ(-Math.PI/2);
 const MAXI=PA.lowEnd?900:2400;const cones=new THREE.InstancedMesh(coneGeo,new THREE.MeshBasicMaterial({color:0xffffff}),MAXI);cones.instanceMatrix.setUsage(THREE.DynamicDrawUsage);world.add(cones);
 // surface (double-sided, front = normal side)
 const plane=new THREE.Group();world.add(plane);
 const sq=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshPhongMaterial({color:0x3fa9ff,emissive:0x0b3d78,transparent:true,opacity:.5,side:THREE.DoubleSide,depthWrite:false}));plane.add(sq);
 const edge=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(1,1)),new THREE.LineBasicMaterial({color:0x9fd3ff}));plane.add(edge);
 const grid=new THREE.GridHelper(1,6,0x9fd3ff,0x9fd3ff);grid.rotation.x=Math.PI/2;grid.material.transparent=true;grid.material.opacity=.25;plane.add(grid);
 const nArrow=new THREE.ArrowHelper(new THREE.Vector3(1,0,0),new THREE.Vector3(),1,0xa78bfa,.22,.12);world.add(nArrow);
 // shadow A⊥ on a "screen" perpendicular to E at x = -2.6
 const shadow=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({color:0xffd166,transparent:true,opacity:.28,side:THREE.DoubleSide,depthWrite:false}));shadow.rotation.y=Math.PI/2;shadow.position.x=-2.6;world.add(shadow);
 const shadowEdge=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(1,1)),new THREE.LineBasicMaterial({color:0xffd166}));shadow.add(shadowEdge);
 const screen=new THREE.Mesh(new THREE.PlaneGeometry(3,3),new THREE.MeshBasicMaterial({color:0x2a3566,transparent:true,opacity:.18,side:THREE.DoubleSide,depthWrite:false}));screen.rotation.y=Math.PI/2;screen.position.x=-2.62;world.add(screen);
 // E direction arrow + angle arc
 const eArrow=new THREE.ArrowHelper(new THREE.Vector3(1,0,0),new THREE.Vector3(0,-1.65,0),1.1,0xffd166,.22,.12);world.add(eArrow);
 const arcGeo=new THREE.BufferGeometry();const arc=new THREE.Line(arcGeo,new THREE.LineBasicMaterial({color:0xff5470}));world.add(arc);
 const refLine=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0),new THREE.Vector3(1.1,0,0)]),new THREE.LineDashedMaterial({color:0xffd166,dashSize:.06,gapSize:.05}));refLine.computeLineDistances();world.add(refLine);
 // orbit camera (own controls: small and touch friendly)
 const O={az:-.75,el:.42,dist:7.2};const DEFV={...O};
 function placeCam(){cam.position.set(O.dist*Math.cos(O.el)*Math.sin(O.az),O.dist*Math.sin(O.el),O.dist*Math.cos(O.el)*Math.cos(O.az));cam.lookAt(0,0,0)}
 const ray=new THREE.Raycaster(),ptr=new THREE.Vector2();const pts=new Map();let mode=null,start=null,pinch0=0;
 const el=renderer.domElement;
 const ndc=e=>{const r=el.getBoundingClientRect();ptr.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1)};
 el.addEventListener('pointerdown',e=>{el.setPointerCapture(e.pointerId);pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pts.size===2){mode='pinch';const[a,b]=[...pts.values()];pinch0=Math.hypot(a.x-b.x,a.y-b.y);return}
  ndc(e);ray.setFromCamera(ptr,cam);mode=ray.intersectObject(sq).length?'tilt':'orbit';start={x:e.clientX,y:e.clientY,th:S.th,az:O.az,el:O.el,moved:false};G.dirty=true});
 el.addEventListener('pointermove',e=>{if(!pts.has(e.pointerId))return;pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(mode==='pinch'&&pts.size===2){const[a,b]=[...pts.values()];const d=Math.hypot(a.x-b.x,a.y-b.y);O.dist=Math.max(3.5,Math.min(14,O.dist*pinch0/d));pinch0=d;G.dirty=true;return}
  if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;if(Math.hypot(dx,dy)>4)start.moved=true;if(!start.moved)return;
  if(mode==='tilt'){setTheta(Math.round(Math.max(0,Math.min(180,start.th+dx*.5))))}
  else{O.az=start.az-dx*.008;O.el=Math.max(-1.2,Math.min(1.35,start.el+dy*.006));G.dirty=true}});
 const up=e=>{pts.delete(e.pointerId);if(pts.size<2&&mode==='pinch')mode=null;if(!pts.size){mode=null;start=null}};el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);
 el.addEventListener('wheel',e=>{e.preventDefault();O.dist=Math.max(3.5,Math.min(14,O.dist*(1+Math.sign(e.deltaY)*.08)));G.dirty=true},{passive:false});
 // labels (DOM, projected)
 const L={};['E','n','A','θ','Aperp'].forEach(k=>{const d=document.createElement('div');d.style.cssText='position:absolute;font:700 13px sans-serif;padding:1px 6px;border-radius:6px;background:#070b1acc;transform:translate(-50%,-50%);white-space:nowrap;direction:ltr';$('#lbls').appendChild(d);L[k]=d});
 L.E.style.color='#ffd166';L.n.style.color='#c4b5fd';L.A.style.color='#9fd3ff';L['θ'].style.color='#ff8fa3';L.Aperp.style.color='#ffd166';
 const proj=(v,d)=>{const p=v.clone().project(cam);const r=host.getBoundingClientRect();d.style.left=(p.x+1)/2*r.width+'px';d.style.top=(1-p.y)/2*r.height+'px';d.style.display=S.labels&&p.z<1?'block':'none'};
 G={THREE,renderer,scene,cam,world,plane,sq,nArrow,shadow,shadowEdge,cones,lineMat,arc,arcGeo,eArrow,O,DEFV,placeCam,L,proj,host,dirty:true,lines:[],get lineObj(){return lineObj},set lineObj(v){lineObj=v}};
 new ResizeObserver(()=>{const r=host.getBoundingClientRect();if(r.width<10)return;renderer.setSize(r.width,r.height,false);cam.aspect=r.width/r.height;cam.updateProjectionMatrix();G.dirty=true}).observe(host);
 rebuild();loop3D()}
function rebuild(){if(!G||!G.THREE){paint2D();readouts();return}const{THREE}=G;const s=Math.sqrt(S.A),th=rad(S.th),c=Math.cos(th),sn=Math.sin(th);
 // plane orientation: geometry normal +z, rotation.y = π/2 − θ gives n̂ = (cos θ, 0, sin θ)
 G.plane.rotation.set(0,Math.PI/2-th,0);G.plane.scale.set(s,s,1);G.nArrow.setDirection(new THREE.Vector3(c,0,sn));G.nArrow.setLength(1,.22,.12);
 G.nArrow.setColor(new THREE.Color(S.th>90?0xff5470:0xa78bfa));
 const ap=Math.abs(cosd(S.th));G.shadow.scale.set(Math.max(ap*s,.001),s,1);G.shadow.visible=S.shadow&&ap>.001;
 // field lines: spacing so that lines per m² = E / PER_LINE
 const sp=Math.sqrt(PER_LINE/S.E),half=1.5;const pos=[],col=[],lines=[];const crossTol=1e-9;let nCross=0;
 const N=Math.floor(half/sp);for(let iy=-N;iy<N;iy++)for(let iz=-N;iz<N;iz++){const y=(iy+.5)*sp,z=(iz+.5)*sp;const cross=Math.abs(y)<=s/2&&Math.abs(z)<=s/2*Math.abs(c)+crossTol&&Math.abs(c)>1e-9;if(cross)nCross++;
  pos.push(-3,y,z,3,y,z);const cc=cross?(S.th>90?[1,.33,.44]:[1,.82,.4]):[.16,.22,.45];col.push(...cc,...cc);lines.push({y,z,cross})}
 if(G.lineObj){G.world.remove(G.lineObj);G.lineObj.geometry.dispose()}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));
 G.lineObj=new THREE.LineSegments(g,G.lineMat);G.lineObj.visible=S.lines;G.world.add(G.lineObj);G.lines=lines;G.nCross=nCross;
 const ic=new THREE.Color();lines.forEach((l,i)=>{for(let k=0;k<3;k++){const id=i*3+k;if(id>=G.cones.instanceMatrix.count)break;G.cones.setColorAt(id,ic.set(l.cross?(S.th>90?0xff5470:0xffd166):0x6b86d8))}});if(G.cones.instanceColor)G.cones.instanceColor.needsUpdate=true;
 // angle arc in the xz-plane from E (x axis) to n̂
 const ap2=[];for(let i=0;i<=40;i++){const a=th*i/40;ap2.push(new THREE.Vector3(.55*Math.cos(a),0,.55*Math.sin(a)))}G.arcGeo.setFromPoints(ap2);
 G.dirty=true;readouts()}
function loop3D(){requestAnimationFrame(loop3D);if(!G||!S.on||PA.mode!=='learn')return;const tm=performance.now();
 const anim=S.lines&&!PA.reduced;if(!anim&&!G.dirty&&!(S.flash&&tm-S.flashT<1800))return;
 const{THREE}=G;const m=new THREE.Matrix4(),q=new THREE.Quaternion(),sc=new THREE.Vector3(1,1,1),v=new THREE.Vector3();let n=0;
 if(S.lines){const off=((tm/1000)*.6)%2;G.lines.forEach(l=>{if(!l.cross)return;for(let k=0;k<3;k++){if(n>=G.cones.count)break;const x=-3+((k*2+off)%6);v.set(x,l.y,l.z);m.compose(v,q,sc);G.cones.setMatrixAt(n++,m)}})}
 G.cones.count=Math.min(n,G.cones.instanceMatrix.count);G.cones.instanceMatrix.needsUpdate=true;G.cones.visible=S.lines;
 // flashes from formula pieces
 const f=k=>S.flash===k&&tm-S.flashT<1800?(.5+.5*Math.sin((tm-S.flashT)/90)):0;
 G.sq.material.opacity=.5+f('A')*.4;G.arc.scale.setScalar(1+f('cos')*.5);G.eArrow.setLength(1.1+f('E')*.6,.22,.12);G.shadow.material.opacity=.28+f('Phi')*.5;
 G.placeCam();G.renderer.render(G.scene,G.cam);G.dirty=false;
 const s=Math.sqrt(S.A),th=rad(S.th),n3=new THREE.Vector3(Math.cos(th),0,Math.sin(th));
 G.proj(new THREE.Vector3(.85,-1.65,0),G.L.E);G.L.E.textContent='E';
 G.proj(n3.clone().multiplyScalar(1.05),G.L.n);G.L.n.textContent='n̂';
 G.proj(new THREE.Vector3(-Math.sin(th)*s*.5,s*.55,Math.cos(th)*s*.5),G.L.A);G.L.A.textContent='A = '+PA.num(S.A)+' m²';
 G.proj(new THREE.Vector3(.7*Math.cos(th/2),0,.7*Math.sin(th/2)),G.L['θ']);G.L['θ'].textContent='θ = '+S.th+'°';
 G.proj(new THREE.Vector3(-2.6,s*.5+.15,0),G.L.Aperp);G.L.Aperp.textContent='A⊥ = '+PA.num((s*s*Math.abs(cosd(S.th))).toFixed(2))+' m²';G.L.Aperp.style.display=S.labels&&S.shadow?G.L.Aperp.style.display:'none'}
/* 2D fallback: top view (looking down the y axis) */
function fallback2D(){G={fallback:true};const host=$('#v3');host.innerHTML='<canvas id="fb2d" style="width:100%;height:100%;border:0"></canvas>';$('#fallbackMsg').style.display='block';$('#fallbackMsg').textContent=t('webgl');new ResizeObserver(paint2D).observe(host);paint2D()}
function paint2D(){const c=$('#fb2d');if(!c)return;const{w,h,x:ctx}=PA.fit(c);ctx.clearRect(0,0,w,h);const cx=w/2,cy=h/2,U=Math.min(w,h)/5,s=Math.sqrt(S.A),th=rad(S.th);
 const sp=Math.sqrt(PER_LINE/S.E)*U;for(let y=cy-2*U;y<cy+2*U;y+=sp){const cross=Math.abs(y-cy)<=s/2*U*Math.abs(Math.cos(th));ctx.strokeStyle=cross?'#ffd166':'#3a4a8a';ctx.beginPath();ctx.moveTo(cx-2.5*U,y);ctx.lineTo(cx+2.5*U,y);ctx.stroke()}
 const dx=-Math.sin(th)*s/2*U,dy=Math.cos(th)*s/2*U;ctx.strokeStyle='#3fa9ff';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(cx-dx,cy-dy);ctx.lineTo(cx+dx,cy+dy);ctx.stroke();
 ctx.strokeStyle='#a78bfa';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(th)*U,cy+Math.sin(th)*U);ctx.stroke();ctx.lineWidth=1}
function setTheta(a){S.th=a;$('#th').value=a;rebuild()}
function readouts(){const p=phi();$('#roPhi').textContent=(p<0?'−':'')+PA.num(Math.abs(p).toFixed(1));$('#roPhi').style.color=p<0?'var(--pos)':p>0?'var(--good)':'';
 $('#roCos').textContent=PA.num(cosd(S.th).toFixed(3));$('#roAp').textContent=PA.num((S.A*cosd(S.th)).toFixed(3))+' m²';$('#roN').textContent=G&&G.nCross!=null?String(G.nCross):'–';
 $('#Ev').textContent=S.E+' N/C';$('#Av').textContent=PA.num(S.A)+' m²';$('#thv').textContent=S.th+'°';
 PA.tex($('#live'),`\\Phi=(${S.E})(${PA.num(S.A)})\\cos ${S.th}^\\circ=\\mathbf{${PA.num(p.toFixed(1))}}\\ \\mathrm{N\\,m^2C^{-1}}`);drawGraph()}
function drawGraph(){const c=$('#graph');const{w,h,x:ctx}=PA.fit(c);if(w<10)return;ctx.clearRect(0,0,w,h);ctx.direction='ltr';const pad=30,max=S.E*S.A,X=a=>pad+a/180*(w-pad-10),Y=v=>h/2-(v/max)*(h/2-12);
 ctx.strokeStyle='#2a3566';ctx.beginPath();ctx.moveTo(pad,8);ctx.lineTo(pad,h-8);ctx.moveTo(pad,h/2);ctx.lineTo(w-6,h/2);ctx.stroke();ctx.fillStyle='#6b78ab';ctx.font='11px sans-serif';ctx.fillText('Φ',8,16);ctx.fillText('θ →',w-34,h/2-6);[90,180].forEach(a=>ctx.fillText(a+'°',X(a)-10,h-4));
 ctx.strokeStyle='#a78bfa';ctx.lineWidth=2;ctx.beginPath();for(let a=0;a<=180;a+=2){const v=flux(S.E,S.A,a);a?ctx.lineTo(X(a),Y(v)):ctx.moveTo(X(a),Y(v))}ctx.stroke();
 st().get('recs',[]).forEach(r=>{if(r.E===S.E&&r.A===S.A){ctx.fillStyle='#3ddc97';ctx.beginPath();ctx.arc(X(r.th),Y(r.phi),4,0,7);ctx.fill()}});
 ctx.fillStyle='#ffd166';ctx.shadowColor='#ffd166';ctx.shadowBlur=12;ctx.beginPath();ctx.arc(X(S.th),Y(phi()),6,0,7);ctx.fill();ctx.shadowBlur=0}
function bindLab(){const on=(id,fn)=>$(id).oninput=e=>{fn(+e.target.value);rebuild()};
 on('#E',v=>S.E=v);on('#A',v=>S.A=v);on('#th',v=>S.th=v);
 $$('[data-ang]').forEach(b=>b.onclick=()=>setTheta(+b.dataset.ang));$('#flip').onclick=()=>setTheta(180-S.th);
 const tg=(id,k)=>$(id).onclick=e=>{S[k]=!S[k];e.currentTarget.classList.toggle('on',S[k]);rebuild()};tg('#tLines','lines');tg('#tShadow','shadow');tg('#tLabels','labels');
 $('#tView').onclick=()=>{if(G&&G.O){Object.assign(G.O,G.DEFV);G.dirty=true}};
 $('#recordBtn').onclick=record;$('#clearRec').onclick=()=>{st().set('recs',[]);st().set('disc1',null);st().set('disc',null);paintRecords()};
 $('#fsBtn').onclick=()=>{const w=$('#labwrap');const f=!w.classList.contains('full');w.classList.toggle('full',f);document.body.style.overflow=f?'hidden':'';$('#v3').style.height=f?'min(70vh,640px)':'440px';try{f&&w.requestFullscreen?w.requestFullscreen().catch(()=>{}):document.fullscreenElement&&document.exitFullscreen()}catch(e){}};
 document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement){const w=$('#labwrap');if(w&&w.classList.contains('full')){w.classList.remove('full');document.body.style.overflow='';$('#v3').style.height='440px'}}});
 PA.visible($('#v3'),v=>{S.on=v;if(v&&G)G.dirty=true});
 if(matchMedia('(max-width:640px)').matches)$('#v3').style.height='360px';
 // load Three.js only when the lab comes near the screen
 const io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){io.disconnect();init3D()}},{rootMargin:'600px'});io.observe($('#v3'))}

/* ================= MEASURE / DISCOVER / MISSIONS ================= */
function record(){const recs=st().get('recs',[]);const p=phi();recs.push({E:S.E,A:S.A,th:S.th,phi:p});st().set('recs',recs);PA.toast(t('rec')(recs.length,S.th,PA.num(p.toFixed(1))));paintRecords();paintGuide()}
function recordsTable(){const recs=st().get('recs',[]);if(!recs.length)return'';const th=t('th2');
 return`<table><thead><tr>${th.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${recs.map((r,i)=>{const z=recs.find(x=>x.th===0&&x.E===r.E&&x.A===r.A);return`<tr><td>${i+1}</td><td>${r.E}</td><td>${PA.num(r.A)}</td><td>${r.th}°</td><td>${PA.num(r.phi.toFixed(1))}</td><td>${z&&z.phi?PA.num((r.phi/z.phi).toFixed(2)):'–'}</td></tr>`}).join('')}</tbody></table>`}
function paintRecords(){$('#recTable').innerHTML=recordsTable()||`<p class="empty">${t('noRec')}</p>`;paintDiscover();checkMissions();drawGraph()}
function paintDiscover(){const box=$('#discover');const recs=st().get('recs',[]);const pv=st().get('predict',null);
 if(st().get('disc',null)){box.innerHTML=(pv!=null?`<div class="guide">${pv===2?t('predR'):t('predW')(t('ch')[pv])}</div>`:'')+`<div class="discovery" style="display:block">${t('eGood')}</div><div class="row"><button class="btn sm" data-go="sF">→ ${t('kF')}</button></div>`;return}
 const z=recs.find(r=>r.th===0),s=z&&recs.find(r=>r.th===60&&r.E===z.E&&r.A===z.A);
 if(!s){box.innerHTML=`<div class="guide">${t('eWait')}</div>`;return}
 if(!st().get('disc1',null)){box.innerHTML=`<p>${t('eAsk1')}</p><div class="ans"><input class="f" id="eIn" inputmode="decimal" placeholder="?"><button class="btn sm" id="eBtn">${PA.t('check')}</button></div><div class="res" id="eRes"></div>`;
  $('#eBtn').onclick=()=>{const v=PA.parseNum($('#eIn').value);if(Math.abs(v-.5)<.03){st().set('disc1',true);paintDiscover()}else{$('#eRes').className='res no';$('#eRes').textContent=t('eBad')}};return}
 box.innerHTML=`<p>${t('eAsk2')}</p><div class="opts">${t('fn').map((f,i)=>`<button data-fn="${i}">${f}</button>`).join('')}</div><div class="res" id="eRes"></div>`;
 $$('[data-fn]',box).forEach(b=>b.onclick=()=>{if(+b.dataset.fn===1){st().set('disc',true);paintDiscover();unlockF();checkMissions()}else{b.classList.add('wrong');$('#eRes').className='res no';$('#eRes').textContent=t('fnBad')}})}
function unlockF(){$('#fcard').classList.toggle('locked',!st().get('disc',null)&&!st().get('skipF',false))}
const MIS=[r=>r.some(x=>x.phi===0),r=>r.some(x=>x.phi<0),r=>r.some(a=>r.some(b=>b.E===a.E&&b.th===a.th&&a.phi!==0&&Math.abs(b.A/a.A-2)<.02&&Math.abs(b.phi/a.phi-2)<.03)),()=>!!st().get('disc',null),()=>!!st().get('apply',false)];
function checkMissions(silent){const recs=st().get('recs',[]);const done=new Set(st().get('chal2',[]));MIS.forEach((ok,i)=>{if(!done.has(i)&&ok(recs)){done.add(i);if(!silent)PA.toast(t('mDone')(i+1))}});st().set('chal2',[...done]);
 $('#chals').innerHTML=t('missions').map((m,i)=>`<div class="chal ${done.has(i)?'ok':''}"><div class="tick">${done.has(i)?'✓':i+1}</div><div><b>${m[0]}</b><br><small>${PA.t('hint')}: ${m[1]}</small></div></div>`).join('');
 $('#chalScore').innerHTML=done.size===MIS.length?t('all'):t('score')(done.size,MIS.length)}

/* ================= PREDICT ================= */
function paintPredict(){const v=st().get('predict',null);$('#choices').innerHTML=t('ch').map((c,i)=>`<button class="choice ${v===i?'picked':''}" data-c="${i}">${c}</button>`).join('');
 $$('#choices .choice').forEach(b=>b.onclick=()=>{st().set('predict',+b.dataset.c);paintPredict()});
 $('#predictFb').innerHTML=v!=null?`<p>${v===2?t('fbR'):t('fbO')(t('ch')[v])}</p><button class="btn" id="testBtn">${t('testBtn')}</button>`:t('fb0');const tb=$('#testBtn');if(tb)tb.onclick=startTest}
function startTest(){S.guideStart=st().get('recs',[]).length;L.loadLab({E:400,A:1,th:0});paintGuide()}
function paintGuide(){const g=$('#labGuide');if(S.guideStart==null){g.style.display='none';return}const n=st().get('recs',[]).length-S.guideStart;g.style.display='block';g.innerHTML=n<=0?t('testGuide'):n===1?t('g1'):t('g2');$('#recordBtn').style.boxShadow=n<2?'0 0 0 4px rgba(255,209,102,.35)':''}

/* ================= FORMULA ================= */
const LINK={Phi:'Phi',E:'E',A:'A',cos:'cos'};
function paintFormula(){PA.tex($('#bigFormula'),`\\htmlClass{piece p-Phi}{\\Phi}=\\htmlClass{piece p-E}{E}\\,\\htmlClass{piece p-A}{A}\\,\\htmlClass{piece p-cos}{\\cos\\theta}`);$('#pieceInfo').innerHTML=t('tap');
 Object.keys(LINK).forEach(k=>{const el=$('#bigFormula .p-'+k);if(el)el.addEventListener('click',()=>{$$('#bigFormula .piece').forEach(p=>p.classList.remove('active'));el.classList.add('active');$('#pieceInfo').innerHTML=t('pieces')[k]+` <button class="link" data-go="sC">${t('glow')}</button>`;S.flash=LINK[k];S.flashT=performance.now()+300;if(G)G.dirty=true})})}
function paintSummary(){$('#sumF').innerHTML=PA.formulaCards();PA.paintFormulaMath($('#sumF'));$('#sumList').innerHTML=PA.L(summary).map((s,i)=>`<li class="hl" id="sl${i}">${s}</li>`).join('');
 PA.tex($('#worked'),`\\Phi=(300)(0.2)\\cos30^\\circ\\approx\\mathbf{${PA.num(flux(300,.2,30).toFixed(1))}}\\ \\mathrm{N\\,m^2C^{-1}}`);$('#real').innerHTML=t('real').map((r,i)=>`<div><b>${r[0]}</b><span class="hl" id="rl${i}">${r[1]}</span></div>`).join('')}
function paintPath(cur){const v=new Set(st().get('visited',[]));$('#path').innerHTML=STEPS.map((s,i)=>`<button data-go="${s}" class="${v.has(i)?'done':''} ${i===cur?'now':''}"><b>${v.has(i)?'✓':String.fromCharCode(65+i)}</b>${UI[PA.lang].ethos[i]}</button>`).join('')}

const L={id:'flux',ref:'§11.4',title:{en:'Electric Flux',fr:'Flux électrique',ar:'التدفق الكهربائي'},i18n,formulas,summary,textbook,practice,vault:'vault/flux.enc.json',
 mount(root){root.innerHTML=html;rain();bindLab();$('#skipF').onclick=()=>{st().set('skipF',true);unlockF()};
  $('#apBtn').onclick=()=>{const v=PA.parseNum($('#apIn').value);const ok=Math.abs(v-50)/50<.02;$('#apRes').className='res '+(ok?'ok':'no');$('#apRes').textContent=ok?t('apOk'):t('apNo');if(ok){st().set('apply',true);checkMissions()}};
  $('#pdfB').onclick=PA.openExp;
  const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const i=STEPS.indexOf(e.target.id);const v=new Set(st().get('visited',[]));v.add(i);st().set('visited',[...v]);paintPath(i)}}),{threshold:.3});STEPS.forEach(s=>so.observe($('#'+s)))},
 onLang(){$('#ethos').innerHTML=UI[PA.lang].ethos.map(x=>`<span>${x}</span>`).join('');$('#apBtn').textContent=PA.t('check');paintPath(-1);paintPredict();paintFormula();paintSummary();paintRecords();unlockF();checkMissions(true);readouts()},
 onMode(m){if(m==='learn'&&G)G.dirty=true},onTheme(){},
 progress(){return[[t('progL')[0],st().get('visited',[]).length,8],[t('progL')[1],st().get('chal2',[]).length,MIS.length],[t('progL')[2],st().get('pdone',[]).length,practice.length]]},
 recordsTable,
 loadLab(cfg){PA.setMode('learn');Object.assign(S,cfg);$('#E').value=cfg.E;$('#A').value=cfg.A;$('#th').value=cfg.th;rebuild();setTimeout(()=>PA.go('sC'),60)}};
PA.register(L);
window.FLUX_ENGINE={flux,cosd,PER_LINE,dbg:()=>({on:S.on,G:!!G,dirty:G&&G.dirty,cones:G&&G.cones&&G.cones.count,lines:G&&G.lines&&G.lines.length})};
})();
