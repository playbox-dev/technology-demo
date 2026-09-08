(() => {
  'use strict';
  const root=document.getElementById('pb-five');
  const q=s=>root.querySelector(s);
  const qa=s=>Array.from(root.querySelectorAll(s));
  const siteOrigin=(root.dataset.siteOrigin||'https://playbox-dev.studio.site').replace(/\/+$/,'');
  q('.research-link').href=siteOrigin+'/wp_categories_QHrK8YuM-1/tech-blog';
  const video=q('#source-video');
  const main=q('#main-model'),one=q('#apply-one-model'),two=q('#apply-two-model');
  const play=q('#play-toggle');
  const sceneTabs=qa('.scene-nav button[data-scene]');
  const sceneOrder=sceneTabs.map(button=>button.dataset.scene);
  const progress=q('#scene-progress');
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  Object.entries(PB5Aligned).forEach(([id,model])=>Object.assign(PB5_DATA[id],{start:model.start,end:model.end,note:model.note}));
  const state={scene:PB5_DATA[location.hash.slice(1)]?location.hash.slice(1):'football',ready:false,wanted:!matchMedia('(prefers-reduced-motion: reduce)').matches,time:0,error:false};
  const hasFrameClock=typeof video.requestVideoFrameCallback==='function';
  let generation=0,lastTime=-1,lastTick=0,presentedTime=null,frameRequest=null,activeTab=null,lastProgressSecond=-1;
  const recordFrames=[null,null,null],recordDistance=[Infinity,Infinity,Infinity];
  const recordTimes=[.18,.92,1.84];

  function showProgress(time){
    const c=PB5_DATA[state.scene],duration=c.end-c.start;
    const elapsed=clamp(time-c.start,0,duration),fraction=duration>0?elapsed/duration:0;
    activeTab?.style.setProperty('--scene-progress',fraction.toFixed(4));
    root.dataset.progress=fraction.toFixed(4);
    // Expose elapsed time without announcing every video frame.
    const second=Math.floor(elapsed);
    if(second!==lastProgressSecond||fraction===1){
      lastProgressSecond=second;
      progress.setAttribute('aria-valuenow',String(Math.round(fraction*100)));
      progress.setAttribute('aria-valuetext',`${elapsed.toFixed(1)}秒 / ${duration.toFixed(1)}秒`);
    }
  }

  function requestFrame(){
    if(!hasFrameClock||frameRequest!==null)return;
    const token=generation;
    frameRequest=video.requestVideoFrameCallback((now,metadata)=>{
      if(token!==generation)return;
      frameRequest=null;
      framePresented(now,metadata);
    });
  }

  function advanceScene(){
    if(!state.ready||!state.wanted||state.error||document.hidden||video.seeking||(!video.ended&&video.paused))return;
    showProgress(PB5_DATA[state.scene].end);
    switchScene(sceneOrder[(sceneOrder.indexOf(state.scene)+1)%sceneOrder.length]);
  }

  function paintCorrespondence(snapshot){
    const overlay=q('#source-correspondence'),b=q('.source-media').getBoundingClientRect();
    const width=Math.max(1,b.width),height=Math.max(1,b.height);
    overlay.setAttribute('viewBox',`0 0 ${width} ${height}`);
    const ratio=video.videoWidth&&video.videoHeight?video.videoWidth/video.videoHeight:(state.scene==='spaces'?4/3:16/9);
    const vw=Math.min(width,height*ratio),vh=vw/ratio,ox=(width-vw)/2,oy=(height-vh)/2;
    const points=(snapshot.people||[]).filter(p=>p.visible!==false&&p.source);
    let markup=state.scene==='work'?'':points.map(p=>{
      const x=ox+p.source[0]*vw,y=oy+p.source[1]*vh;
      return `<circle data-track="${p.id}" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="2.1" fill="${p.red?'#ff3110':'#ffffff'}" stroke="${p.red?'#ffffff':'#30372b'}" stroke-width=".75"/>`;
    }).join('');
    if(snapshot.ball?.source){const [x,y]=snapshot.ball.source;markup+=`<circle cx="${(ox+x*vw).toFixed(2)}" cy="${(oy+y*vh).toFixed(2)}" r="1.8" fill="#202020" stroke="#fff" stroke-width=".7"/>`;}
    overlay.innerHTML=`<defs><clipPath id="source-frame-clip"><rect x="${ox}" y="${oy}" width="${vw}" height="${vh}"/></clipPath></defs><g clip-path="url(#source-frame-clip)">${markup}</g>`;
    const count=state.scene==='work'?'':`${snapshot.people.length}${state.scene==='racing'?'頭':'人'}`;
    q('#capture-count').textContent=count;q('#model-count').textContent=count;
    root.dataset.count=String(snapshot.people?.length||0);
  }

  function fitCanvas(canvas){
    const bounds=canvas.getBoundingClientRect(),w=Math.round(Math.max(1,bounds.width)*2),h=Math.round(Math.max(1,bounds.height)*2);
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
    return canvas.getContext('2d');
  }
  function paintVideo(canvas,source=video,cropWork=false){
    if(source===video&&video.readyState<2)return;
    const ctx=fitCanvas(canvas),w=canvas.width,h=canvas.height;
    const sw=source.videoWidth||source.width,sh=cropWork?sw*608/1080:(source.videoHeight||source.height);
    if(!sw||!sh)return;
    const s=Math.max(w/sw,h/sh),cw=w/s,ch=h/s;
    ctx.clearRect(0,0,w,h);
    ctx.drawImage(source,(sw-cw)/2,Math.max(0,(sh-ch)/2),cw,ch,0,0,w,h);
  }
  function workPreviews(t){
    if(video.readyState<2)return;
    recordTimes.forEach((target,i)=>{
      const delta=Math.abs(t-target);
      if(delta<recordDistance[i]){
        const c=recordFrames[i]||(recordFrames[i]=document.createElement('canvas'));c.width=320;c.height=180;
        c.getContext('2d').drawImage(video,0,0,video.videoWidth,video.videoWidth*608/1080,0,0,320,180);recordDistance[i]=delta;
      }
    });
    qa('.work-record canvas').forEach((c,i)=>{if(recordFrames[i])paintVideo(c,recordFrames[i]);});
    qa('.work-search canvas').forEach((c,i)=>{if(recordFrames[i])paintVideo(c,recordFrames[i]);});
    const selected=recordTimes.reduce((best,v,i)=>Math.abs(t-v)<Math.abs(t-recordTimes[best])?i:best,0);
    qa('.work-search button').forEach((b,i)=>b.classList.toggle('is-selected',i===selected));
  }
  function paint(){
    const c=PB5_DATA[state.scene],model=PB5Aligned[state.scene],t=state.ready?clamp(presentedTime??video.currentTime,c.start,c.end):c.start;state.time=t;
    root.dataset.time=t.toFixed(3);
    showProgress(t);
    if(state.scene==='football'||state.scene==='racing'){
      model.render(main,t);model.render(one,t,{mini:true,flat:true});model.render(two,t,{mini:true,analysis:true});
      if(state.ready)paintVideo(q('#apply-source'));
    }else if(state.scene==='spaces'){
      model.render(main,t);model.render(one,t,{mini:true,mode:'hvac'});model.render(two,t,{mini:true,mode:'layout'});
    }else if(state.scene==='retail'){
      model.render(main,t);model.render(one,t,{mini:true,mode:'layout'});model.render(two,t,{mini:true,mode:'staff'});
    }else{model.render(main,t);if(state.ready)workPreviews(t);}
    paintCorrespondence(model.at(t));
  }
  function showTransport(){
    const paused=video.paused||!state.ready;
    play.dataset.paused=String(paused);play.disabled=!state.ready||state.error;
    play.setAttribute('aria-label',paused?'映像と図を再生':'映像と図を一時停止');
    root.dataset.playing=String(!paused);
  }
  function showLoading(show,error=false){
    q('.media-message').hidden=!show;q('.retry').hidden=!error;q('.loading-dot').hidden=error;
    q('.message-text').textContent=error?'映像を読み込めませんでした':'映像を読み込み中';
  }
  async function playVideo(){
    if(!state.ready||state.error||!state.wanted||document.hidden)return;
    const token=generation;
    try{await video.play();}catch(error){if(error.name!=='AbortError'&&token===generation)state.wanted=false;}
    if(token===generation)showTransport();
  }
  function switchScene(id,force=false){
    if(!PB5_DATA[id]||(!force&&id===state.scene))return;
    generation++;
    if(frameRequest!==null){video.cancelVideoFrameCallback(frameRequest);frameRequest=null;}
    video.pause();presentedTime=null;state.scene=id;state.ready=false;state.error=false;lastTime=-1;lastProgressSecond=-1;
    const c=PB5_DATA[id];root.dataset.scene=id;
    sceneTabs.forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.scene===id));b.style.setProperty('--scene-progress','0');});
    activeTab=sceneTabs.find(b=>b.dataset.scene===id);
    progress.setAttribute('aria-label',c.label+'の再生時間');
    q('.scene-content').setAttribute('aria-label',c.label+'の映像と中間表現');video.setAttribute('aria-label',c.label+'の実写映像');
    main.setAttribute('aria-label',c.label+'の動きと連動する模式図');
    c.apps.forEach(([title,copy],i)=>{q(i?'#apply-two-title':'#apply-one-title').textContent=title;q(i?'#apply-two-copy':'#apply-one-copy').textContent=copy;q(i?'#application-two-visual':'#application-one-visual').setAttribute('aria-label',title+'：'+copy);});
    const isVideo=id==='football'||id==='racing',isWork=id==='work';
    q('#application-one-visual').classList.toggle('has-video',isVideo);q('#apply-source').hidden=!isVideo;one.toggleAttribute('hidden',isWork);two.toggleAttribute('hidden',isWork);
    q('.work-record').hidden=!isWork;q('.work-search').hidden=!isWork;
    q('#application-two-visual').setAttribute('role',isWork?'group':'img');
    q('#case-link').href=siteOrigin+(c.case?'/wp_page_kUVmdDuz/'+c.case:'/mX5DfXca/teL1sPH3');
    q('#case-link').firstChild.textContent=c.case?'事例を見る ':'共創事例を見る ';
    q('#scene-note').textContent=c.note;q('#source-credit').textContent='映像：'+c.credit;q('#source-credit').href=c.source;
    q('#scene-announcement').textContent=c.label+'を表示しました';
    history.replaceState(null,'','#'+id);
    showLoading(true);showTransport();paint();
    video.muted=true;video.src=c.src;video.load();requestFrame();
  }
  function onReady(){
    const c=PB5_DATA[state.scene];
    if(video.readyState<2||video.seeking||video.currentTime<c.start-.05)return;
    state.ready=true;state.error=false;showLoading(false);showTransport();paint();if(state.wanted)playVideo();
  }
  video.addEventListener('loadedmetadata',()=>{const c=PB5_DATA[state.scene];video.currentTime=c.start;});
  video.addEventListener('canplay',onReady);video.addEventListener('seeked',onReady);
  video.addEventListener('playing',showTransport);video.addEventListener('pause',showTransport);
  video.addEventListener('error',()=>{state.error=true;state.ready=false;showLoading(true,true);showTransport();});
  video.addEventListener('ended',()=>{if(video.ended)advanceScene();});
  sceneTabs.forEach(b=>b.addEventListener('click',()=>switchScene(b.dataset.scene)));
  play.addEventListener('click',()=>{if(video.paused){state.wanted=true;playVideo();}else{state.wanted=false;video.pause();}showTransport();});
  q('.retry').addEventListener('click',()=>switchScene(state.scene,true));
  qa('.work-search button').forEach((b,i)=>b.addEventListener('click',()=>{if(state.scene==='work'&&state.ready){state.wanted=true;video.currentTime=recordTimes[i];}}));
  document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();else if(state.wanted)playVideo();});
  window.addEventListener('hashchange',()=>{if(PB5_DATA[location.hash.slice(1)])switchScene(location.hash.slice(1));});
  const observer=new ResizeObserver(()=>paint());[main,one,two,q('#application-one-visual'),q('#application-two-visual')].forEach(el=>observer.observe(el));
  function framePresented(now,metadata){
    requestFrame();
    presentedTime=metadata.mediaTime;
    root.dataset.frameTime=presentedTime.toFixed(5);
    if(state.ready&&!document.hidden){
      paint();
      const c=PB5_DATA[state.scene];
      const fps={football:25,racing:25,spaces:10,retail:7,work:30}[state.scene];
      const lastFrame=Math.floor((c.end+1e-6)*fps)/fps;
      if(!video.paused&&!video.seeking&&presentedTime>=lastFrame-1e-5)advanceScene();
    }
  }
  function animate(now){
    if(root.isConnected&&now-lastTick>=40&&!document.hidden){
      lastTick=now;const c=PB5_DATA[state.scene];
      if(state.ready&&!video.seeking){
        if(!video.paused&&video.currentTime>=c.end-.02)advanceScene();
        else if(Math.abs(video.currentTime-lastTime)>.006){lastTime=video.currentTime;paint();}
      }
    }
    requestAnimationFrame(animate);
  }
  switchScene(state.scene,true);
  if(!hasFrameClock)requestAnimationFrame(animate);
})();
