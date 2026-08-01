Successor to `theatrum/cover-card` (deprecated, see its README). Same behavior, with two layout changes:

1. The featured-image background moves from the outer `.cover-card` wrapper to the inner `.user-content` div.
2. The `.bottom-bar` (and its `.buttons`) are no longer `position: absolute` — they flow normally as flex children of `.chance-card`.

Existing `theatrum/cover-card` instances are not auto-migrated; update them manually post by post.
