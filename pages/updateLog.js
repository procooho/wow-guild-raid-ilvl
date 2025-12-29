import ProtectedRoute from '@/components/ProtectedRoute';
import { Container, useMediaQuery } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTheme } from '@mui/material/styles';
import fs from 'fs';
import path from 'path';

export default function UpdateLog({ content }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        // <ProtectedRoute>
        <Container maxWidth="md" sx={{ py: 4 }}>
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
        </Container>
    );
}

export async function getStaticProps() {
    try {
        const filePath = path.join(process.cwd(), 'README.md');
        const content = fs.readFileSync(filePath, 'utf8');
        return {
            props: {
                content,
            },
        };
    } catch (error) {
        console.error("Error reading README.md:", error);
        return {
            props: {
                content: "Failed to load update log.",
            },
        };
    }
}