# Manik Hossain: Portfolio

A static, single-page portfolio site built with plain HTML/CSS/JS (no build step, no dependencies).

## Structure

```
index.html          Main page
css/style.css        Styles (dark theme, responsive)
js/script.js          Nav, scroll-spy, reveal animations
assets/profile.jpg               Headshot
assets/Resume-Manik-Hossain.pdf  Downloadable resume
```

## Preview locally

Open `index.html` directly in a browser, or serve it so relative paths and downloads behave the same as in production:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy to GitHub Pages

1. Push this folder to a GitHub repository (e.g. `ManikHossain27/portfolio`).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`.
4. Save. The site will be published at `https://ManikHossain27.github.io/<repo-name>/`.

## Updating content

All content lives directly in `index.html`. To update experience, projects, or skills, edit the relevant `<section>`. No build step is required.
