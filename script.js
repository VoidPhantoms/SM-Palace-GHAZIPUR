(function(){
'use strict';
document.documentElement.classList.add('booted');
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var root=document.documentElement;
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
var fine=window.matchMedia('(hover: hover) and (pointer: fine)');
var clamp=function(v,a,b){return Math.min(b,Math.max(a,v))};
var lerp=function(a,b,t){return a+(b-a)*t};
var TAU=Math.PI*2;
var PHONE='919415600079',EMAIL='hotelsmpalacegzp@gmail.com';
var MOOD_DATA={"lux":{"c1":"#0b0907","c2":"#1a1410","c3":"#5a4220","accent":"#d9b36c","accent2":"#a9803a"}};
var MOODS=['lux'];
var S={mood:root.getAttribute('data-mood')||'lux',y:0,vel:0,vh:window.innerHeight,mx:.5,my:.5,mv:0};
var moodListeners=[];
function onMood(fn){moodListeners.push(fn)}

/* ---------- Shared frame loop ---------- */
var loops=[],lastT=0;
function addLoop(fn){loops.push(fn)}
function frame(now){
  var dt=Math.min(.05,(now-lastT)/1000||.016);lastT=now;
  if(!document.hidden){for(var i=0;i<loops.length;i++){try{loops[i](now/1000,dt)}catch(e){}}}
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* ---------- Images: local folder first, then the hotel's own server, then artwork ---------- */
var ORIGINS=['','https://www.hotelsmpalace.in/','http://www.hotelsmpalace.in/'];
function watchImg(img){
  var box=img.closest('[data-ph]'),file=img.getAttribute('data-file'),tried=0;
  function ok(){
    if(!img.naturalWidth){fail();return}
    img.setAttribute('data-resolved',img.currentSrc||img.src);
    if(box){box.classList.add('has-img');box.classList.remove('missing')}
  }
  function fail(){
    tried++;
    if(tried<ORIGINS.length){img.src=ORIGINS[tried]+file}
    else if(box){box.classList.add('missing')}
  }
  img.addEventListener('load',ok);
  img.addEventListener('error',fail);
  if(img.complete){img.naturalWidth?ok():fail()}
}
var SLOTS={"images/banner1.jpeg":"p76049","images/banner2.jpeg":"p76043","images/banner3.jpeg":"p76057","images/about-bg.jpeg":"p76045","images/about.png":"p76029","images/room1.jpg":"p76023","images/room2.jpg":"p76024","images/room3.jpg":"p76025","images/room5.jpg":"p76027","images/gallery1.jpg":"p76051","images/gallery2.jpg":"p76053","images/gallery3.jpg":"p76041","images/gallery4.jpg":"p76047","images/gallery5.jpg":"p76055","images/gallery6.jpg":"p76062","images/gallery7.jpg":"p76026","images/gallery8.jpg":"p76045","restaurant/img/specials/bruschetta.jpg":"p76140","restaurant/img/specials/mediterranean-pizza.jpg":"p76141","restaurant/img/specials/pesto-pasta.jpg":"p76142","restaurant/img/gallery/01.jpg":"p76143","restaurant/img/gallery/02.jpg":"p76144","restaurant/img/gallery/03.jpg":"p76146","restaurant/img/gallery/04.jpg":"p76145","restaurant/img/chef.jpg":"p76147","restaurant/img/menu-qr.jpg":"p76139"};
var IMGSTORE=JSON.parse($('#imgStore').textContent);
$$('[data-ph] img').forEach(function(img){var id=SLOTS[img.getAttribute('data-file')];if(id&&IMGSTORE[id])img.src=IMGSTORE[id]});
$$('[data-ph] img').forEach(watchImg);

/* ---------- Preloader ---------- */
var pre=$('#pre'),readied=false;
function ready(){
  if(readied)return;readied=true;
  pre.classList.add('is-done');root.classList.add('ready');
  setTimeout(function(){pre.style.display='none'},900);
  setTimeout(placePills,60);
}
window.addEventListener('load',function(){setTimeout(ready,reduce.matches?0:650)});
setTimeout(ready,2600);

/* ---------- Liquid segmented controls ---------- */
var pills=[];
function makePill(seg,sel,isOn){
  var pill=$('.seg__pill',seg),last=-1;
  function place(){
    var btns=$$(sel,seg),btn=btns.filter(isOn)[0];
    if(!btn||!pill)return;
    var s=seg.getBoundingClientRect(),b=btn.getBoundingClientRect();
    if(!s.width)return;
    var idx=btns.indexOf(btn);
    pill.classList.toggle('rev',idx<last);last=idx;
    pill.style.left=(b.left-s.left-seg.clientLeft)+'px';
    pill.style.right=(s.right-b.right-seg.clientLeft)+'px';
    pill.style.top=(b.top-s.top-seg.clientTop)+'px';
    pill.style.height=b.height+'px';
  }
  pills.push(place);return place;
}
function placePills(){pills.forEach(function(p){p()})}
window.addEventListener('resize',placePills);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(placePills);

/* ---------- Theme: one permanent luxury theme (switcher removed) ---------- */
(function(){var m=document.querySelector('meta[name=theme-color]');if(m)m.setAttribute('content',MOOD_DATA[S.mood].c1)})();

/* ---------- Menu ---------- */
var nav=$('#nav'),burger=$('#burger'),menu=$('#menu');
function setMenu(open){
  menu.classList.toggle('open',open);
  burger.setAttribute('aria-expanded',open?'true':'false');
  burger.setAttribute('aria-label',open?'Close menu':'Open menu');
  menu.setAttribute('aria-hidden',open?'false':'true');
  root.classList.toggle('no-scroll',open);
}
burger.addEventListener('click',function(){setMenu(!menu.classList.contains('open'))});
$$('a',menu).forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&menu.classList.contains('open')){setMenu(false);burger.focus()}});
window.addEventListener('resize',function(){S.vh=window.innerHeight;if(window.innerWidth>=1120)setMenu(false)});

var navLinks=$$('.nav__links a[href^="#"]');
if('IntersectionObserver' in window){
  var secObs=new IntersectionObserver(function(es){
    es.forEach(function(en){
      if(en.isIntersecting){navLinks.forEach(function(a){a.classList.toggle('is-active',a.getAttribute('href')==='#'+en.target.id)})}
    });
  },{rootMargin:'-45% 0px -50% 0px'});
  ['about','building','rooms','facilities','restaurant','gallery','reserve'].forEach(function(id){var s=document.getElementById(id);if(s)secObs.observe(s)});
}

/* ---------- Pointer effects ---------- */
var glow=$('#glow'),blob=$('#blob');
var mx=0,my=0,bx=0,by=0,blobOn=false;
if(fine.matches){
  window.addEventListener('pointermove',function(e){
    if(e.pointerType!=='mouse')return;
    mx=e.clientX;my=e.clientY;
    S.mx=mx/window.innerWidth;S.my=1-my/window.innerHeight;
    glow.style.setProperty('--gx',mx+'px');glow.style.setProperty('--gy',my+'px');glow.classList.add('on');
    if(!blobOn){blobOn=true;bx=mx;by=my;blob.classList.add('on')}
  },{passive:true});
  document.addEventListener('pointerleave',function(){glow.classList.remove('on');blob.classList.remove('on');blobOn=false});
  document.addEventListener('pointerover',function(e){
    var t=e.target.closest&&e.target.closest('a,button,[data-tilt],.g,.rg,.cf__card');
    blob.classList.toggle('big',!!t);
  });
  addLoop(function(){
    if(!blobOn)return;
    var dx=mx-bx,dy=my-by;bx+=dx*.2;by+=dy*.2;
    var v=Math.min(Math.hypot(dx,dy),40);S.mv=lerp(S.mv,v/40,.2);
    var a=Math.atan2(dy,dx)*180/Math.PI;
    blob.style.transform='translate('+bx.toFixed(1)+'px,'+by.toFixed(1)+'px) rotate('+a.toFixed(0)+'deg) scale('+(1+v*.035).toFixed(2)+','+(1-v*.012).toFixed(2)+')';
  });
  $$('.glass').forEach(function(el){
    el.addEventListener('pointermove',function(e){
      var r=el.getBoundingClientRect();
      el.style.setProperty('--mx',(e.clientX-r.left)+'px');el.style.setProperty('--my',(e.clientY-r.top)+'px');
    },{passive:true});
  });
  if(!reduce.matches){
    $$('[data-tilt]').forEach(function(el){
      el.addEventListener('pointermove',function(e){
        var r=el.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;
        el.style.setProperty('--try',(px*10).toFixed(2)+'deg');el.style.setProperty('--trx',(-py*10).toFixed(2)+'deg');
      },{passive:true});
      el.addEventListener('pointerleave',function(){el.style.setProperty('--try','0deg');el.style.setProperty('--trx','0deg')});
    });
    $$('[data-magnet]').forEach(function(el){
      el.addEventListener('pointermove',function(e){
        var r=el.getBoundingClientRect();
        el.style.transform='translate('+((e.clientX-(r.left+r.width/2))*.16).toFixed(1)+'px,'+((e.clientY-(r.top+r.height/2))*.26).toFixed(1)+'px)';
      },{passive:true});
      el.addEventListener('pointerleave',function(){el.style.transform=''});
    });
  }
}

/* tap / click ripples (liquid background + buttons) */
var liquid=null;
document.addEventListener('pointerdown',function(e){
  if(liquid)liquid.ripple(e.clientX,e.clientY);
  var b=e.target.closest&&e.target.closest('.btn');
  if(b&&!reduce.matches){
    var r=b.getBoundingClientRect();
    b.style.setProperty('--rx',(e.clientX-r.left)+'px');b.style.setProperty('--ry',(e.clientY-r.top)+'px');
    var s=document.createElement('span');s.className='rip';b.appendChild(s);
    setTimeout(function(){s.remove()},750);
  }
},{passive:true});

/* ---------- Reveal on scroll (titles split into words) ---------- */
$$('.rv-title').forEach(function(el){
  var words=el.textContent.trim().split(/\s+/);
  el.setAttribute('aria-label',el.textContent.trim());
  el.innerHTML=words.map(function(w,i){return '<span class="w" aria-hidden="true" style="--i:'+i+'">'+w+'</span>'}).join(' ');
});
$$('.g,.rg,.tile').forEach(function(el,i){el.classList.add('rv');el.style.transitionDelay=((i%4)*70)+'ms'});
var revEls=$$('.rv,.rv-title');
if('IntersectionObserver' in window&&!reduce.matches){
  var rio=new IntersectionObserver(function(es){
    es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');rio.unobserve(en.target)}});
  },{threshold:.15,rootMargin:'0px 0px -6% 0px'});
  revEls.forEach(function(el){rio.observe(el)});
}else{revEls.forEach(function(el){el.classList.add('in')})}

/* words that light up as you scroll past */
var hl=$('#hlText'),hlWords=[];
if(hl){
  var txt=hl.textContent.trim();
  hl.setAttribute('aria-label',txt);
  hl.innerHTML=txt.split(/\s+/).map(function(w){return '<span class="w" aria-hidden="true">'+w+'</span>'}).join(' ');
  hlWords=$$('.w',hl);
  if(reduce.matches)hlWords.forEach(function(w){w.classList.add('on')});
}
var hlLast=-1;

/* ---------- Scroll-driven bits (one loop) ---------- */
var progress=$('#progress'),stage=$('#stage'),toTop=$('#toTop'),toTopRing=$('#toTopRing'),seal=$('#sealRot'),parImg=$('#parImg');
var lastY=window.pageYOffset,mq=$('#mqTrack'),mqX=0,mqW=0,mqDir=1;
if(mq){
  var setHtml=mq.innerHTML;mq.innerHTML=setHtml+setHtml;
  var measure=function(){mqW=mq.scrollWidth/2};
  measure();window.addEventListener('resize',measure);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(measure);
}
addLoop(function(t,dt){
  var y=window.pageYOffset,vh=S.vh;
  var dy=y-lastY;lastY=y;
  S.vel=lerp(S.vel,dy/Math.max(dt,.008),.12);S.y=y;
  var max=root.scrollHeight-vh,p=max>0?clamp(y/max,0,1):0;
  progress.style.transform='scaleX('+p.toFixed(4)+')';
  nav.classList.toggle('is-scrolled',y>20);
  toTop.classList.toggle('show',y>vh*.8);
  toTopRing.style.strokeDashoffset=(141.4*(1-p)).toFixed(1);
  if(!reduce.matches&&y<vh*1.3)stage.style.setProperty('--py',(y*-0.07).toFixed(1)+'px');
  if(seal)seal.setAttribute('transform','rotate('+((reduce.matches?0:t*12)+y*.12).toFixed(1)+' 60 60)');
  if(parImg&&!reduce.matches){
    var r=parImg.parentNode.getBoundingClientRect();
    if(r.bottom>0&&r.top<vh){var off=(r.top+r.height/2-vh/2)/vh;parImg.style.transform='translateY('+(off*-34).toFixed(1)+'px) scale(1.14)'}
  }
  if(mq&&mqW&&!reduce.matches){
    if(S.vel>20)mqDir=1;else if(S.vel<-20)mqDir=-1;
    mqX-=mqDir*(46+Math.min(Math.abs(S.vel),2400)*.22)*dt;
    if(mqX<=-mqW)mqX+=mqW;if(mqX>0)mqX-=mqW;
    mq.style.transform='translate3d('+mqX.toFixed(1)+'px,0,0)';
  }
  if(hl&&hlWords.length&&!reduce.matches){
    var hr=hl.getBoundingClientRect();
    var hp=clamp((vh*.88-hr.top)/(vh*.46+hr.height*.4),0,1);
    var n=Math.round(hp*hlWords.length);
    if(n!==hlLast){hlWords.forEach(function(w,i){w.classList.toggle('on',i<n)});hlLast=n}
  }
});
toTop.addEventListener('click',function(){window.scrollTo({top:0,behavior:reduce.matches?'auto':'smooth'})});
$('#year').textContent=new Date().getFullYear();

var toastEl=$('#toast'),toastT=0;
function toast(msg){
  toastEl.textContent=msg;toastEl.classList.add('show');
  clearTimeout(toastT);toastT=setTimeout(function(){toastEl.classList.remove('show')},3200);
}

/* ===================== Liquid WebGL background ===================== */
liquid=(function(){
  var cv=$('#liquid');if(!cv)return null;
  var gl=null;
  try{gl=cv.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'})||cv.getContext('experimental-webgl')}catch(e){}
  if(!gl)return null;
  var vs='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  var fs=[
  '#ifdef GL_FRAGMENT_PRECISION_HIGH','precision highp float;','#else','precision mediump float;','#endif',
  'uniform vec2 uRes;uniform float uTime;uniform vec3 uC1;uniform vec3 uC2;uniform vec3 uC3;uniform vec3 uA2;',
  'uniform vec4 uRip[8];uniform vec2 uMouse;uniform float uMV;uniform float uScroll;',
  'float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}',
  'float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);',
  'float a=h21(i),b=h21(i+vec2(1.,0.)),c=h21(i+vec2(0.,1.)),d=h21(i+vec2(1.,1.));',
  'return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}',
  'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}',
  'void main(){',
  'vec2 uv=gl_FragCoord.xy/uRes;float asp=uRes.x/uRes.y;',
  'vec2 p=(uv-.5)*vec2(asp,1.)*1.6;vec2 d=vec2(0.);',
  'for(int i=0;i<8;i++){vec4 r=uRip[i];if(r.w>0.){vec2 q=(uv-r.xy)*vec2(asp,1.);float dist=length(q);',
  'float ring=sin(dist*34.-r.z*8.)*exp(-dist*3.5)*exp(-r.z*1.3);d+=normalize(q+vec2(1e-4))*ring*.05;}}',
  'vec2 mq=(uv-uMouse)*vec2(asp,1.);d+=mq*exp(-dot(mq,mq)*30.)*uMV*.35;',
  'p+=d+vec2(0.,uScroll*.00028);',
  'float t=uTime*.045;',
  'vec2 q=vec2(fbm(p+vec2(0.,t)),fbm(p+vec2(5.2,1.3)-t));',
  'vec2 r=vec2(fbm(p+3.*q+vec2(1.7,9.2)+t*1.2),fbm(p+3.*q+vec2(8.3,2.8)-t));',
  'float f=fbm(p+3.*r);',
  'vec3 col=mix(uC1,uC2,smoothstep(.1,.9,f));',
  'col=mix(col,uC3,clamp(length(r)-.36,0.,1.)*.9);',
  'float fx=fbm(p+3.*r+vec2(.02,0.));float fy=fbm(p+3.*r+vec2(0.,.02));',
  'vec3 n=normalize(vec3((f-fx)*18.,(f-fy)*18.,1.));',
  'float spec=pow(max(dot(n,normalize(vec3(-.35,.55,.75))),0.),28.);',
  'col+=uA2*spec*.32;',
  'float v=dot(uv-.5,uv-.5);col*=1.-v*.6;',
  'vec3 lin=col*col;float lm=dot(lin,vec3(.2126,.7152,.0722));if(lm>.12)col*=sqrt(.12/lm);',
  'col+=(h21(gl_FragCoord.xy+uTime)-.5)/255.;',
  'gl_FragColor=vec4(col,1.);}'
  ].join('\n');
  function sh(type,src){var s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return gl.getShaderParameter(s,gl.COMPILE_STATUS)?s:null}
  var v=sh(gl.VERTEX_SHADER,vs),f=sh(gl.FRAGMENT_SHADER,fs);
  if(!v||!f)return null;
  var pr=gl.createProgram();gl.attachShader(pr,v);gl.attachShader(pr,f);gl.linkProgram(pr);
  if(!gl.getProgramParameter(pr,gl.LINK_STATUS))return null;
  gl.useProgram(pr);
  var buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  var loc=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  var U={};['uRes','uTime','uC1','uC2','uC3','uA2','uRip','uMouse','uMV','uScroll'].forEach(function(n){U[n]=gl.getUniformLocation(pr,n)});

  function rgb(h){var n=parseInt(h.slice(1),16);return [(n>>16&255)/255,(n>>8&255)/255,(n&255)/255]}
  function palette(m){var d=MOOD_DATA[m];return {c1:rgb(d.c1),c2:rgb(d.c2),c3:rgb(d.c3),a2:rgb(d.accent2)}}
  var cur=palette(S.mood),tg=cur;
  cur={c1:tg.c1.slice(),c2:tg.c2.slice(),c3:tg.c3.slice(),a2:tg.a2.slice()};
  var dirty=90;
  onMood(function(m){tg=palette(m);dirty=150;if(reduce.matches){cur={c1:tg.c1.slice(),c2:tg.c2.slice(),c3:tg.c3.slice(),a2:tg.a2.slice()};dirty=4}});

  var frameN=0,rips=[],ri=0,scale=.4,w=0,h=0,slow=0,lost=false,time=0;
  for(var i=0;i<8;i++)rips.push({x:0,y:0,t0:-99});
  var ripData=new Float32Array(32);
  function resize(){
    w=Math.max(2,Math.round(window.innerWidth*scale));h=Math.max(2,Math.round(window.innerHeight*scale));
    cv.width=w;cv.height=h;gl.viewport(0,0,w,h);
  }
  resize();window.addEventListener('resize',function(){resize();dirty=3});
  cv.addEventListener('webglcontextlost',function(e){e.preventDefault();lost=true;cv.classList.remove('on')});

  function draw(t,dt){
    if(lost)return;
    var k=1-Math.exp(-dt*2.2);
    ['c1','c2','c3','a2'].forEach(function(n){for(var i=0;i<3;i++)cur[n][i]=lerp(cur[n][i],tg[n][i],k)});
    for(var i=0;i<8;i++){
      var r=rips[i],age=t-r.t0;
      ripData[i*4]=r.x;ripData[i*4+1]=r.y;ripData[i*4+2]=age;ripData[i*4+3]=age<3.4?1:0;
    }
    gl.uniform2f(U.uRes,w,h);gl.uniform1f(U.uTime,t);
    gl.uniform3fv(U.uC1,cur.c1);gl.uniform3fv(U.uC2,cur.c2);gl.uniform3fv(U.uC3,cur.c3);gl.uniform3fv(U.uA2,cur.a2);
    gl.uniform4fv(U.uRip,ripData);gl.uniform2f(U.uMouse,S.mx,S.my);gl.uniform1f(U.uMV,S.mv);gl.uniform1f(U.uScroll,S.y);
    gl.drawArrays(gl.TRIANGLES,0,3);
  }
  var shown=false;
  addLoop(function(t,dt){
    if(reduce.matches){time=0;if(dirty<=0)return;dirty--}else{time=t}
    if((frameN++)&1)return; /* draw every 2nd frame (about 30fps): much lighter on the GPU */
    var t0=performance.now();
    draw(time,dt);
    if(!shown){shown=true;cv.classList.add('on')}
    /* adapt resolution if the device struggles */
    var ms=performance.now()-t0;
    if(dt>.034||ms>12)slow++;else slow=Math.max(0,slow-1);
    if(slow>40&&scale>.28){scale=Math.max(.28,scale-.1);slow=0;resize()}
  });
  return {
    ripple:function(x,y){
      if(reduce.matches)return;
      var r=rips[ri%8];ri++;r.x=x/window.innerWidth;r.y=1-y/window.innerHeight;r.t0=time;
    }
  };
})();

/* ===================== Floating dust ===================== */
(function(){
  var cv=$('#dust');if(!cv||reduce.matches)return;
  var ctx=cv.getContext('2d'),w=0,h=0,dpr=1,ps=[],col='#d9b36c',n=0;
  function size(){
    dpr=Math.min(window.devicePixelRatio||1,2);w=window.innerWidth;h=window.innerHeight;
    cv.width=w*dpr;cv.height=h*dpr;cv.style.width=w+'px';cv.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);
    var count=Math.round(Math.min(36,w*h/40000));ps=[];
    for(var i=0;i<count;i++)ps.push({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.6+.5,vy:-(Math.random()*.25+.05),vx:(Math.random()-.5)*.12,a:Math.random()*.45+.2,t:Math.random()*6.28});
  }
  size();window.addEventListener('resize',size);
  var px=-999,py=-999;
  window.addEventListener('pointermove',function(e){px=e.clientX;py=e.clientY},{passive:true});
  addLoop(function(){
    if(n++%30===0){var c=getComputedStyle(root).getPropertyValue('--accent').trim();if(c)col=c}
    ctx.clearRect(0,0,w,h);ctx.fillStyle=col;
    for(var i=0;i<ps.length;i++){
      var p=ps[i];p.t+=.012;p.x+=p.vx+Math.sin(p.t)*.12;p.y+=p.vy;
      var dx=p.x-px,dy=p.y-py,d=dx*dx+dy*dy;
      if(d<12000){p.x+=dx*.0016;p.y+=dy*.0016}
      if(p.y<-8){p.y=h+8;p.x=Math.random()*w}
      if(p.x<-8)p.x=w+8;if(p.x>w+8)p.x=-8;
      ctx.globalAlpha=p.a*(.65+.35*Math.sin(p.t*2));
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fill();
    }
    ctx.globalAlpha=1;
  });
})();

/* ===================== 3D hotel building (WebGL) ===================== */
(function(){
  var cv=$('#bld'),view=$('#tourView'),section=$('#building');
  if(!cv||!section)return;
  var gl=null;
  try{gl=cv.getContext('webgl',{antialias:true,alpha:true,premultipliedAlpha:false})||cv.getContext('experimental-webgl')}catch(e){}
  if(!gl){root.classList.add('no-gl');return}

  /* ---------- tiny vector helpers ---------- */
  function sub(a,b){return [a[0]-b[0],a[1]-b[1],a[2]-b[2]]}
  function add(a,b){return [a[0]+b[0],a[1]+b[1],a[2]+b[2]]}
  function mulv(a,s){return [a[0]*s,a[1]*s,a[2]*s]}
  function dot(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]}
  function cross(a,b){return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]}
  function norm(a){var l=Math.hypot(a[0],a[1],a[2])||1;return [a[0]/l,a[1]/l,a[2]/l]}

  /* ---------- mesh builder ---------- */
  var V=[];
  function vert(p,n,c,e){V.push(p[0],p[1],p[2],n[0],n[1],n[2],c[0],c[1],c[2],e)}
  function tri(a,b,c,na,nb,nc,col,e){vert(a,na,col,e);vert(b,nb,col,e);vert(c,nc,col,e)}
  function quad(a,b,c,d,out,col,e){
    var n=norm(cross(sub(b,a),sub(c,a)));if(dot(n,out)<0)n=mulv(n,-1);
    tri(a,b,c,n,n,n,col,e);tri(a,c,d,n,n,n,col,e);
  }
  function box(cx,cy,cz,sx,sy,sz,col,skip){
    skip=skip||{};
    var x0=cx-sx/2,x1=cx+sx/2,y0=cy-sy/2,y1=cy+sy/2,z0=cz-sz/2,z1=cz+sz/2;
    if(!skip.px)quad([x1,y0,z0],[x1,y1,z0],[x1,y1,z1],[x1,y0,z1],[1,0,0],col,0);
    if(!skip.nx)quad([x0,y0,z0],[x0,y1,z0],[x0,y1,z1],[x0,y0,z1],[-1,0,0],col,0);
    if(!skip.py)quad([x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z1],[0,1,0],col,0);
    if(!skip.ny)quad([x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1],[0,-1,0],col,0);
    if(!skip.pz)quad([x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1],[0,0,1],col,0);
    if(!skip.nz)quad([x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0],[0,0,-1],col,0);
  }
  function cyl(cx,cy,cz,r0,r1,h,seg,col,e){
    for(var i=0;i<seg;i++){
      var a0=i/seg*TAU,a1=(i+1)/seg*TAU,c0=Math.cos(a0),s0=Math.sin(a0),c1=Math.cos(a1),s1=Math.sin(a1);
      var b0=[cx+c0*r0,cy,cz+s0*r0],b1=[cx+c1*r0,cy,cz+s1*r0],t0=[cx+c0*r1,cy+h,cz+s0*r1],t1=[cx+c1*r1,cy+h,cz+s1*r1];
      var n0=[c0,0,s0],n1=[c1,0,s1];
      tri(b0,b1,t1,n0,n1,n1,col,e||0);tri(b0,t1,t0,n0,n1,n0,col,e||0);
      if(r1>0)tri([cx,cy+h,cz],t0,t1,[0,1,0],[0,1,0],[0,1,0],col,e||0);
    }
  }
  function dome(cx,cy,cz,r,rings,seg,col,sy,e){
    sy=sy||1;
    for(var i=0;i<rings;i++){
      var p0=i/rings*Math.PI/2,p1=(i+1)/rings*Math.PI/2;
      for(var j=0;j<seg;j++){
        var a0=j/seg*TAU,a1=(j+1)/seg*TAU;
        function P(p,a){return [cx+r*Math.cos(p)*Math.cos(a),cy+r*Math.sin(p)*sy,cz+r*Math.cos(p)*Math.sin(a)]}
        function N(p,a){return norm([Math.cos(p)*Math.cos(a),Math.sin(p)/sy,Math.cos(p)*Math.sin(a)])}
        var A=P(p0,a0),B=P(p0,a1),C=P(p1,a1),D=P(p1,a0);
        tri(A,B,C,N(p0,a0),N(p0,a1),N(p1,a1),col,e||0);tri(A,C,D,N(p0,a0),N(p1,a1),N(p1,a0),col,e||0);
      }
    }
  }
  function disc(cx,cy,cz,r,seg,col,e){
    for(var i=0;i<seg;i++){
      var a0=i/seg*TAU,a1=(i+1)/seg*TAU,up=[0,1,0];
      tri([cx,cy,cz],[cx+Math.cos(a0)*r,cy,cz+Math.sin(a0)*r],[cx+Math.cos(a1)*r,cy,cz+Math.sin(a1)*r],up,up,up,col,e);
    }
  }
  /* arched window polygon on a vertical wall; n is the wall's outward normal (+/-x or +/-z) */
  function archPoly(c,u,w,h,off,n){
    var pts=[],rr=w/2,hr=Math.max(0,h-rr),k;
    function P(x,y){return [c[0]+u[0]*x+n[0]*off,c[1]+y+n[1]*off,c[2]+u[2]*x+n[2]*off]}
    pts.push(P(-rr,0));pts.push(P(rr,0));pts.push(P(rr,hr));
    for(k=1;k<6;k++){var a=k/6*Math.PI;pts.push(P(rr*Math.cos(a),hr+rr*Math.sin(a)))}
    pts.push(P(-rr,hr));
    return pts;
  }
  function fan(pts,n,col,e){
    var c=[0,0,0],i;for(i=0;i<pts.length;i++)c=add(c,pts[i]);c=mulv(c,1/pts.length);
    for(i=0;i<pts.length;i++)tri(c,pts[i],pts[(i+1)%pts.length],n,n,n,col,e);
  }
  var seed=7;function rnd(){seed=(seed*16807)%2147483647;return seed/2147483647}
  function windowAt(c,n,w,h){
    var u=Math.abs(n[2])>.5?[1,0,0]:[0,0,1];
    fan(archPoly(c,u,w*1.28,h*1.1,.006,n),n,[.36,.24,.13],0);
    var lit=rnd(),e=lit<.14?.1:.55+.45*rnd();
    fan(archPoly([c[0],c[1]+h*.05,c[2]],u,w,h,.014,n),n,[1,.82,.5],e);
  }

  /* ---------- the model: a stepped, stupa-inspired hotel ---------- */
  var WALL=[.93,.85,.72],WALLD=[.8,.7,.56],GOLD=[.88,.7,.33],WHITE=[.97,.95,.9],STONE=[.6,.56,.52],GRASS=[.1,.3,.2],PATH=[.74,.68,.58],WOOD=[.36,.23,.13];
  function tier(W,D,y0,H,rows,nF,nS,skipFront){
    var cy=y0+H/2;
    box(0,cy,0,W,H,D,WALL);
    box(0,y0+H+.05,0,W+.34,.14,D+.34,GOLD);                 /* cornice */
    box(0,y0+H+.2,D/2+.1,W+.2,.2,.1,WALLD);box(0,y0+H+.2,-D/2-.1,W+.2,.2,.1,WALLD);
    box(W/2+.1,y0+H+.2,0,.1,.2,D+.2,WALLD);box(-W/2-.1,y0+H+.2,0,.1,.2,D+.2,WALLD);   /* parapet */
    var rh=H/rows,ww=Math.min(.58,W/nF*.46),wh=rh*.58,i,j;
    for(j=0;j<rows;j++){
      var wy=y0+j*rh+rh*.2;
      for(i=0;i<nF;i++){
        var x=-W/2+(i+.5)*W/nF;
        if(!(skipFront&&j===0&&Math.abs(x)<1.8))windowAt([x,wy,D/2],[0,0,1],ww,wh);
        windowAt([x,wy,-D/2],[0,0,-1],ww,wh);
      }
      var sw=Math.min(.5,D/nS*.44);
      for(i=0;i<nS;i++){
        var z=-D/2+(i+.5)*D/nS;
        windowAt([W/2,wy,z],[1,0,0],sw,wh);windowAt([-W/2,wy,z],[-1,0,0],sw,wh);
      }
    }
  }
  function chhatri(cx,cy,cz,r){
    var k,dx,dz;
    box(cx,cy+.04,cz,r*2.3,.08,r*2.3,WALLD);
    for(k=0;k<4;k++){dx=(k%2?1:-1)*r*.85;dz=(k<2?1:-1)*r*.85;cyl(cx+dx,cy+.08,cz+dz,r*.12,r*.12,r*1.5,6,WHITE)}
    box(cx,cy+r*1.58,cz,r*2.1,.07,r*2.1,GOLD);
    dome(cx,cy+r*1.62,cz,r*1.05,5,12,WHITE,1.1);
    cyl(cx,cy+r*1.62+r*1.15,cz,.03,0,.28,5,GOLD);
  }
  function build(){
    V.length=0;seed=7;
    /* ground (alpha handled in the shader) */
    disc(0,-.03,0,17,40,GRASS,-1);
    disc(0,0,0,11.5,48,STONE,-1);
    disc(0,.006,0,8.2,40,[.66,.61,.55],-1);
    /* soft shadow */
    disc(0,.025,0,10,36,[0,0,0],-2);
    /* path to the entrance */
    quad([-1.1,.02,5.2],[1.1,.02,5.2],[1.1,.02,11],[-1.1,.02,11],[0,1,0],PATH,-1);
    /* podium + steps */
    box(0,.3,0,11.2,.6,8.2,STONE);
    box(0,.12,4.9,4.8,.24,.8,STONE);box(0,.24,4.55,4.4,.12,.55,STONE);
    /* tiers: each one steps in, like a stupa */
    tier(9.2,6.4,.6,3.4,2,6,4,true);
    tier(7.2,4.8,4.0,2.9,2,5,3,false);
    tier(5.2,3.4,6.9,2.4,2,4,3,false);
    tier(3.4,2.4,9.3,1.7,1,3,2,false);
    /* portico */
    box(0,1.8,4.0,3.6,2.4,1.6,WALL);
    box(0,3.09,4.05,4.0,.18,1.9,GOLD);
    var cxs=[-1.65,-.55,.55,1.65],k;
    for(k=0;k<4;k++)cyl(cxs[k],.6,4.95,.14,.14,2.4,8,WHITE);
    fan(archPoly([0,.62,4.82],[1,0,0],1.5,2,.0,[0,0,1]),[0,0,1],[.36,.24,.13],0);
    fan(archPoly([0,.62,4.83],[1,0,0],1.25,1.8,.0,[0,0,1]),[0,0,1],[1,.85,.55],.9);
    quad([-1.6,3.25,4.1],[1.6,3.25,4.1],[1.6,3.5,4.1],[-1.6,3.5,4.1],[0,0,1],[1,.8,.4],1);   /* lit sign band */
    /* corner chhatris */
    chhatri(4.1,4.0+.1,2.75,.42);chhatri(-4.1,4.1,2.75,.42);chhatri(4.1,4.1,-2.75,.42);chhatri(-4.1,4.1,-2.75,.42);
    chhatri(3.1,6.9+.1,2.0,.28);chhatri(-3.1,7.0,2.0,.28);chhatri(3.1,7.0,-2.0,.28);chhatri(-3.1,7.0,-2.0,.28);
    /* stupa crown */
    cyl(0,11.0,0,1.25,1.25,.45,20,WALLD);
    dome(0,11.45,0,1.2,10,28,WHITE,1);
    box(0,12.9,0,.62,.5,.62,GOLD);
    var d;for(d=0;d<5;d++)cyl(0,13.18+d*.3,0,.55-d*.07,.55-d*.07,.08,14,GOLD);
    cyl(0,13.15,0,.05,.04,2.1,6,GOLD);
    dome(0,15.2,0,.16,4,10,[1,.88,.55],1,.9);
    /* lamp posts */
    for(k=0;k<8;k++){
      var a=k/8*TAU+.2,lx=Math.cos(a)*9.2,lz=Math.sin(a)*9.2;
      if(Math.abs(lx)<2.4&&lz>0)continue;
      cyl(lx,0,lz,.06,.05,1.7,6,[.2,.2,.22]);dome(lx,1.7,lz,.2,4,10,[1,.85,.55],1,1);
    }
    /* trees */
    for(k=0;k<12;k++){
      var ta=k/12*TAU+.5,tx=Math.cos(ta)*11.6,tz=Math.sin(ta)*11.6;
      if(Math.abs(tx)<3&&tz>0)continue;
      cyl(tx,0,tz,.14,.1,1.1,6,WOOD);
      dome(tx,.9,tz,1.1,5,12,[.1,.38,.24],1.15);dome(tx,1.9,tz,.7,4,10,[.13,.44,.28],1.1);
    }
    return new Float32Array(V);
  }
  var data=build(),vcount=data.length/10;

  /* ---------- shaders ---------- */
  var vsrc='attribute vec3 aP;attribute vec3 aN;attribute vec3 aC;attribute float aE;uniform mat4 uVP;varying vec3 vN;varying vec3 vC;varying vec3 vP;varying float vE;void main(){vN=aN;vC=aC;vP=aP;vE=aE;gl_Position=uVP*vec4(aP,1.);}';
  var fsrc=[
  '#ifdef GL_FRAGMENT_PRECISION_HIGH','precision highp float;','#else','precision mediump float;','#endif',
  'varying vec3 vN;varying vec3 vC;varying vec3 vP;varying float vE;',
  'uniform vec3 uSunDir;uniform vec3 uSunCol;uniform vec3 uSky;uniform vec3 uGround;uniform float uEmi;',
  'void main(){',
  'float dd=length(vP.xz);',
  'if(vE<-1.5){float a=smoothstep(10.,2.,dd)*.45;gl_FragColor=vec4(0.,0.,0.,a);return;}',
  'vec3 n=normalize(vN);float sun=max(dot(n,uSunDir),0.);',
  'vec3 amb=mix(uGround,uSky,n.y*.5+.5);',
  'vec3 lit=vC*(amb+uSunCol*sun);',
  'if(vE<-.5){float a=1.-smoothstep(15.,31.,dd);gl_FragColor=vec4(lit,a);return;}',
  'lit*=mix(.74,1.,smoothstep(0.,2.4,vP.y));',
  'if(vE>0.){vec3 glass=vC*amb*.55;vec3 glow=vC*(.5+uEmi*1.5);lit=mix(glass,glow,clamp(uEmi*vE,0.,1.));}',
  'gl_FragColor=vec4(min(lit,vec3(1.4)),1.);}'
  ].join('\n');
  function sh(type,src){var s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return gl.getShaderParameter(s,gl.COMPILE_STATUS)?s:null}
  var vs=sh(gl.VERTEX_SHADER,vsrc),fs=sh(gl.FRAGMENT_SHADER,fsrc);
  if(!vs||!fs){root.classList.add('no-gl');return}
  var pr=gl.createProgram();gl.attachShader(pr,vs);gl.attachShader(pr,fs);gl.linkProgram(pr);
  if(!gl.getProgramParameter(pr,gl.LINK_STATUS)){root.classList.add('no-gl');return}
  gl.useProgram(pr);
  var buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
  [['aP',3,0],['aN',3,3],['aC',3,6],['aE',1,9]].forEach(function(a){
    var l=gl.getAttribLocation(pr,a[0]);gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,a[1],gl.FLOAT,false,40,a[2]*4);
  });
  var U={};['uVP','uSunDir','uSunCol','uSky','uGround','uEmi'].forEach(function(n){U[n]=gl.getUniformLocation(pr,n)});
  gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);
  gl.blendFuncSeparate(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA,gl.ONE,gl.ONE_MINUS_SRC_ALPHA);

  /* ---------- matrices ---------- */
  function persp(f,a,n,fa){var t=1/Math.tan(f/2);return [t/a,0,0,0,0,t,0,0,0,0,(fa+n)/(n-fa),-1,0,0,2*fa*n/(n-fa),0]}
  function lookAt(e,c){
    var z=norm(sub(e,c)),x=norm(cross([0,1,0],z)),y=cross(z,x);
    return [x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,e),-dot(y,e),-dot(z,e),1];
  }
  function mul(a,b){var o=new Array(16),c,r,k,s;for(c=0;c<4;c++)for(r=0;r<4;r++){s=0;for(k=0;k<4;k++)s+=a[k*4+r]*b[c*4+k];o[c*4+r]=s}return o}

  /* ---------- lighting per mood ---------- */
  var LIGHT={
    lux:{sd:norm([-.5,.6,.5]),sc:[.95,.76,.46],sky:[.17,.2,.3],gr:[.07,.06,.08],em:1.1}
  };
  var L=JSON.parse(JSON.stringify(LIGHT[S.mood])),Lt=LIGHT[S.mood];
  onMood(function(m){Lt=LIGHT[m]});
  function mix3(a,b,k){for(var i=0;i<3;i++)a[i]=lerp(a[i],b[i],k)}

  /* ---------- camera + interaction ---------- */
  var BASE_YAW=-.55,TARGET=[0,7.3,0];
  var userYaw=0,userPitch=0,velYaw=0,autoYaw=0,scrollYaw=0,dFactor=1,dragging=false,auto=true,lastX=0,lastY=0,focus=null;
  var visible=false,prog=0,W=0,H=0,cssW=0,cssH=0;
  var spinBtn=$('#bldSpin'),resetBtn=$('#bldReset');
  cv.addEventListener('pointerdown',function(e){
    dragging=true;focus=null;lastX=e.clientX;lastY=e.clientY;velYaw=0;cv.classList.add('drag');
    try{cv.setPointerCapture(e.pointerId)}catch(x){}
  });
  cv.addEventListener('pointermove',function(e){
    if(!dragging)return;
    var dx=e.clientX-lastX,dy=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;
    userYaw+=dx*.009;velYaw=dx*.009;
    if(e.pointerType!=='touch')userPitch=clamp(userPitch+dy*.004,-.2,.6);
  });
  function endDrag(){dragging=false;cv.classList.remove('drag')}
  cv.addEventListener('pointerup',endDrag);cv.addEventListener('pointercancel',endDrag);
  spinBtn.addEventListener('click',function(){
    auto=!auto;spinBtn.setAttribute('aria-pressed',auto?'true':'false');spinBtn.textContent=auto?'Pause rotation':'Resume rotation';
  });
  resetBtn.addEventListener('click',function(){
    focus={t0:performance.now(),dur:900,from:[userYaw,userPitch,dFactor],to:[0,0,1]};auto=true;
    spinBtn.setAttribute('aria-pressed','true');spinBtn.textContent='Pause rotation';
  });
  var HOT=[
    {p:[0,1.9,5.2],d:[0,0,1],yaw:0,pitch:.12,df:.7},
    {p:[-3.7,5.3,2.4],d:[-.55,0,.8],yaw:-.6,pitch:.2,df:.72},
    {p:[0,13.6,0],d:null,yaw:null,pitch:.3,df:.55},
    {p:[-7.4,.7,5.2],d:[-.6,0,.8],yaw:-.64,pitch:.28,df:.85}
  ];
  var hotEls=$$('.hot',view);
  hotEls.forEach(function(el,i){
    el.addEventListener('click',function(){
      var h=HOT[i],cur=BASE_YAW+scrollYaw+autoYaw;
      var ty=h.yaw===null?userYaw:(h.yaw-BASE_YAW-scrollYaw-autoYaw);
      /* take the shortest way round */
      ty=userYaw+((ty-userYaw+Math.PI)%TAU+TAU)%TAU-Math.PI;
      focus={t0:performance.now(),dur:1000,from:[userYaw,userPitch,dFactor],to:[ty,h.pitch,h.df]};
      auto=false;spinBtn.setAttribute('aria-pressed','false');spinBtn.textContent='Resume rotation';
    });
  });

  var steps=$$('.step',section),bars=$$('#tourBar i');
  var vp=null,eye=[0,0,0];
  function resize(){
    var r=cv.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,window.innerWidth<700?1.5:2);
    var w=Math.max(2,Math.round(r.width*dpr)),h=Math.max(2,Math.round(r.height*dpr));
    cssW=r.width;cssH=r.height;
    if(w!==W||h!==H){W=w;H=h;cv.width=W;cv.height=H;gl.viewport(0,0,W,H)}
  }
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(es){visible=es[0].isIntersecting},{rootMargin:'200px'}).observe(section);
  }else visible=true;
  window.addEventListener('resize',resize);

  addLoop(function(t,dt){
    if(!visible)return;
    resize();
    /* scroll progress through the pinned section */
    var r=section.getBoundingClientRect(),span=Math.max(1,r.height-S.vh);
    prog=clamp(-r.top/span,0,1);
    var si=Math.min(steps.length-1,Math.floor(prog*steps.length));
    steps.forEach(function(s,i){s.classList.toggle('is-active',i===si)});
    bars.forEach(function(b,i){b.style.setProperty('--f',clamp(prog*bars.length-i,0,1).toFixed(3))});
    /* motion */
    scrollYaw=lerp(scrollYaw,prog*TAU*.9,1-Math.exp(-dt*6));
    if(focus){
      var k=clamp((performance.now()-focus.t0)/focus.dur,0,1),e=1-Math.pow(1-k,3);
      userYaw=lerp(focus.from[0],focus.to[0],e);userPitch=lerp(focus.from[1],focus.to[1],e);dFactor=lerp(focus.from[2],focus.to[2],e);
      if(k>=1)focus=null;
    }else if(!dragging){userYaw+=velYaw;velYaw*=.94}
    if(auto&&!dragging&&!focus&&!reduce.matches)autoYaw+=dt*.2;
    var yaw=BASE_YAW+scrollYaw+userYaw+autoYaw;
    var pitch=.3+.1*Math.sin(prog*Math.PI)+userPitch;
    var aspect=W/H,fov=.66;
    var distX=15/(2*Math.tan(fov/2)*aspect),dist=Math.max(31,distX)*dFactor*(1-.08*Math.sin(prog*Math.PI));
    eye=[TARGET[0]+dist*Math.sin(yaw)*Math.cos(pitch),TARGET[1]+dist*Math.sin(pitch),TARGET[2]+dist*Math.cos(yaw)*Math.cos(pitch)];
    vp=mul(persp(fov,aspect,1,140),lookAt(eye,TARGET));
    /* lighting tween */
    var kk=1-Math.exp(-dt*2.4);
    mix3(L.sd,Lt.sd,kk);mix3(L.sc,Lt.sc,kk);mix3(L.sky,Lt.sky,kk);mix3(L.gr,Lt.gr,kk);L.em=lerp(L.em,Lt.em,kk);
    var sdn=norm(L.sd);
    /* draw */
    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.uniformMatrix4fv(U.uVP,false,new Float32Array(vp));
    gl.uniform3fv(U.uSunDir,sdn);gl.uniform3fv(U.uSunCol,L.sc);gl.uniform3fv(U.uSky,L.sky);gl.uniform3fv(U.uGround,L.gr);gl.uniform1f(U.uEmi,L.em);
    gl.drawArrays(gl.TRIANGLES,0,vcount);
    /* hotspots */
    var ev=norm(sub(eye,TARGET));
    hotEls.forEach(function(el,i){
      var h=HOT[i],c=[h.p[0],h.p[1],h.p[2],1],x=0,y=0,w=0,j;
      x=vp[0]*c[0]+vp[4]*c[1]+vp[8]*c[2]+vp[12];y=vp[1]*c[0]+vp[5]*c[1]+vp[9]*c[2]+vp[13];w=vp[3]*c[0]+vp[7]*c[1]+vp[11]*c[2]+vp[15];
      var facing=h.d?dot(norm(h.d),ev)>.2:true;
      var ok=w>0&&facing;
      var px=(x/w*.5+.5)*cssW,py=(1-(y/w*.5+.5))*cssH;
      if(px<30||px>cssW-30||py<24||py>cssH-60)ok=false;
      el.classList.toggle('is-hidden',!ok);
      if(ok)el.style.transform='translate('+px.toFixed(1)+'px,'+py.toFixed(1)+'px) translate(-50%,-50%)';
    });
  });
})();

/* ===================== Hero: slider + 3D tilt ===================== */
(function(){
  var slides=$$('.slide'),dotsBox=$('#dots'),tilt=$('#tilt'),hero=$('#top'),stg=$('#stage');
  var si=0,timer=null,heroVisible=true;
  slides.forEach(function(s,i){
    var b=document.createElement('button');b.type='button';b.className='dot';
    b.setAttribute('aria-label','Show view '+(i+1));b.innerHTML='<span></span>';
    b.addEventListener('click',function(){go(i);restart()});dotsBox.appendChild(b);
  });
  function go(i){
    si=(i+slides.length)%slides.length;
    slides.forEach(function(s,k){s.classList.toggle('is-on',k===si)});
    $$('.dot',dotsBox).forEach(function(d,k){d.setAttribute('aria-current',k===si?'true':'false')});
  }
  function restart(){
    clearInterval(timer);if(reduce.matches)return;
    timer=setInterval(function(){if(!document.hidden&&heroVisible)go(si+1)},6500);
  }
  go(0);restart();
  var tx=0,ty=0,cx=0,cy=0,pointerOn=false;
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(es){heroVisible=es[0].isIntersecting}).observe(hero);
  }
  hero.addEventListener('pointermove',function(e){
    if(e.pointerType==='touch'||reduce.matches)return;
    var r=stg.getBoundingClientRect();
    ty=clamp((e.clientX-(r.left+r.width/2))/(window.innerWidth/2),-1,1)*14;
    tx=-clamp((e.clientY-(r.top+r.height/2))/(window.innerHeight/2),-1,1)*10;pointerOn=true;
  },{passive:true});
  hero.addEventListener('pointerleave',function(){pointerOn=false});
  stg.addEventListener('pointermove',function(e){
    if(e.pointerType!=='touch'||reduce.matches)return;
    var r=stg.getBoundingClientRect();
    ty=clamp((e.clientX-(r.left+r.width/2))/(r.width/2),-1,1)*14;
    tx=-clamp((e.clientY-(r.top+r.height/2))/(r.height/2),-1,1)*10;pointerOn=true;
  },{passive:true});
  ['pointerup','pointercancel'].forEach(function(n){stg.addEventListener(n,function(e){if(e.pointerType==='touch')pointerOn=false})});
  addLoop(function(t){
    if(!heroVisible)return;
    var gx=tx,gy=ty;
    if(!pointerOn){
      if(reduce.matches){gx=0;gy=0}else{gy=Math.sin(t*.6)*5;gx=Math.cos(t*.45)*3}
    }
    cx+=(gx-cx)*.07;cy+=(gy-cy)*.07;
    tilt.style.transform='rotateX('+cx.toFixed(2)+'deg) rotateY('+cy.toFixed(2)+'deg)';
    stg.style.setProperty('--gx',(50+cy*2.4).toFixed(1)+'%');
    stg.style.setProperty('--gy',(28-cx*2.4).toFixed(1)+'%');
  });
})();

/* ===================== Rooms coverflow ===================== */
var gotoReserve;
(function(){
  var rooms=[
    {name:'Executive',text:'Modern and contemporary, with a luxurious double bed and a seating area.',chips:['Double bed','Seating area','Free WiFi','Air conditioning','Bathrobes']},
    {name:'Deluxe',text:'Totally soundproofed and equipped with high-tech comforts, including high-speed internet access and a smart TV.',chips:['Soundproofed','High-speed internet','Smart TV']},
    {name:'Family Superior',text:'A larger room with a balcony, three beds and complimentary bottled water.',chips:['Balcony','3 beds','Bottled water','Air conditioning']},
    {name:'Suite',text:'Designed in a resort style, giving the comfort and feel of a resort with teak wood furniture and chic white marble.',chips:['Resort-style design','Teak wood furniture','White marble']}
  ];
  var cf=$('#cf'),cards=$$('.cf__card',cf),prev=$('#cfPrev'),next=$('#cfNext'),panel=$('#room');
  var nameEl=$('#roomName'),textEl=$('#roomText'),chipsEl=$('#roomChips'),cta=$('#roomCta');
  var active=0,moved=false,startX=null;
  function layout(){
    var cw=cards[0].offsetWidth;
    cards.forEach(function(c,i){
      var o=i-active,ab=Math.abs(o),sign=o<0?-1:1;
      var x=o===0?0:sign*(cw*.62+(ab-1)*cw*.3);
      var z=-ab*130,ry=o===0?0:(o>0?-38:38);
      c.style.transform='translateX(-50%) translateX('+x.toFixed(1)+'px) translateZ('+z+'px) rotateY('+ry+'deg)';
      c.style.zIndex=10-ab;
      c.style.filter=o===0?'none':'brightness(.6)';
      c.style.opacity=ab>2?0:1;
      c.style.pointerEvents=ab>2?'none':'auto';
      if(o===0)c.setAttribute('aria-current','true');else c.removeAttribute('aria-current');
    });
    prev.setAttribute('aria-disabled',active===0?'true':'false');
    next.setAttribute('aria-disabled',active===rooms.length-1?'true':'false');
  }
  function fill(){
    var r=rooms[active];
    nameEl.textContent=r.name;textEl.textContent=r.text;
    chipsEl.innerHTML='';
    r.chips.forEach(function(t){var li=document.createElement('li');li.textContent=t;chipsEl.appendChild(li)});
    cta.textContent='Reserve the '+(r.name==='Suite'?'Suite':r.name+' room');
  }
  function set(i,instant){
    i=clamp(i,0,rooms.length-1);
    if(i===active&&!instant)return;
    active=i;layout();
    if(instant||reduce.matches){fill();return}
    panel.classList.add('is-swapping');
    setTimeout(function(){fill();panel.classList.remove('is-swapping')},220);
  }
  cards.forEach(function(c,i){c.addEventListener('click',function(){if(moved){moved=false;return}set(i)})});
  prev.addEventListener('click',function(){set(active-1)});
  next.addEventListener('click',function(){set(active+1)});
  cf.addEventListener('keydown',function(e){
    if(e.key==='ArrowLeft'){e.preventDefault();set(active-1)}
    if(e.key==='ArrowRight'){e.preventDefault();set(active+1)}
  });
  cf.addEventListener('pointerdown',function(e){startX=e.clientX;moved=false});
  cf.addEventListener('pointerup',function(e){
    if(startX===null)return;
    var dx=e.clientX-startX;startX=null;
    if(Math.abs(dx)>50){moved=true;set(active+(dx<0?1:-1))}
  });
  cf.addEventListener('pointercancel',function(){startX=null});
  window.addEventListener('resize',layout);
  gotoReserve=function(){document.getElementById('reserve').scrollIntoView({behavior:reduce.matches?'auto':'smooth'})};
  cta.addEventListener('click',function(){
    switchTab('stay');$('#fRoom').value=rooms[active].name;gotoReserve();
  });
  set(0,true);setTimeout(layout,300);
})();

/* ===================== Facilities filter ===================== */
(function(){
  var seg=$('#facSeg'),btns=$$('button',seg),tiles=$$('#tiles .tile');
  var place=makePill(seg,'button',function(b){return b.classList.contains('on')});
  function apply(f){
    btns.forEach(function(b){b.classList.toggle('on',b.getAttribute('data-f')===f)});
    tiles.forEach(function(t){t.classList.toggle('is-off',f!=='all'&&t.getAttribute('data-cat')!==f)});
    place();
  }
  btns.forEach(function(b){b.addEventListener('click',function(){apply(b.getAttribute('data-f'))})});
  setTimeout(place,100);
})();

/* ===================== Restaurant: open now + today's hours ===================== */
(function(){
  var out=$('#openNow'),label=$('span',out),rows=$$('#hours li');
  var SCH={1:[600,1380],2:[600,1380],3:[600,1380],4:[600,1380],5:[660,1560],6:[660,1560],0:[660,1560]};
  function fmt(m){m=m%1440;var h=Math.floor(m/60),mi=m%60,ap=h>=12?'PM':'AM';h=h%12||12;return h+':'+(mi<10?'0':'')+mi+' '+ap}
  function ist(){
    var f=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Kolkata',weekday:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}),p={};
    f.formatToParts(new Date()).forEach(function(x){p[x.type]=x.value});
    return {day:{Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6}[p.weekday],min:(parseInt(p.hour,10)%24)*60+parseInt(p.minute,10)};
  }
  function update(){
    var n;try{n=ist()}catch(e){out.hidden=true;return}
    var s=SCH[n.day],prevS=SCH[(n.day+6)%7],open=false,msg='';
    if(n.min>=s[0]&&n.min<s[1]){open=true;msg='Open now, until '+fmt(s[1])}
    else if(prevS[1]>1440&&n.min<prevS[1]-1440){open=true;msg='Open now, until '+fmt(prevS[1])}
    else if(n.min<s[0]){msg='Closed now, opens today at '+fmt(s[0])}
    else{msg='Closed now, opens tomorrow at '+fmt(SCH[(n.day+1)%7][0])}
    out.classList.toggle('is-closed',!open);label.textContent=msg;
    rows.forEach(function(li){li.classList.toggle('today',li.getAttribute('data-days').split(',').indexOf(String(n.day))>-1)});
  }
  update();setInterval(update,60000);
})();

/* ===================== Lightbox (hotel + restaurant groups) ===================== */
(function(){
  var lb=$('#lb'),lbImg=$('#lbImg'),lbMiss=$('#lbMiss'),lbCap=$('#lbCap');
  var closeB=$('#lbClose'),prevB=$('#lbPrev'),nextB=$('#lbNext'),items=[],gi=0,last=null,sx=null;
  function show(){
    var it=items[gi],im=it.querySelector('img');
    im.loading='eager';
    var src=im.getAttribute('data-resolved')||(it.classList.contains('missing')?'':(im.currentSrc||im.src));
    if(src){lbImg.src=src;lbImg.alt=im.alt;lbImg.hidden=false;lbMiss.hidden=true}
    else{lbImg.hidden=true;lbMiss.hidden=false}
    lbCap.textContent='Photo '+(gi+1)+' of '+items.length;
  }
  function open(group,i){items=$$('[data-lb="'+group+'"]');gi=i;last=document.activeElement;show();lb.hidden=false;root.classList.add('no-scroll');closeB.focus()}
  function close(){lb.hidden=true;root.classList.remove('no-scroll');if(last)last.focus()}
  function step(d){gi=(gi+d+items.length)%items.length;show()}
  $$('[data-lb]').forEach(function(b){
    var g=b.getAttribute('data-lb');
    b.addEventListener('click',function(){open(g,$$('[data-lb="'+g+'"]').indexOf(b))});
  });
  closeB.addEventListener('click',close);prevB.addEventListener('click',function(){step(-1)});nextB.addEventListener('click',function(){step(1)});
  lb.addEventListener('click',function(e){if(e.target===lb)close()});
  document.addEventListener('keydown',function(e){
    if(lb.hidden)return;
    if(e.key==='Escape')close();
    if(e.key==='ArrowLeft')step(-1);
    if(e.key==='ArrowRight')step(1);
    if(e.key==='Tab'){
      var f=[closeB,prevB,nextB],i=f.indexOf(document.activeElement);
      e.preventDefault();f[(i+(e.shiftKey?-1:1)+f.length)%f.length].focus();
    }
  });
  lb.addEventListener('pointerdown',function(e){sx=e.clientX});
  lb.addEventListener('pointerup',function(e){
    if(sx===null)return;var dx=e.clientX-sx;sx=null;
    if(Math.abs(dx)>60)step(dx<0?1:-1);
  });
})();

/* ===================== Reservation forms (room + table) ===================== */
var switchTab;
(function(){
  var seg=$('#resSeg'),tabs=$$('[role=tab]',seg),forms={stay:$('#resForm'),table:$('#tblForm')};
  var place=makePill(seg,'[role=tab]',function(b){return b.getAttribute('aria-selected')==='true'});
  switchTab=function(t){
    tabs.forEach(function(b){b.setAttribute('aria-selected',b.getAttribute('data-t')===t?'true':'false');b.tabIndex=b.getAttribute('data-t')===t?0:-1});
    forms.stay.hidden=t!=='stay';forms.table.hidden=t!=='table';
    place();
  };
  tabs.forEach(function(b,i){
    b.addEventListener('click',function(){switchTab(b.getAttribute('data-t'))});
    b.addEventListener('keydown',function(e){
      if(e.key==='ArrowRight'||e.key==='ArrowLeft'){
        e.preventDefault();var n=tabs[(i+1)%tabs.length];switchTab(n.getAttribute('data-t'));n.focus();
      }
    });
  });
  $$('[data-goto="table"]').forEach(function(b){b.addEventListener('click',function(){switchTab('table');gotoReserve()})});
  setTimeout(place,100);

  function iso(d){var m=('0'+(d.getMonth()+1)).slice(-2),day=('0'+d.getDate()).slice(-2);return d.getFullYear()+'-'+m+'-'+day}
  function fmtDate(v){return new Date(v+'T00:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
  function fmtTime(v){var p=v.split(':'),h=parseInt(p[0],10),ap=h>=12?'PM':'AM';h=h%12||12;return h+':'+p[1]+' '+ap}
  function openUrl(u){var a=document.createElement('a');a.href=u;a.target='_blank';a.rel='noopener';document.body.appendChild(a);a.click();a.remove()}
  function stepper(minus,plus,input,min,max){
    $(minus).addEventListener('click',function(){input.value=clamp((parseInt(input.value,10)||1)-1,min,max)});
    $(plus).addEventListener('click',function(){input.value=clamp((parseInt(input.value,10)||1)+1,min,max)});
  }
  var today=iso(new Date());

  /* --- room --- */
  var nameI=$('#fName'),phoneI=$('#fPhone'),inI=$('#fIn'),outI=$('#fOut'),gI=$('#fGuests'),roomI=$('#fRoom'),noteI=$('#fNote'),st=$('#resStatus');
  inI.min=today;outI.min=today;
  inI.addEventListener('change',function(){
    if(!inI.value)return;
    var d=new Date(inI.value+'T00:00:00');d.setDate(d.getDate()+1);
    outI.min=iso(d);if(outI.value&&outI.value<outI.min)outI.value='';
  });
  stepper('#gMinus','#gPlus',gI,1,10);
  function bad(list,st,el,msg){
    list.forEach(function(x){x.setAttribute('aria-invalid','false')});
    el.setAttribute('aria-invalid','true');el.focus();
    st.textContent=msg;st.className='status is-error';return null;
  }
  function clear(list){list.forEach(function(x){x.setAttribute('aria-invalid','false')})}
  function digits(v){return v.replace(/\D/g,'')}
  function roomMsg(){
    var L=[nameI,phoneI,inI,outI],name=nameI.value.trim();
    if(name.length<2)return bad(L,st,nameI,'Enter your name so we know who to reply to.');
    if(digits(phoneI.value).length<7)return bad(L,st,phoneI,'Enter a phone number we can reach you on.');
    if(!inI.value)return bad(L,st,inI,'Choose your check-in date.');
    if(inI.value<today)return bad(L,st,inI,'Check-in can\'t be in the past.');
    if(!outI.value)return bad(L,st,outI,'Choose your check-out date.');
    if(outI.value<=inI.value)return bad(L,st,outI,'Check-out must be after check-in.');
    clear(L);
    var nights=Math.round((new Date(outI.value)-new Date(inI.value))/86400000),guests=clamp(parseInt(gI.value,10)||1,1,10);
    var lines=['Hello Hotel SM Palace, I\'d like to reserve a room.','','Name: '+name,'Phone: '+phoneI.value.trim(),'Check-in: '+fmtDate(inI.value),'Check-out: '+fmtDate(outI.value)+' ('+nights+(nights===1?' night':' nights')+')','Guests: '+guests,'Room: '+roomI.value];
    if(noteI.value.trim())lines.push('Notes: '+noteI.value.trim());
    return lines.join('\n');
  }
  $('#sendWa').addEventListener('click',function(){
    var m=roomMsg();if(!m)return;
    st.className='status';st.textContent='Opening WhatsApp with your details. Press send there to finish.';
    openUrl('https://wa.me/'+PHONE+'?text='+encodeURIComponent(m));
  });
  $('#sendMail').addEventListener('click',function(){
    var m=roomMsg();if(!m)return;
    st.className='status';st.textContent='Opening your email app with your details. Press send there to finish.';
    window.location.href='mailto:'+EMAIL+'?subject='+encodeURIComponent('Room reservation request')+'&body='+encodeURIComponent(m);
  });

  /* --- table --- */
  var tN=$('#tName'),tP=$('#tPhone'),tD=$('#tDate'),tT=$('#tTime'),tG=$('#tGuests'),tNote=$('#tNote'),tst=$('#tblStatus');
  tD.min=today;stepper('#tMinus','#tPlus',tG,1,30);
  function tableMsg(){
    var L=[tN,tP,tD,tT],name=tN.value.trim();
    if(name.length<2)return bad(L,tst,tN,'Enter your name so we know who to reply to.');
    if(digits(tP.value).length<7)return bad(L,tst,tP,'Enter a phone number we can reach you on.');
    if(!tD.value)return bad(L,tst,tD,'Choose the date.');
    if(tD.value<today)return bad(L,tst,tD,'The date can\'t be in the past.');
    if(!tT.value)return bad(L,tst,tT,'Choose a time.');
    clear(L);
    var lines=['Hello Hotel SM Palace, I\'d like to reserve a table at The Indian Garden Restaurant.','','Name: '+name,'Phone: '+tP.value.trim(),'Date: '+fmtDate(tD.value),'Time: '+fmtTime(tT.value),'Guests: '+clamp(parseInt(tG.value,10)||1,1,30)];
    if(tNote.value.trim())lines.push('Notes: '+tNote.value.trim());
    return lines.join('\n');
  }
  $('#tWa').addEventListener('click',function(){
    var m=tableMsg();if(!m)return;
    tst.className='status';tst.textContent='Opening WhatsApp with your details. Press send there to finish.';
    openUrl('https://wa.me/'+PHONE+'?text='+encodeURIComponent(m));
  });
  $('#tMail').addEventListener('click',function(){
    var m=tableMsg();if(!m)return;
    tst.className='status';tst.textContent='Opening your email app with your details. Press send there to finish.';
    window.location.href='mailto:'+EMAIL+'?subject='+encodeURIComponent('Table reservation request')+'&body='+encodeURIComponent(m);
  });
  $('#resForm').addEventListener('submit',function(e){e.preventDefault()});
  $('#tblForm').addEventListener('submit',function(e){e.preventDefault()});
})();


/* ===================== Full menu: built into this page, no PDF needed ===================== */
(function(){
  var view=$('#menuView'),list=$('#mnuBody'),nav=$('#mnuNav'),link=$('#menuLink'),closeB=$('#mnuClose'),printB=$('#mnuPrint');
  if(!view||!list||!nav||!link)return;
  var built=false,last=null,secs=[],chips=[],ticking=false;
  function build(){
    var DATA=JSON.parse($('#menuData').textContent);
    DATA.sections.forEach(function(s,i){
      var sec=document.createElement('section');sec.className='mnu__sec';sec.setAttribute('aria-labelledby','mnuH'+i);
      var h=document.createElement('h3');h.id='mnuH'+i;h.textContent=s.t;sec.appendChild(h);
      s.i.forEach(function(it){
        var row=document.createElement('div');row.className='mnu__item';
        var top=document.createElement('div');top.className='mnu__row';
        var n=document.createElement('span');n.className='mnu__name';n.textContent=it[0];
        var p=document.createElement('span');p.className='mnu__price';p.textContent=it[1];
        top.appendChild(n);top.appendChild(p);row.appendChild(top);
        if(it[2]){var d=document.createElement('p');d.className='mnu__desc';d.textContent=it[2];row.appendChild(d)}
        if(it[3]){var r=document.createElement('p');r.className='mnu__rec';r.textContent='Recipe: '+it[3];row.appendChild(r)}
        sec.appendChild(row);
      });
      list.appendChild(sec);secs.push(sec);
      var c=document.createElement('button');c.type='button';c.textContent=s.t;
      c.addEventListener('click',function(){list.scrollTo({top:sec.offsetTop-8,behavior:reduce.matches?'auto':'smooth'})});
      nav.appendChild(c);chips.push(c);
    });
    var note=document.createElement('p');note.className='mnu__note';note.textContent=DATA.note;list.appendChild(note);
    list.addEventListener('scroll',function(){if(ticking)return;ticking=true;requestAnimationFrame(function(){ticking=false;mark()})},{passive:true});
    built=true;
  }
  function mark(){
    var y=list.scrollTop+list.clientHeight*.25,idx=0,i;
    for(i=0;i<secs.length;i++){if(secs[i].offsetTop<=y)idx=i}
    chips.forEach(function(c,k){c.classList.toggle('on',k===idx)});
    var on=chips[idx];if(on)nav.scrollLeft=on.offsetLeft-nav.clientWidth/2+on.offsetWidth/2;
  }
  function open(){
    if(!built)build();
    last=document.activeElement;view.hidden=false;root.classList.add('no-scroll');list.scrollTop=0;mark();closeB.focus();
  }
  function close(){
    view.hidden=true;root.classList.remove('no-scroll');
    if(location.hash==='#menu'){try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}}
    if(last&&last.focus)last.focus();
  }
  link.addEventListener('click',function(e){e.preventDefault();open()});
  closeB.addEventListener('click',close);
  document.addEventListener('keydown',function(e){
    if(view.hidden)return;
    if(e.key==='Escape'){close();return}
    if(e.key==='Tab'){
      var f=[printB,closeB].concat(chips),i=f.indexOf(document.activeElement);
      e.preventDefault();f[(i+(e.shiftKey?-1:1)+f.length)%f.length].focus();
    }
  });
  printB.addEventListener('click',function(){
    var title=document.title;
    root.classList.add('print-menu');document.title='The Indian Garden - Menu';
    var done=function(){root.classList.remove('print-menu');document.title=title;window.removeEventListener('afterprint',done)};
    window.addEventListener('afterprint',done);
    setTimeout(function(){window.print()},60);
  });
  if(location.hash==='#menu')setTimeout(open,900);
  window.addEventListener('hashchange',function(){if(location.hash==='#menu'&&view.hidden)open()});
})();

/* ===================== Guest reviews (add real ones here; the section stays hidden while empty) ===================== */
(function(){
  var REVIEWS=[/* {name:'Guest name',text:'Their words about the stay.'} */];
  if(!REVIEWS.length)return;
  var box=$('#reviews'),list=$('#reviewList');
  REVIEWS.forEach(function(r){
    var c=document.createElement('figure');c.className='tile glass';c.style.display='block';
    var q=document.createElement('blockquote');q.style.margin='0';q.textContent=r.text;
    var f=document.createElement('figcaption');f.style.marginTop='.7rem';f.style.fontWeight='600';f.textContent=r.name;
    c.appendChild(q);c.appendChild(f);list.appendChild(c);
  });
  box.hidden=false;
})();

/* start in the right place if the page was opened with a #hash */
setTimeout(placePills,300);

})();