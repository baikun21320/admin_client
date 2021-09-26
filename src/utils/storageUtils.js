import store from 'store'
const USER_KEY = 'user_key'
/*
保存user
* */

export default {
    saveUser(User) {
        // localStorage.setItem(USER_KEY, JSON.stringify(User))
        store.set(USER_KEY,User)
    },

    getUSer() {
        // return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
        return store.get(USER_KEY) || {}
    },
    removeUser() {
        // localStorage.removeItem(USER_KEY)
        store.remove(USER_KEY)
    }
}
