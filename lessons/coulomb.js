/* Lesson: Coulomb's Law (Physics 12, Chapter 11, §11.1).
   Schema: id, ref, title, i18n{lang:{key:text}}, formulas[], summary{}, textbook{}, practice[], related{}, vault,
           mount(root), onLang(), progress(), recordsTable(), loadLab(cfg). Physics engine below is shared by lab, examples and grading. */
(function(){
const {$,$$}=PA;const t=k=>PA.t(k);

/* ================= PHYSICS ENGINE (SI units) ================= */
const K=8.9875e9;                                 // N m² C⁻²  (1/4πε0)
const Fmag=(q1,q2,r,er)=>K*Math.abs(q1*q2)/(er*r*r); // magnitude, SI
const Fsigned=(q1,q2,r,er)=>K*q1*q2/(er*r*r);       // >0 repulsion, <0 attraction

/* ================= TEXT ================= */
const i18n={
en:{
 k0:'Chapter 11 · Electrostatics · Lesson 1',h0:'The <em>invisible handshake</em> between charges',
 p0:'Rub a balloon on your hair, then bring it near tiny bits of paper. They jump up and stick to it, even though nothing touches them. <b>Try it:</b> drag the balloon toward the paper.',
 hint0:'👆 Drag the balloon. What pulls the paper up, and why only when the balloon is close?',
 kA:'A · Experience',kB:'B · Predict',kC:'C · Experiment',kD:'D · Measure',kE:'E · Discover',kF:'F · Understand',kG:'G · Apply',kH:'H · Remember',
 hB:'Guess before you touch',pB:'Two small charges sit <b>10 cm</b> apart and push each other with a force <b>F</b>. You move them to <b>20 cm</b>, twice as far. What happens to the force?',
 same:'Stays F',fb0:"Pick one. Being wrong is fine: you'll test it yourself.",fbR:'🎯 Bold prediction: <b>F ÷ 4</b>. Now prove it with real measurements!',fbO:g=>`Your prediction: <b>${g}</b>. Good. Now let the charges decide.`,testBtn:'🧪 Test my prediction in the lab',
 testGuide:'<b>Your experiment:</b> ① tap 📌 Record at 10 cm ② tap <b>×2 distance</b> ③ tap 📌 Record again.',g1:'👍 Force at 10 cm saved. Now tap <b>×2 distance</b>, then 📌 Record.',g2:'🎉 Both measurements saved! <button class="link" data-go="sE">See what you discovered →</button>',
 tDouble:'×2 distance',noFit:'Not enough room: move the charges closer first.',predR:'✅ Your prediction <b>F ÷ 4</b> was right!',predW:g=>`You predicted <b>${g}</b>. The measurements say <b>F ÷ 4</b>. That is science: test, then trust the data.`,
 hC:'The charge lab',pC:'Drag the charges. Change their size, sign and the medium between them. The arrows show the force on <b>each</b> charge.',
 tLines:'Field lines',tFlow:'Flow',tSnap:'Distance = 10 cm',tReset:'↺ Reset',record:'📌 Record',
 graphHint:'Force F against distance r for your charges. The glowing dot is you.',
 roR:'Distance r',roF:'Force |F|',roT:'Interaction',roFx:'F on q₂ (x-component)',q1:'Charge q₁',q2:'Charge q₂',medium:'Medium',
 media:['Vacuum / air (εᵣ = 1)','Teflon (εᵣ ≈ 2.1)','Glass (εᵣ ≈ 5)','Water (εᵣ ≈ 80)'],repel:'Repulsion ↔',attract:'Attraction →←',none:'None',
 hD:'Your measurements',pD:'Keep the same charges. Record at <b>10 cm</b>, <b>20 cm</b> and <b>30 cm</b> (use the "10 cm" button, then drag).',
 noRec:'No records yet. Tap 📌 Record in the lab.',clear:'Clear',back:'↑ Back to lab',
 th:['#','q₁q₂ (µC²)','εᵣ','r (cm)','|F| (N)'],
 hE:'Find the pattern',pE:'Look at your table. Compare a record with the first one.',
 eWait:'Record two measurements with the <b>same charges and medium</b>, where one distance is 2× or 3× the other.',
 eAsk:(a,b,ra,rb,n)=>`Record #${a}: r = ${ra} cm. Record #${b}: r = ${rb} cm. The distance was multiplied by <b>${n}</b>. By what number was the force <b>divided</b>?`,
 eGood:n=>`🤯 <b>Yes!</b> Distance ×${n} → force ÷${n*n}, and ${n}² = ${n*n}. The force falls with the <b>square</b> of the distance. You have discovered the inverse-square law.`,
 eBad:'Not quite. Divide the first force by the second force from your table.',
 eQ2:'Now keep the distance, double one charge and record again. What happens to the force?',
 hF:'Now you\'ve earned the formula',pF:'You found: the force grows with each charge and falls with r². In one line, that is <b>Coulomb\'s Law</b>. Tap each part.',
 lockF:'🔒 Discover the pattern in step E first, or',skip:'skip and show me the law',tap:'👆 Tap a part of the formula.',glow:'✨ see it glow in the lab',
 pieces:{F:'The <b>size of the force</b> on each charge, in newtons (N). Both charges feel the same size of force, in opposite directions (Newton\'s 3rd law).',
  k:'<b>Coulomb\'s constant</b> k = 1/(4πε₀) ≈ 8.99×10⁹ N m² C⁻². Huge, so even microcoulombs give real forces.',
  q:'<b>The charges</b> in coulombs (1 µC = 10⁻⁶ C). The bars |…| mean "size only": the sign tells you the direction, not the strength.',
  er:'<b>Relative permittivity</b> of the medium. Vacuum = 1, water ≈ 80. The medium weakens the force.',
  r:'<b>Distance squared</b>, r in metres. This is your discovery: 2× the distance → ¼ of the force.'},
 hG:'Prove it with measurements',pG:'Missions only complete from <b>your recorded data</b>, not from clicking options.',
 missions:[['Record an attraction.','Opposite signs, then 📌 Record.'],['Record a force of 0.90 N (±3%) in vacuum.','Try q₁ = q₂ = 1 µC at 10 cm.'],['Prove the medium effect: record the same charges at the same distance in air <b>and</b> in another medium. The force ratio must equal εᵣ.','Record in air, change only the medium, record again.'],['Discover the inverse-square law (step E).','Answer the question in step E.'],['Predict, then verify.','Solve the question below, then check it in the lab.']],
 mDone:n=>`✅ Mission ${n} complete!`,score:(n,tt)=>`${n} / ${tt} missions complete`,all:'🏆 <b>All missions done. You own Coulomb\'s Law.</b>',
 diel:(r)=>`Measured: F(air) ÷ F(medium) = ${r}. Compare with εᵣ!`,
 apQ:'Two charges 10 cm apart attract with 3.6 N. Without the lab: what is the force at 30 cm (in N)?',apOk:'✅ Correct! Now set 30 cm in the lab and check it.',apNo:'Not yet. The distance is ×3, so the force is ÷ ?',
 hH:'Summary card',five:'In 5 sentences',realT:'Where you meet it',
 real:[['⚡ Lightning','Charges pile up in clouds until the pull to the ground can rip through the air.'],['🖨️ Photocopiers','Charged toner is pulled onto oppositely charged parts of a drum to form the image.'],['⚛️ Atoms','The same law holds electrons around the nucleus, about 10³⁹ times stronger than gravity.'],['🧑 You','You don\'t sink into your chair because electrons in you and in the chair repel.']],
 pdf2:'📄 Export my booklet (PDF)',toNb:'📓 Open my notebook',toTb:'📖 Full lesson (Textbook)',
 snap:'Distance set to 10 cm',resetT:'Lab reset',rec:(n,r,f)=>`📌 #${n}: r = ${r} cm, |F| = ${f} N`,mediumTxt:e=>`Medium εᵣ = ${e}`,zero:'A charge is zero → no force.',
 pLead:'Questions with progressive hints and full solutions. Missed questions go to your notebook.',extraQ:'Physics Alive question',
 progL:['Learning path','Lab missions','Practice'],workedQ:'Example: +3 µC and −2 µC, 5 cm apart in air. Find the force.'},
fr:{
 k0:'Chapitre 11 · Électrostatique · Leçon 1',h0:'La <em>poignée de main invisible</em> entre les charges',
 p0:'Frotte un ballon sur tes cheveux, puis approche-le de petits morceaux de papier. Ils sautent et s’y collent, sans que rien ne les touche. <b>Essaie :</b> fais glisser le ballon vers le papier.',
 hint0:'👆 Fais glisser le ballon. Qu’est-ce qui soulève le papier, et pourquoi seulement de près ?',
 kA:'A · Vivre',kB:'B · Prédire',kC:'C · Expérimenter',kD:'D · Mesurer',kE:'E · Découvrir',kF:'F · Comprendre',kG:'G · Appliquer',kH:'H · Retenir',
 hB:'Devine avant de toucher',pB:'Deux petites charges sont à <b>10 cm</b> et se repoussent avec une force <b>F</b>. Tu les places à <b>20 cm</b>, deux fois plus loin. Que devient la force ?',
 same:'Reste F',fb0:'Choisis. Se tromper n’est pas grave : tu vas vérifier toi-même.',fbR:'🎯 Prédiction audacieuse : <b>F ÷ 4</b>. Prouve-la par de vraies mesures !',fbO:g=>`Ta prédiction : <b>${g}</b>. Bien. Laissons maintenant les charges décider.`,testBtn:'🧪 Tester ma prédiction au labo',
 testGuide:'<b>Ton expérience :</b> ① touche 📌 Mesurer à 10 cm ② touche <b>×2 distance</b> ③ touche encore 📌 Mesurer.',g1:'👍 Force à 10 cm enregistrée. Touche <b>×2 distance</b>, puis 📌 Mesurer.',g2:'🎉 Les deux mesures sont enregistrées ! <button class="link" data-go="sE">Vois ce que tu as découvert →</button>',
 tDouble:'×2 distance',noFit:'Pas assez de place : rapproche d’abord les charges.',predR:'✅ Ta prédiction <b>F ÷ 4</b> était juste !',predW:g=>`Tu avais prédit <b>${g}</b>. Les mesures disent <b>F ÷ 4</b>. C’est ça la science : tester, puis croire les données.`,
 hC:'Le labo des charges',pC:'Déplace les charges. Change leur valeur, leur signe et le milieu. Les flèches montrent la force sur <b>chaque</b> charge.',
 tLines:'Lignes de champ',tFlow:'Flux',tSnap:'Distance = 10 cm',tReset:'↺ Réinitialiser',record:'📌 Mesurer',
 graphHint:'Force F en fonction de la distance r pour tes charges. Le point lumineux, c’est toi.',
 roR:'Distance r',roF:'Force |F|',roT:'Interaction',roFx:'F sur q₂ (composante x)',q1:'Charge q₁',q2:'Charge q₂',medium:'Milieu',
 media:['Vide / air (εᵣ = 1)','Téflon (εᵣ ≈ 2,1)','Verre (εᵣ ≈ 5)','Eau (εᵣ ≈ 80)'],repel:'Répulsion ↔',attract:'Attraction →←',none:'Aucune',
 hD:'Tes mesures',pD:'Garde les mêmes charges. Mesure à <b>10 cm</b>, <b>20 cm</b> et <b>30 cm</b> (bouton « 10 cm », puis fais glisser).',
 noRec:'Aucune mesure. Touche 📌 Mesurer au labo.',clear:'Effacer',back:'↑ Retour au labo',
 th:['n°','q₁q₂ (µC²)','εᵣ','r (cm)','|F| (N)'],
 hE:'Trouve la règle',pE:'Regarde ton tableau. Compare une mesure avec la première.',
 eWait:'Enregistre deux mesures avec les <b>mêmes charges et le même milieu</b>, l’une à une distance 2× ou 3× plus grande.',
 eAsk:(a,b,ra,rb,n)=>`Mesure n°${a} : r = ${ra} cm. Mesure n°${b} : r = ${rb} cm. La distance a été multipliée par <b>${n}</b>. Par quel nombre la force a-t-elle été <b>divisée</b> ?`,
 eGood:n=>`🤯 <b>Oui !</b> Distance ×${n} → force ÷${n*n}, et ${n}² = ${n*n}. La force diminue avec le <b>carré</b> de la distance. Tu as découvert la loi en inverse du carré.`,
 eBad:'Pas tout à fait. Divise la première force par la seconde dans ton tableau.',
 eQ2:'Garde la distance, double une charge et mesure encore. Que devient la force ?',
 hF:'Tu as mérité la formule',pF:'Tu as trouvé : la force augmente avec chaque charge et diminue avec r². En une ligne, c’est la <b>loi de Coulomb</b>. Touche chaque partie.',
 lockF:'🔒 Découvre d’abord la règle à l’étape E, ou',skip:'passer et voir la loi',tap:'👆 Touche une partie de la formule.',glow:'✨ la voir briller au labo',
 pieces:{F:'L’<b>intensité de la force</b> sur chaque charge, en newtons (N). Les deux charges subissent la même intensité, en sens opposés (3ᵉ loi de Newton).',
  k:'<b>Constante de Coulomb</b> k = 1/(4πε₀) ≈ 8,99×10⁹ N m² C⁻². Énorme : quelques microcoulombs donnent déjà des forces réelles.',
  q:'<b>Les charges</b> en coulombs (1 µC = 10⁻⁶ C). Les barres |…| signifient « valeur seule » : le signe donne le sens, pas l’intensité.',
  er:'<b>Permittivité relative</b> du milieu. Vide = 1, eau ≈ 80. Le milieu affaiblit la force.',
  r:'<b>Distance au carré</b>, r en mètres. C’est ta découverte : distance ×2 → force ÷4.'},
 hG:'Prouve-le par la mesure',pG:'Les missions se valident uniquement avec <b>tes mesures enregistrées</b>.',
 missions:[['Enregistre une attraction.','Signes opposés, puis 📌 Mesurer.'],['Enregistre une force de 0,90 N (±3 %) dans le vide.','Essaie q₁ = q₂ = 1 µC à 10 cm.'],['Prouve l’effet du milieu : mêmes charges, même distance, dans l’air <b>et</b> dans un autre milieu. Le rapport des forces doit valoir εᵣ.','Mesure dans l’air, change seulement le milieu, mesure encore.'],['Découvre la loi en inverse du carré (étape E).','Réponds à la question de l’étape E.'],['Prédire, puis vérifier.','Résous la question ci-dessous, puis vérifie au labo.']],
 mDone:n=>`✅ Mission ${n} réussie !`,score:(n,tt)=>`${n} / ${tt} missions réussies`,all:'🏆 <b>Toutes les missions sont réussies. Tu maîtrises la loi de Coulomb.</b>',
 diel:(r)=>`Mesuré : F(air) ÷ F(milieu) = ${r}. Compare avec εᵣ !`,
 apQ:'Deux charges à 10 cm s’attirent avec 3,6 N. Sans le labo : quelle est la force à 30 cm (en N) ?',apOk:'✅ Exact ! Règle maintenant 30 cm au labo pour vérifier.',apNo:'Pas encore. La distance est ×3, donc la force est ÷ ?',
 hH:'Fiche résumé',five:'En 5 phrases',realT:'Où la rencontres-tu ?',
 real:[['⚡ La foudre','Les charges s’accumulent dans les nuages jusqu’à ce que l’attraction vers le sol traverse l’air.'],['🖨️ Photocopieuses','Le toner chargé est attiré par les zones de charge opposée d’un tambour.'],['⚛️ Les atomes','La même loi retient les électrons autour du noyau, environ 10³⁹ fois plus forte que la gravité.'],['🧑 Toi','Tu ne t’enfonces pas dans ta chaise car les électrons de ton corps et de la chaise se repoussent.']],
 pdf2:'📄 Exporter mon livret (PDF)',toNb:'📓 Ouvrir mon carnet',toTb:'📖 Leçon complète (Cours)',
 snap:'Distance réglée à 10 cm',resetT:'Labo réinitialisé',rec:(n,r,f)=>`📌 n°${n} : r = ${r} cm, |F| = ${f} N`,mediumTxt:e=>`Milieu εᵣ = ${e}`,zero:'Une charge est nulle → aucune force.',
 pLead:'Questions avec indices progressifs et solutions complètes. Les questions ratées vont dans ton carnet.',extraQ:'Question Physics Alive',
 progL:['Parcours','Missions du labo','Exercices'],workedQ:'Exemple : +3 µC et −2 µC à 5 cm dans l’air. Calcule la force.'},
ar:{
 k0:'الفصل 11 · الكهرباء الساكنة · الدرس 1',h0:'<em>المصافحة الخفية</em> بين الشحنات',
 p0:'افرك بالوناً بشعرك ثم قرّبه من قصاصات ورق صغيرة. تقفز وتلتصق به دون أن يلمسها شيء. <b>جرّب:</b> اسحب البالون نحو الورق.',
 hint0:'👆 اسحب البالون. ما الذي يرفع الورق، ولماذا عندما يقترب البالون فقط؟',
 kA:'أ · جرّب',kB:'ب · توقّع',kC:'ج · اختبر',kD:'د · قِس',kE:'هـ · اكتشف',kF:'و · افهم',kG:'ز · طبّق',kH:'ح · تذكّر',
 hB:'خمّن قبل أن تلمس',pB:'شحنتان صغيرتان على بعد <b>10 cm</b> تتنافران بقوة <b>F</b>. تبعدهما إلى <b>20 cm</b>، أي ضعف المسافة. ماذا يحدث للقوة؟',
 same:'تبقى F',fb0:'اختر إجابة. لا بأس بالخطأ: ستتحقق بنفسك.',fbR:'🎯 توقّع جريء: <b>F ÷ 4</b>. أثبته الآن بقياسات حقيقية!',fbO:g=>`توقّعك: <b>${g}</b>. جيد. لندع الشحنات تقرّر الآن.`,testBtn:'🧪 اختبر توقّعي في المختبر',
 testGuide:'<b>تجربتك:</b> ① اضغط 📌 سجّل عند 10 cm ② اضغط <b>×2 المسافة</b> ③ اضغط 📌 سجّل مجدداً.',g1:'👍 حُفظت القوة عند 10 cm. اضغط الآن <b>×2 المسافة</b> ثم 📌 سجّل.',g2:'🎉 حُفظ القياسان! <button class="link" data-go="sE">شاهد ما اكتشفته ←</button>',
 tDouble:'×2 المسافة',noFit:'لا توجد مساحة كافية: قرّب الشحنتين أولاً.',predR:'✅ كان توقّعك <b>F ÷ 4</b> صحيحاً!',predW:g=>`توقّعت <b>${g}</b>. القياسات تقول <b>F ÷ 4</b>. هذا هو العلم: اختبر ثم ثق بالبيانات.`,
 hC:'مختبر الشحنات',pC:'اسحب الشحنات. غيّر مقدارها وإشارتها والوسط بينها. تُظهر الأسهم القوة المؤثرة في <b>كل</b> شحنة.',
 tLines:'خطوط المجال',tFlow:'الحركة',tSnap:'المسافة = 10 cm',tReset:'↺ إعادة ضبط',record:'📌 سجّل',
 graphHint:'القوة F بدلالة المسافة r لشحناتك. النقطة المضيئة هي أنت.',
 roR:'المسافة r',roF:'مقدار القوة |F|',roT:'نوع التأثير',roFx:'القوة على q₂ (المركّبة x)',q1:'الشحنة q₁',q2:'الشحنة q₂',medium:'الوسط',
 media:['فراغ / هواء (εᵣ = 1)','تفلون (εᵣ ≈ 2.1)','زجاج (εᵣ ≈ 5)','ماء (εᵣ ≈ 80)'],repel:'تنافر ↔',attract:'تجاذب →←',none:'لا يوجد',
 hD:'قياساتك',pD:'أبقِ الشحنات نفسها. سجّل عند <b>10 cm</b> و<b>20 cm</b> و<b>30 cm</b> (زر «10 cm» ثم اسحب).',
 noRec:'لا توجد قياسات. اضغط 📌 سجّل في المختبر.',clear:'مسح',back:'↑ العودة إلى المختبر',
 th:['#','q₁q₂ (µC²)','εᵣ','r (cm)','|F| (N)'],
 hE:'اكتشف القاعدة',pE:'انظر إلى جدولك. قارن قياساً بالقياس الأول.',
 eWait:'سجّل قياسين بـ<b>الشحنات والوسط نفسيهما</b>، تكون مسافة أحدهما ضعفي أو ثلاثة أضعاف الآخر.',
 eAsk:(a,b,ra,rb,n)=>`القياس #${a}: r = ${ra} cm. القياس #${b}: r = ${rb} cm. ضُربت المسافة في <b>${n}</b>. على أي عدد <b>قُسمت</b> القوة؟`,
 eGood:n=>`🤯 <b>نعم!</b> المسافة ×${n} ← القوة ÷${n*n}، و${n}² = ${n*n}. تتناقص القوة مع <b>مربع</b> المسافة. لقد اكتشفت قانون التربيع العكسي.`,
 eBad:'ليس تماماً. اقسم القوة الأولى على الثانية من جدولك.',
 eQ2:'أبقِ المسافة، ضاعف إحدى الشحنتين وسجّل مجدداً. ماذا يحدث للقوة؟',
 hF:'لقد استحققت القانون',pF:'وجدت أن القوة تزداد مع كل شحنة وتتناقص مع r². في سطر واحد هذا هو <b>قانون كولوم</b>. اضغط على كل جزء.',
 lockF:'🔒 اكتشف القاعدة أولاً في الخطوة هـ، أو',skip:'تخطَّ وأرني القانون',tap:'👆 اضغط على جزء من القانون.',glow:'✨ شاهده يضيء في المختبر',
 pieces:{F:'<b>مقدار القوة</b> على كل شحنة بالنيوتن (N). تتأثر الشحنتان بالمقدار نفسه وفي اتجاهين متعاكسين (قانون نيوتن الثالث).',
  k:'<b>ثابت كولوم</b> k = 1/(4πε₀) ≈ 8.99×10⁹ N m² C⁻². قيمته ضخمة، لذا تعطي الميكروكولومات قوى حقيقية.',
  q:'<b>الشحنتان</b> بالكولوم (1 µC = 10⁻⁶ C). الخطان |…| يعنيان «المقدار فقط»: الإشارة تحدد الاتجاه لا الشدة.',
  er:'<b>السماحية النسبية</b> للوسط. الفراغ = 1، الماء ≈ 80. الوسط يُضعف القوة.',
  r:'<b>مربع المسافة</b>، وr بالمتر. هذا اكتشافك: ضعف المسافة ← ربع القوة.'},
 hG:'أثبت ذلك بالقياس',pG:'لا تكتمل المهام إلا من <b>بياناتك المسجّلة</b>، لا بمجرد اختيار خيار.',
 missions:[['سجّل حالة تجاذب.','إشارتان مختلفتان ثم 📌 سجّل.'],['سجّل قوة 0.90 N (±3%) في الفراغ.','جرّب q₁ = q₂ = 1 µC عند 10 cm.'],['أثبت تأثير الوسط: الشحنات نفسها والمسافة نفسها في الهواء <b>و</b>في وسط آخر. يجب أن تساوي نسبة القوتين εᵣ.','سجّل في الهواء، غيّر الوسط فقط، ثم سجّل مجدداً.'],['اكتشف قانون التربيع العكسي (الخطوة هـ).','أجب عن سؤال الخطوة هـ.'],['توقّع ثم تحقّق.','حلّ السؤال أدناه ثم تحقّق في المختبر.']],
 mDone:n=>`✅ اكتملت المهمة ${n}!`,score:(n,tt)=>`${n} / ${tt} مهام مكتملة`,all:'🏆 <b>أنجزت كل المهام. أنت تتقن قانون كولوم.</b>',
 diel:(r)=>`القياس: F(هواء) ÷ F(وسط) = ${r}. قارنه بـ εᵣ!`,
 apQ:'شحنتان على بعد 10 cm تتجاذبان بقوة 3.6 N. دون المختبر: ما القوة عند 30 cm (بالنيوتن)؟',apOk:'✅ صحيح! اضبط الآن 30 cm في المختبر وتحقّق.',apNo:'ليس بعد. المسافة ×3، إذن القوة ÷ ؟',
 hH:'بطاقة الملخّص',five:'في 5 جمل',realT:'أين تقابله في الحياة؟',
 real:[['⚡ البرق','تتراكم الشحنات في الغيوم حتى يصبح التجاذب نحو الأرض قادراً على اختراق الهواء.'],['🖨️ آلات النسخ','يُجذب الحبر المشحون إلى أجزاء مشحونة بشحنة معاكسة على أسطوانة لتكوين الصورة.'],['⚛️ الذرات','القانون نفسه يُبقي الإلكترونات حول النواة، وهو أقوى من الجاذبية بنحو 10³⁹ مرة.'],['🧑 أنت','لا تغوص في كرسيك لأن الإلكترونات في جسمك وفي الكرسي تتنافر.']],
 pdf2:'📄 تصدير كتيّبي (PDF)',toNb:'📓 افتح دفتري',toTb:'📖 الدرس الكامل',
 snap:'ضُبطت المسافة على 10 cm',resetT:'أُعيد ضبط المختبر',rec:(n,r,f)=>`📌 #${n}: r = ${r} cm، |F| = ${f} N`,mediumTxt:e=>`الوسط εᵣ = ${e}`,zero:'إحدى الشحنتين صفر ← لا توجد قوة.',
 pLead:'أسئلة مع تلميحات متدرّجة وحلول كاملة. الأسئلة التي تخطئ فيها تذهب إلى دفترك.',extraQ:'سؤال من Physics Alive',
 progL:['مسار التعلّم','مهام المختبر','التمارين'],workedQ:'مثال: +3 µC و−2 µC على بعد 5 cm في الهواء. احسب القوة.'}
};

/* ================= FORMULAS & SUMMARY ================= */
const formulas=[
 {id:'cl',n:{en:"Coulomb's Law",fr:'Loi de Coulomb',ar:'قانون كولوم'},t:"F=\\dfrac{1}{4\\pi\\varepsilon_0\\varepsilon_r}\\,\\dfrac{|q_1q_2|}{r^2}",d:{en:'Magnitude of the force between two point charges.',fr:'Intensité de la force entre deux charges ponctuelles.',ar:'مقدار القوة بين شحنتين نقطيتين.'}},
 {id:'k',n:{en:'Coulomb constant',fr:'Constante de Coulomb',ar:'ثابت كولوم'},t:"k=\\dfrac{1}{4\\pi\\varepsilon_0}=8.99\\times10^{9}\\,\\mathrm{N\\,m^2\\,C^{-2}}",d:{en:'ε₀ = 8.85×10⁻¹² C² N⁻¹ m⁻² (permittivity of free space)',fr:'ε₀ = 8,85×10⁻¹² C² N⁻¹ m⁻² (permittivité du vide)',ar:'ε₀ = 8.85×10⁻¹² C² N⁻¹ m⁻² (سماحية الفراغ)'}},
 {id:'med',n:{en:'Effect of a medium',fr:'Effet du milieu',ar:'تأثير الوسط'},t:"\\dfrac{F_{vacuum}}{F_{medium}}=\\varepsilon_r",d:{en:'εᵣ is dimensionless; εᵣ ≥ 1.',fr:'εᵣ est sans dimension ; εᵣ ≥ 1.',ar:'εᵣ بلا وحدة؛ εᵣ ≥ 1.'}},
 {id:'vec',n:{en:'Vector form',fr:'Forme vectorielle',ar:'الصيغة المتجهة'},t:"\\vec F_{21}=k\\,\\dfrac{q_1q_2}{r^2}\\,\\hat r_{12}=-\\vec F_{12}",d:{en:'Force on q₂ due to q₁; r̂₁₂ points from q₁ to q₂. q₁q₂ > 0 → repulsion.',fr:'Force sur q₂ due à q₁ ; r̂₁₂ va de q₁ vers q₂. q₁q₂ > 0 → répulsion.',ar:'القوة على q₂ بسبب q₁؛ r̂₁₂ من q₁ إلى q₂. q₁q₂ > 0 ← تنافر.'}},
 {id:'qn',n:{en:'Quantization of charge',fr:'Quantification de la charge',ar:'تكمية الشحنة'},t:"q=ne,\\quad e=1.6\\times10^{-19}\\,\\mathrm{C}",d:{en:'n is an integer.',fr:'n est un entier.',ar:'n عدد صحيح.'}}];
const summary={en:['Like charges repel; unlike charges attract.','|F| is proportional to |q₁q₂|.','|F| is inversely proportional to r²: 2× the distance → ¼ of the force.','A medium divides the force by εᵣ (water ≈ 80).','The two forces are equal in magnitude and opposite in direction.'],
 fr:['Charges de même signe : répulsion ; de signes opposés : attraction.','|F| est proportionnelle à |q₁q₂|.','|F| est inversement proportionnelle à r² : distance ×2 → force ÷4.','Un milieu divise la force par εᵣ (eau ≈ 80).','Les deux forces sont de même intensité et de sens opposés.'],
 ar:['الشحنات المتشابهة تتنافر والمختلفة تتجاذب.','|F| تتناسب طردياً مع |q₁q₂|.','|F| تتناسب عكسياً مع r²: ضعف المسافة ← ربع القوة.','الوسط يقسم القوة على εᵣ (الماء ≈ 80).','القوتان متساويتان مقداراً ومتعاكستان اتجاهاً.']};

/* ================= TEXTBOOK MODE: complete lesson written for Physics Alive ================= */
const textbook={
en:`<div class="kicker">§11.1 · Physics 12</div><h1>Coulomb's Law</h1><p class="muted small">${'Explanation written for Physics Alive from the physics of §11.1. Textbook pages: 3–6.'}</p>
<h2>1. Electric charge</h2>
<p class="hl" id="t1">Charge is a property of matter. There are two kinds: <b>positive</b> (carried by protons) and <b>negative</b> (carried by electrons). A neutral atom has equal numbers of both. When you rub a balloon on hair, electrons move from the hair to the balloon: the balloon becomes negative, the hair positive. No charge is created or destroyed. Charge is <b>conserved</b>.</p>
<div class="def"><b>Definition.</b> The SI unit of charge is the <b>coulomb (C)</b>. The smallest free charge is the elementary charge \\(e = 1.6\\times10^{-19}\\ \\mathrm{C}\\).</div>
<p class="hl" id="t2">Charge is <b>quantized</b>: any charge is a whole-number multiple of e.</p>$$q = ne,\\qquad n = 0,\\ \\pm1,\\ \\pm2,\\ \\dots$$
<h2>2. The law</h2>
<div class="def"><b>Coulomb's Law.</b> The force between two point charges is directly proportional to the product of the magnitudes of the charges and inversely proportional to the square of the distance between them. It acts along the line joining them.</div>
$$F = k\\,\\frac{|q_1q_2|}{r^2},\\qquad k=\\frac{1}{4\\pi\\varepsilon_0}=8.99\\times10^{9}\\ \\mathrm{N\\,m^2\\,C^{-2}}$$
<p class="hl" id="t3">Here \\(\\varepsilon_0 = 8.85\\times10^{-12}\\ \\mathrm{C^2\\,N^{-1}\\,m^{-2}}\\) is the permittivity of free space. Coulomb found the law in 1785 using a <b>torsion balance</b>: a thin fibre twists by an amount proportional to the force between two charged spheres.</p>
<h2>3. Direction and Newton's third law</h2>
<p class="hl" id="t4">The magnitude formula gives the size of the force. The direction comes from the signs: if \\(q_1q_2>0\\) the charges repel; if \\(q_1q_2<0\\) they attract. In vector form, with \\(\\hat r_{12}\\) the unit vector from \\(q_1\\) to \\(q_2\\):</p>
$$\\vec F_{21} = k\\,\\frac{q_1q_2}{r^2}\\,\\hat r_{12},\\qquad \\vec F_{12}=-\\vec F_{21}$$
<p class="hl" id="t5">Both charges feel forces of the <b>same magnitude</b>, even if one charge is much bigger. This is Newton's third law.</p>
<h2>4. Charges in a medium</h2>
<p class="hl" id="t6">If the space between the charges is filled with an insulating material (a dielectric), the force becomes smaller by a factor \\(\\varepsilon_r\\), the <b>relative permittivity</b>:</p>
$$F_{medium}=\\frac{1}{4\\pi\\varepsilon_0\\varepsilon_r}\\frac{|q_1q_2|}{r^2}=\\frac{F_{vacuum}}{\\varepsilon_r}$$
<div class="tscroll"><table><tr><th>Medium</th><th>εᵣ</th></tr><tr><td>Vacuum</td><td>1</td></tr><tr><td>Air</td><td>1.0006</td></tr><tr><td>Teflon</td><td>2.1</td></tr><tr><td>Glass</td><td>4.8–10</td></tr><tr><td>Water</td><td>80</td></tr></table></div>
<p class="hl" id="t7">This is why salt dissolves easily in water: the attraction between Na⁺ and Cl⁻ ions becomes about 80 times weaker.</p>
<h2>5. Limits of the law</h2>
<div class="note">The formula is exact for <b>point charges at rest</b>. For charged spheres it still works if r is measured between centres and the charge is spread evenly. For many charges, add the force from each one as vectors (<b>superposition</b>).</div>
<h2>6. Electric vs gravitational force</h2>
<p class="hl" id="t8">Both laws are inverse-square, but the electric force can attract or repel, and it is vastly stronger. Between an electron and a proton the electric force is about \\(2\\times10^{39}\\) times the gravitational force.</p>
<h2>7. Worked examples</h2>
<p><b>Example 1.</b> Charges +3 µC and −2 µC are 5 cm apart in air. Find the force.</p>
$$F=\\frac{(8.99\\times10^9)(3\\times10^{-6})(2\\times10^{-6})}{(0.05)^2}=\\frac{5.39\\times10^{-2}}{2.5\\times10^{-3}}\\approx 21.6\\ \\mathrm{N}\\ \\text{(attractive)}$$
<p><b>Example 2.</b> In hydrogen, the electron is about \\(5.3\\times10^{-11}\\) m from the proton. Find the electric force.</p>
$$F=\\frac{(8.99\\times10^9)(1.6\\times10^{-19})^2}{(5.3\\times10^{-11})^2}\\approx 8.2\\times10^{-8}\\ \\mathrm{N}$$
<h2>8. Key formulas</h2>`,
fr:`<div class="kicker">§11.1 · Physique 12</div><h1>Loi de Coulomb</h1><p class="muted small">Explication rédigée pour Physics Alive à partir de la physique du §11.1. Pages du manuel : 3–6.</p>
<h2>1. La charge électrique</h2>
<p class="hl" id="t1">La charge est une propriété de la matière. Il en existe deux sortes : <b>positive</b> (portée par les protons) et <b>négative</b> (portée par les électrons). Un atome neutre en contient autant de chaque. Quand on frotte un ballon sur les cheveux, des électrons passent des cheveux au ballon : le ballon devient négatif, les cheveux positifs. Aucune charge n’est créée ni détruite : la charge est <b>conservée</b>.</p>
<div class="def"><b>Définition.</b> L’unité SI de charge est le <b>coulomb (C)</b>. La plus petite charge libre est la charge élémentaire \\(e = 1{,}6\\times10^{-19}\\ \\mathrm{C}\\).</div>
<p class="hl" id="t2">La charge est <b>quantifiée</b> : toute charge est un multiple entier de e.</p>$$q = ne,\\qquad n = 0,\\ \\pm1,\\ \\pm2,\\ \\dots$$
<h2>2. La loi</h2>
<div class="def"><b>Loi de Coulomb.</b> L’intensité de la force entre deux charges ponctuelles est proportionnelle au produit des valeurs absolues des charges et inversement proportionnelle au carré de leur distance. Elle agit selon la droite qui les joint.</div>
$$F = k\\,\\frac{|q_1q_2|}{r^2},\\qquad k=\\frac{1}{4\\pi\\varepsilon_0}=8{,}99\\times10^{9}\\ \\mathrm{N\\,m^2\\,C^{-2}}$$
<p class="hl" id="t3">Ici \\(\\varepsilon_0 = 8{,}85\\times10^{-12}\\ \\mathrm{C^2\\,N^{-1}\\,m^{-2}}\\) est la permittivité du vide. Coulomb a établi la loi en 1785 avec une <b>balance de torsion</b> : un fil fin se tord proportionnellement à la force entre deux sphères chargées.</p>
<h2>3. Sens de la force et 3ᵉ loi de Newton</h2>
<p class="hl" id="t4">La formule donne l’intensité. Le sens vient des signes : si \\(q_1q_2>0\\) les charges se repoussent ; si \\(q_1q_2<0\\) elles s’attirent. Sous forme vectorielle, avec \\(\\hat r_{12}\\) le vecteur unitaire de \\(q_1\\) vers \\(q_2\\) :</p>
$$\\vec F_{21} = k\\,\\frac{q_1q_2}{r^2}\\,\\hat r_{12},\\qquad \\vec F_{12}=-\\vec F_{21}$$
<p class="hl" id="t5">Les deux charges subissent des forces de <b>même intensité</b>, même si l’une est bien plus grande. C’est la 3ᵉ loi de Newton.</p>
<h2>4. Charges dans un milieu</h2>
<p class="hl" id="t6">Si l’espace entre les charges est rempli d’un isolant (diélectrique), la force est divisée par \\(\\varepsilon_r\\), la <b>permittivité relative</b> :</p>
$$F_{milieu}=\\frac{1}{4\\pi\\varepsilon_0\\varepsilon_r}\\frac{|q_1q_2|}{r^2}=\\frac{F_{vide}}{\\varepsilon_r}$$
<div class="tscroll"><table><tr><th>Milieu</th><th>εᵣ</th></tr><tr><td>Vide</td><td>1</td></tr><tr><td>Air</td><td>1,0006</td></tr><tr><td>Téflon</td><td>2,1</td></tr><tr><td>Verre</td><td>4,8–10</td></tr><tr><td>Eau</td><td>80</td></tr></table></div>
<p class="hl" id="t7">C’est pourquoi le sel se dissout facilement dans l’eau : l’attraction entre les ions Na⁺ et Cl⁻ devient environ 80 fois plus faible.</p>
<h2>5. Limites de la loi</h2>
<div class="note">La formule est exacte pour des <b>charges ponctuelles immobiles</b>. Pour des sphères chargées uniformément, elle reste valable avec r mesuré entre les centres. Pour plusieurs charges, on additionne les forces vectoriellement (<b>superposition</b>).</div>
<h2>6. Force électrique et gravitation</h2>
<p class="hl" id="t8">Les deux lois sont en inverse du carré, mais la force électrique peut attirer ou repousser et elle est immensément plus forte. Entre un électron et un proton, elle vaut environ \\(2\\times10^{39}\\) fois la force gravitationnelle.</p>
<h2>7. Exemples résolus</h2>
<p><b>Exemple 1.</b> Des charges +3 µC et −2 µC sont à 5 cm dans l’air. Calcule la force.</p>
$$F=\\frac{(8{,}99\\times10^9)(3\\times10^{-6})(2\\times10^{-6})}{(0{,}05)^2}=\\frac{5{,}39\\times10^{-2}}{2{,}5\\times10^{-3}}\\approx 21{,}6\\ \\mathrm{N}\\ \\text{(attractive)}$$
<p><b>Exemple 2.</b> Dans l’hydrogène, l’électron est à environ \\(5{,}3\\times10^{-11}\\) m du proton. Calcule la force électrique.</p>
$$F=\\frac{(8{,}99\\times10^9)(1{,}6\\times10^{-19})^2}{(5{,}3\\times10^{-11})^2}\\approx 8{,}2\\times10^{-8}\\ \\mathrm{N}$$
<h2>8. Formules clés</h2>`,
ar:`<div class="kicker">§11.1 · فيزياء 12</div><h1>قانون كولوم</h1><p class="muted small">شرح مكتوب لـ Physics Alive اعتماداً على فيزياء البند 11.1. صفحات الكتاب: 3–6.</p>
<h2>1. الشحنة الكهربائية</h2>
<p class="hl" id="t1">الشحنة خاصية من خواص المادة، وهي نوعان: <b>موجبة</b> (تحملها البروتونات) و<b>سالبة</b> (تحملها الإلكترونات). تحتوي الذرة المتعادلة على عدد متساوٍ من النوعين. عندما تفرك بالوناً بالشعر تنتقل إلكترونات من الشعر إلى البالون، فيصبح البالون سالباً والشعر موجباً. لا تُخلق الشحنة ولا تفنى: الشحنة <b>محفوظة</b>.</p>
<div class="def"><b>تعريف.</b> وحدة الشحنة في النظام الدولي هي <b>الكولوم (C)</b>. أصغر شحنة حرة هي الشحنة الأولية \\(e = 1.6\\times10^{-19}\\ \\mathrm{C}\\).</div>
<p class="hl" id="t2">الشحنة <b>مكمّاة</b>: أي شحنة هي مضاعف صحيح لـ e.</p>$$q = ne,\\qquad n = 0,\\ \\pm1,\\ \\pm2,\\ \\dots$$
<h2>2. نص القانون</h2>
<div class="def"><b>قانون كولوم.</b> تتناسب القوة بين شحنتين نقطيتين طردياً مع حاصل ضرب مقداري الشحنتين وعكسياً مع مربع المسافة بينهما، وتؤثر على امتداد الخط الواصل بينهما.</div>
$$F = k\\,\\frac{|q_1q_2|}{r^2},\\qquad k=\\frac{1}{4\\pi\\varepsilon_0}=8.99\\times10^{9}\\ \\mathrm{N\\,m^2\\,C^{-2}}$$
<p class="hl" id="t3">حيث \\(\\varepsilon_0 = 8.85\\times10^{-12}\\ \\mathrm{C^2\\,N^{-1}\\,m^{-2}}\\) هي سماحية الفراغ. توصّل كولوم إلى القانون عام 1785 باستخدام <b>ميزان الليّ</b>: خيط رفيع يلتوي بمقدار يتناسب مع القوة بين كرتين مشحونتين.</p>
<h2>3. اتجاه القوة وقانون نيوتن الثالث</h2>
<p class="hl" id="t4">تعطي الصيغة مقدار القوة، أما الاتجاه فتحدده الإشارات: إذا كان \\(q_1q_2>0\\) تتنافر الشحنتان، وإذا كان \\(q_1q_2<0\\) تتجاذبان. بالصيغة المتجهة، حيث \\(\\hat r_{12}\\) متجه الوحدة من \\(q_1\\) إلى \\(q_2\\):</p>
$$\\vec F_{21} = k\\,\\frac{q_1q_2}{r^2}\\,\\hat r_{12},\\qquad \\vec F_{12}=-\\vec F_{21}$$
<p class="hl" id="t5">تتأثر الشحنتان بقوتين <b>متساويتين في المقدار</b> حتى لو كانت إحداهما أكبر بكثير. هذا هو قانون نيوتن الثالث.</p>
<h2>4. الشحنات في وسط</h2>
<p class="hl" id="t6">إذا مُلئ الحيز بين الشحنتين بمادة عازلة (عازل كهربائي) تصغر القوة بمعامل \\(\\varepsilon_r\\)، أي <b>السماحية النسبية</b>:</p>
$$F_{medium}=\\frac{1}{4\\pi\\varepsilon_0\\varepsilon_r}\\frac{|q_1q_2|}{r^2}=\\frac{F_{vacuum}}{\\varepsilon_r}$$
<div class="tscroll"><table><tr><th>الوسط</th><th>εᵣ</th></tr><tr><td>الفراغ</td><td>1</td></tr><tr><td>الهواء</td><td>1.0006</td></tr><tr><td>التفلون</td><td>2.1</td></tr><tr><td>الزجاج</td><td>4.8–10</td></tr><tr><td>الماء</td><td>80</td></tr></table></div>
<p class="hl" id="t7">لهذا يذوب الملح بسهولة في الماء: يصبح التجاذب بين أيونات Na⁺ وCl⁻ أضعف بنحو 80 مرة.</p>
<h2>5. حدود القانون</h2>
<div class="note">الصيغة دقيقة لـ<b>شحنات نقطية ساكنة</b>. وتبقى صالحة للكرات المشحونة بانتظام إذا قيست r بين المركزين. وعند وجود عدة شحنات تُجمع القوى جمعاً متجهياً (<b>مبدأ التراكب</b>).</div>
<h2>6. القوة الكهربائية والجاذبية</h2>
<p class="hl" id="t8">كلا القانونين من نوع التربيع العكسي، لكن القوة الكهربائية قد تكون تجاذباً أو تنافراً وهي أقوى بكثير. بين إلكترون وبروتون تبلغ القوة الكهربائية نحو \\(2\\times10^{39}\\) ضعف قوة الجاذبية.</p>
<h2>7. أمثلة محلولة</h2>
<p><b>مثال 1.</b> شحنتان +3 µC و−2 µC على بعد 5 cm في الهواء. احسب القوة.</p>
$$F=\\frac{(8.99\\times10^9)(3\\times10^{-6})(2\\times10^{-6})}{(0.05)^2}=\\frac{5.39\\times10^{-2}}{2.5\\times10^{-3}}\\approx 21.6\\ \\mathrm{N}\\ \\text{(attractive)}$$
<p><b>مثال 2.</b> في ذرة الهيدروجين يبعد الإلكترون نحو \\(5.3\\times10^{-11}\\) m عن البروتون. احسب القوة الكهربائية.</p>
$$F=\\frac{(8.99\\times10^9)(1.6\\times10^{-19})^2}{(5.3\\times10^{-11})^2}\\approx 8.2\\times10^{-8}\\ \\mathrm{N}$$
<h2>8. القوانين الأساسية</h2>`};

/* ================= PRACTICE (answers computed by the same engine) ================= */
const P=(en,fr,ar)=>({en,fr,ar});
const practice=[
 {id:'p1',type:'mcq',extra:1,q:P('The distance between two charges is <b>tripled</b>. The force becomes:','La distance entre deux charges est <b>triplée</b>. La force devient :','تضاعفت المسافة بين شحنتين <b>ثلاث مرات</b>. تصبح القوة:'),
  opts:{en:['F/3','F/9','3F','9F'],fr:['F/3','F/9','3F','9F'],ar:['F/3','F/9','3F','9F']},ans:1,
  hints:P(['F depends on 1/r².','If r → 3r, then r² → 9r².'],['F dépend de 1/r².','Si r → 3r, alors r² → 9r².'],['F تعتمد على 1/r².','إذا r ← 3r فإن r² ← 9r².']),
  steps:P(['\\(F\\propto 1/r^2\\)','\\(F\'=F/3^2=F/9\\)'],['\\(F\\propto 1/r^2\\)','\\(F\'=F/3^2=F/9\\)'],['\\(F\\propto 1/r^2\\)','\\(F\'=F/3^2=F/9\\)']),
  mistake:P('Answering F/3: forgetting the square.','Répondre F/3 : oublier le carré.','الإجابة F/3: نسيان التربيع.')},
 {id:'p2',type:'num',extra:1,unit:'N',target:Fmag(4e-6,6e-6,0.2,1),lab:{q1:4,q2:6,r:20,er:1},
  q:P('Find the force between +4 µC and +6 µC placed 20 cm apart in vacuum.','Calcule la force entre +4 µC et +6 µC placées à 20 cm dans le vide.','احسب القوة بين +4 µC و+6 µC على بعد 20 cm في الفراغ.'),
  hints:P(['Convert first: 4 µC = 4×10⁻⁶ C, 20 cm = 0.20 m.','\\(F=k|q_1q_2|/r^2\\) with \\(r^2=0.04\\ \\mathrm{m^2}\\).'],['Convertis : 4 µC = 4×10⁻⁶ C, 20 cm = 0,20 m.','\\(F=k|q_1q_2|/r^2\\) avec \\(r^2=0{,}04\\ \\mathrm{m^2}\\).'],['حوّل أولاً: 4 µC = 4×10⁻⁶ C و20 cm = 0.20 m.','\\(F=k|q_1q_2|/r^2\\) مع \\(r^2=0.04\\ \\mathrm{m^2}\\).']),
  steps:P(['\\(q_1q_2=(4\\times10^{-6})(6\\times10^{-6})=2.4\\times10^{-11}\\ \\mathrm{C^2}\\)','\\(F=\\dfrac{8.99\\times10^9\\times2.4\\times10^{-11}}{0.04}\\approx 5.39\\ \\mathrm{N}\\) (repulsion)'],['\\(q_1q_2=2{,}4\\times10^{-11}\\ \\mathrm{C^2}\\)','\\(F\\approx 5{,}39\\ \\mathrm{N}\\) (répulsion)'],['\\(q_1q_2=2.4\\times10^{-11}\\ \\mathrm{C^2}\\)','\\(F\\approx 5.39\\ \\mathrm{N}\\) (تنافر)']),
  mistake:P('Using r = 20 instead of 0.20 m gives an answer 10 000× too small.','Utiliser r = 20 au lieu de 0,20 m donne une réponse 10 000 fois trop petite.','استخدام r = 20 بدل 0.20 m يعطي إجابة أصغر بـ 10000 مرة.')},
 {id:'p3',type:'num',extra:1,unit:'N',target:Fmag(4e-6,6e-6,0.2,5),lab:{q1:4,q2:6,r:20,er:5},
  q:P('Same charges as before (4 µC, 6 µC, 20 cm), now in glass with εᵣ = 5. Find the force.','Mêmes charges (4 µC, 6 µC, 20 cm), maintenant dans du verre avec εᵣ = 5. Calcule la force.','الشحنات نفسها (4 µC، 6 µC، 20 cm) لكن في زجاج εᵣ = 5. احسب القوة.'),
  hints:P(['The medium divides the vacuum force by εᵣ.'],['Le milieu divise la force du vide par εᵣ.'],['الوسط يقسم قوة الفراغ على εᵣ.']),
  steps:P(['\\(F=5.39/5\\approx1.08\\ \\mathrm{N}\\)'],['\\(F=5{,}39/5\\approx1{,}08\\ \\mathrm{N}\\)'],['\\(F=5.39/5\\approx1.08\\ \\mathrm{N}\\)'])},
 {id:'p4',type:'mcq',extra:1,q:P('One charge is doubled <b>and</b> the distance is doubled. The force becomes:','Une charge est doublée <b>et</b> la distance est doublée. La force devient :','ضوعفت إحدى الشحنتين <b>و</b>ضوعفت المسافة. تصبح القوة:'),
  opts:{en:['2F','F','F/2','F/4'],fr:['2F','F','F/2','F/4'],ar:['2F','F','F/2','F/4']},ans:2,
  hints:P(['Charge ×2 → force ×2.','Distance ×2 → force ÷4.'],['Charge ×2 → force ×2.','Distance ×2 → force ÷4.'],['الشحنة ×2 ← القوة ×2.','المسافة ×2 ← القوة ÷4.']),
  steps:P(['\\(F\'=F\\times\\dfrac{2}{2^2}=F/2\\)'],['\\(F\'=F\\times\\dfrac{2}{2^2}=F/2\\)'],['\\(F\'=F\\times\\dfrac{2}{2^2}=F/2\\)'])},
 {id:'p5',type:'num',extra:1,unit:'µC',target:0.03*Math.sqrt(9/K)*1e6,tol:.02,
  q:P('Two <b>equal</b> charges 3 cm apart in air repel with 9 N. Find each charge in µC.','Deux charges <b>égales</b> à 3 cm dans l’air se repoussent avec 9 N. Trouve chaque charge en µC.','شحنتان <b>متساويتان</b> على بعد 3 cm في الهواء تتنافران بقوة 9 N. أوجد كل شحنة بالميكروكولوم.'),
  hints:P(['With q₁ = q₂ = q: \\(F=kq^2/r^2\\).','So \\(q=r\\sqrt{F/k}\\), r = 0.03 m.'],['Avec q₁ = q₂ = q : \\(F=kq^2/r^2\\).','Donc \\(q=r\\sqrt{F/k}\\), r = 0,03 m.'],['مع q₁ = q₂ = q: \\(F=kq^2/r^2\\).','إذن \\(q=r\\sqrt{F/k}\\)، r = 0.03 m.']),
  steps:P(['\\(q=0.03\\sqrt{9/8.99\\times10^9}=0.03\\times3.16\\times10^{-5}\\)','\\(q\\approx9.5\\times10^{-7}\\ \\mathrm{C}=0.95\\ \\mathrm{\\mu C}\\)'],['\\(q\\approx9{,}5\\times10^{-7}\\ \\mathrm{C}=0{,}95\\ \\mathrm{\\mu C}\\)'],['\\(q\\approx9.5\\times10^{-7}\\ \\mathrm{C}=0.95\\ \\mathrm{\\mu C}\\)']),
  mistake:P('Forgetting the square root.','Oublier la racine carrée.','نسيان الجذر التربيعي.')},
 {id:'p6',type:'mcq',extra:1,q:P('q₂ = 3q₁. Compare the force on q₂ with the force on q₁.','q₂ = 3q₁. Compare la force sur q₂ et la force sur q₁.','q₂ = 3q₁. قارن القوة على q₂ بالقوة على q₁.'),
  opts:P(['3 times larger','Equal in size, opposite in direction','3 times smaller','Same direction'],['3 fois plus grande','Même intensité, sens opposés','3 fois plus petite','Même sens'],['أكبر 3 مرات','متساويتان مقداراً ومتعاكستان اتجاهاً','أصغر 3 مرات','بالاتجاه نفسه']),ans:1,
  hints:P(['Think of Newton\'s third law.'],['Pense à la 3ᵉ loi de Newton.'],['فكّر في قانون نيوتن الثالث.']),
  steps:P(['The formula uses the product q₁q₂: it is the same number for both charges.','\\(\\vec F_{12}=-\\vec F_{21}\\)'],['La formule utilise le produit q₁q₂ : c’est le même nombre pour les deux charges.','\\(\\vec F_{12}=-\\vec F_{21}\\)'],['تستخدم الصيغة حاصل الضرب q₁q₂: وهو العدد نفسه للشحنتين.','\\(\\vec F_{12}=-\\vec F_{21}\\)']),
  mistake:P('Thinking the bigger charge "pushes harder".','Penser que la plus grande charge « pousse plus fort ».','الظن بأن الشحنة الأكبر «تدفع أقوى».')},
 {id:'p7',type:'num',extra:1,unit:'N',target:Fmag(1.6e-19,1.6e-19,5.3e-11,1),tol:.03,
  q:P('Electron and proton in hydrogen: r = 5.3×10⁻¹¹ m. Find the electric force (use scientific notation, e.g. 8.2e-8).','Électron et proton de l’hydrogène : r = 5,3×10⁻¹¹ m. Calcule la force électrique (notation scientifique, ex. 8,2e-8).','الإلكترون والبروتون في الهيدروجين: r = 5.3×10⁻¹¹ m. احسب القوة الكهربائية (بالصيغة العلمية مثل 8.2e-8).'),
  hints:P(['Both charges have magnitude e = 1.6×10⁻¹⁹ C.'],['Les deux charges valent e = 1,6×10⁻¹⁹ C en valeur absolue.'],['مقدار كل شحنة e = 1.6×10⁻¹⁹ C.']),
  steps:P(['\\(F=\\dfrac{8.99\\times10^9\\times(1.6\\times10^{-19})^2}{(5.3\\times10^{-11})^2}\\approx8.2\\times10^{-8}\\ \\mathrm{N}\\)'],['\\(F\\approx8{,}2\\times10^{-8}\\ \\mathrm{N}\\)'],['\\(F\\approx8.2\\times10^{-8}\\ \\mathrm{N}\\)'])}];

/* Other Chapter 11 lessons whose formulas can already go into the booklet */
const related={
 flux:{id:'flux',ref:'§11.4',title:{en:'Electric Flux',fr:'Flux électrique',ar:'التدفق الكهربائي'},formulas:[
  {id:'fx',n:{en:'Electric flux',fr:'Flux électrique',ar:'التدفق الكهربائي'},t:"\\Phi_e=\\vec E\\cdot\\vec A=EA\\cos\\theta",d:{en:'θ: angle between E and the surface normal.',fr:'θ : angle entre E et la normale.',ar:'θ: الزاوية بين E والعمودي على السطح.'}},
  {id:'gs',n:{en:'Gauss\'s law',fr:'Théorème de Gauss',ar:'قانون غاوس'},t:"\\Phi_e=\\dfrac{Q}{\\varepsilon_0}",d:{en:'Through any closed surface.',fr:'À travers toute surface fermée.',ar:'عبر أي سطح مغلق.'}}],
  summary:{en:['Flux counts field lines through a surface.','Maximum at θ = 0°, zero at 90°, negative beyond 90°.'],fr:['Le flux compte les lignes de champ traversant une surface.','Maximal à 0°, nul à 90°, négatif au-delà.'],ar:['يقيس التدفق خطوط المجال عبر سطح.','أقصى عند 0°، صفر عند 90°، سالب بعدها.']}},
 rc:{id:'rc',ref:'§11.13',title:{en:'Charging & discharging a capacitor',fr:'Charge et décharge d’un condensateur',ar:'شحن المكثف وتفريغه'},formulas:[
  {id:'tau',n:{en:'Time constant',fr:'Constante de temps',ar:'الثابت الزمني'},t:"\\tau=RC",d:{en:'63.2% charged after one τ.',fr:'63,2 % chargé après un τ.',ar:'يُشحن 63.2% بعد τ واحد.'}},
  {id:'chg',n:{en:'Charging',fr:'Charge',ar:'الشحن'},t:"V=V_0\\left(1-e^{-t/RC}\\right)",d:{en:'',fr:'',ar:''}},
  {id:'dis',n:{en:'Discharging',fr:'Décharge',ar:'التفريغ'},t:"V=V_0\\,e^{-t/RC}",d:{en:'36.8% left after one τ.',fr:'36,8 % restant après un τ.',ar:'يتبقّى 36.8% بعد τ واحد.'}}],
  summary:{en:['Larger R or C → slower charging.','After 5τ the process is practically complete.'],fr:['R ou C plus grand → charge plus lente.','Après 5τ le processus est pratiquement terminé.'],ar:['R أو C أكبر ← شحن أبطأ.','بعد 5τ تكتمل العملية تقريباً.']}}};

/* ================= LEARN MODE MARKUP ================= */
const STEPS=['sA','sB','sC','sD','sE','sF','sG','sH'];
const html=`<div class="wrap"><nav class="path" id="path"></nav></div>
<section class="step hero" id="sA"><div class="wrap"><div class="kicker" data-t="k0"></div><h1 data-t="h0"></h1><div class="ethos" id="ethos"></div>
 <p class="lead hl" id="lA" data-t="p0"></p><canvas id="heroCanvas"></canvas><p class="hint" data-t="hint0"></p></div></section>
<section class="step" id="sB"><div class="wrap"><div class="kicker" data-t="kB"></div><h2 data-t="hB"></h2><div class="card"><p class="hl" id="lB" data-t="pB"></p>
 <div class="choices"><button class="choice" data-v="half">F ÷ 2</button><button class="choice" data-v="quarter">F ÷ 4</button><button class="choice" data-v="same" data-t="same"></button><button class="choice" data-v="double">F × 2</button></div>
 <div class="feedback" id="predictFb"></div></div></div></section>
<section class="step" id="sC"><div class="wrap"><div class="kicker" data-t="kC"></div><h2 data-t="hC"></h2><p class="lead hl" id="lC" data-t="pC"></p>
 <div class="guide" id="labGuide" style="display:none;margin-bottom:12px"></div><div class="labwrap" id="labwrap"><div class="stage"><canvas id="lab"></canvas><button class="ib fsbtn" id="fsBtn" aria-label="Full screen"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/></svg></button>
  <div class="toggles"><button class="ib on" id="tLines" data-t="tLines"></button><button class="ib on" id="tFlow" data-t="tFlow"></button><button class="ib" id="tSnap" data-t="tSnap"></button><button class="ib" id="tDouble" data-t="tDouble"></button><button class="ib" id="tReset" data-t="tReset"></button><button class="btn" id="recordBtn" style="margin-inline-start:auto" data-t="record"></button></div>
  <canvas id="graph"></canvas><div class="hint" data-t="graphHint"></div></div>
 <div class="card"><div class="readout"><div class="ro"><small data-t="roR"></small><b id="roR">–</b></div><div class="ro"><small data-t="roF"></small><b id="roF">–</b></div><div class="ro"><small data-t="roT"></small><b id="roT">–</b></div><div class="ro"><small data-t="roFx"></small><b id="roFx">–</b></div></div>
  <div class="ctrl"><label><span data-t="q1"></span> <b id="q1v"></b></label><input type="range" id="q1" min="-10" max="10" step="0.5" value="2"></div>
  <div class="ctrl"><label><span data-t="q2"></span> <b id="q2v"></b></label><input type="range" id="q2" min="-10" max="10" step="0.5" value="-2"></div>
  <div class="ctrl"><label data-t="medium"></label><select class="f" id="medium"></select></div><div class="live" id="live"></div></div></div></div></section>
<section class="step" id="sD"><div class="wrap"><div class="kicker" data-t="kD"></div><h2 data-t="hD"></h2><p class="lead hl" id="lD" data-t="pD"></p>
 <div class="card"><div class="tscroll" id="recTable"></div><div class="row"><button class="btn ghost sm" id="clearRec" data-t="clear"></button><button class="btn ghost sm" data-go="sC" data-t="back"></button></div></div></div></section>
<section class="step" id="sE"><div class="wrap"><div class="kicker" data-t="kE"></div><h2 data-t="hE"></h2><p class="lead" data-t="pE"></p><div class="card" id="discover"></div></div></section>
<section class="step" id="sF"><div class="wrap"><div class="kicker" data-t="kF"></div><h2 data-t="hF"></h2>
 <div class="card locked" id="fcard"><div class="lockmsg"><span data-t="lockF"></span> <button class="link" id="skipF" data-t="skip"></button></div>
  <div class="unlockable"><p class="hl" id="lF" data-t="pF"></p><div id="bigFormula"></div><div class="soft" id="pieceInfo"></div></div></div></div></section>
<section class="step" id="sG"><div class="wrap"><div class="kicker" data-t="kG"></div><h2 data-t="hG"></h2><p class="lead" data-t="pG"></p><div id="chals"></div><div class="feedback" id="chalScore"></div>
 <div class="card" style="margin-top:12px"><p class="hl" id="lG" data-t="apQ"></p><div class="ans"><input class="f" id="apIn" inputmode="decimal" placeholder="N"><button class="btn sm" id="apBtn"></button></div><div class="res" id="apRes"></div></div></div></section>
<section class="step" id="sH"><div class="wrap"><div class="kicker" data-t="kH"></div><h2 data-t="hH"></h2><div class="fgrid" id="sumF"></div>
 <div class="card" style="margin-top:14px"><h3 data-t="five"></h3><ul id="sumList"></ul><p class="hl" id="lH" data-t="workedQ"></p><div class="live" id="worked"></div></div>
 <h3 style="margin-top:22px" data-t="realT"></h3><div class="real" id="real"></div>
 <div class="row"><button class="btn" id="pdfB" data-t="pdf2"></button><button class="btn ghost" data-mode="notebook" data-t="toNb"></button><button class="btn ghost" data-mode="textbook" data-t="toTb"></button></div></div></section>`;

/* ================= STATE ================= */
const DEF={q1:2,q2:-2,er:1};
const S={...DEF,c:[{x:6,y:0},{x:16,y:0}],lines:true,flow:true,flash:null,flashT:0,on:true};
let Lb={w:0,h:0,s:1},SPAN=26,lines=[];
const st=()=>PA.store;
const dist=()=>Math.hypot(S.c[1].x-S.c[0].x,S.c[1].y-S.c[0].y);         // cm
const F=()=>Fmag(S.q1*1e-6,S.q2*1e-6,dist()/100,S.er);
const Fs=()=>Fsigned(S.q1*1e-6,S.q2*1e-6,dist()/100,S.er);

/* ================= HERO ================= */
function hero(){const c=$('#heroCanvas');let W=0,H=0,ctx,bits=[],drag=false,touched=false,vis=true;const B={x:0,y:90,r:44};
 function init(){const f=PA.fit(c);W=f.w;H=f.h;ctx=f.x;bits=[];for(let i=0;i<(PA.lowEnd?16:26);i++)bits.push({x:W*.45+Math.random()*W*.5,y:H-14,vx:0,vy:0,a:Math.random()*6,s:5+Math.random()*5,stuck:null,col:['#fff','#ffe9a8','#bde0ff','#ffd0dc'][i%4]})}
 const pos=e=>{const r=c.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}};
 c.addEventListener('pointerdown',e=>{const p=pos(e);if(Math.hypot(p.x-B.x,p.y-B.y)<B.r+40){drag=touched=true;c.setPointerCapture(e.pointerId)}});
 c.addEventListener('pointermove',e=>{if(!drag)return;const p=pos(e);B.x=Math.max(B.r,Math.min(W-B.r,p.x));B.y=Math.max(B.r,Math.min(H-70,p.y))});
 c.addEventListener('pointerup',()=>{drag=false});
 PA.visible(c,v=>vis=v);
 function step(tm){requestAnimationFrame(step);if(!W||!vis||PA.mode!=='learn')return;
  if(!touched){B.x=W*.45+Math.sin(tm/1400)*W*.3;B.y=95+Math.sin(tm/900)*25}
  ctx.clearRect(0,0,W,H);const g=ctx.createLinearGradient(0,H-30,0,H);g.addColorStop(0,'#3a2c55');g.addColorStop(1,'#241a38');ctx.fillStyle=g;ctx.fillRect(0,H-22,W,22);
  bits.forEach(b=>{const dx=B.x-b.x,dy=B.y-b.y,d=Math.hypot(dx,dy)||1;
   if(b.stuck){b.x=B.x+b.stuck.x;b.y=B.y+b.stuck.y;if(!drag&&touched&&Math.random()<.002)b.stuck=null;return}
   if(d<230){ctx.strokeStyle=`rgba(255,209,102,${.25*(1-d/230)})`;ctx.setLineDash([3,6]);ctx.lineDashOffset=-tm/40;ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(B.x,B.y);ctx.stroke();ctx.setLineDash([])}
   const f=Math.min(1.4,5200/(d*d));b.vx+=f*dx/d;b.vy+=f*dy/d+.35;b.vx*=.96;b.vy*=.98;b.x+=b.vx;b.y+=b.vy;b.a+=b.vx*.05;
   if(b.y>H-14){b.y=H-14;b.vy*=-.2;b.vx*=.7}b.x=Math.max(4,Math.min(W-4,b.x));
   if(d<B.r+6){const an=Math.atan2(-dy,-dx);b.stuck={x:Math.cos(an)*(B.r+3),y:Math.sin(an)*(B.r+3)};b.vx=b.vy=0}});
  ctx.strokeStyle='#cfd6ff88';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(B.x,B.y+B.r+6);ctx.bezierCurveTo(B.x-12,B.y+B.r+40,B.x+14,B.y+B.r+70,B.x-4,B.y+B.r+100);ctx.stroke();
  const bg=ctx.createRadialGradient(B.x-15,B.y-18,6,B.x,B.y,B.r*1.1);bg.addColorStop(0,'#ff9fb0');bg.addColorStop(.5,'#ff4d6d');bg.addColorStop(1,'#a3123a');ctx.fillStyle=bg;ctx.beginPath();ctx.ellipse(B.x,B.y,B.r*.9,B.r,0,0,7);ctx.fill();
  ctx.fillStyle='#a3123a';ctx.beginPath();ctx.moveTo(B.x-6,B.y+B.r+6);ctx.lineTo(B.x+6,B.y+B.r+6);ctx.lineTo(B.x,B.y+B.r-2);ctx.fill();
  ctx.fillStyle='#ffffff55';ctx.beginPath();ctx.ellipse(B.x-14,B.y-20,7,13,-.5,0,7);ctx.fill();
  ctx.font='bold 15px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
  for(let i=0;i<8;i++){const a=i/8*6.28+tm/3000;ctx.fillStyle='#e3f2ff';ctx.fillText('−',B.x+Math.cos(a)*B.r*.6,B.y+Math.sin(a)*B.r*.66)}
  bits.forEach(b=>{ctx.save();ctx.translate(b.x,b.y);ctx.rotate(b.a);ctx.fillStyle=b.col;ctx.fillRect(-b.s/2,-b.s/3,b.s,b.s*.66);ctx.restore()});
  ctx.fillStyle='#9aa6d4';ctx.font='13px sans-serif';ctx.textAlign='left';ctx.textBaseline='alphabetic';ctx.direction='ltr';ctx.fillText(touched?`${t('stuck')}: ${bits.filter(b=>b.stuck).length}`:t('dragB'),12,22)}
 new ResizeObserver(init).observe(c);requestAnimationFrame(step)}

/* ================= LAB ================= */
const cm2px=p=>({x:p.x*Lb.s,y:Lb.h/2+p.y*Lb.s}),px2cm=p=>({x:p.x/Lb.s,y:(p.y-Lb.h/2)/Lb.s});
const clampC=c=>{const hy=Lb.h/2/Lb.s-1.6;return{x:Math.max(1.6,Math.min(SPAN-1.6,c.x)),y:Math.max(-hy,Math.min(hy,c.y))}};
function placeAt(r){const mid=SPAN/2;S.c=[{x:mid-r/2,y:0},{x:mid+r/2,y:0}]}
function resizeLab(){const c=$('#lab'),f=PA.fit(c);if(f.w<10)return;const first=!Lb.x;SPAN=f.w<600?26:40;Lb={w:f.w,h:f.h,x:f.x,s:f.w/SPAN};if(first)placeAt(10);S.c=S.c.map(clampC);computeLines();update()}
function E(x,y){let ex=0,ey=0;[S.q1,S.q2].forEach((q,i)=>{const p=cm2px(S.c[i]);const dx=x-p.x,dy=y-p.y,r2=dx*dx+dy*dy,r=Math.sqrt(r2);if(r<1)return;ex+=q*dx/(r2*r);ey+=q*dy/(r2*r)});return[ex,ey]}
function computeLines(){lines=[];if(!Lb.x)return;const qs=[S.q1,S.q2];const dir=qs.some(q=>q>0)?1:-1;
 qs.forEach((q,i)=>{if(q*dir<=0)return;const n=Math.max(6,Math.round(Math.abs(q)*(PA.lowEnd?1.4:2.2)));const p0=cm2px(S.c[i]);
  for(let k=0;k<n;k++){const a=k/n*Math.PI*2+.13;let x=p0.x+Math.cos(a)*20,y=p0.y+Math.sin(a)*20;const pts=[[x,y]];
   for(let s=0;s<700;s++){const[ex,ey]=E(x,y);const m=Math.hypot(ex,ey);if(!m)break;x+=dir*ex/m*4;y+=dir*ey/m*4;pts.push([x,y]);
    if(x<-40||y<-40||x>Lb.w+40||y>Lb.h+40)break;const o=cm2px(S.c[1-i]);if(Math.hypot(x-o.x,y-o.y)<16)break}
   lines.push(dir>0?pts:pts.reverse())}})}
function arrow(ctx,x,y,dx,dy,col){const l=Math.hypot(dx,dy);if(l<2)return;const ux=dx/l,uy=dy/l;ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=5;ctx.lineCap='round';ctx.shadowColor=col;ctx.shadowBlur=12;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+dx-ux*10,y+dy-uy*10);ctx.stroke();ctx.beginPath();ctx.moveTo(x+dx,y+dy);ctx.lineTo(x+dx-ux*16-uy*9,y+dy-uy*16+ux*9);ctx.lineTo(x+dx-ux*16+uy*9,y+dy-uy*16-ux*9);ctx.fill();ctx.shadowBlur=0}
function drawLab(tm){const{x:ctx,w,h}=Lb;if(!ctx)return;ctx.clearRect(0,0,w,h);ctx.direction='ltr';
 ctx.strokeStyle='#121a38';ctx.lineWidth=1;for(let i=0;i<=SPAN;i+=2){const X=i*Lb.s;ctx.beginPath();ctx.moveTo(X,0);ctx.lineTo(X,h);ctx.stroke()}
 for(let Y=(h/2)%(2*Lb.s);Y<h;Y+=2*Lb.s){ctx.beginPath();ctx.moveTo(0,Y);ctx.lineTo(w,Y);ctx.stroke()}
 ctx.fillStyle='#3a4677';ctx.font='10px sans-serif';ctx.textAlign='left';for(let i=10;i<SPAN;i+=10)ctx.fillText(i+' cm',i*Lb.s+3,h-6);
 if(S.er>1){ctx.fillStyle=S.er>=80?'rgba(40,120,255,.14)':'rgba(170,140,255,.09)';ctx.fillRect(0,0,w,h)}
 if(S.lines){ctx.lineWidth=1.3;lines.forEach(pts=>{ctx.strokeStyle='rgba(160,180,255,.3)';ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();
  if(S.flow&&!PA.reduced&&pts.length>8)for(let k=0;k<pts.length;k+=26){const p=pts[(k+Math.floor(tm/30))%pts.length];ctx.fillStyle='rgba(255,230,160,.85)';ctx.beginPath();ctx.arc(p[0],p[1],1.8,0,7);ctx.fill()}})}
 const a=cm2px(S.c[0]),b=cm2px(S.c[1]);const fl=k=>S.flash===k&&tm-S.flashT<1800?(.5+.5*Math.sin((tm-S.flashT)/90)):0;
 const fr=fl('r');ctx.strokeStyle=fr?'#ffd166':'#55608f';ctx.lineWidth=fr?3:1.2;ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.setLineDash([]);
 ctx.fillStyle=fr?'#ffd166':'#cfd6ff';ctx.font='600 13px sans-serif';ctx.textAlign='center';ctx.fillText('r = '+PA.num(dist().toFixed(1))+' cm',(a.x+b.x)/2,(a.y+b.y)/2-30);
 const f=F(),fs=Fs();const len=f===0?0:Math.min(Lb.w*.28,24+38*Math.log10(1+f/.005));const dd=Math.hypot(b.x-a.x,b.y-a.y)||1,ux=(b.x-a.x)/dd,uy=(b.y-a.y)/dd;
 // force on q2 points along +u for repulsion (fs>0), -u for attraction; force on q1 is opposite (Newton III)
 const sg=fs>0?1:-1;const col=fl('F')?'#ffffff':'#ffd166';arrow(ctx,b.x,b.y,ux*len*sg,uy*len*sg,col);arrow(ctx,a.x,a.y,-ux*len*sg,-uy*len*sg,col);
 [[a,S.q1,'q1'],[b,S.q2,'q2']].forEach(([p,q,k])=>{const R=14+Math.abs(q)*1.2,neu=q===0,c1=neu?'#888888':q>0?'#ff5470':'#3fa9ff',fq=fl('q');
  const gl=ctx.createRadialGradient(p.x,p.y,R*.3,p.x,p.y,R*2.6+fq*20);gl.addColorStop(0,c1+'aa');gl.addColorStop(1,c1+'00');ctx.fillStyle=gl;ctx.beginPath();ctx.arc(p.x,p.y,R*2.6+fq*20,0,7);ctx.fill();
  const g=ctx.createRadialGradient(p.x-R*.35,p.y-R*.35,2,p.x,p.y,R);g.addColorStop(0,'#fff');g.addColorStop(.35,c1);g.addColorStop(1,neu?'#333':q>0?'#8a0f2a':'#0b3d78');ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,R,0,7);ctx.fill();
  ctx.fillStyle='#fff';ctx.font=`700 ${Math.round(R)}px sans-serif`;ctx.textBaseline='middle';ctx.fillText(neu?'0':q>0?'+':'−',p.x,p.y+1);ctx.textBaseline='alphabetic';
  ctx.font='600 12px sans-serif';ctx.fillStyle='#cfd6ff';ctx.fillText((k==='q1'?'q₁ ':'q₂ ')+(q>0?'+':'')+PA.num(q)+' µC',p.x,p.y+R+18)});
 const fe=fl('er');if(S.er>1||fe){ctx.fillStyle=fe?'#ffd166':'#cfd6ff';ctx.textAlign='left';ctx.font='12px sans-serif';ctx.fillText(t('mediumTxt')(PA.num(S.er)),10,18)}}
function drawGraph(){const c=$('#graph');const{w,h,x:ctx}=PA.fit(c);if(w<10)return;ctx.clearRect(0,0,w,h);ctx.direction='ltr';const pad=28;const q=Math.abs(S.q1*S.q2);
 if(!q){ctx.fillStyle='#9aa6d4';ctx.font='13px sans-serif';ctx.textAlign=PA.lang==='ar'?'right':'left';ctx.direction=PA.lang==='ar'?'rtl':'ltr';ctx.fillText(t('zero'),PA.lang==='ar'?w-12:12,h/2);return}
 const r0=3,r1=SPAN,Fm=Fmag(q*1e-12,1,r0/100,S.er),X=r=>pad+(r-r0)/(r1-r0)*(w-pad-10),Y=f=>h-pad-(f/Fm)*(h-pad-10);
 ctx.strokeStyle='#2a3566';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(pad,8);ctx.lineTo(pad,h-pad);ctx.lineTo(w-6,h-pad);ctx.stroke();ctx.fillStyle='#6b78ab';ctx.font='11px sans-serif';ctx.textAlign='left';ctx.fillText('|F|',6,18);ctx.fillText('r (cm) →',w-62,h-10);
 ctx.strokeStyle='#a78bfa';ctx.lineWidth=2;ctx.beginPath();for(let r=r0;r<=r1;r+=.25){const f=Fmag(q*1e-12,1,r/100,S.er);r===r0?ctx.moveTo(X(r),Y(f)):ctx.lineTo(X(r),Y(f))}ctx.stroke();
 st().get('recs',[]).forEach(rc=>{if(Math.abs(rc.q)===q&&rc.er===S.er&&rc.r>=r0){ctx.fillStyle='#3ddc97';ctx.beginPath();ctx.arc(X(rc.r),Y(rc.F),4,0,7);ctx.fill()}});
 const r=dist();if(r>=r0){ctx.fillStyle='#ffd166';ctx.shadowColor='#ffd166';ctx.shadowBlur=14;ctx.beginPath();ctx.arc(X(r),Y(F()),6,0,7);ctx.fill();ctx.shadowBlur=0}}
function update(){if(!$('#roR'))return;const r=dist(),f=F(),fs=Fs();const ux=(S.c[1].x-S.c[0].x)/r;
 $('#roR').textContent=PA.num(r.toFixed(1))+' cm';$('#roF').textContent=PA.sciTxt(f)+' N';
 $('#roT').textContent=fs>0?t('repel'):fs<0?t('attract'):t('none');$('#roT').style.color=fs>0?'var(--pos)':fs<0?'var(--neg)':'';
 $('#roFx').textContent=(fs*ux>=0?'+':'−')+PA.sciTxt(Math.abs(fs*ux))+' N';
 $('#q1v').textContent=(S.q1>0?'+':'')+PA.num(S.q1)+' µC';$('#q2v').textContent=(S.q2>0?'+':'')+PA.num(S.q2)+' µC';
 PA.tex($('#live'),`|F|=\\frac{(8.99\\times10^{9})\\,|(${PA.sciTex(S.q1*1e-6)})(${PA.sciTex(S.q2*1e-6)})|}{${S.er>1?PA.num(S.er)+'\\,':''}(${PA.sciTex(r/100)})^2}=\\mathbf{${PA.sciTex(f)}\\ N}`);
 drawGraph()}
function bindLab(){const c=$('#lab');let drag=-1,moved=false;
 c.addEventListener('pointerdown',e=>{const r=c.getBoundingClientRect(),p={x:e.clientX-r.left,y:e.clientY-r.top};let best=-1,bd=50;S.c.forEach((cc,i)=>{const q=cm2px(cc),d=Math.hypot(q.x-p.x,q.y-p.y);if(d<bd){bd=d;best=i}});if(best>=0){drag=best;moved=false;c.setPointerCapture(e.pointerId)}});
 c.addEventListener('pointermove',e=>{if(drag<0)return;const r=c.getBoundingClientRect();const cc=clampC(px2cm({x:e.clientX-r.left,y:e.clientY-r.top}));const o=S.c[1-drag];if(Math.hypot(cc.x-o.x,cc.y-o.y)<2.5)return;S.c[drag]=cc;moved=true;computeLines();update()});
 ['pointerup','pointercancel'].forEach(ev=>c.addEventListener(ev,()=>drag=-1));
 $('#q1').oninput=e=>{S.q1=+e.target.value;computeLines();update()};$('#q2').oninput=e=>{S.q2=+e.target.value;computeLines();update()};
 $('#medium').onchange=e=>{S.er=+e.target.value;update()};
 $('#tLines').onclick=e=>{S.lines=!S.lines;e.currentTarget.classList.toggle('on',S.lines)};$('#tFlow').onclick=e=>{S.flow=!S.flow;e.currentTarget.classList.toggle('on',S.flow)};
 $('#tSnap').onclick=()=>{let a={...S.c[0]};if(a.x+10>SPAN-1.6)a.x=SPAN-11.6;S.c=[a,{x:a.x+10,y:a.y}];computeLines();update();PA.toast(t('snap'))};
 $('#tReset').onclick=()=>{Object.assign(S,DEF);$('#q1').value=DEF.q1;$('#q2').value=DEF.q2;$('#medium').value='1';placeAt(10);computeLines();update();PA.toast(t('resetT'))};
 $('#recordBtn').onclick=record;
 $('#tDouble').onclick=()=>{const r=dist()*2;if(r>SPAN-3.4){PA.toast(t('noFit'));return}const a=S.c[0],b=S.c[1],ux=(b.x-a.x)/(r/2),uy=(b.y-a.y)/(r/2);let nb={x:a.x+ux*r,y:a.y+uy*r};
  if(nb.x<1.6||nb.x>SPAN-1.6||Math.abs(nb.y)>Lb.h/2/Lb.s-1.6){placeAt(r)}else S.c[1]=nb;computeLines();update()};$('#clearRec').onclick=()=>{st().set('recs',[]);st().set('disc',null);paintRecords()};
 $('#fsBtn').onclick=toggleFs;document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#labwrap').classList.contains('full'))toggleFs()});
 PA.visible(c,v=>S.on=v);
 (function loop(tm){requestAnimationFrame(loop);if(S.on&&PA.mode==='learn')drawLab(tm)})(0);
 new ResizeObserver(resizeLab).observe(c);new ResizeObserver(()=>Lb.x&&drawGraph()).observe($('#graph'))}
function toggleFs(){const w=$('#labwrap');const on=!w.classList.contains('full');w.classList.toggle('full',on);document.body.style.overflow=on?'hidden':'';
 try{if(on&&w.requestFullscreen)w.requestFullscreen().catch(()=>{});else if(!on&&document.fullscreenElement)document.exitFullscreen()}catch(e){}}
document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement){const w=$('#labwrap');if(w&&w.classList.contains('full')){w.classList.remove('full');document.body.style.overflow=''}}});

/* ================= MEASURE / DISCOVER / MISSIONS ================= */
function record(){const recs=st().get('recs',[]);const f=F();recs.push({q:S.q1*S.q2,r:+dist().toFixed(2),F:f,er:S.er});st().set('recs',recs);PA.toast(t('rec')(recs.length,PA.num(dist().toFixed(1)),PA.sciTxt(f)));paintRecords();paintGuide()}
function recordsTable(){const recs=st().get('recs',[]);if(!recs.length)return'';const th=t('th');
 return`<table><thead><tr>${th.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${recs.map((r,i)=>`<tr><td>${i+1}</td><td>${PA.num(r.q.toFixed(1))}</td><td>${PA.num(r.er)}</td><td>${PA.num(r.r.toFixed(1))}</td><td>${PA.sciTxt(r.F)}</td></tr>`).join('')}</tbody></table>`}
function findPair(){const recs=st().get('recs',[]);for(let i=0;i<recs.length;i++)for(let j=0;j<recs.length;j++){const a=recs[i],b=recs[j];if(i===j||a.q!==b.q||a.er!==b.er||!a.F)continue;const n=b.r/a.r;if(n>1.5&&Math.abs(n-Math.round(n))<.06)return[i,j,a,b]}return null}
function paintRecords(){$('#recTable').innerHTML=recordsTable()||`<p class="empty">${t('noRec')}</p>`;paintDiscover();checkMissions();drawGraph()}
function paintDiscover(){const box=$('#discover');const d=st().get('disc',null);
 if(d){const pv=st().get('predict',null);box.innerHTML=(pv?`<div class="guide">${pv==='quarter'?t('predR'):t('predW')(guessTxt(pv))}</div>`:'')+`<div class="discovery" style="display:block">${t('eGood')(d)}</div><div class="guide">${t('eQ2')}</div><div class="row"><button class="btn sm" data-go="sF">→ ${t('kF')}</button></div>`;return}
 const p=findPair();if(!p){box.innerHTML=`<div class="guide">${t('eWait')}</div>`;return}
 const[i,j,a,b]=p;box.innerHTML=`<p>${t('eAsk')(i+1,j+1,PA.num(a.r.toFixed(1)),PA.num(b.r.toFixed(1)),Math.round(b.r/a.r))}</p><div class="ans"><input class="f" id="eIn" inputmode="decimal" placeholder="÷ ?"><button class="btn sm" id="eBtn">${PA.t('check')}</button></div><div class="res" id="eRes"></div>`;
 $('#eBtn').onclick=()=>{const v=PA.parseNum($('#eIn').value),n=Math.round(b.r/a.r),ratio=a.F/b.F;if(Math.abs(v-ratio)/ratio<.06){st().set('disc',n);paintDiscover();unlockF();checkMissions()}else{$('#eRes').className='res no';$('#eRes').textContent=t('eBad')}}}
function unlockF(){$('#fcard').classList.toggle('locked',!st().get('disc',null)&&!st().get('skipF',false))}
const MIS=[
 r=>r.some(x=>x.q<0),
 r=>r.some(x=>x.er===1&&Math.abs(x.F-.9)/.9<=.03),
 r=>r.some(a=>a.er===1&&r.some(b=>b.er>1&&b.q===a.q&&Math.abs(b.r-a.r)<.3&&Math.abs(a.F/b.F-b.er)/b.er<.05)),
 ()=>!!st().get('disc',null),
 ()=>!!st().get('apply',false)];
function checkMissions(silent){const recs=st().get('recs',[]);const done=new Set(st().get('chal2',[]));const ms=t('missions');
 MIS.forEach((ok,i)=>{if(!done.has(i)&&ok(recs)){done.add(i);if(!silent)PA.toast(t('mDone')(i+1))}});st().set('chal2',[...done]);
 let dielMsg='';const a=recs.find(x=>x.er===1),b=a&&recs.find(x=>x.er>1&&x.q===a.q&&Math.abs(x.r-a.r)<.3);if(a&&b)dielMsg=`<div class="small muted">${t('diel')(PA.num((a.F/b.F).toFixed(1)))}</div>`;
 $('#chals').innerHTML=ms.map((m,i)=>`<div class="chal ${done.has(i)?'ok':''}"><div class="tick">${done.has(i)?'✓':i+1}</div><div><b>${m[0]}</b><br><small>${PA.t('hint')}: ${m[1]}</small>${i===2?dielMsg:''}</div></div>`).join('');
 $('#chalScore').innerHTML=done.size===MIS.length?t('all'):t('score')(done.size,MIS.length)}

/* ================= FORMULA BUILDER ================= */
const LINK={F:'F',k:null,q:'q',er:'er',r:'r'};
function paintFormula(){PA.tex($('#bigFormula'),`\\htmlClass{piece p-F}{F}=\\htmlClass{piece p-k}{k}\\,\\dfrac{\\htmlClass{piece p-q}{|q_1q_2|}}{\\htmlClass{piece p-er}{\\varepsilon_r}\\,\\htmlClass{piece p-r}{r^2}}`);$('#pieceInfo').innerHTML=t('tap');
 Object.keys(LINK).forEach(key=>{const el=$('#bigFormula .p-'+key);if(el)el.addEventListener('click',()=>{$$('#bigFormula .piece').forEach(p=>p.classList.remove('active'));el.classList.add('active');$('#pieceInfo').innerHTML=t('pieces')[key]+(LINK[key]?` <button class="link" data-go="sC">${t('glow')}</button>`:'');if(LINK[key]){S.flash=LINK[key];S.flashT=performance.now()+300}})})}

/* ================= SUMMARY ================= */
function paintSummary(){$('#sumF').innerHTML=PA.formulaCards();PA.paintFormulaMath($('#sumF'));
 $('#sumList').innerHTML=PA.L(summary).map((s,i)=>`<li class="hl" id="sl${i}">${s}</li>`).join('');
 const f=Fmag(3e-6,2e-6,.05,1);PA.tex($('#worked'),`F=\\frac{(8.99\\times10^9)(3\\times10^{-6})(2\\times10^{-6})}{(0.05)^2}\\approx\\mathbf{${PA.sciTex(f)}\\ N}`);
 $('#real').innerHTML=t('real').map((r,i)=>`<div><b>${r[0]}</b><span class="hl" id="rl${i}">${r[1]}</span></div>`).join('')}

/* ================= PATH (journey nav) ================= */
function paintPath(cur){const v=new Set(st().get('visited',[]));$('#path').innerHTML=STEPS.map((s,i)=>`<button data-go="${s}" class="${v.has(i)?'done':''} ${i===cur?'now':''}"><b>${v.has(i)?'✓':String.fromCharCode(65+i)}</b>${UI[PA.lang].ethos[i]}</button>`).join('')}

/* ================= LESSON OBJECT ================= */
const L={id:'coulomb',ref:'§11.1',title:{en:"Coulomb's Law",fr:'Loi de Coulomb',ar:'قانون كولوم'},i18n,formulas,summary,textbook,practice,related,vault:'vault/coulomb.enc.json',
 mount(root){root.innerHTML=html;hero();bindLab();
  $$('.choice',root).forEach(b=>b.onclick=()=>{st().set('predict',b.dataset.v);paintPredict()});
  $('#skipF').onclick=()=>{st().set('skipF',true);unlockF()};
  $('#apBtn').onclick=()=>{const v=PA.parseNum($('#apIn').value);const ok=Math.abs(v-0.4)/0.4<.03;$('#apRes').className='res '+(ok?'ok':'no');$('#apRes').textContent=ok?t('apOk'):t('apNo');if(ok){st().set('apply',true);checkMissions()}};
  $('#pdfB').onclick=PA.openExp;
  const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const i=STEPS.indexOf(e.target.id);const v=new Set(st().get('visited',[]));v.add(i);st().set('visited',[...v]);paintPath(i)}}),{threshold:.3});
  STEPS.forEach(s=>so.observe($('#'+s)))},
 onLang(){$('#ethos').innerHTML=UI[PA.lang].ethos.map(x=>`<span>${x}</span>`).join('');
  $('#medium').innerHTML=t('media').map((m,i)=>`<option value="${[1,2.1,5,80][i]}">${m}</option>`).join('');$('#medium').value=String(S.er);
  $('#apBtn').textContent=PA.t('check');paintPath(-1);paintPredict();paintFormula();paintSummary();paintRecords();unlockF();checkMissions(true);update()},
 onMode(m){if(m==='learn'){resizeLab()}},
 progress(){return[[t('progL')[0],st().get('visited',[]).length,8],[t('progL')[1],st().get('chal2',[]).length,MIS.length],[t('progL')[2],st().get('pdone',[]).length,practice.length]]},
 recordsTable,
 loadLab(cfg){PA.setMode('learn');Object.assign(S,{q1:cfg.q1,q2:cfg.q2,er:cfg.er});$('#q1').value=cfg.q1;$('#q2').value=cfg.q2;$('#medium').value=String(cfg.er);
  setTimeout(()=>{resizeLab();placeAt(Math.min(cfg.r,SPAN-4));computeLines();update();PA.go('sC')},60)}};
const GUESS={half:'F ÷ 2',quarter:'F ÷ 4',double:'F × 2'};const guessTxt=v=>GUESS[v]||t('same');
function paintPredict(){const v=st().get('predict',null);$$('.choice').forEach(b=>b.classList.toggle('picked',b.dataset.v===v));
 $('#predictFb').innerHTML=v?`<p>${v==='quarter'?t('fbR'):t('fbO')(guessTxt(v))}</p><button class="btn" id="testBtn">${t('testBtn')}</button>`:t('fb0');
 const tb=$('#testBtn');if(tb)tb.onclick=startTest}
function startTest(){S.guideStart=st().get('recs',[]).length;L.loadLab({q1:2,q2:2,r:10,er:1});paintGuide()}
function paintGuide(){const g=$('#labGuide');if(S.guideStart==null){g.style.display='none';return}const n=st().get('recs',[]).length-S.guideStart;g.style.display='block';g.innerHTML=n<=0?t('testGuide'):n===1?t('g1'):t('g2');
 $('#recordBtn').style.boxShadow=n<2?'0 0 0 4px rgba(255,209,102,.35)':'';$('#tDouble').classList.toggle('on',n===1)}

PA.register(L);
window.COULOMB_ENGINE={K,Fmag,Fsigned}; // exposed for automated tests
})();
