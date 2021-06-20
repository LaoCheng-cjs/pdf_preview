<template>
    <div>
        <canvas class="can" v-for="(item, index) in pdfDocument.numPages" :key="index" ></canvas>
    </div>
</template>
<script>
var PDFJS = require('pdfjs-dist/legacy/build/pdf.js');
// 核心代码
import workerSrc from 'pdfjs-dist/legacy/build/pdf.worker.entry'
PDFJS.workerSrc = workerSrc;
export default {
    props: {
        urlOrFile: { // file 对象、url地址、本地地址、base64
            type: String,
            default: ''
        },
        cMapUrl: { // file 对象、url地址、本地地址、base64
            type: String,
            default: ''
        },
        cMapPacked: {
            type: Boolean,
            default: true
        }
    },
    data: () => ({
        pdfDocument: {
            numPages: 0
        },
        pdf: null
    }),
    created () {
    },
    mounted () {
        this.setUrl(this.urlOrFile)
    },
    methods: {
         // 初始化pdf
        setUrl(urlOrFile) {
            this.pdf = PDFJS.getDocument({
                url: urlOrFile,
                cMapUrl: this.cMapUrl || 'https://cdn.jsdelivr.net/npm/pdfjs-dist@'+ PDFJS.version +'/cmaps/',
                cMapPacked: this.cMapPacked,
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
        }
    },
    beforeDestroy() {
        this.pdfDocument.destroy()
    }
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

    #viewerContainer {
        width: 100%;
        height: 100%;
        position: absolute;
        overflow: auto;
    }

    canvas {
        margin: auto;
        display: block;
    }
</style>