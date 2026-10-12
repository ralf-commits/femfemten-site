(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const chapters = [
    {label:'TEMPOET',eyebrow:'ET GODT STED AT BEGYNDE',title:'Tempo til<br>at tænke.',copy:'5:15 min/km. Hurtigt nok til at komme frem.<br>Roligt nok til at få en idé.',note:'Vi omsætter strategi, data og AI til noget, du kan bruge.',action:'Find din rute',notification:'Fra ambition til drift.',notificationCopy:'Processer, AI og kommerciel udvikling.'},
    {label:'IDÉERNE',eyebrow:'FØRST KOMMER ET GODT SPØRGSMÅL',title:'Hvad nu,<br>hvis vi…',copy:'En ny forretning. En smartere arbejdsgang.<br>En idé, der har ligget lidt for længe.',note:'Vi giver tanken modspil — og finder et første skridt.',action:'Find din rute',notification:'AI, der bliver brugt.',notificationCopy:'Fra konkret behov til løsning i hverdagen.'},
    {label:'ARBEJDET',eyebrow:'FRA TANKE TIL NOGET, DU KAN BRUGE',title:'Idéer skal<br>ud at leve.',copy:'En prototype, du kan prøve.<br>En analyse, du kan handle på.',note:'AI, strategi og praktisk udvikling. Ét skridt ad gangen.',action:'Se cases',notification:'Mere salg. Bedre indtjening.',notificationCopy:'Vækst på både top- og bundlinjen.'},
    {label:'DIN FREMDRIFT',eyebrow:'FRA STRATEGI TIL HVERDAG',title:'En klar plan.<br>Noget leveret.',copy:'Bedre processer. AI i praksis.<br>En stærkere kommerciel indsats.',note:'Erfaring fra globale, regionale og lokale roller — omsat til konkrete leverancer.',action:'Se leverancer på uret',notification:'Hvad skal vi løse?',notificationCopy:'Se de tre områder på uret.'}
  ];
  const offerings = [
    {label:'Operational Excellence',screenLabel:'Operational Excellence',title:'Bedre workflows. AI fra start.',copy:'Vi analyserer, hvordan arbejdet foregår i dag, og designer en ny måde at løse opgaven på med AI tænkt ind fra begyndelsen. Arbejdsgange, der ikke virker, bliver gentænkt. Vi sætter roller, AI og menneskelig kontrol op og hjælper jer med at få den nye arbejdsgang i drift.',metric:'Flow',unit:'tænkt med AI først',icon:'↗',color:'#74b5ff',deliverable:'Analyse af status quo, nyt workflow og implementering med oplæring',approach:'Forstå arbejdet → gentænk → implementér → mål gevinsten',experience:'Gevinsten kommer, når måden at arbejde på ændrer sig. Vi følger op på tidsforbrug, kvalitet og kapacitet — med afsæt i praktisk erfaring med operational excellence.'},
    {label:'AI-implementering',screenLabel:'AI i praksis',title:'Byg med AI. Få det til at virke.',copy:'AI skal blive til mere end pænere marketing, mere støj og endeløse PowerPoints. Vi hjælper jer med at bygge og implementere løsninger, der løser konkrete opgaver. Vi får data, værktøjer og integrationer på plads og afprøver løsningen med dem, der skal bruge den.',metric:'AI',unit:'bygget til jeres hverdag',icon:'✳',color:'#a3e2f1',deliverable:'AI-løsning, integrationer, afprøvning og oplæring',approach:'Afklar opgaven → byg → test → sæt i drift',experience:'Det er et forløb tilpasset jer. Vi bygger trin for trin, aftaler ansvar og hjælper med den løbende tilpasning, der får AI til at fungere i hverdagen.'},
    {label:'Commercial Excellence',screenLabel:'Commercial Excellence',title:'Mere salg. Bedre indtjening.',copy:'Vi hjælper jer med at vinde flere kunder, udvikle de eksisterende og få mere ud af det, I sælger. Vi omsætter marked, produkt og pris til en konkret salgsindsats — og følger op på både omsætning og indtjening.',metric:'Vækst',unit:'på top- og bundlinjen',icon:'↗',color:'#b9c3ff',deliverable:'Vækstplan, kundeprioritering og konkrete pris- og salgsindsatser',approach:'Find potentialet → sæt ind → mål væksten',experience:'Vi har skabt vækst på både top- og bundlinjen i egne virksomheder og hos tidligere arbejdsgivere. Med erfaring fra salg og product management på globalt, regionalt og lokalt niveau.'}
  ];
  let chapter=0, changing=false, paused=reduced.matches, watchOpen=false, phoneOpen=false, phoneClosing=false, wheelTotal=0, wheelReset=0, touchStart=null;
  let simulationTime=0, previousFrame=0, renderFrame=null;
  function changeChapter(next){
    next=Math.max(0,Math.min(chapters.length-1,next));
    if(next===chapter || changing || watchOpen || phoneOpen) return;
    changing=true;chapter=next;
    $('lens').classList.add('switching');
    const flash=document.querySelector('.lens-flash');
    flash.classList.remove('changing');void flash.offsetWidth;flash.classList.add('changing');
    window.setTimeout(()=>{
      const c=chapters[chapter];
      $('eyebrow').textContent=c.eyebrow;$('title').innerHTML=c.title;$('copy').innerHTML=c.copy;
      $('lensNote').textContent=c.note;$('nextLens').innerHTML=c.action;
      $('chapterLabel').textContent=String(chapter+1).padStart(2,'0')+' / 04 · '+c.label;
      $('notificationTitle').textContent=c.notification;$('notificationCopy').textContent=c.notificationCopy;
      $('routeProgress').style.width=(chapter/(chapters.length-1)*100)+'%';
      document.querySelectorAll('[data-chapter]').forEach((button,index)=>{button.classList.toggle('active',index===chapter);if(index===chapter) button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');});
      $('lens').classList.remove('switching');
      window.setTimeout(()=>{changing=false;},300);
    },reduced.matches?0:230);
  }
  function setPaused(value){
    paused=value;document.body.classList.toggle('paused',paused);$('motion').setAttribute('aria-pressed',String(paused));
    $('motion').setAttribute('aria-label',paused?'Fortsæt bevægelsen':'Sæt bevægelsen på pause');
    $('motionIcon').textContent=paused?'▷':'Ⅱ';$('motionText').textContent=paused?'Fortsæt turen':'Pause turen';
  }
  $('motion').addEventListener('click',()=>setPaused(!paused));
  reduced.addEventListener('change',()=>setPaused(reduced.matches));
  setPaused(paused);
  $('home').addEventListener('click',()=>changeChapter(0));
  $('nextLens').addEventListener('click',()=>chapter===3?openWatch():chapter===2?openPhone():window.openRoutePanel('services'));
  document.querySelectorAll('[data-chapter]').forEach(button=>button.addEventListener('click',()=>changeChapter(Number(button.dataset.chapter))));
  document.addEventListener('wheel',event=>{
    if(watchOpen||phoneOpen||document.querySelector('#routePanel[open]'))return;
    event.preventDefault();
    if(changing)return;
    wheelTotal+=event.deltaY;
    clearTimeout(wheelReset);wheelReset=setTimeout(()=>wheelTotal=0,180);
    if(Math.abs(wheelTotal)>65){changeChapter(chapter+(wheelTotal>0?1:-1));wheelTotal=0;}
  },{passive:false});
  document.addEventListener('touchstart',event=>{if(watchOpen||phoneOpen||document.querySelector('#routePanel[open]'))return;touchStart={x:event.touches[0].clientX,y:event.touches[0].clientY};},{passive:true});
  document.addEventListener('touchend',event=>{
    if(!touchStart||watchOpen||phoneOpen||document.querySelector('#routePanel[open]'))return;
    const dy=touchStart.y-event.changedTouches[0].clientY,dx=touchStart.x-event.changedTouches[0].clientX;
    if(Math.abs(dy)>50&&Math.abs(dy)>Math.abs(dx))changeChapter(chapter+(dy>0?1:-1));touchStart=null;
  },{passive:true});
  document.addEventListener('keydown',event=>{
    if(document.querySelector('#routePanel[open]') || watchOpen || phoneOpen || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName))return;
    if(['ArrowDown','ArrowRight','PageDown'].includes(event.key)){event.preventDefault();changeChapter(chapter+1);}
    else if(['ArrowUp','ArrowLeft','PageUp'].includes(event.key)){event.preventDefault();changeChapter(chapter-1);}
    else if(event.key==='Home'){event.preventDefault();changeChapter(0);}
    else if(event.key==='End'){event.preventDefault();changeChapter(3);}
  });
  function setOffering(index){
    const s=offerings[index];
    $('watchTitle').textContent=s.screenLabel;$('watchMetric').textContent=s.metric;$('watchUnit').textContent=s.unit;$('watchStatusIcon').textContent=s.icon;
    document.querySelector('.watch-screen').style.setProperty('--status-color',s.color);
    $('detailTitle').textContent=s.title;$('detailCopy').textContent=s.copy;$('deliverable').textContent=s.deliverable;$('deliveryApproach').textContent=s.approach;$('deliveryExperience').textContent=s.experience;
    document.querySelectorAll('[data-offering]').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
    document.querySelectorAll('.watch-dots i').forEach((dot,i)=>dot.classList.toggle('active',i===index));
  }
  offerings.forEach((s,index)=>{
    const button=document.createElement('button');button.type='button';button.textContent=s.label;button.dataset.offering=index;button.setAttribute('aria-pressed',String(index===0));button.addEventListener('click',()=>setOffering(index));$('offeringPicker').append(button);
  });
  function openWatch(){
    setOffering(chapter===1?1:chapter===2?2:0);watchOpen=true;document.body.classList.add('watch-open');
    $('watchClock').textContent=new Intl.DateTimeFormat('da-DK',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/Copenhagen'}).format(new Date()).replace('.',':');
    $('watchDialog').showModal();$('closeWatch').focus();
  }
  function closeWatch(){ $('watchDialog').close(); }
  $('openWatch').addEventListener('click',openWatch);
  $('notification').addEventListener('click',event=>{if(!event.target.closest('button'))openWatch();});
  $('closeWatch').addEventListener('click',closeWatch);
  $('watchDialog').addEventListener('close',()=>{watchOpen=false;document.body.classList.remove('watch-open');});
  $('watchDialog').addEventListener('click',event=>{if(event.target===$('watchDialog'))closeWatch();});
  const caseCards=Array.from(document.querySelectorAll('.activity-card'));
  const caseButtons=Array.from(document.querySelectorAll('[data-case-jump]'));
  const phoneFeed=$('phoneFeed');
  let caseScrollScheduled=false;
  function updateCasePosition(){
    const feedTop=phoneFeed.getBoundingClientRect().top;
    let active=0;
    caseCards.forEach((card,index)=>{if(card.getBoundingClientRect().top-feedTop<100)active=index;});
    caseButtons.forEach((button,index)=>{if(index===active)button.setAttribute('aria-current','true');else button.removeAttribute('aria-current');});
    $('phoneCaseCount').textContent=String(active+1).padStart(2,'0')+' / '+String(caseCards.length).padStart(2,'0');
    caseScrollScheduled=false;
  }
  function openPhone(){
    if(watchOpen||phoneOpen||document.querySelector('#routePanel[open]'))return;
    phoneOpen=true;phoneClosing=false;touchStart=null;wheelTotal=0;
    document.body.classList.add('phone-open');$('phoneDialog').classList.remove('closing');
    $('phoneDialog').showModal();$('closePhone').focus();
    requestAnimationFrame(updateCasePosition);
  }
  function closePhone(){
    if(phoneClosing)return;phoneClosing=true;
    $('phoneDialog').classList.add('closing');
    window.setTimeout(()=>{$('phoneDialog').close();},reduced.matches?0:320);
  }
  $('openPhone').addEventListener('click',openPhone);
  $('closePhone').addEventListener('click',closePhone);
  $('phoneDialog').addEventListener('cancel',event=>{event.preventDefault();closePhone();});
  $('phoneDialog').addEventListener('close',()=>{phoneOpen=false;phoneClosing=false;document.body.classList.remove('phone-open');$('phoneDialog').classList.remove('closing');touchStart=null;});
  $('phoneStage').addEventListener('click',event=>{if(event.target===$('phoneStage'))closePhone();});
  phoneFeed.addEventListener('scroll',()=>{if(!caseScrollScheduled){caseScrollScheduled=true;requestAnimationFrame(updateCasePosition);}},{passive:true});
  caseButtons.forEach((button,index)=>button.addEventListener('click',()=>{
    const target=phoneFeed.scrollTop+caseCards[index].getBoundingClientRect().top-phoneFeed.getBoundingClientRect().top;
    phoneFeed.scrollTo({top:target,behavior:reduced.matches?'instant':'smooth'});
  }));
  $('phoneDialog').addEventListener('wheel',event=>{
    if(event.target.closest('.phone-feed'))return;
    event.preventDefault();phoneFeed.scrollTop+=event.deltaY;
  },{passive:false});
  $('phoneDialog').addEventListener('keydown',event=>{
    const movement={ArrowDown:64,ArrowUp:-64,PageDown:phoneFeed.clientHeight*.8,PageUp:-phoneFeed.clientHeight*.8};
    if(event.key in movement){event.preventDefault();phoneFeed.scrollBy({top:movement[event.key],behavior:reduced.matches?'instant':'smooth'});}
    else if(event.key==='Home'||event.key==='End'){event.preventDefault();phoneFeed.scrollTo({top:event.key==='Home'?0:phoneFeed.scrollHeight,behavior:reduced.matches?'instant':'smooth'});}
  });
  setInterval(()=>{
    if(paused||watchOpen||phoneOpen||document.hidden)return;
    const bpm=Math.round(132+Math.sin(simulationTime*.09)*3+Math.sin(simulationTime*.17));
    $('bpm').textContent=bpm;document.documentElement.style.setProperty('--beat',(60/bpm).toFixed(3)+'s');
  },3500);
  // One photograph is reprojected in a continuous two-phase loop. The final
  // production scene can use a muted, playsinline POV film with the same UI.
  const canvas=$('road');
  const gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});
  if(!gl)return;
  function compile(type,source){const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(shader));return shader;}
  try {
    const vert=compile(gl.VERTEX_SHADER,'attribute vec2 a_position; varying vec2 v_uv; void main(){v_uv=a_position*.5+.5; gl_Position=vec4(a_position,0.,1.);}');
    const frag=compile(gl.FRAGMENT_SHADER,`
      precision mediump float;
      varying vec2 v_uv;
      uniform sampler2D u_photo;
      uniform vec2 u_resolution;
      uniform vec2 u_image;
      uniform float u_time;
      vec2 cover(vec2 uv){
        float screen=u_resolution.x/u_resolution.y;
        float photo=u_image.x/u_image.y;
        vec2 factor=vec2(min(screen/photo,1.),min(photo/screen,1.));
        return (uv-.5)*factor+.5;
      }
      vec3 scene(vec2 uv,float phase){
        vec2 anchor=vec2(.565,.447);
        float zoom=1.02+phase*.19;
        vec2 q=anchor+(uv-anchor)/zoom;
        return texture2D(u_photo,clamp(q,.001,.999)).rgb;
      }
      void main(){
        vec2 uv=v_uv;
        vec2 p=uv-.5;
        float radius=dot(p,p);
        uv=.5+p*(1.+radius*.028);
        float step=u_time*8.9;
        uv.y+=sin(step*2.)*.0010+sin(step)*.0004;
        uv.x+=sin(step)*.0007;
        uv=cover(uv);
        float a=fract(u_time/16.);
        float b=fract(u_time/16.+.5);
        float wa=pow(sin(a*3.14159265),2.);
        vec3 color=scene(uv,a)*wa+scene(uv,b)*(1.-wa);
        color=mix(vec3(dot(color,vec3(.2126,.7152,.0722))),color,.88);
        color*=vec3(.98,.99,1.);
        float vignette=1.-.21*pow(length((v_uv-.5)*vec2(.9,1.)),1.4);
        gl_FragColor=vec4(color*vignette,1.);
      }
    `);
    const program=gl.createProgram();gl.attachShader(program,vert);gl.attachShader(program,frag);gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('Scene unavailable');
    gl.useProgram(program);
    const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    const loc=gl.getAttribLocation(program,'a_position');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
    const timeLoc=gl.getUniformLocation(program,'u_time'),sizeLoc=gl.getUniformLocation(program,'u_resolution'),imageLoc=gl.getUniformLocation(program,'u_image');
    const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    const photo=new Image();
    photo.onload=()=>{
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,photo);gl.uniform2f(imageLoc,photo.width,photo.height);
      function resize(){const dpr=Math.min(window.devicePixelRatio||1,1.5);canvas.width=Math.round(canvas.clientWidth*dpr);canvas.height=Math.round(canvas.clientHeight*dpr);gl.viewport(0,0,canvas.width,canvas.height);gl.uniform2f(sizeLoc,canvas.width,canvas.height);}
      resize();window.addEventListener('resize',resize,{passive:true});
      renderFrame=now=>{
        const dt=previousFrame?Math.min((now-previousFrame)/1000,.05):0;previousFrame=now;
        if(!paused&&!watchOpen&&!phoneOpen&&!document.hidden)simulationTime+=dt;
        gl.uniform1f(timeLoc,simulationTime);gl.drawArrays(gl.TRIANGLES,0,6);
        if(!document.hidden)requestAnimationFrame(renderFrame);
      };
      requestAnimationFrame(renderFrame);$('scenery').classList.add('ready');
      document.addEventListener('visibilitychange',()=>{if(!document.hidden){previousFrame=0;requestAnimationFrame(renderFrame);}});
    };
    photo.src='/assets/coast.jpg';
    canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();$('scenery').classList.remove('ready');});
  } catch(error) { $('scenery').classList.remove('ready'); }
})();
