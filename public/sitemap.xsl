<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="id">
      <head>
        <title>Sitemap XML | Hellyos Ageng Haqiqie</title>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&amp;family=JetBrains+Mono:wght@400;500&amp;display=swap');

          :root {
            --bg-color: #090a0f;
            --card-bg: #12141c;
            --text-color: #f3f4f6;
            --text-muted: #9ca3af;
            --border-color: #222533;
            --primary-gradient: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
            --accent-color: #8b5cf6;
            --hover-bg: #1a1d2c;
            --priority-high: #10b981;
            --priority-med: #3b82f6;
            --priority-low: #f59e0b;
            --shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
          }

          @media (prefers-color-scheme: light) {
            :root {
              --bg-color: #f8fafc;
              --card-bg: #ffffff;
              --text-color: #0f172a;
              --text-muted: #64748b;
              --border-color: #e2e8f0;
              --primary-gradient: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%);
              --accent-color: #6366f1;
              --hover-bg: #f1f5f9;
              --shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
            }
          }

          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          body {
            font-family: 'Outfit', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            line-height: 1.5;
            padding: 2rem 1rem;
            transition: background-color 0.3s ease, color 0.3s ease;
          }

          .container {
            max-width: 1000px;
            margin: 0 auto;
          }

          /* Header Section */
          header {
            position: relative;
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 1.25rem;
            padding: 2.5rem;
            margin-bottom: 2rem;
            overflow: hidden;
            box-shadow: var(--shadow);
          }

          header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: var(--primary-gradient);
          }

          .logo-area {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1rem;
            flex-wrap: wrap;
            gap: 1rem;
          }

          h1 {
            font-size: 2rem;
            font-weight: 700;
            background: var(--primary-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            display: inline-block;
          }

          .badge {
            background: var(--hover-bg);
            border: 1px solid var(--border-color);
            padding: 0.35rem 0.85rem;
            border-radius: 2rem;
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--accent-color);
          }

          p.description {
            color: var(--text-muted);
            font-size: 1.05rem;
            max-width: 700px;
            margin-bottom: 1.5rem;
          }

          /* Stats Grid */
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 1.25rem;
            margin-bottom: 1.5rem;
          }

          .stat-card {
            background: var(--hover-bg);
            border: 1px solid var(--border-color);
            border-radius: 0.85rem;
            padding: 1.25rem;
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }

          .stat-label {
            font-size: 0.85rem;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .stat-value {
            font-size: 1.75rem;
            font-weight: 700;
            color: var(--text-color);
          }

          .stat-meta {
            font-size: 0.85rem;
            color: var(--text-muted);
          }

          /* Table Section */
          .table-wrapper {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 1.25rem;
            overflow: hidden;
            box-shadow: var(--shadow);
            margin-bottom: 2rem;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
          }

          th {
            background: var(--hover-bg);
            padding: 1.1rem 1.5rem;
            font-weight: 600;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-muted);
            border-bottom: 1px solid var(--border-color);
          }

          td {
            padding: 1.1rem 1.5rem;
            border-bottom: 1px solid var(--border-color);
            font-size: 0.95rem;
            vertical-align: middle;
          }

          tr:last-child td {
            border-bottom: none;
          }

          tr {
            transition: background-color 0.2s ease;
          }

          tr:hover {
            background-color: var(--hover-bg);
          }

          /* Links styling */
          .page-link {
            color: var(--text-color);
            text-decoration: none;
            font-weight: 500;
            font-size: 0.95rem;
            display: inline-block;
            max-width: 100%;
            word-break: break-all;
            transition: color 0.2s ease;
          }

          .page-link:hover {
            color: var(--accent-color);
            text-decoration: underline;
          }

          /* Badges and meters */
          .freq-badge {
            display: inline-block;
            padding: 0.25rem 0.6rem;
            border-radius: 0.5rem;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.025em;
            background: rgba(139, 92, 246, 0.1);
            color: var(--accent-color);
            border: 1px solid rgba(139, 92, 246, 0.2);
          }

          .priority-wrapper {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.85rem;
            font-weight: 500;
          }

          .priority-bar-container {
            width: 60px;
            height: 6px;
            background: var(--border-color);
            border-radius: 3px;
            overflow: hidden;
            display: inline-block;
          }

          .priority-bar {
            height: 100%;
            border-radius: 3px;
          }

          .p-high { background-color: var(--priority-high); }
          .p-med { background-color: var(--priority-med); }
          .p-low { background-color: var(--priority-low); }

          .date-text {
            font-family: 'JetBrains Mono', monospace;
            color: var(--text-muted);
            font-size: 0.875rem;
          }

          /* Footer */
          footer {
            text-align: center;
            padding: 1.5rem;
            color: var(--text-muted);
            font-size: 0.85rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
          }

          .footer-link {
            color: var(--accent-color);
            text-decoration: none;
            font-weight: 500;
          }

          .footer-link:hover {
            text-decoration: underline;
          }

          /* Responsive adjusts */
          @media (max-width: 768px) {
            body {
              padding: 1rem 0.5rem;
            }
            header {
              padding: 1.5rem;
            }
            h1 {
              font-size: 1.5rem;
            }
            th, td {
              padding: 0.75rem 1rem;
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
            <div class="logo-area">
              <h1>XML Sitemap</h1>
              <span class="badge">hellyoshaqiqie.my.id</span>
            </div>
            <p class="description">
              Sitemap XML ini dibuat secara khusus untuk membantu mesin pencari seperti Google mengindeks dan merayapi halaman website Anda dengan lebih efisien.
            </p>
            <div class="stats-grid">
              <div class="stat-card">
                <span class="stat-label">Total Halaman</span>
                <span class="stat-value"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></span>
                <span class="stat-meta">Halaman Terdaftar</span>
              </div>
              <div class="stat-card">
                <span class="stat-label">Domain Utama</span>
                <span class="stat-value" style="font-size: 1.2rem; font-weight: 600; padding: 0.45rem 0;">hellyoshaqiqie.my.id</span>
                <span class="stat-meta">Protokol: HTTPS Secure</span>
              </div>
              <div class="stat-card">
                <span class="stat-label">Terakhir Diperbarui</span>
                <span class="stat-value" style="font-size: 1.5rem; font-weight: 700;">
                  <xsl:value-of select="sitemap:urlset/sitemap:url[1]/sitemap:lastmod"/>
                </span>
                <span class="stat-meta">Terakhir Di-build</span>
              </div>
            </div>
          </header>

          <div class="table-wrapper">
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
                            <xsl:attribute name="class">
                              <xsl:choose>
                                <xsl:when test="sitemap:priority &gt;= 0.8">priority-bar p-high</xsl:when>
                                <xsl:when test="sitemap:priority &gt;= 0.5">priority-bar p-med</xsl:when>
                                <xsl:otherwise>priority-bar p-low</xsl:otherwise>
                              </xsl:choose>
                            </xsl:attribute>
                            <xsl:attribute name="style">
                              <xsl:value-of select="concat('width: ', sitemap:priority * 100, '%')"/>
                            </xsl:attribute>
                          </div>
                        </div>
                        <span><xsl:value-of select="format-number(sitemap:priority, '0.0')"/></span>
                      </div>
                    </td>
                    <td>
                      <span class="date-text">
                        <xsl:value-of select="sitemap:lastmod"/>
                      </span>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>

          <footer>
            <span>XML Sitemap Styler &amp; Generator</span>
            <span>Kembali ke <a href="https://www.hellyoshaqiqie.my.id" class="footer-link">Hellyos Portfolio</a></span>
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
