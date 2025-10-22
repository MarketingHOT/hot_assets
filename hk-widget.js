// ===== Hochkar Widget JS =====
(function(){
  var PRODUCT_URL="https://shop.hochkar.com/products/skitickets";
  var MAX_DAYS=6;
  function $(id){return document.getElementById(id);}

  var widget=$("hk-widget");
  var dateSection=$("hk-date-section");

  if(typeof ResizeObserver!=="undefined" && dateSection){
    var ro=new ResizeObserver(function(entries){
      var w=entries[0].contentRect.width;
      widget.classList.toggle("hk-narrow", w<=520);
    });
    ro.observe(dateSection);
  }

  var elStart=$("hk-start"),elEnd=$("hk-end"),err=$("hk-error"),dur=$("hk-duration");
  var adultsCount=$("hk-adults-count"),kidsCount=$("hk-kids-count");
  var adults=1,kids=0;

  function setCount(t,v){
    v=Math.max(0,Math.min(99,v|0));
    if(t==="adults"){adults=v; if(adultsCount) adultsCount.textContent=v;}
    else{kids=v; if(kidsCount) kidsCount.textContent=v; var m=$("hk-kids-minus"); if(m) m.disabled=v<=0;}
  }
  var am=$("hk-adults-minus"), ap=$("hk-adults-plus"), km=$("hk-kids-minus"), kp=$("hk-kids-plus");
  if(am) am.onclick=function(){setCount("adults",adults-1);};
  if(ap) ap.onclick=function(){setCount("adults",adults+1);};
  if(km) km.onclick=function(){setCount("kids",kids-1);};
  if(kp) kp.onclick=function(){setCount("kids",kids+1);};

  function diffDays(s,e){return Math.round((new Date(e)-new Date(s))/86400000)+1;}
  function updateDuration(){
    var s=elStart.value, e=elEnd.value||s;
    if(!s){ if(dur) dur.textContent="Ausgewählte Dauer: –"; return; }
    var d=diffDays(s,e);
    if(dur) dur.textContent="Ausgewählte Dauer: "+d+" "+(d===1?"Tag":"Tage");
  }

  if(elStart) elStart.onchange=function(){
    var s=elStart.value;if(!s)return;
    if(elEnd){
      elEnd.disabled=false;
      var max=new Date(s); max.setDate(max.getDate()+MAX_DAYS-1);
      elEnd.min=s; elEnd.max=max.toISOString().split("T")[0];
      if(!elEnd.value) elEnd.value=s;
    }
    updateDuration();
  };
  if(elEnd) elEnd.onchange=updateDuration;

  var submit=$("hk-submit");
  if(submit) submit.onclick=function(){
    if(err) err.style.display="none";
    var s=elStart.value, e=elEnd.value||s;
    if(!s){ return showErr("Bitte ein Startdatum wählen."); }
    var d=diffDays(s,e);
    if(d<1||d>MAX_DAYS){ return showErr("Bitte eine Dauer zwischen 1 und 6 Tagen wählen."); }

    var from=new Date(s+"T00:00:00"), to=new Date(e+"T23:59:59.999");
    var alloc=[];
    if(adults>0) alloc.push({kind:"anonymous",quantity:adults,personType:"adult"});
    if(kids>0)   alloc.push({kind:"anonymous",quantity:kids,personType:"child"});

    var formState={
      validity:{from:from.toISOString(),to:to.toISOString()},
      allocation:{kind:"persontype",values:alloc},
      attributes:{duration:"1d"}
    };
    window.open(PRODUCT_URL+"?formState="+encodeURIComponent(JSON.stringify(formState)),"_blank","noopener");
  };

  function showErr(t){ if(!err) return; err.textContent=t; err.style.display="block"; }
  setCount("adults",1); setCount("kids",0);
})();
