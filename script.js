document.getElementById('jsonFile').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const orders = JSON.parse(e.target.result);
            processData(orders);
        } catch (error) {
            alert('잘못된 JSON 파일입니다.');
            console.error("JSON 파싱 오류:", error);
        }
    };
    reader.readAsText(file);
});

function cleanPrice(priceStr) {
    if (typeof priceStr !== 'string') return 0;
    // 숫자 이외의 모든 문자(₩, ,, $, US 등)를 제거합니다.
    return parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 0;
}

function processData(orders) {
    let trickcalData = [];
    
    orders.forEach(item => {
        const order = item.orderHistory;
        if (!order || !order.lineItem || order.lineItem.length === 0) return;

        const title = order.lineItem[0].doc.title || "";
        if (title.includes("트릭컬 리바이브")) {
            const price = cleanPrice(order.totalPrice);
            const refund = cleanPrice(order.refundAmount);
            const netPrice = price - refund;

            // 'Z'를 제거하여 모든 브라우저에서 호환되도록 함
            const date = new Date(order.creationTime.replace('Z', ''));

            trickcalData.push({
                date: date,
                title: title,
                price: netPrice
            });
        }
    });

    // 날짜순으로 정렬
    trickcalData.sort((a, b) => a.date - b.date);
    
    displaySummary(trickcalData);
    displayMonthlyReport(trickcalData);
    displayFullHistory(trickcalData);
}

function displaySummary(data) {
    const totalSpent = data.reduce((sum, item) => sum + item.price, 0);
    const summaryDiv = document.getElementById('summary');
    summaryDiv.innerHTML = `총 결제 금액: <strong>₩${totalSpent.toLocaleString()}</strong>`;
}

function displayMonthlyReport(data) {
    const monthlyTotals = {};
    data.forEach(item => {
        const month = item.date.getFullYear() + '-' + String(item.date.getMonth() + 1).padStart(2, '0');
        if (!monthlyTotals[month]) {
            monthlyTotals[month] = 0;
        }
        monthlyTotals[month] += item.price;
    });

    const table = document.getElementById('monthly-table');
    let tableHTML = `<thead><tr><th>연월</th><th>결제 금액</th></tr></thead><tbody>`;
    for (const month in monthlyTotals) {
        tableHTML += `<tr><td>${month}</td><td>₩${monthlyTotals[month].toLocaleString()}</td></tr>`;
    }
    tableHTML += `</tbody>`;
    table.innerHTML = tableHTML;
}

function displayFullHistory(data) {
    const table = document.getElementById('details-table');
    let tableHTML = `<thead><tr><th>날짜</th><th>상품명</th><th>결제 금액</th></tr></thead><tbody>`;
    data.forEach(item => {
        tableHTML += `
            <tr>
                <td>${item.date.toISOString().split('T')[0]}</td>
                <td>${item.title}</td>
                <td>₩${item.price.toLocaleString()}</td>
            </tr>
        `;
    });
    tableHTML += `</tbody>`;
    table.innerHTML = tableHTML;
}