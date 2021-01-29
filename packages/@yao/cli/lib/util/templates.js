const GITLAB_URL = "http://192.168.46.147:8089/root/";

const TEMPLATES = {
  gulp: {
    pc: "direct:" + GITLAB_URL + "gulp.git",
    h5: "direct:" + GITLAB_URL + "gulp-h5.git",
  },
  react: {
    "react-admin": "direct:" + GITLAB_URL + "react-antd-admin-template.git",
    "ts-vue-admin": "direct:" + GITLAB_URL + "vue-typescript-admin-template.git",
  },
  vue: {
    "vue-admin": "direct:" + GITLAB_URL + "vue-admin-template.git",
    "ts-vue-h5": "direct:" + GITLAB_URL + "mobile-web-best-practice.git",
  }
}

module.exports = TEMPLATES