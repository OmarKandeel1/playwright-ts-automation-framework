export default {
    validUsers:[ {
        username: "Admin",
        password: "admin123"
    }],

    invalidUsers: [
        {
            username: "Admin",
            password: "notadmin123"

        },
        {
            username: "notAdmin",
            password: "admin123"

        },
        {
            username: "notAdmin",
            password: "notadmin123"

        },

    ]
,
    errors:
    {
        invalidcreds : "Invalid credentials",
        requiredMsg: "Required"

    }
}