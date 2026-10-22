// Mobile navigation
(function () {
  var btn = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();

// Hero waves — kept from the original arlensunday.com page
(function () {
  var canvas = document.getElementById('waves');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var width, height, waves = [];
  var colors = ['rgba(80,255,180,0.07)', 'rgba(0,180,255,0.07)', 'rgba(180,80,255,0.07)'];

  function resize() {
    var r = canvas.getBoundingClientRect();
    width = canvas.width = r.width;
    height = canvas.height = r.height;
    waves = [];
    for (var i = 0; i < 6; i++) {
      waves.push({
        yOffset: height * 0.35 + i * 22,
        speed: 0.0006 + Math.random() * 0.0012,
        amplitude: 30 + Math.random() * 30,
        phase: Math.random() * Math.PI * 2,
        color: colors[i % colors.length]
      });
    }
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);
    waves.forEach(function (w) {
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (var x = 0; x <= width; x += 10) {
        ctx.lineTo(x, w.yOffset + Math.sin(x * 0.01 + time * w.speed + w.phase) * w.amplitude);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = w.color;
      ctx.fill();
    });
    if (!reduce) requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);
})();

// Personal constitution: components, bars and the hours tool
var COMPONENTS = [
  { key: 'work',     group: 'Дело',  name: 'Работа и дело',       hint: 'всё, что приносит деньги', color: '#2f5d9e' },
  { key: 'care',     group: 'Дело',  name: 'Забота о других',     hint: 'помощь родителям, детям, друзьям', color: '#5b8bd0' },
  { key: 'family',   group: 'Люди',  name: 'Семья',               hint: 'время вместе, разговоры, общие дела', color: '#d9822b' },
  { key: 'friends',  group: 'Люди',  name: 'Друзья и общество',   hint: 'встречи, звонки, община', color: '#e3a83e' },
  { key: 'health',   group: 'Себе',  name: 'Здоровье',            hint: 'спорт, прогулки, врачи', color: '#3f9a6b' },
  { key: 'rest',     group: 'Себе',  name: 'Отдых',               hint: 'восстановление, ничего не делать', color: '#6fb88e' },
  { key: 'fun',      group: 'Себе',  name: 'Развлечения',         hint: 'кино, игры, поездки', color: '#9aa84a' },
  { key: 'hobby',    group: 'Себе',  name: 'Интересы и хобби',    hint: 'то, что просто интересно', color: '#8a6cc9' },
  { key: 'creative', group: 'Себе',  name: 'Творчество',          hint: 'стихи, музыка, книга, руками', color: '#c25b8a' },
  { key: 'nature',   group: 'Мир',   name: 'Природа и животные',  hint: 'лес, океан, собака', color: '#2a9d9f' },
  { key: 'study',    group: 'Мир',   name: 'Учёба и рост',        hint: 'книги, курсы, новое', color: '#6d7fa3' },
  { key: 'chores',   group: 'Быт',   name: 'Быт и дорога',        hint: 'уборка, магазины, бумажки, пробки', color: '#a39d92' }
];

function renderBars(container, rows, opts) {
  opts = opts || {};
  container.innerHTML = '';
  rows.forEach(function (row) {
    var shown = COMPONENTS.filter(function (c) { return !(opts.hideChores && c.key === 'chores'); });
    var total = shown.reduce(function (s, c) { return s + (Number(row.values[c.key]) || 0); }, 0);
    var r = document.createElement('div');
    r.className = 'bar-row';
    var label = document.createElement('div');
    label.className = 'bar-label';
    label.textContent = row.label;
    var bar = document.createElement('div');
    bar.className = 'bar';
    bar.setAttribute('role', 'img');
    var desc = [];
    shown.forEach(function (c) {
      var v = Number(row.values[c.key]) || 0;
      if (!v || !total) return;
      var pct = Math.round(v / total * 100);
      var s = document.createElement('span');
      s.style.width = (v / total * 100) + '%';
      s.style.background = c.color;
      s.title = c.name + ': ' + pct + '%';
      if (pct >= 8) s.textContent = pct + '%';
      bar.appendChild(s);
      desc.push(c.name + ' ' + pct + '%');
    });
    bar.setAttribute('aria-label', row.label + ': ' + (desc.join(', ') || 'нет данных'));
    r.appendChild(label);
    r.appendChild(bar);
    container.appendChild(r);
  });
}

function renderLegend(container, hideChores) {
  container.innerHTML = COMPONENTS
    .filter(function (c) { return !(hideChores && c.key === 'chores'); })
    .map(function (c) { return '<span><i style="background:' + c.color + '"></i>' + c.name + '</span>'; })
    .join('');
}

// Arlen's example. Placeholder figures until his questionnaire answers arrive.
(function () {
  var el = document.getElementById('arlen-bars');
  if (!el) return;
  renderBars(el, [
    { label: 'До пожара', values: { work: 70, care: 3, family: 12, friends: 4, health: 2, rest: 5, fun: 3, nature: 1 } },
    { label: 'Сейчас',    values: { work: 40, care: 8, family: 15, friends: 6, health: 5, rest: 6, fun: 4, hobby: 3, creative: 8, nature: 3, study: 2 } },
    { label: 'Хочу',      values: { work: 25, care: 10, family: 18, friends: 8, health: 9, rest: 8, fun: 4, hobby: 3, creative: 8, nature: 5, study: 2 } }
  ], { hideChores: true });
  var lg = document.getElementById('arlen-legend');
  if (lg) renderLegend(lg, true);
})();

// The hours tool. Everything stays in this browser.
(function () {
  var form = document.getElementById('hours-form');
  if (!form) return;
  var STORE = 'constitution-hours-v1';
  var SNAPS = [
    { key: 'before', label: 'Раньше' },
    { key: 'now', label: 'Сейчас' },
    { key: 'want', label: 'Хочу' }
  ];
  var data = { before: {}, now: {}, want: {} };
  try {
    var saved = JSON.parse(localStorage.getItem(STORE));
    if (saved) data = Object.assign(data, saved);
  } catch (e) {}
  var current = 'now';

  var tabs = document.getElementById('hours-tabs');
  SNAPS.forEach(function (s) {
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.dataset.snap = s.key;
    b.textContent = s.label;
    b.addEventListener('click', function () { current = s.key; sync(); });
    tabs.appendChild(b);
  });

  var fields = document.getElementById('hours-fields');
  var lastGroup = null;
  COMPONENTS.forEach(function (c) {
    if (c.group !== lastGroup) {
      var g = document.createElement('div');
      g.className = 'group-title';
      g.textContent = c.group;
      fields.appendChild(g);
      lastGroup = c.group;
    }
    var f = document.createElement('div');
    f.className = 'field';
    f.innerHTML = '<label for="h-' + c.key + '">' + c.name + '<small>' + c.hint + '</small></label>' +
      '<input id="h-' + c.key + '" type="number" inputmode="numeric" min="0" max="168" step="1" placeholder="0" data-key="' + c.key + '">';
    fields.appendChild(f);
  });

  fields.addEventListener('input', function (e) {
    var k = e.target.dataset.key;
    if (!k) return;
    var v = e.target.value === '' ? '' : Math.max(0, Number(e.target.value));
    data[current][k] = v;
    try { localStorage.setItem(STORE, JSON.stringify(data)); } catch (err) {}
    update();
  });

  var totalEl = document.getElementById('hours-total');
  var barsEl = document.getElementById('hours-bars');
  var hideChores = document.getElementById('hide-chores');
  if (hideChores) hideChores.addEventListener('change', update);

  function sync() {
    tabs.querySelectorAll('button').forEach(function (b) {
      b.setAttribute('aria-selected', b.dataset.snap === current ? 'true' : 'false');
    });
    fields.querySelectorAll('input').forEach(function (i) {
      var v = data[current][i.dataset.key];
      i.value = v === undefined ? '' : v;
    });
    update();
  }

  function update() {
    var sum = COMPONENTS.reduce(function (s, c) { return s + (Number(data[current][c.key]) || 0); }, 0);
    totalEl.textContent = 'Заполнено: ' + sum + ' ч из ~119 часов бодрствования в неделю';
    totalEl.classList.toggle('over', sum > 126);
    var hide = hideChores && hideChores.checked;
    renderBars(barsEl, SNAPS.map(function (s) { return { label: s.label, values: data[s.key] }; }), { hideChores: hide });
    var lg = document.getElementById('hours-legend');
    if (lg) renderLegend(lg, hide);
  }

  var reset = document.getElementById('hours-reset');
  if (reset) reset.addEventListener('click', function () {
    data = { before: {}, now: {}, want: {} };
    try { localStorage.removeItem(STORE); } catch (e) {}
    sync();
  });

  sync();
})();

// Jubilee banner: visible until the end of November 2026, then hides itself.
(function () {
  var el = document.getElementById('jubilee');
  if (!el) return;
  if (new Date() >= new Date(2026, 11, 1)) el.hidden = true;
})();
