/**
 * Overlay positions in poster pixel coordinates (1080 × 1920).
 */
window.PosterConfig = {
  naturalWidth: 1080,
  naturalHeight: 1920,

  // Squiggly route along the white path on the right
  walkPath:
    "M 902 374 " +
    "C 934 412 956 451 945 490 " +
    "S 885 547 924 595 " +
    "S 972 648 940 701 " +
    "S 881 754 931 806 " +
    "S 978 864 950 912 " +
    "S 886 965 935 1018 " +
    "S 983 1075 950 1123 " +
    "S 891 1176 941 1229 " +
    "S 988 1286 956 1334 " +
    "S 896 1387 946 1440 " +
    "C 972 1478 963 1517 940 1546",

  secondaryPath:
    "M 902 374 " +
    "C 842 461 756 576 626 730 " +
    "S 497 845 454 922",

  branchPath:
    "M 216 998 " +
    "C 302 922 378 845 454 922",

  walkerMask: { x: 870, y: 336, w: 81, h: 125, color: "#fde01a" },

  walker: {
    size: 58,
    duration: 50,
    bobAmplitude: 7,
    bobSpeed: 2.2,
    wobbleDegrees: 2.5,
    wobbleSpeed: 1.5,
    frameInterval: 0.45,
  },

  cluster: {
    cx: 454,
    cy: 922,
    radius: 118,
    dotCount: 100,
    fadeSpeed: 0.003,
    driftScale: 2.8,
  },

  pathDots: {
    count: 30,
    speed: 0.000042,
    radius: 3.2,
  },
};
