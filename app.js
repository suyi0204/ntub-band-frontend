// 後端 API 基礎 URL - 部署後需要更新這個網址
let API_BASE_URL = 'https://您的後端服務名稱.up.railway.app';

// 系統狀態檢查
async function checkSystemStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/health`);
        const data = await response.json();
        
        document.getElementById('backend-status').innerHTML = 
            `<span style="color: #10b981;">✅ 正常運作</span><br>
             <small>服務: ${data.service}</small>`;
        
        // 更新郵件狀態顯示
        document.getElementById('email-status').innerHTML = 
            `<span style="color: #10b981;">✅ 就緒</span><br>
             <small>發件人: ${data.environment === 'Railway' ? 'Railway 環境' : '本地環境'}</small>`;
        
        return true;
    } catch (error) {
        document.getElementById('backend-status').innerHTML = 
            `<span style="color: #ef4444;">❌ 連線失敗</span><br>
             <small>${error.message}</small>`;
        return false;
    }
}

// 發送郵件測試
async function sendTestEmail(emailData) {
    const resultDiv = document.getElementById('testResults');
    const resultId = 'result-' + Date.now();
    
    const resultItem = document.createElement('div');
    resultItem.className = 'result-item';
    resultItem.id = resultId;
    
    const timestamp = new Date().toLocaleString('zh-TW');
    resultItem.innerHTML = `
        <div class="result-header">
            <span class="result-title">${emailData.type} - ${emailData.notification_type}</span>
            <span class="result-time">${timestamp}</span>
        </div>
        <div class="result-message">
            <i class="fas fa-spinner fa-spin"></i> 發送中...
        </div>
    `;
    
    resultDiv.insertBefore(resultItem, resultDiv.firstChild);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/send-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            resultItem.className = 'result-item success';
            resultItem.innerHTML = `
                <div class="result-header">
                    <span class="result-title">${emailData.type} - ${emailData.notification_type}</span>
                    <span class="result-time">${timestamp}</span>
                </div>
                <div class="result-message">
                    <i class="fas fa-check-circle" style="color: #10b981;"></i> 
                    郵件發送成功！<br>
                    <small>收件人: ${emailData.to}</small><br>
                    <small>訊息 ID: ${data.messageId}</small>
                </div>
            `;
        } else {
            throw new Error(data.error || '發送失敗');
        }
        
    } catch (error) {
        resultItem.className = 'result-item error';
        resultItem.innerHTML = `
            <div class="result-header">
                <span class="result-title">${emailData.type} - ${emailData.notification_type}</span>
                <span class="result-time">${timestamp}</span>
            </div>
            <div class="result-message">
                <i class="fas fa-exclamation-circle" style="color: #ef4444;"></i> 
                發送失敗: ${error.message}<br>
                <small>收件人: ${emailData.to}</small>
            </div>
        `;
    }
}

// 測試函數
function testUserRegistration() {
    const emailData = {
        to: '11056046@ntub.edu.tw',
        type: 'admin',
        notification_type: 'user_registration',
        data: {
            real_name: '王小明',
            student_id: '11056046',
            user_email: '11056046@ntub.edu.tw',
            phone: '0912-345-678',
            timestamp: new Date().toLocaleString('zh-TW')
        }
    };
    sendTestEmail(emailData);
}

function testNewBooking() {
    const emailData = {
        to: '11056046@ntub.edu.tw',
        type: 'admin',
        notification_type: 'new_booking',
        data: {
            real_name: '王小明',
            user_email: '11056046@ntub.edu.tw',
            booking_date: '2024-01-15',
            booking_time: '14:00-16:00',
            booking_type: '個人練習',
            booking_name: '吉他練習',
            booking_notes: '需要借用音箱',
            timestamp: new Date().toLocaleString('zh-TW')
        }
    };
    sendTestEmail(emailData);
}

function testApprovalResult() {
    const emailData = {
        to: '11056046@ntub.edu.tw',
        type: 'user',
        notification_type: 'approval_result',
        data: {
            real_name: '王小明',
            student_id: '11056046',
            approval_status: 'approved',
            admin_notes: '',
            timestamp: new Date().toLocaleString('zh-TW')
        }
    };
    sendTestEmail(emailData);
}

function testBookingConfirmation() {
    const emailData = {
        to: '11056046@ntub.edu.tw',
        type: 'user',
        notification_type: 'booking_confirmation',
        data: {
            real_name: '王小明',
            booking_date: '2024-01-15',
            booking_time: '14:00-16:00',
            booking_type: '個人練習',
            booking_name: '吉他練習',
            booking_notes: '需要借用音箱',
            booking_id: 'BK20240115001',
            timestamp: new Date().toLocaleString('zh-TW')
        }
    };
    sendTestEmail(emailData);
}

function sendCustomTest() {
    const emailType = document.getElementById('emailType').value;
    const recipientEmail = document.getElementById('recipientEmail').value;
    
    if (!recipientEmail) {
        alert('請輸入收件人郵箱地址');
        return;
    }
    
    let emailData;
    
    switch (emailType) {
        case 'user_registration':
            emailData = {
                to: recipientEmail,
                type: 'admin',
                notification_type: 'user_registration',
                data: {
                    real_name: '測試用戶',
                    student_id: '11000000',
                    user_email: recipientEmail,
                    phone: '09XX-XXX-XXX',
                    timestamp: new Date().toLocaleString('zh-TW')
                }
            };
            break;
            
        case 'new_booking':
            emailData = {
                to: recipientEmail,
                type: 'admin',
                notification_type: 'new_booking',
                data: {
                    real_name: '測試用戶',
                    user_email: recipientEmail,
                    booking_date: new Date().toLocaleDateString('zh-TW'),
                    booking_time: '10:00-12:00',
                    booking_type: '測試預約',
                    booking_name: '系統測試',
                    booking_notes: '這是一封測試郵件',
                    timestamp: new Date().toLocaleString('zh-TW')
                }
            };
            break;
            
        case 'approval_result':
            emailData = {
                to: recipientEmail,
                type: 'user',
                notification_type: 'approval_result',
                data: {
                    real_name: '測試用戶',
                    student_id: '11000000',
                    approval_status: 'approved',
                    admin_notes: '',
                    timestamp: new Date().toLocaleString('zh-TW')
                }
            };
            break;
            
        case 'booking_confirmation':
            emailData = {
                to: recipientEmail,
                type: 'user',
                notification_type: 'booking_confirmation',
                data: {
                    real_name: '測試用戶',
                    booking_date: new Date().toLocaleDateString('zh-TW'),
                    booking_time: '14:00-16:00',
                    booking_type: '測試預約',
                    booking_name: '系統測試',
                    booking_notes: '這是一封測試郵件',
                    booking_id: 'TEST' + Date.now(),
                    timestamp: new Date().toLocaleString('zh-TW')
                }
            };
            break;
    }
    
    sendTestEmail(emailData);
}

// 頁面載入時初始化
document.addEventListener('DOMContentLoaded', function() {
    checkSystemStatus();
    
    // 每30秒檢查一次系統狀態
    setInterval(checkSystemStatus, 30000);
});