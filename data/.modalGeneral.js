!function (t, e, i) {
    "use strict";
    i.showLoading = function (e, o) {
        var n = i("#LOADING");
        if (e && n.length) 
            n.data("count", (n.data("count") || 0) + 1);
         else if (e && ! n.length) {
            var a,
                s = function () {
                    var e = i("#LOADING");
                    if (e.length) {
                        var o = i(t),
                            n = t.innerWidth
                                ? t.innerWidth
                                : o.width(),
                            a = t.innerHeight
                                ? t.innerHeight
                                : o.height(),
                            c = e.outerWidth(!0),
                            l = e.outerHeight();
                        0 === c || 0 === l
                            ? t.setTimeout(s, 0)
                            : e.css({
                                left: (n - c) / 2 + "px",
                                top: (a - l) / 2 + "px"
                            })
                    }
                },
                c = function () {
                    a || (a = t.setTimeout(function () {
                        a = void 0,
                        s()
                    }, 200))
                };
            i("body").append('<div id="LOADING" class="toastOverlay"><div class="message"><div style="width:100px"><div class="loader"><span></span></div></div></div></div>'),
            n = i("#LOADING"),
            t.setTimeout(function () {
                s(),
                n.animate({
                    opacity: "1"
                }, {
                    start: s
                }, {done: s})
            }, 0),
            i(t).on("resize.loading", c)
        } else 
            n.data("count") && ! o
                ? n.data("count", (n.data("count") || 0) - 1)
                : (n.remove(), i(t).off("resize.loading"))
        
    },
    i.toastList = [],
    i.showToast = function (e) {
        if (e) {
            i("#TOAST").length && i("#TOAST").remove();
            var o,
                n = function () {
                    var e = i("#TOAST");
                    if (e.length) {
                        var o = i(t),
                            a = t.innerWidth
                                ? t.innerWidth
                                : o.width(),
                            s = t.innerHeight
                                ? t.innerHeight
                                : o.height(),
                            c = e.outerWidth(!0),
                            l = e.outerHeight();
                        0 === c || 0 === l
                            ? t.setTimeout(n, 0)
                            : e.css({
                                left: (a - c) / 2 + "px",
                                top: (s - l) / 2 + "px"
                            })
                    }
                },
                a = function () {
                    o || (o = t.setTimeout(function () {
                        o = void 0,
                        n()
                    }, 200))
                };
            i("body").append('<div id="TOAST" class="toastOverlay"><div class="message">' + e + "</div></div>");
            var s = i("#TOAST");
            t.setTimeout(function () {
                n(),
                s.animate({
                    opacity: "1"
                }, {
                    start: n
                }, {done: n})
            }, 0),
            i(t).on("resize", a),
            t.setTimeout(function () {
                s.animate({
                    opacity: "0"
                }, {
                    complete: function () {
                        s.remove(),
                        i(t).off("resize", a),
                        i.showToast(i.toastList.shift())
                    }
                })
            }, 3e3)
        }
    },
    i.showDialog = function (o) {
        var n = "DIALOG" + (
            new Date
        ).getTime() + Math
            .random()
            .toString()
            .slice(2);
        i("body").append('<modal id="' + n + '" class="modalDialog ' + (
            o.className
                ? o.className
                : ""
        ) + '" style="display:none;">' + function (t) {
            var e = "";
            return e += '<div class="modalOverlay"></div>',
            e += '<div class="generalModal">',
            !1 !== t.showTitleBar && (e += '<div class="titleArea">', t.title && (e += '<div class="title">' + t.title + "</div>"), e += '<div class="closeBtn"><i class="icon iconCircleClose"></i></div>', e += "</div>"),
            t.contents
                ? e += t.contents
                : (t.text && (e += '<div class="textArea">', e += '<div class="text webkitScrollbar">' + t.text + "</div>", e += "</div>"), t.checkboxText && (e += '<div class="checkboxArea">', e += '<div class="checkboxInner">', e += '<input class="chekbox" type="checkbox" value=""' + (
                    t.checkboxDefault
                        ? " checked"
                        : ""
                ) + ">", e += "<label>" + t.checkboxText + "</label>", e += "</div>", e += "</div>")),
            t.button2Text
                ? (e += '<div class="btnDoubleArea">', e += '<a href="javascript:void(0);" class="btnLeft">' + (
                    t.button1Text || "キャンセル"
                ) + "</a>", e += '<a href="javascript:void(0);" class="btnRight">' + (
                    t.button2Text || "OK"
                ) + "</a>", e += "</div>")
                : (e += '<div class="btnSingleArea">', e += '<a href="javascript:void(0);" class="btnSingle">' + (
                    t.button1Text || "OK"
                ) + "</a>", e += "</div>"),
            e += "</div>"
        }(o) + "</modal>");
        var a = i("#" + n);
        "function" == typeof o.afterinit && o.afterinit(a);
        var s,
            c = function () {
                /android2\./i.test(t.COMMON.osVer)
                    ? i(".pageWrapper").css({display: ""})
                    : t.COMMON.isTouchDevice && "chrome" !== t.COMMON.browser
                        ? i(e).off("touchmove")
                        : i("html, body").css({"overflow-y": ""})
            },
            l = function (e) {
                var o = i(t),
                    n = o.width(),
                    s = o.height(),
                    c = a.find(".generalModal"),
                    r = c.outerWidth(),
                    d = c.outerHeight();
                0 === r || 0 === d
                    ? t.setTimeout(l, 0)
                    : (a.find(".generalModal").css({
                        left: (n - r) / 2 + "px",
                        top: (s - d) / 2 + "px"
                    }), "function" == typeof e && t.setTimeout(e, 0))
            },
            r = function () {
                s || (s = t.setTimeout(function () {
                    s = void 0,
                    l()
                }, 200))
            };
        i(t).resize(r);
        var d = function () {
            if (i(t).off("resize", r), i("modal").length > 1) 
                a.remove();
             else {
                var e = function () {
                    a.remove(),
                    i("modal").length || c()
                };
                "function" == typeof o.fadeOut
                    ? o.fadeOut(a, e)
                    : a.fadeOut(e)
            }
        };
        a.closeModal = d;
        return function (t) {
            a.find(".closeBtn").click(function () {
                if ("function" == typeof t.closeCallback) {
                    var e = {
                        button: 0,
                        target: this,
                        root: a,
                        isChecked: a.find(".chekbox").prop("checked")
                    };
                    !1 !== t.closeCallback.call(this, e) && d()
                } else 
                    d();
                
                return !1
            }),
            a.find(".btnRight").click(function () {
                if ("function" == typeof t.button2Callback) {
                    var e = {
                        button: 2,
                        target: this,
                        root: a,
                        isChecked: a.find(".chekbox").prop("checked")
                    };
                    !1 !== t.button2Callback.call(this, e) && d()
                } else 
                    d();
                
                return !1
            }),
            a.find(".btnLeft, .btnSingle").click(function () {
                if ("function" == typeof t.button1Callback) {
                    var e = {
                        button: 1,
                        target: this,
                        root: a,
                        isChecked: a.find(".chekbox").prop("checked")
                    };
                    !1 !== t.button1Callback.call(this, e) && d()
                } else 
                    d();
                
                return !1
            }),
            l()
        }(o),
        1 === i("modal").length && function () {
            /android2\./i.test(t.COMMON.osVer)
                ? i(".pageWrapper").css({display: "none"})
                : t.COMMON.isTouchDevice && "chrome" !== t.COMMON.browser
                    ? i(e).on("touchmove", function (t) {
                        i(t.currentTarget).closest(".webkitScrollbar").length || t.preventDefault()
                    })
                    : i("html, body").css({"overflow-y": "hidden"})
        }(),
        "function" == typeof o.fadeIn
            ? o.fadeIn(a, l)
            : a.fadeIn({start: l}),
        "function" == typeof o.aftershow && o.aftershow(a),
        n
    }
}(this, this.document, this.jQuery);