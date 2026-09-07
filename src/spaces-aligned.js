/* OpenCV vtest: all visible person track fragments in the selected 10 fps clip.
 * Source feet and ground outlines were manually reviewed on all 34 frames.
 * Ground rectification is approximate, not a calibrated survey or AI inference.
 * Analysis evidence: work/alignment/spaces/.
 */
PB5Aligned.spaces = (() => {
  const start = 20.2774, end = 23.4574;
  const sourceSize = [768, 576];
  const tracks = [{"id":"P01","interval":[20.2,22.2],"anchors":[{"t":20.2,"source":[0.11067708333333333,0.3663194444444444]},{"t":20.6,"source":[0.08463541666666667,0.3628472222222222]},{"t":21,"source":[0.053385416666666664,0.3524305555555556]},{"t":21.4,"source":[0.029947916666666668,0.3506944444444444]},{"t":21.8,"source":[0.0078125,0.34375]},{"t":22.1,"source":[-0.009114583333333334,0.3368055555555556]},{"t":22.2,"source":[-0.01953125,0.3368055555555556]}]},{"id":"P02","interval":[20.2,23.6],"anchors":[{"t":20.2,"source":[0.2890625,0.4513888888888889]},{"t":20.6,"source":[0.2591145833333333,0.4444444444444444]},{"t":21.0,"source":[0.22526041666666666,0.4375]},{"t":21.4,"source":[0.19010416666666666,0.4375]},{"t":21.8,"source":[0.16276041666666666,0.4305555555555556]},{"t":22.2,"source":[0.13151041666666666,0.4305555555555556]},{"t":22.6,"source":[0.10677083333333333,0.4253472222222222]},{"t":23.0,"source":[0.078125,0.4184027777777778]},{"t":23.4,"source":[0.07161458333333333,0.4184027777777778]},{"t":23.5,"source":[0.0703125,0.4184027777777778]}]},{"id":"P03","interval":[20.2,23.6],"anchors":[{"t":20.2,"source":[0.6380208333333334,0.3888888888888889]},{"t":20.6,"source":[0.609375,0.390625]},{"t":21.0,"source":[0.5794270833333334,0.3940972222222222]},{"t":21.4,"source":[0.5390625,0.40625]},{"t":21.8,"source":[0.5078125,0.4097222222222222]},{"t":22.2,"source":[0.47265625,0.4114583333333333]},{"t":22.6,"source":[0.4361979166666667,0.4114583333333333]},{"t":23.0,"source":[0.40234375,0.4114583333333333]},{"t":23.4,"source":[0.3697916666666667,0.4097222222222222]},{"t":23.5,"source":[0.3619791666666667,0.4097222222222222]}]},{"id":"P04","interval":[20.2,23.6],"anchors":[{"t":20.2,"source":[0.8450520833333334,0.6423611111111112]},{"t":20.6,"source":[0.8736979166666666,0.6788194444444444]},{"t":21,"source":[0.8763020833333334,0.6961805555555556]},{"t":21.2,"source":[0.8684895833333334,0.7048611111111112]},{"t":21.4,"source":[0.85546875,0.7065972222222222]},{"t":21.8,"source":[0.8125,0.7083333333333334]},{"t":22.2,"source":[0.7643229166666666,0.6944444444444444]},{"t":22.6,"source":[0.7213541666666666,0.6736111111111112]},{"t":23,"source":[0.6888020833333334,0.6579861111111112]},{"t":23.4,"source":[0.6588541666666666,0.6302083333333334]},{"t":23.5,"source":[0.6536458333333334,0.6302083333333334]}]},{"id":"P05","interval":[20.2,21.3],"anchors":[{"t":20.2,"source":[0.9557291666666666,0.6145833333333334]},{"t":20.6,"source":[0.9791666666666666,0.6336805555555556]},{"t":21,"source":[1.0104166666666667,0.6475694444444444]},{"t":21.2,"source":[1.0247395833333333,0.6493055555555556]},{"t":21.3,"source":[1.03515625,0.6493055555555556]}]},{"id":"P06","interval":[20.2,23.6],"anchors":[{"t":20.2,"source":[0.8932291666666666,0.265625]},{"t":20.6,"source":[0.8880208333333334,0.2673611111111111]},{"t":21.0,"source":[0.8802083333333334,0.2743055555555556]},{"t":21.4,"source":[0.8763020833333334,0.2777777777777778]},{"t":21.8,"source":[0.8723958333333334,0.2847222222222222]},{"t":22.2,"source":[0.8684895833333334,0.2864583333333333]},{"t":22.6,"source":[0.8619791666666666,0.2899305555555556]},{"t":23.0,"source":[0.8567708333333334,0.2951388888888889]},{"t":23.4,"source":[0.8528645833333334,0.3003472222222222]},{"t":23.5,"source":[0.8515625,0.3003472222222222]}]},{"id":"P07","interval":[20.2,23.6],"anchors":[{"t":20.2,"source":[0.921875,0.265625]},{"t":20.6,"source":[0.91796875,0.2708333333333333]},{"t":21.0,"source":[0.9140625,0.2743055555555556]},{"t":21.4,"source":[0.9075520833333334,0.2795138888888889]},{"t":21.8,"source":[0.8997395833333334,0.2864583333333333]},{"t":22.2,"source":[0.8971354166666666,0.2881944444444444]},{"t":22.6,"source":[0.8893229166666666,0.2934027777777778]},{"t":23.0,"source":[0.8880208333333334,0.2986111111111111]},{"t":23.4,"source":[0.8828125,0.3020833333333333]},{"t":23.5,"source":[0.8815104166666666,0.3020833333333333]}]},{"id":"P08","interval":[21.8,23.6],"anchors":[{"t":21.8,"source":[1.015625,0.5434027777777778]},{"t":21.9,"source":[1.0,0.546875]},{"t":22,"source":[0.98828125,0.5503472222222222]},{"t":22.2,"source":[0.9609375,0.5520833333333334]},{"t":22.6,"source":[0.9283854166666666,0.5295138888888888]},{"t":23,"source":[0.8971354166666666,0.5121527777777778]},{"t":23.4,"source":[0.8658854166666666,0.5]},{"t":23.5,"source":[0.8606770833333334,0.4965277777777778]}]},{"id":"P09","interval":[22.5,23.6],"anchors":[{"t":22.5,"source":[1.0299479166666667,0.703125]},{"t":22.6,"source":[1.0169270833333333,0.6944444444444444]},{"t":22.8,"source":[0.9908854166666666,0.6961805555555556]},{"t":23,"source":[0.9739583333333334,0.6875]},{"t":23.4,"source":[0.9361979166666666,0.6684027777777778]},{"t":23.5,"source":[0.92578125,0.6631944444444444]}]}];
  const outlines = {"footprint":[[0,0],[768,0],[768,576],[0,576]],"foregroundLawn":[[0,240],[170,263],[197,262],[255,284],[346,331],[433,377],[507,404],[611,443],[768,491],[768,576],[0,576]],"upperLawn":[[0,71],[83,66],[289,16],[303,3],[306,107],[594,120],[592,133],[574,149],[526,133],[469,126],[415,144],[398,159],[347,171],[270,170],[184,163],[102,153],[0,149]],"rightLawn":[[768,147],[750,165],[720,184],[702,202],[696,220],[707,242],[729,259],[768,277]],"parkingApron":[[0,153],[194,166],[347,174],[395,159],[454,130],[503,132],[573,148],[569,159],[522,177],[449,202],[393,211],[325,213],[271,213],[0,186]],"ramp":[[272,208],[316,191],[355,176],[398,170],[429,185],[400,202],[345,211]],"frontCurb":[[0,240],[170,263],[197,262],[255,284],[346,331],[433,377],[507,404],[611,443],[768,491]],"upperCurb":[[0,185],[156,201],[266,214],[340,214],[411,207],[490,188],[568,159],[641,124],[701,100],[768,94]],"rightCurb":[[768,161],[746,173],[719,190],[704,206],[700,219],[708,239],[728,258],[768,288]],"buildingMainFront":[[309,107],[594,120],[630,101]],"buildingMainBase":[[309,107],[594,120],[630,101],[334,85]],"buildingRearRightBase":[[632,97],[768,83],[768,35],[662,48]],"buildingLeftBase":[[0,68],[82,65],[292,11],[280,0],[0,0]],"vanBase":[[652,89],[701,84],[723,102],[668,108]],"carBase":[[732,88],[768,85],[768,105],[738,111]],"zones":[[[0,186],[345,217],[347,334],[270,292],[0,240]],[[345,217],[570,166],[715,265],[768,295],[768,491],[347,334]],[[570,168],[641,123],[701,100],[768,94],[768,161],[718,192],[705,231]]]};

  // A single projective map is applied to every source foot and traced outline.
  // Its units express the diagram, not metres. No independent toy-world paths.
  const groundFromPixels = ([u, v]) => [
    (12 * u + 16 * v + 192) / (v + 300), 30 * v / (v + 300)
  ];
  function at(time) {
    const clamped = Math.max(start, Math.min(end, Number.isFinite(time) ? time : start));
    // Native media is 10 fps. Use its displayed frame time, including a seek
    // landing between timestamps, rather than moving ahead of a held frame.
    const t = Math.floor(clamped * 10 + 1e-7) / 10;
    const people = tracks.flatMap(track => {
      if (t < track.interval[0] || t >= track.interval[1]) return [];
      const keys = track.anchors;
      let hi = keys.findIndex(frame => frame.t >= t);
      if (hi < 0) hi = keys.length - 1;
      const a = keys[Math.max(0, hi - 1)], b = keys[hi];
      const u = a.t === b.t ? 0 : Math.max(0, Math.min(1, (t - a.t) / (b.t - a.t)));
      const source = a.source.map((value, index) => value + (b.source[index] - value) * u);
      const [x, y] = groundFromPixels([source[0] * sourceSize[0], source[1] * sourceSize[1]]);
      return [{ id: track.id, x, y, red: true, visible: true, source }];
    });
    return { people };
  }
  function render(svg, t, { mini = false, mode = 'tracking' } = {}) {
    const current = at(t);
    const g = PB5Spatial.scene(svg, {
      width: 32, depth: 20, height: 3.5, mini, yaw: 14, elevation: 44,
      palette: { line: '#d6d6d1', top: '#ffffff', front: '#eeeeea',
        side: '#deded9', muted: '#83837e', red: '#ff3110' }
    });
    const round = value => Math.round(value * 100) / 100;
    const xyz = (pixelPoints, z = 0) => pixelPoints.map(point => [...groundFromPixels(point), z]);
    const foot = xyz(outlines.footprint);
    const edge = `stroke="#d5d5d0" stroke-width="${mini ? .45 : .65}" stroke-linejoin="round"`;
    const white = '#ffffff', line = '#d5d5d0';
    const objects = [];
    const depthOf = points => g.raw(points.reduce((sum, point) =>
      [sum[0] + point[0] / points.length, sum[1] + point[1] / points.length], [0, 0]))[2];
    function prism(basePoints, height, { top = white, front = '#eeeeea', side = '#deded9', base = 0 } = {}) {
      const points = basePoints.map(point => [point[0], point[1], base]);
      const faces = points.map((a, index) => {
        const b = points[(index + 1) % points.length];
        return { points: [a, b, [b[0], b[1], height], [a[0], a[1], height]],
          depth: depthOf([a, b]), color: index % 2 ? side : front };
      }).sort((a, b) => a.depth - b.depth);
      return faces.map(face => g.poly(face.points, face.color, edge)).join('') +
        g.poly(points.map(point => [point[0], point[1], height]), top, edge);
    }
    function screenLine(a, b, color, width, opacity = 1) {
      const p = g.P(a), q = g.P(b);
      return `<line x1="${round(p[0])}" y1="${round(p[1])}" x2="${round(q[0])}" y2="${round(q[1])}" stroke="${color}" stroke-width="${width}" opacity="${opacity}" stroke-linecap="round"/>`;
    }
    const shadowFoot = foot.map(([x, y]) => [x + .07, y + .1, -.22]);
    g.add(g.poly(shadowFoot, '#777772', 'opacity=".09"'));
    g.add(prism(foot, 0, { base: -.18, top: '#f6f6f3', front: '#e6e6e1', side: '#dadad4' }));
    // Real lawn boundaries, the parking apron and the broad curved junction.
    g.add(g.poly(xyz(outlines.parkingApron, .008), '#eaeae6'));
    ['foregroundLawn', 'upperLawn', 'rightLawn'].forEach(name => {
      const lawn = xyz(outlines[name]);
      g.add(prism(lawn, .065, { top: '#eeeee9', front: '#dfdfd9', side: '#d9d9d2' }));
    });
    g.add(g.poly(xyz(outlines.ramp, .075), '#e4e4df', 'stroke="#d3d3ce" stroke-width=".45"'));
    ['frontCurb', 'upperCurb', 'rightCurb'].forEach(name => {
      g.add(g.line(xyz(outlines[name], .09), '#ffffff'));
      g.add(g.line(xyz(outlines[name], .018), '#cecec8', 'opacity=".75"'));
    });
    // The paired curb markings follow the road bend visible at the right edge.
    g.add(g.line(xyz(outlines.rightCurb.map(([x, y]) => [x - 5, y + 2]), .03), '#deded8'));
    g.add(g.line(xyz([[0,173],[169,191],[270,204]], .03), '#ffffff', 'stroke-dasharray="3 4"'));
    if (mode === 'hvac' || mode === 'layout') {
      outlines.zones.forEach((zone, index) => {
        g.add(g.poly(xyz(zone, .095), '#ff3110',
          `opacity="${mode === 'hvac' ? .042 : .027}"`));
        g.add(g.line(xyz([...zone, zone[0]], .1), '#ff3110',
          `opacity="${mode === 'hvac' ? .24 : .17}" stroke-dasharray="3 4"`));
      });
      if (mode === 'layout') current.people.forEach(person =>
        g.add(g.poly(g.ring(person.x, person.y, .4, .11), '#ff3110', 'opacity=".045"')));
    }
    const buildingSpecs = [
      ['buildingLeftBase', 2.9], ['buildingMainBase', 3.05], ['buildingRearRightBase', 3.1]
    ];
    buildingSpecs.forEach(([name, height]) => {
      const base = xyz(outlines[name]);
      g.add(g.poly(base.map(([x, y]) => [x + .2, y + .32, .085]), '#696963', 'opacity=".065"'));
      let markup = prism(base, height);
      // Restrained recessed facade bands keep the same long front edge as the photo.
      if (name === 'buildingMainBase') {
        const a = base[0], b = base[1];
        for (let i = 0; i < 5; i++) {
          const p = i / 5 + .018, q = (i + 1) / 5 - .018;
          const one = [a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p];
          const two = [a[0] + (b[0] - a[0]) * q, a[1] + (b[1] - a[1]) * q];
          markup += g.poly([[...one, .65],[...two, .65],[...two, 2.0],[...one, 2.0]], '#e3e3de', 'stroke="#d3d3cd" stroke-width=".35"');
        }
      }
      objects.push({ depth: depthOf(base), markup });
    });
    ['vanBase', 'carBase'].forEach((name, index) => {
      const base = xyz(outlines[name]);
      const height = index ? .85 : 1.25;
      g.add(g.poly(base.map(([x, y]) => [x + .08, y + .12, .05]), '#6d6d66', 'opacity=".1"'));
      let markup = prism(base, height, { base: .12, top: '#ffffff', front: '#ebebe7', side: '#dcdcd6' });
      const a = base[0], b = base[1];
      markup += g.poly([[a[0],a[1],height*.55],[b[0],b[1],height*.55],
        [b[0],b[1],height*.83],[a[0],a[1],height*.83]], '#d1d1cc');
      [base[0], base[1], base[2], base[3]].forEach(([x,y]) => {
        const [sx,sy] = g.P([x,y,.12]);
        markup += `<circle cx="${round(sx)}" cy="${round(sy)}" r="${mini ? .75 : 1.15}" fill="#9b9b95"/>`;
      });
      objects.push({ depth: depthOf(base), markup });
    });
    // The source's tall lamp/sign pole and both tripod cameras are landmarks.
    {
      const [x,y] = groundFromPixels([434,389]);
      let markup = screenLine([x,y,.07],[x,y,5.8],'#c3c3bd',mini ? 1.3 : 2.0);
      markup += screenLine([x-.015,y,.07],[x-.015,y,5.8],'#ffffff',mini ? .75 : 1.1);
      markup += screenLine([x,y,5.8],[x-.48,y,6.02],'#d3d3cd',mini ? 1.0 : 1.4);
      markup += screenLine([x-.48,y,6.02],[x-.1,y,6.02],'#ffffff',mini ? 1.6 : 2.5);
      markup += g.poly([[x-.24,y,2.6],[x+.24,y,2.6],[x+.24,y,3.25],[x-.24,y,3.25]],'#ffffff',edge);
      objects.push({ depth: g.raw([x,y])[2], markup });
    }
    [[504,455,1.8],[448,176,1.3]].forEach(([u,v,height]) => {
      const [x,y] = groundFromPixels([u,v]);
      let markup = '';
      [[-.26,.12],[.24,.2],[.04,-.2]].forEach(([dx,dy]) => {
        markup += screenLine([x+dx,y+dy,.065],[x,y,height],'#b0b0aa',mini ? .6 : .8);
      });
      markup += g.solid(x-.12,y-.08,.24,.16,height+.14,
        {base:height,top:'#a8a8a2',front:'#b9b9b2',side:'#92928d'});
      objects.push({ depth:g.raw([x,y])[2], markup });
    });
    // Small cones mark the taped-off apron. They are not people or live tracks.
    [[42,184],[170,197],[300,197],[447,195]].forEach(([u,v]) => {
      const [x,y] = groundFromPixels([u,v]);
      let markup = g.poly(g.rectangle(x-.1,y-.08,.2,.16,.05),'#d7d7d1');
      const a=g.P([x-.07,y,.05]),b=g.P([x+.07,y,.05]),top=g.P([x,y,.35]);
      markup += `<polygon points="${[a,b,top].map(p=>p.map(round).join(',')).join(' ')}" fill="#e4e4de" stroke="#c8c8c0" stroke-width=".4"/>`;
      objects.push({depth:g.raw([x,y])[2],markup});
    });
    current.people.forEach(person => objects.push({
      depth: g.raw([person.x,person.y])[2],
      markup: `<g data-track="${person.id}">` +
        g.marker(person.x,person.y,{red:true,r:.14,z:1.45,person:true}) + '</g>'
    }));
    objects.sort((a,b)=>a.depth-b.depth).forEach(object=>g.add(object.markup));
    g.finish();
    return current;
  }
  return {
    start, end, at, render,
    note: '映像内で見える全員を手動で対応づけています。7→6→7→6→7人と変化し、画面外の同一性は判断せず9つの連続トラックに分けています。外構と足元は同じ近似射影で対応。外周はカメラの視野で、敷地境界ではありません。建物の奥行き・高さは模式表現で、実測やAIの推論結果ではありません。',
    evidence: { frameRate:10, checkedFrames:34, sourceSize, tracks, outlines,
      homography:[12,16,192,0,30,0,0,1,300],
      visibilityChanges:[[20.2774,7],[21.3,6],[21.8,7],[22.2,6],[22.5,7]] }
  };
})();
