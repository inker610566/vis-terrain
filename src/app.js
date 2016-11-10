var Vue = require('vue');
var VueRouter = require('vue-router');
Vue.use(VueRouter);

var router = new VueRouter({
    routes: [
        {
            path: '/',
            redirect: 'offline'
        },
        {
            path: '/offline',
            component: require('./components/main_offline.vue'),
            name: 'offline'
        }
    ]
});

//new Vue(require('./components/app.vue')).$mount('#app');
new Vue({
    router: router,
}).$mount('#app');
