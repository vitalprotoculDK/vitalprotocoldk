// ✅ GÜNCELLENMIŞ VERA WIDGET KODU
// Dil paneli kaldırıldı, localStorage senkronizasyonu eklendi

var vL = localStorage.getItem('vpLang') || 'tr'; // Ana sayfadan dili oku
var vOpen = false;
var vHist = []; // conversation history

// Çok dilli metinler
var vT = {
  tr: {
    ph: 'Sorularını yaz...',
    st: 'Merhaba! 👋 Ben Vera, vitalprotocolDK wellness rehberi.',
    disc: 'Vera, bilgi amaçlıdır. Tıbbi tanı/tedavi değildir. Önemli konularda doktorunuza danışın.',
    wel: 'Merhaba! 👋 Ben Vera, vitalprotocolDK wellness rehberi. Sana yardımcı olmaya hazırım!',
    q: [
      'Nitro Plus nedir?',
      'Hangi protokol bana uyar?',
      'Ürünleri nereden alırım?',
      'Wellness Üçgeni nedir?'
    ]
  },
  en: {
    ph: 'Ask your questions...',
    st: 'Hello! 👋 I\'m Vera, your vitalprotocolDK wellness guide.',
    disc: 'Vera provides wellness information only. Not medical diagnosis/treatment. Consult your doctor for important health matters.',
    wel: 'Hello! 👋 I\'m Vera, your vitalprotocolDK wellness guide. Ready to help!',
    q: [
      'What is Nitro Plus?',
      'Which protocol suits me?',
      'Where do I buy the products?',
      'What is the Wellness Triangle?'
    ]
  },
  es: {
    ph: 'Haz tus preguntas...',
    st: 'Hola! 👋 Soy Vera, tu guía de bienestar de vitalprotocolDK.',
    disc: 'Vera proporciona información de bienestar solamente. No es diagnóstico/tratamiento médico. Consulta a tu médico para asuntos importantes.',
    wel: 'Hola! 👋 Soy Vera, tu guía de bienestar de vitalprotocolDK. ¡Listo para ayudarte!',
    q: [
      '¿Qué es Nitro Plus?',
      '¿Qué protocolo me conviene?',
      '¿Dónde compro los productos?',
      '¿Qué es el Triángulo de Bienestar?'
    ]
  }
};

// System prompt (Vera'nın kişiliği)
var vSys = 'Sen Vera\'sın — vitalprotocolDK wellness rehberi. Deniz KAT adına çalışıyorsun. Ürünler: Nitro Plus, Sunrise, Sunset, HL5, FIT20, ORIGIN, NRGI, EDGE, IGNT, R-STOUR, ON-SHOTS. Satın alma: https://amare.com/tr-tr/g10/2180152. Sınırlar: Tıbbi tanı/tedavi önerme, hamilelikte doktora yönlendir. Dil: Kullanıcı dilinde cevap ver.';

// ❌ vSetLang() FÜNKSİYONU SILINMIŞ (artık gerekli değil)
// Ana sayfanın setLang() zaten localStorage'u güncelliyor

function vRenderQ(l){
  var q=document.getElementById('vera-quick');
  q.innerHTML='';
  vT[l].q.forEach(function(txt){
    var b=document.createElement('button');
    b.className='vqb';
    b.textContent=txt;
    b.addEventListener('click',function(){
      document.getElementById('vera-inp').value=txt;
      vSend();
    });
    q.appendChild(b);
  });
}

function vAddMsg(role,text){
  var msgs=document.getElementById('vera-msgs');
  var d=document.createElement('div');
  d.className='vm'+(role==='user'?' vu':'');
  var av=document.createElement('div');
  av.className='vmav';
  av.textContent=role==='user'?'👤':'V';
  var b=document.createElement('div');
  b.className='vmb';
  b.textContent=text;
  d.appendChild(av);
  d.appendChild(b);
  msgs.appendChild(d);
  msgs.scrollTop=msgs.scrollHeight;
}

function vInit(){
  var sl=localStorage.getItem('vpLang')||'tr';
  vL=sl; // vL'yi güncelle
  vRenderQ(sl);
  var msgs=document.getElementById('vera-msgs');
  if(msgs.children.length===0) vAddMsg('vera',vT[sl].wel);
}

async function vSend(){
  var inp=document.getElementById('vera-inp');
  var txt=inp.value.trim();
  if(!txt)return;
  inp.value='';
  vAddMsg('user',txt);
  vHist.push({role:'user',content:txt});
  document.getElementById('vera-typing').classList.add('vs');
  document.getElementById('vera-quick').style.display='none';
  try{
    var ctx=vHist.slice(-6).map(function(m){
      return m.role+': '+m.content;
    }).join('\n');
    var r=await fetch('/api/chat',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        messages:[{
          role:'user',
          content:vSys+'\n\nKullanıcı dili: '+vL+'\n\nGeçmiş:\n'+ctx
        }]
      })
    });
    var data=await r.json();
    var reply=data.content&&data.content[0]?data.content[0].text:'...';
    vHist.push({role:'assistant',content:reply});
    document.getElementById('vera-typing').classList.remove('vs');
    vAddMsg('vera',reply);
  }catch(e){
    document.getElementById('vera-typing').classList.remove('vs');
    vAddMsg('vera',{
      tr:'Bağlantı hatası, tekrar dene.',
      en:'Connection error, please try again.',
      es:'Error de conexión, inténtalo de nuevo.'
    }[vL]);
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded',function(){
  document.getElementById('vera-btn').addEventListener('click',function(e){
    e.stopPropagation();
    vOpen=!vOpen;
    var p=document.getElementById('vera-panel');
    p.classList.toggle('vopen',vOpen);
    if(vOpen) vInit();
  });
  
  document.getElementById('vera-x').addEventListener('click',function(e){
    e.stopPropagation();
    vOpen=false;
    document.getElementById('vera-panel').classList.remove('vopen');
  });
  
  document.getElementById('vera-go').addEventListener('click',function(e){
    e.stopPropagation();
    vSend();
  });
  
  document.getElementById('vera-inp').addEventListener('keydown',function(e){
    if(e.key==='Enter'){
      e.stopPropagation();
      vSend();
    }
  });
  
  // ❌ .vlb buton dinleyicileri SILINMIŞ
  // (artık dil paneli yok olduğundan lazım değil)
});
