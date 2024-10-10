function useDurationPrint() {
    const startTimestamp = Date.now();

    return () => {
        const endTimestamp = Date.now();
        const duration = ((endTimestamp - startTimestamp) / 1000).toFixed(2);

        console.log(`✨  Done in ${duration === '0.00' ? '0.01' : duration}s.`);
    };
}

export default useDurationPrint;
