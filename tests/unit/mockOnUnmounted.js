export function getMockOnUnmounted() {
    const mockOnUnmounted = {};
    vi.mock("vue", () => ({
        _esModule: true,
        ...vi.importActual("vue"),
        onUnmounted: () => mockOnUnmounted,
    }));
    return mockOnUnmounted;
}
