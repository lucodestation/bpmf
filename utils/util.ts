const util = {}

// 获取扩展名，例 aaa.bbb.ccc.png 返回 png，aaa 返回 undefined，.gitignore 返回 gitignore
util.getExtensionName = (fileName) => {
  const arr = fileName.split('.')
  // console.log('获取扩展名', arr)
  if (!fileName.includes('.')) {
    // console.log('文件名有误')
    return
  } else {
    // console.log('返回扩展名', arr[arr.length - 1])
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
    })
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

    const fileName = new Date().valueOf() + '-' + option.fileName + '.' + util.getExtensionName(option.file.name)

    const result = await client.put(fileName, option.file).catch((error) => {
      console.log('上传失败', error)
      reject(error)
    })
    console.log(result)
    resolve(result)
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
  })
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
      const fileName = new Date().valueOf() + '-' + item.fileName + '.' + util.getExtensionName(item.file.name)

      const result = await client.put(fileName, item.file).catch((error) => {
        console.log('上传失败', error)
        reject(error)
      })
      console.log(result)
      resolve(result)
    })
  })

  const result = await Premise.all(arr)
  console.log(result)
  return result
}
