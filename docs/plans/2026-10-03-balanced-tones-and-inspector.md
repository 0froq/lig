# Balanced tones and inspector

Keep the current four visual families and clarify their boundaries: mono is the reading baseline; struct marks binding/interface structure; ref marks values and references; action marks execution. Constructor captures belong to action. These are visual roles, not an exhaustive compiler taxonomy.

Replace endpoint-proportional accent ramps with explicit signed OKLCH offsets. Within each mode, highlight/base/muted have equal OKLab distance on both sides, including the ref family. Keep hue fixed and reduce side chroma equally. Light mode needs smaller L steps because all syntax tiers must remain readable against a light canvas. Light and light-soft use lighter canvases and text; dark mono levels are centered around their base. Keep generated ports derived from core.

Introduce a validated offset expression. Verify gamut, quantization, symmetric distances and contrast after sRGB export. Keep each layer's L/C uniform across the eight hues. Show equal-width swatch thirds.

Fix inspector block height relative to the viewport, reserve scrollbar space, contain scrolling and disable scroll anchoring. Keep the heading visible, and scroll long source within the inspector instead of growing the document. Do not write UI tests or use browser checks; verify types/build and describe manual hover/scroll checks.
