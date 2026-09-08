# OSSS website

The site for Oriental Skills &amp; Safety Services Pvt Ltd. Plain HTML and CSS,
no framework, no npm. It is published to GitHub Pages by the workflow in
`.github/workflows/static.yml` on every push to `main`.

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home |
| `about.html` | About us — profile, history, vision, why work with us, our team |
| `security.html` | What we do — CCTV, access control, analytics &amp; control room, maintenance |
| `training.html` | Skill development |
| `projects.html` | Our work |
| `contact.html` | Contact us |

## Editing

The menu and the footer are the same on every page, so they live in one place:

```
_parts/header.html   everything from <!DOCTYPE> down to <main>  (menu, theme switch)
_parts/footer.html   everything from </main> down to </html>    (footer, scripts)
_bodies/*.html       the content of one page, between those two
build.py             glues them together
```

> **Never edit `index.html`, `about.html`, `security.html`, `training.html`,
> `projects.html` or `contact.html` directly — including through the GitHub web
> editor.** Those six files are generated. The deploy workflow runs `build.py`
> before publishing, so an edit made in one of them is overwritten on the way to
> the live site: the commit looks correct in the repository, the deploy goes
> green, and the change simply does not appear. Each generated file carries a
> warning comment at the top saying the same thing.

Edit the matching file in `_bodies/`, or `_parts/` for the menu and footer, then run:

```
python build.py
```

Page titles and meta descriptions live in the `PAGES` list at the top of `build.py`.

The deploy workflow runs `build.py` itself and then publishes only the built `.html`
files and `assets/`, so `_parts/` and `_bodies/` stay in the repository and out of the
live site. Commit the built pages anyway — that keeps the repository and the site in
step and lets you open the files locally without running anything.

## Shared files

- `assets/css/site.css` — all styling, including the light and dark palettes.
- `assets/js/site.js` — theme switch, menu panels, carousels, accordions, reveals, form.
- `assets/photos/` — where the photographs go. See **IMAGES.md**.

## Things worth knowing

**Theme switch.** The button in the top bar toggles light and dark and remembers the
choice in the browser. A first-time visitor gets whatever their device is set to.
Colours are CSS variables at the top of `site.css`; change them in one place and both
themes follow.

**Menu panels.** "About us", "What we do" and "Our work" open a panel. On a phone the
same panels become accordions inside the menu drawer. The current page is highlighted
automatically from the filename — nothing to set per page.

**Carousels.** Any block marked `data-carousel` with a `.car` track inside gets arrows,
dots, swipe and mouse drag. Add or remove slides freely; the dots follow.

**The enquiry form** opens the visitor's email application with the details filled in.
To collect enquiries in an inbox instead, point the form at a mail handler on your
hosting and replace the `mailto:` block at the bottom of `site.js`.

**Photographs.** Every grey dashed box is a photo slot and names the file it wants.
`IMAGES.md` lists all of them with what to shoot.

## Previewing locally

```
python -m http.server 8000
```

then open <http://127.0.0.1:8000>.
