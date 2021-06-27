# pdf_preview

> 介绍： pdf文件预览器，不支持编辑，基于pdfjs-dist。


### 一、安装


```
npm install pdf_preview
```

## 使用

> 使用情景不一样给出了不一样的用法：

- [简单预览（vue方式）](#简单预览)： 只是渲染出来，不做任何操作。那么就可以考虑下canvas方式渲染。
- [自定义ui（全部）](#自定义ui)： 如果自定义ui界面的，只要提供方法就好，那么可以考虑直接引入
- [移动端ui（vue）](#移动端ui)： 如果是移动端且使用好的的ui界面

### 简单预览

> 可以根据源码来进行制作

**使用**

```html
<template>
  <div class="home">
    <pdf-browserify :urlOrFile="urlOrFile"></pdf-browserify>
  </div>
</template>

<script>
import pdfBrowserify from 'pdf_preview/src/browserify';
export default {
  name: 'Home',
  components: {
    pdfBrowserify
  },
  created() {
  },
  data() {
    return {
      urlOrFile: '/compressed.tracemonkey-pldi-09.pdf'
    }
  }
}
</script>
```


### 自定义ui

> 通过方法或者属性进行。[其他的方法或属性点击我](#pdf 使用说明)

#### 二、引入

```js
import 'pdf_preview/legacy/web/pdf_viewer.css';
import  PdfPreview from 'pdf_preview'
```

#### 三、实例化

```html
<div id="viewerContainer" style="width: 100%;height: 600px"></div>
```

```js
var urlOrFile = `data:application/pdf;base64,JVBERi0xLjMNCiXi48/TDQoNCjEgMCBvYmoNCjw8DQovVHlwZSAvQ2F0YWxvZw0KL091dGxpbmVzIDIgMCBSDQovUGFnZXMgMyAwIFINCj4+DQplbmRvYmoNCg0KMiAwIG9iag0KPDwNCi9UeXBlIC9PdXRsaW5lcw0KL0NvdW50IDANCj4+DQplbmRvYmoNCg0KMyAwIG9iag0KPDwNCi9UeXBlIC9QYWdlcw0KL0NvdW50IDINCi9LaWRzIFsgNCAwIFIgNiAwIFIgXSANCj4+DQplbmRvYmoNCg0KNCAwIG9iag0KPDwNCi9UeXBlIC9QYWdlDQovUGFyZW50IDMgMCBSDQovUmVzb3VyY2VzIDw8DQovRm9udCA8PA0KL0YxIDkgMCBSIA0KPj4NCi9Qcm9jU2V0IDggMCBSDQo+Pg0KL01lZGlhQm94IFswIDAgNjEyLjAwMDAgNzkyLjAwMDBdDQovQ29udGVudHMgNSAwIFINCj4+DQplbmRvYmoNCg0KNSAwIG9iag0KPDwgL0xlbmd0aCAxMDc0ID4+DQpzdHJlYW0NCjIgSg0KQlQNCjAgMCAwIHJnDQovRjEgMDAyNyBUZg0KNTcuMzc1MCA3MjIuMjgwMCBUZA0KKCBBIFNpbXBsZSBQREYgRmlsZSApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY4OC42MDgwIFRkDQooIFRoaXMgaXMgYSBzbWFsbCBkZW1vbnN0cmF0aW9uIC5wZGYgZmlsZSAtICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNjY0LjcwNDAgVGQNCigganVzdCBmb3IgdXNlIGluIHRoZSBWaXJ0dWFsIE1lY2hhbmljcyB0dXRvcmlhbHMuIE1vcmUgdGV4dC4gQW5kIG1vcmUgKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA2NTIuNzUyMCBUZA0KKCB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDYyOC44NDgwIFRkDQooIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNjE2Ljg5NjAgVGQNCiggdGV4dC4gQW5kIG1vcmUgdGV4dC4gQm9yaW5nLCB6enp6ei4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNjA0Ljk0NDAgVGQNCiggbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDU5Mi45OTIwIFRkDQooIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNTY5LjA4ODAgVGQNCiggQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA1NTcuMTM2MCBUZA0KKCB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBFdmVuIG1vcmUuIENvbnRpbnVlZCBvbiBwYWdlIDIgLi4uKSBUag0KRVQNCmVuZHN0cmVhbQ0KZW5kb2JqDQoNCjYgMCBvYmoNCjw8DQovVHlwZSAvUGFnZQ0KL1BhcmVudCAzIDAgUg0KL1Jlc291cmNlcyA8PA0KL0ZvbnQgPDwNCi9GMSA5IDAgUiANCj4+DQovUHJvY1NldCA4IDAgUg0KPj4NCi9NZWRpYUJveCBbMCAwIDYxMi4wMDAwIDc5Mi4wMDAwXQ0KL0NvbnRlbnRzIDcgMCBSDQo+Pg0KZW5kb2JqDQoNCjcgMCBvYmoNCjw8IC9MZW5ndGggNjc2ID4+DQpzdHJlYW0NCjIgSg0KQlQNCjAgMCAwIHJnDQovRjEgMDAyNyBUZg0KNTcuMzc1MCA3MjIuMjgwMCBUZA0KKCBTaW1wbGUgUERGIEZpbGUgMiApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY4OC42MDgwIFRkDQooIC4uLmNvbnRpbnVlZCBmcm9tIHBhZ2UgMS4gWWV0IG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA2NzYuNjU2MCBUZA0KKCBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY2NC43MDQwIFRkDQooIHRleHQuIE9oLCBob3cgYm9yaW5nIHR5cGluZyB0aGlzIHN0dWZmLiBCdXQgbm90IGFzIGJvcmluZyBhcyB3YXRjaGluZyApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY1Mi43NTIwIFRkDQooIHBhaW50IGRyeS4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA2NDAuODAwMCBUZA0KKCBCb3JpbmcuICBNb3JlLCBhIGxpdHRsZSBtb3JlIHRleHQuIFRoZSBlbmQsIGFuZCBqdXN0IGFzIHdlbGwuICkgVGoNCkVUDQplbmRzdHJlYW0NCmVuZG9iag0KDQo4IDAgb2JqDQpbL1BERiAvVGV4dF0NCmVuZG9iag0KDQo5IDAgb2JqDQo8PA0KL1R5cGUgL0ZvbnQNCi9TdWJ0eXBlIC9UeXBlMQ0KL05hbWUgL0YxDQovQmFzZUZvbnQgL0hlbHZldGljYQ0KL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcNCj4+DQplbmRvYmoNCg0KMTAgMCBvYmoNCjw8DQovQ3JlYXRvciAoUmF2ZSBcKGh0dHA6Ly93d3cubmV2cm9uYS5jb20vcmF2ZVwpKQ0KL1Byb2R1Y2VyIChOZXZyb25hIERlc2lnbnMpDQovQ3JlYXRpb25EYXRlIChEOjIwMDYwMzAxMDcyODI2KQ0KPj4NCmVuZG9iag0KDQp4cmVmDQowIDExDQowMDAwMDAwMDAwIDY1NTM1IGYNCjAwMDAwMDAwMTkgMDAwMDAgbg0KMDAwMDAwMDA5MyAwMDAwMCBuDQowMDAwMDAwMTQ3IDAwMDAwIG4NCjAwMDAwMDAyMjIgMDAwMDAgbg0KMDAwMDAwMDM5MCAwMDAwMCBuDQowMDAwMDAxNTIyIDAwMDAwIG4NCjAwMDAwMDE2OTAgMDAwMDAgbg0KMDAwMDAwMjQyMyAwMDAwMCBuDQowMDAwMDAyNDU2IDAwMDAwIG4NCjAwMDAwMDI1NzQgMDAwMDAgbg0KDQp0cmFpbGVyDQo8PA0KL1NpemUgMTENCi9Sb290IDEgMCBSDQovSW5mbyAxMCAwIFINCj4+DQoNCnN0YXJ0eHJlZg0KMjcxNA0KJSVFT0YNCg==`
var pdf = new PdfPreview({
    urlOrFile: urlOrFile,
    target: '#viewerContainer',
})
// 生命周期创建完成(pdf创建完成)
pdf.onload(() => {
    this.title = pdf.getTitle;
    pdf.on("pagesinit",  () => {
        // 初始化才能获取到总页数
        console.log(pdf.pagesCount)
    })
    pdf.on("pagechanging", (evt) => {
        console.log(evt.pageNumber) // 当前滑动第几页
    }, true)
})
```

### 移动端ui

> 目前还不完善，请使用上面的实例化对象。但是简单的还是可以使用的

**使用**

```html
<template>
  <div class="home">
    <pdf-preview3 :urlOrFile="urlOrFile"></pdf-preview3>
  </div>
</template>

<script>
import pdfPreview3 from 'pdf_preview/src/mobile.vue';
export default {
  name: 'Home',
  components: {
    pdfPreview3
  },
  data() {
    return {
      urlOrFile: '/compressed.tracemonkey-pldi-09.pdf'
    }
  },
  methods: {
  }
}
</script>
<style scoped></style>
```

# pdf 使用说明

### 实例化对象

> 语法：  new PdfPreview(options)

**options参数：**

|  属性   | 类型 | 说明  |
|  ----  | ----  | ----  |
|  urlOrFile | string 或者 fileObject | （必须传） |
| target | string 或者 HTMLElementDom | （必须传） |
| cMapUrl | string | （自选）加载需要的cmaps 文件，默认是从 https://cdn.jsdelivr.net/npm/pdfjs-dist@2.8.335/cmaps/加载的，你也可以自定义请求的地址 |
| cMapPacked | Boolean | （自选）默认为 true |
| renderer | string | （自选）默认为 canvas 。 你可以选择： 'canvas' 或者 'svg' |
| textLayerMode | Number | (自选) 默认2。0为禁止复制文本内容。 |

### onload(function) 方法

> 通过实例化后，此方法能够知道pdf对象加载完成。

```js
var pdf = new PdfPreview({
    urlOrFile: 'https://xxx.xx/xxx.pdf',
    target: '#viewerContainer', // dom 对象
})
// 生命周期创建完成(pdf创建完成)
pdf.onload(() => {
    console.log('创建完成')
    // 必须在此处写pdf 操作逻辑了
})
```

### 监听事件

> 语法： pdf.on('eventName', function , [Boolean])

```js
var pdf = new PdfPreview({
    urlOrFile: 'https://xxx.xx/xxx.pdf',
    target: '#viewerContainer', // dom 对象
})
// 生命周期创建完成(pdf创建完成)
pdf.onload(() => {
    pdf.on('pagesinit', () => {
        console.log('pdf初始化完成')
    })
})
/**
 * 下面是所支持的事件了
 * eventBus._on("resize", webViewerResize);
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
*/
```

### 进度方法

> 语法糖：  onProgress(function)

```js
var pdf = new PdfPreview({
    urlOrFile: 'https://xxx.xx/xxx.pdf',
    target: '#viewerContainer', // dom 对象
})
// 生命周期创建完成(pdf创建完成)
pdf.onload(() => {
    pdf.onProgress( (progress, progressData) => {
        console.log( progress + '%')
        console.log(progressData)
    })
})
```

## 待支持

- 查找文本内容
- 键盘支持
- 全屏预览
- 国际化
- 打印







MIT License

Copyright (c) 2021 LaoCheng-cjs

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

