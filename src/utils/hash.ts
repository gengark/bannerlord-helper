import sha1 from 'sha1';

function hash(string_: string, length?: number) {
    const hash = sha1(string_);
    return length ? hash.slice(-length) : hash;
}

export default hash;
