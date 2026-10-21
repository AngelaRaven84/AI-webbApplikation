export const combineDocuments = (documents) => {
    return documents.map(
            document => document.content
        ).join('\n\n')
}