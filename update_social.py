import os
import re

dir_path = r'c:\Users\sreej\OneDrive\Desktop\IEEE_WEBSITE_NCERC'
files = [f for f in os.listdir(dir_path) if f.endswith('.html')]

new_social = '''<div class="footer-social">
          <a href="https://www.instagram.com/ieee_sb_ncerc?igsh=YThnZ294OHE1N3Fs" target="_blank" class="social-btn" aria-label="Instagram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          <a href="https://www.linkedin.com/in/ieee-student-branch-ncerc-702a60202?utm_source=share_via&amp;utm_content=profile&amp;utm_medium=member_android" target="_blank" class="social-btn" aria-label="LinkedIn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          </a>
          <a href="mailto:ieeesbncerc@gmail.com" class="social-btn" aria-label="Email">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          </a>
        </div>'''

for fname in files:
    fpath = os.path.join(dir_path, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # regex to find <div class="footer-social">...</div>
    # we need to be careful about not breaking html if there are nested divs
    # but footer-social usually contains only <a> tags
    pattern = re.compile(r'<div\s+class="footer-social">.*?</div>', re.DOTALL)
    
    if pattern.search(content):
        new_content = pattern.sub(new_social, content)
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {fname}")
