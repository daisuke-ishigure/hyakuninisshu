window.addEventListener('load',()=>setTimeout(()=>{
 gsap.ticker.lagSmoothing(0); gsap.globalTimeline.timeScale(5);
 const diff=new URLSearchParams(location.search).get('d')||'normal';
 setDifficulty(diff); document.getElementById('start-btn').click();
 const lanes=[];let maxCorrect=0,catches=0,dupPos=0,maxFalling=0,noCorrectMax=0,noCorrectSince=null;const t0=performance.now();
 const iv=setInterval(()=>{
   if(!state.running) return;
   const falling=state.cards.filter(c=>c.state==='falling');
   maxFalling=Math.max(maxFalling,falling.length);
   if(new Set(falling.map(c=>c.slot)).size!==falling.length) dupPos++;
   const cs=falling.filter(c=>c.isCorrect);
   maxCorrect=Math.max(maxCorrect,cs.length);
   const c=cs[0];
   if(c){ c._seen=c._seen||performance.now();
     if(performance.now()-c._seen>150 && Date.now()>=state.cooldownUntil && !state.stabbing){
       lanes.push(c.slot); handleCardCatch(c,c.slot); catches++; }}
   if(catches>=40||performance.now()-t0>60000){clearInterval(iv);
     const cnt={};lanes.forEach(l=>cnt[l]=(cnt[l]||0)+1);
     let same=0;for(let i=1;i<lanes.length;i++)if(lanes[i]===lanes[i-1])same++;
     window.__RESULT=`diff=${diff} positions=${getPositionCount()} catches=${catches} laneCounts=${JSON.stringify(cnt)} sameAsPrev=${same} maxCorrectAtOnce=${maxCorrect} maxFalling=${maxFalling} overlapEvents=${dupPos} seq=${lanes.join('')}`;}
 },50);
},1500));
