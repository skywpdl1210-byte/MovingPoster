/**
 * Maps poster-native coordinates onto the screen rect used by background-size: contain.
 */
(function (global) {
  "use strict";

  const POSTER_NATURAL = { width: 1080, height: 1920 };

  function getPosterRect(viewportWidth, viewportHeight, naturalWidth, naturalHeight) {
    const nw = naturalWidth || POSTER_NATURAL.width;
    const nh = naturalHeight || POSTER_NATURAL.height;
    const posterAspect = nw / nh;
    const viewportAspect = viewportWidth / viewportHeight;

    let width;
    let height;
    let left;
    let top;

    if (viewportAspect > posterAspect) {
      height = viewportHeight;
      width = height * posterAspect;
      left = (viewportWidth - width) / 2;
      top = 0;
    } else {
      width = viewportWidth;
      height = width / posterAspect;
      left = 0;
      top = (viewportHeight - height) / 2;
    }

    return { left, top, width, height, naturalWidth: nw, naturalHeight: nh };
  }

  function posterToScreen(rect, px, py) {
    return {
      x: rect.left + (px / rect.naturalWidth) * rect.width,
      y: rect.top + (py / rect.naturalHeight) * rect.height,
    };
  }

  function posterNormToScreen(rect, nx, ny) {
    return posterToScreen(rect, nx * rect.naturalWidth, ny * rect.naturalHeight);
  }

  function screenScale(rect) {
    return rect.width / rect.naturalWidth;
  }

  global.PosterLayout = {
    POSTER_NATURAL,
    getPosterRect,
    posterToScreen,
    posterNormToScreen,
    screenScale,
  };
})(window);
