# Atlas duplicate audit

## Rule
A Family must represent a distinct implementation/interaction principle, not merely a different label. If two entries use the same preview renderer and the same underlying motion principle, they are candidates for consolidation as Variants.

## Immediate duplicate clusters to review

### Sticky / pinned scroll
- Sticky Chapter Switch
- Layered Card Stack
- Sticky Crop Reveal
- Viewport Page Stack
These must NOT share one generic preview. Keep separate only when the core motion differs: chapter state switching, card stacking, crop expansion, viewport covering.

### Camera / spatial scroll
- Scroll Camera Orbit
- Scroll Camera Dolly
- Scroll Camera Roll
- Depth Plane Journey
- 3D Tunnel Gallery
Each needs a distinct camera-path preview. Generic CAMERA preview is prohibited.

### Mask / reveal
- Split Mask Reveal
- Scroll Mask Wipe
- Circular Scroll Reveal
- Sticky Crop Reveal
- Image Slice Scroll Reveal
- Curtain Scroll Reveal
Consolidate only where the mask geometry and trigger model are genuinely the same.

### Parallax / depth
- Layered Parallax Scroll
- Depth Blur Parallax
- Reverse Parallax
- 3D Card Parallax
Keep as one Parallax family with Variants if implementation shares the same layer-speed model; otherwise mark renderer differences explicitly.

### Velocity response
- Scroll Velocity Skew
- Scroll Velocity Blur
- Scroll Velocity Stretch
- Scroll Image Trail
Potential parent Family: Velocity Reactive Scroll; variants must demonstrate distinct transforms.

### Cursor lens / reveal
- Cursor Magnifying Lens
- Cursor X-Ray Mask
- Cursor Refraction Lens
- Cursor Spotlight
Potential parent Family: Cursor Lens, but optical refraction should remain distinct if WebGL implementation is required.

### Cursor field
- Cursor Gravity Field
- Cursor Repulsion Field
- Cursor Distortion Field
- Cursor Liquid Push
Do not share generic pointer preview; physics, UV displacement and fluid simulation are distinct.

### Trail
- Cursor Image Trail
- Cursor Text Trail
- Particle Cursor Trail
- Smoke Cursor Trail
Potential Trail parent family with media/particle/fluid variants; fluid implementation may remain separate due to FBO requirement.

### Type reveal
- Split Mask Reveal
- Scroll-Scrubbed Copy
- Text Scramble Decode
These are NOT duplicates and must never use the same renderer.

## Production gate
An entry cannot be marked production-ready unless:
1. name, description and preview describe the same effect;
2. preview is visually distinguishable from sibling families;
3. renderer is mapped by family id or explicit renderer id, not category fallback;
4. duplicate cluster decision is recorded as KEEP, MERGE or VARIANT.
