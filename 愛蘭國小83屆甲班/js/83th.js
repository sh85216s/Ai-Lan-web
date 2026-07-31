    document.addEventListener('DOMContentLoaded', function () {
        function isMobile() { return window.innerWidth < 992; }
            let currentOpenMenu = null;
    function closeAllDropdowns() {
        document.querySelectorAll('.navbar-nav .dropdown-menu.show').forEach(function (menu) {
            menu.classList.remove('show');
        });
    document.querySelectorAll('.navbar-nav .dropdown-toggle').forEach(function (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
                });
    currentOpenMenu = null;
            }
    function toggleDropdown(dropdownElement) {
                const menu = dropdownElement.querySelector('.dropdown-menu');
    if (!menu) return;
    if (menu.classList.contains('show')) {
        menu.classList.remove('show');
    dropdownElement.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
    currentOpenMenu = null;
    return;
                }
    closeAllDropdowns();
    menu.classList.add('show');
    dropdownElement.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'true');
    currentOpenMenu = dropdownElement;
            }
    function bindMobileEvents() {
        document.querySelectorAll('.navbar-nav .dropdown').forEach(function (dd) {
            dd.removeEventListener('click', handleDropdownClick);
        });
    if (isMobile()) {
        document.querySelectorAll('.navbar-nav .dropdown').forEach(function (dd) {
            dd.addEventListener('click', handleDropdownClick);
        });
                }
            }
    function handleDropdownClick(e) {
                if (e.target.closest('.dropdown-item')) {
                    const dropdown = e.currentTarget;
    const menu = dropdown.querySelector('.dropdown-menu');
    if (menu) {
        menu.classList.remove('show');
    dropdown.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
    if (currentOpenMenu === dropdown) currentOpenMenu = null;
                    }
    return;
                }
    const dropdown = e.currentTarget;
    toggleDropdown(dropdown);
    e.preventDefault();
    e.stopPropagation();
            }
    document.addEventListener('click', function (e) {
                if (isMobile()) {
                    const nav = document.querySelector('.navbar-collapse');
    if (nav && !nav.contains(e.target)) {
        closeAllDropdowns();
                    }
                }
            });
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
                    if (!isMobile()) {
        closeAllDropdowns();
    document.querySelectorAll('.navbar-nav .dropdown').forEach(function (dd) {
        dd.removeEventListener('click', handleDropdownClick);
                        });
                    } else {
        bindMobileEvents();
                    }
                }, 200);
            });
    if (isMobile()) bindMobileEvents();

    // ===== 公告載入 =====
    const url = 'https://script.google.com/macros/s/AKfycbxiSHa3UI3B-UMnoY1cBt1rvPGmXQZ42UqmRruz1gndc5-YkbEpBb74ppoTFEtZ0WP_kg/exec';
    const announcementList = document.getElementById('announcementList');
    const paginationEl = document.getElementById('announcementPagination');
    const loadingMessage = document.getElementById('loadingMessage');
    let announcements = [];
    const itemsPerPage = 10;
    let currentPage = 1;

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

    function loadAnnouncements() {
        loadingMessage.style.display = 'block';
    loadingMessage.innerHTML = '<i class="bi bi-arrow-repeat me-2 spinner-border spinner-border-sm"></i>載入公告中...';
    announcementList.innerHTML = '';
    fetch(url)
                    .then(response => {
                        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
                    })
                    .then(data => {
        let rawData = data;
                        if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])) {
                            const header = data[0];
    let dateIdx = -1, contentIdx = -1;
                            header.forEach((col, idx) => {
                                const colStr = String(col).toLowerCase();
    if (colStr.includes('日期') || colStr.includes('date')) dateIdx = idx;
    if (colStr.includes('內容') || colStr.includes('content') || colStr.includes('公告')) contentIdx = idx;
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
                        announcements = rawData.filter(item => {
                            const date = item.date || item.Date || item.日期 || '';
    const content = item.content || item.Content || item.內容 || item.title || item.Title || '';
                            return (date && date.length > 0) || (content && content.length > 0);
                        });
    if (announcements.length === 0) {
        loadingMessage.innerHTML = '<i class="bi bi-exclamation-triangle me-2"></i>目前尚無公告資料';
    announcementList.innerHTML = `<div class="text-center py-4 text-muted empty-announcement"><i class="bi bi-inbox" style="font-size: 2rem;"></i><p class="mt-2">目前沒有公告</p></div>`;
    return;
                        }
                        announcements.sort((a, b) => {
                            const dateA = new Date(a.date || a.Date || a.日期 || '2000-01-01');
    const dateB = new Date(b.date || b.Date || b.日期 || '2000-01-01');
    return dateB - dateA;
                        });
    loadingMessage.style.display = 'none';
    showPage(1);
    renderPagination();
                    })
                    .catch(error => {
        loadingMessage.innerHTML = `<i class="bi bi-exclamation-triangle me-2 text-danger"></i>載入失敗，請檢查網路或 Google Apps Script 部署網址`;
    announcementList.innerHTML = `<div class="text-center py-4 text-danger"><i class="bi bi-cloud-slash" style="font-size: 2rem;"></i><p class="mt-2">無法載入公告資料，請稍後再試</p><p class="small text-muted">錯誤訊息：${error.message}</p></div>`;
                    });
            }

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
                pageItems.forEach((item) => {
                    const date = item.date || item.Date || item.日期 || '未標示日期';
        const content = item.content || item.Content || item.內容 || item.title || item.Title || '（無內容）';
        const formattedDate = formatDate(date);
        const safeContent = linkify(content.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
    const safeDate = formattedDate.replace(/</g, '&lt;').replace(/>/g, '&gt;');
html += `
                        <tr>
                            <td class="col-date"><span class="date-tag"><i class="bi bi-calendar3 me-1"></i>${safeDate}</span></td>
                            <td class="col-content">${safeContent}</td>
                        </tr>
                    `;
                });
html += `</table>`;
announcementList.innerHTML = html;
            }

function renderPagination() {
    paginationEl.innerHTML = '';
    const totalPages = Math.ceil(announcements.length / itemsPerPage);
    if (totalPages <= 1) return;
    if (currentPage > 1) {
        const prevLi = document.createElement('li');
        prevLi.className = 'page-item';
        prevLi.innerHTML = `<a class="page-link" href="#" aria-label="上一頁">&laquo;</a>`;
        prevLi.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage > 1) { showPage(currentPage - 1); renderPagination(); }
        });
        paginationEl.appendChild(prevLi);
    }
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        li.addEventListener('click', (e) => {
            e.preventDefault();
            if (i !== currentPage) { showPage(i); renderPagination(); }
        });
        paginationEl.appendChild(li);
    }
    if (currentPage < totalPages) {
        const nextLi = document.createElement('li');
        nextLi.className = 'page-item';
        nextLi.innerHTML = `<a class="page-link" href="#" aria-label="下一頁">&raquo;</a>`;
        nextLi.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage < totalPages) { showPage(currentPage + 1); renderPagination(); }
        });
        paginationEl.appendChild(nextLi);
    }
}

function updateLastModified() {
    const lastModified = new Date(document.lastModified);
    const formattedDateTime =
        `${lastModified.getFullYear()}-${String(lastModified.getMonth() + 1).padStart(2, '0')}-${String(lastModified.getDate()).padStart(2, '0')} ${String(lastModified.getHours()).padStart(2, '0')}:${String(lastModified.getMinutes()).padStart(2, '0')}`;
    const el = document.getElementById('lastModified');
    if (el) el.textContent = formattedDateTime;
}
updateLastModified();
loadAnnouncements();
        });