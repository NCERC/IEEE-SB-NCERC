// IEEE SB NCERC — Hero Animation
// MACE-style purple/blue globe + enhanced effects
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, t = 0;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Stars
  const isMobile = window.innerWidth < 768;
  const starCount = isMobile ? 120 : 350;
  const rayCount = isMobile ? 12 : 22;
  const dustCount = isMobile ? 30 : 80;

  const stars = Array.from({length:starCount}, () => ({
    x: Math.random(), y: Math.random(),
    r: Math.random()*1.8+0.2,
    twinkle: Math.random()*Math.PI*2,
    speed: Math.random()*0.02+0.004,
    hue: Math.random()<0.2 ? 220 : 0,
  }));

  // Light rays
  const rays = Array.from({length:rayCount}, (_,i) => ({
    angle: (i/rayCount)*Math.PI*2+Math.random()*0.4,
    len: 0.28+Math.random()*0.4,
    width: 0.8+Math.random()*2.5,
    speed: (Math.random()-0.5)*0.003,
    alpha: 0.03+Math.random()*0.09,
    hue: 215+Math.random()*55,
  }));

  // Dust particles
  const dust = Array.from({length:dustCount}, () => ({
    x: Math.random(), y: Math.random(),
    vx: (Math.random()-0.5)*0.0003, vy: (Math.random()-0.5)*0.0003,
    r: Math.random()*3+0.5,
    hue: 210+Math.random()*65,
    alpha: Math.random()*0.5+0.1,
    pulse: Math.random()*Math.PI*2,
    pSpeed: Math.random()*0.022+0.007,
  }));

  // Shooting stars queue
  let shooters = [];
  function spawnShooter() {
    shooters.push({
      x: Math.random()*W*0.6, y: Math.random()*H*0.4,
      vx: 5+Math.random()*5, vy: 1+Math.random()*3,
      life: 1, decay: 0.03+Math.random()*0.02,
      len: 60+Math.random()*80,
    });
  }

  function draw() {
    t += 0.006;
    ctx.clearRect(0,0,W,H);

    // Background
    const bg = ctx.createLinearGradient(0,0,0,H);
    bg.addColorStop(0,'#06030f'); bg.addColorStop(0.5,'#08051a'); bg.addColorStop(1,'#030208');
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);

    // Nebula
    [{cx:0.5,cy:0.42,r:0.72,h:245,a:0.20},{cx:0.32,cy:0.62,r:0.42,h:218,a:0.11},{cx:0.7,cy:0.28,r:0.38,h:268,a:0.10},{cx:0.18,cy:0.35,r:0.28,h:200,a:0.07}].forEach((n,i)=>{
      const pulse=0.82+Math.sin(t*0.2+i)*0.18;
      const gr=ctx.createRadialGradient(n.cx*W,n.cy*H,0,n.cx*W,n.cy*H,n.r*Math.min(W,H));
      gr.addColorStop(0,`hsla(${n.h},82%,36%,${n.a*pulse})`);
      gr.addColorStop(0.45,`hsla(${n.h+15},72%,26%,${n.a*0.55*pulse})`);
      gr.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=gr; ctx.fillRect(0,0,W,H);
    });

    // Stars
    stars.forEach(s=>{
      s.twinkle+=s.speed;
      const a=Math.max(0.04,0.22+Math.sin(s.twinkle)*0.58);
      ctx.beginPath(); ctx.arc(s.x*W,s.y*H,s.r,0,Math.PI*2);
      ctx.fillStyle=`hsla(${s.hue},${s.hue?'60%':'0%'},95%,${a})`; ctx.fill();
      if(s.r>1.3&&a>0.45){
        const len=s.r*5; ctx.strokeStyle=`hsla(${s.hue},${s.hue?'60%':'0%'},95%,${a*0.22})`; ctx.lineWidth=0.5;
        ctx.beginPath(); ctx.moveTo(s.x*W-len,s.y*H); ctx.lineTo(s.x*W+len,s.y*H);
        ctx.moveTo(s.x*W,s.y*H-len); ctx.lineTo(s.x*W,s.y*H+len); ctx.stroke();
      }
    });

    // Globe
    const gx=W*0.52, gy=H*0.43, globeR=Math.min(W,H)*0.27;
    const gp=1+Math.sin(t*0.5)*0.04;

    // Outer halos
    for(let ring=5;ring>0;ring--){
      ctx.beginPath(); ctx.arc(gx,gy,globeR*(0.85+ring*0.32)*gp,0,Math.PI*2);
      ctx.strokeStyle=`rgba(160,140,255,${0.018/ring})`; ctx.lineWidth=ring*2.5; ctx.stroke();
    }
    // Sphere body
    const sg=ctx.createRadialGradient(gx-globeR*0.28,gy-globeR*0.28,0,gx,gy,globeR*gp);
    sg.addColorStop(0,`rgba(210,195,255,${0.13+Math.sin(t*0.4)*0.03})`);
    sg.addColorStop(0.35,`rgba(145,115,245,0.08)`); sg.addColorStop(0.75,`rgba(80,60,185,0.05)`); sg.addColorStop(1,`rgba(28,18,80,0.04)`);
    ctx.beginPath(); ctx.arc(gx,gy,globeR*gp,0,Math.PI*2); ctx.fillStyle=sg; ctx.fill();
    ctx.beginPath(); ctx.arc(gx,gy,globeR*gp,0,Math.PI*2);
    ctx.strokeStyle=`rgba(185,165,255,${0.14+Math.sin(t*0.5)*0.05})`; ctx.lineWidth=1.5; ctx.stroke();

    // Lat/Lon lines
    for(let lat=-4;lat<=4;lat++){
      const ly=gy+(lat/4.2)*globeR; const lw=Math.sqrt(Math.max(0,globeR*globeR-Math.pow(ly-gy,2)));
      if(lw>4){ctx.beginPath();ctx.ellipse(gx,ly,lw*gp,lw*0.2*gp,0,0,Math.PI*2);ctx.strokeStyle=`rgba(180,160,255,0.045)`;ctx.lineWidth=0.7;ctx.stroke();}
    }
    for(let lon=0;lon<6;lon++){
      const ph=(lon/6)*Math.PI+t*0.12;
      ctx.beginPath();ctx.ellipse(gx,gy,Math.abs(Math.cos(ph))*globeR*gp,globeR*gp,0,0,Math.PI*2);
      ctx.strokeStyle='rgba(160,140,255,0.055)';ctx.lineWidth=0.7;ctx.stroke();
    }

    // Light rays
    rays.forEach(r=>{
      r.angle+=r.speed;
      const sx=gx+Math.cos(r.angle)*globeR*0.88, sy=gy+Math.sin(r.angle)*globeR*0.88;
      const ex=gx+Math.cos(r.angle)*r.len*Math.min(W,H)*1.6, ey=gy+Math.sin(r.angle)*r.len*Math.min(W,H)*1.6;
      const pa=r.alpha*(0.78+Math.sin(t*0.4+r.angle)*0.22);
      ctx.save(); ctx.translate(sx,sy); ctx.rotate(r.angle);
      const rLen=Math.sqrt((ex-sx)**2+(ey-sy)**2);
      const rg=ctx.createLinearGradient(0,0,rLen,0);
      rg.addColorStop(0,`hsla(${r.hue},82%,76%,${pa*0.85})`); rg.addColorStop(1,`hsla(${r.hue},82%,76%,0)`);
      ctx.fillStyle=rg; ctx.fillRect(0,-r.width*3.5,rLen,r.width*7);
      ctx.restore();
      const lg=ctx.createLinearGradient(sx,sy,ex,ey);
      lg.addColorStop(0,`hsla(${r.hue},85%,78%,${pa})`); lg.addColorStop(1,`hsla(${r.hue},85%,78%,0)`);
      ctx.beginPath(); ctx.strokeStyle=lg; ctx.lineWidth=r.width; ctx.moveTo(sx,sy); ctx.lineTo(ex,ey); ctx.stroke();
    });

    // Core glow
    const cg=ctx.createRadialGradient(gx,gy,0,gx,gy,globeR*0.32);
    cg.addColorStop(0,`rgba(225,215,255,${0.22+Math.sin(t*0.6)*0.08})`); cg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=cg; ctx.fillRect(0,0,W,H);

    // Dust
    dust.forEach(d=>{
      d.x+=d.vx; d.y+=d.vy; d.pulse+=d.pSpeed;
      if(d.x<0)d.x=1; if(d.x>1)d.x=0; if(d.y<0)d.y=1; if(d.y>1)d.y=0;
      const a=d.alpha*(0.35+Math.sin(d.pulse)*0.65);
      const gr=ctx.createRadialGradient(d.x*W,d.y*H,0,d.x*W,d.y*H,d.r*3.5);
      gr.addColorStop(0,`hsla(${d.hue},82%,72%,${a})`); gr.addColorStop(1,'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.arc(d.x*W,d.y*H,d.r*3.5,0,Math.PI*2); ctx.fillStyle=gr; ctx.fill();
    });

    // Shooting stars
    if(Math.random()<0.004) spawnShooter();
    shooters=shooters.filter(s=>s.life>0);
    shooters.forEach(s=>{
      s.x+=s.vx; s.y+=s.vy; s.life-=s.decay;
      const sg=ctx.createLinearGradient(s.x-s.vx*10,s.y-s.vy*10,s.x,s.y);
      sg.addColorStop(0,'rgba(255,255,255,0)'); sg.addColorStop(1,`rgba(255,255,255,${s.life*0.85})`);
      ctx.beginPath(); ctx.strokeStyle=sg; ctx.lineWidth=1.5;
      ctx.moveTo(s.x-s.vx*10,s.y-s.vy*10); ctx.lineTo(s.x,s.y); ctx.stroke();
      ctx.beginPath(); ctx.arc(s.x,s.y,2,0,Math.PI*2);
      ctx.fillStyle=`rgba(255,255,255,${s.life})`; ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
}