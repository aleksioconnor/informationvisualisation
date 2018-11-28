// load in requirements
var fs = require("fs");
var _ = require('lodash');

// load in json data
var contents = fs.readFileSync('deaths_for_sankey.json');
var jsonContent = JSON.parse(contents);

// data for sankey diagram
var nodes = [];
var links = [];


var array = Object.values(jsonContent)[0]; // array with values only

// unique values (nodes)
const test = array.reduce((_acc, curr) => {
    var collection = Object.values(curr);
    _.forEach(collection, (item) => {
        const found = _acc.find(val => item == val);
        if (!found) {
            _acc.push(item)
        }
    })
    return _acc;
}, []);

// list of all provinces, actors, causes
const allProvinces = _.uniq(jsonContent.data.map(item => {
    return item.province;
}));

const allActors = _.uniq(jsonContent.data.map(item => {
    return item.actor;
}));

const allCauses = _.uniq(jsonContent.data.map(item => {
    return item.deathcause;
}));


// returns sorted list
const sorted = test.sort((a, b) => {
    return ('' + a).localeCompare(b);
})

const allKeys = sorted.map(item => ({
    "name": item
}))

const monthsInAYear = _.range(1, 13)
const years = _.range(2013, 2018);

//splits months
function dateArray(monthString) {
    const split = monthString.split("-");
    return split;
}

// finds correct index from list of nodes
function findKeyIndex(key) {
    return _.findIndex(allKeys, item => {
        return item.name == key;
    })
}

// _.forEach(jsonContent.data, item => {
//     const date = dateArray(item.deathdate);
//     if (date[0] == '2013' && date[1] == '01') {
//         // console.log(item)
//     }
// })

// Give this function a collection of objects containing keys actor, province, deathcause and deathdate
// returns list of links
/**
 * 
 * @param {object} collection Initial collection in json format
 * @param {string} sourceName Name of source, for example deathdate
 * @param {string} targetName Name of target, for example province
 * 
 * @returns {object}
 */


function createLinksCollection(collection, sourceName, targetName) {
    // loop through collection
    let nodes = []; // array the function returns
    const store = _.map(collection, item => ({
        'source': item[sourceName],
        'target': item[targetName],
        'value': 1
    }))

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

    // count multiple object values
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

    // still need to map target and source values to correct index, this works
    const final = output.map(item => ({
        'source': findKeyIndex(item.source),
        'target': findKeyIndex(item.target),
        'value': item.value
    }))
    return final;
}


const testData = [{
        actor: 'NA',
        province: 'Damascus Suburbs',
        deathcause: 'Shooting',
        deathdate: '2013-01-31'
    },
    {
        actor: 'NA',
        province: 'Damascus Suburbs',
        deathcause: 'Shooting',
        deathdate: '2013-01-31'
    },
    {
        actor: 'NA',
        province: 'Damascus Suburbs',
        deathcause: 'Shelling',
        deathdate: '2013-01-31'
    },
    {
        actor: 'NA',
        province: 'Damascus Suburbs',
        deathcause: 'Warplane shelling',
        deathdate: '2013-01-31'
    },
    {
        actor: 'NA',
        province: 'Damascus Suburbs',
        deathcause: 'Shooting',
        deathdate: '2013-01-31'
    },
    {
        actor: 'NA',
        province: 'Damascus Suburbs',
        deathcause: 'Field Execution',
        deathdate: '2013-01-31'
    },
    {
        actor: 'NA',
        province: 'Damascus Suburbs',
        deathcause: 'Shooting',
        deathdate: '2013-01-31'
    },
    {
        actor: 'NA',
        province: 'Idlib',
        deathcause: 'Shooting',
        deathdate: '2013-01-31'
    },
    {
        actor: 'NA',
        province: 'Aleppo',
        deathcause: 'Shelling',
        deathdate: '2013-01-31'
    },
    {
        actor: 'NA',
        province: 'Homs',
        deathcause: 'Shooting',
        deathdate: '2013-01-31'
    },
    {
        actor: 'NA',
        province: 'Homs',
        deathcause: 'Shooting',
        deathdate: '2013-03-31'
    }
]

console.log(createLinksCollection(testData, 'province', 'deathcause'));