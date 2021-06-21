<template>
    <div class="max-pdf">
        <!-- 导航 -->
        <div class="nav-wrap">
            <!-- 返回 -->
            <div class="back"><svg t="1624288134702" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4089" width="200" height="200"><path d="M748.8 160 390.4 512l358.4 352c19.2 19.2 19.2 57.6 0 76.8-19.2 19.2-57.6 19.2-76.8 0L281.6 556.8c0 0-6.4 0-6.4-6.4C262.4 544 256 524.8 256 512c0-12.8 6.4-32 19.2-38.4 0 0 6.4 0 6.4-6.4l390.4-390.4c19.2-19.2 57.6-19.2 76.8 0C774.4 102.4 774.4 134.4 748.8 160z" p-id="4090"></path></svg></div>
            <div class="content"></div>
            <div class="more"><svg t="1624287372069" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3272" width="200" height="200"><path d="M197.844997 512m-74.694189 0a72.993 72.993 0 1 0 149.388379 0 72.993 72.993 0 1 0-149.388379 0Z" p-id="3273"></path><path d="M512 512m-74.694189 0a72.993 72.993 0 1 0 149.388379 0 72.993 72.993 0 1 0-149.388379 0Z" p-id="3274"></path><path d="M826.155003 512m-74.694189 0a72.993 72.993 0 1 0 149.388379 0 72.993 72.993 0 1 0-149.388379 0Z" p-id="3275"></path></svg></div>
        </div>
        <div class="viewerContainer-main" ref="viewer">
            <div id="viewerContainer" :style="{height: h}">
                <div id="viewer" class="pdfViewer"></div>
            </div>
        </div>
        <div class="bar-wrap"></div>
        <!-- <canvas class="can" v-for="(item, index) in pdfDocument.numPages" :key="index" ></canvas> -->
    </div>
</template>
<script>
import 'pdfjs-dist/legacy/web/pdf_viewer.css';
import  Pdf from '../index.js'
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
        h: '',
        pdfDocument: {
            numPages: 0
        }
    }),
    created () {
    },
    mounted () {
        this.$nextTick(() =>{
            this.h = this.$refs.viewer.offsetHeight + 'px'
            this.pdf = new Pdf({
                urlOrFile: this.urlOrFile,
                target: '#viewerContainer',
                renderer: 'svg',
                debug: true
            })
            // 生命周期创建完成(pdf创建完成)
            this.pdf.onload(() => {
                this.pdf.on('pagesinit', () => {
                    setTimeout(function () {
                        document.querySelector('#viewerContainer').scrollTo(0,0)
                    },600)
                },true)
            })
            console.log(this.pdf);
            // console.log();
        })
        // this.setUrl(this.urlOrFile)
    },
    methods: {
         // 初始化pdf
        setUrl(urlOrFile) {
            
        },
        // 生成canvas
        setCanvans(i) {
            
        },
    },
    beforeDestroy() {
        // this.pdfDocument.destroy()
    }
}
</script>
<style scoped>
    .nav-wrap {
        width: 100%;
        height: 45px;
        position: fixed;
        top: 0;
        left: 0;
        background-color: #fff;
        z-index: 2;
        display: flex;
    }
    .nav-wrap .back {
        width: 15%;
        height: 100%;
        display: flex;
        justify-content: center;
    }
    .nav-wrap .back svg {
        width: 20px;
        height: 100%;
    }
    .nav-wrap .content {
        width: 70%;
    }
    .nav-wrap .more {
        width: 15%;
        height: 100%;
        display: flex;
        justify-content: center;
    }
    .nav-wrap .more svg {
        width: 30px;
        height: 100%;
    }
    #pdfViewer {
        position: relative;
        display: flex;
        margin: 0;
    }
    canvas {
        width: 100%;
    }
    .viewerContainer-main {
        height: 100%;
        position: relative;
        margin: 45px 0;
        box-sizing: border-box;
    }
    .max-pdf {
        width: 100%;
        height: 100vh;
        background-color: #f2f2ef;
        display: flex;
        flex-direction: column;
    }
    #viewerContainer {
        width: 100%;
        height: 100%;
        position: fixed;
        overflow: auto;
        top: 45px;
        bottom: 45px;
    }
    .bar-wrap {
        width: 100%;
        height: 45px;
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 2;
        background-color: rgb(43, 43, 43);
        box-shadow: 0 -0.2rem 0.5rem rgb(50 50 50 / 75%);
    }
    canvas {
        margin: auto;
        display: block;
    }
</style>