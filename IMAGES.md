# Adding photographs later

The site currently uses **no photographs**. It runs on typography, line-drawn icon
plates and the ray motif taken from the corporate mark. That is a deliberate choice
rather than a gap: a page with no photograph reads as considered, while a page with
weak or borrowed photographs reads as filler. Nothing looks unfinished, so there is
no rush to shoot anything.

When you do have your own photographs, this is where they go and how to put them in.

## How to drop a photo in

1. Save the file into `assets/photos/`.
2. Open the matching file in `_bodies/` and put an `<img>` where the element it
   replaces currently sits:

   ```html
   <img class="pic-w" src="assets/photos/your-file.jpg"
        alt="Short description of what is in the frame">
   ```

   `pic-w` is 16:9, `pic-s` is 4:3, `pic-t` is a wide 21:9 banner. All three crop to
   fill and scale with the column.
3. Run `python build.py`, then commit and push.

## Where a photograph would earn its place

In rough order of value. You do not need all of them, and one good photograph is
worth more than six weak ones.

| Page | Where | Shot |
| --- | --- | --- |
| Home | Beside the hero text, in a two-column layout | A live control room, or a station platform with your cameras visible |
| About us | Beside the company profile text, replacing the details panel | The Moula Ali office — building front with signage |
| About us | Beside the "why work with us" list | Two engineers aligning a camera, in OSSS uniform and safety gear |
| Security systems | In the analytics section, replacing the diagram | An operator at a control room desk with a video wall behind |
| Security systems | On each camera-type card, replacing the icon plate | Dome, bullet, PTZ, thermal and number plate units, one per card |
| Our work | Under the railways section | An MMTS platform with your cameras on the canopy; a relay room interior |
| Our work | Under the Outer Ring Road card | A wide shot of the corridor with a camera gantry, as a full-width banner |
| Skill development | On each trade card, replacing the icon plate | Trainees at a wiring bench, sewing unit, carpentry bench, computer lab |
| About us | Beside each name in the team section | Head-and-shoulders portraits, replacing the initials circles |

## Shooting notes

- **Use photographs of your own sites and staff.** A slightly imperfect photograph of
  one of your own installations is more convincing than a polished stock image, and a
  stock image of an anonymous control room is worse than the icon plate it replaces.
- **Check permission before publishing** anything taken on railway, defence or
  government premises, and get written consent from trainees before publishing
  photographs of them.
- **No identifiable students or children**, particularly at the KGBV schools. Shoot
  buildings, corridors and equipment instead.
- **Landscape, well lit**, with some space around the subject — the frames crop to a
  fixed shape.
- Save as JPEG at around quality 80, and keep each file under roughly 400 KB.

## Team portraits

Each name in the team section currently shows a circle with the person's initials.
If you get portraits, shoot all four to the same crop and lighting — a set that does
not match looks worse than the initials do. Save them as
`assets/photos/team-<surname>.jpg` and replace
`<div class="mono">VP</div>` with
`<img class="mono" src="assets/photos/team-pandrangi.jpg" alt="Vikram Pandrangi">`.

## Client logos

The five logos in `assets/` (Indian Railways, Government of Andhra Pradesh, GMR,
Indian Air Force, BFSI Sector Skill Council) run in the "Delivering for" strip below
the home page hero. If you add more, use PNGs with a transparent background at
roughly the same height — the strip greys them out and restores the colour on hover,
so mismatched heights show up immediately.

## Unused file in the repository

`assets/photos/hero-control-room.jpg` is still committed but nothing references it.
It is a Delhi Metro platform, so it does not represent your own work. Delete it, or
keep it until you have a photograph from one of your own sites.
