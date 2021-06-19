<template>
    <div>
        <div id="pdfViewer"></div>
        <!-- <canvas class="can" v-for="(item, index) in pdfDocument.numPages" :key="index" ></canvas> -->
    </div>
</template>
<script>
var PDFJS = require('pdfjs-dist/legacy/build/pdf.js');
import workerSrc from 'pdfjs-dist/legacy/build/pdf.worker.entry'
PDFJS.workerSrc = workerSrc;


import { TextLayerBuilder } from 'pdfjs-dist/legacy/web/pdf_viewer';
import 'pdfjs-dist/legacy/web/pdf_viewer.css';
/**
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
        this.news(this.urlOrFile)
        // this.gettext(this.urlOrFile)
        // .then(function (text) {
        //     console.log('parse ' + text);
        //     })
        // this.setUrl(this.urlOrFile);
    },
    methods: {
         // 初始化pdf
        setUrl(urlOrFile) {
            // PDFJS.isPdfFile 判断是file 名称是否是pdf文件
            console.log(PDFJS); // viewerContainer
            PDFJS.getDocument({
                url: urlOrFile, // .data, .range or .url
                cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@'+ PDFJS.version +'/cmaps/',
                cMapPacked: true
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
        news(urlOrFile) {
            let container = document.getElementById('pdfViewer');
            PDFJS.getDocument({
                url: urlOrFile, // .data, .range or .url
                cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@'+ PDFJS.version +'/cmaps/',
                cMapPacked: true
            }).promise.then((pdf) => {
                for (let i = 1; i <= pdf.numPages; i++) {
                    pdf.getPage(i).then((page) => {
                        console.log(page);
                        let viewport = page.getViewport({scale: 1.5});
                        let pageDiv = document.createElement('div');
                        pageDiv.setAttribute('id', 'page-' + (page._pageIndex + 1));
                        container.appendChild(pageDiv);
                        let canvas = document.createElement('canvas');
                        pageDiv.appendChild(canvas);
                        let context = canvas.getContext('2d');
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;
                        let renderContext = {
                            canvasContext: context,
                            viewport: viewport
                        };
                        page.render(renderContext)
                        .promise
                        .then(function () {
                            return page.getTextContent();
                        }).then((textContent) => {
                            // 创建文本图层div
                            const textLayerDiv = document.createElement('div');
                            textLayerDiv.setAttribute('class', 'textLayer');
                            // 将文本图层div添加至每页pdf的div中
                            document.getElementById(`page-${i}`).append(textLayerDiv);
                            // 创建新的TextLayerBuilder实例
                            let textLayer = new TextLayerBuilder({
                                textLayerDiv: textLayerDiv,
                                pageIndex: page.pageIndex,
                                viewport: viewport
                            });
                            textLayer.setTextContent(textContent);
                            textLayer.render();
                        });
                    }, (err) => {
                        console.log(err, '-------err---------');
                    });
                }
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
</style>