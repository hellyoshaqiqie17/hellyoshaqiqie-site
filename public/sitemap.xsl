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
            --shadow-elevated: 0px 8px 30px rgba(38, 37, 16, 0.06);
          }

          @media (prefers-color-scheme: dark) {
            :root {
              --color-canvas: #141414;
              --color-foreground: #f7f7f4;
              --color-muted: #9a9994;
              --color-shell: #0a0a0a;
              --color-card: #1f1f1c;
              --color-surface: #1f1f1c;
              --color-border: #3a3a36;
              --color-accent: #f54e00;
              --shadow-subtle: 0px 4px 20px rgba(0, 0, 0, 0.2);
              --shadow-elevated: 0px 8px 30px rgba(0, 0, 0, 0.4);
            }
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
            padding: 4rem 2rem;
            transition: background-color 0.2s ease, color 0.2s ease;
          }

          .container {
            max-width: 1000px;
            margin: 0 auto;
          }

          /* Header Styling matching Hellyos Portfolio */
          header {
            margin-bottom: 3rem;
          }

          .header-top {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            border-bottom: 1px solid var(--color-border);
            padding-bottom: 1.5rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
            gap: 1rem;
          }

          h1 {
            font-size: 2.25rem;
            font-weight: 700;
            letter-spacing: -0.03em;
            color: var(--color-foreground);
          }

          .domain-tag {
            font-family: var(--font-mono);
            font-size: 0.9rem;
            color: var(--color-accent);
            font-weight: 500;
            letter-spacing: -0.01em;
          }

          .description {
            color: var(--color-muted);
            font-size: 1.05rem;
            max-width: 680px;
            font-weight: 400;
            margin-bottom: 2.5rem;
          }

          /* Stats Grid */
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
          }

          .stat-card {
            background-color: var(--color-card);
            border: 1px solid var(--color-border);
            border-radius: 1rem;
            padding: 1.5rem;
            box-shadow: var(--shadow-subtle);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }

          .stat-card:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-elevated);
          }

          .stat-label {
            display: block;
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--color-muted);
            margin-bottom: 0.5rem;
            font-weight: 500;
          }

          .stat-value {
            font-size: 1.75rem;
            font-weight: 700;
            color: var(--color-foreground);
            letter-spacing: -0.02em;
          }

          .stat-meta {
            margin-top: 0.25rem;
            font-size: 0.85rem;
            color: var(--color-muted);
          }

          /* Table Styling matching Portfolio Card */
          .table-container {
            background-color: var(--color-card);
            border: 1px solid var(--color-border);
            border-radius: 1.5rem;
            overflow: hidden;
            box-shadow: var(--shadow-subtle);
            margin-top: 3rem;
            margin-bottom: 3rem;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
          }

          th {
            background-color: var(--color-shell);
            padding: 1.25rem 1.75rem;
            font-weight: 600;
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--color-muted);
            border-bottom: 1px solid var(--color-border);
          }

          td {
            padding: 1.25rem 1.75rem;
            border-bottom: 1px solid var(--color-border);
            font-size: 0.95rem;
            color: var(--color-foreground);
            vertical-align: middle;
          }

          tr:last-child td {
            border-bottom: none;
          }

          tr {
            transition: background-color 0.15s ease;
          }

          tr:hover {
            background-color: var(--color-canvas);
          }

          /* Link styling */
          .page-link {
            color: var(--color-foreground);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.15s ease;
            word-break: break-all;
          }

          .page-link:hover {
            color: var(--color-accent);
          }

          /* Badge & priority elements */
          .freq-badge {
            display: inline-flex;
            align-items: center;
            background-color: var(--color-shell);
            color: var(--color-foreground);
            padding: 0.25rem 0.6rem;
            border-radius: 0.5rem;
            font-size: 0.75rem;
            font-weight: 500;
            border: 1px solid var(--color-border);
            letter-spacing: 0.01em;
          }

          .priority-wrapper {
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }

          .priority-bar-container {
            width: 50px;
            height: 4px;
            background-color: var(--color-shell);
            border-radius: 2px;
            overflow: hidden;
          }

          .priority-bar {
            height: 100%;
            background-color: var(--color-accent);
            border-radius: 2px;
          }

          .priority-val {
            font-family: var(--font-mono);
            font-size: 0.85rem;
            font-weight: 500;
            color: var(--color-foreground);
          }

          .date-val {
            font-family: var(--font-mono);
            font-size: 0.85rem;
            color: var(--color-muted);
          }

          /* Footer */
          footer {
            border-top: 1px solid var(--color-border);
            padding-top: 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: var(--color-muted);
            font-size: 0.85rem;
            flex-wrap: wrap;
            gap: 1rem;
          }

          .footer-link {
            color: var(--color-foreground);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.15s ease;
          }

          .footer-link:hover {
            color: var(--color-accent);
          }

          @media (max-width: 768px) {
            body {
              padding: 2rem 1rem;
            }
            .header-top {
              padding-bottom: 1rem;
              margin-bottom: 1.5rem;
            }
            h1 {
              font-size: 1.75rem;
            }
            .stats-grid {
              gap: 1rem;
            }
            .stat-card {
              padding: 1.25rem;
            }
            td, th {
              padding: 1rem 1.25rem;
            }
            .hide-mobile {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <div class="header-top">
              <h1>XML Sitemap</h1>
              <span class="domain-tag">hellyoshaqiqie.my.id</span>
            </div>
            <p class="description">
              Sitemap XML ini dibuat secara khusus untuk membantu mesin pencari seperti Google mengindeks dan merayapi halaman website Anda dengan lebih efisien.
            </p>
            <div class="stats-grid">
              <div class="stat-card">
                <span class="stat-label">Total Halaman</span>
                <span class="stat-value"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></span>
                <span class="stat-meta">Halaman terindeks</span>
              </div>
              <div class="stat-card">
                <span class="stat-label">Tipe Format</span>
                <span class="stat-value">XML/XSLT</span>
                <span class="stat-meta">Sitemap Protokol 0.9</span>
              </div>
              <div class="stat-card">
                <span class="stat-label">Pembaruan Terakhir</span>
                <span class="stat-value" style="font-size: 1.5rem; font-weight: 700;">
                  <xsl:value-of select="sitemap:urlset/sitemap:url[1]/sitemap:lastmod"/>
                </span>
                <span class="stat-meta">Format Tanggal ISO</span>
              </div>
            </div>
          </header>

          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>URL Alamat Halaman</th>
                  <th class="hide-mobile">Frekuensi</th>
                  <th>Prioritas</th>
                  <th>Pembaruan Terakhir</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <xsl:sort select="sitemap:priority" order="descending"/>
                  <tr>
                    <td>
                      <a class="page-link">
                        <xsl:attribute name="href">
                          <xsl:value-of select="sitemap:loc"/>
                        </xsl:attribute>
                        <xsl:value-of select="sitemap:loc"/>
                      </a>
                    </td>
                    <td class="hide-mobile">
                      <span class="freq-badge">
                        <xsl:value-of select="sitemap:changefreq"/>
                      </span>
                    </td>
                    <td>
                      <div class="priority-wrapper">
                        <div class="priority-bar-container">
                          <div class="priority-bar">
                            <xsl:attribute name="style">
                              <xsl:value-of select="concat('width: ', sitemap:priority * 100, '%')"/>
                            </xsl:attribute>
                          </div>
                        </div>
                        <span class="priority-val"><xsl:value-of select="format-number(sitemap:priority, '0.0')"/></span>
                      </div>
                    </td>
                    <td>
                      <span class="date-val">
                        <xsl:value-of select="sitemap:lastmod"/>
                      </span>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>

          <footer>
            <span>XML Sitemap Styler</span>
            <span>Kembali ke <a href="https://www.hellyoshaqiqie.my.id" class="footer-link">Portfolio Utama</a></span>
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
