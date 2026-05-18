import re

with open('src/components/ClientDashboard.css', 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'\.reservations-empty-state h3 \{', content)
if match:
    content = content[:match.start()]
    
content += """.reservations-empty-state h3 {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
}

.reservations-empty-state p {
  font-size: 0.88rem;
  color: #64748b;
  max-width: 440px;
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .reservations-premium-banner {
    flex-direction: column;
    padding: 1.5rem;
    gap: 1.5rem;
  }
  .rpb-left {
    max-width: 100%;
    text-align: center;
  }
  .rpb-stats {
    justify-content: center;
  }
  .rpb-right {
    width: 200px;
    height: 120px;
  }
}

/* ══════════════════════════════════════════════
   BACKGROUND ANIMATION
══════════════════════════════════════════════ */
.dashboard-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0.45; /* Increased visibility */
  pointer-events: none; /* Do not block clicks */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.dashboard-background > div {
  width: 120vw;
  height: 120vh;
  object-fit: cover;
}

/* Ensure the layout wraps over the background properly */
.dash-layout {
  position: relative;
  z-index: 1;
  background: transparent; /* Allow background to show */
}

/* Keep the sidebar and topbar opaque */
.sidebar, .content-topbar {
  background: #0f172a; /* Sidebar default */
}
.content-topbar {
  background: white; /* Topbar default */
}

/* ══════════════════════════════════════════════
   VEHICLES PAGE BACKGROUND
══════════════════════════════════════════════ */
.vehicles-page-wrapper {
  position: relative;
  min-height: calc(100vh - 120px);
  border-radius: var(--radius);
  background: linear-gradient(135deg, #e0e7ff 0%, #f1f5f9 100%);
}

.vehicles-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0.8; /* Professional transparency */
  pointer-events: none;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: var(--radius);
}

.vehicles-background > div {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.vehicles-content-layer {
  position: relative;
  z-index: 1;
}

/* Enhance vehicle cards against the background */
.vehicle-card {
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}
"""
with open('src/components/ClientDashboard.css', 'w', encoding='utf-8') as f:
    f.write(content)
