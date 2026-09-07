/* Fixed axonometric views. Geometry and motion are schematic demo data. */
const PB5Spatial = (() => {
  const n = v => Math.round(v * 100) / 100;
  function scene(svg, {width, depth, height=2, mini=false, flat=false, yaw=28, elevation=46, palette={}}) {
    const b=svg.getBoundingClientRect(),w=Math.max(1,b.width),h=Math.max(1,b.height);
    const c={line:'#d5d7d3',top:'#fafbf9',front:'#e6e8e3',side:'#d5d9d2',red:'#ff3110',muted:'#858b84',...palette};
    const a=yaw*Math.PI/180,e=elevation*Math.PI/180;
    const raw=([x,y,z=0])=>flat?[x,y,0]:[x*Math.cos(a)-y*Math.sin(a),(x*Math.sin(a)+y*Math.cos(a))*Math.sin(e)-z*Math.cos(e),x*Math.sin(a)+y*Math.cos(a)];
    const corners=[[0,0],[width,0],[width,depth],[0,depth]],extent=corners.flatMap(([x,y])=>[[x,y,-.4],[x,y,height]]).map(raw);
    const minX=Math.min(...extent.map(p=>p[0])),maxX=Math.max(...extent.map(p=>p[0]));
    const minY=Math.min(...extent.map(p=>p[1])),maxY=Math.max(...extent.map(p=>p[1]));
    const pad=flat?3:mini?5:13,scale=Math.min((w-2*pad)/(maxX-minX),(h-2*pad)/(maxY-minY));
    const ox=(w-(maxX-minX)*scale)/2-minX*scale,oy=(h-(maxY-minY)*scale)/2-minY*scale;
    const P=p=>{const v=raw(p);return [ox+v[0]*scale,oy+v[1]*scale];};
    const poly=(points,fill='none',attrs='')=>`<polygon points="${points.map(P).map(p=>p.map(n).join(',')).join(' ')}" fill="${fill}" ${attrs}/>`;
    const line=(points,color=c.line,attrs='')=>`<path d="${points.map(P).map((p,i)=>(i?'L':'M')+p.map(n).join(',')).join(' ')}" fill="none" stroke="${color}" stroke-width="${mini?.65:.85}" stroke-linejoin="round" stroke-linecap="round" ${attrs}/>`;
    const rectangle=(x,y,dx,dy,z=0)=>[[x,y,z],[x+dx,y,z],[x+dx,y+dy,z],[x,y+dy,z]];
    const ring=(x,y,r,z=0)=>Array.from({length:40},(_,i)=>[x+Math.cos(i*Math.PI/20)*r,y+Math.sin(i*Math.PI/20)*r,z]);
    const id='depth-'+svg.id;
    let s=`<defs><filter id="${id}-shadow" x="-30%" y="-50%" width="170%" height="220%"><feGaussianBlur stdDeviation="${mini?1:2.7}"/></filter><radialGradient id="${id}-red" cx="32%" cy="23%" r="82%"><stop offset="0" stop-color="#ff6b4b"/><stop offset=".5" stop-color="#ff3110"/><stop offset="1" stop-color="#ca280d"/></radialGradient><radialGradient id="${id}-white" cx="30%" cy="24%" r="80%"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#e0e4df"/><stop offset="1" stop-color="#9ba39b"/></radialGradient></defs>`;
    const edge=`stroke="${c.line}" stroke-width="${mini?.5:.65}" stroke-linejoin="round"`;
    function solid(x,y,dx,dy,z,{base=0,top=c.top,front=c.front,side=c.side}={}) {
      if(flat)return poly(rectangle(x,y,dx,dy),top,edge);
      return poly([[x,y+dy,base],[x+dx,y+dy,base],[x+dx,y+dy,z],[x,y+dy,z]],front,edge)+poly([[x+dx,y,base],[x+dx,y+dy,base],[x+dx,y+dy,z],[x+dx,y,z]],side,edge)+poly(rectangle(x,y,dx,dy,z),top,edge);
    }
    function floor(thickness=.2) {
      if(!flat)s+=poly(rectangle(.2,.3,width,depth,-thickness-.05),'#62685f',`opacity=".13" filter="url(#${id}-shadow)"`);
      s+=solid(0,0,width,depth,0,{base:-thickness,top:'#f8faf6',front:'#e4e7e0',side:'#cdd3c9'});
    }
    function shadow(x,y,r) {
      return poly(ring(x+r*.55,y+r*.85,r), '#61685e','opacity=".12"');
    }
    function marker(x,y,{red=true,r=.18,z=.9,person=false}={}) {
      const ground=P([x,y,0]),top=P([x,y,z]);
      if(flat)return `<circle cx="${n(ground[0])}" cy="${n(ground[1])}" r="${Math.max(1.5,r*scale)}" fill="${red?c.red:c.muted}"/>`;
      const radius=Math.max(mini?1.3:2.1,r*scale),fill=`url(#${id}-${red?'red':'white'})`;
      let out=shadow(x,y,r*1.5);
      if(person){
        const foot=P([x,y,.15]),shoulder=P([x,y,z*.64]),head=P([x,y,z*.92]);
        out+=`<path d="M${n(foot[0])},${n(foot[1])} L${n(shoulder[0])},${n(shoulder[1])}" stroke="${red?'#dd3013':'#8d978b'}" stroke-width="${n(radius*1.75)}" stroke-linecap="round"/>`;
        out+=`<path d="M${n(foot[0]-radius*.24)},${n(foot[1]-.6)} L${n(shoulder[0]-radius*.24)},${n(shoulder[1])}" stroke="${red?'#ff6445':'#d3d9d0'}" stroke-width="${n(radius*.65)}" stroke-linecap="round"/>`;
        out+=`<circle cx="${n(head[0])}" cy="${n(head[1])}" r="${n(radius)}" fill="${fill}"/>`;
      }else{
        out+=`<path d="M${n(ground[0])},${n(ground[1])} L${n(top[0])},${n(top[1])}" stroke="${red?'#d83115':'#a7afa3'}" stroke-width="${n(radius*1.6)}" stroke-linecap="round"/>`;
        out+=`<circle cx="${n(top[0])}" cy="${n(top[1])}" r="${n(radius)}" fill="${fill}"/>`;
      }
      return out;
    }
    function finish(content='') {svg.setAttribute('viewBox',`0 0 ${n(w)} ${n(h)}`);svg.innerHTML=s+content;}
    return {c,P,raw,poly,line,rectangle,ring,solid,marker,shadow,floor,finish,add:markup=>s+=markup,scale,flat};
  }
  function pitch(svg,current,trail,{mini=false,analysis=false,flat=false}={}) {
    const g=scene(svg,{width:105,depth:68,height:4,mini,flat,yaw:22,elevation:49});g.floor(.85);
    const R=(x,y,w,h)=>g.line([...g.rectangle(x,y,w,h,.02),[x,y,.02]]);
    g.add(R(2,2,101,64)+g.line([[52.5,2,.03],[52.5,66,.03]]));
    g.add(g.line([...g.ring(52.5,34,9.15,.03),g.ring(52.5,34,9.15,.03)[0]]));
    for(const side of [false,true]){
      g.add(R(side?86.5:2,13.85,16.5,40.3)+R(side?97.5:2,24.85,5.5,18.3));
      if(!flat&&!mini){const x=side?103:2,back=side?105:0;g.add(g.line([[x,30.34,0],[x,30.34,2.44],[x,37.66,2.44],[x,37.66,0]])+g.line([[back,30.34,0],[x,30.34,2.44],[back,30.34,2.44],[back,37.66,2.44],[x,37.66,2.44]])+g.line([[back,30.34,2.44],[back,30.34,0],[back,37.66,0],[back,37.66,2.44]],'#dce0d7'));}
    }
    if(analysis){const p=current.people[0];g.add(g.poly(g.ring(p.x*1.05,p.y*.68,8,.04),'#ff3110','opacity=".055"'));}
    current.people.forEach(p=>g.add(g.line(trail[p.id].map(v=>[v.x*1.05,v.y*.68,.06]),p.red?'#ff3110':'#858b84',`opacity="${analysis?.52:.28}"`)));
    current.people.slice().sort((a,b)=>g.raw([a.x*1.05,a.y*.68])[2]-g.raw([b.x*1.05,b.y*.68])[2]).forEach(p=>g.add(g.marker(p.x*1.05,p.y*.68,{red:p.red,r:1.4,z:2.1})));
    const [bx,by]=g.P([current.ball.x*1.05,current.ball.y*.68,.6]);g.add(`<circle cx="${n(bx)}" cy="${n(by)}" r="${mini?1.5:2.2}" fill="#262e26"/>`);g.finish();
  }
  function racing(svg,current,trail,{mini=false,analysis=false,flat=false}={}) {
    const g=scene(svg,{width:24,depth:10,height:1.3,mini,flat,yaw:18,elevation:48});g.floor(.24);
    for(const y of [.55,9.45]){
      g.add(g.line([[.2,y,.02],[23.8,y,.02]]));
      if(!flat){g.add(g.line([[.3,y,.65],[23.7,y,.65]],'#c7cec1'));for(let x=1;x<24;x+=3)g.add(g.line([[x,y,0],[x,y,.65]],'#d7dcd2'));}
    }
    current.people.forEach(p=>g.add(g.line(trail[p.id].map(v=>[v.x*24,v.y*10,.03]),p.red?'#ff3110':'#8c9588',`opacity="${analysis?.55:.28}"`)));
    current.people.slice().sort((a,b)=>g.raw([a.x*24,a.y*10])[2]-g.raw([b.x*24,b.y*10])[2]).forEach(p=>g.add(g.marker(p.x*24,p.y*10,{red:p.red,r:.23,z:.38})));
    g.finish();
  }
  function retail(svg,current,trail,{mini=false,mode='tracking'}={}) {
    const g=scene(svg,{width:16,depth:10,height:2.1,mini,yaw:28,elevation:48});g.floor(.22);
    if(!mini)for(let x=2;x<16;x+=2)g.add(g.line([[x,.1,.01],[x,9.9,.01]],'#e6eae2','opacity=".65"'));
    const furniture=[[.08,.07,.84,.12,1.65],[.16,.3,.12,.36,.85],[.44,.29,.14,.44,.85],[.78,.27,.13,.48,.85]];
    if(mode==='layout'){
      g.add(g.poly(g.rectangle(.60*16,.30*10,.12*16,.32*10,.025),'#ff3110','opacity=".07"'));
      g.add(g.line([[.47*16,.47*10,.91],[.59*16,.47*10,.91]],'#ff3110')+g.line([[.55*16,.43*10,.91],[.59*16,.47*10,.91],[.55*16,.51*10,.91]],'#ff3110'));
    }
    if(mode==='staff'){
      const p=current.people[0];g.add(g.poly(g.ring(.73*16,p.y*10,.82,.03),'#ff3110','opacity=".07"'));
    }
    current.people.forEach(p=>g.add(g.line(trail[p.id].map(v=>[v.x*16,v.y*10,.035]),p.red?'#ff3110':'#8b9484','opacity=".42"')));
    furniture.forEach(([x,y,w,h])=>g.add(g.poly(g.rectangle(x*16+.14,y*10+.17,w*16,h*10,.02),'#68735e','opacity=".07"')));
    const objects=furniture.map(([x,y,w,h,z],i)=>{
      let markup=g.solid(x*16,y*10,w*16,h*10,z);
      if(i===0&&!mini){for(let k=1;k<8;k++)markup+=g.line([[(x+w*k/8)*16,(y+h)*10,.05],[(x+w*k/8)*16,(y+h)*10,z]],'#cdd4c7');}
      else if(i>0){markup+=g.poly(g.rectangle((x+.015)*16,(y+h*.68)*10,(w-.03)*16,h*.11*10,z+.012),'#e2e7dd');if(!mini)markup+=g.solid((x+w*.72)*16,(y+h*.85)*10,.26,.24,z+.26,{base:z,top:'#e6ebe2',front:'#c8d0c2',side:'#bbc5b5'});}
      return {depth:g.raw([(x+w/2)*16,(y+h/2)*10])[2],markup};
    });
    current.people.forEach(p=>objects.push({depth:g.raw([p.x*16,p.y*10])[2],markup:g.marker(p.x*16,p.y*10,{red:p.red,r:.17,z:1.46,person:true})}));
    if(mode==='staff'){const p=current.people[0];objects.push({depth:g.raw([.73*16,p.y*10])[2],markup:g.marker(.73*16,p.y*10,{red:true,r:.15,z:1.38,person:true})});}
    objects.sort((a,b)=>a.depth-b.depth).forEach(o=>g.add(o.markup));g.finish();
  }
  return {scene,pitch,racing,retail};
})();
