/* 电子扫盲 02 · 页面交互
   - 阅读进度条 / 目录高亮
   - 投影大字模式（记忆状态）
   - 清单勾选（本地记忆 + 计数 + 重置）
   - 视频点击后再加载 B 站播放器
   全部逻辑都在 try/catch 内降级，file:// 打开也不报错。 */
(() => {
  'use strict';

  const CHECK_KEY = 'dzsm02.checks';
  const PROJECTOR_KEY = 'dzsm02.projector';

  const storage = {
    get(key, fallback) {
      try {
        const raw = window.localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (err) {
        return fallback;
      }
    },
    set(key, value) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (err) {
        /* 隐私模式或 file:// 限制，静默降级 */
      }
    },
    remove(key) {
      try {
        window.localStorage.removeItem(key);
      } catch (err) {
        /* 忽略 */
      }
    }
  };

  /* ---------- 阅读进度 ---------- */
  const progress = document.getElementById('progress');
  const updateProgress = () => {
    if (!progress) return;
    const root = document.documentElement;
    const max = root.scrollHeight - root.clientHeight;
    progress.style.width = (max > 0 ? (root.scrollTop / max) * 100 : 0) + '%';
  };

  /* ---------- 目录高亮 ---------- */
  const tocLinks = Array.from(document.querySelectorAll('.toc a[href^="#"]'));
  const targets = tocLinks
    .map((link) => document.getElementById(link.getAttribute('href').slice(1)))
    .filter(Boolean);

  const updateSpy = () => {
    if (!targets.length) return;
    const line = 96;
    let current = targets[0].id;
    targets.forEach((el) => {
      if (el.getBoundingClientRect().top <= line) current = el.id;
    });
    tocLinks.forEach((link) => {
      const active = link.getAttribute('href') === '#' + current;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      updateProgress();
      updateSpy();
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  updateProgress();
  updateSpy();

  /* ---------- 投影大字模式 ---------- */
  const projectorBtn = document.getElementById('toggle-projector');
  const setProjector = (on) => {
    document.body.classList.toggle('projector', on);
    if (projectorBtn) projectorBtn.setAttribute('aria-pressed', String(on));
    storage.set(PROJECTOR_KEY, on);
  };
  setProjector(storage.get(PROJECTOR_KEY, false) === true);
  if (projectorBtn) {
    projectorBtn.addEventListener('click', () => {
      setProjector(!document.body.classList.contains('projector'));
    });
  }

  /* ---------- 打印 / 导出 PDF ---------- */
  const printBtn = document.getElementById('print-page');
  if (printBtn) printBtn.addEventListener('click', () => window.print());

  /* ---------- 清单勾选 ---------- */
  const boxes = Array.from(document.querySelectorAll('.checklist input.box'));
  const saved = storage.get(CHECK_KEY, {});
  const groupCounters = new Map();

  boxes.forEach((box) => {
    const list = box.closest('.checklist');
    const section = box.closest('section');
    const base = (section && section.id) || 'misc';
    const index = groupCounters.get(list) || 0;
    groupCounters.set(list, index + 1);
    const key = base + ':' + index;
    box.dataset.checkKey = key;
    if (saved && saved[key] === true) box.checked = true;
  });

  const summaries = new Map();
  document.querySelectorAll('.checklist').forEach((list) => {
    const p = document.createElement('p');
    p.className = 'check-summary';
    p.setAttribute('aria-live', 'polite');
    list.insertAdjacentElement('afterend', p);
    summaries.set(list, p);
  });

  const refresh = () => {
    summaries.forEach((p, list) => {
      const all = list.querySelectorAll('input.box');
      const done = list.querySelectorAll('input.box:checked');
      p.textContent = '已完成 ' + done.length + ' / ' + all.length;
    });
  };

  const persist = () => {
    const state = {};
    boxes.forEach((box) => {
      if (box.checked) state[box.dataset.checkKey] = true;
    });
    storage.set(CHECK_KEY, state);
    refresh();
  };

  boxes.forEach((box) => box.addEventListener('change', persist));
  refresh();

  const resetBtn = document.getElementById('reset-checks');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (!window.confirm('确定清除本机保存的勾选记录吗？')) return;
      boxes.forEach((box) => {
        box.checked = false;
      });
      storage.remove(CHECK_KEY);
      refresh();
    });
  }

  /* ---------- 视频懒加载 ---------- */
  document.querySelectorAll('.video[data-bvid]').forEach((box) => {
    const placeholder = box.querySelector('.video-ph');
    if (!placeholder) return;
    const cover = box.getAttribute('data-cover');
    if (cover) {
      placeholder.classList.add('has-cover');
      placeholder.style.backgroundImage = "url('" + cover + "')";
    }
    const load = () => {
      const bvid = box.getAttribute('data-bvid');
      const title = box.getAttribute('data-title') || bvid;
      const wrap = document.createElement('div');
      wrap.className = 'ratio';
      const iframe = document.createElement('iframe');
      iframe.src =
        'https://player.bilibili.com/player.html?bvid=' +
        encodeURIComponent(bvid) +
        '&page=1&high_quality=1&danmaku=0&autoplay=0';
      iframe.title = title;
      iframe.loading = 'lazy';
      iframe.allow = 'autoplay; fullscreen; picture-in-picture';
      iframe.setAttribute('allowfullscreen', '');
      wrap.appendChild(iframe);
      placeholder.replaceWith(wrap);
    };
    placeholder.addEventListener('click', load);
    placeholder.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        load();
      }
    });
  });

  /* ---------- 快捷键 P ---------- */
  document.addEventListener('keydown', (event) => {
    if (event.defaultPrevented || event.ctrlKey || event.altKey || event.metaKey) return;
    const el = event.target;
    const typing =
      el &&
      (el.tagName === 'INPUT' ||
        el.tagName === 'TEXTAREA' ||
        el.tagName === 'SELECT' ||
        el.isContentEditable);
    if (typing) return;
    if (event.key === 'p' || event.key === 'P') {
      setProjector(!document.body.classList.contains('projector'));
    }
  });
})();
