$(function () {
    const url_modes = Object.entries({
        viewList: "https://anime.dmkt-sp.jp/animestore/mpa_mylists_pc",
        editList: "https://anime.dmkt-sp.jp/animestore/mpa_shr_pc",
        viewNext: "https://anime.dmkt-sp.jp/animestore/mp_viw_pc",
        viewFav: "https://anime.dmkt-sp.jp/animestore/mpa_fav_pc",
        viewedAnime: "https://anime.dmkt-sp.jp/animestore/mpa_hst_pc",
        viewedComp: "https://anime.dmkt-sp.jp/animestore/mpa_cmp_pc",
        viewedRent: "https://anime.dmkt-sp.jp/animestore/mp_hst_pc",
        viewedLimit: "https://anime.dmkt-sp.jp/animestore/mpa_lmt_pc",
        viewAllList: "https://anime.dmkt-sp.jp/animestore/mpa_rsv_pc"
    }).filter(kv => location.href.indexOf(kv[1]) != -1);
    if (url_modes.length == 0) return;
    const url_mode = url_modes[0][0];
    addInitialButton(url_mode);


    document.addEventListener("click", async function (e) {
        //console.log(e.target)
        //const IsEditMode = ($("body").attr("class").indexOf("editMode") != -1);
        if ($(e.target).attr("class")) {
            const e_class = $(e.target).attr("class")
            if (e_class.indexOf("btnOpenAddMyList") != -1) {
                $("html").css({ "overflow-y": "hidden" });
                await addMylistModal();

            } else if (e_class.indexOf("btnAddMyList") != -1) {
                const workIds = $(".contentsWrapper .itemWrapper .itemModule.selected>input").map((ind, obj) => $(obj).val());
                const sharelistIds = $(".sharelistId.on").map((ind, obj) => $(obj).data("sharelistid")).toArray();
                for (const workId of workIds) {
                    const res = await fetch(window.COMMON.RESTAPI_ENDPOINT.getShareList + "?workId=" + workId).then(d => d.json());
                    const sharelistStatuses = res.data.shareList
                    const sharelistLimited = sharelistStatuses.filter(d => d.status == 0 && sharelistIds.indexOf(d.shareListId) != -1);
                    if (sharelistLimited.length == 0) continue;
                    editMyList(workId, sharelistLimited.map(d => d.shareListId), []);
                };
                $("modal.addMyListDialog").remove();
                $("html").css({ "overflow-y": "" });
                $("body").toggleClass("editMode");
                $(".contentsWrapper .itemWrapper .itemModule.selected").each((ind, obj) => {
                    $(obj).removeClass("selected").addClass("notSelected");
                })
                console.log("done");
            } else if (e_class.indexOf("btnOpenNewMyList") != -1) {
                newMyListModal();
            } else if (e_class.indexOf("btnNewMyList") != -1) {
                createShareList($("#newMyListName").val(), true, "");
                $(`modal.newMyListDialog`).remove();
                await remakeAddMyListModal();
            } else if (e_class.indexOf("btnCopyList") != -1) {
                await copyList().then(_=>{
                    setTimeout(function(){
                        $(".contentsWrapper .itemWrapper .itemModule.selected").each((ind, obj) => {
                            $(obj).removeClass("selected").addClass("notSelected");
                        })
                        $("body").toggleClass("editMode");
                        location.reload();
                    }, 500)
                });
                /*$(".contentsWrapper .itemWrapper .itemModule.selected").each((ind, obj) => {
                    $(obj).removeClass("selected").addClass("notSelected");
                })*/
                //
            }
        }
    })

    const observer = new MutationObserver(function (records) {
        for (const record of records) {
            const attrVal = $(record.target).attr(record.attributeName);
            if (record.attributeName == "class") {
                $(".mypageHeader div.btnOpenAddMyListArea").css({ visibility: attrVal.indexOf("editMode") != -1 ? "visible" : "hidden" })
            }
        }
    });
    const config = { attributes: true };
    observer.observe($("body")[0], config);
})


// ----------------- edit List --------------------

async function copyList() {
    const sharelistIds = $(".contentsWrapper .itemWrapper .itemModule.selected").map((ind, obj) => $(obj).data("sharelistid")).toArray();
    const lists = await Promise.all(sharelistIds.map(async sharelistId =>
        await fetch(window.COMMON.RESTAPI_ENDPOINT.getWorkFromShareList + "?shareListId=" + sharelistId)
            .then(d => d.json())
            .then(d => d.data)));
    const workIds = Array.from(new Set(lists.map(d => d.workList.map(work => work.workId)).flat()));
    //console.log(lists, workIds);
    await autoSplitedList(lists[0].shareListName, workIds);
}

async function autoSplitedList(coreName, workIds) {
    const cycleNum = Math.floor(workIds.length / 50 + 1);
    const dateNum=Date.now() - 0;
    [...Array(cycleNum).keys()].map(cycle=>{
        const listName = coreName.slice(0, 10) + "__" + (dateNum+cycle).toString("16").slice(5, 20);
        createShareList(listName, true, "");
    })
    setTimeout(async function () {
        const sharelists = await fetch(window.COMMON.RESTAPI_ENDPOINT.getShareList).then(d => d.json());
        for (const cycle of [...Array(cycleNum).keys()]) {
            const workIdsTmp = workIds.slice(50 * cycle, 50 * (cycle + 1));
            //console.log(sharelists)
            const sharelistId = sharelists.data.shareList[cycle].shareListId;
            //console.log(sharelists, listName);
            for (const workId of workIdsTmp){
                editMyList(workId, [sharelistId], []);
            }
        }
    }, 100);

}

// ------------------ initial --------------------

function addInitialButton(url_mode) {
    const editArea = $("div.editFooterIn");
    if (["viewList"].indexOf(url_mode) != -1) {
        const copyBtn = $("<a>", { href: "javascript:void(0)", class: "btnChEx1 btnCopyList" })
            .append("コピー/合成");
        editArea.append(copyBtn);
        $("a.btnDelete").css({ width: "27%", float: "left" });
        $("a.btnCancel").css({ width: "27%" });
    } else {
        const addBtn = $("<a>", { href: "javascript:void(0)", class: "btnChEx1 btnOpenAddMyList" })
            .append("マイリストに追加");
        editArea.append(addBtn);
        $("a.btnDelete").css({ width: "27%", float: "left" });
        $("a.btnCancel").css({ width: "27%" });
    }
}


// ------------------ about Modal -------------------

async function addMylistModal() {
    const workIds = $(".contentsWrapper .itemWrapper .itemModule.selected>input").map((ind, obj) => $(obj).val());
    if (workIds.length == 0) return;
    const shareList = await fetch(window.COMMON.RESTAPI_ENDPOINT.getShareList).then(d => d.json()).then(res => res.data.shareList);
    const modalId = `DIALOG${Date.now()}`
    const modalAddMyList = `
    <modal id="${modalId}" class="modalDialog addMyListDialog" style="">
    <div class="modalOverlay"></div>
    <div class="generalModal" style="left: 258px; top: 106px;">
        <div class="titleArea">
            <div class="title">マイリストに追加</div>
            <div class="closeBtn btnCloseModal"><a href="javascript:$('html').css({'overflow-y':''});$('#${modalId}').remove();"><i class="icon iconCircleClose"></i></a></div>
        </div>
        <div class="modalAddMyListIn">
            <p>各リストに作品を追加することができます</p>
            <div class="formContainer">
                <div class="formContainerWrapper">
                    <div class="formContainerCover"></div>
                    <div class="formContainerIn webkitScrollbar vertical">
                        <form>
                            ${shareList.map((list, ind) => `
                                <div class="checkboxList clearfix">
                                    <a href="javascript:$('.sharelist_${ind}').toggleClass('on');">
                                        <div class="checkbox sharelistId sharelist_${ind}" data-sharelistid="${list.shareListId}">
                                            <i class="sharelist_${ind}"></i>
                                        </div>
                                        <div class="label">
                                            <p class="title line1">
                                                <span>${list.shareListName}</span>
                                                <span class="comment onlyMax">最大50件登録済みです</span>
                                                <span class="comment onlyAdded">すでに登録済みです</span>
                                                <span class="comment onlyDel">このリストから削除されます</span>
                                                <span class="comment onlyAdd">このリストに追加されます</span>
                                            </p>
                                            <span class="count">(${list.count})</span>
                                        </div>
                                    </a>
                                </div>`).join("\n")}
                        </form>
                        <div><a href="javascript:void(0);" class="btnArea btnOpenNewMyList">新しいマイリストを作成</a><i class="icon iconCircleAdd"></i></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="btnArea" style="vertical-align:middle;padding:0;">
            <span><a href="javascript:void(0);" class="btnAddMyList">マイリストに追加する(${workIds.length})</a></span>
        </div>
    </div>
    </modal>`
    $("body").append(modalAddMyList);
    return modalId;
}

async function remakeAddMyListModal() {
    const shareList = await fetch(window.COMMON.RESTAPI_ENDPOINT.getShareList).then(d => d.json()).then(res => res.data.shareList);
    const modal = $(`modal.addMyListDialog`);
    const form = $("div.formContainerIn form", modal);
    form.empty();
    form.append(shareList.map((list, ind) => `
        <div class="checkboxList clearfix">
            <div class="checkbox sharelistId sharelist_${ind}" data-sharelistid="${list.shareListId}">
                <a href="javascript:$('.sharelist_${ind}').toggleClass('on');"><i class="sharelist_${ind}"></i></a>
            </div>
            <div class="label">
                <p class="title line1">
                    <span>${list.shareListName}</span>
                    <span class="comment onlyMax">最大50件登録済みです</span>
                    <span class="comment onlyAdded">すでに登録済みです</span>
                    <span class="comment onlyDel">このリストから削除されます</span>
                    <span class="comment onlyAdd">このリストに追加されます</span>
                </p>
                <span class="count">(${list.count})</span>
            </div>
        </div>`
    ).join("\n"));
}

function newMyListModal() {
    const modalId = `DIALOG${Date.now()}`;
    const modalNewMyList = `
    <modal id="${modalId}" class="modalDialog newMyListDialog" style="">
    <div class="modalOverlay"></div>
    <div class="generalModal" style="left: 258px; top: 229.6px;">
        <div class="titleArea">
            <div class="title">新しいマイリストを作成</div>
            <div class="closeBtn btnCloseModal"><a href="javascript:$('#${modalId}').remove();"><i class="icon iconCircleClose"></i></a></div>
        </div>
        <div class="modalNewMyListIn">
            <p>好きな名前のリストを作って作品を追加できます(最大20件まで)</p>
            <form><input id="newMyListName" type="text" placeholder="好きな名前を入力して下さい"></form>
        </div>
        <script>$("#newMyListName").on("keydown", function(e) {if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {return false;} else {return true;}});</script>
        <div class="btnSingleArea btnArea">
            <a href="javascript:void(0);" class="btnNewMyList">作成する</a>
        </div>
    </div>`
    $("body").append(modalNewMyList);
    return modalId;

}

//------------------ modified from from common.js -------------

// 作品のマイリスト登録状況を編集(追加削除)する
function editMyList(workId, regShareListIdList, delShareListIdList, isEdit, callback) {
    restPost(window.COMMON.RESTAPI_ENDPOINT.registWorkToShareList, {
        workId: workId,
        regShareListIdList: regShareListIdList,
        delShareListIdList: delShareListIdList
    }).done(function () {
        if (typeof callback === "function") {
            callback(true);
        }
    }).fail(function (errorCode) {
        switch (errorCode) {
            case "22": // 公開リスト作品件数超過
                window.COMMON.showToast("公開リスト作品件数が超過しました");
                //editMyList(workId, regShareListIdList, delShareListIdList, isEdit, callback)
                break;
            case "23": // マイリスト作品件数超過
                window.COMMON.showToast("マイリストの上限数に達しましたので、設定できません");
                break;
            case "24": // 公開期間外
                window.COMMON.showToast("この作品は現在公開されておりません");
                break;
            case "82": // 要アプリバージョンアップ
                window.location.href = "/animestore/iosapp_ver_warn";
                break;
            case "83": // 非対応機種
                window.location.href = "/animestore/uncov_m";
                break;
            case "84": // 要アプリ起動
                window.location.href = "/animestore/dapp_warn?next_url=" + encodeURIComponent(window.location.href);
                break;
            case "85": // 海外UA
                window.location.href = "/animestore/os_warn";
                break;
            case "86": // 未認証
            case "87": // 非会員
                window.doLogin(null, {
                    type: "edit_mylist",
                    data: { workId: workId, regShareListIdList: regShareListIdList, delShareListIdList: delShareListIdList, isEdit: isEdit },
                    timing: "load pageshow"
                });
                break;
            default:
                window.COMMON.showToast("エラーが発生しました");
                break;
        }
        if (typeof callback === "function") {
            callback(false);
        }
    });
}


function createShareList(shareListName, isEdit, workId, callback) {
    if (shareListName) {
        // サロゲートペア文字存在チェック
        if (shareListName.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g)) {
            window.COMMON.showToast("使用できない文字が含まれています");
            if (typeof callback === "function") {
                callback(false);
            }
            return;
        }

        // 入力文字数チェック（最大：半角20文字相当※マルチバイト文字は2文字扱い）
        var len = 0;
        for (var i = 0; i < shareListName.length; i++) {
            // パーセントエンコード
            var encodedName = encodeURI(shareListName.charAt(i));
            // 2文字以上になったか？
            if (encodedName.length > 1) {
                // 半角2文字扱いとして加算
                len += 2;
            } else {
                len += 1;
            }
        }

        if (len > 20) {
            window.COMMON.showToast("リスト名は10文字以内で入力してください");
            if (typeof callback === "function") {
                callback(false);
            }
            return;
        }

        restPost(window.COMMON.RESTAPI_ENDPOINT.registShareList, {
            "shareListId": null,
            "shareListName": shareListName,
            "updateType": "1"
        }).done(function () {
            if (typeof callback === "function") {
                callback(true);
            }
        }).fail(function (errorCode) {
            switch (errorCode) {
                case "22": // 公開リスト件数超過
                    window.COMMON.showToast("上限数に達しましたので、作成できません");
                    break;
                case "82": // 要アプリバージョンアップ
                    window.location.href = "/animestore/iosapp_ver_warn";
                    break;
                case "83": // 非対応機種
                    window.location.href = "/animestore/uncov_m";
                    break;
                case "84": // 要アプリ起動
                    window.location.href = "/animestore/dapp_warn?next_url=" + encodeURIComponent(window.location.href);
                    break;
                case "85": // 海外UA
                    window.location.href = "/animestore/os_warn";
                    break;
                case "86": // 未認証
                case "87": // 非会員
                    window.doLogin(null, {
                        type: "create_shareList",
                        data: { shareListName: shareListName, isEdit: isEdit, workId: workId },
                        timing: "load pageshow"
                    });
                    break;
                default:
                    window.COMMON.showToast("エラーが発生しました");
                    break;
            }
            if (typeof callback === "function") {
                callback(false);
            }
        });
    } else {
        window.COMMON.showToast("名前が入力されていません");
        if (typeof callback === "function") {
            callback(false);
        }
    }
}


// -------------- from common.js ----------------

restPost = function (url, json) {
    var deferred = new $.Deferred();
    var func = function (dfd) {
        var args = (typeof url === "string") ? { "url": url, "data": JSON.stringify(json) } : url;
        var param = $.extend({
            type: "post",
            contentType: "application/json",
            dataType: "json",
            cache: false,
            async: true,
            timeout: window.COMMON.API_WEB_TIMEOUT
        }, args);
        var count = 0;
        var self = function () {
            if (!param || !param.url) {
                window.setTimeout(function () {
                    dfd.reject("empty url");
                }, 0);
                return;
            }
            $.ajax(param).done(function (data) {
                data = data || {}; //dataがnullの場合の回避
                if (data.resultCd === "00" || data.resultCd === "01") {
                    dfd.resolve(data.data);
                } else {
                    dfd.reject((data.error) ? data.error.code : "unknown");
                }
            }).fail(function (jqXHR) {
                if (jqXHR.status === 0) {
                    if (++count > window.COMMON.API_RETRY_MAX_COUNT) {
                        dfd.reject("OverRetryCount");
                    } else {
                        window.setTimeout(self, window.COMMON.API_RETRY_INTERVAL);
                    }
                } else {
                    dfd.reject(jqXHR.status);
                }
            });
        };
        return self;
    };
    func(deferred)();
    return deferred.promise();
};


window.COMMON = {
    cookieMap: {},			// cookieをオブジェクト形式で保存したもの
    naviDevice: "",			// デバイス判定用
    naviDevice1: "",		// デバイス判定用2桁目
    naviDevice2: "",		// デバイス判定用1桁目
    memberStatus: "",		// 会員情報
    browser: "",			// UA判定結果
    isTouchDevice: false,	// タッチデバイス判定
    THRESHOLD: 960,			// レイアウト切り替え幅
    API_RETRY_MAX_COUNT: 3,
    API_RETRY_INTERVAL: 500,
    API_NATIVE_TIMEOUT: 1500,
    API_WEB_TIMEOUT: 10000,
    ESCAPED_FRAGMENT: "#!"
};

window.jsUrl = window.jsUrl || "/js/cms/";
window.cssUrl = window.cssUrl || "/css/cms/";

window.COMMON.EXTERNAL_URL = {
    "PlayMovie.js": "/js/PlayMovie.js",								// 動画再生用
    "truncate.min.js": window.jsUrl + "truncate.min.js",			// 複数行省略処理用
    "lazysizes.min.js": window.jsUrl + "lazysizes.min.js",			// 画像遅延読み込み用
    "jquery.minimalect.min.js": window.jsUrl + "jquery.minimalect.custom.min.js",	// カスタムセレクトボックス用
    "modal-general.js": window.jsUrl + "modal-general.js",			// ダイアログ・トースト表示用
    "modal.css": window.cssUrl + "modal.css?3",						// ダイアログ・トースト表示用
    "jquery.transit.min.js": window.jsUrl + "jquery.transit.min.js",	// アニメーション用
    "jquery-ui.min.js": window.jsUrl + "jquery-ui.min.js",			// ツールチップ・オートコンプリート表示用
    "suggest.css": window.cssUrl + "suggest.css",					// オートコンプリート表示用
    "swiper.custom.min.js": window.jsUrl + "swiper.custom.min.js",	// スライダー用
    "swiper.css": window.cssUrl + "swiper.css"						// スライダー用
};

///////////////////////////////////////////////////


// Api関連
///////////////////////////////////////////////////
window.apiUrl = window.apiUrl || "/animestore/rest/";
window.apiOldUrl = window.apiOldUrl || "/animestore/rest/";
window.apiSugotokuUrl = window.apiSugotokuUrl || "/sugotoku/rest/";
window.jsonCfUrl = window.jsonCfUrl || "/html/CF/";
window.jsonBfUrl = window.jsonBfUrl || "/html/BF/";
window.jsonCmsUrl = window.jsonCmsUrl || "/js/cms/";

window.COMMON.RESTAPI_NEW_ENDPOINT = {
    "getRankingWorkList": window.apiUrl + "WS000103", // 指定されたランキングの作品一覧を返却する。
    "getThematicRecommendList": window.apiUrl + "WS000104", // 指定されたテーマ別オススメの作品一覧を返却する。
    "getWordWorkList": window.apiUrl + "WS000105", // 指定されたワードでの検索結果を返却する。
    "getTagWorkList": window.apiUrl + "WS000106", // 指定されたタグに紐付く作品一覧を返却する。
    "getGenreWorkList": window.apiUrl + "WS000107", // 指定されたジャンルに紐付く作品一覧を返却する。
    "getInitialWorkList": window.apiUrl + "WS000108", // 指定されたイニシャルで始まる作品一覧を返却する。
    "getInitialTagList": window.apiUrl + "WS000110", // 指定されたカテゴリに紐付くタグ一覧を返却する。
    "getSeriesWorkList": window.apiUrl + "WS000111", // 指定されたシリーズに紐付く作品一覧を返却する。

    "getPlaylist": window.apiUrl + "WS000113", // プレイリスト一覧を返却する。
    "getPlaylistPartList": window.apiUrl + "WS000114", // 指定されたプレイリストに紐付く話一覧を返却する。
    "getSpecialPointWork": window.apiUrl + "WS000115", // 指定された作品が特定ポイント付与対象か判定する。

    "getTvProgram": window.apiUrl + "WS000118", // TV連動作品の情報を返却する。

    "getClassRecommendList": window.apiUrl + "WS000109", // ユーザのクラスに紐付く作品一覧を返却する。
    "getPlayParam": window.apiUrl + "WS010105", // 引数で指定された動画の再生用パラメータを返却する。
    "pushPermissionUpdate": window.apiUrl + "WS100309", // SUIDとpushID・oldPushIDを基に、サーバ側のPush通知設定を登録状態に更新する。

    "getTutorialWork": window.apiUrl + "WS080101", // 引管理ポータルから登録された「アンケート対象の作品」を返却するAPI
    "registTutorial": window.apiUrl + "WS080302", // チュートリアル画面で選択された作品を受け取り、クラス計算ロジックを通して、所属クラスを取得し、ユーザの属するクラスをテーブルに更新する
    "getMyListStatus": window.apiUrl + "WS100101", // 作品が気になるやマイリストに登録されているかを参照し、登録状況を返却する。
    "getFavoriteTagStatus": window.apiUrl + "WS100117", // タグが配信お知らせ登録されているかを参照し、登録状況を返却する。

    "registFavorite": window.apiUrl + "WS100302", // 気になるへの作品の登録、削除を行う。
    "registMyList": window.apiUrl + "WS100303", // マイリストへの作品の登録、削除を行う。
    "registFavoriteTag": window.apiUrl + "WS100314", // 配信お知らせへの作品の登録、削除を行う。
    "getShareList": window.apiUrl + "WS100104", // 公開リストの一覧及びそのリストに登録されている作品の件数、作品が指定された場合はその作品が各公開リストに登録されているかを取得する。

    "registShareList": window.apiUrl + "WS100305", // 公開リストの追加・更新を行う。
    "registWorkToShareList": window.apiUrl + "WS100306", // 公開リストへの作品の登録を行う。
    "editShareList": window.apiUrl + "WS100321", // 指定された公開リストの登録作品の編集を行う。

    "getAlreadyPartList": window.apiUrl + "WS100107", // 話が視聴済みか否かを判定する。
    "getWatchingPart": window.apiUrl + "WS100108", // 視聴中の話の情報を返却する。

    "point": window.apiUrl + "WS100110", // SUIDを基に、docomoサーバーからユーザーのポイント情報を取得し、JSON形式で返却する。
    "memberContinuationDuration": window.apiUrl + "WS100111", // SUIDを基に、ユーザーの会員継続日数を取得し、JSON形式で返却する。
    "dAccount": window.apiUrl + "WS100113", // SUIDを基に、APL基盤からユーザーのdアカウント情報を取得し、JSON形式で返却する。
    "getTopPageDispInfo": window.apiUrl + "WS100123", // 下記①～③を実施する。①SUIDを基に、docomoサーバーからユーザーのポイント情報を取得する。②SUIDを基に、APL基盤からマスクされたdアカウントを取得する。
    // ③LP基盤からステージ情報を取得する。LP基盤へのアクセスが24時間以内となる場合は前回取得したステージ情報を取得する。上記①～③をレスポンスに設定して返却する。

    "judgeCampaignEntry": window.apiUrl + "WS100124", // SUID、懸賞キャンペーンIDを基に、キャンペーンに応募済か、応募可能かを判定、json形式で返却する。。

    "getRegistDeliveryWorkList": window.apiUrl + "WS100115", // 配信お知らせ登録済みのタグに紐付く、登録後に公開開始した作品一覧を返却する。
    "getRegistFavoriteTagList": window.apiUrl + "WS100116", // 配信お知らせ登録済みのタグ一覧を返却する。

    "getMyList": window.apiUrl + "WS100118", // ユーザがマイリストに登録している作品の一覧を返却する。
    "getWorkFromShareList": window.apiUrl + "WS100120", // ユーザのSUIDと指定された公開リストIDに紐づく公開リスト作品一覧を取得し返却する。マイページでの編集用なので作品index公開期間外のものも取得する。
    "getPublicList": window.apiUrl + "WS100122", // 指定された公開リストIDに紐づく公開リスト作品一覧を取得し返却する。作品index公開期間外のものは取得しない。

    "kisekaeThemeList": window.apiUrl + "WS110101", // 公開中のきせかえテーマ一覧を取得し、JSON形式で返却する。
    "kisekaeGenreColorList": window.apiUrl + "WS110102", // きせかえのジャンル・カラー一覧を取得し、JSON形式で返却する。
    "registKisekaeTheme": window.apiUrl + "WS110103", // きせかえテーマの登録、削除を行う。

    "getProductSalesInfo": window.apiUrl + "WS300101", // 引数で指定された作品の物販用商品情報を返却する。

    "getExistsNewCampaign": window.apiUrl + "WS400102" // 事前公開開始日時または応募開始日時からn日以内で終了していない懸賞キャンペーン・集約キャンペーンの存在有無を返戻する。
};
window.COMMON.RESTAPI_SUGOTOKU_ENDPOINT = {
    "getSugotokuTvProgram": window.apiSugotokuUrl + "WS800101", // 指定された番組表一覧を返却する。
    "getSugotokuAuthResult": window.apiSugotokuUrl + "WS800303", // スゴ得認証結果を受け取る。
    "getSugotokuRankingWorkList": window.apiSugotokuUrl + "WS800102", // 指定されたランキングの作品一覧を返却する。
    "getSugotokuWatchingPart": window.apiSugotokuUrl + "WS800104" // 視聴中の話の情報を返却する。未視聴の場合や、最後に見た話が視聴終了している場合は、01：準正常(話情報無し)を返戻。
};
$.extend(true, window.COMMON.RESTAPI_NEW_ENDPOINT, window.COMMON.RESTAPI_SUGOTOKU_ENDPOINT);

window.COMMON.RESTAPI_OLD_ENDPOINT = {
    "partInfo": window.apiOldUrl + "WS030101", // 有料作品個別ダイアログ情報
    "limitedPartInfo": window.apiOldUrl + "WS040101", // 無料作品個別ダイアログ情報
    "getWorkSerialUserInputInfo": window.apiOldUrl + "WS050101", // シリアル情報
    "getPurchasedState": window.apiOldUrl + "WS060101", // 個別課金情報
    "notice": window.apiOldUrl + "WS070101", // 指定された条件に対して一致する、お知らせ情報をJSON形式で返却する。
    "topics": window.apiOldUrl + "WS070102" // 指定された条件に対して一致する、トピックス情報をJSON形式で返却する。
};

window.COMMON.RESTAPI_DMKT_RECOMMEND_ENDPOINT = {
    "jsonpDmktRecommend": "https://d.dmkt-sp.jp/portal/recommend_jsonp/index.html?startIndex=1&maxResult=20&pageId=174&groupId=1&serviceId=17&sortKind=0",
    "jsonpDmktGoodsRecommend": "https://d.dmkt-sp.jp/portal/goods_rcmd_jsonp/index.html?startIndex=1&maxResult=20&serviceId=17&contentServiceId=17"
};
window.COMMON.RESTAPI_JSONP_ENDPOINT = {
    "jsonpDmktGetMaskCookie": "https://service.smt.docomo.ne.jp/cgi8/id/getmskchkck"
};
$.extend(true, window.COMMON.RESTAPI_JSONP_ENDPOINT, window.COMMON.RESTAPI_DMKT_RECOMMEND_ENDPOINT);

window.COMMON.RESTAPI_ENDPOINT = $.extend({}, window.COMMON.RESTAPI_NEW_ENDPOINT);
$.extend(true, window.COMMON.RESTAPI_ENDPOINT, window.COMMON.RESTAPI_OLD_ENDPOINT);
$.extend(true, window.COMMON.RESTAPI_ENDPOINT, window.COMMON.RESTAPI_JSONP_ENDPOINT);



window.COMMON.showToast = function (text) {
    if (!toastQueue && typeof $.showToast === "function") {
        $.showToast(text);
        window.COMMON.showToast = $.showToast;
    } else if (toastQueue) {
        if (!toastQueue.length) {
            window.setTimeout(function () {
                $.getCss(window.COMMON.EXTERNAL_URL["modal.css"]);
                $.getScript(window.COMMON.EXTERNAL_URL["modal-general.js"]).done(function () {
                    $.showToast = $.showToast || window.jQuery.showToast;
                    while (toastQueue.length) {
                        var val = toastQueue.shift();
                        $.showToast(val);
                    }
                    window.COMMON.showToast = $.showToast;
                    toastQueue = undefined;
                }).fail(function () {
                    toastQueue = undefined;
                });
            }, 0);
        }
        if (toastQueue && typeof toastQueue.push === "function") {
            toastQueue.push(text);
        }
    }
};