/* ==========================================================================
   Christ Baptist Church — Faithful-Inspired Interactive Script
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* 1. Transparent-to-Dark Sticky Header + Scroll-to-Top */
  const header = document.getElementById("siteHeader");
  const scrollTopBtn = document.getElementById("scrollTopBtn");

  const handleScroll = () => {
    const y = window.scrollY;
    if (header) {
      header.classList.toggle("is-scrolled", y > 40);
    }
    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle("is-visible", y > 460);
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  /* Active nav link on scroll */
  const navLinks = document.querySelectorAll(".nav-desktop .nav-link");
  const trackedSections = ["top", "worship", "give", "visit"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if ("IntersectionObserver" in window && trackedSections.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
              link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
            });
          }
        });
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    trackedSections.forEach((sec) => navObserver.observe(sec));
  }

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* 2. Mobile Navigation Drawer */
  const mobileToggle = document.getElementById("mobileToggle");
  const mobileDrawer = document.getElementById("mobileDrawer");

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener("click", () => {
      const open = mobileDrawer.classList.toggle("is-open");
      mobileToggle.setAttribute("aria-expanded", String(open));
    });

    mobileDrawer.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("click", () => {
        mobileDrawer.classList.remove("is-open");
        mobileToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* 3. Interactive Underline Tabs */
  const tabBtns = document.querySelectorAll("[data-tab-target]");
  const tabPanels = document.querySelectorAll("[data-tab-panel]");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab-target");
      tabBtns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-selected", String(active));
      });
      tabPanels.forEach((panel) => {
        panel.classList.toggle("is-active", panel.getAttribute("data-tab-panel") === target);
      });
    });
  });

  /* 4. Interactive GiveWP-Style Donation Card */
  const freqBtns = document.querySelectorAll("[data-freq]");
  const fundSelect = document.getElementById("fundSelect");
  const amountBtns = document.querySelectorAll("[data-amount]");
  const customAmountInput = document.getElementById("customAmount");
  const donationForm = document.getElementById("donationForm");
  const donationSubmitBtn = document.getElementById("donationSubmitBtn");
  const donationFormBody = document.getElementById("donationFormBody");
  const donationReceipt = document.getElementById("donationReceipt");
  const resetDonationBtn = document.getElementById("resetDonationBtn");

  let selectedFrequency = "One-Time";
  let selectedAmount = 10;

  const updateDonateButton = () => {
    if (!donationSubmitBtn) return;
    const val = Number(selectedAmount) > 0 ? Number(selectedAmount) : 0;
    const suffix = selectedFrequency === "Monthly" ? " / month" : "";
    donationSubmitBtn.innerHTML =
      val > 0
        ? `Donate $${val.toFixed(2)}${suffix} now &rarr;`
        : "Enter an amount to donate";
    donationSubmitBtn.disabled = val <= 0;
  };

  freqBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedFrequency = btn.getAttribute("data-freq") || "One-Time";
      freqBtns.forEach((b) => b.classList.toggle("is-active", b === btn));
      updateDonateButton();
    });
  });

  amountBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedAmount = Number(btn.getAttribute("data-amount"));
      amountBtns.forEach((b) => b.classList.toggle("is-active", b === btn));
      if (customAmountInput) customAmountInput.value = "";
      updateDonateButton();
    });
  });

  if (customAmountInput) {
    customAmountInput.addEventListener("input", () => {
      const val = parseFloat(customAmountInput.value);
      amountBtns.forEach((b) => b.classList.remove("is-active"));
      selectedAmount = !isNaN(val) && val > 0 ? val : 0;
      updateDonateButton();
    });
  }

  if (donationForm && donationFormBody && donationReceipt) {
    donationForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (selectedAmount <= 0) return;

      const receiptAmount = document.getElementById("receiptAmount");
      const receiptFreq = document.getElementById("receiptFreq");
      const receiptFund = document.getElementById("receiptFund");

      if (receiptAmount) receiptAmount.textContent = `$${Number(selectedAmount).toFixed(2)}`;
      if (receiptFreq) receiptFreq.textContent = selectedFrequency;
      if (receiptFund && fundSelect) receiptFund.textContent = fundSelect.value;

      donationFormBody.style.display = "none";
      donationReceipt.style.display = "block";
    });
  }

  if (resetDonationBtn && donationFormBody && donationReceipt) {
    resetDonationBtn.addEventListener("click", () => {
      donationReceipt.style.display = "none";
      donationFormBody.style.display = "block";
    });
  }

  updateDonateButton();

  /* 5. Quick Contact Form Feedback */
  const contactForm = document.getElementById("contactForm");
  const contactStatus = document.getElementById("contactStatus");

  if (contactForm && contactStatus) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nameInput = document.getElementById("contactName");
      const senderName = nameInput && nameInput.value.trim() ? nameInput.value.trim() : "friend";
      contactStatus.innerHTML =
        `<strong>Message preview ready!</strong> Thank you, ${escapeHtml(senderName)}. ` +
        `On the live site, this goes straight to church leadership.`;
      contactStatus.classList.add("is-visible");
      contactForm.reset();
    });
  }

  /* 6. Interactive Modals */
  const openModalBtns = document.querySelectorAll("[data-open-modal]");
  const closeModalBtns = document.querySelectorAll("[data-close-modal]");
  const modals = document.querySelectorAll(".modal-backdrop");

  const closeAllModals = () => {
    modals.forEach((m) => {
      m.classList.remove("is-open");
      m.setAttribute("aria-hidden", "true");
    });
    document.body.style.overflow = "";
  };

  openModalBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-open-modal");
      const targetModal = document.getElementById(id);
      if (targetModal) {
        closeAllModals();
        targetModal.classList.add("is-open");
        targetModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      }
    });
  });

  closeModalBtns.forEach((btn) => btn.addEventListener("click", closeAllModals));

  modals.forEach((backdrop) => {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeAllModals();
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllModals();
  });

  const visitForm = document.getElementById("visitForm");
  const visitStatus = document.getElementById("visitStatus");
  if (visitForm && visitStatus) {
    visitForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const visitorNameInput = document.getElementById("visitorName");
      const name = visitorNameInput && visitorNameInput.value.trim() ? visitorNameInput.value.trim() : "there";
      visitStatus.innerHTML =
        `<strong>We look forward to welcoming you, ${escapeHtml(name)}!</strong> ` +
        `Sundays at <strong>10:30 AM</strong> &middot; <strong>2785 C Street, Hubbard, OR 97032</strong>.`;
      visitStatus.classList.add("is-visible");
      visitForm.reset();
    });
  }
});

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
