# Mercy Land — Launch Scene Graph (TEMPLATE — fill in)

> Companion to *v2-site.md*. That spec defines how scenes and
> hotspots **work**. This document defines **which ones exist at launch** and how they connect.
>
> **How to use:** fill in §1, then copy the scene block in §2 once per scene. §3–§5 are mostly
> derivable from §2 once it's complete — fill them last. Run §6 before handing off.
>
> Anything you don't know yet: write `TBD`. A `TBD` is useful information; a blank is not.

---

## 1. Launch decisions

Answer these first — they determine how many scene blocks you need.

| Question | Answer |
|---|---|
| How many scenes ship at launch? | |
| Which is the **start** scene (where `return to start` goes)? | |
| Which songs are live at launch? | |
| Which songs exist but stay **dark** / unlinked for now? | |
| Does the **lore scene** ("go home") ship at launch, or later? | |
| Is the **neighborhood** one scene or several? | |
| Does the **mailbox scene** ship at launch? | |
| Are `/termites` and `/void` reachable from the start scene, or deeper in? | |
| Does the header get a 4th item for email, or does it live under `info`? *(open decision, spec §3)* | |

---

## 2. Scenes

One block per scene. Worked example first — delete or keep as reference.
all scene photos are in src/assets/images/scenes/

---

### Scene: `start_house` 

- **Scene id:** `start_house`
- **Display title:** Neighbor's House
- **Is this the start scene?** Yes
- **Photograph:** start_house.png
- **What's in frame (features available to anchor to):** flag, front door, right front window, path, left side street, right side street, garage door
- **Mood / notes for designer:** 

**Hotspots:**

| # | Label | Anchored to (feature) | Target type | Target | Priority | Notes |
|---|---|---|---|---|---|---|
| 1 | explore the neighborhood | left side street | `travel` | `desert_house` | 5 | left edge of screen|
| 2 | go home | path | `travel` | `house_monster` | 3 | |
| 3 | check mail | front door | `travel` | `mailbox` | 2 |
| 4 | use computer room | right front window | `travel` | `computer_room_void` | 1 | |
| 5 | song 01 | upstairs left window | `external` | link TBD | 4 | |
| 6 | what's that sound? | right side street | `travel` | `summertime_house` | 6 | right edge of screen|
| 7 | steal the flag | flag | `travel` | `flag_void` | 7 | 

- **Scene panel (persistent content), if any:** none
- **Max visible labels (mobile density cap):** 4
- **Reachable from:** *(start scene — also reachable via `return to start` everywhere)*

---

### Scene: `desert_house`

- **Scene id:** `desert_house`
- **Display title:** Scary Neighbor's House
- **Is this the start scene?** no
- **Photograph:** desert_house.png
- **What's in frame (features available to anchor to):** front door
- **Mood / notes for designer:** 

**Hotspots:**

| # | Label | Anchored to (feature) | Target type | Target | Priority | Notes |
|---|---|---|---|---|---|---|
| 1 | trespass | front door | `external` | https://www.youtube.com/watch?v=fRFkrM11FyE& | 1 | |

- **Scene panel (persistent content), if any:** 
- **Max visible labels (mobile density cap):** 4
- **Reachable from:** *(which scenes have a hotspot pointing here)* `start_house`

---

### Scene: `summertime_house`

- **Scene id:** `summertime_house`
- **Display title:** New Neighbor's House
- **Is this the start scene?** no
- **Photograph:** blue_house.png
- **What's in frame:** front door, left front window, second left front window, right window, second right window, stairs, left side street
- **Mood / notes for designer:** 

**Hotspots:**

| # | Label | Anchored to (feature) | Target type | Target | Priority | Notes |
|---|---|---|---|---|---|---|
| 1 | go home | left side street | `travel` | `house_monster` | | |
| 2 | knock on the door | front door | `overlay` | TODO: link to summertime YT video | | |
| 3 | spy on them | left front window | `overlay` | TODO - link to BTS photos | | |

- **Scene panel, if any:** 
- **Max visible labels:** 4
- **Reachable from:** start_house

---

### Scene: `house_monster`

- **Scene id:** `house_monster`
- **Display title:** Do you want to go home?
- **Is this the start scene?** no
- **Photograph:** house monster.png
- **What's in frame:** face, left leg, right leg, red roof hat, door
- **Mood / notes for designer:** 

**Hotspots:**

| # | Label | Anchored to (feature) | Target type | Target | Priority | Notes |
|---|---|---|---|---|---|---|
| 1 | go home | door | `overlay` | text: "You're not ready to go home <3" | 1| |
| 2 | stay here | face | `travel` | `start_house` | 2| |
| 3 | | | | | | |
| 4 | | | | | | |

- **Scene panel, if any:** 
- **Max visible labels:** 4
- **Reachable from:** 

---

### Scene: `mailbox`

- **Scene id:** `mailbox`
- **Display title:** Sign Up to Hear from Mercy Land
- **Is this the start scene?** no
- **Photograph:** TBD - need mailbox image from stills
- **What's in frame:** 
- **Mood / notes for designer:** 

- **Scene panel, if any:** email signup panel
- **Max visible labels:** 
- **Reachable from:** 

---

### Scene: `computer_room_void`

- **Scene id:** `computer_room_void`
- **Display title:** 
- **Is this the start scene?** no
- **Photograph:** void.jpg
- **What's in frame:** computer, chair, phone, lava lamp
- **Mood / notes for designer:** 

**Hotspots:**

| # | Label | Anchored to (feature) | Target type | Target | Priority | Notes |
|---|---|---|---|---|---|---|
| 1 | look at void | computer | `enter`| `/void` | 1| |

- **Scene panel, if any:** LJ text conversation panel
- **Max visible labels:** 
- **Reachable from:** 

---

### Scene: `computer_room_chat_world`

- **Scene id:** `computer_room_chat_world`
- **Display title:** 
- **Is this the start scene?** no
- **Photograph:** LJ chat world.jpg
- **What's in frame:** computer, lava lamp

**Hotspots:**

| # | Label | Anchored to (feature) | Target type | Target | Priority | Notes |
|---|---|---|---|---|---|---|
| 1 | open chat world | computer | `enter` | `/chat` | 1| |
| 2 | look at void instead | lava lamp | `enter` | `/void` | 2| | 
| 3 | im good | TBD | `travel` | `start_house`| | |
| 4 | | | | | | |

- **Scene panel, if any:** LJ text conversation panel
- **Max visible labels:** 
- **Reachable from:** 

----

### Scene: `flag_void`

- **Scene id:** `flag_void`
- **Display title:** 
- **Is this the start scene?** no
- **Photograph:** flag.gif
- **What's in frame:** 
- **Mood / notes for designer:** 

**Hotspots:**

| # | Label | Anchored to (feature) | Target type | Target | Priority | Notes |
|---|---|---|---|---|---|---|
| 1 | | | | | | |
| 2 | | | | | | |
| 3 | | | | | | |
| 4 | | | | | | |

- **Scene panel, if any:** text overlay
- **Max visible labels:** 
- **Reachable from:** 

---

**Target type reference** *(spec §2)*
- `travel` → another **scene** in the world
- `enter` → an on-site **route** (`/termites`, `/void`, `/chat`)
- `overlay` → **registry content** opened in place (video, listening links, photos, lore text)
- `external` → **off-site** URL (streaming / Odesli)

---

## 3. Connection map

Every `travel` hotspot from §2, as a list of edges. This *is* the graph.

| From scene | → | To scene | Via hotspot |
|---|---|---|---|
| | → | | |
| | → | | |
| | → | | |
| | → | | |

**Dead ends** *(scenes with no outbound `travel` hotspots — fine, but note them)*:

**Orphans** *(scenes nothing points to — these are bugs unless intentional)*:

---

## 4. Content registry entries needed

Every `overlay` target and every scene `panel` from §2. This is the build list for content
components *(spec §4)*.

| Content id | Host (overlay / scene panel) | What's inside | Embeds? (YouTube / Bandcamp / images) | Status |
|---|---|---|---|---|
| `emailSignup` | scene panel — `mailbox` | signup form, Formspree | none | |
| | | | | |
| | | | | |

> Reminder *(spec §4)*: embeds must unmount on close, lazy-mount on open, and reserve their
> aspect ratio. Cap ~2 simultaneous embeds per content component.

---

## 5. Shot list (designer handoff)

Derived from §2 — the photographs actually needed.

| Scene | Photo description | Have / need | Landscape crop | Portrait crop *(must be wider than viewport)* | Focal point | Negative space needed for |
|---|---|---|---|---|---|---|
| | | | | | | |
| | | | | | | |
| | | | | | | |

> Reminder *(spec §1, §5)*: portrait assets are **authored wider than the portrait viewport** so
> panning has somewhere to go. Leave clear areas where labels will sit — hotspot labels carry a
> scrim, but busy backgrounds still hurt.

---

## 6. Validation checklist

Run before handoff. Each item is a rule from spec v4.

- [ ] Every `travel` target names a scene that exists in §2.
- [ ] Every `enter` target is a real route that exists (or is stubbed).
- [ ] Every `overlay` target and scene `panel` appears in §4.
- [ ] No orphan scenes in §3 (nothing unreachable unless deliberately hidden).
- [ ] The start scene is defined and every scene can return to it.
- [ ] **Email signup is reachable without exploration** — via the header, or one hop from start.
      *(§3 coverage rule: essential utility content is never discoverable-only.)*
- [ ] Streaming / merch reachable from the header on every scene, not only via hotspots.
- [ ] Every scene has a portrait photograph planned, wider than the viewport.
- [ ] No scene exceeds its `maxVisibleLabels` on mobile without edge indicators handling the rest.
- [ ] Each hotspot label is short enough to read at 12px, with a `labelShort` where needed.
- [ ] Anchors near `x < 0.15` or `x > 0.85` are expected to become mobile edge indicators — check
      that's acceptable per hotspot.
- [ ] Hotspot list order per scene is a sensible **keyboard tour** (tab order follows list order,
      not visual position).
- [ ] Dark / unlinked songs are noted in §1 and simply absent as hotspots — not rendered
      disabled. *(`locked` state is reserved but unwired.)*

---

## 7. TODOS

- need to make chat world visible + seed with starting message
- add a secret code somewhere that people who find it can use for something?? points system redeemable for merch
- need to update nav bar implementation.- info leads to /flat, listen leads to some new link, merch leads to bandcamp link (existing)

TALK TO TATUM ABOUT:
- flat design
- links for listening to music
- text for flag page:
      THANK GOD FOR MERCY LAND, our debut album, is out now. This album was borne out of 30 years of life times 2 so 60 years of life. I heard this album on hot afternoons home alone as a pre-teen, on late nights wandering West Philadelphia as a teenager, finally drawn out of us in one glorious spring in New Orleans, when the clouds and the longing and the weight of LIFE crushed and cracked us but didn't break us. We took inspiration from the songwriting greats like Bruce and Lucinda and Lana - fierce American souls conjuring magical melodies and poetry - from the brilliant producers like [] []. 
      
      I'm not supposed to say this because I'm supposed to make it simple for you, where the music came from and what it's about. But I am saying it to you anyway because I think you know what I mean, that all the things you love can become part of you. All of us are so much more than just one or two references, one or two frames of mind. 

      Listen to it while driving in your car nowhere in particular, listen to it while doing the dishes and dancing in the mirror, listen to it on a long run, listen to it when you can't get to the ocean and you want water to crash over you like a wave, listen to it when you're stuck, when you're excited, when you feel darkness hanging around you and you want to wrap it around you like a cloak!! Like a veil!! 

      We've lived so many lives already in this beautiful, brutal country. Bored to death by the monotony of school and work, reckless agents of our own destruction in so many downtowns, pathetic creatures seeking refuge in mountains and bayous. No matter how bad it gets I can't help but say - thank god for this - for this life and this world. Thank God for Mercy Land.

## 8. FUTURE
- once we have email login / association, we can start doing the games + keeping up the points tally