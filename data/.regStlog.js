function stlog() {}stlog.ver = '201409';
stlog.domain = 'stlog.d.dmkt-sp.jp';
stlog.base_url = 'https://' + stlog.domain + '/logrecord/record.do?url=';
stlog.timeout = 10000;
stlog.is = function (type, obj) {
    var clas = Object
        .prototype
        .toString
        .call(obj)
        .slice(8, -1);
    return obj !== undefined && obj !== null && clas === type;
};
stlog.array_key_exists = function (key, search) {
    if (! search || (search.constructor !== Array && search.constructor !== Object)) {
        return false;
    }
    return key in search;
};
stlog.log = function (i) {
    if (this.is('Boolean', stlog.debug) && stlog.debug) {
        console.log(i);
    }
};
stlog.create_url = function (param) {
    var url = location.href;
    var operate_kind = '';
    var contents_id = [];
    if (this.array_key_exists('operate_kind', param) && this.is('String', param['operate_kind'])) {
        operate_kind = param['operate_kind'];
    }
    if (this.array_key_exists('contents_id', param) && this.is('Array', param['contents_id'])) {
        contents_id = param['contents_id'];
    }
    var request_url = this.base_url + encodeURIComponent(url);
    if (operate_kind !== '') {
        request_url += '&operate_kind=' + operate_kind;
        if (contents_id.length > 0) {
            for (var i = 0; i < contents_id.length; i++) {
                request_url += '&contents_id=' + encodeURIComponent(contents_id[i]);
            }
        }
    }
    request_url += '&ver=' + this.ver;
    return request_url;
};
stlog.logrecord = function (param) {
    var request_url = stlog.create_url(param);
    (jQuery).ajax({
        url: request_url,
        type: 'GET',
        timeout: this.timeout,
        async: true,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (data, status, xhr) {
            stlog.log('ajax first success');
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            stlog.log('ajax second start');
            (jQuery).ajax({
                url: request_url,
                type: 'GET',
                timeout: this.timeout,
                async: true,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                success: function (data, status, xhr) {
                    stlog.log('ajax second success');
                },
                error: function (xmlhttprequest, textstatus, errorthrown) {
                    stlog.log('ajax second error');
                }
            });
        }
    });
};
(function ($) {
    var iframe = document.createElement('iframe');
    iframe.src = stlog.create_url();
    iframe.frameborder = 0;
    iframe.scrolling = 'no';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.margin = '0px';
    iframe.style.padding = '0px';
    iframe.style.display = 'none';
    iframe.style.border = '0px';
    document.body.appendChild(iframe);
    stlog.log('iframe write');
})(jQuery);