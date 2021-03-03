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


	//optionの高さを見て位置を調整＆親枠のマージン量を調整
	var fixOptionPosition = function() {

		var $option = $(".option"),	//オレンジ枠のリスト要素
			$optionCurrent,			//カレントオレンジ枠のリスト要素
			$optionHeight,			//カレントオレンジ枠のリスト要素の高さ
			$optionLine,			//カレントオレンジ枠の行数
			$parent,				//カレントオレンジ枠のリスト要素の親要素
			$nextParent;			//カレントオレンジ枠のリスト要素の隣の親要素

		//optionのbottomプロパティと親枠のmargin-bottomプロパティをリセット
		$option.css("bottom","");
		$(".itemModule").css("margin-bottom","");

		for(var i=0; i< $option.length; i++){
			$optionCurrent = $option.eq(i);
			$optionHeight = parseInt( $optionCurrent.height() );
			$optionLine = $optionHeight / 23; //オレンジ枠は高さ20px + 下マージン3px
			if( $optionLine > 1 ){
				//optionが複数行の状態だったらoptionの位置を調整
				$optionCurrent.css("bottom", ( parseInt( $optionCurrent.css("bottom") ) - ($optionLine - 1) * 23) + "px" );
				//親枠のマージン量がデフォルトから増えていなかったら調整
				$parent = $optionCurrent.closest(".itemModule");
				if( parseInt($parent.css("margin-bottom")) < 30){
					$parent.css("margin-bottom", ( parseInt( $parent.css("margin-bottom") ) + ($optionLine - 1) * 23) + "px");
				}

				//PC版では横の枠の下マージンも調整
				if (window.innerWidth >= window.COMMON.THRESHOLD) {
					if( (i+1) % 2 === 1){ // i = 0, 2, 4, 6...
						//奇数番目のアニメだったらi+1の親枠の下マージンを調整
						$nextParent = $option.eq(i+1).closest(".itemModule");
						$nextParent.css("margin-bottom", ( parseInt( $nextParent.css("margin-bottom") ) + ($optionLine - 1) * 23) + "px");
					} else { // i = 1, 3, 5, 7...
						//偶数番目のアニメだったらi-1の親枠の下マージンを調整
						$nextParent = $option.eq(i-1).closest(".itemModule");
						if( parseInt($nextParent.css("margin-bottom")) < 30){
							$nextParent.css("margin-bottom", ( parseInt( $nextParent.css("margin-bottom") ) + ($optionLine - 1) * 23) + "px");
						}
					}
				}
			}

		}

	};


	$(function () {

		$(window).on("load resize", function(){
			fixOptionPosition();
		});

	});


})(this, this.document, this.jQuery);

