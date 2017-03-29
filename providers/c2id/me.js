var me = {
    fetch: [

        function() {
            return '/userinfo';
        }

    ],
    params: {},
    fields: {
        name: '=',
        firstname: 'given_name',
        lastname: 'family_name',
        email: '=',
        phone: 'phone_number',
        address: '='
    }
};

module.exports = me;
