exports.search = search;
exports.sortQuarter = sortQuarter;
function sortQuarter(data) {
    let sort = [];
    for (let i = 0; i < data.length; i++) {
        let dateArr = data[i].split("Q");
        let year = parseInt(dateArr[0]);
        let month = parseInt(dateArr[1]);

        let index = sort.findIndex(function (elem) {
            return elem[0] === parseInt(year);
        })
        if (index >= 0) {
            sort[index][1].push(month);
        } else {
            sort.push([year, [month]]);
        }
    }
    sort.sort(function (a, b) {
        y1 = a[0];
        y2 = b[0];
        return y1 - y2;
    })
    for (let i = 0; i < sort.length; i++) {
        let p = sort[i]
        sort[i][1].sort(function (a, b) {
            return a - b;
        })
    }
    let result = [];
    for (let i = 0; i < sort.length; i++) {
        let y = sort[i][0];
        for (let j = 0; j < sort[i][1].length; j++) {
            let m = sort[i][1][j];
            result.push(`${y}Q${m}`);
        }
    }
    return result;

}
function search(source, querydata) {

    let result = [];
    let totalLoanCount = 0;
    let totalLoanAmount = 0;
    for (let i = 0; i < source.length; i++) {
        let record = source[i];

        let stateMatch = testMatch(querydata.state, record["State"]);
        let filingMatch = testMatch(querydata.filing, record["Filing Quarter"]);
        let dimensionMatch = testMatch(querydata.dimension, record["Dimensional Column"]);
        if (!stateMatch || !filingMatch || !dimensionMatch) {
            continue;
        } else {
            result.push(record);
            totalLoanAmount += parseInt(record["LoanAmount"]);
            totalLoanCount += parseInt(record["LoanCount"]);
        }
    }
    result.push({
        "FilingID": "total",
        "State": "",
        "Filing Quarter": "",
        "Dimensional Column": "",
        "LoanCount": totalLoanCount,
        "LoanAmount": totalLoanAmount
    });
    return result;
}
function testMatch(arr, data) {
    if (arr.length == 0) return true;//any
    for (let i = 0; i < arr.length; i++) {
        let regex = new RegExp(arr[i]);
        let result = regex.test(data);
        if (result == true) return true;
    }
    return false;
}