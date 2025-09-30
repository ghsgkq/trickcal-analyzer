// 전역 변수로 데이터 저장
let allTrickcalData = [];

document.getElementById('jsonFile').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

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
    return parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 0;
}

function processData(orders) {
    allTrickcalData = [];
    orders.forEach(item => {
        const order = item.orderHistory;
        if (!order || !order.lineItem || order.lineItem.length === 0) return;

        const title = order.lineItem[0].doc.title || "";
        if (title.includes("트릭컬 리바이브")) {
            const price = cleanPrice(order.totalPrice);
            const refund = cleanPrice(order.refundAmount);
            const netPrice = price - refund;
            const date = new Date(order.creationTime.replace('Z', ''));
            allTrickcalData.push({ date, title, price: netPrice });
        }
    });

    allTrickcalData.sort((a, b) => a.date - b.date);
    
    displaySummary(allTrickcalData);
    displayDailyReport(allTrickcalData);
    displayPassReport(allTrickcalData);
    displaySashikPassReport(allTrickcalData);
    displayMonthlyReport(allTrickcalData);
    displayFullHistory(allTrickcalData);
    setupEventListeners();
}

function displaySummary(data) {
    const totalSpent = data.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('summary').innerHTML = `총 결제 금액: <strong>₩${totalSpent.toLocaleString()}</strong>`;
}

function displayDailyReport(data) {
    const dailyItems = ["데일리 왕사탕 공물", "데일리 엘리프 공물", "데일리 별사탕 공물"];
    const dailyTotal = data
        .filter(item => dailyItems.some(daily => item.title.includes(daily)))
        .reduce((sum, item) => sum + item.price, 0);
    const dailySummaryDiv = document.getElementById('daily-summary');
    dailySummaryDiv.innerHTML = `데일리 3종(왕사탕, 엘리프, 별사탕) 총 결제액: <strong>₩${dailyTotal.toLocaleString()}</strong>`;
    dailySummaryDiv.style.display = 'block';
}

function displayPassReport(data) {
    const passKeywords = ["리바이브 패스", "트릭컬 패스"];
    const passTotal = data
        .filter(item => passKeywords.some(keyword => item.title.includes(keyword)))
        .reduce((sum, item) => sum + item.price, 0);
    const passSummaryDiv = document.getElementById('pass-summary');
    passSummaryDiv.innerHTML = `리바이브/트릭컬 패스 총 결제액: <strong>₩${passTotal.toLocaleString()}</strong>`;
    passSummaryDiv.style.display = 'block';
}

function displaySashikPassReport(data) {
    const sashikTotal = data
        .filter(item => item.title.includes("사복 패스"))
        .reduce((sum, item) => sum + item.price, 0);
    const sashikSummaryDiv = document.getElementById('sashik-pass-summary');
    sashikSummaryDiv.innerHTML = `사복 패스 총 결제액: <strong>₩${sashikTotal.toLocaleString()}</strong>`;
    sashikSummaryDiv.style.display = 'block';
}

function displayMonthlyReport(data) {
    const monthlyTotals = {};
    data.forEach(item => {
        const month = item.date.getFullYear() + '-' + String(item.date.getMonth() + 1).padStart(2, '0');
        monthlyTotals[month] = (monthlyTotals[month] || 0) + item.price;
    });

    const table = document.getElementById('monthly-table');
    let tableHTML = `<thead><tr><th>연월</th><th>결제 금액</th></tr></thead><tbody>`;
    const sortedMonths = Object.keys(monthlyTotals).sort();
    
    sortedMonths.forEach(month => {
        tableHTML += `<tr><td>${month}</td><td>₩${monthlyTotals[month].toLocaleString()}</td></tr>`;
    });
    table.innerHTML = tableHTML + `</tbody>`;

    displayMonthlyChart(monthlyTotals);
}

function displayMonthlyChart(monthlyData) {
    const chartContainer = document.getElementById('monthly-chart-container');
    const sortedMonths = Object.keys(monthlyData).sort();
    
    if(sortedMonths.length === 0) {
        chartContainer.innerHTML = '차트를 표시할 데이터가 없습니다.';
        return;
    }

    const amounts = sortedMonths.map(month => monthlyData[month]);
    const maxAmount = Math.max(...amounts, 1);

    let chartHTML = '';
    let lastYear = '';

    sortedMonths.forEach(month => {
        const amount = monthlyData[month];
        // 막대의 최대 높이를 90%로 제한하여 상단에 텍스트 공간 확보
        const barHeight = (amount / maxAmount) * 90; 
        
        const currentYear = month.substring(2, 4);
        const currentMonth = month.substring(5);
        
        let label = '';
        if (currentYear !== lastYear) {
            label = `${currentYear}년\n${currentMonth}월`;
            lastYear = currentYear;
        } else {
            label = `${currentMonth}월`;
        }

        chartHTML += `
            <div class="chart-bar-wrapper">
                <div class="chart-amount">₩${amount.toLocaleString()}</div>
                <div class="chart-bar" style="height: ${barHeight}%;" title="${month}: ₩${amount.toLocaleString()}"></div>
                <div class="chart-label">${label}</div>
            </div>
        `;
    });

    chartContainer.innerHTML = chartHTML;
}

function displayFullHistory(data) {
    const table = document.getElementById('details-table');
    let tableHTML = `<thead><tr><th>날짜</th><th>상품명</th><th>결제 금액</th></tr></thead><tbody>`;
    if (data.length === 0) {
        tableHTML += `<tr><td colspan="3" style="text-align:center;">표시할 내역이 없습니다.</td></tr>`;
    } else {
        data.forEach(item => {
            tableHTML += `
                <tr>
                    <td>${item.date.toISOString().split('T')[0]}</td>
                    <td>${item.title}</td>
                    <td>₩${item.price.toLocaleString()}</td>
                </tr>
            `;
        });
    }
    table.innerHTML = tableHTML + `</tbody>`;
}

function setupEventListeners() {
    const buttons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('search-input');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            searchInput.value = "";

            const filter = button.dataset.filter;
            let filteredData;
            
            if (filter === 'all') {
                filteredData = allTrickcalData;
            } else if (filter === 'pass_basic') {
                const passKeywords = ["리바이브 패스", "트릭컬 패스"];
                filteredData = allTrickcalData.filter(item => 
                    passKeywords.some(keyword => item.title.includes(keyword))
                );
            } else if (filter === 'pass_sashik') {
                filteredData = allTrickcalData.filter(item => item.title.includes("사복 패스"));
            } else {
                filteredData = allTrickcalData.filter(item => item.title.includes(filter));
            }
            displayFullHistory(filteredData);
        });
    });

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        if (searchTerm) {
            buttons.forEach(btn => btn.classList.remove('active'));
        } else {
            document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
        }

        const filteredData = allTrickcalData.filter(item => 
            item.title.toLowerCase().includes(searchTerm)
        );
        displayFullHistory(filteredData);
    });
}

// 페이지 로드 시 요약 섹션 숨기기
document.getElementById('daily-summary').style.display = 'none';
document.getElementById('pass-summary').style.display = 'none';
document.getElementById('sashik-pass-summary').style.display = 'none';