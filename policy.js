(() => {
  // The full policy and every request link work without JavaScript.
  const printButton = document.querySelector("[data-print]");
  if (printButton) {
    printButton.hidden = false;
    printButton.addEventListener("click", () => window.print());
  }

  const contents = document.querySelector(".contents-disclosure");
  const mobile = window.matchMedia("(max-width: 760px)");
  const updateContents = () => {
    if (contents) contents.open = !mobile.matches;
  };
  updateContents();
  mobile.addEventListener("change", updateContents);

  const links = [...document.querySelectorAll(".contents a")];
  links.forEach((link) => link.addEventListener("click", () => {
    if (mobile.matches && contents) contents.open = false;
  }));

  // One passive, frame-batched scroll listener keeps the long notice inexpensive.
  const sections = [...document.querySelectorAll(".policy > section")];
  let scheduled = false;
  let activeId = "";
  const updateCurrentSection = () => {
    scheduled = false;
    let active = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= 120) active = section;
      else break;
    }
    if (!active || active.id === activeId) return;
    activeId = active.id;
    for (const link of links) {
      if (link.hash === `#${activeId}`) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
  };
  window.addEventListener("scroll", () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(updateCurrentSection);
    }
  }, { passive: true });
  updateCurrentSection();
})();
