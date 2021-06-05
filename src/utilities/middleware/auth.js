export default function (to, next, store) {
    if (!store.state.UserData.isLoggedIn) {
        next('/login')
    }else {
        next()
    }
}