"use strict";

const qs = require('querystring');
const rp = require('request-promise');
const log = require('../local/log');
const config = require('config');
const lifxClientId = config.get('lifx.clientId');
const lifxClientSecret = config.get('lifx.clientSecret');
const lifxApiEndpoint = config.get('lifx.apiEndpoint');
const lifxOauthEndpoint = config.get('lifx.oauthEndpoint');

/**
 * LIFX API calls used by this application
 */
module.exports = {

    /**
     * Handles OAuth2 callback from LIFX, making request to exchange the code for access and refresh tokens
     *
     * @param installedAppId
     * @param queryString
     * @returns {*}
     */
    handleOauthCallback: function(installedAppId, queryString) {
        let params = qs.parse(queryString);
        let req = {
            client_id: lifxClientId,
            client_secret: lifxClientSecret,
            grant_type: "authorization_code",
            code: params.code,
            scope: params.scope
        };
        let body = JSON.stringify(req);
        let options = {
            method: 'POST',
            uri: `${lifxOauthEndpoint}/token`,
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "SmartThings Integration"
            },
            body: body,
            transform: function(body) {
                log.debug("body=" + body);
                return JSON.parse(body)
            }
        };
        return rp(options);
    },

    /**
     * Returns a list of LIFX location id and name pairs
     *
     * @param token LIFX access token
     * @param callback Function called with the location list
     * @returns [{"id":"locationid", "name":"location name}...]
     */
    getLocations: function (token, callback) {
        log.info("getLocations called\n");
        let options = {
            method: 'GET',
            uri: `${lifxApiEndpoint}/lights/`,
            headers: {
                "User-Agent": "SmartThings Integration",
                "Authorization": `Bearer ${token}`
            },
            transform: function (body) {
                //[SRIB] Spoof for Testing
                let tmp = `[
                    {
                      "id": "d073d5141876",
                      "uuid": "02a5b510-2d3d-46ea-92ac-c4533f75c24e",
                      "label": "SampleLIFX",
                      "connected": true,
                      "power": "on",
                      "color": {
                        "hue": 59.997253376058595,
                        "saturation": 1,
                        "kelvin": 3500
                      },
                      "brightness": 0.29999237048905164,
                      "effect": "OFF",
                      "group": {
                        "id": "06e3ec50395511e9a0757200055bf1c0",
                        "name": "Loungeroom"
                      },
                      "location": {
                        "id": "ad5a9e6f-a2dc-4c0c-ad52-952d1c134aaf",
                        "name": "Living Room"
                      },
                      "product": {
                        "name": "Color 1000",
                        "identifier": "lifx_color_a19",
                        "company": "LIFX",
                        "capabilities": {
                          "has_color": true,
                          "has_variable_color_temp": true,
                          "has_ir": false,
                          "has_chain": false,
                          "has_multizone": false,
                          "min_kelvin": 2500,
                          "max_kelvin": 9000
                        }
                      },
                      "last_seen": "2019-02-25T23:40:40Z",
                      "seconds_since_seen": 0
                    }
                  ]`
                return JSON.parse(tmp)
            }
        };
        rp(options).then(function (data) {
            let locations = [];
            data.forEach(function (item) {
                locations.push({ id: item.location.id, name: item.location.name });
            });
            callback(locations);
        }).error(function (err) {
            log.error(`$err encountered retrieving locations`)
        });
    },

    /**
     * Returns a list of lights in a location
     *
     * @param token LIFX access token
     * @param lifxLocationId LIFX location ID
     * @param callback Function called with list of lights
     * @see https://api.developer.lifx.com/docs/list-lights
     */
    getLights: function (token, lifxLocationId, callback) {
        log.info("getLights called\n");
        /* let options = {
             method: 'GET',
             uri: `${lifxApiEndpoint}/lights/`,
             headers: {
                 "User-Agent": "SmartThings Integration",
                 "Authorization": `Bearer ${token}`
             },
             transform: function (body) {
                 //[SRIB] Spoof for Testing
                 let tmp = `[
                     {
                       "id": "d073d5141876",
                       "uuid": "02a5b510-2d3d-46ea-92ac-c4533f75c24e",
                       "label": "Lamp",
                       "connected": true,
                       "power": "on",
                       "color": {
                         "hue": 59.997253376058595,
                         "saturation": 1,
                         "kelvin": 3500
                       },
                       "brightness": 0.29999237048905164,
                       "effect": "OFF",
                       "group": {
                         "id": "06e3ec50395511e9a0757200055bf1c0",
                         "name": "Loungeroom"
                       },
                       "location": {
                         "id": "ad5a9e6f-a2dc-4c0c-ad52-952d1c134aaf",
                         "name": "Home"
                       },
                       "product": {
                         "name": "Color 1000",
                         "identifier": "lifx_color_a19",
                         "company": "LIFX",
                         "capabilities": {
                           "has_color": true,
                           "has_variable_color_temp": true,
                           "has_ir": false,
                           "has_chain": false,
                           "has_multizone": false,
                           "min_kelvin": 2500,
                           "max_kelvin": 9000
                         }
                       },
                       "last_seen": "2019-02-25T23:40:40Z",
                       "seconds_since_seen": 0
                     }
                   ]`
                 return JSON.parse(tmp)
             }
         };
         rp(options).then(function (data) {
             log.info("getLights callback called\n");
             callback(data);
         }).catch(function (err) {
             log.error(`$err encountered retrieving getLights`)
         });*/

        let tmp = `[
            {
              "id": "d073d5141876",
              "uuid": "02a5b510-2d3d-46ea-92ac-c4533f75c24e",
              "label": "SampleLIFX",
              "connected": true,
              "power": "on",
              "color": {
                "hue": 59.997253376058595,
                "saturation": 1,
                "kelvin": 3500
              },
              "brightness": 0.29999237048905164,
              "effect": "OFF",
              "group": {
                "id": "06e3ec50395511e9a0757200055bf1c0",
                "name": "Loungeroom"
              },
              "location": {
                "id": "ad5a9e6f-a2dc-4c0c-ad52-952d1c134aaf",
                "name": "Home"
              },
              "product": {
                "name": "Color 1000",
                "identifier": "lifx_color_a19",
                "company": "LIFX",
                "capabilities": {
                  "has_color": true,
                  "has_variable_color_temp": true,
                  "has_ir": false,
                  "has_chain": false,
                  "has_multizone": false,
                  "min_kelvin": 2500,
                  "max_kelvin": 9000
                }
              },
              "last_seen": "2019-02-25T23:40:40Z",
              "seconds_since_seen": 0
            }
          ]`
        let data = JSON.parse(tmp)
        callback(data);
    },

    /**
     * Returns a description of a particular light
     *
     * @param token
     * @param externalId
     * @param callback
     * @see https://api.developer.lifx.com/docs/list-lights
     */
    getLight: function (token, externalId, callback) {
        let options = {
            method: 'GET',
            uri: `${lifxApiEndpoint}/lights/id:${externalId}`,
            headers: {
                "User-Agent": "SmartThings Integration",
                "Authorization": `Bearer ${token}`
            },
            transform: function (body) {
                //[SRIB] Spoof for Testing
                let tmp = `[
                    {
                      "id": "d073d5141876",
                      "uuid": "02a5b510-2d3d-46ea-92ac-c4533f75c24e",
                      "label": "SampleLIFX",
                      "connected": true,
                      "power": "on",
                      "color": {
                        "hue": 59.997253376058595,
                        "saturation": 1,
                        "kelvin": 3500
                      },
                      "brightness": 0.29999237048905164,
                      "effect": "OFF",
                      "group": {
                        "id": "06e3ec50395511e9a0757200055bf1c0",
                        "name": "Loungeroom"
                      },
                      "location": {
                        "id": "ad5a9e6f-a2dc-4c0c-ad52-952d1c134aaf",
                        "name": "Home"
                      },
                      "product": {
                        "name": "Color 1000",
                        "identifier": "lifx_color_a19",
                        "company": "LIFX",
                        "capabilities": {
                          "has_color": true,
                          "has_variable_color_temp": true,
                          "has_ir": false,
                          "has_chain": false,
                          "has_multizone": false,
                          "min_kelvin": 2500,
                          "max_kelvin": 9000
                        }
                      },
                      "last_seen": "2019-02-25T23:40:40Z",
                      "seconds_since_seen": 0
                    }
                  ]`
                return JSON.parse(tmp)
            }
        };
        rp(options).then(function(data) {
            callback(data);
        });
    },

    /**
     * Set the state of a specific light
     *
     * @param token
     * @param externalId
     * @param body
     * @param callback
     * @see https://api.developer.lifx.com/docs/set-state
     */
    sendCommand: function(token, externalId, body, callback) {
        let options = {
            method: 'PUT',
            uri: `${lifxApiEndpoint}/lights/id:${externalId}/state`,
            headers: {
                "User-Agent": "SmartThings Integration",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(body),
            transform: function(body) {
                return JSON.parse(body)
            }
        };
        log.debug(`authorization=${options.headers.Authorization}`);
        log.debug(`uri=${options.uri}`);
        rp(options).then(function(data) {
            if (data && callback) {
                callback(data);
            }
        }).catch(function(err){
            log.error(`${err} sending commands to ${externalId}`)
        });
    },

    /**
     * Given a light state object, returns a list of the events to initialize the state on the SmartThings platform.
     * @param light Object returned from getLight or and item from getLights
     * @returns List of event objects
     */
    allLightEvents(light) {
        return fullEventList(light);
    },

    initialLightEvents(light) {
        let events = fullEventList(light);
        /*
        events.push({
            component: "main",
            capability: "healthCheck",
            attribute: "DeviceWatch-Enroll",
            value: '{"protocol": "cloud", "scheme":"untracked"}'
        });
        */
        return events;
    }
};

function fullEventList(light) {
    const healthStatus = light.connected ? "online" : "offline";
    return [
        {
            component: "main",
            capability: "switch",
            attribute: "switch",
            value: light.power
        },
        {
            component: "main",
            capability: "switchLevel",
            attribute: "level",
            value: light.brightness * 100
        },
        {
            component: "main",
            capability: "colorTemperature",
            attribute: "colorTemperature",
            value: light.color.kelvin
        },
        {
            component: "main",
            capability: "colorControl",
            attribute: "hue",
            value: light.color.hue / 3.6
        },
        {
            component: "main",
            capability: "colorControl",
            attribute: "saturation",
            value: light.color.saturation * 100
        },
        {
            component: "main",
            capability: "healthCheck",
            attribute: "DeviceWatch-DeviceStatus",
            value: healthStatus
        },
        {
            component: "main",
            capability: "healthCheck",
            attribute: "healthStatus",
            value: healthStatus
        }
    ];
}
