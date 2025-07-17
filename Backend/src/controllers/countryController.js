import axios from "axios";


export const getCountryDetails = async (req, res) => {
    try {
        const { country } = req.params;
        const response = await axios.get(`https://restcountries.com/v3.1/name/${country}`);
        const countryData = response.data[0];

        let returnObject = {
            countryName : countryData.name.common,
            currencies : countryData.currencies,
            capitalCity: countryData.capital || "Capital City not found",
            spokenLanguages: countryData.languages,
            nationalFlag: countryData.flags
        }

        res.json(returnObject);
    } catch (error) {
        if (error.response.status == 404) {
            return res.status(404).json({ error: 'Country not found' });
        }
        res.status(500).json({ error: 'Failed to fetch country details' });
    }
}