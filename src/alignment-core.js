/* Manual frame annotations share one video clock and one ground transform. */
const PB5Aligned = {};
const PB5AlignmentCore = (() => {
  const lerp=(a,b,u)=>a+(b-a)*u;
  function sampleTracks(tracks,t) {
    return tracks.flatMap(track=>{
      const frames=track.frames;
      if(!frames?.length||t<frames[0].t-.001||t>frames[frames.length-1].t+.001)return [];
      let hi=frames.findIndex(f=>f.t>=t);if(hi<0)hi=frames.length-1;
      const a=frames[Math.max(0,hi-1)],b=frames[hi],u=b.t===a.t?0:(t-a.t)/(b.t-a.t);
      const visible=(u<.5?a.visible:b.visible)!==false;
      if(!visible)return [];
      const ground=a.ground&&b.ground?a.ground.map((v,i)=>lerp(v,b.ground[i],u)):null;
      const source=a.source&&b.source?a.source.map((v,i)=>lerp(v,b.source[i],u)):null;
      return [{id:track.id,red:track.red!==false,kind:track.kind||'person',...track.meta,
        x:ground?.[0],y:ground?.[1],source,visible}];
    });
  }
  function solveHomography(from,to) {
    const rows=[],values=[];
    from.forEach(([x,y],i)=>{const [u,v]=to[i];rows.push([x,y,1,0,0,0,-u*x,-u*y],[0,0,0,x,y,1,-v*x,-v*y]);values.push(u,v);});
    const a=Array.from({length:8},(_,i)=>Array.from({length:9},(_,j)=>j===8?rows.reduce((s,row,k)=>s+row[i]*values[k],0):rows.reduce((s,row)=>s+row[i]*row[j],0)));
    for(let i=0;i<8;i++){
      let pivot=i;for(let j=i+1;j<8;j++)if(Math.abs(a[j][i])>Math.abs(a[pivot][i]))pivot=j;
      [a[i],a[pivot]]=[a[pivot],a[i]];
      const d=a[i][i];if(Math.abs(d)<1e-12)throw new Error('Ground reference points are degenerate');
      for(let k=i;k<9;k++)a[i][k]/=d;
      for(let j=0;j<8;j++)if(j!==i){const v=a[j][i];for(let k=i;k<9;k++)a[j][k]-=v*a[i][k];}
    }
    return a.map(row=>row[8]).concat(1);
  }
  function mapHomography(h,[x,y]) {const d=h[6]*x+h[7]*y+h[8];return [(h[0]*x+h[1]*y+h[2])/d,(h[3]*x+h[4]*y+h[5])/d];}
  return {sampleTracks,solveHomography,mapHomography};
})();
