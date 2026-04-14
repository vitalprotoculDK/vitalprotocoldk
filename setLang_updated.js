// ✅ GÜNCELLENMIŞ setLang() FONKSIYONU
// localStorage kaydı eklendi

function setLang(lang) {
  // 1. localStorage'a dili kaydet
  localStorage.setItem('vpLang', lang);
  
  // 2. Tüm dil bölümlerini gizle
  document.querySelectorAll('.lang-section').forEach(function(s){ 
    s.style.display='none'; 
  });
  
  // 3. İstenen dil bölümünü göster
  var target = document.getElementById('lang-' + lang);
  if(target) target.style.display = 'block';
  
  // 4. Tüm dil butonlarından 'active' sınıfını kaldır
  document.querySelectorAll('.vpdk-lang').forEach(function(b){ 
    b.classList.remove('active'); 
  });
  
  // 5. Seçilen dilin butonuna 'active' sınıfı ekle
  document.querySelectorAll('.vpdk-lang').forEach(function(b){
    if(b.textContent.trim() === lang.toUpperCase()) b.classList.add('active');
  });
}

// Event delegation - data-setlang butonları
document.addEventListener('click', function(e){
  var t = e.target;
  while(t && t !== document.body){
    var lang = t.getAttribute('data-setlang');
    if(lang){ 
      setLang(lang);  // Bu artık localStorage'a kaydedecek
      return; 
    }
    t = t.parentElement;
  }
});
