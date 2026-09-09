
    // =============================================================
    // 整合檔案：公告 ＋ 回家功課 (皆支援快取、摺疊與自動更新)
    // =============================================================

    (function () {
        'use strict';

    // ---------- 1. 公告系統 ----------
    document.addEventListener('DOMContentLoaded', function () {

                        // ============================================================
                        //  公告載入 + 快取機制 (優化載入速度)
                        // ============================================================

                        const url = 'https://script.google.com/macros/s/AKfycbxiSHa3UI3B-UMnoY1cBt1rvPGmXQZ42UqmRruz1gndc5-YkbEpBb74ppoTFEtZ0WP_kg/exec';
    const announcementList = document.getElementById('announcementList');
    const paginationEl = document.getElementById('announcementPagination');
    const loadingMessage = document.getElementById('loadingMessage');
    const updateStatus = document.getElementById('updateStatus');

    let announcements = [];
    const itemsPerPage = 5;
    let currentPage = 1;
    const CACHE_KEY = 'ailan_announcements';
    const CACHE_TIME_KEY = 'ailan_announcements_time';

    // ---- 輔助函式 ----
    function formatDate(dateStr) {
                            if (!dateStr) return '未標示日期';
    try {
                                const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
                            } catch (e) { return dateStr; }
                        }

    function linkify(text) {
                            if (!text) return '';
    return text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
                        }

    function parseContent(content) {
                            if (!content || content.trim() === '') return {title: '（無內容）', detail: '' };
                            const lines = content.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) return {title: '（無內容）', detail: '' };
    const title = lines[0].trim();
    const detail = lines.slice(1).join('\n');
    return {title, detail};
                        }

    function formatDetailText(detail) {
                            if (!detail || detail.trim() === '') return '<p class="announcement-detail-text" style="color:#999;">（無詳細內容）</p>';
                            const lines = detail.split('\n').filter(line => line.trim() !== '');
                            const isList = lines.some(line => /^[\s]*[-•]\s/.test(line));
    if (isList) {
        let html = '<ul class="announcement-detail-list">';
                                lines.forEach(line => {
                                    const cleaned = line.replace(/^[\s]*[-•]\s*/, '');
        const escaped = cleaned.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    html += `<li>${linkify(escaped)}</li>`;
                                });
    html += '</ul>';
return html;
                            } else {
    return lines.map(line => {
        const escaped = line.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return `<p class="announcement-detail-text">${linkify(escaped)}</p>`;
    }).join('');
}
                        }

// ---- 顯示公告列表（摺疊結構） ----
function showPage(page) {
    currentPage = page;
    const start = (page - 1) * itemsPerPage;
    const end = Math.min(start + itemsPerPage, announcements.length);
    const pageItems = announcements.slice(start, end);

    if (pageItems.length === 0) {
        announcementList.innerHTML = `<div class="text-center py-3 text-muted empty-announcement">📭 沒有公告</div>`;
        return;
    }

    let html = `<table class="announcement-table">`;
    pageItems.forEach((item, idx) => {
        const date = item.date || item.Date || item.日期 || '未標示日期';
        const content = item.content || item.Content || item.內容 || item.title || item.Title || '';
        const formattedDate = formatDate(date);
        const { title, detail } = parseContent(content);
        const safeTitle = title.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const detailHtml = formatDetailText(detail);
        const rowId = `ann-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 6)}`;

        html += `
                        <tr class="announcement-row" data-id="${rowId}">
                            <td class="col-date"><span class="date-tag"><i class="bi bi-calendar3 me-1"></i>${formattedDate}</span></td>
                            <td class="col-content">
                                <div class="announcement-header" data-id="${rowId}">
                                    <span class="announcement-title">${safeTitle || '（無標題）'}</span>
                                    <span class="toggle-icon"><i class="bi bi-chevron-down"></i></span>
                                </div>
                                <div class="announcement-detail" id="detail-${rowId}">
                                    ${detailHtml}
                                </div>
                            </td>
                        </tr>
                    `;
    });
    html += `</table>`;
    announcementList.innerHTML = html;

    // 綁定點擊事件
    announcementList.querySelectorAll('.announcement-header').forEach(header => {
        header.addEventListener('click', function (e) {
            e.stopPropagation();
            const id = this.dataset.id;
            const detail = document.getElementById(`detail-${id}`);
            if (!detail) return;
            const isOpen = detail.classList.contains('open');
            if (isOpen) {
                detail.classList.remove('open');
                detail.style.display = 'none';
                const icon = this.querySelector('.toggle-icon .bi');
                if (icon) icon.className = 'bi bi-chevron-down';
            } else {
                detail.classList.add('open');
                detail.style.display = 'block';
                const icon = this.querySelector('.toggle-icon .bi');
                if (icon) icon.className = 'bi bi-chevron-up';
            }
        });
    });
}

// ---- 分頁 ----
function renderPagination() {
    paginationEl.innerHTML = '';
    const totalPages = Math.ceil(announcements.length / itemsPerPage);
    if (totalPages <= 1) {
        // 只有一頁或無資料時，隱藏分頁容器
        const wrapper = document.getElementById('announcementPaginationWrapper');
        if (wrapper) wrapper.style.display = 'none';
        return;
    }
    // 有分頁時顯示容器
    const wrapper = document.getElementById('announcementPaginationWrapper');
    if (wrapper) wrapper.style.display = 'flex';

    if (currentPage > 1) {
        const prevLi = document.createElement('li');
        prevLi.className = 'page-item';
        prevLi.innerHTML = `<a class="page-link" href="#" aria-label="上一頁">&laquo;</a>`;
        prevLi.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage > 1) {
                showPage(currentPage - 1);
                renderPagination();
            }
        });
        paginationEl.appendChild(prevLi);
    }
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        li.addEventListener('click', (e) => {
            e.preventDefault();
            if (i !== currentPage) {
                showPage(i);
                renderPagination();
            }
        });
        paginationEl.appendChild(li);
    }
    if (currentPage < totalPages) {
        const nextLi = document.createElement('li');
        nextLi.className = 'page-item';
        nextLi.innerHTML = `<a class="page-link" href="#" aria-label="下一頁">&raquo;</a>`;
        nextLi.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage < totalPages) {
                showPage(currentPage + 1);
                renderPagination();
            }
        });
        paginationEl.appendChild(nextLi);
    }
}

// ---- 從快取載入 ----
function loadFromCache() {
    const cached = localStorage.getItem(CACHE_KEY);
    const cacheTime = localStorage.getItem(CACHE_TIME_KEY);
    if (cached && cacheTime) {
        const age = Date.now() - parseInt(cacheTime);
        if (age < 5 * 60 * 1000) { // 5 分鐘內有效
            try {
                const data = JSON.parse(cached);
                if (data && data.length > 0) {
                    announcements = data;
                    loadingMessage.style.display = 'none';
                    showPage(1);
                    renderPagination();
                    return true;
                }
            } catch (e) { }
        }
    }
    return false;
}

// ---- 儲存快取 ----
function saveToCache(data) {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(CACHE_TIME_KEY, String(Date.now()));
    } catch (e) { }
}

// ---- 從 Google 試算表載入（背景更新） ----
function fetchFromSheet(showLoading = true) {
    if (showLoading) {
        loadingMessage.style.display = 'block';
        loadingMessage.innerHTML = '<i class="bi bi-arrow-repeat me-2 spinner-border spinner-border-sm"></i>載入公告中...';
    }
    updateStatus.style.display = 'none';

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            // 正規化資料
            let rawData = data;
            if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])) {
                const header = data[0];
                let dateIdx = -1,
                    contentIdx = -1;
                header.forEach((col, idx) => {
                    const colStr = String(col).toLowerCase();
                    if (colStr.includes('日期') || colStr.includes('date')) dateIdx = idx;
                    if (colStr.includes('內容') || colStr.includes('content') || colStr.includes('公告'))
                        contentIdx = idx;
                });
                if (dateIdx === -1) dateIdx = 0;
                if (contentIdx === -1) contentIdx = 1;
                const converted = [];
                for (let i = 1; i < data.length; i++) {
                    const row = data[i];
                    if (row && row.length > Math.max(dateIdx, contentIdx)) {
                        const dateVal = row[dateIdx] || '';
                        const contentVal = row[contentIdx] || '';
                        if (dateVal || contentVal) {
                            converted.push({ date: String(dateVal).trim(), content: String(contentVal).trim() });
                        }
                    }
                }
                rawData = converted;
            }

            const newData = rawData.filter(item => {
                const date = item.date || item.Date || item.日期 || '';
                const content = item.content || item.Content || item.內容 || item.title || item.Title || '';
                return (date && date.length > 0) || (content && content.length > 0);
            });

            if (newData.length === 0) {
                if (announcements.length === 0) {
                    loadingMessage.innerHTML = '<i class="bi bi-exclamation-triangle me-2"></i>目前尚無公告資料';
                    announcementList.innerHTML =
                        `<div class="text-center py-4 text-muted empty-announcement"><i class="bi bi-inbox" style="font-size: 2rem;"></i><p class="mt-2">目前沒有公告</p></div>`;
                }
                return;
            }

            // 排序
            newData.sort((a, b) => {
                const dateA = new Date(a.date || a.Date || a.日期 || '2000-01-01');
                const dateB = new Date(b.date || b.Date || b.日期 || '2000-01-01');
                return dateB - dateA;
            });

            // 更新資料
            announcements = newData;
            saveToCache(announcements);
            loadingMessage.style.display = 'none';
            updateStatus.style.display = 'none';
            showPage(1);
            renderPagination();
        })
        .catch(error => {
            // 若已有快取，不顯示錯誤，僅隱藏更新狀態
            if (announcements.length === 0) {
                loadingMessage.innerHTML = `<i class="bi bi-exclamation-triangle me-2 text-danger"></i>載入失敗，請檢查網路`;
                announcementList.innerHTML =
                    `<div class="text-center py-4 text-danger"><i class="bi bi-cloud-slash" style="font-size: 2rem;"></i><p class="mt-2">無法載入公告資料</p><p class="small text-muted">${error.message}</p></div>`;
            }
            updateStatus.style.display = 'none';
        });
}

// ---- 主程序 ----
// 1. 嘗試從快取載入
const hasCache = loadFromCache();

if (hasCache) {
    // 有快取：立即顯示，並在背景更新
    updateStatus.style.display = 'block';
    updateStatus.textContent = '正在更新公告...';
    // 延遲一點點再更新，避免干擾初始渲染
    setTimeout(() => {
        fetchFromSheet(false);
    }, 300);
} else {
    // 無快取：正常載入（顯示讀取中）
    fetchFromSheet(true);
}

// 更新頁尾時間
const lastModified = new Date(document.lastModified);
const formattedDateTime =
    `${lastModified.getFullYear()}-${String(lastModified.getMonth() + 1).padStart(2, '0')}-${String(lastModified.getDate()).padStart(2, '0')} ${String(lastModified.getHours()).padStart(2, '0')}:${String(lastModified.getMinutes()).padStart(2, '0')}`;
document.getElementById('lastModified').textContent = formattedDateTime;

                    });

// ---------- 2. 回家功課獨立系統 ----------
(function () {
    'use strict';

    // =============================================================
    // 回家功課獨立載入 — 使用 Google Sheets API v4 讀取資料
    // 改用 JSON 格式，正確保留儲存格內的換行
    // =============================================================
    var HOMEWORK_SHEET_ID = '1wjeAY0DqqG7qiw__03VOnuM2fz5zjlyj-qSygjotSd4';
    var HOMEWORK_JSON_URL =
        'https://docs.google.com/spreadsheets/d/' + HOMEWORK_SHEET_ID + '/gviz/tq?tqx=out:json';

    function loadHomework() {
        var container = document.getElementById('homeworkList');
        if (!container) return;

        container.innerHTML =
            '<div class="homework-loading"><i class="bi bi-arrow-repeat me-2 spinner-border spinner-border-sm"></i>載入中...</div>';

        fetch(HOMEWORK_JSON_URL)
            .then(function (response) {
                if (!response.ok) throw new Error('無法取得試算表資料 (HTTP ' + response.status + ')');
                return response.text();
            })
            .then(function (jsonText) {
                var jsonStr = jsonText;
                var match = jsonStr.match(/google\.visualization\.Query\.setResponse\((.+)\);/);
                if (match) {
                    jsonStr = match[1];
                } else {
                    jsonStr = jsonStr.replace(/^\/\*O_o\*\//, '');
                }
                var data = JSON.parse(jsonStr);

                var table = data.table;
                var cols = table.cols;
                var rows = table.rows;

                if (!rows || rows.length === 0) {
                    container.innerHTML = '<div class="homework-empty">📭 暫無回家功課</div>';
                    return;
                }

                var timeIdx = -1;
                var contentIdx = -1;
                for (var i = 0; i < cols.length; i++) {
                    var label = cols[i].label || '';
                    if (label === '時間' || label === '時間' || label === 'time' || label === 'Time') timeIdx = i;
                    if (label === 'homework' || label === 'homework' || label === 'content' || label === 'Content')
                        contentIdx = i;
                }
                if (timeIdx === -1) {
                    for (var i = 0; i < cols.length; i++) {
                        var id = cols[i].id || '';
                        if (id === '時間' || id === '時間' || id === 'time' || id === 'Time' || id === 'A') timeIdx = i;
                        if (id === 'homework' || id === 'homework' || id === 'content' || id === 'Content' || id === 'B')
                            contentIdx = i;
                    }
                }

                if (timeIdx === -1 || contentIdx === -1) {
                    container.innerHTML =
                        '<div class="homework-empty">⚠️ 試算表欄位格式不符 (需有「時間」「homework」)</div>';
                    return;
                }

                var homeworkList = [];
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    var cells = row.c;
                    if (!cells || cells.length <= Math.max(timeIdx, contentIdx)) continue;

                    var timeStr = '';
                    var contentStr = '';
                    if (cells[timeIdx] && cells[timeIdx].v !== null && cells[timeIdx].v !== undefined) {
                        timeStr = String(cells[timeIdx].v);
                    }
                    if (cells[contentIdx] && cells[contentIdx].v !== null && cells[contentIdx].v !== undefined) {
                        contentStr = String(cells[contentIdx].v);
                    }

                    contentStr = contentStr.replace(/^"|"$/g, '');
                    if (timeStr === '' && contentStr === '') continue;
                    homeworkList.push({
                        time: timeStr,
                        content: contentStr
                    });
                }

                if (homeworkList.length === 0) {
                    container.innerHTML = '<div class="homework-empty">📭 暫無回家功課</div>';
                    return;
                }

                // ========== 排序：將日期較新（時間較晚）的排在前面 ==========
                homeworkList.sort(function (a, b) {
                    var getTime = function (dateStr) {
                        if (!dateStr) return 0;
                        var match = dateStr.match(/Date\((\d+),\s*(\d+),\s*(\d+)\)/);
                        if (match) {
                            var year = parseInt(match[1], 10);
                            var month = parseInt(match[2], 10);
                            var day = parseInt(match[3], 10);
                            return new Date(year, month, day).getTime();
                        }
                        var d = new Date(dateStr);
                        return isNaN(d.getTime()) ? 0 : d.getTime();
                    };

                    var timeA = getTime(a.time);
                    var timeB = getTime(b.time);
                    return timeB - timeA;
                });

                // ========== 日期格式化函數 ==========
                function formatDate(input) {
                    if (!input) return '';
                    var dateObj = null;
                    var match = input.match(/Date\((\d+),\s*(\d+),\s*(\d+)\)/);
                    if (match) {
                        var year = parseInt(match[1], 10);
                        var month = parseInt(match[2], 10) + 1;
                        var day = parseInt(match[3], 10);
                        dateObj = new Date(year, month - 1, day);
                    } else {
                        var d = new Date(input);
                        if (!isNaN(d.getTime())) {
                            dateObj = d;
                        }
                    }
                    if (dateObj && !isNaN(dateObj.getTime())) {
                        var y = dateObj.getFullYear();
                        var m = String(dateObj.getMonth() + 1).padStart(2, '0');
                        var d = String(dateObj.getDate()).padStart(2, '0');
                        return y + '-' + m + '-' + d;
                    }
                    return input;
                }
                // ========================================

                var count = Math.min(homeworkList.length, 5);
                var html = '';
                for (var i = 0; i < count; i++) {
                    var item = homeworkList[i];
                    var rawTime = item.time || '';
                    var displayTime = rawTime ? formatDate(rawTime) : '無日期';
                    var rawContent = item.content || '（無內容）';
                    var contentHtml = escapeHtml(rawContent).replace(/\n/g, '<br>');

                    html +=
                        '<div class="homework-item" data-index="' + i + '">' +
                        '  <div class="homework-header">' +
                        '    <span class="homework-time">📅 ' + escapeHtml(displayTime) + '</span>' +
                        '    <span class="homework-toggle-icon"><i class="bi bi-chevron-down"></i></span>' +
                        '  </div>' +
                        '  <div class="homework-content">' + contentHtml + '</div>' +
                        '</div>';
                }
                container.innerHTML = html;

                // 點擊展開/收合功能
                var items = container.querySelectorAll('.homework-item');
                items.forEach(function (item) {
                    item.addEventListener('click', function (e) {
                        var content = this.querySelector('.homework-content');
                        var icon = this.querySelector('.homework-toggle-icon i');
                        if (!content || !icon) return;

                        var isOpen = content.classList.contains('open');

                        var allItems = container.querySelectorAll('.homework-item');
                        allItems.forEach(function (otherItem) {
                            var otherContent = otherItem.querySelector('.homework-content');
                            var otherIcon = otherItem.querySelector('.homework-toggle-icon i');
                            if (otherContent) otherContent.classList.remove('open');
                            if (otherIcon) {
                                otherIcon.className = 'bi bi-chevron-down';
                            }
                        });

                        if (!isOpen) {
                            content.classList.add('open');
                            icon.className = 'bi bi-chevron-up';
                        }
                    });
                });

                var status = document.getElementById('homeworkUpdateStatus');
                if (status) status.style.display = 'none';
            })
            .catch(function (err) {
                console.error('載入回家功課失敗:', err);
                container.innerHTML =
                    '<div class="homework-empty">⚠️ 載入失敗，請確認試算表已公開<br><small class="text-muted">' +
                    escapeHtml(err.message) + '</small></div>';
            });
    }

    function escapeHtml(text) {
        if (!text) return '';
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 頁面載入時執行，並每 5 分鐘自動更新
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadHomework);
    } else {
        loadHomework();
    }

    setInterval(loadHomework, 5 * 60 * 1000);

    // =============================================================
    // 最後更新時間 (獨立更新)
    // =============================================================
    var lm = document.getElementById('lastModified');
    if (lm) {
        var now = new Date();
        var pad = function (n) { return String(n).padStart(2, '0'); };
        lm.textContent = now.getFullYear() + '/' + pad(now.getMonth() + 1) + '/' + pad(now.getDate()) +
            ' ' + pad(now.getHours()) + ':' + pad(now.getMinutes());
    }

})();

                }) ();