export function getMockOnUnmounted() {
    const mockOnUnmounted = {};
    jest.mock("vue", () => ({
        _esModule: true,
        ...jest.requireActual("vue"),
        onUnmounted: () => mockOnUnmounted,
    }));
    return mockOnUnmounted;
}
