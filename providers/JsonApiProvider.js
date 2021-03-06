'use strict';

const {ServiceProvider} = require('@adonisjs/fold');
const _ = require('lodash');
const GE = require('@adonisjs/generic-exceptions');
const {RegistryException} = require('../src/Exceptions');

class JsonApiProvider extends ServiceProvider {

    _registerService() {
        this.app.singleton('JsonApi/Service/JsonApiService', (app) => {
            return new (require('../src/Service'))(app.use('Adonis/Src/Config'));
        });
        this.app.alias('JsonApi/Service/JsonApiService', 'JsonApi');

        this.app.bind('JsonApi/Service/JsonApiRecordBrowser', () => require('../src/Service/JsonApiRecordBrowser'));
        this.app.alias('JsonApi/Service/JsonApiRecordBrowser', 'JsonApiRecordBrowser');
    };

    _registerSerializer() {
        this.app.bind('JsonApi/Serializer/LucidSerializer', () => require('../src/Serializer/LucidSerializer'));
    }

    _registerMiddleware() {
        this.app.bind('JsonApi/Middleware/Specification', (app) => {
            const JsonApiSpecification = require('../src/Middleware/JsonApiSpecification');
            return new JsonApiSpecification(app.use('Adonis/Src/Config'));
        });
    }

    register() {
        this._registerService();
        this._registerSerializer();
        this._registerMiddleware();
    }

    boot() {
        const Config = use('Adonis/Src/Config');
        const config = Config.get('jsonApi.registry');

        if (!config || !_.size(config) === 0) {
            throw GE.RuntimeException.missingConfig('configuration for jsonApi', 'config/jsonApi.js')
        }

        const {JsonApiSerializer} = use('JsonApi');
        const Registry = Config.get('jsonApi.registry');
        for (let type in Registry) {
            try {
                JsonApiSerializer.register(type, Registry[type].structure);
            } catch (error) {
                throw RegistryException.invoke(type + ": " + error.message);
            }
        }
    }
}

module.exports = JsonApiProvider;
