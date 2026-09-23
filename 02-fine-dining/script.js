/* MAISON EMBER — independent interactions */

'use strict';
const $ = (selector, scope=document) => scope.querySelector(selector);
const $$ = (selector, scope=document) => [...scope.querySelectorAll(selector)];
const menuButton = $('.nav-toggle');
const menu = $('#site-nav');
menuButton?.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');menu.classList.toggle('is-open',open);});
$$('#site-nav a').forEach(a=>a.addEventListener('click',()=>{menu?.classList.remove('is-open');menuButton?.setAttribute('aria-expanded','false');}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu?.classList.remove('is-open');menuButton?.setAttribute('aria-expanded','false');}});
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reducedMotion && 'IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('reveal');observer.unobserve(entry.target);}}),{threshold:.09});$$('[data-reveal]').forEach(el=>observer.observe(el));}
$$('input[type="date"]').forEach(el=>{const now=new Date();el.min=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');});
$$('.demo-form').forEach(form=>form.addEventListener('submit',event=>{event.preventDefault();const data=new FormData(form);const result=$('.form-result',form);result.textContent='Your demo request is ready, '+data.get('name')+'. '+[...data.entries()].filter(([key])=>!['name','email'].includes(key)).map(([,value])=>value).filter(Boolean).join(' · ')+'. This is a preview only; no request has been sent.';result.focus();}));
function showDialog(title,html){let dialog=$('#detail-dialog');if(!dialog){dialog=document.createElement('dialog');dialog.id='detail-dialog';dialog.className='dialog';dialog.setAttribute('aria-labelledby','dialog-title');document.body.append(dialog);dialog.addEventListener('click',e=>{if(e.target===dialog){const box=dialog.getBoundingClientRect();if(e.clientX<box.left||e.clientX>box.right||e.clientY<box.top||e.clientY>box.bottom)dialog.close();}});}dialog.innerHTML='<button class="dialog-close" aria-label="Close details">Close ×</button><h2 id="dialog-title"></h2><div class="dialog-content"></div>';$('#dialog-title',dialog).textContent=title;$('.dialog-content',dialog).innerHTML=html;$('.dialog-close',dialog).addEventListener('click',()=>dialog.close());dialog.showModal();}
$$('[data-detail]').forEach(button=>button.addEventListener('click',()=>{const content=document.getElementById(button.dataset.detail);if(content)showDialog(button.dataset.title||button.textContent.trim(),content.innerHTML);}));
$$('[data-filter-group]').forEach(group=>{const scope=document.getElementById(group.dataset.filterGroup);$$('[data-filter]',group).forEach(button=>button.addEventListener('click',()=>{$$('[data-filter]',group).forEach(b=>b.setAttribute('aria-pressed',String(b===button)));$$('[data-category]',scope).forEach(item=>item.hidden=button.dataset.filter!=='all'&&!item.dataset.category.split(' ').includes(button.dataset.filter));}));});


const menus={dinner:[['Ember-roasted beets','Whipped chèvre, blood orange, pistachio','18'],['Day-boat scallops','Sweet corn, brown butter, sea herbs','34'],['Wood-fired duck','Blackberry, smoked carrot, jus gras','42'],['Garden at dusk','Charred seasonal vegetables, farro, herb oil','28']],tasting:[['The first impression','An amuse-bouche from the garden','01'],['Land meets sea','Three seasonal courses, chosen by the chef','02'],['A sweet farewell','A final note of honey, pear and vanilla','03'],['The full experience','Six courses · optional wine pairing +65','125']],dessert:[['A pear in autumn','Poached pear, burnt vanilla, almond','14'],['Chocolate & smoke','Dark chocolate, toasted milk, sea salt','16'],['The local cheese board','Three selections, honeycomb, house crackers','22']]};
function renderMenu(course){$('#menu-items').innerHTML=menus[course].map(([title,desc,price])=>'<article class="dish"><h3>'+title+'</h3><p>'+desc+'</p><span>'+(['01','02','03'].includes(price)?price:'$'+price)+'</span></article>').join('');}
renderMenu('dinner');$$('[data-course]').forEach(button=>button.addEventListener('click',()=>{$$('[data-course]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));renderMenu(button.dataset.course);}));

document.addEventListener('click',event=>{const anchor=event.target.closest('dialog a[href^="#"]');if(anchor)anchor.closest('dialog').close();});
