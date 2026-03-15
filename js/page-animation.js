function initPageAnimation() {
  const canvas = document.getElementById('page-bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = window.innerWidth, H = window.innerHeight;
  canvas.width = W; canvas.height = H;
  window.addEventListener('resize', () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; });

  const pts = Array.from({length: 90}, () => ({
    x: Math.random()*W, y: Math.random()*H,
    vx: (Math.random()-.5)*1.6, vy: (Math.random()-.5)*1.6,
    r: Math.random()*2.5+1,
    white: Math.random()>.25,
    alpha: 0.6+Math.random()*0.4,
    pulse: Math.random()*Math.PI*2,
    pSpeed: 0.025+Math.random()*0.025,
  }));

  function draw() {
    ctx.fillStyle = 'rgba(6,8,15,0.18)';
    ctx.fillRect(0,0,W,H);

    // Lines
    for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
      const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.sqrt(dx*dx+dy*dy);
      if(d<110){ ctx.beginPath(); ctx.strokeStyle=`rgba(220,235,255,${(1-d/110)*0.3})`; ctx.lineWidth=0.8; ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.stroke(); }
    }

    pts.forEach(p => {
      p.x+=p.vx; p.y+=p.vy; p.pulse+=p.pSpeed;
      if(p.x<=0||p.x>=W) p.vx*=-1;
      if(p.y<=0||p.y>=H) p.vy*=-1;
      p.x=Math.max(0,Math.min(W,p.x)); p.y=Math.max(0,Math.min(H,p.y));
      const a = p.alpha*(0.45+Math.sin(p.pulse)*0.55);
      const col = p.white ? `rgba(255,255,255,` : `rgba(180,215,255,`;
      // Big glow
      const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*10);
      g.addColorStop(0, col+(a*0.5)+')'); g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r*10,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
      // Core
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle = col+a+')'; ctx.fill();
      // Bright center
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r*0.4,0,Math.PI*2);
      ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initPageAnimation);
else initPageAnimation();