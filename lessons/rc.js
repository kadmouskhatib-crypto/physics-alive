/* Lesson: Charging and discharging a capacitor (Physics 12, §11.13). Same schema as the other lessons.
   Single-pole double-throw switch: position A = battery–R–C loop (charging), position B = C–R loop without battery (discharging).
   Starting from any capacitor voltage v_s:
     charging    V_C(t) = V0 + (v_s − V0) e^(−t/RC),  I = (V0 − V_C)/R  (≥ 0)
     discharging V_C(t) = v_s e^(−t/RC),              I = −V_C/R       (opposite direction)   */
(function(){
const {$,$$}=PA;const t=k=>PA.t(k);

/* ================= PHYSICS ENGINE (SI) ================= */
function state(c,time){const tau=c.R*c.C,e=Math.exp(-time/tau);const Vc=c.mode==='charge'?c.V0+(c.vs-c.V0)*e:c.vs*e;
 const I=c.mode==='charge'?(c.V0-Vc)/c.R:-Vc/c.R;return{tau,Vc,I,VR:I*c.R,Q:c.C*Vc,U:.5*c.C*Vc*Vc,frac:c.mode==='charge'?(c.V0===c.vs?1:(Vc-c.vs)/(c.V0-c.vs)):(c.vs?Vc/c.vs:0)}}

/* ================= TEXT ================= */
const i18n={
en:{k0:'Chapter 11 · Electrostatics · Lesson 5',h0:'Why charging starts <em>fast</em> and ends <em>slow</em>',
 p0:'Fill a tank through a thin pipe from a high reservoir. At first water rushes in. As the tank fills, the push gets weaker and the flow slows. <b>Drag the tap</b> to make the pipe wider or narrower.',
 hint0:'👆 Drag the tap left/right. Then tap the tank to empty it and watch again.',level:'level',flowL:'flow',
 kA:'A · Experience',kB:'B · Predict',kC:'C · Experiment',kD:'D · Measure',kE:'E · Discover',kF:'F · Understand',kG:'G · Apply',kH:'H · Remember',
 hB:'Guess before you switch',pB:'A capacitor charges through a resistor from a 12 V battery. After a time <b>τ = RC</b> (the "time constant"), the capacitor voltage has reached:',
 ch:['50 % of 12 V','63 % of 12 V','90 % of 12 V','100 % of 12 V'],fb0:'Pick one. Then test it.',fbR:'🎯 Sharp: <b>63 %</b>. Prove it!',fbO:g=>`Your prediction: <b>${g}</b>. Let the circuit decide.`,testBtn:'🧪 Test my prediction in the lab',
 testGuide:'<b>Your experiment:</b> ① tap <b>⏭ t = τ</b> ② 📌 Record. Look at the % column.',g1:'🎉 Saved! <button class="link" data-go="sE">See what you discovered →</button>',g2:'🎉 Saved! <button class="link" data-go="sE">See what you discovered →</button>',
 predR:'✅ Your prediction <b>63 %</b> was right!',predW:g=>`You predicted <b>${g}</b>. The measurement says <b>63.2 %</b>, the same for every R and C.`,
 hC:'The RC circuit lab',pC:'Flip the <b>switch</b>: A charges the capacitor from the battery, B lets it discharge through the resistor. Play, pause, scrub through time and compare runs.',
 Rw:'Resistance R',Cw:'Capacitance C',Vw:'Battery V₀',sw:'⇅ Switch',swA:'A · Charging',swB:'B · Discharging',play:'▶ Play',pause:'⏸ Pause',reset:'↺ Reset',tau:'⏭ t = τ',scrub:'Time t',record:'📌 Record',
 roT:'t',roTau:'τ = RC',roVc:'V_C',roVr:'V_R',roI:'I',roQ:'Q',roU:'U',roFrac:'% of change',
 gV:'V_C',gI:'I',gQ:'Q',gU:'U',runsNote:'Faint curves = your previous runs. Dashed line = t = τ.',
 hD:'Your measurements',pD:'Record at t = τ, 2τ, 5τ while charging and discharging. Try different R and C.',th2:['#','Mode','R (kΩ)','C (µF)','τ (s)','t (s)','t/τ','V_C (V)','%'],noRec:'No records yet. Tap 📌 Record in the lab.',clear:'Clear',back:'↑ Back to lab',
 charge:'charging',discharge:'discharging',
 hE:'Find the pattern',pE:'Compare your records at t = τ.',eWait:'While <b>charging</b>, tap <b>⏭ t = τ</b> and 📌 Record.',
 eAsk1:'From your table: at t = τ the capacitor reached what fraction of its full change? (e.g. 0.6)',eBad:'Read the % column for your record at t = τ.',
 eWait2:'Now <b>double R</b> (keep C), charge again and use the time slider to find when the % column reaches 63 %. Record there.',
 eAsk2:'You doubled R and the 63 % moment came twice as late. The time constant is…',fn:['R + C','R × C','R ÷ C','C ÷ R'],fnBad:'Doubling R doubled the time. Missions will show the same for C.',
 eGood:'🤯 <b>You discovered it!</b> After τ = RC the capacitor always completes <b>63.2 %</b> of its change (1 − e⁻¹). Bigger R or bigger C → slower.',
 hF:'Now you\'ve earned the formulas',pF:'Tap each part of the charging law.',lockF:'🔒 Discover the pattern in step E first, or',skip:'skip and show me the law',tap:'👆 Tap a part.',glow:'✨ see it in the lab',
 pieces:{V:'<b>Capacitor voltage</b> at time t.',V0:'<b>Battery voltage</b>: the final value while charging.',e:'<b>e<sup>−t/RC</sup></b>: starts at 1, falls by the same factor e (≈ 2.72) every τ. It is the "remaining gap".',RC:'<b>τ = RC</b> in seconds (Ω × F = s). Larger R limits the current; larger C needs more charge.'},
 why:'<b>Why fast, then slow?</b> At t = 0 the capacitor is empty, so the whole V₀ is across R and the current I = V₀/R is largest. As V_C rises, V_R = V₀ − V_C shrinks, so the current, and the rate of charging, shrink too.',
 hG:'Prove it with measurements',pG:'Missions only complete from your recorded data.',
 missions:[['Record 63 % (±1.5 %) at t = τ while charging.','⏭ t = τ, then 📌.'],['Record 37 % remaining at t = τ while discharging.','Charge fully, switch to B, ⏭ t = τ, 📌.'],['Prove that larger C is slower: 63 % moments for two C values, same R.','Record at τ for C, then for 2C.'],['Discover τ = RC (step E).','Answer both questions in step E.'],['Predict, then verify.','Solve the question below.']],
 mDone:n=>`✅ Mission ${n} complete!`,score:(n,tt)=>`${n} / ${tt} missions complete`,all:'🏆 <b>All missions done. You own RC circuits.</b>',
 apQ:'R = 10 kΩ, C = 470 µF, V₀ = 9 V, starting empty. Find V_C after 4.7 s (in V).',apOk:'✅ Correct! Set those values in the lab and check.',apNo:'Not yet. First τ = RC (in seconds), then V = V₀(1 − e^(−t/τ)).',
 hH:'Summary card',five:'In 5 sentences',realT:'Where you meet it',
 real:[['💡 Fading lights','Car interior lights fade out slowly: a capacitor discharging through a resistor.'],['📸 Flash recharge','The flash "charges up" for a few seconds: τ = RC of its circuit.'],['⏱️ Timers','Blinking LEDs and 555 timers use RC charging to measure time.'],['❤️ Pacemakers','Pulses are timed by an RC circuit charging to a threshold.']],
 pdf2:'📄 Export my booklet (PDF)',toNb:'📓 Open my notebook',toTb:'📖 Full lesson (Textbook)',rec:(n,p)=>`📌 #${n}: ${p} %`,
 pLead:'Questions with progressive hints and full solutions. Missed questions go to your notebook.',extraQ:'Physics Alive question',progL:['Learning path','Lab missions','Practice'],workedQ:'Example: R = 20 kΩ, C = 500 µF, V₀ = 12 V.'},
fr:{k0:'Chapitre 11 · Électrostatique · Leçon 5',h0:'Pourquoi la charge est <em>rapide</em> puis <em>lente</em>',
 p0:'Remplis une cuve par un tuyau fin depuis un réservoir en hauteur. Au début, l’eau entre vite. Quand la cuve se remplit, la poussée faiblit et le débit ralentit. <b>Fais glisser le robinet</b> pour élargir ou rétrécir le tuyau.',
 hint0:'👆 Fais glisser le robinet. Touche la cuve pour la vider et observe à nouveau.',level:'niveau',flowL:'débit',
 kA:'A · Vivre',kB:'B · Prédire',kC:'C · Expérimenter',kD:'D · Mesurer',kE:'E · Découvrir',kF:'F · Comprendre',kG:'G · Appliquer',kH:'H · Retenir',
 hB:'Devine avant de basculer',pB:'Un condensateur se charge à travers une résistance avec une pile de 12 V. Après un temps <b>τ = RC</b> (la « constante de temps »), sa tension a atteint :',
 ch:['50 % de 12 V','63 % de 12 V','90 % de 12 V','100 % de 12 V'],fb0:'Choisis, puis teste.',fbR:'🎯 Bien vu : <b>63 %</b>. Prouve-le !',fbO:g=>`Ta prédiction : <b>${g}</b>. Laissons le circuit décider.`,testBtn:'🧪 Tester ma prédiction au labo',
 testGuide:'<b>Ton expérience :</b> ① touche <b>⏭ t = τ</b> ② 📌 Mesurer. Regarde la colonne %.',g1:'🎉 Enregistré ! <button class="link" data-go="sE">Vois ce que tu as découvert →</button>',g2:'🎉 Enregistré ! <button class="link" data-go="sE">Vois ce que tu as découvert →</button>',
 predR:'✅ Ta prédiction <b>63 %</b> était juste !',predW:g=>`Tu avais prédit <b>${g}</b>. La mesure dit <b>63,2 %</b>, la même pour tous R et C.`,
 hC:'Le labo du circuit RC',pC:'Bascule l’<b>interrupteur</b> : A charge le condensateur avec la pile, B le décharge à travers la résistance. Lecture, pause, déplace-toi dans le temps et compare les essais.',
 Rw:'Résistance R',Cw:'Capacité C',Vw:'Pile V₀',sw:'⇅ Interrupteur',swA:'A · Charge',swB:'B · Décharge',play:'▶ Lecture',pause:'⏸ Pause',reset:'↺ Réinitialiser',tau:'⏭ t = τ',scrub:'Temps t',record:'📌 Mesurer',
 roT:'t',roTau:'τ = RC',roVc:'V_C',roVr:'V_R',roI:'I',roQ:'Q',roU:'U',roFrac:'% du changement',
 gV:'V_C',gI:'I',gQ:'Q',gU:'U',runsNote:'Courbes pâles = tes essais précédents. Pointillés = t = τ.',
 hD:'Tes mesures',pD:'Mesure à t = τ, 2τ, 5τ en charge et en décharge. Essaie différents R et C.',th2:['n°','Mode','R (kΩ)','C (µF)','τ (s)','t (s)','t/τ','V_C (V)','%'],noRec:'Aucune mesure. Touche 📌 Mesurer au labo.',clear:'Effacer',back:'↑ Retour au labo',
 charge:'charge',discharge:'décharge',
 hE:'Trouve la règle',pE:'Compare tes mesures à t = τ.',eWait:'En <b>charge</b>, touche <b>⏭ t = τ</b> puis 📌 Mesurer.',
 eAsk1:'D’après ton tableau : à t = τ, quelle fraction du changement total le condensateur a-t-il atteint ? (ex. 0,6)',eBad:'Lis la colonne % de ta mesure à t = τ.',
 eWait2:'<b>Double R</b> maintenant (garde C), charge à nouveau et utilise le curseur du temps pour trouver quand la colonne % atteint 63 %. Mesure à cet instant.',
 eAsk2:'Tu as doublé R et l’instant des 63 % est arrivé deux fois plus tard. La constante de temps est…',fn:['R + C','R × C','R ÷ C','C ÷ R'],fnBad:'Doubler R a doublé le temps. Les missions montreront la même chose pour C.',
 eGood:'🤯 <b>Tu l’as découvert !</b> Après τ = RC le condensateur réalise toujours <b>63,2 %</b> de son changement (1 − e⁻¹). R ou C plus grand → plus lent.',
 hF:'Tu as mérité les formules',pF:'Touche chaque partie de la loi de charge.',lockF:'🔒 Découvre d’abord la règle à l’étape E, ou',skip:'passer et voir la loi',tap:'👆 Touche une partie.',glow:'✨ le voir au labo',
 pieces:{V:'<b>Tension du condensateur</b> à l’instant t.',V0:'<b>Tension de la pile</b> : la valeur finale en charge.',e:'<b>e<sup>−t/RC</sup></b> : vaut 1 au départ, puis est divisé par e (≈ 2,72) à chaque τ. C’est « l’écart restant ».',RC:'<b>τ = RC</b> en secondes (Ω × F = s). R plus grand limite le courant ; C plus grand demande plus de charge.'},
 why:'<b>Pourquoi rapide, puis lent ?</b> À t = 0 le condensateur est vide : toute la tension V₀ est aux bornes de R et le courant I = V₀/R est maximal. Quand V_C augmente, V_R = V₀ − V_C diminue : le courant et la vitesse de charge diminuent aussi.',
 hG:'Prouve-le par la mesure',pG:'Les missions se valident uniquement avec tes mesures.',
 missions:[['Enregistre 63 % (±1,5 %) à t = τ en charge.','⏭ t = τ, puis 📌.'],['Enregistre 37 % restant à t = τ en décharge.','Charge complètement, bascule sur B, ⏭ t = τ, 📌.'],['Prouve qu’un C plus grand est plus lent : instants des 63 % pour deux valeurs de C, même R.','Mesure à τ pour C, puis pour 2C.'],['Découvre τ = RC (étape E).','Réponds aux deux questions de l’étape E.'],['Prédire, puis vérifier.','Résous la question ci-dessous.']],
 mDone:n=>`✅ Mission ${n} réussie !`,score:(n,tt)=>`${n} / ${tt} missions réussies`,all:'🏆 <b>Toutes les missions sont réussies. Tu maîtrises les circuits RC.</b>',
 apQ:'R = 10 kΩ, C = 470 µF, V₀ = 9 V, condensateur vide. Calcule V_C après 4,7 s (en V).',apOk:'✅ Exact ! Règle ces valeurs au labo pour vérifier.',apNo:'Pas encore. D’abord τ = RC (en secondes), puis V = V₀(1 − e^(−t/τ)).',
 hH:'Fiche résumé',five:'En 5 phrases',realT:'Où le rencontres-tu ?',
 real:[['💡 Lumières qui s’éteignent','Le plafonnier d’une voiture s’éteint lentement : un condensateur se décharge à travers une résistance.'],['📸 Recharge du flash','Le flash « se recharge » en quelques secondes : c’est τ = RC.'],['⏱️ Minuteries','Les LED clignotantes et les circuits 555 mesurent le temps avec une charge RC.'],['❤️ Stimulateurs cardiaques','Les impulsions sont rythmées par un circuit RC qui se charge jusqu’à un seuil.']],
 pdf2:'📄 Exporter mon livret (PDF)',toNb:'📓 Ouvrir mon carnet',toTb:'📖 Leçon complète (Cours)',rec:(n,p)=>`📌 n°${n} : ${p} %`,
 pLead:'Questions avec indices progressifs et solutions complètes. Les questions ratées vont dans ton carnet.',extraQ:'Question Physics Alive',progL:['Parcours','Missions du labo','Exercices'],workedQ:'Exemple : R = 20 kΩ, C = 500 µF, V₀ = 12 V.'},
ar:{k0:'الفصل 11 · الكهرباء الساكنة · الدرس 5',h0:'لماذا يبدأ الشحن <em>سريعاً</em> وينتهي <em>بطيئاً</em>',
 p0:'املأ خزاناً عبر أنبوب رفيع من خزان مرتفع. في البداية يندفع الماء بسرعة، ومع امتلاء الخزان يضعف الدفع ويتباطأ التدفق. <b>اسحب الصنبور</b> لتوسيع الأنبوب أو تضييقه.',
 hint0:'👆 اسحب الصنبور. ثم اضغط على الخزان لتفريغه وراقب مجدداً.',level:'المستوى',flowL:'التدفق',
 kA:'أ · جرّب',kB:'ب · توقّع',kC:'ج · اختبر',kD:'د · قِس',kE:'هـ · اكتشف',kF:'و · افهم',kG:'ز · طبّق',kH:'ح · تذكّر',
 hB:'خمّن قبل التبديل',pB:'يُشحن مكثف عبر مقاومة من بطارية 12 V. بعد زمن <b>τ = RC</b> («الثابت الزمني») يبلغ جهد المكثف:',
 ch:['50 % من 12 V','63 % من 12 V','90 % من 12 V','100 % من 12 V'],fb0:'اختر ثم اختبر.',fbR:'🎯 دقيق: <b>63 %</b>. أثبته!',fbO:g=>`توقّعك: <b>${g}</b>. لندع الدارة تقرّر.`,testBtn:'🧪 اختبر توقّعي في المختبر',
 testGuide:'<b>تجربتك:</b> ① اضغط <b>⏭ t = τ</b> ② 📌 سجّل. انظر إلى عمود %.',g1:'🎉 حُفظ! <button class="link" data-go="sE">شاهد ما اكتشفته ←</button>',g2:'🎉 حُفظ! <button class="link" data-go="sE">شاهد ما اكتشفته ←</button>',
 predR:'✅ كان توقّعك <b>63 %</b> صحيحاً!',predW:g=>`توقّعت <b>${g}</b>. القياس يقول <b>63.2 %</b>، وهي نفسها لكل قيم R وC.`,
 hC:'مختبر دارة RC',pC:'بدّل <b>المفتاح</b>: الوضع A يشحن المكثف من البطارية، والوضع B يفرّغه عبر المقاومة. شغّل، أوقف، تنقّل في الزمن وقارن التجارب.',
 Rw:'المقاومة R',Cw:'السعة C',Vw:'البطارية V₀',sw:'⇅ المفتاح',swA:'A · شحن',swB:'B · تفريغ',play:'▶ تشغيل',pause:'⏸ إيقاف',reset:'↺ إعادة',tau:'⏭ t = τ',scrub:'الزمن t',record:'📌 سجّل',
 roT:'t',roTau:'τ = RC',roVc:'V_C',roVr:'V_R',roI:'I',roQ:'Q',roU:'U',roFrac:'% من التغيّر',
 gV:'V_C',gI:'I',gQ:'Q',gU:'U',runsNote:'المنحنيات الباهتة = تجاربك السابقة. الخط المتقطع = t = τ.',
 hD:'قياساتك',pD:'سجّل عند t = τ و2τ و5τ أثناء الشحن والتفريغ. جرّب قيماً مختلفة لـ R وC.',th2:['#','الوضع','R (kΩ)','C (µF)','τ (s)','t (s)','t/τ','V_C (V)','%'],noRec:'لا توجد قياسات. اضغط 📌 سجّل في المختبر.',clear:'مسح',back:'↑ العودة إلى المختبر',
 charge:'شحن',discharge:'تفريغ',
 hE:'اكتشف القاعدة',pE:'قارن قياساتك عند t = τ.',eWait:'أثناء <b>الشحن</b> اضغط <b>⏭ t = τ</b> ثم 📌 سجّل.',
 eAsk1:'من جدولك: عند t = τ ما الكسر الذي بلغه المكثف من تغيّره الكامل؟ (مثلاً 0.6)',eBad:'اقرأ عمود % لقياسك عند t = τ.',
 eWait2:'<b>ضاعف R</b> الآن (أبقِ C)، واشحن مجدداً واستخدم شريط الزمن لإيجاد لحظة بلوغ 63 %. سجّل عندها.',
 eAsk2:'ضاعفت R فجاءت لحظة 63 % متأخرة مرتين. الثابت الزمني هو…',fn:['R + C','R × C','R ÷ C','C ÷ R'],fnBad:'مضاعفة R ضاعفت الزمن. وستُظهر المهام الشيء نفسه لـ C.',
 eGood:'🤯 <b>لقد اكتشفته!</b> بعد τ = RC يُنجز المكثف دائماً <b>63.2 %</b> من تغيّره (1 − e⁻¹). R أو C أكبر ← أبطأ.',
 hF:'لقد استحققت القوانين',pF:'اضغط على كل جزء من قانون الشحن.',lockF:'🔒 اكتشف القاعدة أولاً في الخطوة هـ، أو',skip:'تخطَّ وأرني القانون',tap:'👆 اضغط على جزء.',glow:'✨ شاهده في المختبر',
 pieces:{V:'<b>جهد المكثف</b> عند الزمن t.',V0:'<b>جهد البطارية</b>: القيمة النهائية أثناء الشحن.',e:'<b>e<sup>−t/RC</sup></b>: يبدأ بـ 1 ثم يُقسم على e (≈ 2.72) كل τ. إنه «الفرق المتبقي».',RC:'<b>τ = RC</b> بالثواني (Ω × F = s). R الأكبر يحدّ التيار، وC الأكبر يحتاج شحنة أكثر.'},
 why:'<b>لماذا سريع ثم بطيء؟</b> عند t = 0 يكون المكثف فارغاً، فيقع الجهد V₀ كله على R ويكون التيار I = V₀/R أكبر ما يمكن. ومع ارتفاع V_C يتناقص V_R = V₀ − V_C، فيتناقص التيار وسرعة الشحن.',
 hG:'أثبت ذلك بالقياس',pG:'لا تكتمل المهام إلا من بياناتك المسجّلة.',
 missions:[['سجّل 63 % (±1.5 %) عند t = τ أثناء الشحن.','⏭ t = τ ثم 📌.'],['سجّل بقاء 37 % عند t = τ أثناء التفريغ.','اشحن كاملاً، بدّل إلى B، ⏭ t = τ، 📌.'],['أثبت أن C الأكبر أبطأ: لحظتا 63 % لقيمتين من C بالـ R نفسها.','سجّل عند τ لـ C ثم لـ 2C.'],['اكتشف τ = RC (الخطوة هـ).','أجب عن سؤالي الخطوة هـ.'],['توقّع ثم تحقّق.','حلّ السؤال أدناه.']],
 mDone:n=>`✅ اكتملت المهمة ${n}!`,score:(n,tt)=>`${n} / ${tt} مهام مكتملة`,all:'🏆 <b>أنجزت كل المهام. أنت تتقن دارات RC.</b>',
 apQ:'R = 10 kΩ وC = 470 µF وV₀ = 9 V والمكثف فارغ. أوجد V_C بعد 4.7 s (بالفولت).',apOk:'✅ صحيح! اضبط هذه القيم في المختبر وتحقّق.',apNo:'ليس بعد. أولاً τ = RC (بالثواني) ثم V = V₀(1 − e^(−t/τ)).',
 hH:'بطاقة الملخّص',five:'في 5 جمل',realT:'أين تقابله؟',
 real:[['💡 الأضواء الخافتة','ينطفئ ضوء السيارة الداخلي تدريجياً: مكثف يتفرّغ عبر مقاومة.'],['📸 شحن الفلاش','«يُشحن» الفلاش خلال ثوانٍ: هذا هو τ = RC.'],['⏱️ المؤقتات','الأضواء الوامضة ودارات 555 تقيس الزمن بشحن RC.'],['❤️ منظّمات القلب','تُوقَّت النبضات بدارة RC تُشحن حتى عتبة معيّنة.']],
 pdf2:'📄 تصدير كتيّبي (PDF)',toNb:'📓 افتح دفتري',toTb:'📖 الدرس الكامل',rec:(n,p)=>`📌 #${n}: ${p} %`,
 pLead:'أسئلة مع تلميحات متدرّجة وحلول كاملة. الأسئلة التي تخطئ فيها تذهب إلى دفترك.',extraQ:'سؤال من Physics Alive',progL:['مسار التعلّم','مهام المختبر','التمارين'],workedQ:'مثال: R = 20 kΩ وC = 500 µF وV₀ = 12 V.'}
};

const formulas=[
 {id:'tau',n:{en:'Time constant',fr:'Constante de temps',ar:'الثابت الزمني'},t:"\\tau=RC",d:{en:'In seconds (Ω·F = s).',fr:'En secondes (Ω·F = s).',ar:'بالثواني (Ω·F = s).'}},
 {id:'chg',n:{en:'Charging',fr:'Charge',ar:'الشحن'},t:"V_C=V_0\\left(1-e^{-t/RC}\\right),\\quad I=\\dfrac{V_0}{R}e^{-t/RC}",d:{en:'Starting from an empty capacitor.',fr:'À partir d’un condensateur vide.',ar:'بدءاً من مكثف فارغ.'}},
 {id:'dis',n:{en:'Discharging',fr:'Décharge',ar:'التفريغ'},t:"V_C=V_i\\,e^{-t/RC},\\quad I=-\\dfrac{V_i}{R}e^{-t/RC}",d:{en:'Current flows the opposite way.',fr:'Le courant circule en sens inverse.',ar:'يسري التيار في الاتجاه المعاكس.'}},
 {id:'pts',n:{en:'Key points',fr:'Points clés',ar:'نقاط أساسية'},t:"t=\\tau:\\ 63.2\\%\\ \\text{charged},\\ 36.8\\%\\ \\text{left};\\quad t=5\\tau:\\ >99\\%",d:{en:'1 − e⁻¹ = 0.632, e⁻¹ = 0.368.',fr:'1 − e⁻¹ = 0,632 ; e⁻¹ = 0,368.',ar:'1 − e⁻¹ = 0.632، e⁻¹ = 0.368.'}}];
const summary={en:['τ = RC sets the speed of charging and discharging.','Charging: V_C = V₀(1 − e^(−t/RC)); 63.2 % after one τ.','Discharging: V_C = Vᵢ e^(−t/RC); 36.8 % left after one τ.','The current is largest at the start and decays with the same τ.','After about 5τ the process is practically complete.'],
 fr:['τ = RC fixe la vitesse de charge et de décharge.','Charge : V_C = V₀(1 − e^(−t/RC)) ; 63,2 % après un τ.','Décharge : V_C = Vᵢ e^(−t/RC) ; 36,8 % restant après un τ.','Le courant est maximal au début et décroît avec le même τ.','Après environ 5τ le processus est pratiquement terminé.'],
 ar:['τ = RC تحدد سرعة الشحن والتفريغ.','الشحن: V_C = V₀(1 − e^(−t/RC))؛ 63.2 % بعد τ واحد.','التفريغ: V_C = Vᵢ e^(−t/RC)؛ يتبقّى 36.8 % بعد τ واحد.','التيار أكبر ما يمكن في البداية ويتناقص بالـ τ نفسه.','بعد نحو 5τ تكتمل العملية تقريباً.']};

const textbook={
en:`<div class="kicker">§11.13 · Physics 12</div><h1>Charging and Discharging a Capacitor</h1><p class="muted small">Explanation written for Physics Alive from the physics of §11.13. Textbook pages: 48–51.</p>
<h2>1. The circuit</h2><p class="hl" id="t1">A capacitor C, a resistor R and a battery V₀ are connected through a two-way switch. In position A the battery charges the capacitor through R. In position B the battery is out of the circuit and the capacitor discharges through the same R.</p>
<h2>2. Charging</h2><p class="hl" id="t2">At the start the capacitor is empty, so the full battery voltage is across the resistor and the current I₀ = V₀/R is largest. As charge builds up, the capacitor voltage V_C rises and the voltage across the resistor V₀ − V_C falls. The current, and so the rate of charging, decrease. The result is an exponential approach to V₀:</p>
$$V_C=V_0\\left(1-e^{-t/RC}\\right),\\qquad q=q_0\\left(1-e^{-t/RC}\\right),\\qquad I=\\frac{V_0}{R}e^{-t/RC}$$
<h2>3. The time constant</h2><div class="def"><b>Definition.</b> The <b>time constant</b> τ = RC is the time for the capacitor to complete 63.2 % of its change. Unit: ohm × farad = second.</div>
<p class="hl" id="t3">At t = τ: \\(1-e^{-1}=0.632\\). At t = 2τ: 86.5 %. At t = 5τ: 99.3 %, practically full. A larger R limits the current; a larger C needs more charge. Both make the process slower.</p>
<h2>4. Discharging</h2><p class="hl" id="t4">With the switch at B, the capacitor pushes current back through R, in the opposite direction. The voltage falls exponentially from its initial value Vᵢ:</p>
$$V_C=V_i\\,e^{-t/RC},\\qquad I=-\\frac{V_i}{R}e^{-t/RC}$$
<p class="hl" id="t5">After one τ, 36.8 % (\\(e^{-1}\\)) of the voltage, and of the charge, remains.</p>
<div class="note">The same τ governs both charging and discharging. Only the shape is mirrored.</div>
<h2>5. Energy</h2><p class="hl" id="t6">A fully charged capacitor stores \\(U=\\tfrac12CV_0^2\\). While charging from a battery, an equal amount of energy is turned into heat in the resistor, whatever the value of R.</p>
<h2>6. Worked examples</h2><p><b>Example 1.</b> R = 20 kΩ, C = 500 µF, V₀ = 12 V.</p>$$\\tau=(2\\times10^4)(5\\times10^{-4})=10\\ \\mathrm{s},\\quad V_C(10\\,\\mathrm{s})=12(1-e^{-1})\\approx7.6\\ \\mathrm{V}$$
<p><b>Example 2.</b> A capacitor at 10 V discharges with τ = 2 s. Voltage after 4 s?</p>$$V=10\\,e^{-4/2}=10\\,e^{-2}\\approx1.35\\ \\mathrm{V}$$
<h2>7. Key formulas</h2>`,
fr:`<div class="kicker">§11.13 · Physique 12</div><h1>Charge et décharge d’un condensateur</h1><p class="muted small">Explication rédigée pour Physics Alive à partir de la physique du §11.13. Pages du manuel : 48–51.</p>
<h2>1. Le circuit</h2><p class="hl" id="t1">Un condensateur C, une résistance R et une pile V₀ sont reliés par un inverseur. En position A, la pile charge le condensateur à travers R. En position B, la pile est hors circuit et le condensateur se décharge à travers la même résistance.</p>
<h2>2. La charge</h2><p class="hl" id="t2">Au départ le condensateur est vide : toute la tension de la pile est aux bornes de la résistance et le courant I₀ = V₀/R est maximal. Quand la charge s’accumule, V_C augmente et la tension aux bornes de R, V₀ − V_C, diminue. Le courant et la vitesse de charge diminuent : on obtient une approche exponentielle de V₀ :</p>
$$V_C=V_0\\left(1-e^{-t/RC}\\right),\\qquad q=q_0\\left(1-e^{-t/RC}\\right),\\qquad I=\\frac{V_0}{R}e^{-t/RC}$$
<h2>3. La constante de temps</h2><div class="def"><b>Définition.</b> La <b>constante de temps</b> τ = RC est la durée pour réaliser 63,2 % du changement. Unité : ohm × farad = seconde.</div>
<p class="hl" id="t3">À t = τ : \\(1-e^{-1}=0{,}632\\). À 2τ : 86,5 %. À 5τ : 99,3 %, pratiquement plein. Un R plus grand limite le courant ; un C plus grand demande plus de charge. Les deux ralentissent le processus.</p>
<h2>4. La décharge</h2><p class="hl" id="t4">Interrupteur en B : le condensateur renvoie le courant à travers R, en sens inverse. La tension décroît exponentiellement depuis sa valeur initiale Vᵢ :</p>
$$V_C=V_i\\,e^{-t/RC},\\qquad I=-\\frac{V_i}{R}e^{-t/RC}$$
<p class="hl" id="t5">Après un τ, il reste 36,8 % (\\(e^{-1}\\)) de la tension et de la charge.</p>
<div class="note">Le même τ gouverne la charge et la décharge ; seule la forme est inversée.</div>
<h2>5. Énergie</h2><p class="hl" id="t6">Un condensateur chargé stocke \\(U=\\tfrac12CV_0^2\\). Pendant la charge par une pile, une énergie égale est dissipée en chaleur dans la résistance, quelle que soit la valeur de R.</p>
<h2>6. Exemples résolus</h2><p><b>Exemple 1.</b> R = 20 kΩ, C = 500 µF, V₀ = 12 V.</p>$$\\tau=(2\\times10^4)(5\\times10^{-4})=10\\ \\mathrm{s},\\quad V_C(10\\,\\mathrm{s})=12(1-e^{-1})\\approx7{,}6\\ \\mathrm{V}$$
<p><b>Exemple 2.</b> Un condensateur à 10 V se décharge avec τ = 2 s. Tension après 4 s ?</p>$$V=10\\,e^{-4/2}=10\\,e^{-2}\\approx1{,}35\\ \\mathrm{V}$$
<h2>7. Formules clés</h2>`,
ar:`<div class="kicker">§11.13 · فيزياء 12</div><h1>شحن المكثف وتفريغه</h1><p class="muted small">شرح مكتوب لـ Physics Alive اعتماداً على فيزياء البند 11.13. صفحات الكتاب: 48–51.</p>
<h2>1. الدارة</h2><p class="hl" id="t1">مكثف C ومقاومة R وبطارية V₀ موصولة عبر مفتاح ثنائي الاتجاه. في الوضع A تشحن البطارية المكثف عبر R، وفي الوضع B تخرج البطارية من الدارة ويتفرّغ المكثف عبر المقاومة نفسها.</p>
<h2>2. الشحن</h2><p class="hl" id="t2">في البداية يكون المكثف فارغاً، فيقع جهد البطارية كله على المقاومة ويكون التيار I₀ = V₀/R أكبر ما يمكن. ومع تراكم الشحنة يرتفع V_C ويتناقص الجهد على المقاومة V₀ − V_C، فيتناقص التيار وسرعة الشحن، فنحصل على اقتراب أسّي من V₀:</p>
$$V_C=V_0\\left(1-e^{-t/RC}\\right),\\qquad q=q_0\\left(1-e^{-t/RC}\\right),\\qquad I=\\frac{V_0}{R}e^{-t/RC}$$
<h2>3. الثابت الزمني</h2><div class="def"><b>تعريف.</b> <b>الثابت الزمني</b> τ = RC هو الزمن اللازم لإنجاز 63.2 % من التغيّر. الوحدة: أوم × فاراد = ثانية.</div>
<p class="hl" id="t3">عند t = τ: \\(1-e^{-1}=0.632\\). عند 2τ: 86.5 %. عند 5τ: 99.3 %، أي ممتلئ تقريباً. R الأكبر يحدّ التيار، وC الأكبر يحتاج شحنة أكثر، وكلاهما يبطئ العملية.</p>
<h2>4. التفريغ</h2><p class="hl" id="t4">عندما يكون المفتاح في الوضع B يدفع المكثف التيار عبر R في الاتجاه المعاكس، ويتناقص الجهد أسّياً من قيمته الابتدائية Vᵢ:</p>
$$V_C=V_i\\,e^{-t/RC},\\qquad I=-\\frac{V_i}{R}e^{-t/RC}$$
<p class="hl" id="t5">بعد τ واحد يتبقّى 36.8 % (\\(e^{-1}\\)) من الجهد والشحنة.</p>
<div class="note">الثابت الزمني نفسه يحكم الشحن والتفريغ، والشكل فقط معكوس.</div>
<h2>5. الطاقة</h2><p class="hl" id="t6">المكثف المشحون كلياً يخزّن \\(U=\\tfrac12CV_0^2\\). وأثناء الشحن من بطارية تتحوّل كمية مساوية من الطاقة إلى حرارة في المقاومة، مهما كانت قيمة R.</p>
<h2>6. أمثلة محلولة</h2><p><b>مثال 1.</b> R = 20 kΩ وC = 500 µF وV₀ = 12 V.</p>$$\\tau=(2\\times10^4)(5\\times10^{-4})=10\\ \\mathrm{s},\\quad V_C(10\\,\\mathrm{s})=12(1-e^{-1})\\approx7.6\\ \\mathrm{V}$$
<p><b>مثال 2.</b> مكثف عند 10 V يتفرّغ بـ τ = 2 s. ما الجهد بعد 4 s؟</p>$$V=10\\,e^{-4/2}=10\\,e^{-2}\\approx1.35\\ \\mathrm{V}$$
<h2>7. القوانين الأساسية</h2>`};

const P=(en,fr,ar)=>({en,fr,ar}),same=a=>({en:a,fr:a,ar:a});
const practice=[
 {id:'r1',type:'num',extra:1,unit:'s',target:20e3*500e-6,tol:.01,lab:{R:20,C:500,V0:12},q:P('R = 20 kΩ, C = 500 µF. Find τ.','R = 20 kΩ, C = 500 µF. Calcule τ.','R = 20 kΩ وC = 500 µF. احسب τ.'),
  hints:P(['Convert: 20 kΩ = 2×10⁴ Ω, 500 µF = 5×10⁻⁴ F.'],['Convertis : 20 kΩ = 2×10⁴ Ω, 500 µF = 5×10⁻⁴ F.'],['حوّل: 20 kΩ = 2×10⁴ Ω و500 µF = 5×10⁻⁴ F.']),steps:same(['\\(\\tau=(2\\times10^4)(5\\times10^{-4})=10\\ \\mathrm{s}\\)']),mistake:P('Multiplying 20 × 500 without converting units.','Multiplier 20 × 500 sans convertir.','ضرب 20 × 500 دون تحويل الوحدات.')},
 {id:'r2',type:'num',extra:1,unit:'V',target:12*(1-Math.exp(-1)),tol:.01,lab:{R:20,C:500,V0:12},q:P('Charging from empty with V₀ = 12 V. Find V_C at t = τ.','Charge depuis vide avec V₀ = 12 V. Calcule V_C à t = τ.','شحن من الصفر بـ V₀ = 12 V. احسب V_C عند t = τ.'),
  hints:P(['V = V₀(1 − e⁻¹)','e⁻¹ ≈ 0.368'],['V = V₀(1 − e⁻¹)','e⁻¹ ≈ 0,368'],['V = V₀(1 − e⁻¹)','e⁻¹ ≈ 0.368']),steps:same(['\\(V=12(1-0.368)\\approx7.58\\ \\mathrm{V}\\)'])},
 {id:'r3',type:'mcq',extra:1,q:P('After 5τ of charging, the capacitor is about:','Après 5τ de charge, le condensateur est à environ :','بعد 5τ من الشحن يكون المكثف تقريباً:'),opts:same(['63 %','86 %','95 %','99 %']),ans:3,
  hints:P(['Compute 1 − e⁻⁵.'],['Calcule 1 − e⁻⁵.'],['احسب 1 − e⁻⁵.']),steps:same(['\\(1-e^{-5}=1-0.0067=0.993\\)'])},
 {id:'r4',type:'num',extra:1,unit:'V',target:10*Math.exp(-2),tol:.01,q:P('A capacitor at 10 V discharges with τ = 2 s. Find V after 4 s.','Un condensateur à 10 V se décharge avec τ = 2 s. Calcule V après 4 s.','مكثف عند 10 V يتفرّغ بـ τ = 2 s. احسب V بعد 4 s.'),
  hints:P(['V = Vᵢ e^(−t/τ)','t/τ = 2'],['V = Vᵢ e^(−t/τ)','t/τ = 2'],['V = Vᵢ e^(−t/τ)','t/τ = 2']),steps:same(['\\(V=10e^{-2}\\approx1.35\\ \\mathrm{V}\\)'])},
 {id:'r5',type:'mcq',extra:1,q:P('At the very start of charging (empty capacitor), the current is:','Au tout début de la charge (condensateur vide), le courant vaut :','في بداية الشحن تماماً (مكثف فارغ) يكون التيار:'),opts:same(['0','V₀/R','V₀/2R','V₀/RC']),ans:1,
  hints:P(['An empty capacitor has V_C = 0. What is across R?'],['Un condensateur vide a V_C = 0. Quelle tension aux bornes de R ?'],['المكثف الفارغ V_C = 0. ما الجهد على R؟']),steps:same(['\\(V_R=V_0-0\\Rightarrow I_0=V_0/R\\)']),mistake:P('Thinking the current starts at zero, like the voltage.','Croire que le courant part de zéro, comme la tension.','الظن بأن التيار يبدأ من الصفر مثل الجهد.')},
 {id:'r6',type:'mcq',extra:1,q:P('R and C are both doubled. The time constant:','R et C sont tous deux doublés. La constante de temps :','ضوعفت R وC معاً. الثابت الزمني:'),opts:P(['stays the same','doubles','quadruples','halves'],['reste identique','double','quadruple','est divisée par deux'],['يبقى نفسه','يتضاعف','يصبح 4 أضعاف','ينتصف']),ans:2,
  hints:P(['τ = R × C'],['τ = R × C'],['τ = R × C']),steps:same(['\\(\\tau\'=(2R)(2C)=4RC\\)'])}];

/* ================= MARKUP ================= */
const STEPS=['sA','sB','sC','sD','sE','sF','sG','sH'];
const html=`<div class="wrap"><nav class="path" id="path"></nav></div>
<section class="step hero" id="sA"><div class="wrap"><div class="kicker" data-t="k0"></div><h1 data-t="h0"></h1><div class="ethos" id="ethos"></div>
 <p class="lead hl" id="lA" data-t="p0"></p><canvas id="tank" style="height:320px;background:linear-gradient(180deg,#0c1433,#0a1028)"></canvas><p class="hint" data-t="hint0"></p></div></section>
<section class="step" id="sB"><div class="wrap"><div class="kicker" data-t="kB"></div><h2 data-t="hB"></h2><div class="card"><p class="hl" id="lB" data-t="pB"></p><div class="choices" id="choices"></div><div class="feedback" id="predictFb"></div></div></div></section>
<section class="step" id="sC"><div class="wrap"><div class="kicker" data-t="kC"></div><h2 data-t="hC"></h2><p class="lead hl" id="lC" data-t="pC"></p>
 <div class="guide" id="labGuide" style="display:none;margin-bottom:12px"></div>
 <div class="labwrap" id="labwrap"><div class="stage" style="position:relative">
   <canvas id="circ" style="height:330px;background:#060a18"></canvas>
   <button class="ib fsbtn" id="fsBtn" aria-label="Full screen"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/></svg></button>
   <div class="toggles"><button class="btn sm" id="swBtn"></button><button class="ib" id="playBtn"></button><button class="ib" id="tauBtn" data-t="tau"></button><button class="ib" id="resetBtn" data-t="reset"></button><button class="btn" id="recordBtn" style="margin-inline-start:auto" data-t="record"></button></div>
   <div class="ctrl"><label><span data-t="scrub"></span> <b id="tv"></b></label><input type="range" id="scrub" min="0" max="5" step="0.01" value="0"></div>
   <div class="seg" id="gSeg" style="margin-top:6px"><button data-g="V" class="on">V_C</button><button data-g="I">I</button><button data-g="Q">Q</button><button data-g="U">U</button></div>
   <canvas id="graph" style="height:190px;margin-top:8px"></canvas><div class="hint" data-t="runsNote"></div></div>
  <div class="card"><div class="readout" id="meters"></div>
   <div class="ctrl"><label><span data-t="Rw"></span> <b id="Rv"></b></label><input type="range" id="R" min="1" max="100" step="1" value="20"></div>
   <div class="ctrl"><label><span data-t="Cw"></span> <b id="Cv"></b></label><input type="range" id="C" min="100" max="1000" step="10" value="250"></div>
   <div class="ctrl"><label><span data-t="Vw"></span> <b id="Vv"></b></label><input type="range" id="V0" min="1" max="24" step="1" value="12"></div>
   <div class="live" id="live"></div></div></div></div></section>
<section class="step" id="sD"><div class="wrap"><div class="kicker" data-t="kD"></div><h2 data-t="hD"></h2><p class="lead hl" id="lD" data-t="pD"></p>
 <div class="card"><div class="tscroll" id="recTable"></div><div class="row"><button class="btn ghost sm" id="clearRec" data-t="clear"></button><button class="btn ghost sm" data-go="sC" data-t="back"></button></div></div></div></section>
<section class="step" id="sE"><div class="wrap"><div class="kicker" data-t="kE"></div><h2 data-t="hE"></h2><p class="lead" data-t="pE"></p><div class="card" id="discover"></div></div></section>
<section class="step" id="sF"><div class="wrap"><div class="kicker" data-t="kF"></div><h2 data-t="hF"></h2>
 <div class="card locked" id="fcard"><div class="lockmsg"><span data-t="lockF"></span> <button class="link" id="skipF" data-t="skip"></button></div>
  <div class="unlockable"><p class="hl" id="lF" data-t="pF"></p><div id="bigFormula"></div><div class="soft" id="pieceInfo"></div><div class="note hl" id="lF2" data-t="why"></div></div></div></div></section>
<section class="step" id="sG"><div class="wrap"><div class="kicker" data-t="kG"></div><h2 data-t="hG"></h2><p class="lead" data-t="pG"></p><div id="chals"></div><div class="feedback" id="chalScore"></div>
 <div class="card" style="margin-top:12px"><p class="hl" id="lG" data-t="apQ"></p><div class="ans"><input class="f" id="apIn" inputmode="decimal" placeholder="V"><button class="btn sm" id="apBtn"></button></div><div class="res" id="apRes"></div></div></div></section>
<section class="step" id="sH"><div class="wrap"><div class="kicker" data-t="kH"></div><h2 data-t="hH"></h2><div class="fgrid" id="sumF"></div>
 <div class="card" style="margin-top:14px"><h3 data-t="five"></h3><ul id="sumList"></ul><p class="hl" id="lH" data-t="workedQ"></p><div class="live" id="worked"></div></div>
 <h3 style="margin-top:22px" data-t="realT"></h3><div class="real" id="real"></div>
 <div class="row"><button class="btn" id="pdfB" data-t="pdf2"></button><button class="btn ghost" data-mode="notebook" data-t="toNb"></button><button class="btn ghost" data-mode="textbook" data-t="toTb"></button></div></div></section>`;

/* ================= STATE ================= */
const S={Rk:20,Cu:250,V0:12,mode:'charge',vs:0,t:0,playing:false,runs:[],graph:'V',on:true,guideStart:null,flash:null,flashT:0,last:0};
const cfg=()=>({R:S.Rk*1e3,C:S.Cu*1e-6,V0:S.V0,mode:S.mode,vs:S.vs});
const now=()=>state(cfg(),S.t);const st=()=>PA.store;
const tauNow=()=>S.Rk*1e3*S.Cu*1e-6;

/* ================= A: TANK ================= */
function tank(){const c=$('#tank');let W,H,ctx,lvl=0,pipe=.4,drag=false,vis=true,flowAcc=0;
 function init(){const f=PA.fit(c);W=f.w;H=f.h;ctx=f.x}
 c.addEventListener('pointerdown',e=>{const r=c.getBoundingClientRect(),x=e.clientX-r.left;if(x>W*.62){lvl=0;return}drag=true;c.setPointerCapture(e.pointerId)});
 c.addEventListener('pointermove',e=>{if(!drag)return;const r=c.getBoundingClientRect();pipe=Math.max(.1,Math.min(1,(e.clientX-r.left-W*.2)/(W*.3)))});c.addEventListener('pointerup',()=>drag=false);PA.visible(c,v=>vis=v);
 let last=0;function step(tm){requestAnimationFrame(step);const dt=Math.min(.05,(tm-last)/1000);last=tm;if(!W||!vis||PA.mode!=='learn')return;
  const flow=pipe*(1-lvl)*.35;lvl=Math.min(1,lvl+flow*dt);flowAcc+=flow*dt*60;ctx.clearRect(0,0,W,H);ctx.direction='ltr';
  // reservoir (left, high)
  ctx.fillStyle='#1d3f7a';ctx.fillRect(W*.04,H*.12,W*.16,H*.5);ctx.fillStyle='#3fa9ff';ctx.fillRect(W*.04,H*.18,W*.16,H*.44);
  // pipe with tap
  const py=H*.56,ph=4+pipe*16;ctx.fillStyle='#3a4677';ctx.fillRect(W*.2,py-ph/2,W*.45,ph);ctx.fillStyle='#3fa9ff';ctx.fillRect(W*.2,py-ph/2+2,W*.45,ph-4);
  ctx.fillStyle='#ffd166';const tx=W*.2+pipe*W*.3;ctx.fillRect(tx-8,py-ph/2-18,16,14);ctx.fillRect(tx-2,py-ph/2-6,4,6);
  // moving droplets in pipe: speed ∝ flow
  ctx.fillStyle='#d8f0ff';for(let k=0;k<8;k++){const x=W*.2+((k*W*.06+flowAcc*6)%(W*.45));ctx.beginPath();ctx.arc(x,py,1.8,0,7);ctx.fill()}
  // tank (right)
  const tx0=W*.65,tw=W*.3,ty=H*.15,th=H*.7;ctx.strokeStyle='#cfd6ff';ctx.lineWidth=2;ctx.strokeRect(tx0,ty,tw,th);ctx.fillStyle='rgba(63,169,255,.7)';ctx.fillRect(tx0+2,ty+th*(1-lvl),tw-4,th*lvl-2);ctx.lineWidth=1;
  ctx.setLineDash([4,4]);ctx.strokeStyle='#ffd166';ctx.beginPath();ctx.moveTo(tx0,ty+th*(1-.632));ctx.lineTo(tx0+tw,ty+th*(1-.632));ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='#ffd166';ctx.font='11px sans-serif';ctx.fillText('63 %',tx0+tw-34,ty+th*(1-.632)-4);
  ctx.fillStyle='#e8ecff';ctx.font='600 14px sans-serif';ctx.textAlign='left';ctx.fillText(`${t('level')}: ${Math.round(lvl*100)} %`,12,22);ctx.fillStyle='#9aa6d4';ctx.font='13px sans-serif';ctx.fillText(`${t('flowL')}: ${'▮'.repeat(Math.round(flow*30))}`,12,42)}
 new ResizeObserver(init).observe(c);requestAnimationFrame(step)}

/* ================= C: CIRCUIT LAB (2D) ================= */
let Cv={w:0,h:0,x:null};
const P_CHG=[[120,140],[120,90],[220,90],[300,90],[330,90],[560,90],[760,90],[760,190],[760,230],[760,350],[120,350],[120,300]];
const P_DIS=[[760,190],[760,90],[560,90],[330,90],[300,90],[260,165],[260,350],[760,350],[760,230]];
function drawCircuit(tm){const{x:ctx,w,h}=Cv;if(!ctx)return;ctx.clearRect(0,0,w,h);ctx.direction='ltr';const sx=w/880,sy=h/420,s=Math.min(sx,sy),ox=(w-880*s)/2,oy=(h-420*s)/2;const X=x=>ox+x*s,Y=y=>oy+y*s;
 const r=now(),fl=k=>S.flash===k&&tm-S.flashT<1800?(.5+.5*Math.sin((tm-S.flashT)/90)):0;
 const line=(pts,col,wd=3)=>{ctx.strokeStyle=col;ctx.lineWidth=wd;ctx.lineCap='round';ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(X(p[0]),Y(p[1])):ctx.moveTo(X(p[0]),Y(p[1])));ctx.stroke()};
 const wire='#8b96c7',act=S.mode==='charge';
 // wires
 line([[120,140],[120,90],[220,90]],act?'#cfd6ff':wire);line([[330,90],[300,90]],'#cfd6ff');line([[560,90],[760,90],[760,190]],'#cfd6ff');line([[760,230],[760,350],[260,350]],'#cfd6ff');line([[260,350],[120,350],[120,300]],act?'#cfd6ff':wire);line([[260,165],[260,350]],!act?'#cfd6ff':wire);
 // battery
 ctx.fillStyle='#ffd166';ctx.fillRect(X(95),Y(140),50*s,6*s);ctx.fillRect(X(108),Y(170),24*s,6*s);ctx.fillRect(X(95),Y(200),50*s,6*s);ctx.fillRect(X(108),Y(230),24*s,6*s);ctx.fillRect(X(95),Y(260),50*s,6*s);ctx.fillRect(X(108),Y(290),24*s,6*s);
 ctx.fillStyle='#e8ecff';ctx.font=`600 ${Math.max(12,Math.round(14*s))}px sans-serif`;ctx.textAlign='right';ctx.fillText('V₀ = '+S.V0+' V',X(85),Y(225));ctx.fillText('+',X(90),Y(150));
 // switch: common at 300,90 ; A at 220,90 ; B at 260,165
 [[220,90,'A'],[260,165,'B']].forEach(([x,y,l])=>{ctx.fillStyle='#e8ecff';ctx.beginPath();ctx.arc(X(x),Y(y),5*s,0,7);ctx.fill();ctx.textAlign='center';ctx.fillText(l,X(x)-(l==='A'?0:16*s),Y(y)-(l==='A'?12*s:0))});
 ctx.fillStyle='#e8ecff';ctx.beginPath();ctx.arc(X(300),Y(90),5*s,0,7);ctx.fill();line([[300,90],act?[222,90]:[262,163]],'#ffd166',5);
 // resistor zigzag
 const zz=[[330,90]];for(let i=0;i<10;i++)zz.push([350+i*20,i%2?72:108]);zz.push([560,90]);line(zz,fl('RC')?'#ffffff':'#ff8fa3',3);ctx.fillStyle='#ff8fa3';ctx.textAlign='center';ctx.fillText('R = '+S.Rk+' kΩ',X(445),Y(55));
 ctx.fillStyle='#9aa6d4';ctx.font=`${Math.max(11,Math.round(12*s))}px sans-serif`;ctx.fillText('V_R = '+PA.num(Math.abs(r.VR).toFixed(2))+' V',X(445),Y(135));
 // capacitor plates with charge dots
 const glow=fl('V');ctx.fillStyle=glow?'#fff':'#ff5470';ctx.fillRect(X(705),Y(186),110*s,6*s);ctx.fillStyle=glow?'#fff':'#3fa9ff';ctx.fillRect(X(705),Y(228),110*s,6*s);
 const nq=Math.round(Math.max(0,r.Vc)/24*22);for(let i=0;i<nq;i++){const x=X(710+i*100/22);ctx.fillStyle='#ff5470';ctx.fillText('+',x,Y(178));ctx.fillStyle='#3fa9ff';ctx.fillText('−',x,Y(252))}
 ctx.fillStyle='#e8ecff';ctx.font=`600 ${Math.max(12,Math.round(14*s))}px sans-serif`;ctx.textAlign='left';ctx.fillText('C = '+S.Cu+' µF',X(825),Y(205));ctx.fillStyle=fl('V')?'#ffd166':'#cfd6ff';ctx.fillText('V_C = '+PA.num(r.Vc.toFixed(2))+' V',X(825),Y(225));
 // moving current dots: speed ∝ |I|, along the active loop, direction by sign (conventional current)
 const path=act?P_CHG:P_DIS;const segs=[];let L=0;for(let i=1;i<path.length;i++){const l=Math.hypot(path[i][0]-path[i-1][0],path[i][1]-path[i-1][1]);segs.push(l);L+=l}
 const Imax=S.V0/(S.Rk*1e3),spd=Math.abs(r.I)/Imax;S.phase=(S.phase||0)+(PA.reduced?0:spd*(S.playing?2.2:.6));
 if(spd>.004)for(let k=0;k<26;k++){let d=((k/26)*L+S.phase)%L;let i=0;while(i<segs.length-1&&d>segs[i]){d-=segs[i];i++}const a=path[i],b=path[i+1],q=d/segs[i];const px=a[0]+(b[0]-a[0])*q,py=a[1]+(b[1]-a[1])*q;
  if(px===760&&py>190&&py<230)continue;ctx.fillStyle=`rgba(255,230,150,${.35+.65*spd})`;ctx.beginPath();ctx.arc(X(px),Y(py),3.2*s,0,7);ctx.fill()}
 ctx.textAlign='left';ctx.fillStyle='#9aa6d4';ctx.font=`${Math.max(11,Math.round(12*s))}px sans-serif`;ctx.fillText('I = '+fmtI(r.I),X(400),Y(330))}
const fmtI=I=>{const a=Math.abs(I);return(I<0?'−':'')+(a>=1e-3?PA.num((a*1e3).toPrecision(3))+' mA':PA.num((a*1e6).toPrecision(3))+' µA')};
function drawGraph(){const c=$('#graph');const{w,h,x:ctx}=PA.fit(c);if(w<10)return;ctx.clearRect(0,0,w,h);ctx.direction='ltr';const pad=34,tau=tauNow(),Tmax=Math.max(5*tau,...S.runs.map(r=>5*r.R*r.C));
 const val=(c,tt)=>{const s=state(c,tt);return{V:s.Vc,I:s.I,Q:s.Q,U:s.U}[S.graph]};
 const all=[...S.runs,cfg()];let lo=0,hi=0;all.forEach(c=>{for(let k=0;k<=60;k++){const v=val(c,k/60*5*c.R*c.C);lo=Math.min(lo,v);hi=Math.max(hi,v)}});if(hi===lo)hi=lo+1;
 const X=tt=>pad+tt/Tmax*(w-pad-10),Y=v=>h-18-(v-lo)/(hi-lo)*(h-30);
 ctx.strokeStyle='#2a3566';ctx.beginPath();ctx.moveTo(pad,8);ctx.lineTo(pad,h-18);ctx.lineTo(w-6,h-18);ctx.stroke();if(lo<0){ctx.beginPath();ctx.moveTo(pad,Y(0));ctx.lineTo(w-6,Y(0));ctx.stroke()}
 ctx.fillStyle='#6b78ab';ctx.font='11px sans-serif';ctx.fillText({V:'V_C (V)',I:'I',Q:'Q',U:'U'}[S.graph],4,14);ctx.fillText('t (s) → '+PA.num(Tmax.toPrecision(3)),w-90,h-4);
 S.runs.forEach((c,i)=>{ctx.strokeStyle=`hsla(${200+i*40},60%,65%,.45)`;ctx.lineWidth=1.5;ctx.beginPath();for(let k=0;k<=120;k++){const tt=k/120*5*c.R*c.C;k?ctx.lineTo(X(tt),Y(val(c,tt))):ctx.moveTo(X(tt),Y(val(c,tt)))}ctx.stroke()});
 ctx.strokeStyle='#a78bfa';ctx.lineWidth=2.5;ctx.beginPath();for(let k=0;k<=160;k++){const tt=k/160*5*tau;k?ctx.lineTo(X(tt),Y(val(cfg(),tt))):ctx.moveTo(X(tt),Y(val(cfg(),tt)))}ctx.stroke();
 ctx.setLineDash([4,4]);ctx.strokeStyle='#ffd166';ctx.beginPath();ctx.moveTo(X(tau),8);ctx.lineTo(X(tau),h-18);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='#ffd166';ctx.fillText('τ',X(tau)+3,18);
 ctx.fillStyle='#ffd166';ctx.shadowColor='#ffd166';ctx.shadowBlur=12;ctx.beginPath();ctx.arc(X(S.t),Y(val(cfg(),S.t)),6,0,7);ctx.fill();ctx.shadowBlur=0}
function readouts(){const r=now(),tau=r.tau;
 const ro=(k,v)=>`<div class="ro"><small>${k}</small><b>${v}</b></div>`;
 $('#meters').innerHTML=ro('t',PA.num(S.t.toFixed(2))+' s')+ro('τ = RC',PA.num(tau.toPrecision(3))+' s')+ro('V_C',PA.num(r.Vc.toFixed(2))+' V')+ro('I',fmtI(r.I))+ro('Q',PA.num((r.Q*1e3).toPrecision(3))+' mC')+ro('U',PA.num((r.U*1e3).toPrecision(3))+' mJ')+ro(t('roFrac'),PA.num((r.frac*100).toFixed(1))+' %')+ro('t/τ',PA.num((S.t/tau).toFixed(2)));
 $('#Rv').textContent=S.Rk+' kΩ';$('#Cv').textContent=S.Cu+' µF';$('#Vv').textContent=S.V0+' V';$('#tv').textContent=PA.num((S.t/tau).toFixed(2))+' τ';$('#scrub').value=Math.min(5,S.t/tau);
 const b=$('#swBtn');b.textContent=(S.mode==='charge'?t('swA'):t('swB'))+'  ⇅';b.style.background=S.mode==='charge'?'var(--good)':'var(--neg)';$('#playBtn').textContent=S.playing?t('pause'):t('play');
 PA.tex($('#live'),S.mode==='charge'?`V_C=${S.V0}+(${PA.num(S.vs.toFixed(2))}-${S.V0})\\,e^{-${PA.num(S.t.toFixed(2))}/${PA.num(tau.toPrecision(3))}}=\\mathbf{${PA.num(r.Vc.toFixed(2))}\\ V}`:`V_C=${PA.num(S.vs.toFixed(2))}\\,e^{-${PA.num(S.t.toFixed(2))}/${PA.num(tau.toPrecision(3))}}=\\mathbf{${PA.num(r.Vc.toFixed(2))}\\ V}`);drawGraph()}
function saveRun(){if(S.t>0){S.runs.push(cfg());if(S.runs.length>4)S.runs.shift()}}
function bindLab(){const c=$('#circ');new ResizeObserver(()=>{const f=PA.fit(c);Cv=f}).observe(c);new ResizeObserver(()=>drawGraph()).observe($('#graph'));PA.visible(c,v=>S.on=v);
 // changing R, C or V0 starts a new run from the present capacitor voltage
 const param=(id,k)=>$('#'+id).oninput=e=>{const v=now().Vc;saveRun();S[k]=+e.target.value;S.vs=v;S.t=0;readouts()};param('R','Rk');param('C','Cu');param('V0','V0');
 $('#swBtn').onclick=()=>{const v=now().Vc;saveRun();S.mode=S.mode==='charge'?'discharge':'charge';S.vs=v;S.t=0;S.playing=true;readouts()};
 $('#playBtn').onclick=()=>{if(S.t>=5*tauNow()-1e-9)S.t=0;S.playing=!S.playing;readouts()};
 $('#tauBtn').onclick=()=>{S.t=tauNow();S.playing=false;readouts()};
 $('#resetBtn').onclick=()=>{S.runs=[];S.mode='charge';S.vs=0;S.t=0;S.playing=false;readouts()};
 $('#scrub').oninput=e=>{S.t=+e.target.value*tauNow();S.playing=false;readouts()};
 $$('#gSeg button').forEach(b=>b.onclick=()=>{S.graph=b.dataset.g;$$('#gSeg button').forEach(x=>x.classList.toggle('on',x===b));drawGraph()});
 $('#recordBtn').onclick=record;$('#clearRec').onclick=()=>{['recs','d1','disc'].forEach(k=>st().set(k,k==='recs'?[]:null));paintRecords()};
 $('#fsBtn').onclick=()=>{const w=$('#labwrap');const f=!w.classList.contains('full');w.classList.toggle('full',f);document.body.style.overflow=f?'hidden':'';try{f&&w.requestFullscreen?w.requestFullscreen().catch(()=>{}):document.fullscreenElement&&document.exitFullscreen()}catch(e){}};
 let lastT=0;(function loop(tm){requestAnimationFrame(loop);const dt=Math.min(.05,(tm-lastT)/1000);lastT=tm;if(!S.on||PA.mode!=='learn')return;
  if(S.playing){const tau=tauNow();S.t=Math.min(5*tau,S.t+dt*(5*tau/7));if(S.t>=5*tau)S.playing=false;if(tm-S.last>70){readouts();S.last=tm}}drawCircuit(tm)})(0)}

/* ================= MEASURE / DISCOVER / MISSIONS ================= */
function record(){const recs=st().get('recs',[]),r=now();recs.push({mode:S.mode,R:S.Rk,C:S.Cu,V0:S.V0,vs:+S.vs.toFixed(3),t:+S.t.toFixed(4),tau:r.tau,ttau:+(S.t/r.tau).toFixed(3),Vc:r.Vc,frac:r.frac});st().set('recs',recs);PA.toast(t('rec')(recs.length,PA.num((r.frac*100).toFixed(1))));paintRecords();paintGuide()}
function recordsTable(){const recs=st().get('recs',[]);if(!recs.length)return'';const th=t('th2');
 return`<table><thead><tr>${th.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${recs.map((r,i)=>`<tr><td>${i+1}</td><td>${t(r.mode)}</td><td>${r.R}</td><td>${r.C}</td><td>${PA.num(r.tau.toPrecision(3))}</td><td>${PA.num(r.t.toPrecision(3))}</td><td>${PA.num(r.ttau.toFixed(2))}</td><td>${PA.num(r.Vc.toFixed(2))}</td><td>${PA.num((r.frac*100).toFixed(1))}</td></tr>`).join('')}</tbody></table>`}
function paintRecords(){$('#recTable').innerHTML=recordsTable()||`<p class="empty">${t('noRec')}</p>`;paintDiscover();checkMissions()}
const at63=r=>r.mode==='charge'&&Math.abs(r.frac-.632)<.015;
function paintDiscover(){const box=$('#discover'),recs=st().get('recs',[]),pv=st().get('predict',null);
 if(st().get('disc',null)){box.innerHTML=(pv!=null?`<div class="guide">${pv===1?t('predR'):t('predW')(t('ch')[pv])}</div>`:'')+`<div class="discovery" style="display:block">${t('eGood')}</div><div class="row"><button class="btn sm" data-go="sF">→ ${t('kF')}</button></div>`;return}
 const a=recs.find(r=>r.mode==='charge'&&Math.abs(r.ttau-1)<.02);if(!a){box.innerHTML=`<div class="guide">${t('eWait')}</div>`;return}
 if(!st().get('d1',null)){box.innerHTML=`<p>${t('eAsk1')}</p><div class="ans"><input class="f" id="eIn" inputmode="decimal" placeholder="0.?"><button class="btn sm" id="eBtn">${PA.t('check')}</button></div><div class="res" id="eRes"></div>`;
  $('#eBtn').onclick=()=>{let v=PA.parseNum($('#eIn').value);if(v>1)v/=100;if(Math.abs(v-a.frac)<.02){st().set('d1',true);paintDiscover()}else{$('#eRes').className='res no';$('#eRes').textContent=t('eBad')}};return}
 const pair=recs.some(x=>at63(x)&&recs.some(y=>at63(y)&&y.C===x.C&&Math.abs(y.R/x.R-2)<.05&&Math.abs(y.t/x.t-2)<.06));
 if(!pair){box.innerHTML=`<div class="guide">✅ 1/2 · ${t('eWait2')}</div>`;return}
 box.innerHTML=`<p>${t('eAsk2')}</p><div class="opts">${t('fn').map((f,i)=>`<button data-fn="${i}">${f}</button>`).join('')}</div><div class="res" id="eRes"></div>`;
 $$('[data-fn]',box).forEach(b=>b.onclick=()=>{if(+b.dataset.fn===1){st().set('disc',true);paintDiscover();unlockF();checkMissions()}else{b.classList.add('wrong');$('#eRes').className='res no';$('#eRes').textContent=t('fnBad')}})}
function unlockF(){$('#fcard').classList.toggle('locked',!st().get('disc',null)&&!st().get('skipF',false))}
const MIS=[r=>r.some(at63),r=>r.some(x=>x.mode==='discharge'&&x.vs>0&&Math.abs(x.frac-.368)<.015),
 r=>r.some(x=>at63(x)&&r.some(y=>at63(y)&&y.R===x.R&&y.C>x.C*1.2&&Math.abs((y.t/x.t)/(y.C/x.C)-1)<.05)),()=>!!st().get('disc',null),()=>!!st().get('apply',false)];
function checkMissions(silent){const recs=st().get('recs',[]);const done=new Set(st().get('chal2',[]));MIS.forEach((ok,i)=>{if(!done.has(i)&&ok(recs)){done.add(i);if(!silent)PA.toast(t('mDone')(i+1))}});st().set('chal2',[...done]);
 $('#chals').innerHTML=t('missions').map((m,i)=>`<div class="chal ${done.has(i)?'ok':''}"><div class="tick">${done.has(i)?'✓':i+1}</div><div><b>${m[0]}</b><br><small>${PA.t('hint')}: ${m[1]}</small></div></div>`).join('');
 $('#chalScore').innerHTML=done.size===MIS.length?t('all'):t('score')(done.size,MIS.length)}

/* ================= PREDICT / FORMULA / SUMMARY ================= */
function paintPredict(){const v=st().get('predict',null);$('#choices').innerHTML=t('ch').map((c,i)=>`<button class="choice ${v===i?'picked':''}" data-c="${i}">${c}</button>`).join('');
 $$('#choices .choice').forEach(b=>b.onclick=()=>{st().set('predict',+b.dataset.c);paintPredict()});
 $('#predictFb').innerHTML=v!=null?`<p>${v===1?t('fbR'):t('fbO')(t('ch')[v])}</p><button class="btn" id="testBtn">${t('testBtn')}</button>`:t('fb0');const tb=$('#testBtn');if(tb)tb.onclick=startTest}
function startTest(){S.guideStart=st().get('recs',[]).length;L.loadLab({R:20,C:250,V0:12});paintGuide()}
function paintGuide(){const g=$('#labGuide');if(S.guideStart==null){g.style.display='none';return}const n=st().get('recs',[]).length-S.guideStart;g.style.display='block';g.innerHTML=n<=0?t('testGuide'):t('g1');$('#recordBtn').style.boxShadow=n<1?'0 0 0 4px rgba(255,209,102,.35)':'';$('#tauBtn').classList.toggle('on',n<1)}
const LINK={V:'V',V0:'V0',e:null,RC:'RC'};
function paintFormula(){PA.tex($('#bigFormula'),`\\htmlClass{piece p-V}{V_C}=\\htmlClass{piece p-V0}{V_0}\\left(1-\\htmlClass{piece p-e}{e^{-t/\\htmlClass{piece p-RC}{RC}}}\\right)`);$('#pieceInfo').innerHTML=t('tap');
 Object.keys(LINK).forEach(k=>{const el=$('#bigFormula .p-'+k);if(el)el.addEventListener('click',ev=>{ev.stopPropagation();$$('#bigFormula .piece').forEach(p=>p.classList.remove('active'));el.classList.add('active');$('#pieceInfo').innerHTML=t('pieces')[k]+(LINK[k]?` <button class="link" data-go="sC">${t('glow')}</button>`:'');if(LINK[k]){S.flash=LINK[k];S.flashT=performance.now()+300}})})}
function paintSummary(){$('#sumF').innerHTML=PA.formulaCards();PA.paintFormulaMath($('#sumF'));$('#sumList').innerHTML=PA.L(summary).map((s,i)=>`<li class="hl" id="sl${i}">${s}</li>`).join('');
 PA.tex($('#worked'),`\\tau=(2\\times10^4)(5\\times10^{-4})=10\\ \\mathrm{s},\\quad V_C(\\tau)=12(1-e^{-1})\\approx\\mathbf{${PA.num((12*(1-Math.exp(-1))).toFixed(2))}\\ V}`);$('#real').innerHTML=t('real').map((x,i)=>`<div><b>${x[0]}</b><span class="hl" id="rl${i}">${x[1]}</span></div>`).join('')}
function paintPath(cur){const v=new Set(st().get('visited',[]));$('#path').innerHTML=STEPS.map((s,i)=>`<button data-go="${s}" class="${v.has(i)?'done':''} ${i===cur?'now':''}"><b>${v.has(i)?'✓':String.fromCharCode(65+i)}</b>${UI[PA.lang].ethos[i]}</button>`).join('')}

const L={id:'rc',ref:'§11.13',title:{en:'Charging & Discharging a Capacitor',fr:'Charge et décharge d’un condensateur',ar:'شحن المكثف وتفريغه'},i18n,formulas,summary,textbook,practice,vault:'vault/rc.enc.json',
 mount(root){root.innerHTML=html;tank();bindLab();$('#skipF').onclick=()=>{st().set('skipF',true);unlockF()};
  $('#apBtn').onclick=()=>{const v=PA.parseNum($('#apIn').value),target=9*(1-Math.exp(-1));const ok=Math.abs(v-target)/target<.02;$('#apRes').className='res '+(ok?'ok':'no');$('#apRes').textContent=ok?t('apOk'):t('apNo');if(ok){st().set('apply',true);checkMissions()}};
  $('#pdfB').onclick=PA.openExp;
  const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const i=STEPS.indexOf(e.target.id);const v=new Set(st().get('visited',[]));v.add(i);st().set('visited',[...v]);paintPath(i)}}),{threshold:.3});STEPS.forEach(s=>so.observe($('#'+s)))},
 onLang(){$('#ethos').innerHTML=UI[PA.lang].ethos.map(x=>`<span>${x}</span>`).join('');$('#apBtn').textContent=PA.t('check');paintPath(-1);paintPredict();paintFormula();paintSummary();paintRecords();unlockF();checkMissions(true);readouts()},
 onMode(){},onTheme(){},
 progress(){return[[t('progL')[0],st().get('visited',[]).length,8],[t('progL')[1],st().get('chal2',[]).length,MIS.length],[t('progL')[2],st().get('pdone',[]).length,practice.length]]},
 recordsTable,
 loadLab(c){PA.setMode('learn');saveRun();Object.assign(S,{Rk:c.R,Cu:c.C,V0:c.V0,mode:'charge',vs:0,t:0,playing:false});$('#R').value=c.R;$('#C').value=c.C;$('#V0').value=c.V0;readouts();setTimeout(()=>PA.go('sC'),60)}};
PA.register(L);
window.RC_ENGINE={state};
})();
