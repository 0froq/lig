# Neutral and hue refinement

Keep this iteration local. Refine the eight hue anchors without changing authored L=0.74/C=0.105. Use gaps of 38–57° to improve spacing while retaining the named color families.

Replace inherited grayscale coordinates with an authored achromatic OKLCH ramp: L=1, .98, .94, .86, .76, .66, .56, .46, .36, .28, .20, .12, 0. Keep existing token names. Use uniform .10 steps through the middle, with finer surface steps at the ends.

Rebind foreground roles to preserve primary/secondary/subtle hierarchy, and separate decorative borders from readable subtle text. Use explicit neutral references for soft canvases and raised surfaces. Show authored L on neutral swatches.

Regenerate all token artifacts. Verify non-UI color contracts, gamut/export error, canvas contrast, lint, types and build. Do not use browser checks or UI tests. Manual acceptance: hue identity/separation, gray progression, four demo variants and comment readability. No commit, push or PR update.
