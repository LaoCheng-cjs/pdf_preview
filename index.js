const PDFJS = () => import('pdf_preview/legacy/build/pdf.js');
// 核心代码
const workerSrc  =  () => import('pdf_preview/legacy/build/pdf.worker.entry')

const pdf_viewer = () => import('pdf_preview/legacy/web/pdf_viewer')
// const {PDFPageView, EventBus, DefaultAnnotationLayerFactory, DefaultTextLayerFactory, PDFViewer, PDFLinkService} = require('pdfjs-dist/legacy/web/pdf_viewer');
// import('pdfjs-dist/legacy/web/pdf_viewer.css')
// console.log(PDFJS());
/**
 * 为了做到模块化打包，所以需要两个拿到了这两个对象才能访问
 * 实例化传参
 *  {
 *      target: 'dom', 字符串或者dom对象
 *      urlOrFile: 'url', url地址、base64、blob 地址、二进制、file对象
 *      cMapPacked: true 压缩 布尔默认为true
 *      renderer: 'canvas', // 渲染方式，默认canvas。也可以设置svg
 *      debug: false; // 开启调试模式，默认不开启false，true为开启
 * }
 * 
 * 方法如下
 *  打印：判断是否是  window.print();
 *  
 *  pagesinit 屏幕初始化
 *  pagechanging 视图改变
 *  rotationchanging  // 监听旋转
 *  eventBus._on("resize", webViewerResize);
    eventBus._on("hashchange", webViewerHashchange);
    eventBus._on("beforeprint", _boundEvents.beforePrint);
    eventBus._on("afterprint", _boundEvents.afterPrint);
    eventBus._on("pagerendered", webViewerPageRendered);
    eventBus._on("updateviewarea", webViewerUpdateViewarea);
    eventBus._on("pagechanging", webViewerPageChanging);
    eventBus._on("scalechanging", webViewerScaleChanging);
    eventBus._on("rotationchanging", webViewerRotationChanging);
    eventBus._on("sidebarviewchanged", webViewerSidebarViewChanged);
    eventBus._on("pagemode", webViewerPageMode);
    eventBus._on("namedaction", webViewerNamedAction);
    eventBus._on("presentationmodechanged", webViewerPresentationModeChanged);
    eventBus._on("presentationmode", webViewerPresentationMode);
    eventBus._on("print", webViewerPrint);
    eventBus._on("download", webViewerDownload);
    eventBus._on("save", webViewerSave);
    eventBus._on("firstpage", webViewerFirstPage);
    eventBus._on("lastpage", webViewerLastPage);
    eventBus._on("nextpage", webViewerNextPage);
    eventBus._on("previouspage", webViewerPreviousPage);
    eventBus._on("zoomin", webViewerZoomIn);
    eventBus._on("zoomout", webViewerZoomOut);
    eventBus._on("zoomreset", webViewerZoomReset);
    eventBus._on("pagenumberchanged", webViewerPageNumberChanged);
    eventBus._on("scalechanged", webViewerScaleChanged);
    eventBus._on("rotatecw", webViewerRotateCw);
    eventBus._on("rotateccw", webViewerRotateCcw);
    eventBus._on("optionalcontentconfig", webViewerOptionalContentConfig);
    eventBus._on("switchscrollmode", webViewerSwitchScrollMode);
    eventBus._on("scrollmodechanged", webViewerScrollModeChanged);
    eventBus._on("switchspreadmode", webViewerSwitchSpreadMode);
    eventBus._on("spreadmodechanged", webViewerSpreadModeChanged);
    eventBus._on("documentproperties", webViewerDocumentProperties);
    eventBus._on("find", webViewerFind);
    eventBus._on("findfromurlhash", webViewerFindFromUrlHash);
    eventBus._on("updatefindmatchescount", webViewerUpdateFindMatchesCount);
    eventBus._on("updatefindcontrolstate", webViewerUpdateFindControlState);
  off 也是一样的，进行解除
 * 使用方法 new pdf().on('rotationchanging', () => {} , 布尔值)
*/

const KNOWN_VERSIONS = [
    "1.0",
    "1.1",
    "1.2",
    "1.3",
    "1.4",
    "1.5",
    "1.6",
    "1.7",
    "1.8",
    "1.9",
    "2.0",
    "2.1",
    "2.2",
    "2.3",
];
const KNOWN_GENERATORS = [
    "acrobat distiller",
    "acrobat pdfwriter",
    "adobe livecycle",
    "adobe pdf library",
    "adobe photoshop",
    "ghostscript",
    "tcpdf",
    "cairo",
    "dvipdfm",
    "dvips",
    "pdftex",
    "pdfkit",
    "itext",
    "prince",
    "quarkxpress",
    "mac os x",
    "microsoft",
    "openoffice",
    "oracle",
    "luradocument",
    "pdf-xchange",
    "antenna house",
    "aspose.cells",
    "fpdf",
];
class Pdf {
    constructor(options) {
        console.log(options);
        console.log(this);
        if(Object.prototype.toString.call(options) != "[object Object]") { // 判断是不是对象
            this.err('实例化传参错误');
            return;
        }
        let target = null;
        if(!options.target) { // dom对象是否存在
            this.err('没有传target选择器或者是dom对象');
            return;
        }else if(Pdf.isDOM(options.target)) { // 如果是dom对象
            target = options.target
        }else {
            target = document.querySelector(options.target)
            if(!target) {
                this.err('dom获取失败，请检查是否正确');
                return;
            }
        }
        this.target = target;
        if(!options.urlOrFile) {
            this.err('url或者file文件使用的字段为urlOrFile没有值，请确认地址或者文件');
            return;
        }
        if(!options.hasOwnProperty('cMapPacked')) { // 判断是否有这个参数 options
            options.cMapPacked = true;
        }
        if(!options.hasOwnProperty('debug')) {
            options.debug = false; // 开启调试模式
        }
        options.renderer = ['svg','canvas'].includes(options.renderer) ? options.renderer : 'canvas'
        this.options = options;
        this.DEFAULT_SCALE_DELTA = 1.1; // 缩放率
        this.MIN_SCALE = 0.25; // 最小缩放
        this.MAX_SCALE = 10.0; // 最大缩放
        this.DEFAULT_SCALE_VALUE = "auto"; // "page-width" 根据屏幕宽度来显示    "page-fit"  'page-actual'
        this.onProgress = null
        this.MAX_IMAGE_SIZE = 1024 * 1024;
        this.pageChanging = null
        // 加载依赖
        Promise.all([PDFJS(),workerSrc(),pdf_viewer()])
        .then((result) => {
            let pdf = result[0];
            this.pdf = pdf
            pdf.workerSrc = result[1].workerSrc;
            // 进度条
            pdf.onProgress = function (progressData) {
                if(this.onProgress) {
                    this.onProgress(progressData.loaded / progressData.total, progressData)
                }
            }
            const {PDFHistory,PDFPageView,PDFFindController, EventBus, DefaultAnnotationLayerFactory, DefaultTextLayerFactory, PDFViewer, PDFLinkService, NullL10n} = result[2];
            // 启动视图
            const eventBus = new EventBus();
            const linkService = new PDFLinkService({
                eventBus,
            });
            this.pdfLinkService = linkService;
            // 启动查找工具
            const findController = new PDFFindController({
                linkService: linkService,
                eventBus,
            });
            this.findController = findController;
            this.l10n = NullL10n;
            // console.log(this.l10n);
            let pdfViewer = new PDFViewer({
                container: target, // dom元素： {HTMLDivElement} container - The container for the viewer element.
                // viewer: dom // 可选，视图操作 {HTMLDivElement} [viewer] - The viewer element.
                eventBus, // 监听事件操作 The application event bus.
                linkService, //{IPDFLinkService} linkService - The navigation/linking service.
                //downloadManager: 可选 {DownloadManager} [downloadManager] - The download manager
                // {PDFFindController} [findController] - The find controller
                //  {PDFScriptingManager} [scriptingManager] - The scripting manager
                //    {PDFRenderingQueue} [renderingQueue] - The rendering queue object.
                /**
                * @property {boolean} [removePageBorders] - Removes the border shadow around
                *   the pages. The default value is `false`.
                * @property {number} [textLayerMode] - Controls if the text layer used for
                *   selection and searching is created, and if the improved text selection
                *   behaviour is enabled. The constants from {TextLayerMode} should be used.
                *   The default value is `TextLayerMode.ENABLE`.
                * @property {string} [imageResourcesPath] - Path for image resources, mainly
                *   mainly for annotation icons. Include trailing slash.
                * @property {boolean} [renderInteractiveForms] - Enables rendering of
                *   interactive form elements. The default value is `true`.
                * @property {boolean} [enablePrintAutoRotate] - Enables automatic rotation of
                *   landscape pages upon printing. The default is `false`.
                * @property {number} [maxCanvasPixels] - The maximum supported canvas size in
                *   total pixels, i.e. width * height. Use -1 for no limit. The default value
                *   is 4096 * 4096 (16 mega-pixels).
                * * @property {boolean} [enableScripting] - Enable embedded script execution
                *   (also requires {scriptingManager} being set). The default value is `false`.
                */
                pdfBug: options.debug,
                findController,
                // locale: 'zh-cn',
                l10n: this.l10n,
                useOnlyCssZoom: true, // 是否开启缩放功能
                textLayerMode: 0, // 文本层，在canvas或者svg中0禁止，1显示 2
                maxImageSize: this.MAX_IMAGE_SIZE, // 画布大小
                renderer: options.renderer, // 渲染方式：{string} renderer - 'canvas' or 'svg'. The default is 'canvas'.
            });
            this.pdfViewer = pdfViewer
            // 添加事件
            this.on = (eventName, fn, flag) => {
                eventBus.on(eventName, fn, flag);
            }
            if(this.load) {
                this.load()
            }
            // 页面初始化完成
            eventBus.on("pagesinit",  () => {
                // 设置默认尺寸，进行缩放
                this.setPageWidth(this.DEFAULT_SCALE_VALUE)
                target.scrollTo(0,0)
            });
            linkService.setViewer(pdfViewer);
            let pdfHistory = new PDFHistory({
                eventBus,
                linkService,
            });
            this.pdfHistory = pdfHistory
            linkService.setHistory(pdfHistory);
            // 获取pdf内容
            pdf.getDocument({
                url: options.urlOrFile,
                cMapUrl: options.cMapUrl || 'https://cdn.jsdelivr.net/npm/pdfjs-dist@'+ PDFJS.version +'/cmaps/',
                cMapPacked: options.cMapPacked,
            })
            .promise
            .then((pdfDocument) => {
                this.pdfDocument = pdfDocument;
                pdfViewer.setDocument(pdfDocument);
                linkService.setDocument(pdfDocument);
                pdfHistory.initialize({ fingerprint: pdfDocument.fingerprint });
                this.setTitleUsingMetadata(pdfDocument)
            });
            // 销毁
            this.destroy = () => {
                this.pdf.destroy()
            }
            // const page = evt.pageNumber;
            // const numPages = PDFViewerApplication.pagesCount;
            // document.getElementById("pageNumber").value = page;
            // document.getElementById("previous").disabled = page <= 1;
            // document.getElementById("next").disabled = page >= numPages;
        })
    }
    // 当前创建生命周期完成
    onload(fn) {
        this.load = fn;
    }
    get getTitle() {
        let title = this.pdf.getFilenameFromUrl(this.options.urlOrFile) || this.options.urlOrFile;
        try {
            title = decodeURIComponent(title);
        } catch (e) {
            // decodeURIComponent may throw URIError,
            // fall back to using the unprocessed url in that case
        }
        return title;
    }
    open(newPdf) { // 打开新的pdf
        let params = {url: newPdf}
        if (this.pdfLoadingTask) {
            // We need to destroy already opened document
            return this.close().then(
                function () {
                // ... and repeat the open() call.
                return this.open(params);
                }.bind(this)
            );
        }
        const url = params.url;
        const self = this;
        // this.setTitleUsingUrl(url);
        // Loading document.
        const loadingTask = this.pdf.getDocument({
            url,
            maxImageSize: MAX_IMAGE_SIZE,
            cMapUrl: CMAP_URL,
            cMapPacked: CMAP_PACKED,
        });
        this.pdfLoadingTask = loadingTask;
        loadingTask.onProgress = function (progressData) {
            if(this.onProgress) {
                this.onProgress(progressData.loaded / progressData.total, progressData)
            }
        };
        return loadingTask.promise.then(
                function (pdfDocument) {
                    // Document loaded, specifying document for the viewer.
                    self.pdfDocument = pdfDocument;
                    self.pdfViewer.setDocument(pdfDocument);
                    self.pdfLinkService.setDocument(pdfDocument);
                    self.pdfHistory.initialize({ fingerprint: pdfDocument.fingerprint });
                    // self.loadingBar.hide();
                    self.setTitleUsingMetadata(pdfDocument);
                },
                function (exception) {
                    const message = exception && exception.message;
                    const l10n = self.l10n;
                    let loadingErrorMessage;
                    if (exception instanceof pdfjsLib.InvalidPDFException) {
                    // change error message also for other builds
                    loadingErrorMessage = l10n.get(
                        "invalid_file_error",
                        null,
                        "Invalid or corrupted PDF file."
                    );
                    } else if (exception instanceof pdfjsLib.MissingPDFException) {
                    // special message for missing PDFs
                    loadingErrorMessage = l10n.get(
                        "missing_file_error",
                        null,
                        "Missing PDF file."
                    );
                    } else if (exception instanceof pdfjsLib.UnexpectedResponseException) {
                    loadingErrorMessage = l10n.get(
                        "unexpected_response_error",
                        null,
                        "Unexpected server response."
                    );
                    } else {
                    loadingErrorMessage = l10n.get(
                        "loading_error",
                        null,
                        "An error occurred while loading the PDF."
                    );
                    }
                    loadingErrorMessage.then(function (msg) {
                    self.error(msg, { message });
                    });
                    self.loadingBar.hide();
                }
        );
    }
    /**
   * Closes opened PDF document.
   * @returns {Promise} - Returns the promise, which is resolved when all
   *                      destruction is completed.
   */
    close() {
        // const errorWrapper = document.getElementById("errorWrapper");
        // errorWrapper.hidden = true;

        if (!this.pdfLoadingTask) {
            return Promise.resolve();
        }

        const promise = this.pdfLoadingTask.destroy();
        this.pdfLoadingTask = null;

        if (this.pdfDocument) {
            this.pdfDocument = null;

            this.pdfViewer.setDocument(null);
            this.pdfLinkService.setDocument(null, null);

            if (this.pdfHistory) {
                this.pdfHistory.reset();
            }
        }
        return promise;
    }
     // 搜索
    webViewerFind(evt) {
        /**
         * 搜索事件名称：
         *  find 查找
         *  findentirewordchange 整个单词更改
         *  findagain 根据搜索定位到下一个搜索到的位置。和findPrevious一起连用
         *  casesensitivitychang 区分大小写。caseSensitive 连用，默认为 false
         *  要和下面事件一起连用起来：查找中，查找完成、查找个数、
         *  eventBus._on("find", webViewerFind);
            eventBus._on("findfromurlhash", webViewerFindFromUrlHash);
            eventBus._on("updatefindmatchescount", webViewerUpdateFindMatchesCount);
            eventBus._on("updatefindcontrolstate", webViewerUpdateFindControlState);
        */
        PDFViewerApplication.findController.executeCommand("find" + evt.type, {
            query: evt.query, // 关键词
            phraseSearch: evt.phraseSearch, // 短语搜索 true
            caseSensitive: evt.caseSensitive, // 区分大小写（字词匹配），false 。 true为区别大小写
            entireWord: evt.entireWord, // 整个单词查找 false不全部，true整个单词搜索
            highlightAll: evt.highlightAll, // 全部高亮显示，默认给false。true全量
            findPrevious: evt.findPrevious, // 查找位置，如果是查找上一个(值为true)或者下一个（false）。默认为 undefined
        });
    }
    // 获取语言 .then(locale => {console.log(locale) });
    getLanguage () {
        return this.l10n.getLanguage()
    }
    // 下载
    download(blobUrl, filename) {
        const a = document.createElement("a");
        if (!a.click) {
            throw new Error('DownloadManager: "a.click()" is not supported.');
        }
        a.href = blobUrl;
        a.target = "_parent";
        // Use a.download if available. This increases the likelihood that
        // the file is downloaded instead of opened by another PDF plugin.
        if ("download" in a) {
            a.download = filename;
        }
        // <a> must be in the document for recent Firefox versions,
        // otherwise .click() is ignored.
        (document.body || document.documentElement).appendChild(a);
        a.click();
        a.remove();
    }
    // 旋转设置的值 0,90,-90,180,-180
    rotatePages(delta) {
        if([0,90,-90,180,-180].includes(delta)) {
            this.pdfViewer.pagesRotation += delta;
        }else {
            this.err('不支持其他度数')
        }
    }
    // 获取pdf基础信息
    setTitleUsingMetadata(pdfDocument) {
        const self = this;
        pdfDocument.getMetadata()
        .then(data => {
            const { info, metadata, contentDispositionFilename, contentLength } = data;
            if (pdfDocument !== this.pdfDocument) {
            return; // The document was closed while the metadata resolved.
            }
            this.documentInfo = info;
            this.metadata = metadata;
            this._contentDispositionFilename =  contentDispositionFilename;
            this._contentLength = contentLength; // See `getDownloadInfo`-call above.
            // this._contentLength ??= contentLength; // See `getDownloadInfo`-call above.
            // Provides some basic debug information
            // console.log(
            //     `PDF ${pdfDocument.fingerprint} [${info.PDFFormatVersion} ` +
            //         `${(info.Producer || "-").trim()} / ${(info.Creator || "-").trim()}] ` +
            //         `(PDF.js: ${version || "-"})`
            //     );
            let pdfTitle = info ? info.Title : '';
            // let pdfTitle = info?.Title;
            const metadataTitle = metadata ? metadata.get("dc:title") : '';
            // const metadataTitle = metadata?.get("dc:title");
            if (metadataTitle) {
                // Ghostscript can produce invalid 'dc:title' Metadata entries:
                //  - The title may be "Untitled" (fixes bug 1031612).
                //  - The title may contain incorrectly encoded characters, which thus
                //    looks broken, hence we ignore the Metadata entry when it
                //    contains characters from the Specials Unicode block
                //    (fixes bug 1605526).
                if (
                    metadataTitle !== "Untitled" &&
                    !/[\uFFF0-\uFFFF]/g.test(metadataTitle)
                ) {
                    pdfTitle = metadataTitle;
                }
            }
            if (pdfTitle) {
                this.setTitle(
                    `${pdfTitle} - ${contentDispositionFilename || document.title}`
                );
            } else if (contentDispositionFilename) {
                this.setTitle(contentDispositionFilename);
            }
            console.log(info);
            if ( info.IsXFAPresent && !info.IsAcroFormPresent &&
                // Note: `isPureXfa === true` implies that `enableXfa = true` was set.
                !pdfDocument.isPureXfa
                ) {
                console.warn("Warning: XFA is not enabled");
                // this.fallback(UNSUPPORTED_FEATURES.forms);
            } else if ( (info.IsAcroFormPresent || info.IsXFAPresent) && !this.pdfViewer.renderInteractiveForms ) {
                console.warn("Warning: Interactive form support is not enabled");
                // this.fallback(UNSUPPORTED_FEATURES.forms);
            }
            if (info.IsSignaturesPresent) {
                console.warn("Warning: Digital signatures validation is not supported");
                // this.fallback(UNSUPPORTED_FEATURES.signatures);
            }
                // Telemetry labels must be C++ variable friendly.
            let versionId = "other";
            if (KNOWN_VERSIONS.includes(info.PDFFormatVersion)) {
                versionId = `v${info.PDFFormatVersion.replace(".", "_")}`;
            }
            let generatorId = "other";
            if (info.Producer) {
                const producer = info.Producer.toLowerCase();
                KNOWN_GENERATORS.some(function (generator) {
                    if (!producer.includes(generator)) {
                    return false;
                    }
                    generatorId = generator.replace(/[ .-]/g, "_");
                    return true;
                });
            }
            let formType = null;
            if (info.IsXFAPresent) {
                formType = "xfa";
            } else if (info.IsAcroFormPresent) {
                formType = "acroform";
            }
            console.log({
                    type: "documentInfo",
                    version: versionId,
                    generator: generatorId,
                    formType,
                });
            // this.externalServices.reportTelemetry({
            //     type: "documentInfo",
            //     version: versionId,
            //     generator: generatorId,
            //     formType,
            // });
        })
    }
    // 
    get pagesCount() { // 获取总页数
        return this.pdfDocument.numPages;
    }
    // 获取
    get page() { // 获取当前页
        return this.pdfViewer.currentPageNumber;
    }
    // 设置
    set page(val) { // 显示第几页
        this.pdfViewer.currentPageNumber = val;
        setTimeout(() => {
            // 滚动到响应的位置上
            const dom = this.target
            dom.scrollTop = dom.scrollTop - 10
        }, 0)
    }
    // 缩小
    zoomIn (ticks) {
        let newScale = this.pdfViewer.currentScale;
        do {
            newScale = (newScale * this.DEFAULT_SCALE_DELTA).toFixed(2);
            newScale = Math.ceil(newScale * 10) / 10;
            newScale = Math.min(this.MAX_SCALE, newScale);
        } while (--ticks && newScale < this.MAX_SCALE);
        this.pdfViewer.currentScaleValue = newScale;
    }
    // 放大
    zoomOut (ticks) {
        let newScale = this.pdfViewer.currentScale;
        do {
        newScale = (newScale / this.DEFAULT_SCALE_DELTA).toFixed(2);
        newScale = Math.floor(newScale * 10) / 10;
        newScale = Math.max(this.MIN_SCALE, newScale);
        } while (--ticks && newScale > this.MIN_SCALE);
        this.pdfViewer.currentScaleValue = newScale;
    }
    // 设置屏幕宽度
    setPageWidth(val) {
        this.DEFAULT_SCALE_VALUE = val
        this.pdfViewer.currentScaleValue = val;
    }
    // 独有的判断是否是dom对象
    static isDOM(item) {
        // 首先判断是否支持HTMLELement，如果支持，使用HTMLElement，如果不支持，通过判断DOM的特征，如果拥有这些特征说明就是ODM节点，特征使用的越多越准确
        return (typeof HTMLElement === 'function')? (item instanceof HTMLElement) : (item && (typeof item === 'object') && (item.nodeType === 1) && (typeof item.nodeName === 'string'));
    }
    err(msg) {
        console.error('[pdf_viewer]' + msg)
    }
}

export default Pdf


