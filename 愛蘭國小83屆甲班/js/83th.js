document.addEventListener('DOMContentLoaded', function () {
    // ================================================================
    // 1. 行動裝置下拉選單控制 (原生，無 jQuery 依賴)
    // ================================================================
    function isMobile() {
        return window.innerWidth < 992;
    }

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

    // 點擊外部關閉所有下拉選單（僅手機）
    document.addEventListener('click', function (e) {
        if (isMobile()) {
            const nav = document.querySelector('.navbar-collapse');
            if (nav && !nav.contains(e.target)) {
                closeAllDropdowns();
            }
        }
    });

    // 視窗縮放時重新綁定事件
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

    // 初始綁定（若為手機）
    if (isMobile()) bindMobileEvents();


    // ================================================================
    // 2. 公告載入與分頁 (Google Apps Script 資料)
    // ================================================================
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
        } catch (e) {
            return dateStr;
        }
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
                // 若回傳為二維陣列（試算表格式），解析標題列
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

                // 過濾有效資料（至少日期或內容非空）
                announcements = rawData.filter(item => {
                    const date = item.date || item.Date || item.日期 || '';
                    const content = item.content || item.Content || item.內容 || item.title || item.Title || '';
                    return (date && date.length > 0) || (content && content.length > 0);
                });

                if (announcements.length === 0) {
                    loadingMessage.innerHTML = '<i class="bi bi-exclamation-triangle me-2"></i>目前尚無公告資料';
                    announcementList.innerHTML = `<div class="text-center py-4 text-muted empty-announcement">
                        <i class="bi bi-inbox" style="font-size: 2rem;"></i><p class="mt-2">目前沒有公告</p>
                    </div>`;
                    return;
                }

                // 依日期排序（新→舊）
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
                announcementList.innerHTML = `<div class="text-center py-4 text-danger">
                    <i class="bi bi-cloud-slash" style="font-size: 2rem;"></i>
                    <p class="mt-2">無法載入公告資料，請稍後再試</p>
                    <p class="small text-muted">錯誤訊息：${error.message}</p>
                </div>`;
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

        // 上一頁
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

        // 頁碼
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

        // 下一頁
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


    // ================================================================
    // 3. 顯示頁面最後更新時間（一次定義，一次呼叫）
    // ================================================================
    function updateLastModified() {
        const lastModified = new Date(document.lastModified);
        const formattedDateTime =
            `${lastModified.getFullYear()}-${String(lastModified.getMonth() + 1).padStart(2, '0')}-${String(lastModified.getDate()).padStart(2, '0')} ${String(lastModified.getHours()).padStart(2, '0')}:${String(lastModified.getMinutes()).padStart(2, '0')}`;
        const el = document.getElementById('lastModified');
        if (el) el.textContent = formattedDateTime;
    }


    // ================================================================
    // 4. 學期折疊選單互動
    // ================================================================
    const accordion = document.getElementById('semesterAccordion');
    if (accordion) {
        accordion.addEventListener('click', function (e) {
            const toggle = e.target.closest('.semester-toggle');
            if (!toggle) return;

            const targetId = toggle.dataset.target;
            if (!targetId) return;

            const targetPanel = document.getElementById(targetId);
            if (!targetPanel) return;

            if (targetPanel.classList.contains('open')) {
                targetPanel.classList.remove('open');
                toggle.classList.remove('active');
                return;
            }

            document.querySelectorAll('.semester-panel').forEach(function (panel) {
                panel.classList.remove('open');
            });
            document.querySelectorAll('.semester-toggle').forEach(function (btn) {
                btn.classList.remove('active');
            });

            targetPanel.classList.add('open');
            toggle.classList.add('active');
        });
    }


    // ================================================================
    // 5. DataTable 初始化 (需 jQuery 與 DataTables 外掛)
    // ================================================================
    if (typeof $ !== 'undefined' && $.fn.DataTable) {
        $('#table_id').DataTable({
            responsive: true,
            language: {
                "url": "//cdn.datatables.net/plug-ins/1.13.4/i18n/zh-HANT.json"
            },
            columnDefs: [
                { responsivePriority: 1, targets: [0, 1, 2] },
                { responsivePriority: 2, targets: [3, 4] }
            ],
            autoWidth: false,
            paging: true,
            pageLength: 12,
            lengthMenu: [12, 25],
            order: [
                [0, 'asc'],
                [1, 'asc']
            ]
        });
    } else {
        console.warn('jQuery 或 DataTables 未載入，略過表格初始化');
    }


    // ================================================================
    // 執行所有初始化（更新時間、載入公告）
    // ================================================================
    updateLastModified();
    loadAnnouncements();
});