/* Every visible person and the checkout footprints are annotated in source pixels.
   Depth is a shared camera-ground approximation, not a surveyed store plan. */
(() => {
  const times=[0,1,2,3,4,5,6.047639];
  // Visibility boundaries were checked against all native 7 fps frames.
  // Five moving tracks were rechecked at every third native frame (0.429 s).
  // Samples inside full occlusion only carry continuity; hidden windows suppress them.
  // R08 feet are cropped/occluded early; later anchors follow the visible shoes.
  const annotations=[
    {id:'R01',red:true,frames:[0,3,6,9,12,15,18,21,24,27,30,33,36,39,42],points:[[793,302],[790,310],[784,315],[819,342],[837,356],[844,356],[843,355],[824,351],[800,328],[790,309],[785,302],[782,296],[783,286],[778,285],[778,279]]},
    {id:'R02',red:false,points:[[883,491],[883,491],[885,492],[886,493],[887,493],[888,493],[888,492]]},
    {id:'R03',red:false,frames:[0,3,6,9,12,15,18,21,24,27,30,33,36,39,42],points:[[488,307],[490,305],[487,305],[443,329],[410,348],[391,366],[378,378],[381,374],[399,366],[433,350],[478,324],[487,310],[479,315],[447,335],[413,349]]},
    {id:'R04',red:false,frames:[0,3,6,9,12,15,18,21,24,27,30,33,36,39,42],points:[[754,188],[729,190],[695,169],[657,153],[609,153],[570,150],[535,155],[511,152],[487,153],[463,154],[438,148],[433,144],[432,142],[430,140],[425,136]],hidden:[[9/7,12/7]]},
    {id:'R05',red:false,frames:[0,3,6,9,12,15,18,21,24,27,30,33,36,39,42],points:[[857,192],[817,210],[734,215],[694,192],[633,174],[554,171],[481,192],[449,194],[389,191],[350,184],[313,175],[282,169],[229,171],[200,174],[186,158]],hidden:[[11/7,13/7],[26/7,31/7]]},
    {id:'R06',red:false,points:[[1083,238],[1140,245],[1207,254],[1250,260],[1280,260],[1300,260],[1320,260]],hidden:[[10/7,7]]},
    {id:'R07',red:false,points:[[1113,444],[1108,444],[1102,443],[1076,443],[1079,443],[1092,443],[1097,443]]},
    {id:'R08',red:false,frames:[0,3,6,9,12,15,18,21,24,27,30,33,36,39,42],points:[[1289,702],[1293,719],[1291,736],[1286,742],[1284,740],[1258,723],[1190,699],[1165,675],[1110,658],[1035,628],[1039,626],[1034,626],[1039,628],[1040,628],[1043,627]]}
  ];
  // Inverse perspective with a fixed vanishing horizon. All people, carts and
  // footprint vertices use exactly this transform; no object-specific nudges.
  const ground=([x,y])=>[(12*x+12*y+120)/(y+650)-3,18*y/(y+650)];
  const lerp=(a,b,u)=>a+(b-a)*u;
  function at(t){
    // This CCTV is 7 fps. Keep annotations on the displayed source frame,
    // rather than sliding a foot point through a frozen video image.
    const frame=Math.min(42,Math.max(0,Math.floor(Number(t)*7+1e-7)));
    const sourceTime=frame/7;
    const people=annotations.map(track=>{
      const knots=track.frames||times;
      const cursor=track.frames?frame:sourceTime;
      let i=knots.findIndex(v=>v>=cursor);if(i<0)i=knots.length-1;
      const a=Math.max(0,i-1),u=knots[i]===knots[a]?0:Math.max(0,Math.min(1,(cursor-knots[a])/(knots[i]-knots[a])));
      const s=track.points[a].map((v,k)=>lerp(v,track.points[i][k],u)),p=ground(s);
      return {id:track.id,red:track.red,x:p[0],y:p[1],source:[s[0]/1280,s[1]/720],visible:!track.hidden?.some(([lo,hi])=>sourceTime>=lo&&sourceTime<hi)};
    }).filter(p=>p.visible);
    return {people};
  }
  const banks=[
    {base:[[0,277],[44,278],[82,306],[70,358],[22,374],[0,354]],back:[[0,241],[105,204],[145,214],[84,281]],screen:[94,258]},
    {base:[[126,331],[245,329],[288,362],[283,425],[219,440],[147,417]],back:[[245,319],[345,313],[352,242],[303,232]],screen:[310,274]},
    {base:[[494,372],[671,365],[713,428],[705,517],[675,537],[517,537],[491,502]],back:[[602,327],[690,320],[700,232],[616,227]],screen:[649,280]},
    {base:[[1000,483],[1164,480],[1208,511],[1178,553],[1121,577],[1040,556]],back:[[857,308],[958,367],[1033,393],[1054,313],[940,256]],screen:[1010,365]}
  ];
  const shelves=[
    [[0,239],[70,216],[74,180],[0,202]],
    [[76,214],[251,157],[249,118],[80,177]],
    [[250,154],[488,83],[482,46],[252,115]],
    [[505,141],[605,144],[611,64],[505,61]],
    [[771,155],[894,156],[890,81],[775,81]],
    [[946,212],[1021,246],[1057,198],[977,167]],
    [[1021,247],[1142,306],[1186,260],[1058,198]],
    [[1143,307],[1280,388],[1280,309],[1187,260]]
  ];
  const carts=[
    [[371,405],[435,433],[500,322],[442,307]],
    [[848,546],[938,665],[1048,620],[995,500]],
    [[783,248],[839,298],[873,283],[844,239]],
    [[1030,732],[1163,748],[1230,611],[1140,594]]
  ];
  function render(svg,t,{mini=false,mode='tracking'}={}){
    const g=PB5Spatial.scene(svg,{width:18,depth:10.5,height:2.7,mini,yaw:14,elevation:54});
    const edge='stroke="#d3d7d0" stroke-width=".55" stroke-linejoin="round"';
    const floor= [[0,264],[508,80],[641,66],[748,145],[905,157],[1220,349],[1280,512],[1280,760],[0,760]].map(ground);
    const projected=(source,z=0)=>source.map(p=>[...ground(p),z]);
    function prism(base,height,{top='#f7f8f5',front='#e1e5dc',side='#d2d9cc',bottom=0}={}){
      const p=base.map(ground),out=[];
      p.forEach((a,i)=>{const b=p[(i+1)%p.length];out.push({d:g.raw([(a[0]+b[0])/2,(a[1]+b[1])/2])[2],v:g.poly([[...a,bottom],[...b,bottom],[...b,height],[...a,height]],i%2?front:side,edge)});});
      return out.sort((a,b)=>a.d-b.d).map(f=>f.v).join('')+g.poly(p.map(v=>[...v,height]),top,edge);
    }
    g.add(g.poly(floor.map(([x,y])=>[x+.06,y+.10,-.18]),'#888f81','opacity=".10"'));
    floor.forEach((a,i)=>{const b=floor[(i+1)%floor.length];g.add(g.poly([[...a,-.16],[...b,-.16],[...b,0],[...a,0]],i%2?'#e7eae3':'#d8ded2',edge));});
    g.add(g.poly(floor.map(p=>[...p,0]),'#fafbf8',edge));
    const objects=[];
    const put=(footprint,markup)=>{const p=footprint.map(ground),center=p.reduce((s,v)=>[s[0]+v[0]/p.length,s[1]+v[1]/p.length],[0,0]);objects.push({d:g.raw(center)[2],markup});};
    shelves.forEach((base,i)=>{
      let s=prism(base,i===3||i===4?1.75:2.05);
      if(!mini){const a=base[0],b=base[1];for(const z of [.48,.98,1.48])s+=g.line([[...ground(a),z],[...ground(b),z]],'#c9d0c2','opacity=".6"');}
      put(base,s);
    });
    banks.forEach(bank=>{
      put(bank.back,prism(bank.back,.92,{top:'#eef0e9'}));
      let s=prism(bank.base,.78,{top:'#f2f4ee'});
      if(!mini){const center=bank.base.reduce((a,p)=>[a[0]+p[0]/bank.base.length,a[1]+p[1]/bank.base.length],[0,0]);s+=g.poly(projected(bank.base.map(p=>[center[0]+(p[0]-center[0])*.83,center[1]+(p[1]-center[1])*.83]),.795),'#dce2d4','stroke="#d3d9cc" stroke-width=".4"');}
      put(bank.base,s);
      const [x,y]=ground(bank.screen);
      objects.push({d:g.raw([x,y])[2],markup:g.solid(x-.12,y-.08,.24,.16,1.37,{base:.92,front:'#cbd3c3',side:'#b9c4ae'})+g.poly(g.rectangle(x-.26,y-.10,.52,.13,1.42),'#d2daca',edge)});
    });
    const people=at(t).people;
    if(mode==='layout'){
      const p=people.find(p=>p.id==='R01');if(p)g.add(g.poly(g.ring(p.x,p.y,.66,.025),'#ff3110','opacity=".08"'));
    }
    if(mode==='staff'){
      const p=people.find(p=>p.id==='R07');if(p)g.add(g.poly(g.ring(p.x,p.y,.57,.025),'#ff3110','opacity=".08"'));
    }
    people.forEach(p=>{
      if(!mini){const trail=[];for(let j=8;j>=0;j--){const prev=at(Math.max(0,t-j*.10)).people.find(q=>q.id===p.id);if(prev)trail.push([prev.x,prev.y,.025]);}if(trail.length>1)g.add(g.line(trail,p.red?'#ff3110':'#7f8878','opacity=".3"'));}
      objects.push({d:g.raw([p.x,p.y])[2],markup:`<g data-person="${p.id}">${g.marker(p.x,p.y,{red:p.red||mode==='staff'&&p.id==='R07',r:.15,z:1.38,person:true})}</g>`});
    });
    carts.forEach(base=>{
      const p=projected(base,.66),bottom=projected(base,.13);let s=g.poly(p,'#f4f6f0','fill-opacity=".14" stroke="#a9b49d" stroke-width=".65"');
      p.forEach((a,i)=>{s+=g.line([a,bottom[i]],'#b2bca7');});
      for(const z of [.13,.35])s+=g.line([...projected(base,z),projected(base,z)[0]],'#bdc7b1','opacity=".65"');
      put(base,s);
    });
    objects.sort((a,b)=>a.d-b.d).forEach(o=>g.add(o.markup));g.finish();
  }
  PB5Aligned.retail={start:0,end:6.047639,at,render,ground,annotations,banks,shelves,
    note:'映像に見える全8人の連続トラックを手動で照合。陳列棚に完全に隠れる区間は表示を止め、再び見える時点で同じトラックを再開しています。レジ4列（左端を含む）・棚・カートと人物は共通の地面変換を使用。奥行きと遮蔽された足元は単眼映像からの近似です。'};
})();
