'use strict';

module.exports = {
    "mediaType": "application/vnd.api+json",
    "globalOptions": {
        "convertCase": "snake_case",
        "unconvertCase": "camelCase"
    },
    // Register JSON API Types here..
    // For more info: https://github.com/danivek/json-api-serializer
    "registry": {
        "user": {
            "links": {
                self: (data) => {
                    return '/users/' + data.id
                }
            },
            "topLevelLinks": {
                self: '/users'
            }
        }
    }
};
