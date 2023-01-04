// https://github.com/GoogleChrome/web-vitals
// prettier-ignore
// eslint-disable-next-line
var webVitals=function(e){"use strict";var t,n,i,r,a=function(e,t){return{name:e,value:void 0===t?-1:t,delta:0,entries:[],id:"v2-".concat(Date.now(),"-").concat(Math.floor(8999999999999*Math.random())+1e12)}},o=function(e,t){try{if(PerformanceObserver.supportedEntryTypes.includes(e)){if("first-input"===e&&!("PerformanceEventTiming"in self))return;var n=new PerformanceObserver((function(e){return e.getEntries().map(t)}));return n.observe({type:e,buffered:!0}),n}}catch(e){}},u=function(e,t){var n=function n(i){"pagehide"!==i.type&&"hidden"!==document.visibilityState||(e(i),t&&(removeEventListener("visibilitychange",n,!0),removeEventListener("pagehide",n,!0)))};addEventListener("visibilitychange",n,!0),addEventListener("pagehide",n,!0)},c=function(e){addEventListener("pageshow",(function(t){t.persisted&&e(t)}),!0)},f=function(e,t,n){var i;return function(r){t.value>=0&&(r||n)&&(t.delta=t.value-(i||0),(t.delta||void 0===i)&&(i=t.value,e(t)))}},s=-1,m=function(){return"hidden"===document.visibilityState?0:1/0},v=function(){u((function(e){var t=e.timeStamp;s=t}),!0)},d=function(){return s<0&&(s=m(),v(),c((function(){setTimeout((function(){s=m(),v()}),0)}))),{get firstHiddenTime(){return s}}},p=function(e,t){var n,i=d(),r=a("FCP"),u=function(e){"first-contentful-paint"===e.name&&(m&&m.disconnect(),e.startTime<i.firstHiddenTime&&(r.value=e.startTime,r.entries.push(e),n(!0)))},s=window.performance&&performance.getEntriesByName&&performance.getEntriesByName("first-contentful-paint")[0],m=s?null:o("paint",u);(s||m)&&(n=f(e,r,t),s&&u(s),c((function(i){r=a("FCP"),n=f(e,r,t),requestAnimationFrame((function(){requestAnimationFrame((function(){r.value=performance.now()-i.timeStamp,n(!0)}))}))})))},l=!1,g=-1,T={passive:!0,capture:!0},h=new Date,y=function(e,r){t||(t=r,n=e,i=new Date,S(removeEventListener),E())},E=function(){if(n>=0&&n<i-h){var e={entryType:"first-input",name:t.type,target:t.target,cancelable:t.cancelable,startTime:t.timeStamp,processingStart:t.timeStamp+n};r.forEach((function(t){t(e)})),r=[]}},L=function(e){if(e.cancelable){var t=(e.timeStamp>1e12?new Date:performance.now())-e.timeStamp;"pointerdown"==e.type?function(e,t){var n=function(){y(e,t),r()},i=function(){r()},r=function(){removeEventListener("pointerup",n,T),removeEventListener("pointercancel",i,T)};addEventListener("pointerup",n,T),addEventListener("pointercancel",i,T)}(t,e):y(t,e)}},S=function(e){["mousedown","keydown","touchstart","pointerdown"].forEach((function(t){return e(t,L,T)}))},w={};return e.getCLS=function(e,t){l||(p((function(e){g=e.value})),l=!0);var n,i=function(t){g>-1&&e(t)},r=a("CLS",0),s=0,m=[],v=function(e){if(!e.hadRecentInput){var t=m[0],i=m[m.length-1];s&&e.startTime-i.startTime<1e3&&e.startTime-t.startTime<5e3?(s+=e.value,m.push(e)):(s=e.value,m=[e]),s>r.value&&(r.value=s,r.entries=m,n())}},d=o("layout-shift",v);d&&(n=f(i,r,t),u((function(){d.takeRecords().map(v),n(!0)})),c((function(){s=0,g=-1,r=a("CLS",0),n=f(i,r,t)})))},e.getFCP=p,e.getFID=function(e,i){var s,m=d(),v=a("FID"),p=function(e){e.startTime<m.firstHiddenTime&&(v.value=e.processingStart-e.startTime,v.entries.push(e),s(!0))},l=o("first-input",p);s=f(e,v,i),l&&u((function(){l.takeRecords().map(p),l.disconnect()}),!0),l&&c((function(){var o;v=a("FID"),s=f(e,v,i),r=[],n=-1,t=null,S(addEventListener),o=p,r.push(o),E()}))},e.getLCP=function(e,t){var n,i=d(),r=a("LCP"),s=function(e){var t=e.startTime;t<i.firstHiddenTime&&(r.value=t,r.entries.push(e),n())},m=o("largest-contentful-paint",s);if(m){n=f(e,r,t);var v=function(){w[r.id]||(m.takeRecords().map(s),m.disconnect(),w[r.id]=!0,n(!0))};["keydown","click"].forEach((function(e){addEventListener(e,v,{once:!0,capture:!0})})),u(v,!0),c((function(i){r=a("LCP"),n=f(e,r,t),requestAnimationFrame((function(){requestAnimationFrame((function(){r.value=performance.now()-i.timeStamp,w[r.id]=!0,n(!0)}))}))}))}},e.getTTFB=function(e){var t,n=a("TTFB");t=function(){try{var t=performance.getEntriesByType("navigation")[0]||function(){var e=performance.timing,t={entryType:"navigation",startTime:0};for(var n in e)"navigationStart"!==n&&"toJSON"!==n&&(t[n]=Math.max(e[n]-e.navigationStart,0));return t}();if(n.value=n.delta=t.responseStart,n.value<0||n.value>performance.now())return;n.entries=[t],e(n)}catch(e){}},"complete"===document.readyState?setTimeout(t,0):addEventListener("load",(function(){return setTimeout(t,0)}))},Object.defineProperty(e,"__esModule",{value:!0}),e}({});

const SUPPORTS_LCP = !!window.LargestContentfulPaint;

const REPORT_ANYWAY_AFTER_SECONDS = 5;

class DiscoursePerformanceTool {
  observer = null;

  static start() {
    this.instance = new DiscoursePerformanceTool();
    this.instance.listenForPerformanceEntries();
  }

  constructor() {
    this.path = window.location.pathname;

    window.addEventListener("beforeunload", () => {
      if (performance.now() > REPORT_ANYWAY_AFTER_SECONDS * 1000) {
        this.report();
      }
    });
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

    webVitals.getLCP(this.handleWebVital.bind(this));

    this.reportIfReady();
  }

  handlePerformanceEntry(e) {
    if (e.entryType === "navigation") {
      this.navigationEntry = e;
    } else if (e.entryType === "paint" && e.name === "first-contentful-paint") {
      this.firstContentfulPaintEntry = e;
    } else if (e.entryType === "mark" && e.name === "discourse-booted") {
      this.discourseBootEntry = e;
    }
    this.reportIfReady();
  }

  handleWebVital(e) {
    if (e.name === "LCP") {
      this.largestContentfulPaint = e;
    }
    this.reportIfReady();
  }

  reportIfReady() {
    if (
      this.navigationEntry &&
      this.firstContentfulPaintEntry &&
      this.discourseBootEntry &&
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
    data["discourse_booted"] = this.discourseBootEntry?.startTime;
    data["dom_content_loaded"] =
      this.navigationEntry?.domContentLoadedEventStart;
    data["first_contentful_paint"] = this.firstContentfulPaintEntry?.startTime;
    if (SUPPORTS_LCP) {
      data["largest_contentful_paint"] = this.largestContentfulPaint?.value;
    }

    data["path"] = this.path;

    const assetStats = this.getAssetStatsByDomain();

    data["assets"] = {
      local: assetStats.get(document.location.host),
    };

    const siteInfo = document.getElementById("data-discourse-setup").dataset;
    if (siteInfo.cdn) {
      data["assets"]["app_cdn"] = assetStats.get(new URL(siteInfo.cdn).host);
    }
    if (siteInfo.s3Cdn) {
      data["assets"]["s3_cdn"] = assetStats.get(new URL(siteInfo.s3Cdn).host);
    }

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

DiscoursePerformanceTool.start();
