import useIncreaseCount from './use-increase-count';

function useCountProgressMessage(total: number, prefix?: string, separator = ' ') {
    const increase = useIncreaseCount();
    let count = 0;

    return (idle = false) => {
        const prefixMessage = prefix ? `${prefix}${separator}` : '';

        if (!idle) count = increase();

        return `${prefixMessage}(${count}/${total})`;
    };
}

export default useCountProgressMessage;
