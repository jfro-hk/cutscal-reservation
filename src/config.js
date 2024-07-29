export const config = {
    url: {
        api: {
            tempData: 'http://127.0.0.1:8000/api/cutcal/reservation-data/',
            tempStore: 'http://127.0.0.1:8000/api/cutcal/reservation-data-store/'
            // tempData: 'https://jhdevelopers.com/api/cutcal/reservation-data/',
            // tempStore: 'https://jhdevelopers.com/api/cutcal/reservation-data-store/'
        },
        main: ``,
        cdn: ``,
    },
    regex: {},
    cookiedomain: "localhost",
    // cookiedomain: "jhdevelopers.com",
    allowedredirectdomains: [
        'localhost',
        "jhdevelopers.com"
    ]
}