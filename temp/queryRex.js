if (querydata.state === "all")
querydata.state = "\\w+|^$";
if (querydata.filing === "all")
querydata.filing = "\\w+|^$";
if (querydata.dimension === "all")
querydata.dimension = "\\w+|^$";
else if (querydata.dimension === "none")
querydata.dimension = "^$";