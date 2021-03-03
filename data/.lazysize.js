!function (a, b) {
    var c = b(a, a.document);
    a.lazySizes = c,
    "object" == typeof module && module.exports
        ? module.exports = c
        : "function" == typeof define && define.amd && define(c)
}(window, function (a, b) {
    "use strict";
    if (b.getElementsByClassName) {
        var c,
            d = b.documentElement,
            e = a.addEventListener,
            f = a.setTimeout,
            g = a.requestAnimationFrame || f,
            h = a.setImmediate || f,
            i = /^picture$/i,
            j = [
                "load", "error", "lazyincluded", "_lazyloaded"
            ],
            k = function (a, b) {
                var c = new RegExp("(\\s|^)" + b + "(\\s|$)");
                return a.className.match(c) && c
            },
            l = function (a, b) {
                k(a, b) || (a.className += " " + b)
            },
            m = function (a, b) {
                var c;
                (c = k(a, b)) && (a.className = a.className.replace(c, " "))
            },
            n = function (a, b, c) {
                var d = c
                    ? "addEventListener"
                    : "removeEventListener";
                c && n(a, b),
                j.forEach(function (c) {
                    a[d](c, b)
                })
            },
            o = function (a, c, d, e, f) {
                var g = b.createEvent("CustomEvent");
                return g.initCustomEvent(c, ! e, ! f, d || {}),
                a.dispatchEvent(g),
                g
            },
            p = function (b, d) {
                var e;
                a.HTMLPictureElement || (
                    (e = a.picturefill || a.respimage || c.pf)
                        ? e({
                            reevaluate: !0,
                            elements: [b]
                        })
                        : d && d.src && (b.src = d.src)
                )
            },
            q = function (a, b) {
                return(getComputedStyle(a, null) || {})[b]
            },
            r = function (a, b, d) {
                for (d = d || a.offsetWidth; d < c.minSize && b && ! a._lazysizesWidth;) 
                    d = b.offsetWidth,
                    b = b.parentNode;
                
                return d
            },
            s = function (b) {
                var d,
                    e = 0,
                    i = a.Date,
                    j = function () {
                        d = !1,
                        e = i.now(),
                        b()
                    },
                    k = function () {
                        h(j)
                    },
                    l = function () {
                        g(k)
                    };
                return function () {
                    if (! d) {
                        var a = c.throttle -(i.now() - e);
                        d = !0,
                        6 > a && (a = 6),
                        f(l, a)
                    }
                }
            },
            t = function () {
                var h,
                    j,
                    r,
                    t,
                    v,
                    w,
                    x,
                    y,
                    z,
                    A,
                    B,
                    C,
                    D,
                    E = /^img$/i,
                    F = /^iframe$/i,
                    G = "onscroll" in a && !/glebot/.test(navigator.userAgent),
                    H = 0,
                    I = 0,
                    J = 0,
                    K = 0,
                    L = function (a) {
                        J--,
                        a && a.target && n(a.target, L),
                        (! a || 0 > J || ! a.target) && (J = 0)
                    },
                    M = function (a, b) {
                        var c,
                            d = a,
                            e = "hidden" != q(a, "visibility");
                        for (y -= b, B += b, z -= b, A += b; e && (d = d.offsetParent);) 
                            e = (q(d, "opacity") || 1) > 0,
                            e && "visible" != q(d, "overflow") && (c = d.getBoundingClientRect(), e = A > c.left && z < c.right && B > c.top - 1 && y < c.bottom + 1);
                        
                        return e
                    },
                    N = function () {
                        var a,
                            b,
                            d,
                            e,
                            f,
                            g,
                            i,
                            k,
                            l;
                        if ((v = c.loadMode) && 8 > J && (a = h.length)) {
                            for (
                                b = 0,
                                K ++,
                                D > I && 1 > J && K > 3 && v > 2
                                    ? (I = D, K = 0)
                                    : I = I != C && v > 1 && K > 2 && 6 > J
                                        ? C
                                        : H; a > b; b++
                            ) 
                                if (h[b] && ! h[b]._lazyRace) 
                                    if (G) 
                                        if ((k = h[b].getAttribute("data-expand")) && (g = 1 * k) || (g = I), l !== g && (w = innerWidth + g, x = innerHeight + g, i = -1 * g, l = g), d = h[b].getBoundingClientRect(), (B = d.bottom) >= i && (y = d.top) <= x && (A = d.right) >= i && (z = d.left) <= w && (B || A || z || y) && (r && 3 > J && ! k && (3 > v || 4 > K) || M(h[b], g))) {
                                            if (S(h[b], d.width), f =! 0, J > 9) 
                                                break
                                            
                                        }
                                    
                                
                            
                         else 
                            ! f && r && ! e && 3 > J && 4 > K && v > 2 && (j[0] || c.preloadAfterLoad) && (j[0] || ! k && (B || A || z || y || "auto" != h[b].getAttribute(c.sizesAttr))) && (e = j[0] || h[b]);
                         else 
                            S(h[b]);
                         e && ! f && S(e)
                    }
                },
                O = s(N),
                P = function (a) {
                    l(a.target, c.loadedClass),
                    m(a.target, c.loadingClass),
                    n(a.target, P)
                },
                Q = function (a, b) {
                    try {
                        a
                            .contentWindow
                            .location
                            .replace(b)
                    } catch (c) {
                        a.setAttribute("src", b)
                    }
                },
                R = function () {
                    var a,
                        b = [],
                        c = function () {
                            for (; b.length;) 
                                b.shift()();
                            
                            a = !1
                        };
                    return function (d) {
                        b.push(d),
                        a || (a =! 0, g(c))
                    }
                }(),
                S = function (a, b) {
                    var d,
                        e,
                        g,
                        h,
                        j,
                        q,
                        s,
                        v,
                        w,
                        x,
                        y,
                        z = E.test(a.nodeName),
                        A = z && (a.getAttribute(c.sizesAttr) || a.getAttribute("sizes")),
                        B = "auto" == A;
                    (! B && r || ! z || ! a.src && ! a.srcset || a.complete || k(a, c.errorClass)) && (a._lazyRace =! 0, J ++, R(function () {
                        if (a._lazyRace && delete a._lazyRace, m(a, c.lazyClass), !(w = o(a, "lazybeforeunveil")).defaultPrevented) {
                            if (A && (
                                B
                                    ? (u.updateElem(a, !0, b), l(a, c.autosizesClass))
                                    : a.setAttribute("sizes", A)
                            ), q = a.getAttribute(c.srcsetAttr), j = a.getAttribute(c.srcAttr), z && (s = a.parentNode, v = s && i.test(s.nodeName || "")), x = w.detail.firesLoad || "src" in a && (q || j || v), w =
                                { target: a
                            }, x && (n(a, L, !0), clearTimeout(t), t = f(L, 2500), l(a, c.loadingClass), n(a, P, !0)), v) 
                                for (d = s.getElementsByTagName("source"), e = 0, g = d.length; g > e; e++) 
                                    (y = c.customMedia[d[e].getAttribute("data-media") || d[e].getAttribute("media")]) && d[e].setAttribute("media", y),
                                    h = d[e].getAttribute(c.srcsetAttr),
                                    h && d[e].setAttribute("srcset", h);
                                
                            
                            q
                                ? a.setAttribute("srcset", q)
                                : j && (
                                    F.test(a.nodeName)
                                        ? Q(a, j)
                                        : a.setAttribute("src", j)
                                ),
                            (q || v) && p(a, {src: j})
                        }
                        (! x || a.complete) && (
                            x
                                ? L(w)
                                : J--,
                            P(w)
                        )
                    }))
                },
                T = function () {
                    var a,
                        b = function () {
                            c.loadMode = 3,
                            O()
                        };
                    r = !0,
                    K += 8,
                    c.loadMode = 3,
                    e("scroll", function () {
                        3 == c.loadMode && (c.loadMode = 2),
                        clearTimeout(a),
                        a = f(b, 99)
                    }, !0)
                };
            return {
                _: function () {
                    h = b.getElementsByClassName(c.lazyClass),
                    j = b.getElementsByClassName(c.lazyClass + " " + c.preloadClass),
                    C = c.expand,
                    D = Math.round(C * c.expFactor),
                    e("scroll", O, !0),
                    e("resize", O, !0),
                    a.MutationObserver
                        ? new MutationObserver(O).observe(d, {
                            childList: !0,
                            subtree: !0,
                            attributes: !0
                        })
                        : (d.addEventListener("DOMNodeInserted", O, !0), d.addEventListener("DOMAttrModified", O, !0), setInterval(O, 999)),
                    e("hashchange", O, !0),
                    [
                        "focus",
                        "mouseover",
                        "click",
                        "load",
                        "transitionend",
                        "animationend",
                        "webkitAnimationEnd"
                    ].forEach(function (a) {
                        b.addEventListener(a, O, !0)
                    }),
                    /d$|^c/.test(b.readyState)
                        ? T()
                        : (e("load", T), b.addEventListener("DOMContentLoaded", O)),
                    O()
                },
                checkElems: O,
                unveil: S
            }
        }
        (),
        u = function () {
            var a,
                d = function (a, b, c) {
                    var d,
                        e,
                        f,
                        g,
                        h = a.parentNode;
                    if (h && (c = r(a, h, c), g = o(a, "lazybeforesizes", {
                        width: c,
                        dataAttr: !! b
                    }), ! g.defaultPrevented && (c = g.detail.width, c && c !== a._lazysizesWidth))) {
                        if (a._lazysizesWidth = c, c += "px", a.setAttribute("sizes", c), i.test(h.nodeName || "")) 
                            for (d = h.getElementsByTagName("source"), e = 0, f = d.length; f > e; e++) 
                                d[e].setAttribute("sizes", c);
                            
                        
                        g.detail.dataAttr || p(a, g.detail)
                    }
                },
                f = function () {
                    var b,
                        c = a.length;
                    if (c) 
                        for (b = 0; c > b; b++) 
                            d(a[b])
                        
                    
                },
                g = s(f);
            return {
                _: function () {
                    a = b.getElementsByClassName(c.autosizesClass),
                    e("resize", g)
                },
                checkElems: g,
                updateElem: d
            }
        }(),
        v = function () {
            v.i || (v.i =! 0, u._(), t._())
        };
        return function () {
            var b,
                d = {
                    lazyClass: "lazyload",
                    loadedClass: "lazyloaded",
                    loadingClass: "lazyloading",
                    preloadClass: "lazypreload",
                    errorClass: "lazyerror",
                    autosizesClass: "lazyautosizes",
                    srcAttr: "data-src",
                    srcsetAttr: "data-srcset",
                    sizesAttr: "data-sizes",
                    minSize: 40,
                    customMedia: {},
                    init: !0,
                    expFactor: 2,
                    expand: 359,
                    loadMode: 2,
                    throttle: 125
                };
            c = a.lazySizesConfig || a.lazysizesConfig || {};
            for (b in d) 
                b in c || (c[b] = d[b]);
            
            a.lazySizesConfig = c,
            f(function () {
                c.init && v()
            })
        }(), {
            cfg: c,
            autoSizer: u,
            loader: t,
            init: v,
            uP: p,
            aC: l,
            rC: m,
            hC: k,
            fire: o,
            gW: r
        }
    }
});