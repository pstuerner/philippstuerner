const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_USER_PW,
    port: process.env.POSTGRES_PORT,
    host: process.env.POSTGRES_IP,
});

const getPortfolio = async (request, response) => {
    const company_id = request.params.company_id;
    const year = request.params.year;
    const quarter = request.params.quarter;
    const quarterDay = { 1: 31, 2: 30, 3: 30, 4: 31 };

    try {
        const dt = new Date(year, quarter * 3 - 1, quarterDay[quarter]);
        const company_data = await pool.query(
            "SELECT * FROM company WHERE company_id = $1",
            [company_id]
        );
        const quarter_filings = await pool.query(
            "SELECT * FROM filing WHERE company_id = $1 AND periodofreport = $2 ORDER BY amendmentno DESC",
            [company_id, dt]
        );

        let i = 0;
        let filing_ids = [];

        while (i < quarter_filings.rows.length) {
            filing_ids.push(quarter_filings.rows[i]["filing_id"]);
            if (
                quarter_filings.rows[i]["amendmentno"] == 0 ||
                quarter_filings.rows[i]["amendmenttype"] == "RESTATEMENT"
            ) {
                break;
            }
            i++;
        }

        const portfolio = await pool.query(
            `SELECT * FROM ${
                "c" + company_data.rows[0]["cik"]
            } WHERE filing_id IN ('${filing_ids.join(",")}')`
        );

        response.send(portfolio.rows);
    } catch (error) {
        console.error(error);
    }
};

const getCompany = async (request, response) => {
    try {
        const res = await pool.query("SELECT * FROM company");
        response.send(res.rows);
    } catch (error) {
        console.error(error);
    }
};

const getAsset = async (request, response) => {
    try {
        const res = await pool.query("SELECT * FROM asset");
        console.log(res.rows);
    } catch (error) {
        console.error(error);
    }
};

const getAssetByCusip = async (request, response) => {
    const cusip = request.params.cusip;
    try {
        const res = await pool.query("SELECT * FROM asset WHERE cusip = $1", [
            cusip,
        ]);
        console.log(res.rows);
    } catch (error) {
        console.error(error);
    }
};

module.exports = { getAsset, getAssetByCusip, getCompany, getPortfolio };
