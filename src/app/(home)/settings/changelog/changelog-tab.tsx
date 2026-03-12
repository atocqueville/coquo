'use client';

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function ChangelogTab() {
    const [content, setContent] = useState<string | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetch('/changelog')
            .then((res) => (res.ok ? res.text() : Promise.reject(new Error('Not found'))))
            .then(setContent)
            .catch(() => setError(true));
    }, []);

    if (error || content === null) {
        return (
            <p className="text-muted-foreground text-sm">
                {content === null && !error ? 'Loading…' : 'Changelog not available.'}
            </p>
        );
    }

    return (
        <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-semibold prose-h3:text-s prose-h2:mt-6 prose-h2:mb-2 prose-ul:my-2">
            <ReactMarkdown>{content}</ReactMarkdown>
        </div>
    );
}
