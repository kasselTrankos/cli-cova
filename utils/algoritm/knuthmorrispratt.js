const makeKMPTable = pattern => {
    let results = [];
    let pos = 2;
    let cnd = 0;

    results[0] = -1;
    results[1] = 0;
    while (pos < pattern.length) {
        if (pattern[pos - 1] == pattern[cnd]) {
            cnd++;
            results[pos] = cnd;
            pos++;
        } else if (cnd > 0) {
            cnd = results[cnd];
        } else {
            results[pos] = 0;
            pos++;
        }
    }
    return results;
};

export const  KMPSearch = (eq, pattern,  arr) => {
    let m = 0;
    let i = 0;
    const T = makeKMPTable(pattern);
    let ocurrs = [];
    while (m + i < arr.length) {
        if (eq(pattern[i])(arr[m + i])) {
            if (i == pattern.length - 1) {
                ocurrs.push(arr.slice(m, m + pattern.length));
                m += 1;
                i = 0
                
            }
            i++;
        } else {
            m = m + i - T[i];

            if (T[i] > -1) {
                i = T[i];
            } else {
                i = 0;
            }
        }
    }
    return ocurrs;
};
