document.addEventListener('DOMContentLoaded', function() {
  fetch('link.json')
    .then(res => res.json())
    .then(data => {
      renderSidebar(data);
      renderCategoriesContent(data);
      setupSidebarScroll(data);
      handleScrollSpy(data);
    });

  function renderSidebar(data) {
    const nav = document.getElementById('category-nav');
    nav.innerHTML = '';
    data.forEach((cat, idx) => {
      const div = document.createElement('div');
      div.className = 'category-item' + (idx === 0 ? ' active' : '');
      div.textContent = cat.category;
      div.dataset.target = 'cat-' + idx;
      nav.appendChild(div);
    });
  }

  function renderCategoriesContent(data) {
    const content = document.getElementById('categories-content');
    content.innerHTML = '';
    data.forEach((cat, idx) => {
      const section = document.createElement('section');
      section.className = 'category-section';
      section.id = 'cat-' + idx;
      const title = document.createElement('div');
      title.className = 'category-title';
      title.textContent = cat.category;
      section.appendChild(title);
      // 只取第一个子分类（如有多子分类可扩展）
      const cards = document.createElement('div');
      cards.className = 'cards';
      (cat.subcategories[0]?.links || []).forEach(link => {
        const a = document.createElement('a');
        a.className = 'card';
        a.href = link.url;
        a.target = '_blank';
        const t = document.createElement('div');
        t.className = 'card-title';
        // 新增：自动插入logo
        const urlObj = new URL(link.url);
        const domain = urlObj.hostname.replace(/^www\./, '');
        const logoPath = `logo/website-logos/${domain}_logo_120x120.png`;
        const img = document.createElement('img');
        img.src = logoPath;
        img.alt = link.title + ' logo';
        img.className = 'site-logo';
        img.style.height = '24px';
        img.style.marginRight = '8px';
        // 检查图片是否存在，不存在则不显示
        img.onerror = function() { this.style.display = 'none'; };
        t.appendChild(img);
        t.appendChild(document.createTextNode(link.title));
        a.appendChild(t);
        if(link.describe) {
          const d = document.createElement('div');
          d.className = 'card-desc';
          d.textContent = link.describe;
          a.appendChild(d);
        }
        cards.appendChild(a);
      });
      section.appendChild(cards);
      content.appendChild(section);
    });
  }

  function setupSidebarScroll(data) {
    const nav = document.getElementById('category-nav');
    nav.querySelectorAll('.category-item').forEach(item => {
      item.addEventListener('click', function() {
        const id = this.dataset.target;
        const target = document.getElementById(id);
        if(target) {
          target.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
      });
    });
  }

  function handleScrollSpy(data) {
    const sections = Array.from(document.querySelectorAll('.category-section'));
    const navItems = Array.from(document.querySelectorAll('.category-item'));
    window.addEventListener('scroll', function() {
      let cur = 0;
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      sections.forEach((sec, idx) => {
        const offset = sec.getBoundingClientRect().top + window.scrollY - 120;
        if(scrollY >= offset) cur = idx;
      });
      navItems.forEach((item, idx) => {
        if(idx === cur) item.classList.add('active');
        else item.classList.remove('active');
      });
    });
  }

  document.getElementById('hamburger-btn').onclick = function() {
    document.querySelector('.sidebar').classList.toggle('active');
  };

  // 夜间模式切换
  const nightBtn = document.getElementById('night-mode-btn');
  const nightIcon = document.getElementById('night-mode-icon');
  const moonSVG = '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.5 13.5A7.5 7.5 0 0 1 8.5 4.5c0-.3.02-.6.05-.89A.5.5 0 0 0 7.8 3.5 9 9 0 1 0 18.5 14.2a.5.5 0 0 0-.11-.75c-.29-.03-.59-.05-.89-.05Z" stroke="#222" stroke-width="2" fill="none"/></svg>';
  const sunSVG = '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="5" stroke="#222" stroke-width="2" fill="none"/><path d="M11 1v2M11 19v2M21 11h-2M3 11H1M17.07 17.07l-1.42-1.42M6.35 6.35L4.93 4.93M17.07 4.93l-1.42 1.42M6.35 15.65l-1.42 1.42" stroke="#222" stroke-width="2"/></svg>';
  const moonSVGWhite = moonSVG.replace(/#222/g, '#fff');
  const sunSVGWhite = sunSVG.replace(/#222/g, '#fff');
  function setNightMode(on) {
    if (on) {
      document.body.classList.add('night-mode');
      nightIcon.innerHTML = sunSVGWhite;
      nightBtn.title = '切换为日间模式';
      localStorage.setItem('nightMode', 'on');
    } else {
      document.body.classList.remove('night-mode');
      nightIcon.innerHTML = moonSVG;
      nightBtn.title = '切换为夜间模式';
      localStorage.setItem('nightMode', 'off');
    }
  }
  // 读取本地存储
  const nightPref = localStorage.getItem('nightMode');
  setNightMode(nightPref === 'on');
  nightBtn.onclick = function() {
    setNightMode(!document.body.classList.contains('night-mode'));
  };
}); 