# Video Assets for FlowMatrix AI Website

This directory contains all video assets used throughout the single-page website. Videos are displayed using the `VideoBackground` component which handles loading, fallbacks, and error states gracefully.

## Required Video Files (8 Total)

### Section 1: Hero (Full Viewport)
**Filename:** `hero-awakening.mp4`
**Location:** `/public/videos/hero-awakening.mp4`
**Component:** `HeroSection.tsx`
**Usage:** Full-screen background video for hero section
**Recommended Specs:**
- Resolution: 1920x1080 (16:9 aspect ratio)
- Duration: 5-15 seconds (looped)
- Format: MP4 (H.264 codec)
- Max file size: 5MB (optimized for web)
- Orientation: Horizontal
**Creative Direction:** "The Awakening" - Circuit tree awakening, ancient stone transforming into living technology, or abstract AI-powered growth animation

---

### Section 2: Stakes
**Filename:** `stakes-transfer.mp4`
**Location:** `/public/videos/stakes-transfer.mp4`
**Component:** `StakesSection.tsx`
**Usage:** Background video with 30% opacity
**Recommended Specs:**
- Resolution: 1920x1080 (16:9 aspect ratio)
- Duration: 5-15 seconds (looped)
- Format: MP4 (H.264 codec)
- Max file size: 3MB
- Orientation: Horizontal
**Creative Direction:** "The Transfer" - Data flowing, transformation in progress, businesses adapting, or time-lapse of growth vs. stagnation

---

### Section 3: Pillars (3 Videos Required)

#### Pillar 1: Discover
**Filename:** `pillar-discover.mp4`
**Location:** `/public/videos/pillar-discover.mp4`
**Component:** `PillarsSection.tsx` (defined in `constants.ts`)
**Usage:** Square aspect ratio card video
**Recommended Specs:**
- Resolution: 1080x1080 (1:1 aspect ratio) **IMPORTANT: Square format**
- Duration: 3-8 seconds (looped)
- Format: MP4 (H.264 codec)
- Max file size: 2MB
- Orientation: Square
**Creative Direction:** Diagnostic visuals - scanning, analyzing, mapping bottlenecks, discovery process

#### Pillar 2: Build
**Filename:** `pillar-build.mp4`
**Location:** `/public/videos/pillar-build.mp4`
**Component:** `PillarsSection.tsx` (defined in `constants.ts`)
**Usage:** Square aspect ratio card video
**Recommended Specs:**
- Resolution: 1080x1080 (1:1 aspect ratio) **IMPORTANT: Square format**
- Duration: 3-8 seconds (looped)
- Format: MP4 (H.264 codec)
- Max file size: 2MB
- Orientation: Square
**Creative Direction:** Construction/building visuals - custom systems being assembled, modular components connecting, precision engineering

#### Pillar 3: Scale
**Filename:** `pillar-scale.mp4`
**Location:** `/public/videos/pillar-scale.mp4`
**Component:** `PillarsSection.tsx` (defined in `constants.ts`)
**Usage:** Square aspect ratio card video
**Recommended Specs:**
- Resolution: 1080x1080 (1:1 aspect ratio) **IMPORTANT: Square format**
- Duration: 3-8 seconds (looped)
- Format: MP4 (H.264 codec)
- Max file size: 2MB
- Orientation: Square
**Creative Direction:** Growth/expansion visuals - compounding effects, exponential curves, optimization in action, competitive advantage

---

### Section 4: Proof
**Filename:** `proof-gallery.mp4`
**Location:** `/public/videos/proof-gallery.mp4`
**Component:** `ProofSection.tsx`
**Usage:** Background video with 30% opacity
**Recommended Specs:**
- Resolution: 1920x1080 (16:9 aspect ratio)
- Duration: 5-15 seconds (looped)
- Format: MP4 (H.264 codec)
- Max file size: 3MB
- Orientation: Horizontal
**Creative Direction:** Real outcomes - businesses thriving, testimonials in action, success metrics visualized, or client work montage

---

### Section 5: Founders
**Filename:** `founders-stewards.mp4`
**Location:** `/public/videos/founders-stewards.mp4`
**Component:** `FoundersSection.tsx`
**Usage:** Centered video above founder bios
**Recommended Specs:**
- Resolution: 720x1280 (9:16 vertical) OR 1080x1920 (9:16 vertical)
- Duration: 15-30 seconds (looped or plays once)
- Format: MP4 (H.264 codec)
- Max file size: 5MB
- Orientation: **Vertical (portrait mode)** - for modern video aesthetic
**Creative Direction:** "The Stewards" - Founder introduction video, behind-the-scenes, working on solutions, or team philosophy presentation

---

### Section 6: CTA (Final Section)
**Filename:** `cta-invitation.mp4`
**Location:** `/public/videos/cta-invitation.mp4`
**Component:** `CTASection.tsx`
**Usage:** Full-section background video with 50% opacity
**Recommended Specs:**
- Resolution: 1920x1080 (16:9 aspect ratio)
- Duration: 5-15 seconds (looped)
- Format: MP4 (H.264 codec)
- Max file size: 4MB
- Orientation: Horizontal
**Creative Direction:** "The Invitation" - Open door, handshake, beginning of transformation, or path forward visualization

---

## Video Production Guidelines

### General Requirements
- **Format:** MP4 with H.264 codec (best browser compatibility)
- **Compression:** Use web-optimized compression (tools: HandBrake, Adobe Media Encoder, FFmpeg)
- **Autoplay:** All videos autoplay on mute and loop (except founders video which may play once)
- **Fallback:** VideoBackground component handles missing videos gracefully with loading states

### Performance Optimization
- Keep file sizes minimal (use specs above as max sizes)
- Use adaptive bitrate encoding when possible
- Test on mobile devices to ensure smooth playback
- Consider providing WebM alternatives for better compression (optional)

### Aspect Ratio Summary
- **Hero, Stakes, Proof, CTA:** 16:9 horizontal (1920x1080)
- **Pillars (all 3):** 1:1 square (1080x1080) **CRITICAL**
- **Founders:** 9:16 vertical (1080x1920)

### Temporary Placeholders
Until final videos are ready, the VideoBackground component will display a loading state. No broken video icons or errors will appear.

## Installation Instructions

1. Place all video files in `/public/videos/` directory
2. Ensure filenames match exactly (case-sensitive)
3. Videos will be automatically referenced by components
4. No code changes needed - drag and drop into this folder

## Testing Checklist

After adding videos:
- [ ] All 8 videos appear without console errors
- [ ] Videos loop smoothly
- [ ] Videos maintain aspect ratios
- [ ] Page load performance remains acceptable (< 3s on 3G)
- [ ] Videos autoplay on both desktop and mobile browsers

## Contact

For video production questions or creative direction clarification:
**Email:** info@flowmatrixai.com

---

**Last Updated:** December 21, 2025
**Total Videos Required:** 8
**Total Estimated Size:** ~25MB (all videos combined)
