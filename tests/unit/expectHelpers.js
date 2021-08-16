export function expectErrorToBeNull(error) {
    if (error) {
        console.error(error);
    }
    expect(error).toBeNull();
}
