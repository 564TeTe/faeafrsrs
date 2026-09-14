const STORAGE='compiler-notebook-48h-v2';
function readSaved(key){try{const v=JSON.parse(localStorage.getItem(key));return v&&typeof v==='object'?v:{}}catch{return {}}}
const saved=readSaved(STORAGE),legacy=readSaved('compiler-notebook-v1');
const state={answers:saved.answers||legacy.answers||{},paper:saved.paper||{},beginner:saved.beginner!==false};
let quizIndex=0,quizFilter='all',lastWrongId=null;
const main=document.querySelector('main');
const mobileScreen=window.matchMedia('(max-width:700px)');
function mobileDisclosure(label,body,classes=''){return `<details class="mobile-disclosure ${classes}" ${mobileScreen.matches?'':'open'}><summary>${label}</summary><div class="disclosure-body">${body}</div></details>`}
const allPapers=()=>[...exams,...variants];
function save(){try{localStorage.setItem(STORAGE,JSON.stringify(state))}catch{toast('无法保存进度，仍可阅读和做题。')}}
function toast(s){const t=document.getElementById('toast');t.textContent=s;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),3200)}
function route(){const r=location.hash.slice(1).split('/')[0]||'home';return ['ch1','sources'].includes(r)?'home':r==='cheat'?'templates':r}
function estimate(c){return c.exams.reduce((sum,id)=>sum+(state.paper[id]?exams.find(e=>e.id===id).points:0),0)}
function passed(c){return c.exams.every(id=>state.paper[id]&&state.paper[id.replace('e','v')])}
function corePassed(){return chapters.slice(0,3).every(passed)}
function nextPaper(){return ['e1','e2','e4','e5','e3','e6'].find(id=>!state.paper[id])||'e1'}
function heading(kicker,title,lead,extra=''){return `<div class="page-heading"><div><div class="eyebrow">${kicker}</div><h1>${title}</h1><p class="lead">${lead}</p></div>${extra}</div>`}
function beginnerSwitch(){return `<button class="secondary-button" data-beginner aria-pressed="${state.beginner}">${state.beginner?'零基础模式：已开启 · 切为直接做题':'零基础模式：已关闭 · 点击开启'}</button>`}
function beginnerSection(c){const b=beginnerLessons[c.id];return `<section id="beginner"><h2>1. 零基础：先理解这几个词</h2><details ${state.beginner?'open':''}><summary>第一次学，先看这里</summary><div class="solution"><p>${esc(b.intro)}</p>${b.concepts.map(([name,use,definition,example,exam])=>`<div class="callout"><h3>${esc(name)}</h3><p><strong>干什么的：</strong>${esc(use)}<br><strong>定义：</strong>${esc(definition)}<br><strong>小例子：</strong>${esc(example)}<br><strong>考试怎么用：</strong>${esc(exam)}</p>${c.id==='ch2'&&name==='语法树'?code("    S\n   / \\\n  A   A\n  |   |\n  a   b"):''}</div>`).join('')}<p>${esc(b.bridge)}</p><a class="mini-link" href="#${c.id}/quick">接着看：30 秒核心思想 →</a></div></details></section>`}
function closeMenu(){document.getElementById('sidebar').classList.remove('open');document.getElementById('menu').setAttribute('aria-expanded','false')}
function navigation(){
 const r=route();
 document.getElementById('navigation').innerHTML=`<a href="#home" class="${r==='home'?'active':''}"><span class="nav-icon">⌂</span>48 小时冲刺路线</a><a href="#templates" class="template-nav ${r==='templates'?'active':''}"><span class="nav-icon">≡</span>考试答题模板</a><div class="nav-group">按分值攻克 · 前三项 74 分</div>${chapters.map(c=>`<a href="#${c.id}" class="${r===c.id?'active':''}"><span class="nav-icon">${c.points}</span>${c.title}${passed(c)?'<span class="nav-done">✓</span>':''}</a>`).join('')}<div class="nav-group">纸笔做题是主线</div>${[['exam','▤','遮住答案，重做原题'],['variants','↺','六道同型变式'],['quiz','◎','概念检查（辅助）'],['wrong','!','概念错题回顾']].map(([id,icon,label])=>`<a href="#${id}" class="${r===id?'active':''}"><span class="nav-icon">${icon}</span>${label}</a>`).join('')}`;
 const n=chapters.slice(0,3).filter(passed).length;
 document.getElementById('side-count').textContent=`核心已自评通过 ${n} / 3 项`;
 document.getElementById('side-percent').textContent=`${Math.round(n/3*100)}%`;
 document.getElementById('side-bar').style.width=`${n/3*100}%`;
}
function home(){
 return heading('48 HOURS / 只练这张试卷','编译原理补考 · 48 小时拿分冲刺','先确保前 74 分题型会做，再学习 SLR。按试题收益安排时间。')+`
 ${mobileDisclosure('学习方式与模式',`<div class="callout"><b>${state.beginner?'零基础模式 · 第一次学，先看这里':'直接做题模式'}</b><p>${state.beginner?'第一次进入每个模块，先读必要概念，再看固定步骤和老师原题。先理解再动笔，不需要先刷选择题。':'已会基本概念，可以直接按模板做原题；不熟悉的词仍可在每章第一段展开查看。'}</p>${beginnerSwitch()}</div>`,'home-mode')}
 <section class="start-panel sprint-start"><div><div class="eyebrow">过线核心 · 原题 1—5</div><h2>保命 74 分</h2><p>文法 20 + 自动机 22 + LL(1) 32<br>先把这三类题，练到遮住答案也能写出完整过程。</p><a class="primary-button" href="${state.beginner?'#ch2/beginner':'#exam/'+nextPaper()}">${state.beginner?'第一次学：从文法基础开始 ↗':'遮住答案，重做原题 ↗'}</a>${state.beginner?'<p><a class="mini-link" href="#exam">已经理解概念？遮住答案，重做原题 →</a></p>':''}</div><div class="sprint-bonus"><span>核心过关后再学</span><strong>冲刺 26 分</strong><p>LR(0) / SLR(1)</p><a href="#ch5" class="mini-link">进入 SLR →</a></div></section>
 ${mobileDisclosure('分值与自评说明','<p class="fine score-disclaimer">74 / 26 是这份试卷的分值分组，不是保证得分。预计得分按你勾选“原题独立做对”估算；变式也独立做对后才标记模块通过。</p>')}
 <a class="template-banner" href="#templates"><strong>看到题以后按什么顺序写</strong><span>六张答题模板 · 考前 10 分钟看这里 →</span></a>
 <div class="section-head"><h2>四个得分模块</h2><small>前 3 个模块共 74 分，是当前过线核心。</small></div>
 <div class="score-modules">${chapters.map(c=>`<section class="score-module"><div class="module-head"><strong>${c.points}<small> 分</small></strong><span class="pill">${c.priority}</span></div><h2><a href="#${c.id}">${c.title} ↗</a></h2><p class="module-status">${passed(c)?'✓ 原题 + 变式均已自评通过':c.exams.some(id=>state.paper[id])?'原题已有通过；继续用变式验证':'待验证：先做原题，再做同型变式'}</p><div class="module-score">预计得分：<b>≈ ${estimate(c)} / ${c.points}</b><small>按原题自评，非考试承诺</small></div><div class="module-links">${c.exams.map(id=>`<a href="#exam/${id}">原题 ${id.slice(1)}${state.paper[id]?' ✓':''}</a>`).join('')}<a href="#${c.id}">必要讲解</a></div></section>`).join('')}</div>
 <section id="plan48"><div class="section-head"><h2>默认计划：48 小时补考冲刺</h2><small>第一天 5.5 小时 · 第二天 6 小时净学习</small></div><div class="two-day-plan">${sprintDays.map((day,i)=>`<details class="plan-panel mobile-disclosure" ${mobileScreen.matches?'':'open'}><summary>${day.title}</summary><div class="disclosure-body"><h3>${day.title}</h3><ol class="schedule">${day.tasks.map(([title,mins,target],j)=>`<li><a href="#${state.beginner&&i===0&&j===1?'ch4/beginner':target}"><span>${title}</span><b>${mins} 分钟</b></a>${i===1&&j===2?`<div class="core-gate ${corePassed()?'ready':''}"><strong>74 分检查点</strong><p>${corePassed()?'三项核心已自评通过，接下来进入 SLR。':'原题 1—5 或对应变式还有不会的，先补漏；必要时挪用后面 SLR 的时间。'}</p></div>`:''}</li>`).join('')}</ol></div></details>`).join('')}</div><p class="fine">把休息和睡眠留在学习时段之外。最后 60 分钟是快速模拟，不代表老师规定考试时长；先按顺序写出各题关键过程，再查漏。变式每类只有一道，原题做对后立即拿它验证。</p></section>
 <details class="mobile-disclosure study-disclosure" ${mobileScreen.matches?'':'open'}><summary>学习方法</summary><div class="disclosure-body"><div class="study-method"><div class="method"><b>${state.beginner?'① 先理解词，再看步骤':'① 模板看 2 分钟'}</b><p>${state.beginner?'先看每章第一段的小例子，再接固定模板和原题示范。':'知道先写什么，立即回到题目。'}</p></div><div class="method"><b>② 遮住答案亲手写</b><p>不只写结论，图、集合、表都写完整。</p></div><div class="method"><b>③ 变式验证后打勾</b><p>看过答案不算通过；不会的步骤才回看。</p></div></div></div></details>`;
}
function lesson(c){
 const flow=c.pipeline.map(([label,meaning,rule,example,trap,target])=>`<tr><th scope="row">${label}<small>${meaning}</small></th><td data-label="做法">${rule}</td><td data-label="例子">${example}<div class="step-error">易错：${trap}</div><a class="mini-link" href="#exam/${target}">立即做原题 ${target.slice(1)} →</a></td></tr>`).join('');
 return heading(`${c.points} POINTS / ${c.priority}`,c.title,`本模块建议 ${c.time} 分钟；${state.beginner?'先理解必要概念，再照步骤写完整过程。':'重点在完整过程。'}`)+`
 <p>${beginnerSwitch()}</p>
 ${mobileDisclosure(`本章 ${c.points} 分 · 考法与范围`,`<div class="chapter-brief">${[['这章值多少分',c.points+' 分'],['考试会怎么出',c.examType],['必须掌握',c.must],['可以不学',c.skip]].map(([a,b])=>`<div><b>${a}</b><p>${b}</p></div>`).join('')}</div>`,'chapter-overview')}
 <div class="article-grid"><article class="article">
 ${beginnerSection(c)}
 <section id="quick"><h2>2. 30秒看懂核心思想</h2><p>${c.summary}</p>${c.basics||''}<a class="mini-link" href="#${c.id}/pipeline">接着看：做题固定步骤 →</a></section>
 <section id="pipeline"><h2>3. 做题固定步骤</h2><details class="mobile-disclosure template-disclosure" ${mobileScreen.matches?'':'open'}><summary>固定答题模板</summary><div class="disclosure-body"><div class="compact-templates">${c.templateIds.map(id=>{const t=templates.find(t=>t.id===id);return `<div><h3>${t.title}</h3><p>${t.steps.map((s,i)=>`${i+1}. ${s}`).join(' → ')}</p></div>`}).join('')}</div></div></details><div class="table-wrap pipeline-table"><table><thead><tr><th>顺序 / 一句话含义</th><th>固定算法</th><th>老师同款例子 / 易错点 / 做题</th></tr></thead><tbody>${flow}</tbody></table></div><div id="pitfalls"><h3>三个最容易错的地方</h3><ol>${c.errors.map(e=>`<li>${e}</li>`).join('')}</ol></div><a class="mini-link" href="#${c.id}/worked">接着看：老师原题示范 →</a></section>
 <section id="worked"><h2>4. 老师原题示范</h2>${c.exams.map(id=>{const e=exams.find(e=>e.id===id);const prompt=e.prompt.split('<div class="callout"><b>【不会完整做时')[0];return `<details><summary>原题 ${id.slice(1)} · ${e.title}</summary><div class="solution">${prompt}${e.answer}</div></details>`}).join('')}${c.extra||''}<a class="mini-link" href="#${c.id}/do">看懂示范后：遮答案自己做 →</a></section>
 <section id="do"><h2>5. 遮答案自己做</h2><p>先独立重做原题，再完成对应的一道变式。只有对照解析确认过程完整后，才勾选“独立做对”。</p><div class="lesson-bottom">${c.exams.map(id=>`<a class="primary-button" href="#exam/${id}">遮住答案 · 原题 ${id.slice(1)} →</a><a class="secondary-button" href="#variants/${id.replace('e','v')}">同型变式 ${id.slice(1)} →</a>`).join('')}</div><p class="fine">原题自评：≈ ${estimate(c)} / ${c.points} 分。${passed(c)?'原题和变式都已通过。':'本模块还需独立作答验证。'}</p><a class="mini-link" href="#${c.id}/partial">写不完整时：先写这些关键步骤 →</a></section>
 <section id="partial"><h2>6. 不会时最低步骤分写法</h2>${c.exams.map(id=>{const e=exams.find(e=>e.id===id);return note(`原题 ${id.slice(1)} · ${e.short}`,`<ol>${partialCreditSteps[Number(id.slice(1))-1].map(step=>`<li>${esc(step)}</li>`).join('')}</ol>`)}).join('')}</section>
 <p class="fine">核对依据：${c.source}。沿用 #、ε、FIRST / FOLLOW / SELECT、ACTION / GOTO。状态编号不同不影响答案，集合和转移必须一致。</p>
 </article><aside class="toc"><h3>按这六段顺着学</h3>${[['beginner','零基础：先理解几个词'],['quick','30 秒核心思想'],['pipeline','做题固定步骤'],['worked','老师原题示范'],['do','遮答案自己做'],['partial','最低步骤分写法']].map(([id,s])=>`<a href="#${c.id}/${id}"><span class="full-label">${s}</span><span class="mobile-label">${{beginner:'概念',quick:'核心',pipeline:'步骤',worked:'原题',do:'自测',partial:'步骤分'}[id]}</span></a>`).join('')}<div class="tip"><a href="#templates">考前 10 分钟：答题模板 →</a><br><a href="#quiz/${c.id}">概念卡住时再检查 →</a></div></aside></div>`;
}
function paperCard(e,isVariant){const prompt=isVariant?e.prompt:e.prompt.replace(/<div class="callout"><b>【不会完整做时，也要写这些拿步骤分】<\/b>([\s\S]*?)<\/div>/,(_,body)=>mobileDisclosure('不会做时：先写这些步骤',note('【不会完整做时，也要写这些拿步骤分】',body),'partial-hints'));return `<article class="exam-card" id="${e.id}"><div class="exam-head"><div class="eyebrow">${isVariant?'同型变式 · 非试卷原题':'原题 '+e.id.slice(1)+' / '+e.points+' 分'}</div><h2>${e.title}</h2>${prompt}<div class="paper-links"><a href="#${e.chapter}" class="mini-link">只看必要讲解 →</a><a href="#templates/${e.templateId}" class="mini-link">查看答题模板 →</a><a href="#${isVariant?'exam/'+e.originalId:'variants/'+e.id.replace('e','v')}" class="mini-link">${isVariant?'对应原题':'做同型变式'} →</a></div></div><details><summary>写完后再展开解析</summary><div class="solution">${e.answer}<div class="self-check"><p>确认标准：没看答案，完整写出题目要求的步骤；对照发现的错误已独立重做改正。</p><button class="primary-button ${state.paper[e.id]?'done':''}" data-paper="${e.id}">${state.paper[e.id]?'✓ 已自评独立做对 · 点击撤销':'我已独立做对，记录通过'}</button><small>这是手动自评，不是自动阅卷。</small></div></div></details></article>`}
function examPage(isVariant=false){const list=isVariant?variants:exams;return heading(isVariant?'ONE VARIATION PER TYPE':'WRITE IT WITHOUT THE ANSWER',isVariant?'六道同型变式':'遮住答案，重做原题',isVariant?'每类只做一道，检验是否会迁移方法。变式不计入试卷 100 分。':'保留全部六道原题。先写完整过程，再核对；不会哪一步才回看讲解。')+`<div class="paper-toolbar"><button class="secondary-button" data-hide>遮住所有答案</button><a href="#templates" class="mini-link">看到题以后按什么顺序写 →</a></div><div class="exam-tags">${list.map(e=>`<a href="#${isVariant?'variants':'exam'}/${e.id}">${e.id.slice(1)}. ${e.short}${state.paper[e.id]?' ✓':''}</a>`).join('')}</div>${list.map(e=>paperCard(e,isVariant)).join('')}`}
function templatePage(){return heading('10 MINUTES BEFORE THE EXAM','看到题以后按什么顺序写','不补原理，只按顺序写。输入结束符 #；空串 ε；分析栈统一栈顶在右。','<span class="pill">考前 10 分钟 · 可打印</span>')+`<div class="cheat-grid answer-templates">${templates.map((t,i)=>`<section class="cheat-card" id="${t.id}"><div class="eyebrow">模板 ${i+1}</div><h2>${t.title}</h2><ol>${t.steps.map(s=>`<li>${s}</li>`).join('')}</ol><a class="mini-link" href="#exam/${t.target}">直接写原题 →</a></section>`).join('')}</div>`}
function subset(){return questions.filter(q=>quizFilter==='wrong'?state.answers[q.id]!==undefined&&state.answers[q.id]!==q.correct:quizFilter==='all'||q.chapter===quizFilter)}
function quizPage(wrong=false){
 if(wrong)quizFilter='wrong';else if(quizFilter==='wrong')quizFilter='all';
 const qs=subset();quizIndex=Math.max(0,Math.min(quizIndex,qs.length-1));const q=qs[quizIndex];
 const result=heading('CONCEPT CHECK / 辅助，不作为学习主线',wrong?'概念错题回顾':'概念检查',`${questions.length} 道现有题保留为辅助。只有概念卡住时再做；这些作答不计入模块得分。`);
 const filters=wrong?'':`<div class="quiz-filter">${[['all','全部'],...chapters.map(c=>[c.id,c.title])].map(([id,s])=>`<button data-filter="${id}" class="${quizFilter===id?'selected':''}" aria-pressed="${quizFilter===id}">${s}</button>`).join('')}</div>`;
 if(!q)return result+`<div class="empty"><h2>暂无概念错题</h2><p>主要时间用来写完整原题。</p><a class="primary-button" href="#exam">遮住答案，重做原题 →</a></div>`;
 const show=state.answers[q.id]!==undefined&&(!wrong||lastWrongId===q.id);
 return result+filters+`<div class="quiz-layout"><section class="quiz-card"><div class="quiz-top"><span>${chapters.find(c=>c.id===q.chapter).title}</span><span>第 ${quizIndex+1} / ${qs.length} 题</span></div><h2>${q.text}</h2>${q.code?code(q.code):''}<div class="answers">${q.options.map((s,i)=>`<button class="answer ${show?(i===q.correct?'correct':i===state.answers[q.id]?'wrong':''):''}" data-answer="${i}" data-qid="${q.id}" ${show&&!wrong?'disabled':''}><em>${'ABCD'[i]}</em><span>${esc(s)}</span></button>`).join('')}</div>${show?`<div class="feedback" role="status"><b>${state.answers[q.id]===q.correct?'✓ 正确':'正确答案：'+'ABCD'[q.correct]}</b>${q.explain}</div>`:''}<div class="quiz-footer"><button class="secondary-button" data-prev ${quizIndex===0?'disabled':''}>← 上一题</button><button class="primary-button" data-next ${quizIndex===qs.length-1?'disabled':''}>下一题 →</button></div></section><aside class="aside-card"><h3>概念检查题号</h3><div class="question-grid">${qs.map((x,i)=>`<button data-qindex="${i}" class="${quizIndex===i?'active ':''}${state.answers[x.id]===undefined?'':state.answers[x.id]===x.correct?'right':'wrong'}" aria-label="第 ${i+1} 题">${i+1}</button>`).join('')}</div>${wrong?'':'<button class="quiet-button" data-retry>清空本组概念答案，重做</button>'}<p class="fine">章节阅读记录不再自动算“会做”。分值估计只看原题手动自评，概念选择题不计分。</p><a href="#exam" class="mini-link">回到完整原题 →</a></aside></div>`;
}
function render(){
 const r=route(),sub=location.hash.slice(1).split('/')[1];navigation();closeMenu();
 let title='48 小时冲刺';const c=chapters.find(c=>c.id===r);
 if(c){main.innerHTML=lesson(c);title=c.title}
 else if(r==='exam'||r==='variants'){main.innerHTML=examPage(r==='variants');title=r==='exam'?'原题重做':'六道同型变式'}
 else if(r==='templates'){main.innerHTML=templatePage();title='考试答题模板'}
 else if(r==='quiz'||r==='wrong'){if(r==='quiz'&&chapters.some(c=>c.id===sub)){quizFilter=sub;quizIndex=0}main.innerHTML=quizPage(r==='wrong');title=r==='wrong'?'概念错题回顾':'概念检查'}
 else main.innerHTML=home();
 document.getElementById('crumb').textContent=title;document.title=title+' · 编译原理补考 48 小时冲刺';
 if(sub&&document.getElementById(sub))requestAnimationFrame(()=>document.getElementById(sub)?.scrollIntoView({behavior:'instant'}));else window.scrollTo({top:0,behavior:'instant'});
}
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.hasAttribute('data-beginner')){state.beginner=!state.beginner;save();render();toast(state.beginner?'零基础模式已开启：先看每章第一段。':'已切为直接做题；基础解释仍可手动展开。');}
 if(b.dataset.paper){const id=b.dataset.paper;if(!allPapers().some(p=>p.id===id))return;state.paper[id]=!state.paper[id];save();b.textContent=state.paper[id]?'✓ 已自评独立做对 · 点击撤销':'我已独立做对，记录通过';b.classList.toggle('done',state.paper[id]);navigation();toast(state.paper[id]?'已记录。再做对应变式验证方法。':'已撤销这题的通过记录。');}
 if(b.hasAttribute('data-hide')){document.querySelectorAll('details').forEach(d=>d.open=false);toast('答案已全部遮住。');}
 if(b.dataset.filter){quizFilter=b.dataset.filter;quizIndex=0;lastWrongId=null;main.innerHTML=quizPage(false);}
 if(b.dataset.qindex!==undefined){quizIndex=+b.dataset.qindex;lastWrongId=null;main.innerHTML=quizPage(route()==='wrong');}
 if(b.hasAttribute('data-next')||b.hasAttribute('data-prev')){quizIndex+=b.hasAttribute('data-next')?1:-1;lastWrongId=null;main.innerHTML=quizPage(route()==='wrong');}
 if(b.dataset.answer!==undefined){const q=questions.find(q=>q.id===b.dataset.qid);if(!q)return;state.answers[q.id]=+b.dataset.answer;lastWrongId=q.id;save();main.innerHTML=quizPage(route()==='wrong');if(route()==='wrong'&&state.answers[q.id]===q.correct)toast('答对了，已移出概念错题。');}
 if(b.hasAttribute('data-retry')){subset().forEach(q=>delete state.answers[q.id]);quizIndex=0;lastWrongId=null;save();main.innerHTML=quizPage(false);}
});
document.getElementById('menu').addEventListener('click',()=>{const on=document.getElementById('sidebar').classList.toggle('open');document.getElementById('menu').setAttribute('aria-expanded',String(on));});
document.addEventListener('click',e=>{if(!e.target.closest('#sidebar')&&!e.target.closest('#menu'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
document.getElementById('print').addEventListener('click',()=>{const closed=[...document.querySelectorAll('details:not([open])')];closed.forEach(d=>d.open=true);window.print();closed.forEach(d=>d.open=false);});
window.addEventListener('hashchange',render);
mobileScreen.addEventListener('change',event=>{document.querySelectorAll('.mobile-disclosure').forEach(detail=>{detail.open=!event.matches})});
render();
