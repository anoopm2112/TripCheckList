
export const getAddedAmountArray = item => {
    const data = JSON.parse(JSON.stringify(item));

    const transformed = Object.values(data.flatMap(({ data }) => data).reduce((acc, { name, expense, paid }) => {
        acc[name] = acc[name] || { name, expense: 0, paid: 0 };
        acc[name].expense += expense;
        acc[name].paid += paid;
        return acc;
    }, {}));

    let arr = [];
    for (let i = 0; i < transformed.length; i++) {
        var objj = {};
        objj.name = transformed[i].name;
        objj.totalAmount = transformed[i].paid - transformed[i].expense;
        objj.paid = transformed[i].paid;
        arr.push(objj);
    }

    return arr;

    // var holder = {};

    // item.forEach(function (d) {
    //     if (holder.hasOwnProperty(d.name)) {
    //         holder[d.name] = holder[d.name] + d.expense;
    //     } else {
    //         holder[d.name] = d.expense;
    //     }
    // });

    // var obj2 = [];

    // for (var prop in holder) {
    //     obj2.push({ name: prop, expense: holder[prop] });
    // }

    // return obj2;
};

export const calculateTotalAmount = item => {
    var sum = 0;

    for (var i = 0; i < item.length; i++) {
        sum += parseInt(item[i].expense, 10);
    }

    return sum;
};

export const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return Math.round(distance);
};


export const calculateTravelTime = (distance) => {
    const travelTime = distance / 60; // Time in hours
    const hours = Math.floor(travelTime); // Extract the whole number part (hours)
    const minutes = Math.round((travelTime - hours) * 60); // Calculate the minutes
    return { hours, minutes };
};
