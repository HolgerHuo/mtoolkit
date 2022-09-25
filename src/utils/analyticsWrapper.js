let umami = { enabled: false, isInitialized: false, tracker: undefined }, ga = { enabled: false, isInitialized: false, tracker: undefined };

if (process.env.NODE_ENV === 'production') {
    if (process.env.REACT_APP_UMAMI_SCRIPT_URL !== undefined && process.env.REACT_APP_UMAMI_WEBSITE_ID !== undefined) {
        umami.enabled = true;
    }
    if (process.env.REACT_APP_GA4_ID !== undefined) {
        ga.enabled = true;
    }
}

async function initialize(provider) {
    if (provider === 'umami') {
        let UmamiLib = await import('../lib/react-umami');
        const UmamiClass = UmamiLib.default;
        try {
            // eslint-disable-next-line
            let regex = new RegExp('^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)', 'img');
            regex.lastIndex = 0;
            let hostname = regex.exec(process.env.PUBLIC_URL)[1];
            hostname = hostname || 'invalid.domain';
            umami.tracker = new UmamiClass(
                process.env.REACT_APP_UMAMI_WEBSITE_ID,
                hostname,
                process.env.REACT_APP_UMAMI_SCRIPT_URL
            );
            return true;
        } catch (e) {
            console.error('umami initialization failed: ', e);
            return false;
        }
    }
    if (provider === 'ga4') {
        let ga4 = await import("react-ga4");
        try {
            ga.tracker = ga4.default;
            ga.tracker.initialize(process.env.REACT_APP_GA4_ID);
            return true;
        } catch (e) {
            console.error('ga4 initialization failed: ', e);
            return false;
        }
    }
}

async function trackWebVitals() {
    let webVitals = await import('web-vitals');
    const collectWebVitals = endpoint => {
        webVitals.getCLS(endpoint);
        webVitals.getFID(endpoint);
        webVitals.getLCP(endpoint);
        webVitals.getFCP(endpoint);
        webVitals.getTTFB(endpoint);
    }
    if (ga.enabled === true || umami.enabled === true) {
        if (ga.enabled === true) {
            if (!ga.isInitialized) {
                ga.isInitialized = await initialize('ga4');
            }
            if (ga.isInitialized) {
                function sendToGoogleAnalytics({ name, delta, value, id }) {
                    ga.tracker.event(name, {
                        value: delta,
                        metric_id: id,
                        metric_value: value,
                        metric_delta: delta,
                    });
                }
                try {
                    collectWebVitals(sendToGoogleAnalytics);
                } catch (e) {
                    console.debug('ga4 failed sending web-vitals data: ', e);
                }
            }
        }

        if (umami.enabled === true) {
            if (!umami.isInitialized) {
                umami.isInitialized = await initialize('umami');
            }
            if (umami.isInitialized) {
                function sendToUmami({ name, delta, value, id }) {
                    umami.tracker.trackEvent(name, {
                        value: delta,
                        metric_id: id,
                        metric_value: value,
                        metric_delta: delta,
                    }, window.location.pathname);
                }
                try {
                    collectWebVitals(sendToUmami);
                } catch (e) {
                    console.debug('umami failed sending web-vitals data: ', e);
                }
            }
        }

    } else {
        collectWebVitals(console.debug);
    }
}

async function umamiTrackPV() {
    if (!umami.isInitialized) {
        umami.isInitialized = await initialize('umami');
    }
    if (umami.isInitialized) {
        umami.tracker.trackView(window.location.pathname);
    }
}

async function gaTrackPV() {
    if (!ga.isInitialized) {
        ga.isInitialized = await initialize('ga4');
    }
    if (ga.isInitialized) {
        ga.tracker.send("pageview");
    }
}

export function trackPV() {
    if (umami.enabled === true) {
        let pv = umamiTrackPV();
        pv.catch(e => console.debug('umami failed sending pv: ', e));
    }
    if (ga.enabled === true) {
        let pv = gaTrackPV();
        pv.catch(e => console.debug('ga4 failed sending pv: ', e));
    }
    if (umami.enabled !== true && ga.enabled !== true) {
        console.log('Navigated to ' + window.location.pathname);
    }
    trackWebVitals();
}

async function umamiTrackEvent(data, name) {
    if (!umami.isInitialized) {
        umami.isInitialized = await initialize('umami');
    }
    if (umami.isInitialized) {
        umami.tracker.trackEvent(name, data, window.location.pathname);
    }
}

async function gaTrackEvent(data, name) {
    if (!ga.isInitialized) {
        ga.isInitialized = await initialize('ga4');
    }
    if (ga.isInitialized) {
        ga.tracker.event(name, data);
    }
}

export function trackEvent(event, name) {
    let data = event;
    if (typeof data === 'string') {
        data = {value: event, type: name}
    }

    if (umami.enabled === true) {
        let event = umamiTrackEvent(data, name);
        event.catch(e => console.debug('umami failed sending event: ', e));
    }
    if (ga.enabled === true) {
        let event = gaTrackEvent(data, name);
        event.catch(e => console.debug('ga4 failed sending event: ', e));
    }
    if (umami.enabled !== true && ga.enabled !== true) {
        console.log('Event ' + name + ': ' + JSON.stringify(data) + ' triggered.');
    }
}