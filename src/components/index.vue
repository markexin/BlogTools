<template>
  <div class="edit-body">
    <Modal
        v-model="status"
        title="确认信息"
        @on-ok="ok"
        @on-cancel="cancel">
        <Input v-model="title" placeholder="标题" class="model-input"></Input>
        <Upload action="/api/upload" name="upload" :on-success="uploadSuccess" ref="uploadList">
            <Button type="primary" icon="ios-cloud-upload-outline">上传图片</Button>
        </Upload>
        <Input v-model="cover" placeholder="封面大图地址" class="model-input"></Input>
        <p>
          {{ uploadName }}
        </p>
        <p class="model-title">文章类型：{{ type }}</p>
        <RadioGroup v-model="type" type="button" size="large">
            <Radio label="文章"></Radio>
            <Radio label="感悟"></Radio>
            <Radio label="小说"></Radio>
            <Radio label="宝贝"></Radio>
        </RadioGroup>
    </Modal>
    <MarkDown @on-save="show($event)" :height="768" :autoSave="false"/>
  </div>
</template>

<script>
import MarkDown from 'vue-meditor'
export default {

  data () {

    return {

      title: "",
      json: {},
      status: false,
      cover: "",
      type: "",
      uploadName: ""

    }

  },

  components: {
    MarkDown
  },

  methods: {

    uploadSuccess (response, file, fileList) {
      
      // 上传
      this.uploadName = `![img](/images/${ file.name })`;

    },

    ok () {

      let text = this.json.htmlValue;
      let type = this.type;
      let title = this.title;
      let cover = this.cover;
      axios.post('/api/update', { 
        text: text, 
        type: type,
        cover: cover,
        title: title
      }).then(res => {

        this.$Message.success('文章创建成功！');
        this.title = "";
        this.type = "";
        this.cover = "";
        this.status = false;
        this.json = {};
      })

    },

    cancel () {

      this.type = "";
      this.uploadName = "";
      this.$refs.uploadList.clearFiles();

    },

    show (json) {
      
      this.status = !this.status;
      this.json = json;
      
    }

  }

}

</script>

<style>
  .model-input {
    margin-bottom: 10px;
  }
  .model-title {
    font-size: 18px;
    margin-bottom: 10px;
    font-weight: bold;
  }
  .edit > textarea {
    width: 100%;
    height: 100%;
    border: none;
    background: #000;
    color: #fff;
    resize: none;
    outline:none;
    font-size: 18px;
  }
  html, body, #app {
    height: 100%;
  }
  .edit-body {
    height: 100%;
    display: flex;
  }
  .edit-body > div {
    flex: 1;
    width: 50%;
  }
  .edit-body > div:nth-child(1) {
    border-right: 1px solid #eee;
  }
</style>