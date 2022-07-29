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
        let UmamiClass = await import('react-umami');
        try {
            // eslint-disable-next-line
            let regex = new RegExp('^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)', 'img');
            regex.lastIndex = 0;
            let hostname = regex.exec(process.env.REACT_APP_PUBLIC_URL)[1];
            hostname = hostname ? hostname : 'invalid.domain';
            umami.tracker = new UmamiClass.react_umami(
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

function trackWebVitals() {
    import('web-vitals').then(webVitals => {
        webVitals.getCLS(console.debug);
        webVitals.getFID(console.debug);
        webVitals.getLCP(console.debug);
        webVitals.getTTFB(console.debug);
        webVitals.getFCP(console.debug);
    }
    );
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

async function umamiTrackEvent(value, type) {
    if (!umami.isInitialized) {
        umami.isInitialized = await initialize('umami');
    }
    if (umami.isInitialized) {
        umami.tracker.trackEvent(type, value, window.location.pathname);
    }
}

async function gaTrackEvent(value, type) {
    if (!ga.isInitialized) {
        ga.isInitialized = await initialize('ga4');
    }
    ga.tracker.event({ category: type, action: value });
}

export function trackEvent(value, type = 'custom') {
    if (umami.enabled === true) {
        let event = umamiTrackEvent(value, type);
        event.catch(e => console.debug('umami failed sending event: ', e));
    }
    if (ga.enabled === true) {
        let event = gaTrackEvent(value, type);
        event.catch(e => console.debug('ga4 failed sending event: ', e));
    }
    if (umami.enabled !== true && ga.enabled !== true) {
        console.log('Event ' + value + '(' + type + ') triggered.');
    }
}