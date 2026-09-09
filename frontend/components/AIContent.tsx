import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
export default function AIContent({ content }: { content: string }) {
 return <div className="ai-content"><ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml components={{
 h1: ({children}) => <h3>{children}</h3>, h2: ({children}) => <h3>{children}</h3>, h3: ({children}) => <h4>{children}</h4>,
 table: ({children}) => <div className="ai-table"><table>{children}</table></div>,
 img: ({alt}) => <span>{alt}</span>,
 a: ({href,children}) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
 }}>{content}</ReactMarkdown></div>;
}
