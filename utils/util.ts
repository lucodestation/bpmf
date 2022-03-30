const util = {}

// 验证手机号，验证通过返回 true，否则返回 false
util.validateMobile = (mobile) => (/^1[3456789]\d{9}$/.test(mobile) ? true : false)

// 获取扩展名，例 aaa.bbb.ccc.png 返回 png，aaa 返回 undefined，.gitignore 返回 gitignore
util.getExtensionName = (fileName) => {
  const arr = fileName.split('.')
  // console.log('获取扩展名', arr)
  if (!fileName.includes('.')) {
    // console.log('文件名有误')
    return
  } else {
    console.log('返回扩展名', arr[arr.length - 1])
    return arr[arr.length - 1]
  }
}

/**
 * 上传（单个）文件
 * @param option <object>
 * @param option.fileName <string> 文件名
 * @param option.file <file> 要上传的文件
 * @returns
 */
util.uploadFile = (option) => {
  return new Promise(async (resolve, reject) => {
    // 获取阿里云sts_token
    const OSSInfo = await request({
      url: '/api/common/sts_token',
    }).catch((error) => {
      reject(error)
    })
    if (!OSSInfo) return
    console.log('OSSInfo', OSSInfo)

    const client = new OSS({
      // yourRegion填写Bucket所在地域。以华东1（杭州）为例，yourRegion填写为oss-cn-hangzhou。
      region: 'oss-cn-beijing',
      'Content-Disposition': 'inline',
      // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
      accessKeyId: OSSInfo.data.AccessKeyId,
      accessKeySecret: OSSInfo.data.AccessKeySecret,
      // 从STS服务获取的安全令牌（SecurityToken）。
      stsToken: OSSInfo.data.SecurityToken,
      // 填写Bucket名称。
      bucket: 'bpmf',
      secure: true,
    })

    const fileName = new Date().valueOf() + '-' + option.fileName
    console.log(fileName)

    const headers = {
      // 指定该Object被下载时网页的缓存行为。
      // 'Cache-Control': 'no-cache',
      // 指定该Object被下载时的名称。
      // 'Content-Disposition': 'inline',
      // 指定该Object被下载时的内容编码格式。
      // 'Content-Encoding': 'UTF-8',
      // 指定过期时间。
      // 'Expires': 'Wed, 08 Jul 2022 16:57:01 GMT',
      // 指定Object的存储类型。
      // 'x-oss-storage-class': 'Standard',
      // 指定Object的访问权限。
      // 'x-oss-object-acl': 'private',
      // 设置Object的标签，可同时设置多个标签。
      // 'x-oss-tagging': 'Tag1=1&Tag2=2',
      // 指定CopyObject操作时是否覆盖同名目标Object。此处设置为true，表示禁止覆盖同名Object。
      // 'x-oss-forbid-overwrite': 'true',
    }

    client
      .put('images/' + fileName, option.file, { headers })
      .then(() => {
        let url = `https://bpmf.oss-cn-beijing.aliyuncs.com/images/${fileName}`
        resolve(url)
      })
      .catch((error) => {
        console.log('上传失败', error)
        reject(error)
      })
  })
}

/**
 * 上传（多个）文件
 * @param option <array[object]>
 * @param option[n] <object>
 * @param option[n].fileName <string>
 * @param option[n].file <file>
 * @returns
 */
util.uploadMultipleFile = async (option) => {
  // 获取阿里云sts_token
  const OSSInfo = await request({
    url: '/api/common/sts_token',
  }).catch((error) => {
    reject(error)
  })
  if (!OSSInfo) return
  console.log('OSSInfo', OSSInfo)

  const client = new OSS({
    // yourRegion填写Bucket所在地域。以华东1（杭州）为例，yourRegion填写为oss-cn-hangzhou。
    region: 'oss-cn-beijing',
    // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
    accessKeyId: OSSInfo.data.AccessKeyId,
    accessKeySecret: OSSInfo.data.AccessKeySecret,
    // 从STS服务获取的安全令牌（SecurityToken）。
    stsToken: OSSInfo.data.SecurityToken,
    // 填写Bucket名称。
    bucket: 'bpmf',
  })

  const arr = option.map((item) => {
    return new Promise(async (resolve, reject) => {
      const fileName = new Date().valueOf() + '-' + item.fileName

      const headers = {
        // 指定该Object被下载时网页的缓存行为。
        // 'Cache-Control': 'no-cache',
        // 指定该Object被下载时的名称。
        // 'Content-Disposition': 'inline',
        // 指定该Object被下载时的内容编码格式。
        // 'Content-Encoding': 'UTF-8',
        // 指定过期时间。
        // 'Expires': 'Wed, 08 Jul 2022 16:57:01 GMT',
        // 指定Object的存储类型。
        // 'x-oss-storage-class': 'Standard',
        // 指定Object的访问权限。
        // 'x-oss-object-acl': 'private',
        // 设置Object的标签，可同时设置多个标签。
        // 'x-oss-tagging': 'Tag1=1&Tag2=2',
        // 指定CopyObject操作时是否覆盖同名目标Object。此处设置为true，表示禁止覆盖同名Object。
        // 'x-oss-forbid-overwrite': 'true',
      }

      client
        .put('images/' + fileName, item.file, { headers })
        .then(() => {
          let url = `https://bpmf.oss-cn-beijing.aliyuncs.com/images/${fileName}`
          resolve(url)
        })
        .catch((error) => {
          console.log('上传失败', error)
          reject(error)
        })
    })
  })

  const result = await Promise.all(arr)
  console.log(result)
  return result
}

//公钥.
const publiukey =
  '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCSjs8JJr/Nyb+nOG77agUDf7uTc+kswdVEXbU8v5EL98brAw7fu4dQc1vkh1KSXqiC9EC7YmJzkkFoXUzTH2pvvDlqUuCwtdmXOsq/b1JWKyEXzQlPIiwdHnAUjGbmHOEMAY3jKEy2dY2I6J+giJqo8B2HNoR+zv3KaEmPSHtooQIDAQAB-----END PUBLIC KEY-----'
