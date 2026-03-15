// thankyou.js — Read URL query params and display application summary

// ── Footer dates ────────────────────────────────────────
const yearEl     = document.getElementById('current-year');
const modifiedEl = document.getElementById('last-modified');
if (yearEl)     yearEl.textContent = new Date().getFullYear();
if (modifiedEl) modifiedEl.textContent = `Last Modified: ${document.lastModified}`;

// ── Membership level labels ──────────────────────────────
const membershipLabels = {
  np:     'NP Membership (Non-Profit · Free)',
  bronze: 'Bronze Membership',
  silver: 'Silver Membership',
  gold:   'Gold Membership',
};

// ── Read URL params ──────────────────────────────────────
const params = new URLSearchParams(window.location.search);

const fields = [
  { key: 'firstname',  label: 'First Name'      },
  { key: 'lastname',   label: 'Last Name'        },
  { key: 'email',      label: 'Email Address'    },
  { key: 'phone',      label: 'Mobile Phone'     },
  { key: 'business',   label: 'Business Name'    },
  { key: 'membership', label: 'Membership Level' },
  { key: 'timestamp',  label: 'Date Submitted'   },
];

// ── Render summary ───────────────────────────────────────
const summaryList = document.getElementById('summary-list');

if (summaryList) {
  let hasData = false;

  fields.forEach(({ key, label }) => {
    let value = params.get(key);
    if (!value) return;

    hasData = true;

    // Format membership value
    if (key === 'membership') {
      value = membershipLabels[value] || value;
    }

    const div = document.createElement('div');
    div.innerHTML = `
      <dt>${label}</dt>
      <dd>${value}</dd>
    `;
    summaryList.appendChild(div);
  });

  if (!hasData) {
    summaryList.innerHTML = `
      <div style="grid-column:1/-1; padding:1rem; text-align:center; color:var(--muted); font-size:0.88rem;">
        No application data found. <a href="join.html">Submit an application</a> to see your summary here.
      </div>`;
  }
}
