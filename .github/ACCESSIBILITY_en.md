# Accessibility Statement

[繁體中文](ACCESSIBILITY.md) | **English** | [日本語](ACCESSIBILITY_ja.md) | [한국어](ACCESSIBILITY_ko.md)

We want everyone to be able to read the [project site](https://scorpio-meow.github.io/Threads-skill/) and use its tools, whatever device, input method or assistive technology they use. The site uses WCAG 2.2 AA as its reference standard; the issues that remain are listed below.

## Scope

This statement covers the project site (`docs/`). The skill itself (`threads-api/SKILL.md`), the READMEs and the other documents are plain Markdown shown on GitHub or inside AI tools, so their accessibility depends on those platforms.

## What's supported

- **Keyboard**: every interactive element works by keyboard, in a logical focus order. The first Tab stop is a “Skip to main content” link. The toggle buttons and the tabs in “What's inside” support the arrow keys and Home/End; Escape closes the language menu and returns focus to its button. Code blocks and tables that need scrolling can be focused with Tab and scrolled with the arrow keys.
- **Focus**: every control has a clear focus outline (2px solid). In “One skill, three jobs”, focusing an example switches the view to show it.
- **Contrast**: body text, secondary text, code and button text are at least 4.5:1 in both the light and dark themes; the boundaries of switches, text fields, dropdowns and toggle buttons are at least 3:1; link underlines in body text are at least 3:1.
- **Not colour alone**: every check in the grading panel at the top of the page carries “Passed” or “Failed” text; in “Check before you send”, errors and warnings differ in shape and text label, and the status line reports how many of each there are.
- **Light and dark themes**: follow the operating system setting by default, and the “Theme” button in the header switches to light or dark; the choice is remembered.
- **Forced colours** (checked in the code): in Windows High Contrast mode, the selected tab, switches, toggle buttons and the FAQ +/− icons use system colours.
- **Reduced motion** (checked in the code): when the system's “reduce motion” setting is on, entrance effects, scroll reveals, number count-ups, expanding and sliding animations are turned off or shortened to almost nothing. The site has no autoplaying media, iframes or time limits.
- **Semantics**: banner, navigation, main and footer landmarks, with no skipped heading levels. Switching languages updates `<html lang>`; every form field has a label; tables have captions and `scope`.
- **Status messages**: results from “Check before you send” are announced through `aria-live` and aren't announced again when you switch languages; copy confirmations use `role="status"` and are removed after they fade; once you've used the install command generator, changing an option announces the new command and hint.
- **Zoom and reflow**: no horizontal scrolling at 320 CSS px wide in any of the four languages, and nothing overflows with the WCAG 1.4.12 text-spacing settings applied; in very short windows, the tab bar no longer sticks to the top of the screen; on narrow screens, header links that don't fit move to a second row. Timeline labels that don't fit their bar are hidden, and the legend below has the full text. Font sizes use rem, so they scale with the browser's text size setting.
- **Touch**: most controls are at least 44px tall, and the smaller ones meet the size or spacing requirement of WCAG 2.5.8.
- **No third-party resources**: the site uses the device's built-in system fonts and loads no fonts, scripts or trackers from other sites.
- **When scripts fail**: if a script fails to load, the content shows right away instead of staying hidden.
- **Printing**: sections you haven't scrolled to print too, and all 8 tabs in “What's inside” are expanded.
- **JavaScript disabled**: all text content is readable, including the “without the skill” reply; controls that need JavaScript are hidden and replaced with explanations.

## How it was tested

Tested in October 2026 and rechecked after the fixes:

- **Hands-on**: Chromium 152 on Windows 11, at 1280×800, 640×400, 480×800, 320×640 and 320×256; light and dark themes, including the manual switch; all four languages; keyboard operation; text-spacing settings applied. Printing was simulated with the print styles. The JavaScript-disabled layout was simulated by removing the script state.
- **Contrast**: calculated from the CSS colour values, not measured from rendered pixels.
- **Checked in the code only**: reduced motion, forced colours (Windows High Contrast), actual printing, and behaviour in Firefox and Safari.
- **Not tested yet**: screen readers (NVDA, JAWS, VoiceOver, TalkBack), real mobile devices and actual browser zoom.

## Known limitations

- **With JavaScript disabled**, “Check before you send”, the copy buttons and the toggle buttons don't work: the checker calculates results live, and copying needs the browser's clipboard. In their place, the checker section explains how to read the source or run the check on your own computer, and the install section explains how to install for the current project only or use npx.

## Reporting a barrier

- [Open an issue](https://github.com/Scorpio-meow/Threads-skill/issues/new/choose) with “Project site issue”, choose “Accessibility barrier” as the type, and include your browser, device and any assistive technology.
- If the issue form doesn't work for you, you can post in [Discussions](https://github.com/Scorpio-meow/Threads-skill/discussions) instead.

This project is maintained by one person, who will reply as soon as possible. Fixes will be reflected in this statement and recorded in [CHANGELOG_en.md](../CHANGELOG_en.md).
