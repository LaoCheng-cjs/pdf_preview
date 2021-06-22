<template>
    <div class="max-pdf">
        <!-- 导航 -->
        <div class="nav-wrap">
            <!-- 返回 -->
            <div class="back"><svg t="1624288134702" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4089" width="200" height="200"><path d="M748.8 160 390.4 512l358.4 352c19.2 19.2 19.2 57.6 0 76.8-19.2 19.2-57.6 19.2-76.8 0L281.6 556.8c0 0-6.4 0-6.4-6.4C262.4 544 256 524.8 256 512c0-12.8 6.4-32 19.2-38.4 0 0 6.4 0 6.4-6.4l390.4-390.4c19.2-19.2 57.6-19.2 76.8 0C774.4 102.4 774.4 134.4 748.8 160z" p-id="4090"></path></svg></div>
            <div class="content">{{title}}</div>
            <div class="more"><svg t="1624287372069" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3272" width="200" height="200"><path d="M197.844997 512m-74.694189 0a72.993 72.993 0 1 0 149.388379 0 72.993 72.993 0 1 0-149.388379 0Z" p-id="3273"></path><path d="M512 512m-74.694189 0a72.993 72.993 0 1 0 149.388379 0 72.993 72.993 0 1 0-149.388379 0Z" p-id="3274"></path><path d="M826.155003 512m-74.694189 0a72.993 72.993 0 1 0 149.388379 0 72.993 72.993 0 1 0-149.388379 0Z" p-id="3275"></path></svg></div>
        </div>
        <div class="viewerContainer-main" ref="viewer">
            <div id="viewerContainer" :style="{height: h}">
                <div id="viewer" class="pdfViewer"></div>
            </div>
        </div>
        <div class="bar-wrap" v-show="isInitPage">
            <div @click="previous">
                <svg t="1624373561453" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1035" width="200" height="200"><path d="M480.1 291.4c-0.8 0.6-1.7 1.4-2.5 2.1L82.7 654c-21.5 19.6-23 52.9-3.4 74.4 19.6 21.5 52.9 23 74.4 3.4l359.8-328.3 358.8 328.6c21.4 19.6 54.7 18.2 74.4-3.3 19.6-21.4 18.2-54.7-3.3-74.4L549.1 293.3c-19.6-18-49.1-18.3-69-1.9z" fill="" p-id="1036"></path></svg>
            </div>
            <div @click="next">
                <svg t="1624373583085" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1182" width="200" height="200"><path d="M549.1 732.1L943.4 371c21.5-19.7 22.9-53 3.3-74.4-19.7-21.5-53-22.9-74.4-3.3L513.5 621.9 153.7 293.6c-21.5-19.6-54.8-18.1-74.4 3.4-19.6 21.5-18.1 54.8 3.4 74.4l394.9 360.5c0.8 0.7 1.7 1.5 2.5 2.1 19.9 16.4 49.4 16.1 69-1.9z" fill="" p-id="1183"></path></svg>
            </div>
            <div class="ipt">
                <input type="text" v-model.trim="num">/{{pagesCount}}
            </div>
            <div @click="zoomIn">
                <svg t="1624373737127" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1188" width="200" height="200"><path d="M943.8 892.5l-201.4-201c24.2-29 43.9-61.3 58.7-96.3 20-47.3 30.1-97.6 30.1-149.4s-10.1-102-30.1-149.4c-19.3-45.7-47-86.7-82.1-122-35.2-35.2-76.2-62.9-121.9-82.2-47.3-20-97.5-30.2-149.3-30.2-51.8 0-102 10.2-149.3 30.2-45.7 19.3-86.7 47-121.9 82.2s-62.8 76.3-82.1 122c-20 47.3-30.1 97.6-30.1 149.4s10.1 102 30.1 149.4c19.3 45.7 47 86.7 82.1 122 35.2 35.2 76.2 62.9 121.9 82.2 47.3 20 97.5 30.2 149.3 30.2 51.7 0 102-10.2 149.3-30.2 34.6-14.7 66.6-34.1 95.3-58l201.5 201c6.9 6.9 15.9 10.3 24.9 10.3 9.1 0 18.1-3.5 25-10.4 13.8-13.7 13.8-36.1 0-49.8zM669.7 666.6c-0.4 0.4-0.8 0.7-1.2 1.1-0.3 0.3-0.6 0.6-0.8 0.9-59 58.3-137 90.4-219.9 90.4-83.5 0-162.1-32.6-221.2-91.7-59.1-59.1-91.6-137.8-91.6-221.4s32.5-162.3 91.6-221.4c59.1-59.1 137.6-91.7 221.2-91.7s162.1 32.6 221.2 91.7c59.1 59.1 91.6 137.8 91.6 221.4 0 83.3-32.3 161.6-90.9 220.7z" p-id="1189"></path><path d="M573.7 419H473v-98c0-19.5-13-35.3-32.5-35.3S408 301.5 408 321v98H305.3c-19.5 0-35.3 13-35.3 32.5s15.8 32.5 35.3 32.5H408v105.4c0 19.5 13 35.3 32.5 35.3s32.5-15.8 32.5-35.3V484h100.7c19.5 0 35.3-13 35.3-32.5S593.2 419 573.7 419z" p-id="1190"></path></svg>
            </div>
            <div @click="zoomOut">
                <svg t="1624373723751" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1034" width="200" height="200"><path d="M946.9 897.7L744 695.2c24.4-29.2 44.2-61.7 59.1-97 20.2-47.7 30.4-98.3 30.4-150.5s-10.2-102.8-30.4-150.5c-19.5-46-47.3-87.4-82.8-122.9s-76.8-63.4-122.8-82.8c-47.7-20.2-98.3-30.4-150.4-30.4S344.4 71.3 296.8 91.5c-46 19.5-87.3 47.4-122.8 82.8-35.5 35.5-63.3 76.8-82.8 122.9-20.2 47.7-30.4 98.3-30.4 150.5S71 550.5 91.2 598.2c19.5 46 47.3 87.4 82.8 122.9s76.8 63.4 122.8 82.8c47.7 20.2 98.3 30.4 150.4 30.4s102.7-10.2 150.4-30.4c34.9-14.8 67.1-34.4 96.1-58.5l203 202.6c6.9 6.9 16 10.4 25.1 10.4 9.1 0 18.2-3.5 25.2-10.5 13.8-13.8 13.8-36.3-0.1-50.2zM447.2 763.2c-84.2 0-163.3-32.8-222.8-92.4C164.8 611.2 132 532 132 447.7c0-84.3 32.8-163.5 92.3-223.1 59.5-59.6 138.7-92.4 222.8-92.4s163.3 32.8 222.8 92.4c59.5 59.6 92.3 138.8 92.3 223.1 0 83.9-32.5 162.8-91.6 222.3-0.4 0.4-0.8 0.8-1.2 1.1-0.3 0.3-0.6 0.6-0.8 0.9-59.3 58.9-137.9 91.2-221.4 91.2z" p-id="1035"></path><path d="M574 416H303.7c-19.7 0-35.6 12.8-35.6 32.5S284 481 303.7 481H574c19.7 0 35.6-12.8 35.6-32.5S593.7 416 574 416z" p-id="1036"></path></svg>
            </div>
        </div>
        <!-- <canvas class="can" v-for="(item, index) in pdfDocument.numPages" :key="index" ></canvas> -->
    </div>
</template>
<script>
import 'pdf_preview/legacy/web/pdf_viewer.css';
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
        title: '',
        h: '',
        pdfDocument: {
            numPages: 0
        },
        num: 1,
        pagesCount: 0,
        isInitPage: false
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
                this.title = this.pdf.getTitle;
                this.pdf.on("pagesinit",  () => {
                    this.isInitPage = true;
                    // 初始化才能获取到总页数
                    this.pagesCount = this.pdf.pagesCount
                })
            })
            // console.log();
        })
        // this.setUrl(this.urlOrFile)
    },
    methods: {
        // 缩小
        zoomIn() {
            this.pdf.zoomIn()
        },
        // 放大
        zoomOut() {
            this.pdf.zoomOut()
        },
        // 上一张
        previous() {
            this.pdf.page--
        },
        // 下一张
        next() {
            this.pdf.page++
        }
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
    #viewerContainer /deep/ .page {
        margin: var(--page-margin);
        position: relative;
        overflow: visible;
        border: var(--page-border);
        background-clip: content-box;
        /* border-image: url(images/shadow.png) 9 9 repeat; */
        background-color: rgba(255, 255, 255, 1);
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
        display: flex;
    }
    canvas {
        margin: auto;
        display: block;
    }
    .bar-wrap div {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .bar-wrap svg {
        width: 23px;
        fill: #afafaf;
        height: auto;
    }
    .bar-wrap .ipt {
        color: #fff;
        font-size: 12px;
    }
    .bar-wrap .ipt input {
        width: 24px;
        background: transparent;
        border: none;
        outline: none;
        border: 1px solid #333;
        margin-right: 6px;
        padding: 2px 6px;
        color: #fff;
        font-size: 12px;
    }
</style>