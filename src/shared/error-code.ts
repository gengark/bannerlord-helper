enum ErrorCode {
    /** Indicates that the list of arguments is longer than expected. */
    E2BIG = 'E2BIG',
    /** Indicates that the operation did not have sufficient permissions. */
    EACCES = 'EACCES',
    /** Indicates that the network address is already in use. */
    EADDRINUSE = 'EADDRINUSE',
    /** Indicates that the network address is currently unavailable for use. */
    EADDRNOTAVAIL = 'EADDRNOTAVAIL',
    /** Indicates that the network address family is not supported. */
    EAFNOSUPPORT = 'EAFNOSUPPORT',
    /** Indicates that there is no data available and to try the operation again later. */
    EAGAIN = 'EAGAIN',
    /** Indicates that the socket already has a pending connection in progress. */
    EALREADY = 'EALREADY',
    /** Indicates that a file descriptor is not valid. */
    EBADF = 'EBADF',
    /** Indicates an invalid data message. */
    EBADMSG = 'EBADMSG',
    /** Indicates that a device or resource is busy. */
    EBUSY = 'EBUSY',
    /** Indicates that an operation was canceled. */
    ECANCELED = 'ECANCELED',
    /** Indicates that there are no child processes. */
    ECHILD = 'ECHILD',
    /** Indicates that the network connection has been aborted. */
    ECONNABORTED = 'ECONNABORTED',
    /** Indicates that the network connection has been refused. */
    ECONNREFUSED = 'ECONNREFUSED',
    /** Indicates that the network connection has been reset. */
    ECONNRESET = 'ECONNRESET',
    /** Indicates that a resource deadlock has been avoided. */
    EDEADLK = 'EDEADLK',
    /** Indicates that a destination address is required. */
    EDESTADDRREQ = 'EDESTADDRREQ',
    /** Indicates that an argument is out of the domain of the function. */
    EDOM = 'EDOM',
    /** Indicates that the disk quota has been exceeded. */
    EDQUOT = 'EDQUOT',
    /** Indicates that the file already exists. */
    EEXIST = 'EEXIST',
    /** Indicates an invalid pointer address. */
    EFAULT = 'EFAULT',
    /** Indicates that the file is too large. */
    EFBIG = 'EFBIG',
    /** Indicates that the host is unreachable. */
    EHOSTUNREACH = 'EHOSTUNREACH',
    /** Indicates that the identifier has been removed. */
    EIDRM = 'EIDRM',
    /** Indicates an illegal byte sequence. */
    EILSEQ = 'EILSEQ',
    /** Indicates that an operation is already in progress. */
    EINPROGRESS = 'EINPROGRESS',
    /** Indicates that a function call was interrupted. */
    EINTR = 'EINTR',
    /** Indicates that an invalid argument was provided. */
    EINVAL = 'EINVAL',
    /** Indicates an otherwise unspecified I/O error. */
    EIO = 'EIO',
    /** Indicates that the socket is connected. */
    EISCONN = 'EISCONN',
    /** Indicates that the path is a directory. */
    EISDIR = 'EISDIR',
    /** Indicates too many levels of symbolic links in a path. */
    ELOOP = 'ELOOP',
    /** Indicates that there are too many open files. */
    EMFILE = 'EMFILE',
    /** Indicates that there are too many hard links to a file. */
    EMLINK = 'EMLINK',
    /** Indicates that the provided message is too long. */
    EMSGSIZE = 'EMSGSIZE',
    /** Indicates that a multihop was attempted. */
    EMULTIHOP = 'EMULTIHOP',
    /** Indicates that the filename is too long. */
    ENAMETOOLONG = 'ENAMETOOLONG',
    /** Indicates that the network is down. */
    ENETDOWN = 'ENETDOWN',
    /** Indicates that the connection has been aborted by the network. */
    ENETRESET = 'ENETRESET',
    /** Indicates that the network is unreachable. */
    ENETUNREACH = 'ENETUNREACH',
    /** Indicates too many open files in the system. */
    ENFILE = 'ENFILE',
    /** Indicates that no buffer space is available. */
    ENOBUFS = 'ENOBUFS',
    /** Indicates that no message is available on the stream head read queue. */
    ENODATA = 'ENODATA',
    /** Indicates that there is no such device. */
    ENODEV = 'ENODEV',
    /** Indicates that there is no such file or directory. */
    ENOENT = 'ENOENT',
    /** Indicates an exec format error. */
    ENOEXEC = 'ENOEXEC',
    /** Indicates that there are no locks available. */
    ENOLCK = 'ENOLCK',
    /** Indications that a link has been severed. */
    ENOLINK = 'ENOLINK',
    /** Indicates that there is not enough space. */
    ENOMEM = 'ENOMEM',
    /** Indicates that there is no message of the desired type. */
    ENOMSG = 'ENOMSG',
    /** Indicates that a given protocol is not available. */
    ENOPROTOOPT = 'ENOPROTOOPT',
    /** Indicates that there is no space available on the device. */
    ENOSPC = 'ENOSPC',
    /** Indicates that there are no stream resources available. */
    ENOSR = 'ENOSR',
    /** Indicates that a given resource is not a stream. */
    ENOSTR = 'ENOSTR',
    /** Indicates that a function has not been implemented. */
    ENOSYS = 'ENOSYS',
    /** Indicates that the socket is not connected. */
    ENOTCONN = 'ENOTCONN',
    /** Indicates that the path is not a directory. */
    ENOTDIR = 'ENOTDIR',
    /** Indicates that the directory is not empty. */
    ENOTEMPTY = 'ENOTEMPTY',
    /** Indicates that the given item is not a socket. */
    ENOTSOCK = 'ENOTSOCK',
    /** Indicates that a given operation is not supported. */
    ENOTSUP = 'ENOTSUP',
    /** Indicates an inappropriate I/O control operation. */
    ENOTTY = 'ENOTTY',
    /** Indicates no such device or address. */
    ENXIO = 'ENXIO',
    /** Indicates that an operation is not supported on the socket. Although `ENOTSUP` and `EOPNOTSUPP` have the same value on Linux, according to POSIX.1 these error values should be distinct.) */
    EOPNOTSUPP = 'EOPNOTSUPP',
    /** Indicates that a value is too large to be stored in a given data type. */
    EOVERFLOW = 'EOVERFLOW',
    /** Indicates that the operation is not permitted. */
    EPERM = 'EPERM',
    /** Indicates a broken pipe. */
    EPIPE = 'EPIPE',
    /** Indicates a protocol error. */
    EPROTO = 'EPROTO',
    /** Indicates that a protocol is not supported. */
    EPROTONOSUPPORT = 'EPROTONOSUPPORT',
    /** Indicates the wrong type of protocol for a socket. */
    EPROTOTYPE = 'EPROTOTYPE',
    /** Indicates that the results are too large. */
    ERANGE = 'ERANGE',
    /** Indicates that the file system is read only. */
    EROFS = 'EROFS',
    /** Indicates an invalid seek operation. */
    ESPIPE = 'ESPIPE',
    /** Indicates that there is no such process. */
    ESRCH = 'ESRCH',
    /** Indicates that the file handle is stale. */
    ESTALE = 'ESTALE',
    /** Indicates an expired timer. */
    ETIME = 'ETIME',
    /** Indicates that the connection timed out. */
    ETIMEDOUT = 'ETIMEDOUT',
    /** Indicates that a text file is busy. */
    ETXTBSY = 'ETXTBSY',
    /** Indicates that the operation would block. */
    EWOULDBLOCK = 'EWOULDBLOCK',
    /** Indicates an improper link. */
    EXDEV = 'EXDEV',
}

export default ErrorCode;
