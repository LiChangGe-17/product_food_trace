const app = document.getElementById("app");
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

function getExpireDays(expireDate) {
    const now = new Date();
    const end = new Date(expireDate);
    const diff = end - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

fetch("products.json")
.then(res => res.json())
.then(data => {
    if (!id) {
        let html = `<div class="card"><div class="title">农产品溯源列表</div>`;
        data.forEach(item => {
            html += `<div class="list-item" onclick="location.href='?id=${item.id}'">${item.name}</div>`;
        });
        html += `</div>`;
        app.innerHTML = html;
        return;
    }

    const p = data.find(item => item.id === id);
    if (!p) {
        app.innerHTML = `<div class="card"><div class="title">未找到产品</div></div>`;
        return;
    }

    const days = getExpireDays(p.expireDate);

    let html = `
    <div class="card">
        <div class="title">食品溯源详情</div>
        <img src="${p.foodImg}" class="food-img">
        <div class="img-group">
            <img src="${p.originImg}">
            <img src="${p.testImg}">
        </div>
        <div class="safe-tag">✅ ${p.safeLevel}</div>

        <div class="info-row"><div class="label">食品名称</div><div class="value">${p.name}</div></div>
        <div class="info-row"><div class="label">产品编号</div><div class="value">${p.productNo}</div></div>
        <div class="info-row"><div class="label">生产批次</div><div class="value">${p.batch}</div></div>
        <div class="info-row"><div class="label">产地</div><div class="value">${p.origin}</div></div>
        <div class="info-row"><div class="label">生产日期</div><div class="value">${p.produceDate}</div></div>
        <div class="info-row"><div class="label">保质期至</div><div class="value">${p.expireDate}</div></div>
        <div class="info-row"><div class="label">剩余保质期</div><div class="value expire">${days} 天</div></div>
        <div class="info-row"><div class="label">检测结果</div><div class="value">${p.testResult}</div></div>
        <div class="info-row"><div class="label">防伪码</div><div class="value">${p.antiFakeCode}</div></div>

        <div style="margin-top:20px;font-weight:bold;color:#2d8cf0;">📦 物流溯源时间轴</div>
        <div class="timeline">
    `;

    p.logistics.forEach(item => {
        html += `
        <div class="time-item">
            <div class="time">${item.time}</div>
            <div>${item.info}</div>
        </div>`;
    });

    html += `
        </div>
        <div class="conclusion">✅ 溯源结论：${p.conclusion}</div>
    </div>`;

    app.innerHTML = html;
})
.catch(() => {
    app.innerHTML = `<div class="card"><div class="title">数据加载失败</div></div>`;
});