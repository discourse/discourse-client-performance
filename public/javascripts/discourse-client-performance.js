// https://github.com/GoogleChrome/web-vitals - version 2.4.2
// https://unpkg.com/web-vitals@4.2.4/dist/web-vitals.attribution.iife.js
// prettier-ignore
// eslint-disable-next-line
var webVitals=function(t){"use strict";var e,n,r=function(){var t=self.performance&&performance.getEntriesByType&&performance.getEntriesByType("navigation")[0];if(t&&t.responseStart>0&&t.responseStart<performance.now())return t},i=function(t){if("loading"===document.readyState)return"loading";var e=r();if(e){if(t<e.domInteractive)return"loading";if(0===e.domContentLoadedEventStart||t<e.domContentLoadedEventStart)return"dom-interactive";if(0===e.domComplete||t<e.domComplete)return"dom-content-loaded"}return"complete"},a=function(t){var e=t.nodeName;return 1===t.nodeType?e.toLowerCase():e.toUpperCase().replace(/^#/,"")},o=function(t,e){var n="";try{for(;t&&9!==t.nodeType;){var r=t,i=r.id?"#"+r.id:a(r)+(r.classList&&r.classList.value&&r.classList.value.trim()&&r.classList.value.trim().length?"."+r.classList.value.trim().replace(/\s+/g,"."):"");if(n.length+i.length>(e||100)-1)return n||i;if(n=n?i+">"+n:i,r.id)break;t=r.parentNode}}catch(t){}return n},c=-1,s=function(){return c},u=function(t){addEventListener("pageshow",(function(e){e.persisted&&(c=e.timeStamp,t(e))}),!0)},f=function(){var t=r();return t&&t.activationStart||0},d=function(t,e){var n=r(),i="navigate";s()>=0?i="back-forward-cache":n&&(document.prerendering||f()>0?i="prerender":document.wasDiscarded?i="restore":n.type&&(i=n.type.replace(/_/g,"-")));return{name:t,value:void 0===e?-1:e,rating:"good",delta:0,entries:[],id:"v4-".concat(Date.now(),"-").concat(Math.floor(8999999999999*Math.random())+1e12),navigationType:i}},l=function(t,e,n){try{if(PerformanceObserver.supportedEntryTypes.includes(t)){var r=new PerformanceObserver((function(t){Promise.resolve().then((function(){e(t.getEntries())}))}));return r.observe(Object.assign({type:t,buffered:!0},n||{})),r}}catch(t){}},m=function(t,e,n,r){var i,a;return function(o){e.value>=0&&(o||r)&&((a=e.value-(i||0))||void 0===i)&&(i=e.value,e.delta=a,e.rating=function(t,e){return t>e[1]?"poor":t>e[0]?"needs-improvement":"good"}(e.value,n),t(e))}},v=function(t){requestAnimationFrame((function(){return requestAnimationFrame((function(){return t()}))}))},p=function(t){document.addEventListener("visibilitychange",(function(){"hidden"===document.visibilityState&&t()}))},h=function(t){var e=!1;return function(){e||(t(),e=!0)}},g=-1,T=function(){return"hidden"!==document.visibilityState||document.prerendering?1/0:0},y=function(t){"hidden"===document.visibilityState&&g>-1&&(g="visibilitychange"===t.type?t.timeStamp:0,S())},E=function(){addEventListener("visibilitychange",y,!0),addEventListener("prerenderingchange",y,!0)},S=function(){removeEventListener("visibilitychange",y,!0),removeEventListener("prerenderingchange",y,!0)},b=function(){return g<0&&(g=T(),E(),u((function(){setTimeout((function(){g=T(),E()}),0)}))),{get firstHiddenTime(){return g}}},C=function(t){document.prerendering?addEventListener("prerenderingchange",(function(){return t()}),!0):t()},L=[1800,3e3],M=function(t,e){e=e||{},C((function(){var n,r=b(),i=d("FCP"),a=l("paint",(function(t){t.forEach((function(t){"first-contentful-paint"===t.name&&(a.disconnect(),t.startTime<r.firstHiddenTime&&(i.value=Math.max(t.startTime-f(),0),i.entries.push(t),n(!0)))}))}));a&&(n=m(t,i,L,e.reportAllChanges),u((function(r){i=d("FCP"),n=m(t,i,L,e.reportAllChanges),v((function(){i.value=performance.now()-r.timeStamp,n(!0)}))})))}))},D=[.1,.25],w=0,I=1/0,F=0,P=function(t){t.forEach((function(t){t.interactionId&&(I=Math.min(I,t.interactionId),F=Math.max(F,t.interactionId),w=F?(F-I)/7+1:0)}))},x=function(){return e?w:performance.interactionCount||0},k=function(){"interactionCount"in performance||e||(e=l("event",P,{type:"event",buffered:!0,durationThreshold:0}))},A=[],B=new Map,O=0,R=function(){var t=Math.min(A.length-1,Math.floor((x()-O)/50));return A[t]},j=[],q=function(t){if(j.forEach((function(e){return e(t)})),t.interactionId||"first-input"===t.entryType){var e=A[A.length-1],n=B.get(t.interactionId);if(n||A.length<10||t.duration>e.latency){if(n)t.duration>n.latency?(n.entries=[t],n.latency=t.duration):t.duration===n.latency&&t.startTime===n.entries[0].startTime&&n.entries.push(t);else{var r={id:t.interactionId,latency:t.duration,entries:[t]};B.set(r.id,r),A.push(r)}A.sort((function(t,e){return e.latency-t.latency})),A.length>10&&A.splice(10).forEach((function(t){return B.delete(t.id)}))}}},N=function(t){var e=self.requestIdleCallback||self.setTimeout,n=-1;return t=h(t),"hidden"===document.visibilityState?t():(n=e(t),p(t)),n},H=[200,500],V=function(t,e){"PerformanceEventTiming"in self&&"interactionId"in PerformanceEventTiming.prototype&&(e=e||{},C((function(){var n;k();var r,i=d("INP"),a=function(t){N((function(){t.forEach(q);var e=R();e&&e.latency!==i.value&&(i.value=e.latency,i.entries=e.entries,r())}))},o=l("event",a,{durationThreshold:null!==(n=e.durationThreshold)&&void 0!==n?n:40});r=m(t,i,H,e.reportAllChanges),o&&(o.observe({type:"first-input",buffered:!0}),p((function(){a(o.takeRecords()),r(!0)})),u((function(){O=x(),A.length=0,B.clear(),i=d("INP"),r=m(t,i,H,e.reportAllChanges)})))})))},W=[],z=[],U=0,_=new WeakMap,G=new Map,J=-1,K=function(t){W=W.concat(t),Q()},Q=function(){J<0&&(J=N(X))},X=function(){G.size>10&&G.forEach((function(t,e){B.has(e)||G.delete(e)}));var t=A.map((function(t){return _.get(t.entries[0])})),e=z.length-50;z=z.filter((function(n,r){return r>=e||t.includes(n)}));for(var n=new Set,r=0;r<z.length;r++){var i=z[r];et(i.startTime,i.processingEnd).forEach((function(t){n.add(t)}))}var a=W.length-1-50;W=W.filter((function(t,e){return t.startTime>U&&e>a||n.has(t)})),J=-1};j.push((function(t){t.interactionId&&t.target&&!G.has(t.interactionId)&&G.set(t.interactionId,t.target)}),(function(t){var e,n=t.startTime+t.duration;U=Math.max(U,t.processingEnd);for(var r=z.length-1;r>=0;r--){var i=z[r];if(Math.abs(n-i.renderTime)<=8){(e=i).startTime=Math.min(t.startTime,e.startTime),e.processingStart=Math.min(t.processingStart,e.processingStart),e.processingEnd=Math.max(t.processingEnd,e.processingEnd),e.entries.push(t);break}}e||(e={startTime:t.startTime,processingStart:t.processingStart,processingEnd:t.processingEnd,renderTime:n,entries:[t]},z.push(e)),(t.interactionId||"first-input"===t.entryType)&&_.set(t,e),Q()}));var Y,Z,$,tt,et=function(t,e){for(var n,r=[],i=0;n=W[i];i++)if(!(n.startTime+n.duration<t)){if(n.startTime>e)break;r.push(n)}return r},nt=[2500,4e3],rt={},it=[800,1800],at=function t(e){document.prerendering?C((function(){return t(e)})):"complete"!==document.readyState?addEventListener("load",(function(){return t(e)}),!0):setTimeout(e,0)},ot=function(t,e){e=e||{};var n=d("TTFB"),i=m(t,n,it,e.reportAllChanges);at((function(){var a=r();a&&(n.value=Math.max(a.responseStart-f(),0),n.entries=[a],i(!0),u((function(){n=d("TTFB",0),(i=m(t,n,it,e.reportAllChanges))(!0)})))}))},ct={passive:!0,capture:!0},st=new Date,ut=function(t,e){Y||(Y=e,Z=t,$=new Date,lt(removeEventListener),ft())},ft=function(){if(Z>=0&&Z<$-st){var t={entryType:"first-input",name:Y.type,target:Y.target,cancelable:Y.cancelable,startTime:Y.timeStamp,processingStart:Y.timeStamp+Z};tt.forEach((function(e){e(t)})),tt=[]}},dt=function(t){if(t.cancelable){var e=(t.timeStamp>1e12?new Date:performance.now())-t.timeStamp;"pointerdown"==t.type?function(t,e){var n=function(){ut(t,e),i()},r=function(){i()},i=function(){removeEventListener("pointerup",n,ct),removeEventListener("pointercancel",r,ct)};addEventListener("pointerup",n,ct),addEventListener("pointercancel",r,ct)}(e,t):ut(e,t)}},lt=function(t){["mousedown","keydown","touchstart","pointerdown"].forEach((function(e){return t(e,dt,ct)}))},mt=[100,300],vt=function(t,e){e=e||{},C((function(){var n,r=b(),i=d("FID"),a=function(t){t.startTime<r.firstHiddenTime&&(i.value=t.processingStart-t.startTime,i.entries.push(t),n(!0))},o=function(t){t.forEach(a)},c=l("first-input",o);n=m(t,i,mt,e.reportAllChanges),c&&(p(h((function(){o(c.takeRecords()),c.disconnect()}))),u((function(){var r;i=d("FID"),n=m(t,i,mt,e.reportAllChanges),tt=[],Z=-1,Y=null,lt(addEventListener),r=a,tt.push(r),ft()})))}))};return t.CLSThresholds=D,t.FCPThresholds=L,t.FIDThresholds=mt,t.INPThresholds=H,t.LCPThresholds=nt,t.TTFBThresholds=it,t.onCLS=function(t,e){!function(t,e){e=e||{},M(h((function(){var n,r=d("CLS",0),i=0,a=[],o=function(t){t.forEach((function(t){if(!t.hadRecentInput){var e=a[0],n=a[a.length-1];i&&t.startTime-n.startTime<1e3&&t.startTime-e.startTime<5e3?(i+=t.value,a.push(t)):(i=t.value,a=[t])}})),i>r.value&&(r.value=i,r.entries=a,n())},c=l("layout-shift",o);c&&(n=m(t,r,D,e.reportAllChanges),p((function(){o(c.takeRecords()),n(!0)})),u((function(){i=0,r=d("CLS",0),n=m(t,r,D,e.reportAllChanges),v((function(){return n()}))})),setTimeout(n,0))})))}((function(e){var n=function(t){var e,n={};if(t.entries.length){var r=t.entries.reduce((function(t,e){return t&&t.value>e.value?t:e}));if(r&&r.sources&&r.sources.length){var a=(e=r.sources).find((function(t){return t.node&&1===t.node.nodeType}))||e[0];a&&(n={largestShiftTarget:o(a.node),largestShiftTime:r.startTime,largestShiftValue:r.value,largestShiftSource:a,largestShiftEntry:r,loadState:i(r.startTime)})}}return Object.assign(t,{attribution:n})}(e);t(n)}),e)},t.onFCP=function(t,e){M((function(e){var n=function(t){var e={timeToFirstByte:0,firstByteToFCP:t.value,loadState:i(s())};if(t.entries.length){var n=r(),a=t.entries[t.entries.length-1];if(n){var o=n.activationStart||0,c=Math.max(0,n.responseStart-o);e={timeToFirstByte:c,firstByteToFCP:t.value-c,loadState:i(t.entries[0].startTime),navigationEntry:n,fcpEntry:a}}}return Object.assign(t,{attribution:e})}(e);t(n)}),e)},t.onFID=function(t,e){vt((function(e){var n=function(t){var e=t.entries[0],n={eventTarget:o(e.target),eventType:e.name,eventTime:e.startTime,eventEntry:e,loadState:i(e.startTime)};return Object.assign(t,{attribution:n})}(e);t(n)}),e)},t.onINP=function(t,e){n||(n=l("long-animation-frame",K)),V((function(e){var n=function(t){var e=t.entries[0],n=_.get(e),r=e.processingStart,a=n.processingEnd,c=n.entries.sort((function(t,e){return t.processingStart-e.processingStart})),s=et(e.startTime,a),u=t.entries.find((function(t){return t.target})),f=u&&u.target||G.get(e.interactionId),d=[e.startTime+e.duration,a].concat(s.map((function(t){return t.startTime+t.duration}))),l=Math.max.apply(Math,d),m={interactionTarget:o(f),interactionTargetElement:f,interactionType:e.name.startsWith("key")?"keyboard":"pointer",interactionTime:e.startTime,nextPaintTime:l,processedEventEntries:c,longAnimationFrameEntries:s,inputDelay:r-e.startTime,processingDuration:a-r,presentationDelay:Math.max(l-a,0),loadState:i(e.startTime)};return Object.assign(t,{attribution:m})}(e);t(n)}),e)},t.onLCP=function(t,e){!function(t,e){e=e||{},C((function(){var n,r=b(),i=d("LCP"),a=function(t){e.reportAllChanges||(t=t.slice(-1)),t.forEach((function(t){t.startTime<r.firstHiddenTime&&(i.value=Math.max(t.startTime-f(),0),i.entries=[t],n())}))},o=l("largest-contentful-paint",a);if(o){n=m(t,i,nt,e.reportAllChanges);var c=h((function(){rt[i.id]||(a(o.takeRecords()),o.disconnect(),rt[i.id]=!0,n(!0))}));["keydown","click"].forEach((function(t){addEventListener(t,(function(){return N(c)}),{once:!0,capture:!0})})),p(c),u((function(r){i=d("LCP"),n=m(t,i,nt,e.reportAllChanges),v((function(){i.value=performance.now()-r.timeStamp,rt[i.id]=!0,n(!0)}))}))}}))}((function(e){var n=function(t){var e={timeToFirstByte:0,resourceLoadDelay:0,resourceLoadDuration:0,elementRenderDelay:t.value};if(t.entries.length){var n=r();if(n){var i=n.activationStart||0,a=t.entries[t.entries.length-1],c=a.url&&performance.getEntriesByType("resource").filter((function(t){return t.name===a.url}))[0],s=Math.max(0,n.responseStart-i),u=Math.max(s,c?(c.requestStart||c.startTime)-i:0),f=Math.max(u,c?c.responseEnd-i:0),d=Math.max(f,a.startTime-i);e={element:o(a.element),timeToFirstByte:s,resourceLoadDelay:u-s,resourceLoadDuration:f-u,elementRenderDelay:d-f,navigationEntry:n,lcpEntry:a},a.url&&(e.url=a.url),c&&(e.lcpResourceEntry=c)}}return Object.assign(t,{attribution:e})}(e);t(n)}),e)},t.onTTFB=function(t,e){ot((function(e){var n=function(t){var e={waitingDuration:0,cacheDuration:0,dnsDuration:0,connectionDuration:0,requestDuration:0};if(t.entries.length){var n=t.entries[0],r=n.activationStart||0,i=Math.max((n.workerStart||n.fetchStart)-r,0),a=Math.max(n.domainLookupStart-r,0),o=Math.max(n.connectStart-r,0),c=Math.max(n.connectEnd-r,0);e={waitingDuration:i,cacheDuration:a-i,dnsDuration:o-a,connectionDuration:c-o,requestDuration:t.value-c,navigationEntry:n}}return Object.assign(t,{attribution:e})}(e);t(n)}),e)},t}({});

const SUPPORTS_LCP = !!window.LargestContentfulPaint;
const SUPPORTS_INP = SUPPORTS_LCP;
const SUPPORTS_CLS = SUPPORTS_LCP;

/**
 * The default stringification of web-vital targets will describe its path from the closest element with an id.
 * This normally works great, but classic Ember components introduce random ids like `#ember12` which are not very useful.
 * So if we detect that case, we do our own stringification.
 */
function stringifyTarget(node, defaultString) {
  if (node && defaultString?.match(/^#ember\d+$/)) {
    const id = node.id ? `#${node.id}` : "";
    const classes = Array.from(node.classList)
      .map((c) => `.${c}`)
      .join("");
    return `${node.tagName.toLowerCase()}${id}${classes}`;
  } else {
    return defaultString;
  }
}

class DiscourseClientPerformance {
  static start() {
    this.instance = new DiscourseClientPerformance();
    this.instance.listenForPerformanceEntries();
  }

  observer = null;

  constructor() {
    this.path = window.location.pathname;

    window.addEventListener("visibilitychange", () => this.report());
    window.addEventListener("beforeunload", () => this.report());
  }

  listenForPerformanceEntries() {
    this.observer = new PerformanceObserver((list) => {
      list.getEntries().forEach(this.handlePerformanceEntry.bind(this));
      this.reportIfReady();
    });

    this.observer.observe({
      buffered: true,
      type: "navigation",
    });

    this.observer.observe({
      buffered: true,
      type: "paint",
    });

    this.observer.observe({
      buffered: true,
      type: "mark",
    });

    // Safari bug? Doesn't seem to support `buffered: true` on "paint" events
    // so we have to check if it already fired. No harm in running this
    // in other browsers as well.
    const paintEvents = performance.getEntriesByType("paint");
    paintEvents.forEach(this.handlePerformanceEntry.bind(this));

    webVitals.onLCP(this.handleWebVital.bind(this));
    webVitals.onINP(this.handleWebVital.bind(this), { reportAllChanges: true });
    webVitals.onCLS(this.handleWebVital.bind(this), { reportAllChanges: true });

    this.reportIfReady();
  }

  handlePerformanceEntry(e) {
    if (e.entryType === "navigation") {
      this.navigationEntry = e;
    } else if (e.entryType === "paint" && e.name === "first-contentful-paint") {
      this.firstContentfulPaintEntry = e;
    } else if (e.entryType === "mark" && e.name === "discourse-init") {
      this.discourseInitEntry = e;
    } else if (e.entryType === "mark" && e.name === "discourse-paint") {
      this.discoursePaintEntry = e;
    }
    this.reportIfReady();
  }

  handleWebVital(e) {
    if (e.name === "LCP") {
      this.largestContentfulPaint = e;
    } else if (e.name === "INP") {
      this.interactionNextPaint = e;
    } else if (e.name === "CLS") {
      this.cumulativeLayoutShift = e;
    }
    this.reportIfReady();
  }

  reportIfReady() {
    if (SUPPORTS_INP) {
      // INP metric continues changing after the page is loaded
      // so we wait until the unload event to report everything to the server
      return;
    }
    if (
      this.navigationEntry &&
      this.firstContentfulPaintEntry &&
      this.discourseInitEntry &&
      this.discoursePaintEntry &&
      (!SUPPORTS_LCP || this.largestContentfulPaint)
    ) {
      this.report();
    }
  }

  report() {
    if (this.reported) {
      return;
    }
    this.reported = true;

    const data = {};

    data["time_to_first_byte"] = this.navigationEntry?.responseStart;
    data["discourse_init"] = this.discourseInitEntry?.startTime;
    data["discourse_paint"] = this.discoursePaintEntry?.startTime;
    data["dom_content_loaded"] =
      this.navigationEntry?.domContentLoadedEventStart;
    data["first_contentful_paint"] = this.firstContentfulPaintEntry?.startTime;
    if (SUPPORTS_LCP) {
      data["largest_contentful_paint"] = this.largestContentfulPaint?.value;
    }
    if (SUPPORTS_INP) {
      const inp = this.interactionNextPaint;
      data["interaction_next_paint"] = inp?.value;

      const attribution = inp?.attribution;
      data["interaction_next_paint_target"] = stringifyTarget(
        attribution?.interactionTargetElement,
        attribution?.interactionTarget
      );
    }
    if (SUPPORTS_CLS) {
      const cls = this.cumulativeLayoutShift;
      data["cumulative_layout_shift"] = cls?.value;

      const attribution = cls?.attribution;
      data["cumulative_layout_shift_target"] = stringifyTarget(
        attribution?.largestShiftSource?.node,
        attribution?.largestShiftTarget
      );
    }

    data["path"] = this.path;

    const assetStats = this.getAssetStatsByDomain();

    data["assets"] = {
      local: assetStats.get(document.location.host),
    };

    const siteInfo = document.getElementById("data-discourse-setup")?.dataset;
    if (siteInfo?.cdn) {
      data["assets"]["app_cdn"] = assetStats.get(new URL(siteInfo.cdn).host);
    }
    if (siteInfo?.s3Cdn) {
      data["assets"]["s3_cdn"] = assetStats.get(new URL(siteInfo.s3Cdn).host);
    }

    data["viewport_width"] = window.innerWidth;
    data["viewport_height"] = window.innerHeight;
    data["mobile_view"] =
      document.documentElement.classList.contains("mobile-view");

    const body = new FormData();
    body.append("data", JSON.stringify(data));

    navigator.sendBeacon("/client-performance/report.json", body);
  }

  getAssetStatsByDomain() {
    const domResourceUrls = new Set();

    document.querySelectorAll("SCRIPT, LINK[rel=stylesheet]").forEach((el) => {
      if (el.async) {
        return;
      }
      const src = el.src || el.href;
      if (!src) {
        return;
      }
      domResourceUrls.add(new URL(src, window.location).toString());
    });

    const resourcePerformanceInfos = new Map();

    performance.getEntriesByType("resource").forEach((r) => {
      if (!domResourceUrls.has(r.name)) {
        return;
      }

      if (r.responseEnd) {
        resourcePerformanceInfos.set(r.name, {
          duration: r.responseEnd - r.startTime,
          finishedAt: r.responseEnd,
          status: "success",
        });
      } else {
        resourcePerformanceInfos.set(r.name, { status: "fail" });
      }
    });

    for (const url of domResourceUrls) {
      if (!resourcePerformanceInfos.has(url)) {
        resourcePerformanceInfos.set(url, { status: "pending" });
      }
    }

    const domainData = new Map();

    for (const [url, resourceInfo] of resourcePerformanceInfos) {
      const domain = new URL(url).host;

      let thisDomainData = domainData.get(domain);
      if (!thisDomainData) {
        thisDomainData = {
          success_count: 0,
          fail_count: 0,
          pending_count: 0,
          max_duration: 0,
          domain,
        };
        domainData.set(domain, thisDomainData);
      }

      thisDomainData[`${resourceInfo.status}_count`] += 1;
      if (resourceInfo.duration) {
        thisDomainData.max_duration = Math.max(
          thisDomainData.max_duration,
          Math.round(resourceInfo.duration) / 1000
        );
      }
    }

    return domainData;
  }

  round(value, precision = 1) {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }
}

DiscourseClientPerformance.start();
