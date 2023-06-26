export function getMockOnUnmounted() {
    const mockOnUnmounted = {};
    vi.mock("vue", () => ({
        _esModule: true,
        ...vi.requireActual("vue"),
        onUnmounted: () => mockOnUnmounted,
    }));
    return mockOnUnmounted;
}
