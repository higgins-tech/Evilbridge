const COINS = [
    'bitcoin', 'ethereum', 'tether', 'binancecoin', 'solana',
    'ripple', 'usd-coin', 'staked-ether', 'dogecoin', 'cardano',
    'avalanche-2', 'chainlink', 'shiba-inu', 'polkadot', 'tron',
    'wrapped-bitcoin', 'near', 'litecoin', 'polygon', 'uniswap'
];

async function loadMarketData() {
    const ids = COINS.join(',');
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h`;
    try {
        const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
        if (!res.ok) throw new Error('err');
        const data = await res.json();
        renderTicker(data);
    } catch (e) {
        renderTickerFallback();
    }
}

function getClientPlatform() {
    var userAgent = window.navigator.userAgent,
        platform = window.navigator?.userAgentData?.platform || window.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'],
        os = null;

    if (macosPlatforms.indexOf(platform) !== -1) {
        os = 'Mac OS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
        os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
        os = 'Windows';
    } else if (/Android/.test(userAgent)) {
        os = 'Android';
    } else if (!os && /Linux/.test(platform)) {
        os = 'Linux';
    }

    return os || 'Unknown OS';
}

function formatPrice(p) {
    if (p >= 1000) return '$' + p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (p >= 1) return '$' + p.toFixed(4);
    if (p >= 0.01) return '$' + p.toFixed(5);
    return '$' + p.toFixed(8);
}

function buildTickerItem(coin) {
    const change = coin.price_change_percentage_24h ?? 0;
    const dir = change >= 0 ? 'up' : 'down';
    const arrow = change >= 0 ? '▲' : '▼';
    const priceFmt = formatPrice(coin.current_price);
    const changeFmt = arrow + ' ' + Math.abs(change).toFixed(2) + '%';
    return `
      <div class="ticker-item" onclick="window.open('https://coinmarketcap.com/currencies/${coin.id}/', '_blank')" style="cursor: pointer;" title="View ${coin.name || coin.symbol} on CoinMarketCap">
        <img class="ticker-coin-logo" src="${coin.image}" alt="${coin.symbol}" loading="lazy"
          onerror="this.style.display='none'" />
        <span class="ticker-symbol">${coin.symbol.toUpperCase()}</span>
        <span class="ticker-price">${priceFmt}</span>
        <span class="ticker-change ${dir}">${changeFmt}</span>
      </div>`;
}

function renderTicker(data) {
    const track = document.getElementById('tickerTrack');
    if (!track) return;
    if (!data || !data.length) { renderTickerFallback(); return; }
    let html = data.map(buildTickerItem).join('');
    html = html + html;
    track.innerHTML = html;
    const totalWidth = track.scrollWidth / 2;
    track.style.animationDuration = Math.max(30, totalWidth / 80) + 's';
}

function renderTickerFallback() {
    const fallback = [
        { id: 'bitcoin', symbol: 'BTC', price: '$64,210.00', change: '+1.24%', dir: 'up' },
        { id: 'ethereum', symbol: 'ETH', price: '$3,122.50', change: '-0.87%', dir: 'down' },
        { id: 'solana', symbol: 'SOL', price: '$142.33', change: '+3.11%', dir: 'up' },
        { id: 'binancecoin', symbol: 'BNB', price: '$588.20', change: '+0.55%', dir: 'up' },
        { id: 'ripple', symbol: 'XRP', price: '$0.5242', change: '-1.02%', dir: 'down' },
        { id: 'cardano', symbol: 'ADA', price: '$0.4410', change: '+0.34%', dir: 'up' },
        { id: 'dogecoin', symbol: 'DOGE', price: '$0.1621', change: '-2.10%', dir: 'down' },
        { id: 'polkadot', symbol: 'DOT', price: '$7.88', change: '+0.90%', dir: 'up' },
        { id: 'polygon', symbol: 'MATIC', price: '$0.7700', change: '+1.45%', dir: 'up' },
        { id: 'chainlink', symbol: 'LINK', price: '$14.22', change: '-0.60%', dir: 'down' },
    ];
    const track = document.getElementById('tickerTrack');
    if (!track) return;
    let html = fallback.map(c => `
      <div class="ticker-item" onclick="window.open('https://coinmarketcap.com/currencies/${c.id}/', '_blank')" style="cursor: pointer;" title="View ${c.symbol} on CoinMarketCap">
        <span class="ticker-symbol">${c.symbol}</span>
        <span class="ticker-price">${c.price}</span>
        <span class="ticker-change ${c.dir}">${c.change}</span>
      </div>`).join('');
    track.innerHTML = html + html;
}

loadMarketData();
setInterval(loadMarketData, 60000);

(function () {
    const img = document.getElementById('cmcLogoImg');
    const hint = document.getElementById('cmcHintText');
})();

function handleSubscribe() {
    const input = document.getElementById('emailInput');
    const feedback = document.getElementById('subFeedback');
    const email = input.value.trim();
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRx.test(email)) {
        input.style.borderColor = 'var(--red)';
        input.focus();
        setTimeout(() => input.style.borderColor = '', 1500);
        return;
    }

    input.value = '';
    feedback.style.display = 'block';
    setTimeout(() => { feedback.style.display = 'none'; }, 4000);
}

const emailInputEl = document.getElementById('emailInput');
if (emailInputEl) {
    emailInputEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') handleSubscribe();
    });
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.style.opacity = '1';
            e.target.style.transform = 'translateY(0)';
            observer.unobserve(e.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.feature-btn, .about-left, .about-right, .subscribe-text-col, .subscribe-form-col').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    observer.observe(el);
});

document.querySelectorAll('.feature-btn').forEach((btn, i) => {
    btn.style.transitionDelay = (i * 30) + 'ms';
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.style.transitionDelay = (entry.target.dataset.delay || 0) + 'ms';
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach((el) => {
    revealObserver.observe(el);
});

document.querySelectorAll('.chain-card').forEach((el, i) => { el.dataset.delay = i * 60; });
document.querySelectorAll('.protocol-chip').forEach((el, i) => { el.dataset.delay = i * 40; });
document.querySelectorAll('.step-card').forEach((el, i) => { el.dataset.delay = i * 80; });
document.querySelectorAll('.stat-item').forEach((el, i) => { el.dataset.delay = i * 100; });
