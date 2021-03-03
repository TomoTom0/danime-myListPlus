/*!
 *       ⠀⠀⣀⡴⣶⣻⣟⣿⣻⣻⣟⣟⣿⣻⢟⠇⠀⠀⠀⣰⢐⢌⠢⡀⢀
 *       ⠀⣴⢯⡿⣯⣷⣟⣷⢿⣽⣾⢯⢛⢌⠢⡡⠀⠀⠀⢾⣷⣦⣑⢌⣿⡢
 *       ⢸⢯⣿⣻⣽⣾⣻⡾⣟⠗⢍⠢⠡⠢⢷⡯⠀⠀⠀⣰⣽⢾⣟⣿⣅⡪
 *       ⡿⣯⣷⢿⣳⣟⣷⢿⣧⠑⠁⠀⠀⠀⠀⠈⠀⠀⠀⢽⣾⡟⢝⢙⢯⣿⢮
 *       ⣿⣻⡾⣟⣯⣿⣽⡑⠍⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⣌⡾⣷⣥⢦⣿⢝⢋
 *       ⣯⣷⢿⣻⣽⣾⣻⠌⠀⠀⠀⡐⢿⣮⣬⡀⠀⠀⠀⢺⣿⣻⡾⢫⠑⢌⢂
 *       ⣿⢾⣟⣯⣷⢿⣽⠅⠀⠀⠀⢌⠢⡨⢓⢗⠀⠀⠀⢂⠪⡈⡢⢑⢌⣶⢿
 *       ⣿⡽⣯⡿⣾⣻⣽⢅⠀⠀⠀⠐⠡⠌⠢⠁⠀⠀⠀⢮⣌⣢⣪⡾⡟⢍⠢
 *       ⣷⢿⣯⢿⡯⣿⣽⠢⡂⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠹⣿⣽⠫⡨⢂⠅⡊
 *       ⣟⣯⣿⡽⣿⣽⣾⡑⢌⠢⣢⣀⢀⠀⢀⢀⠄⡪⢐⠅⣺⡧⡑⡐⢅⠪⣰
 *       ⣿⣽⢾⣻⣽⣾⣽⢌⠢⠡⣻⣟⣿⣟⣷⡐⡡⢂⠕⡨⣸⡗⢌⠌⡢⢹⣯
 *       ⡿⣞⣿⣯⣷⡿⣾⠢⡑⠅⣿⣽⣾⢯⣷⣿⣄⠕⡨⡐⢼⣏⠢⡑⡐⣽⣻
 *       ⣿⣅⣀⢀⡀⢸⣉⠁⡈⠌⠾⠾⠀⢟⠌⡀⡁⢈⠂⠀⢽⣗⢀⠀⢀⠀⣿
 *       ⣯⣷⠇⢈⣠⣿⣻⣗⣌⢊⠤⠀⠀⠑⡨⠂⠀⠢⡁⠠⣠⣀⠪⠀⡀⢴⣿
 *       ⢸⣃⣴⣿⣽⢦⣠⣄⣤⣤⣠⡐⡑⠔⡀⢄⠕⡀⢄⢀⢾⡗⡁⡐⢌⢚⡁
 *       ⠀⠻⣽⢾⣽⣟⣯⡿⣯⡿⣽⢷⣧⣑⠌⡂⡪⢈⠢⡂⢵⣏⠢⡊⠔⠐
 *       ⠀⠀⠈⠫⠷⣟⣷⢿⣯⢿⣻⣯⢿⣽⢷⣎⡔⠡⡑⢌⢺⡧⠑⠌
 *
 * © NTT docomo Anime Store inc, All Right Reserved.
 */
!function (e, t, a) {
    "use strict";
    e.kisekaeJsUrl = e.kisekaeJsUrl || "/js/cms/",
    e.kisekaeCssUrl = e.kisekaeCssUrl || "/css/cms/";
    var i = /^\/animestore\/m?c(d|i)/.test(e.location.pathname),
        o = -1 !== e
            .location
            .pathname
            .indexOf("/animestore/sch");
    if ("1" === e.COMMON.memberStatus || i || o) {
        var s = a("html");
        0 === location.pathname.indexOf("/animestore/CP/")
            ? s.addClass("campaignPage")
            : 0 === location.pathname.indexOf("/animestore/CF/") && s.addClass("freePage");
        var n = e
            .COMMON
            .RESTAPI_ENDPOINT
            .registKisekaeTheme;
        n || (n = e.apiUrl + "WS110103", e
            .COMMON
            .RESTAPI_NEW_ENDPOINT
            .registKisekaeTheme = n);
        var r = function () {
                s.addClass(a.map(a("link[rel=stylesheet]:not([kisekae]):not(.kisekaeCss)"), function (e) {
                    return a(e)
                        .attr("kisekae", !0)
                        .attr("href")
                        .match(/([^\/]+)\.css/g)
                }).join(" "))
            },
            d = a.getCss;
        a.getCss = function (e, t) {
            return d(e, t).done(r)
        },
        a(r),
        r();
        var l,
            m = function (e) {
                var t,
                    a,
                    i,
                    o;
                if (e) {
                    /^\"(.*)\"$/.test(e) && (e = RegExp.$1);
                    var s = e.indexOf("?");
                    -1 !== s && (t = e.slice(s + 1), e = e.slice(0, s), -1 !== (s = t.indexOf("&")) && (a = t.slice(s + 1), t = t.slice(0, s))),
                    (o = e).indexOf("@") === o.length - 1 && (o = e.substr(0, o.length - 1), i =! 0)
                }
                return {
                    themeId: e,
                    themeName: o,
                    lastupdate: t,
                    limitedTime: a,
                    isJsExist: i
                }
            },
            c = function (e) {
                var t = "";
                try {
                    var i = e.sheet;
                    a.each(i.rules || i.cssRules || [], function (e, a) {
                        t += a.cssText
                    })
                } catch (e) {
                    console.error(e)
                }
                return t
            },
            k = "";
        k += '<style id="changingStyle">',
        k += "html.pc * {",
        k += "-webkit-transition: background-color .5s, background-image .5s, color .5s, border .5s;",
        k += "-moz-transition: background-color .5s, background-image .5s, color .5s, border .5s;",
        k += "-ms-transition: background-color .5s, background-image .5s, color .5s, border .5s;",
        k += "-o-transition: background-color .5s, background-image .5s, color .5s, border .5s;",
        k += "transition: background-color .5s, background-image .5s, color .5s, border .5s;",
        k += "}",
        k += "</style>";
        var h = function () {
                e.clearTimeout(l),
                a("#changingStyle").length || t.head.appendChild(a(k)[0])
            },
            g = function () {
                e.clearTimeout(l),
                l = e.setTimeout(function () {
                    a("#changingStyle").remove()
                }, 500)
            },
            f = function () {
                a(".kisekaeCss").remove()
            },
            p = function (t, i, o) {
                var s;
                if (e.NO_KISEKAE) 
                    (s = new a.Deferred).resolv(),
                    s = s.promise();
                 else if (t) {
                    !0 !== o && h();
                    var n = e.kisekaeCssUrl + encodeURIComponent(t) + ".css";
                    n += i
                        ? "?_=" + i
                        : "";
                    var r = {};
                    r.href = n,
                    r.class = "kisekaeCss",
                    s = d(r).done(function () {
                        var e = a(".kisekaeCss").last();
                        if (! e.is(a("link,style").last())) {
                            var t = c(e.get(0));
                            t && (e = a('<style class="kisekaeCss">' + t + "</style>")),
                            e.appendTo("head")
                        }
                        a(".kisekaeCss:not(:last)").remove()
                    }).always(function () {
                        g()
                    })
                } else 
                    (s = new a.Deferred).reject("themeId is null"),
                    s = s.promise();
                    return s
                };
                a.fn.onThemeEvent = function (e, t) {
                    var i = m(s.attr("data-themeid")).themeName,
                        o = i
                            ? "." + i
                            : "";
                    e = (e || "").replace(/(\S+)/g, "$1" + o) || o,
                    a(this).addClass("_attatchedKisekaeHandler").on(e, t)
                },
                a.fn.offThemeEvent = function (e, t) {
                    var i = m(s.attr("data-themeid")).themeName,
                        o = i
                            ? "." + i
                            : "";
                    e = (e || "").replace(/(\S+)/g, "$1" + o) || o,
                    void 0 === t && (t =! 1),
                    a(this).removeClass("_attatchedKisekaeHandler").off(e, t)
                };
                var u = function () {
                        var t = m(s.attr("data-themeid")).themeName;
                        a("._attatchedKisekaeHandler").offThemeEvent(),
                        a(e).offThemeEvent();
                        var i = e[t];
                        i && ("function" == typeof i.dispose && i.dispose.call(e), delete e[t])
                    },
                    b = function (i, o) {
                        var s;
                        if (i) {
                            u();
                            var n = e.kisekaeJsUrl + encodeURIComponent(i) + ".js";
                            n += o
                                ? "?_=" + o
                                : "";
                            var r = {};
                            r.src = n,
                            r.themeName = i,
                            r.class = "kisekaeJs",
                            s = a.getScript(r).done(function () {
                                !function (i) {
                                    "complete" === t.readyState
                                        ? i()
                                        : a(e).onThemeEvent("load", i)
                                }(function () {
                                    var t = e[i];
                                    t && "function" == typeof t.initialize && t.initialize.call(e)
                                })
                            })
                        } else 
                            (s = new a.Deferred).reject("themeId is null"),
                            s = s.promise();
                            return s
                        },
                        C = function (t) {
                            return e.COMMON.restPost(n, {
                                themeId: t || ""
                            })
                        };
                        e.setKisekaeTheme = function (t, i, o) {
                            var n = new a.Deferred;
                            return t
                                ? (e.COMMON.showLoading(!0), C(t).done(function () {
                                    var r = m(e
                                            .COMMON
                                            .parseCookie()
                                            .kisekae_theme),
                                        d = r.themeName || t;
                                    o = r.lastupdate || o || "",
                                    i = r.limitedTime || i || "";
                                    var l = r.isJsExist;
                                    u(m(s.attr("data-themeid")).themeName),
                                    p(d, o).done(function () {
                                        e.COMMON.showLoading(!1),
                                        l && b(d, o);
                                        var t = c(a(".kisekaeCss").last().get(0));
                                        if (e.COMMON.isEnableLocalStorage && t) 
                                            try {
                                                localStorage.setItem("kisekaeCss", t),
                                                localStorage.setItem("kisekaeThemeName", d)
                                            }
                                         catch (e) {
                                            console.log(e)
                                        }
                                        n.resolve()
                                    }).fail(function () {
                                        f(),
                                        e.COMMON.showToast("きせかえテーマの設定ができませんでした"),
                                        e.COMMON.showLoading(!1),
                                        n.resolve("theme download failed")
                                    }),
                                    s.replaceClass(/KISEKAE_\S+/, "KISEKAE_" + d),
                                    s.attr("data-themeid", t),
                                    a(e).trigger("theme-changed", {themeId: t})
                                }).fail(function (t) {
                                    n.reject(
                                        "86" === t || "87" === t
                                            ? "need login"
                                            : "register failed"
                                    ),
                                    e.COMMON.showLoading(!1),
                                    "86" !== t && e.COMMON.showToast("きせかえテーマの設定ができませんでした")
                                }))
                                : (e.COMMON.showToast("きせかえテーマの設定ができませんでした"), n.reject("themeId is null")),
                            n.promise()
                        },
                        e.deleteKisekaeTheme = function (t) {
                            var i = new a.Deferred;
                            return C().done(function () {
                                if (e.COMMON.deleteCookie("kisekae_theme", "/"), f(), u(m(s.attr("data-themeid")).themeName), s.replaceClass(/KISEKAE_\S+/, ""), s.removeAttr("data-themeid"), e.COMMON.showToast(t || "きせかえテーマを解除しました"), a(e).trigger("theme-changed", {themeId: ""}), e.COMMON.isEnableLocalStorage) 
                                    try {
                                        localStorage.removeItem("kisekaeCss"),
                                        localStorage.removeItem("kisekaeThemeName")
                                    }
                                 catch (e) {
                                    console.log(e)
                                }
                                i.resolve()
                            }).fail(function (a) {
                                i.reject(
                                    "86" === a || "87" === a
                                        ? "need login"
                                        : "register failed"
                                ),
                                e.COMMON.showLoading(!1),
                                "86" !== a && e.COMMON.showToast(t || "きせかえテーマを解除できませんでした")
                            }),
                            i.promise()
                        };
                        var v = e
                                .COMMON
                                .cookieMap
                                .kisekae_theme,
                            x = m(v);
                        v = x.themeId;
                        var O = x.themeName,
                            M = x.lastupdate,
                            w = x.limitedTime,
                            I = x.isJsExist;
                        if (w && parseInt(new Date / 1e3, 10) >= parseInt(w, 10) && (v = ""), e.COMMON.isEnableLocalStorage) 
                            try {
                                var N = localStorage.getItem("kisekaeCss"),
                                    y = localStorage.getItem("kisekaeThemeName");
                                N && y === O
                                    ? t.head.appendChild(a('<style class="kisekaeCss">' + N + "</style>")[0])
                                    : (localStorage.removeItem("kisekaeCss"), localStorage.removeItem("kisekaeThemeName"))
                            }
                         catch (e) {
                            console.log(e)
                        }
                        if ("" === v) 
                            e.deleteKisekaeTheme("設定済みのきせかえテーマの公開が終了しました");
                         else if ("string" == typeof v) 
                            e.COMMON.showLoading(!0),
                            p(O, M, !0).done(function () {
                                e.COMMON.showLoading(!1, !0);
                                var t = c(a(".kisekaeCss").last().get(0));
                                if (e.COMMON.isEnableLocalStorage && t) 
                                    try {
                                        localStorage.setItem("kisekaeCss", t),
                                        localStorage.setItem("kisekaeThemeName", O)
                                    }
                                 catch (e) {
                                    console.log(e)
                                }
                                e.NO_KISEKAE
                                    ? a(".kisekaeCss").remove()
                                    : I && b(O, M)
                            }).fail(function () {
                                e.COMMON.showToast("きせかえテーマの設定ができませんでした"),
                                e.COMMON.showLoading(!1, !0)
                            }),
                            s.addClass("KISEKAE_" + O),
                            s.attr("data-themeid", v);
                         else {
                            var T = location.href.match(/\?(?:partId|workId)\=([C|\d]\d{4})/),
                                R = T && 2 === T.length
                                    ? T[1]
                                    : "",
                                S = decodeURIComponent((e
                                    .COMMON
                                    .searchMap
                                    .searchKey || "").replace(/\+/g, "%20")),
                                E = function (e) {
                                    return(e || "")
                                        .replace(/\(.+?\)/g, "")
                                        .replace(/（.+?）/g, "")
                                        .replace(/[a-z]/g, function (e) {
                                            return String.fromCharCode(-33 & e.charCodeAt(0))
                                        })
                                        .replace(/[A-Za-z0-9]/g, function (e) {
                                            return String.fromCharCode(e.charCodeAt(0) + 65248)
                                        })
                                        .replace(/[\u30a1-\u30f6]/g, function (e) {
                                            return String.fromCharCode(e.charCodeAt(0) - 96)
                                        })
                                        .replace(/[^ぁ-ゞ|ァ-ヶ|一-龠|Ａ-Ｚ|ａ-ｚ|０-９]/g, "")
                                };
                            if (S = E(S), R || S && S.length > 1) {
                                var W = new Date;
                                W.setMinutes(W.getMinutes() - 2);
                                var K = "_=" + W.getFullYear() + ("0" + (
                                    W.getMonth() + 1
                                )).slice(-2) + ("0" + W.getDate()).slice(-2) + ("0" + W.getHours()).slice(-2) + parseInt(W.getMinutes() / 15, 10);
                                e
                                    .COMMON
                                    .restGet({
                                        url: e.jsonCmsUrl + "kisekae_workid_map.json?" + K,
                                        cache: !0
                                    })
                                    .done(function (t) {
                                        var i = [];
                                        a.each(t, function (e, t) {
                                            t && (
                                                R && a.isArray(t.workIdList)
                                                    ? a.each(t.workIdList, function (a, o) {
                                                        if (R === o) 
                                                            return i.push({themeId: e, title: t.title}),
                                                            !1
                                                        
                                                    })
                                                    : S && t.title && E(t.title).indexOf(S) >= 0
                                                        ? i.push({themeId: e, title: t.title})
                                                        : S && a.isArray(t.keywordList) && a.each(t.keywordList, function (a, o) {
                                                            if (E(S) === E(o)) 
                                                                return i.push({themeId: e, title: t.title}),
                                                                !1
                                                            
                                                        })
                                            )
                                        });
                                        var o = i[Math.floor(Math.random() * i.length)];
                                        if (o) {
                                            var n = m(o.themeId),
                                                r = n.themeName,
                                                d = n.themeId;
                                            p(r, null, !0).done(function () {
                                                s.addClass("KISEKAE_" + r),
                                                s.attr("data-themeid", d),
                                                "1" === e.COMMON.memberStatus && a(function () {
                                                    var t,
                                                        i = a("body"),
                                                        s = a("#topHeader").css("background-color"),
                                                        n = a("#topHeader").css("background").replace(/\"/, "'"),
                                                        d = s.match(/\d+/g);
                                                    d && d.length >= 3
                                                        ? t = .3 * d[0] + .59 * d[1] + .11 * d[2]
                                                        : (s = "#fff", t = 255);
                                                    var l = "https://cs1.anime.dmkt-sp.jp/anime_kv/html/CK/img/";
                                                    0 === e
                                                        .location
                                                        .host
                                                        .indexOf("dev") && (l = "https://cs1.anime.dmkt-sp.jp/dev-anime_kv/html/CK/img/");
                                                    var m = e.COMMON.escape,
                                                        c = "";
                                                    c += '<div id="kisekaeRecommendWrap">',
                                                    c += '<div id="kisekaeRecommend" style="background-color:' + s + ";background:" + n + ';"' + (
                                                        t < 128
                                                            ? ' class="dark"'
                                                            : ""
                                                    ) + ">",
                                                    c += '<div class="leftWrap">',
                                                    c += '<div class="kisekaeTitle">『' + o.title + "』テーマにきせかえますか？</div>",
                                                    c += '<div class="kisekaeButton"><a href="javascript:void(0);">今すぐきせかえる</a></div>',
                                                    c += "</div>",
                                                    c += '<div class="rightWrap"><div class="imgWrap">',
                                                    c += '<img class="lazyload" src="' + e
                                                        .COMMON
                                                        .IMAGE_URL
                                                        .loading + '" data-src="' + l + encodeURIComponent(r) + '_thumb.png" alt="' + m(o.title) + '">',
                                                    c += "</div></div>",
                                                    c += "</div>",
                                                    c += "<style>",
                                                    c += "#promoBanner {",
                                                    c += "display: none;",
                                                    c += "}",
                                                    c += "#kisekaeRecommendWrap {",
                                                    c += "max-width: 860px;",
                                                    c += "margin: auto;",
                                                    c += "padding: 6px",
                                                    c += "}",
                                                    c += "#kisekaeRecommendWrap.search {",
                                                    c += "padding: 28px 3.75% 10px",
                                                    c += "}",
                                                    c += "#kisekaeRecommend {",
                                                    c += "display: -webkit-box;",
                                                    c += "display: -ms-flexbox;",
                                                    c += "display: -webkit-flex;",
                                                    c += "display: flex;",
                                                    c += "-webkit-align-items: center;",
                                                    c += "-webkit-box-align: center;",
                                                    c += "-ms-flex-align: center;",
                                                    c += "align-items: center;",
                                                    c += "width: 100%;",
                                                    c += "border: 2px solid #000;",
                                                    c += "-webkit-box-sizing: border-box;",
                                                    c += "-moz-box-sizing: border-box;",
                                                    c += "box-sizing: border-box;",
                                                    c += "}",
                                                    c += "#kisekaeRecommendWrap.index #kisekaeRecommend {",
                                                    c += "box-shadow: 0 0 5px 3px rgba(0,0,0,0.5);",
                                                    c += "}",
                                                    c += "#kisekaeRecommend.dark {",
                                                    c += "color: #fff;",
                                                    c += "border-color: #fff;",
                                                    c += "}",
                                                    c += "#kisekaeRecommend .rightWrap {",
                                                    c += "width: 25%;",
                                                    c += "min-width: 120px;",
                                                    c += "margin: 5px;",
                                                    c += "-webkit-flex-shrink: 0;",
                                                    c += "flex-shrink: 0;",
                                                    c += "}",
                                                    c += "#kisekaeRecommend .rightWrap .imgWrap {",
                                                    c += "border: 2px solid #000;",
                                                    c += "-webkit-box-sizing: border-box;",
                                                    c += "-moz-box-sizing: border-box;",
                                                    c += "box-sizing: border-box;",
                                                    c += "}",
                                                    c += "#kisekaeRecommend.dark .rightWrap .imgWrap {",
                                                    c += "border-color: #fff;",
                                                    c += "}",
                                                    c += "#kisekaeRecommend .rightWrap .imgWrap:before {",
                                                    c += 'content: "";',
                                                    c += "display: block;",
                                                    c += "padding-top: 56.25%;",
                                                    c += "}",
                                                    c += "#kisekaeRecommend .rightWrap .imgWrap img {",
                                                    c += "bottom: auto;",
                                                    c += "width: 100%;",
                                                    c += "height: auto;",
                                                    c += "}",
                                                    c += "#kisekaeRecommend .leftWrap {",
                                                    c += "-webkit-box-flex: 1;",
                                                    c += "-moz-box-flex: 1;",
                                                    c += "-webkit-flex-grow: 1;",
                                                    c += "flex-grow: 1;",
                                                    c += "overflow: hidden;",
                                                    c += "}",
                                                    c += "#kisekaeRecommend .kisekaeTitle {",
                                                    c += "margin: 5px 5px 10px;",
                                                    c += "font-size: 1.4rem;",
                                                    c += "font-weight: bold;",
                                                    c += "text-align: center;",
                                                    c += "}",
                                                    c += "#kisekaeRecommend .kisekaeButton {",
                                                    c += "margin: 5px;",
                                                    c += "text-align: center;",
                                                    c += "}",
                                                    c += "#kisekaeRecommend .kisekaeButton a {",
                                                    c += "font-size: 1.4rem;",
                                                    c += "font-weight: bold;",
                                                    c += "background: #ffcc00;",
                                                    c += "padding: 6px;",
                                                    c += "width: 100%;",
                                                    c += "max-width: 160px;",
                                                    c += "display: inline-block;",
                                                    c += "border: 1px solid #000;",
                                                    c += "-webkit-box-sizing: border-box;",
                                                    c += "-moz-box-sizing: border-box;",
                                                    c += "box-sizing: border-box;",
                                                    c += "}",
                                                    c += "#kisekaeRecommend .kisekaeButton a.on {",
                                                    c += "background: #000;",
                                                    c += "color: #fff;",
                                                    c += "}",
                                                    c += "html.mouseDevice #kisekaeRecommend .kisekaeButton a:hover {",
                                                    c += "text-decoration: none;",
                                                    c += "opacity: 0.6;",
                                                    c += "}",
                                                    c += "#kisekaeRecommend.dark .kisekaeButton a {",
                                                    c += "border-color: #fff;",
                                                    c += "}",
                                                    c += "@media screen and (max-width: 479px) {",
                                                    c += "#kisekaeRecommend .rightWrap {",
                                                    c += "width: 60px;",
                                                    c += "min-width: initial;",
                                                    c += "}",
                                                    c += "#kisekaeRecommend .rightWrap .imgWrap {",
                                                    c += "border: none;",
                                                    c += "}",
                                                    c += "#kisekaeRecommend .rightWrap .imgWrap:before {",
                                                    c += "padding-top: 100%;",
                                                    c += "}",
                                                    c += "#kisekaeRecommend .rightWrap .imgWrap img {",
                                                    c += "bottom: 0;",
                                                    c += "top: auto;",
                                                    c += "width: 600%;",
                                                    c += "bottom: -10%;",
                                                    c += "left: -10%;",
                                                    c += "}",
                                                    c += "}",
                                                    c += " @media screen and (min-width: 960px) {",
                                                    c += "#kisekaeRecommendWrap.search {",
                                                    c += "padding-bottom: 26px;",
                                                    c += "}",
                                                    c += "#kisekaeRecommend .kisekaeTitle {",
                                                    c += "font-size: 1.8rem;",
                                                    c += "}",
                                                    c += "}",
                                                    c += "</style>",
                                                    c += "</div>";
                                                    var k;
                                                    S && a("#listContainer").length
                                                        ? (a("#listContainer").before(c), k = a("#kisekaeRecommendWrap").addClass("search"))
                                                        : (i.append(c), k = a("#kisekaeRecommendWrap").addClass("index"));
                                                    var h = !1;
                                                    k.find(".kisekaeButton a").click(function () {
                                                        !1 === h && e.kisekae(o.themeId).done(function () {
                                                            h = !0,
                                                            e.setTimeout(function () {
                                                                a("#kisekaeRecommendWrap .kisekaeTitle").text("『" + o.title + "』テーマにきせかえました"),
                                                                a("#kisekaeRecommendWrap .kisekaeButton a")
                                                                    .text("設定変更はこちら")
                                                                    .attr("href", "/animestore/CK/kisekae")
                                                                    .addClass("on")
                                                                    .off("click"),
                                                                h = !1
                                                            }, 100)
                                                        })
                                                    })
                                                })
                                            })
                                        }
                                    })
                            }
                        }
                    }
                    var _ = !1;
                e.kisekae = function (t) {
                    var i = m(t),
                        o = new a.Deferred;
                    return "1" === e.COMMON.memberStatus
                        ? !1 === _ && (
                            _ =! 0,
                            i.themeId
                                ? "function" == typeof e.setKisekaeTheme
                                    ? e
                                        .setKisekaeTheme(i.themeId)
                                        .done(function () {
                                            _ = !1,
                                            o.resolve()
                                        })
                                        .fail(function (a) {
                                            "need login" === a && e.appLogin(null, {
                                                type: "set_kisekae",
                                                data: {
                                                    themeId: t
                                                },
                                                timing: "DOMContentLoaded"
                                            }, !1),
                                            _ = !1,
                                            o.reject(a)
                                        })
                                    : (_ =! 1, o.reject("not defined"))
                                : "function" == typeof e.deleteKisekaeTheme
                                    ? e
                                        .deleteKisekaeTheme()
                                        .done(function () {
                                            _ = !1,
                                            o.resolve()
                                        })
                                        .fail(function (t) {
                                            "need login" === t && e.appLogin(null, {
                                                type: "set_kisekae",
                                                data: {
                                                    themeId: ""
                                                },
                                                timing: "DOMContentLoaded"
                                            }, !1),
                                            _ = !1,
                                            o.reject(t)
                                        })
                                    : (_ =! 1, o.reject("not defined"))
                        )
                        : (e.appLogin(null, {
                            type: "set_kisekae",
                            data: {
                                themeId: t
                            },
                            timing: "DOMContentLoaded"
                        }), o.reject("need login")),
                    o.promise()
                },
                e.setAuthAction("set_kisekae", function (t) {
                    s.attr("data-themeid") !== t.themeId && e.kisekae(t.themeId)
                })
            }(this, this.document, this.jQuery);