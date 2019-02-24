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