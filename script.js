// 전역 변수로 데이터 저장
let allTrickcalData = [];

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
    return parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 0;
}

function processData(orders) {
    // 전역 변수 초기화
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

            allTrickcalData.push({
                date: date,
                title: title,
                price: netPrice
            });
        }
    });

    allTrickcalData.sort((a, b) => a.date - b.date);
    
    displaySummary(allTrickcalData);
    displayDailyReport(allTrickcalData);
    displayPassReport(allTrickcalData);
    displayMonthlyReport(allTrickcalData);
    displayFullHistory(allTrickcalData); // 처음에는 전체 내역 표시
    setupFilterControls(); // 필터 버튼 기능 설정
}

function displaySummary(data) {
    const totalSpent = data.reduce((sum, item) => sum + item.price, 0);
    const summaryDiv = document.getElementById('summary');
    summaryDiv.innerHTML = `총 결제 금액: <strong>₩${totalSpent.toLocaleString()}</strong>`;
}

function displayDailyReport(data) {
    const dailyItems = [
        "데일리 왕사탕 공물",
        "데일리 엘리프 공물",
        "데일리 별사탕 공물"
    ];

    const dailyTotal = data
        .filter(item => dailyItems.some(daily => item.title.includes(daily)))
        .reduce((sum, item) => sum + item.price, 0);

    const dailySummaryDiv = document.getElementById('daily-summary');
    dailySummaryDiv.innerHTML = `데일리 3종(왕사탕, 엘리프, 별사탕) 총 결제액: <strong>₩${dailyTotal.toLocaleString()}</strong>`;
    dailySummaryDiv.style.display = 'block';
}

function displayPassReport(data) {
    const passTotal = data
        .filter(item => item.title.includes("리바이브 패스") || item.title.includes("트릭컬 패스"))
        .reduce((sum, item) => sum + item.price, 0);

    const passSummaryDiv = document.getElementById('pass-summary');
    passSummaryDiv.innerHTML = `리바이브/트릭컬 패스 총 결제액: <strong>₩${passTotal.toLocaleString()}</strong>`;
    passSummaryDiv.style.display = 'block';
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
    const sortedMonths = Object.keys(monthlyTotals).sort();
    
    sortedMonths.forEach(month => {
        tableHTML += `<tr><td>${month}</td><td>₩${monthlyTotals[month].toLocaleString()}</td></tr>`;
    });

    tableHTML += `</tbody>`;
    table.innerHTML = tableHTML;
}

// displayFullHistory 함수는 이제 어떤 데이터든 받아서 테이블을 그리는 역할만 함
function displayFullHistory(data) {
    const table = document.getElementById('details-table');
    let tableHTML = `<thead><tr><th>날짜</th><th>상품명</th><th>결제 금액</th></tr></thead><tbody>`;
    if(data.length === 0){
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
    tableHTML += `</tbody>`;
    table.innerHTML = tableHTML;
}

function setupFilterControls() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // 모든 버튼에서 active 클래스 제거
            buttons.forEach(btn => btn.classList.remove('active'));
            // 클릭된 버튼에 active 클래스 추가
            button.classList.add('active');

            const filter = button.dataset.filter;
            let filteredData = [];

            if (filter === 'all') {
                filteredData = allTrickcalData;
            } else if (filter === '패스') {
                filteredData = allTrickcalData.filter(item => 
                    item.title.includes("리바이브 패스") || item.title.includes("트릭컬 패스")
                );
            } else {
                filteredData = allTrickcalData.filter(item => item.title.includes(filter));
            }
            
            displayFullHistory(filteredData);
        });
    });
}

// 페이지 로드 시 요약 섹션 숨기기
document.getElementById('daily-summary').style.display = 'none';
document.getElementById('pass-summary').style.display = 'none';