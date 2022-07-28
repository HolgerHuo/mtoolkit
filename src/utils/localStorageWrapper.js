function setLS(items, appPrefix = 'MTOOLKIT') {
    items.forEach(i => localStorage.setItem(appPrefix + '_' + i[0], i[1]));
}

function getLS(items, appPrefix = 'MTOOLKIT') {
    let data =  Object.assign([], items);
    data.forEach((i, index) => {
        let value = localStorage.getItem(appPrefix + '_' + i[0]);
        switch (value) {
            case null:
                value = i[1];
                break
            case 'true':
                value = true;
                break
            case 'false':
                value = false;
                break
            default:
                break
        }
        data[index] = [i[0], value, i[2]];
    })
    return data;
}

export { setLS, getLS };