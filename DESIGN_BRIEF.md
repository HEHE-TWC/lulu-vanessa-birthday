# LuLu-Inspired Birthday Site — Design Brief

> **重要聲明 / Disclaimer**  
> 本專案為**私人女朋友生日靜態網站**，視覺為 **inspired by** 罐頭豬 LuLu / LuLu The Piggy（Cici’s Story × TOYZERO+）嘅原創插畫風格指引。  
> **唔會**直接複製官方商品攝影、官方插畫、或 LOGO 作商業用途。所有 mascot / 插圖應為原創繪製，僅參考下列可描述嘅外形特徵同暖粉調色。

---

## 1. Character Lock（原創插畫指引）

來源整理自官方 About（[luluthepiggy.com/en/pages/about-lulu](https://luluthepiggy.com/en/pages/about-lulu)）同公開潮玩描述：LuLu 係「來自午餐肉罐頭嘅小精靈」、粉嫩色、憨態可人；同 TOYZERO+ 合作出盲盒搪膠／植絨公仔。

### 鎖定特徵（for original art — 唔抄商品圖）

| Trait | Guidance |
|--------|----------|
| **Body** | 梨形／水滴形圓潤身軀（pear body）；頭同身幾乎融合（fused head），無明顯頸 |
| **Snout** | 細細嘅**黃色／蜜黃**豬鼻（yellow snout），圓潤突出 |
| **Face** | 細黑點眼；兩頰**粉紅 blush**；表情憨萌、略懶洋洋 |
| **Limbs** | 短短 stubby 四肢，圓潤、幾乎無關節細節 |
| **Palette on character** | 粉紅／蜜桃主體 + 鼻黃 + blush；可加極淺奶白 highlight |
| **Style** | Flat / soft-shaded **art-toy** 感（TOYZERO+ 潮玩風）：簡潔輪廓、可愛比例、可選輕微植絨感紋理，但網站用扁平插畫即可 |
| **Mood** | 好奇、Silly、溫暖、生日 celebratory（可戴派對帽／拿蛋糕，但造型仍要符合 pear + fused head） |

### 避免

- 直接貼官方產品相、盲盒包裝圖、官方 sticker 資產  
- 官方字標／「罐頭豬 LuLu」商標字款用於品牌冒充  
- 過度寫實 3D 商品渲染（除非你自己影自己買嘅公仔做個人相簿，與 mascot 插畫分開）

---

## 2. Website Color Palette（Hex）

暖、粉、生日感；對比足夠讀字，又保持 pastel。

### Primary — pinks & peaches

| Token | Hex | Use |
|--------|------|-----|
| `--pink-primary` | `#F7A8B8` | Hero 主色、按鈕、強調區塊 |
| `--pink-deep` | `#E88B9A` | Hover、愛心、次強調 |
| `--peach` | `#F5C6A8` | 卡片邊、溫暖 accent |
| `--blush` | `#F4B4C0` | Section 交替底、柔和分隔 |

### Character accent

| Token | Hex | Use |
|--------|------|-----|
| `--snout-yellow` | `#F5D76E` | 小點綴、mascot 鼻、生日蛋糕 highlight |
| `--cream-highlight` | `#FFF3E8` | Soft glow、卡片內底 |

### Background & neutrals

| Token | Hex | Use |
|--------|------|-----|
| `--bg-page` | `#FFF8F5` | 全站背景 |
| `--bg-section-alt` | `#FFEFE8` | 交替 section |
| `--neutral-soft` | `#F0E4DC` | 線框、分隔、gallery frame |
| `--white-soft` | `#FFFBFA` | 卡片面、輸入區 |

### Text

| Token | Hex | Use |
|--------|------|-----|
| `--text-main` | `#5C4033` | 正文（暖棕，唔用純黑） |
| `--text-muted` | `#8B6F63` | 次要說明、caption |
| `--text-on-pink` | `#FFF8F5` | 粉紅按鈕上嘅字 |

### Birthday sparkle（optional）

| Token | Hex | Use |
|--------|------|-----|
| `--mint-soft` | `#C8E6D4` | 倒數成功、小驚喜狀態 |
| `--gold-soft` | `#E8C97A` | 裝飾星／絲帶 |

**Palette summary（copy-paste）**  
`#F7A8B8` · `#E88B9A` · `#F5C6A8` · `#F4B4C0` · `#F5D76E` · `#FFF8F5` · `#FFEFE8` · `#F0E4DC` · `#FFFBFA` · `#5C4033` · `#8B6F63` · `#C8E6D4` · `#E8C97A`

---

## 3. Typography Suggestions

| Role | Suggestion | Notes |
|------|-------------|--------|
| **Display / Hero** | `"Nunito"`, `"Quicksand"`, or `"Rounded Mplus 1c"`（日系圓體感） | 圓潤、可愛；中英皆可 |
| **Body (中／粵)** | `"Noto Sans TC"` + system fallback | 繁體清晰 |
| **Body (EN)** | `"Nunito Sans"` / `"Inter"` | 同 display 協調 |
| **Love notes** | 略手寫感：`"Caveat"` or `"ZCOOL XiaoWei"`（中文標題用） | 唔好成站手寫，只限情話區 |

**Scale（mobile-first）**

- Hero title: ~28–36px mobile / 40–48px desktop  
- Section H2: ~22–24px / 28–32px  
- Body: 16px，行高 1.6  
- Caption: 13–14px，`--text-muted`

---

## 4. Site Wireframe（Mobile-first）

靜態女朋友生日站。粵語 UI 為主，可夾少量英文。

### 全域

- Sticky 頂欄：小 mascot icon + 站名（例：`♡ For [名字]`）+ 簡易錨點（倒數｜相簿｜情話｜驚喜）  
- 背景：`--bg-page`；圓角卡片、柔和陰影  
- Desktop：內容 max-width ~720–800px 置中，或 hero 用 split；Mobile：單欄 padding 16–20px  

---

### Section A — Hero（Mascot + Greeting）

**Layout**

- Mobile：上 mascot 插畫區（約 200–260px 高）→ 下標題 + 短句 + CTA「睇倒數 ↓」  
- Desktop：左文案、右 mascot（或置中疊加）

**Copy placeholders**

- ZH：`生日快樂呀，[女朋友名] ♡`  
- EN：`Happy Birthday, [Name]!`  
- Sub：`一個為你整嘅小小 LuLu 世界` / `A little LuLu-inspired world, just for you`

---

### Section B — Countdown

**Layout**

- 置中大數字：`天 | 時 | 分 | 秒` 四格圓角卡  
- 底下一行：`距離 [名字] 嘅生日仲有…`  
- 生日當日：換成「今日就係你嘅日子！」+ confetti／mint 狀態色  

**Need from user：** 準確生日日期（同可選時間／時區；預設用戶時區 UTC+8）

---

### Section C — Photo Gallery

**Layout**

- Mobile：2 欄 grid，圓角、淡粉邊框  
- Desktop：3 欄  
- Lightbox 點開放大（可後期加）  
- 可穿插 1–2 格「LuLu-inspired doodle」佔位，同真實相片分開標籤  

**Copy：** `我哋嘅小碎片` / `Our little moments`

**Need from user：** 相片檔（建議 6–12 張）+ 可選短 caption

---

### Section D — Love Notes

**Layout**

- 直向「便利貼／信封卡」堆疊或橫向 swipe（mobile）  
- 每張：短情話 + 日期或小標題  
- 背景交替 `--bg-section-alt`

**Copy placeholders**

- `多謝你成為我嘅 [… ]`  
- `記得嗰日我哋…`  
- `I love you because…`

**Need from user：** 真正情話文字（3–8 則）

---

### Section E — Surprise / Interaction（細）

**建議（擇一或組合，保持靜態友好）**

1. **揭蓋罐頭**：點擊「打開罐頭」→ 露出 mascot + 一句 hidden message  
2. **刮刮卡／揭開層**：CSS 或簡單 JS reveal  
3. **生日願望輸入**（可選 localStorage，唔一定要後端）  

**Copy：** `打開呢個罐頭…` / `A surprise for you`

**Need from user：** 驚喜內容一句（或一段）；互動偏好

---

### Section F — Footer

- 小字：`Made with ♡ for [名字] · Inspired by LuLu the Piggy · 非官方粉絲向私人網站`  
- 唔放商業 CTA、唔冒充官方店

---

## 5. Wireframe Preview File

可開啟結構預覽（無正式插畫）：

`/workspace/lulu-birthday-site/wireframe-preview.html`

用上述 palette 嘅 labeled boxes，響應式單欄／寬屏調整。

---

## 6. Next Steps — 需要用戶提供

| Item | Status | Notes |
|------|--------|--------|
| 女朋友顯示名（中／英） | ✅ Vanessa | Hero、頂欄、倒數文案 |
| 生日日期（+ 可選時刻） | ✅ 11 月 11 日 00:00 UTC+8 | Countdown 已接；首頁飛行紙牌顯示倒數 |
| 相片 | ⏳ 待填 | 建議 6–12 張，可註明順序／caption |
| Love notes 正文 | ⏳ 待填 | 3–8 則粵語／英文 |
| 驚喜 hidden message | ⏳ 待填 | Section E |
| 參考圖（可选） | ✅ 用戶實物＋插畫；鎖定 mascot ②揮手 | 見 assets/lulu-mascot.png（原創 generated） |
| 語言偏好 | 建議 | 粵語為主 + 少量 EN |
| 網域／託管 | 後期 | 靜態 host（GitHub Pages / Cloudflare / 等） |

---

## 7. Implementation Order（建議）

1. 確認本 brief + 打開 `wireframe-preview.html` 睇結構  
2. 收集上表資料  
3. 出原創 mascot（SVG／PNG）跟 Character Lock  
4. 起靜態 HTML/CSS/JS：hero → countdown → gallery → notes → surprise  
5. 填真實文案同相片；mobile 實機檢查  
6. 再微调動效（輕 parallax、confetti on birthday）

---

*Brief version: 2026-10-17 · Research: luluthepiggy.com About + public art-toy descriptions · Inspired-by only.*


---

## 8. Homepage draft（2026-10-17）

- 實作：`index.html` + `css/styles.css` + `js/main.js`
- 動畫說明：`HOME_ANIMATION.md`
- Hero：晴空＋Q 版城市；LuLu 飛行路徑 BR→TL→Right→center-bottom；落地紙牌「離 Vanessa 生日」+ 即時倒數
