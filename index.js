import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

createApp({
    data() {
        return {
            pathname: window.location.pathname, //當前路徑
            hasCookie: document.cookie.includes('mycookieTest'), //是否有cookie
            userInfo: { //帳號密碼
                username: '',
                password: '',
            },
            userLogin: false, //是否登入
            userChoose: {}, //品項選擇
            products: [] //全部品項
        }
    },
    created() {
        console.log(this.hasCookie);
        console.log(this.pathname);
        if (this.pathname === '/admin.html' && this.hasCookie === false) {
            location.href = 'index.html';
        }
        if (this.hasCookie === true) {
            const token = document.cookie.replace(
                /(?:(?:^|.*;\s*)mycookieTest\s*\=\s*([^;]*).*$)|^.*$/,
                "$1",
            );
            axios.defaults.headers.common['Authorization'] = token; //意思是下次發axios請求時，會把token以headers一起發送。
            axios
                .get('https://ec-course-api.hexschool.io/v2/api/joooker/admin/products')
                .then((res) => {
                    this.products = res.data.products;
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    },
    methods: {
        login() {
            axios
                .post('https://ec-course-api.hexschool.io/v2/admin/signin', this.userInfo)
                .then((res) => {
                    const { token, expired } = res.data;
                    this.userLogin = res.data.success;
                    this.hasCookie = true;
                    document.cookie = `mycookieTest=${token};expires=${new Date(expired)};`;
                    location.href = 'admin.html';
                }).catch((error) => {
                    console.log(error);
                })

        },
        checkLogin() {
            // #3 取得 Token（Token 僅需要設定一次）
            const token = document.cookie.replace(
                /(?:(?:^|.*;\s*)mycookieTest\s*\=\s*([^;]*).*$)|^.*$/,
                "$1",
            );
            axios.defaults.headers.common['Authorization'] = token; //意思是下次發axios請求時，會把token以headers一起發送。

            axios
                .post('https://ec-course-api.hexschool.io/v2/api/user/check')
                .then((res) => {
                    if (res.data.success) {
                        this.hasCookie = res.data.success;
                        alert('已驗證');
                    } else {
                        alert('驗證');
                    }
                }).catch((error) => {
                    console.log(error);
                })
        },
        detail(item) {
            this.userChoose = item;
        }
    },
    computed: {
        chooseIsNull() {
            return Object.keys(this.userChoose).length !== 0;
        }
    }
}).mount('#app')