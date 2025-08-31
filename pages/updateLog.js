import LeftNav from '@/components/LeftNav';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function UpdateLog() {
    const [content, setContent] = useState("");

    useEffect(() => {
        fetch("./README.md")
            .then((res) => res.text())
            .then((text) => setContent(text));
    }, []);

    return (
        <ProtectedRoute>
            <Box sx={{ display: 'flex' }}>
                <LeftNav />
                <Box sx={{ p: 4 }}>
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            p: ({ node, ...props }) => (
                                <p style={{ marginBottom: '0.8rem', lineHeight: '1.6' }} {...props} />
                            ),
                            strong: ({ node, ...props }) => (
                                <strong style={{ marginBottom: '0.5rem' }} {...props} />
                            ),
                            h1: ({ node, ...props }) => (
                                <h1 style={{ marginBottom: '1rem' }} {...props} />
                            ),
                            h2: ({ node, ...props }) => (
                                <h2 style={{ marginBottom: '0.8rem' }} {...props} />
                            ),
                            ul: ({ node, ...props }) => (
                                <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem', lineHeight: '1.6' }} {...props} />
                            ),
                            li: ({ node, ...props }) => (
                                <li style={{ marginBottom: '0.5rem', lineHeight: '1.6' }} {...props} />
                            ),
                            hr: ({ node, ...props }) => <hr style={{ margin: '2rem 0' }} {...props} />,
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                </Box>
            </Box>
        </ProtectedRoute >
    );
}