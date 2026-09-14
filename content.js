/* 48 小时补考冲刺：静态内容，不加载外部资料。 */
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const code=s=>`<pre><code>${esc(s)}</code></pre>`;
const table=(heads,rows)=>`<div class="table-wrap"><table><thead><tr>${heads.map(x=>`<th scope="col">${x}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(x=>`<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const note=(title,body,warn=false)=>`<div class="callout${warn?' warn':''}"><b>${title}</b>${body}</div>`;
const checklist=items=>`<ul class="checklist">${items.map(x=>`<li>${x}</li>`).join('')}</ul>`;
function nfaGraph(first,last){
const m='nfa-'+first;
return `<div class="automaton"><svg viewBox="0 0 560 155" role="img" aria-label="初态0，经${first}到1，经ε到2；2有0和1自环，经ε到3，经${last}到终态4"><defs><marker id="${m}" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6"/></marker></defs><path d="M10 100 H53" marker-end="url(#${m})"/>${[0,1,2,3,4].map((n,i)=>`<circle cx="${80+i*100}" cy="100" r="26"/>${n===4?'<circle cx="480" cy="100" r="21"/>':''}<text x="${75+i*100}" y="106">${n}</text>`).join('')}${[first,'ε','ε',last].map((s,i)=>`<path d="M${106+i*100} 100 H${154+i*100}" marker-end="url(#${m})"/><text x="${124+i*100}" y="87">${s}</text>`).join('')}<path d="M265 78 C225 0 335 0 295 78" marker-end="url(#${m})"/><text x="268" y="22">0,1</text></svg></div>`;
}
function minDfaGraph(first,last){
const m='min-'+first;
return `<div class="automaton"><svg viewBox="0 0 640 240" role="img" aria-label="最小DFA：M0输入${first}到M1，另一个输入到陷阱M3；M1、M2输入${last}到终态M2，输入${first}到M1；M3有0和1自环"><defs><marker id="${m}" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6"/></marker></defs>${[[90,100,'M0'],[280,100,'M1'],[490,100,'M2'],[175,200,'M3']].map(([x,y,s])=>`<circle cx="${x}" cy="${y}" r="26"/><text x="${x-10}" y="${y+5}">${s}</text>`).join('')}<circle cx="490" cy="100" r="21"/><path d="M15 100 H64" marker-end="url(#${m})"/><path d="M116 100 H254" marker-end="url(#${m})"/><text x="175" y="85">${first}</text><path d="M303 87 Q383 30 467 87" marker-end="url(#${m})"/><text x="380" y="48">${last}</text><path d="M467 113 Q385 173 303 113" marker-end="url(#${m})"/><text x="380" y="158">${first}</text><path d="M265 80 C227 8 330 8 295 80" marker-end="url(#${m})"/><text x="274" y="23">${first}</text><path d="M475 80 C437 8 540 8 505 80" marker-end="url(#${m})"/><text x="484" y="23">${last}</text><path d="M101 124 L156 181" marker-end="url(#${m})"/><text x="113" y="164">${last}</text><path d="M197 185 C275 151 275 250 197 215" marker-end="url(#${m})"/><text x="252" y="205">0,1</text></svg></div>`;
}
function subsetDfaGraph(first,last){
const m='subset-'+first;
return `<div class="automaton large"><svg viewBox="0 0 570 390" role="img" aria-label="确定化DFA：A为初态，D为终态；A输入${first}到B，输入${last}到陷阱E；B、C、D输入${first}到C，输入${last}到D；E有0和1自环"><defs><marker id="${m}" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6"/></marker></defs>${[[80,170,'A'],[240,170,'B'],[430,80,'C'],[430,260,'D'],[80,320,'E']].map(([x,y,s])=>`<circle cx="${x}" cy="${y}" r="25"/><text x="${x-5}" y="${y+5}">${s}</text>`).join('')}<circle cx="430" cy="260" r="20"/><path d="M5 170 H55" marker-end="url(#${m})"/><path d="M105 170 H215" marker-end="url(#${m})"/><text x="155" y="155">${first}</text><path d="M80 195 V295" marker-end="url(#${m})"/><text x="59" y="245">${last}</text><path d="M262 158 L407 92" marker-end="url(#${m})"/><text x="320" y="113">${first}</text><path d="M262 182 L407 248" marker-end="url(#${m})"/><text x="320" y="233">${last}</text><path d="M408 92 Q338 170 408 248" marker-end="url(#${m})"/><text x="359" y="175">${last}</text><path d="M452 248 Q530 170 452 92" marker-end="url(#${m})"/><text x="502" y="175">${first}</text><path d="M417 58 C365 2 495 2 443 58" marker-end="url(#${m})"/><text x="425" y="18">${first}</text><path d="M417 282 C365 365 495 365 443 282" marker-end="url(#${m})"/><text x="425" y="357">${last}</text><path d="M67 342 C15 390 145 390 93 342" marker-end="url(#${m})"/><text x="66" y="383">0,1</text></svg></div>`;
}
function automatonAnswer(first,last){
const byBit=(a,b)=>first==='0'?[a,b]:[b,a];
return `<h3>① 按老师 PPT 第 87—88 页逐步拆边</h3>${code(`先连接：${first} · (0|1)* · ${last}\n闭包部分拆为：ε 进入 → (0|1) 循环 → ε 离开\n循环里的 0|1 再拆成两条边：0 自环、1 自环`)}${nfaGraph(first,last)}<p>M=(K,Σ,f,S,Z)：K={0,1,2,3,4}，Σ={0,1}，初态 S=0，终态集 Z={4}。完整转移如下，其余为无转移。</p>${table(['状态','输入 0','输入 1','ε'],[['0',...byBit('{1}','—'),'—'],['1','—','—','{2}'],['2','{2}','{2}','{3}'],['3',...byBit('—','{4}'),'—'],['4','—','—','—']])}<h3>② ε-closure 与子集构造</h3>${code('ε-closure({0})={0}\nε-closure({1})={1,2,3}\nε-closure({2})={2,3}\nε-closure({4})={4}')}${table(['DFA 状态','NFA 状态集合','输入 0','输入 1','终态？'],[['A','{0}',...byBit('B','E'),'否'],['B','{1,2,3}',...byBit('C','D'),'否'],['C','{2,3}',...byBit('C','D'),'否'],['D','{2,3,4}',...byBit('C','D'),'是'],['E','∅', 'E','E','否']])}<p>例如 B 读 ${last}：move 得 {2,4}，再做 ε-closure 得 {2,3,4}=D。含 NFA 终态 4，所以 D 是 DFA 终态。上表每一项也就是确定化 DFA 图的一条边。</p>${code(`确定化 DFA（★为终态，A为初态）：\nA ─${first}→ B     A ─${last}→ E\nB ─${first}→ C     B ─${last}→ D★\nC ─${first}→ C     C ─${last}→ D★\nD★─${first}→ C     D★─${last}→ D★\nE ─0,1→ E`)}${subsetDfaGraph(first,last)}<h3>③ 分割最小化</h3>${code(`P0 = { {D}, {A,B,C,E} }\nP1 = { {D}, {B,C}, {A,E} } // 按输入 ${last}，B、C 去终态组\nP2 = { {D}, {B,C}, {A}, {E} } // 按输入 ${first}，A 与 E 去不同组`)}<p>分组稳定。命名 M0={A}，M1={B,C}，M2={D}（终态），M3={E}（拒绝陷阱态）。</p>${table(['最小 DFA','输入 0','输入 1'],[['M0',...byBit('M1','M3')],['M1',...byBit('M1','M2')],['M2（终态）',...byBit('M1','M2')],['M3', 'M3','M3']])}${minDfaGraph(first,last)}${note('验算与状态数',`${first+last} 应接受；${first+last+last} 应接受；${first+last+first} 应拒绝。考试默认画完整 DFA，本题保留拒绝陷阱态，因此最小 DFA 为 4 个状态。除非老师明确允许不完全转换图，否则不要主动省略陷阱态。不同编号不影响答案，转移关系必须对应。`)}`;
}
const templates=[
{id:'t1',title:'构造文法',target:'e1',steps:['看顺序','看哪些数量相等','看最小次数是 0 还是 1','写递归','用最小合法串验算']},
{id:'t2',title:'最左 / 最右推导',target:'e2',steps:['写开始符号','最左：每次只替换最左非终结符','最右：每次只替换最右非终结符','最终必须完全等于目标串']},
{id:'t3',title:'短语 / 直接短语 / 句柄',target:'e2',steps:['先画语法树','根据非终结符子树的叶子序列找短语','直接短语对应一步产生式展开','按老师课件规则，取最左直接短语作为句柄']},
{id:'t4',title:'正规式 → NFA → DFA → 最小化',target:'e3',steps:['按子表达式逐步画 NFA','标初态 / 终态','求 ε-closure','列子集构造表','含 NFA 终态的集合标为 DFA 终态','先分终态 / 非终态','按转移去向反复细分，直到不变','画最小 DFA']},
{id:'t5',title:'LL(1)',target:'e4',steps:['消左递归 / 提左因子','FIRST','FOLLOW','SELECT','同左部 SELECT 两两求交','填预测分析表','按表分析输入串']},
{id:'t6',title:'SLR',target:'e6',steps:['拓广文法并给产生式编号','写 I0=closure({新开始符号→·原开始符号})','逐个 goto，补齐新项目集','画项目集 DFA','求 FOLLOW','检查移进 / 归约与归约 / 归约冲突','填 ACTION / GOTO','按表分析输入串']}
];
const chapters=[
{id:'ch2',n:'01',title:'文法与语言',points:20,priority:'必会 · 过线核心',time:90,exams:['e1','e2'],templateIds:['t1','t2','t3'],source:'第二章 PDF 第 11—23、32、39—41 页',examType:'构造文法 6 分；推导、语法树、短语与句柄合计 14 分。',must:'文法构造；最左 / 最右推导；语法树；句型 / 句子；短语 / 直接短语 / 句柄。',skip:'编译流程、文法类型与识别模型、二义性理论证明。',summary:'从开始符号按规则替换，能得到的串叫句型；其中只含终结符的是句子。推导写替换步骤，语法树记录每次展开的结构。',
basics:table(['符号','做题只记这一句'],[['S / A / a','S 是开始符号；A 等非终结符可继续替换；a 等终结符保留在最终串中'],['→ / ⇒ / ⇒*','产生式规则 / 实际推导一步 / 零步或多步'],['ε / aᵐ / |','空串（长度 0）/ 连续 m 个 a / 候选式之间的“或者”']]),
pipeline:[
['构造文法','把顺序和数量关系写成规则','外层一对用 S→aSb；停止规则决定最小次数','aᵐcⁿdⁿbᵐ：S→aSb|A；A→cAd|cd','m≥0 与 n≥1 的结束规则不同','e1'],
['最左 / 最右推导','决定每步替换哪个非终结符','每一步圈出最左 / 最右非终结符，只替换它','i+i*i 最左：E⇒E+T⇒T+T⇒F+T⇒i+T…','最右推导要先完成右侧括号内部','e2'],
['语法树','用树保留每次展开','根写开始符号；孩子按右部顺序；叶子读出目标串','T*F+i：根 E→E+T，左侧 T→T*F，右侧 T→F→i','叶子顺序必须与目标串一致','e2'],
['短语 / 直接短语 / 句柄','按老师的子树判法找','取非终结符子树的叶子序列；一步展开是直接短语；取最左直接短语作句柄','T*F+i：短语 T*F+i、T*F、i；直接短语 T*F、i；句柄 T*F','不能按“它是叶子”或字符个数排除','e2']],
extra:`<details class="teacher-note"><summary>老师第 41 页：单个 F 为什么也算短语？</summary><div class="solution">${code('句型：F+T*F\nE⇒E+T⇒T+T⇒F+T⇒F+T*F\n\n        E\n      / | \\\n     E  +  T\n     |    /|\\\n     T   T * F\n     |\n     F')}${table(['老师列出的项目','答案'],[['短语','F、T*F、F+T*F'],['直接短语','F、T*F'],['句柄（最左直接短语）','F']])}<p>左侧 F 是以 T 为根、按 T→F 展开的子树的叶子序列，所以是短语和直接短语。右侧乘积里的 F 位置不同，不能只按“同样是 F”判断。老师第 39 页强调：产生式右部不一定是给定句型的直接短语，必须回到这棵树。</p></div></details>`,
errors:['只顾数量相等，忘记顺序或最小次数。','最左 / 最右推导中途换方向，最终串与题目不同。','没画树就排除所有叶子，或把所有产生式右部都算直接短语。']},
{id:'ch3',n:'02',title:'正规式与自动机',points:22,priority:'必会 · 过线核心',time:150,exams:['e3'],templateIds:['t4'],source:'第三章 PDF 第 43—44、50、56、60—80、86—89 页',examType:'NFA 6 分；确定化 8 分；最小化 8 分。',must:'按子表达式画 NFA；ε-closure / 子集表；分割法；最小 DFA。',skip:'词法分析概述、Lex、正规文法互转、语言类理论、额外正则记号。',summary:'先把正规式拆成边，再把 NFA 状态集合当成 DFA 状态，最后合并等价状态。本题 0(0|1)*1：以 0 开头、以 1 结尾，中间可空。',
basics:table(['课件记号','统一用法'],[['M=(K,Σ,f,S,Z)','K 状态集；Σ 输入字母表；f 转移；S 初态；Z 终态集'],['r|t / rt / r*','选择 / 连接 / 零次或多次重复；优先级为 *、连接、|'],['ε-closure(I)','只沿 ε 边可达的状态集合，包含 I 自身']]),
pipeline:[
['① 画 NFA','按 PPT 拆子表达式','单符号 x─a→y；ε 用 ε 边；连接插中间点；r|t 分两路；r* 用“ε 进入、r 循环、ε 离开”','0─0→1─ε→2─ε→3─1→4；2 有 0、1 自环','初态 0、终态 4 必须标清','e3'],
['② 确定化','用集合记录所有可能状态','从初态 S 求 ε-closure({S})；对 I、a 求 ε-closure(move(I,a))；新集合继续算','A={0} 读 0 得 B={1,2,3}；B 读 1 得 D={2,3,4}','每次 move 后都做 ε-closure；含 4 的集合是终态','e3'],
['③ 最小化','按去向分组区分状态','先分终态 / 非终态；逐输入比较去向分组；反复细分到稳定','{D}|{A,B,C,E} → {D}|{B,C}|{A,E} → {D}|{B,C}|{A}|{E}','比较去向的组，不是只看是否终态','e3'],
['④ 画最小 DFA','每个稳定分组换成一个状态','标初态、终态和各输入转移，用合法 / 非法串验算','01、011 接受；010 拒绝','考试默认画完整 DFA；本题保留拒绝陷阱态，共 4 态','e3']],
errors:['ε-closure 漏掉自身，或 move 后忘记继续沿 ε 边走。','子集含 NFA 终态，却没标成 DFA 终态。','只分一次就停止；把陷阱态与普通非终态合并。']},
{id:'ch4',n:'03',title:'LL(1) 预测分析',points:32,priority:'必会 · 过线核心',time:180,exams:['e4','e5'],templateIds:['t5'],source:'第四章：等价变换第 3—16 页；定义第 13—29 页；分析方法第 11—21 页',examType:'改写、集合与判别 18 分；预测表与输入串 14 分。',must:'按“改写 → FIRST → FOLLOW → SELECT → 判别 → 填表 → 分析”写。',skip:'递归下降程序代码、二义性理论扩展、课件外算法。',summary:'每次看一个输入符号，为栈顶非终结符选规则。三个集合算对，判断和填表就有依据；不要跨步。',
pipeline:[
['① 左递归 / 左公因子','让候选式可区分','A→Aα|β 改 A→βA′，A′→αA′|ε；A→αβ1|αβ2 提为 A→αX，X→β1|β2；间接递归先代入暴露','原题 A→dA′，A′→bA′|ε；S→bX，X→SAe|A','改写后仍要用 SELECT 判别','e4'],
['② FIRST','这串能以什么终结符开头','从右部左端依次取 FIRST 去 ε；前面可空才继续；全可空才加 ε；反复至不变','FIRST(S′)={a,f,ε}；FIRST(P)={q}','第一个可空时要继续看后面','e5'],
['③ FOLLOW','A 后面可能紧跟什么','开始加 #；B→αAβ 加 FIRST(β)−{ε}；β 可空再加 FOLLOW(B)；各出现位置反复求到不变','S→PS′：FOLLOW(P)={a,f,#}，因为 S′ 可空','不含 ε；继承产生式左部的 FOLLOW','e5'],
['④ SELECT','什么输入下选择这条产生式','取 FIRST(右部)−{ε}；右部可空再并 FOLLOW(左部)','SELECT(P′→ε)={a,f,#}','不能只检查右部是否字面写 ε','e5'],
['⑤ 判断 LL(1)','同一输入能否唯一选规则','同左部 SELECT 两两求交，全空才是 LL(1)','S′ 的 {a}、{f}、{#} 两两不交','不同左部的交集不作这种冲突判断','e5'],
['⑥ 预测分析表','把 SELECT 写成查表入口','a∈SELECT(A→α) 就在 M[A,a] 填 A→α；其余空格为出错','M[P′,a]=P′→ε；M[P′,b]=P′→bP','空格不等于 ε；一格两条即冲突','e5'],
['⑦ 分析输入串','查表展开或匹配','栈顶在右；展开右部逆序入栈；匹配才读新输入；ε 只弹栈；#/# 接受','qaqf# 第 4 步：#S′P′，输入 aqf#，用 P′→ε','展开不消耗输入；ε 不入栈','e5']],
errors:['FOLLOW 只扫描一轮，漏掉传播来的元素。','可空右部的 SELECT 漏 FOLLOW 或含 ε。','栈顶方向不统一，右部未逆序入栈，或展开就推进输入。']},
{id:'ch5',n:'04',title:'LR(0) / SLR(1)',points:26,priority:'必会 · 核心过关后冲刺',time:150,exams:['e6'],templateIds:['t6'],source:'第五章 LR0 第 29—45 页；SLR（1）第 4—16 页',examType:'项目集与 DFA 6 分；判别 6 分；分析表 6 分；输入串 8 分。',must:'拓广、项目、closure、goto、项目集 DFA、FOLLOW、冲突、ACTION / GOTO、分析过程。',skip:'LR 历史和优缺点、长篇活前缀理论、LR(1)、LALR(1)、YACC。',summary:'移进：读一个输入并压栈。归约：栈顶右部换成产生式左部。项目集决定状态，FOLLOW 限制 SLR 的归约列。前 74 分题型还不会时，先补漏。',
pipeline:[
['① 拓广文法','设置唯一接受入口','新加 Z→A；原产生式从 (1) 编号','(1) A→aAd；(2) A→aAb；(3) A→ε','新开始符号不与原符号混用','e6'],
['② LR(0) 项目','点记右部识别位置','右部各位置放 ·；A→ε 只有 A→·','A→·aAd，A→a·Ad，A→aA·d，A→aAd·','A→· 已完成，不移进 ε','e6'],
['③ closure','补点后非终结符的规则','有 B→α·Aβ，就加所有 A→·γ；反复到不再增加','I0={Z→·A,A→·aAd,A→·aAb,A→·}','保留原项目，继续检查新项目','e6'],
['④ goto','过一个符号后再求闭包','收集点后为 X 的项目，点右移一位，再 closure','goto(I0,a)=I2，含 A→a·Ad 及 A 的各初始项目','不要只保留移点后的项目','e6'],
['⑤ 项目集规范族','找齐所有不同集合','对每个集合逐个 goto；新集合编号，相同集合复用；到无新集合','本题 I0—I5 共六个项目集','编号不同不影响答案，转移必须一致','e6'],
['⑥ 活前缀 DFA','把 goto 画成边','goto(Ii,X)=Ij 画 Ii─X→Ij，标初态 I0','I0─a→I2；I2─a→I2；I2─A→I3','终结符和非终结符转移都画','e6'],
['⑦ FOLLOW','确定归约输入列','使用与 LL(1) 相同的 FOLLOW 算法','FOLLOW(A)={b,d,#}','不使用 FIRST 限制归约','e6'],
['⑧ 判断冲突','看同一 ACTION 格是否有多动作','LR(0) 归约填全列；SLR 只填 FOLLOW；查移进/归约、归约/归约冲突','I0、I2 移进 {a} 与归约 {b,d,#} 不交；SLR 无冲突，LR(0) 有','有移进与归约项目，不等于有 SLR 冲突','e6'],
['⑨ ACTION / GOTO','把转移与归约填表','终结符边填 s；非终结符边填 GOTO；A→α· 只在 FOLLOW(A) 填 r；Z→A· 在 # 填 acc','ACTION[2,b]=r3；GOTO[2,A]=3','r 后是产生式号，不是状态号','e6'],
['⑩ 输入串分析','按表移进或归约','移进才读输入；归约弹 |右部| 层；查弹栈后 GOTO；ε 弹 0 层','ab#：s2 → r3 → s5 → r2 → acc','ε 归约仍要压 A 与新状态','e6']],
errors:['closure 漏 A→· 或递归加入的项目。','SLR 归约填满全列，不按 FOLLOW 限制。','用弹栈前状态查 GOTO，或 ε 归约错误弹栈。']}
];
const sprintDays=[
{title:'第一天 · 文法 + LL(1)',minutes:330,tasks:[['文法构造 + 推导 + 语法树 + 短语 / 句柄',90,'ch2'],['LL(1) 文法改写',30,'ch4/pipeline'],['FIRST / FOLLOW / SELECT',90,'ch4/pipeline'],['预测分析表 + 输入串',60,'exam/e5'],['遮住答案重做原题 1、2、4、5',60,'exam']]},
{title:'第二天 · 自动机 → 核心检查 → SLR',minutes:360,tasks:[['正规式 → NFA',45,'ch3'],['NFA → DFA',60,'ch3/pipeline'],['DFA 最小化',45,'exam/e3'],['LR(0) 项目集 + closure / goto',75,'ch5'],['SLR 表 + 输入串',75,'exam/e6'],['整套原题快速模拟 + 查漏',60,'exam']]}
];

const exams=[
  {
    "short": "构造文法",
    "title": "由语言构造上下文无关文法",
    "points": 6,
    "chapter": "ch2",
    "prompt": "<p>写一个文法 G，使其语言为：</p><div class=\"formula\">L(G) = { aᵐcⁿdⁿbᵐ | m ≥ 0，n ≥ 1 }</div>",
    "answer": "<h3>第一步：辨认两层数量关系</h3><p>a、b 数量相等且包在外层；c、d 数量相等且在内层。外层允许 0 对，内层至少 1 对。</p><h3>第二步：给出文法</h3><pre><code>S → aSb | A\nA → cAd | cd</code></pre><p>取 V<sub>N</sub>={S,A}，V<sub>T</sub>={a,b,c,d}，开始符号 S，产生式集为上述规则。</p><h3>第三步：说明正确性</h3><p>每次 S→aSb 增加一对外层 a、b，做 m 次后用 S→A；每次 A→cAd 增加一对内层 c、d，做 n−1 次后用 A→cd 结束。所以所有生成串都具有目标形式，而且任意满足约束的 m、n 都可这样生成。</p><pre><code>m=0,n=1：S ⇒ A ⇒ cd\nm=2,n=2：S ⇒ aSb ⇒ aaSbb ⇒ aaAbb ⇒ aacAdbb ⇒ aaccddbb</code></pre><div class=\"callout\"><b>易错点</b>若内层以 ε 结束，会错误允许 n=0；若写成独立的 a*、b*，无法保证外层数量相等。</div>",
    "id": "e1",
    "templateId": "t1"
  },
  {
    "short": "推导与语法树",
    "title": "最左／最右推导、语法树与句柄",
    "points": 14,
    "chapter": "ch2",
    "prompt": "<pre><code>E → T | E+T | E-T\nT → F | T*F | T/F\nF → (E) | i</code></pre><p>① 写出 i+i*i 的最左推导、i*(i+i) 的最右推导，并画树。② 证明 T*F+i 是句型并画树。③ 写出它的所有短语、直接短语和句柄。14 分由简答题总分 20 减去第 1 题 6 分得到；照片未标各小问分值。</p>",
    "answer": "<h3>① i+i*i：最左推导</h3><pre><code>E ⇒ E+T ⇒ T+T ⇒ F+T ⇒ i+T\n  ⇒ i+T*F ⇒ i+F*F ⇒ i+i*F ⇒ i+i*i</code></pre><pre><code>        E\n      / | \\\n     E  +  T\n     |    /|\\\n     T   T * F\n     |   |   |\n     F   F   i\n     |   |\n     i   i</code></pre><h3>i*(i+i)：最右推导</h3><pre><code>E ⇒ T ⇒ T*F ⇒ T*(E) ⇒ T*(E+T)\n  ⇒ T*(E+F) ⇒ T*(E+i) ⇒ T*(T+i)\n  ⇒ T*(F+i) ⇒ T*(i+i) ⇒ F*(i+i) ⇒ i*(i+i)</code></pre><pre><code>        E\n        |\n        T\n      / | \\\n     T  *  F\n     |   / | \\\n     F  (  E  )\n     |   / | \\\n     i  E  +  T\n        |     |\n        T     F\n        |     |\n        F     i\n        |\n        i</code></pre><p>最右推导要先把右边整个括号表达式展开完，才能回到最左边的 T。</p><h3>② 证明 T*F+i 是句型</h3><pre><code>E ⇒ E+T ⇒ E+F ⇒ E+i ⇒ T+i ⇒ T*F+i</code></pre><pre><code>        E\n      / | \\\n     E  +  T\n     |     |\n     T     F\n   / | \\   |\n  T  *  F  i</code></pre><p>存在从开始符号 E 到这个串的推导，因此它是句型。上面还是一个最右推导，所以它是规范句型。</p><h3>③ 从同一棵树找短语</h3><div class=\"table-wrap\"><table><thead><tr><th scope=\"col\">类型</th><th scope=\"col\">答案</th></tr></thead><tbody><tr><td>全部短语（字符串去重）</td><td>T*F+i、T*F、i</td></tr><tr><td>直接短语</td><td>T*F、i</td></tr><tr><td>句柄</td><td>T*F</td></tr></tbody></table></div><p>T*F 可以由左侧 T 一步生成；i 可以由右侧 F 一步生成。按最左直接短语规则，句柄为 T*F。判断的是具体位置对应的子树叶子序列，而不是符号本身。课件第 41 页的 F+T*F 中，左侧 F 就由 T→F 一步展开，是短语、直接短语和句柄。不能据“它是叶子”一概排除。</p><div class=\"callout\"><b>符号 i 的意义</b>这里 i 是文法的一个终结符，通常代表标识符 token。它不参与加减乘除求值；题目考查的是结构和推导。</div>",
    "id": "e2",
    "templateId": "t2"
  },
  {
    "short": "NFA → 最小 DFA",
    "title": "构造 0(0|1)*1 的最小 DFA",
    "points": 22,
    "chapter": "ch3",
    "prompt": "<p>对正规式 R=0(0|1)*1：① 构造 NFA（6 分）；② 确定化为 DFA（8 分）；③ 最小化并画图（8 分）。</p>",
    "answer": "",
    "id": "e3",
    "templateId": "t4"
  },
  {
    "short": "改写与 SELECT",
    "title": "消除左递归、提取左因子并判定 LL(1)",
    "points": 18,
    "chapter": "ch4",
    "prompt": "<pre><code>S → bSAe | bA\nA → Ab | d</code></pre><p>① 改写文法（4 分）；② 求 FIRST、FOLLOW、SELECT（8 分）；③ 判断是否为 LL(1) 文法（6 分）。下文对改写后的文法计算和判别。</p>",
    "answer": "<h3>① 改写文法</h3><p>A 有直接左递归；S 的两个候选式有公共前缀 b。用 X 表示提取公共因子后引入的新非终结符。</p><pre><code>S  → bX\nX  → SAe | A\nA  → dA′\nA′ → bA′ | ε</code></pre><h3>② FIRST 与 FOLLOW</h3><div class=\"table-wrap\"><table><thead><tr><th scope=\"col\">非终结符</th><th scope=\"col\">FIRST</th><th scope=\"col\">FOLLOW</th></tr></thead><tbody><tr><td>S</td><td>{b}</td><td>{d,#}</td></tr><tr><td>X</td><td>{b,d}</td><td>{d,#}</td></tr><tr><td>A</td><td>{d}</td><td>{d,e,#}</td></tr><tr><td>A′</td><td>{b,ε}</td><td>{d,e,#}</td></tr></tbody></table></div><p>FOLLOW 的来源：</p><ol><li>S 是开始符号，FOLLOW(S) 加 #。</li><li>X→SAe 中 S 后接 A，FIRST(A)={d}，所以 FOLLOW(S) 加 d。</li><li>S→bX 中 X 在末尾，所以 FOLLOW(X) 包含 FOLLOW(S)。</li><li>X→SAe 给 FOLLOW(A) 加 e；X→A 再加入 FOLLOW(X)。</li><li>A→dA′ 使 FOLLOW(A′) 包含 FOLLOW(A)；递归 A′→bA′ 不增加新元素。</li></ol><div class=\"table-wrap\"><table><thead><tr><th scope=\"col\">产生式</th><th scope=\"col\">SELECT</th></tr></thead><tbody><tr><td>S→bX</td><td>{b}</td></tr><tr><td>X→SAe</td><td>{b}</td></tr><tr><td>X→A</td><td>{d}</td></tr><tr><td>A→dA′</td><td>{d}</td></tr><tr><td>A′→bA′</td><td>{b}</td></tr><tr><td>A′→ε</td><td>{d,e,#}</td></tr></tbody></table></div><h3>③ 结论：改写后是 LL(1) 文法</h3><p>X 的两个候选式 SELECT 分别为 {b}、{d}，交集为空；A′ 的两个候选式 SELECT 分别为 {b}、{d,e,#}，交集为空；S 和 A 各只有一条产生式。因此改写后的文法是 LL(1)。</p><div class=\"callout warn\"><b>原文法与改写后文法要分清</b>原文法的 S 两个候选式都以 b 开头，且 A 有左递归，因此原文法不是 LL(1)。本题通过等价改写得到了 LL(1) 文法。</div>",
    "id": "e4",
    "templateId": "t5"
  },
  {
    "short": "预测分析过程",
    "title": "构造预测分析表，并分析 qaqf#",
    "points": 14,
    "chapter": "ch4",
    "prompt": "<pre><code>S  → PS′\nS′ → aPS′ | fS′ | ε\nP  → qP′\nP′ → bP | ε</code></pre><p>① SELECT 集合（4 分）；② 预测分析表（4 分）；③ qaqf# 的完整分析过程（6 分）。</p>",
    "answer": "<h3>① 先求必要集合</h3><div class=\"table-wrap\"><table><thead><tr><th scope=\"col\">非终结符</th><th scope=\"col\">FIRST</th><th scope=\"col\">FOLLOW</th></tr></thead><tbody><tr><td>S</td><td>{q}</td><td>{#}</td></tr><tr><td>S′</td><td>{a,f,ε}</td><td>{#}</td></tr><tr><td>P</td><td>{q}</td><td>{a,f,#}</td></tr><tr><td>P′</td><td>{b,ε}</td><td>{a,f,#}</td></tr></tbody></table></div><div class=\"table-wrap\"><table><thead><tr><th scope=\"col\">产生式</th><th scope=\"col\">SELECT</th></tr></thead><tbody><tr><td>S→PS′</td><td>{q}</td></tr><tr><td>S′→aPS′</td><td>{a}</td></tr><tr><td>S′→fS′</td><td>{f}</td></tr><tr><td>S′→ε</td><td>{#}</td></tr><tr><td>P→qP′</td><td>{q}</td></tr><tr><td>P′→bP</td><td>{b}</td></tr><tr><td>P′→ε</td><td>{a,f,#}</td></tr></tbody></table></div><h3>② 预测分析表 M</h3><div class=\"table-wrap\"><table><thead><tr><th scope=\"col\">非终结符</th><th scope=\"col\">a</th><th scope=\"col\">b</th><th scope=\"col\">f</th><th scope=\"col\">q</th><th scope=\"col\">#</th></tr></thead><tbody><tr><td>S</td><td>—</td><td>—</td><td>—</td><td>S→PS′</td><td>—</td></tr><tr><td>S′</td><td>S′→aPS′</td><td>—</td><td>S′→fS′</td><td>—</td><td>S′→ε</td></tr><tr><td>P</td><td>—</td><td>—</td><td>—</td><td>P→qP′</td><td>—</td></tr><tr><td>P′</td><td>P′→ε</td><td>P′→bP</td><td>P′→ε</td><td>—</td><td>P′→ε</td></tr></tbody></table></div><p>“—”表示出错，不是 ε。各单元格最多一条规则，因此没有 LL(1) 冲突。</p><h3>③ 分析过程：栈顶在右</h3><div class=\"table-wrap\"><table><thead><tr><th scope=\"col\">步</th><th scope=\"col\">分析栈</th><th scope=\"col\">剩余输入</th><th scope=\"col\">动作</th></tr></thead><tbody><tr><td>1</td><td>#S</td><td>qaqf#</td><td>S→PS′</td></tr><tr><td>2</td><td>#S′P</td><td>qaqf#</td><td>P→qP′</td></tr><tr><td>3</td><td>#S′P′q</td><td>qaqf#</td><td>匹配 q</td></tr><tr><td>4</td><td>#S′P′</td><td>aqf#</td><td>P′→ε</td></tr><tr><td>5</td><td>#S′</td><td>aqf#</td><td>S′→aPS′</td></tr><tr><td>6</td><td>#S′Pa</td><td>aqf#</td><td>匹配 a</td></tr><tr><td>7</td><td>#S′P</td><td>qf#</td><td>P→qP′</td></tr><tr><td>8</td><td>#S′P′q</td><td>qf#</td><td>匹配 q</td></tr><tr><td>9</td><td>#S′P′</td><td>f#</td><td>P′→ε</td></tr><tr><td>10</td><td>#S′</td><td>f#</td><td>S′→fS′</td></tr><tr><td>11</td><td>#S′f</td><td>f#</td><td>匹配 f</td></tr><tr><td>12</td><td>#S′</td><td>#</td><td>S′→ε</td></tr><tr><td>13</td><td>#</td><td>#</td><td>接受</td></tr></tbody></table></div><div class=\"callout\"><b>自查两件事</b>每一行的输入只在“匹配”时前进；S′→aPS′ 入栈后，最右边必须是 a，这样下一步才能先匹配 a。</div>",
    "id": "e5",
    "templateId": "t5"
  },
  {
    "short": "SLR 全流程",
    "title": "构造 SLR(1) 表，并分析 ab#",
    "points": 26,
    "chapter": "ch5",
    "prompt": "<pre><code>A → aAd | aAb | ε</code></pre><p>① 项目集规范族与活前缀 DFA（6 分）；② 证明为 SLR(1)（6 分）；③ 分析表（6 分）；④ ab# 分析过程（8 分）。照片最后一问写“预测分析表”，此处按题目上下文使用 SLR 分析表。</p>",
    "answer": "<h3>① 拓广与编号</h3><pre><code>(0) Z → A\n(1) A → aAd\n(2) A → aAb\n(3) A → ε</code></pre><h3>项目集规范族</h3><pre><code>I0 = { Z→·A, A→·aAd, A→·aAb, A→· }\nI1 = { Z→A· }\nI2 = { A→a·Ad, A→a·Ab, A→·aAd, A→·aAb, A→· }\nI3 = { A→aA·d, A→aA·b }\nI4 = { A→aAd· }\nI5 = { A→aAb· }</code></pre><div class=\"table-wrap\"><table><thead><tr><th scope=\"col\">起点</th><th scope=\"col\">符号</th><th scope=\"col\">终点</th></tr></thead><tbody><tr><td>I0</td><td>A</td><td>I1</td></tr><tr><td>I0</td><td>a</td><td>I2</td></tr><tr><td>I2</td><td>a</td><td>I2</td></tr><tr><td>I2</td><td>A</td><td>I3</td></tr><tr><td>I3</td><td>d</td><td>I4</td></tr><tr><td>I3</td><td>b</td><td>I5</td></tr></tbody></table></div><pre><code>I0 ──A──▶ I1\n │\n a\n ▼\nI2 ──A──▶ I3 ──d──▶ I4\n ↻ a       │\n           b\n           ▼\n           I5</code></pre><p>上面列出了活前缀 DFA 的全部有定义转移。</p><h3>② 判断 SLR(1)</h3><p>由 A→aAd、A→aAb 和 A 为原开始符号，得到 FOLLOW(A)={d,b,#}。</p><ul><li>I0、I2 同时有移进与 ε 归约项目。移进输入集合为 {a}，归约只发生在 {d,b,#}，两者不相交。</li><li>I3 只在 d、b 上分别移进；没有归约项目。</li><li>I4 只有规则 (1) 的归约；I5 只有规则 (2) 的归约，没有归约／归约冲突。</li><li>I1 只有接受项目。</li></ul><p>因此所有 ACTION 格无冲突，文法是 <strong>SLR(1)</strong>。它不是 LR(0)：LR(0) 会把 I0、I2 的 ε 归约填到 a 列，造成移进／归约冲突。</p><h3>③ SLR 分析表</h3><div class=\"table-wrap\"><table><thead><tr><th scope=\"col\">状态</th><th scope=\"col\">ACTION a</th><th scope=\"col\">ACTION b</th><th scope=\"col\">ACTION d</th><th scope=\"col\">ACTION #</th><th scope=\"col\">GOTO A</th></tr></thead><tbody><tr><td>0</td><td>s2</td><td>r3</td><td>r3</td><td>r3</td><td>1</td></tr><tr><td>1</td><td>—</td><td>—</td><td>—</td><td>acc</td><td>—</td></tr><tr><td>2</td><td>s2</td><td>r3</td><td>r3</td><td>r3</td><td>3</td></tr><tr><td>3</td><td>—</td><td>s5</td><td>s4</td><td>—</td><td>—</td></tr><tr><td>4</td><td>—</td><td>r1</td><td>r1</td><td>r1</td><td>—</td></tr><tr><td>5</td><td>—</td><td>r2</td><td>r2</td><td>r2</td><td>—</td></tr></tbody></table></div><p>s2 表示移进到状态 2；r3 表示按编号 (3) A→ε 归约。r 后面是<strong>产生式编号</strong>，不是目标状态号。</p><h3>④ 输入 ab#：栈顶在右</h3><div class=\"table-wrap\"><table><thead><tr><th scope=\"col\">步</th><th scope=\"col\">状态栈</th><th scope=\"col\">符号栈</th><th scope=\"col\">输入</th><th scope=\"col\">动作</th></tr></thead><tbody><tr><td>1</td><td>0</td><td>#</td><td>ab#</td><td>s2：移进 a</td></tr><tr><td>2</td><td>0 2</td><td># a</td><td>b#</td><td>r3：A→ε，不弹栈；GOTO[2,A]=3</td></tr><tr><td>3</td><td>0 2 3</td><td># a A</td><td>b#</td><td>s5：移进 b</td></tr><tr><td>4</td><td>0 2 3 5</td><td># a A b</td><td>#</td><td>r2：A→aAb，弹 3 层；GOTO[0,A]=1</td></tr><tr><td>5</td><td>0 1</td><td># A</td><td>#</td><td>acc：接受</td></tr></tbody></table></div><div class=\"callout\"><b>检查空串也应能接受</b>输入只有 # 时，状态 0 先用 r3 归约 A→ε，再经 GOTO[0,A]=1，最后 acc。这与文法能够生成 ε 一致。</div>",
    "id": "e6",
    "templateId": "t6"
  }
];
exams[2].answer=automatonAnswer('0','1');
const variants=[
{id:'v1',originalId:'e1',chapter:'ch2',templateId:'t1',short:'改变最小次数',title:'文法构造：外层至少一对，内层可空',prompt:`<div class="formula">L(G)={aᵐcⁿdⁿbᵐ | m≥1，n≥0}</div><p>构造文法，用两个最小边界例子验算。</p>`,answer:`${code('S → aSb | aAb\nA → cAd | ε')}<p>外层结束规则 aAb 保留一对 a、b；内层允许为空。两条递归各自成对增加，不改变顺序。</p>${code('m=1,n=0：S⇒aAb⇒ab\nm=1,n=1：S⇒aAb⇒acAdb⇒acdb')}<p>不能生成 ε 或 cd。若仍用 A→cd 结束，会错误排除 n=0。</p>`},
{id:'v2',originalId:'e2',chapter:'ch2',templateId:'t3',short:'换推导与句型',title:'推导与短语：i*i+i、T+i*F',prompt:`${code('E → T | E+T | E-T\nT → F | T*F | T/F\nF → (E) | i')}<p>① 写 i*i+i 的最左推导、i+(i*i) 的最右推导并画树。② 证明 T+i*F 是句型，画树并按老师定义找短语、直接短语和句柄。</p>`,answer:`<h3>① 两种推导</h3>${code('i*i+i 最左：\nE⇒E+T⇒T+T⇒T*F+T⇒F*F+T\n ⇒i*F+T⇒i*i+T⇒i*i+F⇒i*i+i\n\ni+(i*i) 最右：\nE⇒E+T⇒E+F⇒E+(E)⇒E+(T)\n ⇒E+(T*F)⇒E+(T*i)⇒E+(F*i)⇒E+(i*i)\n ⇒T+(i*i)⇒F+(i*i)⇒i+(i*i)')}${code('i*i+i：\n        E\n      / | \\\n     E  +  T\n     |     |\n     T     F\n   / | \\   |\n  T  *  F  i\n  |     |\n  F     i\n  |\n  i\n\ni+(i*i)：\n        E\n      / | \\\n     E  +  T\n     |     |\n     T     F\n     |   / | \\\n     F  (  E  )\n     |     |\n     i     T\n         / | \\\n        T  *  F\n        |     |\n        F     i\n        |\n        i')}<h3>② 句型与子树</h3>${code('E⇒E+T⇒T+T⇒T+T*F⇒T+F*F⇒T+i*F\n\n        E\n      / | \\\n     E  +  T\n     |    /|\\\n     T   T * F\n         |\n         F\n         |\n         i')}${table(['按老师课件规则','结果（字符串去重）'],[['短语','T、i、i*F、T+i*F'],['直接短语','T、i'],['句柄：最左直接短语','T']])}<p>左侧 T 是 E→T 子树的叶子序列，是短语和直接短语；i 来自 F→i。乘积末尾的 F 位置不同。必须按具体子树判断，不能排除所有单个叶子符号。</p>`},
{id:'v3',originalId:'e3',chapter:'ch3',templateId:'t4',short:'交换首尾符号',title:'自动机：1(0|1)*0',prompt:`<div class="formula">R=1(0|1)*0</div><p>按课件方法画 NFA；列 ε-closure 与子集构造表，画 DFA；给出分割过程和最小 DFA。</p>`,answer:automatonAnswer('1','0')},
{id:'v4',originalId:'e4',chapter:'ch4',templateId:'t5',short:'改写与集合',title:'LL(1)：换终结符，重新算集合',prompt:`${code('S → aSAb | aA\nA → Ac | d')}<p>改写文法；求 FIRST / FOLLOW / SELECT；判断改写后是否为 LL(1)。</p>`,answer:`<h3>① 改写</h3>${code('S  → aX\nX  → SAb | A\nA  → dA′\nA′ → cA′ | ε')}<h3>② 集合</h3>${table(['非终结符','FIRST','FOLLOW'],[['S','{a}','{d,#}'],['X','{a,d}','{d,#}'],['A','{d}','{b,d,#}'],['A′','{c,ε}','{b,d,#}']])}<p>X→SAb 中 A 不可空，故 FOLLOW(S) 加 d；A 后面是 b，故 FOLLOW(A) 加 b。X→A 把 FOLLOW(X)={d,#} 传给 A，A→dA′ 再传给 A′。</p>${table(['产生式','SELECT'],[['S→aX','{a}'],['X→SAb','{a}'],['X→A','{d}'],['A→dA′','{d}'],['A′→cA′','{c}'],['A′→ε','{b,d,#}']])}<h3>③ 判断</h3><p>X 的 {a} 与 {d} 不交；A′ 的 {c} 与 {b,d,#} 不交；其他左部各一条规则，因此改写后为 LL(1)。原文法有左递归且共享前缀，不能说原文法就是 LL(1)。</p>`},
{id:'v5',originalId:'e5',chapter:'ch4',templateId:'t5',short:'多走一次 bP',title:'预测分析：qbqaq#',prompt:`${code('S  → PS′\nS′ → aPS′ | fS′ | ε\nP  → qP′\nP′ → bP | ε')}<p>重写 SELECT 与预测分析表，分析 qbqaq#。这次会实际使用 P′→bP。</p>`,answer:exams[4].answer.split('<h3>③')[0]+`<h3>③ qbqaq#：栈顶在右</h3>${table(['步','分析栈','剩余输入','动作'],[['1','#S','qbqaq#','S→PS′'],['2','#S′P','qbqaq#','P→qP′'],['3','#S′P′q','qbqaq#','匹配 q'],['4','#S′P′','bqaq#','P′→bP'],['5','#S′Pb','bqaq#','匹配 b'],['6','#S′P','qaq#','P→qP′'],['7','#S′P′q','qaq#','匹配 q'],['8','#S′P′','aq#','P′→ε'],['9','#S′','aq#','S′→aPS′'],['10','#S′Pa','aq#','匹配 a'],['11','#S′P','q#','P→qP′'],['12','#S′P′q','q#','匹配 q'],['13','#S′P′','#','P′→ε'],['14','#S′','#','S′→ε'],['15','#','#','接受']])}<p>文法不变，集合与表不变。第 4 步展开 bP 不消耗输入；第 5 步匹配才消耗 b。</p>`},
{id:'v6',originalId:'e6',chapter:'ch5',templateId:'t6',short:'嵌套两层归约',title:'SLR：aabc#，连续两层归约',prompt:`${code('A → aAc | aAb | ε')}<p>拓广、编号、构造项目集与 DFA，判断 LR(0) / SLR(1)，填 ACTION / GOTO，再分析 aabc#。</p>`,answer:`<h3>① 拓广、编号、项目集</h3>${code('(0) Z→A\n(1) A→aAc\n(2) A→aAb\n(3) A→ε\n\nI0={Z→·A,A→·aAc,A→·aAb,A→·}\nI1={Z→A·}\nI2={A→a·Ac,A→a·Ab,A→·aAc,A→·aAb,A→·}\nI3={A→aA·c,A→aA·b}\nI4={A→aAc·}\nI5={A→aAb·}')}${code('I0 ─A→ I1\n │\n a\n ▼\nI2 ─A→ I3 ─c→ I4\n ↻ a    │\n        b\n        ▼\n        I5')}<h3>② FOLLOW 与冲突</h3><p>FOLLOW(A)={b,c,#}。I0、I2 移进输入为 {a}，与 FOLLOW(A) 不交；I3 只移进；I4、I5 各一个归约项目；I1 在 # 接受。所以是 SLR(1)。LR(0) 在 I0、I2 的 a 列会同时移进和归约，因此不是 LR(0)。</p><h3>③ 分析表</h3>${table(['状态','ACTION a','ACTION b','ACTION c','ACTION #','GOTO A'],[['0','s2','r3','r3','r3','1'],['1','—','—','—','acc','—'],['2','s2','r3','r3','r3','3'],['3','—','s5','s4','—','—'],['4','—','r1','r1','r1','—'],['5','—','r2','r2','r2','—']])}<h3>④ 分析 aabc#</h3>${table(['步','状态栈','符号栈','输入','动作'],[['1','0','#','aabc#','s2：移进 a'],['2','0 2','# a','abc#','s2：移进 a'],['3','0 2 2','# a a','bc#','r3：A→ε，GOTO[2,A]=3'],['4','0 2 2 3','# a a A','bc#','s5：移进 b'],['5','0 2 2 3 5','# a a A b','c#','r2：弹 3 层，GOTO[2,A]=3'],['6','0 2 3','# a A','c#','s4：移进 c'],['7','0 2 3 4','# a A c','#','r1：弹 3 层，GOTO[0,A]=1'],['8','0 1','# A','#','acc：接受']])}<p>第 5 步只归约内层 aAb；外层 a 仍在栈里。第 7 步才归约外层 aAc。</p>`}
];
const questions=[
  {
    "id": "q06",
    "chapter": "ch2",
    "text": "文法 S→aSb|ab 能生成哪个串？",
    "options": [
      "ε",
      "aab",
      "aaabbb",
      "abab"
    ],
    "correct": 2,
    "explain": "每层递归成对增加 a、b，且以 ab 结束，因此生成 aⁿbⁿ，n≥1。",
    "code": ""
  },
  {
    "id": "q07",
    "chapter": "ch2",
    "text": "“最左推导”中的“最左”指什么？",
    "options": [
      "选最左边书写的产生式",
      "替换当前串最左边的非终结符",
      "从输入最后一个字符开始",
      "每次只产生左括号"
    ],
    "correct": 1,
    "explain": "最左推导只约束当前要替换哪个非终结符，不约束产生式在纸面上的顺序。",
    "code": ""
  },
  {
    "id": "q09",
    "chapter": "ch2",
    "text": "原题 T*F+i 的句柄是什么？",
    "options": [
      "i",
      "T*F",
      "整个 T*F+i",
      "单个未展开的 T"
    ],
    "correct": 1,
    "explain": "依据原题语法树，直接短语是 T*F 和 i；该规范句型的最左直接短语 T*F 是句柄。",
    "code": ""
  },
  {
    "id": "q10",
    "chapter": "ch3",
    "text": "正规式 0(0|1)*1 不接受哪个串？",
    "options": [
      "01",
      "001",
      "011",
      "010"
    ],
    "correct": 3,
    "explain": "该语言要求以 0 开始并以 1 结束。010 最后是 0，所以不接受。",
    "code": ""
  },
  {
    "id": "q11",
    "chapter": "ch3",
    "text": "子集构造中，一个 DFA 状态对应什么？",
    "options": [
      "一个 NFA 状态集合",
      "一条正则式",
      "一个输入字符",
      "一条语法树路径"
    ],
    "correct": 0,
    "explain": "子集法用集合表示 NFA 处理当前输入前缀后可能处于的全部状态。",
    "code": ""
  },
  {
    "id": "q12",
    "chapter": "ch3",
    "text": "ε-closure(I) 一定包含什么？",
    "options": [
      "所有 NFA 状态",
      "只有接受态",
      "I 自身的全部状态",
      "恰好一个初态"
    ],
    "correct": 2,
    "explain": "零次 ε 转移也允许，所以 ε-closure 必须包含原集合 I。",
    "code": ""
  },
  {
    "id": "q13",
    "chapter": "ch3",
    "text": "一个子集状态何时成为 DFA 接受态？",
    "options": [
      "包含所有 NFA 接受态才行",
      "只要包含至少一个 NFA 接受态",
      "状态编号为最大时",
      "集合大小超过 1 时"
    ],
    "correct": 1,
    "explain": "NFA 的接受是存在性条件：只要存在一条读完整串的接受路径即可。",
    "code": ""
  },
  {
    "id": "q14",
    "chapter": "ch3",
    "text": "最小化 DFA 的初始分组通常是什么？",
    "options": [
      "初态与其他状态",
      "接受态与非接受态",
      "按入边数量分组",
      "每个状态独立一组后结束"
    ],
    "correct": 1,
    "explain": "ε 这个后续串已经能区分接受态和非接受态，二者不可能等价。随后再按转移去向细分。",
    "code": ""
  },
  {
    "id": "q15",
    "chapter": "ch3",
    "text": "同为非接受态的两个 DFA 状态，是否一定可以合并？",
    "options": [
      "一定可以",
      "只要都可达就可以",
      "不一定，要比较所有后续串的接受行为",
      "只要编号相邻就可以"
    ],
    "correct": 2,
    "explain": "可能存在某个后续输入让一个到接受态、另一个不到，这样就不能合并。",
    "code": ""
  },
  {
    "id": "q16",
    "chapter": "ch4",
    "text": "A→Aα|β 消除直接左递归后应怎样写？",
    "options": [
      "A→αA′；A′→βA′|ε",
      "A→βA′；A′→αA′|ε",
      "A→β|ε",
      "A→A′β；A′→Aα"
    ],
    "correct": 1,
    "explain": "先产生非左递归部分 β，再用 A′ 表示零次或多次重复 α。标准模式要求 α 非空。",
    "code": ""
  },
  {
    "id": "q17",
    "chapter": "ch4",
    "text": "给定下列文法，FIRST(BC) 是什么？",
    "options": [
      "{b}",
      "{b,c}",
      "{b,c,ε}",
      "{c,ε}"
    ],
    "correct": 2,
    "explain": "B 可以为空，因此还要看 C；B、C 都可空，因此整个 BC 也可空。",
    "code": "B → b | ε\nC → c | ε"
  },
  {
    "id": "q18",
    "chapter": "ch4",
    "text": "哪种集合绝不应该包含 ε？",
    "options": [
      "FIRST(A)",
      "FIRST(α)",
      "FOLLOW(A)",
      "FIRST(ε)"
    ],
    "correct": 2,
    "explain": "FOLLOW 收集的是可能紧随其后的终结符或 #，ε 不是真正的后继符号。",
    "code": ""
  },
  {
    "id": "q19",
    "chapter": "ch4",
    "text": "对于 B→αAβ，若 β 可以为空，除了 FIRST(β)−{ε}，还应向 FOLLOW(A) 加入什么？",
    "options": [
      "FIRST(B)",
      "FOLLOW(B)",
      "FOLLOW(β) 必须含 ε",
      "只有 #，不管 B 的位置"
    ],
    "correct": 1,
    "explain": "β 能消失，意味着跟随左部 B 的符号也可能直接跟随 A，所以继承 FOLLOW(B)。",
    "code": ""
  },
  {
    "id": "q20",
    "chapter": "ch4",
    "text": "SELECT(A→ε) 等于什么？",
    "options": [
      "{ε}",
      "FIRST(A)",
      "FOLLOW(A)",
      "空集合"
    ],
    "correct": 2,
    "explain": "右部为空，只能根据 A 后面允许出现的输入符号来选择这条产生式。",
    "code": ""
  },
  {
    "id": "q21",
    "chapter": "ch4",
    "text": "判定 LL(1) 时，哪些 SELECT 需要两两不相交？",
    "options": [
      "任意两条产生式的 SELECT",
      "只有不同左部的候选式",
      "只有不含 ε 的候选式",
      "同一左部的不同候选式"
    ],
    "correct": 3,
    "explain": "冲突发生在同一个非终结符和同一个当前输入下需要选择多个候选式。",
    "code": ""
  },
  {
    "id": "q22",
    "chapter": "ch4",
    "text": "预测分析中应用 A→ε 时，正确动作是什么？",
    "options": [
      "弹出 A，不读取新输入",
      "把 ε 压栈，再匹配 ε",
      "输入前进一个符号，不弹栈",
      "直接接受"
    ],
    "correct": 0,
    "explain": "ε 不消耗任何输入，也不入栈。只移除栈顶的 A。",
    "code": ""
  },
  {
    "id": "q23",
    "chapter": "ch5",
    "text": "ε 产生式 A→ε 的 LR(0) 项目是什么？",
    "options": [
      "A→·ε，必须移进 ε",
      "A→ε·，一定先读一个字符",
      "A→·，已经是归约项目",
      "没有项目"
    ],
    "correct": 2,
    "explain": "ε 右部长度是 0，所以只有一个点的位置，且不需要识别输入符号。",
    "code": ""
  },
  {
    "id": "q24",
    "chapter": "ch5",
    "text": "计算 closure 时，何时需要补充其他产生式项目？",
    "options": [
      "点后是非终结符",
      "点前是任意终结符",
      "项目已经结束",
      "只要集合里有初态"
    ],
    "correct": 0,
    "explain": "点后非终结符 C 表示接下来可能识别 C 的右部，需要加入 C→·γ 并继续求闭包。",
    "code": ""
  },
  {
    "id": "q25",
    "chapter": "ch5",
    "text": "SLR(1) 与 LR(0) 填表最关键的区别是什么？",
    "options": [
      "SLR 不使用项目集",
      "SLR 按 FIRST 限制移进",
      "SLR 在 FOLLOW(A) 的列才做 A→α 归约",
      "SLR 的所有项目都带一个展望符"
    ],
    "correct": 2,
    "explain": "SLR 使用 LR(0) 项目集，通过 FOLLOW 集限制归约列。项目不携带逐项展望符。",
    "code": ""
  },
  {
    "id": "q26",
    "chapter": "ch5",
    "text": "按 A→aAb 归约时，应该弹出多少个文法符号和状态？",
    "options": [
      "1 个符号、1 个状态",
      "2 个符号、2 个状态",
      "3 个符号、3 个状态",
      "3 个符号，不弹状态"
    ],
    "correct": 2,
    "explain": "右部是 a、A、b 三个文法符号，因此两个栈各弹 3 个，然后查弹栈后状态的 GOTO。",
    "code": ""
  },
  {
    "id": "q27",
    "chapter": "ch5",
    "text": "原题 A→aAd|aAb|ε 的 FOLLOW(A) 是什么？",
    "options": [
      "{a}",
      "{a,b,d,#}",
      "{b,d,#}",
      "{ε,b,d}"
    ],
    "correct": 2,
    "explain": "A 在两个右部中分别紧接 d、b；A 又是开始符号，所以加入 #。",
    "code": ""
  },
  {
    "id": "q28",
    "chapter": "ch5",
    "text": "同一状态里既有移进项目又有归约项目，能否立即断言不是 SLR(1)？",
    "options": [
      "能，必然冲突",
      "不能，还要看移进输入与归约 FOLLOW 列是否相交",
      "能，因为 SLR 只允许归约",
      "不能，因为 SLR 永远不冲突"
    ],
    "correct": 1,
    "explain": "只有同一个 ACTION 单元格需要填写多个动作才是冲突。",
    "code": ""
  },
  {
    "id": "q29",
    "chapter": "ch5",
    "text": "归约后查 GOTO，使用哪两个参数？",
    "options": [
      "弹栈前状态、当前输入",
      "初始状态、产生式右部",
      "弹栈后栈顶状态、产生式左部",
      "归约规则编号、#"
    ],
    "correct": 2,
    "explain": "归约先移除右部，得到先前状态 t，再用 GOTO[t,A] 压入新状态。",
    "code": ""
  },
  {
    "id": "q30",
    "chapter": "ch5",
    "text": "LR 分析在什么时候接受整个输入？",
    "options": [
      "栈里第一次出现开始符号就接受",
      "看到任意归约项目就接受",
      "输入变成 # 就接受，不管状态",
      "处于拓广产生式完成项目的状态，且当前输入为 #"
    ],
    "correct": 3,
    "explain": "接受由特殊项目 Z→A· 和输入结束标记 # 共同决定。",
    "code": ""
  }
];

// 六道原题的步骤分提示；沿用现有卡片样式，不进入变式。
const partialCreditSteps=[
  [
    "写出 a、c、d、b 的排列顺序。",
    "标出 a/b 等量、c/d 等量。",
    "标出 m≥0、n≥1 的最小次数。",
    "写外层、内层的递归与结束规则。",
    "用最小合法串 cd 验算。"
  ],
  [
    "从 E 开始写推导，每步只替换最左／最右非终结符。",
    "画对应语法树，核对叶子序列与目标串。",
    "写出 T*F+i 的推导与语法树。",
    "按非终结符子树的叶子序列列短语。",
    "列出一步产生式展开对应的直接短语。",
    "写最左直接短语作为句柄。"
  ],
  [
    "按子表达式画 NFA，标初态 S=0 和终态。",
    "写 ε-closure。",
    "列子集构造表，含 NFA 终态的集合标为 DFA 终态。",
    "按表画 DFA 转移。",
    "先分终态组与非终态组。",
    "写出反复细分的分组过程。",
    "画保留拒绝陷阱态的 4 状态最小 DFA。"
  ],
  [
    "消除 A 的左递归，提取 S 的公共左因子。",
    "列 FIRST。",
    "列 FOLLOW。",
    "逐个产生式列 SELECT。",
    "比较同左部 SELECT 的交集，写 LL(1) 判断。"
  ],
  [
    "列各产生式的 SELECT。",
    "按 SELECT 填预测分析表。",
    "注明栈顶在右，写初始栈 #S 与输入 qaqf#。",
    "逐行写展开、匹配，直到接受。"
  ],
  [
    "拓广文法并给产生式编号。",
    "写 I0=closure({Z→·A})。",
    "逐个求 goto，列项目集并画 DFA 转移。",
    "写 FOLLOW(A)。",
    "检查移进／归约、归约／归约冲突，写 SLR(1) 判断。",
    "填写 ACTION / GOTO，归约只填 FOLLOW(A) 对应列。",
    "列状态栈、符号栈、剩余输入与动作，分析 ab#。"
  ]
];
exams.forEach((exam,index)=>{
  exam.prompt+=note("【不会完整做时，也要写这些拿步骤分】", `<ol>${partialCreditSteps[index].map(step=>`<li>${step}</li>`).join('')}</ol>`);
});

// 每条只回答四件事：用途、定义、小例子、考试用法。
const beginnerLessons={
ch2:{
 intro:'先记两句话：产生式本质上就是替换规则；推导本质上就是不断按规则替换。下面主要用 S→AA，A→a|b；竖线 | 表示“或者”。大写字母先当作待替换的位置。',
 concepts:[
 ['产生式','告诉你一个位置能换成什么。','本卷用 A→α 表示把非终结符 A 替换成右边的串 α；α 只是“这一串”的代号。','A→a|b 就是 A→a 或 A→b；A→ε 表示把 A 换成空串，即删去 A。','构造文法时写规则；推导时每一步只能使用已有规则。'],
 ['终结符','是最后答案中要留下的字符。','在本卷文法中不能再用产生式展开的符号，属于 VT。','S→AA，A→a|b 中，a、b 是终结符。','圈出目标串中的字符；推导完成时只剩终结符。'],
 ['非终结符','是还要按规则展开的位置。','表示语法成分、可作为本卷产生式左部的符号，属于 VN。','S→AA，A→a|b 中，S、A 是非终结符。','最左／最右推导每步找的都是非终结符。'],
 ['开始符号','规定整个替换过程从哪里出发。','文法指定的起点，是 VN 中的一个非终结符，记作 S。','文法 G[S] 从 S 开始；文法 G[E] 则从 E 开始。','推导第一行、语法树的根都写题目指定的开始符号。'],
 ['文法 G=(VN,VT,S,P)','把符号和替换规则放在一起，说明哪些串能生成。','VN 是非终结符集，VT 是终结符集，S 是开始符号，P 是产生式集。','VN={S,A}，VT={a,b}，开始符号 S，P={S→AA,A→a,A→b}。','写文法时交代开始符号和规则；题目要求四元组时按这个顺序列。'],
 ['推导','不断按替换规则，把起点变成目标串。','一次替换写 ⇒；零步或多步写 ⇒*；→ 用来写规则。','用 S→AA、A→a、A→b：S⇒AA⇒aA⇒ab。','每个 ⇒ 都应能指明所用产生式，不能凭空添字符。'],
 ['最左推导','让替换顺序固定，方便逐步核对。','每一步只替换当前串中最左边的非终结符。','S⇒AA⇒aA⇒ab：先把左边 A 换成 a，再把右边 A 换成 b。','从左向右找可替换符号，跳过已经是终结符的字符。'],
 ['最右推导','按另一种固定顺序完成同一目标。','每一步只替换当前串中最右边的非终结符。','S⇒AA⇒Ab⇒ab：先把右边 A 换成 b，再把左边 A 换成 a。','每一步重新找最右非终结符；最终串仍按正常顺序写 ab。'],
 ['句型','给推导途中的每个合法结果一个名字。','从开始符号经零步或多步推导得到的符号串。','S、AA、aA、ab 都是上述文法的句型。','证明某串是句型，写一条从开始符号到它的推导即可。'],
 ['句子','表示替换已经全部完成的合法串。','只含终结符的句型。','ab 是句子；aA 还含 A，所以是句型但不是句子。','既要能从开始符号推出，又要不含非终结符。'],
 ['语法树','把“谁替换成谁”画出来，保留展开关系。','根是开始符号；一个展开结点的孩子从左到右是所用产生式的右部。','S 的孩子是两个 A；左 A 的孩子为 a，右 A 的孩子为 b（见下方小树）。','先按规则画树，再从左到右读叶子；句型的叶子可以仍是非终结符。'],
 ['短语','找出当前句型里由一个语法成分展开得到的整块。','在当前语法树中，取以非终结符为根、经过展开的子树，其叶子从左到右组成短语。','在刚才的 ab 树中，S 子树给出 ab，两个 A 子树分别给出 a、b。','必须看当前树；单个符号也可能是短语，不能仅因它是叶子就排除。'],
 ['直接短语','找出当前树里一步替换就得到的那一块。','对应子树只作一步产生式展开，叶子序列就是该次展开的右部。','在 ab 树中，A→a、A→b 分别给出直接短语 a、b；ab 需要多步。','回到当前树核对：某串恰好是一个产生式右部，并不自动算直接短语。'],
 ['句柄','确定按老师规则应先归约哪一块。','本课件把一个句型的最左直接短语称为句柄。','ab 树的直接短语是 a、b，所以句柄是 a。','先列直接短语，再选位置最左的；老师 F+T*F 例题的句柄是左侧 F。']
 ],
 bridge:'现在能分清规则 → 和推导 ⇒，也能沿树找短语，就进入下面的做题步骤。老师 F+T*F 的树和判法保留在原题示范后。'
},
ch3:{
 intro:'先把图当成“读一个字符，沿箭头走一步”。圆圈里的数字是状态编号；边上的标记才说明读什么，例如 a、b，原题用 0、1。读懂图之后，再学集合。',
 concepts:[
 ['正规式','用很短的写法描述哪些字符串符合要求。','按选择、连接和重复等规则组成的式子，表示一个字符串集合。','正规式 ab 只表示串 ab；a|b 表示串 a 或串 b。','先读懂题目的串应长什么样，再把式子拆成 NFA 的边。'],
 ['自动机','一边读字符串一边走图，判断字符串是否合格。','有有限个状态，按输入和转移规则运行，并用终态判断接受。','从 0 读 a 到 1；若 1 是终态，串 a 就能被接受。','正规式变成图后，用路径检查图有没有认错字符串。'],
 ['状态','记住“目前读到哪种情况”，不必保存整个已读串。','自动机中一个可能的所处位置，图上用圆圈表示，属于状态集 K。','0 可表示还没读，1 可表示刚读完 a；数字只是编号。','给圆圈编号；确定化时，一个新状态会代表一组旧状态。'],
 ['初态','规定还没读任何字符时站在哪里。','开始运行的状态，记作 S，图上用外部箭头指向它。','初态编号为 0 时，写 S=0。','画 NFA、DFA 时先标初态；子集法从 ε-closure({S}) 开始。'],
 ['终态','标记读完整串后可以判“合格”的位置。','可接受状态，所有终态组成 Z，图上用双圈表示。','只有状态 1 是终态时，Z={1}。','读完才判断是否落在终态；中途经过终态不等于整串接受。'],
 ['一条边','告诉你读到什么时可以走到哪里。','标有 a 的边 0─a→1 表示从 0 读一个 a 后转到 1。','0─a→1 会读掉 a；0─ε→1 不读取字符，ε 表示空串。','边标不能漏；ε 不是输入字符，不占输入串中的一位。'],
 ['字符串被接受','判断图走完后，这个串是否满足要求。','从初态出发，存在一条恰好读完整串并到达终态的路径，就接受。','0─a→1（终态）接受 a；只有这条边时，ab 不能读完，不接受。','必须同时核对“全部读完”和“到达终态”；NFA 有一条成功路径即可。'],
 ['a|b：选择','在两种可能中任选一种。','r|t 表示 r 描述的串或 t 描述的串。','a|b 匹配 a 或 b，不匹配 ab。','画 NFA 时从同一入口分成两条可选路线。'],
 ['ab：连接','把两段按先后顺序接起来。','rt 表示先取 r 的串，再接上 t 的串。','ab 是先 a 后 b；不能调成 ba。','画 NFA 时把前一段的出口接到后一段的入口。'],
 ['a*：重复','表示某一段可不出现，也可反复出现。','r* 表示 r 重复零次或多次后连接得到的串。','a* 可生成 ε、a、aa、aaa……；零次就是空串 ε。','既画重复路线，也保留零次通过的路线。'],
 ['正规式优先级','防止把重复范围和选择范围读错。','括号先算；无括号时，* > 连接 > |。','ab*|a 表示“a 后跟零个或多个 b”，或者单独一个 a。','先给原题 0(0|1)*1 划分子表达式，再画图。'],
 ['DFA','让每一步的去向唯一，能确定地走图。','一个状态读一个字符，只能去一个确定状态；完整 DFA 每种输入都要有去向。','若 f(0,a)=1，站在 0 读 a 就只能去 1。','每个状态、每种输入填一个去向；DFA 没有 ε 边。'],
 ['NFA','允许先把正规式画得直观，再统一处理所有可能路线。','同一状态读同一字符可有零个、一个或多个去向，也可沿 ε 边转移。','0 读 a 可到 1 或 2；0─ε→1 则不用读字符。','先照子表达式画 NFA，不必强迫每个输入只有一条边。'],
 ['M=(K,Σ,f,S,Z)','把状态图用老师的五元组写清楚。','K 是状态集，Σ 是输入字母表，f 是转移规则，S 是初态，Z 是终态集。','一条边 0─a→1 的 NFA：K={0,1}，Σ={a}，S=0，Z={1}，f(0,a)={1}。','初态写 S=0；转移用图或表列全，终态集合写 Z。'],
 ['正规式 → NFA','把式子的含义换成能逐字符走的图。','按单符号、ε、连接、选择、重复逐层构造等价的 NFA。','ab 可画成 0─a→1─b→2，初态 0、终态 2。','先拆括号和子表达式，再按老师模板连接，不先背一张大图。'],
 ['ε-closure：不读字符能走到哪','把免费走 ε 边能到的地方一次找齐。','ε-closure(I) 是从集合 I 中的状态出发，经零条或多条 ε 边可达的状态集合。','若 0─ε→1─ε→2，则 ε-closure({0})={0,1,2}。','零条边也算，所以别漏自身；一直找，直到没有新状态。'],
 ['move：真正读一个字符','把这次读入的字符对应的所有去向收起来。','move(I,a) 是从 I 中各状态沿一条 a 边可到达的状态集合。','若 0─a→1、0─a→2，则 move({0},a)={1,2}。','先 move 读一个字符，再求 ε-closure；不要把两步混成任意路径。'],
 ['NFA → DFA：子集法','用一个集合同时记录 NFA 目前所有可能位置。','把每个可达状态集合当成一个 DFA 状态；读 a 后去 ε-closure(move(I,a))。','原题 {0} 读 0 后到 {1,2,3}，把这个集合命名为 B。','每个新集合加一行继续算；含 NFA 终态的集合标为 DFA 终态。'],
 ['DFA 最小化','把对所有后续输入都表现相同的状态合并。','等价状态对任意后续串的接受／拒绝结果相同；先去不可达状态，再分组细分。','原题 B、C 读 0 都去 C、读 1 都去 D，且均非终态，可以合并。','本题状态都可达；先分终态与非终态，再按转移去向的组反复细分。'],
 ['拒绝陷阱态','给已经不可能匹配成功的输入一个确定去处。','非终态，所有输入都回到自身，之后不可能再到终态。','原题开头读 1 就进陷阱态，后面再读 0 或 1 也回不来。','考试默认画完整 DFA；原题保留陷阱态，最小 DFA 共 4 个状态。']
 ],
 bridge:'能说出圆圈、箭头、双圈的含义后，再按下面的顺序做：正规式 → NFA → ε-closure / 子集表 → DFA → 最小化。'
},
ch4:{
 intro:'LL(1) 解决的问题是：“现在面对一个非终结符和当前输入字符，到底应该选哪条产生式？”例如 A→aB|bC：当前输入 a，选 A→aB；当前输入 b，选 A→bC。先只看开头，不必先展开 B、C。',
 concepts:[
 ['LL(1)：看一个字符选规则','从开始符号往下展开，让生成的字符与输入串逐个对上。','从左到右读输入，采用最左推导，每次看一个输入符号来确定产生式。','A→aB|bC 中，看到 a 选第一条，看到 b 选第二条。','先让同一左部的候选式可区分，再用 SELECT 确认能否唯一选择。'],
 ['左递归','提醒你某条规则可能让你还没读输入就绕回自己。','A 能经过一步或多步推导得到以 A 开头的串，称为左递归。','A→Ab|d：选 A→Ab 后，最左边仍然是 A。','原题改为 A→dA′，A′→bA′|ε，再算集合。'],
 ['左公共因子','找出几条候选式开头相同、暂时分不清的部分。','同一左部的多个右部有共同前缀，叫左公共因子。','A→ab|ac 都以 a 开头，可改为 A→aX，X→b|c。','先提共同部分，把选择推迟到不同字符出现的位置。'],
 ['FIRST：能以什么开头','回答“这个符号或符号串生成的串，最前面可能是什么？”','FIRST(α) 收集 α 能推出的开头终结符；α 能推出空串时另含 ε。','A→aB|bC，则 FIRST(A)={a,b}；若再有 A→ε，则加 ε。','给 SELECT 提供开头候选；前一个符号可空时，要继续看后面。'],
 ['FOLLOW：后面可能跟什么','回答“这个非终结符后面可能紧跟什么？”','FOLLOW(A) 收集句型中 A 后可紧跟的终结符；A 可位于末尾时含 #。','S→Ab，A→a|ε：FOLLOW(A)={b}；开始符号的 FOLLOW(S)={#}。','可空候选式用它决定何时退出；FOLLOW 不含 ε。'],
 ['SELECT：何时选这条规则','回答“看到什么输入字符时应该选择这条产生式？”','SELECT(A→α) 是这条产生式对应的可选输入符号集合。','A→aB|bC：两条 SELECT 分别为 {a}、{b}。','右部可空时还要加入 FOLLOW(A)；同左部 SELECT 两两不交才可唯一选。'],
 ['ε 规则什么时候选','表示这一部分可以不生成字符，让后面的部分接上。','A→ε 可在输入属于 FOLLOW(A) 时选择，不消耗当前输入。','S→Ab，A→a|ε：看到 b 时选 A→ε，让 S 后面的 b 去匹配它。','SELECT(A→ε)=FOLLOW(A)；不要把 ε 当成输入表的一列。'],
 ['预测分析表','把 SELECT 集变成查表规则。','表 M 的行是非终结符，列是当前输入符号，格子里放产生式。','A→aB|bC 对应 M[A,a]=A→aB，M[A,b]=A→bC。','按 SELECT 填格；空格是出错，一格两条说明发生冲突。'],
 ['分析栈','记住接下来还需要展开或匹配的符号。','栈是只能在一端增删的序列；本网站右端为栈顶，初始栈写 #S。','栈顶 A 用 A→aB 展开时，先压 B 再压 a，使 a 先处理。','非终结符查表展开；终结符相同才匹配并读下一个输入；#/# 接受。']
 ],
 bridge:'先把 FIRST 理解成“开头”、FOLLOW 理解成“后面”、SELECT 理解成“选规则”。下面再按改写 → FIRST → FOLLOW → SELECT → 判断 → 填表 → 分析的正式算法写。'
},
ch5:{
 intro:'LL：从开始符号往下推导。LR：从输入串往上归约。例如 S→a，LL 写 S⇒a；LR 读入 a 后，把 a 归约成 S。这里先理解栈里的动作，再看项目集；不先讲活前缀理论。',
 concepts:[
 ['LR：从输入往上归约','把已经读到的字符逐步拼回语法成分，最后回到开始符号。','LR 从左向右读输入，按最右推导的逆过程进行移进和归约。','S→a：先读入 a，再把它归约为 S。','原题要写的是移进／归约过程；每一步由 ACTION / GOTO 表决定。'],
 ['分析栈与栈顶','暂存已识别的符号和当前分析状态。','栈只能在一端增删；本网站栈顶在右，状态栈与符号栈分别列出。','初始状态栈为 0，符号栈为 #；右边最后一项是栈顶。','表格每行同时记录状态栈、符号栈、剩余输入和动作。'],
 ['移进','把当前输入读入栈，准备识别更大的语法成分。','按 ACTION 指令读一个终结符，压入该符号及目标状态。','原题 ACTION[0,a]=s2：读 a，符号栈变 # a，状态栈变 0 2。','s 后是目标状态号；只有移进才向后读一个输入字符。'],
 ['归约','把栈顶已经识别出的产生式右部，换回左部。','按 ACTION 指定的 A→α，将栈顶 α 换成 A，再查 GOTO；不读新输入。','原题栈顶 a A b 按 A→aAb 归约为 A。','r 后是产生式编号；按表归约，不能见到任意右部就随意替换。'],
 ['拓广文法','给“整句已经识别完”设置一个单独的入口。','加一个新的开始符号 Z 和规则 Z→原开始符号。','原题开始符号为 A，新增 (0) Z→A。','先拓广并编号；Z→A· 遇到 # 写 acc。'],
 ['LR 项目中的点 ·','记录某条产生式右部已经识别到哪里。','在右部加一点形成项目；点左边已识别，点右边还未识别。','A→·XYZ：一个都没识别；A→X·YZ：已识别 X；A→XY·Z：已识别 XY；A→XYZ·：右部识别完，可考虑归约。','点在末尾才考虑归约；是否真的归约，还要按分析表判断。'],
 ['ε 产生式的项目','处理“不读取任何字符也能得到 A”的情况。','A→ε 的右部长度是 0，只有一个完成项目 A→·。','原题 (3) A→ε 对应项目 A→· 和归约动作 r3。','不画读 ε 的项目集 DFA 边；ε 归约弹 0 层，但仍要压 A 并查 GOTO。'],
 ['closure：把接下来可能用的规则补齐','遇到点后面的非终结符，准备好它的所有展开方式。','若有 B→α·Aβ，就加入所有 A→·γ；保留原项目并反复补到不变。','Z→·A，A→a 时，closure({Z→·A})={Z→·A,A→·a}。','点后是非终结符才补；新加入的项目也要继续检查。'],
 ['goto：识别一个符号后去哪','把识别进度往前推一格，再补齐接下来可能用的规则。','把集合中点后为 X 的项目移点过 X，再求 closure，得到 goto(I,X)。','I={Z→·A,A→·a}，则 goto(I,a)={A→a·}。','同一个 X 对应的移点项目一起收集；再求闭包，不要漏项。'],
 ['项目集与项目集规范族','把“目前可能处于哪些识别进度”放在一个集合里。','一个项目集是一组项目；从初始闭包反复 goto 得到的全部不同集合构成规范族。','小文法 Z→A、A→a 有 I0={Z→·A,A→·a}、I1={Z→A·}、I2={A→a·}。','项目集合相同就复用编号，不同才新增；一直算到没有新集合。'],
 ['项目集 DFA','把各项目集之间的 goto 关系画成图。','一个项目集是一个状态，goto(Ii,X)=Ij 就画 Ii─X→Ij。','刚才的小文法有 I0─A→I1、I0─a→I2。','边可以标终结符或非终结符；编号可不同，但集合和转移必须对应。'],
 ['ACTION / GOTO','告诉你下一步做什么，以及归约后去哪个状态。','ACTION 按状态和当前输入查动作；GOTO 按状态和非终结符查后继状态。','原题 ACTION[0,a]=s2；GOTO[0,A]=1；acc 表示接受。','终结符边填 s，非终结符边填 GOTO；归约后用弹栈后的栈顶状态查 GOTO。'],
 ['SLR 用 FOLLOW 限制归约','防止在不该结束 A 的输入位置上归约 A。','SLR 对完成项目 A→α·，只在 FOLLOW(A) 的输入列填对应 r。','原题 FOLLOW(A)={b,d,#}，所以 A→ε 的 r3 只填这三列，不填 a 列。','LR(0) 对普通归约填所有输入列；SLR 先求 FOLLOW，再填归约列。'],
 ['冲突判断','检查同一个格子是否要求你同时做两件事。','同一 ACTION 格出现移进与归约，或两个不同归约，就是冲突。','原题 I0 在 a 列填 s2，在 b、d、# 列填 r3，分列填写没有 SLR 冲突。','逐格查；同一项目集中有移进和归约项目，不一定产生 SLR 冲突。']
 ],
 bridge:'现在再回到原题 A→aAd|aAb|ε：点记录进度，closure 补项目，goto 连状态，最后按 FOLLOW 填 r 并查表分析 ab#。'
}
};
