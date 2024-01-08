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
            products: [], //全部品項
            price: ""
        }
    },
    created() {
        if (this.pathname === '/2023VUE_HW2/admin.html' && this.hasCookie === false) {
            location.href = 'index.html';
        }
        if (this.hasCookie === true) {
            this.render();
        }
    },
    methods: {
        del(id) {
            const token = document.cookie.replace(
                /(?:(?:^|.*;\s*)mycookieTest\s*\=\s*([^;]*).*$)|^.*$/,
                "$1",
            );
            // axios.defaults.headers.common['Authorization'] = token; //意思是下次發axios請求時，會把token以headers一起發送。
            axios
                .delete(`https://ec-course-api.hexschool.io/v2/api/joooker/admin/product/${id}`, null, {
                    headers: {
                        Authorization: token,
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.hasCookie = res.data.success;
                        this.render();
                        alert('已刪除');
                    }
                }).catch((error) => {
                    console.log(error);
                })
        },
        put() {
            const token = document.cookie.replace(
                /(?:(?:^|.*;\s*)mycookieTest\s*\=\s*([^;]*).*$)|^.*$/,
                "$1",
            );
            // axios.defaults.headers.common['Authorization'] = token; //意思是下次發axios請求時，會把token以headers一起發送。
            axios
                .put('https://ec-course-api.hexschool.io/v2/api/joooker/admin/product/-NncLB5id_f-nGggRANc', {
                    data: {
                        "title": "[修改]joooker小丑聯名",
                        "category": "衣服999",
                        "origin_price": 3000,
                        "price": this.price,
                        "unit": "個",
                        "description": "joooker put名設計師設計",
                        "content": "第二次聯名",
                        "is_enabled": 0,
                        "imageUrl": "https://picsum.photos/id/23/200/300",
                        "imagesUrl": [
                            "https://picsum.photos/id/24/200/300",
                            "https://picsum.photos/id/25/200/300",
                            "https://picsum.photos/id/26/200/300",
                            "https://picsum.photos/id/27/200/300",
                            "https://picsum.photos/id/28/200/300"
                        ]
                    }
                }, {
                    headers: {
                        Authorization: token,
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.hasCookie = res.data.success;
                        this.render();
                        alert('已更改');
                    }
                }).catch((error) => {
                    console.log(error);
                })
        },
        post() {
            const token = document.cookie.replace(
                /(?:(?:^|.*;\s*)mycookieTest\s*\=\s*([^;]*).*$)|^.*$/,
                "$1",
            );
            axios.defaults.headers.common['Authorization'] = token; //意思是下次發axios請求時，會把token以headers一起發送。
            let math = Math.floor(Math.random() * 50) + 1;
            axios
                .post('https://ec-course-api.hexschool.io/v2/api/joooker/admin/product', {
                    data: {
                        "title": "[賣]joooker聯名大學T",
                        "category": "大學T",
                        "origin_price": 700,
                        "price": 500,
                        "unit": "個",
                        "description": "joooker 名設計師設計",
                        "content": "第十次聯名",
                        "is_enabled": 1,
                        "imageUrl": `https://picsum.photos/id/${math}/200/300`,
                        "imagesUrl": [
                            `https://picsum.photos/id/${math + 10}/200/300`,
                            `https://picsum.photos/id/${math + 20}/200/300`,
                            `https://picsum.photos/id/${math + 30}/200/300`,
                            `https://picsum.photos/id/${math + 40}/200/300`,
                            `https://picsum.photos/id/${math + 50}/200/300`
                        ]
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.hasCookie = res.data.success;
                        this.render();
                        alert('已新增');
                    }
                }).catch((error) => {
                    console.log(error);
                })
        },
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
            if (document.cookie.includes('mycookieTest') === false) {
                alert('未驗證');
            }
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
                    }
                }).catch((error) => {
                    console.log(error);
                })
        },
        render() {
            const token = document.cookie.replace(
                /(?:(?:^|.*;\s*)mycookieTest\s*\=\s*([^;]*).*$)|^.*$/,
                "$1",
            );
            axios.defaults.headers.common['Authorization'] = token; //意思是下次發axios請求時，會把token以headers一起發送。
            axios
                .get('https://ec-course-api.hexschool.io/v2/api/joooker/admin/products')
                .then((res) => {
                    console.log(res.data.products);
                    this.products = res.data.products;
                })
                .catch((error) => {
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