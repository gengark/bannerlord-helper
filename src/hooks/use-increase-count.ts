function useIncreaseCount() {
    let count = 0;

    return () => count++;
}

export default useIncreaseCount;
