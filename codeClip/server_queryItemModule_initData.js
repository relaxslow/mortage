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