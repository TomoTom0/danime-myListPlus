/*
 Piwik - free/libre analytics platform

 JavaScript tracking client

 @link http://piwik.org
 @source https://github.com/piwik/piwik/blob/master/js/piwik.js
 @license http://piwik.org/free-software/bsd/ BSD-3 Clause (also in ./LICENSE.txt)
 @license magnet:?xt=urn:btih:c80d50af7d3db9be66a4d0a86db0286e4fd33292&dn=bsd-3-clause.txt BSD-3-Clause
 @license-end */
 var $jscomp = $jscomp || {};
 $jscomp.scope = {};
 $jscomp.findInternal = function (d, e, m) {
     d instanceof String && (d = String(d));
     for (var q = d.length, k = 0; k < q; k++) {
         var r = d[k];
         if (e.call(m, r, k, d)) 
             return {i: k, v: r}
         
     }
     return {i: -1, v: void 0}
 };
 $jscomp.ASSUME_ES5 = !1;
 $jscomp.ASSUME_NO_NATIVE_MAP = !1;
 $jscomp.ASSUME_NO_NATIVE_SET = !1;
 $jscomp.SIMPLE_FROUND_POLYFILL = !1;
 $jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties
     ? Object.defineProperty
     : function (d, e, m) {
         d != Array.prototype && d != Object.prototype && (d[e] = m.value)
     };
 $jscomp.getGlobal = function (d) {
     return "undefined" != typeof window && window === d
         ? d
         : "undefined" != typeof global && null != global
             ? global
             : d
 };
 $jscomp.global = $jscomp.getGlobal(this);
 $jscomp.polyfill = function (d, e, m, q) {
     if (e) {
         m = $jscomp.global;
         d = d.split(".");
         for (q = 0; q < d.length - 1; q++) {
             var k = d[q];
             k in m || (m[k] =
                 {});
             m = m[k]
         }
         d = d[d.length - 1];
         q = m[d];
         e = e(q);
         e != q && null != e && $jscomp.defineProperty(m, d, {
             configurable: !0,
             writable: !0,
             value: e
         })
     }
 };
 $jscomp.polyfill("Array.prototype.find", function (d) {
     return d
         ? d
         : function (d, m) {
             return $jscomp.findInternal(this, d, m).v
         }
 }, "es6", "es3");
 Array.prototype.forEach || (Array.prototype.forEach = function (d, e) {
     var m;
     if (null == this) 
         throw new TypeError(" this is null or not defined");
     
     var q = Object(this),
         k = q.length >>> 0;
     if ("[object Function]" != {}.toString.call(d)) 
         throw new TypeError(d + " is not a function");
     
     e && (m = e);
     for (e = 0; e < k;) {
         if (e in q) {
             var r = q[e];
             d.call(m, r, e, q)
         }
         e++
     }
 });
 var searchIntervalId = searchIntervalId || 0,
     searchIntervalCount = searchIntervalId || 0,
     DcmAn = {
         piwikSiteList: "7 8 10 12 23 26 35 91 125 126 174 185 224 237 239 245".split(" "),
         addListener: function (d, e, m) {
             d.addEventListener
                 ? d.addEventListener(e, m, {
                     passive: !0
                 })
                 : d.attachEvent && d.attachEvent("on" + e, m)
         },
         addFormEvent: function () {
             var d = document.getElementsByTagName("form");
             for (i = 0; i < d.length; i ++) 
                 DcmAn.addListener(d[i], "submit", DcmAn.decorateMe)
             
         },
         addEvent: function () {
             var d = document.getElementsByTagName("a");
             for (i = 0; i < d.length; i ++) 
                 DcmAn.addListener(d[i], "mousedown", DcmAn.decorateMe),
                 DcmAn.addListener(d[i], "keyup", DcmAn.decorateMe),
                 DcmAn.addListener(d[i], "touchstart", DcmAn.decorateMe)
             
         },
         decorateMe: function (d) {
             d = d || window.event;
             if ((d = d.target || d.srcElement) && d.href) 
                 DcmAn.checkDomain(d.href) && (d.href = DcmAn.decorateDmpfCross(d.href));
              else if (d && d.action && DcmAn.checkDomain(d.action)) 
                 if ("get" == d.method) {
                     var e = DcmAn.getDaCookieId();
                     if (1 < e.length) {
                         var m = document.createElement("input");
                         m.type = "hidden";
                         m.name = "dcmancr";
                         m.value = DcmAn.makeCrossParam(e);
                         d.appendChild(m)
                     }
                  else 
                     d.action = DcmAn.decorateDmpfCross(d.action)
                 
             
         },
         checkDomain: function (d) {
             var e = !1;
             _dcmlinker.forEach(function (m) {
                 var q = d.match(/^https?:\/\/([^\/:]+)/);
                 null != q && q[1] == m && (e =! 0)
             });
             return e
         },
         decorateDmpfCross: function (d) {
             var e = DcmAn.getDaCookieId();
             if (1 < e.length) {
                 var m = d.split("#");
                 d = m[0];
                 e = DcmAn.makeCrossParam(e);
                 var q = d.split("?");
                 if (1 == q.length) 
                     d = d + "?dcmancr=" + e;
                  else {
                     q = q[1].split("&");
                     var k = !0;
                     for (i = 0; i < q.length; i ++) 
                         if (0 == q[i].indexOf("dcmancr=")) {
                             k = !1;
                             break
                         }
                     
                     k && (d = d + "&dcmancr=" + e)
                 }
                 1 < m.length && (d = d + "#" + m[1])
             }
             return d
         },
         makeCrossParam: function (d) {
             for (var e = d.length, m = 0, q =( new Date).getTime(), k = 0; k < e; k++) 
                 m += d.charCodeAt(k);
             
             e = DcmAn.getGaCookieId();
             k = DcmAn.makeUa();
             return d + "." + q + "." + k + "." + (
                 m + q + k
             ) + (
                 e
                     ? "_" + e + "_" + Piwik.getAsyncTracker().getSiteId()
                     : ""
             )
         },
         getDaCookieId: function () {
             if (window.navigator.cookieEnabled && document.cookie) 
                 for (var d = document.cookie.split("; "), e = 0; e < d.length; e++) {
                     var m = d[e].split("=");
                     if (-1 < m[0].indexOf("_pk_id." + Piwik.getAsyncTracker().getSiteId() + ".")) 
                         return m[1].split(".")[0]
                     
                 }
             
             return ""
         },
         getGaCookieId: function () {
             if (window.navigator.cookieEnabled && document.cookie) {
                 var d = /(^|;)[ ]*_ga=([^;]*)/.exec(document.cookie);
                 if ((
                     d = d
                         ? d[2]
                         : ""
                 ) && d.match(/.*\.\d+\.(\d+\.\d+)/)) 
                     return RegExp.$1
                 
             }
             return 0
         },
         makeUa: function () {
             for (var d = navigator.userAgent.length, e = 0, m = 0; m < d; m++) 
                 e += navigator.userAgent.charCodeAt(m);
             
             return e
         }
     };
     "object" !== typeof JSON2 && (JSON2 = window.JSON || {});
     (function () {
         function d(d) {
             if ("undefined" != typeof window.addEventListener) {
                 var e = document.readyState;
                 "interactive" == e || "complete" == e || "loaded" == e
                     ? d()
                     : document.addEventListener("DOMContentLoaded", d, !1)
             } else 
                 "undefined" != typeof window.attachEvent && (window.attachEvent("onload", d), d())
             
         }
         function e(d) {
             return 10 > d
                 ? "0" + d
                 : d
         }
         function m(d) {
             N.lastIndex = 0;
             return N.test(d)
                 ? '"' + d.replace(N, function (d) {
                     var e = xa[d];
                     return "string" === typeof e
                         ? e
                         : "\\u" + (
                             "0000" + d.charCodeAt(0).toString(16)
                         ).slice(-4)
                 }) + '"'
                 : '"' + d + '"'
         }
         function q(d, k) {
             var f = F,
                 n = k[d];
             if (n && "object" === typeof n) {
                 var r = Object
                     .prototype
                     .toString
                     .apply(n);
                 n = "[object Date]" === r
                     ? isFinite(n.valueOf())
                         ? n.getUTCFullYear() + "-" + e(n.getUTCMonth() + 1) + "-" + e(n.getUTCDate()) + "T" + e(n.getUTCHours()) + ":" + e(n.getUTCMinutes()) + ":" + e(n.getUTCSeconds()) + "Z"
                         : null
                     : "[object String]" === r || "[object Number]" === r || "[object Boolean]" === r
                         ? n.valueOf()
                         : "[object Array]" !== r && "function" === typeof n.toJSON
                             ? n.toJSON(d)
                             : n
             }
             "function" === typeof H && (n = H.call(k, d, n));
             switch (typeof n) {
                 case "string":
                     return m(n);
                 case "number":
                     return isFinite(n)
                         ? String(n)
                         : "null";
                 case "boolean":
                 case "null":
                     return String(n);
                 case "object":
                     if (! n) 
                         return "null";
                     
                     F += ea;
                     var B = [];
                     if ("[object Array]" === Object
                             .prototype
                             .toString
                             .apply(n)) {
                         r = n.length;
                         for (d = 0; d < r; d += 1) 
                             B[d] = q(d, n) || "null";
                         
                         k = 0 === B.length
                             ? "[]"
                             : F
                                 ? "[\n" + F + B.join(",\n" + F) + "\n" + f + "]"
                                 : "[" + B.join(",") + "]";
                         F = f;
                         return k
                     }
                     if (H && "object" === typeof H) 
                         for (r = H.length, d = 0; d < r; d += 1) {
                             if ("string" === typeof H[d]) {
                                 var L = H[d];
                                 (k = q(L, n)) && B.push(m(L) + (
                                     F
                                         ? ": "
                                         : ":"
                                 ) + k)
                             }
                         }
                      else 
                         for (L in n) 
                             Object
                                 .prototype
                                 .hasOwnProperty
                                 .call(n, L) && (k = q(L, n)) && B.push(m(L) + (
                                     F
                                         ? ": "
                                         : ":"
                                 ) + k);
                         
                      k = 0 === B.length
                         ? "{}"
                         : F
                             ? "{\n" + F + B.join(",\n" + F) + "\n" + f + "}"
                             : "{" + B.join(",") + "}";
                     F = f;
                     return k
             }
         }
         d(DcmAn.addEvent);
         d(DcmAn.addFormEvent);
         var k = "",
             r = location.href,
             f = r.split("?dcmancr=");
         2 == f.length
             ? k = -1 != f[1].indexOf("&")
                 ? f[1].split("&")[0]
                 : f[1]
             : (f = r.split("&dcmancr="), 2 == f.length && (
                 k = -1 != f[1].indexOf("&")
                     ? f[1].split("&")[0]
                     : f[1]
             ));
         0 < k.length && 12E4 > (new Date).getTime() - k.split(".")[1] && (k = k.split("_"), _paq.unshift([
             "appendToTrackingUrl",
             "dcmancr=" + k[0]
         ]));
         "use strict";
         var T = /[\x00\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
             N = /[\\\"\x00-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
             F,
             ea,
             xa = {
                 "\b": "\\b",
                 "\t": "\\t",
                 "\n": "\\n",
                 "\f": "\\f",
                 "\r": "\\r",
                 '"': '\\"',
                 "\\": "\\\\"
             },
             H;
         "function" !== typeof JSON2.stringify && (JSON2.stringify = function (d, e, k) {
             var m;
             ea = F = "";
             if ("number" === typeof k) 
                 for (m = 0; m < k; m += 1) 
                     ea += " ";
                 
              else 
                 "string" === typeof k && (ea = k);
             
             if ((H = e) && "function" !== typeof e && ("object" !== typeof e || "number" !== typeof e.length)) 
                 throw Error("JSON2.stringify");
             
             return q("", {"": d})
         });
         "function" !== typeof JSON2.parse && (JSON2.parse = function (d, e) {
             function k(d, m) {
                 var f,
                     q = d[m];
                 if (q && "object" === typeof q) 
                     for (f in q) 
                         if (Object
                                 .prototype
                                 .hasOwnProperty
                                 .call(q, f)) {
                             var n = k(q, f);
                             void 0 !== n
                                 ? q[f] = n
                                 : delete q[f]
                         }
                     
                 
                 return e.call(d, m, q)
             }
             d = String(d);
             T.lastIndex = 0;
             T.test(d) && (d = d.replace(T, function (d) {
                 return "\\u" + (
                     "0000" + d.charCodeAt(0).toString(16)
                 ).slice(-4)
             }));
             if (/^[\],:{}\s]*$/.test(d
                 .replace(/\\(?:["\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
                 .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")
                 .replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) 
                 return d = eval("(" + d + ")"),
                 "function" === typeof e
                     ? k({
                         "": d
                     }, "")
                     : d;
             
             throw new SyntaxError("JSON2.parse");
         })
     })();
     "object" !== typeof _paq && (_paq =[]);
     "object" !== typeof Piwik && (Piwik = function () {
         function d(a) {
             try {
                 return Ma(a)
             } catch (b) {
                 return unescape(a)
             }
         }
         function e(a) {
             return "undefined" !== typeof a
         }
         function m(a) {
             return "function" === typeof a
         }
         function q(a) {
             return "object" === typeof a
         }
         function k(a) {
             return "string" === typeof a || a instanceof String
         }
         function r() {
             var a;
             for (a = 0; a < arguments.length; a += 1) {
                 var b = arguments[a];
                 var d = b.shift();
                 k(d)
                     ? U[d].apply(U, b)
                     : d.apply(U, b)
             }
         }
         function f(a, b, d, g) {
             if (a.addEventListener) 
                 return a.addEventListener(b, d, g),
                 !0;
             
             if (a.attachEvent) 
                 return a.attachEvent("on" + b, d);
             
             a["on" + b] = d
         }
         function T(a, b) {
             var d = "",
                 g;
             for (g in na) 
                 if (Object
                         .prototype
                         .hasOwnProperty
                         .call(na, g)) {
                     var e = na[g][a];
                     m(e) && (d += e(b))
                 }
             
             return d
         }
         function N() {
             var a;
             if (! oa) 
                 for (oa =! 0, T("load"), a = 0; a < Na.length; a++) 
                     Na[a]();
                 
             
             return !0
         }
         function F(a, b) {
             var d = t.createElement("script");
             d.type = "text/javascript";
             d.src = a;
             d.readyState
                 ? d.onreadystatechange = function () {
                     var a = this.readyState;
                     if ("loaded" === a || "complete" === a) 
                         d.onreadystatechange = null,
                         b()
                     
                 }
                 : d.onload = b;
             t.getElementsByTagName("head")[0].appendChild(d)
         }
         function ea() {
             var a = "";
             try {
                 a = p
                     .top
                     .document
                     .referrer
             } catch (b) {
                 if (p.parent) 
                     try {
                         a = p
                             .parent
                             .document
                             .referrer
                     }
                  catch (x) {
                     a = ""
                 }
             }
             "" === a && (a = t.referrer);
             return a
         }
         function xa(a) {
             return(a = /^([a-z]+):/.exec(a))
                 ? a[1]
                 : null
         }
         function H(a) {
             var b = /^(?:(?:https?|ftp):)\/*(?:[^@]+@)?([^:/#]+)/.exec(a);
             return b
                 ? b[1]
                 : a
         }
         function La(a, b) {
             return(a = (new RegExp("[\\?&#]" + b + "=([^&#]*)")).exec(a))
                 ? Ma(a[1])
                 : ""
         }
         function Wb(a) {
             var b = function (a, b) {
                     return a << b | a >>> 32 - b
                 },
                 d = function (a) {
                     var b = "",
                         d;
                     for (d = 7; 0 <= d; d--) {
                         var e = a >>> 4 * d & 15;
                         b += e.toString(16)
                     }
                     return b
                 },
                 g,
                 e = [],
                 k = 1732584193,
                 m = 4023233417,
                 l = 2562383102,
                 t = 271733878,
                 p = 3285377520,
                 q = [];
             a = Pa(y(a));
             var f = a.length;
             for (g = 0; g < f - 3; g += 4) {
                 var w = a.charCodeAt(g) << 24 | a.charCodeAt(g + 1) << 16 | a.charCodeAt(g + 2) << 8 | a.charCodeAt(g + 3);
                 q.push(w)
             }
             switch (f & 3) {
                 case 0: g = 2147483648;
                     break;
                 case 1: g = a.charCodeAt(f - 1) << 24 | 8388608;
                     break;
                 case 2: g = a.charCodeAt(f - 2) << 24 | a.charCodeAt(f - 1) << 16 | 32768;
                     break;
                 case 3: g = a.charCodeAt(f - 3) << 24 | a.charCodeAt(f - 2) << 16 | a.charCodeAt(f - 1) << 8 | 128
             }
             for (q.push(g); 14 !== (q.length & 15);) 
                 q.push(0);
             
             q.push(f >>> 29);
             q.push(f << 3 & 4294967295);
             for (a = 0; a < q.length; a += 16) {
                 for (g = 0; 16 > g; g++) 
                     e[g] = q[a + g];
                 
                 for (g = 16; 79 >= g; g++) 
                     e[g] = b(e[g - 3] ^ e[g - 8] ^ e[g - 14] ^ e[g - 16], 1);
                 
                 w = k;
                 f = m;
                 var n = l;
                 var r = t;
                 var v = p;
                 for (g = 0; 19 >= g; g++) {
                     var z = b(w, 5) + (f & n |~ f & r) + v + e[g] + 1518500249 & 4294967295;
                     v = r;
                     r = n;
                     n = b(f, 30);
                     f = w;
                     w = z
                 }
                 for (g = 20; 39 >= g; g++) 
                     z = b(w, 5) + (f ^ n ^ r) + v + e[g] + 1859775393 & 4294967295,
                     v = r,
                     r = n,
                     n = b(f, 30),
                     f = w,
                     w = z;
                 
                 for (g = 40; 59 >= g; g++) 
                     z = b(w, 5) + (f & n | f & r | n & r) + v + e[g] + 2400959708 & 4294967295,
                     v = r,
                     r = n,
                     n = b(f, 30),
                     f = w,
                     w = z;
                 
                 for (g = 60; 79 >= g; g++) 
                     z = b(w, 5) + (f ^ n ^ r) + v + e[g] + 3395469782 & 4294967295,
                     v = r,
                     r = n,
                     n = b(f, 30),
                     f = w,
                     w = z;
                 
                 k = k + w & 4294967295;
                 m = m + f & 4294967295;
                 l = l + n & 4294967295;
                 t = t + r & 4294967295;
                 p = p + v & 4294967295
             }
             z = d(k) + d(m) + d(l) + d(t) + d(p);
             return z.toLowerCase()
         }
         function Xb(a, b, d) {
             if ("translate.googleusercontent.com" === a) 
                 "" === d && (d = b),
                 b = La(b, "u"),
                 a = H(b);
              else if ("cc.bingj.com" === a || "webcache.googleusercontent.com" === a || "74.6." === a.slice(0, 5)) 
                 b = t.links[0].href,
                 a = H(b);
             
             return [a, b, d]
         }
         function n(a) {
             var b = a.length;
             "." === a.charAt(-- b) && (a = a.slice(0, b));
             "*." === a.slice(0, 2) && (a = a.slice(1));
             return a
         }
         function Yb(a) {
             a = a && a.text
                 ? a.text
                 : a;
             if (! k(a)) {
                 var b = t.getElementsByTagName("title");
                 b && e(b[0]) && (a = b[0].text)
             }
             return a
         }
         function B(a) {
             return a
                 ? ! e(a.children) && e(a.childNodes) || e(a.children)
                     ? a.children
                     : []
                 : []
         }
         function L(a, b) {
             if (a && a.indexOf) 
                 return a.indexOf(b);
             
             if (! e(a) || null === a || ! a.length) 
                 return -1;
             
             var d = a.length;
             if (0 === d) 
                 return -1;
             
             for (var g = 0; g < d;) {
                 if (a[g] === b) 
                     return g;
                 
                 g++
             }
             return -1
         }
         function kb(a) {
             function b(a, b) {
                 if (p.getComputedStyle) 
                     return t.defaultView.getComputedStyle(a, null)[b];
                 
                 if (a.currentStyle) 
                     return a.currentStyle[b]
                 
             }
             function d(g, x, k, f, m, l, q) {
                 var p = g.parentNode,
                     n;
                 a: {
                     for (n = g.parentNode; n;) {
                         if (n === t) {
                             n = !0;
                             break a
                         }
                         n = n.parentNode
                     }
                     n = !1
                 }
                 if (! n) 
                     return !1;
                 
                 if (9 === p.nodeType) 
                     return !0;
                 
                 if ("0" === b(g, "opacity") || "none" === b(g, "display") || "hidden" === b(g, "visibility")) 
                     return !1;
                 
                 e(x) && e(k) && e(f) && e(m) && e(l) && e(q) || (x = g.offsetTop, m = g.offsetLeft, f = x + g.offsetHeight, k = m + g.offsetWidth, l = g.offsetWidth, q = g.offsetHeight);
                 if (a === g && (0 === q || 0 === l) && "hidden" === b(g, "overflow")) 
                     return !1;
                 
                 if (p) {
                     if ("hidden" === b(p, "overflow") || "scroll" === b(p, "overflow")) 
                         if (m + 1 > p.offsetWidth + p.scrollLeft || m + l - 1 < p.scrollLeft || x + 1 > p.offsetHeight + p.scrollTop || x + q - 1 < p.scrollTop) 
                             return !1;
                         
                     
                     g.offsetParent === p && (m += p.offsetLeft, x += p.offsetTop);
                     return d(p, x, k, f, m, l, q)
                 }
                 return !0
             }
             return a
                 ? d(a)
                 : !1
         }
         function Zb(a, b) {
             if (b) 
                 return b;
             
             "piwik.php" === a.slice(-9) && (a = a.slice(0, a.length - 9));
             return a
         }
         function aa(a) {
             var b = /index\.php\?module=Overlay&action=startOverlaySession&idSite=([0-9]+)&period=([^&]+)&date=([^&]+)$/.exec(t.referrer);
             if (b) {
                 if (b[1] !== String(a)) 
                     return !1;
                 
                 p.name = "Piwik_Overlay###" + b[2] + "###" + b[3]
             }
             a = p.name.split("###");
             return 3 === a.length && "Piwik_Overlay" === a[0]
         }
         function $b(a, b, d) {
             var e = p.name.split("###"),
                 x = e[1],
                 k = e[2],
                 f = Zb(a, b);
             F(f + "plugins/Overlay/client/client.js?v=1", function () {
                 Piwik_Overlay_Client.initialize(f, d, x, k)
             })
         }
         function qa(a, b) {
             function x(c, a, u, b, d, e) {
                 if (! W) {
                     if (u) {
                         var h = new Date;
                         h.setTime(h.getTime() + u)
                     }
                     t.cookie = c + "=" + y(a) + (
                         u
                             ? ";expires=" + h.toGMTString()
                             : ""
                     ) + ";path=" + (
                         b || "/"
                     ) + (
                         d
                             ? ";domain=" + d
                             : ""
                     ) + (
                         e
                             ? ";secure"
                             : ""
                     )
                 }
             }
             function g(c) {
                 return W
                     ? 0
                     : (c =( new RegExp("(^|;)[ ]*" + c + "=([^;]*)")).exec(t.cookie))
                         ? Ma(c[2])
                         : 0
             }
             function r(c) {
                 if (mb) {
                     var a = /#.*/;
                     return c.replace(a, "")
                 }
                 return c
             }
             function F(c) {
                 var a;
                 for (a = 0; a < za.length; a++) {
                     var u = n(za[a].toLowerCase());
                     if (c === u) 
                         return !0;
                     
                     if ("." === u.slice(0, 1)) {
                         if (c === u.slice(1)) 
                             return !0;
                         
                         var b = c.length - u.length;
                         if (0 < b && c.slice(b) === u) 
                             return !0
                         
                     }
                 }
                 return !1
             }
             function B(c, a) {
                 var h = !0;
                 c = D + (
                     0 > D.indexOf("?")
                         ? "?"
                         : "&"
                 ) + c;
                 var b = fa("daReqProb");
                 if (null == b || 0 == (new Date).getTime() % b) 
                     if (
                         null != fa("afterAuthFlg") && (c += "&afterAuthFlg=1"),
                         1 == fa("trackingType")
                             ? null != fa("afterAuthFlg")
                                 ? (
                                     b = w("dcmsend"),
                                     0 === g(b)
                                         ? (c += "&trackingType=1", x(b, 1, 4752E5, "/"))
                                         : h =! 1
                                 )
                                 : h =! 1
                             : 2 == fa("trackingType") && (c += "&trackingType=2"),
                         h
                     ) {
                         if (0 > c.indexOf("&afterAuthFlg=1") && window.navigator.cookieEnabled && document.cookie) 
                             for (h = document.cookie.split("; "), b = 0; b < h.length; b++) {
                                 var d = h[b].split("=");
                                 if ("dcmredcook" === d[0]) {
                                     c += "&afterAuthFlg=1";
                                     break
                                 } else if ("dcmunioncook" === d[0]) {
                                     c += "&afterAuthFlg=1";
                                     break
                                 }
                             }
                          - 1 !== D.indexOf("dcmAn/img")
                             ? (h = document.createElement("img"), h.setAttribute("src", c), h.style.display = "none", document.body.appendChild(h))
                             : (h = document.createElement("iframe"), h.setAttribute("name", "dcmifr"), h.setAttribute("height", "1"), h.setAttribute("width", "1"), h.setAttribute("frameborder", "0"), h.style.display = "none", h.style.visibility = "hidden", document.body.appendChild(h), b = document.createElement("form"), b.setAttribute("action", c), b.setAttribute("method", "post"), b.setAttribute("id", "postform"), b.setAttribute("target", "dcmifr"), document.body.appendChild(b), h.onload = function () {
                                 O = 0;
                                 "function" === typeof a && a()
                             }, b.submit())
                     }
                 
             }
             function N(c, a, u) {
                 console.log("sendXmlHttpRequest");
                 e(u) && null !== u || (u =! 0);
                 try {
                     var h = p.XMLHttpRequest
                         ? new p.XMLHttpRequest
                         : p.ActiveXObject
                             ? new ActiveXObject("Microsoft.XMLHTTP")
                             : null;
                     h.open("POST", D, !0);
                     h.onreadystatechange = function () {
                         4 !== this.readyState || 200 <= this.status && 300 > this.status || ! u
                             ? "function" === typeof a && a()
                             : B(c, a)
                     };
                     h.setRequestHeader("Content-Type", nb);
                     h.send(c)
                 } catch (lb) {
                     u && B(c, a)
                 }
             }
             function U(c) {
                 c = (new Date).getTime() + c;
                 if (! ra || c > ra) 
                     ra = c
                 
             }
             function da(c) {
                 var a = (new Date).getTime();
                 ha && a < ha
                     ? (a = ha - a, setTimeout(c, a), U(a + 50), ha += 50)
                     : (!1 === ha && (ha = a + 800), c())
             }
             function Q(c, a, u) {
                 ! Aa && c && da(function () {
                     "POST" === ob
                         ? N(c, u)
                         : B(c, u);
                     U(a)
                 })
             }
             function ya(c, a) {
                 var h = Aa
                     ? !1
                     : c && c.length;
                 if (h) {
                     var b = '{"requests":["?' + c.join('","?') + '"]}';
                     da(function () {
                         N(b, null, !1);
                         U(a)
                     })
                 }
             }
             function w(c) {
                 return pb + c + "." + C + "." + qb
             }
             function ma() {
                 if (W) 
                     return "0";
                 
                 if (! e(I.cookieEnabled)) {
                     var c = w("testcookie");
                     x(c, "1");
                     return "1" === g(c)
                         ? "1"
                         : "0"
                 }
                 return I.cookieEnabled
                     ? "1"
                     : "0"
             }
             function Qa() {
                 qb = Sa((J || Ta) + (P || "/")).slice(0, 4)
             }
             function Ra() {
                 var c = w("cvar");
                 c = g(c);
                 return c.length && (c = JSON2.parse(c), q(c))
                     ? c
                     : {}
             }
             function z() {
                 Ua = (new Date).getTime()
             }
             function qa() {
                 var c = Math.round((new Date).getTime() / 1E3),
                     a = w("id");
                 return(a = g(a))
                     ? (c = a.split("."), c.unshift("0"), sa.length && (c[1] = sa), c)
                     : c = [
                         "1",
                         sa.length
                             ? sa
                             : "0" === ma()
                                 ? ""
                                 : Sa(
                                     (I.userAgent || "") + (I.platform || "") + JSON2.stringify(S) + (new Date).getTime() + Math.random()
                                 ).slice(0, 16),
                         c,
                         0,
                         c,
                         "",
                         ""
                     ]
             }
             function pa() {
                 var c = qa(),
                     a = c[0],
                     u = c[1],
                     b = c[2]
                         ? c[2]
                         : c[4],
                     d = c[3]
                         ? c[3]
                         : 1,
                     g = c[4],
                     x = "undefined" == c[5] || "" == c[5]
                         ? c[4]
                         : c[5];
                 e(c[6]) || (c[6] = "");
                 return {
                     newVisitor: a,
                     uuid: u,
                     createTs: b,
                     visitCount: d,
                     currentVisitTs: g,
                     lastVisitTs: x,
                     lastEcommerceOrderTs: c[6]
                 }
             }
             function wa() {
                 var c = (new Date).getTime(),
                     a = pa().createTs;
                 return 1E3 * parseInt(a, 10) + Va - c
             }
             function Oa(c) {
                 if (C) {
                     var a = Math.round((new Date).getTime() / 1E3);
                     e(c) || (c = pa());
                     c = -1 == DcmAn.piwikSiteList.indexOf(String(C))
                         ? c.uuid + "." + c.createTs + "."
                         : c.uuid + "." + c.createTs + "." + c.visitCount + "." + a + "." + c.lastVisitTs + "." + c.lastEcommerceOrderTs;
                     x(w("id"), c, wa(), P, J)
                 }
             }
             function ia() {
                 var c = g(w("ref"));
                 if (c.length) 
                     try {
                         if (c = JSON2.parse(c), q(c)) 
                             return c
                         
                     }
                  catch (h) {}
                 return ["", "", 0, ""]
             }
             function rb() {
                 var c = W;
                 W = !1;
                 var a = w("id");
                 x(a, "", -86400, P, J);
                 a = w("ses");
                 x(a, "", -86400, P, J);
                 a = w("cvar");
                 x(a, "", -86400, P, J);
                 a = w("ref");
                 x(a, "", -86400, P, J);
                 W = c
             }
             function sb(c) {
                 if (c && q(c)) {
                     var a = [];
                     for (u in c) 
                         Object
                             .prototype
                             .hasOwnProperty
                             .call(c, u) && a.push(u);
                     
                     var u = {};
                     a.sort();
                     var b = a.length,
                         d;
                     for (d = 0; d < b; d++) 
                         u[a[d]] = c[a[d]];
                     
                     return u
                 }
             }
             function R(c, a, u, b) {
                 function h(c, a) {
                     c = JSON2.stringify(c);
                     return 2 < c.length
                         ? "&" + a + "=" + y(c)
                         : ""
                 }
                 var d = new Date,
                     V = Math.round(d.getTime() / 1E3),
                     k = K;
                 var f = w("ses");
                 var p = w("ref"),
                     l = w("cvar");
                 var q = g(f);
                 var n = ia();
                 var v = Ba || tb;
                 W && rb();
                 if (Aa) 
                     return "";
                 
                 var G = pa();
                 e(b) || (b = "");
                 var z = {};
                 var A = location
                     .search
                     .substring(1)
                     .split("&");
                 for (f = 0; A[f]; f++) {
                     var B = A[f].split("=");
                     z[B[0]] = B[1]
                 }
                 z.dcmancr && (G.uuid = z.dcmancr.split(".")[0]);
                 var D = t.characterSet || t.charset;
                 D && "utf-8" !== D.toLowerCase() || (D = null);
                 B = n[0];
                 var E = n[1];
                 z = n[2];
                 A = n[3];
                 if (! q) {
                     q = Ca / 1E3;
                     if (! G.lastVisitTs || V - G.lastVisitTs > q) 
                         G.visitCount ++,
                         G.lastVisitTs = G.currentVisitTs;
                     
                     if (! Wa || ! B.length) {
                         for (f in Da) 
                             if (Object
                                     .prototype
                                     .hasOwnProperty
                                     .call(Da, f) && (B = La(v, Da[f]), B.length)) 
                                 break;
                             
                         
                         for (f in Ea) 
                             if (Object
                                     .prototype
                                     .hasOwnProperty
                                     .call(Ea, f) && (E = La(v, Ea[f]), E.length)) 
                                 break
                             
                         
                     }
                     q = H(ba);
                     n = A.length
                         ? H(A)
                         : "";
                     ! q.length || F(q) || Wa && n.length && ! F(n) || (A = ba);
                     if (A.length || B.length) 
                         z = V,
                         n = [
                             B, E, z, r(A.slice(0, 1024))
                         ],
                         -1 < DcmAn.piwikSiteList.indexOf(String(C)) && x(p, JSON2.stringify(n), ub, P, J)
                     
                 }
                 V = !1;
                 1 === fa("trackingType") && (V =! 0);
                 if (V) 
                     c = "idsite=" + C + "&url=" + y(r(v)) + (
                         ba.length
                             ? "&urlref=" + y(r(ba))
                             : ""
                     ) + "&_id=" + G.uuid;
                  else {
                     c += "&idsite=" + C + "&rec=1&r=" + String(Math.random()).slice(2, 8) + "&h=" + d.getHours() + "&m=" + d.getMinutes() + "&s=" + d.getSeconds() + "&url=" + y(r(v)) + (
                         ba.length
                             ? "&urlref=" + y(r(ba))
                             : ""
                     ) + (
                         ja && ja.length
                             ? "&uid=" + y(ja)
                             : ""
                     ) + "&_id=" + G.uuid + "&_idts=" + G.createTs + "&_idvc=" + G.visitCount + "&_idn=" + G.newVisitor + (
                         B.length
                             ? "&_rcn=" + y(B)
                             : ""
                     ) + (
                         E.length
                             ? "&_rck=" + y(E)
                             : ""
                     ) + "&_refts=" + z + "&_viewts=" + G.lastVisitTs + (
                         String(G.lastEcommerceOrderTs).length
                             ? "&_ects=" + G.lastEcommerceOrderTs
                             : ""
                     ) + (
                         String(A).length
                             ? "&_ref=" + y(r(A.slice(0, 1024)))
                             : ""
                     ) + (
                         D
                             ? "&cs=" + y(D)
                             : ""
                     ) + "&send_image=0";
                     for (f in S) 
                         Object
                             .prototype
                             .hasOwnProperty
                             .call(S, f) && (c += "&" + f + "=" + S[f]);
                     
                     a
                         ? c += "&data=" + y(JSON2.stringify(a))
                         : X && (c += "&data=" + y(JSON2.stringify(X)));
                     a = sb(ca);
                     d = sb(Xa);
                     c += h(a, "cvar");
                     c += h(d, "e_cvar");
                     if (K) {
                         c += h(K, "_cvar");
                         for (f in k) 
                             Object
                                 .prototype
                                 .hasOwnProperty
                                 .call(k, f) && ("" === K[f][0] || "" === K[f][1]) && delete K[f];
                         
                         vb && x(l, JSON2.stringify(K), Ca, P, J)
                     }
                     wb && (
                         Ya
                             ? c += "&gt_ms=" + Ya
                             : ka && ka.timing && ka.timing.requestStart && ka.timing.responseEnd && (c += "&gt_ms=" + (
                                 ka.timing.responseEnd - ka.timing.requestStart
                             ))
                     )
                 } G.lastEcommerceOrderTs = e(b) && String(b).length
                     ? b
                     : G.lastEcommerceOrderTs;
                 Oa(G);
                 -1 < DcmAn.piwikSiteList.indexOf(String(C)) && x(w("ses"), "*", Ca, P, J);
                 c += T(u);
                 Za.length && (c += "&" + Za);
                 m($a) && (c = $a(c));
                 if (window.navigator.cookieEnabled && document.cookie) 
                     for (u = document.cookie.split("; "), f = 0; f < u.length; f++) 
                         if (b = u[f].split("="), k = b[0].split(".")[1], -1 == DcmAn.piwikSiteList.indexOf(k)) 
                             if (0 === b[0].indexOf("_pk_id.")) 
                                 28 < b[1].length && (k = b[1].substr(0, 28), l = new Date, l.setTime(l.getTime() + 339552E5), t.cookie = b[0] + "=" + k + ";expires=" + l.toGMTString() + ";path=" + (
                                     P || "/"
                                 ) + (
                                     J
                                         ? ";domain=" + J
                                         : ""
                                 ));
                             
                         
                     
                  else if (0 === b[0].indexOf("_pk_ref.") || 0 === b[0].indexOf("_pk_ses.")) 
                     l = new Date,
                     l.setTime(0),
                     t.cookie = b[0] + "= ;expires=" + l.toGMTString() + ";path=" + (
                         P || "/"
                     ) + (
                         J
                             ? ";domain=" + J
                             : ""
                     );
                 
                 return c
             }
             function xb(c, a, u, b, d, g) {
                 var h = "idgoal=0",
                     V = new Date,
                     x = [],
                     f;
                 if (String(c).length) {
                     h += "&ec_id=" + y(c);
                     var k = Math.round(V.getTime() / 1E3)
                 }
                 h += "&revenue=" + a;
                 String(u).length && (h += "&ec_st=" + u);
                 String(b).length && (h += "&ec_tx=" + b);
                 String(d).length && (h += "&ec_sh=" + d);
                 String(g).length && (h += "&ec_dt=" + g);
                 if (E) {
                     for (f in E) 
                         Object
                             .prototype
                             .hasOwnProperty
                             .call(E, f) && (e(E[f][1]) || (E[f][1] = ""), e(E[f][2]) || (E[f][2] = ""), e(E[f][3]) && 0 !== String(E[f][3]).length || (E[f][3] = 0), e(E[f][4]) && 0 !== String(E[f][4]).length || (E[f][4] = 1), x.push(E[f]));
                     
                     h += "&ec_items=" + y(JSON2.stringify(x))
                 }
                 h = R(h, X, "ecommerce", k);
                 Q(h, A)
             }
             function Pa(c, a) {
                 var h = new Date;
                 c = R("action_name=" + y(Yb(c || yb)), a, "log");
                 Q(c, A);
                 ab && ta && ! zb && (zb =! 0, f(t, "click", z), f(t, "mouseup", z), f(t, "mousedown", z), f(t, "mousemove", z), f(t, "mousewheel", z), f(p, "DOMMouseScroll", z), f(p, "scroll", z), f(t, "keypress", z), f(t, "keydown", z), f(t, "keyup", z), f(p, "resize", z), f(p, "focus", z), f(p, "blur", z), Ua = h.getTime(), setTimeout(function lb() {
                     h = new Date;
                     if (Ua + ta > h.getTime()) {
                         if (ab < h.getTime()) {
                             var c = R("ping=1", a, "ping");
                             Q(c, A)
                         }
                         setTimeout(lb, ta)
                     }
                 }, ta))
             }
             function bb(c, a) {
                 var h = "(^| )(piwik[_-]" + a;
                 if (c) 
                     for (a = 0; a < c.length; a++) 
                         h += "|" + c[a];
                     
                 
                 return new RegExp(h + ")( |$)")
             }
             function ua(c) {
                 return D && c && 0 === String(c).indexOf(D)
             }
             function cb(c) {
                 var a = c,
                     u;
                 for (u = a.parentNode; null !== u && e(u) && ! l.isLinkElement(a);) 
                     a = u,
                     u = a.parentNode;
                 
                 c = a;
                 if (l.hasNodeAttribute(c, "href") && e(c.href) && (a = l.getAttributeValueFromNode(c, "href"), ! ua(a))) {
                     a = c.hostname || H(c.href);
                     var b = a.toLowerCase();
                     a = c.href.replace(a, b);
                     if (!/^(javascript|vbscript|jscript|mocha|livescript|ecmascript|mailto):/i.test(a)) {
                         u = c.className;
                         b = F(b);
                         c = l.hasNodeAttribute(c, "download");
                         if (ua(a)) 
                             u = 0;
                          else {
                             var d = bb(Ab, "download"),
                                 g = bb(Bb, "link"),
                                 f = new RegExp("\\.(" + Y.join("|") + ")([?&#]|$)", "i");
                             u = g.test(u)
                                 ? "link"
                                 : c || d.test(u) || f.test(a)
                                     ? "download"
                                     : b
                                         ? 0
                                         : "link"
                         }
                         if (u) 
                             return {type: u, href: a}
                         
                     }
                 }
             }
             function va(c, a, u, b) {
                 if (c = v.buildInteractionRequestParams(c, a, u, b)) 
                     return R(c, null, "contentInteraction")
                 
             }
             function Cb(c, a, b, d, g) {
                 if (e(c)) {
                     if (ua(c)) 
                         return c;
                     
                     var h = v.toAbsoluteUrl(c);
                     h = "redirecturl=" + y(h) + "&";
                     h += va(a, b, d, g || c);
                     c = "&";
                     0 > D.indexOf("?") && (c = "?");
                     return D + c + h
                 }
             }
             function db(c, a) {
                 if (! c || ! a) 
                     return !1;
                 
                 var h = v.findTargetNode(c);
                 if (v.shouldIgnoreInteraction(h)) 
                     return !1;
                 
                 if (c = h = v.findTargetNodeNoDefault(c)) 
                     c = !(h && a && (
                         h.contains
                             ? h.contains(a)
                             : h === a || h.compareDocumentPosition && h.compareDocumentPosition(a) & 16
                     ));
                 
                 return c
                     ? !1
                     : !0
             }
             function Db(c, a, b) {
                 if (c) {
                     var h = v.findParentContentNode(c);
                     if (h && db(h, c) && (c = v.buildContentBlock(h))) 
                         return ! c.target && b && (c.target = b),
                         v.buildInteractionRequestParams(a, c.name, c.piece, c.target)
                     
                 }
             }
             function Eb(c) {
                 if (! Z || ! Z.length) 
                     return !1;
                 
                 var a,
                     b;
                 for (a = 0; a < Z.length; a++) 
                     if ((b = Z[a]) && b.name === c.name && b.piece === c.piece && b.target === c.target) 
                         return !0;
                     
                 
                 return !1
             }
             function eb(c) {
                 if (! c) 
                     return !1;
                 
                 var a = v.findTargetNode(c);
                 if (! a || v.shouldIgnoreInteraction(a)) 
                     return !1;
                 
                 var b = cb(a);
                 if (fb && b && b.type) 
                     return !1;
                 
                 if (l.isLinkElement(a) && l.hasNodeAttributeWithValue(a, "href")) {
                     b = String(l.getAttributeValueFromNode(a, "href"));
                     if (0 === b.indexOf("#")) 
                         return !1;
                     
                     if (ua(b)) 
                         return !0;
                     
                     if (! v.isUrlToCurrentDomain(b)) 
                         return !1;
                     
                     var d = v.buildContentBlock(c);
                     if (! d) 
                         return;
                     
                     c = d.name;
                     var e = d.piece;
                     d = d.target;
                     if (! l.hasNodeAttributeWithValue(a, v.CONTENT_TARGET_ATTR) || a.wasContentTargetAttrReplaced) 
                         a.wasContentTargetAttrReplaced = !0,
                         d = v.toAbsoluteUrl(b),
                         l.setAnyAttribute(a, v.CONTENT_TARGET_ATTR, d);
                     
                     b = Cb(b, "click", c, e, d);
                     v.setHrefAttribute(a, b);
                     return !0
                 }
                 return !1
             }
             function Fb(c) {
                 return function (a) {
                     if (c) {
                         var h = v.findParentContentNode(c),
                             b;
                         a && (b = a.target || a.srcElement);
                         b || (b = c);
                         if (db(h, b)) {
                             U(A);
                             l.isLinkElement(c) && l.hasNodeAttributeWithValue(c, "href") && l.hasNodeAttributeWithValue(c, v.CONTENT_TARGET_ATTR) && (a = l.getAttributeValueFromNode(c, "href"), ! ua(a) && c.wasContentTargetAttrReplaced && l.setAnyAttribute(c, v.CONTENT_TARGET_ATTR, ""));
                             a = cb(c);
                             if (Fa && a && a.type) 
                                 return a.type;
                             
                             if (eb(h)) 
                                 return "href";
                             
                             if (h = v.buildContentBlock(h)) 
                                 return h = va("click", h.name, h.piece, h.target),
                                 Q(h, A),
                                 h
                             
                         }
                     }
                 }
             }
             function Gb(c) {
                 if (c && c.length) {
                     var a,
                         b;
                     for (a = 0; a < c.length; a++) 
                         (b = v.findTargetNode(c[a])) && ! b.contentInteractionTrackingSetupDone && (b.contentInteractionTrackingSetupDone =! 0, f(b, "click", Fb(b)))
                     
                 }
             }
             function Hb(c, a) {
                 if (! c || ! c.length) 
                     return [];
                 
                 var h;
                 for (h = 0; h < c.length; h++) 
                     Eb(c[h])
                         ? (c.splice(h, 1), h --)
                         : Z.push(c[h]);
                 
                 if (! c || ! c.length) 
                     return [];
                 
                 if (a && a.length) 
                     for (h = 0; h < a.length; h++) 
                         eb(a[h]);
                     
                 
                 Gb(a);
                 var b = [];
                 for (h = 0; h < c.length; h++) 
                     a = R(v.buildImpressionRequestParams(c[h].name, c[h].piece, c[h].target), void 0, "contentImpressions"),
                     b.push(a);
                 
                 return b
             }
             function Ga(c) {
                 var a = v.collectContent(c);
                 return Hb(a, c)
             }
             function gb(c) {
                 if (! c || ! c.length) 
                     return [];
                 
                 var a;
                 for (a = 0; a < c.length; a++) 
                     v.isNodeVisible(c[a]) || (c.splice(a, 1), a --);
                 
                 return c && c.length
                     ? Ga(c)
                     : []
             }
             function Ib(c, a, b) {
                 c = v.buildImpressionRequestParams(c, a, b);
                 return R(c, null, "contentImpression")
             }
             function Jb(c, a) {
                 if (c && (c = v.findParentContentNode(c), c = v.buildContentBlock(c))) 
                     return a || (a = "Unknown"),
                     va(a, c.name, c.piece, c.target)
                 
             }
             function Kb(c, a, b, d, g) {
                 if (0 === String(c).length || 0 === String(a).length) 
                     return !1;
                 
                 c = "e_c=" + y(c) + "&e_a=" + y(a) + (
                     e(b)
                         ? "&e_n=" + y(b)
                         : ""
                 ) + (
                     e(d)
                         ? "&e_v=" + y(d)
                         : ""
                 );
                 g = R(c, g, "event");
                 Q(g, A)
             }
             function Lb(c, a, b, d, e) {
                 a = a + "=" + y(r(c));
                 (c = Db(e, "click", c)) && (a += "&" + c);
                 b = R(a, b, "link");
                 Q(
                     b,
                     d
                         ? 0
                         : A,
                     d
                 )
             }
             function Mb(c, a) {
                 return "" !== c
                     ? c + a.charAt(0).toUpperCase() + a.slice(1)
                     : a
             }
             function M(c) {
                 var a,
                     b,
                     d = ["", "webkit", "ms", "moz"];
                 if (! Nb) 
                     for (b = 0; b < d.length; b++) {
                         var e = d[b];
                         if (Object
                                 .prototype
                                 .hasOwnProperty
                                 .call(t, Mb(e, "hidden"))) {
                             "prerender" === t[Mb(e, "visibilityState")] && (a =! 0);
                             break
                         }
                     }
                 
                 a
                     ? f(t, e + "visibilitychange", function ac() {
                         t.removeEventListener(e + "visibilitychange", ac, !1);
                         c()
                     })
                     : c()
             }
             function Ha(c) {
                 "complete" === t.readyState
                     ? c()
                     : p.addEventListener
                         ? p.addEventListener("load", c)
                         : p.attachEvent && p.attachEvent("onLoad", c)
             }
             function hb(c) {
                 (
                     t.attachEvent
                         ? "complete" === t.readyState
                         : "loading" !== t.readyState
                 )
                     ? c()
                     : t.addEventListener
                         ? t.addEventListener("DOMContentLoaded", c)
                         : t.attachEvent && t.attachEvent("onreadystatechange", c)
             }
             function Ob(c) {
                 var a = cb(c);
                 a && a.type && (a.href = d(a.href), Lb(a.href, a.type, void 0, null, c))
             }
             function ib(a) {
                 a = a || p.event;
                 var c = a.which || a.button;
                 var b = a.target || a.srcElement;
                 "click" === a.type
                     ? b && Ob(b)
                     : "mousedown" === a.type
                         ? 1 !== c && 2 !== c || ! b
                             ? Ia = Ja = null
                             : (Ia = c, Ja = b)
                         : "mouseup" === a.type && (c === Ia && b === Ja && Ob(b), Ia = Ja = null)
             }
             function Pb(a, b) {
                 b
                     ? (f(a, "mouseup", ib, !1), f(a, "mousedown", ib, !1))
                     : f(a, "click", ib, !1)
             }
             function Qb(a) {
                 if (! Fa) {
                     Fa = !0;
                     var c,
                         b = bb(Rb, "ignore"),
                         d = t.links;
                     if (d) 
                         for (c = 0; c < d.length; c++) 
                             b.test(d[c].className) || Pb(d[c], a)
                         
                     
                 }
             }
             function Sb(a, b, d) {
                 function c() {
                     h = !0
                 }
                 if (la) 
                     return !0;
                 
                 la = !0;
                 var h = !1,
                     u,
                     e;
                 Ha(function () {
                     function g(a) {
                         setTimeout(function () {
                             la && (h =! 1, d.trackVisibleContentImpressions(), g(a))
                         }, a)
                     }
                     function f(a) {
                         setTimeout(function () {
                             la && (h && (h =! 1, d.trackVisibleContentImpressions()), f(a))
                         }, a)
                     }
                     if (a) {
                         u = ["scroll", "resize"];
                         for (e = 0; e < u.length; e++) 
                             t.addEventListener
                                 ? t.addEventListener(u[e], c)
                                 : p.attachEvent("on" + u[e], c);
                         
                         f(100)
                     }
                     b && 0 < b && (b = parseInt(b, 10), g(b))
                 })
             }
             function fa(a) {
                 if ("undefined" != typeof _paq && null != _paq && 0 < _paq.length) {
                     var c = null;
                     _paq.forEach(function (b) {
                         b[0] === a && (
                             c = 2 == b.length
                                 ? b[1]
                                 : b[0]
                         )
                     });
                     return c
                 }
                 return null
             }
             var Ka = {},
                 jb = Xb(t.domain, p.location.href, ea()),
                 Ta = n(jb[0]),
                 tb = d(jb[1]),
                 ba = d(jb[2]),
                 Tb = !1,
                 ob = "GET",
                 nb = "application/x-www-form-urlencoded; charset=UTF-8",
                 D = a || "",
                 Ub = "",
                 Za = "",
                 C = b || "",
                 ja = "",
                 sa = "",
                 Ba,
                 yb = t.title,
                 Y = "7z aac apk arc arj asf asx avi azw3 bin csv deb dmg doc docx epub exe flv gif gz gzip hqx ibooks jar jpg jpeg js mobi mp2 mp3 mp4 mpg mpeg mov movie msi msp odb odf odg ods odt ogg ogv pdf phps png ppt pptx qt qtm ra ram rar rpm sea sit tar tbz tbz2 bz bz2 tgz torrent txt wav wma wmv wpd xls xlsx xml z zip".split(" "),
                 za = [Ta],
                 Rb = [],
                 Ab = [],
                 Bb = [],
                 A = 500,
                 ab,
                 ta,
                 mb,
                 X,
                 Da = [
                     "pk_campaign",
                     "piwik_campaign",
                     "utm_campaign",
                     "utm_source",
                     "utm_medium"
                 ],
                 Ea = [
                     "pk_kwd", "piwik_kwd", "utm_term"
                 ],
                 pb = "_pk_",
                 J,
                 P,
                 W = !1,
                 Aa,
                 Nb,
                 Wa,
                 Va = 339552E5,
                 Ca = 18E5,
                 ub = 15768E6,
                 wb = !0,
                 Ya = 0,
                 vb = !1,
                 K = !1,
                 $a,
                 ca = {},
                 Xa = {},
                 E = {},
                 S = {},
                 Z = [],
                 la = !1,
                 ha = !1,
                 Fa = !1,
                 fb = !1,
                 zb = !1,
                 Ua,
                 Ia,
                 Ja,
                 Sa = Wb,
                 qb;
             (function () {
                 var a,
                     b = {
                         pdf: "application/pdf",
                         qt: "video/quicktime",
                         realp: "audio/x-pn-realaudio-plugin",
                         wma: "application/x-mplayer2",
                         dir: "application/x-director",
                         fla: "application/x-shockwave-flash",
                         java: "application/x-java-vm",
                         gears: "application/x-googlegears",
                         ag: "application/x-silverlight"
                     },
                     d = /Mac OS X.*Safari\//.test(I.userAgent)
                         ? p.devicePixelRatio || 1
                         : 1;
                 if (!/MSIE/.test(I.userAgent)) {
                     if (I.mimeTypes && I.mimeTypes.length) 
                         for (a in b) 
                             if (Object
                                     .prototype
                                     .hasOwnProperty
                                     .call(b, a)) {
                                 var g = I.mimeTypes[b[a]];
                                 S[a] = g && g.enabledPlugin
                                     ? "1"
                                     : "0"
                             }
                         
                     
                     "unknown" !== typeof navigator.javaEnabled && e(I.javaEnabled) && I.javaEnabled() && (S.java = "1");
                     m(p.GearsFactory) && (S.gears = "1");
                     S.cookie = ma()
                 }
                 S.res = Vb.width * d + "x" + Vb.height * d
             })();
             Qa();
             Oa();
             T("run", function (a, b) {
                 var c = null;
                 if (k(a) && ! e(Ka[a]) && b) {
                     if (q(b)) 
                         c = b;
                      else if (k(b)) 
                         try {
                             eval("hookObj =" + b)
                         }
                      catch (V) {}Ka[a] = c
                 }
                 return c
             });
             return {
                 hook: Ka,
                 getHook: function (a) {
                     return Ka[a]
                 },
                 getQuery: function () {
                     return l
                 },
                 getContent: function () {
                     return v
                 },
                 buildContentImpressionRequest: Ib,
                 buildContentInteractionRequest: va,
                 buildContentInteractionRequestNode: Jb,
                 buildContentInteractionTrackingRedirectUrl: Cb,
                 getContentImpressionsRequestsFromNodes: Ga,
                 getCurrentlyVisibleContentImpressionsRequestsIfNotTrackedYet: gb,
                 trackCallbackOnLoad: Ha,
                 trackCallbackOnReady: hb,
                 buildContentImpressionsRequests: Hb,
                 wasContentImpressionAlreadyTracked: Eb,
                 appendContentInteractionToRequestIfPossible: Db,
                 setupInteractionsTracking: Gb,
                 trackContentImpressionClickInteraction: Fb,
                 internalIsNodeVisible: kb,
                 isNodeAuthorizedToTriggerInteraction: db,
                 replaceHrefIfInternalLink: eb,
                 getConfigDownloadExtensions: function () {
                     return Y
                 },
                 enableTrackOnlyVisibleContent: function (a, b) {
                     return Sb(a, b, this)
                 },
                 clearTrackedContentImpressions: function () {
                     Z = []
                 },
                 getTrackedContentImpressions: function () {
                     return Z
                 },
                 clearEnableTrackOnlyVisibleContent: function () {
                     la = !1
                 },
                 disableLinkTracking: function () {
                     fb = Fa = !1
                 },
                 getConfigVisitorCookieTimeout: function () {
                     return Va
                 },
                 getRemainingVisitorCookieTimeout: wa,
                 afterAuthFlg: function (a) {
                     if (1 === a && window.navigator.cookieEnabled) {
                         a = 0;
                         if (document.cookie) 
                             for (var c = document.cookie.split("; "), b = 0; b < c.length; b++) 
                                 if ("dcmunioncook" === c[b].split("=")[0]) {
                                     a = 1;
                                     break
                                 }
                             
                         
                         0 === a && (a =( new Date).getTime(), a =( new Date(a + 36E5)).toGMTString(), a = "dcmunioncook=" + escape(1) + "; expires=" + a + "; path=/", document.cookie = a)
                     }
                 },
                 trackingType: function (a) {
                     if ((1 == a || 2 == a) && "function" === typeof dcmganCallback) {
                         a = dcmganCallback;
                         var c = {};
                         c.uid = pa().uuid;
                         a(c)
                     }
                 },
                 daReqProb: function (a) {},
                 gaCallbackTimeout: function (a) {
                     clearTimeout(a)
                 },
                 getVisitorId: function () {
                     return pa().uuid
                 },
                 getVisitorInfo: function () {
                     return qa()
                 },
                 getAttributionInfo: function () {
                     return ia()
                 },
                 getAttributionCampaignName: function () {
                     return ia()[0]
                 },
                 getAttributionCampaignKeyword: function () {
                     return ia()[1]
                 },
                 getAttributionReferrerTimestamp: function () {
                     return ia()[2]
                 },
                 getAttributionReferrerUrl: function () {
                     return ia()[3]
                 },
                 setTrackerUrl: function (a) {
                     D = a
                 },
                 getTrackerUrl: function () {
                     return D
                 },
                 getSiteId: function () {
                     return C
                 },
                 setSiteId: function (a) {
                     C = a;
                     Oa()
                 },
                 setUserId: function (a) {
                     e(a) && a.length && (ja = a, sa = Sa(ja).substr(0, 16))
                 },
                 getUserId: function () {
                     return ja
                 },
                 setCustomData: function (a, b) {
                     q(a)
                         ? X = a
                         : (X || (X =
                             {}), X[a] = b)
                 },
                 getCustomData: function () {
                     return X
                 },
                 setCustomRequestProcessing: function (a) {
                     $a = a
                 },
                 appendToTrackingUrl: function (a) {
                     Za = a
                 },
                 getRequest: function (a) {
                     return R(a)
                 },
                 addPlugin: function (a, b) {
                     na[a] = b
                 },
                 setCustomVariable: function (a, b, d, g) {
                     e(g) || (g = "visit");
                     e(b) && (e(d) || (d = ""), 0 < a && (
                         b = k(b)
                             ? b
                             : String(b),
                         d = k(d)
                             ? d
                             : String(d),
                         b =[
                             b.slice(0, 200),
                             d.slice(0, 200)
                         ],
                         "visit" === g || 2 === g
                             ? (!1 === K && (K = Ra()), K[a] = b)
                             : "page" === g || 3 === g
                                 ? ca[a] = b
                                 : "event" === g && (Xa[a] = b)
                     ))
                 },
                 getCustomVariable: function (a, b) {
                     e(b) || (b = "visit");
                     if ("page" === b || 3 === b) 
                         var c = ca[a];
                      else if ("event" === b) 
                         c = Xa[a];
                      else if ("visit" === b || 2 === b) 
                         !1 === K && (K = Ra()),
                         c = K[a];
                     
                     return ! e(c) || c && "" === c[0]
                         ? !1
                         : c
                 },
                 deleteCustomVariable: function (a, b) {
                     this.getCustomVariable(a, b) && this.setCustomVariable(a, "", "", b)
                 },
                 storeCustomVariablesInCookie: function () {
                     vb = !0
                 },
                 setLinkTrackingTimer: function (a) {
                     A = a
                 },
                 setDownloadExtensions: function (a) {
                     k(a) && (a = a.split("|"));
                     Y = a
                 },
                 addDownloadExtensions: function (a) {
                     var c;
                     k(a) && (a = a.split("|"));
                     for (c = 0; c < a.length; c++) 
                         Y.push(a[c])
                     
                 },
                 removeDownloadExtensions: function (a) {
                     var c,
                         b = [];
                     k(a) && (a = a.split("|"));
                     for (c = 0; c < Y.length; c++) 
                         -1 === L(a, Y[c]) && b.push(Y[c]);
                     
                     Y = b
                 },
                 setDomains: function (a) {
                     za = k(a)
                         ? [a]
                         : a;
                     za.push(Ta)
                 },
                 setIgnoreClasses: function (a) {
                     Rb = k(a)
                         ? [a]
                         : a
                 },
                 setRequestMethod: function (a) {
                     ob = a || "GET"
                 },
                 setRequestContentType: function (a) {
                     nb = a || "application/x-www-form-urlencoded; charset=UTF-8"
                 },
                 setReferrerUrl: function (a) {
                     ba = a
                 },
                 setCustomUrl: function (a) {
                     var c = tb;
                     if (xa(a)) 
                         Ba = a;
                      else if ("/" === a.slice(0, 1)) 
                         Ba = xa(c) + "://" + H(c) + a;
                      else {
                         c = r(c);
                         var b = c.indexOf("?");
                         0 <= b && (c = c.slice(0, b));
                         b = c.lastIndexOf("/");
                         b !== c.length - 1 && (c = c.slice(0, b + 1));
                         Ba = c + a
                     }
                 },
                 setDocumentTitle: function (a) {
                     yb = a
                 },
                 setAPIUrl: function (a) {
                     Ub = a
                 },
                 setDownloadClasses: function (a) {
                     Ab = k(a)
                         ? [a]
                         : a
                 },
                 setLinkClasses: function (a) {
                     Bb = k(a)
                         ? [a]
                         : a
                 },
                 setCampaignNameKey: function (a) {
                     Da = k(a)
                         ? [a]
                         : a
                 },
                 setCampaignKeywordKey: function (a) {
                     Ea = k(a)
                         ? [a]
                         : a
                 },
                 discardHashTag: function (a) {
                     mb = a
                 },
                 setCookieNamePrefix: function (a) {
                     pb = a;
                     K = Ra()
                 },
                 setCookieDomain: function (a) {
                     a = n(a);
                     x("test", "testvalue", 1E4, null, a);
                     if ("testvalue" === g("test")) {
                         x("test", "", -86400, null, a);
                         var c = !0
                     } else 
                         c = !1;
                     
                     c && (J = a, Qa())
                 },
                 setCookiePath: function (a) {
                     P = a;
                     Qa()
                 },
                 setVisitorCookieTimeout: function (a) {
                     Va = 1E3 * a
                 },
                 setSessionCookieTimeout: function (a) {
                     Ca = 1E3 * a
                 },
                 setReferralCookieTimeout: function (a) {
                     ub = 1E3 * a
                 },
                 setConversionAttributionFirstReferrer: function (a) {
                     Wa = a
                 },
                 disableCookies: function () {
                     W = !0;
                     S.cookie = "0"
                 },
                 deleteCookies: function () {
                     rb()
                 },
                 setDoNotTrack: function (a) {
                     var c = I.doNotTrack || I.msDoNotTrack;
                     (Aa = a && ("yes" === c || "1" === c)) && this.disableCookies()
                 },
                 addListener: function (a, b) {
                     Pb(a, b)
                 },
                 enableLinkTracking: function (a) {
                     fb = !0;
                     oa
                         ? Qb(a)
                         : Na.push(function () {
                             Qb(a)
                         })
                 },
                 enableJSErrorTracking: function () {
                     if (! Tb) {
                         Tb = !0;
                         var a = p.onerror;
                         p.onerror = function (c, b, d, e, g) {
                             M(function () {
                                 var a = b + ":" + d;
                                 e && (a += ":" + e);
                                 Kb("JavaScript Errors", a, c)
                             });
                             return a
                                 ? a(c, b, d, e, g)
                                 : !1
                         }
                     }
                 },
                 disablePerformanceTracking: function () {
                     wb = !1
                 },
                 setGenerationTimeMs: function (a) {
                     Ya = parseInt(a, 10)
                 },
                 setHeartBeatTimer: function (a, b) {
                     ab = (new Date).getTime() + 1E3 * a;
                     ta = 1E3 * b
                 },
                 killFrame: function () {
                     p.location !== p.top.location && (p.top.location = p.location)
                 },
                 redirectFile: function (a) {
                     "file:" === p.location.protocol && (p.location = a)
                 },
                 setCountPreRendered: function (a) {
                     Nb = a
                 },
                 trackGoal: function (a, b, d) {
                     M(function () {
                         var c = R("idgoal=" + a + (
                             b
                                 ? "&revenue=" + b
                                 : ""
                         ), d, "goal");
                         Q(c, A)
                     })
                 },
                 trackLink: function (a, b, d, e) {
                     M(function () {
                         Lb(a, b, d, e)
                     })
                 },
                 trackPageView: function (a, b) {
                     Z = [];
                     aa(C)
                         ? M(function () {
                             $b(D, Ub, C)
                         })
                         : M(function () {
                             Pa(a, b)
                         })
                 },
                 trackAllContentImpressions: function () {
                     aa(C) || M(function () {
                         hb(function () {
                             var a = v.findContentNodes();
                             a = Ga(a);
                             ya(a, A)
                         })
                     })
                 },
                 trackVisibleContentImpressions: function (a, b) {
                     aa(C) || (e(a) || (a =! 0), e(b) || (b = 750), Sb(a, b, this), M(function () {
                         Ha(function () {
                             var a = v.findContentNodes();
                             a = gb(a);
                             ya(a, A)
                         })
                     }))
                 },
                 trackContentImpression: function (a, b, d) {
                     ! aa(C) && a && (b = b || "Unknown", M(function () {
                         var c = Ib(a, b, d);
                         Q(c, A)
                     }))
                 },
                 trackContentImpressionsWithinNode: function (a) {
                     ! aa(C) && a && M(function () {
                         la
                             ? Ha(function () {
                                 var c = v.findContentNodesWithinNode(a);
                                 c = gb(c);
                                 ya(c, A)
                             })
                             : hb(function () {
                                 var c = v.findContentNodesWithinNode(a);
                                 c = Ga(c);
                                 ya(c, A)
                             })
                     })
                 },
                 trackContentInteraction: function (a, b, d, e) {
                     ! aa(C) && a && b && (d = d || "Unknown", M(function () {
                         var c = va(a, b, d, e);
                         Q(c, A)
                     }))
                 },
                 trackContentInteractionNode: function (a, b) {
                     ! aa(C) && a && M(function () {
                         var c = Jb(a, b);
                         Q(c, A)
                     })
                 },
                 trackEvent: function (a, b, d, e) {
                     M(function () {
                         Kb(a, b, d, e)
                     })
                 },
                 trackSiteSearch: function (a, b, d) {
                     M(function () {
                         var c = R("search=" + y(a) + (
                             b
                                 ? "&search_cat=" + y(b)
                                 : ""
                         ) + (
                             e(d)
                                 ? "&search_count=" + d
                                 : ""
                         ), void 0, "sitesearch");
                         Q(c, A)
                     })
                 },
                 setEcommerceView: function (a, b, d, g) {
                     e(d) && d.length
                         ? d instanceof Array && (d = JSON2.stringify(d))
                         : d = "";
                     ca[5] = ["_pkc", d];
                     e(g) && String(g).length && (ca[2] =["_pkp", g]);
                     if (e(a) && a.length || e(b) && b.length) 
                         e(a) && a.length && (ca[3] =["_pks", a]),
                         e(b) && b.length || (b = ""),
                         ca[4] = ["_pkn", b]
                     
                 },
                 addEcommerceItem: function (a, b, d, e, g) {
                     a.length && (E[a] =[
                         a,
                         b,
                         d,
                         e,
                         g
                     ])
                 },
                 trackEcommerceOrder: function (a, b, d, g, f, x) {
                     String(a).length && e(b) && xb(a, b, d, g, f, x)
                 },
                 trackEcommerceCartUpdate: function (a) {
                     e(a) && xb("", a, "", "", "", "")
                 },
                 diPiNK: function (a) {
                     if (window.navigator.cookieEnabled && document.cookie) {
                         for (var c = document.cookie.split("; "), b = 0; b < c.length; b++) {
                             var d = c[b].split("=");
                             if (-1 < d[0].indexOf("dcmdipink")) 
                                 return
                             
                         }
                         if (null == a || 0 == (new Date).getTime() % a) {
                             for (b = 0; b < c.length; b++) 
                                 if (d = c[b].split("="), d[0] == w("id")) {
                                     c = document.createElement("img");
                                     c.style.display = "none";
                                     a = "https:" == document.location.protocol
                                         ? "https://"
                                         : "http://";
                                     c.src = a + "sync.im-apps.net/imid/set?cid=6094&tid=did&uid=" + d[1].split(".")[0];
                                     document.body.appendChild(c);
                                     break
                                 }
                             
                             d = document.createElement("iframe");
                             a = "https:" == document.location.protocol
                                 ? "https://"
                                 : "http://";
                             d.src = a + "cf.im-apps.net/imid/beacon.html";
                             d.style.display = "none";
                             document.body.appendChild(d);
                             d = (new Date).getTime();
                             d = (new Date(d + 864E5)).toGMTString();
                             d = "dcmdipink=" + escape(1) + "; expires=" + d + "; path=/";
                             document.cookie = d
                         }
                     }
                 },
                 dcmsyfl: function (a) {
                     if (window.navigator.cookieEnabled && document.cookie) {
                         for (var c = document.cookie.split("; "), b = 0; b < c.length; b++) 
                             if (-1 < c[b].split("=")[0].indexOf("dcmsyfl")) 
                                 return;
                             
                         
                         null == a || 0 >= a || 0 != (new Date).getTime() % a || !(c = g(w("id"))) || (c = c.split(".")[0], a = "/dcm/" + (
                             -1 < D.indexOf("dcm-analytics.com")
                                 ? "t/"
                                 : ""
                         ) + "index.php", c = "?idsite=" + C + "&url=" + (
                             document.location.protocol + "//" + document.domain
                         ) + "&dauid=" + c, b = document.createElement("img"), b.setAttribute("src", "//cs.adingo.jp" + a + c), b.style.display = "none", document.body.appendChild(b), a =( new Date).getTime(), a =( new Date(a + 4752E5)).toGMTString(), a = "dcmsyfl=" + escape(1) + "; expires=" + a + "; path=/", document.cookie = a)
                     }
                 },
                 dcmsydc: function (a) {
                     if (window.navigator.cookieEnabled && document.cookie) {
                         for (var c = document.cookie.split("; "), b = 0; b < c.length; b++) 
                             if (-1 < c[b].split("=")[0].indexOf("dcmsydc")) 
                                 return;
                             
                         
                         null == a || 0 >= a || 0 != (new Date).getTime() % a || !(a = g(w("id"))) || (a = a.split(".")[0], a = "&idsite=" + C + "&url=" + (
                             document.location.protocol + "//" + document.domain
                         ) + "&dauid=" + a, c = document.createElement("img"), c.setAttribute("src", "//cm.g.doubleclick.net/pixel?google_nid=dmc_dmp&google_cm&google_sc" + a), c.style.display = "none", document.body.appendChild(c), a =( new Date).getTime(), a =( new Date(a + 4752E5)).toGMTString(), a = "dcmsydc=" + escape(1) + "; expires=" + a + "; path=/", document.cookie = a)
                     }
                 },
                 dcmsyal: function (a) {
                     if (window.navigator.cookieEnabled && document.cookie) {
                         for (var b = document.cookie.split("; "), c = 0; c < b.length; c++) 
                             if (-1 < b[c].split("=")[0].indexOf("dcmsyal")) 
                                 return;
                             
                         
                         null == a || 0 >= a || 0 != (new Date).getTime() % a || !(a = g(w("id"))) || (a = a.split(".")[0], b = "idsite=" + C, c = "url=" + y(document.location.protocol + "//" + document.domain), a = "?" + b + "&" + c + "&dauid=" + a + "&custom=a", b = document.createElement("img"), b.setAttribute("src", "//www.aolp.jp/ums/00/sync.php" + a), b.style.display = "none", document.body.appendChild(b), a =( new Date).getTime(), a =( new Date(a + 2592E6)).toGMTString(), a = "dcmsyal=" + escape(1) + "; expires=" + a + "; path=/", document.cookie = a)
                     }
                 },
                 dcmsyhk: function (a) {
                     if (window.navigator.cookieEnabled && document.cookie) {
                         for (var b = document.cookie.split("; "), c = 0; c < b.length; c++) 
                             if (-1 < b[c].split("=")[0].indexOf("dcmsyhk")) 
                                 return;
                             
                         
                         null == a || 0 >= a || 0 != (new Date).getTime() % a || !(a = g(w("id"))) || (
                             a = a.split(".")[0],
                             b = -1 < D.indexOf("dcm-analytics.com")
                                 ? "//sy.dcm-analytics.com"
                                 : "//sy.docomo-analytics.com",
                             a = "?oid=207d81ffda0cc019&rdr=" + y(b + "/dcm/sy/hk/?idsite=" + (
                                 C + "&url=" + (
                                     document.location.protocol + "//" + document.domain
                                 ) + "&dauid=" + a + "&uid={AONEID}"
                             )),
                             b = document.createElement("img"),
                             b.setAttribute("src", "//aw.dw.impact-ad.jp/c/u/" + a),
                             b.style.display = "none",
                             document.body.appendChild(b),
                             a =( new Date).getTime(),
                             a =( new Date(a + 2592E6)).toGMTString(),
                             a = "dcmsyhk=" + escape(1) + "; expires=" + a + "; path=/",
                             document.cookie = a
                         )
                     }
                 },
                 dcmsytd: function (a) {
                     for (var b = document.cookie.split("; "), c = 0; c < b.length; c++) 
                         if (-1 < b[c].split("=")[0].indexOf("dcmsytd")) 
                             return;
                         
                     
                     var d = g(w("id"));
                     ! function (a, b) {
                         if (void 0 === b[a]) {
                             b[a] = function () {
                                 b[a].clients.push(this);
                                 this._init = [Array
                                         .prototype
                                         .slice
                                         .call(arguments)]
                             };
                             b[a].clients = [];
                             for (var c = function (a) {
                                 return function () {
                                     return this["_" + a] = this["_" + a] || [],
                                     this["_" + a].push(Array
                                         .prototype
                                         .slice
                                         .call(arguments)),
                                     this
                                 }
                             }, d = "addRecord set trackEvent trackPageview trackClicks ready".split(" "), e = 0; e < d.length; e++) {
                                 var g = d[e];
                                 b[a].prototype[g] = c(g)
                             }
                             c = document.createElement("script");
                             c.type = "text/javascript";
                             c.async = !0;
                             c.src = (
                                 "https:" === document.location.protocol
                                     ? "https:"
                                     : "http:"
                             ) + "//cdn.treasuredata.com/sdk/1.9.2/td.min.js";
                             d = document.getElementsByTagName("script")[0];
                             d.parentNode.insertBefore(c, d)
                         }
                     }("Treasure", this);
                     setTimeout(function () {
                         if ("undefined" !== typeof Treasure) {
                             var b = new Treasure({host: "tokyo.in.treasuredata.com", writeKey: "78/ea63175029cfec22348a9e4205cd2bdffe70e3a8", database: "dasynch"});
                             b.set("$global", "td_global_id", "td_global_id");
                             d && b.set("$global", "cookie_id", d.split(".")[0]);
                             b.trackPageview("dadatasynch", function () {
                                 b.fetchGlobalID(c)
                             });
                             var c = function () {
                                 if (window.navigator.cookieEnabled && document.cookie) {
                                     for (var b = "", c = document.cookie.split("; "), e = 0; e < c.length; e++) {
                                         var g = c[e].split("=");
                                         -1 < g[0].indexOf("_td_global") && "null" !== g[1] && (b = g[1])
                                     }
                                     if (b) {
                                         if (null == a || 0 >= a || 0 != (new Date).getTime() % a) 
                                             return;
                                         
                                         d && (
                                             d = d.split(".")[0],
                                             c = -1 < D.indexOf("dcm-analytics.com")
                                                 ? "//sy.dcm-analytics.com"
                                                 : "//sy.docomo-analytics.com",
                                             b = "?idsite=" + C + "&url=" + (
                                                 document.location.protocol + "//" + document.domain
                                             ) + "&dauid=" + d + "&uid=" + b,
                                             e = document.createElement("img"),
                                             e.setAttribute("src", c + "/dcm/sy/td/" + b),
                                             e.style.display = "none",
                                             document.body.appendChild(e)
                                         )
                                     }
                                     b = (new Date).getTime();
                                     b = (new Date(b + 2592E6)).toGMTString();
                                     b = "dcmsytd=" + escape(1) + "; expires=" + b + "; path=/";
                                     document.cookie = b
                                 }
                             }
                         }
                     }, 500)
                 },
                 dcmsyyh: function (a) {
                     if (window.navigator.cookieEnabled && document.cookie) {
                         for (var b = document.cookie.split("; "), c = 0; c < b.length; c++) 
                             if (-1 < b[c].split("=")[0].indexOf("dcmsyyh")) 
                                 return;
                             
                         
                         null == a || 0 >= a || 0 != (new Date).getTime() % a || !(a = g(w("id"))) || (a = a.split(".")[0], b = "idsite=" + C, c = "url=" + y(document.location.protocol + "//" + document.domain), a = "?" + b + "&" + c + "&dauid=" + a + "&partner_id=NTTD&gdpr=false&euconsent=", b = document.createElement("img"), b.setAttribute("src", "//cms.analytics.yahoo.com/cms" + a), b.style.display = "none", document.body.appendChild(b), a =( new Date).getTime(), a =( new Date(a + 2592E6)).toGMTString(), a = "dcmsyyh=" + escape(1) + "; expires=" + a + "; path=/", document.cookie = a)
                     }
                 },
                 dcmsyde: function (a) {
                     if (window.navigator.cookieEnabled && document.cookie) {
                         for (var b = document.cookie.split("; "), c = 0; c < b.length; c++) 
                             if (-1 < b[c].split("=")[0].indexOf("dcmsyde")) 
                                 return;
                             
                         
                         null == a || 0 >= a || 0 != (new Date).getTime() % a || !(a = g(w("id"))) || (a = a.split(".")[0], b = "idsite=" + C, c = "url=" + y(document.location.protocol + "//" + document.domain), a = "?p_id=docomo&" + b + "&" + c + "&dauid=" + a + "&companyid=11", b = document.createElement("img"), b.setAttribute("src", "//pp.d2-apps.net/v1/redirect" + a), b.style.display = "none", document.body.appendChild(b), a =( new Date).getTime(), a =( new Date(a + 864E5)).toGMTString(), a = "dcmsyde=" + escape(1) + "; expires=" + a + "; path=/", document.cookie = a)
                     }
                 },
                 cvv: function (a) {
                     var b = (
                         -1 < D.indexOf("dcm-analytics.com")
                             ? "//devcv.dcm-analytics.com"
                             : "//cv.docomo-analytics.com"
                     ) + "/dcm/coll/cv/";
                     g(w("id")) && (g(w("id")), a += "&da_id=" + g(w("id")).split(".")[0]);
                     var c = document.createElement("img");
                     c.setAttribute("src", b + (
                         -1 < a.indexOf("?")
                             ? a
                             : "?" + a
                     ));
                     c.style.display = "none";
                     document.body.appendChild(c)
                 },
                 cvc: function (a, b) {
                     var c = (
                             -1 < D.indexOf("dcm-analytics.com")
                                 ? "//devcv.dcm-analytics.com"
                                 : "//cv.docomo-analytics.com"
                         ) + "/dcm/coll/cv/",
                         d = document.getElementById(a);
                     if (d) {
                         g(w("id")) && (g(w("id")), b += "&cookie_id=" + g(w("id")).split(".")[0]);
                         var e = d.href;
                         d.onclick = function (a) {
                             b = b.replace(/&dcm_z=[0-9]{13}/, "");
                             b += "&dcm_z=" + (
                                 new Date
                             ).getTime();
                             var g = new XMLHttpRequest,
                                 f = a.button;
                             a.which || void 0 === f || (
                                 a.which = f & 1
                                     ? 1
                                     : f & 2
                                         ? 3
                                         : f & 4
                                             ? 2
                                             : 0
                             );
                             if (!(0 !== a.button && 1 !== a.which || a.altKey || a.ctrlKey || a.shiftKey || a.metaKey || "_blank" == d.target || "_new" == d.target)) {
                                 a.preventDefault();
                                 g.onreadystatechange = function () {
                                     2 == g.readyState && (null != x && (clearTimeout(x), x = null), window.location.href = e)
                                 };
                                 var x = setTimeout(function () {
                                     window.location.href = e
                                 }, 1E3)
                             }
                             g.open("GET", c + (
                                 -1 < b.indexOf("?")
                                     ? b
                                     : "?" + b
                             ));
                             g.withCredentials = !0;
                             g.send()
                         }
                     }
                 },
                 gaEvent: function (a, b, d) {
                     if (!(0 < searchIntervalCount) && a && b && (
                         d = d
                             ? d
                             : "_ga",
                         window.navigator.cookieEnabled && document.cookie
                     )) {
                         for (var c = 0, e = document.cookie.split("; "), f = 0; f < e.length; f++) 
                             if ("dcmGaEv" === e[f].split("=")[0]) {
                                 c = 1;
                                 break
                             }
                         
                         c || 0 != searchIntervalId || (searchIntervalId = setInterval(function () {
                             a: {
                                 var c = g(w("id")),
                                 e = d;
                                 if (0 == c || 0 == c.split(".").length) 
                                     clearInterval(searchIntervalId);
                                  else {
                                     for (var f = document.cookie.split("; "), x = 0; x < f.length; x++) {
                                         var h = f[x].split("=");
                                         if (h[0] === e && 4 == h[1].split(".").length) {
                                             clearInterval(searchIntervalId);
                                             e = {};
                                             e["dimension" + b] = c.split(".")[0];
                                             e.nonInteraction = 1;
                                             ga("create", a, "auto");
                                             ga("send", "event", e);
                                             c = (new Date).getTime();
                                             c = "dcmGaEv=1; expires=" + (
                                                 new Date(c + 31536E6)
                                             ).toGMTString() + "; path=/";
                                             document.cookie = c;
                                             break a
                                         }
                                     }
                                     4 <= searchIntervalCount
                                         ? (clearInterval(searchIntervalId), searchIntervalCount = 0)
                                         : searchIntervalCount++
                                 }
                             }
                         }, 1E3))
                     }
                 }
             }
         }
         var ra,
             na = {},
             t = document,
             I = navigator,
             Vb = screen,
             p = window,
             ka = p.performance || p.mozPerformance || p.msPerformance || p.webkitPerformance,
             oa = !1,
             Na = [],
             y = p.encodeURIComponent,
             Ma = p.decodeURIComponent,
             Pa = unescape,
             O,
             l = {
                 htmlCollectionToArray: function (a) {
                     var b = [],
                         d;
                     if (! a || ! a.length) 
                         return b;
                     
                     for (d = 0; d < a.length; d++) 
                         b.push(a[d]);
                     
                     return b
                 },
                 find: function (a) {
                     if (!document.querySelectorAll || ! a) 
                         return [];
                     
                     a = document.querySelectorAll(a);
                     return this.htmlCollectionToArray(a)
                 },
                 findMultiple: function (a) {
                     if (! a || ! a.length) 
                         return [];
                     
                     var b,
                         d = [];
                     for (b = 0; b < a.length; b++) {
                         var e = this.find(a[b]);
                         d = d.concat(e)
                     }
                     return d = this.makeNodesUnique(d)
                 },
                 findNodesByTagName: function (a, b) {
                     if (! a || ! b || ! a.getElementsByTagName) 
                         return [];
                     
                     a = a.getElementsByTagName(b);
                     return this.htmlCollectionToArray(a)
                 },
                 makeNodesUnique: function (a) {
                     var b = [].concat(a);
                     a.sort(function (a, d) {
                         if (a === d) 
                             return 0;
                         
                         a = L(b, a);
                         d = L(b, d);
                         return a === d
                             ? 0
                             : a > d
                                 ? -1
                                 : 1
                     });
                     if (1 >= a.length) 
                         return a;
                     
                     var d = 0,
                         e = 0,
                         f = [],
                         k;
                     for (k = a[d++]; k;) 
                         k === a[d] && (e = f.push(d)),
                         k = a[d++] || null;
                     
                     for (; e--;) 
                         a.splice(f[e], 1);
                     
                     return a
                 },
                 getAttributeValueFromNode: function (a, b) {
                     if (this.hasNodeAttribute(a, b)) {
                         if (a && a.getAttribute) 
                             return a.getAttribute(b);
                         
                         if (a && a.attributes && "undefined" !== typeof a.attributes[b]) {
                             if (a.attributes[b].value) 
                                 return a.attributes[b].value;
                             
                             if (a.attributes[b].nodeValue) 
                                 return a.attributes[b].nodeValue;
                             
                             var d = a.attributes;
                             if (d) {
                                 for (a = 0; a < d.length; a++) 
                                     if (d[a].nodeName === b) 
                                         return d[a].nodeValue;
                                     
                                 
                                 return null
                             }
                         }
                     }
                 },
                 hasNodeAttributeWithValue: function (a, b) {
                     return !!this.getAttributeValueFromNode(a, b)
                 },
                 hasNodeAttribute: function (a, b) {
                     return a && a.hasAttribute
                         ? a.hasAttribute(b)
                         : a && a.attributes
                             ? "undefined" !== typeof a.attributes[b]
                             : !1
                 },
                 hasNodeCssClass: function (a, b) {
                     return a && b && a.className && (a = a.className.split(" "), -1 !== L(a, b))
                         ? !0
                         : !1
                 },
                 findNodesHavingAttribute: function (a, b, d) {
                     d || (d =[]);
                     if (! a || ! b) 
                         return d;
                     
                     a = B(a);
                     if (! a || ! a.length) 
                         return d;
                     
                     var e;
                     for (e = 0; e < a.length; e++) {
                         var f = a[e];
                         this.hasNodeAttribute(f, b) && d.push(f);
                         d = this.findNodesHavingAttribute(f, b, d)
                     }
                     return d
                 },
                 findFirstNodeHavingAttribute: function (a, b) {
                     if (a && b) {
                         if (this.hasNodeAttribute(a, b)) 
                             return a;
                         
                         if ((a = this.findNodesHavingAttribute(a, b)) && a.length) 
                             return a[0]
                         
                     }
                 },
                 findFirstNodeHavingAttributeWithValue: function (a, b) {
                     if (a && b) {
                         if (this.hasNodeAttributeWithValue(a, b)) 
                             return a;
                         
                         if ((a = this.findNodesHavingAttribute(a, b)) && a.length) {
                             var d;
                             for (d = 0; d < a.length; d++) 
                                 if (this.getAttributeValueFromNode(a[d], b)) 
                                     return a[d]
                                 
                             
                         }
                     }
                 },
                 findNodesHavingCssClass: function (a, b, d) {
                     d || (d =[]);
                     if (! a || ! b) 
                         return d;
                     
                     if (a.getElementsByClassName) 
                         return b = a.getElementsByClassName(b),
                         this.htmlCollectionToArray(b);
                     
                     a = B(a);
                     if (! a || ! a.length) 
                         return [];
                     
                     var e;
                     for (e = 0; e < a.length; e++) {
                         var f = a[e];
                         this.hasNodeCssClass(f, b) && d.push(f);
                         d = this.findNodesHavingCssClass(f, b, d)
                     }
                     return d
                 },
                 findFirstNodeHavingClass: function (a, b) {
                     if (a && b) {
                         if (this.hasNodeCssClass(a, b)) 
                             return a;
                         
                         if ((a = this.findNodesHavingCssClass(a, b)) && a.length) 
                             return a[0]
                         
                     }
                 },
                 isLinkElement: function (a) {
                     if (! a) 
                         return !1;
                     
                     a = String(a.nodeName).toLowerCase();
                     return -1 !== L([
                         "a", "area"
                     ], a)
                 },
                 setAnyAttribute: function (a, b, d) {
                     a && b && (
                         a.setAttribute
                             ? a.setAttribute(b, d)
                             : a[b] = d
                     )
                 }
             },
             v = {
                 CONTENT_ATTR: "data-track-content",
                 CONTENT_CLASS: "piwikTrackContent",
                 CONTENT_NAME_ATTR: "data-content-name",
                 CONTENT_PIECE_ATTR: "data-content-piece",
                 CONTENT_PIECE_CLASS: "piwikContentPiece",
                 CONTENT_TARGET_ATTR: "data-content-target",
                 CONTENT_TARGET_CLASS: "piwikContentTarget",
                 CONTENT_IGNOREINTERACTION_ATTR: "data-content-ignoreinteraction",
                 CONTENT_IGNOREINTERACTION_CLASS: "piwikContentIgnoreInteraction",
                 location: void 0,
                 findContentNodes: function () {
                     return l.findMultiple([
                         "." + this.CONTENT_CLASS,
                         "[" + this.CONTENT_ATTR + "]"
                     ])
                 },
                 findContentNodesWithinNode: function (a) {
                     if (! a) 
                         return [];
                     
                     var b = l.findNodesHavingCssClass(a, this.CONTENT_CLASS),
                         d = l.findNodesHavingAttribute(a, this.CONTENT_ATTR);
                     if (d && d.length) {
                         var e;
                         for (e = 0; e < d.length; e++) 
                             b.push(d[e])
                         
                     }
                     l.hasNodeAttribute(a, this.CONTENT_ATTR)
                         ? b.push(a)
                         : l.hasNodeCssClass(a, this.CONTENT_CLASS) && b.push(a);
                     return b = l.makeNodesUnique(b)
                 },
                 findParentContentNode: function (a) {
                     if (a) 
                         for (var b = 0; a && a !== t && a.parentNode;) {
                             if (l.hasNodeAttribute(a, this.CONTENT_ATTR) || l.hasNodeCssClass(a, this.CONTENT_CLASS)) 
                                 return a;
                             
                             a = a.parentNode;
                             if (1E3 < b) 
                                 break;
                             
                             b++
                         }
                     
                 },
                 findPieceNode: function (a) {
                     var b;
                     (b = l.findFirstNodeHavingAttribute(a, this.CONTENT_PIECE_ATTR)) || (b = l.findFirstNodeHavingClass(a, this.CONTENT_PIECE_CLASS));
                     return b
                         ? b
                         : a
                 },
                 findTargetNodeNoDefault: function (a) {
                     if (a) {
                         var b = l.findFirstNodeHavingAttributeWithValue(a, this.CONTENT_TARGET_ATTR);
                         if (b || (b = l.findFirstNodeHavingAttribute(a, this.CONTENT_TARGET_ATTR)) || (b = l.findFirstNodeHavingClass(a, this.CONTENT_TARGET_CLASS))) 
                             return b
                         
                     }
                 },
                 findTargetNode: function (a) {
                     var b = this.findTargetNodeNoDefault(a);
                     return b
                         ? b
                         : a
                 },
                 findContentName: function (a) {
                     if (a) {
                         var b = l.findFirstNodeHavingAttributeWithValue(a, this.CONTENT_NAME_ATTR);
                         if (b) 
                             return l.getAttributeValueFromNode(b, this.CONTENT_NAME_ATTR);
                         
                         if (b = this.findContentPiece(a)) 
                             return this.removeDomainIfIsInLink(b);
                         
                         if (l.hasNodeAttributeWithValue(a, "title")) 
                             return l.getAttributeValueFromNode(a, "title");
                         
                         b = this.findPieceNode(a);
                         if (l.hasNodeAttributeWithValue(b, "title")) 
                             return l.getAttributeValueFromNode(b, "title");
                         
                         a = this.findTargetNode(a);
                         if (l.hasNodeAttributeWithValue(a, "title")) 
                             return l.getAttributeValueFromNode(a, "title")
                         
                     }
                 },
                 findContentPiece: function (a) {
                     if (a) {
                         var b = l.findFirstNodeHavingAttributeWithValue(a, this.CONTENT_PIECE_ATTR);
                         if (b) 
                             return l.getAttributeValueFromNode(b, this.CONTENT_PIECE_ATTR);
                         
                         a = this.findPieceNode(a);
                         if (a = this.findMediaUrlInNode(a)) 
                             return this.toAbsoluteUrl(a)
                         
                     }
                 },
                 findContentTarget: function (a) {
                     if (a) {
                         var b = this.findTargetNode(a);
                         if (l.hasNodeAttributeWithValue(b, this.CONTENT_TARGET_ATTR)) 
                             return l.getAttributeValueFromNode(b, this.CONTENT_TARGET_ATTR);
                         
                         if (l.hasNodeAttributeWithValue(b, "href")) 
                             return a = l.getAttributeValueFromNode(b, "href"),
                             this.toAbsoluteUrl(a);
                         
                         a = this.findPieceNode(a);
                         if (l.hasNodeAttributeWithValue(a, "href")) 
                             return a = l.getAttributeValueFromNode(a, "href"),
                             this.toAbsoluteUrl(a)
                         
                     }
                 },
                 isSameDomain: function (a) {
                     if (! a || ! a.indexOf) 
                         return !1;
                     
                     if (0 === a.indexOf(this.getLocation().origin)) 
                         return !0;
                     
                     a = a.indexOf(this.getLocation().host);
                     return 8 >= a && 0 <= a
                         ? !0
                         : !1
                 },
                 removeDomainIfIsInLink: function (a) {
                     a && a.search && -1 !== a.search(/^https?:\/\/[^/]+/) && this.isSameDomain(a) && ((a = a.replace(/^.*\/\/[^/]+/, "")) || (a = "/"));
                     return a
                 },
                 findMediaUrlInNode: function (a) {
                     if (a) {
                         var b = a.nodeName.toLowerCase();
                         if (-1 !== L([
                             "img", "embed", "video", "audio"
                         ], b) && l.findFirstNodeHavingAttributeWithValue(a, "src")) 
                             return a = l.findFirstNodeHavingAttributeWithValue(a, "src"),
                             l.getAttributeValueFromNode(a, "src");
                         
                         if ("object" === b && l.hasNodeAttributeWithValue(a, "data")) 
                             return l.getAttributeValueFromNode(a, "data");
                         
                         if ("object" === b) {
                             if ((b = l.findNodesByTagName(a, "param")) && b.length) {
                                 var d;
                                 for (d = 0; d < b.length; d++) 
                                     if ("movie" === l.getAttributeValueFromNode(b[d], "name") && l.hasNodeAttributeWithValue(b[d], "value")) 
                                         return l.getAttributeValueFromNode(b[d], "value")
                                     
                                 
                             }
                             if ((a = l.findNodesByTagName(a, "embed")) && a.length) 
                                 return this.findMediaUrlInNode(a[0])
                             
                         }
                     }
                 },
                 trim: function (a) {
                     return a && String(a) === a
                         ? a.replace(/^\s+|\s+$/g, "")
                         : a
                 },
                 isOrWasNodeInViewport: function (a) {
                     if (! a || ! a.getBoundingClientRect || 1 !== a.nodeType) 
                         return !0;
                     
                     var b = a.getBoundingClientRect(),
                         d = t.documentElement || {},
                         e = 0 > b.top;
                     e && a.offsetTop && (e = 0 < a.offsetTop + b.height);
                     a = d.clientWidth;
                     p.innerWidth && a > p.innerWidth && (a = p.innerWidth);
                     d = d.clientHeight;
                     p.innerHeight && d > p.innerHeight && (d = p.innerHeight);
                     return(0 < b.bottom || e) && 0 < b.right && b.left < a && (b.top < d || e)
                 },
                 isNodeVisible: function (a) {
                     var b = kb(a);
                     a = this.isOrWasNodeInViewport(a);
                     return b && a
                 },
                 buildInteractionRequestParams: function (a, b, d, e) {
                     var f = "";
                     a && (f += "c_i=" + y(a));
                     b && (f && (f += "&"), f += "c_n=" + y(b));
                     d && (f && (f += "&"), f += "c_p=" + y(d));
                     e && (f && (f += "&"), f += "c_t=" + y(e));
                     return f
                 },
                 buildImpressionRequestParams: function (a, b, d) {
                     a = "c_n=" + y(a) + "&c_p=" + y(b);
                     d && (a += "&c_t=" + y(d));
                     return a
                 },
                 buildContentBlock: function (a) {
                     if (a) {
                         var b = this.findContentName(a),
                             d = this.findContentPiece(a);
                         a = this.findContentTarget(a);
                         b = this.trim(b);
                         d = this.trim(d);
                         a = this.trim(a);
                         return {
                             name: b || "Unknown",
                             piece: d || "Unknown",
                             target: a || ""
                         }
                     }
                 },
                 collectContent: function (a) {
                     if (! a || ! a.length) 
                         return [];
                     
                     var b = [],
                         d;
                     for (d = 0; d < a.length; d++) {
                         var f = this.buildContentBlock(a[d]);
                         e(f) && b.push(f)
                     }
                     return b
                 },
                 setLocation: function (a) {
                     this.location = a
                 },
                 getLocation: function () {
                     var a = this.location || p.location;
                     a.origin || (a.origin = a.protocol + "//" + a.hostname + (
                         a.port
                             ? ":" + a.port
                             : ""
                     ));
                     return a
                 },
                 toAbsoluteUrl: function (a) {
                     return a && String(a) === a || "" === a
                         ? "" === a
                             ? this.getLocation().href
                             : -1 !== a.search(/^\/\//)
                                 ? this.getLocation().protocol + a
                                 : -1 !== a.search(/:\/\//)
                                     ? a
                                     : 0 === a.indexOf("#") || 0 === a.indexOf("?")
                                         ? this.getLocation().origin + this.getLocation().pathname + a
                                         : 0 === a.search("^[a-zA-Z]{2,11}:")
                                             ? a
                                             : -1 !== a.search(/^\//)
                                                 ? this.getLocation().origin + a
                                                 : this.getLocation().origin + this
                                                     .getLocation()
                                                     .pathname
                                                     .match(/(.*\/)/)[0] + a
                         : a
                 },
                 isUrlToCurrentDomain: function (a) {
                     a = this.toAbsoluteUrl(a);
                     if (! a) 
                         return !1;
                     
                     var b = this.getLocation().origin;
                     return b === a
                         ? !0
                         : 0 === String(a).indexOf(b)
                             ? ":" === String(a).substr(b.length, 1)
                                 ? !1
                                 : !0
                             : !1
                 },
                 setHrefAttribute: function (a, b) {
                     a && b && l.setAnyAttribute(a, "href", b)
                 },
                 shouldIgnoreInteraction: function (a) {
                     var b = l.hasNodeAttribute(a, this.CONTENT_IGNOREINTERACTION_ATTR);
                     a = l.hasNodeCssClass(a, this.CONTENT_IGNOREINTERACTION_CLASS);
                     return b || a
                 }
             };
         f(p, "beforeunload", function () {
             T("unload");
             if (ra) {
                 do 
                     var a = new Date;
                  while (a.getTimeAlias() < ra)
             }
         }, !1);
         (function () {
             var a;
             t.addEventListener
                 ? f(t, "DOMContentLoaded", function x() {
                     t.removeEventListener("DOMContentLoaded", x, !1);
                     N()
                 })
                 : t.attachEvent && (t.attachEvent("onreadystatechange", function x() {
                     "complete" === t.readyState && (t.detachEvent("onreadystatechange", x), N())
                 }), t.documentElement.doScroll && p === p.top && function g() {
                     if (! oa) {
                         try {
                             t.documentElement.doScroll("left")
                         } catch (G) {
                             setTimeout(g, 0);
                             return
                         }
                         N()
                     }
                 }());
             /WebKit/.test(I.userAgent) && (a = setInterval(function () {
                 if (oa || /loaded|complete/.test(t.readyState)) 
                     clearInterval(a),
                     N()
                 
             }, 10));
             f(p, "load", N, !1)
         })();
         Date.prototype.getTimeAlias = Date.prototype.getTime;
         var U = new qa;
         var ma = {
             setTrackerUrl: 1,
             setAPIUrl: 1,
             setUserId: 1,
             setSiteId: 1,
             disableCookies: 1,
             enableLinkTracking: 1
         };
         for (O = 0; O < _paq.length; O++) {
             var da = _paq[O][0];
             ma[da] && (r(_paq[O]), delete _paq[O], 1 < ma[da] && void 0 !== console && console && console.error && console.error("The method " + da + ' is registered more than once in "_paq" variable. Only the last call has an effect. Please have a look at the multiple Piwik trackers documentation: http://developer.piwik.org/guides/tracking-javascript-guide#multiple-piwik-trackers'), ma[da]++)
         }
         for (O = 0; O < _paq.length; O++) 
             _paq[O] && r(_paq[O]);
         
         _paq = new function () {
             return {push: r}
         };
         var wa = {
             addPlugin: function (a, b) {
                 na[a] = b
             },
             getTracker: function (a, b) {
                 e(b) || (b = this.getAsyncTracker().getSiteId());
                 e(a) || (a = this.getAsyncTracker().getTrackerUrl());
                 return new qa(a, b)
             },
             getAsyncTracker: function () {
                 return U
             }
         };
         "function" === typeof define && define.amd && define("piwik", [], function () {
             return wa
         });
         return wa
     }());
     window && window.piwikAsyncInit && window.piwikAsyncInit();
     (function () {
         "undefined" === typeof AnalyticsTracker && (AnalyticsTracker = Piwik)
     })();
     "function" !== typeof piwik_log && (piwik_log = function (d, e, m, q) {
         function k(d) {
             try {
                 return eval("piwik_" + d)
             } catch (T) {}
         }
         var r = Piwik.getTracker(m, e);
         r.setDocumentTitle(d);
         r.setCustomData(q);
         (d = k("tracker_pause")) && r.setLinkTrackingTimer(d);
         (d = k("download_extensions")) && r.setDownloadExtensions(d);
         (d = k("hosts_alias")) && r.setDomains(d);
         (d = k("ignore_classes")) && r.setIgnoreClasses(d);
         r.trackPageView();
         k("install_tracker") && (piwik_track = function (d, e, k, m) {
             r.setSiteId(e);
             r.setTrackerUrl(k);
             r.trackLink(d, m)
         }, r.enableLinkTracking())
     });