import { Link } from 'react-router-dom';

export const ChatSources = ({
	sources = [],
	documents = [],
	isPending,
	isError,
}) => {
	if (sources.length === 0) return null;

	const matchingDocuments = documents.filter((document) =>
		sources.includes(document.id),
	);

	return (
		<div className='chat__sources'>
			<p className='chat__sources-title'>Hämtade underlag:</p>

			{isPending && <p role='status'>Laddar dokumentlänkar...</p>}

			{isError && <p role='alert'>Det gick inte att hämta dokumentlänkarna.</p>}
			<ul className='chat__sources-list'>
				{matchingDocuments.map((document) => (
					<li className='chat__sources-item' key={document.id}>
						<Link
							className='chat__source-link'
							to={`/support/${encodeURIComponent(document.slug)}`}>
							{document.title}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};
