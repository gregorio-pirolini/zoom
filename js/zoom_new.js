jQuery(function ($) {
  const $lens = $("#large");

  const state = {
    zoomRatio: 2,
    lensSize: 220,
    active: false,
    pointerId: null,
    holdTimer: null,
    holdDelay: 180,
    imgEl: null,
  };

  const supportsHoverZoom = 
    window.matchMedia("(hover: hover)").matches &&
    window.matchMedia("(pointer: fine)").matches;

  function getLargeImageUrl(src) { //remove -<numbers>x<numbers>from .zoom img src to get the large image src
    return src.replace(/-\d+x\d+(?=\.(jpg|jpeg|png|webp)$)/i, "");
  } 

  function setLensBackground(url, displayedWidth) {
    $lens.css("background-image", `url(${url})`);
    const img = new Image();
    img.src = url;
    img.onload = () => {
      state.zoomRatio = img.naturalWidth / displayedWidth;
    };
  }

  function showLens() { $lens.show(); }
  function hideLens() { $lens.hide(); }

  function startZoom(imgEl) {
    state.active = true;
    state.imgEl = imgEl;
    $("body").addClass("zooming");

    const src = imgEl.currentSrc || imgEl.src;
    const largeUrl = getLargeImageUrl(src);
    const displayedWidth = imgEl.getBoundingClientRect().width;

    setLensBackground(largeUrl, displayedWidth);
    showLens();
  }

  function stopZoom() {
    state.active = false;
    state.pointerId = null;
    state.imgEl = null;
    $("body").removeClass("zooming");
    hideLens();
  }

  function updateLens(pageX, pageY) {
    if (!state.active || !state.imgEl) return;

    const rect = state.imgEl.getBoundingClientRect();

    // Convert rect (viewport) -> page coordinates
    const imgPageLeft = rect.left + window.scrollX;
    const imgPageTop = rect.top + window.scrollY;

    const imgW = rect.width;
    const imgH = rect.height;

    // Cursor inside image (CSS px)
    const x = pageX - imgPageLeft;
    const y = pageY - imgPageTop;

    if (x < 0 || y < 0 || x > imgW || y > imgH) {
      stopZoom();
      return;
    }

    const half = state.lensSize / 2;

    // Position lens near cursor (page coords)
    const lensLeft = pageX - half;
    const lensTop = pageY - half;

    // Background offset so cursor point appears centered
    const bgX = -(x * state.zoomRatio - half);
    const bgY = -(y * state.zoomRatio - half);

    $lens.css({
      left: lensLeft,
      top: lensTop,
      backgroundPosition: `${bgX}px ${bgY}px`,
      backgroundSize: `${imgW * state.zoomRatio}px ${imgH * state.zoomRatio}px`,
    });
  }

  // ---------- Desktop hover ----------
  if (supportsHoverZoom) {
    $("body").on("mouseenter", ".zoom img", function () {
      startZoom(this);
    });

    $("body").on("mousemove", ".zoom img", function (e) {
      updateLens(e.pageX, e.pageY);
    });

    $("body").on("mouseleave", ".zoom img", function () {
      stopZoom();
    });

    return;
  }

  // ---------- Touch: press & hold ----------
  $("body").on("pointerdown", ".zoom img", function (e) {
    if (e.pointerType === "mouse") return;

    state.pointerId = e.pointerId;

    state.holdTimer = setTimeout(() => {
      startZoom(e.currentTarget);
      updateLens(e.pageX, e.pageY);
    }, state.holdDelay);
  });

  $("body").on("pointermove", ".zoom img", function (e) {
    if (e.pointerType === "mouse") return;
    if (state.pointerId !== e.pointerId) return;

    if (state.active) {
      e.preventDefault(); // prevent scroll ONLY while zooming
      updateLens(e.pageX, e.pageY);
    }
  });

  $("body").on("pointerup pointercancel", ".zoom img", function (e) {
    if (e.pointerType === "mouse") return;
    if (state.pointerId !== e.pointerId) return;

    clearTimeout(state.holdTimer);
    state.holdTimer = null;

    stopZoom();
  });
});
