'use strict';

const dom = {
    create({
        inhalt = '',
        typ = 'div',
        eltern = false,
        klassen = [],
        attr = {},
        listeners = {
            click() {

            }
        },
        styles = {},
        amEnde = true,
    } = {}) {
        let neu = document.createElement(typ);
        if (inhalt) neu.innerHTML = inhalt;
        if (klassen.length) neu.className = klassen.join(' ');

        Object.entries(attr).forEach(el => neu.setAttribute(...el));
        Object.entries(listeners).forEach(el => neu.addEventListener(...el));
        Object.entries(styles).forEach(style => neu.style[style[0]] = style[1]);

        if (!amEnde && eltern.children.length) eltern.insertBefore(neu, eltern.children[0]);
        else eltern.append(neu);

        return neu;
    },
    $(selector) {
        return document.querySelector(selector);
    },
    $$(selector) {
        return [...document.querySelectorAll(selector)];
    },
    // convert time code from time code
    parseTime(offset) {
        let localTime = new Date();
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        let utc = localTime.getTime() + (localTime.getTimezoneOffset() * 60000);
        let dataTime = new Date(utc + (3600000 * offset));
        return dataTime.toLocaleString('en-EN', options);
    },
    // convert skycode(0-47) and transform to icon font (and original img quality is not so good.)
    parseSkycode(value) {
        const skycodeArray = ['wi-thunderstorm', 'wi-thunderstorm', 'wi-thunderstorm', 'wi-thunderstorm', 'wi-thunderstorm', 'wi-rain-mix', 'wi-sleet', 'wi-sleet', 'wi-rain-mix', 'wi-rain-mix', 'wi-rain-mix', 'wi-showers', 'wi-rain', 'wi-snow', 'wi-snow', 'wi-snow-wind', 'wi-snow', 'wi-thunderstorm', 'wi-showers', 'wi-dust', 'wi-fog', 'wi-day-haze', 'wi-day-haze', 'wi-strong-wind', 'wi-strong-wind', 'wi-snowflake-cold', 'wi-cloudy', 'wi-night-alt-cloudy', 'wi-day-cloudy', 'wi-night-partly-cloudy', 'wi-day-cloudy', 'wi-night-clear', 'wi-day-sunny', 'wi-night-partly-cloudy', 'wi-day-cloudy', 'wi-thunderstorm', 'wi-hot', 'wi-day-thunderstorm', 'wi-day-thunderstorm', 'wi-day-rain', 'wi-rain', 'wi-day-snow', 'wi-night-snow', 'wi-night-snow', 'wi-na', 'wi-night-alt-rain', 'wi-night-alt-snow', 'wi-night-alt-snow-thunderstorm'];
        return skycodeArray[value];
    },
    changeBg(temp) {
        const container = dom.$('#container');
        if (temp >= 20) {
            container.className = 'warm';
        } else if (temp < 20 && temp >= 10) {
            container.className = 'normal';
        } else {
            container.className = 'cold'
        }
    },
    components: {
        // render the weather info for today
        today(data, imgUrl, {
            eltern = output,
            inhalt = ''
        } = {}) {
            const today = dom.create({
                eltern,
                klassen: ['today']
            });
            // current day
            dom.create({
                typ: 'p',
                inhalt: dom.parseTime(data[0].location.timezone),
                eltern: today,
                klassen: ['date']
            });

            // bookmark
            dom.create({
                typ: 'i',
                attr: {
                    'aria-hidden': 'true',
                    'id': 'bookmark'
                },
                eltern: today,
                klassen: ['fa', 'fa-heart-o', 'bookmark']
            });
            // current location
            dom.create({
                typ: 'h2',
                attr: {
                    'id': 'currLocation'
                },
                inhalt: data[0].location.name,
                eltern: today
            });

            // current weather icon
            dom.create({
                inhalt: `<i class="wi ${dom.parseSkycode(data[0].current.skycode)}"></i>`,
                eltern: today,
                klassen: ['icon']
            });

            // current weather description
            dom.create({
                typ: 'h3',
                inhalt: data[0].current.skytext,
                eltern: today
            });

            // current temperature
            dom.create({
                typ: 'p',
                inhalt: `${data[0].current.temperature}°C`,
                eltern: today,
                klassen: ['currTemp']
            });

            // feellike temperature
            dom.create({
                typ: 'p',
                inhalt: `Feels like ${data[0].current.feelslike} °C`,
                eltern: today,
                klassen: ['feelslike']
            });

            // changeBg
            dom.changeBg(data[0].current.temperature);
            return today;
        },
        // render the weather forecast info
        forecast(forecastData, {
            eltern = output,
            inhalt = ''
        } = {}) {

            const forecastDays = dom.create({
                eltern,
                klassen: ['forecastDays'],
                inhalt: ''
            });
            for (let i = 1; i < forecastData.length; i++) {
                const forecastDay = dom.create({
                    eltern: forecastDays,
                    klassen: ['forecastDay', 'transit'],
                    inhalt: ''
                });

                // create 3-days forcast divs
                dom.create({
                    inhalt: forecastData[i].shortday,
                    eltern: forecastDay
                });

                dom.create({
                    inhalt: `<i class="wi ${dom.parseSkycode(forecastData[i].skycodeday)}"></i>`,
                    klassen: ['icon'],
                    eltern: forecastDay
                });

                dom.create({
                    inhalt: `${forecastData[i].low}° / ${forecastData[i].high}°`,
                    eltern: forecastDay
                });
            }
            return forecastDays;

        }
    }
}
