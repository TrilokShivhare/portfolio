# Manage Your LinkedIn Feed

Your portfolio uses a custom, high-performance LinkedIn feed. There are two ways to keep it fresh:

## Option A: One-Time Automation (Recommended)
Use a third-party service to automate your feed. No coding is required after the initial setup.

1.  **Choose a Service**: Visit [Elfsight LinkedIn Feed](https://elfsight.com/linkedin-feed-widget/) or [SociableKIT](https://www.sociablekit.com/).
2.  **Paste your Profile URL**: Link your LinkedIn account in their dashboard.
3.  **Get the Embed Code**: They will give you a 1-line script like `<script src="..."></script>`.
4.  **Update `index.html`**:
    - Open `index.html`.
    - Find `<div class="linkedin-grid" id="linkedinGrid">`.
    - Replace everything inside that div with your new embed code.

---

## Option B: Manual Updates (Best Design)
This keeps your site fast and gives you total control over the text and professional look.

1.  **Open `script.js`**: Look for the `const linkedinPosts` array at the bottom.
2.  **Copy-Paste an existing block**:
    ```javascript
    {
        title: 'Your New Post Title',
        excerpt: 'A short catchy summary of your post...',
        image: 'https://images.unsplash.com/photo-...', // Or a direct image link
        link: 'https://linkedin.com/posts/...',
        tags: ['#NewTag', '#Expertise']
    },
    ```
3.  **Save the file**: The new card will appear instantly on your site.

> [!TIP]
> **Why do images sometimes break?**
> LinkedIn limits direct image linking. If a real image stops showing, the site automatically switches to a beautiful high-quality technical placeholder to keep your portfolio looking professional.
