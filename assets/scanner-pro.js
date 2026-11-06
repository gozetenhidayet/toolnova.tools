/* Physical page sizing and positioned, optional OCR for the document scanner. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const oldRender=TOOLS.docscanner.render;
TOOLS.docscanner.render=()=>oldRender().replace('<div id="scanner-grid"',`<div class="tn-options-card"><div class="de-grid"><label>Paper size<select id="scan-paper"><option value="a4">A4</option><option value="letter">US Letter</option><option value="image">Match image</option></select></label><label>Orientation<select id="scan-orientation"><option value="auto">Match photo</option><option value="portrait">Portrait</option><option value="landscape">Landscape</option></select></label><label>Resolution limit<select id="scan-dpi" onchange="renderScannerPages()"><option value="150">150 DPI · compact</option><option value="200" selected>200 DPI · balanced</option><option value="300">300 DPI · detailed</option></select></label><label>Margin (mm)<input id="scan-margin" type="number" min="0" max="30" value="10"></label><label>JPEG quality<select id="scan-quality"><option value="0.8">Compact</option><option value="0.9" selected>Balanced</option><option value="0.97">High</option></select></label><label>Filename<input id="scan-name" value="scanned-document" maxlength="100"></label></div><p class="de-help">Resolution is limited by your source image; small photos are not enlarged. Cropping uses the four corners you select. OCR accuracy depends on image clarity and language. Check the exported PDF before sharing.</p></div><div id="scanner-grid"`);
function layout(width,height,paper,orientation,dpi,margin){
 let size=paper==='letter'?[612,792]:paper==='image'?[width*72/dpi,height*72/dpi]:[595.28,841.89];
 if(paper!=='image'&&(orientation==='landscape'||(orientation==='auto'&&width>height)))size.reverse();
 if(paper==='image'&&orientation!=='auto'&&((orientation==='portrait'&&size[0]>size[1])||(orientation==='landscape'&&size[0]<size[1])))size.reverse();
 const m=Math.min(margin*72/25.4,Math.min(...size)/4),scale=Math.min((size[0]-2*m)/width,(size[1]-2*m)/height);
 return {size,scale,x:(size[0]-width*scale)/2,y:(size[1]-height*scale)/2,w:width*scale,h:height*scale};
}
window.ToolnovaScanGeometry={layout};
exportScannedPDF=async function(){
 const pages=(window._scannerPages||[]).map(p=>({...p,_brightness:Number($('scanner-bright').value),_contrast:Number($('scanner-contrast').value)/100}));if(!pages.length){showToast('Add at least one page.');return;}
 const btn=$('scanner-export'),out=$('scanner-out'),mode=$('scanner-mode').value,ocr=$('scanner-ocr').checked,lang=$('scanner-lang').value;
 const paper=$('scan-paper').value,orientation=$('scan-orientation').value,dpi=Number($('scan-dpi').value),margin=Number($('scan-margin').value),quality=Number($('scan-quality').value),name=tnSafeFilename($('scan-name').value,'scanned-document').replace(/\.pdf$/i,'')+'.pdf';
 if(!Number.isFinite(margin)||margin<0||margin>30){showToast('Choose a margin from 0 to 30 mm.');return;}
 window._scannerPdfBytes=null;btnLoading(btn,'Building PDF…');out.innerHTML=progressHTML('scanner-prog','Processing pages…');
 try{
 const doc=await PDFLib.PDFDocument.create(),warnings=[];let font=null,searchable=0;
 if(ocr){try{font=await tnGetUnicodeFont(doc);}catch{warnings.push('OCR font unavailable. This export contains images only.');}}
 for(let i=0;i<pages.length;i++){
 const c=scannerProcessedCanvas(pages[i],mode,dpi),blob=await new Promise((resolve,reject)=>c.toBlob(b=>b?resolve(b):reject(Error('Image encoding failed.')),'image/jpeg',quality));
 const img=await doc.embedJpg(await blob.arrayBuffer()),box=layout(c.width,c.height,paper,orientation,dpi,margin),page=doc.addPage(box.size);page.drawImage(img,{x:box.x,y:box.y,width:box.w,height:box.h});
 if(ocr&&font){try{
 if(!window.Tesseract)throw Error('OCR engine unavailable');
 const {data}=await Tesseract.recognize(c,lang,{logger:m=>{if(m.status==='recognizing text')setProgress('scanner-prog',(i+m.progress)/pages.length*90);}});
 let words=0,skipped=0;const supported=new Set(font.getCharacterSet());
 for(const word of data.words||[]){const b=word.bbox,t=(word.text||'').trim();if(!t||!b||b.x1<=b.x0||b.y1<=b.y0)continue;if([...t].some(ch=>!supported.has(ch.codePointAt(0)))){skipped++;continue;}
 const size=Math.min((b.y1-b.y0)*box.scale*.85,(b.x1-b.x0)*box.scale/font.widthOfTextAtSize(t,1));if(!Number.isFinite(size)||size<=0)continue;
 page.drawText(t,{font,size,x:box.x+b.x0*box.scale,y:box.y+box.h-b.y1*box.scale,opacity:0});words++;}
 if(words)searchable++;else warnings.push(`Page ${i+1}: no supported text detected; image retained.`);
 if(skipped)warnings.push(`Page ${i+1}: ${skipped} words could not be encoded in the OCR font.`);
 }catch{warnings.push(`Page ${i+1}: OCR failed; image retained. Retry with a clearer image or another language.`);}}
 setProgress('scanner-prog',(i+1)/pages.length*95);
 }
 const bytes=await doc.save();if(!out.isConnected)return;window._scannerPdfBytes=bytes;
 out.innerHTML=`<div class="result-box green"><strong>PDF ready · ${pages.length} page(s)</strong><p>${ocr?`${searchable} page(s) have an OCR text layer.`:'Image-only PDF; OCR was disabled.'}</p><div id="scanner-preview"></div></div>`;
 if(warnings.length){const p=document.createElement('p');p.textContent=warnings.join(' ');p.setAttribute('role','status');out.appendChild(p);}
 const download=document.createElement('button');download.className='btn';download.textContent='Download '+name;download.onclick=()=>downloadBlob(new Blob([bytes],{type:'application/pdf'}),name);out.appendChild(download);renderPdfThumbPreview(bytes,'scanner-preview');
 }catch(e){out.textContent='Could not create PDF: '+(e.message||'Unknown error');}finally{btnReset(btn);}
};
})();
