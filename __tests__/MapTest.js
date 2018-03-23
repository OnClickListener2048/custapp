it('map test', () => {
    let myMap = new Map();
    myMap.set("key", "和键'a string'关联的值");

    for (let [key, value] of myMap.entries()) {
        console.log(key + " = " + value);
    }
});
