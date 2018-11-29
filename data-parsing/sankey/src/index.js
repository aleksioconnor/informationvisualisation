// load in requirements
var fs = require("fs");
var _ = require('lodash');

// load in json data and parse
var contents = fs.readFileSync('deaths_for_sankey.json');
var jsonContent = JSON.parse(contents);

// array with json values
var array = Object.values(jsonContent)[0];

// unique values (nodes)
// const test = array.reduce((_acc, curr) => {
//     var collection = Object.values(curr);
//     _.forEach(collection, (item) => {
//         const found = _acc.find(val => item == val);
//         if (!found) {
//             _acc.push(item)
//         }
//     })
//     return _acc;
// }, []);

// list of all provinces, actors, causes
// const allProvinces = _.uniq(jsonContent.data.map(item => {
//     return item.province;
// }));

// const allActors = _.uniq(jsonContent.data.map(item => {
//     return item.actor;
// }));

// const allCauses = _.uniq(jsonContent.data.map(item => {
//     return item.deathcause;
// }));


// returns sorted list
// const sorted = test.sort((a, b) => {
//     return ('' + a).localeCompare(b);
// })

// All keys, this is nodes
// const allKeys = sorted.map(item => ({
//     "name": item
// }))

// const monthsInAYear = _.range(1, 13)
// const years = _.range(2013, 2018);

// splits months, string operation
function dateArray(monthString) {
    const split = monthString.split("-");
    return split;
}

// finds correct index from list of nodes
function findKeyIndex(key, keys) {
    return _.findIndex(keys, item => {
        return item.name == key;
    })
}

// returns data split into months

function splitData(data) {
    let arr = [];
    let arrObj = {};

    let currentDate = dateArray(data[0].deathdate);

    function parseDate(date) {
        return date[0] + "-" + date[1];
    }

    arrObj.date = parseDate(currentDate);
    arrObj.data = [];

    _.forEach(data, item => {
        let splitDate = dateArray(item.deathdate);
        if (splitDate[1] != currentDate[1]) {
            const clone = _.clone(arrObj);
            arr.push(clone);

            currentDate = dateArray(item.deathdate);
            arrObj = {
                'date': parseDate(currentDate),
                'data': [],
            };
            arrObj.data.push(item);
        } else {
            arrObj.data.push(item);
        }
    })
    return arr;
}

function mapLinksToIndex(links, nodes) {
    const linksMapped = links.map(item => ({
        'source': findKeyIndex(item.source, nodes),
        'target': findKeyIndex(item.target, nodes),
        'value': item.value
    }))
    return linksMapped;
}

// Get a list of all unique nodes for link and node mapping
function filterAllKeys(links) {
    let arr = [];
    _.forEach(links, item => {
        arr.push(item.target);
        arr.push(item.source);
    })
    const uniq = _.uniq(arr);
    return uniq.map(item => ({
        "name": item
    }));
}

// data split into months
const monthlyData = splitData(jsonContent.data);


// Give this function a collection of objects containing keys actor, province, deathcause and deathdate
// returns list of links
/**
 * 
 * @param {object} collection Initial collection in json format
 * @param {string} sourceName Name of source, for example deathdate
 * @param {string} targetName Name of target, for example province
 * 
 * @returns {object} returns an object containing mapping, for example:
 * [ { source: 1831, target: 1857, value: 4 },
  { source: 1831, target: 1856, value: 1 },
  { source: 1831, target: 1865, value: 1 },
  { source: 1831, target: 1838, value: 1 },
  { source: 1842, target: 1857, value: 1 },
  { source: 1827, target: 1856, value: 1 },
  { source: 1841, target: 1857, value: 2 } ]
 */
function createLinksCollection(collection, sourceName, targetName) {
    console.log("simple mapping to source and target")
    // Want to change the format to source:, target:, value:, etc..
    const store = _.map(collection, item => ({
        'source': item[sourceName],
        'target': item[targetName],
        'value': 1
    }))

    console.log("reducer")
    // Get a list of all unique values in the collection
    const reducer = store.reduce((_acc, curr) => {
        _.forEach(store, item => {
            const found = _acc.find(val => {
                return val.source == item.source && val.target == item.target;
            });
            // when a unique value is found
            if (!found) {
                _acc.push(item)
            }
        })
        return _acc;
    }, []);

    // Compare 'store' to the unique value list (reducer), and calculate all unique values together, by incrementing
    // the 'value' key. We get a list of links.
    const output = _.forEach(reducer, item => {
        let val = 0; // initial value
        _.forEach(store, storeItem => {
            if (storeItem.source == item.source && storeItem.target == item.target) {
                val += 1;
            }
        })
        item.value = val;
        val = 0;
    })



    // const nodes = filterAllKeys(output);


    return output;
}




const dateToProvince = createLinksCollection(monthlyData[52].data, 'deathdate', 'province');
const provinceToActor = createLinksCollection(monthlyData[52].data, 'province', 'actor');
const actorToMethod = createLinksCollection(monthlyData[52].data, 'actor', 'deathcause');

const linksWithoutIndex = dateToProvince.concat(provinceToActor, actorToMethod);

const nodes = filterAllKeys(linksWithoutIndex);

const links = mapLinksToIndex(linksWithoutIndex, nodes);

const data = {nodes, links}

console.log(data);


// const jsonWriteLinks = JSON.stringify(linksWithIndex);
const jsonWrite = JSON.stringify(data);




// // console.log(filterAllKeys(linksWithoutIndex, allKeys));

fs.writeFile('linksAndNodes.json', jsonWrite, 'utf8', () => {
    console.log("links and nodes ready")
});
// fs.writeFile('links.json', jsonWriteLinks, 'utf8', () => {
//     console.log("links ready")
// });