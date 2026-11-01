import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { useDocumentTitle } from "./use-document-title"

function TitleSetter({ title }: { title?: string }) {
    useDocumentTitle(title)
    return null
}

describe("useDocumentTitle", () => {
    it("should set document.title with the shared suffix once a title is provided", () => {
        const { rerender } = render(<TitleSetter title={undefined} />)
        expect(document.title).not.toContain("Pedido #7")

        rerender(<TitleSetter title="Pedido #7" />)

        expect(document.title).toBe("Pedido #7 · Soberania Digital")
    })
})
