#!/usr/bin/env python3
"""
vitalprotocolDK index.html patcher
Run: python3 patch_index.py
"""
import re, shutil, os

INPUT  = 'index.html'
OUTPUT = 'index_fixed.html'

with open(INPUT, 'r', encoding='utf-8') as f:
    html = f.read()

original = html

# ── FIX 1: setLang() ────────────────────────────────────────────────────────
# Add localStorage.setItem + vSetLang() call inside setLang function

old = """function setLang(lang) {
  document.querySelectorAll('.lang-section').forEach(function(s){ s.style.display='none'; });"""

new = """function setLang(lang) {
  localStorage.setItem('vpLang', lang);
  document.querySelectorAll('.lang-section').forEach(function(s){ s.style.display='none'; });"""

if old in html:
    html = html.replace(old, new, 1)
    print("✅ FIX 1a: localStorage.setItem eklendi")
else:
    print("⚠️  FIX 1a: setLang başlangıcı bulunamadı — manuel kontrol et")

# Add vSetLang call at end of setLang, before closing brace
# Find the closing of setLang - it ends with the last .add('active') line
old2 = """    if(b.textContent.trim() === lang.toUpperCase()) b.classList.add('active');
  });
}
// Event delegation"""

new2 = """    if(b.textContent.trim() === lang.toUpperCase()) b.classList.add('active');
  });
  if(typeof vSetLang === 'function') vSetLang(lang);
}
// Event delegation"""

if old2 in html:
    html = html.replace(old2, new2, 1)
    print("✅ FIX 1b: vSetLang() sync çağrısı eklendi")
else:
    print("⚠️  FIX 1b: setLang kapanışı bulunamadı — manuel kontrol et")

# ── FIX 2: #vera-langs div'i kaldır ─────────────────────────────────────────
old3 = """    <div id="vera-langs">
      <button class="vlb va" data-l="tr">TR</button>
      <button class="vlb" data-l="en">EN</button>
      <button class="vlb" data-l="es">ES</button>
    </div>"""

if old3 in html:
    html = html.replace(old3, '', 1)
    print("✅ FIX 2: #vera-langs div kaldırıldı")
else:
    print("⚠️  FIX 2: #vera-langs bulunamadı — zaten kaldırılmış olabilir")

# ── FIX 3: #vera-langs CSS kaldır (temizlik) ─────────────────────────────────
# Remove the CSS block for #vera-langs and .vlb
css_old = """#vera-langs{display:flex;gap:6px;padding:8px 14px;border-bottom:1px solid #f0ede6;background:#fafaf8}
.vlb{padding:3px 10px;font-size:10px;font-weight:600;letter-spacing:.06em;border-radius:20px;cursor:pointer;border:1px solid #d6ddd7;background:transparent;color:#6b7c6d;font-family:'DM Sans',sans-serif}
.vlb.va{background:#2e3d30;color:#fcfcfa;border-color:#2e3d30}"""

if css_old in html:
    html = html.replace(css_old, '', 1)
    print("✅ FIX 3: #vera-langs CSS kaldırıldı")
else:
    print("ℹ️  FIX 3: #vera-langs CSS bulunamadı (sorun değil)")

# ── FIX 4: .vlb event listener kaldır ────────────────────────────────────────
old4 = """  document.querySelectorAll('.vlb').forEach(function(b){
    b.addEventListener('click',function(e){e.stopPropagation();vSetLang(b.getAttribute('data-l'));});
  });"""

if old4 in html:
    html = html.replace(old4, '', 1)
    print("✅ FIX 4: .vlb event listener kaldırıldı")
else:
    print("ℹ️  FIX 4: .vlb listener bulunamadı (sorun değil)")

# ── SONUÇ ─────────────────────────────────────────────────────────────────────
if html == original:
    print("\n❌ Hiçbir değişiklik yapılamadı. index.html formatı beklenenden farklı olabilir.")
    print("   Manuel değişiklik talimatları için README_PATCH.md dosyasına bakın.")
else:
    shutil.copy(INPUT, INPUT + '.backup')
    with open(OUTPUT, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"\n🎉 Tamamlandı! Düzeltilmiş dosya: {OUTPUT}")
    print(f"   Orijinal yedek: {INPUT}.backup")
    print(f"\n📋 Yapılan değişiklikler:")
    print(f"   • setLang() artık localStorage'a kaydediyor")
    print(f"   • setLang() artık Vera widgetını senkronize ediyor")
    print(f"   • Vera widget içindeki dil paneli kaldırıldı")
    print(f"\n✈️  GitHub'a yüklemek için: index_fixed.html → index.html olarak yeniden adlandır")
