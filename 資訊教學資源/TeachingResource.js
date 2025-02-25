// 內容存儲
const contents = {
    contentArcade: `
            <h1>MakeCode Arcade 簡介</h1>
    <p><strong>MakeCode Arcade</strong> 是 <span class="highlight">微軟（Microsoft）</span> 推出的線上遊戲編程平台，適合
        <strong>初學者</strong> 和 <strong>教育用途</strong>，讓使用者能夠輕鬆創作 <strong>2D 像素風格遊戲</strong>。</p>

    <h2>🎮 特色</h2>
    <ul>
        <li><strong>適合初學者：</strong> 提供 <em>積木編程</em>、<em>JavaScript</em> 和 <em>Python</em> 三種語言，讓學習逐步進階。</li>
        <li><strong>內建模擬器：</strong> 直接在瀏覽器內測試遊戲，無需額外安裝。</li>
        <li><strong>支援多種設備：</strong> 可在 <em>KittenBot Meowbit</em>、<em>Adafruit PyGamer</em> 等硬體上運行。</li>
        <li><strong>開源平台：</strong> 可分享、下載、改進他人專案。</li>
        <li><strong>豐富教學資源：</strong> 內建範例與課程，適合學校或社團使用。</li>
    </ul>

    <h2>🎨 主要功能</h2>
    <ul>
        <li>內建 <strong>像素編輯器</strong>，可自訂角色與場景。</li>
        <li>支援 <strong>角色動畫與物理引擎</strong>（如重力、碰撞偵測）。</li>
        <li>可加入 <strong>遊戲音效與背景音樂</strong>。</li>
        <li>使用 <strong>變數、迴圈、條件判斷</strong> 來控制遊戲邏輯。</li>
    </ul>

    <h2>🏫 適用對象</h2>
    <ul>
        <li>國小高年級至國高中學生</li>
        <li>初學程式設計者</li>
        <li>程式設計教育工作者</li>
        <li>想學習遊戲開發的愛好者</li>
    </ul>

    <p>MakeCode Arcade <span class="highlight">降低了遊戲開發的門檻</span>，讓學生能夠快速製作可運行的遊戲，適合作為 <strong>程式設計社團</strong> 的教學工具！ 🎮✨
    </p>
    `,
    contentMicrobit: `
            <h1>🎛️ Micro:bit 簡介</h1>
    <p>Micro:bit 是一款由 <strong>BBC</strong> 開發的 <strong>教育型微型控制器（microcontroller）</strong>，
        主要用於程式設計與電子實驗，適合初學者學習程式設計與物聯網（IoT）。
        它最初於 2016 年發表，並廣泛應用於全球的教育場域，
        特別是在國小和國中的 STEM（科學、技術、工程、數學）課程中。
    </p>

    <h2 data-icon="⚙️">Micro:bit 主要規格</h2>
    <ul>
        <li><strong>處理器：</strong> Nordic nRF52833（V2 版）或 nRF51822（V1 版）</li>
        <li><strong>LED 矩陣：</strong> 5×5 LED 陣列，可用於顯示圖案或文字</li>
        <li><strong>按鈕：</strong> 2 顆可編程按鈕（A、B 鍵）</li>
        <li><strong>感測器：</strong> 內建加速度計、磁力計（指南針）、溫度感測器</li>
        <li><strong>無線通訊：</strong> 支援 Bluetooth Low Energy（BLE）與 2.4GHz 無線通訊</li>
        <li><strong>I/O 端口：</strong> 3 個大針腳 + 20 個小針腳，可與外部電子元件連接</li>
        <li><strong>音訊功能：</strong> V2 版本新增內建喇叭與麥克風</li>
    </ul>

    <h2 data-icon="💻">程式開發環境</h2>
    <p>Micro:bit 支援多種程式設計語言，包括：</p>
    <ul>
        <li><strong>MakeCode</strong>（圖形化積木編程）—— 適合初學者</li>
        <li><strong>Python</strong>（MicroPython）—— 適合進階學習者</li>
        <li><strong>JavaScript</strong> —— 可在 MakeCode 中使用</li>
    </ul>

    <h2 data-icon="🔧">Micro:bit 的應用</h2>
    <ul>
        <li><strong>程式設計入門 🎮：</strong> 透過 MakeCode 設計互動遊戲或控制 LED 顯示</li>
        <li><strong>感測器應用 📡：</strong> 使用加速度計偵測運動、指南針偵測方向</li>
        <li><strong>無線通訊 📶：</strong> 兩個 Micro:bit 之間傳送訊息</li>
        <li><strong>機器人控制 🤖：</strong> 結合馬達與感測器製作簡單機器人</li>
        <li><strong>智慧生活應用 🏡：</strong> 溫度監測、環境感測、簡單自動化控制</li>
    </ul>

    <h2 data-icon="🎯">結論</h2>
    <p>Micro:bit 以 <strong>簡單易用、多感測器整合、支援多種編程語言</strong> 的特點，
        成為 STEM 教育的理想工具，幫助學生從基礎學習到創新應用，
        培養運算思維與動手實作能力。
    </p>
    `
    ,
    contentScratch: `
    <h1>Scratch 簡介</h1>
    <p>Scratch 是一種專為 <strong>兒童與初學者</strong> 設計的 <strong>圖形化程式設計語言</strong>，由美國麻省理工學院（MIT）媒體實驗室開發。它使用 <strong>積木式拖拉</strong> 的方式來編寫程式，讓使用者能夠輕鬆地創建互動式故事、動畫、遊戲等。</p>

    <h2>特色：</h2>
    <ul>
        <li><strong>圖形化介面：</strong> 透過拖曳積木來組合程式，不需手寫程式碼。</li>
        <li><strong>適合初學者：</strong> 無需學習複雜的語法，適合兒童、教師與程式設計入門者。</li>
        <li><strong>跨平台：</strong> 可在瀏覽器（<a href="https://scratch.mit.edu" target="_blank">scratch.mit.edu</a>）或桌面應用程式上使用。</li>
        <li><strong>社群共享：</strong> 使用者可上傳並分享自己的作品，也能參考他人專案進行學習。</li>
        <li><strong>支援硬體：</strong> 可搭配 micro:bit、LEGO SPIKE、Makey Makey 等硬體擴展應用。</li>
    </ul>

    <h2>適用對象：</h2>
    <ul>
        <li><strong>國小、國中生：</strong> 入門程式設計與運算思維。</li>
        <li><strong>教師：</strong> 作為課堂教學工具，培養學生邏輯思維與創造力。</li>
        <li><strong>初學者：</strong> 無經驗者也能快速上手，學習基礎程式概念。</li>
    </ul>

    <p>Scratch 適合用來學習 <strong>事件觸發、循環、條件判斷、變數、函式</strong> 等程式基礎概念，並能應用於遊戲設計、動畫製作及互動專案開發。</p>    
     `
    ,
    contentCanva: `
    <h1>Canva 簡介</h1>
    <p><a href="https://www.canva.com/zh_tw/" target="_blank">Canva</a> 是一款<strong>線上圖像設計工具</strong>，適用於個人、教育、商業和行銷用途。它提供<strong>簡單易用的介面</strong>，讓使用者<strong>無需專業設計技能</strong>，即可創建高品質的視覺內容，如簡報、海報、社群媒體貼文、商標、名片等。</p>

    <h2>主要特色：</h2>
    <ul>
        <li><strong>多樣化模板</strong>：內建豐富的設計模板，涵蓋簡報、社群媒體貼文、影片、行銷素材等類別。</li>
        <li><strong>拖放式編輯</strong>：使用者可以輕鬆拖放圖片、文字、圖示，快速完成設計。</li>
        <li><strong>豐富的圖庫資源</strong>：內建免費與付費的圖片、插圖、圖示、字型、影片和音效資源。</li>
        <li><strong>團隊協作</strong>：可多人共同編輯設計，適合企業與學校使用。</li>
        <li><strong>AI 智能工具</strong>：提供文案生成、圖片背景移除、影片剪輯、品牌設計等智能功能。</li>
        <li><strong>多種輸出格式</strong>：支援下載 PNG、JPEG、PDF、MP4 等格式，並可直接分享到社群平台或列印。</li>
    </ul>

    <h2>適用對象：</h2>
    <ul>
        <li><strong>個人創作者</strong>（部落客、Youtuber、社群媒體經營者）</li>
        <li><strong>學生與教師</strong>（用於製作簡報、教材、學習海報等）</li>
        <li><strong>企業與行銷人員</strong>（品牌形象設計、社群行銷素材）</li>
        <li><strong>非設計專業人士</strong>（無需學習 Photoshop 或 Illustrator，即可快速製作專業級設計）</li>
    </ul>

    <p>Canva 提供<strong>免費版與付費版（Canva Pro、Canva for Teams）</strong>，付費版提供更多高級功能與素材，適合進階使用者或企業團隊。</p>
     `
    ,
    contentGamma: `
        <h1>Gamma 簡介</h1>
        <p><a href="https://gamma.app/" target="_blank">Gamma</a> 是一款專為創建簡報、文件和網站而設計的 AI 驅動工具。它提供簡單直覺的界面，讓使用者能夠快速製作視覺化內容，無需具備設計或排版經驗。</p>

        <h2>🔹 主要功能</h2>
        <ul>
            <li><strong>AI 自動生成內容</strong>：輸入主題，AI 便能自動生成簡報、文件或網站的架構與內容。</li>
            <li><strong>靈活的視覺設計</strong>：提供多種模板與設計風格，支援拖曳調整版面。</li>
            <li><strong>簡報與文件的最佳化體驗</strong>：支援互動式簡報，可內嵌 GIF、影片與連結。</li>
            <li><strong>協作與分享</strong>：支援多人協作編輯，可一鍵分享為網頁或 PDF。</li>
            <li><strong>與 AI 深度整合</strong>：AI 可協助編寫內容、修改措辭、優化結構。</li>
        </ul>

        <h2>🔹 適用場景</h2>
        <ul>
            <li><strong>商業簡報</strong>：用於產品提案、業務簡報、投資報告等。</li>
            <li><strong>教育與學習</strong>：教師與學生可用來製作課程內容或報告。</li>
            <li><strong>部落格與內容行銷</strong>：適用於社群媒體與網站文章。</li>
            <li><strong>個人作品展示</strong>：設計個人簡歷、作品集或專案提案。</li>
        </ul>

        <p>Gamma 透過 AI 技術，讓使用者能夠高效產出高品質的視覺化內容，是簡報與文件製作的最佳選擇！💡🚀</p>
     `

    ,
    contentTinkercad: `
        <h1>Tinkercad 簡介</h1>
        <p><a href="https://www.tinkercad.com/" target="_blank">Tinkercad</a> 是 Autodesk 提供的<strong>免費線上 3D 設計、電子電路模擬和程式設計</strong>平台，特別適合初學者、學生和教育工作者使用。</p>

        <h2>主要功能：</h2>
        <ul>
            <li><strong>3D 設計（3D Design）：</strong> 透過拖拉和組合基本形狀來創建 3D 物件，可用於 3D 列印。</li>
            <li><strong>電子電路（Circuits）：</strong> 可視化並模擬電子電路，支援 Arduino 程式控制。</li>
            <li><strong>積木程式設計（Codeblocks）：</strong> 以積木式程式語言來建立 3D 物件，適合參數化設計學習。</li>
        </ul>

        <h2>適用對象：</h2>
        <ul>
            <li><strong>國小到高中學生：</strong> 學習 3D 建模、電子電路、程式設計。</li>
            <li><strong>創客（Makers）：</strong> 用於快速設計 3D 模型與電子原型。</li>
            <li><strong>教師與教育機構：</strong> 作為 STEM/STEAM 教學工具，幫助學生動手實作。</li>
        </ul>

        <p>Tinkercad 介面簡單直覺，適合無經驗者學習 <strong>3D 設計、電子電路、Arduino 與程式設計</strong>，是入門創客與數位製造的理想工具。 🚀</p>
     `
};

// 獲取所有超連結
const openModalButtons = document.querySelectorAll('.openModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalContent = document.getElementById('modalContent');
const closeModalButton = document.getElementById('closeModal');

// 為每個超連結綁定點擊事件
openModalButtons.forEach(button => {
    button.addEventListener('click', function (event) {
        event.preventDefault();
        // 獲取對應的內容 ID
        const contentId = this.getAttribute('data-content');
        // 設置彈出框內容
        modalContent.innerHTML = contents[contentId];
        // 顯示彈出框
        modalOverlay.style.display = 'flex';
    });
});

// 關閉彈出框
closeModalButton.addEventListener('click', function () {
    modalOverlay.style.display = 'none';
});

// 點擊背景關閉彈出框
modalOverlay.addEventListener('click', function (event) {
    if (event.target === this) {
        modalOverlay.style.display = 'none';
    }
});