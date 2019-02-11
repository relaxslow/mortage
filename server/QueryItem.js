const CSVToJSON = require("csvtojson");
const QueryData = require('./QueryData.js')
let items = {};
exports.get = function () {
    return items;
}
let task = [];
items.then = function (fun) {
    if (!isEmpty(items)) fun(items);
    else
        task.push(fun);
}
function runAllWaitTasks() {
    for (let i = 0; i < task.length; i++) {
        let t = task[i];
        t(items);
    }
}
function isEmpty(obj) {
    let keys = Object.keys(obj);
    if (keys.length == 1 && keys[0] === "then")
        return true;
}

function initData() {
    let states = [];
    let filings = [];
    let dimensions = [];
    function isInArray(value) {
        for (let i = 0; i < this.length; i++) {
            let v = this[i];
            if (v === value) {
                return true;
            }
        }
        return false;
    }

    CSVToJSON()
        .fromFile("./data/samplefile.csv")
        .then(function (source) {
            for (let i = 0; i < source.length; i++) {
                let record = source[i];
                let state = record["State"];
                if (!isInArray.call(states, state)) {
                    states.push(state);
                }
                let filing = record["Filing Quarter"];
                if (!isInArray.call(filings, filing)) {
                    filings.push(filing);
                }
                let dimension = record["Dimensional Column"];
                if (!isInArray.call(dimensions, dimension)) {
                    dimensions.push(dimension);
                }


            }

            items.states = states;
            items.filings = QueryData.sortQuarter(filings);
            items.dimensions = dimensions;
            runAllWaitTasks();
        });
}
initData();