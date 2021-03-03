!function () {
    "use strict";
    var e,
        n,
        t,
        o = "sync.adnwif.smt.docomo.ne.jp",
        i = "/rt",
        r = document.location.href,
        d = document.referrer,
        c = document.title,
        a = navigator.cookieEnabled
            ? 1
            : 0,
        m = navigator.userAgent;
    0 !== a && (m.indexOf("iPhone") > 0 || m.indexOf("iPad") > 0 || m.indexOf("iPod") > 0 || m.indexOf("Android") > 0) && (t = fringe81tag.rtgTag.shift(), e = document.getElementsByTagName("script")[0], n = document.createElement("iframe"), n.width = 0, n.height = 0, n.border = 0, n.noResize = !0, n.scrolling = "no", n.marginWidth = 0, n.marginHeight = 0, n.style.display = "none", n.src = "https://" + o + i + "?cln=" + t.clientId + "&lou=" + encodeURIComponent(r || "") + "&reu=" + encodeURIComponent(d || "") + "&tiu=" + encodeURIComponent(c || "") + "&c1=" + a + "&" + (
        new Date
    ).getTime(), e.parentNode.insertBefore(n, e))
}();