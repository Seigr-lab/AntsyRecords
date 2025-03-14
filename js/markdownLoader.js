function loadMarkdown(file, win) {
    console.log(`📄 Loading Markdown: ${file}.md`);

    fetch(`./${file}.md`)
        .then(response => {
            if (!response.ok) throw new Error(`❌ Failed to load ${file}.md (HTTP ${response.status})`);
            return response.text();
        })
        .then(text => {
            // ✅ Sanitize Markdown Content to prevent XSS vulnerabilities
            let sanitizedContent = DOMPurify.sanitize(marked.parse(text));

            document.getElementById(`${file}-content`).innerHTML = `
                <div class="markdown-container">
                    ${sanitizedContent}
                </div>
            `;
        })
        .catch(error => {
            console.error(`❌ Error loading Markdown: ${error.message}`);
            document.getElementById(`${file}-content`).innerHTML = `
                <div class="error-message"><p style="color:red;">Failed to load content.</p></div>
            `;
        });
}
