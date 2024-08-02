const workerScriptUrl = 'https://cdn.jsdelivr.net/npm/web-workers@0.9.1/dist/umd/index.min.js';

const workerBlob = new Blob([`importScripts('${workerScriptUrl}');`], { type: 'application/javascript' });
const workerUrl = URL.createObjectURL(workerBlob);
const rangeItem = document.getElementById('rangeItem');
const verifyDragWrap = document.getElementById('verifyDragWrap');
const arrowDrag = document.getElementById('arrowDrag');
const dragText = document.getElementById('dragText');
const worker = new Worker(workerUrl);
const timeNow = document.getElementById('timeNow');

worker.onmessage = function(event) {
    if (event.data === 'tick') {
        console.log('Worker tick');
    }
};
rangeItem.addEventListener('change', (e)=>{
    let dragitem = arrowDrag.computedStyleMap().get('width').value;
    let dragableArea = verifyDragWrap.computedStyleMap().get('width').value;
    if(e.target.value == 100){
        console.log('Done');
        dragText.innerText = '验证通过'
        dragText.style.color = 'green'
        setTimeout(()=>{
            dragText.style.color = '#a3a3a3'
            dragText.innerText = '向右滑动滑块完成验证'
            for (let i = e.target.value; i >= 0; i--) {
                let posX = i/100 * (dragableArea - dragitem)
                e.target.value = i
                arrowDrag.style.transform = `translateX(${posX}px)`
            }
        }, 2000)
    }else{
        dragText.innerText = '向右滑动滑块完成验证'
        for (let i = e.target.value; i >= 0; i--) {
            let posX = i/100 * (dragableArea - dragitem)
            setTimeout(()=>{
                e.target.value = i
                arrowDrag.style.transform = `translateX(${posX}px)`
            },100)
        }
    };
})
rangeItem.addEventListener('input', (e)=>{
    let dragitem = arrowDrag.getBoundingClientRect().width;
    let dragableArea = verifyDragWrap.getBoundingClientRect().width;
    let posX = e.target.value/100 * (dragableArea - dragitem)
    arrowDrag.style.transform = `translateX(${posX}px)`
})
function startWorker(timeEl) {
    i = 0
    worker.postMessage('start');
    setInterval(() => {
        timeEl.innerHTML = new Date().toLocaleTimeString()
        i ++
        console.log(i, 'now');
    }, 1000);
}

function stopWorker() {
    worker.postMessage('stop');
}

// Example usage
window.addEventListener('DOMContentLoaded', startWorker(timeNow));