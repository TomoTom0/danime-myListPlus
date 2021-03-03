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
(function (window, document, $) {
	"use strict";

	// IE9でlocation.originが取得できないため設定しておく
	if (!window.location.origin) {
		window.location.origin = window.location.origin || window.location.protocol + "//" + window.location.host;
	}

	window.requestAnimationFrame =
			window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.setTimeout;

	window.cancelAnimationFrame =
			window.cancelAnimationFrame ||
			window.webkitCancelAnimationFrame ||
			window.mozCancelAnimationFrame ||
			window.clearTimeout;

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


	window.COMMON.IMAGE_URL = {
		loading: "/img/img_lazySpace.gif",
		error: "/img/img_sorry.gif",
		nodata: "/img/img_nodata.jpg",
		nothing: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAJAQMAAAAB5D5xAAAABGdBTUEAALGPC/xhBQAAAANQTFRF5eXl+zo+zwAAAAtJREFUCNdjYMAJAAAbAAFSROSpAAAAAElFTkSuQmCC"
	};

	///////////////////////////////////////////////////
	// LocalStorage
	///////////////////////////////////////////////////
	var isEnableLocalStorage = window.localStorage ? (function () {
		try {
			var checkKey = "test";
			window.localStorage.setItem(checkKey, 1);
			window.localStorage.getItem(checkKey);
			window.localStorage.removeItem(checkKey);
			return true;
		} catch (e) {
			return false;
		}
	})() : false;
	window.COMMON.isEnableLocalStorage = isEnableLocalStorage;

	///////////////////////////////////////////////////
	// cookieのパース
	///////////////////////////////////////////////////
	var isEnableHistoryApi = history.pushState && history.state !== undefined;
	window.COMMON.isEnableHistoryApi = isEnableHistoryApi;

	window.COMMON.parseCookie = function () {
		var cookieMap = {};
		var cookies = document.cookie.split(";");
		for (var i = 0, len = cookies.length; i < len; i++) {
			var index = cookies[i].indexOf("=");
			var key = cookies[i].slice(0, index);
			var value = cookies[i].slice(index + 1);
			cookieMap[$.trim(key)] = $.trim(value);
		}
		window.COMMON.cookieMap = cookieMap;
		return cookieMap;
	};

	window.COMMON.setCookie = function (name, value, days, path) {
		if (typeof days !== "number") {
			path = days;
			days = null;
		} else {
			var date = new Date();
			date.setTime(date.getTime() + (days * 86400000) );
			days = date.toGMTString(); // 文字列に変換
		}
		document.cookie = name + "=" + value + ((days) ? ("; expires=" + days) : "") + ((path) ? ("; path=" + path) : "");
		window.COMMON.cookieMap[name] = value;
	};
	window.COMMON.getCookie = function (name) {
		return window.COMMON.cookieMap[name] || "";
	};
	window.COMMON.deleteCookie = function (name, path) {
		document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + ((path) ? ("; path=" + path) : "");
		delete window.COMMON.cookieMap[name];
	};
	var cookieMap = window.COMMON.parseCookie();

	window.COMMON.parseParams = function (hash) {
		var param = {};
		var pair = hash.split("&");
		for (var i = 0; pair[i]; i++) {
			var kv = pair[i].split("=");
			if (kv[0] && kv[1]) {
				param[kv[0]] = kv[1];
			}
		}
		return param;
	};
	window.COMMON.searchMap = {};
	window.COMMON.getSearch = function () {
		var param = window.COMMON.parseParams(window.location.search.slice(1));
		window.COMMON.searchMap = $.extend({}, param);
		return param;
	};
	window.COMMON.getSearch();

	if (isEnableHistoryApi) {
		// URLのクエリ部分(location.search)を変更する
		window.COMMON.setSearch = function (param, isAddHistory, callback) {
			if (typeof isAddHistory === "function") {
				callback = isAddHistory;
				isAddHistory = false;
			}
			var ret = false;
			var search = "";
			$.each(param, function (index, val) {
				if (search.length > 0) {
					search += "&";
				}
				search += index + "=" + val;
			});
			search = (search.length > 0 ? "?" : "") + search;
			var url = window.location.protocol + "//" + window.location.host + window.location.pathname + search + window.location.hash;
			if (window.location.href !== url) {
				window.COMMON.searchMap = param;
				if (isAddHistory) {
					window.history.pushState(window.history.state, null, url);
				} else {
					window.history.replaceState(window.history.state, null, url);
				}
				ret = true;
			}
			if (typeof callback === "function") {
				window.setTimeout(callback, 0);
			}
			return ret;
		};
		// URLのクエリ部分(location.search)にデータを追加する
		window.COMMON.addSearch = function (param, isAddHistory, callback) {
			return window.COMMON.setSearch($.extend(true, window.COMMON.getSearch(), param), isAddHistory, callback);
		};
		// URLのクエリ部分(location.search)からデータを削除する
		window.COMMON.removeSearch = function (name) {
			var param = window.COMMON.getSearch();
			delete param[name];
			return window.COMMON.setSearch(param);
		};
	}


	var currentHash = "";
	var initialHash = window.location.hash;

	window.COMMON.hashMap = {};
	window.COMMON.getHash = function () {
		var param = window.COMMON.parseParams(window.location.hash.slice(window.COMMON.ESCAPED_FRAGMENT.length));
		window.COMMON.hashMap = $.extend({}, param);
		return param;
	};
	window.COMMON.getHash();

	window.COMMON.setHash = function (param, isAddHistory, callback) {
		if (typeof isAddHistory === "function") {
			callback = isAddHistory;
			isAddHistory = false;
		}
		var ret = false;
		if (typeof callback === "function") {
			var timer;
			var closure = function () {
				$(window).off("hashchange", closure);
				window.clearTimeout(timer);
				callback();
			};
			timer = window.setTimeout(closure, 300);
			$(window).one("hashchange", closure);
			ret = window.COMMON.setHash(param, isAddHistory);
			if (!ret) {
				$(window).off("hashchange", closure);
				window.clearTimeout(timer);
			}
		} else {
			var hash = "";
			$.each(param, function (index, val) {
				if (hash.length > 0) {
					hash += "&";
				}
				hash += index + "=" + val;
			});
			if (!(window.location.hash === "" && hash === "" && window.location.hash === hash) &&
					window.location.hash !== window.COMMON.ESCAPED_FRAGMENT + hash) {
				currentHash = window.COMMON.ESCAPED_FRAGMENT + hash;
				window.COMMON.hashMap = param;
				var url = window.location.protocol + "//" + window.location.host + window.location.pathname + (window.location.search || "") + currentHash;
				if (isAddHistory) {
					if (isEnableHistoryApi) {
						// HistoryAPIが有効な場合
						window.history.pushState(window.history.state, null, url);
					} else {
						// HistoryAPIが無効な場合はハッシュにつっこむ
						window.location.hash = currentHash;
					}
				} else {
					if (isEnableHistoryApi) {
						// HistoryAPIが有効な場合
						window.history.replaceState(window.history.state, null, url);
					} else {
						// HistoryAPIが無効な場合は場合分け
						if (window.navigator.userAgent.toLowerCase().indexOf("android") !== -1) {
							// Androidはバージョンによって動作が違う
							if (window.COMMON.browser === "safari" && typeof window.history.replaceState === "function") {
								// MobileWebkitでreplaceStateが実装されている場合はreplaceUrlをしてもlocation.hrefが変わらないので、replaceStateで補う
								if (/android[2|3]\./i.test(window.COMMON.osVer)) {
									// 2系の場合(3系はHistoryAPIは未実装だがいちおう)はreplaceUrlしてからreplaceState
									window.location.replace(url);
									window.history.replaceState(window.history.state, null, url);
								} else {
									// 4系以降の場合はreplaceStateしてからreplaceUrl
									window.history.replaceState(window.history.state, null, url);
									window.location.replace(url);
								}
							} else {
								// Chromeの場合はreplaceUrlで問題ないのでreplaceUrlのみ行う
								document.location.replace(url);
							}
						} else {
							// Android以外はreplaceUrlは問題なく動作するのでreplaceUrlのみ行う
							window.location.replace(url);
						}
					}
				}
				ret = true;
			}
		}
		return ret;
	};
	window.COMMON.addHash = function (param, isAddHistory, callback) {
		return window.COMMON.setHash($.extend(true, window.COMMON.getHash(), param), isAddHistory, callback);
	};
	window.COMMON.removeHash = function (name) {
		var param = window.COMMON.getHash();
		delete param[name];
		return window.COMMON.setHash(param);
	};

	if (isEnableHistoryApi) {
		window.COMMON.historyStateMap = {};
		// Historyに保存されている情報(hisotry.state)を取得する
		window.COMMON.getState = function () {
			var param = window.COMMON.parseParams(window.history.state || "");
			window.COMMON.historyStateMap = $.extend({}, param);
			return param;
		};
		window.COMMON.getState();

		// Historyに保存されている情報(hisotry.state)を変更する
		window.COMMON.setState = function (param, isAddHistory, callback) {
			if (typeof isAddHistory === "function") {
				callback = isAddHistory;
				isAddHistory = false;
			}
			var ret = false;
			var historyState = "";
			$.each(param, function (index, val) {
				if (historyState.length > 0) {
					historyState += "&";
				}
				historyState += index + "=" + val;
			});
			if (!(window.history.state === "" && historyState === "" && window.history.state === historyState) &&
					window.history.state !== historyState) {
				window.COMMON.historyStateMap = param;

				if (isAddHistory) {
					window.history.pushState(historyState, null, window.location.href);
				} else {
					window.history.replaceState(historyState, null, window.location.href);
				}
				ret = true;
			}
			if (typeof callback === "function") {
				window.setTimeout(callback, 0);
			}
			return ret;
		};
		// Historyに保存されている情報(hisotry.state)にデータを追加する
		window.COMMON.addState = function (param, isAddHistory, callback) {
			return window.COMMON.setState($.extend(true, window.COMMON.getState(), param), isAddHistory, callback);
		};
		// Historyに保存されている情報(hisotry.state)からデータを削除する
		window.COMMON.removeState = function (name) {
			var param = window.COMMON.getState();
			delete param[name];
			return window.COMMON.setState(param);
		};
	} else {
		window.COMMON.setSearch = window.COMMON.setHash;
		window.COMMON.addSearch = window.COMMON.addHash;
		window.COMMON.removeSearch = window.COMMON.removeHash;
		window.COMMON.getState = window.COMMON.getHash;
		window.COMMON.setState = window.COMMON.setHash;
		window.COMMON.addState = window.COMMON.addHash;
		window.COMMON.removeState = window.COMMON.removeHash;
		window.COMMON.getState = window.COMMON.getHash;
	}


	$(window).on("hashchange", function () {
		window.COMMON.getHash();
		if (window.location.hash !== currentHash) {
			currentHash = window.location.hash;
			$(window).trigger("historyback");
		}
		return false;
	});
	if (isEnableHistoryApi) {
		$(window).on("popstate", function (e) {
			if (e.originalEvent && typeof e.originalEvent.state === "string") {
				$(window).trigger("historyback");
			}
			return false;
		});
	}


	var $html = $("html");
	///////////////////////////////////////////////////
	// デバイス情報の解析
	// 11 : Android(docomo)ブラウザ
	// 12 : Dマーケットアプリ(Phone・tablet)
	// 21 : Android(CF)ブラウザ
	// 22 : Android(CF)アプリ
	// 31 : iOSブラウザ
	// 32 : iOSアプリ
	// 41 : TVBoxブラウザ
	// 42 : Dマーケットアプリ(ドングル・TVBox)
	// 51 : Tizenブラウザ
	// 52 : Tizenアプリ
	// 61 : PC
	///////////////////////////////////////////////////
	var naviDevice = cookieMap.navi_device || "61";
	// デバイス判定用に分割
	var naviDevice1 = naviDevice.substring(0, 1);
	var naviDevice2 = naviDevice.substring(1, 2);

	switch (naviDevice1) {
		case "1": // dマーケットの場合
			$html.addClass("dmarket");
			break;
		case "2": // Androidの場合
			$html.addClass("android");
			break;
		case "3": // iOSの場合
			$html.addClass("ios");
			break;
		case "4": // TVBOXの場合
			$html.addClass("tvbox");
			break;
		case "5": // tizenの場合
			$html.addClass("tizen");
			break;
		case "6": // PCの場合
			$html.addClass("pc");
			break;
		default: // デフォルトはPCとする
			$html.addClass("pc");
			naviDevice1 = "6";
			break;
	}

	switch (naviDevice2) {
		case "1": // ブラウザの場合
			$html.addClass("browser");
			break;
		case "2": // アプリの場合
			$html.addClass("appli");
			break;
		default: // デフォルトはブラウザとする
			$html.addClass("browser");
			naviDevice2 = "1";
			break;
	}
	switch (naviDevice) {
		case "22": // Android(CF)アプリ
		case "32": // iOSアプリ
			$html.addClass("cfapp");
			break;
		default:
			break;
	}
	window.COMMON.naviDevice = naviDevice;
	window.COMMON.naviDevice1 = naviDevice1;
	window.COMMON.naviDevice2 = naviDevice2;

	///////////////////////////////////////////////////
	// 会員状態(member_status)の解析
	// 1 : 会員(PARADE認証済みかつ、アニメストア会員)
	// 2 : 非会員(PARADE認証済みかつ、アニメストア非会員)
	// 設定なし : 認証前(PARADE認証前)
	///////////////////////////////////////////////////
	var memberStatus = cookieMap.member_status || window.COMMON.memberStatus;
	var sugotokuMemberStatus = cookieMap.sugotoku_member_status || window.COMMON.sugotokuMemberStatus;
	var loginFlag = window.COMMON.getCookie('login_flag') === '1';
	if (memberStatus === '1') { // 会員の場合
		$html.addClass("member");
	} else if (memberStatus === '2' || loginFlag) { // 非会員の場合
		if (sugotokuMemberStatus === "1") { // スゴ得会員の場合
			$html.addClass("sugotoku_member");
		} else {
			$html.addClass("nonmember");
		}
	} else { // 未認証の場合
		$html.addClass("unauth");
	}
	window.COMMON.memberStatus = memberStatus;
	window.COMMON.sugotokuMemberStatus = sugotokuMemberStatus;
	window.COMMON.loginFlag = loginFlag;




	///////////////////////////////////////////////////
	// ブラウザの判定
	///////////////////////////////////////////////////
	var ua = window.navigator.userAgent.toLowerCase();
	var ver = window.navigator.appVersion.toLowerCase();
	var name = "";
	var mobileOsVer = "";

	var matches;
	var isAndroidChrome = false;
	var isLegacySp = false;
	if (ua.indexOf("android") !== -1) {
		matches = ua.match(/android[\s|;](\d+)\.(\d+)/);
		if (matches && matches.length === 3) {
			mobileOsVer = Number(matches[1] + "." + matches[2]);
			name = "android" + matches[1] + "." + matches[2];
			if (mobileOsVer >= 4.4) {
				// android KitKat以上の場合にフラグを立てる
				isAndroidChrome = true;
			} else {
				isLegacySp = true;
			}
		}
	} else {
		if (/ip(hone|od|ad)/.test(ua)) {
			matches = ua.match(/os (\d+)_(\d+)/);
			if (matches && matches.length === 3) {
				mobileOsVer = Number(matches[1] + "." + matches[2]);
				name = "ios" + matches[1] + "." + matches[2];
				if (mobileOsVer <= 8) {
					isLegacySp = true;
				}
			}
		}
		if (ua.indexOf("ios") !== -1) {
			matches = ua.match(/ios;(\d+)\.(\d+)/);
			if (matches && matches.length === 3) {
				mobileOsVer = Number(matches[1] + "." + matches[2]);
				name = "ios" + matches[1] + "." + matches[2];
				if (mobileOsVer <= 8) {
					isLegacySp = true;
				}
			}
		}
	}
	if (mobileOsVer) {
		$html.attr("data-mobileos-ver", mobileOsVer);
	}

	$html.addClass(name);
	window.COMMON.osVer = name;

	name = "";
	if (ua.indexOf("docomo") !== -1) {
		if (isAndroidChrome) {
			name = "chrome";
		} else {
			name = "safari";
		}
	} else if (ua.indexOf("msie") !== -1) {
		if (ver.indexOf("msie 6.") !== -1) {
			name = "ie6";
		} else if (ver.indexOf("msie 7.") !== -1) {
			name = "ie7";
		} else if (ver.indexOf("msie 8.") !== -1) {
			name = "ie8";
		} else if (ver.indexOf("msie 9.") !== -1) {
			name = "ie9";
		} else if (ver.indexOf("msie 10.") !== -1) {
			name = "ie10";
		} else {
			name = "ie";
		}
	} else if (ua.indexOf("trident/7") !== -1) {
		name = "ie11";
	} else if (ua.indexOf("chrome") !== -1) {
		name = "chrome";
	} else if (ua.indexOf("safari") !== -1) {
		name = "safari";
		if (isAndroidChrome) {
			// Android4.4でsafariはデフォルトブラウザ
			isAndroidChrome = false;
			// isLegacySp = true;
		}
	} else if (ua.indexOf("opera") !== -1) {
		name = "opera";
	} else if (ua.indexOf("firefox") !== -1) {
		name = "firefox";
	}
	$html.addClass(name);
	window.COMMON.browser = name;
	window.COMMON.isAndroidChrome = isAndroidChrome;

	if (isLegacySp) {
		$html.addClass("legacySp");
	}
	window.COMMON.isLegacySp = isLegacySp;


	///////////////////////////////////////////////////
	// MpegDashの判定
	///////////////////////////////////////////////////
	var isMpegDash = false;
	if (window.COMMON.naviDevice === "61") {
		if (ua.indexOf("trident/7") !== -1) {
			matches = ua.match(/nt\s(\d+)\.(\d+)/);
			if (matches && matches.length === 3) {
				isMpegDash = Number(matches[1] + "." + matches[2]) >= 6.3;
			}
		} else if (ua.indexOf("edge") !== -1) {
			isMpegDash = true;
		} else if (ua.indexOf("chrome") !== -1) {
			isMpegDash = true;
		} else if (ua.indexOf("firefox") !== -1) {
			isMpegDash = true;
		}
		if (isMpegDash) {
			$html.addClass("mpegDash");
		}
	}
	window.COMMON.isMpegDash = isMpegDash;


	// PCとスマホのホバー処理の追加
	var isTouchDevice = "ontouchstart" in window || navigator.msMaxTouchPoints > 0;
	$html.addClass((isTouchDevice) ? "touchDevice" : "mouseDevice");
	window.COMMON.isTouchDevice = isTouchDevice;

	var isPointerEnable = window.navigator.pointerEnabled;
	var isMsPointerEnable = window.navigator.msPointerEnabled;
	window.COMMON.pointerEvent = {
		// スペースで区切られたイベント名に対してラベルを付加する
		addLabel: function (eventName, label) {
			var eventNames = eventName.split(" ");
			return $.map(eventNames, function (e) {
				return e + (label.indexOf(".") === 0 ? "" : ".") + label;
			}).join(" ");
		},
		// SurfaceのChromeでtouchとmouseの両方を傍受する必要あり
		addMouseEventName: function (eventName) {
			switch (eventName) {
				case "touchstart":
					eventName += " mousedown";
					break;
				case "touchmove":
					eventName += " mousemove";
					break;
				case "touchend":
					eventName += " mouseup";
					break;
				default:
					break;
			}
			return eventName;
		},
		start: isPointerEnable ? "pointerdown" : isMsPointerEnable ? "MSPointerDown" : isTouchDevice ? "touchstart" : "mousedown",
		move: isPointerEnable ? "pointermove" : isMsPointerEnable ? "MSPointerMove" : isTouchDevice ? "touchmove" : "mousemove",
		end: isPointerEnable ? "pointerup" : isMsPointerEnable ? "MSPointerUp" : isTouchDevice ? "touchend" : "mouseup",
		cancel: isPointerEnable ? "pointercancel" : isMsPointerEnable ? "MSPointerCancel" : "touchcancel"
	};

	var isSupportAnime = typeof $("<div>").css("transitionProperty") === "string";
	$html.addClass((isSupportAnime) ? "supportedAnime" : "unsupportedAnime");
	window.COMMON.isSupportAnime = $.support.transition = isSupportAnime;
	if (!window.COMMON.isSupportAnime) {
		(function () {
			$.fn.transition = $.fn.transit = $.fn.animate;
			$.fn.transitionStop = $.fn.transitStop = $.fn.stop;
			var hooks = [["x", "left"], ["y", "top"]];
			$.each(hooks, function (index, hook) {
				$.fx.step[hook[0]] = function (fx) {
					$.cssHooks[hook[0]].set(fx.elem, fx.now + fx.unit);
				};
				$.cssHooks[hook[0]] = {
					get: function (elem, computed) {
						return $.css(elem, hook[1]);
					},
					set: function (elem, value) {
						elem.style[hook[1]] = value;
					}
				};
			});
		})();
	}

	window.COMMON.isPcLayout = window.innerWidth >= window.COMMON.THRESHOLD;
	var initSize = function () {
		window.COMMON.isPcLayout = window.innerWidth >= window.COMMON.THRESHOLD;
	};
	$(window).on("orientationchange resize", function () {
		if (window.COMMON.isPcLayout !== true && window.innerWidth >= window.COMMON.THRESHOLD) {
			window.COMMON.isPcLayout = true;
			$(window).trigger("changePcLayout");
		} else if (window.COMMON.isPcLayout !== false && window.innerWidth < window.COMMON.THRESHOLD) {
			window.COMMON.isPcLayout = false;
			$(window).trigger("changeSpLayout");
		}
	}).load(initSize);
	$(initSize);



	///////////////////////////////////////////////////
	// 認証後処理
	///////////////////////////////////////////////////
	var COOKIE_NAME_AUTH_ACTION_DATA = "##auth_action_data";
	var authActionData = window.COMMON.getCookie(COOKIE_NAME_AUTH_ACTION_DATA);
	var authActionFlag = false;
	if (authActionData) {
		window.COMMON.deleteCookie(COOKIE_NAME_AUTH_ACTION_DATA, "/");
		try {
			authActionData = JSON.parse(authActionData);
		} catch (e) {
			console.log(e);
		}
	}
	if (typeof authActionData === "object" && typeof authActionData.type === "string" && authActionData.pathname === window.location.pathname) {
		if (window.COMMON.memberStatus === "1" || (window.COMMON.loginFlag && authActionData.ec === "1")) {
			var callbackFunc = function () {
				window.setTimeout(function () {
					$(window).scrollTop(authActionData.scrolltop);
					$(window).trigger(authActionData.type, authActionData.data);
				}, authActionData.delay || 0);
			};
			$.each(authActionData.timing, function (i, timing) {
				if (timing === "DOMContentLoaded") {
					$(document).ready(callbackFunc);
				} else {
					$(window).one(timing, callbackFunc);
				}
			});
			authActionFlag = true;
		} else if (window.COMMON.sugotokuMemberStatus === "1" && window.location.pathname.indexOf("/animestore/") === 0) {
			window.location.href = "/sugotoku/reg";
		}
	}
	window.saveAuthActionData = function (type, data, timing, delay, ec) {
		if (!type) {
			return;
		}
		if (typeof type === "object") {
			data = type.data;
			timing = type.timing;
			delay = type.delay;
			ec = type.ec;
			type = type.type;
		}
		window.COMMON.setCookie(COOKIE_NAME_AUTH_ACTION_DATA, JSON.stringify({
			type: type,
			data: data,
			timing: $.unique((timing || "load").split(" ")),
			delay: delay || 0,
			pathname: window.location.pathname,
			scrolltop: $(window).scrollTop(),
			ec: ec || 0
		}), "/");
	};
	window.setAuthAction = function (type, actionFunc) {
		if (authActionFlag) {
			$(window).one(type + ".autoaction", function (event, data) {
				if (typeof actionFunc === "function") {
					actionFunc(data);
				}
				$(window).off(".autoaction");
			});
		}
	};

	///////////////////////////////////////////////////
	// 共通関数定義(jQuery拡張)
	///////////////////////////////////////////////////

	// 省略処理
	var clampQueue = [];
	var clamp = function ($el, line) {
		var lineHeight = $el.css("line-height");
		if (lineHeight.lastIndexOf("px") + 2 !== lineHeight.length) {
			// IE9などでpx単位で取得できず、CSS指定した値そのまま取得されてしまうため、実際の高さをpx単位で算出する
			lineHeight = parseFloat(lineHeight) * parseFloat($el.css("font-size"));
		}
		$el.truncate({
			lines: line,
			lineHeight: Math.ceil(parseFloat(lineHeight)) // IE9では小数指定すると正常に動かないため切り上げ
		});
		return $el;
	};
	$.fn.clampLine = function (line) {
		if ("webkitLineClamp" in document.body.style) {
			$.fn.clampLine = function (num) {
				return this.filter(":not(.ui-clamp)").addClass("ui-clamp webkit" + num + "LineClamp");
			};
			this.clampLine(line);
		} else if (typeof $.fn.truncate === "function") {
			$.fn.clampLine = function (num) {
				this.filter(":not(.ui-clamp)").addClass("ui-clamp").each(function (index, el) {
					clamp($(el), num);
				});
				return this;
			};
			this.clampLine(line);
		} else if (clampQueue) {
			if (!clampQueue.length) {
				window.setTimeout(function () {
					$.getScript(window.COMMON.EXTERNAL_URL["truncate.min.js"]).done(function () {
						$.fn.clampLine = function (num) {
							this.filter(":not(.ui-clamp)").addClass("ui-clamp").each(function (index, el) {
								clamp($(el), num);
							});
							return this;
						};
						$.each(clampQueue, function (i, v) {
							$(v[0]).clampLine(v[1]);
						});
						clampQueue = undefined;
					}).fail(function () {
						clampQueue = undefined;
					});
				}, 0);
			}
			if (clampQueue && typeof clampQueue.push === "function") {
				clampQueue.push([this, line]);
			}
		}
		return this;
	};

	var pulldownQueue = [];
	$.fn.pulldown = function (param) {
		var $this = this;
		if (window.COMMON.isTouchDevice) {
			if (param && typeof param.afterinit === "function") {
				param.afterinit.call(this);
			}
			return $this;
		}
		$this.css("visibility", "hidden");
		$this.filter(":not(.ui-pulldown)").each(function(index, el) {
			var $el = $(el);
			if (typeof $.fn.minimalect === "function") {
				//select置き換え
				var $selected = $el.find("option:selected");
				$el.addClass("ui-pulldown").minimalect($.extend({
					searchable: false,
					placeholder: ($selected.length) ? $selected.text() : "選択してください"
				}, param)).css("visibility", "visible");
			} else if (pulldownQueue) {
				if (!pulldownQueue.length) {
					window.setTimeout(function () {
						$.getScript(window.COMMON.EXTERNAL_URL["jquery.minimalect.min.js"]).done(function () {
							$.each(pulldownQueue, function (i, v) {
								var $e = $(v[0]);
								var $s = $e.find("option:selected");
								$e.addClass("ui-pulldown").minimalect($.extend({
									searchable: false,
									placeholder: ($s.length) ? $s.text() : "選択してください"
								}, param)).css("visibility", "visible");
							});
							pulldownQueue = undefined;
						}).fail(function () {
							pulldownQueue = undefined;
						});
					}, 0);
				}
				if (pulldownQueue && typeof pulldownQueue.push === "function") {
					pulldownQueue.push([this, param]);
				}
			}
		});
		return $this;
	};


	$.fn.webkitScroll = function () {
		var $this = this;
		if (!window.COMMON.isTouchDevice || window.COMMON.browser !== "safari") {
			return $this;
		}
		$this.filter(":not(.ui-webkitScroll)").each(function(index, el) {
			// MobileSafariベースのMobileWebKitの場合は以下でスクロール禁止
			var scrollStartX = 0;
			var scrollStartY = 0;
			var scrollTop = 0;
			var scrollLeft = 0;
			var $el = $(el);
			$el.addClass("ui-webkitScroll").on({
				"touchstart": function (e) {
					scrollStartX = e.originalEvent.touches[0].pageX;
					scrollStartY = e.originalEvent.touches[0].pageY;
					scrollTop = $(this).scrollTop();
					scrollLeft = $(this).scrollLeft();
				},
				"touchmove": function (e) {
					if (this.scrollHeight > this.clientHeight) {
						var scrollEndX = e.originalEvent.touches[0].pageX;
						var scrollEndY = e.originalEvent.touches[0].pageY;
						$(this).scrollTop(scrollTop - (scrollEndY - scrollStartY));
						$(this).scrollLeft(scrollLeft - (scrollEndX - scrollStartX));
						return false;
					}
				}
			});
			if (window.COMMON.osVer === "android4.0") {
				$el.css("overflow", "hidden");
			}
		});
		return $this;
	};

	// 表示されているかの判定
	$.fn.isOnScreen = function (elemExpand) {
		var expand = elemExpand || 0;
		var $this = $(this);
		var $window = $(window);
		if (!$this.is(":visible") ||
			$window.scrollTop() >= $this.offset().top + $this.height() + expand ||
			$window.scrollLeft() >= $this.offset().left + $this.width() + expand ||
			$window.height() + $window.scrollTop() <= $this.offset().top - expand ||
			$window.width() + $window.scrollLeft() <= $this.offset().left - expand) {
			return false;
		}
		return true;
	};
	function checkOnScreen($elements, elemExpand) {
		$elements.each(function() {
			var $this = $(this);
			elemExpand = elemExpand || $this.data("checkOnScreenExpand");
			if (!$this.isOnScreen(elemExpand)) {
				return;
			}
			$this.trigger("visible");
		});
	}
	var checkOnScreenTimer;
	var checkOnScreenCallback = function () {
		if (!checkOnScreenTimer) {
			checkOnScreenTimer = window.setTimeout(function() {
				checkOnScreenTimer = undefined;
				checkOnScreen($(".checkOnScreen"));
			}, 200);
		}
	};
	// 遅延ロード用判定メソッド
	$.fn.checkOnScreen = function (eventName, elemExpand) {
		var $checkOnScreenTarget = this;
		$checkOnScreenTarget.data("checkOnScreenExpand", elemExpand);
		if ($checkOnScreenTarget.length) {
			$(window).off("load resize scroll hashchange pageshow", checkOnScreenCallback).on("load resize scroll hashchange pageshow", checkOnScreenCallback);

			$checkOnScreenTarget.filter(":not(.checkOnScreen)").addClass("checkOnScreen").one("visible", function() {
				var $this = $(this);
				$this.removeClass("checkOnScreen");

				if (!$(".checkOnScreen").length) {
					$(window).off("load resize scroll hashchange pageshow", checkOnScreenCallback);
				}
				$this.trigger(eventName || "onscreen");
			});
			window.setTimeout(function () {
				checkOnScreen($checkOnScreenTarget);
			}, 0);
		}
		return this;
	};

	$.getCss = function (url, callback) {
		var args = {"href": url};
		if (typeof url === "object") {
			args = url;
			url = url.url;
		}
		var param = {
			rel: "stylesheet",
			type: "text/css",
			href: url
		};
		$.extend(true, param, args);
		var deferred = new $.Deferred();
		var func = function (dfd) {
			var count = 0;
			var self = function () {
				var timerId;
				var $css = $("<link>").prop(param).on("load error", function (event) {
					window.clearTimeout(timerId);
					if (event && event.type !== "error") {
						$css.off("load error");
						dfd.resolve();
					} else if (++count > window.COMMON.API_RETRY_MAX_COUNT) {
						dfd.reject("OverRetryCount");
					} else {
						$css.off("load error").remove();
						window.setTimeout(self, window.COMMON.API_RETRY_INTERVAL);
					}
				});
				var css = $css[0];
				document.head.appendChild(css);
				var num = 0;
				var check = function () {
					var cssLength = 0;
					try {
						cssLength = css.sheet.rules.length;
					}
					catch (e) {
						cssLength = 0;
					}
					if (cssLength > 0) {
						$css.trigger("load");
					} else if (num++ <= 200) {
						timerId = window.setTimeout(check, 50);
					} else {
						$css.trigger("error");
					}
				};
				check();
			};
			return self;
		};
		if (typeof callback === "function") {
			deferred.always(callback);
		}
		func(deferred)();
		return deferred.promise();
	};
	$.getCssUseAjax = function (url, callback) {
		var args = {};
		if (typeof url === "object") {
			args = url;
			url = url.url || url.href;
		}
		var param = {};
		$.extend(true, param, args);
		var deferred = new $.Deferred();
		var func = function (dfd) {
			var count = 0;
			var self = function () {
				var timerId;

				$.ajax({
					url: url,
					dataType: "text"
				}).done(function (data) {
					var $css = $("<style>").prop(param).html(data);
					$("head").append($css);
					dfd.resolve();
				}).fail(function () {
					if (++count > window.COMMON.API_RETRY_MAX_COUNT) {
						dfd.reject("OverRetryCount");
					} else {
						window.setTimeout(self, window.COMMON.API_RETRY_INTERVAL);
					}
				});
			};
			return self;
		};
		if (typeof callback === "function") {
			deferred.always(callback);
		}
		func(deferred)();
		return deferred.promise();
	};
	$.getScript = function (url, callback) {
		var args = {"src": url};
		if (typeof url === "object") {
			args = url;
			url = url.url;
		}
		var param = {
			async: true,
			src: url
		};
		$.extend(true, param, args);
		var deferred = new $.Deferred();
		var func = function (dfd) {
			var count = 0;
			var self = function() {
				var $script = $("<script>").prop(param).on("load error", function (event) {
					// load完了後でもJSファイルの初期化が終わっていない場合があるため
					// 一度スレッドを開放するためsetTimeoutする
					window.setTimeout(function () {
						if (event && event.type !== "error") {
							$script.off("load error");
							dfd.resolve();
						} else if (++count > window.COMMON.API_RETRY_MAX_COUNT) {
							dfd.reject("OverRetryCount");
						} else {
							$script.off("load error").remove();
							window.setTimeout(self, window.COMMON.API_RETRY_INTERVAL);
						}
					}, 0);
				});
				document.head.appendChild($script[0]);
			};
			return self;
		};
		if (typeof callback === "function") {
			deferred.always(callback);
		}
		func(deferred)();
		return deferred.promise();
	};

	///////////////////////////////////////////////////
	// dアニメストア特有
	///////////////////////////////////////////////////
	var getPushAvailable = function () {
		var dfd = new $.Deferred();

		var func = function (dfd) {
			var count = 0;
			var self = function() {
				var nativeBridge = window.dAnimeStoreJk;
				if (++count > window.COMMON.API_RETRY_MAX_COUNT) {
					dfd.reject("OverRetryCount");
				} else if (typeof nativeBridge !== "undefined" && typeof nativeBridge.isPushAvailable === "function") {
					var pushData = nativeBridge.isPushAvailable();
					var pushId, oldPushId;
					if (pushData) {
						try {
							pushData = JSON.parse(pushData);
							pushId = pushData.pushId;
							oldPushId = pushData.oldPushId;
						} catch (ex) {
							pushId = pushData;
						}
					}
					if (!pushId) {
						window.setTimeout(self, window.COMMON.API_RETRY_INTERVAL);
						return;
					}
					dfd.resolve(pushId, oldPushId || "");
				} else if (window.COMMON.naviDevice === "32") {
					var timer;
					if (typeof nativeBridge === "undefined") {
						nativeBridge = window.dAnimeStoreJk = function () {};
					}
					nativeBridge.pushAvailable = function (pushId, oldPushId) {
						if (timer) {
							window.clearTimeout(timer);
						}
						nativeBridge.pushAvailable = function () {};
						if (!pushId) {
							window.setTimeout(self, window.COMMON.API_RETRY_INTERVAL);
							return false;
						}
						dfd.resolve(pushId, oldPushId || "");
						return true;
					};
					timer = window.setTimeout(nativeBridge.pushAvailable, window.COMMON.API_NATIVE_TIMEOUT);
					window.location.href = "jp.co.nttdocomo.animestore.isPushAvailable://";
				} else {
					dfd.reject("NotDefinedNativeBridge");
				}
			};
			return self;
		};
		func(dfd)();

		return dfd.promise();
	};

	var registFavoriteWorkOrTagAllAfterAuth = function (idOrList, updateType, isFav) {
		registFavoriteWorkOrTagAll(idOrList, updateType, function (result) {
			if (result) {
				var classNameUi = "ui-favo" + (isFav ? "" : "Tag");
				var attrNameId = isFav ? "workid" : "tagid";
				var attrNameIdList = attrNameId + "list";
				var selectorList = $.map(idOrList, function (id) {
					return "." + classNameUi + "[data-" + attrNameId + "='" + id + "']";
				});
				selectorList.push("." + classNameUi + "[data-" + attrNameIdList + "='" + idOrList.join("_") + "']");
				var $targetAll = $(selectorList.join(","));
				if (isFav) {
					$targetAll.each(function (i, el) {
						var $target = $(el);
						var idList = $target.attr("data-" + attrNameIdList);
						if (idList) {
							idList = idList.split("_");
						}
						if (!idList) {
							var id = $target.attr("data-" + attrNameId);
							if (id) {
								idList = [id];
							}
						}
						var favoriteCount = 0;
						$.each(idList || [], function (index, workId) {
							$.each(result.favoriteCountList, function (l, val) {
								if (val.workId === workId && favoriteCount < val.favoriteCount) {
									favoriteCount = val.favoriteCount;
								}
							});
						});
						$target.closest(".actionArea, .itemModule, .favoriteButton").find(".favoriteCount span").each(function (l, elem) {
							$(elem).text(favoriteCount);
						});
					});
				}
				if (updateType === 1) {
					$targetAll.addClass("checked").prop("checked", true).trigger("checked").removeClass("needcheck");
				} else {
					$targetAll.removeClass("checked").prop("checked", false).trigger("unchecked").addClass("needcheck");
				}
			}
		}, isFav);
	};

	window.setAuthAction("add_favo", function (d) {
		registFavoriteWorkOrTagAllAfterAuth(d.id, 1, true);
	});
	window.setAuthAction("add_favo_tag", function (d) {
		registFavoriteWorkOrTagAllAfterAuth(d.id, 1, false);
	});
	window.setAuthAction("del_favo", function (d) {
		registFavoriteWorkOrTagAllAfterAuth(d.id, 2, true);
	});
	window.setAuthAction("del_favo_tag", function (d) {
		registFavoriteWorkOrTagAllAfterAuth(d.id, 2, false);
	});
	var cookieNameFavoritePushConfirm = "##fav_push_confirm";
	var cookieNameFavoriteToastShow = "##fav_toast_show";
	var cookieNameFavoriteTagPushConfirm = "##favtag_push_confirm";
	var cookieNameFavoriteTagToastShow = "##favtag_toast_show";
	var classNameFavorite = "favo";
	var classNameFavoriteTag = "favoTag";
	var attributeNameFavorite = "workid";
	var attributeNameFavoriteTag = "tagid";
	var paramKeyFavorite = "workIdList";
	var paramKeyFavoriteTag = "tagIdList";
	var registFavoriteWorkOrTag = function (idOrList, updateType, callback, isFav) {
		var endpointUrl = window.COMMON.RESTAPI_ENDPOINT.registFavorite;
		var paramKey = paramKeyFavorite;
		var cookieNamePushConfirm = cookieNameFavoritePushConfirm;
		var cookieNameToastShow = cookieNameFavoriteToastShow;
		var dialogTitle = "気になる登録";
		var dialogTextSuccess = "「気になる」登録をした作品はマイページで確認できます。（この作品に関するお知らせなどをご利用の端末にお届けします）";
		var dialogTextConfirm = "「気になる」登録をした作品はマイページで確認できます。また、登録した作品に関するお知らせなどをご利用の端末で受け取りますか？";
		var dialogTextSuccessNoPush = "「気になる」登録をした作品はマイページで確認できます。";
		var dialogTextFailed = "マイページへの登録に失敗しました";

		if (!isFav) {
			endpointUrl = window.COMMON.RESTAPI_ENDPOINT.registFavoriteTag;
			paramKey = paramKeyFavoriteTag;
			cookieNamePushConfirm = cookieNameFavoriteTagPushConfirm;
			cookieNameToastShow = cookieNameFavoriteTagToastShow;
			dialogTitle = "フォロー";
			dialogTextSuccess = "フォローした声優・アーティストの作品情報などは、お知らせページで確認できます。（この声優・アーティストに関する作品の新着情報などをご利用の端末にお届けします）";
			dialogTextConfirm = "フォローした声優・アーティストの作品情報などは、お知らせページで確認できます。また、フォローした声優・アーティストに関する作品の新着情報などをご利用の端末で受け取りますか？";
			dialogTextSuccessNoPush = "フォローした声優・アーティストはお知らせページから確認できます。";
			dialogTextFailed = "フォローに失敗しました";
		}

		if (typeof updateType === "undefined") {
			updateType = 1;
		}
		if (window.COMMON.memberStatus !== "1" && window.COMMON.naviDevice === "61") {
			window.popupLogin(null, {
				type: (updateType === 1 ? "add" : "del") + "_favo" + (isFav ? "" : "_tag"),
				data: {id: idOrList},
				timing: "load pageshow",
				delay: 100
			});

			if (typeof callback === "function") {
				callback(false);
			}
			return;
		}
		var params = {
			updateType: updateType
		};
		params[paramKey] = ($.isArray(idOrList) && idOrList.length) ? idOrList.join("_") : idOrList;

		window.COMMON.restPost(endpointUrl, params).done(function (data) {
			if (typeof callback === "function") {
				callback(data);
			}
		}).fail(function (errorCode) {
			if (typeof callback === "function") {
				callback(false);
			}
			switch (errorCode) {
			case "22": // 件数超過
				window.COMMON.showToast("上限数に達しましたので、登録できません");
				break;
			case "23": // 公開期間外
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
					type: (updateType === 1 ? "add" : "del") + "_favo" + (isFav ? "" : "_tag"),
					data: {id: idOrList},
					timing: "load pageshow",
					delay: 100
				});
				break;
			default:
				window.COMMON.showToast(dialogTextFailed);
				break;
			}
		});
	};
	window.COMMON.registFavorite = function (idOrList, updateType, callback) {
		return registFavoriteWorkOrTag(idOrList, updateType, callback, true);
	};
	window.COMMON.registFavoriteTag = function (idOrList, updateType, callback) {
		return registFavoriteWorkOrTag(idOrList, updateType, callback, false);
	};

	var registFavoriteWorkOrTagAll = function (idListOrSelector, updateType, callback, isFav) {
		var className = classNameFavorite;
		var attrNameId = attributeNameFavorite;
		if (!isFav) {
			className = classNameFavoriteTag;
			attrNameId = attributeNameFavoriteTag;
		}
		var classNameUi = "ui-" + className;

		if (typeof updateType === "undefined") {
			updateType = 1;
		}
		if (!$.isArray(idListOrSelector)) {
			var $target = $(idListOrSelector).find("." + className);
			if (updateType === 1) {
				$target = $target.filter(":not(.checked),:not(:checked)");
			} else {
				$target = $target.filter(".checked,:checked");
			}
			idListOrSelector = $.map($target, function (el) { return $(el).data(attrNameId); });
		}
		if (!$.isArray(idListOrSelector) || !idListOrSelector.length) {
			if (typeof callback === "function") {
				callback(false);
			}
			return false;
		}
		var idList = $.merge([], idListOrSelector);
		var finish = function (result) {
			if (typeof callback === "function") {
				callback(result);
			} else {
				var selectorList = $.map(idList, function (id) { return "." + classNameUi + "[data-" + attrNameId + "='" + id + "']"; });
				if (updateType === 1) {
					$(selectorList.join(",")).addClass("checked").prop("checked", true).trigger("checked");
				} else {
					$(selectorList.join(",")).removeClass("checked").prop("checked", false).trigger("unchecked");
				}
			}
		};
		registFavoriteWorkOrTag(idList, updateType, finish, isFav);
		return true;
	};
	window.COMMON.registFavoriteAll = function (idListOrSelector, updateType, callback) {
		return registFavoriteWorkOrTagAll(idListOrSelector, updateType, callback, true);
	};
	window.COMMON.registFavoriteTagAll = function (idListOrSelector, updateType, callback) {
		return registFavoriteWorkOrTagAll(idListOrSelector, updateType, callback, false);
	};

	$.fn.dASFavoriteWorkOrTagAction = function (isFav) {
		var className = classNameFavorite;
		var attrNameId = attributeNameFavorite;
		var endpointUrl = window.COMMON.RESTAPI_ENDPOINT.getMyListStatus;
		var paramKey = paramKeyFavorite;
		if (!isFav) {
			className = classNameFavoriteTag;
			attrNameId = attributeNameFavoriteTag;
			endpointUrl = window.COMMON.RESTAPI_ENDPOINT.getFavoriteTagStatus;
			paramKey = paramKeyFavoriteTag;
		}
		var classNameUi = "ui-" + className;
		var attrNameIdList = attrNameId + "list";

		var $this = this;
		var $target = $this.filter(":not(." + classNameUi + ")").each(function (index, el) {
			var $el = $(el);
			$el.addClass(classNameUi).click(function (event) {
				var $target = $(event.currentTarget);
				var idList = $target.data(attrNameIdList);
				if (idList) {
					idList = idList.split("_");
				}
				if (!idList) {
					var id = $target.data(attrNameId);
					if (id) {
						idList = [id];
					}
				}
				if (idList) {
					var selectorList = $.map(idList, function (id) { return "." + classNameUi + "[data-" + attrNameId + "='" + id + "']"; });
					if ($target.data(attrNameIdList)) {
						selectorList.push("." + classNameUi + "[data-" + attrNameId + "list='" + $target.data(attrNameIdList) + "']");
					}
					var $targetAll = $(selectorList.join(","));
					if ($target.is("input")) {
						if ($target.is(":checked")) {
							$targetAll.addClass("checked").prop("checked", true);
						} else {
							$targetAll.removeClass("checked").prop("checked", false);
						}
					} else {
						if ($target.hasClass("checked")) {
							$targetAll.removeClass("checked").prop("checked", false);
						} else {
							$targetAll.addClass("checked").prop("checked", true);
						}
					}
					if ($target.hasClass("checked")) {
						$targetAll.trigger("checked");
						registFavoriteWorkOrTagAll(idList, 1, function (result) {
							if (!result) {
								$targetAll.removeClass("checked").prop("checked", false);
								$targetAll.trigger("unchecked");
							} else {
								var $count = $targetAll.closest(".actionArea, .itemModule, .favoriteButton").find(".favoriteCount span").each(function (i, el) {
									$(el).text(parseInt($(el).text(), 10) + 1);
								});
							}
						}, isFav);
					} else {
						$targetAll.trigger("unchecked");
						registFavoriteWorkOrTagAll(idList, 2, function (result) {
							if (!result) {
								$targetAll.addClass("checked").prop("checked", true);
								$targetAll.trigger("checked");
							} else {
								var $count = $targetAll.closest(".actionArea, .itemModule, .favoriteButton").find(".favoriteCount span").each(function (i, el) {
									var favoriteCount = parseInt($(el).text(), 10);
									favoriteCount = favoriteCount > 0 ? favoriteCount - 1 : 0;
									$(el).text(favoriteCount);
								});
							}
						}, isFav);
					}
				}
				event.stopPropagation();
			});
		});
		var idList = $.map($target.filter(".needcheck"), function (val) { return $(val).attr("data-" + attrNameId) || $(val).attr("data-" + attrNameIdList); });
		if (idList.length) {
			idList = $.unique(idList);

			var paramVal = $.unique($.map(idList, function (id) {
				return id.split("_");
			})).join("_");

			window.COMMON.restGet(endpointUrl + "?" + paramKey + "=" + paramVal + ((isFav) ? "&targetFlag=10" : "")).done(function (d) {
				if (d && d.statusList) {
					$.each(idList, function (index, val) {
						var $targetAll = ((val.indexOf("_") === -1)) ? $("." + classNameUi + "[data-" + attrNameId + "='" + val + "']") :
								$("." + classNameUi + "[data-" + attrNameIdList + "='" + val + "']");
						$targetAll = $targetAll.filter(".needcheck");
						var ids = val.split("_");
						var paramName = isFav ? "workId" : "tagId";
						var trueList = $.map(ids, function (id) {
							return $.grep(d.statusList, function (value) {
								return value[paramName] === id && value.favoriteStatus === "1";
							});
						});
						if (isFav) {
							var favoriteCount = 0;
							$.each(ids, function (i, id) {
								$.each(d.statusList, function (l, value) {
									if (value.workId === id && favoriteCount < value.favoriteCount) {
										favoriteCount = value.favoriteCount;
									}
								});
							});
							$targetAll.closest(".actionArea, .itemModule, .favoriteButton").find(".favoriteCount span").each(function (i, el) {
								$(el).text(favoriteCount);
							});
						}
						if (trueList.length === ids.length) {
							$targetAll.addClass("checked").prop("checked", true);
						} else {
							$targetAll.removeClass("checked").prop("checked", false);
						}
					});
				}
				window.setTimeout(function () {
					$target.filter(".needcheck").removeClass("needcheck");
				}, 1000);
			});
		}
		return $this;
	};
	$.fn.dASFavoriteAction = function () {
		return this.dASFavoriteWorkOrTagAction(true);
	};
	$.fn.dASFavoriteTagAction = function () {
		return this.dASFavoriteWorkOrTagAction(false);
	};


	// リクエスト送信フラグ
	var SENDER_FLAG = false;
	// ユーザ履歴のサジェスト表示最大数(検索ボックスが空の場合)
	var MAX_SUGGEST_HISTORY_IF_EMPLY_INPUT = 0;
	// ユーザ履歴のサジェスト表示最大数
	var MAX_SUGGEST_HISTORY = 0;
	// 通常のサジェスト表示最大数
	var MAX_SUGGEST = 5;
	// 取得するキーワードの種別
	var SUGGEST_TYPE = 17;

	var uid = "anime";
	var suggestServer = window.suggestServer || $("#suggestServer").val() || "sug.dtv.dmkt-sp.jp";

	var suggest = function ($el) {
		var $this = $el;
		$this.autocomplete({
			minLength: 0,
			source: function (request, response) {
				var query = encodeURIComponent(this.element.val());
				if (!query || !query.length) {
					response([]);
					return;
				}
				$.ajax({
					type: "GET",
					url: "https://" + suggestServer + "/suggest?q=" + query + "&uid=" + uid + "&type=" + SUGGEST_TYPE,
					dataType: "jsonp",
					cache: false,
					success: function (data) {
						var history = data.history.slice(0, (query) ? MAX_SUGGEST_HISTORY : MAX_SUGGEST_HISTORY_IF_EMPLY_INPUT);
						var historyNum = history.length;
						history = $.map(history, function (value, key) {
							var obj = {};
							obj["label"] = "<a href=\"javascript:void(0)\">" + value.keyword_hl + "</a>";
							obj["query"] = query;
							obj["searchword"] = value.keyword;
							obj["class"] = "history";
							obj["location"] = key + 1;
							obj["historynum"] = historyNum;
							return obj;
						});
						var normal = [];
						if (query) {
							normal = $.map(data.suggestions, function (value, key) {
								var obj = {};
								obj["label"] = "<a href=\"javascript:void(0)\">" + value.keyword_hl + "</a>";
								obj["value"] = value.keyword;
								obj["query"] = query;
								obj["searchword"] = value.keyword;
								obj["class"] = "nomal";
								obj["location"] = historyNum + key + 1;
								obj["historynum"] = historyNum;
								return obj;
							});
						}
						response($.merge(history, normal).slice(0, MAX_SUGGEST));
					}
				});
			},
			select: function (event, ui) {
				if (SENDER_FLAG) {
					var item = ui.item;
					// ペイロードデータ取得
					$.ajax({
						url: "https://" + suggestServer + "/event/search/" + uid + "?payload=" +
								encodeURIComponent([encodeURIComponent(window.navigator.userAgent), item.query, item.searchword, item["class"], item.location, item.historynum].join()),
						type: "GET",
						cache: false
					});
				}
				if (event.type === "autocompleteselect") {
					window.setTimeout(function () {
						$(event.target).trigger("click-suggest");
					}, 0);
				}
			}
		});
		return $this;
	};
	$.fn.dASSuggest = function () {
		var $this = this;
		if ($this.length) {
			$.getCss(window.COMMON.EXTERNAL_URL["suggest.css"]);
			$.fn.dASSuggest = function () {
				this.filter(":not(.ui-suggest)").each(function(index, el) {
					var $el = $(el);
					$el.addClass("ui-suggest");
					suggest($el);
				});
				return this;
			};
			$this = $.fn.dASSuggest.apply(this, arguments);
		}
		return $this;
	};


	///////////////////////////////////////////////////
	// 共通関数定義
	///////////////////////////////////////////////////
	window.COMMON.numberReferenceToString = function (string) {
		return string.replace(/&#x([0-9a-f]+);/ig, function(match, $1) {
			return String.fromCharCode('0x' + $1);
		}).replace(/&#(\d+);/ig, function(match, $1) {
			return String.fromCharCode($1);
		});
	};

	window.COMMON.unescape = function (string) {
		var escapeMap = {
			"&amp;": "&",
			"&lt;": "<",
			"&gt;": ">",
			"&quot;": "\"",
			"&nbsp;": " "
		};
		string = window.COMMON.numberReferenceToString(string);
		var source = "(?:&amp;|&lt;|&gt;|&quot;|&nbsp;)";
		if (string && string.length && new RegExp(source).test(string)) {
			string = string.replace(new RegExp(source, "g"), function(match) {
				return escapeMap[match];
			});
		}
		return string;
	};

	window.COMMON.escape = function (string) {
		var escapeMap = {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			"\"": "&quot;",
			"'": "&#x27;",
			"`": "&#x60;"
		};
		var source = "(?:\&|\<|\>|\"|\'|\`)";
		if (string && string.length && new RegExp(source).test(string)) {
			string = string.replace(new RegExp(source, "g"), function(match) {
				return escapeMap[match];
			});
		}
		return string;
	};

	var parseDmktRecommendUrl = function (link) {
		var ret = {link: link};
		if (link.indexOf("?") !== -1) {
			// URLのパラメータ部分をばらす
			var param = window.COMMON.parseParams(link.slice(link.indexOf("?") + 1));
			if (param.contentURL) {
				// contentURLパラメータをURLデコードする
				var contentURL = decodeURIComponent(param.contentURL);
				var paramStr = "";
				if (contentURL.indexOf("?") !== -1) {
					// contentURLのパラメータ部分をばらす
					var p = window.COMMON.parseParams(contentURL.slice(contentURL.indexOf("?") + 1));
					ret.seriesId = p.seriesid;
					ret.seriesName = p.seriesname;
					// パラメータを削除
					delete p.seriesid;
					delete p.seriesname;
					delete p.utm_source;
					delete p.utm_medium;
					delete p.utm_campaign;
					// パラメータを再構築
					$.each(p, function (i, v) {
						if (paramStr.length > 0) {
							paramStr += "&";
						}
						paramStr += i + "=" + v;
					});
				}
				// URLエンコードし、contentURLパラメータに格納しなおす
				param.contentURL = encodeURIComponent(contentURL.slice(0, contentURL.indexOf("?") + 1) + paramStr);
			}

			// パラメータを再構築
			var paramStr2 = "";
			$.each(param, function (i, v) {
				if (paramStr2.length > 0) {
					paramStr2 += "&";
				}
				paramStr2 += i + "=" + v;
			});
			ret.link = link.slice(0, link.indexOf("?") + 1) + paramStr2;


			if (ret.seriesId && ret.seriesName) {
				param.contentURL = encodeURIComponent(window.location.protocol + "//" + window.location.host + "/animestore/series" + ((window.COMMON.naviDevice1 === "6") ? "_pc" : "") + "?seriesId=" + ret.seriesId);
				paramStr2 = "";
				$.each(param, function(i, v) {
					if (paramStr2.length > 0) {
						paramStr2 += "&";
					}
					paramStr2 += i + "=" + v;
				});
				ret.seriesLink = link.slice(0, link.indexOf("?") + 1) + paramStr2;
			}
		}
		return ret;
	};
	var parseDmktGoodsRecommendUrl = function (link) {
		var ret = {link: link};
		if (link.indexOf("?") !== -1) {
			var contentURL = link;
			var paramStr = "";
			if (contentURL.indexOf("?") !== -1) {
				// contentURLのパラメータ部分をばらす
				var p = window.COMMON.parseParams(contentURL.slice(contentURL.indexOf("?") + 1));
				ret.seriesId = p.seriesid;
				ret.seriesName = p.seriesname;
				// パラメータを削除
				delete p.seriesid;
				delete p.seriesname;
				delete p.utm_source;
				delete p.utm_medium;
				delete p.utm_campaign;
				// パラメータを再構築
				$.each(p, function (i, v) {
					if (paramStr.length > 0) {
						paramStr += "&";
					}
					paramStr += i + "=" + v;
				});
			}
			// パラメータを再構築
			ret.link = contentURL.slice(0, contentURL.indexOf("?") + 1) + paramStr;

			if (ret.seriesId && ret.seriesName) {
				ret.seriesLink = window.location.protocol + "//" + window.location.host + "/animestore/series" + ((window.COMMON.naviDevice1 === "6") ? "_pc" : "") + "?seriesId=" + ret.seriesId;
			}
		}
		return ret;
	};
	window.COMMON.restGet = function (url) {
		var deferred = new $.Deferred();
		var func = function (dfd) {
			var args = {"url": url};
			if (typeof url === "object") {
				args = url;
				url = url.url;
			}
			var param = {
				type: "get",
				// contentType: "application/json",
				dataType: "json",
				async: true,
				cache: false,
				timeout: window.COMMON.API_WEB_TIMEOUT
			};
			if ($.map(window.COMMON.RESTAPI_JSONP_ENDPOINT, function (property) {if (url.indexOf(property) === 0) { return true; }}).length) {
				$.extend(true, param, {
					dataType: "jsonp",
					jsonp: "callback",
					jsonpCallback: "jsonpCallback" + Math.random().toString().slice(2)
				});
			}
			$.extend(true, param, args);
			var count = 0;
			var self = function() {
				if (!param || !param.url) {
					window.setTimeout(function () {
						dfd.reject("empty url");
					}, 0);
					return;
				}
				$.ajax(param).done(function (data) {
					data = data || {}; //dataがnullの場合の回避
					if ($.map(window.COMMON.RESTAPI_NEW_ENDPOINT, function (property) {if (url.indexOf(property) === 0) { return true; }}).length) {
						if ((data.resultCd === "00" || data.resultCd === "01") && data.data) {
							dfd.resolve(data.data);
						} else {
							dfd.reject((data.error) ? data.error.code : "EmptyData");
						}
					} else if ($.map(window.COMMON.RESTAPI_DMKT_RECOMMEND_ENDPOINT, function (property) {if (url.indexOf(property) === 0) { return true; }}).length) {
						if (data.DcmstoreInfo && data.DcmstoreInfo.Anime && data.DcmstoreInfo.Anime.List) {
							var dataList = data.DcmstoreInfo.Anime.List;
							var workIdList = "";
							var isNeedUserInfo = url.indexOf("exNeedUserInfo=1") !== -1;
							var isNeedSeries = url.indexOf("exNeedSeries=1") !== -1;
							if (window.COMMON.memberStatus === "1") {
								$.each(dataList, function (index, val) {
									if (val.AnimeId) {
										if (workIdList.length) {
											workIdList += "_";
										}
										workIdList += val.AnimeId;
									}
								});
							}
							var watchedDf = new $.Deferred();

							if (workIdList) {
								window.COMMON.restGet(window.COMMON.RESTAPI_ENDPOINT.getAlreadyPartList + "?workPartIdList=" + workIdList).done(function (d) {
									var p = {};
									if (d && d.workPartList) {
										$.each(d.workPartList, function(index, val) {
											p[val.workPartId] = val.viewed;
										});
									}
									watchedDf.resolve(p);
								}).fail(function () {
									watchedDf.resolve({});
								});
							} else {
								watchedDf.resolve({});
							}
							watchedDf.always(function (watchStatus) {
								dataList = $.grep(dataList, function (val) { return watchStatus[val.AnimeId] !== "1"; });

								for (var i = 0, len = dataList.length; i < len; i++) {
									var targetData = dataList[i];
									if (targetData.isIntegrated) {
										continue;
									}
									var parseMethod = url.indexOf(window.COMMON.RESTAPI_ENDPOINT.jsonpDmktGoodsRecommend) === 0 ? parseDmktGoodsRecommendUrl : parseDmktRecommendUrl;
									var params = targetData.params = targetData.params || parseMethod(targetData.GoodsUrl);
									targetData.GoodsUrl = params.link;
									if (isNeedSeries) {
										var seriesId = params.seriesId;
										var seriesName = decodeURIComponent(params.seriesName);
										var seriesLink = params.seriesLink;
										if (seriesId && seriesName) {
											var isIntegrated = false;
											for (var l = i + 1; l < len; l++) {
												var compData = dataList[l];
												if (compData.isIntegrated) {
													continue;
												}
												params = compData.params = compData.params || parseMethod(compData.GoodsUrl);
												if (seriesId === params.seriesId) {
													isIntegrated = true;
													compData.isIntegrated = true;
												}
											}
											if (isIntegrated) {
												targetData.isSeries = true;
												targetData.seriesId = seriesId;
												targetData.seriesName = seriesName;
												targetData.seriesLink = seriesLink;
												targetData.mainKeyVisualPath = "https://cs1.anime.dmkt-sp.jp/" + (window.location.host.indexOf("dev") === 0 ? "dev-" : "") + "anime_kv/img/S/" + seriesId.slice(1) + "/" + seriesId + "_1_1.png";
											}
										}
									}
								}
								dataList = $.grep(dataList, function (val) { return val.isIntegrated !== true; });

								workIdList = "";
								if (isNeedUserInfo) {
									$.each(dataList, function (index, val) {
										if (!val.isSeries && val.AnimeId) {
											if (workIdList.length) {
												workIdList += "_";
											}
											workIdList += val.AnimeId;
										}
									});
								}

								var myListDf = new $.Deferred();
								if (workIdList) {
									window.COMMON.restGet(window.COMMON.RESTAPI_ENDPOINT.getMyListStatus + "?targetFlag=10&workIdList=" + workIdList).done(function (d) {
										var p = {};
										if (d && d.statusList) {
											$.each(d.statusList, function(index, val) {
												p[val.workId] = [val.favoriteStatus, val.favoriteCount];
											});
										}
										myListDf.resolve(p);
									}).fail(function () {
										myListDf.resolve({});
									});
								} else {
									myListDf.resolve({});
								}
								myListDf.always(function (myListStatus) {
									var ret = {
										title: "みんなはこんな作品を観ています",
										maxCount: dataList.length,
										count: dataList.length
									};
									var list = [];
									$.each(dataList, function(index, val) {
										var status = myListStatus[val.AnimeId] || [];

										var pushData = val.isSeries === true ? {
											itemType: "series",
											seriesId: val.seriesId,
											seriesInfo: {
												seriesName: val.seriesName,
												mainKeyVisualAlt: val.seriesName,
												link: val.seriesLink,
												mainKeyVisualPath: val.mainKeyVisualPath
											}
										} : {
											itemType: "work",
											workId: val.AnimeId,
											workInfo: {
												workTitle: val.AnimeName,
												workExp: val.Introduction,
												workCatch: val.CatchCopy || val.CopyRight,
												mainKeyVisualAlt: val.AnimeName,
												link: val.GoodsUrl,
												mainKeyVisualPath: val.ImageUrl,
												favoriteCount: status[1] || 0
											},
											userInfo: {
												memberFlags: (status[0] === "1") ? ["favorite"] : undefined
											}
										};
										list.push(pushData);
									});
									ret[isNeedSeries ? "itemList" : "workList"] = list;
									dfd.resolve(ret);
								});
							});
						} else {
							dfd.reject("unknown");
						}
					} else {
						dfd.resolve(data);
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
	window.COMMON.restPost = function (url, json) {
		var deferred = new $.Deferred();
		var func = function (dfd) {
			var args = (typeof url === "string") ? {"url": url, "data": JSON.stringify(json)} : url;
			var param = $.extend({
				type: "post",
				contentType: "application/json",
				dataType: "json",
				cache: false,
				async: true,
				timeout: window.COMMON.API_WEB_TIMEOUT
			}, args);
			var count = 0;
			var self = function() {
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

	var showDialogQueue = [];
	window.COMMON.showDialog = function (param) {
		if (!showDialogQueue && typeof $.showDialog === "function") {
			$.showDialog(param);
			window.COMMON.showDialog = $.showDialog;
		} else if (showDialogQueue) {
			if (!showDialogQueue.length) {
				window.setTimeout(function () {
					$.getCss(window.COMMON.EXTERNAL_URL["modal.css"]);
					$.getScript(window.COMMON.EXTERNAL_URL["modal-general.js"]).done(function () {
						$.showDialog = $.showDialog || window.jQuery.showDialog;
						while (showDialogQueue.length) {
							var val = showDialogQueue.shift();
							$.showDialog(val);
						}
						window.COMMON.showDialog = $.showDialog;
						showDialogQueue = undefined;
					}).fail(function () {
						showDialogQueue = undefined;
					});
				}, 0);
			}
			if (showDialogQueue && typeof showDialogQueue.push === "function") {
				showDialogQueue.push(param);
			}
		}
	};
	var toastQueue = [];
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
	var loadingQueue = [];
	window.COMMON.showLoading = function (isShow, isforce) {
		if (!loadingQueue && typeof $.showLoading === "function") {
			$.showLoading(isShow, isforce);
			window.COMMON.showLoading = $.showLoading;
		} else if (loadingQueue) {
			if (!loadingQueue.length) {
				window.setTimeout(function () {
					$.getCss(window.COMMON.EXTERNAL_URL["modal.css"]);
					$.getScript(window.COMMON.EXTERNAL_URL["modal-general.js"]).done(function () {
						$.showLoading = $.showLoading || window.jQuery.showLoading;
						while (loadingQueue.length) {
							var val = loadingQueue.shift();
							$.showLoading(val[0], val[1]);
						}
						window.COMMON.showLoading = $.showLoading;
						loadingQueue = undefined;
					}).fail(function () {
						loadingQueue = undefined;
					});
				}, 0);
			}
			if (loadingQueue && typeof loadingQueue.push === "function") {
				loadingQueue.push([isShow, isforce]);
			}
		}
	};

	if (typeof $.fn.transition !== "function" || typeof $.fn.transitionStop !== "function") {

		var runOrQueue = (function () {
			var transitionQueue = [];
			return function (callback) {
				if (typeof callback !== "function") {
					return;
				}
				if (transitionQueue) {
					if (!transitionQueue.length) {
						$.getScript(window.COMMON.EXTERNAL_URL["jquery.transit.min.js"]).done(function () {
							var queue = transitionQueue;
							transitionQueue = undefined;
							$.cssEase["ease-in-out"] = "cubic-bezier(0.42, 0, 0.58, 1)";
							while (queue && queue.length) {
								var func = queue.shift();
								func();
							}
						}).fail(function () {
							transitionQueue = undefined;
						});
					}
					if (typeof transitionQueue.push === "function") {
						transitionQueue.push(callback);
					}
				} else {
					// $.getScript完了後でもJSファイルの初期化が終わっていない場合があり
					// スタックオーバーフローにならないように一度スレッドを開放するためrequestAnimationFrameする
					requestAnimationFrame(callback, 0);
				}
			};
		})();


		$.fn.transition = $.fn.transit = function (properties, duration, easing, callback) {
			var $this = this;
			var delay = 0;
			var queue = true;

			var theseProperties = $.extend(true, {}, properties);
			if (typeof duration === 'function') {
				callback = duration;
				duration = undefined;
			}
			if (typeof duration === 'object') {
				easing = duration.easing;
				delay = duration.delay || 0;
				queue = typeof duration.queue === "undefined" ? true : duration.queue;
				callback = duration.complete;
				duration = duration.duration;
			}
			if (typeof easing === 'function') {
				callback = easing;
				easing = undefined;
			}
			if (typeof theseProperties.easing !== 'undefined') {
				easing = theseProperties.easing;
				delete theseProperties.easing;
			}

			if (typeof theseProperties.duration !== 'undefined') {
				duration = theseProperties.duration;
				delete theseProperties.duration;
			}

			if (typeof theseProperties.complete !== 'undefined') {
				callback = theseProperties.complete;
				delete theseProperties.complete;
			}

			if (typeof theseProperties.queue !== 'undefined') {
				queue = theseProperties.queue;
				delete theseProperties.queue;
			}

			if (typeof theseProperties.delay !== 'undefined') {
				delay = theseProperties.delay;
				delete theseProperties.delay;
			}
			var options = {
				easing: easing,
				delay: delay,
				queue: queue,
				complete: callback,
				duration: duration
			};

			if (queue) {
				var complete = options.complete;
				if (options.queue) {
					$.extend(true, theseProperties, {
						queue: false
					});
					$.extend(true, options, {
						complete: function () {
							if (typeof complete === "function") {
								complete.apply(this, arguments);
							}
							$(this).dequeue();
						}
					});
				}
				$this.queue(function () {
					runOrQueue(function () {
						$this.transition(theseProperties, options);
					});
				});
			} else {
				runOrQueue(function () {
					$this.transition(theseProperties, options);
				});
			}

			return $this;
		};
		$.fn.transitionStop = $.fn.transitStop = function (clearQueue, jumpToEnd) {
			var $this = this;
			var func = function () {
				$this.transitionStop(clearQueue, jumpToEnd);
			};
			runOrQueue(func);
			return $this;
		};
	}

	var initJqUi = function () {
		$("head").append("<style type=\"text/css\">.ui-helper-hidden-accessible{display: none;}.ui-autocomplete{position: absolute;}</style>");
		$.ui.autocomplete.prototype._renderItem = function (ul, item) {
			return $("<li>" + item.label + "</li>").appendTo(ul);
		};
		var _super = $.ui.autocomplete.prototype;
		$.widget("ui.autocomplete", $.ui.autocomplete, {
			_create: function () {
				$.extend(true, this.options, {
					position: {
						my: "left top",
						at: "left bottom",
						of: this.element.parent(),
						collision: "none"
					}
				});
				_super._create.apply(this, arguments);
			},
			_resizeMenu: function () {
				var margin = parseInt(this.element.css("marginLeft"), 10);
				var $ul = this.menu.element;
				$ul.outerWidth(this.element.parent().outerWidth());
				$ul.find("li").css("padding", "0 " + margin + "px");
			}
		});
	};
	if (typeof $.fn.tooltip !== "function" || typeof $.fn.autocomplete !== "function") {
		var jquiQueue = [];
		$.fn.tooltip = function () {
			if (!jquiQueue.length) {
				var func = function () {
					initJqUi();
					$.each(jquiQueue, function(index, val) {
						$.fn.tooltip.apply(val[0], val[1]);
					});
					jquiQueue = undefined;
				};
				window.setTimeout(function () {
					$.getScript(window.COMMON.EXTERNAL_URL["jquery-ui.min.js"], func);
				}, 0);
			}
			if (jquiQueue && typeof jquiQueue.push === "function") {
				jquiQueue.push([this, arguments]);
			}
			return this;
		};
		$.fn.autocomplete = function () {
			if (!jquiQueue.length) {
				var func = function () {
					initJqUi();
					$.each(jquiQueue, function(index, val) {
						$.fn.autocomplete.apply(val[0], val[1]);
					});
					jquiQueue = undefined;
				};
				window.setTimeout(function () {
					$.getScript(window.COMMON.EXTERNAL_URL["jquery-ui.min.js"], func);
				}, 0);
			}
			if (jquiQueue && typeof jquiQueue.push === "function") {
				jquiQueue.push([this, arguments]);
			}
			return this;
		};
	} else {
		initJqUi();
	}


	window.COMMON.filterBannerData = function (banners, callback) {
		var ret = new $.Deferred();
		if (banners && banners.length) {
			var isMember = window.COMMON.memberStatus === "1";
			banners = $.grep(banners, function (val) {
				if (isMember && val.member === 0) { // 会員の場合は会員フラグ○以外は除外
					return false;
				} else if (!isMember && val.nonmember === 0) { // 非会員の場合は非会員フラグ○以外は除外
					return false;
				}

				if ((naviDevice === "11" || naviDevice === "21") && val.androidbrowser === 0) { // dMarketブラウザ/Androidブラウザの場合はAndroidブラウザフラグ○以外は除外
					return false;
				} else if (naviDevice === "31" && val.iOSbrowser === 0) { // iOSブラウザの場合はiOSブラウザフラグ○以外は除外
					return false;
				} else if (naviDevice === "12" && val.dmarketapp === 0) { // dMarketアプリの場合はdMarketブラウザフラグ○以外は除外
					return false;
				} else if (naviDevice === "22" && val.androidapp === 0) { // Androidアプリの場合はAndroidアプリフラグ○以外は除外
					return false;
				} else if (naviDevice === "32" && val.iOSapp === 0) { // iOSアプリの場合はiOSアプリフラグ○以外は除外
					return false;
				} else if ((naviDevice1 === "4" || naviDevice1 === "5" || naviDevice1 === "6") && val.PC === 0) { // その他の場合はPCフラグ○以外は除外
					return false;
				}
				return true;
			});

			// 長期会員判定
			var deferredList = [];
			var dfd = new $.Deferred();
			if (isMember && $.grep(banners, function (val) {return val.member === 1 && ((val.onlyOver3monthsMember ^ val.onlyUnder3monthsMember) === 1); }).length) {
				var url = window.COMMON.RESTAPI_ENDPOINT.memberContinuationDuration || window.apiUrl + "WS100110";
				window.COMMON.restGet(url).done(function (d) {
					dfd.resolve(d && d.days && parseInt(d.days, 10) > 90);
				}).fail(function () {
					dfd.resolve(false);
				});
				dfd.promise();
			} else {
				dfd.resolve(false).promise();
			}
			dfd.done(function (isOver3months) {
				banners = $.grep(banners, function (val) {
					if (isMember && !isOver3months && val.onlyOver3monthsMember === 1) {
						return false;
					} else if (isMember && isOver3months && val.onlyUnder3monthsMember === 1) {
						return false;
					}
					return true;
				});
			});
			deferredList.push(dfd);
			// 長期会員判定ここまで

			// キャンペーン応募判定
			var campaignIdList = [];
			$.each(banners, function (i, val) {
				var campaignId = val.onlyAppliedCampaign || val.notAppliedCampaign || val.onlyWinCampaign;
				if (campaignId) {
					campaignIdList = campaignIdList.concat(campaignId.split(","));
				}
			});
			campaignIdList = $.unique(campaignIdList);


			var deferred = new $.Deferred();
			window.COMMON.restGet(window.COMMON.RESTAPI_ENDPOINT.judgeCampaignEntry + "?campaignId=" + campaignIdList.join("_")).done(function (data) {
				if (data && data.campaignList) {
					$.each(data.campaignList, function (i, campaign) {
						var id = campaign.campaignId;
						var isWin = campaign.result === "0";
						var isApplied = campaign.possibility === "9";

						$.each(banners, function (l, val) {
							if (isMember && isApplied && typeof val.onlyAppliedCampaign === "string") { // 会員かつ、応募済みかつ、応募済みのみ設定されている場合
								if (val.onlyAppliedCampaign.split(",").indexOf(id) !== -1) {
									delete val.onlyAppliedCampaign; // 応募済みのみ設定を削除する
								}
							}
							if (isMember && !isApplied && typeof val.notAppliedCampaign === "string") { // 会員かつ、未応募かつ、未応募のみ設定されている場合
								if (val.notAppliedCampaign.split(",").indexOf(id) !== -1) {
									delete val.notAppliedCampaign; // 未応募のみ設定を削除する
								}
							}

							if (isMember && isWin && typeof val.onlyWinCampaign === "string") { // 会員かつ、当選かつ、当選のみ設定されている場合
								if (val.onlyWinCampaign.split(",").indexOf(id) !== -1) {
									delete val.onlyWinCampaign; // 当選のみ設定を削除する
								}
							}
						});
					});
				}
				deferred.resolve();
			}).fail(function () {
				deferred.resolve();
			});

			deferred.done(function () {
				banners = $.grep(banners, function (val) {
					return !val.onlyAppliedCampaign && !val.notAppliedCampaign && !val.onlyWinCampaign; // 応募済みのみ設定、未応募のみ設定、当選のみ設定がすべて存在しないものはtrue
				});
			});
			deferredList.push(deferred);
			// キャンペーン応募判定ここまで

			$.when.apply(this, deferredList).done(function () {
				ret.resolve(banners);
				if (typeof callback === "function") {
					callback(banners);
				}
			});
		} else {
			ret.resolve(banners);
			if (typeof callback === "function") {
				callback(banners);
			}
		}

		return ret.promise();
	};
	window.COMMON.getBannerData = function (url, callback) {
		var ret = new $.Deferred();
		window.COMMON.restGet(url).done(function (banners) {
			window.COMMON.filterBannerData(banners, callback).done(function (data) {
				ret.resolve(data);
			}).fail(function () {
				ret.resolve(); // ここに来るパスはない
			});
		}).fail(function () {
			ret.resolve();
		});
		return ret.promise();
	};

	///////////////////////////////////////////////////
	// 共通処理
	///////////////////////////////////////////////////
	window.doLogin = function (loginParams, authActionParams) {
		if (typeof authActionParams === "object") {
			window.saveAuthActionData(authActionParams);
		}
		loginParams = loginParams || {};
		window.location.href = "/animestore/login?nextUrl=" + encodeURIComponent(loginParams.nextUrl || loginParams.next_url || loginParams.referer || window.location.href);
	};
	// PCログインボタン押下処理
	window.popupLogin = function (loginParams, authActionParams, forcePopup) {
		if (naviDevice1 === "6" && forcePopup !== false) { // PCの場合、かつforcePopupがfalseでなければ、ログインポップアップを出す

			window.name = "danimewindow";

			var userAgent = window.navigator.userAgent.toLowerCase();
			var appVersion = window.navigator.appVersion.toLowerCase();

			var features = "location=no, menubar=no, status=yes, scrollbars=yes, resizable=yes, toolbar=no";

			if (userAgent.indexOf("msie") !== -1 && appVersion.indexOf("msie 9.") !== -1) {
				features += ", width=1000, height=610";
			} else {
				features += ", width=480, height=580";
			}
			var defaultParams = {
				popupFlag: 1,
				noParentReload: 0
			};
			var params = "";
			loginParams = loginParams || {};
			loginParams = $.extend(defaultParams, loginParams, {nextUrl: loginParams.nextUrl || loginParams.next_url || loginParams.referer});
			delete loginParams.next_url;
			delete loginParams.referer;
			$.each(loginParams, function (key, val) {
				if (params.length) {
					params += "&";
				}
				params += key + "=" + encodeURIComponent(val);
			});
			window.saveAuthActionData(authActionParams);
			var win = window.open("/animestore/login?" + params, "popuplogin", features);
			if (win === null && forcePopup !== true) { // Windowの生成が失敗した場合、forcePopupがtrueでなければ、ログイン画面に遷移する対応を行う
				window.doLogin(loginParams);
			}
		} else { // PCではない場合、またはforcePopupがfalseの場合はログイン画面に遷移する対応を行う
			window.doLogin(loginParams, authActionParams);
		}
		return false;
	};
	window.appLogin = window.applogin = function (loginParams, authActionParams, forcePopup) {
		if (naviDevice === "11" || naviDevice === "21" || naviDevice === "31") {
			loginParams = loginParams || {};
			window.location.href = "/animestore/dapp_warn?next_url=" + encodeURIComponent(loginParams.nextUrl || loginParams.next_url || loginParams.referer || window.location.href);
		} else {
			window.popupLogin(loginParams, authActionParams, forcePopup);
		}
		return false;
	};

	// ダイレクト再生
	var playMovieCallbackQueue = [];
	var loadPlayMovie = function (callback) {
		if (typeof window.contentPlay === "function") {
			if (typeof callback === "function") {
				callback();
			}
		} else if (playMovieCallbackQueue) {
			if (!playMovieCallbackQueue.length) {
				window.setTimeout(function () {
					$.getScript(window.COMMON.EXTERNAL_URL["PlayMovie.js"]).done(function () {
						$.each(playMovieCallbackQueue, function(index, val) {
							if (typeof val === "function") {
								val();
							}
						});
					}).fail(function () {
						playMovieCallbackQueue = undefined;
					});
				}, 0);
			}
			if (playMovieCallbackQueue && typeof playMovieCallbackQueue.push === "function") {
				playMovieCallbackQueue.push(callback);
			}
		}

	};
	window.setAuthAction("play_movie", function (d) {
		window.COMMON.contentPlay(d.partId, d.bitrate, d.viewType, d.position);
	});
	window.COMMON.contentPlay = function (partId, bitrate, viewType, position) {
		if (!partId) {
			return;
		}
		if ((partId && partId.indexOf("C") === 0) || window.COMMON.memberStatus === "1" || (window.COMMON.sugotokuMemberStatus === "1" && window.location.pathname.indexOf("/sugotoku/") === 0) || window.COMMON.naviDevice === "61") { // PCの場合はPlayMovie.jsでログイン処理を行う(ログインWindow再利用するため)
			loadPlayMovie(function () {
				window.contentPlay(partId, bitrate, viewType, position);
			});
		} else {
			window.applogin(null, {
				type: "play_movie",
				data: {partId: partId, bitrate: bitrate, viewType: viewType, position: position},
				timing: "load pageshow",
				delay: 1000
			});
		}
	};
	window.setAuthAction("play_list", function (d) {
		window.COMMON.playlistPlay(d.playlistId, d.partId, d.playlistIndex, d.bitrate);
	});
	window.COMMON.playlistPlay = function (playlistId, partId, playlistIndex, bitrate) {
		if (!playlistId) {
			return;
		}
		if ((partId && partId.indexOf("C") === 0) || window.COMMON.memberStatus === "1" || (window.COMMON.sugotokuMemberStatus === "1" && window.location.pathname.indexOf("/sugotoku/") === 0) || window.COMMON.naviDevice === "61") { // PCの場合はPlayMovie.jsでログイン処理を行う(ログインWindow再利用するため)
			loadPlayMovie(function () {
				window.playlistPlay(playlistId, partId, playlistIndex, bitrate);
			});
		} else if (!partId) {
			window.COMMON.restGet(window.COMMON.RESTAPI_ENDPOINT.getPlaylistPartList + "?length=1&playlistId=" + playlistId).always(function (json) {
				if (json && json.playlistInfo && json.playlistInfo.partList && json.playlistInfo.partList[0] && json.playlistInfo.partList[0].workId && json.playlistInfo.partList[0].workId.indexOf("C") !== 0) {

					// ログイン後のアクションを設定する
					window.applogin(null, {
						type: "play_list",
						data: {playlistId: playlistId, partId: partId, playlistIndex: playlistIndex, bitrate: bitrate},
						timing: "load pageshow",
						delay: 1000
					});
				} else {
					loadPlayMovie(function () {
						window.playlistPlay(playlistId, partId, playlistIndex, bitrate);
					});
				}
			});
		} else {
			window.applogin(null, {
				type: "play_list",
				data: {playlistId: playlistId, partId: partId, playlistIndex: playlistIndex, bitrate: bitrate},
				timing: "load pageshow",
				delay: 1000
			});
		}
	};
	$.fn.directDownload = function () {
		return this.directPlay(true);
	};
	$.fn.directPlay = function (isDownload) {
		// ダイレクト再生時の画質(1:ふつう、2:きれい、3:すごくきれい)
		var movieBitrate = window.COMMON.cookieMap.last_play_bitrate_cd || 2;
		var $this = this;
		var checkAnisong = function (partid, callback) {
			var url = (partid.indexOf("C") === 0) ? window.COMMON.RESTAPI_ENDPOINT.limitedPartInfo : window.COMMON.RESTAPI_ENDPOINT.partInfo;
			window.COMMON.restGet(url + "?partId=" + partid).done(function (json) {
				if (json && json.workTypeList && json.workTypeList.indexOf("music") >= 0) {
					callback(true);
				} else {
					callback(false);
				}
			}).fail(function () {
				callback(false);
			});
		};
		var className = (isDownload) ? "directDownload" : "directPlay";
		$this.filter(":not(." + className + "Ready)").each(function (index, el) {
			var $el = $(el).removeClass(className);
			var partId = $el.attr("data-partid");
			var workId = $el.attr("data-workid");
			var isMusic = $el.attr("data-ismusic") === "true";
			var isAnime = $el.attr("data-isanime") === "true";
			var position = $el.attr("data-position");
			var isNotrans = $el.attr("data-notrans") === "true";
			var isForcelogin = $el.attr("data-forcelogin") === "true";
			var b = $el.attr("data-bitrate") || movieBitrate;
			var viewType = undefined;

			if (isDownload) {
				isNotrans = true;
				viewType = "1";
			}

			if (!partId && !workId) {
				var url = $el.attr("href") || "";
				matches = url.match(/\?partId\=([C|\d]\d{7})$/);
				partId = (matches && matches.length === 2) ? matches[1] : "";
				if (partId) {
					workId = partId.slice(0, 5);
				} else {
					matches = url.match(/\?workId\=([C|\d]\d{4})$/);
					workId = (matches && matches.length === 2) ? matches[1] : "";
					partId = workId + "001";
				}
			} else if (!partId) {
				partId = workId + "001";
			} else if (!workId) {
				workId = partId.slice(0, 5);
			}

			if (workId.length === 5 && partId.length === 8) {
				var part = partId.slice(5);
				var isFreePart = partId.indexOf("C") === 0;
				var isMember = window.COMMON.memberStatus === "1";
				var isSugotokuMember = window.COMMON.sugotokuMemberStatus === "1" && window.location.pathname.indexOf("/sugotoku/") === 0;
				var setDirectPlayFunc = function ($element, isTrans) {
					loadPlayMovie();
					$element.addClass(className + "Ready").click(function () {
						window.COMMON.contentPlay(partId, b, viewType, position);
						return isTrans;
					});
				};
				var setTransitionPlayFunc = function ($element) {
					$element.addClass(className + "Ready").click(function () {
						var callback = function (isAnisong) {
							var cd = "cd";
							if (isFreePart) {
								cd = cd + "_l";
							}
							if (isAnisong) {
								cd = "m" + cd;
							}

							var pathBase = "/animestore/" + cd + ((isFreePart) ? "?fR090003S004_view" : "?fR030003S004_view");
							var href = pathBase + "&clickButtonShubetsu=1" + b + "&partId=" + partId + "&goodsId=P" + workId + "0" + part +
									"&serviceId=anime.dmkt-sp.jp&contentId=anime.dmkt-sp.jp" + partId + "&ppCd=11";
							if (position) {
								href += "&startPosition=" + position;
							}
							window.location.href = href;
						};
						if (isAnime || isMusic) {
							callback(!isAnime || isMusic);
						} else {
							checkAnisong(partId, callback);
						}
						return false;
					});
				};
				if (window.COMMON.naviDevice2 === "2" && (isFreePart || isMember || isSugotokuMember)) {
					if (isNotrans || isSugotokuMember) {
						setDirectPlayFunc($el, false);
					} else {
						setTransitionPlayFunc($el);
					}
				} else if (window.COMMON.naviDevice1 === "6" && (isFreePart || isMember || isSugotokuMember)) {
					setDirectPlayFunc($el, !isNotrans);
				} else if (isForcelogin) {
					setDirectPlayFunc($el, false);
				}
			}
		});
		return $this;
	};

	$.fn.flickDownload = function () {
		var $this = this;
		if (naviDevice2 === "2" && /^\/animestore\/m?c(d|i)/.test(window.location.pathname) && !window.COMMON.isLegacySp && window.COMMON.osVer.indexOf("android4") < 0) {
			var $downloadTarget = $this.filter(function () { return /c(d|i)(_pc)?.*?partId\=\d{8}/.test(this.href) && !$(this).closest(".itemModule").is(".flickDownloadReady"); });
			$downloadTarget.each(function (index, element) {
				var partid = element.href.replace(/^.*?c(?:d|i)(?:_pc)?.*?partId\=(\d{8}).*?$/, "$1");
				$(element).closest(".itemModule").attr("data-partid", partid);
			});

			var _ = window.COMMON.pointerEvent;
			var normalizeEvent = function (e) {
				var tmpEvent = e.originalEvent && e.originalEvent.changedTouches && e.originalEvent.changedTouches.length ? e.originalEvent.changedTouches[0] : e;
				e.clientX = e.clientX || tmpEvent.clientX;
				e.clientY = e.clientY || tmpEvent.clientY;
				e.pageX = e.pageX || tmpEvent.pageX;
				e.pageY = e.pageY || tmpEvent.pageY;
				e.screenX = e.screenX || tmpEvent.screenX;
				e.screenY = e.screenY || tmpEvent.screenY;
				e.identifier = e.identifier || tmpEvent.identifier || 0;
			};
			var NOANIME_PARAMS = {duration: 0};
			var getPurchasedState = function (partId, saleConditionCd) {
				var dfd = new $.Deferred();
				if (saleConditionCd === "1") {
					if (window.COMMON.memberStatus === "1") {
						window.COMMON.restGet({url: window.COMMON.RESTAPI_ENDPOINT.getPurchasedState + "?partId=" + partId}).done(function (d) {
							dfd.resolve(d.purchasedState === "1");
						}).fail(function () {
							dfd.resolve(false);
						});
					} else {
						dfd.resolve(false);
					}
				} else {
					dfd.resolve(true);
				}
				return dfd.promise();
			};
			var getPartData = function (partId) {
				partId = String(partId);
				var url = window.apiUrl + "v1/parts/" + partId;
				var dfd = new $.Deferred();
				window.COMMON.restGet({url: url, async: true}).done(function (json) {
					if (("status_code" in json) === false) {
						dfd.resolve(json);
					} else {
						dfd.reject();
					}
				}).fail(function () {
					dfd.reject();
				});
				return dfd.promise();
			};
			var pushDataLayer = function (partId, isSelect) {
				dataLayer && typeof dataLayer.push === "function" && dataLayer.push({
					"event": "swipeDownload",
					"eventCategory": "再生",
					"eventAction": (isSelect ? "画質選択DL" : "簡単DL"),
					"eventLabel": partId
				});
			};

			var downloadingId;
			var setFlickDownloadFlag = function (partId) {
				downloadingId = partId;
				window.setTimeout(function () {
					downloadingId = undefined;
				}, 2000);
			};
			var isDownloading = function (partId) {
				return partId === downloadingId;
			};

			var movieBitrateTextList = ["ふつう", "きれい", "<nobr>すごく<wbr>きれい</nobr>", "<nobr>HD<wbr>画質</nobr>"];
			var movieBitrateNameList = ["normal", "good", "veryGood", "hd"];
			$downloadTarget = $downloadTarget.closest(".itemModule").addClass("flickDownloadReady").wrap("<div class=\"downloadWrapper\"></div>");
			$downloadTarget.on(_.addLabel(_.addMouseEventName(_.start), ".dlmode"), function (startEvent) {
				if (window.innerWidth >= window.COMMON.THRESHOLD) {
					return;
				}
				normalizeEvent(startEvent);
				var $list = $(startEvent.target).closest(".itemModule");

				if (isDownloading($list.attr("data-partid"))) {
					return;
				}

				var id = startEvent.identifier;
				if (typeof $("body").data("touchIdentifier") !== "undefined" || typeof $list.data("touchIdentifier") !== "undefined" || $list.hasClass("edit")) { // １つのみに制限
				// if (typeof $list.data("touchIdentifier") !== "undefined" || $list.hasClass("edit")) {
					return;
				}
				var $button1 = $list.closest(".downloadWrapper").find(".downloadButton .level1");
				var $button2 = $list.closest(".downloadWrapper").find(".downloadButton .level2");
				$list.data("touchIdentifier", id);
				$("body").data("touchIdentifier", id); // １つのみに制限
				var basePos = [startEvent.pageX, startEvent.pageY];
				var listEl = $list[0];
				$list.removeData("startTime");

				var width = $list.width();
				var level1Threshold = width / 3;
				var level2Threshold = width * 3 / 4;
				var scrollThreshold = 40;

				$(window).on(_.addLabel(_.addMouseEventName(_.move), ".drag.dlmode" + id), function (moveEvent) {
					if (moveEvent.originalEvent && moveEvent.originalEvent.movementX === 0 && moveEvent.originalEvent.movementY === 0) {
						// マウスが実際に移動していない場合は処理しない
						return;
					}
					normalizeEvent(moveEvent);
					if ($list.data("touchIdentifier") !== moveEvent.identifier) {
						return;
					}
					var moveX = moveEvent.pageX - basePos[0];
					if (-moveX < scrollThreshold && !$list.data("startTime")) {
						return;
					}
					var param = $list.data("startTime") ? NOANIME_PARAMS : {duration: 50};

					if (!$list.data("startTime")) {
						$list.data("startTime", Date.now()).css("pointer-events", "none");
					}

					if (moveX > 0) {
						moveX = 0;
					} else if (moveX <= -level2Threshold) {
						moveX = -level2Threshold - Math.sqrt((-moveX - level2Threshold) / 2) * 2;
					}
					$list.data("moveX", moveX).transit({x: moveX + "px"}, param);
					var x = 10 - (-moveX / level1Threshold) * 10;
					x = (x > 10) ? 10 : x < 0 ? 0 : x;
					$button1.find(".downloadButtonIn").transit({x: x + "%"}, NOANIME_PARAMS);
					var opacity = -moveX / level1Threshold * 0.8;
					opacity = (opacity > 0.8) ? 1 : opacity < 0 ? 0 : opacity;
					$button1.transit({opacity: opacity}, NOANIME_PARAMS);
					$button2.transit({opacity: level2Threshold <= -moveX ? 1 : 0}, NOANIME_PARAMS);
					return false;
				}).on(_.addLabel(_.addMouseEventName(_.end), ".drag.dlmode" + id) + " " + _.addLabel(_.addMouseEventName(_.cancel), ".drag.dlmode" + id) + " scroll.drag.dlmode" + id, function (endEvent) {
					normalizeEvent(endEvent);
					if ($list.data("touchIdentifier") !== endEvent.identifier) {
						return;
					}

					var moveX = -$list.data("moveX");
					var startTime = $list.data("startTime");

					$list.transitStop(true).transit({x: 0, y: 0, scale: 1}, {duration: 300, complete: function () {
						$button1.add($button2).transitStop(true).transit({opacity: 0}, NOANIME_PARAMS);
						listEl.removeAttribute("style");
					}});
					$(window).off(".drag.dlmode" + endEvent.identifier);
					$("body").removeData("touchIdentifier"); // １つのみに制限
					$list.removeData("touchIdentifier").removeData("moveX").removeData("startTime");

					if (Date.now() - startTime < 100) {
						return false;
					}

					var partId = $list.attr("data-partid");
					if (moveX >= level2Threshold) {
						pushDataLayer(partId, true);
						getPartData($list.attr("data-partid")).done(function (json) {
							var movieList = (json.media || []).filter(function (val) { return val.mode === "download"; });
							movieList = (movieList[0] && 'movie' in movieList[0]) ? movieList[0].movie : [];
							if (!movieList.length) {
								window.COMMON.showToast("この作品はダウンロードできません");
							} else {
								var partTitle = /^[\s　]*$/.test(json.title) ? "" : "『" + window.COMMON.escape(json.title) + "』";
								var dom = "";
								dom +=	"<div class=\"buttonWrapper\">";
								dom +=		"<div id=\"streamingQuality\" class=\"list\">";

								var isNoVeryBeautiful = true;
								var isNoHighDefinition = true;
								$.each(movieList, function (index, val) {
									var bitrate = val.bitrate.id;
									dom +=	"<a href=\"javascript:void(0);\" class=\"" + movieBitrateNameList[bitrate - 1] + "\" data-bitrate=\"" + bitrate + "\">" + movieBitrateTextList[bitrate - 1] + "</a>";
									if (bitrate === "3") isNoVeryBeautiful = false;
									if (bitrate === "4") isNoHighDefinition = false;
								});
								dom +=		"</div>";
								dom +=		"<div class=\"lightWaveCommunication" + (isNoVeryBeautiful ? " noVeryBeautiful" : "") + (isNoHighDefinition ? " noHighDefinition" : "") + "\">";
								dom +=			"<div class=\"recommend\"><span>Wi-Fi推奨</span></div>";
								dom +=		"</div>";
								dom +=	"</div>";

								window.COMMON.showDialog({
									className: "dlModeDialog",
									title: "ダウンロード",
									contents: dom,
									button1Text: "キャンセル",
									afterinit: function ($dialog) {
										var $streamingQuality = $dialog.find("#streamingQuality");
										var $playButton = $streamingQuality.find("a");
										$playButton.click(function () {
											var bitrate = $(this).data("bitrate");
											$(".downloadButton .level1 .label").html(movieBitrateTextList[bitrate - 1]);
											window.COMMON.contentPlay(partId, bitrate, "1");
											window.COMMON.cookieMap.standard_bitrate_cd = bitrate;
											$dialog.closeModal();
											setFlickDownloadFlag(partId);
											return false;
										});
									}
								});
							}
						}).fail(function () {
							window.COMMON.showToast("データの取得に失敗しました");
						});
					} else if (moveX >= level1Threshold) {
						getPartData($list.attr("data-partid")).done(function (json) {
							var movieList = (json.media || []).filter(function (val) { return val.mode === "download"; });
							movieList = (movieList[0] && 'movie' in movieList[0]) ? movieList[0].movie : [];
							if (!movieList.length) {
								window.COMMON.showToast("この作品はダウンロードできません");
							} else {
								pushDataLayer(partId, false);
								loadPlayMovie(function () {
									window.COMMON.contentPlay(partId, null, "1");
									setFlickDownloadFlag(partId);
								});
							}
						}).fail(function () {
							window.COMMON.showToast("データの取得に失敗しました");
						});
					}
				});
			}).click(function (e) {
				if (e.isDefaultPrevented() || $(e.currentTarget).data("isMove") === true) {
					return false;
				}
			});
			var dom = "";
			dom +=	"<span class=\"downloadButton\">";
			dom +=		"<div class=\"level1\">";
			dom +=			"<div class=\"downloadButtonIn\">";
			dom +=				"<i class=\"icon iconDownload\"></i>";
			dom +=				"<div class=\"label\">" + movieBitrateTextList[(window.COMMON.cookieMap.standard_bitrate_cd || 2) - 1] + "</div>";
			dom +=			"</div>";
			dom +=		"</div>";
			dom +=		"<div class=\"level2\">";
			dom +=			"<div class=\"downloadButtonIn\">";
			dom +=				"<i class=\"icon iconSelect\"></i>";
			dom +=				"<div class=\"label\">画質を選ぶ</div>";
			dom +=			"</div>";
			dom +=		"</div>";
			dom +=	"</span>";
			$downloadTarget.closest(".downloadWrapper").prepend(dom);

			if (window.COMMON.naviDevice1 === "3") {
				// iOS10からtouchstart中にtouchmove傍受開始してもスクロール制御が効かない
				// けど、とりあえず登録しておけば整合性がとれるっぽい
				$(window).off("touchmove.dlmode").on("touchmove.dlmode", function () {});
			}
		}
		return $this;
	};





	if (initialHash && initialHash.indexOf("#") === 0 && initialHash.indexOf(window.COMMON.ESCAPED_FRAGMENT) === -1) {
		var scrollFunc = function () {
			try {
				// 移動先を取得
				var $target = $(initialHash);
				// 移動先を数値で取得
				var offset = $target.offset();
				var position = (offset) ? offset.top : 0;
				$("body, html").scrollTop(position);
			} catch (e) {
				window.console.error(e);
			}
		};
		$(window).on("load pageshow", scrollFunc);
	} else {
		// 初期スクロール位置取得
		var tmpMap = window.COMMON.getState();
		var initialScroll = tmpMap.s;
		var initialScrollDevice = tmpMap.sp;
		if (typeof tmpMap.s !== "undefined" || typeof tmpMap.sp !== "undefined") {
			// 初期スクロール位置をURLハッシュから削除
			delete tmpMap.s;
			delete tmpMap.sp;
			window.COMMON.setState(tmpMap);
		}
		if (initialScroll > 0) {
			var onloadFunc = function () {
				// Windowロード完了時に、保存時のレイアウトパターンと復元時のレイアウトパターンが同じだった場合はスクロール位置を復元
				if ((window.COMMON.isPcLayout) === (initialScrollDevice !== "1")) {
					window.setTimeout(function () {
						$(window).scrollTop(initialScroll);
					}, 300);
				}
			};
			// Windowロード完了時にスクロール位置を復元(Ajaxにてページ生成する画面については個別にpageshowを発火することで復元する)
			$(window).on("load pageshow", onloadFunc);
			$(function () {
				var offFunc = function() {
					$(document.body).off("mousewheel mousedown touchstart", offFunc);
					$(window).off("load pageshow", onloadFunc);
				};
				$(document.body).on("mousewheel mousedown touchstart", offFunc);
			});
		}
	}

	// リダイレクト処理
	window.redirect = function (url, isCheck) {
		var redirectFunc = function (location) {
			var m = window.navigator.userAgent.match(/android[\s|;]([0-9]+[\.0-9]*)/i);
			if (m && parseFloat(m[1]) >= 4.1 && typeof window.history.replaceState === "function") {
				window.history.replaceState({}, "", location);
				window.location.reload();
			} else {
				window.location.replace(location);
			}
		};
		if (isCheck) {
			$.ajax({
				type: "HEAD",
				async: true,
				url: url
			}).done(function () {
				redirectFunc(url);
			});
		} else {
			redirectFunc(url);
		}
	};

	window.openExternalLinks = function (url) {

		//Cookieからnavi_deviceを取得
		var naviD = window.COMMON.naviDevice || document.cookie.replace(/.*navi_device=(\d{2}).*/, "$1");

		if (naviD === "22" && window.dAnimeStoreJk && typeof window.dAnimeStoreJk.openWebBrowser === "function"){
			// CFアプリ
			window.dAnimeStoreJk.openWebBrowser(encodeURIComponent(url));
		} else if (naviD === "32") {
			//iOSアプリ
			window.location.href = "jp.co.nttdocomo.animestore.launchplayer://openWebBrowser?url=" + encodeURIComponent(url);
		} else if (naviD === "12" && window.commonJk && typeof window.commonJk.launchDefaultBrowser === "function") {
			//dマーケットアプリ
			window.commonJk.launchDefaultBrowser(url);
		} else {
			//ブラウザとdマーケットアプリ
			window.open(url, "_blank");
		}
	};
	window.launchApp = function (url) {
		var ret;
		if (window.COMMON.naviDevice === "11" || window.COMMON.naviDevice === "21" || window.COMMON.naviDevice === "31") {
			var regex = /ref=[^\&]*/;
			url = regex.test(url) ? url.replace(regex, "ref=launchapp") : (url + (url.indexOf("?") !== -1 ? "&" : "?") + "ref=launchapp");
			var encodedUrl = encodeURIComponent(url);
			var launchAppUrlDmarket = "dcmstore://launch?url=" + encodedUrl;
			var launchAppUrlListIos = ["jp.co.nttdocomo.animestore.launchplayer://openWebView?url=" + encodedUrl];
			var launchAppUrlListOldAndroid = ["danimestore://openWebView?url=" + encodedUrl,
												launchAppUrlDmarket];
			// var launchAppUrlListNewAndroid = ["intent://openWebView?url=" + encodedUrl + "#Intent;scheme=danimestore;S.browser_fallback_url=" + launchAppUrlDmarket + ";end;"];
			var launchAppUrlListNewAndroid = launchAppUrlListOldAndroid;
			var launch = function (launchAppUrlList) {
				var dfd = new $.Deferred();
				var DELAY = 1000.0;
				var func = function (list) {
					var launchAppUrl = list.shift();
					var startTime = Date.now();
					if (window.COMMON.osVer.indexOf("ios") >= 0) {
						window.location.href = launchAppUrl;
					} else if (window.COMMON.isAndroidChrome) {
						window.location.href = launchAppUrl;
					} else {
						$("body").append("<iframe name=\"openInternalLinks" + $(".openInternalLinks").length + "\" class=\"openInternalLinks\" src=\"" + launchAppUrl + "\" style=\"display:none\"/>");
					}
					window.setTimeout(function () {
						if (Date.now() - startTime < DELAY + 300) {
							if (launchAppUrlList.length) {
								func(list);
							} else {
								dfd.reject();
							}
						} else {
							dfd.resolve();
						}
					}, DELAY);
				};
				func(launchAppUrlList);
				return dfd.promise();
			};
			var urlList;
			var waitFunc;
			if (window.COMMON.isAndroidChrome) {
				urlList = launchAppUrlListNewAndroid;
				waitFunc = function () {
					var dfd = new $.Deferred();
					$(function () {
						dfd.resolve();
					});
					return dfd.promise();
				};
			} else if (window.COMMON.osVer.indexOf("android") >= 0) {
				urlList = launchAppUrlListOldAndroid;
				waitFunc = function () {
					var dfd = new $.Deferred();
					$(function () {
						dfd.resolve();
					});
					return dfd.promise();
				};
			} else if (window.COMMON.osVer.indexOf("ios") >= 0) {
				urlList = launchAppUrlListIos;
				waitFunc = function () {
					var dfd = new $.Deferred();
					// iOSの場合はwindow.load契機
					// $(window).loadはすでにload済みの場合にコールバック実行されないので確認する
					if (document.readyState === "complete") {
						dfd.resolve();
					} else {
						$(window).load(function () {
							dfd.resolve();
						});
					}
					return dfd.promise();
				};
			}
			if (typeof waitFunc === "function") {
				var retDfd = new $.Deferred();
				waitFunc().done(function () {
					launch(urlList).done(function () {
						retDfd.resolve();
					}).fail(function () {
						retDfd.reject();
					});
				});
				ret = retDfd.promise();
			} else {
				ret = new $.Deferred().reject().promise();
			}
		} else {
			ret = new $.Deferred().reject().promise();
		}
		return ret;
	};

	$.fn.replaceClass = function (regex, className) {
		var $this = this;
		$this.each(function(index, el) {
			var classText = el.className;
			if (classText.match(regex)) {
				classText = $.trim(classText.replace(regex, className));
			} else {
				classText = $.trim(classText + " " + className);
			}
			el.className = classText;
		});
		return $this;
	};
	$.fn.getNaturalSize = function () {
		var $this = this;
		var img = $this.get(0);
		if (!img || img.tagName.toLowerCase() !== "img") {
			return null;
		}
		if ("naturalWidth" in img) {
			return {width: img.naturalWidth, height: img.naturalHeight};
		}

		var style = img;
		if (document.uniqueID) { // for IE
			style = img.runtimeStyle;
		}

		var mem = { w: style.width, h: style.height };
		style.width = "auto";
		style.height = "auto";
		var w = img.width;
		var h = img.height;
		style.width = mem.w;
		style.height = mem.h;

		return {width: w, height: h};
	};

	$(function () {
		$(document.body).on("click", "a[href]", function (e) {
			// アンカーの値取得
			var href = $(this).attr("href");
			if (href.indexOf(window.COMMON.ESCAPED_FRAGMENT) === 0) {
				window.COMMON.currentHash = href;
			} else if (href.indexOf("#") === 0 || $(this).hasClass("btnPageTop")) {
				// #で始まるアンカーをクリックした場合に処理
				// スクロールの速度
				var speed = 400; // ミリ秒
				// 移動先を取得
				var $target = $(href === "#" ? "html" : href);
				// 移動先を数値で取得
				var offset = $target.offset();
				var position = (offset) ? offset.top : 0;
				// スムーススクロール
				$("body, html").animate({scrollTop: position}, speed, "swing");
				return false;
			} else if (!e.isDefaultPrevented() && (e.currentTarget.href || "").indexOf("javascript") !== 0) {
				// aタグクリックされた際にスクロール位置が0以外の場合はスクロール位置保存
				var scrollTop = $(window).scrollTop();
				if (scrollTop !== 0) {
					var param = window.COMMON.getState();
					param.s = scrollTop;
					if (!window.COMMON.isPcLayout) {
						param.sp = 1;
					} else {
						delete param.d;
					}
					window.COMMON.setState(param);
				}
			}
		});
		// 端末向き切り替え時にinput要素からフォーカスを外すことで、IMEを非表示にする
		$(window).on("orientationchange", function () {
			$("input:focus").blur();
		});

		var IMAGE_WIDTH_MAP = {
			"/[C|\\\d]\\\d{7}_\\\d_\\\d.png": {
				"1920": "_10_8b.png",
				"1280": "_9_8b.png",
				"640": "_1.png",
				"288": "_2.png",
				"208": "_6.png",
				"144": "_3.png"
			},
			"/[C|\\\d]\\\d{4}_\\\d_\\\d.png": {
				"1920": "_10_8b.png",
				"1280": "_9_8b.png",
				"640": "_1.png",
				"288": "_2.png",
				"256": "_5.png",
				"208": "_6.png",
				"144": "_3.png"
			},
			"/S\\\d{7}_\\\d_\\\d.png": {
				"1920": "_10_8b.png",
				"1280": "_9_8b.png",
				"640": "_1.png",
				"288": "_2.png",
				"256": "_5.png",
				"208": "_6.png",
				"144": "_3.png"
			}
		};

		var onLoad = function (e) {
			var $target = $(e.target);
			$target.off("load error", onLoad);
			var originalSrc = $target.attr("data-original-src");

			if (originalSrc) {
				var func = function () {
					$target.removeAttr("data-original-src").on("load error", onLoad).attr("src", originalSrc);
				};
				if (document.readyState === "complete") {
					func();
				} else {
					$(window).load(func);
				}
			} else {
				if (e.type === "error") {
					$target.addClass("lazyerror");
				} else if (e.type === "load") {
					var size = $target.getNaturalSize();
					if (size) {
						var $imgWrap = $target.closest("[class*=imgWrap]");
						if ($imgWrap.length) {
							if (size.width / size.height < $imgWrap.width() / $imgWrap.height()) {
								$target.addClass("verticallyLong");
							}
						} else if (size.width < size.height) {
							$target.addClass("verticallyLong");
						}
					}
				}
				$target.trigger("lazy" + e.type);
			}
		};
		var changeDataSrc = function ($target) {
			var abs = function(val) {
				return val < 0 ? -val : val;
			}
			$target.each(function(index, el) {
				var $el = $(el);
				var imageWidth = parseInt($el.width() * window.devicePixelRatio, 10);

				var imageUrl = $el.data("src");
				$.each(IMAGE_WIDTH_MAP, function (regex, map) {
					if (new RegExp(regex).test(imageUrl)) {
						// 380pxサイズはデバイスピクセルによって閾値を変える
						if (window.devicePixelRatio > 1) {
							map["520"] = "_8_8b.png";
							map["366"] = "_8_8b.png";
						}
						else {
							map["380"] = "_8_8b.png";
						}
						var suffix = map[imageWidth];
						var upWidth = Number.MAX_VALUE, downWidth = Number.MIN_VALUE;
						var max = Number.MIN_VALUE, min = Number.MAX_VALUE;
						if (!suffix) {
							// サイズぴったりのものがない場合は、そのサイズより1つ大きいものと1つ小さいものをさがす
							$.each(map, function (width) {
								width = parseInt(width, 10);
								max = max <= width ? width : max;
								min = min >= width ? width : min;
								if (imageWidth < width && width <= upWidth) {
									upWidth = width;
								} else if (downWidth < width && width <= imageWidth) {
									downWidth = width;
								}
							});
							// 2倍角以上は一つ上の内容ではなく絶対値の近い方を使う
							if (window.devicePixelRatio > 1) {
								if (map[upWidth] && abs(upWidth - imageWidth) < abs(downWidth - imageWidth)) {
									suffix = map[upWidth];
									imageWidth = upWidth;
								} else {
									suffix = map[downWidth];
									imageWidth = downWidth;
								}
							}
							else {
								if (map[upWidth]) {
									suffix = map[upWidth];
									imageWidth = upWidth;
								} else {
									suffix = map[downWidth];
									imageWidth = downWidth;
								}
							}
						} else {
							$.each(map, function (width) {
								width = parseInt(width, 10);
								max = max <= width ? width : max;
								min = min >= width ? width : min;
							});
						}
						if (suffix) {
							if (imageWidth >= min * 2) {
								$el.attr("data-src", imageUrl.replace(/_\d.png/, map[min]));
								$el.attr("data-original-src", imageUrl.replace(/_\d.png/, suffix));
							} else {
								$el.attr("data-src", imageUrl.replace(/_\d.png/, suffix));
							}
						}
						// if (suffix === map[max]) {
						// 	$el.attr("data-src", imageUrl.replace(/_\d.png/, map[min]));
						// 	$el.attr("data-original-src", imageUrl.replace(/_\d.png/, suffix));
						// } else if (suffix) {
						// 	$el.attr("data-src", imageUrl.replace(/_\d.png/, suffix));
						// }
						return false;
					}
				});
			});
		};
		// Android 4未満でlazysizesが正常に動かないため、独自に対応を行う
		if (/android[2|3]\./i.test(window.COMMON.osVer)) {
			var lazyTimer;
			var lazyCallback = function () {
				if (!lazyTimer) {
					lazyTimer = window.setTimeout(function () {
						lazyTimer = undefined;
						var loadFunc = function (e) {
							$(e.target).removeClass("lazyloading").addClass("lazyloaded").off("lazyload lazyerror", loadFunc);
						};
						$("img.lazyload").filter(":not(.checkOnScreen)").checkOnScreen("apper").one("apper", function (e) {
							var $el = $(e.target);
							$el.removeClass("lazyload").addClass("lazyloading");
							changeDataSrc($el);
							$el.on("load error", onLoad).on("lazyload lazyerror", loadFunc).attr("src", $el.attr("data-src"));
						});

					}, 100);
				}
			};
			if (typeof window.MutationObserver === "function") {
				try {
					var mo = new window.MutationObserver(lazyCallback);
					mo.observe(document.body, {childList: true, subtree: true, attributes: true});
				} catch (e) {
					console.log(e);
				}
			} else {
				document.body.addEventListener("DOMNodeInserted", lazyCallback, false);
				document.body.addEventListener("DOMAttrModified", lazyCallback, false);
				window.setInterval(lazyCallback, 999);
			}
			lazyCallback();
		} else {
			// $(window).one("load", function () {
				$(document).on("lazybeforeunveil", (function () {
					return function (e) {
						if (!e.isDefaultPrevented()) {
							var $target = $(e.target);
							changeDataSrc($target);
							$target.filter("img").on("load error", onLoad);
						}
					};
				})());
				$.getScript(window.COMMON.EXTERNAL_URL["lazysizes.min.js"]);
			// });
		}
		// 古いfirefoxでlabalの挙動が不正なため、個別に対応を行う
		if (window.COMMON.browser === "firefox") {
			$(document.body).on("click", "label", function (e) {
				var $target = $(e.currentTarget);
				var forId = $target.attr("for");
				if (forId && $("#" + forId).length) {
					$("#" + forId).click();
				} else {
					$target.find("input").click();
				}
				return false;
			});
		}
		// if (window.COMMON.browser === "firefox" || window.COMMON.browser.indexOf("ie") !== -1) {
		// 	if ($("nobr wbr").length) {
		// 		$("nobr").each(function () {
		// 			var text = $(this).html(), html = "";
		// 			text.replace(/\<wbr\s*\/?>/g, "<wbr/>").split("<wbr/>").forEach(function(txt, i) {
		// 				html += "<wrap style=\"white-space:nowrap;display:inline-block;" + (i > 0 ? "margin-left:.3em;" : "") + "\">" + txt + "</wrap>";
		// 			});
		// 			$(this).html(html).css("white-space", "normal");
		// 		});
		// 	}
		// }

		// iOS8,9のWKWebviewだとinnerWidth/innerHeightが正常に取れない場合があるのでおまじない
		if (window.COMMON.naviDevice === "32") {
			var $viewport = $("meta[name=viewport]");
			$viewport.attr("content", $viewport.attr("content") + ", shrink-to-fit=no");
		}

		// 空パラメータでコールすることでスクリプトファイルを読み込む
		window.COMMON.showToast();

		var setStyle = function () {
			$(".line2 span").clampLine(2);
			$(".line3 span").clampLine(3);
			$(".line4 span").clampLine(4);
			$(".pulldown").pulldown();
			$(".favo").dASFavoriteAction();
			$(".favoTag").dASFavoriteTagAction();
			$("input.suggest").dASSuggest();
			$(".directPlay").directPlay();
			$(".directDownload").directDownload();
			$(".webkitScrollbar").webkitScroll();
			$("a[href]").filter(function () { return /c(d|i)(_pc)?.*?partId\=\d{8}/.test(this.href); }).flickDownload();
			$(".goodsTextContainer__Title h3").clampLine(2);
		};


		var changeDomTimer;
		var changeDomCallback = function () {
			if (!changeDomTimer) {
				changeDomTimer = window.setTimeout(function() {
					changeDomTimer = undefined;
					setStyle();
				}, 100);
			}
		};

		if (typeof window.MutationObserver === "function") {
			try {
				var observer = new window.MutationObserver(changeDomCallback);
				observer.observe(document.body, {childList: true, subtree: true});
			} catch (e) {
				console.log(e);
			}
		} else {
			document.body.addEventListener("DOMNodeInserted", changeDomCallback, false);
		}
		setStyle();

		/************************************
			入会訴求バナー
		************************************/
		// (function () {
		// 	try {
		// 		if (window.HIDE_PROMO_BANNER !== true &&
		// 				(window.COMMON.naviDevice === "11" || window.COMMON.naviDevice === "21" || window.COMMON.naviDevice === "31") &&
		// 				window.COMMON.memberStatus !== "1" &&
		// 				(window.location.pathname.indexOf("register-page") === -1 &&
		// 				window.location.pathname.indexOf("search_index") === -1 &&
		// 				window.location.pathname.indexOf("thankyou") === -1 &&
		// 				!/\/CF\/lp\d{3}/.test(window.location.pathname) &&
		// 				!/\/CF\/pyonpyon_/.test(window.location.pathname) &&
		// 				!/^\/animestore\/m?c(d|i)/.test(window.location.pathname))) {
		// 			var nowDate = new Date();
		// 			var bannerUrl = window.jsonBfUrl + "BF00001044.html";
		// 			bannerUrl += "?_=" + nowDate.getFullYear() + ("0" + (nowDate.getMonth() + 1)).slice(-2) + ("0" + nowDate.getDate()).slice(-2) + ("0" + nowDate.getHours()).slice(-2);
		// 			var param = {
		// 				url: bannerUrl,
		// 				type: "get",
		// 				dataType: "html",
		// 				timeout: window.COMMON.API_WEB_TIMEOUT
		// 			};
		// 			$.ajax(param).done(function (data) {
		// 				var $dom = $(data);
		// 				if ($dom.filter("#promoBanner").length) {
		// 					$("body").append($dom);
		// 				}
		// 			});
		// 		}
		// 	} catch (e) {
		// 		window.console.error(e);
		// 	}
		// })();
	});
})(this, this.document, this.jQuery);
