import { parseMermaidToExcalidraw } from "@excalidraw/mermaid-to-excalidraw";
import { convertToExcalidrawElements } from "@excalidraw/excalidraw"


export default async function mermaidToExcalidrawElements(mermaidSyntax: string) {
    try {
        const { elements, files } = await parseMermaidToExcalidraw(mermaidSyntax, {
        });
        const excalidrawElements = convertToExcalidrawElements(elements);
        
        return excalidrawElements;
    } catch (e) {
    }
}
