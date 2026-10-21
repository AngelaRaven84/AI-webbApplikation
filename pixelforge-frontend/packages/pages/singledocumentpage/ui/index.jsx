import './index.css';

import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, FileText } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchDocuments } from '@pixelforge/api';
import { Icon } from '@pixelforge/icon';

export const SingleDocumentPage = () => {
    const { slug } = useParams();

    const {
        data: documents = [],
        isPending,
        isError,
        error
    } = useQuery({
        queryKey: ['documents'],
        queryFn: fetchDocuments
    });

    const document = documents.find(
        item => item.slug === slug
    );

    return (
        <div className="single-document-page wrapper">
            <Link
                to="/support"
                className="single-document-page__back"
            >
                <Icon icon={ArrowLeft} size={16} />
                Back to Support
            </Link>

            {isPending && (
                <p>Loading document...</p>
            )}

            {isError && (
                <p role="alert">
                    Could not load document: {error.message}
                </p>
            )}

            {!isPending && !isError && !document && (
                <p>Document not found.</p>
            )}

            {!isPending && !isError && document && (
                <article className="single-document-page__article">
                    <header className="single-document-page__header">
                        <span className="single-document-page__category">
                            <Icon icon={FileText} size={16} />
                            {document.category}
                        </span>

                        <h1>{document.title}</h1>
                        <p>{document.description}</p>
                    </header>

                    <div className="single-document-page__content">
                        <ReactMarkdown>
                            {document.content}
                        </ReactMarkdown>
                    </div>
                </article>
            )}
        </div>
    );
};