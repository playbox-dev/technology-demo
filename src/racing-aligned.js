/* Fourteen anonymous manually matched runners from the HKJC replay.
 * Source footage 20.972886–26.565686 s. See work/alignment/racing for the
 * frame annotations, registration measurements, stride frames and proof images.
 * Ground scale/depth and articulated horse shapes are schematic, not race data.
 * Playback belongs entirely to the host. No timers or event listeners.
 */
PB5Aligned.racing = (() => {
  'use strict';
  const start = 20.972886, end = 26.565686;
  const samples = [{"frame":1,"dt":0,"rail":[373,0.034],"x":[1090,1074,930,805,748,623,552,442,416,430,268,306,337,165],"y":[432,414,423,422,415,409,398,406,394,383,399,392,386,403]},{"frame":4,"dt":0.6,"rail":[361,0.041],"x":[1098,1079,937,825,763,626,559,463,431,439,286,319,345,188],"y":[425,408,415,415,407,399,390,401,385,380,391,384,376,391]},{"frame":7,"dt":1.2,"rail":[357,0.043],"x":[1119,1093,950,843,773,638,553,476,433,443,283,306,338,183],"y":[433,414,420,420,412,401,392,402,387,379,391,383,376,390]},{"frame":10,"dt":1.8,"rail":[353,0.041],"x":[1122,1091,946,846,760,616,530,466,416,414,266,293,322,157],"y":[426,407,416,415,405,397,386,396,382,376,387,379,372,385]},{"frame":13,"dt":2.4,"rail":[355,0.038],"x":[1124,1091,941,852,755,610,515,472,407,390,263,281,306,141],"y":[428,407,413,415,405,397,387,397,382,377,387,381,374,384]},{"frame":16,"dt":3.0,"rail":[357,0.036],"x":[1121,1081,936,846,745,612,515,481,397,381,270,280,305,137],"y":[430,409,417,417,409,400,392,401,388,383,392,383,377,390]},{"frame":19,"dt":3.6,"rail":[360,0.034],"x":[1115,1076,929,844,744,611,505,480,401,382,286,276,299,150],"y":[428,409,418,419,412,404,397,407,394,389,396,385,380,396]},{"frame":22,"dt":4.2,"rail":[365,0.032],"x":[1113,1079,935,854,756,624,533,518,422,395,313,288,303,163],"y":[428,410,420,419,413,406,399,407,396,389,398,387,381,399]},{"frame":25,"dt":4.8,"rail":[371,0.03],"x":[1123,1089,947,870,771,644,555,548,445,415,344,317,329,192],"y":[431,412,422,422,416,410,403,409,403,396,405,394,388,403]},{"frame":28,"dt":5.4,"rail":[375,0.03],"x":[1132,1095,971,897,790,671,572,558,477,437,386,335,348,224],"y":[432,416,425,425,420,413,404,412,407,401,409,396,389,405]}];
  const cameraSteps = [134, 130, 136, 132, 134, 140, 142, 148, 142, 144, 148, 142, 138, 140, 136, 128, 126, 126, 124, 126, 120, 122, 118, 116, 112, 106, 106];
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const lerp=(a,b,u)=>a+(b-a)*u;
  const n=v=>Math.round(v*100)/100;
  const pan=[0];cameraSteps.forEach(v=>pan.push(pan[pan.length-1]+v));
  const sourceWidth=1280,sourceHeight=720,unitsPerPixel=1/32;
  function sample(t){
    const dt=clamp(Number(t)-start,0,end-start);
    let hi=samples.findIndex(s=>s.dt>=dt);if(hi<0)hi=samples.length-1;
    const b=samples[hi],a=samples[Math.max(0,hi-1)];
    const u=clamp(b.dt===a.dt?0:(dt-a.dt)/(b.dt-a.dt),0,1);
    return {dt,a,b,u};
  }
  function camera(t){
    const dt=clamp(Number(t)-start,0,end-start),index=Math.min(pan.length-2,Math.floor(dt/.2));
    // Last registered shift is continued over the final 0.1928-second fragment.
    return lerp(pan[index],pan[index+1],(dt-index*.2)/.2)*unitsPerPixel;
  }
  function at(t){
    const {dt,a,b,u}=sample(t),cameraX=camera(t);
    const rail0=lerp(a.rail[0],b.rail[0],u),railSlope=lerp(a.rail[1],b.rail[1],u);
    const people=a.x.map((_,i)=>{
      const sx=lerp(a.x[i],b.x[i],u),sy=lerp(a.y[i],b.y[i],u);
      // Poles cross the pack at ~2.2–3.8 seconds. The track is retained through
      // full occlusion; a hidden source anchor must not be presented as visible.
      const poleSamples=[[2.2,1084],[2.4,942],[2.6,805],[2.8,663],[3,529],[3.2,399],[3.4,279],[3.6,158],[3.8,40]];
      let poleX=null;
      if(dt>=2.2&&dt<=3.8){
        const hi=Math.min(poleSamples.length-1,Math.floor((dt-2.2)/.2)+1);
        const pa=poleSamples[Math.max(0,hi-1)],pb=poleSamples[hi];
        poleX=lerp(pa[1],pb[1],clamp((dt-pa[0])/(pb[0]-pa[0]),0,1));
      }
      const visible=poleX===null||Math.abs(sx-poleX)>30;
      return {id:'H'+String(i+1).padStart(2,'0'),kind:'horse',red:i===0,visible,
        x:3+sx*unitsPerPixel+cameraX,
        y:clamp(1.2+(sy-rail0-railSlope*sx)/8,1.05,6.8),
        source:[sx/sourceWidth,sy/sourceHeight]};
    });
    return {people,cameraX};
  }
  // The first horse's forward leg extension is visible at native frames
  // 10,22,34: ~0.36,0.84,1.32 seconds. Other runners' phase offsets are
  // approximate visual matches; these are articulated illustrations, not poses.
  const phaseOffsets=[0,.12,.27,.04,.20,.34,.16,.30,.39,.08,.24,.36,.18,.42];
  function pose(phase,front){
    const keys=front?
      [[1.92,.10,1.23,.72],[.50,.02,.89,.45],[-.05,.61,.45,.87],[1.60,.57,1.02,1.12],[1.92,.10,1.23,.72]]:
      [[-1.86,.14,-1.21,.61],[-.28,.53,-.79,.79],[.34,.13,-.12,.55],[-.68,.02,-.71,.42],[-1.86,.14,-1.21,.61]];
    const f=((phase%1)+1)%1*4,i=Math.floor(f),u=f-i;
    return keys[i].map((v,k)=>lerp(v,keys[i+1][k],u));
  }
  function horse(g,p,t,{mini=false,flat=false}={}){
    const index=Number(p.id.slice(1))-1;
    const phase=(Number(t)-start-.36+phaseOffsets[index])/.48;
    const bounce=flat?0:.065*(1+Math.cos(phase*Math.PI*2));
    const y=p.y,x=p.x-camera(t);
    const light=p.red?'#ff674b':'#fafcf8';
    const face=p.red?'#f04427':'#e5e9df';
    const dark=p.red?'#c7341d':'#9da795';
    const edge=p.red?'#ca351d':'#a9b29f';
    const project=(xx,yy,zz)=>[x+xx,y+yy,zz+bounce];
    const projected=points=>points.map(g.P);
    const stroke=(points,color,width,extra='')=>`<path d="${projected(points).map((v,i)=>(i?'L':'M')+v.map(n).join(',')).join(' ')}" fill="none" stroke="${color}" stroke-width="${n(width)}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
    const silhouette=[[-1.15,1.16],[-1.12,1.56],[-.86,1.79],[-.18,1.86],[.53,1.75],[.79,1.50],[.71,1.18],[.25,1.06],[-.62,1.07]];
    const extrude=(outline,halfDepth,topShade=light,sideShade=face)=>{
      const far=outline.map(([xx,z])=>project(xx,-halfDepth,z));
      const near=outline.map(([xx,z])=>project(xx,halfDepth,z));
      let s=g.poly(far,sideShade);
      for(let i=0;i<outline.length;i++){
        const j=(i+1)%outline.length;
        s+=g.poly([far[i],far[j],near[j],near[i]],outline[i][1]>=1.5?topShade:sideShade);
      }
      return s+g.poly(near,sideShade,`stroke="${edge}" stroke-width="${mini?.3:.45}" stroke-linejoin="round"`);
    };
    const shadow=Array.from({length:28},(_,i)=>{
      const a=i*Math.PI/14;return [x+Math.cos(a)*1.48,y+Math.sin(a)*.46,.018];
    });
    let s=g.poly(shadow,p.red?'#9a412e':'#66745b','opacity=".09"');
    const leg=(front,near)=>{
      const local=phase+(near?0:.095)+(front?0:.10);
      const [footX,footZ,kneeX,kneeZ]=pose(local,front);
      const yy=near?.26:-.26,hipX=front?.60:-.84;
      const points=[project(hipX,yy,1.30),project(kneeX,yy,kneeZ),project(footX,yy,footZ)];
      let out=stroke(points,near?face:dark,Math.max(mini?.8:1.2,g.scale*.125));
      out+=stroke([project(footX-.08,yy,footZ),project(footX+.10,yy,footZ)],dark,Math.max(.7,g.scale*.12));
      return out;
    };
    s+=leg(false,false)+leg(true,false);
    s+=stroke([project(-1.0,0,1.63),project(-1.48,.03,1.39),project(-1.85,.05,1.40+Math.sin(phase*Math.PI*2)*.12)],dark,Math.max(1,g.scale*.11));
    s+=extrude(silhouette,.31);
    s+=extrude([[.51,1.66],[.86,2.11],[1.10,2.54],[1.39,2.49],[1.58,2.12],[1.91,2.03],[1.94,1.85],[1.69,1.82],[1.31,2.02],[.97,1.31]],.17);
    s+=extrude([[1.16,2.49],[1.19,2.76],[1.31,2.53],[1.38,2.66],[1.44,2.46]],.09,light,face);
    s+=leg(false,true)+leg(true,true);
    // Crouched rider and saddle are kept deliberately simple at thumbnail size.
    s+=stroke([project(-.25,.33,1.84),project(.10,.40,1.39),project(-.26,.38,1.22)],dark,Math.max(.9,g.scale*.13));
    s+=stroke([project(-.25,0,1.96),project(.20,0,2.33),project(.57,0,2.20)],face,Math.max(1.3,g.scale*.26));
    s+=stroke([project(.18,.13,2.26),project(.60,.18,2.02),project(.93,.17,2.10)],dark,Math.max(.6,g.scale*.085));
    const head=g.P(project(.48,0,2.53));
    s+=`<circle cx="${n(head[0])}" cy="${n(head[1])}" r="${n(Math.max(mini?.85:1.25,g.scale*.185))}" fill="${light}" stroke="${edge}" stroke-width=".4"/>`;
    return `<g data-horse-id="${p.id}" opacity="${p.visible?1:.48}">${s}</g>`;
  }
  function render(svg,t,{mini=false,flat=false,analysis=false}={}){
    const current=at(t),offset=current.cameraX;
    const g=PB5Spatial.scene(svg,{width:44,depth:8.4,height:3.4,mini,flat,yaw:11,elevation:39});
    g.floor(.20);
    // The camera follows its measured pan, while fixed course features visibly
    // travel backwards. Thus no horse is used as an arbitrary stationary anchor.
    const spacing=3.12,first=Math.floor(offset/spacing)-1;
    for(let k=first;k<first+18;k++){
      const xx=k*spacing-offset;
      if(xx<.2||xx>43.8)continue;
      g.add(g.line([[xx,.65,.03],[xx,7.85,.03]],'#e4e9df','opacity=".38"'));
    }
    const rail=(yy,front)=>{
      let s=g.line([[.15,yy,.025],[43.85,yy,.025]],'#c9d1c1');
      if(flat)return s;
      s+=g.line([[.15,yy,.78],[43.85,yy,.78]],front?'#cdd5c5':'#d6ddcf');
      for(let k=first;k<first+18;k++){
        const xx=k*spacing-offset;
        if(xx>.2&&xx<43.8)s+=g.line([[xx,yy,0],[xx,yy,.78]],'#cdd5c5');
      }
      return s;
    };
    g.add(rail(.55,false));
    if(analysis){
      current.people.forEach(p=>{
        const a=at(Math.max(start,Number(t)-.12)).people.find(v=>v.id===p.id);
        if(a)g.add(g.line([[a.x-offset,a.y,.04],[p.x-offset,p.y,.04]],p.red?'#ff3110':'#9ba68e','opacity=".38"'));
      });
    }
    current.people.slice().sort((a,b)=>g.raw([a.x-offset,a.y])[2]-g.raw([b.x-offset,b.y])[2]).forEach(p=>g.add(horse(g,p,t,{mini,flat})));
    g.add(rail(7.85,true));
    g.finish();
  }
  return {start,end,at,render,
    note:'実映像の14頭を手動で対応付け。遮蔽区間は補間。背景の移動を補正した概念座標と、映像で確認した約0.48秒の周期による走行表現です。実測の速度・距離・骨格推定ではありません。'};
})();
