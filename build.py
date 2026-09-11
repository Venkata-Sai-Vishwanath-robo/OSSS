#!/usr/bin/env python3
"""
Assembles the OSSS site.

Every page is header + body + footer. The header and footer live in _parts/
so the menu and the footer stay identical everywhere; the page-specific
content lives in _bodies/. Run this after editing anything in either folder:

    python build.py
"""
import io
import os

PAGES = [
    ("index.html",
     "OSSS — CCTV, Access Control and Skill Development | Hyderabad",
     "Oriental Skills &amp; Safety Services Pvt Ltd supplies, installs and maintains CCTV and "
     "access control systems for Indian Railways, state governments and industry, and has run "
     "technical training programmes since 2011."),

    ("about.html",
     "About us | Oriental Skills &amp; Safety Services",
     "A Hyderabad company working in electronic security and skill development since 2011. "
     "Company profile, our history, vision and mission, directors and senior management."),

    ("security.html",
     "Security systems: CCTV, access control and analytics | OSSS",
     "CCTV surveillance, access control and control room analytics. Survey, supply, installation, "
     "commissioning and annual maintenance from one team."),

    ("training.html",
     "Skill development and technical training | OSSS",
     "Vocational and technical training since 2011 — construction trades, electrical work, "
     "textiles, renewable energy, healthcare, agriculture and computer skills."),

    ("projects.html",
     "Our work: railways, government and industry | OSSS",
     "CCTV and security systems in service for South Central Railway, South Eastern Railway, "
     "the AP School Education Department and GMR."),

    ("contact.html",
     "Contact us | Oriental Skills &amp; Safety Services, Hyderabad",
     "Request a site survey. Headquartered at Moula Ali, Hyderabad, taking up projects across India."),
]

HERE = os.path.dirname(os.path.abspath(__file__))


def read(path):
    with io.open(os.path.join(HERE, path), encoding="utf-8") as fh:
        return fh.read()


def main():
    header = read("_parts/header.html")
    footer = read("_parts/footer.html")

    for name, title, desc in PAGES:
        body = read(os.path.join("_bodies", name))
        banner = (
            "<!--\n"
            "  GENERATED FILE - DO NOT EDIT.\n"
            "  Every edit here is overwritten the next time the site is built,\n"
            "  including by the GitHub Pages workflow, so a change made here\n"
            "  disappears from the live site without any error.\n"
            "\n"
            "  Edit _bodies/%s for this page's content,\n"
            "  or _parts/header.html and _parts/footer.html for the menu and\n"
            "  footer, then run: python build.py\n"
            "-->\n" % name
        )
        head = (header
                .replace("{{TITLE}}", title)
                .replace("{{DESC}}", desc)
                .replace("{{PAGE}}", "" if name == "index.html" else name))
        # the banner goes after the doctype, never before it, so that no
        # browser is tempted to fall back to quirks mode
        head = head.replace("<!DOCTYPE html>\n", "<!DOCTYPE html>\n" + banner, 1)
        page = head + body + "\n" + footer
        with io.open(os.path.join(HERE, name), "w", encoding="utf-8", newline="\n") as fh:
            fh.write(page)
        print("built %-16s %6d bytes" % (name, len(page.encode("utf-8"))))


if __name__ == "__main__":
    main()
