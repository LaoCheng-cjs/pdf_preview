<template>
    <div>
        <header>
        <h1 id="title"></h1>
        </header>

        <div id="viewerContainer">
        <div id="viewer" class="pdfViewer"></div>
        </div>

        <div id="loadingBar">
        <div class="progress"></div>
        <div class="glimmer"></div>
        </div>

        <div id="errorWrapper" hidden="true">
        <div id="errorMessageLeft">
            <span id="errorMessage"></span>
            <button id="errorShowMore">
            More Information
            </button>
            <button id="errorShowLess">
            Less Information
            </button>
        </div>
        <div id="errorMessageRight">
            <button id="errorClose">
            Close
            </button>
        </div>
        <div class="clearBoth"></div>
        <textarea id="errorMoreInfo" hidden="true" readonly="readonly"></textarea>
        </div>

        <footer>
        <button class="toolbarButton pageUp" title="Previous Page" id="previous"></button>
        <button class="toolbarButton pageDown" title="Next Page" id="next"></button>

        <input type="number" id="pageNumber" class="toolbarField pageNumber" value="1" size="4" min="1">

        <button class="toolbarButton zoomOut" title="Zoom Out" id="zoomOut"></button>
        <button class="toolbarButton zoomIn" title="Zoom In" id="zoomIn"></button>
        </footer>
        <!-- <div id="viewerContainer">
            <div id="viewer" class="pdfViewer"></div>
        </div> -->
        <br>
        <br>
        <br>
        <br>
        <div id="pdfViewer"></div>
        <!-- <canvas class="can" v-for="(item, index) in pdfDocument.numPages" :key="index" ></canvas> -->
    </div>
</template>
<script>
var PDFJS = require('pdfjs-dist/legacy/build/pdf.js');
// 核心代码
import workerSrc from 'pdfjs-dist/legacy/build/pdf.worker.entry'
PDFJS.workerSrc = workerSrc;

// 可选，单页查看

// import sandbox from 'pdfjs-dist/legacy/build/pdf.sandbox'
/**
 * AnnotationLayerBuilder: (...)
DefaultAnnotationLayerFactory: (...)
DefaultTextLayerFactory: (...)
DownloadManager: (...)
EventBus: (...)
GenericL10n: (...)
NullL10n: (...)
PDFFindController: (...)
PDFHistory: (...)
PDFLinkService: (...)
PDFPageView: (...)
PDFScriptingManager: (...)
PDFSinglePageViewer: (...)
PDFViewer: (...)
ProgressBar: (...)
SimpleLinkService: (...)


 * @typedef {Object} TextLayerBuilderOptions
 * @property {HTMLDivElement} textLayerDiv - The text layer container.
 * @property {EventBus} eventBus - The application event bus.
 * @property {number} pageIndex - The page index.
 * @property {PageViewport} viewport - The viewport of the text layer.
 * @property {PDFFindController} findController
 * @property {boolean} enhanceTextSelection - Option to turn on improved
 *   text selection.
 *
 * *@typedef{Object}文本层构建选项
*@property{htmldevelement}textLayerDiv-文本层容器。
*@property{EventBus}EventBus-应用程序事件总线。
*@property{number}pageIndex-页面索引。
*@property{PageViewport}viewport-文本层的视口。
*@property{PDFFindController}查找控制器
*@property{boolean}enhanceTextSelection-启用的选项
TextLayerBuilder: (...)

*/
const {PDFPageView, EventBus, DefaultAnnotationLayerFactory, DefaultTextLayerFactory, PDFViewer, PDFLinkService} = require('pdfjs-dist/legacy/web/pdf_viewer');
// import { TextLayerBuilder } from 'pdfjs-dist/legacy/web/pdf_viewer';
import 'pdfjs-dist/legacy/web/pdf_viewer.css';
/**
 * 是否开启调试模式 ：   PDFViewerApplication.preferences.set('pdfBugEnabled', true)
 * pdfBug=all- 启用所有调试工具。您可以通过指定工具的 ID 来选择启用特定工具，例如 pdfBug=FontInspector 或 pdfBug=Stepper,FontInspector。更多关于下面的PDFBug。
    disableWorker=true - 禁用工作程序，这使得在尚不支持工作程序的情况下更容易使用 Firebug 等调试工具。
    textLayer=[off|visible|shadow|hover] - 禁用或显示用于文本选择的文本层。
    disableFontFace=true- 禁用标准@font-face字体加载并改用内部字体渲染器。
    disableRange=true - 获取文档时禁用 HTTP 范围请求。
    disableStream=true - 获取文档时禁用流式传输。
    disableAutoFetch=true- 禁用自动获取文档；只获取显示当前视图所需的数据。注意：流媒体也需要禁用才能产生任何效果。
    useOnlyCssZoom=true - 禁用重新渲染页面并使用 CSS 缩放代替。
    verbosity=[0|1|5]- 指定控制台消息的详细级别。0 = 仅错误，1 = 警告和错误，5 = 警告、错误和信息消息。
    locale=[en-US|...]- 指定在查看器 UI 中使用的语言。有关可用语言环境的列表，请参阅https://github.com/mozilla/pdf.js/tree/master/l10n。
 * 
 * 1、支持 file 对象、url地址、本地地址、base64
 * 2、定义方法如下：
 *       加载pdf对象 loadPdf
 *      开始加载： startPdf
 *      生成pdf完成： endPdf
 *  3、支持pc、移动端。
 *  4、转换图片
 *  5、禁止复制
 *  6、旋转（度）、上一张、下一张、导出图片、全部显示、复制弹选项、销毁、查找、国际化、编辑
 *  7、文档内提供码云地址
 * 
 * 
 * https://jsfiddle.net/simonepozzobon/nsq4u2y5/35
 * pdf base64位的   data:application/pdf;base64,JVBERi0xLjMNCiXi48/TDQoNCjEgMCBvYmoNCjw8DQovVHlwZSAvQ2F0YWxvZw0KL091dGxpbmVzIDIgMCBSDQovUGFnZXMgMyAwIFINCj4+DQplbmRvYmoNCg0KMiAwIG9iag0KPDwNCi9UeXBlIC9PdXRsaW5lcw0KL0NvdW50IDANCj4+DQplbmRvYmoNCg0KMyAwIG9iag0KPDwNCi9UeXBlIC9QYWdlcw0KL0NvdW50IDINCi9LaWRzIFsgNCAwIFIgNiAwIFIgXSANCj4+DQplbmRvYmoNCg0KNCAwIG9iag0KPDwNCi9UeXBlIC9QYWdlDQovUGFyZW50IDMgMCBSDQovUmVzb3VyY2VzIDw8DQovRm9udCA8PA0KL0YxIDkgMCBSIA0KPj4NCi9Qcm9jU2V0IDggMCBSDQo+Pg0KL01lZGlhQm94IFswIDAgNjEyLjAwMDAgNzkyLjAwMDBdDQovQ29udGVudHMgNSAwIFINCj4+DQplbmRvYmoNCg0KNSAwIG9iag0KPDwgL0xlbmd0aCAxMDc0ID4+DQpzdHJlYW0NCjIgSg0KQlQNCjAgMCAwIHJnDQovRjEgMDAyNyBUZg0KNTcuMzc1MCA3MjIuMjgwMCBUZA0KKCBBIFNpbXBsZSBQREYgRmlsZSApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY4OC42MDgwIFRkDQooIFRoaXMgaXMgYSBzbWFsbCBkZW1vbnN0cmF0aW9uIC5wZGYgZmlsZSAtICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNjY0LjcwNDAgVGQNCigganVzdCBmb3IgdXNlIGluIHRoZSBWaXJ0dWFsIE1lY2hhbmljcyB0dXRvcmlhbHMuIE1vcmUgdGV4dC4gQW5kIG1vcmUgKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA2NTIuNzUyMCBUZA0KKCB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDYyOC44NDgwIFRkDQooIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNjE2Ljg5NjAgVGQNCiggdGV4dC4gQW5kIG1vcmUgdGV4dC4gQm9yaW5nLCB6enp6ei4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNjA0Ljk0NDAgVGQNCiggbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDU5Mi45OTIwIFRkDQooIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNTY5LjA4ODAgVGQNCiggQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA1NTcuMTM2MCBUZA0KKCB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBFdmVuIG1vcmUuIENvbnRpbnVlZCBvbiBwYWdlIDIgLi4uKSBUag0KRVQNCmVuZHN0cmVhbQ0KZW5kb2JqDQoNCjYgMCBvYmoNCjw8DQovVHlwZSAvUGFnZQ0KL1BhcmVudCAzIDAgUg0KL1Jlc291cmNlcyA8PA0KL0ZvbnQgPDwNCi9GMSA5IDAgUiANCj4+DQovUHJvY1NldCA4IDAgUg0KPj4NCi9NZWRpYUJveCBbMCAwIDYxMi4wMDAwIDc5Mi4wMDAwXQ0KL0NvbnRlbnRzIDcgMCBSDQo+Pg0KZW5kb2JqDQoNCjcgMCBvYmoNCjw8IC9MZW5ndGggNjc2ID4+DQpzdHJlYW0NCjIgSg0KQlQNCjAgMCAwIHJnDQovRjEgMDAyNyBUZg0KNTcuMzc1MCA3MjIuMjgwMCBUZA0KKCBTaW1wbGUgUERGIEZpbGUgMiApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY4OC42MDgwIFRkDQooIC4uLmNvbnRpbnVlZCBmcm9tIHBhZ2UgMS4gWWV0IG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA2NzYuNjU2MCBUZA0KKCBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY2NC43MDQwIFRkDQooIHRleHQuIE9oLCBob3cgYm9yaW5nIHR5cGluZyB0aGlzIHN0dWZmLiBCdXQgbm90IGFzIGJvcmluZyBhcyB3YXRjaGluZyApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY1Mi43NTIwIFRkDQooIHBhaW50IGRyeS4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA2NDAuODAwMCBUZA0KKCBCb3JpbmcuICBNb3JlLCBhIGxpdHRsZSBtb3JlIHRleHQuIFRoZSBlbmQsIGFuZCBqdXN0IGFzIHdlbGwuICkgVGoNCkVUDQplbmRzdHJlYW0NCmVuZG9iag0KDQo4IDAgb2JqDQpbL1BERiAvVGV4dF0NCmVuZG9iag0KDQo5IDAgb2JqDQo8PA0KL1R5cGUgL0ZvbnQNCi9TdWJ0eXBlIC9UeXBlMQ0KL05hbWUgL0YxDQovQmFzZUZvbnQgL0hlbHZldGljYQ0KL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcNCj4+DQplbmRvYmoNCg0KMTAgMCBvYmoNCjw8DQovQ3JlYXRvciAoUmF2ZSBcKGh0dHA6Ly93d3cubmV2cm9uYS5jb20vcmF2ZVwpKQ0KL1Byb2R1Y2VyIChOZXZyb25hIERlc2lnbnMpDQovQ3JlYXRpb25EYXRlIChEOjIwMDYwMzAxMDcyODI2KQ0KPj4NCmVuZG9iag0KDQp4cmVmDQowIDExDQowMDAwMDAwMDAwIDY1NTM1IGYNCjAwMDAwMDAwMTkgMDAwMDAgbg0KMDAwMDAwMDA5MyAwMDAwMCBuDQowMDAwMDAwMTQ3IDAwMDAwIG4NCjAwMDAwMDAyMjIgMDAwMDAgbg0KMDAwMDAwMDM5MCAwMDAwMCBuDQowMDAwMDAxNTIyIDAwMDAwIG4NCjAwMDAwMDE2OTAgMDAwMDAgbg0KMDAwMDAwMjQyMyAwMDAwMCBuDQowMDAwMDAyNDU2IDAwMDAwIG4NCjAwMDAwMDI1NzQgMDAwMDAgbg0KDQp0cmFpbGVyDQo8PA0KL1NpemUgMTENCi9Sb290IDEgMCBSDQovSW5mbyAxMCAwIFINCj4+DQoNCnN0YXJ0eHJlZg0KMjcxNA0KJSVFT0YNCg==
 * 
 * getDocument({
    url: urlOrFile, // .data, .range or .url
    cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@'+ PDFJS.version +'/cmaps/', // 可选，加载
    cMapPacked: true,
    standardFontDataUrl: 'standard_fonts/', // 可选，加载字体（好像是node里面使用）
});
*/
export default {
    props: {
        type: { // 简介模式、还是
            type: Number,
            default: 1
        },
        urlOrFile: { // file 对象、url地址、本地地址、base64
            type: String,
            default: ''
        },
        viewer: { // 
            type: String,
            default: ''
        },
        height: {
            type: String,
            default: '500px'
        }
    },
    data: () => ({
        pdf: null,
        options: {
            page: 1,
            fallbackLink: '浏览器不支持PDF查看功能，请更换谷歌浏览器',
            forcePDFJS: true
        },
        pdfDocument: {
            numPages: 0
        }
    }),
    created () {
    },
    mounted () {
        // 单页查看器
        this.onePage(this.urlOrFile)
        // 常用方法
        // this.setDw(this.urlOrFile)
        // 基本使用
        // this.news(this.urlOrFile)
        // this.gettext(this.urlOrFile)
        // .then(function (text) {
        //     console.log('parse ' + text);
        //     })
        // this.setUrl(this.urlOrFile);
    },
    methods: {
        onePage(url) {
            const eventBus = new EventBus();
            const container = document.getElementById("viewerContainer");
            const linkService = new PDFLinkService({
                eventBus,
            });
            let pdfViewer = new PDFViewer({
                container,
                eventBus,
                linkService,
                // l10n: NullL10n,
                useOnlyCssZoom: true,
                textLayerMode: 0,
            });
            window.pdfViewer = pdfViewer
            /**
             * pdfViewer.currentPageNumber = 1 // 切换第几页
             * pdfViewer.currentPageNumber; // 获取当前第几页
             * pdfDocument.numPages = 
             * 放大、缩小
             *  zoomIn: function pdfViewZoomIn(ticks) {
                    let newScale = this.pdfViewer.currentScale;  // 获取当前的缩放值
                    do {
                        newScale = (newScale * DEFAULT_SCALE_DELTA).toFixed(2);
                        newScale = Math.ceil(newScale * 10) / 10;
                        newScale = Math.min(MAX_SCALE, newScale);
                    } while (--ticks && newScale < MAX_SCALE);
                    // 更新计算后的值
                    this.pdfViewer.currentScaleValue = newScale;
                },

                zoomOut: function pdfViewZoomOut(ticks) {
                    let newScale = this.pdfViewer.currentScale;
                    do {
                    newScale = (newScale / DEFAULT_SCALE_DELTA).toFixed(2);
                    newScale = Math.floor(newScale * 10) / 10;
                    newScale = Math.max(MIN_SCALE, newScale);
                    } while (--ticks && newScale > MIN_SCALE);
                    this.pdfViewer.currentScaleValue = newScale;
                },
            */
            const loadingTask = PDFJS.getDocument({
                    url,
                    maxImageSize: 1024 * 1024,
                    cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@'+ PDFJS.version +'/cmaps/',
                    cMapPacked: true,
                });
                this.pdfLoadingTask = loadingTask;

                loadingTask.onProgress = function (progressData) {
                    console.log(progressData.loaded / progressData.total);
                };
                // pdfDocument.getMetadata().then(function (data) {
                // const info = data.info,
                //     metadata = data.metadata;
                // self.documentInfo = info;
                // self.metadata = metadata;
                // let pdfTitle;
                //     if (metadata && metadata.has("dc:title")) {
                //         const title = metadata.get("dc:title");
                //         // Ghostscript sometimes returns 'Untitled', so prevent setting the
                //         // title to 'Untitled.
                //         if (title !== "Untitled") {
                //         pdfTitle = title;
                //         }
                //     }

                //     if (!pdfTitle && info && info.Title) {
                //         pdfTitle = info.Title;
                //     }

                //     if (pdfTitle) {
                //         self.setTitle(pdfTitle + " - " + document.title);
                //     }
                return loadingTask.promise.then(
                function (pdfDocument) {
                    // Document loaded, specifying document for the viewer.
                    // self.pdfDocument = pdfDocument;
                    pdfViewer.setDocument(pdfDocument);
                    // self.pdfLinkService.setDocument(pdfDocument);
                    // self.pdfHistory.initialize({ fingerprint: pdfDocument.fingerprint });

                    // self.loadingBar.hide();
                    // self.setTitleUsingMetadata(pdfDocument);
                },
                );
            // const SEARCH_FOR = ""; // try 'Mozilla';
            // const container = document.getElementById("viewerContainer");
            // const eventBus = EventBus();
            // （可选）使用内置组件的PDF.js单页查看器
            // const pdfLinkService = PDFLinkService({
            //     // eventBus,
            // });

            //（可选）启用查找控制器。
            // const pdfFindController = PDFFindController({
            //     // eventBus,
            //     linkService: pdfLinkService,
            // });

            // (Optionally) enable scripting support.
            // const pdfScriptingManager = PDFScriptingManager({
            //     // eventBus,
            //     sandboxBundleSrc: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.8.335/legacy/build/pdf.sandbox.js',
            // });
            // const pdfSinglePageViewer = PDFSinglePageViewer({
            //     container,
            //     // eventBus,
            //     // linkService: pdfLinkService,
            //     // findController: pdfFindController,
            //     scriptingManager: pdfScriptingManager,
            //     // enableScripting: true,
            //     });
                // pdfLinkService.setViewer(pdfSinglePageViewer);
                // pdfScriptingManager.setViewer(pdfSinglePageViewer);

                // eventBus.on("pagesinit", function () {
                //     // We can use pdfSinglePageViewer now, e.g. let's change default scale.
                //     pdfSinglePageViewer.currentScaleValue = "page-width";

                //     // We can try searching for things.
                //     if (SEARCH_FOR) {
                //         pdfFindController.executeCommand("find", { query: SEARCH_FOR });
                //     }
                // });

                // Loading document.
                // const loadingTask = PDFJS.getDocument({
                //     url: DEFAULT_URL,
                //     cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@'+ PDFJS.version +'/cmaps/',
                //     cMapPacked: true,
                // });
                // loadingTask.promise.then(function (pdfDocument) {
                //     console.log(pdfDocument);
                //     // Document loaded, specifying document for the viewer and
                //     // the (optional) linkService.
                //     // pdfSinglePageViewer.setDocument(pdfDocument);

                //     // pdfLinkService.setDocument(pdfDocument, null);
                // });
            // PDFJS.getDocument()  sandbox
        },
        setDw(urlOrFile) {
            const loadingTask = PDFJS.getDocument({
                url: urlOrFile, // .data, .range or .url
                cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@'+ PDFJS.version +'/cmaps/',
                cMapPacked: true,
            });
            loadingTask.promise
            .then(function (doc) {
                const numPages = doc.numPages;
                console.log("# Document Loaded");
                console.log("Number of Pages: " + numPages);
                console.log();

                let lastPromise; // will be used to chain promises
                lastPromise = doc.getMetadata().then(function (data) {
                    /**
                     * 获取pdf上信息： JSON.stringify(data.info, null, 2)
                    */
                    if (data.metadata) {
                        // 获取页面信息字符串
                        let txt = JSON.stringify(data.metadata.getAll(), null, 2)
                        console.log('所有pdf所有页内容：',txt);
                    }
                });

                const loadPage = function (pageNum) {
                        return doc.getPage(pageNum).then(function (page) {
                            console.log("第" + pageNum + '页');
                            const viewport = page.getViewport({ scale: 1.0 });
                            console.log("Size: " + viewport.width + "x" + viewport.height);
                            console.log();
                            return page.getTextContent().then(function (content) { // 获取pdf上内容，包括内容和布局
                                console.log(content) // content.items为 当前页的所有布局以及样式位置
                                const strings = content.items.map(function (item) {
                                    return item.str;
                                });
                                console.log('当前页面的文本内容\n',strings.join(" "));
                            })
                            .then(function () {
                                console.log();
                            });
                        });
                };
                // Loading of the first page will wait on metadata and subsequent loadings
                // will wait on the previous pages.
                for (let i = 1; i <= numPages; i++) {
                    lastPromise = lastPromise.then(loadPage.bind(null, i));
                }
                return lastPromise;
            })
            .then(
                function () {
                console.log("# End of Document");
                },
                function (err) {
                console.error("Error: " + err);
                }
            );
        },
         // 初始化pdf
        setUrl(urlOrFile) {
            // PDFJS.isPdfFile 判断是file 名称是否是pdf文件
            console.log(PDFJS); // viewerContainer
            PDFJS.getDocument({
                url: urlOrFile, // .data, .range or .url
                cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@'+ PDFJS.version +'/cmaps/',
                cMapPacked: true,
            })
            .promise
            .then((pdfDocument) => {
                console.log(pdfDocument);
                this.pdfDocument = pdfDocument
                this.$nextTick(() => {
                    this.canvas = document.querySelectorAll('.can');
                    let len = pdfDocument.numPages
                    for (let i = 0; i < len; i++) {
                        this.setCanvans(i)
                    }
                })
            });
        },
        // 生成canvas
        setCanvans(i) {
            this.pdfDocument.getPage(i+1)
            .then((pdfPage) => {
                const viewport = pdfPage.getViewport({ scale: 3.0 });
                const canvas = this.canvas[i]
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const ctx = canvas.getContext("2d");
                const renderTask = pdfPage.render({
                    canvasContext: ctx,
                    viewport,
                });
                return renderTask.promise;
            })
        },
        onPassword(tt) {
            console.log(tt);
        },
        gettext(pdfUrl){
            var pdfs = PDFJS.getDocument({
                url: pdfUrl, // .data, .range or .url
                cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@'+ PDFJS.version +'/cmaps/',
                cMapPacked: true
            });
            // let vm = this;
            pdfs.onProgress = this.onPassword
            return pdfs.promise.then(function() { // get all pages text
                // var MAX_NUM_PAGES = 5;
                // var ii = Math.min(MAX_NUM_PAGES, numPages);
                // var promise = Promise.resolve();
                // for (var i = 1; i <= ii; i++) {
                    // if(document.querySelector('[name="page='+i+'"]')){
                    //     let container = document.querySelector('[name="page='+i+'"]').children[0];
                    //     var viewport = vm.pdfPage.getViewport(vm.scale);
                    //     document.querySelector('.pageContainer').children[0].width.baseVal.value = viewport.width;
                    //     document.querySelector('.pageContainer').children[0].height.baseVal.value = viewport.height;
                    //     container.style.width = viewport.width + 'px';
                    //     container.style.height = viewport.height + 'px';
                    //     document.querySelector('.scroll-content-info').style.width = document.querySelector('.pageContainer').getBoundingClientRect().width + 'px';
                    //     return;
                    // }
                    // var anchor = document.createElement('a');
                    // anchor.setAttribute('name', 'page=' + i);
                    // anchor.setAttribute('class', 'pdfATag');
                    // anchor.setAttribute('title', 'Page ' + i);
                    // document.getElementsByClassName("scroll-content-info")[0].appendChild(anchor);

                    // Using promise to fetch and render the next page
                    // promise = promise.then(function (pageNum, anchor) {
                    // return pdf.getPage(pageNum).then(function (page) {
                    //     vm.pdfPage = page;
                    //     var viewport = page.getViewport(vm.scale);
                    //     var container = document.createElement('div');
                    //     container.id = 'pageContainer' + pageNum;
                    //     container.className = 'pageContainer';
                    //     container.style.width = viewport.width + 'px';
                    //     container.style.height = viewport.height + 'px';
                    //     anchor.appendChild(container);

                    //     return page.getOperatorList().then(function (opList) {
                    //         var svgGfx = new PDFJS.SVGGraphics(page.commonObjs, page.objs);
                    //             return svgGfx.getSVG(opList, viewport).then(function (svg) {
                    //                 container.appendChild(svg);
                    //                 document.querySelector('.scroll-content-info').style.width = document.querySelector('.pageContainer').getBoundingClientRect().width + 'px';
                    //                 // vm.$refs.scroll.refresh();
                    //                 // Util.setLoading(!1);
                    //                 // !vm.pdfWaterMark && Util.getUserInfo(vm.addWaterMarker);
                    //             });
                    //         });
                    //     });
                    // }.bind(null, i, anchor));
                // }
            });
        },
        // ok的
        news(urlOrFile) {
            let container = document.getElementById('pdfViewer');
            const eventBus = new EventBus(); // 开启调试
            PDFJS.getDocument({
                url: urlOrFile, // .data, .range or .url
                cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@'+ PDFJS.version +'/cmaps/',
                cMapPacked: true
            }).promise.then((pdf) => {
                pdf.getPage(1).then(function (pdfPage) {
                    let SCALE = 1.0 // 缩放
                    const pdfPageView = new PDFPageView({
                        container,
                        id: 1,
                        scale: SCALE,
                        defaultViewport: pdfPage.getViewport({ scale: SCALE }),
                        eventBus,
                        // We can enable text/annotations layers, if needed
                        textLayerFactory: new DefaultTextLayerFactory(),
                        annotationLayerFactory: new DefaultAnnotationLayerFactory(),
                    });
                        // Associates the actual page with the view, and drawing it
                        pdfPageView.setPdfPage(pdfPage);
                        return pdfPageView.draw();
                })
            }, (reason) => {
                console.error(reason);
            });
        },
        loadPdf () {
            // this.pdf = PDF
            // this.pdf.embed(url, this.$el, this.options)
            // this.$el.style.height = this.height
        }
    },
    // beforeDestroy() {
    //     this.pdfDocument.destroy()
    // }
}
</script>
<style scoped>
#pdfViewer {
    position: relative;
    display: flex;
    margin: 0;
}
canvas {
    width: 100%;
}

* {
    padding: 0;
    margin: 0;
    }

    html {
    height: 100%;
    width: 100%;
    overflow: hidden;
    font-size: 10px;
    }

    header {
    background-color: rgba(244, 244, 244, 1);
    }

    header h1 {
    border-bottom: 1px solid rgba(216, 216, 216, 1);
    color: rgba(133, 133, 133, 1);
    font-size: 23px;
    font-style: italic;
    font-weight: normal;
    overflow: hidden;
    padding: 10px;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    }

    body {
    /* background: url(images/document_bg.png); */
    color: rgba(255, 255, 255, 1);
    font-family: sans-serif;
    font-size: 10px;
    height: 100%;
    width: 100%;
    overflow: hidden;
    padding-bottom: 5rem;
    }

    section {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-size: 2rem;
    }

    footer {
    /* background-image: url(images/toolbar_background.png); */
    height: 4rem;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    box-shadow: 0 -0.2rem 0.5rem rgba(50, 50, 50, 0.75);
    }

    .toolbarButton {
    display: block;
    padding: 0;
    margin: 0;
    border-width: 0;
    background-position: center center;
    background-repeat: no-repeat;
    background-color: rgba(0, 0, 0, 0);
    }

    .toolbarButton.pageUp {
    position: absolute;
    width: 18%;
    height: 100%;
    left: 0;
    /* background-image: url(images/icon_previous_page.png); */
    background-size: 2rem;
    }

    .toolbarButton.pageDown {
    position: absolute;
    width: 18%;
    height: 100%;
    left: 18%;
    /* background-image: url(images/icon_next_page.png); */
    background-size: 2rem;
    }

    #pageNumber {
    -moz-appearance: textfield; /* hides the spinner in moz */
    position: absolute;
    width: 28%;
    height: 100%;
    left: 36%;
    text-align: center;
    border: 0;
    background-color: rgba(0, 0, 0, 0);
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 1);
    /* background-image: url(images/div_line_left.png),
        url(images/div_line_right.png); */
    background-repeat: no-repeat;
    background-position: left, right;
    background-size: 0.2rem, 0.2rem;
    }

    .toolbarButton.zoomOut {
    position: absolute;
    width: 18%;
    height: 100%;
    left: 64%;
    /* background-image: url(images/icon_zoom_out.png); */
    background-size: 2.4rem;
    }

    .toolbarButton.zoomIn {
    position: absolute;
    width: 18%;
    height: 100%;
    left: 82%;
    /* background-image: url(images/icon_zoom_in.png); */
    background-size: 2.4rem;
    }

    .toolbarButton[disabled] {
    opacity: 0.3;
    }

    .hidden {
    display: none;
    }
    [hidden] {
    display: none !important;
    }

    #viewerContainer {
    position: absolute;
    overflow: auto;
    width: 100%;
    top: 5rem;
    bottom: 4rem;
    left: 0;
    right: 0;
    }

    canvas {
    margin: auto;
    display: block;
    }

    .pdfViewer .page .loadingIcon {
    width: 2.9rem;
    height: 2.9rem;
    /* background: url("images/spinner.png") no-repeat left top / 38rem; */
    border: medium none;
    animation: 1s steps(10, end) 0s normal none infinite moveDefault;
    display: block;
    position: absolute;
    top: calc((100% - 2.9rem) / 2);
    left: calc((100% - 2.9rem) / 2);
    }

    @keyframes moveDefault {
    from {
        background-position: 0 top;
    }

    to {
        background-position: -39rem top;
    }
    }

    #loadingBar {
    position: relative;
    height: 0.6rem;
    background-color: rgba(51, 51, 51, 1);
    border-bottom: 1px solid rgba(51, 51, 51, 1);
    margin-top: 5rem;
    }

    #loadingBar .progress {
    position: absolute;
    left: 0;
    width: 0;
    height: 100%;
    background-color: rgba(221, 221, 221, 1);
    overflow: hidden;
    transition: width 200ms;
    }

    @keyframes progressIndeterminate {
    0% {
        left: 0;
    }
    50% {
        left: 100%;
    }
    100% {
        left: 100%;
    }
    }

    #loadingBar .progress.indeterminate {
    background-color: rgba(153, 153, 153, 1);
    transition: none;
    }

    #loadingBar .indeterminate .glimmer {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 5rem;
    background-image: linear-gradient(
        to right,
        rgba(153, 153, 153, 1) 0%,
        rgba(255, 255, 255, 1) 50%,
        rgba(153, 153, 153, 1) 100%
    );
    background-size: 100% 100%;
    background-repeat: no-repeat;
    animation: progressIndeterminate 2s linear infinite;
    }

    #errorWrapper {
    background: none repeat scroll 0 0 rgba(255, 85, 85, 1);
    color: rgba(255, 255, 255, 1);
    left: 0;
    position: absolute;
    right: 0;
    top: 3.2rem;
    z-index: 1000;
    padding: 0.3rem;
    font-size: 0.8em;
    }

    #errorMessageLeft {
    float: left;
    }

    #errorMessageRight {
    float: right;
    }

    #errorMoreInfo {
    background-color: rgba(255, 255, 255, 1);
    color: rgba(0, 0, 0, 1);
    padding: 0.3rem;
    margin: 0.3rem;
    width: 98%;
    }
</style>