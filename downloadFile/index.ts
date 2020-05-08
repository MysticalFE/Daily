import axios from 'axios';

/**
 * 
 * @param params 
 * api
 */
function download(params: any) {
  return axios.post('url', params), {
    responseType: 'blob'
  }
}

/**
 * 下载
 */
async function export() {
  const formDate = new FormData();
  formDate.append("xxx", "xxx");
  const res = await download(formDate);
  blobToText(res.data).then(result => {
    console.error(result.message)
  }).catch(e => {
    downloadFile(res)
  })
}

/**
 * 
 * @param res 
 * 
 */
function downloadFile(res: any) {
  const title = decodeURIComponent(res.headers['content-disposition'].split(';')[1].split('=')[1]);
  const blob = new Blob([res.data]);

  //csv文件打开中文报错时，采用以下方案
  // const blob = new Blob(['\ufeff' + res.data], {
  //   type: 'text/csv;chartset=utf-8'
  // })
  const downloadUrl = URL.createObjectURL(blob);

  let a = document.createElement('a');
  a.style.display = 'none';
  a.href = downloadUrl;
  a.setAttribute('download', title);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * 
 * @param blob 
 * blob 当接口报错时,会生成text文件，此时读取text文件拦截下载文件流,处理异常
 */
function blobToText(blob: Blob): Promise<File | Blob> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsText(blob);
    fileReader.onload = function() {
      try { 
        const result = JSON.parse(this.result);
        if(result && result.code !== 200) {
          resolve(result)
        } else {
          reject()
        }
      } catch(e) {
        reject()
      }
    }
  })
}