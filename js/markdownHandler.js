function handleMarkdown(file) {
    console.log(`📄 Processing Markdown: ${file}.md`);

    fetch(`./${file}.md`)
        .then(response => {
            if (!response.ok) throw new Error(`❌ Failed to load ${file}.md (HTTP ${response.status})`);
            return response.text();
        })
        .then(text => {
            let parsedMarkdown = marked.parse(text.replace(/\n/g, "  \n")); // Forces line breaks

            // ✅ Sanitize Markdown to prevent security risks
            let sanitizedContent = DOMPurify.sanitize(parsedMarkdown);

            // ✅ Improve Email Display Handling
            sanitizedContent = sanitizedContent.replace(
                /\[sonisk@seigr\.net\]\(mailto:sonisk@seigr\.net\)/g,
                `<a href="mailto:sonisk@seigr.net" style="text-decoration: none; color: #fff;">sonisk@seigr.net</a>`
            );

            // ✅ Open external links in a new tab
            sanitizedContent = sanitizedContent.replace(
                /<a href="(https?:\/\/[^"]+)"([^>]*)>/g,
                `<a href="$1" target="_blank" rel="noopener noreferrer"$2>`
            );

            let contentDiv = document.getElementById(`${file}-content`);
            if (!contentDiv) {
                console.error(`❌ Content container not found for: ${file}`);
                return;
            }

            contentDiv.innerHTML = `
                <div class="markdown-container">
                    <div style="max-width: 600px; word-wrap: break-word;">
                        ${sanitizedContent}
                    </div>
                </div>
            `;
        })
        .catch(error => {
            console.error(`❌ Error loading Markdown: ${error.message}`);
            let contentDiv = document.getElementById(`${file}-content`);
            if (contentDiv) {
                contentDiv.innerHTML = `
                    <div class="error-message">
                        <p style="color:red;">Failed to load content.</p>
                    </div>
                `;
            }
        });
}
