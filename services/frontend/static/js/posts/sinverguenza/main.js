d3.json("http://localhost:8002/api/sinverguenza/timeseries").then(
    function (data) {
        console.log(data);
    }
);