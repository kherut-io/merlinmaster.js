module.exports = (object, properties) => {
    object = JSON.parse(JSON.stringify(object));

    for(var key in object) {
        if(properties.includes(key) == false)
            delete object[key];
    }

    return object;
};