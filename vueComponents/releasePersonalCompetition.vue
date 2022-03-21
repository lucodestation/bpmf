<template>
  <div>
    <div>{{ competitionCateList }}</div>
  </div>
</template>

<script>
module.exports = {
  data: function () {
    return {
      // 赛事类型列表（从服务器获取）
      competitionCateList: [],
    }
  },
  mounted: function () {
    const that = this
    // 获取赛事类型列表
    request({
      url: '/api/Competition/get_category_list',
    }).then(function (result) {
      console.log('赛事类型列表', result)
      console.log(that)
      if (+result.code == 200) {
        that.competitionCateList = result.data
        console.log(that.competitionCateList)
      } else {
      }
    })
  },
  methods: {},
}
</script>

<style></style>
