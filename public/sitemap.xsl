<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="id">
      <head>
        <title>Sitemap | Hellyos Ageng Haqiqie</title>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          @import url('https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,400,300&amp;display=swap');
          @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&amp;display=swap');

          :root {
            --color-canvas: #f7f7f4;
            --color-foreground: #262510;
            --color-muted: #7a7974;
            --color-shell: #ececea;
            --color-card: #ffffff;
            --color-surface: #e6e5e0;
            --color-border: #cdcdc9;
            --color-accent: #f54e00;
            --font-sans: "Satoshi", ui-sans-serif, system-ui, sans-serif;
            --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
            --shadow-subtle: 0px 4px 20px rgba(38, 37, 16, 0.03);
            --shadow-elevated: 0px 12px 40px rgba(38, 37, 16, 0.08);
          }

          .dark {
            --color-canvas: #141414;
            --color-foreground: #f7f7f4;
            --color-muted: #9a9994;
            --color-shell: #0a0a0a;
            --color-card: #1f1f1c;
            --color-surface: #1f1f1c;
            --color-border: #3a3a36;
            --color-accent: #f54e00;
            --shadow-subtle: 0px 4px 20px rgba(0, 0, 0, 0.2);
            --shadow-elevated: 0px 12px 40px rgba(0, 0, 0, 0.4);
          }

          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          body {
            font-family: var(--font-sans);
            background-color: var(--color-canvas);
            color: var(--color-foreground);
            line-height: 1.6;
            padding: 6rem 2rem;
            transition: background-color 0.3s ease, color 0.3s ease;
            background-image: 
              radial-gradient(circle at 10% 20%, rgba(245, 78, 0, 0.04) 0%, transparent 40%),
              radial-gradient(circle at 90% 80%, rgba(245, 78, 0, 0.03) 0%, transparent 40%);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          .container {
            max-width: 1100px;
            margin: 0 auto;
            width: 100%;
          }

          /* Header Section */
          header {
            margin-bottom: 4rem;
            position: relative;
          }

          .header-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid var(--color-border);
            padding-bottom: 2rem;
            margin-bottom: 2.5rem;
            flex-wrap: wrap;
            gap: 1.5rem;
          }

          h1 {
            font-size: 2.75rem;
            font-weight: 700;
            letter-spacing: -0.04em;
            color: var(--color-foreground);
          }

          .domain-tag {
            font-family: var(--font-mono);
            font-size: 0.95rem;
            color: var(--color-accent);
            font-weight: 500;
            letter-spacing: -0.01em;
            background: rgba(245, 78, 0, 0.08);
            padding: 0.4rem 1rem;
            border-radius: 9999px;
            border: 1px solid rgba(245, 78, 0, 0.15);
          }

          .description {
            color: var(--color-muted);
            font-size: 1.15rem;
            max-width: 720px;
            font-weight: 400;
            margin-bottom: 3rem;
            line-height: 1.5;
          }

          /* Stats Grid */
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 1.5rem;
          }

          .stat-card {
            background-color: var(--color-card);
            border: 1px solid var(--color-border);
            border-radius: 1.25rem;
            padding: 1.75rem;
            box-shadow: var(--shadow-subtle);
            transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          }

          .stat-card:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-elevated);
            border-color: var(--color-accent);
          }

          .stat-label {
            display: block;
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--color-muted);
            margin-bottom: 0.75rem;
            font-weight: 600;
          }

          .stat-value {
            font-size: 2.25rem;
            font-weight: 700;
            color: var(--color-foreground);
            letter-spacing: -0.03em;
            line-height: 1.1;
          }

          .stat-meta {
            margin-top: 0.5rem;
            font-size: 0.85rem;
            color: var(--color-muted);
            display: block;
          }

          /* Interactive Search and Filter Section */
          .controls-section {
            background: var(--color-card);
            border: 1px solid var(--color-border);
            border-radius: 1.5rem;
            padding: 2rem;
            box-shadow: var(--shadow-subtle);
            margin-bottom: 3rem;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .search-wrapper {
            position: relative;
            width: 100%;
          }

          .search-input {
            width: 100%;
            background-color: var(--color-canvas);
            border: 1px solid var(--color-border);
            color: var(--color-foreground);
            padding: 1.1rem 1.5rem;
            border-radius: 1rem;
            font-size: 1rem;
            font-family: var(--font-sans);
            transition: all 0.2s ease;
          }

          .search-input:focus {
            outline: none;
            border-color: var(--color-accent);
            box-shadow: 0 0 0 3px rgba(245, 78, 0, 0.1);
          }

          .filter-bar {
            display: flex;
            gap: 0.75rem;
            flex-wrap: wrap;
          }

          .filter-btn {
            background-color: var(--color-canvas);
            border: 1px solid var(--color-border);
            color: var(--color-foreground);
            padding: 0.6rem 1.25rem;
            border-radius: 9999px;
            font-size: 0.9rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .filter-btn:hover {
            border-color: var(--color-accent);
            color: var(--color-accent);
          }

          .filter-btn.active {
            background-color: var(--color-foreground);
            color: var(--color-canvas);
            border-color: var(--color-foreground);
          }

          /* Sitemap Cards Grid */
          .sitemap-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 1.5rem;
            margin-bottom: 5rem;
          }

          .url-card {
            background-color: var(--color-card);
            border: 1px solid var(--color-border);
            border-radius: 1.5rem;
            padding: 1.75rem;
            box-shadow: var(--shadow-subtle);
            transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.3s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.2s ease;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            overflow: hidden;
            text-decoration: none;
          }

          .url-card:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-elevated);
            border-color: var(--color-accent);
          }

          .url-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 5px;
            height: 100%;
            background-color: var(--color-border);
            transition: background-color 0.2s ease;
          }

          .url-card.priority-10::before {
            background-color: var(--color-accent);
          }

          .url-card.priority-08::before {
            background-color: #3b82f6;
          }

          .url-card.priority-07::before {
            background-color: #10b981;
          }

          .url-card:hover::before {
            background-color: var(--color-accent) !important;
          }

          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.25rem;
          }

          .url-category {
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--color-muted);
            background: var(--color-shell);
            padding: 0.25rem 0.6rem;
            border-radius: 0.5rem;
            border: 1px solid var(--color-border);
          }

          .priority-val {
            font-family: var(--font-mono);
            font-size: 0.75rem;
            font-weight: 700;
            color: var(--color-accent);
            background: rgba(245, 78, 0, 0.06);
            padding: 0.25rem 0.5rem;
            border-radius: 0.5rem;
          }

          .card-body {
            margin-bottom: 1.75rem;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .page-title {
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--color-foreground);
            margin-bottom: 0.5rem;
            line-height: 1.35;
            letter-spacing: -0.02em;
          }

          .page-path {
            font-family: var(--font-mono);
            font-size: 0.85rem;
            color: var(--color-muted);
            word-break: break-all;
            line-height: 1.4;
          }

          .card-footer {
            border-top: 1px solid var(--color-border);
            padding-top: 1.25rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.8rem;
            color: var(--color-muted);
          }

          .meta-item {
            display: flex;
            flex-direction: column;
            gap: 0.15rem;
          }

          .meta-label {
            text-transform: uppercase;
            font-size: 0.65rem;
            font-weight: 700;
            letter-spacing: 0.05em;
          }

          .meta-val {
            font-family: var(--font-mono);
            font-weight: 500;
            color: var(--color-foreground);
          }

          /* Floating Quick Actions */
          .home-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(#2a2a2a 0%, #111 100%);
            border: 1px solid #000;
            color: #fff;
            padding: 0.8rem 1.75rem;
            border-radius: 9999px;
            font-weight: 600;
            text-decoration: none;
            box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 4px 12px rgba(0,0,0,0.15);
            transition: all 0.2s cubic-bezier(0.23, 1, 0.32, 1);
            font-size: 0.95rem;
            cursor: pointer;
          }

          .home-btn:hover {
            background: linear-gradient(#3a3a3a 0%, #171717 100%);
            transform: translateY(-1px);
            box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.25), 0 6px 16px rgba(0,0,0,0.2);
          }

          .home-btn:active {
            background: linear-gradient(#111 0%, #222 100%);
            transform: translateY(1px);
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
          }

          .dark .home-btn {
            background: linear-gradient(#3a3a36 0%, #1f1f1c 100%);
            border-color: #2a2a26;
            color: var(--color-foreground);
            box-shadow: inset 0 1px 1px rgba(255,255,255,0.08), 0 4px 12px rgba(0,0,0,0.4);
          }

          .dark .home-btn:hover {
            background: linear-gradient(#4a4a44 0%, #2a2a26 100%);
          }

          /* Footer */
          footer {
            border-top: 1px solid var(--color-border);
            padding-top: 2.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: var(--color-muted);
            font-size: 0.9rem;
            flex-wrap: wrap;
            gap: 1.5rem;
          }

          .footer-link {
            color: var(--color-foreground);
            text-decoration: none;
            font-weight: 600;
            transition: color 0.15s ease;
          }

          .footer-link:hover {
            color: var(--color-accent);
          }

          @media (max-width: 768px) {
            body {
              padding: 4rem 1.5rem;
            }
            h1 {
              font-size: 2.25rem;
            }
            .controls-section {
              padding: 1.5rem;
            }
            .sitemap-grid {
              grid-template-columns: 1fr;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <div class="header-top">
              <h1>Sitemap &amp; Direktori</h1>
              <span class="domain-tag">hellyoshaqiqie.id</span>
            </div>
            <p class="description">
              Halaman ini menyediakan indeks terstruktur dari seluruh konten, studi kasus, dan rute utama yang tersedia di portfolio Hellyos Ageng Haqiqie. Dibuat otomatis untuk membantu mesin pencari melakukan indeksasi.
            </p>
            <div class="stats-grid">
              <div class="stat-card">
                <span class="stat-label">Total Halaman</span>
                <span class="stat-value"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></span>
                <span class="stat-meta">Seluruh rute terindeks</span>
              </div>
              <div class="stat-card">
                <span class="stat-label">Studi Kasus Proyek</span>
                <span class="stat-value">
                  <xsl:value-of select="count(sitemap:urlset/sitemap:url[contains(sitemap:loc, '/project/')])"/>
                </span>
                <span class="stat-meta">Detail case study teknis</span>
              </div>
              <div class="stat-card">
                <span class="stat-label">Pembaruan Terakhir</span>
                <span class="stat-value" style="font-size: 1.6rem; font-weight: 700; padding-top: 0.3rem;">
                  <xsl:value-of select="sitemap:urlset/sitemap:url[1]/sitemap:lastmod"/>
                </span>
                <span class="stat-meta">Format ISO 8601</span>
              </div>
            </div>
          </header>

          <div class="controls-section">
            <div class="search-wrapper">
              <input type="text" id="searchInput" class="search-input" placeholder="Cari halaman atau studi kasus..." />
            </div>
            <div class="filter-bar">
              <button class="filter-btn active" data-filter="all">Semua Halaman</button>
              <button class="filter-btn" data-filter="core">Halaman Utama</button>
              <button class="filter-btn" data-filter="case-study">Studi Kasus Proyek</button>
            </div>
          </div>

          <div class="sitemap-grid" id="sitemapGrid">
            <xsl:for-each select="sitemap:urlset/sitemap:url">
              <xsl:sort select="sitemap:priority" order="descending"/>
              
              <!-- Map variables for clean design -->
              <xsl:variable name="cleanPath">
                <xsl:choose>
                  <xsl:when test="sitemap:loc = 'https://www.hellyoshaqiqie.id/'">/</xsl:when>
                  <xsl:otherwise>
                    <xsl:value-of select="substring-after(sitemap:loc, 'https://www.hellyoshaqiqie.id')"/>
                  </xsl:otherwise>
                </xsl:choose>
              </xsl:variable>

              <xsl:variable name="categoryClass">
                <xsl:choose>
                  <xsl:when test="contains(sitemap:loc, '/project/')">case-study</xsl:when>
                  <xsl:otherwise>core</xsl:otherwise>
                </xsl:choose>
              </xsl:variable>

              <xsl:variable name="categoryName">
                <xsl:choose>
                  <xsl:when test="contains(sitemap:loc, '/project/')">Studi Kasus</xsl:when>
                  <xsl:otherwise>Halaman Utama</xsl:otherwise>
                </xsl:choose>
              </xsl:variable>

              <xsl:variable name="pageTitle">
                <xsl:choose>
                  <xsl:when test="sitemap:loc = 'https://www.hellyoshaqiqie.id/'">Beranda &amp; Portfolio Utama</xsl:when>
                  <xsl:when test="sitemap:loc = 'https://www.hellyoshaqiqie.id/projects'">Katalog Proyek Lengkap</xsl:when>
                  <xsl:when test="sitemap:loc = 'https://www.hellyoshaqiqie.id/coaching'">Layanan Coaching &amp; Mentoring</xsl:when>
                  <xsl:when test="contains(sitemap:loc, '/project/vorce-platform')">VORCE — Workforce Intelligence</xsl:when>
                  <xsl:when test="contains(sitemap:loc, '/project/vorce-hr-management')">VORCE — Workforce &amp; HR Management</xsl:when>
                  <xsl:when test="contains(sitemap:loc, '/project/vlinked-desktop-agent')">vLinked — Desktop Control Agent</xsl:when>
                  <xsl:when test="contains(sitemap:loc, '/project/dermdoc')">DermDoc — AI Dermatologi</xsl:when>
                  <xsl:when test="contains(sitemap:loc, '/project/smart-home')">Smart Home — IoT Ecosystem</xsl:when>
                  <xsl:when test="contains(sitemap:loc, '/project/smart-vehicle')">Smart Vehicle — OBD Telemetry</xsl:when>
                  <xsl:when test="contains(sitemap:loc, '/project/fleet-management')">Fleet Management — Logistik</xsl:when>
                  <xsl:when test="contains(sitemap:loc, '/project/driver-dashboard')">Driver Dashboard — Telematika</xsl:when>
                  <xsl:when test="contains(sitemap:loc, '/project/climatix')">ClimatiX — Carbon Ecosystem</xsl:when>
                  <xsl:otherwise>
                    <xsl:value-of select="$cleanPath"/>
                  </xsl:otherwise>
                </xsl:choose>
              </xsl:variable>

              <xsl:variable name="priorityClass">
                <xsl:choose>
                  <xsl:when test="sitemap:priority = '1.0'">priority-10</xsl:when>
                  <xsl:when test="sitemap:priority = '0.8'">priority-08</xsl:when>
                  <xsl:otherwise>priority-07</xsl:otherwise>
                </xsl:choose>
              </xsl:variable>

              <a class="url-card {$categoryClass} {$priorityClass}">
                <xsl:attribute name="href">
                  <xsl:value-of select="sitemap:loc"/>
                </xsl:attribute>
                
                <div class="card-header">
                  <span class="url-category"><xsl:value-of select="$categoryName"/></span>
                  <span class="priority-val">Prio <xsl:value-of select="format-number(sitemap:priority, '0.0')"/></span>
                </div>
                
                <div class="card-body">
                  <h3 class="page-title"><xsl:value-of select="$pageTitle"/></h3>
                  <span class="page-path"><xsl:value-of select="$cleanPath"/></span>
                </div>
                
                <div class="card-footer">
                  <div class="meta-item">
                    <span class="meta-label">Frekuensi</span>
                    <span class="meta-val"><xsl:value-of select="sitemap:changefreq"/></span>
                  </div>
                  <div class="meta-item" style="text-align: right;">
                    <span class="meta-label">Diperbarui</span>
                    <span class="meta-val"><xsl:value-of select="sitemap:lastmod"/></span>
                  </div>
                </div>
              </a>
            </xsl:for-each>
          </div>

          <footer>
            <span>Direktori XML Sitemap</span>
            <a href="https://www.hellyoshaqiqie.id" class="home-btn">
              Kembali ke Portfolio Utama
            </a>
          </footer>
        </div>

        <script type="text/javascript">
          // <![CDATA[
          document.addEventListener('DOMContentLoaded', () => {
            // 1. Sync theme from localStorage
            try {
              const theme = localStorage.getItem('hellyos-theme');
              if (theme === 'dark') {
                document.documentElement.classList.add('dark');
              } else if (theme === 'light') {
                document.documentElement.classList.remove('dark');
              } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.classList.add('dark');
              }
            } catch (e) {
              console.error('Gagal memuat tema:', e);
            }

            const searchInput = document.getElementById('searchInput');
            const filterButtons = document.querySelectorAll('.filter-btn');
            const cards = document.querySelectorAll('.url-card');

            let currentSearch = '';
            let currentFilter = 'all';

            // Filter logic
            const filterCards = () => {
              cards.forEach(card => {
                const title = card.querySelector('.page-title').textContent.toLowerCase();
                const path = card.querySelector('.page-path').textContent.toLowerCase();
                
                const matchesSearch = title.includes(currentSearch) || path.includes(currentSearch);
                let matchesFilter = false;

                if (currentFilter === 'all') {
                  matchesFilter = true;
                } else if (currentFilter === 'core') {
                  matchesFilter = card.classList.contains('core');
                } else if (currentFilter === 'case-study') {
                  matchesFilter = card.classList.contains('case-study');
                }

                if (matchesSearch && matchesFilter) {
                  card.style.display = 'flex';
                } else {
                  card.style.display = 'none';
                }
              });
            };

            // Search event
            searchInput.addEventListener('input', (e) => {
              currentSearch = e.target.value.toLowerCase().trim();
              filterCards();
            });

            // Filter buttons event
            filterButtons.forEach(btn => {
              btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.getAttribute('data-filter');
                filterCards();
              });
            });
          });
          // ]]>
        </script>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
