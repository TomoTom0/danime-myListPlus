await Promise.all([a].map(async listId=>await fetch(window.COMMON.RESTAPI_ENDPOINT.getWorkFromShareList + `?shareListId=${listId}`)
    .then(d => d.json())
    .then(d => d.data.workList.map(work=>work.workId))))

a="47q7GzYJzMQsT2cy"
b=await Promise.all([a].map(async (listId, ind)=>Object({[ind]:await fetch(window.COMMON.RESTAPI_ENDPOINT.getWorkFromShareList + `?shareListId=${listId}`)
        .then(d => d.json())
        .then(d => d.data.workList.map(work=>work.workId))})))
    .then(d=>Object.assign(...d))

lists=[{count: 50,
shareListId: "47q7GzYJzMQsT2cy",
shareListName: "good__bbb51e"}]

res=await fetch(window.COMMON.RESTAPI_ENDPOINT.getFavorite)
.then(d => d.json())

ul=$(".pageWrapper ul.onlyPcLayout");
pageLength=$("li:last", ul).text().match(/\d+/);
urlTmp=location.href.replace(/(?<=\?.*)selectPage=\d+/, "")
urlBase= urlTmp+ (/[\?&]$/.test(urlTmp) ? "" : "?") + "selectPage=";

content=await fetch(urlBase+"4").then(d=>d.body)
.then(d=>d.getReader())
.then(reader=>reader.read())
.then(res=>new TextDecoder("utf-8").decode(res.value))

a=$("div.itemWrapper", content)

itemHTMLs=await Promise.all([...Array(pageLength-1).keys()].map(d=>d+2).map(async pageNum=>{
    const content=await fetch(`${urlBase}${pageNum}`).then(d=>d.body)
        .then(d=>d.getReader())
        .then(reader=>reader.read())
        .then(res=>new TextDecoder("utf-8").decode(res.value));
    return $("div.itemWrapper.clearfix", content).html();
}))
$(".pageWrapper div.itemWrapper.clearfix").append(itemHTMLs.join("\n"))

const _restPost = async function (url, json) {
    const headers = {
        "Content-Type": "application/json",
        timeout: window.COMMON.API_WEB_TIMEOUT
    };
    const opts = { method: "post", body: JSON.stringify(json), cache: "no-cache", headers: headers };
    return await fetch(url, opts)
        .then(resIn => {
            return (resIn.ok) ? resIn.json() : {}
        }) //dataがnullの場合の回避
        .then(res => {
            if (res.resultCd === "00" || res.resultCd === "01") {
                return res.data;
            } else {
                return {error:((res.error) ? res.error.code : "unknown")};
            }
        }).catch(errorMessage => {
            console.log(errorMessage);
        });
};




res=await fetch(window.COMMON.RESTAPI_ENDPOINT.getMyListStatus+"?targetFlag=10&workIdList=24439_24410").then(d=>d.json())

res=await fetch(window.COMMON.RESTAPI_ENDPOINT.getMyListStatus+"?targetFlag=11").then(d=>d.json())


workIdLists=[...Array(1401).keys()].map(d=>d+20000).join("_")
res=await fetch(window.COMMON.RESTAPI_ENDPOINT.getMyListStatus+"?targetFlag=10&workIdList="+workIdLists).then(d=>d.json()).then(d=>d.data.statusList)
res2=res.filter(d=>d.favoriteStatus=="1")


res=await fetch(window.COMMON.RESTAPI_ENDPOINT.getMyListStatus+"?targetFlag=10&workIdList=24439").then(d=>d.json()).then(d=>d.data.statusList)

res=await fetch(window.COMMON.RESTAPI_ENDPOINT.getMyListStatus).then(d=>d.json()).then(d=>d.data)
res=await fetch("/animestore/CN/CN00000001").then(d=>d.json()).then(d=>d.data)

res=await fetch(window.COMMON.RESTAPI_ENDPOINT.getMyListStatus).then(d=>d.json())
res=await fetch("https://anime.dmkt-sp.jp/animestore/rest/WS100124?campaignId=&_=1614685318665"
).then(d=>d.json())

res=await fetch("https://anime.dmkt-sp.jp/animestore/rest/WS100124?campaignId=1614685318665"
).then(d=>d.json())

const obtainStreamBody = async (url) => {
    for (const count of Array(3)) {
        try {
            const content = await fetch(url).then(d => d.body)
                .then(d => d.getReader())
                .then(reader => reader.read())
                .then(res => new TextDecoder("utf-8").decode(res.value));
            return content;
        } catch { continue; }
    }
    return "";
}
const urlFav = "https://anime.dmkt-sp.jp/animestore/mpa_fav_pc";
const htmlContent=await obtainStreamBody(urlFav);
const itemFirst=$("div.itemWrapper.clearfix", htmlContent);
const ul=$("ul.onlyPcLayout", htmlContent);
const pageLength=$(`li:last`, ul).text().match(/\d+/)-0;
const urlBase=`${urlFav}?selectPage=`;
const pageRange={first:2, length:pageLength-1};
const itemHTMLs_tmp = await Promise.all([...Array(pageRange.length).keys()]
    .map(d => d + pageRange.first).map(async pageNum => {
        const content = await obtainStreamBody(`${urlBase}${pageNum}`);
        return $("div.itemWrapper.clearfix", content);
}));
const itemHTMLs=[itemFirst, ...itemHTMLs_tmp];
itemHTMLs.map(wrapper=>$(".itemModule input", wrapper).map((ind, obj)=>$(obj).val()).toArray()).flat();

workIdsDic={"yellow":["24410", "23657"], "lightgreen":["24410", "23657"], "lightblue":["24410"]}
itemModules=$(".itemModule")
itemModules.each((ind,obj)=>{
    workIdTmp=$("input", obj).val();
    const colors=Object.entries(workIdsDic).filter(kv=>kv[1].indexOf(workIdTmp)!=-1).map(kv=>kv[0]);
    if (colors){
        $(obj).css({background:`linear-gradient(-135deg, ${colors.join(",")}, 60%, white 100%)`})
    }
})

workIds=$(".itemModule.list").map((ind,obj)=>$("input", obj).val()).toArray();
res=await fetch(window.COMMON.RESTAPI_ENDPOINT.getMyListStatus+"?targetFlag=10&workIdList="+workIds.join("_")).then(d=>d.json()).then(d=>d.data.statusList)
favWorkIds=res.filter(d=>d.favoriteStatus=="1").map(d=>d.workId)
shareWorkIds=res.filter(d=>d.myListStatus!=null).map(d=>d.workId)

res=await fetch(window.COMMON.RESTAPI_ENDPOINT.getMyList).then(d=>d.json()).then(d=>d.data.workList)
shareWorkIds=res.map(d=>d.workId)