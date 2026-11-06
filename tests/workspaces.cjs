const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('index.html','utf8');
const c=vm.createContext({window:{},document:{getElementById:()=>null},escapeHtml:String,fileDropzone:(id)=>`<input id="${id}">`,console});
const start=source.indexOf('const TOOLS=');const end=source.indexOf('// ── QR',start);
assert(start>=0);vm.runInContext(source.slice(start,end)+';window.tools=TOOLS;',c);
for(const file of ['assets/document-editor.js','assets/scanner-pro.js'])vm.runInContext(fs.readFileSync(file,'utf8'),c);
const slugStart=source.indexOf('const TN_TOOL_PAGE_SLUG');const slugEnd=source.indexOf('function tnUpdateCanonicalForTool',slugStart);vm.runInContext(source.slice(slugStart,slugEnd)+';window.slugs=TN_TOOL_PAGE_SLUG;',c);
let count=0;
for(const [key,tool] of Object.entries(c.window.tools)){
 const html=tool.render();assert(html.length>50,key+' render');assert.equal(typeof tool.init,'function');
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);assert.equal(new Set(ids).size,ids.length,key+' duplicate ids');
 const slug=c.window.slugs[key];if(slug)assert(fs.existsSync(slug+'.html'),key+' missing landing');
 count++;console.log('PASS workspace markup and landing:',key);
}
const bounds=c.window.ToolnovaEditorGeometry.bounds;
for(const item of [{x:-1,y:2,w:.5,h:.2},{x:1,y:1,w:3,h:2},{x:0,y:0,w:.2,h:2}]){const originalRatio=item.w/item.h;bounds(item);assert(item.x>=0&&item.y>=0&&item.x+item.w<=1.00001&&item.y+item.h<=1.00001);assert(Math.abs(item.w/item.h-originalRatio)<.00001);}
const layout=c.window.ToolnovaScanGeometry.layout;
const a4=layout(1000,2000,'a4','portrait',200,10);assert.equal(a4.size[0],595.28);assert.equal(a4.size[1],841.89);assert(Math.abs(a4.w/a4.h-.5)<1e-9);assert(a4.x>=10*72/25.4);
const letter=layout(2000,1000,'letter','auto',150,0);assert.equal(letter.size[0],792);assert.equal(letter.size[1],612);
const exact=layout(1200,1800,'image','auto',300,0);assert.equal(exact.size[0],288);assert.equal(exact.size[1],432);
let scripts=0,pages=0;
for(const filename of fs.readdirSync('.').filter(f=>f.endsWith('.html'))){pages++;const html=fs.readFileSync(filename,'utf8');for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){if(/src=|ld\+json/.test(m[1])||!m[2].trim())continue;new vm.Script(m[2],{filename});scripts++;}}
console.log(`PASS ${count} tool workspaces; annotation bounds; A4, Letter and image geometry; ${scripts} scripts in ${pages} root HTML pages`);
