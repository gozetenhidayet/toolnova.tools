const fs=require('node:fs');const vm=require('node:vm');const assert=require('node:assert/strict');
const source=fs.readFileSync('index.html','utf8');let count=0;
function fn(name){const start=source.search(new RegExp('(?:async )?function '+name+'\\('));assert(start>=0,name);const end=source.indexOf('\n}',start);return source.slice(start,end+2);}
function ctx(extra={}){const elements={};const c={console,Blob,Uint8Array,Set,Map,AbortController,setTimeout,clearTimeout,URLSearchParams,Date,Math,Number,window:{},document:{getElementById:id=>elements[id]??null},alert:m=>c.alerts.push(m),alerts:[],...extra};c.elements=elements;return vm.createContext(c);}
function run(c,n){vm.runInContext(fn(n),c);}
function ok(label,f){f();count++;console.log('PASS',label);}
(async()=>{
let c=ctx();run(c,'parsePageRange');
ok('ranges deduplicate and sort',()=>assert.deepEqual(Array.from(c.parsePageRange('1-3, 2,5',5)),[1,2,3,5]));
for(const range of ['1x','0','3-1','1-999999999','1.5','1,,2',''])ok('reject invalid range '+range,()=>assert.throws(()=>c.parsePageRange(range,5)));
// Real modal routing logic must open the requested workspace on fresh navigation.
c=ctx({location:{search:'?tool=compress',hash:''},TOOLS:{compress:{}},TN_TOOL_PAGE_SLUG:{compress:'compress-pdf'},getToolKeyFromLocation:()=> 'compress',safeHistory:()=>{},openTool:key=>c.opened=key});run(c,'syncToolFromLocation');ok('fresh direct link opens tool without redirect',()=>{c.syncToolFromLocation(true);assert.equal(c.opened,'compress');});
c=ctx();for(const id of ['oprice','dpct','disc-out','bill','tpct','split','tip-out','lamt','lrate','lterm','loan-out'])c.elements[id]={value:'',innerHTML:''};
for(const name of ['calcDiscount','calcTip','calcLoan'])run(c,name);
ok('discount rejects >100%',()=>{c.elements.oprice.value='100';c.elements.dpct.value='110';c.calcDiscount();assert.equal(c.alerts.length,1);assert.equal(c.elements['disc-out'].innerHTML,'');});
ok('discount computes 25% of 80',()=>{c.elements.oprice.value='80';c.elements.dpct.value='25';c.calcDiscount();assert.match(c.elements['disc-out'].innerHTML,/60\.00/);});
ok('tip rejects fractional people',()=>{c.elements.bill.value='100';c.elements.tpct.value='20';c.elements.split.value='1.5';c.calcTip();assert.equal(c.alerts.length,2);});
ok('tip splits total correctly',()=>{c.elements.split.value='3';c.calcTip();assert.match(c.elements['tip-out'].innerHTML,/40\.00/);});
ok('zero interest loan',()=>{c.elements.lamt.value='1200';c.elements.lrate.value='0';c.elements.lterm.value='1';c.calcLoan();assert.match(c.elements['loan-out'].innerHTML,/100\.00/);});
ok('tiny interest stays finite',()=>{c.elements.lrate.value='0.000000000001';c.calcLoan();assert(!/NaN|Infinity/.test(c.elements['loan-out'].innerHTML));});
// Audio output must carry the original binary Blob.
c=ctx({tnGetResultText:()=> 'summary'});const start=source.indexOf('function tnOutputInfo()');vm.runInContext(source.slice(start,source.indexOf('function tnSafeFilename',start)),c);
ok('audio download is MP3, not text',()=>{const blob=new Blob(['audio'],{type:'audio/mp3'});c.window.__tnCurrentToolKey='mp3convert';c.window._mp3Blob=blob;const result=c.tnOutputInfo();assert.equal(result.blob,blob);assert(result.name.endsWith('.mp3'));});
ok('WAV output keeps WAV extension',()=>{c.window.__tnCurrentToolKey='audiotrim';c.window._trimBlob=new Blob(['wav'],{type:'audio/wav'});assert(c.tnOutputInfo().name.endsWith('.wav'));});
// Network errors and stale rate data must never fall back to fabricated conversion.
c=ctx({fetch:async()=>{throw Error('offline')}});vm.runInContext('let RATES=null,RATES_UPDATED=null,RATES_IS_LIVE=false;',c);run(c,'ensureLiveRates');assert.equal(await c.ensureLiveRates(),null);count++;console.log('PASS offline rates return no conversion');
c.fetch=async()=>({ok:true,json:async()=>({result:'success',rates:{USD:1,EUR:0.9},time_last_update_utc:new Date(Date.now()-100*3600000).toUTCString()})});assert.equal(await c.ensureLiveRates(true),null);count++;console.log('PASS old rates rejected');
c.fetch=async()=>({ok:true,json:async()=>({result:'success',rates:{USD:1,EUR:0.9},time_last_update_utc:new Date().toUTCString()})});assert.equal((await c.ensureLiveRates(true)).EUR,0.9);count++;console.log('PASS dated valid rates accepted');
// Compression must not return a larger PDF.
for(const length of [15,5]){
 c=ctx({getFiles:()=>[{size:10}],btnLoading:()=>{},btnReset:()=>{},progressHTML:()=>'',fileToArrayBuffer:async()=>new Uint8Array(10).buffer,setProgress:()=>{},fmtSize:String,renderPdfThumbPreview:()=>{},escapeHtml:String,PDFLib:{PDFDocument:{load:async()=>({save:async()=>new Uint8Array(length)})}}});c.elements['compress-btn']={};c.elements['compress-out']={innerHTML:''};run(c,'doCompressPDF');await c.doCompressPDF();assert.equal(c.window._compressedPdfBytes.byteLength,Math.min(10,length));count++;console.log('PASS compression size',length);
}
// Closing or switching a modal while a dependency loads must cancel stale rendering/init.
const classes={remove(){},add(){}};let release;let oldInit=0,newInit=0;
c=ctx({TOOLS:{slow:{title:'Slow',render:()=> 'slow',init:()=>oldInit++},fast:{title:'Fast',render:()=> 'fast',init:()=>newInit++}},PDF_TOOL_KEYS:new Set(['slow']),TOOL_NOTICES:{},tnMeta:()=>({accent:'blue',soft:'white'}),tnShellMarkup:(key,t,body)=>body,tnPlainTitle:x=>x,tnUpdateCanonicalForTool:()=>{},tnSetStep:()=>{},tnStartResultObserver:()=>{},ensureLibsForTool:()=>new Promise(r=>release=r)});c.document.body={style:{}};c.elements['modal-content']={classList:classes,style:{setProperty(){}},focus(){},innerHTML:''};c.elements.overlay={classList:classes,setAttribute(){}};vm.runInContext('let tnOpenGeneration=0;',c);run(c,'openTool');const first=c.openTool('slow');await c.openTool('fast');release();await first;assert.equal(oldInit,0);assert.equal(newInit,1);assert.equal(c.elements['modal-content'].innerHTML.includes('fast'),true);count++;console.log('PASS stale tool loading cannot initialize old workspace');
// Validate all executable inline script blocks, without running browser startup code.
let scripts=0;for(const match of source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){if(/src=|ld\+json/.test(match[1])||!match[2].trim())continue;new vm.Script(match[2]);scripts++;}console.log('PASS syntax:',scripts,'inline script blocks');console.log('TOTAL',count,'behavior checks');
})().catch(e=>{console.error(e);process.exitCode=1});
