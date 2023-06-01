module.exports = async (req, res, next) => {

    try {
        let options = {
            method: 'GET',
            headers: { 'X-API-Key': 'nKxWHCEDFlzgJI7WUFsLtw==cZde0K53HNTJD3Y0' }
        }
        let url = 'https://api.api-ninjas.com/v1/facts?limit=1';

        let fact;
        const response = await fetch(url, options)
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }
        fact = await response.json();
        console.log(fact[0]);
        req.body.fact = fact;
    }
    catch (e) {
        console.error(e);
    }
    next();
}






